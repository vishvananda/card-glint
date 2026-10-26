import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedFooterDelta,
  preRevisedFooterSource,
  revisedFooterHistoricalHash,
  revisedFooterAffected,
} from '../games/magic/tools/accuracy/revised-footer-ancestry.mjs';
const p = await revisedFooterDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await revisedFooterHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), e.after);
  assert.equal(hash(await preRevisedFooterSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unknown edit\n')]);
  assert.deepEqual(await preRevisedFooterSource(file, unknown), unknown);
}
const load = async (ref) => {
  const z = await readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const b = gunzipSync(z);
  assert.equal(hash(b), ref.contentSha256);
  return JSON.parse(b);
};
const before = await load(p.artifacts['footer-adopted-before-native']),
  after = await load(p.artifacts['footer-adopted-after-native']),
  prototype = await load(p.artifacts['footer-adopted-prototype-native']),
  adoption = await load(p.artifacts.adoption);
assert.equal(before.rendererHash, p.beforeRenderer);
assert.equal(after.rendererHash, p.afterRenderer);
assert.equal(before.inputHash, after.inputHash);
assert.equal(before.rows.length, 306);
assert.equal(after.rows.length, 306);
assert.equal(adoption.rows.length, 306);
assert.equal(adoption.regional.length, 223);
assert.deepEqual(after.faults, []);
assert.deepEqual(before.faults, []);
assert.deepEqual(prototype.faults, []);
assert.equal(after.status, 'complete');
assert.equal(prototype.status, 'complete-prototype-not-adopted');
let changed = 0,
  unchanged = 0,
  regions = 0;
for (const row of adoption.rows) {
  const b = before.rows.find((r) => r.id === row.id),
    a = after.rows.find((r) => r.id === row.id),
    t = prototype.rows.find((r) => r.id === row.id);
  for (const [mode, v] of Object.entries(row.modes)) {
    assert.equal(v.before, b.modes[mode].sha256);
    assert.equal(v.after, a.modes[mode].sha256);
    assert.equal(v.after, t.modes[mode].sha256);
    assert.equal(v.prototype, v.after);
    assert.equal(v.inputHash, b.modes[mode].inputHash);
    assert.equal(v.inputHash, a.modes[mode].inputHash);
    assert.deepEqual(a.modes[mode].layout, b.modes[mode].layout);
    assert.equal(v.changed, !row.land && mode !== 'etching');
    if (v.changed) {
      changed++;
      assert(v.isolation.changedPixels > 0);
      assert.equal(v.isolation.outside, 0);
      assert.equal(v.isolation.alpha, 0);
      assert.deepEqual(v.isolation.rect, adoption.rect);
    } else {
      unchanged++;
      assert.equal(v.before, v.after);
      assert.equal(v.keyBefore, v.keyAfter);
    }
  }
}
assert.equal(changed, 843);
assert.equal(unchanged, 381);
const fixture = 'games/magic/fixtures/accuracy/3ed-recheck/';
const fine = JSON.parse(gunzipSync(await readFile(fixture + 'footer-fine-study.json.gz'))),
  review = JSON.parse(await readFile(fixture + 'footer-proposal-review.json'));
for (const r of adoption.regional) {
  const f = fine.rows.find((x) => x.id === r.id);
  assert.equal(r.poseHash, f.poseHash);
  assert.equal(r.referenceHash, f.referenceHash);
  for (const [role, scores] of Object.entries(r.roles)) {
    regions++;
    assert.deepEqual(scores.before, f.roles[role].scores[0]);
    assert.deepEqual(scores.after, f.roles[role].scores[review.roles[role].index]);
  }
}
assert.equal(regions, 302);
for (const task of ['artist', 'footer', 'stats', 'fullCard', 'release']) {
  assert(revisedFooterAffected('3ed', task));
  assert.equal(revisedFooterAffected('3ed', task, true), false);
  assert.equal(revisedFooterAffected('3ed', task, false, { kind: 'land' }), false);
  assert.equal(revisedFooterAffected('3ed', task, false, { kind: 'basic-land' }), false);
  for (const set of ['lea', 'leb', '2ed', 'arn', 'atq', 'leg', 'drk', 'fem', '4ed', '8ed', 'm21'])
    assert.equal(revisedFooterAffected(set, task), false);
}
for (const task of [
  'references',
  'normalization',
  'frameGeometry',
  'frameColor',
  'paperColor',
  'blackLevels',
  'manaGeometry',
  'manaColor',
  'setSymbol',
  'headings',
  'rules',
  'flavor',
  'specialComponents',
])
  assert.equal(revisedFooterAffected('3ed', task), false);
assert.equal(revisedFooterAffected('3ed', 'stats', false, { applicable: { stats: false } }), false);

const virtual = path.resolve('games/magic/src/presentation/__revised-footer-before.ts');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  plugins: [
    {
      name: 'revised-footer-before-key',
      resolveId(id) {
        if (id.endsWith('/__revised-footer-before.ts')) return virtual;
      },
      load(id) {
        if (id === virtual)
          return p.files['games/magic/src/presentation/canvas-face.ts'].beforeSource;
      },
    },
  ],
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { cardTextureKey: next } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-face.ts',
    ),
    { cardTextureKey: old } = await server.ssrLoadModule(
      '/games/magic/src/presentation/__revised-footer-before.ts',
    );
  const face = {
      name: 'Test',
      setCode: '3ed',
      frameStyle: 'retro',
      wordingMode: 'original',
      typeLine: 'Summon Angel',
      colors: ['W'],
      artist: 'Douglas Shuler',
      power: '1',
      toughness: '1',
    },
    marker = 'revised-footer-geometry-v1';
  const input = (f, props = {}) => ({ face: f, printingId: null, printedImage: null, ...props });
  const check = (f, props, expected) => {
    const a = JSON.parse(old(input(f, props), 'inspect')),
      b = JSON.parse(next(input(f, props), 'inspect'));
    assert.equal(b.filter((v) => v === marker).length, expected ? 1 : 0);
    assert.deepEqual(
      b.filter((v) => v !== marker),
      a,
    );
  };
  for (const wordingMode of ['original', 'oracle'])
    for (const rulesText of [true, false])
      for (const paintLayer of [undefined, 'printing'])
        check({ ...face, wordingMode }, { rulesText, paintLayer }, true);
  check({ ...face, power: null, toughness: null }, {}, true);
  check({ ...face, artist: null }, {}, true);
  check({ ...face, land: true }, {}, true);
  check({ ...face, land: true, power: null, toughness: null }, {}, false);
  check({ ...face, printingElements: { artist: { hidden: true } } }, {}, true);
  check({ ...face, printingElements: { artist: { offset: [1, 2] } } }, {}, true);
  for (const setCode of [
    'lea',
    'leb',
    '2ed',
    'arn',
    'atq',
    'leg',
    'drk',
    'fem',
    '4ed',
    '8ed',
    'm21',
  ])
    check({ ...face, setCode }, {}, false);
  for (const extra of [
    { frameStyle: 'modern' },
    { frameTemplate: 'future' },
    { layout: 'split' },
    { typeLine: 'Planeswalker — Test' },
    { typeLine: 'Land', power: null, toughness: null },
  ])
    check({ ...face, ...extra }, {}, false);
  check({ ...face, artist: null, power: null, toughness: null }, {}, false);
  check(
    { ...face, power: null, toughness: null, printingElements: { artist: { hidden: true } } },
    {},
    false,
  );
  for (const props of [
    { layer: 'etching' },
    { paintLayer: 'artwork' },
    { printedImage: 'scan.png' },
  ])
    check(face, props, false);
  check(face, { custom: { key: 'host', artBounds: [0, 0, 1, 1], compose() {} } }, false);
} finally {
  await server.close();
}
console.log(
  'Revised footer adoption:1224 exact native prototype matches,843 footer-only RGB changes,381 land/mask controls,302 exact regional reproductions and scoped cache/source reuse pass.',
);

const geom = await load(p.artifacts.geometryNative),
  geometryScores = await load(p.artifacts.geometryWholeCard),
  scores = await load(p.artifacts.scoreReuse);
assert.equal(geom.rendererHash, p.metadataOnly.beforeRenderer);
assert.equal(scores.rendererHash, p.afterRenderer);
assert.equal(geometryScores.rendererHash, p.metadataOnly.beforeRenderer);
assert.equal(p.metadataOnly.unchangedNativeVariants, 1224);
assert.deepEqual(scores.reuse, { reused: 306, fresh: 0 });
assert.deepEqual(scores.metricGraph, geometryScores.metricGraph);
assert.equal(scores.inputHash, geometryScores.inputHash);
assert.equal(scores.posesHash, geometryScores.posesHash);
assert.equal(scores.rows.length, 306);
assert.equal(scores.summary.all.current100, p.wholeCard.after100);
assert.equal(geometryScores.summary.all.before100, p.wholeCard.before100);
for (const row of scores.rows) {
  const g = geometryScores.rows.find((g) => g.id === row.id),
    n = after.rows.find((n) => n.id === row.id);
  assert(row.scoreReused);
  assert.equal(row.delta100, 0);
  assert.equal(row.nativeHash, n.modes.original.sha256);
  for (const key of ['nativeHash', 'inputHash', 'referenceHash', 'poseHash'])
    assert.equal(row[key], g[key]);
  assert.deepEqual(row.score, g.score);
}
console.log(
  'Final cache-only closure:1224 unchanged native variants and306 exact score reuses with zero fresh metric calculations.',
);
