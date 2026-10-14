import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import manifest from '../../assets.json' with { type: 'json' };
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
import { normalize, luminance } from './pixels-pure.mjs';
import { manaLandmark } from './mana-landmark.mjs';
import { fitScanResidual } from './printed-plate-registration.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { manaGlyphMask, compareManaGlyph, GLYPH_SIZE } from './mana-glyph-metrics.mjs';
import { median } from './metrics.mjs';
const directory = outputRoot + '/mana-glyph-study';
const inventoryRoot =
  process.env.CARD_GLINT_TEMPLATE_INVENTORY ?? outputRoot + '/scan-template-study';
await mkdir(directory, { recursive: true });
const snapshot = await readJson(cacheRoot + '/rollout/old-frame-families.json'),
  oldPoses = await readJson(cacheRoot + '/rollout/old-dual-hsb-samples.json'),
  poseMap = new Map(oldPoses.rows.map((r) => [r.id, r]));
const sets = [...new Set(snapshot.entries.map((e) => e.set))].filter(
  (s) =>
    !['tsb', 'sld', 'plst', 'tsr', 'mh2', 'brc', 'dmr', 'cmm', 'rvr', 'mh3', 'inr', 'tdm'].includes(
      s,
    ),
);
sets.push('8ed');
const cards = new Map();
for (const set of sets)
  for (const p of (await readJson(cacheRoot + '/rollout/sets/' + set + '.json')).pages)
    for (const c of JSON.parse(await readObject(p)).data) cards.set(c.id, c);
const pool = [],
  excluded = [];
for (const set of sets) {
  if (['lea', 'leb', '3ed', '8ed'].includes(set)) {
    const inv = await readJson(inventoryRoot + '/' + set + '.json'),
      templates = await readJson(fixtureRoot + '/full-set-scan-templates/' + set + '.json');
    for (const row of inv.rows) {
      const c = cards.get(row.card.id),
        t = templates.materials[row.material],
        fit =
          t.kind === 'printed-gradient'
            ? fitScanResidual(row.profiles, t.template)
            : fitScanFrame(row.anchors, t.target);
      if (!fit.accepted) {
        excluded.push({ id: c.id, set, reason: fit.reason });
        continue;
      }
      pool.push({
        id: c.id,
        set,
        name: c.name,
        reference: row.reference,
        transform:
          t.kind === 'printed-gradient'
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
            : fit.transform,
        templateHash: hash(JSON.stringify(t)),
        doubleNormalize: true,
      });
    }
  } else
    for (const e of snapshot.entries.filter((e) => e.set === set)) {
      const p = poseMap.get(e.id);
      if (p?.referenceHash && p.referenceHash !== e.reference.sha256)
        throw Error('Stale frame normalization');
      pool.push({
        id: e.id,
        set,
        name: e.name,
        reference: e.reference,
        transform: p?.normalization.accepted ? p.normalization.transform : {},
        templateHash: p?.identity ?? null,
        doubleNormalize: false,
        frameAccepted: !!p?.normalization.accepted,
        frameIssue: p?.normalization.reason ?? null,
      });
    }
}
// Missing/rejected frame fits do not prevent glyph identification: disc-local
// normalization removes pose and scale without proposing renderer positions.
// Record that fallback explicitly; never use these samples for layout fitting.
for (const set of sets)
  for (const symbol of 'WUBRG') {
    const matching = (c) =>
      c.set === set &&
      c.layout === 'normal' &&
      c.colors?.length === 1 &&
      c.colors[0] === symbol &&
      c.mana_cost?.endsWith('{' + symbol + '}') &&
      c.finishes.includes('nonfoil') &&
      !c.promo &&
      !c.full_art &&
      c.image_uris?.png;
    const existing = pool.filter((r) => matching(cards.get(r.id)));
    if (existing.length >= 8) continue;
    for (const c of [...cards.values()].filter(matching).sort((a, b) => a.id.localeCompare(b.id))) {
      if (pool.some((r) => r.id === c.id)) continue;
      const reference = await cachedFetch(c.image_uris.png);
      pool.push({
        id: c.id,
        set,
        name: c.name,
        reference,
        transform: {},
        templateHash: null,
        doubleNormalize: false,
        frameAccepted: false,
        frameIssue: 'disc-identity-only',
      });
      if (existing.push(c) >= 8) break;
    }
  }
const groups = [];
for (const set of sets)
  for (const symbol of 'WUBRG') {
    const candidates = pool
      .filter((r) => {
        const c = cards.get(r.id);
        return (
          r.set === set &&
          c.layout === 'normal' &&
          c.colors?.length === 1 &&
          c.colors[0] === symbol &&
          c.finishes.includes('nonfoil') &&
          c.mana_cost?.endsWith('{' + symbol + '}') &&
          !c.promo &&
          !c.full_art
        );
      })
      .sort((a, b) => a.id.localeCompare(b.id));
    const unique = [...new Map(candidates.map((c) => [c.id, c])).values()].slice(0, 8);
    groups.push({
      set,
      symbol,
      rows: unique.map((r, i) => ({
        ...r,
        cohort: i < Math.floor(unique.length / 2) ? 'calibration' : 'validation',
      })),
    });
  }
await writeJson(directory + '/selection.json', { sets, groups, excluded });
const vite = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const { manaSymbolAsset } = await vite.ssrLoadModule('/games/magic/src/presentation/assets.ts');
await vite.close();
const assetList = [];
for (const symbol of 'WUBRG')
  for (const kind of ['modern', 'conjurer-old', 'mse-old']) {
    const url =
      kind === 'modern'
        ? manaSymbolAsset(symbol)
        : kind === 'conjurer-old'
          ? manifest.CONJURER_ROOT + '/img/manaSymbols/old/old' + symbol.toLowerCase() + '.svg'
          : 'https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-mana-old.mse-symbol-font/mana_' +
            symbol.toLowerCase() +
            '.png';
    assetList.push({ kind, symbol, ...(await cachedFetch(url)) });
  }
assetList.push({ kind: 'font', ...(await cachedFetch(manifest.RETRO_SYMBOL_FONT)) });
const browser = await openBrowser({ entries: [], components: assetList }, { fonts: false }),
  glyphs = {};
try {
  for (const asset of assetList) {
    if (asset.kind === 'font') continue;
    const png = await browser.page.evaluate(async (url) => {
      const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const loaded = await loadCanvasImages([url], new AbortController().signal);
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 96;
        c.getContext('2d').drawImage(loaded.images.get(url), 0, 0, 96, 96);
        return c.toDataURL();
      } finally {
        loaded.dispose();
      }
    }, asset.url);
    const bytes = Buffer.from(png.split(',')[1], 'base64'),
      im = PNG.sync.read(bytes),
      mask = manaGlyphMask(
        im,
        { x: 47.5, y: 47.5, radius: 'WG'.includes(asset.symbol) ? 67 : 48 },
        'WG'.includes(asset.symbol),
      );
    assert.equal(mask.status, 'measured');
    glyphs[asset.symbol + '/' + asset.kind] = mask.ink;
    await atomicWrite(directory + '/' + asset.symbol + '-' + asset.kind + '.png', bytes);
  }
} finally {
  await browser.close();
}
const results = [];
for (const g of groups) {
  const measurements = [];
  for (const row of g.rows) {
    const identity = hash(JSON.stringify([row, 'mana-glyph-v4'])),
      file = directory + '/' + identity + '.json';
    let saved;
    try {
      saved = await readJson(file);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    if (saved) {
      measurements.push(saved);
      continue;
    }
    const raw = PNG.sync.read(await readObject(row.reference)),
      image = normalize(row.doubleNormalize ? normalize(raw) : raw, row.transform);
    const nominalY = g.set === '8ed' ? 56 : row.frameAccepted === false ? 40 : 46,
      circle = manaLandmark(luminance(image), 488, 680, {
        x: 435,
        y: nominalY,
        range: 10,
        radiusRange: [8, 17],
      });
    let measured = { ...row, circle, status: circle.status };
    if (circle.score >= 8 && Math.abs(circle.x - 435) < 10 && Math.abs(circle.y - nominalY) < 10) {
      const mask = manaGlyphMask(
        image,
        'WG'.includes(g.symbol) ? { ...circle, radius: 18 } : circle,
        'WG'.includes(g.symbol),
      );
      measured = {
        ...measured,
        status: mask.status,
        contrast: mask.contrast,
        occupancy: mask.occupancy,
      };
      if (mask.status === 'measured') {
        const p = new PNG({ width: GLYPH_SIZE, height: GLYPH_SIZE });
        for (let i = 0; i < mask.ink.length; i++) {
          p.data[i * 4] = p.data[i * 4 + 1] = p.data[i * 4 + 2] = mask.ink[i] ? 0 : 255;
          p.data[i * 4 + 3] = 255;
        }
        await atomicWrite(
          directory + '/' + row.id + '-' + g.symbol + '-ink.png',
          PNG.sync.write(p),
        );
        const crop = new PNG({ width: 96, height: 96 });
        for (let y = 0; y < 96; y++)
          for (let x = 0; x < 96; x++) {
            const sx = Math.round(circle.x + (x - 48) / 3),
              sy = Math.round(circle.y + (y - 48) / 3);
            for (let k = 0; k < 4; k++)
              crop.data[(y * 96 + x) * 4 + k] = image.data[(sy * 488 + sx) * 4 + k];
          }
        await atomicWrite(
          directory + '/' + row.id + '-' + g.symbol + '-scan.png',
          PNG.sync.write(crop),
        );
        measured.scores = Object.fromEntries(
          ['modern', 'conjurer-old', 'mse-old'].map((k) => [
            k,
            compareManaGlyph(mask.ink, glyphs[g.symbol + '/' + k]),
          ]),
        );
      }
    }
    await writeJson(file, measured);
    measurements.push(measured);
  }
  const usable = measurements.filter((r) => r.scores),
    cal = usable.filter((r) => r.cohort === 'calibration'),
    held = usable.filter((r) => r.cohort === 'validation');
  const ranking = ['modern', 'conjurer-old', 'mse-old']
    .map((kind) => ({
      kind,
      calibration: median(cal.map((r) => r.scores[kind].score)),
      validation: median(held.map((r) => r.scores[kind].score)),
    }))
    .sort((a, b) => (b.calibration ?? -1) - (a.calibration ?? -1));
  const winner = ranking[0],
    runner = ranking[1],
    flags = [];
  if (cal.length < 2 || held.length < 2) flags.push('sparse');
  if (winner.calibration - runner.calibration < 0.02) flags.push('ambiguous-shape');
  if (winner.validation < Math.max(...ranking.map((r) => r.validation ?? 0)) - 0.02)
    flags.push('holdout-disagrees');
  if ((winner.calibration ?? 0) < 0.7 || (winner.validation ?? 0) < 0.7)
    flags.push('inspect-extraction');
  results.push({
    set: g.set,
    symbol: g.symbol,
    winner: winner.kind,
    ranking,
    flags,
    rows: measurements,
  });
  console.log(
    g.set,
    g.symbol,
    winner.kind,
    ranking
      .map((r) => `${r.kind}:${r.calibration?.toFixed(3)}/${r.validation?.toFixed(3)}`)
      .join(' '),
    flags.join(','),
  );
  await writeJson(directory + '/results.json', {
    version: 1,
    policy:
      'Frame-normalized nonfoil scans; frozen UUID cohorts. Disc-only location measurements and normalized glyph-ink bounds classify artwork, never renderer placement. Color-independent ink IoU plus symmetric edge F1; no per-card renderer adjustments.',
    sets,
    assets: assetList,
    groups: results,
    excluded,
  });
}
