#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { NEWS2, qSOFA, Glasgow, BMI, eGFR } = require('../src/runtime.js');

const fixed = [
  { in: [118, 26, 93, 38.7, 88, 'V'], score: 14 },
  { in: [72, 16, 97, 36.8, 115, 'A'], score: 0 },
  { in: [110, 24, 94, 37.5, 105, 'A'], score: 5 }
];

for (const c of fixed) {
  const got = NEWS2(c.in[0], c.in[1], c.in[2], c.in[3], c.in[4], c.in[5]);
  assert.strictEqual(got.score, c.score);
}

let generated = 0;
for (let hr = 40; hr <= 140; hr += 10) {
  for (let rr = 8; rr <= 30; rr += 2) {
    const res = NEWS2(hr, rr, 95, 37.0, 110, 'A');
    assert.ok(res.score >= 0 && res.score <= 20);
    generated += 1;
    if (generated >= 50) break;
  }
  if (generated >= 50) break;
}

assert.strictEqual(qSOFA(24, 95, 13).score, 3);
assert.strictEqual(Glasgow(3, 4, 5).score, 12);
assert.ok(BMI(98.5, 172).bmi > 30);
assert.ok(eGFR(1.8, 54, false) < 60);

console.log(`medical_tests=PASS cases=${generated + fixed.length}`);
