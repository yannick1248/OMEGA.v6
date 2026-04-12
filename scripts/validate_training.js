#!/usr/bin/env node
'use strict';

const fs = require('fs');

const file = process.argv[2] || 'training/omega_train.jsonl';
const raw = fs.readFileSync(file, 'utf8').trim();
if (!raw) {
  console.error('ERROR: empty dataset');
  process.exit(2);
}

const lines = raw.split('\n');
let ok = 0;
let bad = 0;

function fail(i, msg) {
  bad += 1;
  console.error(`line ${i + 1}: ${msg}`);
}

for (let i = 0; i < lines.length; i++) {
  let obj;
  try {
    obj = JSON.parse(lines[i]);
  } catch {
    fail(i, 'invalid JSON');
    continue;
  }

  if (!Array.isArray(obj.messages) || obj.messages.length < 2) {
    fail(i, 'messages must be array with >=2 entries');
    continue;
  }

  const roles = obj.messages.map((m) => m.role);
  const validRoles = roles.every((r) => ['system', 'user', 'assistant'].includes(r));
  if (!validRoles) {
    fail(i, 'invalid role in messages');
    continue;
  }

  if (!obj.meta || typeof obj.meta !== 'object') {
    fail(i, 'meta missing');
    continue;
  }

  if (!Number.isInteger(obj.meta.expected_proofs) || obj.meta.expected_proofs < 1) {
    fail(i, 'meta.expected_proofs must be integer >=1');
    continue;
  }

  ok += 1;
}

console.log(`dataset=${file}`);
console.log(`lines=${lines.length} valid=${ok} invalid=${bad}`);
process.exit(bad === 0 ? 0 : 1);
