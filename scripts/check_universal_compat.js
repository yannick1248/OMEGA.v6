#!/usr/bin/env node
'use strict';

const fs = require('fs');

const cfg = JSON.parse(fs.readFileSync('contracts/universal_compatibility.json', 'utf8'));
const groups = ['platforms', 'software_dependencies', 'media_support'];

let total = 0;
let pass = 0;
let pending = 0;

for (const g of groups) {
  const arr = cfg[g] || [];
  for (const item of arr) {
    total += 1;
    if (item.status === 'pass') pass += 1;
    if (item.status === 'pending') pending += 1;
    console.log(`${g}:${item.name || item.type}=${item.status}`);
  }
}

const rate = Math.round((pass / Math.max(total, 1)) * 100);
console.log(`compatibility_pass_rate=${rate}`);
console.log(`pending_items=${pending}`);
console.log(`universal_ready=${pending === 0 ? 'YES' : 'PARTIAL'}`);
process.exit(0);
