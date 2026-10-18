import { preProfileConsolidationSource } from './magic-profile-source-guard.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
export function earlyReprintFooterProof() {
  verified ??= (async () => {
    const extension = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-footer-compatibility.json'),
    );
    const bytes = await readFile('games/magic/fixtures/accuracy/early-reprint-footer.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.scope, {
      sets: ['fem', '4ed', 'chr'],
      cards: 690,
      scored: 683,
      excluded: 7,
      profiles: 9,
    });
    assert.deepEqual(evidence.native.summary, { cards: 690, exact: 690, outside: 0 });
    const previous = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-type.json'),
    );
    const baseline = new Map(previous.native.rows.map((r) => [r.id, r.candidate]));
    const wording = new Map(evidence.wording.lineage.map((r) => [r.id, r]));
    const scored = new Map(evidence.metrics.rows.map((r) => [r.id, r]));
    assert.equal(wording.size, 690);
    assert.equal(scored.size, 683);
    assert.equal(evidence.native.rows.length, 690);
    assert.equal(new Set(evidence.native.rows.map((r) => r.id)).size, 690);
    for (const row of evidence.native.rows) {
      const words = wording.get(row.id);
      assert.equal(words.before, baseline.get(row.id));
      assert.equal(row.before, words.current);
      if (words.intermediate !== words.current)
        assert.equal(row.id, 'ffd4921f-cda5-4318-837d-a3fe4f0d9362');
      assert.equal(words.outside, 0);
      assert.equal(words.replayDelta, 0);
      assert.equal(row.prototype, row.candidate);
      assert.equal(row.changedBytes, 0);
      assert.equal(row.maxDelta, 0);
      assert.equal(row.outside, 0);
      assert.ok(row.footerPixels > 0);
      if (scored.has(row.id)) assert.equal(row.strip, scored.get(row.id).nativeStripHash);
    }
    assert.equal(evidence.controls.cards, 98);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 98);
    const controls = new Map(previous.controls.rows.map((r) => [r.id, r.sha256]));
    for (const row of evidence.controls.rows) {
      assert.equal(row.before, controls.get(row.id));
      assert.equal(row.before, row.sha256);
    }
    assert.equal(new Set(evidence.controls.rows.map((r) => r.id)).size, 98);
    assert.equal(evidence.rendererHash, evidence.native.guards.sourceHash);
    assert.equal(evidence.rendererHash, evidence.controls.sourceHashes[1]);
    assert.equal(evidence.native.guards.baseline, previous.native.guards.candidate);
    assert.equal(evidence.metrics.validationKind, 'reused');
    assert.equal(evidence.metrics.excluded.length, 7);
    for (const row of evidence.metrics.excluded) {
      assert.ok(baseline.has(row.id));
      assert.ok(!scored.has(row.id));
    }
    for (const group of Object.values(evidence.metrics.materials))
      assert.ok(group.combined > group.before);
    assert.deepEqual(
      evidence.outliers.rows.map((r) => r.id + '/' + r.role).sort(),
      evidence.metrics.rows
        .flatMap((r) =>
          r.values.filter((v) => v.after[0] < v.before[0]).map((v) => r.id + '/' + v.role),
        )
        .sort(),
    );
    assert.equal(evidence.outliers.rows.length, 18);
    assert.equal(evidence.wording.artistRows.length, 690);
    assert.equal(evidence.wording.statsRows.length, 333);
    assert.equal(evidence.wording.artistRows.filter((r) => r.changedFromCurrent).length, 61);
    assert.equal(evidence.wording.statsRows.filter((r) => r.changed).length, 1);
    assert.deepEqual(extension.dependencies, evidence.sourceGuards);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await preProfileConsolidationSource(file)),
        expected,
        'Unreviewed footer dependency: ' + file,
      );
    return extension;
  })();
  return verified;
}

/** Recover the exact pre-footer painter and wording catalogs. Every historical
 * receipt keeps its original bytes; the new layer proves only this footer delta. */
export async function preEarlyReprintFooterSource(file) {
  const bytes = await preProfileConsolidationSource(file),
    extension = await earlyReprintFooterProof();
  const change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed footer integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-footer reconstruction failed: ' + file);
  return before;
}
