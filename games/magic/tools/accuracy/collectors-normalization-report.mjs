// Archive numerical preparation without approving proposed wording or scan poses.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { hash, objectFile } from './common.mjs';

const [study, output] = process.argv.slice(2);
assert(output, 'Usage: collectors-normalization-report.mjs STUDY OUTPUT_GZ');
const sets = {};
for (const set of ['ced', 'cei']) {
  const dir = path.join(study, set + '-registration');
  const raw = await readFile(path.join(dir, 'scan-only-inputs.json'));
  const inputs = JSON.parse(raw);
  assert.equal(inputs.set, set);
  assert.equal(inputs.entries.length, 302);
  const runs = {};
  for (const [name, subdir] of [
    ['baseline', 'normalization'],
    ['expandedTop', 'normalization-v2'],
  ]) {
    const bytes = await readFile(path.join(dir, subdir, 'normalization.json'));
    const result = JSON.parse(bytes);
    const templates = JSON.parse(await readFile(path.join(dir, subdir, 'templates.json')));
    assert.equal(result.set, set);
    assert.equal(result.inputHash, hash(raw));
    assert.equal(result.templateHash, hash(JSON.stringify(templates)));
    assert.equal(result.rows.length, 302);
    const byId = new Map(result.rows.map((r) => [r.id, r]));
    assert.equal(byId.size, 302);
    for (const entry of inputs.entries) {
      const row = byId.get(entry.id);
      assert.equal(row.referenceHash, entry.reference.sha256);
      assert.equal(row.material, entry.material);
      assert.equal(row.methodHash, result.methodHash);
      assert.equal(row.templateHash, result.templateHash);
      assert.equal(row.contentIsolationPassed, true);
      assert.equal(hash(await readFile(objectFile(entry.reference))), entry.reference.sha256);
    }
    runs[name] = { sha256: hash(bytes), result, templates };
  }
  sets[set] = {
    inputHash: hash(raw),
    snapshotHash: inputs.snapshotHash,
    references: inputs.entries.map((e) => ({
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      material: e.material,
      referenceHash: e.reference.sha256,
    })),
    runs,
  };
}
const pairs = [];
for (const ced of sets.ced.references) {
  const candidates = sets.cei.references.filter(
    (r) => r.number === ced.number && r.name === ced.name,
  );
  assert.equal(candidates.length, 1);
  const cei = candidates[0];
  assert.equal(ced.referenceHash, cei.referenceHash);
  assert.equal(ced.material, cei.material);
  for (const name of ['baseline', 'expandedTop']) {
    const a = sets.ced.runs[name].result.rows.find((r) => r.id === ced.id);
    const b = sets.cei.runs[name].result.rows.find((r) => r.id === cei.id);
    for (const key of [
      'cohort',
      'model',
      'accepted',
      'parameters',
      'transform',
      'fit',
      'validation',
      'certification',
    ])
      assert.deepEqual(
        a[key],
        b[key],
        'Identical front references must replay identically: ' + key,
      );
  }
  pairs.push({ ced: ced.id, cei: cei.id, referenceHash: ced.referenceHash });
}
assert.equal(new Set(pairs.map((p) => p.referenceHash)).size, 302);
const decisions = [
  'Black Knight',
  'Hypnotic Specter',
  'Sacrifice',
  'Scavenging Ghoul',
  'Sedge Troll',
];
const out = {
  schema: 1,
  status: 'numerical-preparation-not-approved-for-renderer-calibration',
  scope:
    '604 printing IDs, 302 distinct cached front images. CED/CEI are duplicate observations, not independent validation. Original-wording proposals require target-scan review. Expanded-band results are diagnostic only; no poses or renderer values are promoted.',
  sources: { toolHash: hash(await readFile(new URL(import.meta.url))) },
  visualReview: {
    scope:
      'Raw boundary strips from five remaining rejected references and one accepted reference for each of seven materials; not a census certification.',
    expandedTop:
      'The old top window ended at y30 and clipped the colored frame edge around y31–33. The y34 window includes that edge in the inspected strips. No title or mana ink enters those inspected top strips.',
    residual:
      'The remaining five have strong top/right agreement but weak dark bottom profiles. White bottom corner marks are visible. Keep rejected pending an independently validated corner or boundary certificate; do not label these bad scans or force acceptance.',
    rejectedNames: decisions,
  },
  summary: Object.fromEntries(
    Object.entries(sets).map(([set, data]) => {
      const a = data.runs.baseline.result,
        b = data.runs.expandedTop.result;
      assert.deepEqual(
        b.rows
          .filter((r) => !r.accepted)
          .map((r) => r.name)
          .sort(),
        [...decisions].sort(),
      );
      const before = new Map(a.rows.map((r) => [r.id, r]));
      return [
        set,
        {
          inventory: 302,
          baseline: a.summary,
          expandedTop: b.summary,
          newlyAccepted: b.rows.filter((r) => r.accepted && !before.get(r.id).accepted).length,
          newlyRejected: b.rows.filter((r) => !r.accepted && before.get(r.id).accepted).length,
        },
      ];
    }),
  ),
  duplicateFronts: pairs,
  sets,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(out) + '\n'), { mtime: 0 }));
console.log(JSON.stringify(out.summary));
