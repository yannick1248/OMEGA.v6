-- SwissRescueOmniMed CRM — Schéma PostgreSQL 16
-- LPD suisse : pseudonymisation obligatoire, jamais de PII directe en DB
-- © D.Y. Roth · 2026

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE patients (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pseudonym   TEXT NOT NULL UNIQUE,   -- SHA256(nom+ddn+sel) tronqué 16 chars
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE interventions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id  UUID REFERENCES patients(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK (type IN ('triage','transport','soin','suivi')),
    data        JSONB NOT NULL,          -- scores cliniques, constantes
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE hl7_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(id),
    hl7_original    TEXT NOT NULL,
    hl7_compressed  BYTEA,
    ratio           FLOAT CHECK (ratio > 0),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE codeomega_jobs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type        TEXT NOT NULL,           -- 'compress_hl7','analyze_snp','meta_infer'
    input_hash  TEXT NOT NULL,           -- SHA256 entrée
    output_hash TEXT,                    -- SHA256 sortie
    ratio       FLOAT,                   -- I·R mesuré (< 1.0 = règle Ω validée)
    status      TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','running','done','error')),
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE access_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL,
    action      TEXT NOT NULL,
    target_id   UUID,
    ip_hash     TEXT,                    -- SHA256(IP) — jamais l'IP brute (LPD art.25)
    status_code INT,
    ts          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON interventions(patient_id, created_at DESC);
CREATE INDEX ON hl7_logs(patient_id);
CREATE INDEX ON codeomega_jobs(status);
CREATE INDEX ON access_logs(user_id, ts DESC);
