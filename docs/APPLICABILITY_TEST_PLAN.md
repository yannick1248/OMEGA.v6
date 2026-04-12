# SwissRescue OmniMed — Applicability Test Plan

Objectif: vérifier que le socle CodeΩ est exploitable pour servir l'application SwissRescue OmniMed.

## Couvertures testées
- Exécution runtime médicale (`medical_benchmark.cw`)
- Compatibilité couche application (`app_compatibility_suite.cw`)
- Tests unitaires médicaux (`tests/test_medical.js`)
- Build PWA offline sans dépendances externes
- Checks offline PWA (manifest + SW)
- Benchmark de positionnement modèle (jeu d'essai)

## Exécution

```bash
node scripts/test_applicability.js
```

## Critère
- `applicability_readiness=GO` => base exploitable pour intégration application.
- `LIMITED_GO` => intégration possible avec actions correctives.
- `NO_GO` => blocage technique majeur.
