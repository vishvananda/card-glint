// Shared pigment targets from calibration names; validation never sets the target.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
import { center } from './hsb-color.mjs';
const [nativeDirectory, auditFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-mana-color-fit.mjs NATIVE AUDIT OUTPUT');
const files = [
  path.join(nativeDirectory, 'capture.json'),
  path.join(nativeDirectory, 'inputs.json'),
  auditFile,
];
const raw = await Promise.all(files.map((f) => readFile(f))),
  [capture, inputs, audit] = raw.map((b) => JSON.parse(b));
assert.equal(audit.nativeCaptureHash, hash(raw[0]));
assert.equal(audit.nativeInputsHash, hash(raw[1]));
assert.equal(audit.total, 277);
assert.equal(audit.accepted, audit.total);
const paper = {},
  calibration = {},
  ids = new Set();
for (const symbol of ['W', 'U', 'B', 'R', 'G', 'N']) {
  const rr = audit.rows.filter(
    (r) => r.symbol === symbol && r.cohort === 'calibration' && r.accepted,
  );
  assert(rr.length >= 10);
  paper[symbol] = center(rr.map((r) => r.scan.disc)).map((v) => Math.round(v * 255) / 255);
  calibration[symbol] = {
    printings: rr.length,
    paper: paper[symbol],
    ink: center(rr.map((r) => r.scan.glyph)),
  };
  for (const cohort of ['calibration', 'validation']) {
    const peers = audit.rows
      .filter((r) => r.symbol === symbol && r.cohort === cohort && r.accepted)
      .sort((a, b) => a.id.localeCompare(b.id));
    const single = peers
      .filter((r) => inputs.entries.find((e) => e.id === r.id).face.manaSymbols.length === 1)
      .slice(0, 2);
    const multiple = peers
      .filter((r) => inputs.entries.find((e) => e.id === r.id).face.manaSymbols.length > 1)
      .slice(0, 3);
    for (const r of [...single, ...multiple]) ids.add(r.id);
  }
}
// Equal symbol-family weight, rather than favoring the more frequent cost color.
const ink = center(Object.values(calibration).map((v) => v.ink)).map(
  (v) => Math.round(v * 255) / 255,
);
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'shared-pigment-candidates-need-native-replay',
  scope:
    'Per-symbol disc targets and one common ink target use accepted calibration-name measurements only. A predeclared UUID sample retains two single- and three multiple-disc costs per symbol/cohort where available. Reused development validation is reported separately. Targets are diagnostic quantiles, not fitted scan pixels or per-card rendering overrides.',
  rendererHash: capture.source.rendererHash,
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  auditHash: hash(raw[2]),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  ids: [...ids].sort(),
  calibration,
  paper,
  ink,
  candidates: [
    { id: 'current', profile: null },
    { id: 'paper', profile: { paper, geometry: {} } },
    { id: 'paper-ink', profile: { paper, ink, geometry: {} } },
  ],
});
console.log(JSON.stringify({ printings: ids.size, paper, ink }));
