import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, readJson, writeJson, objectFile, hash } from './common.mjs';
import { normalize } from './pixels.mjs';
import { stockBounds } from './frame-family-metrics.mjs';
import { fittedSymbolBounds } from './symbol-bounds.mjs';
import { median, quantile } from './metrics.mjs';

// Reference-only diagnosis: determine whether a material's symbol shift also
// occurs in its outer frame. This does not fit, change or admit any transform.
const [set] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]{2,6}$/);
const profile = await readJson(`${fixtureRoot}/old-frame-registration-${set}.json`),
  bounds = await readJson(`${fixtureRoot}/${set}-symbol-bounds-after.json`),
  registered = await readJson(`${fixtureRoot}/${set}-symbol-after-registered.json`);
assert.ok(profile.accepted && profile.transform && profile.anchor === 'outer-stock');
assert.equal(registered.profileHash, hash(JSON.stringify(profile)));
assert.equal(registered.boundsHash, hash(JSON.stringify(bounds)));
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'symbol-material-diagnostic.mjs',
        'frame-family-metrics.mjs',
        'pixels-pure.mjs',
        'symbol-bounds.mjs',
        'metrics.mjs',
      ].map((file) => readFile(new URL(file, import.meta.url))),
    ),
  ),
);
const sides = ['left', 'right', 'top', 'bottom'],
  { scale, tx, ty } = profile.transform,
  point = (value, horizontal) => {
    const center = horizontal ? 244 : 340;
    return center + scale * (value - center) + (horizontal ? tx : ty);
  },
  rows = [];
for (const row of bounds.rows) {
  const prior = registered.rows.find((r) => r.id === row.id);
  assert.ok(prior);
  assert.equal(prior.referenceHash, row.referenceHash);
  const material = prior.material,
    admitted = ['measured', 'partial-reference-region'].includes(prior.status),
    result = {
      id: row.id,
      name: row.name,
      cohort: row.cohort,
      material,
      frameAdmitted: admitted,
      referenceHash: row.referenceHash,
      issue: row.failure,
      symbol: null,
      stock: null,
      aligned: null,
    };
  if (admitted) assert.ok(profile.scope.materials.includes(material));
  if (!row.failure) {
    const bytes = await readFile(objectFile({ sha256: row.referenceHash }));
    assert.equal(hash(bytes), row.referenceHash);
    const stock = stockBounds(normalize(PNG.sync.read(bytes, { checkCRC: true })), profile.border),
      symbol = row.reference?.stable ? fittedSymbolBounds(row.reference.rect, {}) : null;
    result.stock = stock;
    result.symbol = symbol;
    if (admitted) {
      const target = profile.targets[material],
        projected = symbol ? fittedSymbolBounds(row.reference.rect, profile.transform) : null,
        stockSides = Object.fromEntries(
          sides.map((side) => [
            side,
            stock.sides[side].reliable
              ? point(stock.sides[side].position, side === 'left' || side === 'right')
              : null,
          ]),
        );
      result.aligned = {
        symbol: projected,
        stockSides,
        stockResiduals: Object.fromEntries(
          sides.map((side) => [
            side,
            stockSides[side] !== null && target.sides[side].reliable
              ? stockSides[side] - target.sides[side].position
              : null,
          ]),
        ),
        // Same-scan distances cancel translation. The only scale here is the
        // already frozen set transform, never a scale estimated for this card.
        rightGap:
          projected && stockSides.right !== null ? stockSides.right - projected.centerX : null,
        topGap: projected && stockSides.top !== null ? projected.centerY - stockSides.top : null,
      };
    }
  }
  rows.push(result);
}

function distribution(values) {
  const good = values.filter(Number.isFinite),
    center = median(good);
  return {
    count: good.length,
    median: center,
    mad: center === null ? null : median(good.map((v) => Math.abs(v - center))),
    p10: quantile(good, 0.1),
    p90: quantile(good, 0.9),
  };
}
function summarize(cohort) {
  return Object.fromEntries(
    [...new Set(rows.map((r) => r.material))].sort().map((material) => {
      const group = cohort.filter((r) => r.material === material),
        aligned = group.filter((r) => r.aligned);
      return [
        material,
        {
          cards: group.length,
          admitted: aligned.length,
          stableSymbols: group.filter((r) => r.symbol).length,
          fullyReliableStock: group.filter((r) => r.stock?.reliable).length,
          symbol: Object.fromEntries(
            ['centerX', 'centerY', 'width', 'height'].map((key) => [
              key,
              distribution(aligned.map((r) => r.aligned.symbol?.[key])),
            ]),
          ),
          stockResiduals: Object.fromEntries(
            sides.map((side) => [
              side,
              distribution(aligned.map((r) => r.aligned.stockResiduals[side])),
            ]),
          ),
          rightGap: distribution(aligned.map((r) => r.aligned.rightGap)),
          topGap: distribution(aligned.map((r) => r.aligned.topGap)),
        },
      ];
    }),
  );
}
const result = {
  schemaVersion: 1,
  scope:
    'Reference-only material diagnostic against the independently frozen set frame transform. No per-card fit, renderer change, material admission or claim of fresh holdout evidence. All full-set results were previously inspected. Missing/unstable symbol segmentation and frame sides stay null. Same-scan symbol-to-stock distances distinguish residual scan translation from printed placement; they do not certify internal frame apertures or source contours.',
  profileHash: hash(JSON.stringify(profile)),
  boundsHash: hash(JSON.stringify(bounds)),
  registeredMeasurementHash: hash(JSON.stringify(registered)),
  methodHash,
  transform: profile.transform,
  summary: {
    all: summarize(rows),
    calibration: summarize(rows.filter((r) => r.cohort === 'calibration')),
    reserved: summarize(rows.filter((r) => r.cohort !== 'calibration')),
  },
  rows,
};
await writeJson(`${fixtureRoot}/${set}-symbol-material-diagnostic.json`, result);
console.log(set, JSON.stringify(result.summary.all));
