#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

const cases = [
  ['js', 'samples/sample.js'],
  ['ts', 'samples/sample.ts'],
  ['py', 'samples/sample.py'],
  ['rs', 'samples/sample.rs'],
  ['c', 'samples/sample.c']
];

for (const [lang, file] of cases) {
  const out = `${file}.omega_ir.json`;
  execSync(`node scripts/convert_to_omega_ir.js ${lang} ${file} ${out}`, { stdio: 'pipe' });
  const parsed = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (parsed.lang !== lang || parsed.version !== 'omega_ir_v1') {
    throw new Error(`converter fail for ${lang}`);
  }
}

console.log(`converter_tests=PASS cases=${cases.length}`);
