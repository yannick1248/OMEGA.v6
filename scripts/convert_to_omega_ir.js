#!/usr/bin/env node
'use strict';

const fs = require('fs');

const [, , lang, inputFile, outputFile] = process.argv;
if (!lang || !inputFile) {
  console.error('Usage: node scripts/convert_to_omega_ir.js <lang> <input-file> [output-file]');
  process.exit(2);
}

const matrix = JSON.parse(fs.readFileSync('contracts/converter_matrix.json', 'utf8'));
const item = matrix.languages.find((l) => l.lang === lang);
if (!item) {
  console.error(`unsupported language: ${lang}`);
  process.exit(2);
}

const source = fs.readFileSync(inputFile, 'utf8');
const ir = {
  version: matrix.target,
  lang,
  adapter_status: item.status,
  checksum: source.length,
  body: source,
  metadata: {
    deterministic: true,
    generated_at: '2026-04-12'
  }
};

const out = outputFile || `${inputFile}.omega_ir.json`;
fs.writeFileSync(out, JSON.stringify(ir, null, 2) + '\n', 'utf8');
console.log(`convert=${lang} input=${inputFile} output=${out}`);
console.log(`adapter_status=${item.status}`);
