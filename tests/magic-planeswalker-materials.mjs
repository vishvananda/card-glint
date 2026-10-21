import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { preWalkerSource } from '../games/magic/tools/accuracy/planeswalker-reconstruction/ancestry.mjs';
const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/planeswalker-materials/native.json'),
);
const geometry = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/planeswalker-materials/geometry.json'),
);
assert.equal(geometry.nativeControls.length, 61);
assert(
  geometry.nativeControls.every((r) => r.outsideHeadingAndSymbolSlots === 0 && r.footerIdentical),
);
assert(
  geometry.summary
    .filter((r) => r.cohort === 'validation')
    .every((r) => r.means.after < r.means.before),
);
assert.equal(evidence.normalization.accepted, 59);
assert.equal(evidence.normalization.attempted, 61);
assert.equal(evidence.records.filter((r) => r.cohort === 'validation').length, 20);
assert(evidence.records.every((r) => r.outsideScope === 0));
assert(
  evidence.summary
    .filter((r) => r.component === 'background')
    .every(
      (r) =>
        r.means.candidate < r.means.released &&
        r.reservedMeans.candidate < r.reservedMeans.released,
    ),
);
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
  plugins: [
    {
      name: 'previous-walker-contour',
      enforce: 'pre',
      resolveId(id) {
        if (id.endsWith('/presentation/__previous-planeswalker-type.ts'))
          return process.cwd() + '/games/magic/src/presentation/__previous-planeswalker-type.ts';
      },
      async load(id) {
        if (id.split('?')[0].endsWith('/presentation/__previous-planeswalker-type.ts')) {
          const file = 'games/magic/src/presentation/planeswalker-type.ts';
          return (await preWalkerSource(file, await readFile(file))).toString();
        }
      },
    },
  ],
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage(),
    url = new URL('walker-check.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Planeswalker material scope</title>',
    }),
  );
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const { preparePlaneswalkerMaterials } = await import(
      '/games/magic/src/presentation/planeswalker-material.ts'
    );
    const { planeswalkerBitmapCache } = await import(
      '/games/magic/src/presentation/material-bitmap-cache.ts'
    );
    const { walkerSources } = await import('/games/magic/src/presentation/planeswalker-sources.ts');
    const { profileAssets } = await import('/games/magic/src/presentation/assets.ts');
    const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
    const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
    const current = await import('/games/magic/src/presentation/planeswalker-type.ts'),
      before = await import('/games/magic/src/presentation/__previous-planeswalker-type.ts');
    async function hashes(images, url) {
      const image = images.get(url),
        c = new OffscreenCanvas(image.width, image.height),
        x = c.getContext('2d');
      x.drawImage(image, 0, 0);
      const p = x.getImageData(0, 0, c.width, c.height).data;
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', p)))
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('');
      c.width = c.height = 0;
      return hash;
    }
    const workerCode = `import{preparePlaneswalkerMaterials}from'${location.origin}/games/magic/src/presentation/planeswalker-material.ts';import{profileAssets}from'${location.origin}/games/magic/src/presentation/assets.ts';import{resolveCardProfile}from'${location.origin}/games/magic/src/presentation/profile.ts';import{faceFrame}from'${location.origin}/games/magic/src/presentation/special-frames.ts';const hashes=${hashes.toString()};self.onmessage=async({data})=>{const images=new Map(data.images);let prepared;try{if(typeof document!=='undefined')throw Error('Worker has document');prepared=await preparePlaneswalkerMaterials(data.face,images,new AbortController().signal);self.postMessage({hash:await hashes(prepared.images,profileAssets(resolveCardProfile(data.face),faceFrame(data.face)).background)});}catch(e){self.postMessage({error:e.message});}finally{prepared?.dispose();for(const i of images.values())i.close();}};`;
    const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' })),
      worker = new Worker(workerUrl, { type: 'module' }),
      rows = [],
      signal = new AbortController().signal;
    let workerCases = 0;
    const make = async (w, h, paint) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      paint(c.getContext('2d'), w, h);
      return createImageBitmap(c);
    };
    for (const large of [false, true])
      for (const palette of ['W', 'U', 'B', 'R', 'G', 'M', 'A']) {
        const face = {
            typeLine: 'Planeswalker',
            colors: palette === 'M' ? ['W', 'G'] : palette === 'A' ? [] : [palette],
            rulesText: Array.from(
              { length: large ? 4 : 3 },
              (_, i) => '+' + i + ': Draw a card.',
            ).join('\n'),
          },
          kind = large ? 'planeswalker-large' : 'planeswalker',
          a = profileAssets(resolveCardProfile(face), kind),
          s = walkerSources(large, palette);
        const source = await make(768, 1075, (c, w, h) => {
            c.fillStyle = '#a5b1c8';
            c.fillRect(0, 0, w, h);
          }),
          mask = await make(768, 1049, (c, w, h) => {
            c.fillStyle = palette === 'A' ? 'rgba(120,120,120,0.702)' : '#abc';
            c.fillRect(0, 0, w, h);
          }),
          images = new Map([
            [s.source, source],
            [a.background, mask],
            [a.frame, mask],
          ]);
        const count = planeswalkerBitmapCache.stats.builds,
          one = await preparePlaneswalkerMaterials(face, images, signal),
          two = await preparePlaneswalkerMaterials(face, images, signal);
        if (
          one.images.get(a.background) !== two.images.get(a.background) ||
          planeswalkerBitmapCache.stats.builds - count !== 2
        )
          throw Error('Warm materials rebuilt');
        if (images.get(a.background) !== mask) throw Error('Source owner mutated');
        const background = one.images.get(a.background),
          c = document.createElement('canvas');
        c.width = background.width;
        c.height = background.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(background, 0, 0);
        if (ctx.getImageData(10, 10, 1, 1).data[3] !== 255)
          throw Error('Obsolete source opacity retained');
        const rect = faceRects(face).type,
          expected = [0.05669 + 1.5 / 488, (large ? 0.49044 : 0.55793) + 1 / 680, 0.88662, 0.05737];
        if (JSON.stringify(rect) !== JSON.stringify(expected))
          throw Error('Reviewed type slot changed');
        if (palette === 'U' || palette === 'A') {
          const transfer = await Promise.all(
            [...images].map(async ([url, image]) => [url, await createImageBitmap(image)]),
          );
          const actual = await new Promise((resolve, reject) => {
            worker.onmessage = ({ data }) =>
              data.error ? reject(Error(data.error)) : resolve(data.hash);
            worker.onerror = (e) => reject(Error(e.message));
            worker.postMessage(
              { face, images: transfer },
              transfer.map(([, i]) => i),
            );
          });
          if (actual !== (await hashes(one.images, a.background)))
            throw Error('Worker pixels differ');
          workerCases++;
        }
        if (palette === 'U') {
          // A prior preparation stage or host can supply different immutable
          // pixels at the same URL and dimensions. This is not a new asset URL.
          for (const [label, url, changedSlot, color] of [
            ['source', s.source, a.background, '#bb6611'],
            ['mask', a.background, a.background, 'rgba(120,120,120,0.5)'],
            ['frame', a.frame, a.frame, '#2244dd'],
          ]) {
            const original = images.get(url);
            const replacement = await make(original.width, original.height, (c, w, h) => {
              c.fillStyle = color;
              c.fillRect(0, 0, w, h);
            });
            const modified = new Map(images);
            modified.set(url, replacement);
            const builds = planeswalkerBitmapCache.stats.builds;
            let prepared;
            try {
              prepared = await preparePlaneswalkerMaterials(face, modified, signal);
              if (
                prepared.images.get(changedSlot) === one.images.get(changedSlot) ||
                (await hashes(prepared.images, changedSlot)) ===
                  (await hashes(one.images, changedSlot))
              )
                throw Error('Same-URL ' + label + ' pixels reused stale material');
              const unchanged = changedSlot === a.frame ? a.background : a.frame;
              if (
                prepared.images.get(unchanged) !== one.images.get(unchanged) ||
                planeswalkerBitmapCache.stats.builds - builds !== 1
              )
                throw Error('Unrelated material rebuilt for ' + label);
            } finally {
              prepared?.dispose();
              replacement.close();
            }
          }
          const builds = planeswalkerBitmapCache.stats.builds;
          const again = await preparePlaneswalkerMaterials(face, images, signal);
          if (
            again.images.get(a.frame) !== one.images.get(a.frame) ||
            again.images.get(a.background) !== one.images.get(a.background) ||
            planeswalkerBitmapCache.stats.builds !== builds
          )
            throw Error('Original material lost its warm identity');
          again.dispose();
        }
        one.dispose();
        two.dispose();
        const missing = new Map(images);
        missing.delete(s.source);
        let rejected = false;
        try {
          await preparePlaneswalkerMaterials(face, missing, signal);
        } catch (e) {
          rejected = e.message.includes('Planeswalker asset unavailable');
        }
        if (!rejected) throw Error('Missing source accepted');
        const abort = new AbortController();
        abort.abort();
        let aborted = false;
        try {
          await preparePlaneswalkerMaterials(face, images, abort.signal);
        } catch (e) {
          aborted = e.name === 'AbortError';
        }
        if (!aborted) throw Error('Abort ignored');
        source.close();
        mask.close();
        rows.push({ palette, large });
      }
    worker.terminate();
    URL.revokeObjectURL(workerUrl);
    planeswalkerBitmapCache.clear();
    if (planeswalkerBitmapCache.stats.bytes !== 0) throw Error('Cache lease leaked');
    const { walkerY, walkerSymbolSize } = await import(
      '/games/magic/src/presentation/planeswalker-geometry.ts'
    );
    for (const large of [false, true]) {
      for (const y of [0, 42, 70, 620, 650, 680])
        if (walkerY(y, large) !== y) throw Error('Name/footer moved');
      for (const y of large ? [320, 345, 382] : [365, 395, 429])
        if (walkerY(y, large) !== y - 4) throw Error('Middle group is not up 4px');
      const r = faceRects({
        typeLine: 'Planeswalker',
        rulesText: Array(large ? 4 : 3)
          .fill('+1: Draw a card.')
          .join('\n'),
      });
      if (
        Math.abs(r.rules[1] + r.rules[3] - (large ? 0.55118 + 0.37534 : 0.62655 + 0.29997)) > 1e-12
      )
        throw Error('Ability bottom moved');
    }
    if (walkerSymbolSize('__proto__')[0] !== 1) throw Error('Unknown symbol changed');
    const texture = await make(768, 705, (c, w, h) => {
        c.fillStyle = '#c9d8e0';
        c.fillRect(0, 0, w, h);
      }),
      corners = [];
    for (const large of [false, true])
      for (const scale of [0.5, 1, 1.5]) {
        const face = {
            typeLine: 'Planeswalker',
            rulesText: Array(large ? 4 : 3)
              .fill('+1: Draw a card.')
              .join('\n'),
          },
          rect = faceRects(face).type;
        const render = (api) => {
            const c = document.createElement('canvas');
            c.width = Math.round(488 * scale);
            c.height = Math.round(680 * scale);
            const x = c.getContext('2d');
            x.scale(scale, scale);
            x.fillStyle = '#1688b5';
            x.fillRect(0, 0, 488, 680);
            api.paintPlaneswalkerType(x, texture, rect);
            return x.getImageData(0, 0, c.width, c.height).data;
          },
          a = render(before),
          b = render(current),
          right = (rect[0] + rect[2]) * 488,
          top = rect[1] * 680;
        let changed = 0,
          fringe = 0;
        for (let i = 0; i < a.length; i += 4)
          if ([0, 1, 2, 3].some((k) => a[i + k] !== b[i + k])) {
            changed++;
            const x = (((i / 4) % (488 * scale)) + 0.5) / scale,
              y = (Math.floor(i / 4 / (488 * scale)) + 0.5) / scale;
            if (x < rect[0] * 488 - 10 || x > right + 10 || y < top - 10 || y > top + 65) {
              const delta = Math.max(...[0, 1, 2, 3].map((k) => Math.abs(a[i + k] - b[i + k])));
              if (delta > 8)
                throw Error(
                  'Corner edit changed region: ' +
                    JSON.stringify({ large, scale, x, y, right, top, delta }),
                );
              fringe++;
            }
          }
        if (!changed) throw Error('Corner did not change');
        if (fringe > 64) throw Error('Excess type rasterization differences');
        const width = Math.round(488 * scale),
          height = rect[3] * 680;
        const index =
          (Math.floor((top + height + 3) * scale) * width + Math.floor(244 * scale)) * 4;
        if ([22, 136, 181, 255].some((v, k) => b[index + k] !== v))
          throw Error('Type outer shadow remains below the bezel');
        let rightLeaks = 0;
        for (
          let py = Math.ceil((top + 27) * scale);
          py < Math.floor((top + height - 5) * scale);
          py++
        )
          for (
            let px = Math.ceil((right + 1.6) * scale);
            px < Math.floor((right + 5) * scale);
            px++
          ) {
            const i = (py * width + px) * 4;
            if ([22, 136, 181, 255].some((v, k) => b[i + k] !== v)) rightLeaks++;
          }
        if (rightLeaks) throw Error('Type shadow still extends to the right');
        corners.push({ large, scale, changed, fringe, rightLeaks });
      }
    texture.close();
    return { rows, workerCases, corners };
  });
  assert.equal(result.rows.length, 14);
  assert.equal(result.workerCases, 4);
  assert.equal(result.corners.length, 6);
  console.log(JSON.stringify(result));
} finally {
  await browser?.close();
  await server.close();
}
