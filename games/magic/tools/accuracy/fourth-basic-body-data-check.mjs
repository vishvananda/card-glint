// Inert profile changes must retain every unrelated set,field and generated table.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
export const fourthBodyPaths = {
  profile: 'games/magic/src/calibration/sets/4ed.ts',
  payload: 'games/magic/src/data/sets/4ed.ts',
  aggregate: 'games/magic/src/data/eager.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
  legacy: 'games/magic/tools/accuracy/leg-artist-data-ancestry.mjs',
};
export const fourthBodyReportImport =
  "import { fourthBasicBodyDelta, fourthBasicBodyAffected } from './fourth-basic-body-ancestry.mjs';\n";
export const fourthBodyReportHook = `        if (
          (await fourthBasicBodyAffected(set.set, task, original, group)) &&
          item.proof?.fourthBasicBodySource !== (await fourthBasicBodyDelta()).afterRenderer
        ) {
          item.status = 'needs-audit';
          item.reason =
            'Fourth Edition basic-land Original text now uses the shared measured body layout. Rules and whole-card evidence for these printings needs current renders; wording,other components and other materials retain their evidence.';
          continue;
        }
`;
export const fourthBodyLegacyImport =
  "import { preFourthBasicBodySource } from './fourth-basic-body-ancestry.mjs';\n";
export const fourthBodyLegacyStep = '  bytes = await preFourthBasicBodySource(file, bytes);\n';
export function validateFourthBasicBodyData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-basic-body-data-only');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(fourthBodyPaths).sort());
  for (const r of Object.values(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
  }
  assert.equal(hash(p.proposal.source), p.proposal.sha256);
  const proposal = JSON.parse(p.proposal.source);
  assert.equal(proposal.status, 'candidate-not-adopted');
  assert.equal(proposal.rows.length, 15);
  assert.deepEqual(p.ids, proposal.rows.map((r) => r.id).sort());
  const f = p.files,
    b = parseProfileData(f[fourthBodyPaths.profile].beforeSource),
    a = parseProfileData(f[fourthBodyPaths.profile].afterSource),
    restored = structuredClone(a);
  assert.equal(a.profile.revision, b.profile.revision + 1);
  assert.equal(a.review.revision, b.review.revision + 1);
  assert(!Object.hasOwn(b.profile, 'body'));
  assert.deepEqual(Object.keys(a.profile.body).sort(), ['L-B', 'L-G', 'L-R', 'L-U', 'L-W']);
  for (const body of Object.values(a.profile.body)) assert.deepEqual(body, proposal.proposedBody);
  delete restored.profile.body;
  restored.profile.revision = b.profile.revision;
  restored.review.revision = b.review.revision;
  assert.equal(
    restored.review.evidence.pop(),
    'games/magic/fixtures/accuracy/4ed/basic-body-proposal.json',
  );
  assert.deepEqual(restored, b, 'Unrelated Fourth profile field changed');
  const restorePayload = (d) => {
    const n = structuredClone(d);
    assert.equal(n.set, '4ed');
    assert.deepEqual(n.tables.setCalibrationProfiles['4ed'], a.profile);
    n.tables.setCalibrationProfiles['4ed'] = b.profile;
    return n;
  };
  assert.deepEqual(
    restorePayload(eighthPayloadData(f[fourthBodyPaths.payload].afterSource)),
    eighthPayloadData(f[fourthBodyPaths.payload].beforeSource),
  );
  const afterAggregate = eighthAggregateData(f[fourthBodyPaths.aggregate].afterSource);
  assert.equal(afterAggregate.filter((d) => d.set === '4ed').length, 1);
  assert.deepEqual(
    afterAggregate.map((d) => (d.set === '4ed' ? restorePayload(d) : d)),
    eighthAggregateData(f[fourthBodyPaths.aggregate].beforeSource),
  );
  const bm = JSON.parse(f[fourthBodyPaths.manifest].beforeSource),
    am = JSON.parse(f[fourthBodyPaths.manifest].afterSource);
  for (const file of [fourthBodyPaths.payload, fourthBodyPaths.aggregate]) {
    assert.equal(am.files[file], f[file].after);
    assert.equal(bm.files[file], f[file].before);
    am.files[file] = bm.files[file];
  }
  assert.equal(am.sources[fourthBodyPaths.profile], f[fourthBodyPaths.profile].after);
  assert.equal(bm.sources[fourthBodyPaths.profile], f[fourthBodyPaths.profile].before);
  am.sources[fourthBodyPaths.profile] = bm.sources[fourthBodyPaths.profile];
  assert.deepEqual(am, bm, 'Unrelated generated manifest changes');
  const report = f[fourthBodyPaths.report];
  assert.equal(
    report.afterSource,
    fourthBodyReportImport +
      report.beforeSource.replace(
        '      for (const { task, item, original } of dependencies) {\n',
        '      for (const { task, item, original } of dependencies) {\n' + fourthBodyReportHook,
      ),
  );
  const legacy = f[fourthBodyPaths.legacy];
  assert.equal(
    legacy.afterSource,
    fourthBodyLegacyImport +
      legacy.beforeSource.replace(
        'export async function preLegArtistDataSource(file, bytes) {\n',
        'export async function preLegArtistDataSource(file, bytes) {\n' + fourthBodyLegacyStep,
      ),
  );
  return {
    profileMaterials: 5,
    changedPrintings: 15,
    retainedOtherMaterials: true,
    retainedOtherSets: true,
  };
}
