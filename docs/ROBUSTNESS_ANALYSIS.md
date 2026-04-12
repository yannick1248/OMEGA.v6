# Robustness Analysis (Fault Injection)

Ce protocole injecte des entrées invalides/limites pour détecter les faiblesses runtime.

## Commande

```bash
node scripts/fault_injection_benchmark.js
```

## Sortie
- `reports/fault_injection_report.json`
- `robustness_rate`

## Usage
- Si un test échoue: corriger le runtime puis relancer jusqu'à 100%.
