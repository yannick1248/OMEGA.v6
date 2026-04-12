#!/usr/bin/env bash
set -euo pipefail

node scripts/release_gate.js
node scripts/stress_benchmark.js 100000
node scripts/generate_scientific_report.js

echo "extreme_validation=PASS"
