// Offline native-request fit with one fixed symbol exclusion mask per printing.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, captureFile, posesFile, refinementFile, out, gridFile] = process.argv.slice(2);
assert(out, 'Use INPUTS NATIVE_CAPTURE POSES LAND_REFINEMENT NEW_OUTPUT_DIRECTORY');
const raw = await Promise.all(
  [inputFile, captureFile, posesFile, refinementFile].map((f) => fs.readFile(f)),
);
const [input, capture, poses, refinement] = raw.map((b) => JSON.parse(b));
assert.equal(capture.inputHash, hash(raw[0]));
assert.equal(refinement.inputHash, hash(raw[0]));
assert.equal(refinement.parentHash, hash(raw[2]));
const rendererHash = await sourceHash(root + '/games/magic/src');
assert.equal(capture.rendererHash, rendererHash);
const entries = input.entries.filter(
  (e) => e.card.set === '4ed' && /^Basic Land\b/.test(e.card.type_line),
);
assert.equal(entries.length, 15);
const gridBytes = gridFile ? await fs.readFile(gridFile) : null;
const grid = gridBytes
  ? JSON.parse(gridBytes)
  : {
      size: [24, 24.5, 25, 25.5],
      textWidth: [0.98, 1, 1.01, 1.02],
      dx: [-1, 0, 1],
      dy: [-3, -2, -1, 0, 1],
    };
await fs.mkdir(out);
const objectiveGraph = await metricSourceGraph(
  root + '/games/magic/tools/accuracy/text-filled-objective.mjs',
);
const session = await openBrowser(input, {
  plugins: [
    {
      name: 'native-basic-word-fit',
      enforce: 'pre',
      transform(code, id) {
        if (!id.split('?')[0].endsWith('/presentation/rules-paint.ts')) return;
        const from = '  if (!rulesInkVisible(context)) return;';
        assert.equal(code.split(from).length, 2);
        return code.replace(
          from,
          '  if ((globalThis as any).__basicWordHook?.(context,layout,images,paintSymbol,inkInsetEm,color)) return;\n' +
            from,
        );
      },
    },
  ],
});
const rows = [];
try {
  for (const e of entries) {
    const rb = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(rb), e.reference.sha256);
    const pose = poses.rows.find((r) => r.id === e.id);
    assert(pose?.accepted);
    const transform =
      refinement.rows.find((r) => r.id === e.id && r.acceptedExperimental)?.transform ??
      pose.transform;
    const scan = normalize(PNG.sync.read(rb), transform);
    const baseline = capture.rows.find((r) => r.id === e.id).modes.original;
    const result = await session.page.evaluate(
      async ({ e, grid, scan }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { rulesLayoutRequest, layoutRules } = await import(
          '/games/magic/src/presentation/rules-layout.ts'
        );
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { nativeGrayCrop } = await import(
          '/games/magic/tools/accuracy/abu-type-objective.mjs'
        );
        const { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const { TextFilledObjective } = await import(
          '/games/magic/tools/accuracy/text-filled-objective.mjs'
        );
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
          hooks = { loadImages: async () => ({ ...lease, dispose() {} }) },
          card = { face: e.face, printingId: e.id, printedImage: null };
        let full, background, body;
        try {
          full = await composeCardTexture(card, 'inspect', signal, hooks);
          const beforePng = full.toDataURL().split(',')[1],
            original = full.getContext('2d').getImageData(0, 0, 732, 1020);
          globalThis.__basicWordHook = (c, layout, images, ...args) => {
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
            background = await composeCardTexture(card, 'inspect', signal, hooks);
          } finally {
            delete globalThis.__basicWordHook;
          }
          if (!body) throw Error('Missing native rules body');
          const request = rulesLayoutRequest(body.layout);
          if (!request) throw Error('Missing native request');
          const canvas = document.createElement('canvas');
          canvas.width = 732;
          canvas.height = 1020;
          const c = canvas.getContext('2d', { willReadFrequently: true }),
            layouts = [];
          for (const size of grid.size)
            for (const textWidth of grid.textWidth)
              for (const dx of grid.dx)
                for (const dy of grid.dy) {
                  c.setTransform(body.matrix);
                  Object.assign(c, body.properties);
                  const params = { size, textWidth, dx, dy };
                  const layout = layoutRules(
                    c,
                    request.paragraphs,
                    { ...request.bounds, x: request.bounds.x + dx },
                    size,
                    size,
                    {
                      ...request.typography,
                      textWidth,
                      centerOffset: (request.typography.centerOffset ?? 0) + dy,
                    },
                  );
                  if (layout.overflow || layout.lines.length !== 1)
                    throw Error('Basic trial changed row count');
                  layouts.push({ params, layout });
                }
          const rect = [60, 468, 368, 48],
            mask = new Uint8Array(rect[2] * rect[3]).fill(1),
            exclusions = [];
          // The union comes only from semantic symbol boxes in the predeclared grid.
          // All references and trials use the same mask; no candidate ink is inspected.
          for (const { layout } of [...layouts, { layout: body.layout }])
            for (const line of layout.lines) {
              let x = line.x ?? layout.x;
              for (const run of line.runs) {
                if (run.symbol) {
                  const b = [
                    x + run.size * 0.025 - 4,
                    line.baseline - run.size * 0.72 - 4,
                    run.size * 0.8 + 8,
                    run.size * 0.8 + 8,
                  ];
                  exclusions.push(b);
                  for (
                    let y = Math.max(rect[1], Math.floor(b[1]));
                    y < Math.min(rect[1] + rect[3], Math.ceil(b[1] + b[3]));
                    y++
                  )
                    for (
                      let xx = Math.max(rect[0], Math.floor(b[0]));
                      xx < Math.min(rect[0] + rect[2], Math.ceil(b[0] + b[2]));
                      xx++
                    )
                      mask[(y - rect[1]) * rect[2] + xx - rect[0]] = 0;
                }
                x += run.width;
              }
            }
          const target = cropGray(scan, rect),
            objective = new TextFilledObjective(target.gray, rect[2], rect[3], mask);
          function paint(layout) {
            c.resetTransform();
            c.clearRect(0, 0, 732, 1020);
            c.drawImage(background, 0, 0);
            Object.assign(c, body.properties);
            c.setTransform(body.matrix);
            paintRulesLayout(c, layout, body.images, ...body.args);
            c.resetTransform();
          }
          paint(body.layout);
          const replay = c.getImageData(0, 0, 732, 1020);
          for (let i = 0; i < replay.data.length; i++)
            if (replay.data[i] !== original.data[i])
              throw Error('Native request replay changed pixels');
          const before = objective.score(nativeGrayCrop(replay, rect)),
            trials = [];
          let best = { score: -Infinity },
            candidatePng;
          for (const { params, layout } of layouts) {
            paint(layout);
            const metric = objective.score(
              nativeGrayCrop(
                c.getImageData(rect[0] * 1.5, rect[1] * 1.5, rect[2] * 1.5, rect[3] * 1.5),
                rect,
                [rect[0] * 1.5, rect[1] * 1.5],
              ),
            );
            trials.push({ params, ...metric });
            if (metric.score > best.score) {
              best = { params, ...metric };
              candidatePng = canvas.toDataURL().split(',')[1];
            }
          }
          return {
            beforePng,
            candidatePng,
            request,
            rect,
            maskHashInput: Array.from(mask),
            before,
            best,
            trials,
          };
        } finally {
          delete globalThis.__basicWordHook;
          lease.dispose();
          if (full) full.width = full.height = 0;
          if (background) background.width = background.height = 0;
        }
      },
      { e, grid, scan: { ...scan, data: Array.from(scan.data) } },
    );
    assert.equal(
      hash(Buffer.from(result.beforePng, 'base64')),
      baseline.sha256,
      'Original baseline changed',
    );
    const candidate = Buffer.from(result.candidatePng, 'base64'),
      file = e.id + '-individual-best.png';
    await fs.writeFile(path.join(out, file), candidate);
    rows.push({
      id: e.id,
      name: e.name,
      color: e.card.produced_mana[0],
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(transform)),
      nativeHash: baseline.sha256,
      request: result.request,
      rect: result.rect,
      maskHash: hash(Uint8Array.from(result.maskHashInput)),
      before: result.before,
      best: result.best,
      trials: result.trials,
      individualCandidate: { file, sha256: hash(candidate) },
    });
    console.log(
      e.name,
      e.card.collector_number,
      result.before.score,
      result.best.params,
      result.best.score,
    );
  }
  assert.deepEqual(session.faults, []);
  const shared = rows[0].trials
    .map((t, i) => {
      const peer = rows.map((r) => r.trials[i]);
      assert(peer.every((p) => JSON.stringify(p.params) === JSON.stringify(t.params)));
      return {
        params: t.params,
        score100: (peer.reduce((n, p) => n + p.score, 0) / peer.length) * 100,
        before100: (rows.reduce((n, r) => n + r.before.score, 0) / rows.length) * 100,
        gains: peer.filter((p, i) => p.score > rows[i].before.score + 1e-12).length,
        losses: peer.filter((p, i) => p.score < rows[i].before.score - 1e-12).length,
      };
    })
    .sort((a, b) => b.score100 - a.score100);
  assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
  await writeJson(path.join(out, 'study.json'), {
    schema: 1,
    status: 'shared-basic-land-word-fit-development-not-adopted',
    scope:
      'All fifteen Fourth basics. Fixed normalized Original scans. One native request and one fixed semantic symbol-exclusion union per card. Shared size, text width, x and vertical offset search uses only words; no glyph fitting or per-card runtime parameters. Individual previews are diagnostics only. Development scans reused, no blind holdout.',
    rendererHash,
    inputHash: hash(raw[0]),
    captureHash: hash(raw[1]),
    posesHash: hash(raw[2]),
    refinementHash: hash(raw[3]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    objectiveGraph,
    gridHash: gridBytes ? hash(gridBytes) : null,
    grid,
    shared,
    rows,
  });
} finally {
  await session.close();
}
