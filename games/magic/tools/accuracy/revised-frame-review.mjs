import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, atomicWrite, outputRoot, fixtureRoot, hash } from './common.mjs';

const root = path.join(outputRoot, '3ed'),
  fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'frame-selection-plan.json'));
const check = await readJson(path.join(fixture, 'frame-selection-check.json'));
const before = await readJson(path.join(root, 'revised-fields/capture.json'));
const after = await readJson(path.join(root, 'revised-frame/capture.json'));
const oldMetrics = await readJson(path.join(root, 'revised-fields/metrics.json'));
const metrics = await readJson(path.join(root, 'revised-frame/metrics.json'));
assert.equal(check.rendererHash, after.rendererHash);
assert.equal(metrics.rendererHash, after.rendererHash);
assert.equal(metrics.metricSource, oldMetrics.metricSource);
assert.equal(metrics.alignmentHash, oldMetrics.alignmentHash);
const old = before.results.find((c) => c.id === plan.id),
  card = after.results.find((c) => c.id === plan.id);
for (const [run, c] of [
  ['revised-fields', old],
  ['revised-frame', card],
])
  for (const tier of ['reference', 'inspect', 'table'])
    assert.equal(
      hash(await readFile(path.join(root, run, c.images[tier].file))),
      c.images[tier].sha256,
    );
const scores = ['inspect', 'table'].map((tier) => {
  const a = oldMetrics.results.find((r) => r.id === plan.id).comparisons[tier];
  const b = metrics.results.find((r) => r.id === plan.id).comparisons[tier];
  return {
    tier,
    regions: ['frame-left', 'frame-right', 'type', 'body'].map((id) => ({
      id,
      before: a.regions.find((r) => r.id === id),
      after: b.regions.find((r) => r.id === id),
    })),
  };
});
await writeJson(path.join(fixture, 'frame-selection-measurement.json'), {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  inputHash: card.inputHash,
  referenceHash: card.images.reference.sha256,
  check,
  alignmentHash: metrics.alignmentHash,
  comparisonSourceHash: metrics.metricSource,
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  coverage: metrics.summary,
  scores,
  note: 'Printing palette/type correction using the existing green plate. Body layout is identical; texture-driven score changes are not typography or placement gains. The original scan has large centered continuation lines after Flying; that layout class remains unresolved.',
});
const columns = [
  ['Scryfall scan', `../revised-fields/${old.images.reference.file}`],
  ['Previous blue frame', `../revised-fields/${old.images.inspect.file}`],
  ['Printed green frame', card.images.inspect.file],
];
await atomicWrite(
  path.join(root, 'revised-frame/index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised printing palette</title><style>body{font:16px/1.5 system-ui;background:#1c2024;color:#e4e8ea;max-width:1464px;margin:30px auto;padding:0 20px}h1{margin-bottom:8px}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}figure{margin:0}img{width:100%}figcaption{margin:10px 0}a{color:#b4d6dd}.note{border-left:3px solid #ddbb77;background:#332e24;padding:8px 14px}</style><h1>Serendib Efreet: the printed green frame</h1><p>The exact Revised scan uses a green frame and “Summon Efreet”. The renderer now accepts a separate printed frame palette: blue card colors and {2}{U} cost are preserved while the existing green asset is selected. No name-specific painting or scan alignment.</p><p>The other 305 Revised cards and 56 representatives from other sets preserve both full PNGs. All rules layouts remain unchanged.</p><p class="note">Still needs review: the scan’s large centered rules passage, weak title strokes, mana placement and exact frame texture. Body scores can change with the corrected background even though the text did not move; these are not typography gains.</p><div class="cards">${columns.map(([label, url]) => `<figure><figcaption>${label}</figcaption><a href="${url}"><img src="${url}" alt="Serendib Efreet — ${label}"></a></figure>`).join('')}</div><p><a href="../revised-fields/index.html">Eight original printing-field corrections</a> · <a href="report.html">All 306 card scores</a> · <a href="../../main-review/index.html">Selected comparisons against main</a></p><p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(
  JSON.stringify(
    {
      rendererHash: after.rendererHash,
      scores: scores.map((s) => ({
        tier: s.tier,
        regions: s.regions.map((r) => ({
          id: r.id,
          before: r.before.edgeF1?.[1],
          after: r.after.edgeF1?.[1],
        })),
      })),
    },
    null,
    2,
  ),
);
