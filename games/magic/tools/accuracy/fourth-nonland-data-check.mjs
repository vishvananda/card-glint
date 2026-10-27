import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
export const fourthNonlandPaths = {
  profile: 'games/magic/src/calibration/sets/4ed.ts',
  body: 'games/magic/src/calibration/body.ts',
  types: 'games/magic/src/calibration/types.ts',
  painter: 'games/magic/src/presentation/retro-rules.ts',
  editor: 'games/magic/src/calibration/editor.ts',
  controls: 'games/magic/src/calibration/editor-controls.ts',
  payload: 'games/magic/src/data/sets/4ed.ts',
  aggregate: 'games/magic/src/data/eager.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  checker: 'games/magic/tools/accuracy/set-profile-check.mjs',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
  legacy: 'games/magic/tools/accuracy/fourth-nonbasic-ancestry.mjs',
};
export const fourthNonlandModel = {
  materials: ['W', 'U', 'B', 'R', 'G', 'A'],
  bounds: { x: 72, y: 414, width: 344, height: 184 },
  typography: {
    fractionalMetrics: true,
    textWidth: 1,
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: false,
    flavorSeparator: false,
    centerOffset: -4,
  },
  centered: { maxCharacters: 130, maxLines: 6, size: 25 },
  compact: { nominalMinimum: 17.5, nominalMaximum: 21.75, size: 15.5, leading: 1.2 },
};
export const fourthNonlandImport =
  "import { fourthNonlandDelta, fourthNonlandAffected } from './fourth-nonland-ancestry.mjs';\n";
export const fourthNonlandHook = `        if (
          (await fourthNonlandAffected(set.set, task, original, group)) &&
          item.proof?.fourthNonlandSource !== (await fourthNonlandDelta()).afterRenderer
        ) {
          item.status = 'needs-audit';
          item.reason =
            'Fourth Edition nonland rules use measured size classes. Only affected rules and whole-card evidence require current review; wording, lands and other components retain their evidence.';
          continue;
        }
`;
export const fourthNonlandLegacyImport =
  "import { preFourthNonlandSource } from './fourth-nonland-ancestry.mjs';\n";
export const fourthNonlandLegacyStep = '  bytes = await preFourthNonlandSource(file, bytes);\n';
export function validateFourthNonlandData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-nonland-data');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(fourthNonlandPaths).sort());
  assert.equal(p.ids.length, 37);
  assert.equal(new Set(p.ids).size, 37);
  for (const r of Object.values(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
  }
  const f = p.files,
    P = fourthNonlandPaths;
  const b = parseProfileData(f[P.profile].beforeSource),
    a = parseProfileData(f[P.profile].afterSource);
  const restored = structuredClone(a);
  assert.equal(a.profile.revision, b.profile.revision + 1);
  assert.equal(a.review.revision, b.review.revision + 1);
  assert(!Object.hasOwn(b.profile, 'bodyClasses'));
  assert.deepEqual(a.profile.bodyClasses, fourthNonlandModel);
  delete restored.profile.bodyClasses;
  restored.profile.revision = b.profile.revision;
  restored.review.revision = b.review.revision;
  assert.equal(
    restored.review.evidence.pop(),
    'games/magic/fixtures/accuracy/4ed/nonland-body-adoption.json',
  );
  assert.deepEqual(restored, b, 'Unrelated profile component changed');
  const restore = (data) => {
    const v = structuredClone(data);
    assert.equal(v.set, '4ed');
    assert.deepEqual(v.tables.setCalibrationProfiles['4ed'], a.profile);
    v.tables.setCalibrationProfiles['4ed'] = b.profile;
    return v;
  };
  assert.deepEqual(
    restore(eighthPayloadData(f[P.payload].afterSource)),
    eighthPayloadData(f[P.payload].beforeSource),
  );
  const aggregate = eighthAggregateData(f[P.aggregate].afterSource);
  assert.equal(aggregate.filter((v) => v.set === '4ed').length, 1);
  assert.deepEqual(
    aggregate.map((v) => (v.set === '4ed' ? restore(v) : v)),
    eighthAggregateData(f[P.aggregate].beforeSource),
  );
  const mb = JSON.parse(f[P.manifest].beforeSource),
    ma = JSON.parse(f[P.manifest].afterSource);
  for (const file of [P.payload, P.aggregate]) {
    assert.equal(ma.files[file], f[file].after);
    assert.equal(mb.files[file], f[file].before);
    ma.files[file] = mb.files[file];
  }
  for (const file of [P.profile, P.body, P.types, P.painter, P.editor, P.controls]) {
    if (!Object.hasOwn(ma.sources, file)) continue;
    assert.equal(ma.sources[file], f[file].after);
    assert.equal(mb.sources[file], f[file].before);
    ma.sources[file] = mb.sources[file];
  }
  assert.deepEqual(ma, mb, 'Unrelated generated source changed');
  assert.equal(
    f[P.report].afterSource,
    fourthNonlandImport +
      f[P.report].beforeSource.replace(
        '      for (const { task, item, original } of dependencies) {\n',
        '      for (const { task, item, original } of dependencies) {\n' + fourthNonlandHook,
      ),
  );
  assert.equal(
    f[P.legacy].afterSource,
    fourthNonlandLegacyImport +
      f[P.legacy].beforeSource.replace(
        'export async function preFourthNonbasicSource(file, bytes) {\n',
        'export async function preFourthNonbasicSource(file, bytes) {\n' + fourthNonlandLegacyStep,
      ),
  );
  return {
    changedOriginalBodies: 37,
    retainedOriginalBodies: 341,
    retainedLands: 18,
    wordingChanges: 0,
    retainedOtherSets: true,
  };
}
