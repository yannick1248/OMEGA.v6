/* Auto-generated from CodeΩ */
type AnyObj = Record<string, unknown>;
function assertProof(cond: boolean, label: string): void { if (!cond) throw new Error(`Proof failed: ${label}`); }
export function runOmega(input: AnyObj = {}): AnyObj {
  const out: AnyObj = { ...input };
  out.n = NEWS2(78, 16, 98, 36.8, 124, "A") ;
  assertProof(Boolean(n.score == 0), "low_score_0");
  assertProof(Boolean(n.risk == "ZERO"), "low_risk_zero");
  out.n = NEWS2(110, 24, 94, 37.5, 105, "A") ;
  assertProof(Boolean(n.score == 5), "borderline_score_5");
  assertProof(Boolean(n.risk == "MEDIUM"), "borderline_risk_medium");
  out.n = NEWS2(140, 30, 88, 39.5, 80, "V") ;
  assertProof(Boolean(n.score >= 12), "high_score_threshold");
  assertProof(Boolean(n.risk == "HIGH"), "high_risk_high");
  out.n = NEWS2(95, 18, 96, 36.7, 89, "A") ;
  assertProof(Boolean(n.score >= 3), "hypotension_detected");
  out.n = NEWS2(38, 12, 97, 36.4, 118, "A") ;
  assertProof(Boolean(n.score >= 3), "brady_detected");
  out.n = NEWS2(90, 26, 97, 36.9, 118, "A") ;
  assertProof(Boolean(n.score >= 3), "tachypnea_detected");
  out.n = NEWS2(88, 18, 90, 36.8, 118, "A") ;
  assertProof(Boolean(n.score >= 3), "hypoxia_detected");
  out.n = NEWS2(84, 16, 97, 36.7, 118, "P") ;
  assertProof(Boolean(n.score >= 3), "avpu_non_A_detected");
  assertProof(Boolean(1 == 1), "suite_loaded");
  return out;
}
