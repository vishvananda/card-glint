import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const root = 'games/magic/fixtures/accuracy/';
let verification;
export async function unlimitedProfileProof() {
  verification ??= (async () => {
    const p = JSON.parse(await readFile(root + 'unlimited-profile-compatibility.json'));
    const evidence = async (file, digest) => {
      const bytes = await readFile(root + file);
      assert.equal(hash(bytes), digest);
      return JSON.parse(gunzipSync(bytes));
    };
    const controls = await evidence(p.evidence, p.evidenceHash),
      inputs = await evidence(p.controlsInput, p.controlsInputHash),
      capture = await evidence(p.nativeScope, p.nativeScopeHash);
    assert.equal(controls.baselineCommit, p.baselineCommit);
    assert.equal(controls.logicalCards, 1593);
    assert.equal(controls.nativeCards, 210);
    assert.equal(controls.logical.length, inputs.entries.length);
    assert.equal(new Set(controls.logical.map((r) => r.id)).size, 1593);
    assert.equal(new Set(controls.native.map((r) => r.id)).size, 210);
    for (const row of [...controls.logical, ...controls.native])
      assert.equal(row.before, row.after);
    for (const row of controls.native) assert.equal(row.changed, 0);
    for (const entry of inputs.entries) {
      assert.notEqual(entry.face.setCode, '2ed');
      assert.ok(controls.logical.some((row) => row.id === entry.id));
    }
    assert.equal(capture.complete, true);
    assert.equal(capture.rows.length, 302);
    for (const row of capture.rows) {
      assert.equal(row.outside, 0);
      assert.equal(row.silhouette, 0);
      assert.equal(row.artworkChanged, 0);
    }
    for (const [file, digest] of Object.entries(p.dependencies))
      assert.equal(
        hash(await readFile(file)),
        digest,
        'Unreviewed shared Unlimited adapter: ' + file,
      );
    assert.equal(hash(p.generatedScopes.beforeSource), p.generatedScopes.before);
    return p;
  })();
  return verification;
}

/** Restore historical painter code, keeping numerical set profiles independently
 * editable. Generated scope metadata has its own current authoritative check. */
export async function preUnlimitedProfileSource(file) {
  const p = await unlimitedProfileProof();
  if (file === p.generatedScopes.file) {
    const manifest = JSON.parse(await readFile('games/magic/src/data/generated-manifest.json'));
    for (const [name, digest] of Object.entries({ ...manifest.sources, ...manifest.files }))
      assert.equal(hash(await readFile(name)), digest, 'Stale generated data: ' + name);
    return Buffer.from(p.generatedScopes.beforeSource);
  }
  const bytes = await readFile(file),
    change = p.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const old = Buffer.from(lines.join(''));
  assert.equal(hash(old), change.before);
  return old;
}
