// Exact source reconstruction after the reviewed crown/land-source adoption.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const RECEIPT = 'ce39534adaf2398428214f81be3e1e80eb1548ec6b65b274e53ec5c79af43ae1';
let checked;
export function modernFrameSourceAncestry() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/m21/frame-source-compatibility.json',
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed modern frame-source review');
    const p = JSON.parse(bytes);
    for (const parent of p.parents) assert.equal(hash(await readFile(parent.file)), parent.sha256);
    for (const [file, e] of Object.entries(p.files))
      assert.equal(hash(await readFile(file)), e.after, 'Unreviewed modern frame source: ' + file);
    const summaryBytes = await readFile(p.evidence.file);
    assert.equal(hash(summaryBytes), p.evidence.sha256);
    const summary = JSON.parse(summaryBytes);
    const unpack = async (e) => {
      const compressed = await readFile(e.file);
      assert.equal(hash(compressed), e.sha256);
      const raw = gunzipSync(compressed);
      assert.equal(hash(raw), e.contentSha256);
      return JSON.parse(raw);
    };
    const native = await unpack(summary.evidence);
    assert.deepEqual(native.definition, summary.definition);
    assert.deepEqual(native.summary, summary.summary);
    assert.equal(native.definition.afterRenderer, p.rendererHash);
    assert.equal(native.definition.beforeRenderer, p.beforeRendererHash);
    assert.equal(hash(await readFile(summary.toolFile)), native.definition.toolHash);
    assert.deepEqual(native.summary, {
      faces: 297,
      unchangedFaces: 294,
      changedFaces: 3,
      exactIndependentProposals: 3,
      unchangedEtchings: 297,
      alphaChanges: 0,
    });
    assert.equal(native.rows.length, 297);
    assert.equal(new Set(native.rows.map((r) => r.id)).size, 297);
    const proposalParent = p.parents.find((e) =>
      e.file.endsWith('/source-and-land-text-proposals.json'),
    );
    assert(proposalParent);
    const proposals = JSON.parse(await readFile(proposalParent.file));
    const proposalsById = new Map(proposals.sourceTrials.rows.map((r) => [r.id, r]));
    for (const row of native.rows) {
      assert.equal(row.alphaChanges, 0);
      assert.equal(row.before.etching, row.after.etching);
      if (row.changedPixels) {
        const prior = proposalsById.get(row.id);
        assert(prior && row.proposalExact);
        assert.equal(row.after.face, prior.afterHash);
        assert.equal(row.before.face, prior.beforeHash);
      } else assert.deepEqual(row.before, row.after);
    }
    const collateral = await unpack(summary.collateral.evidence);
    assert.deepEqual(collateral.faults, []);
    assert.equal(collateral.source.base, p.base);
    assert.equal(collateral.source.afterRenderer, p.rendererHash);
    assert.equal(hash(await readFile(summary.collateralToolFile)), collateral.source.tool);
    assert.equal(hash(await readFile(summary.proposalToolFile)), collateral.source.proposalTool);
    assert.equal(collateral.cases.length, 287);
    assert.equal(collateral.rows.length, 1722);
    for (const row of collateral.rows) {
      assert.equal(row.scope, 'independent-frame-source-proposal');
      assert.deepEqual(row.before, row.after, 'Frame-source collateral drift');
    }
    return p;
  })());
}
/** Known historical versions pass only to their original stricter guards.
 * M21 and affected modern owners must still retain their current fingerprints. */
export async function preModernFrameSource(file, bytes) {
  const p = await modernFrameSourceAncestry(),
    e = p.files[file];
  if (!e) return bytes;
  const digest = hash(bytes);
  if (digest === e.before || e.historicalHashes.includes(digest)) return bytes;
  assert.equal(digest, e.after, 'Unreviewed modern frame source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of e.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const restored = Buffer.from(lines.join(''));
  assert.equal(hash(restored), e.before, 'Modern frame-source reconstruction failed: ' + file);
  return restored;
}
