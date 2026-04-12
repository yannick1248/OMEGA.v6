#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const base = path.join(repoRoot, 'apps', 'swissrescue-pwa');
const sw = fs.readFileSync(path.join(base, 'public', 'sw.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(base, 'public', 'manifest.webmanifest'), 'utf8'));

const checks = [
  { ok: sw.includes('caches.open') && sw.includes('fetch'), msg: 'service_worker_cache_logic' },
  { ok: manifest.display === 'standalone', msg: 'manifest_standalone' },
  { ok: !!manifest.start_url, msg: 'manifest_start_url' }
];

const bad = checks.filter((c) => !c.ok);
checks.forEach((c) => console.log(`${c.msg}=${c.ok ? 'PASS' : 'FAIL'}`));
process.exit(bad.length ? 1 : 0);
