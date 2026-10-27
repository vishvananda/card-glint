// Exact data history for a shared body position, not whole-set certification.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
export const fourthBasicWordPaths = {
  profile: 'games/magic/src/calibration/sets/4ed.ts',
  payload: 'games/magic/src/data/sets/4ed.ts',
  aggregate: 'games/magic/src/data/eager.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
};
export function validateFourthBasicWordData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-shared-basic-word-data');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(fourthBasicWordPaths).sort());
  assert.deepEqual(p.policy, { size: 25, textWidth: 1.01, dx: -1.5, dy: 0 });
  for (const r of Object.values(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
  }
  const b = parseProfileData(p.files[fourthBasicWordPaths.profile].beforeSource),
    a = parseProfileData(p.files[fourthBasicWordPaths.profile].afterSource),
    restored = structuredClone(a);
  assert.equal(a.profile.revision, b.profile.revision + 1);
  assert.equal(a.review.revision, b.review.revision + 1);
  for (const color of ['W', 'U', 'B', 'R', 'G']) {
    const key = 'L-' + color;
    assert.equal(b.profile.body[key].bounds.x, 64);
    assert.equal(a.profile.body[key].bounds.x, 62.5);
    restored.profile.body[key].bounds.x = b.profile.body[key].bounds.x;
  }
  restored.profile.revision = b.profile.revision;
  restored.review.revision = b.review.revision;
  assert.equal(
    restored.review.evidence.pop(),
    'games/magic/fixtures/accuracy/4ed/basic-word-adoption.json',
  );
  assert.deepEqual(restored, b, 'Unrelated profile or review fields changed');
  const beforePayload = eighthPayloadData(p.files[fourthBasicWordPaths.payload].beforeSource),
    afterPayload = structuredClone(
      eighthPayloadData(p.files[fourthBasicWordPaths.payload].afterSource),
    );
  assert.equal(afterPayload.set, '4ed');
  assert.deepEqual(afterPayload.tables.setCalibrationProfiles['4ed'], a.profile);
  afterPayload.tables.setCalibrationProfiles['4ed'] = b.profile;
  assert.deepEqual(afterPayload, beforePayload, 'Unrelated generated payload changed');
  const beforeAggregate = eighthAggregateData(p.files[fourthBasicWordPaths.aggregate].beforeSource);
  const afterAggregate = structuredClone(
    eighthAggregateData(p.files[fourthBasicWordPaths.aggregate].afterSource),
  );
  const fourth = afterAggregate.filter((d) => d.set === '4ed');
  assert.equal(fourth.length, 1);
  assert.deepEqual(fourth[0].tables.setCalibrationProfiles['4ed'], a.profile);
  fourth[0].tables.setCalibrationProfiles['4ed'] = b.profile;
  assert.deepEqual(afterAggregate, beforeAggregate, 'Unrelated eager tables changed');
  const bm = JSON.parse(p.files[fourthBasicWordPaths.manifest].beforeSource),
    am = JSON.parse(p.files[fourthBasicWordPaths.manifest].afterSource);
  assert.equal(
    bm.files[fourthBasicWordPaths.payload],
    p.files[fourthBasicWordPaths.payload].before,
  );
  assert.equal(am.files[fourthBasicWordPaths.payload], p.files[fourthBasicWordPaths.payload].after);
  assert.equal(
    bm.sources[fourthBasicWordPaths.profile],
    p.files[fourthBasicWordPaths.profile].before,
  );
  assert.equal(
    am.sources[fourthBasicWordPaths.profile],
    p.files[fourthBasicWordPaths.profile].after,
  );
  am.files[fourthBasicWordPaths.payload] = bm.files[fourthBasicWordPaths.payload];
  assert.equal(
    bm.files[fourthBasicWordPaths.aggregate],
    p.files[fourthBasicWordPaths.aggregate].before,
  );
  assert.equal(
    am.files[fourthBasicWordPaths.aggregate],
    p.files[fourthBasicWordPaths.aggregate].after,
  );
  am.files[fourthBasicWordPaths.aggregate] = bm.files[fourthBasicWordPaths.aggregate];
  am.sources[fourthBasicWordPaths.profile] = bm.sources[fourthBasicWordPaths.profile];
  assert.deepEqual(am, bm, 'Unrelated generated manifest changed');
  assert.equal(hash(JSON.stringify(p.beforeInventory)), p.beforeRenderer);
  assert.equal(hash(JSON.stringify(p.afterInventory)), p.afterRenderer);
  const beforeMap = new Map(p.beforeInventory),
    afterMap = new Map(p.afterInventory);
  assert.deepEqual(
    [...beforeMap.keys()],
    [...afterMap.keys()],
    'Source inventory membership changed',
  );
  const changed = [];
  for (const [file, digest] of beforeMap)
    if (digest !== afterMap.get(file)) {
      const full = 'games/magic/src/' + file;
      changed.push(full);
      assert(p.files[full], 'Unlisted source change ' + full);
      assert.equal(p.files[full].before, digest);
      assert.equal(p.files[full].after, afterMap.get(file));
    }
  assert.deepEqual(changed.sort(), Object.keys(p.files).sort());
  assert.equal(p.ids.length, 20);
  assert.equal(new Set(p.ids).size, 20);
  assert.deepEqual(p.ids, [...p.ids].sort());
  return {
    profileMaterials: 5,
    xDelta: -1.5,
    nativeOriginals: 492,
    nativeVariants: 1968,
    changedOriginals: 20,
    unchangedVariants: 1948,
    sourceFiles: 4,
    otherProfileFieldsUnchanged: true,
  };
}
