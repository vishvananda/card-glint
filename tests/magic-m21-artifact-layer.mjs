import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { openBrowser } from '../games/magic/tools/accuracy/browser.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { modernOrdinaryPlates, modernArtifactPinline, modernPrintingProfileKey } =
    await server.ssrLoadModule('/games/magic/src/presentation/modern-printing-profile.ts');
  const { modernArtifactLayerAssets } = await server.ssrLoadModule(
    '/games/magic/src/presentation/modern-artifact-layer.ts',
  );
  const { framePlateUrls, framePlate } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const base = {
    name: 'Artifact',
    setCode: 'm21',
    typeLine: 'Artifact',
    colors: ['W'],
    colorCalibration: 'set-hsb-v1',
    frameStyle: 'modern',
    layout: 'normal',
  };
  for (const color of 'WUBRG') {
    const face = { ...base, colors: [color] },
      snapshot = structuredClone(face);
    const layer = modernArtifactPinline(face);
    assert(layer.source.endsWith('/' + color.toLowerCase() + '.png'));
    assert(layer.mask.endsWith('/m15/new/pinline.png'));
    assert.deepEqual(Object.keys(modernOrdinaryPlates(face)), [framePlate(face).frame]);
    assert(framePlate(face).frame.endsWith('/a.png'));
    assert(modernArtifactLayerAssets(face).every((url) => framePlateUrls(face).includes(url)));
    assert(JSON.stringify(modernPrintingProfileKey(face)).includes(layer.source));
    assert.deepEqual(face, snapshot);
    assert(modernArtifactPinline({ ...face, calibration: 'source' }));
  }
  assert.notDeepEqual(
    modernPrintingProfileKey(base),
    modernPrintingProfileKey({ ...base, colors: ['B'] }),
  );
  const { printingColorSource } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-source.ts',
  );
  const neutralFace = { ...base, colors: [] };
  const neutral = Object.values(modernOrdinaryPlates(neutralFace))[0];
  for (const color of ['W', 'B']) {
    const face = { ...base, colors: [color] };
    const plate = Object.values(modernOrdinaryPlates(face))[0];
    // A colored artifact keeps its metal texture, aperture masks and edge ink;
    // its three paper panels follow the printed palette independently.
    const { paper, regions, ...surround } = plate;
    const { paper: oldPaper, regions: oldRegions, ...oldSurround } = neutral;
    assert.deepEqual(surround, oldSurround);
    assert.deepEqual(
      regions.map((r) => r.mask),
      oldRegions.map((r) => r.mask),
    );
    assert.notDeepEqual(paper, oldPaper);
    assert(
      regions.every(
        (r, i) => JSON.stringify(r.adjustment) !== JSON.stringify(oldRegions[i].adjustment),
      ),
    );
    assert.notEqual(printingColorSource(face).key, printingColorSource(neutralFace).key);
    assert.notEqual(printingColorSource(face).source, printingColorSource(neutralFace).source);
    assert.notEqual(
      printingColorSource(face).source,
      printingColorSource({ ...face, colors: [color === 'W' ? 'B' : 'W'] }).source,
    );
  }
  // M21 has no directly measured ordinary U/R/G artifact printings. They keep
  // neutral paper until their own palette evidence exists.
  for (const color of ['U', 'R', 'G'])
    assert.deepEqual(Object.values(modernOrdinaryPlates({ ...base, colors: [color] }))[0], neutral);
  const ordinaryWhite = { ...base, typeLine: 'Creature', colors: ['W'] };
  assert(!printingColorSource(ordinaryWhite).key.includes('/paper-'));

  for (const extra of [
    { setCode: 'war', calibration: 'printing' },
    { legendary: true },
    { typeLine: 'Legendary Artifact' },
    { colors: [] },
    { colors: ['W', 'B'] },
    { typeLine: 'Creature' },
    { artifact: false },
    { layout: 'planeswalker' },
    { borderColor: 'white' },
    { frameAssetFamily: 'eighth' },
    { frameStyle: 'retro' },
    { frameTemplate: 'future' },
    { faces: [{ name: 'Other' }] },
  ]) {
    assert.equal(modernArtifactPinline({ ...base, ...extra }), undefined, JSON.stringify(extra));
    assert.deepEqual(modernArtifactLayerAssets({ ...base, ...extra }), []);
  }
} finally {
  await server.close();
}
const session = await openBrowser({ entries: [], components: [] }, { fonts: false });
try {
  const result = await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { modernArtifactLayerAssets, modernArtifactMaterialJobs } = await import(
      '/games/magic/src/presentation/modern-artifact-layer.ts'
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
      typeLine: 'Artifact',
      colors: ['W'],
      colorCalibration: 'set-hsb-v1',
    };
    const images = new Map();
    for (const colors of [['W'], ['B']]) {
      for (const url of modernArtifactLayerAssets({ ...face, colors })) {
        if (images.has(url)) continue;
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 96;
        const c = canvas.getContext('2d');
        c.fillStyle = url.endsWith('/pinline.png') ? 'white' : '#a0b0c0';
        if (url.endsWith('/pinline.png')) c.fillRect(8, 8, 48, 80);
        else c.fillRect(0, 0, 64, 96);
        images.set(url, await createImageBitmap(canvas));
      }
    }
    const cache = new MaterialBitmapCache(732 * 1020 * 4 * 4),
      signal = new AbortController().signal;
    try {
      const jobs = modernArtifactMaterialJobs(face, images);
      const first = await cache.acquireMany(jobs, signal);
      const repeat = await cache.acquireMany(
        modernArtifactMaterialJobs({ ...face, name: 'Another' }, images),
        signal,
      );
      check(first[0].value === repeat[0].value, 'Same pinline rebuilt for another card');
      const output = document.createElement('canvas');
      output.width = 732;
      output.height = 1020;
      const c = output.getContext('2d', { willReadFrequently: true });
      c.drawImage(first[0].value, 0, 0);
      check(c.getImageData(0, 0, 1, 1).data[3] === 0, 'Pinline escaped authored mask');
      check(c.getImageData(366, 510, 1, 1).data[3] === 255, 'Pinline mask lost coverage');
      const origin = location.origin;
      const workerUrl = URL.createObjectURL(
        new Blob(
          [
            `import '${origin}/games/magic/src/data/eager.ts';
import { modernArtifactMaterialJobs } from '${origin}/games/magic/src/presentation/modern-artifact-layer.ts';
self.onmessage = async ({data}) => {
  try {
    const borrowed = new Map(data.images);
    const bitmap = await modernArtifactMaterialJobs(data.face, borrowed)[0].build();
    for (const image of borrowed.values()) image.close();
    self.postMessage({bitmap}, [bitmap]);
  } catch (error) { self.postMessage({error: String(error)}); }
};`,
          ],
          { type: 'text/javascript' },
        ),
      );
      const worker = new Worker(workerUrl, { type: 'module' });
      try {
        const bitmap = await new Promise((resolve, reject) => {
          worker.onmessage = ({ data }) =>
            data.error ? reject(Error(data.error)) : resolve(data.bitmap);
          worker.onerror = reject;
          worker.postMessage({ face, images: [...images] });
        });
        const expected = c.getImageData(0, 0, 732, 1020).data;
        c.clearRect(0, 0, 732, 1020);
        c.drawImage(bitmap, 0, 0);
        bitmap.close();
        const actual = c.getImageData(0, 0, 732, 1020).data;
        check(
          actual.every((v, i) => v === expected[i]),
          'Worker pinline pixels differ',
        );
      } finally {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      }
      const rawJobs = modernArtifactMaterialJobs({ ...face, calibration: 'source' }, images);
      check(rawJobs[0].key !== jobs[0].key, 'Source policy reused colored pixels');
      check(
        modernArtifactMaterialJobs({ ...face, colors: ['B'] }, images)[0].key !== jobs[0].key,
        'Different pinline color reused wrong layer',
      );
      let threw = false;
      try {
        modernArtifactMaterialJobs(face, new Map());
      } catch {
        threw = true;
      }
      check(threw, 'Missing authored assets silently ignored');
      first.forEach((l) => l.release());
      repeat.forEach((l) => l.release());
      return cache.stats;
    } finally {
      cache.clear();
      for (const image of images.values()) image.close();
    }
  });
  assert.equal(result.builds, 1);
  assert.equal(result.hits, 1);
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
console.log(
  'M21 colored artifact layers: exact semantic/source scope, mask coverage, policy keys and bounded warm cache passed.',
);
