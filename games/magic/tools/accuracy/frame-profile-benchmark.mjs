import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { nativeFrameProfiles, nativeOpaqueSupport } from './frame-native-profiles.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
import { opaqueSupport } from './frame-family-score.mjs';
import { normalize } from './pixels-pure.mjs';
const image = { width: 732, height: 1020, data: new Uint8Array(732 * 1020 * 4) };
for (let y = 0; y < 1020; y++)
  for (let x = 0; x < 732; x++) {
    const i = (y * 732 + x) * 4;
    image.data.set(
      [
        (7 * x + 3 * y) % 256,
        (11 * x + y) % 256,
        (3 * x + 5 * y) % 256,
        x > 85 && x < 645 && y > 108 && y < 558 ? 0 : 255,
      ],
      i,
    );
  }
const cases = {
    fullProfiles: () => frameProfiles(normalize(image)),
    thinProfiles: () => nativeFrameProfiles(image),
    fullSupport: () => opaqueSupport([normalize(image)]),
    thinSupport: () => nativeOpaqueSupport(image),
  },
  results = {};
for (const [key, fn] of Object.entries(cases)) {
  for (let i = 0; i < 5; i++) fn();
  const times = [];
  for (let round = 0; round < 5; round++) {
    const start = performance.now();
    for (let i = 0; i < 20; i++) fn();
    times.push((performance.now() - start) / 20);
  }
  times.sort((a, b) => a - b);
  results[key] = {
    iterations: 100,
    warmup: 5,
    medianMs: times[2],
    minMs: times[0],
    maxMs: times.at(-1),
  };
}
const file = new URL('./frame-native-profiles.mjs', import.meta.url);
console.log(
  JSON.stringify(
    {
      schema: 1,
      scope:
        'Node CPU wall time for analysis helpers on one deterministic synthetic 732x1020 RGBA image after warmup. Excludes image loading, Canvas painting/readback, full-card composition and GPU finish completion. Not a renderer-throughput benchmark.',
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      toolHash: createHash('sha256')
        .update(await fs.readFile(file))
        .digest('hex'),
      benchmarkHash: createHash('sha256')
        .update(await fs.readFile(new URL(import.meta.url)))
        .digest('hex'),
      results,
    },
    null,
    2,
  ),
);
