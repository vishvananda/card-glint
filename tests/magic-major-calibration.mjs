import assert from 'node:assert/strict';
import { fitScanFrame } from '../games/magic/tools/accuracy/scan-frame-fit.mjs';
import { fitAffineScan } from '../games/magic/tools/accuracy/scan-affine-fit.mjs';
import {
  inverseScanMatrix,
  projectScanPoint,
} from '../games/magic/tools/accuracy/scan-transform.mjs';
import { SCAN_ANCHOR_WINDOWS } from '../games/magic/tools/accuracy/scan-frame-anchors.mjs';
import {
  scoreSymbol,
  searchSymbols,
  stampStyledSymbol,
  shiftedSymbolBounds,
} from '../games/magic/tools/accuracy/major-calibration-metrics.mjs';

const positions = { left: 26, right: 464, top: 28, bottom: 652 };
const target = {
  reliable: true,
  sides: Object.fromEntries(
    Object.entries(positions).map(([side, position]) => [side, { reliable: true, position }]),
  ),
};
function observed(transform) {
  const inverse = { matrix: inverseScanMatrix(transform) },
    points = [];
  for (const [side, spec] of Object.entries(SCAN_ANCHOR_WINDOWS))
    for (let index = 0; index < spec.count; index++) {
      const along = spec.start + spec.step * index,
        h = spec.axis === 'x';
      const [x, y] = projectScanPoint(
        h ? positions[side] : along,
        h ? along : positions[side],
        inverse,
      );
      points.push({ side, index, cohort: index % 2 ? 'validation' : 'fit', along, x, y });
    }
  return { points };
}
const expected = { matrix: [1.008, 0.003, -0.001, 0.993, 1, -2] },
  anchors = observed(expected),
  simple = fitScanFrame(anchors, target);
assert.equal(simple.accepted, false);
const fit = fitAffineScan(anchors, target, simple);
assert.equal(fit.accepted, true);
assert.equal(fit.model, 'affine-comparison-only');
for (let i = 0; i < 6; i++)
  assert.ok(Math.abs(fit.transform.matrix[i] - expected.matrix[i]) < 1e-8);
assert.ok(fit.parameters.axisRatio > 1.01, 'Aspect correction remains visible in provenance');
for (const pose of [
  { matrix: [1.04, 0, 0, 1, 0, 0] },
  { matrix: [1, 0.02, 0.02, 1, 0, 0] },
  { tx: 12 },
]) {
  const a = observed(pose);
  assert.equal(fitAffineScan(a, target, fitScanFrame(a, target)).accepted, false);
}
const inconsistent = observed(expected);
for (const p of inconsistent.points) if (p.cohort === 'validation') p.x += 4;
assert.equal(
  fitAffineScan(inconsistent, target, fitScanFrame(inconsistent, target)).accepted,
  false,
);
const missing = { points: anchors.points.filter((p) => p.side !== 'bottom') };
assert.equal(fitAffineScan(missing, target, fitScanFrame(missing, target)).accepted, false);
const clean = observed({ tx: 1 }),
  cleanFit = fitScanFrame(clean, target);
assert.equal(
  fitAffineScan(clean, target, cleanFit),
  cleanFit,
  'Do not add degrees of freedom to an accepted simple fit',
);

// Recover placement and independent dimensions of an asymmetric outlined glyph,
// despite a reference brightness shift; no browser is used by the search.
const rect = [0, 0, 90, 60],
  blank = new Float32Array(90 * 60).fill(180),
  icon = { width: 40, height: 40, data: new Uint8Array(40 * 40 * 4) };
for (let y = 3; y < 37; y++)
  for (let x = 3; x < 37; x++) {
    if (x > 20 && y < 18) continue;
    const v = x < 6 || y < 6 || x > 33 || y > 33 ? 15 : 110;
    icon.data.set([v, v, v, 255], (y * 40 + x) * 4);
  }
const bounds = [30, 18, 24, 24],
  truth = [3, -2, 1.12, 0.88];
const reference = stampStyledSymbol(blank, rect, icon, shiftedSymbolBounds(bounds, truth));
for (let i = 0; i < reference.length; i++) reference[i] = reference[i] * 0.88 + 20;
const sample = { rect, blank, icon, bounds, reference };
const search = searchSymbols([sample]);
assert.ok(search.best.f1 > scoreSymbol(sample, [0, 0, 1, 1]).f1 + 0.1);
assert.ok(
  Math.abs(search.best.params[0] - truth[0]) <= 1 &&
    Math.abs(search.best.params[1] - truth[1]) <= 1,
);
assert.ok(
  Math.abs(search.best.params[2] - truth[2]) <= 0.12 &&
    Math.abs(search.best.params[3] - truth[3]) <= 0.12,
);
console.log(
  'Major calibration: bounded comparison affine fit, reserved-strip rejection, aspect provenance, and browser-free symbol search pass.',
);
