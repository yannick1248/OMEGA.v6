#!/usr/bin/env node
'use strict';

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('contracts/dependency_compatibility.json', 'utf8'));
const deps = data.dependencies || [];
if (deps.length === 0) {
  console.error('no dependencies found');
  process.exit(2);
}

let pass = 0;
let pending = 0;
for (const d of deps) {
  if (d.parity === 'pass') pass += 1;
  if (d.parity === 'pending') pending += 1;
  console.log(`${d.name}=${d.parity}`);
}

const pct = Math.round((pass / deps.length) * 100);
console.log(`parity_pass_rate=${pct}`);
console.log(`pending_count=${pending}`);
console.log(`can_replace_now=${pending === 0 ? 'YES' : 'PILOT_ONLY'}`);
process.exit(0);
