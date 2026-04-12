#!/usr/bin/env bash
set -euo pipefail

node scripts/validate_training.js training/omega_train.jsonl
node scripts/check_language_integrity.js
node tests/test_medical.js
node src/runtime.js benchmarks/news2_suite.cw
node src/runtime.js benchmarks/app_compatibility_suite.cw
