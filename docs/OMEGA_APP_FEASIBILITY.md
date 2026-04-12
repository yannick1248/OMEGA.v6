# Omega App Feasibility & Integrity Plan

## Objectif
Prouver qu'une application complète peut être recodée en CodeΩ sans casser l'existant, avec compatibilité des couches langage/runtime, et meilleure fiabilité opérationnelle.

## Stratégie de preuve

1. **Preuve syntaxe**
   - La grammaire EBNF reste la source de vérité.
   - Aucun ajout de primitive non contractuelle.

2. **Preuve sémantique**
   - Les builtins médicaux retournent des sorties déterministes.
   - Les preuves `⊢` deviennent critères de réussite bloquants.

3. **Preuve interop couches**
   - Contrat `contracts/language_layers.json` validé en CI.
   - Contrôle des primitives critiques (NEWS2, qSOFA, Glasgow, BMI, eGFR).

4. **Preuve non-régression**
   - Les benchmarks historiques restent exécutables.
   - Toute amélioration ajoute des tests sans modifier les résultats attendus existants.

## Plan de migration applicative (sans rupture)

- Étape 1: garder l'app actuelle, brancher un adaptateur CodeΩ en parallèle (mode shadow).
- Étape 2: comparer réponses legacy vs CodeΩ sur mêmes jeux d'entrée.
- Étape 3: activer CodeΩ sur flux faible risque (canary).
- Étape 4: montée progressive selon KPI (proof_pass_rate, critical_fail_rate).
- Étape 5: rollback automatique si violation de garde-fou.

## KPI de décision

- proof_pass_rate >= 99%
- syntax_error_rate < 0.5%
- critical_fail_rate <= 0.1%
- mismatch legacy_vs_omega <= 1% (hors cas corrigés documentés)

## Commandes de contrôle

```bash
node scripts/validate_training.js training/omega_train.jsonl
node scripts/check_language_integrity.js
bash scripts/run_full_feasibility.sh
```
