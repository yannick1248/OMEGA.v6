# Replit 0 — Plan de migration complète vers indépendance

## Objectif
Remplacer la dépendance Replit par une chaîne locale/reproductible, sans régression fonctionnelle.

## Stratégie
1. Geler les interfaces externes (API, DB, PWA manifest, offline behavior).
2. Introduire `omega_ir_v1` comme couche de conversion universelle.
3. Convertir progressivement les modules (JS/TS/Python/Rust/C -> Omega IR -> CodeΩ runtime).
4. Exécuter les gates: `check_migration_parity`, `release_gate`, `test_applicability`.
5. Bascule finale seulement si parité 100%.

## Commandes

```bash
node scripts/check_migration_parity.js
node scripts/test_applicability.js
bash scripts/run_replit_zero_migration.sh
```
