import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import {
  readJson,
  writeJson,
  root,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  hash,
  sourceHash,
  atomicWrite,
} from './common.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';

const action = process.argv[2] ?? 'prepare';
assert.ok(['prepare', 'before', 'after'].includes(action));
const planFile = `${fixtureRoot}/early-hsb-plan.json`,
  snapshotFile = `${cacheRoot}/rollout/early-hsb.json`,
  base = `${outputRoot}/early-hsb`;
const material = (card) => {
  if (/\bLand\b/.test(card.type_line)) {
    const basic = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].filter((t) =>
      card.type_line.includes(t),
    );
    return basic.length === 1
      ? 'WUBRG'[['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].indexOf(basic[0])] + 'L'
      : 'L';
  }
  return /\bArtifact\b/.test(card.type_line) ? 'A' : card.colors.join('');
};
if (action === 'prepare') {
  try {
    await readJson(planFile);
    throw Error('HSB plan already frozen');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const entries = [],
    components = new Map(),
    inventories = [];
  for (const set of ['lea', 'leb', '2ed', '3ed']) {
    const source = await readJson(`${cacheRoot}/sets/${set}.json`);
    inventories.push({ set, identity: source.identity, printings: source.entries.length });
    for (const a of source.components) components.set(a.url, a);
    for (const group of ['W', 'U', 'B', 'R', 'G', 'A', 'L', 'WL', 'UL', 'BL', 'RL', 'GL']) {
      const selected = source.entries
        .filter((e) => !e.issue && e.reference && e.art && material(e.card) === group)
        .sort(
          (a, b) =>
            hash('early-hsb-v1:' + a.card.name).localeCompare(
              hash('early-hsb-v1:' + b.card.name),
            ) || a.card.collector_number.localeCompare(b.card.collector_number),
        )
        .slice(0, 10);
      assert.ok(selected.length >= 2, `${set}/${group} needs validation references`);
      const development = Math.min(5, Math.floor(selected.length / 2));
      for (const [i, e] of selected.entries())
        entries.push({
          ...e,
          material: group,
          cohort: i < development ? 'calibration' : 'validation',
          preview: i === 0 || i === development,
        });
    }
  }
  const snapshot = { schemaVersion: 1, entries, components: [...components.values()] };
  const server = await createServer({ configFile: false, root, server: { middlewareMode: true } });
  let cards;
  try {
    const { retroFrameAsset, retroFrameRect, retroFamily } = await server.ssrLoadModule(
      '/games/magic/src/presentation/retro-frame.ts',
    );
    cards = entries.map((e) => {
      const face = colorFace(e);
      return {
        id: e.id,
        set: e.card.set,
        name: e.card.name,
        number: e.card.collector_number,
        material: e.material,
        cohort: e.cohort,
        preview: e.preview,
        referenceHash: e.reference.sha256,
        inputHash: hash(JSON.stringify(face)),
        frameAsset: retroFrameAsset(face),
        frameRect: retroFrameRect(face),
        frameFamily: retroFamily(face),
      };
    });
  } finally {
    await server.close();
  }
  await writeJson(snapshotFile, snapshot);
  await writeJson(planFile, {
    schemaVersion: 1,
    scope:
      'HSB trial for Alpha, Beta, Unlimited and Revised. Separate frame material, rules paper and mana-disc diagnostics. Frozen metadata-based cohorts, with identical name ordering across sets. Ten printings per available material, or all when fewer; half reserved. Sparse basic-land groups remain explicitly low-confidence. No per-scan color or geometric fit; original assets and art retained. Full-card previews use Oracle wording with original symbols; no typography certification.',
    baselineRendererHash: await sourceHash(`${root}/games/magic/src`),
    snapshotHash: hash(JSON.stringify(snapshot)),
    inventories,
    cards,
    model: {
      space: 'HSV on encoded sRGB (HSB)',
      hueDegrees: [-60, 60],
      saturationScale: [0.35, 1.75],
      brightnessScale: [0.65, 1.4],
      neutralSaturation: 0.06,
      minimumCalibration: 3,
      minimumValidation: 2,
    },
    sampling: {
      registration:
        'identity, fixed eroded interior patches; test shared-window offset sensitivity',
      framePatches: [
        [33, 110, 11, 50],
        [33, 200, 11, 50],
        [33, 290, 11, 50],
        [444, 110, 11, 50],
        [444, 200, 11, 50],
        [444, 290, 11, 50],
      ],
      paperPatches: [[78, 434, 328, 140]],
      tileSize: 20,
      inkExclusion: 'tile medians; reject strongly contaminated tiles before fitting',
      metric:
        '100 × Euclidean Oklab distance; report distribution/holdout errors and clipping separately from structural scores',
    },
  });
  console.log(
    'Prepared',
    entries.length,
    'references;',
    entries.filter((e) => e.preview).length,
    'full-card previews.',
  );
  process.exit(0);
}
const plan = await readJson(planFile),
  snapshot = await readJson(snapshotFile),
  rendererHash = await sourceHash(`${root}/games/magic/src`);
if (action === 'before') assert.equal(rendererHash, plan.baselineRendererHash);
assert.equal(hash(JSON.stringify(snapshot)), plan.snapshotHash);
const previous = action === 'after' ? await readJson(`${base}/before/capture.json`) : null;
const session = await openBrowser(snapshot),
  templates = [],
  rows = [];
try {
  for (const e of snapshot.entries.filter((e) => e.preview)) {
    const face = colorFace(e),
      card = plan.cards.find((c) => c.id === e.id),
      key = `${e.card.set}-${e.material}`,
      template = !templates.some((t) => t.key === key);
    const rendered = await session.page.evaluate(
      async ({ face, template, calibrated }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls, loadCanvasImages } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const { retroFrameAsset, retroRects, retroPx } = await import(
          '/games/magic/src/presentation/retro-frame.ts'
        );
        const signal = new AbortController().signal,
          loaded = await loadCanvasImages(canvasAssetUrls(face), signal),
          images = [];
        let plate;
        const defaults = [];
        try {
          for (const tier of ['inspect', 'table']) {
            const c = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              tier,
              signal,
              { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
            );
            if (calibrated) {
              defaults.push({ tier, data: c.toDataURL() });
              const trial = await composeCardTexture(
                {
                  face: { ...face, colorCalibration: 'early-hsb-v1' },
                  printingId: null,
                  printedImage: null,
                },
                tier,
                signal,
                { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
              );
              images.push({ tier, data: trial.toDataURL() });
              trial.width = trial.height = 0;
            } else images.push({ tier, data: c.toDataURL() });
            c.width = c.height = 0;
          }
          if (template) {
            const asset = loaded.images.get(retroFrameAsset(face));
            if (!asset) throw Error('Missing frame');
            const c = document.createElement('canvas');
            c.width = 732;
            c.height = 1020;
            const ctx = c.getContext('2d');
            ctx.scale(1.5, 1.5);
            ctx.drawImage(asset, ...retroPx(retroRects(face).frame));
            plate = c.toDataURL();
            c.width = c.height = 0;
          }
          return { images, plate, defaults };
        } finally {
          loaded.dispose();
        }
      },
      { face, template: template && action === 'before', calibrated: action === 'after' },
    );
    const images = {};
    for (const item of rendered.defaults) {
      const old = previous.rows.find((r) => r.id === e.id).images[item.tier];
      assert.equal(
        hash(Buffer.from(item.data.split(',')[1], 'base64')),
        old.sha256,
        `Default rendering changed: ${e.id}/${item.tier}`,
      );
    }
    for (const r of rendered.images) {
      const bytes = Buffer.from(r.data.split(',')[1], 'base64'),
        file = `${e.id}.${r.tier}.png`;
      await atomicWrite(`${base}/${action}/${file}`, bytes);
      images[r.tier] = { file, sha256: hash(bytes) };
    }
    rows.push({ ...card, face, images });
    if (rendered.plate) {
      const bytes = Buffer.from(rendered.plate.split(',')[1], 'base64'),
        file = `${key}.png`;
      await atomicWrite(`${base}/templates/${file}`, bytes);
      templates.push({
        key,
        frameAsset: card.frameAsset,
        frameRect: card.frameRect,
        frameFamily: card.frameFamily,
        file,
        sha256: hash(bytes),
      });
    }
    console.log('captured', key, e.card.name, e.cohort);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(`${root}/games/magic/src`));
  await writeJson(`${base}/${action}/capture.json`, {
    rendererHash,
    defaultPixelsIdentical: action === 'after' ? rows.length * 2 : null,
    planHash: hash(JSON.stringify(plan)),
    methodHash: hash(await readFile(new URL(import.meta.url))),
    rows,
    templates,
  });
} finally {
  await session.close();
}

function colorFace(entry) {
  return { ...presentation(entry).face, wordingMode: 'oracle', symbolStyle: 'original' };
}
