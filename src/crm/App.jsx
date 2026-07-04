/**
 * SwissRescueOmniMed CRM — React 18 frontend minimal
 * Dashboard + Liste patients + Onglet CodeΩ HL7
 * WebSocket temps réel pour nouvelles interventions
 */
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ── WebSocket hook ─────────────────────────────────────────────────────────
function useLiveEvents(onEvent) {
  useEffect(() => {
    const ws = new WebSocket(`${API.replace("http", "ws")}/ws`);
    ws.onmessage = e => onEvent(JSON.parse(e.data));
    ws.onerror   = () => {};
    return () => ws.close();
  }, []);
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ patients, jobs }) {
  const avgRatio = jobs.filter(j => j.ratio).reduce((a, j) => a + j.ratio, 0)
                 / Math.max(1, jobs.filter(j => j.ratio).length);
  const omegaOk  = jobs.filter(j => j.ratio < 1.0).length;
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <Stat label="Patients"     value={patients.length} />
      <Stat label="Jobs CodeΩ"   value={jobs.length} />
      <Stat label="Ratio HL7 moy" value={avgRatio ? avgRatio.toFixed(3) : "—"} />
      <Stat label="Règle Ω OK"   value={`${omegaOk}/${jobs.length}`} color="#22c55e" />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ padding: 16, border: "1px solid #334", borderRadius: 8, minWidth: 120 }}>
      <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color ?? "#fff" }}>{value}</div>
    </div>
  );
}

// ── Liste patients ─────────────────────────────────────────────────────────
function PatientList({ patients }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>{["Pseudonyme", "Créé le"].map(h =>
          <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #334" }}>{h}</th>
        )}</tr>
      </thead>
      <tbody>
        {patients.map(p => (
          <tr key={p.id}>
            <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{p.pseudonym}</td>
            <td style={{ padding: "8px 12px", color: "#888" }}>
              {new Date(p.created_at).toLocaleDateString("fr-CH")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Onglet CodeΩ (compression HL7) ────────────────────────────────────────
function HL7Tab({ patients }) {
  const [pid,    setPid]    = useState("");
  const [hl7,    setHl7]    = useState("");
  const [result, setResult] = useState(null);
  const [loading,setLoading]= useState(false);

  const compress = async () => {
    if (!pid || !hl7) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/hl7/compress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: pid, hl7_message: hl7 }),
      });
      setResult(await r.json());
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <select value={pid} onChange={e => setPid(e.target.value)}
              style={{ padding: 8 }}>
        <option value="">— sélectionner un patient —</option>
        {patients.map(p =>
          <option key={p.id} value={p.id}>{p.pseudonym}</option>
        )}
      </select>
      <textarea value={hl7} onChange={e => setHl7(e.target.value)}
                rows={5} placeholder="MSH|^~\&|EPIC|..."
                style={{ padding: 8, fontFamily: "monospace" }} />
      <button onClick={compress} disabled={loading || !pid || !hl7}
              style={{ padding: "10px 20px", cursor: "pointer" }}>
        {loading ? "…" : "⊗ Compresser (CodeΩ)"}
      </button>
      {result && (
        <div style={{ padding: 12, background: result.omega_rule_valid ? "#14532d" : "#7f1d1d",
                      borderRadius: 8 }}>
          <div>Ratio : <strong>{result.ratio}</strong></div>
          <div>Règle Ω : {result.omega_rule_valid ? "✅ validée" : "❌ VIOLATION — I·R ≥ 1.0"}</div>
        </div>
      )}
    </div>
  );
}

// ── App root ───────────────────────────────────────────────────────────────
export default function App() {
  const [tab,           setTab]           = useState("dashboard");
  const [patients,      setPatients]      = useState([]);
  const [jobs,          setJobs]          = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`${API}/patients`).then(r => r.json()).then(setPatients).catch(() => {});
    fetch(`${API}/jobs`).then(r => r.json()).then(setJobs).catch(() => {});
  }, []);

  useLiveEvents(evt => {
    if (evt.event === "new_intervention")
      setNotifications(prev => [`Intervention ${evt.type}`, ...prev].slice(0, 5));
  });

  const TABS = ["dashboard", "patients", "hl7"];

  return (
    <div style={{ fontFamily: "system-ui", background: "#0f172a", color: "#e2e8f0",
                  minHeight: "100vh", padding: 24 }}>
      <h1 style={{ margin: "0 0 8px" }}>🏥 SwissRescueOmniMed CRM</h1>
      <p style={{ color: "#64748b", margin: "0 0 24px" }}>
        CodeΩ v4.0 · Règle Ω : |output| &lt; |input|
      </p>

      {notifications.map((n, i) => (
        <div key={i} style={{ background: "#1e3a5f", padding: "8px 12px",
                              borderRadius: 6, marginBottom: 8, fontSize: 13 }}>
          🔔 {n}
        </div>
      ))}

      <nav style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
                  style={{ padding: "8px 16px", cursor: "pointer",
                           background: tab === t ? "#3b82f6" : "#1e293b",
                           border: "none", borderRadius: 6, color: "#fff" }}>
            {t}
          </button>
        ))}
      </nav>

      {tab === "dashboard" && <Dashboard patients={patients} jobs={jobs} />}
      {tab === "patients"  && <PatientList patients={patients} />}
      {tab === "hl7"       && <HL7Tab patients={patients} />}
    </div>
  );
}
