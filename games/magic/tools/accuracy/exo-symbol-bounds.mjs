import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  readJson,
  writeJson,
  hash,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  objectFile,
} from './common.mjs';
import { median } from './metrics.mjs';
import { measureSymbolBounds, fittedSymbolBounds } from './symbol-bounds.mjs';
const stage = process.argv[2] ?? 'rim-outer',
  base = `${outputRoot}/exo-symbol`,
  snapshot = await readJson(`${cacheRoot}/rollout/exo-symbol.json`),
  capture = await readJson(`${base}/${stage}/capture.json`),
  registration = await readJson(`${fixtureRoot}/old-symbol-material-registration.json`),
  transform = registration.groups.exo.transform,
  rows = [];
async function checkedPng(file, sha) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), sha);
  return PNG.sync.read(bytes, { checkCRC: true });
}
function measure(image, light = false) {
  return measureSymbolBounds(image, {
    region: [363, 374, 76, 31],
    limits: { width: [40, 72], height: [light ? 18 : 12, 29] },
    thresholds: light ? [190, 205, 220] : [120, 140, 160],
    light,
  });
}
const fit = (rect) => fittedSymbolBounds(rect, transform);
for (const e of snapshot.entries.filter((e) => e.cohort !== 'control')) {
  const ref = await checkedPng(objectFile(e.reference), e.reference.sha256),
    a = capture.rows.find((r) => r.id === e.id),
    ink = e.card.rarity === 'common' ? measure(ref) : null,
    rim = measure(ref, true),
    image = a
      ? await checkedPng(`${base}/${stage}/${a.images.inspect.file}`, a.images.inspect.sha256)
      : null,
    rendered = image && ink ? measure(image) : null;
  rows.push({
    id: e.id,
    name: e.card.name,
    color: e.card.colors.join('') || 'A',
    rarity: e.card.rarity,
    referenceHash: e.reference.sha256,
    referenceSize: [ref.width, ref.height],
    ink,
    rim,
    rendered,
    fittedInk: ink?.rect ? fit(ink.rect) : null,
    review: [
      ...(!rim.stable ? ['rim-segmentation-uncertain'] : []),
      ...(ink && !ink.stable ? ['ink-threshold-sensitive'] : []),
    ],
  });
}
function summarize(group) {
  const ink = group.filter((r) => r.ink?.stable),
    rendered = ink.filter((r) => r.rendered?.stable),
    rim = group.filter((r) => r.rim.stable),
    dims = (rs, key) =>
      rs.length ? Array.from({ length: 4 }, (_, j) => median(rs.map((r) => r[key].rect[j]))) : null;
  return {
    cards: group.length,
    stableInk: ink.length,
    stableRim: rim.length,
    rawInk: dims(ink, 'ink'),
    rawRim: dims(rim, 'rim'),
    renderedInk: dims(rendered, 'rendered'),
    fittedInk: ink.length
      ? Object.fromEntries(
          ['width', 'height', 'centerX', 'centerY'].map((k) => [
            k,
            median(ink.map((r) => r.fittedInk[k])),
          ]),
        )
      : null,
    pairedAbsoluteDimensionError: rendered.length
      ? {
          cards: rendered.length,
          width: median(rendered.map((r) => Math.abs(r.fittedInk.width - r.rendered.rect[2]))),
          height: median(rendered.map((r) => Math.abs(r.fittedInk.height - r.rendered.rect[3]))),
        }
      : null,
  };
}
const report = {
  schemaVersion: 1,
  stage,
  scope:
    'Direct native-resolution Exodus component bounds, independent width and height. All 55 common scans are the measurement cohort; 88 metallic printings provide rim-only cross-checks, not reliable dark-ink segmentation. Fixed search window, 8-connected components, boundary rejection, grayscale threshold sweep and explicit instability flags. Raw source pixels are measured before resampling. Translate units with the full-image 488 × 680 fit; additionally report the pre-existing provisional shared frame scale/transform without refitting it. Never use per-scan dimensions or offsets in the painter. Threshold uncertainty and source pixel quantization limit precision (about 0.65 canonical px per scan pixel). This diagnostic does not certify color, individual scan alignment, or whole-card accuracy.',
  methodHash: hash(await readFile(new URL(import.meta.url))),
  segmenterHash: hash(await readFile(new URL('./symbol-component-bounds.mjs', import.meta.url))),
  boundsMethodHash: hash(await readFile(new URL('./symbol-bounds.mjs', import.meta.url))),
  snapshotHash: hash(JSON.stringify(snapshot)),
  captureHash: hash(JSON.stringify(capture)),
  rendererHash: capture.rendererHash,
  registrationHash: hash(JSON.stringify(registration)),
  transform,
  summary: summarize(rows),
  colors: Object.fromEntries(
    ['W', 'U', 'B', 'R', 'G'].map((c) => [c, summarize(rows.filter((r) => r.color === c))]),
  ),
  rows,
};
await writeJson(`${fixtureRoot}/exo-symbol-bounds-${stage}.json`, report);
console.log(JSON.stringify(report.summary, null, 2));
