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
  plateProfiles,
  canonicalScanProfiles,
  alignedScanTemplates,
  fitScanResidual,
  fitSharedPlateRegistration,
  PLATE_REGISTRATION_VERSION,
} from './printed-plate-registration.mjs';
import {
  fitSharedStockRegistration,
  OLD_FRAME_REGISTRATION_VERSION,
} from './old-frame-registration.mjs';

// Each set/family/stock cohort must pass its own frozen calibration and holdout.
const set = process.argv[2] ?? '3ed';
assert.match(set, /^[a-z0-9]{2,6}$/);
const plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`),
  snapshot = await readJson(`${cacheRoot}/rollout/old-frame-families.json`),
  sourceStudies = await Promise.all(
    ['early-hsb', 'old-hsb-preview'].map((name) => readJson(`${cacheRoot}/rollout/${name}.json`)),
  ),
  sources = {
    components: [
      ...new Map(sourceStudies.flatMap((s) => s.components).map((a) => [a.url, a])).values(),
    ],
  },
  materials = ['W', 'U', 'B', 'R', 'G', 'A'],
  selected = snapshot.entries.filter(
    (e) =>
      e.set === set &&
      e.frame === '1993' &&
      materials.includes(e.material) &&
      e.group.split('/')[2] === 'normal' &&
      !e.issue,
  );
assert.equal(snapshot.planHash, hash(JSON.stringify(plan)));
// A separately specified land extension covers the common ABU dual-land source.
// Names select cohorts before measuring; Badlands remains held out for review.
if (set === 'lea') {
  materials.push('L');
  const landCalibration = new Set(['Bayou', 'Plateau', 'Savannah']);
  selected.push(
    ...snapshot.entries
      .filter((e) => e.set === set && e.material.startsWith('dual-') && !e.issue)
      .map((e) => ({
        ...e,
        material: 'L',
        cohort: landCalibration.has(e.name) ? 'calibration' : 'validation',
      })),
  );
}
assert.ok(selected.length >= 12, 'Insufficient frozen metadata-only cohort');
const stocks = [...new Set(selected.map((e) => e.border))],
  families = [...new Set(selected.map((e) => e.currentFamily))];
assert.equal(stocks.length, 1, 'Mixed stocks require separate studies');
assert.equal(families.length, 1, 'Mixed families require separate studies');
const border = stocks[0],
  family = families[0],
  usePlate = family === 'abu' && border === 'black',
  anchor = usePlate ? 'printed-plate-gradient' : 'outer-stock';
const targets = {},
  plateTargets = {},
  guards = [],
  rows = [];
const browser = await openBrowser(
  { entries: [], components: sources.components },
  { fonts: false },
);
try {
  for (const material of materials) {
    const result = await browser.page.evaluate(
      async ({ material, set, border }) => {
        const { paintRetroFace } = await import('/games/magic/src/presentation/retro-paint.ts');
        const { retroFrameAsset, retroFrameRect, retroBorderMask, retroFamily } = await import(
          '/games/magic/src/presentation/retro-frame.ts'
        );
        const { loadCanvasImages, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const face = {
          name: '',
          typeLine: material === 'L' ? 'Land' : material === 'A' ? 'Artifact' : 'Creature',
          colors: ['A', 'L'].includes(material) ? [] : [material],
          setCode: set,
          borderColor: border,
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
      },
      { material, set, border },
    );
    assert.equal(result.family, family);
    assert.ok(
      selected.filter((e) => e.material === material).every((e) => e.currentAsset === result.url),
    );
    const bytes = Buffer.from(result.png.split(',')[1], 'base64'),
      renderedHash = hash(bytes),
      file = `${set}-${material}.png`;
    await atomicWrite(`${outputRoot}/old-frame-registration/${file}`, bytes);
    const normalized = normalize(PNG.sync.read(bytes));
    targets[material] = stockBounds(normalized, border);
    if (usePlate) plateTargets[material] = plateProfiles(normalized);
    // Dark source plates can lack a measurable outer transition. Retain that
    // target as uncertain; the fitter excludes it instead of losing the whole
    // study or treating a weak boundary as a valid registration anchor.
    const asset = sources.components.find((s) => s.url === result.url),
      mask = sources.components.find((s) => s.url === result.maskUrl);
    assert.ok(asset && (!result.maskUrl || mask));
    guards.push({
      material,
      url: result.url,
      rect: result.rect,
      sha256: asset.sha256,
      maskUrl: result.maskUrl,
      maskSha256: mask?.sha256 ?? null,
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
  const normalized = normalize(PNG.sync.read(bytes, { checkCRC: true }));
  rows.push({
    id: entry.id,
    name: entry.name,
    material: entry.material,
    cohort: entry.cohort,
    referenceHash: entry.reference.sha256,
    bounds: stockBounds(normalized, border),
    ...(usePlate ? { profiles: plateProfiles(normalized) } : {}),
  });
}
// Admit material groups using only anchor reliability and fixed cohort counts,
// before estimating any transform. Sparse groups remain in the coverage report
// and cannot inherit a fit validated on the other materials.
const stockMaterials = materials.filter(
    (material) =>
      targets[material].reliable &&
      ['calibration', 'validation'].every(
        (cohort) =>
          rows.filter((r) => r.material === material && r.cohort === cohort && r.bounds.reliable)
            .length >= 2,
      ),
  ),
  fitRows = usePlate ? rows : rows.filter((r) => stockMaterials.includes(r.material)),
  fit = usePlate
    ? fitSharedPlateRegistration(
        rows.filter((r) => r.material !== 'L'),
        plateTargets,
      )
    : fitSharedStockRegistration(fitRows, targets),
  methodHash = hash(
    Buffer.concat(
      await Promise.all(
        [
          'old-frame-registration-study.mjs',
          'old-frame-registration.mjs',
          'printed-plate-registration.mjs',
          'frame-family-metrics.mjs',
          'pixels.mjs',
          'pixels-pure.mjs',
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
const registrationTemplates =
  usePlate && fit.accepted
    ? alignedScanTemplates(canonicalScanProfiles(rows), fit.transform)
    : null;
const landValidation = registrationTemplates?.L
  ? rows
      .filter((r) => r.material === 'L')
      .map((r) => ({
        id: r.id,
        cohort: r.cohort,
        ...fitScanResidual(r.profiles, registrationTemplates.L),
      }))
  : [];
if (
  landValidation.length &&
  landValidation.filter((r) => r.cohort === 'validation' && r.accepted).length < 5
) {
  delete registrationTemplates.L;
  guards.splice(
    guards.findIndex((g) => g.material === 'L'),
    1,
  );
}
const admittedMaterials = usePlate
  ? materials
  : materials.filter(
      (material) =>
        targets[material].reliable &&
        (fit.counts.materialCounts[material]?.calibration ?? 0) >= 2 &&
        (fit.counts.materialCounts[material]?.validation ?? 0) >= 2,
    );
const result = {
  schemaVersion: 1,
  method: usePlate ? PLATE_REGISTRATION_VERSION : OLD_FRAME_REGISTRATION_VERSION,
  set,
  printedFrame: '1993',
  border,
  frameFamily: family,
  anchor,
  coordinateSystem:
    '488x680; references only; pAfter=center+scale*(pBefore-center)+(tx,ty), center=(244,340); pixels.normalize handles source resolution/letterboxing first',
  scope: {
    materials: admittedMaterials,
    layouts: ['normal'],
    frameFamily: `retro-${family}`,
    excludes: [
      'land assets not explicitly guarded',
      'tokens',
      'special layouts',
      'other sets or stocks',
    ],
  },
  policy:
    'One shared translation and uniform scale fitted on frozen calibration cards to the retained painter outer printed plate, equally weighted by material. No text, art, HSB, rotation, anisotropic or per-scan fitting. Held-out cards only validate the frozen transform. ABU black stock uses normalized gradient profiles of the plate border to separate its narrow bevel from the adjacent cast shadow and faint bitmap edge. Other families use stock boundaries. Residual opposed boundaries remain a source-geometry diagnostic.',
  guards: {
    sources: guards.filter((g) => admittedMaterials.includes(g.material)),
    runtime:
      'Require set, stock, normal layout, family, exact pinned frame URL, frame rectangle and mask URL. Byte hashes document the cached sources and need not trigger another runtime download.',
  },
  provenance: {
    planHash: snapshot.planHash,
    snapshotHash: hash(JSON.stringify(snapshot)),
    methodHash,
    rendererStockHash,
    targetsHash: hash(JSON.stringify(usePlate ? plateTargets : targets)),
    referencesHash: hash(JSON.stringify(rows.map((r) => [r.id, r.referenceHash, r.cohort]))),
  },
  ...fit,
  ...(usePlate
    ? {}
    : {
        excluded: fit.excluded + rows.length - fitRows.length,
        uncertainMaterials: materials.filter((m) => !admittedMaterials.includes(m)),
        unvalidatedSources: guards.filter((g) => !admittedMaterials.includes(g.material)),
      }),
  targets,
  ...(usePlate
    ? {
        plateTargets,
        registrationTemplates,
        templateExtensions: landValidation.length
          ? [
              {
                material: 'L',
                accepted: !!registrationTemplates?.L,
                rendererGeometryValidated: false,
                note: 'Reference pose transfers to the shared ABU card coordinate system. The retained plain land frame differs from the printed dual-land frame; preserve this asset discrepancy separately from scan normalization.',
                rows: landValidation,
              },
            ]
          : [],
      }
    : {}),
  referenceRows: rows,
};
await writeJson(`${fixtureRoot}/old-frame-registration-${set}.json`, result);
console.log(
  JSON.stringify(
    {
      status: result.status,
      transform: result.transform,
      calibration: result.calibration && [
        result.calibration.beforeRms ?? result.calibration.before,
        result.calibration.afterRms ?? result.calibration.after,
      ],
      validation: result.validation && [
        result.validation.beforeRms ?? result.validation.before,
        result.validation.afterRms ?? result.validation.after,
      ],
      geometryFlags: result.geometryFlags,
      flags: result.flags,
    },
    null,
    2,
  ),
);
