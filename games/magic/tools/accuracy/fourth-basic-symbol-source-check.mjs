import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
import {
  fourthBasicSymbolCodeEdits,
  reviewedFourthBasicSymbolCode,
} from './fourth-basic-symbol-code.mjs';

export const fourthBasicSymbolPaths = {
  profile: 'games/magic/src/calibration/sets/4ed.ts',
  payload: 'games/magic/src/data/sets/4ed.ts',
  aggregate: 'games/magic/src/data/eager.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
};
export async function validateFourthBasicSymbolSource(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.status, 'native-fourth-basic-symbol-baseline');
  assert.deepEqual(p.policy, { symbolOffsetY: -0.1 });
  assert.deepEqual(
    Object.keys(p.files).sort(),
    [...Object.values(fourthBasicSymbolPaths), ...Object.keys(fourthBasicSymbolCodeEdits)].sort(),
  );
  for (const [file, r] of Object.entries(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
    if (fourthBasicSymbolCodeEdits[file])
      assert.equal(
        r.afterSource,
        await reviewedFourthBasicSymbolCode(file, r.beforeSource),
        'Unreviewed runtime edit ' + file,
      );
  }
  const profile = p.files[fourthBasicSymbolPaths.profile];
  const b = parseProfileData(profile.beforeSource),
    a = parseProfileData(profile.afterSource),
    restored = structuredClone(a);
  assert.equal(b.profile.revision, 6);
  assert.equal(a.profile.revision, 7);
  assert.equal(b.review.revision, 6);
  assert.equal(a.review.revision, 7);
  for (const color of ['W', 'U', 'B', 'R', 'G']) {
    const body = restored.profile.body['L-' + color];
    assert.equal(body.typography.symbolOffsetY, -0.1);
    assert.equal(b.profile.body['L-' + color].typography.symbolOffsetY, undefined);
    delete body.typography.symbolOffsetY;
  }
  restored.profile.revision = 6;
  restored.review.revision = 6;
  assert.equal(
    restored.review.evidence.pop(),
    'games/magic/fixtures/accuracy/4ed/basic-symbol-adoption.json',
  );
  assert.deepEqual(restored, b, 'Unrelated profile or review changed');
  const payload = p.files[fourthBasicSymbolPaths.payload];
  const pb = eighthPayloadData(payload.beforeSource),
    pa = structuredClone(eighthPayloadData(payload.afterSource));
  assert.equal(pa.set, '4ed');
  assert.deepEqual(pa.tables.setCalibrationProfiles['4ed'], a.profile);
  pa.tables.setCalibrationProfiles['4ed'] = b.profile;
  assert.deepEqual(pa, pb, 'Unrelated payload changed');
  const aggregate = p.files[fourthBasicSymbolPaths.aggregate];
  const eb = eighthAggregateData(aggregate.beforeSource),
    ea = structuredClone(eighthAggregateData(aggregate.afterSource));
  const fourth = ea.filter((d) => d.set === '4ed');
  assert.equal(fourth.length, 1);
  assert.deepEqual(fourth[0].tables.setCalibrationProfiles['4ed'], a.profile);
  fourth[0].tables.setCalibrationProfiles['4ed'] = b.profile;
  assert.deepEqual(ea, eb, 'Unrelated eager data changed');
  const manifest = p.files[fourthBasicSymbolPaths.manifest];
  const mb = JSON.parse(manifest.beforeSource),
    ma = JSON.parse(manifest.afterSource);
  for (const [file, r] of Object.entries(p.files))
    for (const kind of ['sources', 'files']) {
      if (!(file in mb[kind]) && !(file in ma[kind])) continue;
      assert.equal(mb[kind][file], r.before, 'Before manifest identity ' + file);
      assert.equal(ma[kind][file], r.after, 'After manifest identity ' + file);
      ma[kind][file] = mb[kind][file];
    }
  assert.deepEqual(ma, mb, 'Unrelated manifest identities changed');
  assert.equal(hash(JSON.stringify(p.beforeInventory)), p.beforeRenderer);
  assert.equal(hash(JSON.stringify(p.afterInventory)), p.afterRenderer);
  const bm = new Map(p.beforeInventory),
    am = new Map(p.afterInventory);
  assert.deepEqual([...bm.keys()], [...am.keys()]);
  const changed = [];
  for (const [file, digest] of bm)
    if (am.get(file) !== digest) {
      const full = 'games/magic/src/' + file;
      assert(p.files[full], 'Unlisted source ' + full);
      assert.equal(p.files[full].before, digest);
      assert.equal(p.files[full].after, am.get(file));
      changed.push(full);
    }
  assert.deepEqual(changed.sort(), Object.keys(p.files).sort());
  assert.equal(p.ids.length, 20);
  assert.equal(new Set(p.ids).size, 20);
  assert.deepEqual(p.ids, [...p.ids].sort());
  return {
    sourceFiles: 8,
    profileMaterials: 5,
    symbolOffsetY: -0.1,
    otherProfileFieldsUnchanged: true,
    defaultRuntimeFieldsOptional: true,
  };
}
