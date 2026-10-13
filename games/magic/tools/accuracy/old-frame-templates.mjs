import assert from 'node:assert/strict';
import {
  readJson,
  writeJson,
  fixtureRoot,
  cacheRoot,
  outputRoot,
  root,
  hash,
  atomicWrite,
  mapLimit,
} from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
const plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`),
  manifest = await readJson(`${root}/games/magic/assets.json`);
const prefix = manifest.RETRO_ROOT + '/img/frames/';
const specs = new Map();
const basic = ['w', 'u', 'b', 'r', 'g'];
for (const family of ['abu', 'fourth', 'seventh', 'legends']) {
  const materials =
    family === 'legends'
      ? ['m']
      : family === 'abu'
        ? ['w', 'u', 'b', 'r', 'g', 'a', 'l', ...basic.map((x) => x + 'l')]
        : family === 'fourth'
          ? ['w', 'u', 'b', 'r', 'g', 'a', 'l', 'm']
          : ['w', 'u', 'b', 'r', 'g', 'a', 'l', 'm', 'c', ...basic.map((x) => x + 'l')];
  for (const material of materials) {
    const folder = family === 'seventh' ? 'seventh/regular' : `old/${family}`,
      file = family === 'legends' ? 'legendsFrameM' : material;
    specs.set(`${family}/${material.toUpperCase()}`, {
      key: `${family}/${material.toUpperCase()}`,
      family,
      material: material.toUpperCase(),
      url: prefix + folder + '/' + file + '.png',
      rect: family === 'fourth' ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1],
    });
  }
}
const components = await mapLimit([...specs.values()], 3, async (spec) => ({
  ...spec,
  asset: await cachedFetch(spec.url),
}));
const browser = await openBrowser(
    { entries: [], components: components.map((c) => c.asset) },
    { fonts: false },
  ),
  rows = [];
try {
  for (const spec of components) {
    const data = await browser.page.evaluate(async (spec) => {
      const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { paintRetroGoldBevel } = await import(
        '/games/magic/src/presentation/retro-gold-bevel.ts'
      );
      const loaded = await loadCanvasImages([spec.url], new AbortController().signal);
      try {
        const frame = loaded.images.get(spec.url);
        if (!frame) throw Error('Missing candidate');
        const c = document.createElement('canvas');
        c.width = 732;
        c.height = 1020;
        const ctx = c.getContext('2d');
        ctx.scale(1.5, 1.5);
        ctx.drawImage(frame, ...spec.rect.map((v, i) => v * (i % 2 ? 680 : 488)));
        if (spec.family === 'seventh' && spec.material === 'M') paintRetroGoldBevel(ctx, frame);
        const png = c.toDataURL();
        c.width = c.height = 0;
        return png;
      } finally {
        loaded.dispose();
      }
    }, spec);
    const bytes = Buffer.from(data.split(',')[1], 'base64'),
      file = spec.key.replace('/', '-') + '.png';
    await atomicWrite(`${outputRoot}/old-frame-families/templates/${file}`, bytes);
    rows.push({ ...spec, file, sha256: hash(bytes) });
  }
  assert.deepEqual(browser.faults, []);
} finally {
  await browser.close();
}
await writeJson(`${cacheRoot}/rollout/old-frame-templates.json`, {
  schemaVersion: 1,
  planHash: hash(JSON.stringify(plan)),
  components: components.map((c) => c.asset),
  rows,
});
console.log('Captured', rows.length, 'fixed source templates, without HSB.');
