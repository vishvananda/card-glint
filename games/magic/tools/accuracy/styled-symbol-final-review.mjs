import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion } from './metrics.mjs';

const [directory, reportFile] = process.argv.slice(2);
if (!directory || !reportFile)
  throw Error('Usage: styled-symbol-final-review.mjs CAPTURE_DIRECTORY REPORT_JSON');
const report = JSON.parse(await readFile(reportFile));
const fits = JSON.parse(await readFile(path.join(directory, 'placement-normalization.json')));
const rect = [382, 385, 74, 33];
for (const group of [...report.summaries, ...(report.confirmation ? [report.confirmation] : [])]) {
  for (const row of group.rows) {
    if (!/^[a-z0-9]+-[a-z0-9]+$/.test(row.slug)) throw Error('Unsafe capture slug');
    const saved = fits.find((fit) => fit.slug === row.slug);
    if (!saved?.fit.accepted || saved.resultHash !== hash(JSON.stringify(saved.fit)))
      throw Error('Frozen frame normalization changed');
    const referenceBytes = await readFile(path.join(directory, `${row.slug}-reference.png`));
    if (hash(referenceBytes) !== saved.identity.reference) throw Error('Reference source changed');
    const reference = cropGray(normalize(PNG.sync.read(referenceBytes), saved.fit.transform), rect);
    row.finalRaster = {};
    row.finalRasterHashes = {};
    for (const [key, suffix] of [
      ['before', 'pre-calibration'],
      ['after', 'plate'],
    ]) {
      const bytes = await readFile(path.join(directory, `${row.slug}-${suffix}.png`));
      const candidate = cropGray(normalize(PNG.sync.read(bytes)), rect);
      row.finalRaster[key] = compareRegion(
        reference.gray,
        candidate.gray,
        rect[2],
        rect[3],
      ).edgeF1[1];
      row.finalRasterHashes[key] = hash(bytes);
    }
  }
  group.finalRaster = Object.fromEntries(
    ['before', 'after'].map((key) => [
      key,
      group.rows.reduce((sum, row) => sum + row.finalRaster[key], 0) / group.rows.length,
    ]),
  );
}
await writeFile(reportFile, JSON.stringify(report, null, 2) + '\n');
console.log(
  'Final raster symbol scores verified for',
  report.summaries.reduce((n, g) => n + g.count, 0),
  'development cards.',
);
