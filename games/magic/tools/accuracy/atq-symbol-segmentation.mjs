import { readFile } from 'node:fs/promises';
import { readJson, writeJson, fixtureRoot, cacheRoot, hash } from './common.mjs';
import { readObject } from './cache.mjs';
import { PNG } from 'pngjs';
import { measureSymbolBounds } from './symbol-bounds.mjs';
const snapshot = await readJson(`${cacheRoot}/rollout/atq-symbol.json`),
  profiles = Object.fromEntries(
    [
      ['initial-wide', { thresholds: [55, 70, 85, 100, 115] }],
      ['dark-low', { thresholds: [40, 50, 60, 70] }],
      ['dark-mid', { thresholds: [60, 70, 80, 90] }],
      ['dark-high', { thresholds: [80, 90, 100, 110] }],
      ['contrast-low', { signal: 'contrast', thresholds: [20, 30, 40, 50] }],
      ['contrast-mid', { signal: 'contrast', thresholds: [30, 40, 50, 60] }],
      ['contrast-high', { signal: 'contrast', thresholds: [40, 50, 60, 70] }],
    ].map(([key, p]) => [
      key,
      {
        region: [368, 374, 64, 34],
        limits: { width: [20, 44], height: [9, 26] },
        maxSpread: 1.4,
        ...p,
      },
    ]),
  ),
  rows = [];
for (const e of snapshot.entries.filter((e) => e.cohort === 'calibration')) {
  const image = PNG.sync.read(await readObject(e.reference), { checkCRC: true });
  rows.push({
    id: e.id,
    name: e.card.name,
    referenceHash: e.reference.sha256,
    profiles: Object.fromEntries(
      Object.entries(profiles).map(([key, p]) => [key, measureSymbolBounds(image, p)]),
    ),
  });
}
await writeJson(`${fixtureRoot}/atq-symbol-segmentation.json`, {
  schemaVersion: 1,
  scope:
    'Calibration-only segmentation screen, no rendered scores involved in selection. Broad initial dark thresholds merged frame texture and cut off the anvil tip. The middle dark-ink sweep supplies six stable examples across W/U/artifact/land; keep the other ten uncertain. Contrast bounds diagnose the envelope separately. No individual-card thresholds.',
  methodHash: hash(await readFile(new URL(import.meta.url))),
  boundsMethodHash: hash(await readFile(new URL('./symbol-bounds.mjs', import.meta.url))),
  snapshotHash: hash(JSON.stringify(snapshot)),
  profiles,
  selected: 'dark-mid',
  rows,
});
