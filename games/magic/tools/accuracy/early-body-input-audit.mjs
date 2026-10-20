// Compare reviewed input values before reusing a frozen body measurement.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { hash, writeJson } from './common.mjs';
const [baselineDirectory, currentFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-body-input-audit.mjs NATIVE_BASELINE CURRENT_PRINTING_INPUTS OUTPUT');
const raw = await Promise.all(
  [
    path.join(baselineDirectory, 'capture.json'),
    path.join(baselineDirectory, 'inputs.json'),
    currentFile,
  ].map((file) => readFile(file)),
);
const [capture, baseline, current] = raw.map((b) => JSON.parse(b));
assert.equal(baseline.entries.length, current.entries.length);
assert.equal(current.unresolved.length, 0);
assert.equal(current.unavailable.length, 0);
assert.deepEqual(baseline.entries.map((e) => e.id).sort(), current.entries.map((e) => e.id).sort());
const oldAssets = new Map(baseline.components.map((c) => [c.url, c.sha256]));
for (const asset of current.components)
  assert.equal(
    oldAssets.get(asset.url),
    asset.sha256,
    'Required source/font changed: ' + asset.url,
  );
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((k) => [k, canonical(value[k])]),
        )
      : value;
const rows = [];
for (const before of baseline.entries) {
  const after = current.entries.find((e) => e.id === before.id),
    native = capture.rows.find((r) => r.id === before.id);
  assert(
    before.pose.accepted &&
      native.accepted &&
      before.face.wordingMode === 'original' &&
      after.face.wordingMode === 'original',
  );
  assert.equal(before.reference.sha256, after.reference.sha256);
  assert.equal(before.art.sha256, after.art.sha256);
  assert.equal(before.reference.sha256, native.referenceHash);
  assert.equal(hash(JSON.stringify(before.pose.transform)), native.poseHash);
  const changed = Object.keys({ ...before.face, ...after.face })
    .filter((k) => !isDeepStrictEqual(before.face[k], after.face[k]))
    .sort();
  assert(
    changed.every((k) => ['rulesText', 'rulesParagraphs', 'rulesAlignment'].includes(k)),
    'Non-body field changed; broader audit required: ' + before.name,
  );
  rows.push({
    id: before.id,
    name: before.name,
    referenceHash: native.referenceHash,
    poseHash: native.poseHash,
    baselineFaceHash: native.renderHash,
    previousInputFaceHash: hash(JSON.stringify(canonical(before.face))),
    currentInputFaceHash: hash(JSON.stringify(canonical(after.face))),
    changedFields: changed,
    decision: changed.length ? 'replay-reviewed-body-input' : 'same-input-values',
  });
}
await writeJson(output, {
  schema: 1,
  set: current.set,
  status: rows.some((r) => r.changedFields.length)
    ? 'reviewed-body-input-refresh-required'
    : 'provided-inputs-unchanged',
  scope:
    'Reviewed original printing inputs against a frozen native baseline. Reference/art bytes, required source/font identities and scan transforms are unchanged. Only body input fields may change. Identical provided face values permit measurement reuse only with the same painter and component hashes; this does not certify a different renderer. Changed body inputs need a targeted replay. No scan renormalization, refetch, runtime promotion or full-set completion.',
  baselineRendererHash: capture.source.rendererHash,
  currentInputProducerHash: current.rendererHash,
  sources: Object.fromEntries(
    ['nativeCapture', 'nativeInputs', 'currentPrintingInputs'].map((k, i) => [k, hash(raw[i])]),
  ),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  total: rows.length,
  unchanged: rows.filter((r) => !r.changedFields.length).length,
  changed: rows.filter((r) => r.changedFields.length),
  rows,
});
console.log(
  JSON.stringify({
    total: rows.length,
    unchanged: rows.filter((r) => !r.changedFields.length).length,
    changed: rows
      .filter((r) => r.changedFields.length)
      .map((r) => ({ name: r.name, fields: r.changedFields })),
  }),
);
