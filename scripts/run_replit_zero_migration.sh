#!/usr/bin/env bash
set -euo pipefail

node scripts/check_migration_parity.js
node tests/test_converters.js
node scripts/test_applicability.js
node scripts/release_gate.js

echo "replit_zero_migration=PASS"
