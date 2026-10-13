import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  readJson,
  writeJson,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  objectFile,
  hash,
} from './common.mjs';
import { measureSymbolBounds, measureRenderedSymbol } from './symbol-bounds.mjs';
import { median } from './metrics.mjs';
const stage = process.argv[2] ?? 'before',
  base = `${outputRoot}/atq-symbol`,
  snapshot = await readJson(`${cacheRoot}/rollout/atq-symbol.json`),
  baseline = await readJson(`${base}/before/capture.json`),
  templates = await readJson(`${base}/templates/capture.json`),
  capture = await readJson(`${base}/${stage}/capture.json`),
  profile = {
    region: [368, 374, 64, 34],
    limits: { width: [20, 44], height: [9, 26] },
    maxSpread: 1.4,
    thresholds: [60, 70, 80, 90],
  },
  rows = [];
async function png(file, sha) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), sha);
  return PNG.sync.read(bytes, { checkCRC: true });
}
const measured = async (file, sha) => measureSymbolBounds(await png(file, sha), profile);
const renderedProfile = {
  ...profile,
  region: [364, 372, 86, 42],
  limits: { width: [10, 48], height: [5, 30] },
  light: true,
  thresholds: [8, 16, 24],
};
for (const e of snapshot.entries.filter((e) =>
  stage === 'after' ? e.cohort !== 'control' : e.cohort === 'calibration',
)) {
  const a = capture.rows.find((r) => r.id === e.id),
    b = baseline.rows.find((r) => r.id === e.id),
    ref = await measured(objectFile(e.reference), e.reference.sha256),
    renders = {},
    template = templates.rows.find((r) => r.id === e.id),
    blank = template
      ? await png(
          `${base}/templates/${template.images.inspect.file}`,
          template.images.inspect.sha256,
        )
      : null;
  for (const [variant, asset] of [['after', a.images.inspect]])
    renders[variant] = blank
      ? measureRenderedSymbol(
          await png(`${base}/${stage}/${asset.file}`, asset.sha256),
          blank,
          renderedProfile,
        )
      : null;
  rows.push({
    id: e.id,
    name: e.card.name,
    cohort: e.cohort,
    referenceHash: e.reference.sha256,
    reference: ref,
    before: blank
      ? measureRenderedSymbol(
          await png(`${base}/before/${b.images.inspect.file}`, b.images.inspect.sha256),
          blank,
          renderedProfile,
        )
      : null,
    renders,
  });
}
const valid = rows.filter((r) => r.reference.stable),
  dims = (rs) => Array.from({ length: 4 }, (_, j) => median(rs.map((r) => r.rect[j]))),
  summary = {
    cards: rows.length,
    stableReferences: valid.length,
    reference: valid.length ? dims(valid.map((r) => r.reference)) : null,
    variants: Object.fromEntries(
      Object.keys(rows[0].renders).map((key) => {
        const pair = valid.filter((r) => r.renders[key]?.stable);
        return [
          key,
          {
            stablePairs: pair.length,
            rendered: pair.length ? dims(pair.map((r) => r.renders[key])) : null,
            widthError: pair.length
              ? median(pair.map((r) => Math.abs(r.reference.rect[2] - r.renders[key].rect[2])))
              : null,
            heightError: pair.length
              ? median(pair.map((r) => Math.abs(r.reference.rect[3] - r.renders[key].rect[3])))
              : null,
          },
        ];
      }),
    ),
  };
await writeJson(`${fixtureRoot}/atq-symbol-bounds-${stage}.json`, {
  schemaVersion: 1,
  scope:
    'Native dark-ink anvil measurements with fixed thresholds and independently measured width/height. Raw scan coordinates, no symbol-fitted registration. Exact matched blank-face subtraction isolates rendered symbols. Calibration only before candidate selection; full-set reference measurements after selection. Threshold-sensitive and missing components remain uncertain; scan pixel resolution limits precision.',
  methodHash: hash(await readFile(new URL(import.meta.url))),
  boundsMethodHash: hash(await readFile(new URL('./symbol-bounds.mjs', import.meta.url))),
  segmenterHash: hash(await readFile(new URL('./symbol-component-bounds.mjs', import.meta.url))),
  captureHash: hash(JSON.stringify(capture)),
  baselineHash: hash(JSON.stringify(baseline)),
  profile,
  renderedProfile,
  templateHash: hash(JSON.stringify(templates)),
  summary,
  rows,
});
console.log(JSON.stringify(summary, null, 2));
