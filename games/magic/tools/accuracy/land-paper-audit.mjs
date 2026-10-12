import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, readJson, writeJson, objectFile, hash } from './common.mjs';
import { normalize } from './pixels.mjs';
import { median } from './metrics.mjs';

// Interior medians tolerate small scan registration differences and sparse text.
// This is an RGB material diagnostic, deliberately separate from alignment scores.
const patches = { left: [55, 448, 80, 145], right: [355, 448, 80, 145] };
const sample = (image) =>
  Object.fromEntries(
    Object.entries(patches).map(([name, [x, y, w, h]]) => {
      const channels = [[], [], []];
      for (let py = y; py < y + h; py++)
        for (let px = x; px < x + w; px++) {
          const i = (py * image.width + px) * 4;
          channels.forEach((channel, c) => channel.push(image.data[i + c]));
        }
      return [name, channels.map(median)];
    }),
  );
const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
const colorError = (a, b) => (distance(a.left, b.left) + distance(a.right, b.right)) / 2;
const base = `${outputRoot}/land-paper`,
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/after/capture.json`);
assert.equal(before.planHash, after.planHash);
const decode = async (path, expected) => {
  const bytes = await readFile(path);
  assert.equal(hash(bytes), expected);
  return PNG.sync.read(bytes, { checkCRC: true });
};
const rows = [];
for (const a of after.rows) {
  const b = before.rows.find((r) => r.id === a.id);
  assert.deepEqual(a.face, b.face);
  assert.deepEqual(a.layout, b.layout, 'Paper correction must not move/reflow text');
  const reference = sample(
      normalize(await decode(objectFile({ sha256: a.referenceHash }), a.referenceHash)),
    ),
    tiers = {};
  for (const tier of ['inspect', 'table']) {
    const oldImage = await decode(`${base}/before/${b.images[tier].file}`, b.images[tier].sha256),
      newImage = await decode(`${base}/after/${a.images[tier].file}`, a.images[tier].sha256);
    let changed = 0,
      outsidePaper = 0;
    const inset = ['m15', 'm19', 'm20', 'war'].includes(a.set) ? 1.5 : 0;
    for (let y = 0; y < oldImage.height; y++)
      for (let x = 0; x < oldImage.width; x++) {
        const i = (y * oldImage.width + x) * 4;
        if (oldImage.data.subarray(i, i + 4).equals(newImage.data.subarray(i, i + 4))) continue;
        changed++;
        // Raster pixels intersecting the interior clip; no permission to touch rails.
        const left = (x * 488) / oldImage.width,
          top = (y * 680) / oldImage.height;
        const right = ((x + 1) * 488) / oldImage.width,
          bottom = ((y + 1) * 680) / oldImage.height;
        if (right <= 34 + inset || left >= 454 - inset || bottom <= 425 || top >= 628.5)
          outsidePaper++;
      }
    assert.equal(outsidePaper, 0, `${a.name}: changed outside paper`);
    if (a.cohort === 'control') assert.equal(changed, 0, `${a.name}: changed control`);
    const old = sample(normalize(oldImage)),
      current = sample(normalize(newImage));
    tiers[tier] = {
      before: old,
      after: current,
      beforeError: colorError(old, reference),
      afterError: colorError(current, reference),
      referenceSideContrast: distance(reference.left, reference.right),
      beforeSideContrast: distance(old.left, old.right),
      afterSideContrast: distance(current.left, current.right),
      changedPixels: changed,
      outsidePaper,
    };
    if (a.cohort !== 'control')
      assert.ok(
        tiers[tier].afterError < tiers[tier].beforeError,
        `${a.name}: material error regressed`,
      );
  }
  rows.push({
    id: a.id,
    set: a.set,
    name: a.name,
    cohort: a.cohort,
    referenceHash: a.referenceHash,
    reference,
    tiers,
  });
}
const summary = Object.fromEntries(
  ['calibration', 'held-out', 'control'].map((cohort) => {
    const selected = rows.filter((r) => r.cohort === cohort),
      mean = (key) => selected.reduce((sum, r) => sum + r.tiers.inspect[key], 0) / selected.length;
    return [
      cohort,
      {
        cards: selected.length,
        beforeMeanRgbError: mean('beforeError'),
        afterMeanRgbError: mean('afterError'),
        improved: selected.filter((r) => r.tiers.inspect.afterError < r.tiers.inspect.beforeError)
          .length,
        outsidePaper: selected.reduce(
          (s, r) => s + r.tiers.inspect.outsidePaper + r.tiers.table.outsidePaper,
          0,
        ),
      },
    ];
  }),
);
await writeJson(`${fixtureRoot}/land-paper-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Cached PNG-only material audit. Mean Euclidean sRGB distance (0–255 channels) of broad median patches, not perceptual Delta E or a total card-accuracy score. Six reported printings informed two shared palette corrections; two different M19 lands held out. Raw scans, no color calibration or per-scan fitting. Typography unchanged; source wording unverified. Same-palette nonlands and other land palettes are pixel-identical controls. No browser needed for comparison.',
  baselineRendererHash: before.rendererHash,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  patches,
  summary,
  rows,
});
console.log(summary);
