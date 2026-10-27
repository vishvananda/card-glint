import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
import { fourthCenteredSourcePatches } from './fourth-centered-source-patches.mjs';
export const centeredPaths = {
  profile: 'games/magic/src/calibration/sets/4ed.ts',
  selector: 'games/magic/src/presentation/retro-rules.ts',
  types: 'games/magic/src/calibration/types.ts',
  builder: 'games/magic/tools/build-printing-corrections.mjs',
  annotation: 'games/magic/fixtures/accuracy/4ed/annotations-typography.json',
  catalog: 'games/magic/fixtures/accuracy/printing-review-catalog.json',
  index: 'games/magic/fixtures/accuracy/review-source-index.json',
  payload: 'games/magic/src/data/sets/4ed.ts',
  aggregate: 'games/magic/src/data/eager.ts',
  wording: 'games/magic/src/data/wording/4ed.ts',
  wordAggregate: 'games/magic/src/data/eager-wording.ts',
  metadata: 'games/magic/src/data/review-metadata.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
  legacy: 'games/magic/tools/accuracy/wall-wording-data.mjs',
};
export const centeredBodyModel = {
  bounds: { x: 72, y: 424, width: 344, height: 164 },
  maximumSize: 26,
  minimumSize: 15,
  typography: {
    fractionalMetrics: true,
    textWidth: 0.97,
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: false,
    flavorSeparator: false,
    centerOffset: -4,
    balanceLines: true,
    balanceCenteredOnly: true,
  },
};
export const centeredReportImport =
  "import { fourthCenteredAffected, fourthCenteredApproval } from './fourth-centered-ancestry.mjs';\n";
export const centeredReportHook = `        if (
          (await fourthCenteredAffected(set.set, task, original, group)) &&
          !(await fourthCenteredApproval(item, group))
        ) {
          item.status = 'needs-audit';
          item.reason =
            'Reviewed Original paragraph alignment selects the shared centered body profile. Changed rules/flavor and whole-card evidence needs the current native census; unchanged words, other components and printing groups retain their reviews.';
          continue;
        }
`;
export const centeredLegacyImport =
  "import { preFourthCenteredSource } from './fourth-centered-ancestry.mjs';\n";
export const centeredLegacyStep = '  bytes = await preFourthCenteredSource(file, bytes);\n';
export function validateFourthCenteredData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-reviewed-centering-data');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(centeredPaths).sort());
  assert.equal(p.members.length, 12);
  assert.equal(new Set(p.members.map((m) => m.id)).size, 12);
  assert.deepEqual(p.ids, p.members.map((m) => m.id).sort());
  const P = centeredPaths,
    f = p.files;
  for (const [file, r] of Object.entries(f)) {
    assert.equal(hash(r.afterSource), r.after);
    if (file === P.annotation) {
      assert.equal(r.beforeSource, null);
      assert.equal(r.before, null);
    } else assert.equal(hash(r.beforeSource), r.before);
  }
  const before = parseProfileData(f[P.profile].beforeSource),
    after = parseProfileData(f[P.profile].afterSource),
    restored = structuredClone(after);
  assert.equal(after.profile.revision, before.profile.revision + 1);
  assert.equal(after.review.revision, before.review.revision + 1);
  assert(!before.profile.body.centered);
  assert.deepEqual(after.profile.body.centered, centeredBodyModel);
  delete restored.profile.body.centered;
  restored.profile.revision--;
  restored.review.revision--;
  assert.equal(
    restored.review.evidence.pop(),
    'games/magic/fixtures/accuracy/4ed/reviewed-centering-adoption.json',
  );
  assert.deepEqual(restored, before, 'Unrelated profile component changed');
  const annotation = JSON.parse(f[P.annotation].afterSource);
  assert.deepEqual(Object.keys(annotation.cards).sort(), p.ids);
  for (const m of p.members) {
    const r = annotation.cards[m.id];
    assert.equal(r.name, m.name);
    assert.equal(r.referenceHash, m.referenceHash);
    assert.equal(r.reviewed, true);
    assert.deepEqual(r.reviewedFields, []);
    assert(r.paragraphs.every((p) => p.align === 'center'));
    assert.deepEqual(
      r.paragraphs.map(({ align, ...p }) => p),
      m.paragraphsBefore,
    );
    assert.equal(
      r.paragraphScope,
      m.paragraphsBefore.every((p) => p.role === 'rules') ? 'rules-only' : undefined,
    );
  }
  for (const [file, patches] of Object.entries(fourthCenteredSourcePatches)) {
    let value = f[file].beforeSource;
    for (const [from, to] of patches) {
      assert.equal(value.split(from).length, 2);
      value = value.replace(from, to);
    }
    assert.equal(value, f[file].afterSource, 'Unknown implementation change: ' + file);
  }
  const bc = JSON.parse(f[P.catalog].beforeSource),
    ac = JSON.parse(f[P.catalog].afterSource),
    rc = structuredClone(ac);
  for (const m of p.members) {
    const r = ac.wording[m.id].filter((r) => r.source === P.annotation);
    assert.equal(r.length, 1);
    assert.deepEqual(r[0].fields, { rulesParagraphs: annotation.cards[m.id].paragraphs });
    assert.equal(r[0].paragraphScope, annotation.cards[m.id].paragraphScope);
    assert.equal(r[0].referenceSha256, m.referenceHash);
    rc.wording[m.id] = bc.wording[m.id];
  }
  rc.revision = bc.revision;
  assert.deepEqual(rc, bc, 'Unrelated wording or artist changed');
  const bi = JSON.parse(f[P.index].beforeSource),
    ai = JSON.parse(f[P.index].afterSource);
  assert.deepEqual(ai, { ...bi, sources: [...bi.sources, P.annotation] });
  const restore = (value, previous) => {
    const v = structuredClone(value);
    assert.equal(v.set, '4ed');
    if (v.kind === 'calibration') {
      assert.deepEqual(v.tables.setCalibrationProfiles['4ed'], after.profile);
      v.tables.setCalibrationProfiles['4ed'] = before.profile;
    } else {
      assert.equal(v.kind, 'wording');
      for (const id of p.ids)
        v.tables.printingCorrections[id] = previous.tables.printingCorrections[id];
    }
    return v;
  };
  for (const file of [P.payload, P.wording]) {
    const b = eighthPayloadData(f[file].beforeSource),
      a = eighthPayloadData(f[file].afterSource);
    assert.deepEqual(restore(a, b), b);
  }
  for (const file of [P.aggregate, P.wordAggregate]) {
    const b = eighthAggregateData(f[file].beforeSource),
      a = eighthAggregateData(f[file].afterSource);
    assert.deepEqual(
      a.map((v) =>
        v.set === '4ed'
          ? restore(
              v,
              b.find((x) => x.set === v.set && x.kind === v.kind),
            )
          : v,
      ),
      b,
    );
  }
  assert.equal(
    f[P.metadata].afterSource
      .replace(ac.revision, bc.revision)
      .replace("  '" + P.annotation + "',\n", ''),
    f[P.metadata].beforeSource,
  );
  const bm = JSON.parse(f[P.manifest].beforeSource),
    am = JSON.parse(f[P.manifest].afterSource);
  for (const kind of ['sources', 'files']) {
    assert.deepEqual(Object.keys(am[kind]), Object.keys(bm[kind]));
    for (const [file, h] of Object.entries(am[kind])) {
      if (h === bm[kind][file]) continue;
      assert(f[file], 'Unknown generated dependency ' + file);
      assert.equal(h, f[file].after);
      assert.equal(bm[kind][file], f[file].before);
      am[kind][file] = bm[kind][file];
    }
  }
  assert.deepEqual(am, bm);
  assert.equal(
    f[P.report].afterSource,
    centeredReportImport +
      f[P.report].beforeSource.replace(
        '      for (const { task, item, original } of dependencies) {\n',
        '      for (const { task, item, original } of dependencies) {\n' + centeredReportHook,
      ),
  );
  assert.equal(
    f[P.legacy].afterSource,
    centeredLegacyImport +
      f[P.legacy].beforeSource.replace(
        'export async function preWallWordingSource(file, bytes) {\n',
        'export async function preWallWordingSource(file, bytes) {\n' + centeredLegacyStep,
      ),
  );
  return {
    changedPrintings: 12,
    wordChanges: 0,
    paragraphBoundaryChanges: 0,
    frameOrColorChanges: 0,
    sharedBodyVariants: 1,
  };
}
