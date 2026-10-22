// Land materials sampled only where each contributing source is fully visible.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, center, delta, quantile } from './hsb-color.mjs';
import { poolColorTiles } from './modern-color-fit-sampling.mjs';
import { fitModernColorParts } from './modern-color-parts.mjs';

const [inputFile, nativeDir, scoreDir, output] = process.argv.slice(2);
assert(output, 'Usage: modern-land-color-fit.mjs INPUTS NATIVE SCORES OUTPUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, value: JSON.parse(bytes) };
};
const [inputs, native, scores] = await Promise.all([
  read(inputFile),
  read(path.join(nativeDir, 'capture.json')),
  read(path.join(scoreDir, 'scores.json')),
]);
assert.equal(inputs.value.set, 'm21');
assert.equal(native.value.source.inputsHash, hash(inputs.bytes));
assert.equal(scores.value.definition.inputsHash, hash(inputs.bytes));
assert.equal(scores.value.definition.nativeCaptureHash, hash(native.bytes));
assert.equal(native.value.completed, inputs.value.entries.length);
assert.equal(native.value.denominator, native.value.completed);
assert.deepEqual(native.value.faults, []);
const index = (rows) => {
  const m = new Map(rows.map((r) => [r.id, r]));
  assert.equal(m.size, rows.length);
  return m;
};
const captures = index(native.value.rows),
  refs = index(scores.value.rows);
const assets = new Map(inputs.value.components.map((a) => [a.url, a]));
const windows = {
  frame: { left: [[26, 100, 7, 250]], right: [[455, 100, 7, 250]] },
  paper: { left: [[50, 442, 72, 142]], right: [[366, 442, 72, 142]] },
  namePaper: { left: [[75, 33, 130, 13]], right: [[282, 33, 130, 13]] },
  typePaper: { left: [[75, 385, 110, 17]], right: [[270, 385, 110, 17]] },
};
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
});
const groups = new Map(),
  excluded = [],
  neutralReferences = [],
  neutralSources = { namePaper: [], typePaper: [] };
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { framePlate } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const { model } = JSON.parse(await readFile('games/magic/fixtures/accuracy/early-hsb-plan.json'));
  for (const e of inputs.value.entries) {
    const type = e.face.canonicalTypeLine ?? e.face.typeLine ?? '';
    const reason = !/\bLand\b/.test(type)
      ? 'other-material'
      : e.face.frameAssetFamily !== 'm15-accurate'
        ? 'other-family'
        : !e.card.finishes.includes('nonfoil')
          ? 'foil-only'
          : null;
    if (reason) {
      excluded.push({ id: e.id, name: e.card.name, reason });
      continue;
    }
    const n = captures.get(e.id),
      r = refs.get(e.id);
    assert(n && r && !n.issue && r.poseAccepted && r.nonfoilEligible);
    assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(n.referenceHash, e.reference.sha256);
    const renderBytes = await readFile(path.join(nativeDir, n.layers.face.file)),
      refBytes = await readFile(path.join(scoreDir, r.normalizedReference.file));
    assert.equal(hash(renderBytes), n.layers.face.sha256);
    assert.equal(hash(refBytes), r.normalizedReference.sha256);
    const render = normalize(PNG.sync.read(renderBytes, { checkCRC: true })),
      scan = PNG.sync.read(refBytes, { checkCRC: true });
    assert.deepEqual([scan.width, scan.height], [488, 680]);
    const plate = framePlate(e.face);
    assert(plate);
    const basic = /\bBasic\b/.test(type);
    if (plate.rightFrame) {
      const parts = {},
        missing = {};
      for (const part of ['namePaper', 'typePaper']) {
        const rects = [...windows[part].left, ...windows[part].right];
        try {
          parts[part] = sampleColor(scan, rects, { paper: true });
        } catch (error) {
          if (!/Too few usable color tiles/.test(error.message)) throw error;
          missing[part] = error.message;
        }
      }
      neutralReferences.push({
        id: e.id,
        name: e.card.name,
        number: e.card.collector_number,
        referenceHash: e.reference.sha256,
        normalizedHash: r.normalizedReference.sha256,
        poseHash: r.poseHash,
        parts,
        missing,
      });
    }
    if (plate.frame.endsWith('/l.png') && !plate.rightFrame)
      for (const part of ['namePaper', 'typePaper']) {
        const rects = [...windows[part].left, ...windows[part].right];
        neutralSources[part].push(sampleColor(render, rects, { paper: true }));
      }
    const sources = plate.rightFrame
      ? [
          [plate.frame, ['left']],
          [plate.rightFrame, ['right']],
        ]
      : [[plate.frame, ['left', 'right']]];
    for (const [url, sides] of sources) {
      assert(assets.has(url) && /\/m15\/new\/l[wubrgm]?\.png$/.test(url), 'Unbound land source');
      let g = groups.get(url);
      if (!g) groups.set(url, (g = { source: url, assetHash: assets.get(url).sha256, rows: [] }));
      const parts = {},
        missing = {};
      for (const [part, patches] of Object.entries(windows)) {
        if (plate.rightFrame && (part === 'namePaper' || part === 'typePaper')) {
          missing[part] =
            'Nonbasic dual headers require a neutral source overlay; colored basic headers cannot drive their fit';
          continue;
        }

        const rects = sides.flatMap((side) => patches[side]),
          options = { tileSize: part === 'frame' ? 7 : 20, paper: part !== 'frame' };
        try {
          parts[part] = {
            source: sampleColor(render, rects, options),
            reference: sampleColor(scan, rects, options),
          };
        } catch (error) {
          if (!/Too few usable color tiles/.test(error.message)) throw error;
          missing[part] = error.message;
        }
      }
      g.rows.push({
        headerClass: basic
          ? 'colored-basic'
          : plate.rightFrame
            ? 'neutral-dual'
            : 'neutral-colorless',
        id: e.id,
        name: e.card.name,
        number: e.card.collector_number,
        sides,
        referenceHash: e.reference.sha256,
        normalizedHash: r.normalizedReference.sha256,
        nativeHash: n.layers.face.sha256,
        poseHash: r.poseHash,
        parts,
        missing,
      });
    }
  }
  const results = [];
  for (const g of groups.values()) {
    const parts = fitModernColorParts(g, windows, model, 0.01, math);
    const result = {
      source: g.source,
      assetHash: g.assetHash,
      nonfoilPrintings: g.rows.length,
      status:
        g.rows.length >= 3
          ? 'predicted-requires-native-replay'
          : 'insufficient-independent-printings',
      parts,
      printings: g.rows.map(({ parts, ...row }) => row),
    };
    results.push(result);
    console.log(
      JSON.stringify({
        source: g.source.split('/').at(-1),
        cards: g.rows.length,
        parts: Object.fromEntries(
          Object.entries(parts).map(([k, v]) => [
            k,
            {
              before: v.beforeMean,
              after: v.afterMean,
              worse: v.worse,
              missing: v.totalCards - v.measuredCards,
            },
          ]),
        ),
      }),
    );
  }
  const neutralRows = neutralReferences.map((row) => ({
    ...row,
    parts: Object.fromEntries(
      ['namePaper', 'typePaper'].flatMap((part) => {
        const reference = row.parts[part],
          samples = neutralSources[part];
        if (!reference || !samples.length) return [];
        const tiles = poolColorTiles(samples),
          rgb = center(samples.map((s) => s.rgb));
        return [
          [
            part,
            {
              source: {
                rgb,
                tiles,
                spread: quantile(
                  tiles.map((t) => delta(t, rgb)),
                  0.9,
                ),
              },
              reference,
            },
          ],
        ];
      }),
    ),
  }));
  const neutralSource = [...groups.values()].find((g) => g.source.endsWith('/l.png'));
  assert(
    neutralSource && neutralSources.namePaper.length >= 3 && neutralSources.typePaper.length >= 3,
    'Neutral source requires all three generic-land controls',
  );
  const neutralHeaders = {
    source: neutralSource.source,
    assetHash: neutralSource.assetHash,
    sourceControlPrintings: neutralSources.namePaper.length,
    nonfoilPrintings: neutralRows.length,
    status: 'neutral-source-overlay-required-before-native-replay',
    parts: fitModernColorParts(
      { rows: neutralRows },
      { namePaper: windows.namePaper, typePaper: windows.typePaper },
      model,
      0.01,
      math,
    ),
    printings: neutralRows.map(({ parts, ...row }) => row),
  };
  console.log(
    JSON.stringify({
      neutralHeaderSource: neutralSource.source.split('/').at(-1),
      cards: neutralRows.length,
      parts: Object.fromEntries(
        Object.entries(neutralHeaders.parts).map(([k, v]) => [k, [v.beforeMean, v.afterMean]]),
      ),
    }),
  );
  const paths = [
    'modern-land-color-fit.mjs',
    'modern-color-parts.mjs',
    'modern-color-fit-sampling.mjs',
    'hsb-color.mjs',
    'pixels-pure.mjs',
  ];
  await mkdir(output, { recursive: true });
  await writeJson(path.join(output, 'proposal.json'), {
    schema: 1,
    set: 'm21',
    status: 'land-color-predictions-not-adopted',
    denominator: inputs.value.entries.length,
    landPrintings: inputs.value.entries.length - excluded.length,
    policy:
      'Frozen accepted nonfoil references and native whole-card rasters. One shared fit per immutable land source. Duals use only fully visible source halves: rules patches lie outside the .27..73 paper blend, and header/rail patches outside the .47..53 join. Singles pool both sides once per card. Dual headers use a separate neutral generic-land source model; colored header fits use only basic lands. No scan movement, per-card color fit, gradient-center sampling or foil color targets. Native replay, source mask/contrast/black-point and geometry checks remain required.',
    source: {
      inputsHash: hash(inputs.bytes),
      nativeHash: hash(native.bytes),
      scoresHash: hash(scores.bytes),
      tools: await Promise.all(
        paths.map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
      ),
    },
    model,
    maxClipping: 0.01,
    windows,
    groups: results,
    neutralHeaders,
    excluded,
  });
} finally {
  await server.close();
}
