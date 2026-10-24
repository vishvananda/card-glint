// Review corner proposals against all four independent source-frame sides.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const input = base + 'abu-vertical-anchor-proposals-v1.json.gz',
  bytes = await readFile(input),
  p = JSON.parse(gunzipSync(bytes));
assert.equal(
  hash(await readFile(new URL('./abu-anchor-refit.mjs', import.meta.url))),
  p.source.toolHash,
);
assert.equal(
  hash(await readFile(new URL('./scan-vertical-anchors.mjs', import.meta.url))),
  p.source.kernelHash,
);
const policy = {
  minimumFrameSide: 0.6,
  establishedPriorBottom: 0.7,
  maximumEstablishedBottomLoss: 0.03,
};
const rows = p.rows.map((r) => {
  assert.equal(r.proposal.supports.length, 3);
  assert.equal(r.proposal.priorSupport.length, 3);
  assert.equal(r.negative.length, 8);
  assert(r.negative.every((n) => !n.accepted));
  const groups = r.proposal.supports.map((after, i) => {
    const before = r.proposal.priorSupport[i];
    const minimumSide = Math.min(...Object.values(after.sides));
    const bottomLoss = before.sides.bottom - after.sides.bottom;
    const minimumPassed = minimumSide >= policy.minimumFrameSide;
    const preservedEstablishedBottom =
      before.sides.bottom < policy.establishedPriorBottom ||
      bottomLoss <= policy.maximumEstablishedBottomLoss;
    return {
      index: i,
      priorSides: before.sides,
      proposedSides: after.sides,
      minimumSide,
      bottomLoss,
      minimumPassed,
      preservedEstablishedBottom,
      accepted: minimumPassed && preservedEstablishedBottom,
    };
  });
  const frameSupported = groups.every((g) => g.accepted);
  return {
    id: r.id,
    set: r.set,
    name: r.name,
    referenceHash: r.referenceHash,
    priorPoseHash: r.priorPoseHash,
    originalProposalStatus: r.status,
    cornerCertificateAccepted: r.after.certificate.accepted,
    frameSupported,
    adopted: false,
    status: frameSupported ? 'requires-further-review' : 'withheld-source-anchor-conflict',
    reason:
      'Corner agreement alone cannot replace a source-frame fit when another frame side loses support. Keep the current primary pose; review the corner/frame relationship separately. No renderer pixels or whole-card score choose this decision.',
    groups,
    negativeControls: r.negative,
  };
});
assert.equal(rows.length, 3);
assert(rows.every((r) => r.status === 'withheld-source-anchor-conflict'));
const result = {
  schema: 1,
  status: 'source-anchor-review-no-pose-adoption',
  scope:
    'Three diagnostic corner proposals. All four source-frame sides participate in review; no printings, native pixels, score eligibility, metric or deployed normalization values change.',
  source: {
    file: input,
    sha256: hash(bytes),
    proposalToolHash: p.source.toolHash,
    kernelHash: p.source.kernelHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  policy,
  rows,
};
const output = base + 'abu-anchor-source-review.json.gz';
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }));
console.log(
  JSON.stringify(
    rows.map((r) => ({
      name: r.name,
      status: r.status,
      bottomLoss: r.groups.map((g) => g.bottomLoss),
    })),
  ),
);
