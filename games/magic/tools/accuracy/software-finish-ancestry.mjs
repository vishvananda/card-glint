// Exact historical browser sources only. Current score identities remain current.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
let checked;
export function softwareFinishProof() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/software-finishes/source-history.json.gz',
    );
    assert.equal(hash(bytes), 'bf96652f1695127def53e408b46bf684918a1b0fbe1d8c4ae454d65ff994938b');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.kind, 'opt-in-software-finish-quality');
    assert.equal(p.scope, 'historical-browser-source-only-no-flat-face-score-approval');
    assert.equal(Object.keys(p.files).length, 5);
    for (const [file, e] of Object.entries(p.files)) {
      assert(file.startsWith('packages/browser/src/'), 'No game painter approval');
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    const pixels = await readFile(
      'games/magic/fixtures/accuracy/software-finishes/full-parity.json',
    );
    assert.equal(hash(pixels), '63b9641036ac526c281639dbe46ada8e16d97483e7cf81de18f03789295b82bb');
    const parity = JSON.parse(pixels);
    assert.deepEqual(parity.errors, []);
    assert.equal(parity.rows.length, 9);
    for (const finish of ['regular', 'gloss', 'prismatic']) {
      const rows = parity.rows.filter((r) => r.finish === finish);
      assert.deepEqual(
        rows.map((r) => r.label),
        ['baseline', 'default', 'full'],
      );
      assert.equal(new Set(rows.map((r) => r.hash)).size, 1, 'Changed default finish pixels');
    }
    return p;
  })());
}
let optimized;
export function softwareOptimizationProof() {
  return (optimized ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/software-finishes/optimization-history.json.gz',
    );
    assert.equal(hash(bytes), '013a93e29cae1073a9541d910098d0477c0c8a04c46918a8e3734a8c35a5dd78');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.kind, 'software-finish-program-optimization');
    assert.equal(p.scope, 'historical-browser-source-only-no-flat-face-score-approval');
    assert.equal(Object.keys(p.files).length, 10);
    for (const [file, e] of Object.entries(p.files)) {
      assert(file.startsWith('packages/browser/src/'), 'No game painter approval');
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    const pixels = await readFile(
      'games/magic/fixtures/accuracy/software-finishes/optimization-parity.json',
    );
    assert.equal(hash(pixels), '4b67850f9cac49cfd4d25bd316885f0d4cb618c5c1b3359f40e51bf496ef0b04');
    const parity = JSON.parse(pixels);
    assert.equal(parity.rows.length, 40);
    for (const r of parity.rows) assert.equal(r.max, 0, 'Changed full-quality pixels');
    assert.equal(parity.warmCompiles, 0);
    return p;
  })());
}
export async function preSoftwareOptimizationSource(file, bytes) {
  const e = (await softwareOptimizationProof()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function preSoftwareFinishSource(file, bytes) {
  bytes = await preSoftwareOptimizationSource(file, bytes);
  const e = (await softwareFinishProof()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
