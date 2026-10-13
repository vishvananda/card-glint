import { createServer } from 'vite';
import { readObject } from './cache.mjs';
import { cacheRoot, fixtureRoot, hash, readJson, writeJson, root } from './common.mjs';
import { printingScope, referenceIssue } from './rollout-policy.mjs';
import { presentation } from './adapter.mjs';

// Freeze names before looking at scores. Four different names per rarity,
// alternating fit/validation, with color diversity before hash order.
const inventory = await readJson(`${fixtureRoot}/rollout-inventory.json`);
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const rows = [];
try {
  const { retroSetSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { faceSetSymbol } = await server.ssrLoadModule('/games/magic/src/presentation/assets.ts');
  for (const set of inventory.sets.filter((s) => s.status === 'major')) {
    const snapshot = await readJson(`${cacheRoot}/rollout/sets/${set.set}.json`);
    const cards = (
      await Promise.all(
        snapshot.pages.map(async (p) => JSON.parse((await readObject(p)).toString()).data),
      )
    ).flat();
    const groups = new Map(),
      issues = {};
    for (const card of cards) {
      const scope = printingScope(card);
      if (scope.status === 'excluded') continue;
      const reason =
        scope.status === 'review'
          ? scope.reason
          : (referenceIssue(card) ??
            (card.layout !== 'normal'
              ? `layout:${card.layout}`
              : /\b(Saga|Class|Battle|Planeswalker|Vehicle)\b/.test(card.type_line)
                ? 'dedicated-frame'
                : /^(Level up|Bestow|Mutate)\b/m.test(card.oracle_text ?? '')
                  ? 'dedicated-frame'
                  : !['1993', '1997', '2003', '2015'].includes(card.frame)
                    ? `frame:${card.frame}`
                    : card.frame_effects?.some((e) => !['legendary'].includes(e))
                      ? 'frame-effects'
                      : card.frame === '2015' && /Legendary/.test(card.type_line)
                        ? 'legendary-crown'
                        : null));
      if (reason) {
        issues[reason] = (issues[reason] ?? 0) + 1;
        continue;
      }
      const families = ['1993', '1997'].includes(card.frame)
        ? ['retro']
        : card.frame === '2003'
          ? ['eighth']
          : ['component', 'm15-accurate'];
      for (const family of families) {
        const key = `${family}/${card.border_color}`;
        if (!groups.has(key))
          groups.set(key, { key, family, border: card.border_color, cards: [] });
        groups.get(key).cards.push(card);
      }
    }
    for (const group of groups.values()) {
      const samples = [],
        seen = new Set();
      for (const rarity of [...new Set(group.cards.map((c) => c.rarity))].sort()) {
        const candidates = group.cards
          .filter((c) => c.rarity === rarity)
          .sort((a, b) =>
            hash('major-calibration-v1:' + a.name).localeCompare(
              hash('major-calibration-v1:' + b.name),
            ),
          );
        const material = (c) =>
          /Artifact/.test(c.type_line)
            ? 'A'
            : /Land/.test(c.type_line)
              ? 'L'
              : c.colors?.join('') || 'C';
        const ordered = [],
          materials = new Set();
        for (const card of candidates)
          if (!materials.has(material(card))) {
            ordered.push(card);
            materials.add(material(card));
          }
        ordered.push(...candidates.filter((c) => !ordered.includes(c)));
        for (const card of ordered) {
          if (seen.has(card.name)) continue;
          const same = samples.filter((s) => s.card.rarity === rarity).length;
          if (same >= 4) break;
          seen.add(card.name);
          const face = presentation({ card }).face;
          if (!['retro', 'component'].includes(group.family)) face.frameAssetFamily = group.family;
          const symbol = group.family === 'retro' ? retroSetSymbol(face) : faceSetSymbol(face);
          samples.push({
            card,
            face,
            symbol,
            cohort: same % 2 ? 'validation' : 'calibration',
            material: material(card),
          });
        }
      }
      rows.push({
        set: set.set,
        name: set.name,
        sourceIdentity: snapshot.sourceIdentity,
        key: `${set.set}/${group.key}`,
        family: group.family,
        border: group.border,
        eligiblePrintings: group.cards.length,
        issues,
        samples,
      });
    }
    if (!groups.size)
      rows.push({
        set: set.set,
        name: set.name,
        sourceIdentity: snapshot.sourceIdentity,
        key: set.set,
        eligiblePrintings: 0,
        issues,
        samples: [],
      });
  }
} finally {
  await server.close();
}
rows.sort(
  (a, b) =>
    Number(a.family !== 'retro') - Number(b.family !== 'retro') || a.key.localeCompare(b.key),
);
const report = {
  schemaVersion: 1,
  inventoryHash: hash(JSON.stringify(inventory)),
  policy: 'major-calibration-v1',
  scope:
    'All 272 major sets audited; ordinary supported base frames sampled, old first. Reserved distinct names; frame-only per-scan normalization. Special layouts/effects/crowns and missing references remain explicit. No per-card rendering adjustments.',
  summary: {
    sets: new Set(rows.map((r) => r.set)).size,
    groups: rows.length,
    samples: rows.reduce((n, r) => n + r.samples.length, 0),
    families: Object.fromEntries(
      [...new Set(rows.map((r) => r.family))].map((f) => [
        f,
        rows.filter((r) => r.family === f).length,
      ]),
    ),
  },
  rows,
};
await writeJson(`${cacheRoot}/rollout/major-calibration-plan.json`, report);
console.log(report.summary);
