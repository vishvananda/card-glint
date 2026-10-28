// Isolated native glyph alpha for scan measurements. No scan-specific rendering.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { hash, root, sourceHash, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, profileFile, nativeDirectory, out] = process.argv.slice(2);
assert(out, 'Use INPUTS PROFILE NATIVE_DIRECTORY NEW_OUTPUT');
const bytes = await Promise.all(
  [inputFile, profileFile, path.join(nativeDirectory, 'capture.json')].map((f) => fs.readFile(f)),
);
const [input, profile, capture] = bytes.map((b) => JSON.parse(b));
assert(capture.complete && !capture.faults.length);
assert.equal(capture.source.inputHash, hash(bytes[0]));
assert.equal(capture.source.profileHash, hash(bytes[1]));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, capture.source.rendererHash);
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
const extraUrls = [
  ...new Set(Object.values(profile.colors).map((c) => JSON.parse(c.source)[0])),
  ...[...'wubrg'].map((c) => manifest.RETRO_ROOT + '/img/frames/m15/basics/' + c + '.png'),
  ...['old/abu/border.svg', 'old/fourth/borderBlack.png'].map(
    (s) => manifest.RETRO_ROOT + '/img/frames/' + s,
  ),
];
const extra = await Promise.all(extraUrls.map((url) => cachedFetch(url, { offline: true })));
await fs.mkdir(out);
const session = await openBrowser(
  { ...input, components: [...input.components, ...extra] },
  {
    plugins: [
      {
        name: 'basic-template-profile',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/games/magic/src/calibration/profiles.ts')) return;
          const needle =
            'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
          assert.equal(code.split(needle).length, 2);
          return code.replace(
            needle,
            'return (globalThis as any).__glyphProfile?.set === set ? (globalThis as any).__glyphProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;',
          );
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async (p) => {
    await import('/games/magic/src/data/eager.ts');
    globalThis.__glyphProfile = p;
  }, profile);
  for (const [name, color] of [
    ['Plains', 'W'],
    ['Island', 'U'],
    ['Swamp', 'B'],
    ['Mountain', 'R'],
    ['Forest', 'G'],
  ]) {
    const e = input.entries.find(
      (e) => e.name === name && capture.rows.find((r) => r.id === e.id)?.accepted,
    );
    assert(e);
    const n = capture.rows.find((r) => r.id === e.id);
    const result = await session.page.evaluate(
      async ({ e, color }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { retroBasicSymbol } = await import('/games/magic/src/presentation/retro-frame.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration);
        const url = retroBasicSymbol(e.face),
          glyph = lease.images.get(url);
        if (!glyph) throw Error('Missing native basic glyph');
        const canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 1020;
        const coreCanvas = document.createElement('canvas');
        coreCanvas.width = 732;
        coreCanvas.height = 1020;
        const core = coreCanvas.getContext('2d');
        const material = document.createElement('canvas');
        material.width = glyph.width;
        material.height = glyph.height;
        const materialContext = material.getContext('2d', { willReadFrequently: true });
        materialContext.drawImage(glyph, 0, 0);
        const pixels = materialContext.getImageData(0, 0, glyph.width, glyph.height);
        const channels = [[], [], []];
        for (let i = 0; i < pixels.data.length; i += 4)
          if (pixels.data[i + 3] >= 250)
            for (let k = 0; k < 3; k++) channels[k].push(pixels.data[i + k] / 255);
        const key = channels.map((values) => {
          values.sort((a, b) => a - b);
          return values[Math.floor(values.length / 2)];
        });
        for (let i = 0; i < pixels.data.length; i += 4) {
          const distance = Math.hypot(...key.map((v, k) => pixels.data[i + k] / 255 - v));
          pixels.data[i + 3] = Math.round(
            pixels.data[i + 3] * Math.max(0, Math.min(1, (0.12 - distance) / 0.04)),
          );
          pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255;
        }
        materialContext.putImageData(pixels, 0, 0);
        const c = canvas.getContext('2d'),
          old = CanvasRenderingContext2D.prototype.drawImage;
        let draws = 0,
          placement,
          full;
        CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
          if (image === glyph && this.canvas.width === 732 && this.canvas.height === 1020) {
            const m = this.getTransform();
            draws++;
            placement = {
              matrix: [m.a, m.b, m.c, m.d, m.e, m.f],
              args,
              sourceSize: [glyph.width, glyph.height],
            };
            c.setTransform(m);
            old.call(c, image, ...args);
            core.setTransform(m);
            old.call(core, material, ...args);
          }
          return old.call(this, image, ...args);
        };
        try {
          full = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          return {
            full: full.toDataURL().split(',')[1],
            glyph: canvas.toDataURL().split(',')[1],
            alphaCore: coreCanvas.toDataURL().split(',')[1],
            key,
            draws,
            placement,
            url,
          };
        } finally {
          CanvasRenderingContext2D.prototype.drawImage = old;
          if (full) full.width = full.height = 0;
          canvas.width =
            canvas.height =
            coreCanvas.width =
            coreCanvas.height =
            material.width =
            material.height =
              0;
          lease.dispose();
        }
      },
      { e, color },
    );
    assert.equal(result.draws, 1);
    assert.equal(
      hash(Buffer.from(result.full, 'base64')),
      n.sha256,
      'Native glyph control changed',
    );
    const glyph = Buffer.from(result.glyph, 'base64');
    const alphaCore = Buffer.from(result.alphaCore, 'base64');
    await fs.writeFile(path.join(out, color + '-core.png'), alphaCore);
    await fs.writeFile(path.join(out, color + '.png'), glyph);
    rows.push({
      id: e.id,
      name,
      color,
      sourceUrl: result.url,
      sourceHash: extra.find((a) => a.url === result.url).sha256,
      nativeHash: n.sha256,
      glyphHash: hash(glyph),
      alphaCore: {
        file: color + '-core.png',
        sha256: hash(alphaCore),
        key: result.key,
        tolerance: 0.12,
        feather: 0.04,
      },
      file: color + '.png',
      placement: result.placement,
    });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
  assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
  await writeJson(path.join(out, 'templates.json'), {
    schema: 1,
    status: 'isolated-native-basic-glyphs',
    source: {
      inputHash: hash(bytes[0]),
      profileHash: hash(bytes[1]),
      captureHash: hash(bytes[2]),
      rendererHash,
      toolHash,
    },
    scope:
      'One exact full native control per basic color, plus its actual transparent draw isolated by bitmap identity. Templates measure shape and coverage; no scan or printing adjustment is adopted.',
    rows,
  });
  console.log('Captured five native basic glyph templates with exact full-face controls');
} finally {
  await session.close();
}
