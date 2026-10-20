// Propose one frame transform per material; scan poses remain immutable.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
import { median } from './metrics.mjs';
const [input, output] = process.argv.slice(2);
assert(output, 'Usage: early-boundary-proposal.mjs BOUNDARY_REPORT OUTPUT');
const bytes = await readFile(input),
  data = JSON.parse(bytes),
  rows = data.rows.filter((r) => r.acceptedPose && r.coherent),
  materials = {};
const center = { x: 244, y: 340 },
  sides = { x: ['left', 'right'], y: ['top', 'bottom'] };
for (const material of [...new Set(rows.map((r) => r.material))]) {
  const all = rows.filter((r) => r.material === material),
    cal = all.filter((r) => r.cohort === 'calibration');
  assert(cal.length >= 4, 'At least four preselected calibration scans per material');
  const axes = {};
  for (const [axis, [lo, hi]] of Object.entries(sides)) {
    const p = (side) => median(cal.map((r) => r.sides[side].rendered)),
      q = (side) => median(cal.map((r) => r.sides[side].reference)),
      scale = (q(hi) - q(lo)) / (p(hi) - p(lo)),
      shift = q(lo) - (center[axis] + (p(lo) - center[axis]) * scale);
    assert(
      scale > 0.98 && scale < 1.02 && Math.abs(shift) < 3,
      'Outer-frame proposal exceeds a conservative trial range',
    );
    axes[axis] = { scale, shift };
  }
  const evidence = all.map((r) => {
    const before = [],
      after = [];
    for (const [axis, ss] of Object.entries(sides))
      for (const side of ss) {
        const p = r.sides[side],
          a = axes[axis];
        before.push(Math.abs(p.delta));
        after.push(
          Math.abs(center[axis] + (p.rendered - center[axis]) * a.scale + a.shift - p.reference),
        );
      }
    return {
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      before: median(before),
      predictedAfter: median(after),
    };
  });
  const summary = Object.fromEntries(
    [...new Set(evidence.map((r) => r.cohort))].map((co) => {
      const subset = evidence.filter((r) => r.cohort === co);
      return [
        co,
        {
          count: subset.length,
          medianBefore: median(subset.map((r) => r.before)),
          medianPredictedAfter: median(subset.map((r) => r.predictedAfter)),
          maxPredicted: Math.max(...subset.map((r) => r.predictedAfter)),
        },
      ];
    }),
  );
  materials[material] = { axes, summary, rows: evidence };
}
await writeJson(output, {
  schema: 1,
  status: 'prediction-needs-native-replay',
  scope:
    'Shared renderer frame/mask geometry trial only. Fit existing preselected calibration cohorts; report reserved cohorts without choosing their poses. No scan transform, text placement, frame source or color changes are adopted here. Predictions from measured outer boundaries are not native rendering accuracy scores and cannot close a calibration task.',
  inputHash: hash(bytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  materials,
});
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(materials).map(([k, v]) => [k, { axes: v.axes, summary: v.summary }]),
    ),
  ),
);
