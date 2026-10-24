// Fixed-size, fixed-baseline flavor-width experiment on cached Original faces.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, root, sourceHash, objectFile } from './common.mjs';
import { printingFlavorDelta } from './printing-flavor-data-ancestry.mjs';
import { openBrowser } from './browser.mjs';
import { abuFlavorWidthPlugin } from './abu-flavor-width-plugin.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
const [inputsFile, out, option] = process.argv.slice(2);
assert(out, 'Usage: abu-flavor-width-study.mjs INPUTS OUT [--pilot|--wrap|--wrap-pilot]');
assert(option === undefined || ['--pilot', '--wrap', '--wrap-pilot'].includes(option));
const wrapStudy = option?.includes('wrap') ?? false;
const pilotStudy = option?.includes('pilot') ?? false;
const bytes = await readFile(inputsFile),
  inputs = JSON.parse(bytes);
const paper = await printingFlavorDelta();
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), paper.afterRenderer);
const native = JSON.parse(gunzipSync(await readFile(paper.native.file)));
assert.equal(hash(bytes), native.source.afterInputHash ?? native.source.inputHash);
const controls = new Set(['Keldon Warlord', 'Animate Dead', 'Warp Artifact']);
const pilot = new Set([
  'Scryb Sprites',
  'Wall of Water',
  'Fire Elemental',
  'Wall of Fire',
  'Keldon Warlord',
]);
const entries = inputs.entries.filter((e) =>
  pilotStudy
    ? pilot.has(e.name)
    : e.face.rulesParagraphs?.some((p) => p.role === 'flavor') || controls.has(e.name),
);
assert(entries.every((e) => e.face.wordingMode === 'original'));
const trials = wrapStudy
  ? [
      { id: 'current', scale: null },
      { id: 'reflow-control', scale: 1 },
      { id: 'wrap-minus2', scale: 1, wrapDelta: -2 },
      { id: 'wrap-minus4', scale: 1, wrapDelta: -4 },
      { id: 'wrap-minus6', scale: 1, wrapDelta: -6 },
      { id: 'wrap-minus8', scale: 1, wrapDelta: -8 },
    ]
  : [
      { id: 'current', scale: null },
      { id: 'reflow-control', scale: 1 },
      { id: 'italic-098', scale: 0.98 },
      { id: 'italic-099', scale: 0.99 },
      { id: 'italic-101', scale: 1.01 },
      { id: 'italic-102', scale: 1.02 },
    ];
await mkdir(out, { recursive: true });
const transformed = {},
  rows = [];
const source = {
  rendererHash: paper.afterRenderer,
  inputHash: hash(bytes),
  nativeHash: paper.native.contentSha256,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    [
      'abu-flavor-width-plugin.mjs',
      'browser.mjs',
      'abu-assets.mjs',
      'pixels-pure.mjs',
      'abu-type-objective.mjs',
      'text-filled-objective.mjs',
      'edges.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  scope: option ?? 'all-228-flavor-plus-rules-controls',
  variable: wrapStudy ? 'flavor-wrap-width-only' : 'italic-glyph-width-only',
  policy:
    'Original wording, fixed scan poses, selected size, baselines, regular ink and role row counts. ' +
    (wrapStudy
      ? 'Only flavor wrap width changes; glyph advances stay unchanged. '
      : 'Only italic flavor glyph width changes. ') +
    'Row-count changes are reported and withheld. Study-only; no runtime adoption.',
};
const checkpoint = async () =>
  writeFile(
    path.join(out, 'capture.json'),
    JSON.stringify(
      {
        schema: 1,
        status: source.closed && rows.length === entries.length ? 'complete' : 'in-progress',
        source,
        trials,
        transformed,
        total: entries.length,
        completed: rows.length,
        rows,
      },
      null,
      2,
    ) + '\n',
  );
const session = await openBrowser(
  { ...inputs, entries },
  { plugins: [abuFlavorWidthPlugin(transformed)] },
);
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const api = await import('/games/magic/src/presentation/rules-layout.ts');
    globalThis.__compose = (
      await import('/games/magic/src/presentation/canvas-face.ts')
    ).composeCardTexture;
    globalThis.__assets = await import('/games/magic/tools/accuracy/abu-assets.mjs');
    globalThis.__urls = (
      await import('/games/magic/src/presentation/canvas-assets.ts')
    ).canvasAssetUrls;
    globalThis.__abuFlavorApply = (context, layout) => {
      globalThis.__layout = layout;
      globalThis.__proposal = null;
      if (!layout || globalThis.__abuFlavorScale === null) return layout;
      const r = api.rulesLayoutRequest(layout);
      if (!r) throw Error('Missing final native flavor request');
      let candidate;
      globalThis.__abuFlavorReflow = true;
      try {
        candidate = api.layoutRules(context, r.paragraphs, r.bounds, layout.size, layout.size, {
          ...r.typography,
          fractionalMetrics: layout.fractionalMetrics,
        });
      } finally {
        globalThis.__abuFlavorReflow = false;
      }
      const signature = (l) => l.lines.map((line) => line.role);
      const rejected =
        candidate.overflow ||
        JSON.stringify(signature(candidate)) !== JSON.stringify(signature(layout));
      globalThis.__proposal = {
        rejected,
        rows: candidate.lines.length,
        originalRows: layout.lines.length,
        size: candidate.size,
      };
      if (rejected) return layout;
      for (let i = 0; i < layout.lines.length; i++) {
        const old = layout.lines[i],
          line = candidate.lines[i];
        if (old.role === 'rules' && JSON.stringify(old.runs) !== JSON.stringify(line.runs))
          throw Error('Flavor-width trial changed regular rules ink');
      }
      candidate = {
        ...layout,
        lines: candidate.lines.map((line, i) => {
          const old = layout.lines[i],
            dy = old.baseline - line.baseline;
          return {
            ...line,
            baseline: old.baseline,
            ...(old.role === 'rules' ? { x: old.x } : {}),
            inkBounds: [
              line.inkBounds[0],
              line.inkBounds[1] + dy,
              line.inkBounds[2],
              line.inkBounds[3],
            ],
          };
        }),
      };
      globalThis.__layout = candidate;
      return candidate;
    };
  });
  for (const entry of entries) {
    const raw = await readFile(objectFile(entry.reference));
    assert.equal(hash(raw), entry.reference.sha256);
    const reference = normalize(PNG.sync.read(raw), entry.pose.transform);
    const renders = await session.page.evaluate(
      async ({ entry, trials }) => {
        const signal = new AbortController().signal;
        const lease = await globalThis.__assets.loadAccuracyImages(
          globalThis.__urls(entry.face),
          signal,
          entry.face.illustration,
        );
        const results = [];
        try {
          for (const t of trials) {
            globalThis.__abuFlavorScale = t.scale;
            globalThis.__abuFlavorWrapDelta = t.wrapDelta ?? 0;
            globalThis.__layout = null;
            const image = await globalThis.__compose(
              { face: entry.face, printingId: entry.id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              results.push({
                id: t.id,
                png: image.toDataURL().split(',')[1],
                layout: globalThis.__layout,
                proposal: globalThis.__proposal,
              });
            } finally {
              image.width = image.height = 0;
            }
          }
        } finally {
          lease.dispose();
          globalThis.__abuFlavorScale = null;
        }
        return results;
      },
      { entry, trials },
    );
    const expected = native.rows.find((r) => r.id === entry.id);
    assert.equal(
      hash(Buffer.from(renders[0].png, 'base64')),
      expected.original.hashes['after-face'],
      'Current study native baseline mismatch: ' + entry.set + '/' + entry.name,
    );
    const baseline = PNG.sync.read(Buffer.from(renders[0].png, 'base64'));
    const rect = [54, 405, 390, 197],
      gray = cropGray(reference, rect).gray;
    const mask = new Uint8Array(gray.length);
    const flavor = renders[0].layout?.lines.filter((l) => l.role === 'flavor') ?? [];
    if (flavor.length) {
      const top = Math.min(...flavor.map((l) => l.inkBounds[1])) - 2;
      const bottom = Math.max(...flavor.map((l) => l.inkBounds[1] + l.inkBounds[3])) + 2;
      for (let y = 0; y < 197; y++)
        for (let x = 0; x < 390; x++)
          if (y + 405 >= top && y + 405 <= bottom && x + 54 >= 72 && x + 54 <= 423)
            mask[y * 390 + x] = 1;
    } else mask.fill(1);
    const objective = new TextFilledObjective(gray, 390, 197, mask);
    const variants = [];
    for (const render of renders) {
      const png = Buffer.from(render.png, 'base64'),
        image = PNG.sync.read(png);
      assert.deepEqual([image.width, image.height], [732, 1020]);
      let changed = 0,
        outside = 0,
        alpha = 0;
      for (let i = 0; i < image.data.length; i += 4) {
        if (image.data[i + 3] !== baseline.data[i + 3]) alpha++;
        if (
          image.data[i] !== baseline.data[i] ||
          image.data[i + 1] !== baseline.data[i + 1] ||
          image.data[i + 2] !== baseline.data[i + 2] ||
          image.data[i + 3] !== baseline.data[i + 3]
        ) {
          changed++;
          const p = i / 4,
            x = p % 732,
            y = Math.floor(p / 732);
          if (x < 75 || x > 678 || y < 600 || y > 907) outside++;
        }
      }
      assert.equal(outside, 0);
      assert.equal(alpha, 0);
      if (render.id === 'reflow-control') {
        assert.equal(render.proposal?.rejected, false, 'Reflow-control rejected');
        assert.equal(changed, 0, 'Reflow-control changes production pixels: ' + entry.name);
      }
      if (!flavor.length) assert.equal(changed, 0, 'Regular-only negative control changed');
      const crop = new PNG({ width: 585, height: 296 });
      PNG.bitblt(image, crop, 81, 607, 585, 296, 0, 0);
      await writeFile(path.join(out, entry.id + '-' + render.id + '.png'), PNG.sync.write(crop));
      variants.push({
        id: render.id,
        renderHash: hash(png),
        changed,
        outside,
        alpha,
        layout: render.layout,
        proposal: render.proposal,
        objective: objective.score(nativeGrayCrop(image, rect)),
      });
    }
    rows.push({
      id: entry.id,
      name: entry.name,
      set: entry.set,
      referenceHash: entry.reference.sha256,
      poseHash: hash(JSON.stringify(entry.pose.transform)),
      inputHash: expected.inputHash,
      flavor: flavor.length > 0,
      variants,
    });
    await checkpoint();
    console.log(rows.length + '/' + entries.length + ' ' + entry.set + ' ' + entry.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), source.rendererHash);
  assert.equal(hash(await readFile(new URL(import.meta.url))), source.toolHash);
  for (const [file, expected] of source.dependencies)
    assert.equal(hash(await readFile(new URL(file, import.meta.url))), expected);

  source.closed = true;
  await checkpoint();
} finally {
  await session.close();
}
