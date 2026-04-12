# Release Gate Policy

Question: "Peut-on l'utiliser sans aucun bug ni conflit ?"

Réponse d'ingénierie: **on ne peut jamais garantir 0 bug absolu**.
On peut garantir un niveau de confiance mesuré avant mise en service.

## Gate minimal

```bash
node scripts/release_gate.js
```

## Interprétation
- `release_gate=READY_WITH_RESIDUAL_RISK` : tous les tests passent, usage possible en pilote contrôlé.
- `release_gate=NOT_READY` : blocage, ne pas déployer.

## Règle sécurité
Si un test médical, offline, ou compatibilité échoue: arrêt immédiat du déploiement.
