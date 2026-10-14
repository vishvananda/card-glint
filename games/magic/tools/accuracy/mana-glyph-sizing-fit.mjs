import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, outputRoot } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph, GLYPH_SIZE } from './mana-glyph-metrics.mjs';
import { median } from './metrics.mjs';
const dir = outputRoot + '/mana-glyph-sizing',
  study = await readJson(outputRoot + '/mana-glyph-study/results.json'),
  sizing = await readJson(dir + '/results.json');
const cases = new Map(study.groups.flatMap((g) => g.rows.map((r) => [r.id, r]))),
  groups = new Map();
const thresholds = [0.38, 0.48, 0.58];
function resized(ink, scale) {
  const n = GLYPH_SIZE,
    out = new Uint8Array(n * n);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const sx = Math.round((x - n / 2) / scale + n / 2),
        sy = Math.round((y - n / 2) / scale + n / 2);
      if (sx >= 0 && sx < n && sy >= 0 && sy < n) out[y * n + x] = ink[sy * n + sx];
    }
  return out;
}
for (const g of sizing.groups) {
  const candidates = {};
  for (const r of g.ranking) {
    const im = PNG.sync.read(
      await readFile(
        r.family === 'historic-font'
          ? dir + '/white-font-' + g.ratio.toFixed(4) + '.png'
          : outputRoot + '/mana-glyph-study/' + g.symbol + '-' + r.family + '.png',
      ),
    );
    const circle = { x: (im.width - 1) / 2, y: (im.height - 1) / 2, radius: im.width / 2 };
    candidates[r.family] = thresholds.map(
      (thresholdFraction) =>
        manaGlyphMask(im, circle, false, { normalizeBounds: false, thresholdFraction }).ink,
    );
  }
  for (const row of g.rows.filter((r) => r.valid)) {
    const source = cases.get(row.id),
      raw = PNG.sync.read(await readObject(source.reference)),
      im = normalize(source.doubleNormalize ? normalize(raw) : raw, source.transform),
      masks = thresholds.map(
        (thresholdFraction) =>
          manaGlyphMask(im, row.circle, false, { normalizeBounds: false, thresholdFraction }).ink,
      );
    for (const r of g.ranking) {
      const key = g.symbol + '/' + r.family,
        rows = groups.get(key) ?? [];
      const scores = [];
      for (let i = 0; i <= 15; i++) {
        const scale = 0.8 + i * 0.02;
        scores.push({
          scale,
          score: median(
            masks.map(
              (mask, t) => compareManaGlyph(mask, resized(candidates[r.family][t], scale)).score,
            ),
          ),
        });
      }
      rows.push({
        id: row.id,
        set: g.set,
        referenceHash: row.referenceHash,
        cohort: row.cohort,
        scores,
      });
      groups.set(key, rows);
    }
  }
}
const results = [];
for (const [key, rows] of groups) {
  const cal = rows.filter((r) => r.cohort === 'calibration'),
    held = rows.filter((r) => r.cohort === 'validation'),
    ranking = rows[0].scores
      .map((s, i) => ({
        scale: s.scale,
        calibration: median(cal.map((r) => r.scores[i].score)),
        validation: median(held.map((r) => r.scores[i].score)),
      }))
      .sort((a, b) => b.calibration - a.calibration),
    base = ranking.find((r) => Math.abs(r.scale - 1) < 1e-6),
    best = ranking[0];
  const maxRegression = Math.max(
    ...held.map(
      (r) =>
        r.scores.find((s) => s.scale === base.scale).score -
        r.scores.find((s) => s.scale === best.scale).score,
    ),
  );
  const accepted =
    cal.length >= 3 &&
    held.length >= 3 &&
    best.validation >= base.validation + 0.01 &&
    maxRegression <= 0.06 &&
    best.scale > 0.8 &&
    best.scale < 1.1;
  const result = {
    key,
    calibrationCount: cal.length,
    validationCount: held.length,
    base,
    best,
    maxRegression,
    accepted,
    ranking,
    rows,
  };
  results.push(result);
  console.log(JSON.stringify({ ...result, ranking: undefined, rows: undefined }));
}
await writeJson(dir + '/fit.json', {
  version: 1,
  policy:
    'Fixed circle, scale only the ink mask about the circle center; choose on calibration cohort, require held-out median improvement >= .01 and worst-card regression <= .06. Minimum three cards per cohort; endpoint optima rejected. White candidates compared after independent scale fitting. No per-card renderer settings.',
  groups: results,
});
