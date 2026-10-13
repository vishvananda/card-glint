import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readObject } from './cache.mjs';
import { readJson, writeJson, root, cacheRoot, fixtureRoot, hash } from './common.mjs';
import { printingScope, frameWave, referenceIssue, evaluatorIssue } from './rollout-policy.mjs';

const inventory = await readJson(`${fixtureRoot}/rollout-inventory.json`);
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const basics = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
function material(card) {
  if (/\bLand\b/.test(card.type_line)) {
    const types = basics.filter((t) => card.type_line.includes(t));
    return types.length === 2
      ? 'dual-' + types.map((t) => 'WUBRG'[basics.indexOf(t)]).join('')
      : types.length === 1
        ? 'WUBRG'[basics.indexOf(types[0])] + 'L'
        : 'L';
  }
  if (!Array.isArray(card.colors)) return 'unknown';
  return /\bArtifact\b/.test(card.type_line)
    ? 'A'
    : card.colors.length > 1
      ? 'M'
      : (card.colors[0] ?? 'C');
}
const candidateFamilies = (m) =>
  m === 'unknown'
    ? []
    : m.startsWith('dual-')
      ? ['abu-dual-overlay']
      : m.endsWith('L') && m !== 'L'
        ? ['abu', 'seventh']
        : m === 'M'
          ? ['fourth', 'seventh', 'legends']
          : m === 'C'
            ? ['seventh']
            : ['abu', 'fourth', 'seventh'];
const sets = [];
try {
  const { retroFamily, retroFrameAsset } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  for (const set of inventory.sets.filter(
    (s) => s.status === 'major' && s.groups.some((g) => g.wave === 'old'),
  )) {
    const source = await readJson(`${cacheRoot}/rollout/sets/${set.set}.json`),
      cards = [];
    for (const page of source.pages)
      cards.push(...JSON.parse((await readObject(page)).toString()).data);
    assert.equal(new Set(cards.map((c) => c.id)).size, cards.length);
    const old = cards.filter(
        (c) => frameWave(c) === 'old' && printingScope(c).status !== 'excluded',
      ),
      groups = new Map();
    for (const card of old) {
      const m = material(card),
        key = [card.frame, card.border_color, card.layout, m].join('/');
      if (!groups.has(key))
        groups.set(key, {
          key,
          material: m,
          frame: card.frame,
          border: card.border_color,
          layout: card.layout,
          printings: 0,
          referenceReady: 0,
          issues: {},
          currentAssets: {},
          candidates: candidateFamilies(m),
          selection: 'not-measured',
          cards: [],
        });
      const group = groups.get(key),
        scope = printingScope(card),
        issue =
          scope.status === 'review' ? scope.reason : (referenceIssue(card) ?? evaluatorIssue(card));
      group.printings++;
      const face = {
          name: card.name,
          setCode: card.set,
          typeLine: card.type_line,
          colors: card.colors,
          frameStyle: 'retro',
          borderColor: card.border_color,
        },
        asset = retroFrameAsset(face);
      group.currentAssets[asset] = (group.currentAssets[asset] ?? 0) + 1;
      if (issue) group.issues[issue] = (group.issues[issue] ?? 0) + 1;
      else {
        group.referenceReady++;
        group.cards.push({
          id: card.id,
          name: card.name,
          number: card.collector_number,
          referenceUrl: card.image_uris.png,
          currentFamily: retroFamily(face),
          currentAsset: asset,
        });
      }
    }
    for (const group of groups.values()) {
      // Different names across cohorts: art variants cannot leak the same card
      // into calibration and reserved samples.
      const byName = new Map();
      for (const card of group.cards.sort((a, b) => a.id.localeCompare(b.id)))
        if (!byName.has(card.name)) byName.set(card.name, card);
      const selected = [...byName.values()]
        .sort((a, b) =>
          hash('old-frame-family-v1:' + a.name).localeCompare(
            hash('old-frame-family-v1:' + b.name),
          ),
        )
        .slice(0, 6);
      const n = Math.min(3, Math.floor(selected.length / 2));
      group.samples = selected.map((c, i) => ({
        ...c,
        cohort: i < n ? 'calibration' : 'validation',
      }));
      delete group.cards;
      group.status = group.samples.length >= 4 ? 'ready-to-cache' : 'insufficient-reference-cohort';
    }
    sets.push({
      set: set.set,
      name: set.name,
      sourceIdentity: source.sourceIdentity,
      printings: old.length,
      groups: [...groups.values()],
    });
  }
} finally {
  await server.close();
}
const groups = sets.flatMap((s) => s.groups);
const plan = {
  schemaVersion: 1,
  inventoryHash: hash(JSON.stringify(inventory)),
  scope:
    'All old-frame groups in major sets (50 distinct ordinary English paper cards). Retain classification, reference and adapter failures. Candidate selection is per set/material/printed frame/border/layout, never per scan. This file freezes coverage and metadata-only cohorts; no family has been selected yet.',
  order: [
    'Freeze frame-source candidates and separate asset choice from printing typography',
    'Cache selected references; compare neutral-color geometry, bevel shape and texture structure',
    'Freeze shared scan registration independent of candidates; retain raw measurements',
    'Select on calibration, validate reserved names, inspect overlays and keep ambiguous choices for review',
    'Audit every printing for coverage and regressions before adopting mappings',
    'Freeze chosen assets and geometry, then refit per-color whole-frame HSB and mana',
  ],
  restrictions: [
    'No per-card family or HSB fitting',
    'No hue/saturation score may pick a structural winner',
    'No geometry pass may silently change text metrics',
    'Dual-land overlays are a separate structural candidate; Fourth has no colored basic-land assets',
    'Portal, special layouts, snow, foil and modern retro variants require explicit compatibility review',
  ],
  summary: {
    sets: sets.length,
    groups: groups.length,
    printings: sets.reduce((n, s) => n + s.printings, 0),
    samples: groups.reduce((n, g) => n + g.samples.length, 0),
    selectedFamilies: 0,
  },
  sets,
};
await writeJson(`${fixtureRoot}/old-frame-family-plan.json`, plan);
console.log(plan.summary);
