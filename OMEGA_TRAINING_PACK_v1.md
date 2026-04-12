# Omega Training Pack v1

Pack opérationnel pour entraîner et valider Omega AI autour de CodeΩ avec une logique **preuve d'abord**.

## 1) Objectifs

- Génération de code `.cw` valide et compact.
- Exactitude sur calculs médicaux (NEWS2, qSOFA, Glasgow, BMI, eGFR).
- Robustesse (cas limites, données manquantes, adversarial prompts).
- Traçabilité et non-régression via benchmarks reproductibles.

## 2) Contenu du pack

- `training/schema.json`: schéma minimal d'un exemple d'entraînement.
- `training/omega_train.jsonl`: dataset seed (paires instruction → réponse).
- `benchmarks/news2_suite.cw`: batterie de cas NEWS2 avec preuves `⊢`.
- `scripts/validate_training.js`: validation structurale du JSONL.
- `scripts/run_omega_checks.sh`: checks locaux (dataset + benchmark).

## 3) KPIs proposés (go/no-go)

- `syntax_error_rate < 0.5%`
- `proof_pass_rate >= 99%`
- `critical_fail_rate <= 0.1%`
- `medical_rule_violation = 0`

## 4) Protocole d'entraînement (court)

1. **SFT niveau 1**: grammaire et opérateurs.
2. **SFT niveau 2**: primitives cliniques et preuves.
3. **SFT niveau 3**: compacité et refactoring (`U·14`).
4. **Éval stress**: cas limites + prompts contradictoires.
5. **Gate release**: seulement si KPIs validés.

## 5) Commandes

```bash
node scripts/validate_training.js training/omega_train.jsonl
bash scripts/run_omega_checks.sh
```

> Note: l'exécution `.cw` requiert `src/runtime.js` (absent dans ce snapshot).
