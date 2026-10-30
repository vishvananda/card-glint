import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root, hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  onsSymbolStatsDelta,
  onsSymbolStatsAffected,
  onsSymbolStatsHistoricalFiles,
  onsSymbolStatsRuntimeParent,
  preOnsSymbolStatsSource,
} from '../games/magic/tools/accuracy/ons-symbol-stats-ancestry.mjs';
import {
  preModernSymbolPlacementSource,
  originalSymbolPlacementRuntimeParent,
} from '../games/magic/tools/accuracy/modern-symbol-placement-ancestry.mjs';
import { preModernSymbolReportSource } from '../games/magic/tools/accuracy/modern-symbol-report-ancestry.mjs';
const p = await onsSymbolStatsDelta();
assert.equal(
  await originalSymbolPlacementRuntimeParent(await sourceHash(path.join(root, 'games/magic/src'))),
  p.afterRenderer,
);
const entries = (
  await fs.readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true })
)
  .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.join(e.parentPath, e.name))
  .sort();
const projected = [];
for (const file of await onsSymbolStatsHistoricalFiles(entries)) {
  const key = path.relative(root, file);
  projected.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(await preOnsSymbolStatsSource(key, await fs.readFile(file))),
  ]);
}
assert.equal(hash(JSON.stringify(projected)), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await preModernSymbolPlacementSource(
    file,
    await preModernSymbolReportSource(file, await fs.readFile(path.join(root, file))),
  );
  assert.equal(hash(bytes), e.after, file);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unrelated edit\n')]);
  assert.equal(await preOnsSymbolStatsSource(file, foreign), foreign);
}
for (const [file, expected] of Object.entries(p.tools))
  assert.equal(
    hash(await preModernSymbolReportSource(file, await fs.readFile(path.join(root, file)))),
    expected,
    file,
  );
for (const set of ['lea', 'leb', '2ed', 'arn', 'atq', 'mir', 'ody', '7ed', '8ed', 'm21'])
  assert.equal(await onsSymbolStatsRuntimeParent(p.afterRenderer, set), p.beforeRenderer);
assert.equal(await onsSymbolStatsRuntimeParent(p.afterRenderer, 'ons'), p.afterRenderer);
assert.equal(await onsSymbolStatsRuntimeParent(p.afterRenderer), p.afterRenderer);
assert.equal(await onsSymbolStatsRuntimeParent('f'.repeat(64), 'mir'), 'f'.repeat(64));
// Original study byte hashes are provenance. Do not reserialize Python/compact JSON
// to claim byte identity; the pinned receipt above protects the embedded records.
for (const value of Object.values(p.studies)) assert.match(value.sha256, /^[a-f0-9]{64}$/);
const filled = p.studies['stats-final-proof.json'].data;
assert.equal(filled.groups.all.count, 174);
assert.equal(filled.groups.calibration.count, 75);
assert.equal(filled.groups.validation.count, 91);
assert.equal(filled.groups['reused-development'].count, 8);
for (const row of filled.rows) assert(row.after > row.before, row.name);
for (const value of Object.values(filled.negativeControls)) assert(value < filled.groups.all.after);
const pigment = p.studies['generic-paper-v2.json'].data;
assert.equal(pigment.rows.length, 274);
assert.equal(pigment.unavailable.length, 0);
for (const material of Object.values(pigment.groups))
  for (const cohort of Object.values(material.cohorts)) assert(cohort.after < cohort.before);
for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
  const old = p.captures.before.rows.map((r) => ({
    id: r.id,
    referenceHash: r.referenceHash,
    artHash: r.artHash,
    inputHash: r.modes[mode].inputHash,
    layout: r.modes[mode].layout,
  }));
  const next = p.captures.after.rows.map((r) => ({
    id: r.id,
    referenceHash: r.referenceHash,
    artHash: r.artHash,
    inputHash: r.modes[mode].inputHash,
    layout: r.modes[mode].layout,
  }));
  assert.deepEqual(next, old);
}
for (const side of ['before', 'after'])
  assert.equal(hash(JSON.stringify(p.captures[side], null, 2) + '\n'), p.captures[side + 'Hash']);
assert.equal(p.scores.before.all.acceptedPoses, 350);
assert.equal(p.scores.after.all.acceptedPoses, 350);
assert(p.scores.after.all.acceptedPoseMean100 > p.scores.before.all.acceptedPoseMean100);
assert.equal(p.scores.after.L.acceptedPoseMean100, p.scores.before.L.acceptedPoseMean100);
console.log(
  'ONS: 1,400 native pairs confined to cost paper/P/T, 574 unchanged foreign controls, exact source ancestry, filled-ink negative controls, frozen Original inputs/poses and full-card improvement pass.',
);

const ids = p.native.rows.filter((r) => r.mode === 'original');
for (const [task, key, count] of [
  ['manaColor', 'genericPaperPixels', 272],
  ['stats', 'statsPixels', 174],
  ['fullCard', 'pixels', 291],
  ['release', 'pixels', 291],
]) {
  let changed = 0;
  for (const row of ids) {
    const group = { printingIds: [row.id] };
    const affected = await onsSymbolStatsAffected('ons', task, false, group);
    assert.equal(affected, row[key] > 0);
    assert.equal(
      await onsSymbolStatsRuntimeParent(p.afterRenderer, 'ons', task, false, group),
      affected ? p.afterRenderer : p.beforeRenderer,
    );
    assert.equal(await onsSymbolStatsAffected('ons', task, true, group), false);
    if (affected) changed++;
  }
  assert.equal(changed, count);
}
for (const task of [
  'rules',
  'headings',
  'artist',
  'footer',
  'frameGeometry',
  'frameColor',
  'manaGeometry',
])
  assert.equal(await onsSymbolStatsRuntimeParent(p.afterRenderer, 'ons', task), p.beforeRenderer);
