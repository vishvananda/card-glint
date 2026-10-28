// Exact source history for additional old-frame families; no fit approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/mirage-onslaught/source-family-adapter-delta.json.gz';
const RECEIPT = '6f039cbca11a0b4988b86ab238822d78f9c22060c41c9fea150fa4656fc650f5';
let checked;
export function oldFrameSourceDelta() {
  return (checked ??= (async () => {
    const zipped = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(zipped), RECEIPT, 'Changed source-family receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'old-frame-source-families');
    assert.equal(
      p.beforeRenderer,
      '36be60f78b232e5311f4be839c3fc44e016b6eacdbb6a745260b0a8ed612ce7e',
    );
    assert.equal(Object.keys(p.files).length, 8);
    for (const e of Object.values(p.files)) {
      assert.match(e.after, /^[a-f0-9]{64}$/);
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    const { nativeProof, nativeTool, scope, ...draft } = p;
    assert(scope.length > 0);
    assert.equal(nativeProof.source.deltaHash, hash(JSON.stringify(draft, null, 2) + '\n'));
    assert.equal(nativeProof.source.rendererHash, p.afterRenderer);
    assert.equal(nativeProof.status, 'unchanged-native-frame-family-controls');
    assert.equal(nativeProof.count, 65);
    assert.equal(nativeProof.changed, 0);
    assert.equal(nativeProof.rows.length, 65);
    assert.equal(new Set(nativeProof.rows.map((r) => r.id)).size, 65);
    for (const r of nativeProof.rows) {
      assert.match(r.inputHash, /^[a-f0-9]{64}$/);
      assert.match(r.sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(nativeProof.source.toolHash, nativeTool.sha256);
    assert.equal(hash(await fs.readFile(path.join(root, nativeTool.file))), nativeTool.sha256);
    return p;
  })());
}

const AUDIT_FILE =
  'games/magic/fixtures/accuracy/mirage-onslaught/source-family-audit-tools.json.gz';
const AUDIT_HASH = '38e810a60f431b4cf0b0aecc676d62c2d259bda1bf88489c2edf3779dd64721e';
let auditChecked;
export function oldFrameAuditToolsDelta() {
  return (auditChecked ??= (async () => {
    const zipped = await fs.readFile(path.join(root, AUDIT_FILE));
    assert.equal(hash(zipped), AUDIT_HASH, 'Changed audit-routing receipt');
    const p = JSON.parse(gunzipSync(zipped));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'old-frame-audit-routing');
    assert.equal(p.familyAdapterReceipt, RECEIPT);
    assert.equal(Object.keys(p.files).length, 23);
    for (const [file, e] of Object.entries(p.files)) {
      assert(
        file.startsWith('games/magic/tools/accuracy/') &&
          (file.endsWith('ancestry.mjs') ||
            file.endsWith('/set-profile-check.mjs') ||
            file.endsWith('/wall-wording-data.mjs')),
      );
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    return p;
  })());
}

export async function preOldFrameSource(file, bytes) {
  const tools = await oldFrameAuditToolsDelta();
  const tool = tools.files[file];
  if (tool && hash(bytes) === tool.after) bytes = Buffer.from(tool.beforeSource);
  const p = await oldFrameSourceDelta(),
    e = p.files[file];
  if (!e || e.beforeSource === null || hash(bytes) !== e.after) return bytes;
  return Buffer.from(e.beforeSource);
}
export async function oldFrameHistoricalSourceFiles(files) {
  const p = await oldFrameSourceDelta(),
    kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await fs.readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}
/** The receipt changes no selected defaults. Foreign changes cannot reuse it. */
export async function oldFrameSourceRuntimeCompatible(directory, expected) {
  if (directory !== 'games/magic/src') return false;
  const p = await oldFrameSourceDelta();
  return (
    expected === p.beforeRenderer &&
    (await sourceHash(path.join(root, directory))) === p.afterRenderer
  );
}
