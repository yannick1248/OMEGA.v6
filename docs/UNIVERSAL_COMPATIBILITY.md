# Universal Compatibility Status

Objectif: mesurer la compatibilité multi-supports, multi-dépendances et multi-médias.

## Vérification

```bash
node scripts/check_universal_compat.js
```

## Interprétation
- `universal_ready=YES` : compatibilité complète validée.
- `universal_ready=PARTIAL` : compatibilité majoritaire, éléments restants à implémenter.

Principe: pas de promesse absolue, uniquement des résultats mesurés.
