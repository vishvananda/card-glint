import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  plugins: [
    {
      name: 'study-asset-fixture',
      load(id) {
        if (!id.endsWith('/games/magic/src/presentation/canvas-assets.ts')) return;
        return `export const loads = new Map(); export const closed = new Map(); export async function loadCanvasImages(urls) {const url=urls[0]; loads.set(url,(loads.get(url)??0)+1); const bitmap={width:url==='large'?10000:2,height:url==='large'?10000:2};return {images:new Map([[url,bitmap]]),dispose(){closed.set(url,(closed.get(url)??0)+1);}}}`;
      },
    },
  ],
});
try {
  const cache = await server.ssrLoadModule('/games/magic/tools/accuracy/abu-assets.mjs');
  const source = await server.ssrLoadModule('/games/magic/src/presentation/canvas-assets.ts');
  const signal = new AbortController().signal;
  const first = await cache.loadAccuracyImages(['frame', 'art'], signal, 'art');
  const frame = first.images.get('frame');
  first.dispose();
  assert.equal(source.closed.get('frame'), undefined);
  assert.equal(source.closed.get('art'), 1);
  const second = await cache.loadAccuracyImages(['frame', 'art'], signal, 'art');
  assert.equal(second.images.get('frame'), frame);
  second.dispose();
  assert.equal(source.loads.get('frame'), 1);
  assert.equal(source.loads.get('art'), 2);
  const large = await cache.loadAccuracyImages(['large'], signal, null);
  large.dispose();
  assert.equal(source.closed.get('large'), 1);
  assert(cache.accuracyAssetStats().bytes <= cache.accuracyAssetStats().limit);
  const retry = await cache.loadAccuracyImages(['large'], signal, null);
  retry.dispose();
  assert.equal(source.loads.get('large'), 2);
  await cache.clearAccuracyImages();
  assert.equal(source.closed.get('frame'), 1);
  assert.equal(cache.accuracyAssetStats().bytes, 0);
  console.log(
    'Study assets reuse identical plates, release per-card artwork and keep overflow outside the bounded cache.',
  );
} finally {
  await server.close();
}
