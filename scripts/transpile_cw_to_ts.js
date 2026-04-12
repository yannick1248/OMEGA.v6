#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { weight } = require('../src/runtime.js');

const inFile = process.argv[2];
if (!inFile) {
  console.error('Usage: node scripts/transpile_cw_to_ts.js <input.cw> [output.ts]');
  process.exit(2);
}
const outFile = process.argv[3] || inFile.replace(/\.c[wω]$/u, '.ts');

const src = fs.readFileSync(inFile, 'utf8');

const body = [];
body.push('/* Auto-generated from CodeΩ */');
body.push('type AnyObj = Record<string, unknown>;');
body.push('function assertProof(cond: boolean, label: string): void { if (!cond) throw new Error(`Proof failed: ${label}`); }');
body.push('export function runOmega(input: AnyObj = {}): AnyObj {');
body.push('  const out: AnyObj = { ...input };');

for (const raw of src.split('\n')) {
  const line = raw.trim();
  if (!line || line.startsWith('//') || line.startsWith('Ω:') || line === '}' || line.startsWith('U·')) continue;

  const assign = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:=\s*(.+);$/);
  if (assign) {
    body.push(`  out.${assign[1]} = ${assign[2]};`);
    continue;
  }

  const prove = line.match(/^⊢\s+(.+)\s+label\s+"([^"]+)"\s*;$/u);
  if (prove) {
    body.push(`  assertProof(Boolean(${prove[1]}), ${JSON.stringify(prove[2])});`);
    continue;
  }
}

body.push('  return out;');
body.push('}');

const ts = body.join('\n') + '\n';
fs.writeFileSync(outFile, ts, 'utf8');

const rho = weight(ts) / weight(src);
console.log(`transpile=${path.basename(inFile)} -> ${path.basename(outFile)}`);
console.log(`rho=${rho.toFixed(3)}`);
process.exit(0);
