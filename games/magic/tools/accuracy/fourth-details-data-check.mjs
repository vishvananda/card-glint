import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { fourthDetailsSourcePatches } from './fourth-details-source-patches.mjs';
export const fourthDetailsPaths = {
  details: 'games/magic/src/presentation/retro-details.ts',
  key: 'games/magic/src/presentation/canvas-face.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
  ancestor: 'games/magic/tools/accuracy/fourth-centered-ancestry.mjs',
};
export function validateFourthDetailsData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-semantic-details-data');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(fourthDetailsPaths).sort());
  assert.equal(p.ids.length, 7);
  assert.equal(new Set(p.ids).size, 7);
  assert.deepEqual(p.ids, [...p.ids].sort());
  for (const [file, r] of Object.entries(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
    if (file === fourthDetailsPaths.manifest) continue;
    const patches = fourthDetailsSourcePatches[file];
    assert(patches);
    let text = r.beforeSource;
    for (const [before, after] of patches) {
      assert.equal(text.split(before).length, 2);
      text = text.replace(before, after);
    }
    assert.equal(text, r.afterSource, 'Unknown semantic-detail source edit ' + file);
  }
  const e = p.files[fourthDetailsPaths.manifest],
    before = JSON.parse(e.beforeSource),
    after = JSON.parse(e.afterSource);
  assert.deepEqual(before.files, after.files);
  for (const k of [fourthDetailsPaths.details, fourthDetailsPaths.key]) {
    assert.equal(before.sources[k], p.files[k].before);
    assert.equal(after.sources[k], p.files[k].after);
    after.sources[k] = before.sources[k];
  }
  assert.deepEqual(after, before, 'Unrelated generated data changed');
  return {
    changedPrintings: 7,
    wordChanges: 0,
    frameOrColorChanges: 0,
    changedCacheKeys: 7,
    unchangedOracleKeys: 756,
    unchangedEtchingKeys: 378,
  };
}
