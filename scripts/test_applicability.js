#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

const checks = [
  { name: 'runtime_medical_benchmark', cmd: 'node src/runtime.js src/medical_benchmark.cw' },
  { name: 'runtime_app_compatibility', cmd: 'node src/runtime.js benchmarks/app_compatibility_suite.cw' },
  { name: 'medical_unit_tests', cmd: 'node tests/test_medical.js' },
  { name: 'pwa_build', cmd: 'node scripts/build_pwa.js' },
  { name: 'pwa_offline_checks', cmd: 'node scripts/check_pwa_offline.js' },
  { name: 'model_benchmark', cmd: 'node scripts/run_model_benchmark.js benchmarks/sample_model_results.json' }
];

const results = [];
for (const c of checks) {
  try {
    const out = execSync(c.cmd, { stdio: 'pipe', encoding: 'utf8' });
    results.push({ name: c.name, status: 'PASS', output: out.trim() });
  } catch (e) {
    results.push({
      name: c.name,
      status: 'FAIL',
      output: String(e.stdout || '').trim(),
      error: String(e.stderr || e.message).trim()
    });
  }
}

const passed = results.filter((r) => r.status === 'PASS').length;
const score = Math.round((passed / results.length) * 100);
const readiness = score === 100 ? 'GO' : score >= 80 ? 'LIMITED_GO' : 'NO_GO';

console.log(`applicability_score=${score}`);
console.log(`applicability_readiness=${readiness}`);
for (const r of results) {
  console.log(`${r.name}=${r.status}`);
}

if (readiness === 'NO_GO') process.exit(1);
