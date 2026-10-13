import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { readJson, writeJson, fixtureRoot, cacheRoot, outputRoot, root, hash } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, center, median, delta } from './hsb-color.mjs';
import { sampleTexture } from './hsb-texture.mjs';
import { manaDiscColor, perCardMana } from './hsb-shared-color.mjs';
import { oldFrameTarget, normalizeOldFrame } from './old-frame-normalization.mjs';
const plan = await readJson(fixtureRoot + '/old-frame-family-plan.json'),
  snapshot = await readJson(cacheRoot + '/rollout/old-frame-families.json'),
  early = await readJson(cacheRoot + '/rollout/early-hsb.json'),
  templates = await readJson(cacheRoot + '/rollout/old-frame-templates.json'),
  targets = await readJson(cacheRoot + '/rollout/old-dual-hsb-templates.json'),
  earlyPlan = await readJson(fixtureRoot + '/early-hsb-plan.json');
const earlySets = ['lea', 'leb', '2ed', '3ed'];
const sampling = {
  ...earlyPlan.sampling,
  registration:
    'Per-card frame-only affine normalization; pose cached with reference/template/method hashes. No scan-specific color fitting.',
  framePatches: [
    ...earlyPlan.sampling.framePatches,
    [33, 450, 11, 50],
    [444, 450, 11, 50],
    [33, 520, 11, 40],
    [444, 520, 11, 40],
  ],
};
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const rows = [],
  sources = {},
  cards = new Map(),
  targetCache = new Map();
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'old-dual-hsb-samples.mjs',
        'hsb-color.mjs',
        'hsb-texture.mjs',
        'hsb-shared-color.mjs',
        'old-frame-normalization.mjs',
        'scan-affine-fit.mjs',
        'scan-frame-anchors.mjs',
        'scan-frame-fit.mjs',
      ].map((p) => readFile(new URL(p, import.meta.url))),
    ),
  ),
);
const selectedSet = process.argv[2];
try {
  const { retroRects, retroPx, retroFrameAsset, retroFrameFilter, retroFrameRect } =
    await server.ssrLoadModule('/games/magic/src/presentation/retro-frame.ts');
  const { retroPrintDetails } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-details.ts',
  );
  for (const s of plan.sets) {
    const set = await readJson(cacheRoot + '/rollout/sets/' + s.set + '.json');
    for (const p of set.pages)
      for (const c of JSON.parse((await readObject(p)).toString()).data) cards.set(c.id, c);
  }
  const entries = [
    ...snapshot.entries.filter((e) => !earlySets.includes(e.set)),
    ...early.entries.map((e) => {
      const c = e.card,
        face = {
          name: c.name,
          typeLine: c.type_line,
          colors: c.colors,
          setCode: c.set,
          borderColor: c.border_color,
          frameStyle: 'retro',
        };
      cards.set(c.id, c);
      return {
        ...e,
        name: c.name,
        set: c.set,
        border: c.border_color,
        group: `${c.frame}/${c.border_color}/${c.layout}/${e.material}`,
        currentAsset: retroFrameAsset(face),
      };
    }),
  ].filter((e) => (!selectedSet || e.set === selectedSet) && cards.get(e.id)?.nonfoil !== false);
  for (const t of templates.rows) {
    const bytes = await readFile(outputRoot + '/old-frame-families/templates/' + t.file);
    assert.equal(hash(bytes), t.sha256);
    const image = normalize(PNG.sync.read(bytes));

    try {
      sources[t.key] = {
        url: t.url,
        rect: t.rect,
        asset: t.asset,
        templateHash: t.sha256,
        components: Object.fromEntries(
          ['frame', 'paper'].map((c) => [
            c,
            {
              ...sampleColor(image, sampling[c + 'Patches'], {
                paper: c === 'paper',
                tileSize: 20,
              }),
              ...(c === 'frame' ? { texture: sampleTexture(image, sampling.framePatches) } : {}),
            },
          ]),
        ),
      };
    } catch (error) {
      sources[t.key] = {
        url: t.url,
        rect: t.rect,
        asset: t.asset,
        templateHash: t.sha256,
        issue: error.message,
      };
    }
  }
  for (const t of targets.rows) {
    const bytes = await readFile(outputRoot + '/old-dual-hsb/templates/' + t.file);
    assert.equal(hash(bytes), t.sha256);
    const geometryBytes = await readFile(outputRoot + '/old-dual-hsb/templates/' + t.geometryFile);
    assert.equal(hash(geometryBytes), t.geometryHash);
    targetCache.set(t.key + '-' + t.border, {
      target: oldFrameTarget(
        normalize(PNG.sync.read(bytes)),
        normalize(PNG.sync.read(geometryBytes)),
        t.border,
      ),
      hash: hash(JSON.stringify([t.sha256, t.geometryHash])),
    });
  }
  for (const [i, e] of entries.entries()) {
    const card = cards.get(e.id);
    assert.ok(card, e.id);
    const face = {
      name: card.name,
      typeLine: card.type_line,
      colors: card.colors,
      setCode: card.set,
      borderColor: card.border_color,
      frameStyle: 'retro',
      manaSymbols: [...(card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
    };
    const plate = templates.rows.find((t) => t.url === retroFrameAsset(face));
    const base = {
      id: e.id,
      name: e.name,
      set: e.set,
      group: e.group,
      material: e.material,
      border: e.border,
      cohort: e.cohort,
      layout: card.layout,
      referenceHash: e.reference?.sha256,
      plate: plate?.key,
      filter: retroFrameFilter(face),
    };
    if (e.issue || !plate || !e.reference) {
      rows.push({ ...base, issue: e.issue ?? 'missing-frame-source' });
      continue;
    }
    assert.equal(plate.url, e.currentAsset);
    assert.deepEqual(plate.rect, retroFrameRect(face));
    const target = targetCache.get(plate.key + '-' + e.border);
    if (!target) {
      rows.push({ ...base, issue: 'unsupported-border-stock' });
      continue;
    }
    const identity = hash(
      JSON.stringify([base, methodHash, sampling, plate.asset.sha256, plate.sha256, target.hash]),
    );
    const file = cacheRoot + '/rollout/dual-hsb-samples/' + e.id + '-' + identity + '.json';
    try {
      rows.push(await readJson(file));
      continue;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const bytes = await readObject(e.reference),
      raw = PNG.sync.read(bytes);
    const fit = normalizeOldFrame(normalize(raw), target.target, e.border);
    let row = { ...base, identity, normalization: fit };
    if (!fit.accepted) row.issue = 'frame-normalization: ' + fit.reason;
    else {
      const image = normalize(raw, fit.transform);
      row.components = Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          {
            ...sampleColor(image, sampling[c + 'Patches'], { paper: c === 'paper', tileSize: 20 }),
            ...(c === 'frame' ? { texture: sampleTexture(image, sampling.framePatches) } : {}),
          },
        ]),
      );
      if (earlySets.includes(e.set)) row.mana = perCardMana(image, e.set, face.manaSymbols);
      else {
        const [x, y, w, h] = retroPx(retroRects(face).title),
          d = retroPrintDetails(face),
          size = d?.manaSize ?? 23.4,
          gap = d?.manaGap ?? 1.7,
          cost = face.manaSymbols;
        const left = d
            ? d.manaRight - cost.length * (size + gap) + gap
            : x + w - cost.length * (size + gap),
          cy = d ? d.manaTop + size / 2 : y + h / 2,
          bySymbol = new Map();
        for (const [j, s] of cost.entries()) {
          const symbol = /^\d+$/.test(s) ? 'N' : s;
          if (!['W', 'U', 'B', 'R', 'G', 'N'].includes(symbol)) continue;
          const cx = left + j * (size + gap) + size / 2,
            color = manaDiscColor(image, cx, cy),
            sensitivity = Math.max(
              ...[
                [2, 0],
                [-2, 0],
                [0, 2],
                [0, -2],
              ].map(([dx, dy]) => delta(color.rgb, manaDiscColor(image, cx + dx, cy + dy).rgb)),
            );
          const a = bySymbol.get(symbol) ?? [];
          a.push({ ...color, sensitivity });
          bySymbol.set(symbol, a);
        }
        row.mana = [...bySymbol].map(([symbol, a]) => ({
          symbol,
          rgb: center(a.map((m) => m.rgb)),
          tiles: a.map((m) => m.rgb),
          spread: median(a.map((m) => m.spread)),
          sensitivity: Math.max(...a.map((m) => m.sensitivity)),
        }));
      }
    }
    await writeJson(file, row);
    rows.push(row);
    if (i % 50 === 0) console.log('sampled', i, '/', entries.length, e.set, e.name, fit.accepted);
  }
} finally {
  await server.close();
}
await writeJson(
  cacheRoot + '/rollout/old-dual-hsb-samples' + (selectedSet ? '-' + selectedSet : '') + '.json',
  {
    schemaVersion: 1,
    planHash: hash(JSON.stringify(plan)),
    snapshotHash: hash(JSON.stringify(snapshot)),
    earlyHash: hash(JSON.stringify(early)),
    templateHash: hash(JSON.stringify(templates)),
    targetHash: hash(JSON.stringify(targets)),
    methodHash,
    sampling,
    sources,
    rows,
  },
);
console.log(
  'Sampled',
  rows.length,
  'accepted frame fits',
  rows.filter((r) => r.normalization?.accepted).length,
  'sets',
  new Set(rows.map((r) => r.set)).size,
);
