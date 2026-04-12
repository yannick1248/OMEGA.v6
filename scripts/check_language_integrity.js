#!/usr/bin/env node
'use strict';

const fs = require('fs');

function assert(cond, msg) {
  if (!cond) {
    throw new Error(msg);
  }
}

const grammarPath = 'src/grammar.ebnf';
const contractPath = 'contracts/language_layers.json';

assert(fs.existsSync(grammarPath), 'Missing src/grammar.ebnf');
assert(fs.existsSync(contractPath), 'Missing contracts/language_layers.json');

const grammar = fs.readFileSync(grammarPath, 'utf8');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

const grammarMustContain = [
  'node_decl',
  'axiom_decl',
  'prove_stmt',
  'compress_stmt',
  'if_expr',
  'loop_expr',
  'assignment',
  'propagation'
];

for (const token of grammarMustContain) {
  assert(grammar.includes(token), `Grammar missing rule: ${token}`);
}

assert(Array.isArray(contract.layers), 'Contract layers must be an array');
assert(contract.layers.length >= 4, 'Contract must define at least 4 layers');

const expectedLayerNames = [
  'lexer_parser',
  'interpreter_core',
  'medical_builtins',
  'application_adapter'
];

for (const layerName of expectedLayerNames) {
  const layer = contract.layers.find((l) => l.name === layerName);
  assert(layer, `Missing layer: ${layerName}`);
  assert(Array.isArray(layer.required_primitives), `${layerName}.required_primitives must be array`);
  assert(Array.isArray(layer.compatibility_guards), `${layerName}.compatibility_guards must be array`);
  assert(layer.required_primitives.length > 0, `${layerName}.required_primitives cannot be empty`);
  assert(layer.compatibility_guards.length > 0, `${layerName}.compatibility_guards cannot be empty`);
}

const medical = contract.layers.find((l) => l.name === 'medical_builtins');
const requiredMedical = ['NEWS2', 'qSOFA', 'Glasgow', 'BMI', 'eGFR'];
for (const fn of requiredMedical) {
  assert(medical.required_primitives.includes(fn), `Medical builtin missing in contract: ${fn}`);
}

console.log('integrity_check=PASS');
console.log(`grammar_rules_checked=${grammarMustContain.length}`);
console.log(`contract_layers_checked=${expectedLayerNames.length}`);
