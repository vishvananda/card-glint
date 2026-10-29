// Reviewed source compatibility, never a calibration or score approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/arn-recheck/symbol-roles-076.json.gz';
const SHA = '2bfed1e623b0b07b9089fde7b28a62d9358a73d9a0c1d549271af92e45b887b3';
let checked;
export function arnSymbolRoleDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed symbol-role receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.kind, 'arn-symbol-role-and-placement');
    assert.deepEqual(p.affectedSets, ['arn']);
    assert.equal(
      p.beforeRenderer,
      '92d25748fe582f8f13d70714909a8c78acbea9d516c443abef7b2e0c8259216c',
    );
    for (const e of Object.values(p.files)) {
      assert.match(e.after, /^[a-f0-9]{64}$/);
      assert.equal(e.beforeSource === null ? null : hash(e.beforeSource), e.before);
    }
    const { native, controls, metadataOnly } = p;
    assert.equal(native.source.beforeRenderer, p.beforeRenderer);
    assert.deepEqual(native.summary, {
      cards: 92,
      renders: 276,
      changed: 107,
      alpha: 0,
      outside: 0,
    });
    assert.equal(native.rows.length, 276);
    assert.equal(new Set(native.rows.map((r) => r.id)).size, 92);
    for (const mode of ['original', 'oracle-original', 'oracle-modern']) {
      const rows = native.rows.filter((r) => r.mode === mode);
      assert.equal(rows.length, 92);
      assert.equal(rows.filter((r) => r.changed).length, mode === 'oracle-modern' ? 83 : 12);
      for (const r of rows) {
        assert.match(r.before, /^[a-f0-9]{64}$/);
        assert.match(r.after, /^[a-f0-9]{64}$/);
        assert.equal(r.alpha, 0);
        assert.equal(r.outside, 0);
      }
    }
    assert.equal(controls.beforeHash, p.beforeRenderer);
    assert.equal(controls.afterHash, native.source.afterRenderer);
    assert.equal(controls.count, 182);
    assert.equal(controls.changed, 0);
    assert.equal(controls.rows.length, 182);
    for (const row of controls.rows) {
      assert.match(row.inputHash, /^[a-f0-9]{64}$/);
      assert.match(row.sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(
      hash(
        await fs.readFile(
          path.join(root, 'games/magic/tools/accuracy/printing-symbol-mode-audit.mjs'),
        ),
      ),
      native.source.toolHash,
    );
    assert.equal(
      hash(
        await fs.readFile(
          path.join(root, 'games/magic/tools/accuracy/old-frame-release-controls.mjs'),
        ),
      ),
      controls.source.toolHash,
    );
    const profile = 'games/magic/src/calibration/sets/arn.ts';
    assert.deepEqual(
      Object.keys(metadataOnly.files).sort(),
      [profile, 'games/magic/src/data/generated-manifest.json'].sort(),
    );
    for (const [file, e] of Object.entries(metadataOnly.files)) {
      assert.equal(hash(e.nativeSource), e.nativeHash);
      assert.equal(e.nativeHash, native.files[file].after);
      assert.equal(e.after, p.files[file].after);
    }
    return p;
  })());
}
export async function preArnSymbolRoleSource(file, bytes) {
  const e = (await arnSymbolRoleDelta()).files[file];
  return e && e.beforeSource !== null && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
export async function arnSymbolRoleHistoricalFiles(files) {
  const p = await arnSymbolRoleDelta(),
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
export async function arnSymbolRoleRuntimeParent(actual, set) {
  const p = await arnSymbolRoleDelta();
  return actual === p.afterRenderer && set && set.toLowerCase() !== 'arn'
    ? p.beforeRenderer
    : actual;
}
