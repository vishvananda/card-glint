import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { openBrowser } from '../games/magic/tools/accuracy/browser.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { modernLandPlates, modernOrdinaryPlates, modernPrintingProfileKey } =
    await server.ssrLoadModule('/games/magic/src/presentation/modern-printing-profile.ts');
  const { modernLandLayers, modernLandLayerAssets } = await server.ssrLoadModule(
    '/games/magic/src/presentation/modern-land-layers.ts',
  );
  const { framePlate, framePlateUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const { printingCalibrationMaterials } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const base = {
    name: 'Control',
    setCode: 'm21',
    frameStyle: 'modern',
    typeLine: 'Land',
    colors: [],
    colorCalibration: 'set-hsb-v1',
  };
  for (const [i, name] of ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].entries()) {
    const face = { ...base, name, typeLine: 'Basic Land — ' + name };
    const s = modernLandPlates(face),
      plate = framePlate(face);
    assert(s && !s.dual);
    assert(plate.frame.endsWith('/l' + 'wubrg'[i] + '.png'));
    assert.equal(modernLandLayers(face).length, 1);
    assert.deepEqual(modernLandLayers({ ...face, calibration: 'source' }), []);
    assert.equal(
      modernLandLayers({ ...face, calibration: 'auto', colorCalibration: undefined }).length,
      1,
    );
    assert.equal(Object.keys(modernOrdinaryPlates(face)).length, 1);
  }
  for (const colors of [
    ['W', 'U'],
    ['U', 'B'],
    ['B', 'R'],
    ['R', 'G'],
    ['W', 'G'],
    ['W', 'B'],
    ['U', 'R'],
    ['B', 'G'],
    ['W', 'R'],
    ['U', 'G'],
  ]) {
    const face = { ...base, frameColors: colors };
    assert(modernLandPlates(face).dual);
    assert.equal(modernLandLayers(face).length, 2);
    assert.equal(Object.keys(modernOrdinaryPlates(face)).length, 2);
    assert.deepEqual(printingCalibrationMaterials(face).materials, modernOrdinaryPlates(face));
    for (const calibration of ['auto', 'printing', { profile: 'm21-modern' }])
      assert.deepEqual(
        printingCalibrationMaterials({ ...face, calibration }).materials,
        modernOrdinaryPlates(face),
      );
    const raw = modernLandLayers({ ...face, calibration: 'source' });
    assert.equal(raw.length, 1);
    assert.equal(raw[0].correction, undefined);
    const urls = framePlateUrls(face);
    assert(modernLandLayerAssets(face).every((url) => urls.includes(url)));
    assert(urls.every((url) => !url.startsWith('card-glint:')));
    assert.notDeepEqual(
      modernPrintingProfileKey(face),
      modernPrintingProfileKey({ ...base, frameColors: ['G'] }),
    );
  }
  assert(framePlate({ ...base, frameColors: ['W', 'R'] }).frame.endsWith('/lr.png'));
  for (const extra of [
    { setCode: 'war', calibration: 'printing' },
    { frameStyle: 'retro' },
    { frameAssetFamily: 'eighth' },
    { frameTemplate: 'future' },
    { legendary: true },
    { artifact: true },
    { land: false },
    { layout: 'transform' },
    { borderColor: 'white' },
    { frameColors: ['W', 'U', 'R'] },
  ]) {
    assert.equal(modernLandPlates({ ...base, ...extra }), undefined, JSON.stringify(extra));
    assert.deepEqual(modernLandLayers({ ...base, ...extra }), []);
  }
} finally {
  await server.close();
}
const session = await openBrowser({ entries: [], components: [] }, { fonts: false });
try {
  const result = await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { modernLandMaterialJobs, modernLandLayers } = await import(
      '/games/magic/src/presentation/modern-land-layers.ts'
    );
    const { MaterialBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const check = (v, message) => {
      if (!v) throw Error(message);
    };
    const face = {
      name: 'One',
      setCode: 'm21',
      frameStyle: 'modern',
      typeLine: 'Land',
      frameColors: ['W', 'U'],
      colorCalibration: 'set-hsb-v1',
    };
    const layers = modernLandLayers(face),
      images = new Map();
    for (const url of new Set(layers.flatMap((l) => [l.source, ...l.masks]))) {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 96;
      const x = c.getContext('2d');
      x.fillStyle = url.endsWith('/l.png') ? '#bba080' : 'white';
      x.fillRect(0, 0, 64, 96);
      images.set(url, await createImageBitmap(c));
    }
    const cache = new MaterialBitmapCache(732 * 1020 * 4 * 3);
    const signal = new AbortController().signal;
    try {
      let old;
      for (const colors of [
        ['W', 'U'],
        ['B', 'R'],
        ['G', 'W'],
      ]) {
        const jobs = modernLandMaterialJobs({ ...face, frameColors: colors }, images);
        const leases = await cache.acquireMany(jobs, signal);
        if (old)
          check(
            leases.every((l, i) => l.value === old[i]),
            'Same source roles rebuilt across card colors',
          );
        old = leases.map((l) => l.value);
        leases.forEach((l) => l.release());
      }
      check(cache.stats.builds === 2, 'Expected only two shared builds');
      check(cache.stats.hits === 4, 'Expected warm layer hits');
      const missing = new Map(images);
      missing.delete(layers[0].masks[0]);
      let threw = false;
      try {
        modernLandMaterialJobs(face, missing);
      } catch {
        threw = true;
      }
      check(threw, 'Missing authored mask silently ignored');
      return cache.stats;
    } finally {
      cache.clear();
      for (const image of images.values()) image.close();
    }
  });
  assert.equal(result.builds, 2);
  assert.equal(result.hits, 4);
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
console.log(
  'M21 land sources: basics/pairs, raw/calibrated policies, excluded families, assets and shared two-layer cache passed.',
);
