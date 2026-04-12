#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { NEWS2, qSOFA, Glasgow, BMI, eGFR, parse, tokenize } = require('../src/runtime.js');

const faults = [];

function test(name, fn) {
  try {
    fn();
    faults.push({ name, status: 'PASS' });
  } catch (e) {
    faults.push({ name, status: 'FAIL', error: e.message });
  }
}

// Numeric edge/fault inputs
test('NEWS2_null_avpu', () => NEWS2(100, 20, 95, 37, 110, null));
test('NEWS2_string_numbers', () => NEWS2('110', '24', '94', '37.5', '105', 'A'));
test('qSOFA_nan', () => qSOFA(Number.NaN, 95, 13));
test('Glasgow_missing', () => Glasgow(undefined, undefined, undefined));
test('BMI_zero_height', () => BMI(70, 0));
test('eGFR_string', () => eGFR('1.2', 50, false));

// Parser fault inputs (must throw syntactic error and not crash process)
test('Parser_invalid_syntax', () => {
  let threw = false;
  try { parse(tokenize('Ω: X { bad := ; }')); } catch { threw = true; }
  if (!threw) throw new Error('invalid syntax unexpectedly accepted');
});

const pass = faults.filter((f) => f.status === 'PASS').length;
const fail = faults.length - pass;

const report = {
  total: faults.length,
  pass,
  fail,
  robustness_rate: Number(((pass / faults.length) * 100).toFixed(2)),
  faults
};

fs.writeFileSync('reports/fault_injection_report.json', JSON.stringify(report, null, 2) + '\n');
console.log(`fault_injection_pass=${pass}`);
console.log(`fault_injection_fail=${fail}`);
console.log(`robustness_rate=${report.robustness_rate}`);
process.exit(fail === 0 ? 0 : 1);
