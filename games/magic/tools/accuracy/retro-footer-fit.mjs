import { PNG } from 'pngjs';
import {
  readJson,
  writeJson,
  cacheRoot,
  fixtureRoot,
  hash,
  atomicWrite,
  outputRoot,
} from './common.mjs';
import { readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion, median } from './metrics.mjs';
const snapshot = await readJson(cacheRoot + '/rollout/old-frame-families.json'),
  poses = await readJson(cacheRoot + '/rollout/old-dual-hsb-samples.json'),
  early = await readJson(cacheRoot + '/rollout/early-hsb.json');
const entries = snapshot.entries.filter((e) => ['usg', 'ulg', 'uds'].includes(e.set));
const cards = new Map();
for (const set of ['usg', 'ulg', 'uds'])
  for (const p of (await readJson(cacheRoot + '/rollout/sets/' + set + '.json')).pages)
    for (const c of JSON.parse((await readObject(p)).toString()).data) cards.set(c.id, c);
const session = await openBrowser({ entries, components: early.components });
const part = process.argv[2] ?? 'artist';
if (!['artist', 'stats'].includes(part)) throw Error('Expected artist or stats');
const candidates = [];
for (const size of part === 'artist' ? [18, 19, 20, 21, 22] : [27.8, 29, 30, 31])
  for (const y of part === 'artist' ? [624, 625, 626, 627] : [623.62, 625.62, 627.62])
    for (const shadow of [1, 1.5, 2])
      candidates.push({ size, y, shadow, x: part === 'artist' ? 244 : 430.18 });
const rows = [];
try {
  for (const e of entries) {
    const p = poses.rows.find((r) => r.id === e.id),
      card = cards.get(e.id);
    if (
      !p?.normalization.accepted ||
      !card.artist ||
      (part === 'stats' && (card.power == null || card.toughness == null))
    )
      continue;
    const reference = normalize(
      PNG.sync.read(await readObject(e.reference)),
      p.normalization.transform,
    );
    const rect = part === 'artist' ? [80, 610, 320, 21] : [393, 609, 72, 36];
    const ref = cropGray(reference, rect);
    // Ignore texture contrast by comparing high-contrast glyph edges on a smooth
    // background. Shapes are only proposed here; production full-card validation follows.
    const exports = await session.page.evaluate(
      async ({ text, candidates, rect, part }) => {
        await document.fonts.load('22px "CardRenderer MTG MPlantin"');
        const output = [];
        const c = document.createElement('canvas');
        c.width = rect[2];
        c.height = rect[3];
        const ctx = c.getContext('2d');
        for (const p of candidates) {
          ctx.shadowColor = 'transparent';
          ctx.fillStyle = '#a69b7b';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.font = `${p.size}px "CardRenderer MTG MPlantin"`;
          ctx.textAlign = 'center';
          ctx.textBaseline = part === 'artist' ? 'alphabetic' : 'middle';
          ctx.shadowColor = '#000';
          ctx.shadowOffsetX = ctx.shadowOffsetY = p.shadow;
          ctx.fillStyle = '#f2eee3';
          ctx.fillText(text, p.x - rect[0], p.y - rect[1], part === 'artist' ? 320 : 130);
          output.push(c.toDataURL());
        }
        return output;
      },
      {
        text: part === 'artist' ? 'Illus. ' + card.artist : card.power + '/' + card.toughness,
        candidates,
        rect,
        part,
      },
    );
    const scores = exports.map((data) => {
      const p = PNG.sync.read(Buffer.from(data.split(',')[1], 'base64'));
      const metric = compareRegion(
        ref.gray,
        cropGray(p, [0, 0, p.width, p.height]).gray,
        p.width,
        p.height,
      );
      return metric.edgeF1[1];
    });
    rows.push({
      id: e.id,
      name: e.name,
      set: e.set,
      cohort: e.cohort,
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(p.normalization)),
      scores,
    });
    console.log(
      e.set,
      e.name,
      Math.max(...scores),
      candidates[scores.indexOf(Math.max(...scores))],
    );
  }
} finally {
  await session.close();
}
const cal = rows.filter((r) => r.cohort === 'calibration');
const sorted = candidates
  .map((p, i) => ({ candidate: p, index: i, score: median(cal.map((r) => r.scores[i])) }))
  .sort((a, b) => b.score - a.score);
await writeJson(fixtureRoot + '/urza-' + part + '-candidate.json', {
  schemaVersion: 1,
  method: 'Canvas font raster proposals, frame-normalized scan, independent reserved names',
  candidates,
  rank: sorted.slice(0, 8),
  rows,
});
console.log(sorted.slice(0, 8));
