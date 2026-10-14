import { PNG } from 'pngjs';
import { readJson, writeJson, cacheRoot, fixtureRoot, root, hash, sourceHash } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion, median } from './metrics.mjs';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
const snapshot = await readJson(cacheRoot + '/rollout/old-frame-families.json'),
  poses = await readJson(cacheRoot + '/rollout/old-dual-hsb-samples.json'),
  early = await readJson(cacheRoot + '/rollout/early-hsb.json');
const cards = new Map();
for (const set of ['usg', 'ulg', 'uds'])
  for (const p of (await readJson(cacheRoot + '/rollout/sets/' + set + '.json')).pages)
    for (const c of JSON.parse((await readObject(p)).toString()).data) cards.set(c.id, c);
const rendererHash = await sourceHash(root + '/games/magic/src');
const session = await openBrowser({ entries: [], components: early.components });
await session.page.route('**/games/magic/src/presentation/retro-urza-footer.ts*', async (route) => {
  const r = await route.fetch(),
    s = await r.text(),
    marker = 'export function paintUrzaFooter(c, face) {';
  if (!s.includes(marker)) throw Error('Missing footer observer');
  await route.fulfill({
    response: r,
    body: s.replace(marker, marker + '\nif(globalThis.__footerBaseline) return false;'),
  });
});
const statsOnly = process.argv.includes('--stats-only');
const onlyId = process.argv.find((arg) => arg.startsWith('--id='))?.slice(5);
const rows = [];
try {
  for (const e of snapshot.entries) {
    if (!cards.has(e.id) || (onlyId && e.id !== onlyId)) continue;
    const card = cards.get(e.id),
      pose = poses.rows.find((r) => r.id === e.id)?.normalization;
    if (!pose?.accepted || card.nonfoil === false) continue;
    if (statsOnly && card.power == null) continue;
    const face = {
      ...presentation({ card }).face,
      illustration: null,
      rulesText: '',
      rulesParagraphs: [],
    };
    session.addAssets(await fetchComponents([{ face }], {}, (e) => e.face));
    const captured = await session.page.evaluate(async (face) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { loadCanvasImages, canvasAssetUrls } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal),
        out = [];
      try {
        for (const baseline of [true, false]) {
          globalThis.__footerBaseline = baseline;
          const c = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            'inspect',
            new AbortController().signal,
            { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
          );
          out.push(c.toDataURL());
          c.width = c.height = 0;
        }
        return out;
      } finally {
        loaded.dispose();
      }
    }, face);
    const reference = normalize(PNG.sync.read(await readObject(e.reference)), pose.transform),
      renders = captured.map((url) =>
        normalize(PNG.sync.read(Buffer.from(url.split(',')[1], 'base64'))),
      );
    const metrics = {};
    for (const [part, rect] of Object.entries({
      artist: [80, 608, 315, 24],
      legal: [90, 632, 310, 14],
      ...(card.power != null ? { stats: [399, 607, 66, 30] } : {}),
    })) {
      const ref = cropGray(reference, rect);
      metrics[part] = renders.map((p) => {
        const m = compareRegion(ref.gray, cropGray(p, rect).gray, ref.width, ref.height);
        return { f1: m.edgeF1[1], distance: m.meanDistance };
      });
    }
    rows.push({
      id: e.id,
      set: e.set,
      name: e.name,
      cohort: e.cohort,
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(pose)),
      metrics,
    });
    console.log(e.set, e.name, metrics);
  }
  if ((await sourceHash(root + '/games/magic/src')) !== rendererHash)
    throw Error('Renderer changed during footer verification');
} finally {
  await session.close();
}
const groups = ['artist', 'legal', 'stats'].map((part) => {
  const partRows = rows.filter((r) => r.metrics[part] && r.cohort === 'validation');
  return {
    part,
    reserved: partRows.length,
    before: median(partRows.map((r) => r.metrics[part][0].f1)),
    after: median(partRows.map((r) => r.metrics[part][1].f1)),
    regressions: partRows
      .filter((r) => r.metrics[part][1].f1 < r.metrics[part][0].f1 - 0.02)
      .map((r) => r.id),
  };
});
await writeJson(
  fixtureRoot +
    (onlyId
      ? '/urza-footer-long-credit-verified.json'
      : statsOnly
        ? '/urza-stats-verified.json'
        : '/urza-footer-verified.json'),
  {
    schemaVersion: 1,
    rendererHash,
    groups,
    rows,
  },
);
console.log(groups);
