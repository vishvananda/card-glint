// Exact reconstruction for historical receipts; it never certifies a target set.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
import { preModernStockSource } from './modern-stock-ancestry.mjs';
const RECEIPT = 'd844e6ac1b315fb24b7a8924f2865bb7d386f3a1029ba93c19acbdb9570ed929';
let checked;
export function modernDefaultAncestry() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/m21/modern-default-source-compatibility.json',
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed modern default review');
    const p = JSON.parse(bytes);
    if (p.parent)
      assert.equal(
        hash(await readFile(p.parent.file)),
        p.parent.sha256,
        'Changed prior modern default review',
      );
    for (const [file, e] of Object.entries(p.files))
      assert.equal(
        hash(await preModernStockSource(file, await readFile(file))),
        e.after,
        'Unreviewed modern defaults source: ' + file,
      );
    for (const [file, digest] of Object.entries(p.newModules))
      assert.equal(
        hash(await readFile(file)),
        digest,
        'Unreviewed modern defaults module: ' + file,
      );
    const summary = await readFile(p.evidence.file);
    assert.equal(hash(summary), p.evidence.sha256);
    const review = JSON.parse(summary),
      compressed = await readFile(review.evidence.file);
    assert.equal(hash(compressed), review.evidence.sha256);
    const raw = gunzipSync(compressed);
    assert.equal(hash(raw), review.evidence.contentSha256);
    const evidence = JSON.parse(raw);
    assert.equal(evidence.source.base, p.base);
    assert.deepEqual(evidence.faults, []);
    assert.equal(hash(await readFile(review.toolFile)), evidence.source.tool);
    assert.equal(
      hash(await readFile('games/magic/tools/accuracy/modern-default-proposal-study.mjs')),
      evidence.source.proposalTool,
    );
    assert.equal(evidence.rows.length, review.summary.pairs);
    assert(evidence.rows.some((r) => r.scope === 'unchanged-pre-default'));
    assert(evidence.rows.some((r) => r.scope === 'independent-M21-style-proposal'));
    for (const r of evidence.rows) {
      assert.deepEqual(r.before, r.after, 'Default adoption differs from its reference/proposal');
      if (r.scope === 'unchanged-pre-default') assert.deepEqual(r.old, r.after);
    }
    const exact = await readFile(p.m21Evidence.file);
    assert.equal(hash(exact), p.m21Evidence.sha256);
    const native = JSON.parse(exact);
    assert.equal(native.summary.faces, 297);
    assert.equal(native.summary.exactFaces, 297);
    assert.equal(native.summary.exactEtchings, 297);
    assert.equal(native.definition.afterRenderer, p.rendererHash);
    const nativeCompressed = await readFile(native.evidence.file);
    assert.equal(hash(nativeCompressed), native.evidence.sha256);
    const nativeRaw = gunzipSync(nativeCompressed);
    assert.equal(hash(nativeRaw), native.evidence.contentSha256);
    const nativeProof = JSON.parse(nativeRaw);
    assert.equal(nativeProof.rows.length, 297);
    assert.equal(new Set(nativeProof.rows.map((r) => r.id)).size, 297);
    return p;
  })());
}
export async function preModernDefaultSource(file, bytes) {
  const p = await modernDefaultAncestry(),
    e = p.files[file];
  // Older exact bytes still belong to their original guard. Only the reviewed
  // post-default refinement is stripped before reconstructing that receipt.
  if (e && hash(bytes) === e.before) return bytes;
  try {
    bytes = await preModernStockSource(file, bytes);
  } catch (error) {
    throw new Error('Unreviewed modern defaults source: ' + file, { cause: error });
  }
  if (p.newModules[file]) {
    assert.equal(hash(bytes), p.newModules[file], 'Unreviewed modern defaults module: ' + file);
    return bytes;
  }
  if (!e) return bytes;
  if (hash(bytes) === e.before) return bytes;
  assert.equal(hash(bytes), e.after, 'Unreviewed modern defaults source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of e.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const restored = Buffer.from(lines.join(''));
  assert.equal(hash(restored), e.before);
  return restored;
}
/** New modern defaults invalidate affected modern receipts. Old families and
 * the proven-identical ordinary M21 census retain the prior dependency path. */
export async function modernDefaultProfileSource(file, bytes, set, group) {
  const p = await modernDefaultAncestry();
  if (set?.toLowerCase() === 'm21') return { bytes, changedProfile: false };
  const changed = await modernDefaultSetAffected(set, group);
  if (changed && (p.files[file] || p.newModules[file])) return { bytes, changedProfile: true };
  return { bytes: await preModernDefaultSource(file, bytes), changedProfile: false };
}

/** Reference bytes and original wording stay reusable; report callers decide
 * which rendered tasks need a new fit. Modern retro/2003 groups stay untouched. */
export async function modernDefaultSetAffected(set, group) {
  const p = await modernDefaultAncestry(),
    code = set?.toLowerCase() ?? '';
  if (code === 'm21' || p.preM15Sets.includes(code)) return false;
  if (group && group.frame !== '2015') return false;
  return !['flip', 'leveler'].includes(group?.layout);
}
