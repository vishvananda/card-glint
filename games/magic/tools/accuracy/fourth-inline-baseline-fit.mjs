// Offline symbol-only fit: one native composition per card, fixed text and scan pose.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
const [inputFile, captureFile, posesFile, refinementFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS CURRENT_CAPTURE POSES LAND_REFINEMENT NEW_OUTPUT');
const search = { dy: [-0.15, -0.125, -0.1, -0.075, -0.05, -0.025, 0, 0.025, 0.05] };

const raw = await Promise.all(
  [inputFile, captureFile, posesFile, refinementFile].map((f) => fs.readFile(f)),
);
const [input, capture, poses, refinement] = raw.map((b) => JSON.parse(b));
assert.equal(capture.inputHash, hash(raw[0]));
assert.equal(refinement.parentHash, hash(raw[2]));
assert.equal(refinement.inputHash, hash(raw[0]));
const rendererHash = await sourceHash(root + '/games/magic/src');
assert.equal(capture.rendererHash, rendererHash);
const entries = input.entries.filter(
  (e) => e.card.set === '4ed' && /\{[WUBRGT]\}/.test(e.face.rulesText),
);
assert.equal(entries.length, 112);
await fs.writeFile(out, '{}\n', { flag: 'wx' });
const session = await openBrowser(input, {
  plugins: [
    {
      name: 'isolated-fourth-inline-baseline-fit',
      enforce: 'pre',
      transform(code, id) {
        const file = id.split('?')[0];
        if (file.endsWith('/presentation/retro-details.ts')) {
          const n =
            'export const paintFourthMana: typeof paintMana = (c, symbol, x, y, size, images) => {';
          assert.equal(code.split(n).length, 2);
          return code.replace(
            n,
            n + '\n if ((globalThis as any).__inlineFit?.(c,symbol,x,y,size,images)) return;',
          );
        }
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
    const reference = normalize(PNG.sync.read(rb), transform);
    const result = await session.page.evaluate(
      async ({ e, reference, search }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { paintFourthMana } = await import('/games/magic/src/presentation/retro-details.ts');
        const { TextFilledObjective } = await import(
          '/games/magic/tools/accuracy/text-filled-objective.mjs'
        );
        const { nativeGrayCrop } = await import(
          '/games/magic/tools/accuracy/abu-type-objective.mjs'
        );
        const { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const records = [];
        let sampling = false;
        globalThis.__inlineFit = (c, symbol, x, y, size, images) => {
          if (sampling || !['T', 'W', 'U', 'B', 'R', 'G'].includes(symbol)) return false;
          const rect = [
            Math.floor(x) - 5,
            Math.floor(y) - 6,
            Math.ceil(size) + 11,
            Math.ceil(size) + 13,
          ];
          const target = cropGray(reference, rect),
            objective = new TextFilledObjective(
              target.gray,
              target.width,
              target.height,
              new Uint8Array(target.width * target.height).fill(1),
            );
          const origin = [Math.floor(rect[0] * 1.5) - 1, Math.floor(rect[1] * 1.5) - 1],
            w = Math.ceil((rect[0] + rect[2]) * 1.5) + 1 - origin[0],
            h = Math.ceil((rect[1] + rect[3]) * 1.5) + 1 - origin[1];
          const background = c.getImageData(...origin, w, h),
            candidates = [];
          const score = (a) => {
            c.putImageData(background, ...origin);
            c.save();
            sampling = true;
            try {
              c.translate(0, a.dy * size);
              paintFourthMana(c, symbol, x, y, size, images);
            } finally {
              sampling = false;
              c.restore();
            }
            return objective.score(nativeGrayCrop(c.getImageData(...origin, w, h), rect, origin));
          };
          for (const dy of search.dy) {
            const a = { dy };
            candidates.push({ parameters: a, ...score(a) });
          }
          c.putImageData(background, ...origin);
          // The unmodified production callback paints the baseline after sampling.
          records.push({ symbol, x, y, size, rect, candidates });
          return false;
        };
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        try {
          const image = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            new AbortController().signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          try {
            return { png: image.toDataURL().split(',')[1], records };
          } finally {
            image.width = image.height = 0;
          }
        } finally {
          lease.dispose();
          delete globalThis.__inlineFit;
        }
      },
      { e, reference: { ...reference, data: Array.from(reference.data) }, search },
    );
    const baseline = capture.rows.find((r) => r.id === e.id).modes.original;
    assert.equal(
      hash(Buffer.from(result.png, 'base64')),
      baseline.sha256,
      'Symbol search altered baseline',
    );
    rows.push({
      id: e.id,
      name: e.name,
      color: e.material,
      basic: /^Basic Land\b/.test(e.card.type_line),
      referenceHash: e.reference.sha256,
      nativeHash: baseline.sha256,
      poseHash: hash(JSON.stringify(transform)),
      symbols: result.records,
    });
    console.log(e.name, e.card.collector_number);
  }
  assert.deepEqual(session.faults, []);
  const groups = {};
  for (const symbol of ['T', 'W', 'U', 'B', 'R', 'G']) {
    const samples = rows.flatMap((r) =>
      r.symbols.filter((s) => s.symbol === symbol).map((s) => ({ id: r.id, ...s })),
    );
    const aggregated = samples[0].candidates
      .map((c, index) => {
        const peers = samples.map((s) => s.candidates[index]);
        assert(peers.every((p) => JSON.stringify(p.parameters) === JSON.stringify(c.parameters)));
        return {
          parameters: c.parameters,
          score100: (peers.reduce((v, p) => v + p.score, 0) / peers.length) * 100,
          perCard: samples.map((s, i) => ({ id: s.id, score100: peers[i].score * 100 })),
        };
      })
      .sort((a, b) => b.score100 - a.score100);
    groups[symbol] = { count: samples.length, best: aggregated[0], candidates: aggregated };
  }
  assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
  await writeJson(out, {
    schema: 1,
    status: 'shared-inline-whole-symbol-baseline-study-not-adopted',
    scope:
      'All 112 Fourth Original cards with WUBRGT symbols, including 15 basics and 97 nonbasic controls. Nine shared vertical offsets in fractions of symbol size move the whole existing circle and glyph together. Words, shapes, palettes, text layout and fixed scan-only poses are unchanged. One native composition per card, local painter replays only, all default PNGs exact. All scans are reused development observations. No renderer change or set certification.',
    rendererHash,
    inputHash: hash(raw[0]),
    captureHash: hash(raw[1]),
    posesHash: hash(raw[2]),
    refinementHash: hash(raw[3]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    search,
    groups,
    rows,
  });
} finally {
  await session.close();
}
