import assert from 'node:assert/strict';
import {
  fitVerticalFrameConsensus,
  composePrintedVertical,
  perimeterPaperStrips,
  perimeterPaperChecks,
  verticalFrameStrips,
  verifyVerticalFrameProfiles,
} from '../games/magic/tools/accuracy/printed-frame-vertical-fit.mjs';
import { revisedVerticalOptions } from '../games/magic/tools/accuracy/revised-vertical-frame.mjs';
import { projectScanPoint } from '../games/magic/tools/accuracy/scan-transform.mjs';
const parent = { matrix: [1.001, 0.003, -0.002, 0.999, 0.375, -0.25] };
for (const top of [-1, 0, 0.75])
  for (const bottom of [-0.5, 0, 1]) {
    const p = composePrintedVertical(parent, top, bottom),
      sy = 1 + (bottom - top) / 545,
      dy = top + 273 * (sy - 1);
    for (const [x, y] of [
      [40, 67],
      [300, 612],
      [244, 340],
      [420, 410],
    ]) {
      const a = projectScanPoint(x, y, parent),
        b = projectScanPoint(x, y, p);
      assert(Math.abs(a[0] - b[0]) < 1e-10);
      assert(Math.abs(b[1] - (340 + sy * (a[1] - 340) + dy)) < 1e-10);
    }
  }
assert.throws(() => composePrintedVertical(parent, NaN, 0));
assert.throws(() => composePrintedVertical(parent, 0, 9));
function image(
  top,
  bottom,
  index,
  {
    missing = false,
    contradictory = false,
    missingPaper = false,
    conflictingPaper = false,
    artLight = 95,
  } = {},
) {
  const width = 732,
    height = 1020,
    data = new Uint8Array(width * height * 4),
    sy = 1 + (bottom - top) / 545,
    dy = top + 273 * (sy - 1),
    m = [
      1 + index * 0.0001,
      0.0015,
      -0.001,
      1 - index * 0.0001,
      0.25 - index * 0.125,
      -0.375 + index * 0.125,
    ];
  function color(y) {
    if ((y >= 28 && y < 30) || (y >= 650 && y < 652)) return [20, 21, 19];
    if (missingPaper && y > 400 && y < 425) return [212, 204, 184];
    if (conflictingPaper && y > 400 && y < 425) y -= 1.5;
    if (missing && y > 365 && y < 385) return [95, 160, 175];
    if (contradictory && y > 365 && y < 385) y -= 1.5;
    return y < 63
      ? [190, 184, 165]
      : y < 65
        ? [238, 230, 210]
        : y < 68
          ? [30, 29, 25]
          : y < 374
            ? [artLight, artLight + 10, artLight + 20]
            : y < 376
              ? [22, 23, 21]
              : y < 380
                ? [235, 230, 219]
                : y < 411
                  ? [182, 174, 147]
                  : y < 413
                    ? [28, 29, 24]
                    : y < 416
                      ? [231, 226, 215]
                      : y < 610
                        ? [212, 204, 184]
                        : y < 613
                          ? [28, 25, 25]
                          : y < 616
                            ? [238, 237, 220]
                            : [182, 174, 147];
  }
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const sum = [0, 0, 0];
      for (const ox of [-0.25, 0.25])
        for (const oy of [-0.25, 0.25]) {
          const cx = (x + 0.5 + ox) / 1.5 - 0.5 - 244,
            cy = (y + 0.5 + oy) / 1.5 - 0.5 - 340,
            py = m[1] * cx + m[3] * cy + m[5],
            unwarped = (py - dy) / sy + 340,
            c = color(unwarped);
          for (let k = 0; k < 3; k++) sum[k] += c[k];
        }
      const p = (y * width + x) * 4,
        brightness = 1 + ((index % 3) - 1) * 0.04;
      for (let k = 0; k < 3; k++)
        data[p + k] = Math.round(Math.min(255, (sum[k] / 4) * brightness));
      data[p + 3] = 255;
    }
  return {
    image: { width, height, data },
    parentTransform: { matrix: m },
    expected: {
      top: -top / sy,
      bottom: -bottom / sy,
    },
  };
}
const specs = [
  ['cal-minus', 'calibration', -0.5, -0.25, {}],
  ['cal-zero', 'calibration', 0, 0, {}],
  ['cal-plus', 'calibration', 0.5, 0.25, {}],
  ['held-one', 'validation', 1, -0.75, {}],
  ['held-two', 'validation', -1.25, 0.875, {}],
  ['contradiction', 'validation', 0.25, -0.25, { contradictory: true }],
  ['missing', 'validation', -0.25, 0.25, { missing: true }],
  ['bad-parent', 'calibration', 0.125, 0.125, {}],
];
const rows = specs.map(([id, cohort, t, b, options], i) => ({
  id,
  cohort,
  parentAccepted: id !== 'bad-parent',
  ...image(t, b, i, options),
}));
const fit = fitVerticalFrameConsensus(rows);
for (const r of fit.rows) {
  console.log(r.id, {
    endpoints: r.endpoints,
    accepted: r.accepted,
    bands: Object.fromEntries(
      Object.entries(r.bands).map(([k, v]) => [k, { score: v.score, shift: v.shift }]),
    ),
  });
  if (['contradiction', 'missing', 'bad-parent'].includes(r.id)) {
    assert.equal(r.accepted, false);
    continue;
  }
  assert(r.accepted, r.id + ' must pass independent geometric checks');
  assert(Math.abs(r.endpoints.top - r.expected.top) <= 0.25, r.id + ' top recovery');
  assert(Math.abs(r.endpoints.bottom - r.expected.bottom) <= 0.25, r.id + ' bottom recovery');
}
assert(fit.work.reusedProfiles > 0);
console.log(
  'Vertical frame fit: centered source-only endpoint recovery, stock rotation/shear composition, independent contradiction/missing-edge and bad-parent rejection pass.',
);

const perimeter = fitVerticalFrameConsensus(rows, {
  strips: perimeterPaperStrips,
  fitAnchors: [29, 651],
  verificationKeys: perimeterPaperChecks,
});
for (const r of perimeter.rows) {
  if (r.id === 'bad-parent') {
    assert.equal(r.accepted, false);
    continue;
  }
  assert(
    r.accepted,
    r.id + ' perimeter/paper normalization should not depend on illustration edges',
  );
  assert(Math.abs(r.endpoints.top - r.expected.top) <= 0.25);
  assert(Math.abs(r.endpoints.bottom - r.expected.bottom) <= 0.25);
}
const flat = () => Array.from({ length: 31 }, (_, i) => (i === 13 ? 10 : 0));
const templates = Object.fromEntries(Object.keys(verticalFrameStrips).map((k) => [k, flat()]));
const profiles = structuredClone(templates);
profiles.certificatePaperTop[13] = 5;
profiles.certificatePaperTop[14] = 5;
const shifted = verifyVerticalFrameProfiles(profiles, templates);
assert(shifted.bands.certificatePaperTop.bestScore > 99);
assert.equal(shifted.bands.certificatePaperTop.shift, 0.5);
assert(shifted.bands.certificatePaperTop.score < 90);
assert.equal(
  shifted.independentPassed,
  false,
  'Searching a better check-strip shift cannot approve the frozen pose',
);
console.log(
  'Perimeter/paper mode ignores variable illustration content; zero-position verification cannot be overwritten by an optimized score.',
);

const nuisanceRows = [
  ...rows,
  ...[
    ['art-bright', { artLight: 220 }],
    ['art-dark', { artLight: 40 }],
    ['paper-missing', { missingPaper: true }],
    ['paper-conflict', { conflictingPaper: true }],
  ].map(([id, options], i) => ({
    id,
    cohort: 'validation',
    parentAccepted: true,
    ...image(0.5, -0.25, i + 10, options),
  })),
];
const directed = fitVerticalFrameConsensus(nuisanceRows, revisedVerticalOptions);
for (const r of directed.rows) {
  if (['bad-parent', 'paper-missing', 'paper-conflict'].includes(r.id)) {
    assert.equal(r.accepted, false, r.id + ' directed rejection');
    continue;
  }
  assert(r.accepted, r.id + ' must survive art-only nuisance changes');
  assert(Math.abs(r.endpoints.top - r.expected.top) <= 0.25, r.id + ' directed top');
  assert(Math.abs(r.endpoints.bottom - r.expected.bottom) <= 0.25, r.id + ' directed bottom');
}

const controlRows = nuisanceRows.slice(0, 5);
const options = revisedVerticalOptions;
const frozen = fitVerticalFrameConsensus(controlRows, options);
assert.deepEqual(
  frozen.templates,
  directed.templates,
  'Validation additions cannot move calibration templates',
);
assert.deepEqual(frozen.passes, directed.passes, 'Validation cannot move the gauge');
for (const row of frozen.rows) {
  const expanded = directed.rows.find((r) => r.id === row.id);
  assert.deepEqual(expanded.transform, row.transform);
  assert.equal(expanded.accepted, row.accepted);
}
console.log(
  'Directed dark-going lines recover poses despite art brightness and reject contradictory/missing paper; validation cannot change templates or other poses.',
);
const originalDirected = fitVerticalFrameConsensus(rows, revisedVerticalOptions);
const missingChecks = fitVerticalFrameConsensus(
  specs.map(([id, cohort, top, bottom, options], i) => ({
    id,
    cohort,
    parentAccepted: id !== 'bad-parent',
    ...image(top, bottom, i, { ...options, missingPaper: true }),
  })),
  revisedVerticalOptions,
);
assert.deepEqual(missingChecks.passes, originalDirected.passes);
for (const key of ['fitTop', 'fitBottom'])
  assert.deepEqual(missingChecks.templates[key], originalDirected.templates[key]);
assert.deepEqual(
  missingChecks.rows.map((r) => r.transform),
  originalDirected.rows.map((r) => r.transform),
);
assert(missingChecks.rows.every((r) => !r.independentPassed && !r.accepted));
console.log(
  'Removing every independent paper edge leaves fitted transforms untouched and rejects the entire cohort.',
);
