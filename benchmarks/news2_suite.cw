// Omega NEWS2 Benchmark Suite v1
// Objectif: cas canoniques, limites et critiques avec preuves formelles

Ω: News2CaseLow {
  n := NEWS2(78, 16, 98, 36.8, 124, "A") ;
  ⊢ n.score == 0 label "low_score_0" ;
  ⊢ n.risk == "ZERO" label "low_risk_zero" ;
}

Ω: News2CaseBorderline {
  n := NEWS2(110, 24, 94, 37.5, 105, "A") ;
  ⊢ n.score == 5 label "borderline_score_5" ;
  ⊢ n.risk == "MEDIUM" label "borderline_risk_medium" ;
}

Ω: News2CaseHigh {
  n := NEWS2(140, 30, 88, 39.5, 80, "V") ;
  ⊢ n.score >= 12 label "high_score_threshold" ;
  ⊢ n.risk == "HIGH" label "high_risk_high" ;
}

Ω: News2CaseHypotension {
  n := NEWS2(95, 18, 96, 36.7, 89, "A") ;
  ⊢ n.score >= 3 label "hypotension_detected" ;
}

Ω: News2CaseBrady {
  n := NEWS2(38, 12, 97, 36.4, 118, "A") ;
  ⊢ n.score >= 3 label "brady_detected" ;
}

Ω: News2CaseTachypnea {
  n := NEWS2(90, 26, 97, 36.9, 118, "A") ;
  ⊢ n.score >= 3 label "tachypnea_detected" ;
}

Ω: News2CaseHypoxia {
  n := NEWS2(88, 18, 90, 36.8, 118, "A") ;
  ⊢ n.score >= 3 label "hypoxia_detected" ;
}

Ω: News2CaseConsciousness {
  n := NEWS2(84, 16, 97, 36.7, 118, "P") ;
  ⊢ n.score >= 3 label "avpu_non_A_detected" ;
}

→ print("NEWS2 suite ready") ;
⊢ 1 == 1 label "suite_loaded" ;
