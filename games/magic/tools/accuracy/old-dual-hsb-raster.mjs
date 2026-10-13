import assert from 'node:assert/strict';
import { createServer } from 'vite';
import {
  readJson,
  writeJson,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  root,
  hash,
  sourceHash,
  atomicWrite,
  mapLimit,
  objectFile,
} from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';
import { readPng, normalize } from './pixels.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';
import { sampleTexture, textureMetrics } from './hsb-texture.mjs';
const action = process.argv[2];
assert.ok(['prepare', 'capture', 'measure'].includes(action));
const base = `${outputRoot}/old-dual-hsb`,
  results = await readJson(`${fixtureRoot}/old-dual-hsb-results.json`),
  snapshotFile = `${cacheRoot}/rollout/old-dual-hsb-preview.json`,
  sampling = (await readJson(`${cacheRoot}/rollout/old-dual-hsb-samples.json`)).sampling;
if (action === 'prepare') {
  const selected = results.groups.filter(
      (g) =>
        g.status === 'trial' ||
        (g.set === '3ed' && ['W', 'U', 'B', 'R', 'G', 'A'].includes(g.material)),
    ),
    cardMap = new Map(),
    entries = [];
  for (const set of new Set(selected.map((g) => g.set))) {
    const source = await readJson(`${cacheRoot}/rollout/sets/${set}.json`);
    for (const p of source.pages)
      for (const c of JSON.parse((await readObject(p)).toString()).data) cardMap.set(c.id, c);
  }
  const family = await readJson(`${cacheRoot}/rollout/old-frame-families.json`);
  const early = await readJson(`${cacheRoot}/rollout/early-hsb.json`);
  const sampleReport = await readJson(`${cacheRoot}/rollout/old-dual-hsb-samples.json`);
  for (const g of selected) {
    const id = g.rows[0].id,
      card = cardMap.get(id),
      reference = (
        family.entries.find((e) => e.id === id) ?? early.entries.find((e) => e.id === id)
      ).reference;
    const normalization = sampleReport.rows.find(
      (r) => r.id === id && r.group === g.group,
    ).normalization;
    assert.equal(normalization.accepted, true);
    entries.push({ id, card, reference, normalization, group: g.key, material: g.material });
  }
  await mapLimit(entries, 3, async (e) => {
    e.art = await cachedFetch(e.card.image_uris.art_crop);
  });
  const components = new Map(
    (await readJson(`${cacheRoot}/rollout/early-hsb.json`)).components.map((c) => [c.url, c]),
  );
  const server = await createServer({
    configFile: false,
    root,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
  });
  try {
    const { canvasAssetUrls } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-assets.ts',
    );
    const urls = new Set();
    for (const e of entries) {
      e.face = { ...presentation(e).face, wordingMode: 'oracle', symbolStyle: 'original' };
      for (const u of canvasAssetUrls(e.face)) if (u?.startsWith('https:')) urls.add(u);
    }
    await mapLimit([...urls], 3, async (u) => {
      if (!components.has(u)) components.set(u, await cachedFetch(u));
    });
  } finally {
    await server.close();
  }
  await writeJson(snapshotFile, {
    schemaVersion: 1,
    resultsHash: hash(JSON.stringify(results)),
    entries,
    components: [...components.values()],
  });
  console.log('Prepared', entries.length, 'reserved previews');
} else if (action === 'capture') {
  const snapshot = await readJson(snapshotFile);
  assert.equal(snapshot.resultsHash, hash(JSON.stringify(results)));
  const rendererHash = await sourceHash(`${root}/games/magic/src`),
    browser = await openBrowser(snapshot),
    rows = [];
  try {
    for (const [i, e] of snapshot.entries.entries()) {
      const data = await browser.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { loadCanvasImages, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const signal = new AbortController().signal,
          loaded = await loadCanvasImages(canvasAssetUrls(face), signal),
          images = {};
        try {
          for (const mode of ['before', 'after']) {
            const c = await composeCardTexture(
              {
                face: mode === 'after' ? { ...face, colorCalibration: 'set-hsb-v1' } : face,
                printingId: null,
                printedImage: null,
              },
              'inspect',
              signal,
              { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
            );
            images[mode] = c.toDataURL();
            c.width = c.height = 0;
          }
          return images;
        } finally {
          loaded.dispose();
        }
      }, e.face);
      const images = {};
      for (const [mode, png] of Object.entries(data)) {
        const bytes = Buffer.from(png.split(',')[1], 'base64'),
          file = `${e.id}-${mode}.png`;
        await atomicWrite(`${base}/${file}`, bytes);
        images[mode] = { file, sha256: hash(bytes) };
      }
      rows.push({
        id: e.id,
        set: e.card.set,
        name: e.card.name,
        group: e.group,
        material: e.material,
        images,
      });
      if (i % 20 === 0) console.log('captured', i, '/', snapshot.entries.length);
    }
    assert.deepEqual(browser.faults, []);
    assert.equal(rendererHash, await sourceHash(`${root}/games/magic/src`));
    await writeJson(`${base}/capture.json`, {
      schemaVersion: 1,
      rendererHash,
      resultsHash: snapshot.resultsHash,
      snapshotHash: hash(JSON.stringify(snapshot)),
      rows,
    });
  } finally {
    await browser.close();
  }
} else {
  const capture = await readJson(`${base}/capture.json`),
    snapshot = await readJson(snapshotFile),
    rows = [];
  assert.equal(capture.rendererHash, await sourceHash(`${root}/games/magic/src`));
  assert.equal(capture.resultsHash, hash(JSON.stringify(results)));
  assert.equal(capture.snapshotHash, hash(JSON.stringify(snapshot)));
  for (const r of capture.rows) {
    const entry = snapshot.entries.find((e) => e.id === r.id),
      scan = normalize(await readPng(objectFile(entry.reference)), entry.normalization.transform),
      before = normalize(await readPng(`${base}/${r.images.before.file}`)),
      after = normalize(await readPng(`${base}/${r.images.after.file}`));
    let artChanges = 0;
    for (let y = 100; y < 350; y++)
      for (let x = 85; x < 405; x++) {
        const i = (y * before.width + x) * 4;
        if ([0, 1, 2, 3].some((c) => before.data[i + c] !== after.data[i + c])) artChanges++;
      }
    assert.equal(artChanges, 0, r.name);
    const components = Object.fromEntries(
      ['frame', 'paper'].map((c) => {
        const opts = { paper: c === 'paper', tileSize: sampling.tileSize },
          ref = sampleColor(scan, sampling[c + 'Patches'], opts),
          a = sampleColor(before, sampling[c + 'Patches'], opts),
          b = sampleColor(after, sampling[c + 'Patches'], opts);
        return [
          c,
          {
            before: delta(a.rgb, ref.rgb),
            after: delta(b.rgb, ref.rgb),
            referenceRgb: ref.rgb,
            beforeRgb: a.rgb,
            afterRgb: b.rgb,
          },
        ];
      }),
    );
    const texture = textureMetrics(
      sampleTexture(after, sampling.framePatches),
      sampleTexture(scan, sampling.framePatches),
    );
    rows.push({ ...r, artChanges, components, texture });
  }
  const comps = rows.flatMap((r) => Object.values(r.components));
  const report = {
    schemaVersion: 1,
    captureHash: hash(JSON.stringify(capture)),
    rendererHash: capture.rendererHash,
    resultsHash: capture.resultsHash,
    scope:
      'One reserved full-card render per admitted remaining-set frame profile, at inspection size. Identical artwork and Oracle wording with original symbols. Structure/wording are not certified by this color audit.',
    summary: {
      cards: rows.length,
      before: median(comps.map((c) => c.before)),
      after: median(comps.map((c) => c.after)),
      worstRegression: Math.max(...comps.map((c) => c.after - c.before)),
      artChanges: 0,
      componentRegressions: comps.filter((c) => c.after > c.before + 1).length,
    },
    rows,
  };
  await writeJson(`${fixtureRoot}/old-dual-hsb-raster-results.json`, report);
  console.log(report.summary);
}
