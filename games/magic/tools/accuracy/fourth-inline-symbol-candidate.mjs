import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, captureFile, fitFile, out, scope = 'all-inline'] = process.argv.slice(2);
assert(
  out && ['all-inline', 'basics'].includes(scope),
  'Use INPUTS CAPTURE FIT NEW_OUTPUT_DIRECTORY [all-inline|basics]',
);
const raw = await Promise.all([inputFile, captureFile, fitFile].map((f) => fs.readFile(f)));
const [input, capture, fit] = raw.map((b) => JSON.parse(b));
assert.equal(capture.inputHash, hash(raw[0]));
assert.equal(fit.inputHash, hash(raw[0]));
const rendererHash = await sourceHash(root + '/games/magic/src');
assert.equal(capture.rendererHash, rendererHash);
assert.equal(fit.rendererHash, rendererHash);
const policy = Object.fromEntries(
  Object.entries(fit.groups).map(([s, g]) => [s, g.best.parameters]),
);
const entries = input.entries.filter(
  (e) =>
    e.card.set === '4ed' &&
    (scope === 'basics'
      ? /^Basic Land\b/.test(e.card.type_line)
      : /\{[WUBRGT]\}/.test(e.face.rulesText)),
);
assert.equal(entries.length, scope === 'basics' ? 15 : 112);
await fs.mkdir(out);
const components = [...input.components, ...(capture.extraAssets ?? [])];
const identities = new Map();
for (const a of components) {
  assert(!identities.has(a.url) || identities.get(a.url) === a.sha256, 'Asset identity conflict');
  identities.set(a.url, a.sha256);
}
const session = await openBrowser(
  { ...input, components },
  {
    plugins: [
      {
        name: 'native-fourth-inline-candidate',
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
              n +
                '\n if ((globalThis as any).__inlineCandidate?.(c,symbol,x,y,size,images)) return;',
            );
          }
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    const result = await session.page.evaluate(
      async ({ e, policy }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { paintMana } = await import('/games/magic/src/presentation/canvas-text.ts');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const lease = await loadAccuracyImages(
            canvasAssetUrls(e.face),
            new AbortController().signal,
            e.face.illustration,
          ),
          modes = {};
        try {
          for (const mode of ['current', 'fitted', 'fitted-relative']) {
            globalThis.__inlineCandidate =
              mode === 'current'
                ? null
                : (c, symbol, x, y, size, images) => {
                    const a = policy[symbol];
                    if (!a) return false;
                    if (symbol !== 'T') {
                      paintMana(c, symbol, x, y, size, images, false, {
                        glyphs: {
                          [symbol]: {
                            ...a,
                            dx: a.dx * (mode === 'fitted-relative' ? size / 20 : 1),
                            dy: a.dy * (mode === 'fitted-relative' ? size / 20 : 1),
                          },
                        },
                      });
                      return true;
                    }
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
                    return true;
                  };
            const image = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              const layout = retroTextLayout(image.getContext('2d'), e.face),
                symbols = [];
              for (const line of layout.lines) {
                let x = line.x ?? layout.x;
                for (const run of line.runs) {
                  if (run.symbol && policy[run.text])
                    symbols.push({
                      symbol: run.text,
                      x: (x + run.size * 0.025) * (layout.horizontalScale ?? 1),
                      y: line.baseline - run.size * 0.72,
                      size: run.size * 0.8,
                      scaleX: layout.horizontalScale ?? 1,
                    });
                  x += run.width;
                }
              }
              modes[mode] = { png: image.toDataURL().split(',')[1], symbols };
            } finally {
              image.width = image.height = 0;
            }
          }
        } finally {
          lease.dispose();
          delete globalThis.__inlineCandidate;
        }
        return modes;
      },
      { e, policy },
    );
    const row = {
      id: e.id,
      name: e.name,
      color: e.material,
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      modes: {},
    };
    for (const [mode, r] of Object.entries(result)) {
      const bytes = Buffer.from(r.png, 'base64'),
        file = e.id + '-' + mode + '.png';
      if (mode === 'current')
        await fs.link(
          path.join(
            path.dirname(captureFile),
            capture.rows.find((r) => r.id === e.id).modes.original.file,
          ),
          path.join(out, file),
        );
      else await fs.writeFile(path.join(out, file), bytes);
      if (mode === 'current')
        assert.equal(
          hash(bytes),
          capture.rows.find((r) => r.id === e.id).modes.original.sha256,
          'Native control changed ' + e.name,
        );
      row.modes[mode] = { file, sha256: hash(bytes), symbols: r.symbols };
    }
    rows.push(row);
    console.log(rows.length, '/', entries.length, e.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
  await writeJson(path.join(out, 'study.json'), {
    schema: 1,
    status: 'native-inline-candidate-extrapolation-not-adopted',
    scope,
    rendererHash,
    inputHash: hash(raw[0]),
    captureHash: hash(raw[1]),
    fitHash: hash(raw[2]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    policy,
    modes: [{ id: 'current' }, { id: 'fitted' }, { id: 'fitted-relative' }],
    rows,
  });
} finally {
  await session.close();
}
