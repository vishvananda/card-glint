// A reviewed physical paragraph break, not a printing-specific layout override.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
export const fourthParagraphId = 'f5a8573d-0e2d-4a7f-a47f-7e1bc472d4fa';
export const fourthParagraphPaths = {
  annotation: 'games/magic/fixtures/accuracy/4ed/annotations-text-outliers.json',
  catalog: 'games/magic/fixtures/accuracy/printing-review-catalog.json',
  payload: 'games/magic/src/data/wording/4ed.ts',
  aggregate: 'games/magic/src/data/eager-wording.ts',
  metadata: 'games/magic/src/data/review-metadata.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
  legacy: 'games/magic/tools/accuracy/fourth-nonland-ancestry.mjs',
};
export const fourthParagraphImport =
  "import { fourthParagraphDelta, fourthParagraphAffected } from './fourth-paragraph-ancestry.mjs';\n";
export const fourthParagraphHook = `        if (
          (await fourthParagraphAffected(set.set, task, original, group)) &&
          item.proof?.fourthParagraphSource !== (await fourthParagraphDelta()).afterRenderer
        ) {
          item.status = 'needs-audit';
          item.reason =
            'Gloom has a reviewed Original paragraph break. Only its Original rules input, rendered rules and whole-card evidence require current review; other printing fields and variants retain their evidence.';
          continue;
        }
`;
export const fourthParagraphLegacyImport =
  "import { preFourthParagraphSource } from './fourth-paragraph-ancestry.mjs';\n";
export const fourthParagraphLegacyStep = '  bytes = await preFourthParagraphSource(file, bytes);\n';
export function validateFourthParagraphData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, '4ed');
  assert.equal(p.status, 'native-fourth-paragraph-data');
  assert.deepEqual(p.ids, [fourthParagraphId]);
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(fourthParagraphPaths).sort());
  const f = p.files,
    P = fourthParagraphPaths,
    id = fourthParagraphId;
  for (const r of Object.values(f)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
  }
  const old = JSON.parse(f[P.annotation].beforeSource),
    annotation = JSON.parse(f[P.annotation].afterSource),
    r = annotation.cards[id];
  assert(!old.cards[id]);
  assert.equal(r.name, 'Gloom');
  assert.equal(r.referenceHash, '7cc92d7e4c514cd854630b41add5e82b253a0ac7ae2348cfd4fb3083674387a4');
  assert.equal(r.reviewed, true);
  assert.deepEqual(r.reviewedFields, ['rulesText']);
  assert.equal(
    r.rulesText,
    'White spells cost an additional {3} to cast.\nWhite enchantments with activation costs require an additional {3} to use.',
  );
  assert.equal(r.flavorText, '');
  assert.equal(r.paragraphs.length, 2);
  assert.deepEqual(
    r.paragraphs,
    r.rulesText.split('\n').map((text) => ({ role: 'rules', runs: [{ text, italic: false }] })),
  );
  delete annotation.cards[id];
  assert.deepEqual(annotation, old, 'Unrelated printing annotation changed');
  const b = JSON.parse(f[P.catalog].beforeSource),
    a = JSON.parse(f[P.catalog].afterSource);
  assert.equal(a.revision, hash(JSON.stringify(a.wording)));
  const fields = {
    rulesText: r.rulesText,
    flavorText: r.flavorText,
    rulesParagraphs: r.paragraphs,
  };
  const effective = (rows) => Object.assign({}, ...rows.map((r) => r.fields));
  assert.equal(effective(a.wording[id]).rulesText, r.rulesText);
  const added = a.wording[id].find((v) => v.source === P.annotation);
  assert(added);
  assert.equal(added.referenceSha256, r.referenceHash);
  assert.deepEqual(added.fields, fields);
  assert.deepEqual(
    a.wording[id].filter((v) => v.source !== P.annotation),
    b.wording[id],
    'Existing printing corrections changed',
  );
  const restored = structuredClone(a);
  restored.wording[id] = b.wording[id];
  restored.revision = b.revision;
  assert.deepEqual(restored, b, 'Unrelated wording,artist,printing scope or evidence changed');
  const bp = eighthPayloadData(f[P.payload].beforeSource),
    ap = eighthPayloadData(f[P.payload].afterSource);
  const restore = (next, prior) => {
    const v = structuredClone(next);
    assert.equal(v.set, '4ed');
    assert.equal(v.kind, 'wording');
    assert.equal(effective(v.tables.printingCorrections[id]).rulesText, r.rulesText);
    v.tables.printingCorrections[id] = prior.tables.printingCorrections[id];
    return v;
  };
  assert.deepEqual(restore(ap, bp), bp, 'Unrelated lazy printing data changed');
  const ba = eighthAggregateData(f[P.aggregate].beforeSource),
    aa = eighthAggregateData(f[P.aggregate].afterSource);
  assert.deepEqual(
    aa.map((d) =>
      d.set === '4ed'
        ? restore(
            d,
            ba.find((o) => o.set === '4ed'),
          )
        : d,
    ),
    ba,
    'Unrelated eager set changed',
  );
  assert.equal(
    f[P.metadata].afterSource.replace(a.revision, b.revision),
    f[P.metadata].beforeSource,
    'Only wording revision may change',
  );
  const bm = JSON.parse(f[P.manifest].beforeSource),
    am = JSON.parse(f[P.manifest].afterSource);
  for (const kind of ['files', 'sources']) {
    assert.deepEqual(Object.keys(am[kind]), Object.keys(bm[kind]));
    for (const [file, value] of Object.entries(am[kind])) {
      if (value === bm[kind][file]) continue;
      assert(f[file], 'Unexpected generated dependency change: ' + file);
      assert.equal(value, f[file].after);
      assert.equal(bm[kind][file], f[file].before);
      am[kind][file] = bm[kind][file];
    }
  }
  assert.deepEqual(am, bm);
  assert.equal(
    f[P.report].afterSource,
    fourthParagraphImport +
      f[P.report].beforeSource.replace(
        '      for (const { task, item, original } of dependencies) {\n',
        '      for (const { task, item, original } of dependencies) {\n' + fourthParagraphHook,
      ),
  );
  assert.equal(
    f[P.legacy].afterSource,
    fourthParagraphLegacyImport +
      f[P.legacy].beforeSource.replace(
        'export async function preFourthNonlandSource(file, bytes) {\n',
        'export async function preFourthNonlandSource(file, bytes) {\n' + fourthParagraphLegacyStep,
      ),
  );
  return {
    changedOriginalParagraphs: 1,
    unchangedWords: true,
    geometryOverrides: 0,
    retainedOtherPrintingData: true,
  };
}
