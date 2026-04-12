#!/usr/bin/env node
'use strict';

const { NEWS2, qSOFA, Glasgow, BMI, eGFR } = require('../src/runtime.js');

const n = Number(process.argv[2] || 50000);
const t0 = Date.now();
let checksum = 0;

for (let i = 0; i < n; i++) {
  const hr = 40 + (i % 100);
  const rr = 8 + (i % 24);
  const spo2 = 88 + (i % 12);
  const temp = 35 + ((i % 60) / 10);
  const sbp = 80 + (i % 160);
  const avpu = i % 7 === 0 ? 'V' : 'A';

  const a = NEWS2(hr, rr, spo2, temp, sbp, avpu).score;
  const b = qSOFA(rr, sbp, 10 + (i % 6)).score;
  const c = Glasgow(4, 5, 6).score;
  const d = BMI(60 + (i % 60), 150 + (i % 40)).bmi;
  const e = eGFR(0.8 + (i % 20) / 10, 30 + (i % 50), i % 2 === 0);
  checksum += a + b + c + d + e;
}

const dt = (Date.now() - t0) / 1000;
const throughput = Math.round(n / Math.max(dt, 0.001));

console.log(`stress_cases=${n}`);
console.log(`duration_s=${dt.toFixed(3)}`);
console.log(`throughput_cases_per_s=${throughput}`);
console.log(`checksum=${Math.round(checksum)}`);
console.log(`stress_status=${throughput > 1000 ? 'PASS' : 'WARN'}`);
