#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const root = path.join(repoRoot, 'apps', 'swissrescue-pwa');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function cp(srcRel, dstRel = srcRel) {
  const src = path.join(root, srcRel);
  const dst = path.join(dist, dstRel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

cp('index.html');
cp('public/manifest.webmanifest', 'manifest.webmanifest');
cp('public/sw.js', 'sw.js');
cp('src/main.ts', 'src/main.ts');
cp('src/db.ts', 'src/db.ts');

const files = fs.readdirSync(dist, { recursive: true });
const totalBytes = files.reduce((n, f) => n + fs.statSync(path.join(dist, f)).size, 0);

console.log(`pwa_build=PASS files=${files.length} bytes=${totalBytes}`);
if (totalBytes > 50 * 1024 * 1024) {
  console.error('bundle_too_large > 50MB');
  process.exit(1);
}
