import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { atomicWrite, options, outputRoot, readJson } from './common.mjs';

const opts = options(),
  runRoot = path.join(outputRoot, opts.set, opts.run);
const report = await readJson(path.join(runRoot, 'metrics.json'));
try {
  const typography = await readJson(path.join(runRoot, 'typography.json'));
  for (const key of ['referenceIdentity', 'alignmentHash', 'rendererHash', 'browser'])
    if (typography[key] !== report[key]) throw Error(`Stale typography report: ${key}`);
  report.typography = typography;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await atomicWrite(
  path.join(runRoot, 'report-data.js'),
  'window.MAGIC_ACCURACY = ' + JSON.stringify(report).replaceAll('<', '\\u003c') + ';\n',
);
for (const file of ['report.html', 'report.js', 'report.css'])
  await atomicWrite(path.join(runRoot, file), await readFile(new URL(file, import.meta.url)));
const csv = (v) => '"' + String(v ?? '').replaceAll('"', '""') + '"';
const lines = [
  [
    'id',
    'name',
    'collector_number',
    'category',
    'content_status',
    'alignment_uncertain',
    'overflow',
    'tier',
    'region',
    'status',
    'edge_f1_0px',
    'edge_f1_1px',
    'edge_f1_2px',
    'mean_distance_px',
    'p95_distance_px',
    'census_similarity',
    'error',
  ],
];
for (const result of report.results) {
  const base = [
    result.id,
    result.name,
    result.collectorNumber,
    result.category,
    result.contentStatus,
    result.alignment?.uncertain,
    result.clipping,
  ];
  if (result.issue) lines.push([...base, '', '', 'failed', '', '', '', '', '', '', result.issue]);
  else
    for (const [tier, comparison] of Object.entries(result.comparisons))
      for (const region of comparison.regions)
        lines.push([
          ...base,
          tier,
          region.id,
          region.status,
          ...[0, 1, 2].map((i) => region.edgeF1?.[i]),
          region.meanDistance,
          region.p95Distance,
          region.censusSimilarity,
          '',
        ]);
}
await atomicWrite(
  path.join(runRoot, 'metrics.csv'),
  lines.map((row) => row.map(csv).join(',')).join('\n') + '\n',
);
console.log(
  `Open ${path.join(runRoot, 'report.html')} (self-contained, no server or external requests).`,
);
