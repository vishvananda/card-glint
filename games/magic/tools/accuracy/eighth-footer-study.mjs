import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { cachedFetch, readObject } from './cache.mjs';
import { cacheRoot, readJson, writeJson, hash } from './common.mjs';
import { median } from './metrics.mjs';
import { prepareLetteringEdges, scoreLetteringEdges } from './lettering-metrics.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { openBrowser } from './browser.mjs';

const directory = cacheRoot + '/rollout/major-calibration-frame-footer-v0214';
const groups = [
  '8ed-eighth-white',
  '9ed-eighth-white',
  '10e-eighth-black',
  'm10-eighth-black',
  'm14-eighth-black',
  'mrd-eighth-black',
];
const part = process.argv[2] ?? 'artist';
if (!['artist', 'stats'].includes(part)) throw Error('Expected artist or stats');
const all = [];
for (const key of groups) {
  const capture = await readJson(`${directory}/${key}.json`);
  const measure = await readJson(`${directory}/${key}-measure.json`);
  for (const s of capture.samples) {
    const m = measure.rows.find((r) => r.id === s.id);
    if (m?.fit.accepted) all.push({ ...s, set: capture.set, fit: m.fit, fitHash: m.fitHash });
  }
}
// A name observed during fitting cannot later count as independent validation
// merely because another printing was assigned to a different set cohort.
const development = new Set(all.filter((r) => r.cohort === 'calibration').map((r) => r.name));
const manifest = await readJson(new URL('../../assets.json', import.meta.url));
const font = await cachedFetch(manifest.CONJURER_ROOT + '/data/fonts/matrix-bsc.ttf');
const css = await readFile(new URL('../../fonts.css', import.meta.url), 'utf8');
const fonts = await Promise.all(
  [...css.matchAll(/url\('([^']+)'\)/g)].map((m) => cachedFetch(m[1])),
);
const session = await openBrowser({ entries: [], components: [...fonts, font] });
const rect = part === 'artist' ? [71, 617, 276, 23] : [379, 605, 65, 34];
const refine = process.argv.includes('--refine');
const candidates = [];
for (const family of part === 'artist' ? ['CardRenderer MTG Matrix'] : ['Study Matrix SC'])
  for (const size of part === 'artist'
    ? [16, 16.5, 17, 17.5, 18, 18.5, 19]
    : refine
      ? [28.5, 29, 29.5]
      : [28, 29, 30, 31])
    for (const x of part === 'artist'
      ? [73, 75, 77, 79]
      : refine
        ? [406.5, 407, 407.5, 408, 408.5]
        : [405, 407, 409])
      for (const y of part === 'artist'
        ? [632, 633, 634, 635, 636]
        : refine
          ? [626, 626.5, 627, 627.5, 628]
          : [626, 627, 628, 629, 630, 631, 632])
        candidates.push({ family, size, x, y });
const rows = [],
  excluded = [];
try {
  await session.page.evaluate(async (url) => {
    const font = new FontFace('Study Matrix SC', `url("${url}")`, { weight: '700' });
    document.fonts.add(await font.load());
    await document.fonts.load('700 17px "CardRenderer MTG Matrix"');
  }, font.url);
  for (const row of all) {
    const text =
      part === 'artist'
        ? row.face.artist
        : row.face.power != null
          ? row.face.power + '/' + row.face.toughness
          : null;
    if (!text) continue;
    if (part === 'stats' && text.includes('*')) {
      excluded.push({
        id: row.id,
        name: row.name,
        reason: 'Variable stats use a separate star painter, not the font character.',
      });
      continue;
    }
    if (part === 'artist' && /Hildebrandt/.test(text)) {
      excluded.push({
        id: row.id,
        name: row.name,
        reason:
          'Printed artist wording differs from source metadata; no layout fitting against mismatched names.',
      });
      continue;
    }
    const ref = cropGray(
      normalize(PNG.sync.read(await readObject(row.reference)), row.fit.transform),
      rect,
    );
    const exports = await session.page.evaluate(
      ({ candidates, rect, text, part }) => {
        const canvas = document.createElement('canvas');
        canvas.width = rect[2] * 1.5;
        canvas.height = rect[3] * 1.5;
        const c = canvas.getContext('2d');
        c.scale(1.5, 1.5);
        const small = document.createElement('canvas');
        small.width = rect[2];
        small.height = rect[3];
        const s = small.getContext('2d');
        return candidates.map((p) => {
          c.fillStyle = '#ddd';
          c.fillRect(0, 0, rect[2], rect[3]);
          c.fillStyle = '#111';
          c.font = `700 ${p.size}px "${p.family}"`;
          c.textAlign = part === 'artist' ? 'left' : 'center';
          c.textBaseline = part === 'artist' ? 'alphabetic' : 'middle';
          c.fillText(text, p.x - rect[0], p.y - rect[1]);
          s.drawImage(canvas, 0, 0, small.width, small.height);
          return small.toDataURL();
        });
      },
      { candidates, rect, text, part },
    );
    // White ink is inverted before shape comparison. Polarity selection is fixed
    // from the printed material, never chosen by the candidate score.
    if (part === 'artist' && ['B', 'L', 'C'].includes(row.material))
      ref.gray = Float32Array.from(ref.gray, (v) => 255 - v);
    const prepared = prepareLetteringEdges(ref.gray, ref.width, ref.height);
    const scores = exports.map((data) => {
      const p = PNG.sync.read(Buffer.from(data.split(',')[1], 'base64'));
      return scoreLetteringEdges(prepared, cropGray(p, [0, 0, p.width, p.height]).gray);
    });
    rows.push({
      id: row.id,
      name: row.name,
      set: row.set,
      cohort: development.has(row.name) ? 'calibration' : 'validation',
      referenceHash: row.reference.sha256,
      fitHash: row.fitHash,
      scores,
    });
    console.log(
      part,
      row.set,
      row.name,
      Math.max(...scores).toFixed(3),
      candidates[scores.indexOf(Math.max(...scores))],
    );
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
} finally {
  await session.close();
}
const rank = candidates
  .map((candidate, index) => ({
    candidate,
    index,
    trainingMean:
      rows.filter((r) => r.cohort === 'calibration').reduce((n, r) => n + r.scores[index], 0) /
      rows.filter((r) => r.cohort === 'calibration').length,
    training: median(rows.filter((r) => r.cohort === 'calibration').map((r) => r.scores[index])),
    validation: median(rows.filter((r) => r.cohort === 'validation').map((r) => r.scores[index])),
  }))
  .sort((a, b) => b.training - a.training);
await writeJson(`${directory}/${part}${refine ? '-refined' : ''}-study.json`, {
  schemaVersion: 1,
  part,
  rect,
  candidates,
  rank: rank.slice(0, 12),
  rows,
  excluded,
  font,
  fonts: fonts.map((a) => ({ url: a.url, sha256: a.sha256 })),
  refine,
  methodHash: hash(await readFile(new URL('./eighth-footer-study.mjs', import.meta.url))),
});
console.log(JSON.stringify(rank.slice(0, 6), null, 2));
