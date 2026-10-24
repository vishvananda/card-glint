import assert from 'node:assert/strict';
import { scanBoundaryProfiles } from '../games/magic/tools/accuracy/scan-boundary-profiles.mjs';
import {
  collectorsFrameBounds as bounds,
  collectorsFrameGroups as groups,
  collectorsInterior as interior,
} from '../games/magic/tools/accuracy/collectors-frame-band.mjs';
const image = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) };
for (let y = 0; y < 680; y++)
  for (let x = 0; x < 488; x++) {
    const i = (y * 488 + x) * 4,
      v = x >= 27 && x <= 461 && y >= 32 && y <= 650 ? 190 : 24;
    image.data.set([v, v, v, 255], i);
  }
const oldBounds = { ...bounds, top: [0, 30] };
const oldGroups = groups.map((g) => ({ ...g, top: ['y', 10, 30, g.top[3], g.top[4]] }));
const signal = (profiles) =>
  profiles
    .filter((p) => p.side === 'top')
    .reduce((s, p) => s + p.gradient.reduce((s, v) => s + Math.abs(v), 0), 0);
assert.equal(
  signal(scanBoundaryProfiles(image, oldGroups[0], oldBounds)),
  0,
  'The old clamp loses a frame starting at y32',
);
assert(
  signal(scanBoundaryProfiles(image, groups[0], bounds)) > 100,
  'The expanded band must contain the printed edge',
);
const changed = { ...image, data: image.data.slice() };
for (let y = interior.top; y < interior.bottom; y++)
  for (let x = interior.left; x < interior.right; x++)
    changed.data.set([x % 255, y % 255, (x + y) % 255, 255], (y * 488 + x) * 4);
for (const group of groups)
  assert.deepEqual(
    scanBoundaryProfiles(changed, group, bounds),
    scanBoundaryProfiles(image, group, bounds),
    'Interior text/art replacement must not affect frame data',
  );
for (const side of Object.keys(bounds))
  for (let i = 0; i < 3; i++)
    for (let j = i + 1; j < 3; j++)
      for (const a of groups[i][side][3])
        for (const b of groups[j][side][3])
          assert(
            Math.abs(a - b) > groups[i][side][4] + groups[j][side][4],
            'Fit/model-selection/certification strips must remain disjoint',
          );
console.log(
  'Collectors frame band: old-clamp clipping reproduced; y32 edge recovered, declared interior isolated, and three independent probe groups preserved.',
);
