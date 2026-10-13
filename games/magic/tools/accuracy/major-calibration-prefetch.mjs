import { cacheRoot, readJson, mapLimit } from './common.mjs';
import { cachedFetch } from './cache.mjs';

// Optional I/O-only warmup. Keep bounded image-host traffic separate from the
// single-page capture loop; metadata API throttling still belongs to cache.mjs.
const plan = await readJson(`${cacheRoot}/rollout/major-calibration-plan.json`);
const cards = [
  ...new Map(plan.rows.flatMap((r) => r.samples).map((s) => [s.card.id, s.card])).values(),
];
let count = 0,
  failures = 0;
await mapLimit(cards, 3, async (card) => {
  const results = await Promise.allSettled([
    cachedFetch(card.image_uris.png),
    cachedFetch(card.image_uris.art_crop),
  ]);
  failures += results.filter((r) => r.status === 'rejected').length;
  if (++count % 100 === 0)
    console.log(count, '/', cards.length, 'references warmed; failed URLs', failures);
});
console.log('Finished', count, 'references; failed URLs', failures);
