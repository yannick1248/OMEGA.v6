#!/usr/bin/env bash
set -euo pipefail

node scripts/validate_training.js training/omega_train.jsonl
node scripts/check_language_integrity.js
node tests/test_medical.js
node scripts/transpile_cw_to_ts.js benchmarks/news2_suite.cw benchmarks/news2_suite.ts

node src/runtime.js src/medical_benchmark.cw
node src/runtime.js benchmarks/news2_suite.cw
node src/runtime.js benchmarks/app_compatibility_suite.cw

echo "feasibility_pipeline=PASS"
