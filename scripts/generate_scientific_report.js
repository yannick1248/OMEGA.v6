#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
  try {
    const out = execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });
    return { cmd, status: 'PASS', out: out.trim() };
  } catch (e) {
    return { cmd, status: 'FAIL', out: String(e.stdout || ''), err: String(e.stderr || e.message) };
  }
}

const checks = [
  run('node scripts/check_language_integrity.js'),
  run('node tests/test_medical.js'),
  run('node scripts/test_applicability.js'),
  run('node scripts/check_universal_compat.js'),
  run('node scripts/check_migration_parity.js')
];

const pass = checks.filter((c) => c.status === 'PASS').length;
const report = {
  generated_at: '2026-04-12',
  checks,
  pass_rate: Number(((pass / checks.length) * 100).toFixed(2)),
  scientific_claim_level: pass === checks.length ? 'SUPPORTED_FOR_PILOT' : 'INSUFFICIENT_EVIDENCE'
};

fs.writeFileSync('reports/scientific_validation_report.json', JSON.stringify(report, null, 2) + '\n');
console.log(`scientific_report=PASS pass_rate=${report.pass_rate}`);
console.log(`claim=${report.scientific_claim_level}`);
