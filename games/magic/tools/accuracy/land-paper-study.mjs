import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import {
  fixtureRoot,
  outputRoot,
  cacheRoot,
  readJson,
  writeJson,
  hash,
  objectFile,
} from './common.mjs';
import { normalize } from './pixels.mjs';
import { median } from './metrics.mjs';

// Broad interior patches avoid rails and rules-panel edges. Median channels
// reduce glyph contamination; this is a color review flag, not an HSB fit.
const patches = { left: [55, 448, 80, 145], right: [355, 448, 80, 145] };
const sample = (image) => {
  const swatches = Object.fromEntries(
    Object.entries(patches).map(([name, [x, y, w, h]]) => {
      const channels = [[], [], []];
      for (let py = y; py < y + h; py++)
        for (let px = x; px < x + w; px++) {
          const i = (py * image.width + px) * 4;
          channels.forEach((channel, c) => channel.push(image.data[i + c]));
        }
      return [name, channels.map(median)];
    }),
  );
  const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return {
    ...swatches,
    meanLuminance: (luminance(swatches.left) + luminance(swatches.right)) / 2,
    sideColorDistance: Math.hypot(...swatches.left.map((v, c) => v - swatches.right[c])),
  };
};
const capture = await readJson(`${outputRoot}/flavor-land/after/capture.json`);
const sources = await readJson(`${cacheRoot}/sets/m19.json`);
const assets = sources.components.filter((c) => /\/frames\/(BR|WB)\.webp$/.test(c.url));
const rows = [];
for (const row of capture.rows.filter((r) => /^(Bloodfell Caves|Caves of Koilos)$/.test(r.name))) {
  const bytes = await readFile(`${outputRoot}/flavor-land/after/${row.images.inspect.file}`);
  assert.equal(hash(bytes), row.images.inspect.sha256);
  const scan = await readFile(objectFile({ sha256: row.referenceHash }));
  assert.equal(hash(scan), row.referenceHash);
  rows.push({
    id: row.id,
    set: row.set,
    name: row.name,
    referenceHash: row.referenceHash,
    renderHash: row.images.inspect.sha256,
    reference: sample(normalize(PNG.sync.read(scan))),
    rendered: sample(normalize(PNG.sync.read(bytes))),
    status: 'rules-paper-gradient-too-pale',
  });
}
await writeJson(`${fixtureRoot}/land-paper-review.json`, {
  schemaVersion: 1,
  scope:
    'Six cached examples across M15/M20/M21/IKO/DMU/FDN. Raw-scan patch medians flag pale paper and weak side-to-side color contrast; not a calibrated HSB correction or alignment score. Existing assets retained. Border colors are separately accepted.',
  rendererHash: capture.rendererHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  patches,
  assets,
  rows,
  next: 'During the new-frame component HSB pass, fit rules-paper tone and gradient strength separately from rails, name/type plates and text. Validate on other lands and same-palette nonlands before changing shared frame assets.',
});
console.log(
  rows.map((r) => ({ set: r.set, name: r.name, reference: r.reference, rendered: r.rendered })),
);
