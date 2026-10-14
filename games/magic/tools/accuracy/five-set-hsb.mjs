import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import {
  root,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  readJson,
  writeJson,
  atomicWrite,
  hash,
} from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { presentation } from './adapter.mjs';
import { normalize } from './pixels-pure.mjs';
import { fitScanResidual } from './printed-plate-registration.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { sampleColor, fitHsb, evaluateHsb, median } from './hsb-color.mjs';
import { oldDualMask } from './old-dual-hsb-specs.mjs';
import { sampleTexture, textureMetrics } from './hsb-texture.mjs';

// Inventory is frozen before fitting. It contains only ordinary English,
// high-resolution scans available nonfoil; source PNGs remain in the local cache.
const inventoryDirectory = process.argv[2];
if (!inventoryDirectory) throw Error('Usage: five-set-hsb.mjs <scan-template-inventory-directory>');
const directory = outputRoot + '/five-set-hsb';
await mkdir(directory, { recursive: true });
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
const { printingColorSource } = await server.ssrLoadModule(
  '/games/magic/src/presentation/printing-color-source.ts',
);
const { canvasAssetUrls } = await server.ssrLoadModule(
  '/games/magic/src/presentation/canvas-assets.ts',
);
const { calibratedFrameMaterials } = await server.ssrLoadModule(
  '/games/magic/src/presentation/calibration-profiles.ts',
);
const model = (await readJson(fixtureRoot + '/early-hsb-plan.json')).model;
const groups = new Map(),
  excluded = [],
  components = new Map();
for (const set of ['lea', 'leb', '3ed', '8ed', 'm21']) {
  const inventory = await readJson(`${inventoryDirectory}/${set}.json`),
    templates = await readJson(`${fixtureRoot}/full-set-scan-templates/${set}.json`),
    broad = set === 'm21' ? await readJson(`${inventoryDirectory}/m21-broad.json`) : null,
    catalog = await readJson(`${cacheRoot}/rollout/sets/${set}.json`),
    cards = new Map();
  for (const p of catalog.pages)
    for (const c of JSON.parse((await readObject(p)).toString()).data) cards.set(c.id, c);
  for (const row of inventory.rows) {
    const card = cards.get(row.card.id),
      template = templates.materials[row.material];
    assert.ok(card?.finishes.includes('nonfoil'));
    const fit =
      template.kind === 'printed-gradient'
        ? fitScanResidual(
            broad?.rows.find((r) => r.card.id === card.id).broad ?? row.profiles,
            template.template,
          )
        : fitScanFrame(row.anchors, template.target);
    if (!fit.accepted) {
      excluded.push({ id: card.id, set, reason: fit.reason });
      continue;
    }
    const face = presentation({ card, reference: row.reference }).face,
      source = printingColorSource(face);
    if (!source) {
      excluded.push({ id: card.id, set, reason: 'unmeasured-material-layout' });
      continue;
    }
    const transform =
      template.kind === 'printed-gradient'
        ? {
            matrix: [
              fit.transform.scale,
              0,
              0,
              fit.transform.scale,
              fit.transform.tx,
              fit.transform.ty,
            ],
          }
        : fit.transform;
    const g = groups.get(source.key) ?? {
      key: source.key,
      source,
      face,
      templateHash: hash(JSON.stringify(template)),
      rows: [],
    };
    assert.equal(g.source.source, source.source);
    g.rows.push({ id: card.id, name: card.name, reference: row.reference, transform });
    groups.set(source.key, g);
  }
}
const selection = [...groups.values()].map((g) => {
  // Fixed UUID order, disjoint calibration and reserved validation. No selection
  // by color error. Sparse materials are reported and cannot become defaults.
  g.rows.sort((a, b) => a.id.localeCompare(b.id));
  const n = Math.min(8, Math.floor(g.rows.length / 2));
  return {
    ...g,
    inventory: g.rows.length,
    rows: g.rows
      .slice(0, n + Math.min(12, g.rows.length - n))
      .map((r, i) => ({ ...r, cohort: i < n ? 'calibration' : 'validation' })),
  };
});
await writeJson(directory + '/selection.json', { groups: selection, excluded });
for (const g of selection) {
  g.face = {
    ...g.face,
    name: '',
    rulesText: '',
    rulesParagraphs: [],
    manaSymbols: [],
    artist: '',
    illustration: null,
    power: undefined,
    toughness: undefined,
    collectorNumber: '',
    colorCalibration: undefined,
  };
  for (const url of canvasAssetUrls(g.face).filter(Boolean))
    if (!components.has(url)) components.set(url, await cachedFetch(url));
}
const browser = await openBrowser(
  { entries: [], components: [...components.values()] },
  { fonts: false },
);
const results = [],
  runtime = {};
try {
  for (const g of selection) {
    if (g.rows.length < 2) {
      results.push({
        key: g.key,
        source: g.source,
        inventory: g.inventory,
        templateHash: g.templateHash,
        status: 'review-only',
        flags: ['sparse-independent-cohorts'],
        rows: g.rows.map((r) => ({ id: r.id, name: r.name, referenceHash: r.reference.sha256 })),
      });
      continue;
    }
    const pixels = await browser.page.evaluate(async (face) => {
      const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { paintAssembledFace } = await import('/games/magic/src/presentation/canvas-face.ts');
      const images = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal);
      const canvas = document.createElement('canvas');
      canvas.width = 732;
      canvas.height = 1020;
      try {
        const c = canvas.getContext('2d');
        c.scale(1.5, 1.5);
        paintAssembledFace(c, face, images.images, 680, false);
        return {
          png: canvas.toDataURL(),
          dimensions: Object.fromEntries(
            [...images.images].map(([k, v]) => [k, [v.width, v.height]]),
          ),
        };
      } finally {
        images.dispose();
        canvas.width = canvas.height = 0;
      }
    }, g.face);
    const bytes = Buffer.from(pixels.png.split(',')[1], 'base64'),
      image = normalize(PNG.sync.read(bytes));
    await atomicWrite(directory + '/' + g.key.replaceAll('/', '-') + '-source.png', bytes);
    const modern = g.source.family === 'components';
    const patches = {
      frame: (modern ? [26, 454] : g.source.family === 'plate' ? [28, 449] : [33, 444]).flatMap(
        (x) => [130, 230, 320].map((y) => [x, y, modern ? 7 : 11, 42]),
      ),
      paper: [[78, 450, 328, 124]],
    };
    const source = Object.fromEntries(
      ['frame', 'paper'].map((c) => [
        c,
        sampleColor(image, patches[c], { paper: c === 'paper', tileSize: 16 }),
      ]),
    );
    const sourceTexture = sampleTexture(image, patches.frame);
    const rows = [];
    for (const row of g.rows) {
      const scan = normalize(
        normalize(PNG.sync.read(await readObject(row.reference))),
        row.transform,
      );
      rows.push({
        ...row,
        components: Object.fromEntries(
          ['frame', 'paper'].map((c) => [
            c,
            sampleColor(scan, patches[c], { paper: c === 'paper', tileSize: 16 }),
          ]),
        ),
        texture: sampleTexture(scan, patches.frame),
      });
    }
    const calibration = rows.filter((r) => r.cohort === 'calibration'),
      held = rows.filter((r) => r.cohort === 'validation'),
      adjustments = Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          fitHsb(
            source[c],
            calibration.map((r) => r.components[c]),
            model,
            math,
          ).adjustment,
        ]),
      );
    const existing = calibratedFrameMaterials({ ...g.face, colorCalibration: 'set-hsb-v1' })[
      g.source.frame
    ];
    const measurements = rows.map((r) => ({
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      referenceHash: r.reference.sha256,
      transform: r.transform,
      components: Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          {
            ...evaluateHsb(source[c], r.components[c], adjustments[c], math),
            previous:
              existing && 'mask' in existing
                ? evaluateHsb(source[c], r.components[c], existing[c], math).after
                : null,
          },
        ]),
      ),
      texture: textureMetrics(
        sourceTexture.map((t) => math.adjustHsb(t, adjustments.frame)),
        r.texture,
      ),
    }));
    const flags = [];
    if (calibration.length < 3 || held.length < 3) flags.push('sparse-independent-cohorts');
    const validation = Object.fromEntries(
      ['frame', 'paper'].map((c) => {
        const rs = measurements
          .filter((r) => r.cohort === 'validation')
          .map((r) => r.components[c]);
        const v = {
          before: median(rs.map((r) => r.before)),
          after: median(rs.map((r) => r.after)),
          previous: rs[0].previous == null ? null : median(rs.map((r) => r.previous)),
          worstRegression: Math.max(...rs.map((r) => r.after - r.before)),
          clipping: Math.max(...rs.map((r) => r.clipping)),
        };
        if (v.after > v.before + 0.15) flags.push(c + '-median-regression');
        if (v.worstRegression > 2) flags.push(c + '-card-regression');
        if (v.clipping > 0.03) flags.push(c + '-clipping');
        if (v.previous != null && v.after > v.previous + 0.25)
          flags.push(c + '-previous-profile-regression');
        return [c, v];
      }),
    );
    let mask;
    if (g.source.family === 'retro') {
      const f = g.source.frame.includes('/old/abu/')
        ? 'abu'
        : g.source.frame.includes('/old/fourth/')
          ? 'fourth'
          : 'seventh';
      const material = g.source.frame.split('/').at(-1).replace('.png', '').toUpperCase();
      mask = oldDualMask(f + '/' + material, { rect: g.source.rect, components: source });
      if (f === 'fourth' && material === 'W')
        mask = {
          kind: 'rect',
          rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
          feather: 2 / 1500,
        };
    } else if (g.source.family === 'plate')
      mask = { kind: 'rect', rect: [0.082, 0.627, 0.838, 0.29], feather: 2 / 2010 };
    else {
      const [w, h] = pixels.dimensions[g.source.frame],
        r = g.source.rect;
      mask = {
        kind: 'rect',
        rect: [
          (38 / 488 - r[0]) / r[2],
          ((430 / 680 - r[1]) * 680 * w) / (r[2] * 488 * h),
          414 / (488 * r[2]),
          (192 * w) / (r[2] * 488 * h),
        ],
        feather: 2 / w,
      };
    }
    if (!mask) flags.push('missing-source-paper-mask');
    const materials = { [g.source.frame]: { ...adjustments, mask } };
    if (g.source.assets.pt) materials[g.source.assets.pt] = adjustments.paper;
    if (g.source.family === 'components') {
      materials[g.source.assets.background] = adjustments.frame;
      materials[g.source.assets.boxes] = adjustments.paper;
      materials[g.source.assets.crown] = adjustments.frame;
    }
    if (!flags.length) runtime[g.key] = { source: g.source.source, materials };
    const result = {
      key: g.key,
      probe: Object.fromEntries(
        [
          'setCode',
          'frameStyle',
          'borderColor',
          'frameAssetFamily',
          'colors',
          'typeLine',
          'legendary',
          'creature',
          'land',
          'artifact',
        ]
          .filter((k) => g.face[k] !== undefined)
          .map((k) => [k, g.face[k]]),
      ),
      source: g.source,
      inventory: g.inventory,
      templateHash: g.templateHash,
      sourceHash: hash(bytes),
      patches,
      adjustments,
      mask,
      validation,
      flags,
      status: flags.length ? 'review-only' : 'admitted',
      rows: measurements,
    };
    results.push(result);
    console.log(
      g.key,
      result.status,
      validation.frame.before.toFixed(2) + '→' + validation.frame.after.toFixed(2),
      validation.paper.before.toFixed(2) + '→' + validation.paper.after.toFixed(2),
      flags.join(','),
    );
    await writeJson(directory + '/results.json', { groups: results, excluded });
  }
  assert.deepEqual(browser.faults, []);
} finally {
  await browser.close();
  await server.close();
}
await writeJson(directory + '/runtime.json', runtime);
await writeJson(fixtureRoot + '/five-set-hsb-results.json', {
  version: 1,
  selectionHash: hash(JSON.stringify(selection)),
  policy:
    'Shared set/material frame and paper HSB; frozen per-scan frame pose; disjoint UUID cohorts; minimum 3+3; held-out median regression <=0.15 Oklab, worst per-card <=2, clipping <=3%; preserve prior approved median within 0.25. Texture/shadow residuals remain explicit diagnostics, not a claim of texture equality.',
  groups: results,
  excluded,
});
