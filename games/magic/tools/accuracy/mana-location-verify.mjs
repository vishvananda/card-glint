import { PNG } from 'pngjs';
import { readJson, writeJson, cacheRoot, fixtureRoot, root, hash, sourceHash } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion, median } from './metrics.mjs';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
const proposal = await readJson(cacheRoot + '/rollout/mana-location.json'),
  snapshot = await readJson(cacheRoot + '/rollout/old-frame-families.json'),
  early = await readJson(cacheRoot + '/rollout/early-hsb.json');
const selected = new Set(proposal.groups.filter((g) => g.status === 'candidate').map((g) => g.key));
const cards = new Map();
for (const set of new Set([...selected].map((k) => k.split('/')[0])))
  for (const p of (await readJson(cacheRoot + '/rollout/sets/' + set + '.json')).pages)
    for (const c of JSON.parse((await readObject(p)).toString()).data) cards.set(c.id, c);
const rendererHash = await sourceHash(root + '/games/magic/src');
const session = await openBrowser({ entries: [], components: early.components });
await session.page.route('**/games/magic/src/presentation/retro-mana.ts*', async (route) => {
  const r = await route.fetch(),
    s = await r.text(),
    marker = 'export function retroManaPlacement(face) {';
  if (!s.includes(marker)) throw Error('Missing mana observer');
  await route.fulfill({
    response: r,
    body: s.replace(marker, marker + '\nif(globalThis.__manaBaseline) return undefined;'),
  });
});
const rows = [];
try {
  for (const row of proposal.rows) {
    if (!selected.has(row.set + '/' + row.border) || !row.normalization?.accepted) continue;
    const card = cards.get(row.id);
    if (card.nonfoil === false) continue;
    const e = snapshot.entries.find((e) => e.id === row.id);
    const face = {
      ...presentation({ card }).face,
      illustration: null,
      rulesText: '',
      rulesParagraphs: [],
      artist: null,
      power: null,
      toughness: null,
    };
    const components = await fetchComponents([{ face }], {}, (e) => e.face);
    session.addAssets(components);
    const left = Math.floor(438 - (row.symbols.length - 1) * 27 - 16),
      rect = [left, 27, 458 - left, 38];
    const captured = await session.page.evaluate(
      async ({ face, rect }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { loadCanvasImages, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal);
        const exports = [];
        try {
          for (const baseline of [true, false]) {
            globalThis.__manaBaseline = baseline;
            const c = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
            );
            const tile = document.createElement('canvas');
            tile.width = rect[2];
            tile.height = rect[3];
            tile.getContext('2d').drawImage(c, -rect[0], -rect[1], 488, 680);
            exports.push(tile.toDataURL());
            c.width = c.height = 0;
          }
          return exports;
        } finally {
          loaded.dispose();
        }
      },
      { face, rect },
    );
    const ref = cropGray(
      normalize(PNG.sync.read(await readObject(e.reference)), row.normalization.transform),
      rect,
    );
    const metrics = captured.map((url) => {
      const p = PNG.sync.read(Buffer.from(url.split(',')[1], 'base64'));
      const m = compareRegion(
        ref.gray,
        cropGray(p, [0, 0, p.width, p.height]).gray,
        p.width,
        p.height,
      );
      return { f1: m.edgeF1[1], distance: m.meanDistance, census: m.censusSimilarity };
    });
    rows.push({
      id: row.id,
      set: row.set,
      border: row.border,
      name: row.name,
      cohort: row.cohort,
      material: row.material,
      referenceHash: row.referenceHash,
      poseHash: hash(JSON.stringify(row.normalization)),
      before: metrics[0],
      after: metrics[1],
    });
    console.log(row.set, row.name, metrics.map((m) => m.f1.toFixed(3)).join(' -> '));
  }
  if ((await sourceHash(root + '/games/magic/src')) !== rendererHash)
    throw Error('Renderer changed during verification');
} finally {
  await session.close();
}
const groups = [...selected].map((key) => {
  const a = rows.filter((r) => r.set + '/' + r.border === key),
    v = a.filter((r) => r.cohort === 'validation'),
    before = median(v.map((r) => r.before.f1)),
    after = median(v.map((r) => r.after.f1)),
    regressions = v.filter((r) => r.after.f1 < r.before.f1 - 0.02),
    flags = [];
  if (v.length < 3) flags.push('sparse-validation');
  if (after - before < 0.02) flags.push('weak-reserved-gain');
  if (regressions.length) flags.push('reserved-regression');
  return {
    key,
    status: flags.length ? 'review' : 'validated',
    flags,
    total: a.length,
    reserved: v.length,
    before,
    after,
    regressions: regressions.map((r) => r.id),
  };
});
await writeJson(fixtureRoot + '/mana-location-verified.json', {
  schemaVersion: 1,
  proposalHash: hash(JSON.stringify(proposal)),
  rendererHash,
  groups,
  rows,
});
console.log(groups);
