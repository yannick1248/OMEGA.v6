# Migration Parity — CodeΩ vs application actuelle

Question: "CodeΩ peut-il remplacer toute l'application sans casser les dépendances ?"

Réponse technique actuelle:
- **Oui en trajectoire**, mais **pas en bascule big-bang immédiate**.
- État recommandé: migration progressive (shadow -> canary -> full switch).

## Vérification

```bash
node scripts/check_migration_parity.js
```

Si `can_replace_now=PILOT_ONLY`, la bascule totale n'est pas encore validée.
