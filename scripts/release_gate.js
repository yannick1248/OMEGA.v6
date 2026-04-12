#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

const checks = [
  ['runtime', 'node src/runtime.js src/medical_benchmark.cw'],
  ['app_compat', 'node src/runtime.js benchmarks/app_compatibility_suite.cw'],
  ['medical_tests', 'node tests/test_medical.js'],
  ['applicability', 'node scripts/test_applicability.js'],
  ['pwa_build', 'node scripts/build_pwa.js'],
  ['pwa_offline', 'node scripts/check_pwa_offline.js']
];

let failed = 0;
for (const [name, cmd] of checks) {
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`${name}=PASS`);
  } catch {
    failed += 1;
    console.log(`${name}=FAIL`);
  }
}

const status = failed === 0 ? 'READY_WITH_RESIDUAL_RISK' : 'NOT_READY';
console.log(`release_gate=${status}`);
console.log('zero_bug_guarantee=false');
console.log(`failed_checks=${failed}`);

process.exit(failed === 0 ? 0 : 1);
