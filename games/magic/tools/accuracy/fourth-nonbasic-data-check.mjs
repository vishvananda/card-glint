// Exact Fourth nonbasic-land layout and Original-wording history.
import assert from 'node:assert/strict';
import ts from 'typescript';
import { hash } from './common.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
export const fourthNonbasicPaths = {
  profile: 'games/magic/src/calibration/sets/4ed.ts',
  painter: 'games/magic/src/presentation/early-expansion-text.ts',
  payload: 'games/magic/src/data/sets/4ed.ts',
  aggregate: 'games/magic/src/data/eager.ts',
  wording: 'games/magic/src/data/wording/4ed.ts',
  wordingAggregate: 'games/magic/src/data/eager-wording.ts',
  metadata: 'games/magic/src/data/review-metadata.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  catalog: 'games/magic/fixtures/accuracy/printing-review-catalog.json',
  index: 'games/magic/fixtures/accuracy/review-source-index.json',
  outliers: 'games/magic/tools/accuracy/printed-text-outliers.mjs',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
  legacy: 'games/magic/tools/accuracy/fourth-basic-body-ancestry.mjs',
};
export const fourthNonbasicAnnotation =
  'games/magic/fixtures/accuracy/4ed/annotations-text-outliers.json';
export const fourthNonbasicModel = {
  bounds: { x: 72, y: 414, width: 344, height: 184 },
  regular: 22.5,
  textWidth: 1,
  threshold: 100,
  offset: 0,
  compact: 15.5,
  compactLeading: 1.2,
  regularLeading: 1,
  largeSize: 25,
  largeLeading: 1,
  largeOffset: -12,
  fractionalMetrics: true,
  unconstrained: { offset: -6, compact: 15.5, compactLeading: 1.2, minimumFreeSpace: 40 },
};
export const fourthNonbasicImport =
  "import { fourthNonbasicDelta, fourthNonbasicAffected } from './fourth-nonbasic-ancestry.mjs';\n";
export const fourthNonbasicHook = `        if (
          (await fourthNonbasicAffected(set.set, task, original, group)) &&
          item.proof?.fourthNonbasicSource !== (await fourthNonbasicDelta()).afterRenderer
        ) {
          item.status = 'needs-audit';
          item.reason =
            'Fourth Edition nonbasic-land bodies now use measured shared size classes; Mishra’s Factory also has an exact Original wording correction. Only affected body inputs, rules and whole-card evidence require current review.';
          continue;
        }
`;
export const fourthNonbasicLegacyImport =
  "import { preFourthNonbasicSource } from './fourth-nonbasic-ancestry.mjs';\n";
export const fourthNonbasicLegacyStep = '  bytes = await preFourthNonbasicSource(file, bytes);\n';
function metadata(text) {
  const source = ts.createSourceFile('metadata.ts', text, ts.ScriptTarget.Latest, true),
    fields = [];
  assert.equal(source.parseDiagnostics.length, 0);
  for (const s of source.statements) {
    assert(ts.isVariableStatement(s) && s.declarationList.flags & ts.NodeFlags.Const);
    assert.deepEqual(
      s.modifiers.map((m) => m.kind),
      [ts.SyntaxKind.ExportKeyword],
    );
    for (const d of s.declarationList.declarations) {
      assert(ts.isIdentifier(d.name));
      assert(
        ['printingCorrectionRevision', 'artistCreditRevision', 'reviewSources'].includes(
          d.name.text,
        ),
      );
      fields.push(JSON.stringify(d.name.text) + ':' + d.initializer.getText(source));
    }
  }
  assert.equal(fields.length, 3);
  return parseProfileData('export const profile={' + fields.join(',') + '};export const review={};')
    .profile;
}
export function validateFourthNonbasicData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-nonbasic-data');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(fourthNonbasicPaths).sort());
  for (const r of Object.values(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
  }
  const f = p.files,
    P = fourthNonbasicPaths;
  assert.equal(hash(p.annotation.source), p.annotation.sha256);
  const annotation = JSON.parse(p.annotation.source),
    ids = Object.keys(annotation.cards);
  assert.deepEqual(ids, ['aff8d4f1-eaad-4afb-9097-2afab133f707']);
  assert.deepEqual(p.wordingIds, ids);
  assert.equal(p.ids.length, 3);
  const review = annotation.cards[ids[0]];
  assert.equal(review.reviewed, true);
  assert.deepEqual(review.reviewedFields, ['rulesText']);
  assert(review.rulesText.startsWith('{T}: Add one colorless'));
  assert(review.rulesText.includes('\n{1}:'));
  assert.equal(review.paragraphs.length, 3);
  assert.equal(
    review.paragraphs.map((v) => v.runs.map((r) => r.text).join('')).join('\n'),
    review.rulesText,
  );
  const b = parseProfileData(f[P.profile].beforeSource),
    a = parseProfileData(f[P.profile].afterSource),
    restored = structuredClone(a);
  assert.equal(a.profile.revision, b.profile.revision + 1);
  assert.equal(a.review.revision, b.review.revision + 1);
  assert(!Object.hasOwn(b.profile, 'expansionBody'));
  assert.deepEqual(a.profile.expansionBody, fourthNonbasicModel);
  delete restored.profile.expansionBody;
  restored.profile.revision = b.profile.revision;
  restored.review.revision = b.review.revision;
  assert.equal(
    restored.review.evidence.pop(),
    'games/magic/fixtures/accuracy/4ed/nonbasic-body-adoption.json',
  );
  assert.deepEqual(restored, b, 'Unrelated Fourth profile changes');
  const painter = f[P.painter],
    oldGate = "  if (\n    (set !== 'arn' && set !== 'atq' && set !== 'drk') ||";
  const newGate =
    "  if (set !== 'arn' && set !== 'atq' && set !== 'drk' && set !== '4ed') return null;\n  const fourth = set === '4ed';\n  if (\n    (fourth && earlyReprintFrame(face)?.material !== 'L') ||";
  assert(painter.beforeSource.includes(oldGate));
  assert.equal(
    painter.afterSource,
    "import { earlyReprintFrame } from './early-reprint-frame.js';\n" +
      painter.beforeSource
        .replace(oldGate, newGate)
        .replace(
          "(face.borderColor && face.borderColor !== 'black')",
          "(face.borderColor && face.borderColor !== (fourth ? 'white' : 'black'))",
        )
        .replace(
          '  const p = calibrationForFace(face)?.expansionBody ?? profiles[set];',
          '  const p = calibrationForFace(face)?.expansionBody ?? (fourth ? undefined : profiles[set]);\n  if (!p) return null;',
        )
        .replace("  set: 'arn' | 'atq' | 'drk',", "  set: 'arn' | 'atq' | 'drk' | '4ed',"),
  );
  const restoreProfile = (data) => {
    const v = structuredClone(data);
    assert.equal(v.set, '4ed');
    assert.deepEqual(v.tables.setCalibrationProfiles['4ed'], a.profile);
    v.tables.setCalibrationProfiles['4ed'] = b.profile;
    return v;
  };
  assert.deepEqual(
    restoreProfile(eighthPayloadData(f[P.payload].afterSource)),
    eighthPayloadData(f[P.payload].beforeSource),
  );
  const aggregate = eighthAggregateData(f[P.aggregate].afterSource);
  assert.equal(aggregate.filter((v) => v.set === '4ed').length, 1);
  assert.deepEqual(
    aggregate.map((v) => (v.set === '4ed' ? restoreProfile(v) : v)),
    eighthAggregateData(f[P.aggregate].beforeSource),
  );
  const cb = JSON.parse(f[P.catalog].beforeSource),
    ca = JSON.parse(f[P.catalog].afterSource);
  const added = ca.wording[ids[0]].pop();
  assert.equal(added.source, fourthNonbasicAnnotation);
  assert.equal(added.referenceSha256, review.referenceHash);
  assert.equal(added.reason, review.reviewNote);
  assert.deepEqual(added.fields, {
    rulesText: review.rulesText,
    flavorText: review.flavorText,
    rulesParagraphs: review.paragraphs,
  });
  const newRevision = ca.revision;
  ca.revision = cb.revision;
  assert.deepEqual(ca, cb, 'Unrelated reviewed printing changed');
  const ib = JSON.parse(f[P.index].beforeSource),
    ia = JSON.parse(f[P.index].afterSource);
  assert.equal(ia.sources.pop(), fourthNonbasicAnnotation);
  assert.deepEqual(ia, ib);
  const restoreWording = (data) => {
    const v = structuredClone(data);
    assert.equal(v.set, '4ed');
    assert.equal(v.kind, 'wording');
    const row = v.tables.printingCorrections[ids[0]].pop();
    assert.deepEqual(row, {
      referenceSha256: review.referenceHash,
      fields: added.fields,
      evidence: ib.sources.length,
    });
    return v;
  };
  assert.deepEqual(
    restoreWording(eighthPayloadData(f[P.wording].afterSource)),
    eighthPayloadData(f[P.wording].beforeSource),
  );
  const wa = eighthAggregateData(f[P.wordingAggregate].afterSource);
  assert.equal(wa.filter((v) => v.set === '4ed').length, 1);
  assert.deepEqual(
    wa.map((v) => (v.set === '4ed' ? restoreWording(v) : v)),
    eighthAggregateData(f[P.wordingAggregate].beforeSource),
  );
  const mb = metadata(f[P.metadata].beforeSource),
    ma = structuredClone(metadata(f[P.metadata].afterSource));
  assert.equal(ma.printingCorrectionRevision, newRevision);
  assert.equal(ma.reviewSources.pop(), fourthNonbasicAnnotation);
  ma.printingCorrectionRevision = mb.printingCorrectionRevision;
  assert.deepEqual(ma, mb);
  const bm = JSON.parse(f[P.manifest].beforeSource),
    am = JSON.parse(f[P.manifest].afterSource);
  for (const file of [P.payload, P.aggregate, P.wording, P.wordingAggregate, P.metadata]) {
    assert.equal(am.files[file], f[file].after);
    assert.equal(bm.files[file], f[file].before);
    am.files[file] = bm.files[file];
  }
  for (const file of [P.profile, P.painter, P.catalog, P.index]) {
    assert.equal(am.sources[file], f[file].after);
    assert.equal(bm.sources[file], f[file].before);
    am.sources[file] = bm.sources[file];
  }
  assert.deepEqual(am, bm, 'Unrelated generated source changed');
  assert.equal(
    f[P.outliers].afterSource,
    "import fourth from '../../fixtures/accuracy/4ed/annotations-text-outliers.json' with { type: 'json' };\n" +
      f[P.outliers].beforeSource.replace(
        'const reviews = new Map([arabian, antiquities, dark].map((review) => [review.set, [review]]));',
        'const reviews = new Map(\n  [arabian, antiquities, dark, fourth].map((review) => [review.set, [review]]),\n);',
      ),
  );
  assert.equal(
    f[P.report].afterSource,
    fourthNonbasicImport +
      f[P.report].beforeSource.replace(
        '      for (const { task, item, original } of dependencies) {\n',
        '      for (const { task, item, original } of dependencies) {\n' + fourthNonbasicHook,
      ),
  );
  assert.equal(
    f[P.legacy].afterSource,
    fourthNonbasicLegacyImport +
      f[P.legacy].beforeSource.replace(
        'export async function preFourthBasicBodySource(file, bytes) {\n',
        'export async function preFourthBasicBodySource(file, bytes) {\n' +
          fourthNonbasicLegacyStep,
      ),
  );
  return {
    changedLayouts: 3,
    changedWording: 1,
    retainedBasicLayouts: 15,
    retainedOtherSets: true,
  };
}
