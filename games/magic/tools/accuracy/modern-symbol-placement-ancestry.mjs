// Compatibility for Original accuracy measurements, never Oracle-modern faces.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';

const FILE = 'games/magic/fixtures/accuracy/modern-symbol-placement/review.json.gz';
const SHA = '7358587ee5075dc0f91f59238e954cb27a8842a1f41215c5b12284b28062d403';
let checked;
export function modernSymbolPlacementDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed modern-symbol placement proof');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'modern-retro-cost-geometry');
    assert.deepEqual(p.native.summary, {
      cards: 216,
      renders: 648,
      changed: 180,
      alpha: 0,
      outside: 0,
    });
    assert.equal(p.native.rows.length, 648);
    for (const row of p.native.rows) {
      assert.equal(row.alpha, 0);
      assert.equal(row.outside, 0);
      assert(['original', 'oracle-original', 'oracle-modern'].includes(row.mode));
      if (row.mode !== 'oracle-modern') {
        assert.equal(row.before, row.after);
        assert.equal(row.changed, 0);
      }
    }
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.match(e.after, /^[a-f0-9]{64}$/);
    }
    assert.equal(p.configuration.sets, 278);
    assert.equal(p.configuration.variants, 16885);
    assert.equal(p.configuration.originalChanges, 0);
    assert.equal(p.configuration.afterDifferences, 0);
    assert.equal(p.configuration.source.beforeRenderer, p.beforeRenderer);
    assert.equal(p.configuration.source.afterRenderer, p.afterRenderer);
    return p;
  })());
}
export async function preModernSymbolPlacementSource(file, bytes) {
  const e = (await modernSymbolPlacementDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function originalSymbolPlacementRuntimeParent(actual) {
  const p = await modernSymbolPlacementDelta();
  return actual === p.afterRenderer ? p.beforeRenderer : actual;
}
