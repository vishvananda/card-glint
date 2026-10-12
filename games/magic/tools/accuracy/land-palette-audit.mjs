import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, readJson, writeJson, objectFile, hash } from './common.mjs';
import { normalize } from './pixels.mjs';
import { median } from './metrics.mjs';

// Broad paper patches tolerate small registration changes and sparse text.
// The narrower rail patch is only a diagnostic; confirm it visually as well.
const patches = { left: [55, 448, 80, 145], right: [355, 448, 80, 145], rail: [31, 100, 4, 255] };
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
const paperError = (a, b) => (distance(a.left, b.left) + distance(a.right, b.right)) / 2;
const base = `${outputRoot}/land-palette`,
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
  assert.deepEqual(a.layout, b.layout, 'Material change must not reflow text');
  const neutral =
    /Land/.test(a.face.typeLine) && !(a.face.frameColors?.length || a.face.colors?.length);
  const reference = sample(
      normalize(await decode(objectFile({ sha256: a.referenceHash }), a.referenceHash)),
    ),
    tiers = {};
  for (const tier of ['inspect', 'table']) {
    const oldImage = await decode(`${base}/before/${b.images[tier].file}`, b.images[tier].sha256),
      newImage = await decode(`${base}/after/${a.images[tier].file}`, a.images[tier].sha256);
    let changed = 0,
      outsideMaterial = 0;
    const inset = ['m15', 'm19', 'm20', 'war'].includes(a.set) ? 1.5 : 0;
    for (let y = 0; y < oldImage.height; y++)
      for (let x = 0; x < oldImage.width; x++) {
        const i = (y * oldImage.width + x) * 4;
        if (oldImage.data.subarray(i, i + 4).equals(newImage.data.subarray(i, i + 4))) continue;
        changed++;
        const left = (x * 488) / oldImage.width,
          top = (y * 680) / oldImage.height,
          right = ((x + 1) * 488) / oldImage.width,
          bottom = ((y + 1) * 680) / oldImage.height;
        const paper = right > 34 + inset && left < 454 - inset && bottom > 425 && top < 628.5;
        // Neutral correction may change the existing frame's rails and shadows;
        // allow their envelope but protect the art interior and entire footer.
        const frame = right > 20 && left < 469 && bottom > 21 && top < 635;
        const art = left >= 38 && right <= 450 && top >= 77 && bottom <= 375;
        if (!(paper || (neutral && frame && !art))) outsideMaterial++;
      }
    assert.equal(outsideMaterial, 0, `${a.name}: changed outside material envelope`);
    if (a.cohort === 'control') assert.equal(changed, 0, `${a.name}: changed control`);
    const old = sample(normalize(oldImage)),
      current = sample(normalize(newImage));
    tiers[tier] = {
      before: old,
      after: current,
      beforeError: paperError(old, reference),
      afterError: paperError(current, reference),
      beforeRailError: distance(old.rail, reference.rail),
      afterRailError: distance(current.rail, reference.rail),
      changedPixels: changed,
      outsideMaterial,
    };
    if (a.cohort !== 'control')
      assert.ok(
        tiers[tier].afterError < tiers[tier].beforeError,
        `${a.name}: paper material error regressed`,
      );
  }
  rows.push({
    id: a.id,
    set: a.set,
    name: a.name,
    cohort: a.cohort,
    neutral,
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
        outsideMaterial: selected.reduce(
          (sum, r) => sum + r.tiers.inspect.outsideMaterial + r.tiers.table.outsideMaterial,
          0,
        ),
      },
    ];
  }),
);
await writeJson(`${fixtureRoot}/land-palette-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Cached PNG-only material audit. Mean Euclidean sRGB distance of broad median paper patches, not perceptual Delta E or total card accuracy. Eleven calibration cards, eleven reserved lands, ten unchanged controls. Shared color/palette values; no per-card or per-scan fit. Neutral-land rail sample is a narrow raw-scan diagnostic subject to registration; visually reviewed separately. Both render tiers checked. Typography unchanged; wording unverified.',
  baselineRendererHash: before.rendererHash,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  patches,
  summary,
  rows,
});
console.log(summary);
console.log(
  rows
    .filter((r) => r.neutral)
    .map((r) => ({
      name: r.name,
      set: r.set,
      before: r.tiers.inspect.beforeRailError,
      after: r.tiers.inspect.afterRailError,
    })),
);
