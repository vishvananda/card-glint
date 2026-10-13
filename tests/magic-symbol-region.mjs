import assert from 'node:assert/strict';
import { symbolRegionCoverage } from '../games/magic/tools/accuracy/symbol-region-coverage.mjs';

const measured = { stable: true, rect: [410, 380, 24, 23] },
  region = [407, 377, 30, 29];
assert.equal(symbolRegionCoverage(measured, region).status, 'covered');
assert.equal(symbolRegionCoverage(null, region).status, 'unknown');
assert.equal(symbolRegionCoverage({ ...measured, stable: false }, region).status, 'unknown');
assert.equal(symbolRegionCoverage(measured, [407, 377, 27.5, 29]).status, 'near-edge');
assert.equal(symbolRegionCoverage(measured, [407, 377, 26, 29]).status, 'clipped');
// A scan clipped in raw coordinates can fit after a separately frozen frame
// shift; conversely a new crop violation must be detected after normalization.
assert.equal(symbolRegionCoverage(measured, [407, 377, 26, 29], { tx: -2 }).status, 'covered');
assert.equal(symbolRegionCoverage(measured, region, { tx: 4 }).status, 'clipped');
assert.equal(symbolRegionCoverage(measured, region, { ty: -4 }).status, 'clipped');
assert.equal(symbolRegionCoverage(measured, region, { scale: 1.02 }).status, 'clipped');
assert.equal(symbolRegionCoverage(measured, region, { rotation: 0.001 }).status, 'covered');
assert.equal(symbolRegionCoverage(measured, region, { rotation: 0.1 }).status, 'clipped');
assert.equal(
  symbolRegionCoverage(measured, region, { matrix: [1, 0, 0.01, 1, 0, 0] }).status,
  'covered',
);
assert.throws(() => symbolRegionCoverage(measured, region, { matrix: [0, 0, 0, 0, 0, 0] }));
assert.throws(() => symbolRegionCoverage(measured, region, { scale: 0 }));
assert.throws(() => symbolRegionCoverage(measured, [407, 377, -1, 29]));
assert.throws(() => symbolRegionCoverage(measured, region, {}, -1));
console.log(
  'Symbol crop coverage: missing masks, crop edges and independent frame transforms pass.',
);
