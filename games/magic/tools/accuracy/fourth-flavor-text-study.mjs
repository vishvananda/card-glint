// Frozen native-request experiment. Source scans/art stay in the local cache.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, root, objectFile, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, captureFile, posesFile, out] = process.argv.slice(2);
assert(out, 'Usage: fourth-flavor-text-study.mjs INPUTS NATIVE_CAPTURE FROZEN_POSES NEW_OUTPUT');
const raw = await Promise.all([inputFile, captureFile, posesFile].map((f) => fs.readFile(f)));
const [inputs, capture, poses] = raw.map((b) => JSON.parse(b));
assert.equal(capture.status, 'complete');
assert.deepEqual(capture.faults, []);
assert.equal(capture.inputHash, hash(raw[0]));
const sourceRoot = path.resolve(process.env.NATIVE_RENDERER_ROOT ?? root);
const renderer = await sourceHash(path.join(sourceRoot, 'games/magic/src'));
assert.equal(capture.rendererHash, renderer);
const fourth = inputs.entries.filter((e) => e.card.set === '4ed');
assert.equal(fourth.length, 378);
const entries = fourth.filter(
  (e) => e.face.rulesParagraphs.length && e.face.rulesParagraphs.every((p) => p.role === 'flavor'),
);
assert.equal(entries.length, 19);
await fs.mkdir(out);
const plugin = {
  name: 'isolated-native-flavor-request',
  enforce: 'pre',
  transform(code, id) {
    if (!id.split('?')[0].endsWith('/rules-paint.ts')) return;
    const from = '  if (!rulesInkVisible(context)) return;';
    assert.equal(code.split(from).length, 2);
    return code.replace(
      from,
      '  if ((globalThis as any).__flavorHook?.(context,layout,images,paintSymbol,inkInsetEm,color)) return;\n' +
        from,
    );
  },
};
const session = await openBrowser(inputs, { sourceRoot, plugins: [plugin] }),
  rows = [];
try {
  for (const e of entries) {
    const p = poses.rows.find((p) => p.id === e.id),
      baseline = capture.rows.find((r) => r.id === e.id).modes.original;
    assert(p?.accepted);
    assert.equal(p.referenceHash, e.reference.sha256);
    assert.equal(baseline.inputHash, hash(JSON.stringify(e.face)));
    const reference = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(reference), e.reference.sha256);
    const normalized = normalize(PNG.sync.read(reference), p.transform);
    const scan = PNG.sync.write({
      width: normalized.width,
      height: normalized.height,
      data: Buffer.from(normalized.data),
    });
    const result = await session.page.evaluate(
      async ({ e, baseline, scan }) => {
        await import('/games/magic/src/data/eager.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { layoutRules, rulesLayoutRequest } = await import(
          '/games/magic/src/presentation/rules-layout.ts'
        );
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { profile } = await import('/games/magic/src/calibration/sets/4ed.ts');
        const { TextFilledObjective } = await import(
          '/games/magic/tools/accuracy/text-filled-objective.mjs'
        );
        const { nativeGrayCrop } = await import(
          '/games/magic/tools/accuracy/abu-type-objective.mjs'
        );
        const { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const digest = async (bytes) =>
          Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (b) =>
            b.toString(16).padStart(2, '0'),
          ).join('');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration);
        const hooks = { loadImages: async () => ({ ...lease, dispose() {} }) },
          input = { face: e.face, printingId: e.id, printedImage: null };
        let full, background, body;
        try {
          delete globalThis.__flavorHook;
          full = await composeCardTexture(input, 'inspect', signal, hooks);
          const fullPng = full.toDataURL().split(',')[1];
          const bytes = Uint8Array.from(atob(fullPng), (c) => c.charCodeAt(0));
          if ((await digest(bytes)) !== baseline.sha256)
            throw Error('Native baseline drift ' + e.name);
          const original = full.getContext('2d').getImageData(0, 0, 732, 1020);
          globalThis.__flavorHook = (c, layout, images, ...args) => {
            body = {
              layout,
              images,
              args,
              matrix: c.getTransform(),
              properties: Object.fromEntries(
                [
                  'imageSmoothingEnabled',
                  'imageSmoothingQuality',
                  'fontKerning',
                  'textRendering',
                  'shadowColor',
                  'shadowBlur',
                  'shadowOffsetX',
                  'shadowOffsetY',
                  'globalAlpha',
                  'globalCompositeOperation',
                  'filter',
                ].map((k) => [k, c[k]]),
              ),
            };
            return true;
          };
          try {
            background = await composeCardTexture(input, 'inspect', signal, hooks);
          } finally {
            delete globalThis.__flavorHook;
          }
          if (!body) throw Error('Missing flavor body');
          const request = rulesLayoutRequest(body.layout);
          if (!request) throw Error('Missing native request');
          const sc = document.createElement('canvas');
          sc.width = 488;
          sc.height = 680;
          const image = new Image();
          image.src = scan;
          await image.decode();
          sc.getContext('2d').drawImage(image, 0, 0);
          const rect = [76, 419, 336, 177];
          const objective = new TextFilledObjective(
            cropGray(sc.getContext('2d').getImageData(0, 0, 488, 680), rect).gray,
            rect[2],
            rect[3],
            new Uint8Array(rect[2] * rect[3]).fill(1),
          );
          const canvas = document.createElement('canvas');
          canvas.width = 732;
          canvas.height = 1020;
          const c = canvas.getContext('2d', { willReadFrequently: true }),
            trials = [];
          let candidatePng;
          for (const id of ['current', 'fractional']) {
            c.resetTransform();
            c.clearRect(0, 0, 732, 1020);
            c.drawImage(background, 0, 0);
            Object.assign(c, body.properties);
            c.setTransform(body.matrix);
            const retain =
              body.layout.size === profile.bodyClasses.centered.size ||
              request.typography.fractionalMetrics !== undefined;
            const layout =
              id === 'current' || retain
                ? body.layout
                : layoutRules(
                    c,
                    request.paragraphs,
                    request.bounds,
                    request.maximumSize,
                    request.minimumSize,
                    { ...request.typography, fractionalMetrics: true },
                  );
            if (layout.overflow) throw Error('Flavor request overflow ' + e.name);
            paintRulesLayout(c, layout, body.images, ...body.args);
            c.resetTransform();
            const pix = c.getImageData(0, 0, 732, 1020);
            let changed = 0,
              outside = 0,
              alpha = 0,
              max = 0;
            for (let i = 0; i < pix.data.length; i += 4) {
              let different = false;
              for (let k = 0; k < 4; k++) {
                const d = Math.abs(pix.data[i + k] - original.data[i + k]);
                if (d) {
                  different = true;
                  max = Math.max(max, d);
                }
              }
              if (pix.data[i + 3] !== original.data[i + 3]) alpha++;
              if (!different) continue;
              changed++;
              const x = (i / 4) % 732,
                y = Math.floor(i / 4 / 732);
              if (x < 53 * 1.5 || x >= (53 + 392) * 1.5 || y < 405 * 1.5 || y >= (405 + 199) * 1.5)
                outside++;
            }
            if (outside || alpha || (id === 'current' && max))
              throw Error('Flavor replay/isolation failed ' + e.name);
            const png = canvas.toDataURL().split(',')[1];
            if (id === 'fractional') candidatePng = png;
            trials.push({
              id,
              retain,
              changed,
              outside,
              alpha,
              pixelHash: await digest(pix.data),
              metric: objective.score(nativeGrayCrop(pix, rect)),
              layout: {
                size: layout.size,
                x: layout.x,
                width: layout.width,
                top: layout.top,
                height: layout.height,
                lines: layout.lines.map((l) => ({
                  text: l.runs.map((r) => r.text).join(''),
                  baseline: l.baseline,
                  x: l.x ?? layout.x,
                })),
              },
            });
          }
          return { beforePng: fullPng, candidatePng, request, trials };
        } finally {
          delete globalThis.__flavorHook;
          full && (full.width = full.height = 0);
          background && (background.width = background.height = 0);
          lease.dispose();
        }
      },
      { e, baseline, scan: 'data:image/png;base64,' + scan.toString('base64') },
    );
    const { beforePng, candidatePng, ...data } = result;
    const beforeBytes = Buffer.from(beforePng, 'base64'),
      afterBytes = Buffer.from(candidatePng, 'base64');
    assert.equal(hash(beforeBytes), baseline.sha256);
    await fs.writeFile(path.join(out, e.id + '-before.png'), beforeBytes);
    await fs.writeFile(path.join(out, e.id + '-candidate.png'), afterBytes);
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: e.reference.sha256,
      inputHash: baseline.inputHash,
      poseHash: hash(JSON.stringify(p.transform)),
      beforeHash: baseline.sha256,
      candidateHash: hash(afterBytes),
      ...data,
    });
    await writeJson(path.join(out, 'study.json'), { status: 'running', rows });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(sourceRoot, 'games/magic/src')), renderer);
  assert.deepEqual(
    await Promise.all(
      [inputFile, captureFile, posesFile].map(async (f) => hash(await fs.readFile(f))),
    ),
    raw.map(hash),
  );
  const mean = (index) =>
    (100 * rows.reduce((s, r) => s + r.trials[index].metric.score, 0)) / rows.length;
  await writeJson(path.join(out, 'study.json'), {
    schema: 1,
    status: 'complete-native-flavor-request-study',
    set: '4ed',
    scope:
      'All19 pure-flavor Originals, fixed native bounds/type range/spacing/alignment, centered and explicit policies retained. Frozen reused-development poses; regional filled-ink/edge objective, not whole-card or independent certification. No per-card geometry.',
    rendererHash: renderer,
    inputsHash: hash(raw[0]),
    captureHash: hash(raw[1]),
    posesHash: hash(raw[2]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    objectiveGraphs: {
      filled: await metricSourceGraph(
        new URL('./text-filled-objective.mjs', import.meta.url).pathname,
      ),
      crop: await metricSourceGraph(new URL('./abu-type-objective.mjs', import.meta.url).pathname),
    },
    summary: {
      cards: rows.length,
      before100: mean(0),
      after100: mean(1),
      gains: rows.filter((r) => r.trials[1].metric.score > r.trials[0].metric.score).length,
      losses: rows.filter((r) => r.trials[1].metric.score < r.trials[0].metric.score).length,
    },
    rows,
  });
  console.log({ cards: rows.length, before100: mean(0), after100: mean(1) });
} finally {
  await session.close();
}
