import assert from 'node:assert/strict';
import path from 'node:path';
import {
  cacheRoot,
  fixtureRoot,
  objectFile,
  options,
  outputRoot,
  readJson,
  writeJson,
} from './common.mjs';
import { normalize, readPng, cropGray } from './pixels.mjs';
import { compareRegion, median, METRIC_VERSION } from './metrics.mjs';

// Perturb references, never fit them. This tests sensitivity, not renderer quality.
const opts = options();
const snapshot = await readJson(path.join(cacheRoot, 'sets', opts.set + '.json'));
const cohorts = await readJson(path.join(fixtureRoot, opts.set, 'cohorts.json'));
const annotated = (await readJson(path.join(fixtureRoot, opts.set, 'annotations.json'))).cards;
const entries = snapshot.entries.filter(
  (e) => cohorts.calibration.includes(e.card.collector_number) && annotated[e.id]?.reviewed,
);
assert.ok(entries.length >= 3, 'At least three reviewed calibration cards needed');
const rows = [];
for (const entry of entries) {
  const image = normalize(await readPng(objectFile(entry.reference)));
  const reference = cropGray(image, [39, 433, 411, 170]);
  const { gray, width, height } = reference;
  const photometric = (change) => {
    const copy = { ...image, data: new Uint8Array(image.data) };
    for (let p = 0; p < copy.data.length; p += 4) {
      const rgb = change([...copy.data.slice(p, p + 3)], p);
      for (let c = 0; c < 3; c++) copy.data[p + c] = Math.max(0, Math.min(255, rgb[c]));
    }
    return cropGray(copy, [39, 433, 411, 170]).gray;
  };
  const geometric = (map) =>
    Float32Array.from(gray, (_, i) => {
      const [x, y] = map(i % width, Math.floor(i / width));
      return x < 0 || x >= width || y < 0 || y >= height
        ? 235
        : gray[Math.floor(y) * width + Math.floor(x)];
    });
  const variants = {
    brightness: photometric((rgb) => rgb.map((v) => v * 0.8 + 25)),
    gamma: photometric((rgb) => rgb.map((v) => 255 * (v / 255) ** 1.25)),
    saturation: photometric((rgb) => {
      const y = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      return rgb.map((v) => y + (v - y) * 0.2);
    }),
    colorCast: photometric((rgb) => [rgb[0] * 0.85, rgb[1] * 0.95, rgb[2] * 1.05]),
    noise: photometric((rgb, p) => rgb.map((v, c) => v + (((p * 13 + c * 7) % 11) - 5) * 0.5)),
    shift2px: geometric((x, y) => [x - 2, y]),
    shift4px: geometric((x, y) => [x - 4, y]),
    widerGlyphsAndSpacing: geometric((x, y) => [x / 1.05, y]),
    increasedLeading: geometric((x, y) => [x, y / 1.07]),
    missingBottomThird: Float32Array.from(gray, (v, i) =>
      i >= width * Math.floor((height * 2) / 3) ? 235 : v,
    ),
  };
  rows.push({
    id: entry.id,
    name: entry.card.name,
    variants: Object.fromEntries(
      Object.entries(variants).map(([name, candidate]) => [
        name,
        compareRegion(gray, candidate, width, height),
      ]),
    ),
  });
}
const summary = Object.fromEntries(
  Object.keys(rows[0].variants).map((name) => [
    name,
    {
      medianEdgeF1: median(rows.map((row) => row.variants[name].edgeF1[1])),
      medianCensus: median(rows.map((row) => row.variants[name].censusSimilarity)),
      medianDistance: median(rows.map((row) => row.variants[name].meanDistance)),
    },
  ]),
);
const benign = ['brightness', 'gamma', 'saturation', 'colorCast', 'noise'];
const geometry = [
  'shift2px',
  'shift4px',
  'widerGlyphsAndSpacing',
  'increasedLeading',
  'missingBottomThird',
];
const passed =
  Math.min(...benign.map((n) => summary[n].medianEdgeF1)) >
  Math.max(...geometry.map((n) => summary[n].medianEdgeF1));
const report = {
  metricVersion: METRIC_VERSION,
  snapshotIdentity: snapshot.identity,
  cards: rows.length,
  passed,
  scope:
    'Reviewed calibration body crops only. Synthetic perturbations of real PNG scans. No registration. This is a sensitivity check, not proof of universal perceptual accuracy.',
  summary,
  rows,
};
await writeJson(path.join(outputRoot, opts.set, 'metric-validation.json'), report);
console.log(JSON.stringify({ passed, cards: rows.length, summary }, null, 2));
assert.ok(passed, 'Photometric changes must score above geometric/content changes');
