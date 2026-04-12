#!/usr/bin/env node
'use strict';

const fs = require('fs');

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/run_model_benchmark.js <results.json>');
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
if (!Array.isArray(data.models) || data.models.length === 0) {
  console.error('Invalid payload: models[] is required');
  process.exit(2);
}

const latencies = data.models.map((m) => m.latency_ms_p95);
const maxLatency = Math.max(...latencies);
const minLatency = Math.min(...latencies);
const latencyRange = Math.max(1, maxLatency - minLatency);

function score(m) {
  const normalizedLatency = ((m.latency_ms_p95 - minLatency) / latencyRange) * 100;
  return (
    0.30 * m.clinical_accuracy +
    0.25 * (m.proof_validity_rate * 100) +
    0.20 * ((1 - m.safety_violation_rate) * 100) +
    0.10 * (m.offline_readiness * 100) +
    0.10 * (100 - normalizedLatency) +
    0.05 * (100 - Math.abs(m.compactness_rho - 0.85) * 100)
  );
}

const ranked = data.models
  .map((m) => ({ ...m, composite: Number(score(m).toFixed(2)) }))
  .sort((a, b) => b.composite - a.composite);

console.log('benchmark_date=' + (data.date || 'n/a'));
console.log('legal_forum=' + (data.legal_forum || 'Geneva, Switzerland'));
console.log('ranking:');
ranked.forEach((m, i) => {
  console.log(`${i + 1}. ${m.name} composite=${m.composite}`);
});

const winner = ranked[0];
const criticalFail = winner.safety_violation_rate > 0;
if (criticalFail) {
  console.log('verdict=NO-GO winner has safety violations');
  process.exit(1);
}

console.log(`verdict=GO winner=${winner.name}`);
if (winner.name.toLowerCase().includes('omega')) {
  console.log('claim=Omega leads on this benchmark dataset');
} else {
  console.log('claim=Omega not leading yet; improvement required');
}
