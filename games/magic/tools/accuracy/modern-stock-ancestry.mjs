import { preModernFrameSource } from './modern-frame-source-ancestry.mjs';
// Strip only the reviewed stock/material-policy delta for historical receipts.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const RECEIPT = '3440da1b1f624c16e98900aad8be22f3041b1df24a6c0144094796acdcdf3b72';
let checked;
export function modernStockAncestry() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/m21/stock-source-compatibility.json',
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed modern stock review');
    const p = JSON.parse(bytes);
    for (const parent of p.parents)
      assert.equal(hash(await readFile(parent.file)), parent.sha256, 'Changed modern stock parent');
    for (const [file, e] of Object.entries(p.files))
      assert.equal(
        hash(await preModernFrameSource(file, await readFile(file))),
        e.after,
        'Unreviewed modern stock source: ' + file,
      );
    const summaryBytes = await readFile(p.evidence.file);
    assert.equal(hash(summaryBytes), p.evidence.sha256);
    const summary = JSON.parse(summaryBytes);
    assert.equal(summary.definition.afterRenderer, p.rendererHash);
    assert.equal(summary.definition.beforeRenderer, p.beforeRendererHash);
    assert.equal(summary.summary.faces, 297);
    assert.equal(summary.summary.unchangedFaces, 216);
    assert.equal(summary.summary.changedFaces, 81);
    assert.equal(summary.summary.unchangedEtchings, 297);
    assert.equal(summary.summary.alphaChanges, 0);
    assert.equal(summary.summary.stock.nonfoil, 292);
    assert.equal(summary.summary.stock.changedNonfoil, 76);
    assert.equal(summary.summary.stock.afterMeanDistance, 0);
    const compressed = await readFile(summary.evidence.file);
    assert.equal(hash(compressed), summary.evidence.sha256);
    const raw = gunzipSync(compressed);
    assert.equal(hash(raw), summary.evidence.contentSha256);
    const evidence = JSON.parse(raw);
    assert.equal(hash(await readFile(summary.toolFile)), evidence.definition.toolHash);
    assert.equal(evidence.rows.length, 297);
    assert.equal(new Set(evidence.rows.map((r) => r.id)).size, 297);
    assert.deepEqual(evidence.summary, summary.summary);
    assert.equal(evidence.rows.filter((r) => r.changedPixels).length, 81);
    for (const r of evidence.rows) {
      assert.equal(r.alphaChanges, 0);
      assert.equal(r.etchingUnchanged, true);
      assert.equal(r.before.etching, r.after.etching);
      if (!r.changedPixels) assert.equal(r.before.face, r.after.face);
      if (r.nonfoilEligible) assert.deepEqual(r.stock.after, r.stock.reference);
    }
    assert.equal(evidence.policy.definition.renderer, p.rendererHash);
    assert.equal(hash(await readFile(summary.policyToolFile)), evidence.policy.definition.tool);
    assert.equal(evidence.policy.summary.faces, 297);
    assert.equal(evidence.policy.rows.length, 297);
    assert.equal(new Set(evidence.policy.rows.map((r) => r.id)).size, 297);
    assert.equal(evidence.policy.summary.exactNamedFaces, 297);
    assert.equal(evidence.policy.summary.exactNamedEtchings, 297);
    assert.equal(evidence.policy.summary.resolvedPolicies, 4);
    for (const r of evidence.policy.rows) {
      assert.deepEqual(r.production, r.named);
      assert.equal(r.resolutionEqual, true);
    }
    return p;
  })());
}
export async function preModernStockSource(file, bytes) {
  const p = await modernStockAncestry(),
    e = p.files[file];
  if (e && hash(bytes) === e.before) return bytes;
  try {
    bytes = await preModernFrameSource(file, bytes);
  } catch (error) {
    throw new Error('Unreviewed modern stock source: ' + file, { cause: error });
  }
  if (!e || hash(bytes) === e.before) return bytes;
  assert.equal(hash(bytes), e.after, 'Unreviewed modern stock source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of e.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const restored = Buffer.from(lines.join(''));
  assert.equal(hash(restored), e.before, 'Modern stock reconstruction failed: ' + file);
  return restored;
}
