// Promote only scan-only recoveries backed by current controls and frozen parents.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
const [inputFile, parentFile, proposalFile, auditFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS PARENT_POSES RGB_PROPOSAL AUDIT NEW_POSES');
await fs.access(out).then(
  () => {
    throw Error('Output exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const [ib, pb, rb, ab] = await Promise.all(
  [inputFile, parentFile, proposalFile, auditFile].map((f) => fs.readFile(f)),
);
const [input, parent, proposal, audit] = [ib, pb, rb, ab].map((b) => JSON.parse(b));
assert.equal(audit.syntheticControlsPassed, true);
assert.equal(audit.source.inputs, hash(ib));
assert.equal(audit.source.parent, hash(pb));
assert.equal(audit.source.proposal, hash(rb));
assert.equal(proposal.inputHash, hash(ib));
assert.equal(proposal.parentPoseHash, hash(pb));
assert.equal(input.entries.length, proposal.rows.length);
for (const [n, sha] of Object.entries(proposal.sources))
  assert.equal(hash(await fs.readFile(new URL(n, import.meta.url))), sha);
for (const m of Object.values(audit.materials)) {
  assert(m.controls >= 3);
  assert(m.medianDrift <= 0.5);
  assert(m.p90Drift <= 1.25);
  assert(m.maximumDrift <= 1.5);
}
const rows = proposal.rows.map((row) => {
  const old = parent.rows.find((r) => r.id === row.id),
    control = audit.rows.find((r) => r.id === row.id);
  assert.equal(row.referenceHash, old.referenceHash);
  assert(row.accepted, 'Recovery remains rejected');
  if (old.accepted) {
    assert.deepEqual(row.transform, old.transform);
    return { ...old, acceptanceSource: 'frozen-parent', parentPoseHash: hash(pb) };
  }
  assert.equal(control.status, 'recovered');
  assert.deepEqual(control.transform, row.transform);
  assert(row.validation.rms <= 0.8);
  return { ...row, acceptanceSource: 'source-audited-rgb-recovery', auditHash: hash(ab) };
});
await writeJson(out, {
  ...proposal,
  status: 'frozen-scan-only-comparison-poses',
  scope:
    proposal.scope +
    ' Recovery adoption is bound to synthetic negative/positive controls and per-material known-good scan comparisons. Accepted parent transforms remain unchanged. No renderer pixel or text was fitted.',
  adoption: {
    auditHash: hash(ab),
    proposalHash: hash(rb),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    recovered: rows.filter((r) => r.acceptanceSource === 'source-audited-rgb-recovery').length,
  },
  summary: { total: rows.length, accepted: rows.length, rejected: 0 },
  rows,
});
console.log(
  input.set,
  rows.length,
  'approved scan-only poses;',
  rows.filter((r) => r.acceptanceSource === 'source-audited-rgb-recovery').length,
  'recovered.',
);
