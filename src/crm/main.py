"""
SwissRescueOmniMed CRM — FastAPI backend minimal
Stack : FastAPI + asyncpg + zlib (compression HL7)
LPD suisse : pseudonymisation + logs d'accès + effacement
"""
from fastapi import FastAPI, WebSocket, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import hashlib, zlib, uuid

from lpd import LPDMiddleware

app = FastAPI(title="SwissRescueOmniMed CRM", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])
app.add_middleware(LPDMiddleware)


# ── WebSocket manager ──────────────────────────────────────────────────────────

class WSManager:
    def __init__(self): self.active: list[WebSocket] = []
    async def connect(self, ws: WebSocket):
        await ws.accept(); self.active.append(ws)
    def disconnect(self, ws: WebSocket):
        if ws in self.active: self.active.remove(ws)
    async def broadcast(self, msg: dict):
        dead = []
        for ws in self.active:
            try: await ws.send_json(msg)
            except: dead.append(ws)
        for ws in dead: self.disconnect(ws)

ws_manager = WSManager()


# ── Schémas ───────────────────────────────────────────────────────────────────

class PatientIn(BaseModel):
    nom: str; prenom: str; date_naissance: str  # YYYY-MM-DD

class InterventionIn(BaseModel):
    patient_id: str; type: str; data: dict

class HL7In(BaseModel):
    patient_id: str; hl7_message: str


# ── Utilitaires ───────────────────────────────────────────────────────────────

LPD_SALT = "swissrescue-lpd-sel-2026"

def pseudonymize(nom: str, prenom: str, ddn: str) -> str:
    raw = f"{nom.upper().strip()}{prenom.upper().strip()}{ddn}{LPD_SALT}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def omega_compress_hl7(hl7: str) -> dict:
    raw = hl7.encode("utf-8")
    compressed = zlib.compress(raw, level=9)
    ratio = len(compressed) / len(raw)
    return {"compressed": compressed, "ratio": round(ratio, 4),
            "omega_rule_valid": ratio < 1.0}   # ⊢ ratio < 1.0


# ── DB dependency (à brancher sur asyncpg pool) ───────────────────────────────

async def get_db():
    raise NotImplementedError("Brancher asyncpg : asyncpg.create_pool(DSN)")


# ── Patients ──────────────────────────────────────────────────────────────────

@app.post("/patients", status_code=201)
async def create_patient(p: PatientIn, db=Depends(get_db)):
    pseudo = pseudonymize(p.nom, p.prenom, p.date_naissance)
    pid = str(uuid.uuid4())
    await db.execute("INSERT INTO patients(id,pseudonym) VALUES($1,$2)", pid, pseudo)
    return {"id": pid, "pseudonym": pseudo}

@app.get("/patients")
async def list_patients(db=Depends(get_db)):
    rows = await db.fetch("SELECT id,pseudonym,created_at FROM patients ORDER BY created_at DESC")
    return [dict(r) for r in rows]

@app.get("/patients/{pid}")
async def get_patient(pid: str, db=Depends(get_db)):
    row = await db.fetchrow("SELECT * FROM patients WHERE id=$1", pid)
    if not row: raise HTTPException(404, "Patient introuvable")
    return dict(row)

@app.delete("/patients/{pid}")
async def delete_patient(pid: str, db=Depends(get_db)):
    """Droit à l'effacement — LPD art. 32"""
    await db.execute("DELETE FROM patients WHERE id=$1", pid)
    return {"deleted": pid, "lpd": "effacement_complet"}


# ── Interventions ─────────────────────────────────────────────────────────────

@app.post("/interventions", status_code=201)
async def create_intervention(i: InterventionIn, db=Depends(get_db)):
    iid = str(uuid.uuid4())
    await db.execute(
        "INSERT INTO interventions(id,patient_id,type,data) VALUES($1,$2,$3,$4)",
        iid, i.patient_id, i.type, i.data)
    await ws_manager.broadcast({"event": "new_intervention", "id": iid, "type": i.type})
    return {"id": iid}

@app.get("/interventions/{patient_id}")
async def list_interventions(patient_id: str, db=Depends(get_db)):
    rows = await db.fetch(
        "SELECT * FROM interventions WHERE patient_id=$1 ORDER BY created_at DESC",
        patient_id)
    return [dict(r) for r in rows]


# ── HL7 / CodeΩ ───────────────────────────────────────────────────────────────

@app.post("/hl7/compress")
async def compress_hl7(h: HL7In, db=Depends(get_db)):
    result = omega_compress_hl7(h.hl7_message)
    lid = str(uuid.uuid4())
    await db.execute(
        "INSERT INTO hl7_logs(id,patient_id,hl7_original,hl7_compressed,ratio)"
        " VALUES($1,$2,$3,$4,$5)",
        lid, h.patient_id, h.hl7_message, result["compressed"], result["ratio"])
    return {"id": lid, "ratio": result["ratio"],
            "omega_rule_valid": result["omega_rule_valid"]}

@app.get("/jobs")
async def list_jobs(status: Optional[str] = None, db=Depends(get_db)):
    if status:
        rows = await db.fetch("SELECT * FROM codeomega_jobs WHERE status=$1", status)
    else:
        rows = await db.fetch("SELECT * FROM codeomega_jobs ORDER BY created_at DESC")
    return [dict(r) for r in rows]


# ── WebSocket ─────────────────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        while True: await ws.receive_text()
    except Exception:
        ws_manager.disconnect(ws)
