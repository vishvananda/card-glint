import { eighthProfileSource } from './eighth-source-ancestry.mjs';
import {
  modernFrameSourceAncestry,
  preModernFrameSource,
} from './modern-frame-source-ancestry.mjs';
import { preModernDefaultSource, modernDefaultProfileSource } from './modern-default-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';

const RECEIPT = 'bcabcd4c3225c9ee6d19349ced38538d2936df22e37a70d5874d6f3a85d6be79';
let checked;
/** Evidence for exact historical reconstruction, not current fit approval. */
export async function m21StyleAncestry() {
  return (checked ??= (async () => {
    const raw = await readFile('games/magic/fixtures/accuracy/m21/style-source-compatibility.json');
    assert.equal(hash(raw), RECEIPT, 'Changed M21 style compatibility receipt');
    const p = JSON.parse(raw);
    assert.equal(
      hash(await readFile(p.parent.file)),
      p.parent.sha256,
      'Changed M21 parent receipt',
    );
    assert.deepEqual(p.changedSets, ['m21']);
    const summaryBytes = await readFile(p.evidence.file);
    assert.equal(hash(summaryBytes), p.evidence.sha256);
    const summary = JSON.parse(summaryBytes);
    const compressed = await readFile(summary.evidence.file);
    assert.equal(hash(compressed), summary.evidence.sha256);
    const evidenceBytes = gunzipSync(compressed);
    assert.equal(hash(evidenceBytes), summary.evidence.contentSha256);
    const evidence = JSON.parse(evidenceBytes);
    assert.equal(evidence.source.base, p.base);
    assert.equal(evidence.cases.length, 250);
    assert.equal(evidence.rows.length, 1500);
    assert.equal(new Set(evidence.cases.map((c) => c.id)).size, 250);
    assert(evidence.cases.every((c) => c.face.setCode?.toLowerCase() !== 'm21'));
    assert.deepEqual(evidence.faults, []);
    for (const row of evidence.rows) {
      assert.deepEqual(row.before, row.after, 'Changed unaffected native case');
      for (const digest of Object.values(row.before)) assert.match(digest, /^[a-f0-9]{64}$/);
    }
    assert.equal(
      hash(
        await readFile(
          summary.toolFile ?? 'games/magic/tools/accuracy/m21-unaffected-native-review.mjs',
        ),
      ),
      evidence.source.tool,
    );
    for (const [file, digest] of Object.entries(p.newModules))
      assert.equal(
        hash(await preModernDefaultSource(file, await readFile(file))),
        digest,
        'Unreviewed M21 style module: ' + file,
      );
    for (const [file, change] of Object.entries(p.files))
      assert.equal(
        hash(await preModernDefaultSource(file, await readFile(file))),
        change.after,
        'Unreviewed M21 style source: ' + file,
      );
    return p;
  })());
}
/** Reverse only exact owned edits. Known older bytes pass to their original
 * guards; arbitrary changes still reject. This helper cannot approve M21 scores. */
export async function preM21StyleSource(file, bytes) {
  const p = await m21StyleAncestry();
  const historical = p.files[file],
    historicalDigest = hash(bytes);
  if (
    historical &&
    (historicalDigest === historical.before ||
      historical.historicalHashes?.includes(historicalDigest))
  )
    return bytes;
  try {
    bytes = await preModernDefaultSource(file, bytes);
  } catch (error) {
    throw new Error(
      (p.newModules[file] ? 'Unreviewed M21 style module: ' : 'Unreviewed M21 style source: ') +
        file,
      { cause: error },
    );
  }
  if (p.newModules[file]) {
    assert.equal(hash(bytes), p.newModules[file], 'Unreviewed M21 style module: ' + file);
    return bytes;
  }
  const e = p.files[file];
  if (!e) return bytes;
  const digest = hash(bytes);
  if (digest === e.before || e.historicalHashes?.includes(digest)) return bytes;
  assert.equal(digest, e.after, 'Unreviewed M21 style source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of e.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), e.before, 'M21 historical source reconstruction failed: ' + file);
  return before;
}

/** An affected set keeps its actual new source fingerprints. Unrelated sets
 * may use the independently tested historical dependency path. */
export async function m21StyleProfileSource(file, bytes, set, group) {
  const eighth = await eighthProfileSource(file, bytes, set, group);
  if (eighth.changedProfile) return eighth;
  bytes = eighth.bytes;
  const frame = await modernFrameSourceAncestry();
  if (frame.files[file]) {
    await preModernFrameSource(file, bytes);
    if (set?.toLowerCase() === 'm21' && hash(bytes) === frame.files[file].after)
      return { bytes, changedProfile: true };
  }
  const proof = await m21StyleAncestry(),
    entry = proof.files[file],
    digest = hash(bytes);
  if (entry && (digest === entry.before || entry.historicalHashes?.includes(digest)))
    return { bytes, changedProfile: set?.toLowerCase() === 'm21' };
  const defaults = await modernDefaultProfileSource(file, bytes, set, group);
  if (defaults.changedProfile) return defaults;
  bytes = defaults.bytes;
  const p = await m21StyleAncestry(),
    restored = await preM21StyleSource(file, bytes);
  if (set?.toLowerCase() === 'm21' && (p.files[file] || p.newModules[file]))
    return { bytes, changedProfile: true };
  return { bytes: restored, changedProfile: false };
}
