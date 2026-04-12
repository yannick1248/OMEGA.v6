# Benchmark Protocol — Omega AI vs Market Models

## Position juridique
Le for juridique du projet est **Genève, Suisse**.
Toutes les comparaisons doivent être traçables, reproductibles et auditables.

## Objectif
Évaluer Omega AI face aux modèles du marché sur des tâches médicales et techniques sans affirmation absolue non démontrée.

## Règles de validité
1. Même jeu d'entrées pour tous les modèles.
2. Même budget tokens/temps.
3. Scoring défini avant exécution.
4. Test aveugle + répétition multi-runs.
5. Aucune conclusion "supérieur à tous" sans preuve statistique robuste.

## Métriques
- `clinical_accuracy` (0-100)
- `proof_validity_rate` (0-1)
- `safety_violation_rate` (0-1, plus bas = meilleur)
- `latency_ms_p95`
- `offline_readiness` (0-1)
- `compactness_rho` (0-1 attendu)

## Score composite

```text
score = 0.30*clinical_accuracy
      + 0.25*(proof_validity_rate*100)
      + 0.20*((1-safety_violation_rate)*100)
      + 0.10*offline_readiness*100
      + 0.10*(100 - normalized_latency)
      + 0.05*(100 - |rho-0.85|*100)
```

## Commande

```bash
node scripts/run_model_benchmark.js benchmarks/sample_model_results.json
```

## Interprétation
- Si Omega AI est premier sur score composite et sans violation sécurité critique, on conclut "meilleur sur ce benchmark".
- Sinon, on publie les écarts et le plan correctif.
