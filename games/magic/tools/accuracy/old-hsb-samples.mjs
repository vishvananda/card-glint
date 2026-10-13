import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  readJson,
  writeJson,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  objectFile,
  hash,
  root,
} from './common.mjs';
import { readObject } from './cache.mjs';
import { readPng, normalize } from './pixels.mjs';
import { sampleColor, center, median, delta } from './hsb-color.mjs';
import { manaDiscColor } from './hsb-shared-color.mjs';
const plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`),
  snapshot = await readJson(`${cacheRoot}/rollout/old-frame-families.json`),
  templates = await readJson(`${cacheRoot}/rollout/old-frame-templates.json`),
  early = await readJson(`${fixtureRoot}/early-hsb-plan.json`);
assert.equal(snapshot.planHash, hash(JSON.stringify(plan)));
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
const rows = [],
  sources = {},
  cards = new Map();
try {
  const { retroRects, retroPx, retroFrameAsset, retroFrameFilter } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { retroPrintDetails } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-details.ts',
  );
  for (const s of plan.sets) {
    const source = await readJson(`${cacheRoot}/rollout/sets/${s.set}.json`);
    for (const page of source.pages)
      for (const c of JSON.parse((await readObject(page)).toString()).data) cards.set(c.id, c);
  }
  for (const t of templates.rows) {
    const bytes = await readFile(`${outputRoot}/old-frame-families/templates/${t.file}`);
    assert.equal(hash(bytes), t.sha256);
    const image = normalize(await readPng(`${outputRoot}/old-frame-families/templates/${t.file}`));
    sources[t.key] = {
      url: t.url,
      rect: t.rect,
      sha256: t.sha256,
      components: Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          sampleColor(image, early.sampling[c + 'Patches'], {
            paper: c === 'paper',
            tileSize: early.sampling.tileSize,
          }),
        ]),
      ),
    };
  }
  for (const [i, e] of snapshot.entries.entries()) {
    if (['lea', 'leb', '2ed', '3ed'].includes(e.set)) continue;
    if (e.issue) {
      rows.push({ ...e, profiles: undefined });
      continue;
    }
    const card = cards.get(e.id);
    assert.ok(card);
    const face = {
      name: card.name,
      typeLine: card.type_line,
      colors: card.colors,
      setCode: card.set,
      borderColor: card.border_color,
      frameStyle: 'retro',
      manaSymbols: [...(card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
    };
    assert.equal(retroFrameAsset(face), e.currentAsset, 'Source changed before HSB sampling');
    const plate = templates.rows.find((t) => t.url === e.currentAsset);
    assert.ok(plate);
    const image = normalize(await readPng(objectFile(e.reference)));
    const components = Object.fromEntries(
      ['frame', 'paper'].map((c) => [
        c,
        sampleColor(image, early.sampling[c + 'Patches'], {
          paper: c === 'paper',
          tileSize: early.sampling.tileSize,
        }),
      ]),
    );
    const [x, y, w, h] = retroPx(retroRects(face).title),
      d = retroPrintDetails(face),
      size = d?.manaSize ?? 23.4,
      gap = d?.manaGap ?? 1.7,
      cost = face.manaSymbols;
    const left = d
        ? d.manaRight - cost.length * (size + gap) + gap
        : x + w - cost.length * (size + gap),
      cy = d ? d.manaTop + size / 2 : y + h / 2;
    const bySymbol = new Map();
    for (const [j, s] of cost.entries()) {
      const symbol = /^\d+$/.test(s) ? 'N' : s;
      if (!'WUBRGN'.includes(symbol) || symbol.length !== 1) continue;
      const cx = left + j * (size + gap) + size / 2,
        color = manaDiscColor(image, cx, cy);
      const sensitivity = Math.max(
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
    const mana = [...bySymbol].map(([symbol, a]) => ({
      symbol,
      rgb: center(a.map((m) => m.rgb)),
      tiles: a.map((m) => m.rgb),
      spread: median(a.map((m) => m.spread)),
      sensitivity: Math.max(...a.map((m) => m.sensitivity)),
    }));
    rows.push({
      id: e.id,
      name: e.name,
      set: e.set,
      group: e.group,
      material: e.material,
      border: e.border,
      cohort: e.cohort,
      referenceHash: e.reference.sha256,
      plate: plate.key,
      filter: retroFrameFilter(face),
      components,
      mana,
    });
    if (i % 100 === 0) console.log('sampled', i, '/', snapshot.entries.length);
  }
} finally {
  await server.close();
}
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'old-hsb-samples.mjs',
        'hsb-color.mjs',
        'hsb-shared-color.mjs',
        '../../src/presentation/retro-frame.ts',
        '../../src/presentation/retro-details.ts',
      ].map((p) => readFile(new URL(p, import.meta.url))),
    ),
  ),
);
await writeJson(`${cacheRoot}/rollout/old-hsb-samples.json`, {
  schemaVersion: 1,
  planHash: hash(JSON.stringify(plan)),
  snapshotHash: hash(JSON.stringify(snapshot)),
  templateHash: hash(JSON.stringify(templates)),
  sampling: early.sampling,
  methodHash,
  sources,
  rows,
});
console.log(
  'Sampled',
  rows.length,
  'references across',
  new Set(rows.map((r) => r.set)).size,
  'remaining sets.',
);
