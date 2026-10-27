import {
  preRevisedManaFitSource,
  revisedManaFitHistoricalHash,
} from '../games/magic/tools/accuracy/revised-mana-fit-ancestry.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedBlackPaperDelta,
  preRevisedBlackPaperSource,
  revisedBlackPaperHistoricalHash,
  revisedBlackPaperAffected,
} from '../games/magic/tools/accuracy/revised-black-paper-ancestry.mjs';
const p = await revisedBlackPaperDelta();
assert.equal(await revisedManaFitHistoricalHash(), p.afterRenderer);
assert.equal(await revisedBlackPaperHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await preRevisedManaFitSource(file, await readFile(file));
  assert.equal(hash(bytes), e.after);
  assert.equal(hash(await preRevisedBlackPaperSource(file, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unreviewed change\n')]);
  assert.deepEqual(await preRevisedBlackPaperSource(file, unknown), unknown);
}
const load = async (ref) => {
  const z = await readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const bytes = gunzipSync(z);
  assert.equal(hash(bytes), ref.contentSha256);
  return JSON.parse(bytes);
};
const b = await load(p.artifacts.before),
  a = await load(p.artifacts.after),
  review = await load(p.artifacts.isolation),
  scores = await load(p.artifacts.scores);
assert.equal(b.rendererHash, p.beforeRenderer);
assert.equal(a.rendererHash, p.afterRenderer);
assert.equal(review.beforeRenderer, p.beforeRenderer);
assert.equal(review.afterRenderer, p.afterRenderer);
assert.equal(
  review.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-black-paper-review.mjs')),
);
assert.equal(b.inputHash, a.inputHash);
assert.equal(review.inputHash, a.inputHash);
assert.deepEqual(review.counts, p.counts);
assert.equal(review.rows.length, 306);
assert.deepEqual(review.faults, []);
const counts = {};
for (const r of review.rows) {
  const br = b.rows.find((x) => x.id === r.id),
    ar = a.rows.find((x) => x.id === r.id);
  assert.equal(r.referenceHash, br.referenceHash);
  assert.equal(r.referenceHash, ar.referenceHash);
  assert.equal(r.artHash, br.artHash);
  assert.equal(r.artHash, ar.artHash);
  for (const [m, v] of Object.entries(r.modes)) {
    const bv = br.modes[m],
      av = ar.modes[m];
    assert.equal(v.before, bv.sha256);
    assert.equal(v.after, av.sha256);
    assert.equal(v.keyBefore, bv.keyHash);
    assert.equal(v.keyAfter, av.keyHash);
    assert.equal(v.inputHash, bv.inputHash);
    assert.equal(v.inputHash, av.inputHash);
    assert.deepEqual(bv.layout, av.layout);
    assert.equal(v.changed, v.before !== v.after);
    assert.equal(v.keyChanged, v.keyBefore !== v.keyAfter);
    const c = (counts[m] ??= { changed: 0, unchanged: 0, keysChanged: 0 });
    c[v.changed ? 'changed' : 'unchanged']++;
    c.keysChanged += +v.keyChanged;
    if (v.changed) {
      assert(v.keyChanged);
      assert(v.isolation.pixels > 0);
      assert.equal(v.isolation.outside, 0);
      assert.equal(v.isolation.alpha, 0);
      assert(v.isolation.bounds.length);
      for (const rect of v.isolation.bounds) {
        assert(rect.every(Number.isInteger));
        assert(rect[2] > 0 && rect[3] > 0);
      }
    }
    if (['oracle-modern', 'etching'].includes(m)) {
      assert(!v.changed);
      assert(!v.keyChanged);
    }
  }
}
assert.deepEqual(counts, p.counts);
assert.deepEqual(scores.reuse, { reused: 252, fresh: 54 });
assert.equal(scores.rows.length, 306);
assert.equal(scores.rendererHash, p.afterRenderer);
assert.equal(scores.summary.all.before100, p.wholeCard.before100);
assert.equal(scores.summary.all.current100, p.wholeCard.after100);
assert(scores.summary.all.current100 > scores.summary.all.before100);
assert(scores.summary.all.regressed > 0, 'Preserve full-card outliers.');
for (const r of scores.rows) {
  const v = review.rows.find((x) => x.id === r.id).modes.original;
  assert.equal(r.nativeHash, v.after);
  assert.equal(r.scoreReused, !v.changed);
}
const virtual = path.resolve('games/magic/src/presentation/__black-paper-before.ts');
const oldMana = path.resolve('games/magic/src/presentation/__black-paper-mana-before.ts');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  plugins: [
    {
      name: 'before-black-paper-key',
      resolveId(id) {
        if (id.endsWith('/__black-paper-before.ts')) return virtual;
        if (id.endsWith('/__black-paper-mana-before.ts')) return oldMana;
      },
      load(id) {
        if (id === oldMana)
          return p.files['games/magic/src/presentation/historical-mana.ts'].beforeSource;
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
      '/games/magic/src/presentation/__black-paper-before.ts',
    ),
    { historicalManaAsset, historicalManaPaperSample } = await server.ssrLoadModule(
      '/games/magic/src/presentation/historical-mana.ts',
    ),
    { historicalManaPaperSample: previousPaper } = await server.ssrLoadModule(
      '/games/magic/src/presentation/__black-paper-mana-before.ts',
    ),
    marker = 'revised-black-paper-v1',
    face = {
      name: 'Scope',
      setCode: '3ed',
      typeLine: 'Summon Shade',
      colors: ['B'],
      frameStyle: 'retro',
      wordingMode: 'original',
      symbolStyle: 'original',
      manaSymbols: ['1', 'B'],
    };
  const check = (f, props = {}, expected = true) => {
    const input = { face: f, printingId: null, printedImage: null, ...props },
      before = JSON.parse(old(input, 'inspect')),
      after = JSON.parse(next(input, 'inspect'));
    assert.equal(after.filter((v) => v === marker).length, expected ? 1 : 0);
    assert.deepEqual(
      after.filter((v) => v !== marker && v !== 'revised-mana-fit-v1'),
      before,
    );
  };
  for (const setCode of ['3ed', '3ED'])
    for (const wordingMode of ['original', 'oracle']) {
      const f = { ...face, setCode, wordingMode };
      assert.equal(historicalManaPaperSample(f, 'B'), 'opaque-percentile');
      assert.equal(historicalManaAsset(f, 'B').inkExpansion, 0);
      for (const rulesText of [true, false]) check(f, { rulesText });
      check(f, { paintLayer: 'printing' });
    }
  check({ ...face, symbolStyle: undefined });
  check({ ...face, symbolStyle: undefined, wordingMode: 'oracle' }, {}, false);
  check({ ...face, symbolStyle: 'modern' }, {}, false);
  check({ ...face, manaSymbols: ['1', 'U'] }, {}, false);
  const inline = { ...face, manaSymbols: [], rulesText: 'Add {B}.' };
  check(inline);
  check(inline, { rulesText: false }, false);
  check({ ...inline, rulesText: 'BBB' }, {}, false);
  check({ ...inline, rulesText: undefined, rulesParagraphs: [{ runs: [{ text: 'Add {B}.' }] }] });
  const hidden = { ...face, printingElements: { manaCost: { hidden: true } } };
  check(hidden, {}, false);
  check({ ...hidden, rulesText: 'Add {B}.' });
  check({ ...hidden, rulesText: 'Add {B}.' }, { rulesText: false }, false);
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
    { borderColor: 'black' },
    { typeLine: 'Planeswalker — Test' },
    { symbolStyle: 'modern' },
    { symbolStyle: undefined, wordingMode: 'oracle' },
    ...['lea', 'leb', '2ed', 'arn', 'atq', 'leg', 'drk', 'fem', '4ed', '8ed', 'm21'].map(
      (setCode) => ({ setCode }),
    ),
  ]) {
    const f = { ...face, ...override };
    check(f, {}, false);
    assert.equal(historicalManaPaperSample(f, 'B'), previousPaper(f, 'B'));
  }
  for (const symbol of ['W', 'U', 'R', 'G', '2'])
    assert.equal(historicalManaPaperSample(face, symbol), undefined);
} finally {
  await server.close();
}
for (const task of ['manaGeometry', 'manaColor', 'rules', 'flavor', 'fullCard', 'release']) {
  assert(revisedBlackPaperAffected('3ED', task));
  assert(!revisedBlackPaperAffected('3ed', task, true));
  for (const set of ['lea', 'leb', '2ed', 'arn', 'atq', 'leg', 'drk', 'fem', '4ed', '8ed', 'm21'])
    assert(!revisedBlackPaperAffected(set, task));
}
for (const task of [
  'references',
  'normalization',
  'frameGeometry',
  'frameColor',
  'paperColor',
  'blackLevels',
  'setSymbol',
  'headings',
  'artist',
  'footer',
  'stats',
  'specialComponents',
])
  assert(!revisedBlackPaperAffected('3ed', task));
console.log(
  'Revised black mana: 1224 native controls, actual-symbol RGB isolation, exact source reuse, and scoped cache invalidation passed.',
);
