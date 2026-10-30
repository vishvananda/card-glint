import { preFontGeometrySource } from './font-geometry-ancestry.mjs';
import {
  preArnSymbolRoleSource,
  arnSymbolRoleHistoricalFiles,
  arnSymbolRoleRuntimeParent,
} from './arn-symbol-role-ancestry.mjs';
// Exact production adoption history. Historical replay is never a fit approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/mirage-onslaught/production-adoption.json.gz';
const SHA = '4267c5b798ba24ba3229a7b09f8fab3d7fde9d4045a6865dcfa2bd2eedf46f64';
let checked;
export function oldFrameAdoptionDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed old-frame production adoption receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'mir-ons-and-major-old-frame-default-adoption');
    assert.equal(
      p.beforeRenderer,
      '8070c1de1259548470c4b7735a442936f0d215f9a4783eb9ab9f5dd675ed3f83',
    );
    for (const entry of Object.values(p.files)) {
      assert.match(entry.after, /^[a-f0-9]{64}$/);
      if (entry.beforeSource !== null) assert.equal(hash(entry.beforeSource), entry.before);
      else assert.equal(entry.before, null);
    }
    const controls = p.controls;
    assert.equal(controls.status, 'unchanged-native-adoption-foreign-controls');
    assert.equal(controls.beforeHash, p.beforeRenderer);
    assert.equal(controls.afterHash, p.afterRenderer);
    assert.equal(controls.count, 130);
    assert.equal(controls.rows.length, 130);
    assert.equal(new Set(controls.rows.map((r) => r.id)).size, 130);
    assert.equal(controls.changed, 0);
    for (const row of controls.rows) {
      assert.match(row.inputHash, /^[a-f0-9]{64}$/);
      assert.match(row.sha256, /^[a-f0-9]{64}$/);
    }
    for (const [file, expected] of Object.entries(p.tools))
      assert.equal(hash(await fs.readFile(path.join(root, file))), expected);
    assert.equal(p.defaults.sets.length, 34);
    assert.equal(p.defaults.total, 778);
    assert.equal(p.defaults.measured, 526);
    assert.equal(p.defaults.footerUnchanged, 778);
    for (const set of p.defaults.sets) {
      assert.equal(set.source.rendererHash, p.afterRenderer);
      assert.equal(set.source.beforeHash, p.beforeRenderer);
      assert.equal(set.total, set.measured + set.rejected);
      assert.equal(set.footerUnchanged, set.total);
      assert.equal(set.rows.length, set.total);
    }
    for (const [set, count] of [
      ['mir', 351],
      ['ons', 350],
    ]) {
      const proof = p.printings[set];
      assert(proof.native.complete && proof.native.source.installed && proof.native.source.lazy);
      assert.equal(proof.native.source.rendererHash, p.afterRenderer);
      assert.equal(proof.native.rows.length, count);
      assert.equal(proof.original.status, 'public-original-source-parity');
      assert.equal(proof.original.source.renderer, p.afterRenderer);
      assert.equal(proof.original.count, count);
      assert.deepEqual(proof.native.faults, []);
      for (const row of proof.native.rows) {
        assert.match(row.referenceHash, /^[a-f0-9]{64}$/);
        assert.match(row.inputHash, /^[a-f0-9]{64}$/);
        assert.match(row.sha256, /^[a-f0-9]{64}$/);
      }
    }
    return p;
  })());
}
export async function preOldFrameAdoptionSource(file, bytes) {
  bytes = await preFontGeometrySource(file, bytes);
  bytes = await preArnSymbolRoleSource(file, bytes);
  const entry = (await oldFrameAdoptionDelta()).files[file];
  return entry && entry.beforeSource !== null && hash(bytes) === entry.after
    ? Buffer.from(entry.beforeSource)
    : bytes;
}
/** Unknown revisions and foreign additions stay visible to historical verifiers. */
export async function oldFrameAdoptionHistoricalFiles(files) {
  files = await arnSymbolRoleHistoricalFiles(files);
  const p = await oldFrameAdoptionDelta(),
    kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (
      e?.beforeSource === null &&
      hash(await preArnSymbolRoleSource(key, await fs.readFile(path.join(root, key)))) === e.after
    )
      continue;
    kept.push(file);
  }
  return kept;
}
export async function oldFrameAdoptionRuntimeParent(actual, set) {
  actual = await arnSymbolRoleRuntimeParent(actual, set);
  const p = await oldFrameAdoptionDelta();
  return actual === p.afterRenderer && set && !p.affectedSets.includes(set.toLowerCase())
    ? p.beforeRenderer
    : actual;
}
export async function oldFrameAdoptionAffected(set, task, original = false) {
  const p = await oldFrameAdoptionDelta();
  if (!p.affectedSets.includes(set?.toLowerCase())) return false;
  if (original) return ['mir', 'ons'].includes(set?.toLowerCase());
  return !['references', 'normalization'].includes(task);
}
