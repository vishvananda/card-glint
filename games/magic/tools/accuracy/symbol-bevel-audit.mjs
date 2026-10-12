import { readFile } from 'node:fs/promises';
import { outputRoot, fixtureRoot, writeJson, hash } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { median } from './metrics.mjs';

const bytes = await readFile(`${outputRoot}/m21/symbol-bevel-candidates/capture.json`),
  capture = JSON.parse(bytes),
  rows = [];
for (const card of capture.rows) {
  const profiles = {};
  for (const variant of ['scan', ...capture.variants.map((v) => v.id)]) {
    const asset = variant === 'scan' ? card.reference : card.images[variant],
      run = variant === 'scan' ? 'symbol-final' : 'symbol-bevel-candidates',
      region = await cachedGrayRegion(
        `${outputRoot}/m21/${run}/${asset.file}`,
        asset.sha256,
        [280, 410, 95, 18],
      );
    profiles[variant] = Array.from({ length: 18 }, (_, i) =>
      median([...region.gray.slice(i * 95, (i + 1) * 95)]),
    );
  }
  // One shared two-pixel displacement isolates tone from the known plate-height
  // residual. These are diagnostic samples, never a fitted image or render shift.
  const referenceBevel = (profiles.scan[9] + profiles.scan[10]) / 2,
    tone = {};
  for (const variant of capture.variants) {
    const p = profiles[variant.id],
      bevel = (p[7] + p[8]) / 2;
    tone[variant.id] = { bevel, absoluteLuminanceError: Math.abs(referenceBevel - bevel) };
  }
  rows.push({
    id: card.id,
    number: card.number,
    name: card.name,
    referenceHash: card.reference.sha256,
    profiles,
    referenceBevel,
    tone,
  });
}
await writeJson(`${fixtureRoot}/set-symbol-bevel-development-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Seven M21 material examples. Grayscale tone diagnosis only, not a color-invariant geometry score. All scans sample canonical rows 419–420, all renders 417–418; x=280..374 excludes symbols and type ink. No per-scan fitting. The two-pixel plate-edge residual remains flagged separately.',
  captureHash: hash(bytes),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  variants: capture.variants,
  rows,
});
console.log(rows.map(({ name, tone }) => ({ name, tone })));
