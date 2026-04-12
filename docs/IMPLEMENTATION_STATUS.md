# Omega AI - Implémentation technique (itération actuelle)

## Livrables ajoutés

1. Runtime exécutable `src/runtime.js`
   - Parse/interprète `.cw`
   - Primitives médicales NEWS2/qSOFA/Glasgow/BMI/eGFR
   - Compression + règle Ω

2. Transpileur `.cw -> .ts`
   - Script: `scripts/transpile_cw_to_ts.js`
   - Convertit affectations + preuves en assertions TypeScript
   - Expose le ratio `rho`

3. PWA hors-ligne (squelette fonctionnel)
   - Dossier: `apps/swissrescue-pwa/`
   - Service Worker cache-first
   - Manifest installable
   - IndexedDB locale

4. Tests médicaux automatisés
   - Script: `tests/test_medical.js`
   - 50+ cas NEWS2 générés + cas canoniques

5. Gouvernance et benchmark marché
   - For juridique explicite: Genève, Suisse (`contracts/governance.json`)
   - Protocole benchmark: `docs/BENCHMARK_PROTOCOL.md`
   - Runner benchmark: `scripts/run_model_benchmark.js`

## Commandes de validation

```bash
node src/runtime.js src/medical_benchmark.cw
node tests/test_medical.js
node scripts/run_model_benchmark.js benchmarks/sample_model_results.json
bash scripts/run_full_feasibility.sh
```

## Limites connues

- Le transpileur TS est volontairement minimal (subset `.cw`).
- Le build PWA est désormais sans dépendance externe (`npm install` offline OK, `npm run build` utilise `scripts/build_pwa.js`).
- Un benchmark "supérieur à tous les modèles" exige des jeux tiers indépendants et audit statistique externe.
