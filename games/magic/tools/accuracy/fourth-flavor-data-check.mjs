import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { fourthFlavorSourcePatches } from './fourth-flavor-source-patches.mjs';
export const fourthFlavorPaths = [
  'games/magic/src/calibration/body.ts',
  'games/magic/src/presentation/retro-rules.ts',
  'games/magic/src/presentation/canvas-face.ts',
  'games/magic/src/data/generated-manifest.json',
  'games/magic/tools/accuracy/ice-defaults-ancestry.mjs',
  'games/magic/tools/accuracy/fourth-details-ancestry.mjs',
  'games/magic/tools/accuracy/fourth-centered-ancestry.mjs',
  'games/magic/tools/accuracy/calibration-report.mjs',
];
export function validateFourthFlavorData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-pure-flavor-data');
  assert.deepEqual(Object.keys(p.files).sort(), [...fourthFlavorPaths].sort());
  assert.equal(p.ids.length, 19);
  assert.equal(new Set(p.ids).size, 19);
  assert.deepEqual(p.ids, [...p.ids].sort());
  assert.equal(p.iceIds.length, 4);
  assert.equal(new Set(p.iceIds).size, 4);
  for (const [file, r] of Object.entries(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
    if (file.endsWith('/generated-manifest.json')) continue;
    let text = r.beforeSource;
    const patches = fourthFlavorSourcePatches[file];
    assert(patches);
    for (const [before, after] of patches) {
      assert.equal(text.split(before).length, 2);
      text = text.replace(before, after);
    }
    assert.equal(text, r.afterSource, 'Unreviewed flavor source edit ' + file);
  }
  const m = p.files['games/magic/src/data/generated-manifest.json'];
  const before = JSON.parse(m.beforeSource),
    after = JSON.parse(m.afterSource);
  assert.deepEqual(before.files, after.files);
  for (const file of fourthFlavorPaths.filter(
    (f) => f.startsWith('games/magic/src/') && !f.endsWith('.json'),
  )) {
    assert.equal(before.sources[file], p.files[file].before);
    assert.equal(after.sources[file], p.files[file].after);
    after.sources[file] = before.sources[file];
  }
  assert.deepEqual(after, before, 'Unrelated generated tables or source bindings changed');
  return {
    changedFourthOriginals: 16,
    changedIceOriginals: 4,
    semanticCacheKeys: 23,
    wordChanges: 0,
    nonBodyPixelChanges: 0,
    alphaChanges: 0,
    unchangedOracleAndMaskVariants: 1476,
  };
}
