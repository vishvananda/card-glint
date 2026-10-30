import { withoutModernCostRevision } from './magic-key-history.mjs';
import {
  preLegArtistDataSource,
  legArtistHistoricalHash,
} from '../games/magic/tools/accuracy/leg-artist-data-ancestry.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedHeadingDelta,
  preRevisedHeadingSource,
  revisedHeadingHistoricalHash,
  revisedHeadingAffected,
} from '../games/magic/tools/accuracy/revised-heading-ancestry.mjs';
const p = await revisedHeadingDelta();
assert.equal(await legArtistHistoricalHash(), p.afterRenderer);
assert.equal(await revisedHeadingHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const b = await preLegArtistDataSource(file, await readFile(file));
  assert.equal(hash(b), e.after);
  assert.equal(hash(await preRevisedHeadingSource(file, b)), e.before);
  const unknown = Buffer.concat([b, Buffer.from('\n// unreviewed change\n')]);
  assert.deepEqual(await preRevisedHeadingSource(file, unknown), unknown);
}
const load = async (ref) => {
    const z = await readFile(ref.file);
    assert.equal(hash(z), ref.sha256);
    const b = gunzipSync(z);
    assert.equal(hash(b), ref.contentSha256);
    return JSON.parse(b);
  },
  before = await load(p.artifacts.before),
  after = await load(p.artifacts.after),
  prototype = await load(p.artifacts.prototype),
  isolation = await load(p.artifacts.isolation),
  scores = await load(p.artifacts.scores),
  prior = await load(p.artifacts.beforeScores);
assert.equal(before.rendererHash, p.beforeRenderer);
assert.equal(after.rendererHash, p.afterRenderer);
assert.equal(isolation.rendererHash, p.afterRenderer);
assert.equal(after.toolHash, hash((await load(p.artifacts.tools))['printing-native-replay.mjs']));
assert.equal(
  isolation.toolHash,
  hash((await load(p.artifacts.tools))['revised-heading-adoption-review.mjs']),
);
assert.equal(
  prototype.toolHash,
  hash((await load(p.artifacts.tools))['revised-heading-prototype-replay.mjs']),
);
assert.equal(scores.toolHash, hash((await load(p.artifacts.tools))['printing-native-score.mjs']));
assert.deepEqual(scores.metricGraph, prior.metricGraph);
assert.equal(scores.posesHash, prior.posesHash);
assert.deepEqual(scores.reuse, { reused: 25, fresh: 281 });
assert.deepEqual(isolation.counts, p.counts);
let variants = 0,
  changed = 0;
for (const row of isolation.rows) {
  const b = before.rows.find((r) => r.id === row.id),
    a = after.rows.find((r) => r.id === row.id),
    t = prototype.rows.find((r) => r.id === row.id),
    s = scores.rows.find((r) => r.id === row.id),
    old = prior.rows.find((r) => r.id === row.id);
  for (const [mode, v] of Object.entries(row.modes)) {
    variants++;
    changed += Number(v.changed);
    assert.equal(v.before, b.modes[mode].sha256);
    assert.equal(v.after, a.modes[mode].sha256);
    assert.equal(v.prototype, t.modes[mode].sha256);
    assert.equal(v.after, v.prototype);
    assert.equal(v.inputHash, a.modes[mode].inputHash);
    assert.equal(v.inputHash, b.modes[mode].inputHash);
    assert.deepEqual(a.modes[mode].layout, b.modes[mode].layout);
    assert.equal(v.isolation.outside, 0);
    assert.equal(v.isolation.alpha, 0);
    if (row.land || mode === 'etching') {
      assert(!v.changed);
      assert(!v.keyChanged);
    } else {
      assert(v.changed);
      assert(v.keyChanged);
      assert(v.isolation.pixels > 0);
    }
  }
  assert.equal(s.nativeHash, a.modes.original.sha256);
  assert.equal(s.inputHash, old.inputHash);
  assert.equal(s.poseHash, old.poseHash);
  assert.equal(s.referenceHash, old.referenceHash);
  assert.equal(s.scoreReused, row.land);
}
assert.equal(variants, 1224);
assert.equal(changed, 843);
assert.equal(scores.summary.all.current100, p.wholeCard.after100);
assert(scores.summary.all.current100 > scores.summary.all.before100);
assert.equal(scores.summary.all.improved, 270);
assert.equal(scores.summary.all.regressed, 11);
const virtual = path.resolve('games/magic/src/presentation/__heading-key-before.ts'),
  server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
    plugins: [
      {
        name: 'heading-before-key',
        resolveId(id) {
          if (id.endsWith('/__heading-key-before.ts')) return virtual;
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
  const { cardTextureKey: next } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-face.ts',
    ),
    { cardTextureKey: old } = await server.ssrLoadModule(
      '/games/magic/src/presentation/__heading-key-before.ts',
    ),
    typography = await server.ssrLoadModule('/games/magic/src/presentation/revised-lettering.ts'),
    { canvasFontAssets } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-fonts.ts',
    ),
    { setAssetFetcher } = await server.ssrLoadModule('/packages/browser/src/asset-fetch.ts'),
    face = {
      name: 'Heading',
      typeLine: 'Summon Angel',
      setCode: '3ed',
      colors: ['W'],
      frameStyle: 'retro',
    },
    marker = 'revised-heading-fit-v1';
  const check = (f, props = {}, expected = true) => {
    const input = { face: f, printingId: null, printedImage: null, ...props },
      a = JSON.parse(old(input, 'inspect')),
      b = JSON.parse(withoutModernCostRevision(next(input, 'inspect')));
    assert.equal(b.filter((v) => v === marker).length, expected ? 1 : 0);
    assert.deepEqual(
      b.filter((v) => v !== marker),
      a,
    );
  };
  for (const wordingMode of ['original', 'oracle'])
    for (const symbolStyle of ['original', 'modern'])
      for (const colorCalibration of [undefined, 'set-hsb-v1'])
        check({ ...face, wordingMode, symbolStyle, colorCalibration });
  check(face, { rulesText: false });
  for (const props of [
    { printedImage: 'scan.png' },
    { paintLayer: 'artwork' },
    { layer: 'etching' },
  ])
    check(face, props, false);
  for (const f of [
    { ...face, land: true },
    { ...face, typeLine: 'Land' },
    { ...face, frameStyle: 'modern' },
    { ...face, frameTemplate: 'future' },
    { ...face, layout: 'split' },
  ])
    check(f, {}, false);
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
  assert.equal(
    canvasFontAssets.filter((f) => f.family === typography.revisedTypeFontAsset.family).length,
    1,
  );
  const savedFont = globalThis.FontFace,
    savedFonts = globalThis.fonts;
  let fetches = 0,
    constructs = 0;
  try {
    globalThis.fonts = new Set();
    globalThis.FontFace = class {
      constructor(family, bytes, options) {
        this.family = family;
        this.status = 'unloaded';
        constructs++;
        assert.equal(bytes.byteLength, 1);
        assert.equal(options.weight, '400');
      }
      async load() {
        this.status = 'loaded';
        return this;
      }
    };
    setAssetFetcher(async (url) => {
      assert.equal(url, typography.revisedTypeFontAsset.url);
      fetches++;
      return new Response(new Uint8Array([0]), { status: fetches === 1 ? 503 : 200 });
    });
    await typography.loadRevisedTypeFont({ ...face, setCode: '4ed' });
    assert.equal(fetches, 0);
    const failed = await Promise.allSettled(
      [1, 2, 3].map(() => typography.loadRevisedTypeFont(face)),
    );
    assert(failed.every((r) => r.status === 'rejected'));
    assert.equal(fetches, 1);
    await Promise.all([1, 2, 3].map(() => typography.loadRevisedTypeFont(face)));
    await typography.loadRevisedTypeFont({ ...face, wordingMode: 'oracle' });
    assert.equal(fetches, 2);
    assert.equal(constructs, 1);
    assert.equal(globalThis.fonts.size, 1);
  } finally {
    setAssetFetcher((url, options) => fetch(url, { ...options, mode: 'cors' }));
    if (savedFont === undefined) delete globalThis.FontFace;
    else globalThis.FontFace = savedFont;
    if (savedFonts === undefined) delete globalThis.fonts;
    else globalThis.fonts = savedFonts;
  }
} finally {
  await server.close();
}
for (const task of ['headings', 'fullCard', 'release']) {
  assert(revisedHeadingAffected('3ed', task));
  assert(!revisedHeadingAffected('3ed', task, true));
  for (const kind of ['land', 'basic-land'])
    assert(!revisedHeadingAffected('3ed', task, false, { kind }));
  for (const set of ['lea', 'leb', '2ed', 'arn', 'atq', 'leg', 'drk', 'fem', '4ed', '8ed', 'm21'])
    assert(!revisedHeadingAffected(set, task));
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
  'rules',
  'flavor',
  'artist',
  'stats',
  'specialComponents',
])
  assert(!revisedHeadingAffected('3ed', task));
console.log(
  'Revised headings:1224 native prototype matches;843 isolated heading updates;lands/etching keys and pixels retained;stock-pose whole-card gain with11 explicit losses;lazy font dedup/retry and recipe scope pass.',
);
