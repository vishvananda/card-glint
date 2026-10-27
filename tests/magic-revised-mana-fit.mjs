import {
  preRevisedHeadingSource,
  revisedHeadingHistoricalHash,
} from '../games/magic/tools/accuracy/revised-heading-ancestry.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedManaFitDelta,
  preRevisedManaFitSource,
  revisedManaFitHistoricalHash,
  revisedManaFitAffected,
} from '../games/magic/tools/accuracy/revised-mana-fit-ancestry.mjs';
const p = await revisedManaFitDelta();
assert.equal(await revisedHeadingHistoricalHash(), p.afterRenderer);
assert.equal(await revisedManaFitHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await preRevisedHeadingSource(file, await readFile(file));
  assert.equal(hash(bytes), e.after);
  assert.equal(hash(await preRevisedManaFitSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unknown change\n')]);
  assert.deepEqual(await preRevisedManaFitSource(file, unknown), unknown);
}
const load = async (ref) => {
  const z = await readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const b = gunzipSync(z);
  assert.equal(hash(b), ref.contentSha256);
  return JSON.parse(b);
};
const before = await load(p.artifacts.before),
  after = await load(p.artifacts.after),
  prototype = await load(p.artifacts.prototype),
  review = await load(p.artifacts.isolation),
  scores = await load(p.artifacts.scores),
  prototypeScores = await load(p.artifacts.prototypeScores);
assert.equal(before.rendererHash, p.beforeRenderer);
assert.equal(after.rendererHash, p.afterRenderer);
assert.equal(prototype.experiment.sourceRendererHash, p.beforeRenderer);
assert.equal(
  review.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-mana-adoption-review.mjs')),
);
assert.equal(
  prototype.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-mana-prototype-replay.mjs')),
);
assert.equal(
  scores.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-mana-score-reuse.mjs')),
);
assert.equal(review.status, 'native-revised-mana-adoption-isolation');
assert.equal(scores.status, 'exact-adopted-native-score-reuse');
assert.deepEqual(review.counts, p.counts);
assert.equal(review.rows.length, 306);
assert.equal(scores.rows.length, 306);
for (const c of [before, after, prototype, review]) assert.deepEqual(c.faults, []);
assert.deepEqual(scores.reuse, { reused: 306, fresh: 0 });
let variants = 0,
  changed = 0;
for (const r of review.rows) {
  const b = before.rows.find((x) => x.id === r.id),
    a = after.rows.find((x) => x.id === r.id),
    t = prototype.rows.find((x) => x.id === r.id);
  for (const [mode, v] of Object.entries(r.modes)) {
    variants++;
    assert.equal(v.before, b.modes[mode].sha256);
    assert.equal(v.after, a.modes[mode].sha256);
    assert.equal(v.prototype, t.modes[mode].sha256);
    assert.equal(v.after, v.prototype);
    assert.equal(v.inputHash, b.modes[mode].inputHash);
    assert.equal(v.inputHash, a.modes[mode].inputHash);
    assert.equal(v.prototypeInputHash, t.modes[mode].inputHash);
    assert.deepEqual(b.modes[mode].layout, a.modes[mode].layout);
    assert.deepEqual(t.modes[mode].layout, a.modes[mode].layout);
    if (v.changed) {
      changed++;
      assert(v.keyChanged);
      assert(v.isolation.pixels > 0);
      assert.equal(v.isolation.outside, 0);
      assert.equal(v.isolation.alpha, 0);
      assert(v.isolation.bounds.length);
    }
    if (['oracle-modern', 'etching'].includes(mode)) {
      assert(!v.changed);
      assert(!v.keyChanged);
    }
  }
  const s = scores.rows.find((x) => x.id === r.id),
    tScore = prototypeScores.rows.find((x) => x.id === r.id);
  assert(s.scoreReused);
  assert.equal(s.nativeHash, a.modes.original.sha256);
  assert.equal(s.nativeHash, s.priorNativeHash);
  assert.equal(s.priorInputHash, tScore.inputHash);
  assert.equal(s.inputHash, a.modes.original.inputHash);
  assert.equal(s.regionPlanHash, tScore.regionPlanHash);
  assert.deepEqual(s.score, tScore.score);
}
assert.equal(variants, 1224);
assert.equal(changed, 597);
assert.equal(scores.summary.all.current100, p.wholeCard.after100);
assert.equal(scores.summary.all.before100, p.wholeCard.before100);
assert(scores.summary.all.current100 > scores.summary.all.before100);
assert(
  scores.summary.B.current100 < scores.summary.B.before100,
  'Retain the structural/color tradeoff.',
);
const virtual = path.resolve('games/magic/src/presentation/__mana-fit-key-before.ts'),
  targetBefore = path.resolve('games/magic/src/presentation/__mana-fit-colors-before.ts');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  plugins: [
    {
      name: 'mana-fit-before-keys',
      resolveId(id) {
        if (id.endsWith('/__mana-fit-key-before.ts')) return virtual;
        if (id.endsWith('/__mana-fit-colors-before.ts')) return targetBefore;
      },
      load(id) {
        if (id === virtual)
          return p.files['games/magic/src/presentation/canvas-face.ts'].beforeSource;
        if (id === targetBefore)
          return p.files['games/magic/src/presentation/calibration-profiles.ts'].beforeSource;
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
      '/games/magic/src/presentation/__mana-fit-key-before.ts',
    ),
    { calibratedManaTarget: color } = await server.ssrLoadModule(
      '/games/magic/src/presentation/calibration-profiles.ts',
    ),
    { calibratedManaTarget: previousColor } = await server.ssrLoadModule(
      '/games/magic/src/presentation/__mana-fit-colors-before.ts',
    ),
    { printingManaDefaults, printingManaAdjustment } = await server.ssrLoadModule(
      '/games/magic/src/presentation/printing-mana-adjustment.ts',
    ),
    { revisedManaSource } = await server.ssrLoadModule(
      '/games/magic/src/presentation/historical-mana.ts',
    ),
    palette = prototype.experiment.palette,
    geometry = prototype.experiment.geometry,
    face = {
      name: 'Scope',
      setCode: '3ed',
      typeLine: 'Summon Shade',
      colors: ['B'],
      frameStyle: 'retro',
      wordingMode: 'original',
      symbolStyle: 'original',
      manaSymbols: ['1', 'B'],
      colorCalibration: 'set-hsb-v1',
    },
    marker = 'revised-mana-fit-v1';
  const check = (f, props = {}, expected = true) => {
    const input = { face: f, printingId: null, printedImage: null, ...props },
      a = JSON.parse(old(input, 'inspect')),
      b = JSON.parse(next(input, 'inspect'));
    assert.equal(b.filter((v) => v === marker).length, expected ? 1 : 0);
    assert.deepEqual(
      b.filter((v) => v !== marker && v !== 'revised-heading-fit-v1'),
      a,
    );
  };
  assert(revisedManaSource(face));
  assert.deepEqual(printingManaDefaults(face), geometry);
  for (const [s, target] of Object.entries({ ...palette.paper, INK: palette.ink }))
    assert.deepEqual(color(face, s), target);
  for (const setCode of ['3ed', '3ED'])
    for (const wordingMode of ['original', 'oracle']) {
      const f = { ...face, setCode, wordingMode };
      assert(revisedManaSource(f));
      check(f);
      check(f, { rulesText: false });
      check(f, { paintLayer: 'printing' });
    }
  const inline = { ...face, manaSymbols: [], rulesText: 'Add {B}.' };
  check(inline);
  check(inline, { rulesText: false }, false);
  check({ ...inline, rulesText: undefined, rulesParagraphs: [{ runs: [{ text: 'Add {G}.' }] }] });
  check({ ...face, manaSymbols: [], rulesText: '' }, {}, false);
  const hidden = { ...face, printingElements: { manaCost: { hidden: true } } };
  check(hidden, {}, false);
  check({ ...hidden, rulesText: 'Add {B}.' });
  check({ ...hidden, rulesText: 'Add {B}.' }, { rulesText: false }, false);
  for (const policy of [undefined, 'source']) {
    const f = { ...face, colorCalibration: undefined, ...(policy ? { calibration: policy } : {}) };
    check(f);
    check({ ...f, manaSymbols: ['W'] }, {}, false);
    check({ ...f, manaSymbols: ['U'] }, {}, false);
    check({ ...f, manaSymbols: [], rulesText: 'Add {B}.' }, {}, false);
  }
  check({ ...face, colorCalibration: undefined, calibration: 'printing', manaSymbols: ['U'] });
  check({ ...face, colorCalibration: 'early-hsb-v1', manaSymbols: ['W'] });
  for (const props of [
    { printedImage: 'scan.png' },
    { layer: 'etching' },
    { paintLayer: 'artwork' },
  ])
    check(face, props, false);
  check(face, { custom: { key: 'host', artBounds: [0, 0, 1, 1], compose() {} } }, false);
  for (const override of [
    { frameStyle: 'modern' },
    { frameTemplate: 'future' },
    { layout: 'split' },
    { layout: 'token' },
    { legendary: true },
    { typeLine: 'Legendary Creature — Test' },
    { typeLine: 'Planeswalker — Test' },
    { borderColor: 'black' },
    { rulesText: 'Level up {1}' },
    { symbolStyle: 'modern' },
    { wordingMode: 'oracle', symbolStyle: undefined },
    ...['lea', 'leb', '2ed', 'arn', 'atq', 'leg', 'drk', 'fem', '4ed', '8ed', 'm21'].map(
      (setCode) => ({ setCode }),
    ),
  ]) {
    const f = { ...face, ...override };
    assert(!revisedManaSource(f));
    check(f, {}, false);
    for (const s of ['W', 'U', 'B', 'R', 'G', 'N', 'INK'])
      assert.deepEqual(color(f, s), previousColor(f, s));
    if (f.setCode.toLowerCase() === '3ed' && f.frameStyle !== 'modern')
      assert.equal(printingManaDefaults(f), undefined);
  }
  const adjusted = printingManaAdjustment({
    ...face,
    symbolAdjustment: {
      mana: {
        numberScale: 1.1,
        numberDx: 1,
        numberDy: 2,
        glyphs: { G: { scale: 0.9, dx: 1, dy: 2 } },
      },
    },
  });
  assert.equal(adjusted.numberScale, geometry.numberScale * 1.1);
  assert.equal(adjusted.numberDx, 1);
  assert.equal(adjusted.numberDy, geometry.numberDy + 2);
  assert.equal(adjusted.glyphs.G.scale, geometry.glyphs.G.scale * 0.9);
  assert.equal(adjusted.glyphs.G.dx, geometry.glyphs.G.dx + 1);
  assert.equal(adjusted.glyphs.G.dy, 2);
} finally {
  await server.close();
}
for (const task of ['manaGeometry', 'manaColor', 'rules', 'flavor', 'fullCard', 'release']) {
  assert(revisedManaFitAffected('3ed', task));
  assert(!revisedManaFitAffected('3ed', task, true));
  for (const s of ['lea', 'leb', '2ed', 'arn', 'atq', 'leg', 'drk', 'fem', '4ed', '8ed', 'm21'])
    assert(!revisedManaFitAffected(s, task));
}
for (const task of [
  'references',
  'normalization',
  'frameGeometry',
  'frameColor',
  'paperColor',
  'blackLevels',
  'headings',
  'artist',
  'footer',
  'stats',
  'setSymbol',
])
  assert(!revisedManaFitAffected('3ed', task));
console.log(
  'Revised mana adoption:1224 exact prototype replays,597 isolated mana changes,306 exact score reuses and scoped style/cache/source checks pass.',
);
