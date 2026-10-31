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
export async function preSoftwareFinishSource(file, bytes) {
  const e = (await softwareFinishProof()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
