// Offline symbol-only fit: one native composition per card, fixed text and scan pose.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
const [inputFile, captureFile, posesFile, refinementFile, out, searchFile] = process.argv.slice(2);
assert(out, 'Use INPUTS CAPTURE POSES LAND_REFINEMENT NEW_OUTPUT');
const searchBytes = searchFile ? await fs.readFile(searchFile) : null;
const search = searchBytes
  ? JSON.parse(searchBytes)
  : {
      colored: {
        scale: [0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25],
        dx: [-1, -0.5, 0, 0.5, 1],
        dy: [-1, -0.5, 0, 0.5, 1],
      },
      tap: {
        palette: [false, true],
        sx: [0.8, 0.9, 1, 1.1],
        sy: [0.9, 1, 1.1],
        rotation: [-10, -5, 0, 5, 10],
      },
    };
for (const [kind, grid] of Object.entries(search)) {
  assert(['colored', 'tap'].includes(kind));
  for (const [key, values] of Object.entries(grid)) {
    assert(Array.isArray(values) && values.length > 0 && values.length <= 25);
    assert.equal(new Set(values).size, values.length);
    assert(values.every((v) => (key === 'palette' ? typeof v === 'boolean' : Number.isFinite(v))));
  }
}

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
  (e) => e.card.set === '4ed' && /^Basic Land\b/.test(e.card.type_line),
);
assert.equal(entries.length, 15);
await fs.writeFile(out, '{}\n', { flag: 'wx' });
const session = await openBrowser(input, {
  plugins: [
    {
      name: 'isolated-fourth-symbol-fit',
      enforce: 'pre',
      transform(code, id) {
        const file = id.split('?')[0];
        if (file.endsWith('/presentation/mana-numeral.ts')) {
          const n = '...(face.manaSymbols ?? []), ...Object.keys(images.manaGlyphScales ?? {})';
          assert.equal(code.split(n).length, 2);
          return code.replace(n, n + ', ...Object.keys(a?.glyphs ?? {})');
        }
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
        const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
        const { TextFilledObjective } = await import(
          '/games/magic/tools/accuracy/text-filled-objective.mjs'
        );
        const { nativeGrayCrop } = await import(
          '/games/magic/tools/accuracy/abu-type-objective.mjs'
        );
        const { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const records = [];
        function tap(c, x, y, size, images, a) {
          c.save();
          c.shadowColor = 'transparent';
          c.shadowOffsetX = c.shadowOffsetY = 0;
          c.fillStyle = a.palette ? (images.manaColors?.N ?? '#c9c4be') : '#c9c4be';
          c.beginPath();
          c.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = a.palette ? (images.manaInkColor ?? '#0d0f0f') : '#0d0f0f';
          c.font = size * 0.88 + 'px "CardRenderer MTG Historic Symbols"';
          c.textAlign = 'left';
          c.textBaseline = 'alphabetic';
          const glyph = '\uea31',
            m = c.measureText(glyph);
          c.translate(x + size / 2, y + size / 2);
          c.rotate((a.rotation * Math.PI) / 180);
          c.scale(a.sx, a.sy);
          c.fillText(
            glyph,
            (-m.actualBoundingBoxRight + m.actualBoundingBoxLeft) / 2,
            (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
          );
          c.restore();
        }
        globalThis.__inlineFit = (c, symbol, x, y, size, images) => {
          const rect = [
            Math.floor(x) - 3,
            Math.floor(y) - 3,
            Math.ceil(size) + 7,
            Math.ceil(size) + 7,
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
            if (symbol === 'T') tap(c, x, y, size, images, a);
            else
              paintMana(c, symbol, x, y, size, images, false, {
                glyphs: { [symbol]: { scale: a.scale, dx: a.dx, dy: a.dy } },
              });
            return objective.score(nativeGrayCrop(c.getImageData(...origin, w, h), rect, origin));
          };
          if (symbol === 'T') {
            for (const palette of search.tap.palette)
              for (const sx of search.tap.sx)
                for (const sy of search.tap.sy)
                  for (const rotation of search.tap.rotation) {
                    const a = { palette, sx, sy, rotation };
                    candidates.push({ parameters: a, ...score(a) });
                  }
          } else {
            for (const scale of search.colored.scale)
              for (const dx of search.colored.dx)
                for (const dy of search.colored.dy) {
                  const a = { scale, dx, dy };
                  candidates.push({ parameters: a, ...score(a) });
                }
          }
          c.putImageData(background, ...origin);
          // The unmodified production callback paints the baseline after sampling.
          records.push({ symbol, rect, candidates });
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
      color: e.card.produced_mana[0],
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
    status: 'shared-inline-glyph-fit-development-not-adopted',
    scope:
      'All 15 Fourth basics; one shared transform per color and one tap shape across all 15. Fixed Original content, text layout and scan-only normalization. Circle positions and size remain fixed. Filled-ink plus symmetric edge objective. All scans are reused development observations, with no independent holdout. One full native composition per card; isolated glyph draws avoid repeated full-card work. Every final baseline PNG must remain exact.',
    rendererHash,
    inputHash: hash(raw[0]),
    captureHash: hash(raw[1]),
    posesHash: hash(raw[2]),
    refinementHash: hash(raw[3]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    search,
    searchHash: searchBytes ? hash(searchBytes) : null,
    groups,
    rows,
  });
} finally {
  await session.close();
}
