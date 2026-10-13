import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readObject } from './cache.mjs';
import {
  cacheRoot,
  fixtureRoot,
  outputRoot,
  readJson,
  writeJson,
  atomicWrite,
  hash,
} from './common.mjs';
import { normalize } from './pixels.mjs';
import { stockBounds } from './frame-family-metrics.mjs';
import {
  fitSharedStockRegistration,
  OLD_FRAME_REGISTRATION_VERSION,
} from './old-frame-registration.mjs';

// Extend scope only through a separately validated set/family/stock cohort.
const set = process.argv[2] ?? '3ed';
assert.equal(set, '3ed', 'Only the Revised Fourth-family registration is validated here.');
const plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`),
  snapshot = await readJson(`${cacheRoot}/rollout/old-frame-families.json`),
  sources = await readJson(`${cacheRoot}/rollout/early-hsb.json`),
  materials = ['W', 'U', 'B', 'R', 'G', 'A'],
  selected = snapshot.entries.filter(
    (e) =>
      e.set === set &&
      e.frame === '1993' &&
      e.border === 'white' &&
      materials.includes(e.material) &&
      e.group.split('/')[2] === 'normal' &&
      !e.issue,
  );
assert.equal(snapshot.planHash, hash(JSON.stringify(plan)));
assert.equal(selected.length, 36, 'The frozen metadata-only Revised cohort changed.');
const targets = {},
  guards = [],
  rows = [];
const browser = await openBrowser(
  { entries: [], components: sources.components },
  { fonts: false },
);
try {
  for (const material of materials) {
    const result = await browser.page.evaluate(async (material) => {
      const { paintRetroFace } = await import('/games/magic/src/presentation/retro-paint.ts');
      const { retroFrameAsset, retroFrameRect, retroBorderMask, retroFamily } = await import(
        '/games/magic/src/presentation/retro-frame.ts'
      );
      const { loadCanvasImages, canvasAssetUrls } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const face = {
        name: '',
        typeLine: material === 'A' ? 'Artifact' : 'Creature',
        colors: material === 'A' ? [] : [material],
        setCode: '3ed',
        borderColor: 'white',
        frameStyle: 'retro',
        rulesText: '',
        artist: '',
        legalText: '',
      };
      const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 1020;
        const context = canvas.getContext('2d');
        context.scale(1.5, 1.5);
        paintRetroFace(context, face, loaded.images);
        return {
          png: canvas.toDataURL(),
          url: retroFrameAsset(face),
          rect: retroFrameRect(face),
          maskUrl: retroBorderMask(face),
          family: retroFamily(face),
        };
      } finally {
        loaded.dispose();
      }
    }, material);
    assert.equal(result.family, 'fourth');
    assert.ok(
      selected.filter((e) => e.material === material).every((e) => e.currentAsset === result.url),
    );
    const bytes = Buffer.from(result.png.split(',')[1], 'base64'),
      renderedHash = hash(bytes),
      file = `${set}-${material}.png`;
    await atomicWrite(`${outputRoot}/old-frame-registration/${file}`, bytes);
    targets[material] = stockBounds(normalize(PNG.sync.read(bytes)), 'white');
    assert.ok(targets[material].reliable, `Unreliable rendered ${material} stock anchors`);
    const asset = sources.components.find((s) => s.url === result.url),
      mask = sources.components.find((s) => s.url === result.maskUrl);
    assert.ok(asset && mask);
    guards.push({
      material,
      url: result.url,
      rect: result.rect,
      sha256: asset.sha256,
      maskUrl: result.maskUrl,
      maskSha256: mask.sha256,
      renderedHash,
      file,
    });
  }
  assert.deepEqual(browser.faults, []);
} finally {
  await browser.close();
}
for (const entry of selected) {
  const bytes = await readObject(entry.reference);
  rows.push({
    id: entry.id,
    name: entry.name,
    material: entry.material,
    cohort: entry.cohort,
    referenceHash: entry.reference.sha256,
    bounds: stockBounds(normalize(PNG.sync.read(bytes, { checkCRC: true })), 'white'),
  });
}
const fit = fitSharedStockRegistration(rows, targets),
  methodHash = hash(
    Buffer.concat(
      await Promise.all(
        [
          'old-frame-registration-study.mjs',
          'old-frame-registration.mjs',
          'frame-family-metrics.mjs',
          'pixels.mjs',
        ].map((p) => readFile(new URL(p, import.meta.url))),
      ),
    ),
  ),
  rendererStockHash = hash(
    Buffer.concat(
      await Promise.all(
        ['retro-frame.ts', 'retro-paint.ts'].map((p) =>
          readFile(new URL(`../../src/presentation/${p}`, import.meta.url)),
        ),
      ),
    ),
  );
const result = {
  schemaVersion: 1,
  method: OLD_FRAME_REGISTRATION_VERSION,
  set,
  printedFrame: '1993',
  border: 'white',
  frameFamily: 'fourth',
  coordinateSystem:
    '488x680; references only; pAfter=center+scale*(pBefore-center)+(tx,ty), center=(244,340); pixels.normalize handles source resolution/letterboxing first',
  scope: {
    materials,
    layouts: ['normal'],
    frameFamily: 'retro-fourth',
    excludes: ['lands using another family', 'tokens', 'special layouts', 'other sets or stocks'],
  },
  policy:
    'One shared translation and uniform scale fitted on frozen calibration cards to the retained painter stock boundaries, equally weighted by material. The target includes the actual scaled frame and white border mask. No text, art, internal bevel, HSB, rotation, anisotropic or per-scan fitting. Held-out cards only validate the frozen transform. Residual opposed boundaries remain a source-geometry diagnostic.',
  guards: {
    sources: guards,
    runtime:
      'Require set, stock, normal layout, family, exact pinned frame URL, frame rectangle and mask URL. Byte hashes document the cached sources and need not trigger another runtime download.',
  },
  provenance: {
    planHash: snapshot.planHash,
    snapshotHash: hash(JSON.stringify(snapshot)),
    methodHash,
    rendererStockHash,
    targetsHash: hash(JSON.stringify(targets)),
    referencesHash: hash(JSON.stringify(rows.map((r) => [r.id, r.referenceHash, r.cohort]))),
  },
  ...fit,
  targets,
  referenceRows: rows,
};
await writeJson(`${fixtureRoot}/old-frame-registration-${set}.json`, result);
console.log(
  JSON.stringify(
    {
      status: result.status,
      transform: result.transform,
      calibration: result.calibration && [
        result.calibration.beforeRms,
        result.calibration.afterRms,
      ],
      validation: result.validation && [result.validation.beforeRms, result.validation.afterRms],
      geometryFlags: result.geometryFlags,
      flags: result.flags,
    },
    null,
    2,
  ),
);
