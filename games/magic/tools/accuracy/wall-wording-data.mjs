import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preFourthCenteredSource } from './fourth-centered-ancestry.mjs';
// Exact empty-rules reviews; preserve every unrelated printing and caller flavor.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
export const wallReviews = [
  {
    set: '2ed',
    id: '2a2cab55-fc64-4b3f-bc46-a1a297d2d448',
    name: 'Wall of Stone',
    referenceHash: 'c059b941884d189605ea8250c6add807038f6ebe8ffd7900c7eb0b544498c25b',
  },
  {
    set: '2ed',
    id: 'b55d8375-ea70-4dd0-950e-3dbf3dfdd4f6',
    name: 'Wall of Wood',
    referenceHash: '2236f6e01553a2acdca32c087a959d1de227ae2d483c0032c82ce66bcc79b854',
  },
  {
    set: '4ed',
    id: '8c4b68e0-ec8b-4dad-91ee-dc1da5db6251',
    name: 'Wall of Stone',
    referenceHash: 'ed8c26a3f6e013264929c564147d64a92ba26753e6eb684ef36bb80c535055e2',
  },
  {
    set: '4ed',
    id: '39f236da-8391-487b-88d4-a45342bfff62',
    name: 'Wall of Wood',
    referenceHash: '90cbaa21394591a246a542708b7fd73fd41ddff5d68a2b335ab8dfc712decde3',
  },
];
export const wallPaths = {
  annotation2: 'games/magic/fixtures/accuracy/2ed/annotations-empty-rules.json',
  annotation4: 'games/magic/fixtures/accuracy/4ed/annotations-text-outliers.json',
  catalog: 'games/magic/fixtures/accuracy/printing-review-catalog.json',
  payload2: 'games/magic/src/data/wording/2ed.ts',
  payload4: 'games/magic/src/data/wording/4ed.ts',
  aggregate: 'games/magic/src/data/eager-wording.ts',
  metadata: 'games/magic/src/data/review-metadata.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
  legacy: 'games/magic/tools/accuracy/fourth-paragraph-ancestry.mjs',
  approval: 'games/magic/tools/accuracy/abu-current-review.mjs',
};
export const wallReportImport = "import { wallWordingAffected } from './wall-wording-data.mjs';\n";
export const wallReportHook = `        if (await wallWordingAffected(set.set, task, original, group)) {
          item.status = original ? 'stale' : 'needs-audit';
          item.reason =
            'The physical Wall of Stone/Wood printing has flavor only. Its provider rules were incorrect; affected Original inputs, body/flavor, whole-card and publication evidence require current review. Other printing groups and components retain their evidence.';
          continue;
        }
`;
export const wallLegacyImport = "import { preWallWordingSource } from './wall-wording-data.mjs';\n";
export const wallLegacyStep = '  bytes = await preWallWordingSource(file, bytes);\n';
export const wallApprovalImport =
  "import { wallWordingAffected } from './wall-wording-data.mjs';\n";
export const wallApprovalStep =
  '  if (await wallWordingAffected(setCode, task, original, group)) return false;\n';
export function validateWallWordingData(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.status, 'native-wall-wording-data');
  assert.deepEqual(p.reviews, wallReviews);
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(wallPaths).sort());
  const f = p.files,
    P = wallPaths;
  for (const r of Object.values(f)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
  }
  for (const set of ['2ed', '4ed']) {
    const file = P[set === '2ed' ? 'annotation2' : 'annotation4'],
      b = JSON.parse(f[file].beforeSource),
      a = JSON.parse(f[file].afterSource);
    for (const review of wallReviews.filter((r) => r.set === set)) {
      const row = a.cards[review.id];
      assert(!b.cards[review.id]);
      assert.equal(row.name, review.name);
      assert.equal(row.referenceHash, review.referenceHash);
      assert.equal(row.rulesText, '');
      assert.equal(row.reviewed, true);
      assert.deepEqual(row.reviewedFields, ['rulesText']);
      assert(!Object.hasOwn(row, 'flavorText'));
      assert(!Object.hasOwn(row, 'paragraphs'));
      delete a.cards[review.id];
    }
    assert.deepEqual(a, b, 'Unrelated annotation changed');
  }
  const b = JSON.parse(f[P.catalog].beforeSource),
    a = JSON.parse(f[P.catalog].afterSource),
    restored = structuredClone(a);
  assert.equal(a.revision, hash(JSON.stringify(a.wording)));
  for (const review of wallReviews) {
    const source = P[review.set === '2ed' ? 'annotation2' : 'annotation4'];
    const added = a.wording[review.id].find((r) => r.source === source);
    assert(added);
    assert.equal(added.referenceSha256, review.referenceHash);
    assert.deepEqual(added.fields, { rulesText: '' });
    assert.deepEqual(
      a.wording[review.id].filter((r) => r.source !== source),
      b.wording[review.id],
    );
    restored.wording[review.id] = b.wording[review.id];
  }
  restored.revision = b.revision;
  assert.deepEqual(restored, b, 'Unrelated catalog field or printing changed');
  const restore = (next, previous) => {
    const v = structuredClone(next);
    assert(['2ed', '4ed'].includes(v.set));
    assert.equal(v.kind, 'wording');
    for (const review of wallReviews.filter((r) => r.set === v.set)) {
      const values = v.tables.printingCorrections[review.id],
        source = P[v.set === '2ed' ? 'annotation2' : 'annotation4'];
      assert.equal(Object.assign({}, ...values.map((v) => v.fields)).rulesText, '');
      v.tables.printingCorrections[review.id] = previous.tables.printingCorrections[review.id];
    }
    return v;
  };
  for (const file of [P.payload2, P.payload4]) {
    const before = eighthPayloadData(f[file].beforeSource),
      after = eighthPayloadData(f[file].afterSource);
    assert.deepEqual(restore(after, before), before, 'Unrelated per-set wording changed');
  }
  const ba = eighthAggregateData(f[P.aggregate].beforeSource),
    aa = eighthAggregateData(f[P.aggregate].afterSource);
  assert.deepEqual(
    aa.map((d) =>
      ['2ed', '4ed'].includes(d.set)
        ? restore(
            d,
            ba.find((v) => v.set === d.set),
          )
        : d,
    ),
    ba,
  );
  assert.equal(
    f[P.metadata].afterSource.replace(a.revision, b.revision),
    f[P.metadata].beforeSource,
  );
  const bm = JSON.parse(f[P.manifest].beforeSource),
    am = JSON.parse(f[P.manifest].afterSource);
  for (const kind of ['files', 'sources']) {
    assert.deepEqual(Object.keys(am[kind]), Object.keys(bm[kind]));
    for (const [file, value] of Object.entries(am[kind])) {
      if (value === bm[kind][file]) continue;
      assert(f[file], 'Unknown generated dependency: ' + file);
      assert.equal(value, f[file].after);
      assert.equal(bm[kind][file], f[file].before);
      am[kind][file] = bm[kind][file];
    }
  }
  assert.deepEqual(am, bm);
  assert.equal(
    f[P.report].afterSource,
    wallReportImport +
      f[P.report].beforeSource.replace(
        '      for (const { task, item, original } of dependencies) {\n',
        '      for (const { task, item, original } of dependencies) {\n' + wallReportHook,
      ),
  );
  assert.equal(
    f[P.legacy].afterSource,
    wallLegacyImport +
      f[P.legacy].beforeSource.replace(
        'export async function preFourthParagraphSource(file, bytes) {\n',
        'export async function preFourthParagraphSource(file, bytes) {\n' + wallLegacyStep,
      ),
  );
  assert.equal(
    f[P.approval].afterSource,
    wallApprovalImport +
      f[P.approval].beforeSource.replace(
        'export async function abuCurrentApproval(item, group, task, original = false, setCode) {\n',
        'export async function abuCurrentApproval(item, group, task, original = false, setCode) {\n' +
          wallApprovalStep,
      ),
  );
  return {
    changedPrintings: 4,
    changedSets: ['2ed', '4ed'],
    rulesOnly: true,
    callerFlavorPreserved: true,
    geometryOverrides: 0,
  };
}
const FILE = 'games/magic/fixtures/accuracy/early-through-fourth/wall-wording-source-delta.json.gz';
const RECEIPT = '1a9bb31bf83a9bb670a81f6a88aa12364198d9a5b5081b4f0e489ca831d514d7';
let checked;
export function wallWordingDelta() {
  return (checked ??= (async () => {
    const z = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(validateWallWordingData(p), p.summary);
    const nz = await fs.readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    const n = JSON.parse(raw);
    assert.equal(n.status, 'complete-native-wall-wording-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    for (const [set, count] of [
      ['2ed', 302],
      ['4ed', 378],
    ]) {
      const data = n.sets[set];
      assert.equal(data.rows.length, count);
      assert.equal(data.nativeVariants, count * 4);
      assert.deepEqual(
        data.ids,
        wallReviews
          .filter((r) => r.set === set)
          .map((r) => r.id)
          .sort(),
      );
      for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
        const changed = mode === 'original' ? 2 : 0;
        assert.deepEqual(data.counts[mode], {
          changed,
          unchanged: count - changed,
          keysChanged: changed,
        });
      }
      for (const r of data.rows)
        for (const [mode, v] of Object.entries(r.modes)) {
          assert.equal(v.outside, 0);
          assert.equal(v.alpha, 0);
          assert.equal(v.before !== v.after, r.scoped && mode === 'original');
        }
    }
    return p;
  })());
}
export async function preWallWordingSource(file, bytes) {
  bytes = await preFourthCenteredSource(file, bytes);
  const e = (await wallWordingDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function wallWordingAffected(set, task, original = false, group) {
  set = set?.toLowerCase();
  if (
    !['2ed', '4ed'].includes(set) ||
    (original ? task !== 'rules' : !['rules', 'flavor', 'fullCard', 'release'].includes(task))
  )
    return false;
  return (
    !Array.isArray(group?.printingIds) ||
    wallReviews.some((r) => r.set === set && group.printingIds.includes(r.id))
  );
}
export async function wallWordingHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preWallWordingSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
