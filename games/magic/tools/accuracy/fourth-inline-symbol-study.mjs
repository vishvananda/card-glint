import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, captureFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS CAPTURE NEW_OUTPUT_DIRECTORY');
const ib = await fs.readFile(inputFile),
  cb = await fs.readFile(captureFile);
const input = JSON.parse(ib),
  capture = JSON.parse(cb);
assert.equal(capture.inputHash, hash(ib));
const rendererHash = await sourceHash(root + '/games/magic/src');
assert.equal(capture.rendererHash, rendererHash);
const entries = input.entries.filter(
  (e) => e.card.set === '4ed' && /^Basic Land\b/.test(e.card.type_line),
);
assert.equal(entries.length, 15);
await fs.mkdir(out);
const modes = [
  { id: 'current', glyphs: false, tapScale: 0.88, palette: false },
  { id: 'inline-glyph-fit', glyphs: true, tapScale: 0.88, palette: false },
  { id: 'tap-palette', glyphs: false, tapScale: 0.88, palette: true },
  ...[0.7, 0.76, 0.82, 0.88].map((tapScale) => ({
    id: 'combined-' + tapScale,
    glyphs: true,
    tapScale,
    palette: true,
  })),
];
const session = await openBrowser(input, {
  plugins: [
    {
      name: 'fourth-inline-symbol-study',
      enforce: 'pre',
      transform(code, id) {
        const file = id.split('?')[0];
        if (file.endsWith('/presentation/mana-numeral.ts')) {
          const needle =
            '...(face.manaSymbols ?? []), ...Object.keys(images.manaGlyphScales ?? {})';
          assert.equal(code.split(needle).length, 2);
          return code.replace(needle, needle + ', ...Object.keys(a?.glyphs ?? {})');
        }
        if (file.endsWith('/presentation/retro-details.ts')) {
          const start = code.indexOf('export const paintFourthMana:');
          const end = code.indexOf('\n};', start) + 3;
          assert(start > 0 && end > start);
          return (
            code.slice(0, start) +
            'export const paintFourthMana: typeof paintMana = (c,symbol,x,y,size,images) => {\n' +
            ' const mode=(globalThis as any).__inlineMode;\n' +
            ' if (!mode) return symbol==="T" ? paintHistoricMana(c,symbol,x,y,size,images) : paintMana(c,symbol,x,y,size,images);\n' +
            ' if (symbol !== "T") return paintMana(c,symbol,x,y,size,images,false,mode.glyphs ? {glyphs:mode.geometry.glyphs} : undefined);\n' +
            ' c.save(); c.shadowColor="transparent"; c.shadowOffsetX=c.shadowOffsetY=0;\n' +
            ' c.fillStyle=mode.palette ? (images.manaColors?.N ?? "#c9c4be") : "#c9c4be"; c.beginPath();c.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);c.fill();\n' +
            ' c.fillStyle=mode.palette ? (images.manaInkColor ?? "#0d0f0f") : "#0d0f0f";c.font=size*mode.tapScale+\'px "CardRenderer MTG Historic Symbols"\';c.textAlign="left";c.textBaseline="alphabetic";\n' +
            ' const glyph="\\uea31",m=c.measureText(glyph);c.fillText(glyph,x+(size-m.actualBoundingBoxLeft-m.actualBoundingBoxRight)/2+m.actualBoundingBoxLeft,y+(size+m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2);c.restore();\n};' +
            code.slice(end)
          );
        }
      },
    },
  ],
});
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    const results = await session.page.evaluate(
      async ({ e, modes }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const { printingManaAdjustment } = await import(
          '/games/magic/src/presentation/printing-mana-adjustment.ts'
        );
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        const results = {};
        try {
          for (const mode of modes) {
            globalThis.__inlineMode =
              mode.id === 'current' ? null : { ...mode, geometry: printingManaAdjustment(e.face) };
            const image = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              const layout = retroTextLayout(image.getContext('2d'), e.face);
              const symbols = [];
              for (const line of layout.lines) {
                let x = line.x ?? layout.x;
                for (const run of line.runs) {
                  if (run.symbol)
                    symbols.push({
                      symbol: run.text,
                      x: x + run.size * 0.025,
                      y: line.baseline - run.size * 0.72,
                      size: run.size * 0.8,
                    });
                  x += run.width;
                }
              }
              results[mode.id] = { png: image.toDataURL().split(',')[1], symbols };
            } finally {
              image.width = image.height = 0;
            }
          }
        } finally {
          lease.dispose();
          globalThis.__inlineMode = null;
        }
        return results;
      },
      { e, modes },
    );
    const row = {
      id: e.id,
      name: e.name,
      color: e.card.produced_mana[0],
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      modes: {},
    };
    for (const [mode, r] of Object.entries(results)) {
      const bytes = Buffer.from(r.png, 'base64'),
        file = e.id + '-' + mode + '.png';
      await fs.writeFile(path.join(out, file), bytes);
      if (mode === 'current')
        assert.equal(
          hash(bytes),
          capture.rows.find((r) => r.id === e.id).modes.original.sha256,
          'Study default changed ' + e.name,
        );
      row.modes[mode] = { file, sha256: hash(bytes), symbols: r.symbols };
    }
    rows.push(row);
    console.log(e.name, e.card.collector_number);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
  await writeJson(path.join(out, 'study.json'), {
    schema: 1,
    status: 'native-inline-symbol-prototypes-not-adopted',
    rendererHash,
    inputHash: hash(ib),
    captureHash: hash(cb),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    modes,
    rows,
  });
} finally {
  await session.close();
}
