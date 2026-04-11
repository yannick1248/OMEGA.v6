# CodeΩ — Langage de Programmation Natif v1.1

> **Règle Ω absolue** : `|output| < |input|  ∧  E(output) < E(input)`  
> Tout ce que CodeΩ produit doit être plus petit et moins entropique que ce qu'il reçoit.

---

## Qu'est-ce que CodeΩ ?

CodeΩ (`.cω`) est un langage de programmation minimaliste, auto-compilant et formellement spécifié, conçu pour que chaque transformation soit **prouvable, mesurable et réversible**.

Il n'est pas un langage de scripting de plus — il impose une **contrainte physique** : la compilation ne peut que réduire le poids informationnel.

---

## Architecture

```
grammar.ebnf          ← Grammaire formelle EBNF v1.0
runtime.js            ← Lexer + Parser AST + Interpréteur natif
medical_benchmark.cω  ← Preuve par calculs médicaux réels
codeomega-ide.html    ← IDE complet navigateur (self-hosted)
```

---

## Grammaire EBNF (extrait)

```ebnf
program    = { statement } EOF ;
node_decl  = "Ω:" IDENT "{" { statement } "}" ;
axiom_decl = "U·" DIGIT+ ":" IDENT "=" expr ";" ;
propagation= "→" IDENT "(" [ arg_list ] ")" ";" ;
compress   = "⊗" IDENT [ "→" IDENT ] ";" ;
prove      = "⊢" expr [ "label" STRING ] ";" ;
```

**Priorités opératoires** (croissant) : `||` → `&&` → `==|!=` → `<|>|<=|>=` → `+|-` → `*|/|%` → unaire → postfixe

---

## Exemple `.cω`

```
Ω: PatientSepsis {
  U·12: snap = "PAT-001-2026" ;
  hr   := 118 ;
  rr   := 26 ;
  spo2 := 93 ;
  sbp  := 88 ;
  n2   := NEWS2(hr, rr, spo2, 38.7, sbp, "V") ;
  ⊢ n2.score >= 5 label "NEWS2_elevated" ;
  ⊢ n2.risk == "HIGH" label "critical_patient" ;
  → print("Score NEWS2 :", n2.score, n2.risk) ;
}
```

---

## Benchmark Médical — Preuve concrète

Le fichier `medical_benchmark.cω` exécute des calculs cliniques **réels** :

| Score | Patient | Résultat | Preuve |
|-------|---------|----------|--------|
| NEWS2 | PAT-001 (Sepsis) | 9 — HIGH | `⊢ n2.score >= 5` |
| qSOFA | PAT-001 | 2 — Sepsis positif | `⊢ qs.sepsis_risk` |
| Glasgow | PAT-001 | 12 — MODERATE | `⊢ gcsr.score == 12` |
| BMI | PAT-002 | 33.3 — Obésité | `⊢ bmi_r.bmi > 30` |
| eGFR (CKD-EPI) | PAT-002 | 41 mL/min | `⊢ egfr_v < 60` |
| HL7 compression | HL7-003 | ratio < 1.0 | `⊢ ratio < 1.0` (Règle Ω validée) |

Ces preuves sont **auto-générées par le runtime** — aucune dépendance externe.

---

## Axiomes actifs

| Axiome | Sémantique |
|--------|------------|
| U·01 | Toute existence doit être déclarée |
| U·02 | ρ = |compressed|/|original| ∈ (0,1) |
| U·03 | Zones adjacentes non modifiées |
| U·06 | ⊢ rejette tout résultat sans preuve |
| U·12 | Snapshot avant transformation |
| U·14 | Répétition ≥ 3× → référence unique |
| U·Ω  | Compilation continue si score partiel |

---

## IDE (navigateur, zero-install)

`codeomega-ide.html` est un IDE complet :
- Éditeur avec syntaxe colorée `.cω`
- Runtime intégré (Lexer + Parser + Interpréteur)
- Vérification Règle Ω en temps réel
- Bootstrap circulaire **⟳ Self-Host** (le compilateur se compile lui-même)
- Mode dark/light, score 0-100, log d'exécution

---

## Roadmap

- [ ] Compilateur natif → bytecode `.cωb`
- [ ] Module FHIR/HL7 natif avec compression lossless certifiée
- [ ] Validation clinique des scores (NEWS2, qSOFA, Glasgow) sur cohortes réelles
- [ ] LSP (Language Server Protocol) pour VS Code
- [ ] WASM target pour exécution universelle

---

## Licence

CodeΩ est un projet de recherche ouvert.  
**Règle non-négociable** : aucun déploiement médical réel sans validation clinique certifiée.

---

*Zürich, 2026 — yannick1248*
