// Actual native expansion-symbol layers; fixed scan poses remain separate.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { hash, root, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
const [inputFile, poseFile, exportedFile, profileFile, nativeDirectory, out] =
  process.argv.slice(2);
assert(out, 'Use INPUTS POSES EXPORTED_INPUTS PROFILE NATIVE_DIRECTORY NEW_OUTPUT');
const bytes = await Promise.all(
  [inputFile, poseFile, exportedFile, profileFile, path.join(nativeDirectory, 'capture.json')].map(
    (f) => fs.readFile(f),
  ),
);
const [input, poses, exported, profile, capture] = bytes.map((b) => JSON.parse(b));
assert(capture.complete && !capture.faults.length);
assert.equal(capture.source.inputHash, hash(bytes[0]));
assert.equal(poses.inputHash, hash(bytes[0]));
assert.equal(exported.inputHash, hash(bytes[0]));
assert.equal(capture.source.profileHash, hash(bytes[3]));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, capture.source.rendererHash);
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
const extraUrls = [
  ...Object.values(profile.colors).map((c) => JSON.parse(c.source)[0]),
  ...[...'wubrg'].map((c) => manifest.RETRO_ROOT + '/img/frames/m15/basics/' + c + '.png'),
  ...['old/abu/border.svg', 'old/fourth/borderBlack.png'].map(
    (s) => manifest.RETRO_ROOT + '/img/frames/' + s,
  ),
];
const extra = await Promise.all(
  [...new Set(extraUrls)].map((url) => cachedFetch(url, { offline: true })),
);
await fs.mkdir(out);
const session = await openBrowser(
  { ...input, components: [...input.components, ...extra] },
  {
    plugins: [
      {
        name: 'isolated-symbol-template-profile',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/games/magic/src/calibration/profiles.ts')) return;
          const needle =
            'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
          assert.equal(code.split(needle).length, 2);
          return code.replace(
            needle,
            'return (globalThis as any).__symbolTemplateProfile?.set === set ? (globalThis as any).__symbolTemplateProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;',
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
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__symbolTemplateProfile = p;
  }, profile);
  const selected = [];
  for (const e of input.entries) {
    if (!poses.rows.find((r) => r.id === e.id)?.accepted) continue;
    const co = exported.rows.find((r) => r.id === e.id)?.cohort;
    if (!['calibration', 'validation'].includes(co)) continue;
    const key = [e.material, e.card.rarity, co].join('/');
    if (!selected.some((r) => r.key === key)) selected.push({ e, key, cohort: co });
  }
  for (const { e, key, cohort } of selected) {
    const n = capture.rows.find((r) => r.id === e.id);
    const result = await session.page.evaluate(async (e) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { retroSetSymbol } = await import('/games/magic/src/presentation/retro-frame.ts');
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
      const signal = new AbortController().signal;
      const lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration);
      const url = retroSetSymbol(e.face),
        icon = lease.images.get(url);
      if (!icon) throw Error('Missing expansion symbol ' + url);
      const layer = document.createElement('canvas');
      layer.width = 732;
      layer.height = 1020;
      const ctx = layer.getContext('2d');
      const old = CanvasRenderingContext2D.prototype.drawImage;
      let full,
        placement,
        count = 0;
      CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
        if (image === icon && this.canvas.width === 732 && this.canvas.height === 1020) {
          const m = this.getTransform();
          placement = {
            matrix: [m.a, m.b, m.c, m.d, m.e, m.f],
            args,
            sourceSize: [icon.width, icon.height],
          };
          ctx.setTransform(m);
          for (const k of [
            'filter',
            'globalAlpha',
            'imageSmoothingEnabled',
            'imageSmoothingQuality',
            'shadowBlur',
            'shadowColor',
            'shadowOffsetX',
            'shadowOffsetY',
          ])
            ctx[k] = this[k];
          old.call(ctx, image, ...args);
          count++;
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
          layer: layer.toDataURL().split(',')[1],
          url,
          placement,
          count,
        };
      } finally {
        CanvasRenderingContext2D.prototype.drawImage = old;
        if (full) full.width = full.height = 0;
        layer.width = layer.height = 0;
        lease.dispose();
      }
    }, e);
    assert.equal(
      hash(Buffer.from(result.full, 'base64')),
      n.sha256,
      'Native symbol control differs ' + e.name,
    );
    assert.equal(result.count, 1, 'Expected one native symbol draw ' + e.name);
    const png = Buffer.from(result.layer, 'base64'),
      file = e.id + '.png';
    await fs.writeFile(path.join(out, file), png);
    rows.push({
      id: e.id,
      name: e.name,
      key,
      material: e.material,
      rarity: e.card.rarity,
      cohort,
      file,
      sha256: hash(png),
      nativeHash: n.sha256,
      referenceHash: e.reference.sha256,
      url: result.url,
      placement: result.placement,
    });
    console.log(input.set, rows.length, e.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
await writeJson(path.join(out, 'templates.json'), {
  schema: 1,
  status: 'native-symbol-templates-not-a-calibration',
  set: input.set,
  source: {
    rendererHash,
    toolHash,
    inputHash: hash(bytes[0]),
    posesHash: hash(bytes[1]),
    exportedHash: hash(bytes[2]),
    profileHash: hash(bytes[3]),
    captureHash: hash(bytes[4]),
  },
  scope:
    'One native control per material/rarity/cohort. Actual prepared SVG bitmap and complete native transform; every full control must be byte-identical. No reference pose or production default changes.',
  rows,
});
