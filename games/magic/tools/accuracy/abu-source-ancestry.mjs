import assert from 'node:assert/strict';
import { preProfilePreparationSource } from './profile-preparation-ancestry.mjs';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { preUnlimitedEmptySource } from './unlimited-empty-ancestry.mjs';
import { hash } from './common.mjs';
import { preOracleInsetSource } from './alpha-oracle-ancestry.mjs';
import { preM21BodyFieldSource } from './m21-body-field-ancestry.mjs';
export const EARLY_SOURCE_RECEIPT =
  'ffdbdec5616e31f5b136399deadd7f4ecf6095806e9c10e47a21920e001d8a11';
let checked;
/** Restore the immutable 0.6.5 ancestor for historical evidence only. Alpha,
 * Beta and Unlimited measurements cannot reuse their older renderer revisions. */
async function earlyProof() {
  return await (checked ??= readFile(
    'games/magic/fixtures/accuracy/early-through-fourth/source-proof.json',
  ).then(async (raw) => {
    assert.equal(hash(raw), EARLY_SOURCE_RECEIPT);
    const p = JSON.parse(raw);
    assert.deepEqual(p.affectedSets, ['lea', 'leb', '2ed']);
    for (const [name, digest] of Object.entries(p.dependencies))
      assert.equal(
        hash(await preOracleInsetSource(name, await readFile(name))),
        digest,
        'Changed reviewed early source: ' + name,
      );
    const evidence = {};
    for (const [role, ref] of Object.entries(p.evidence)) {
      const b = await readFile(ref.file);
      assert.equal(hash(b), ref.sha256, 'Changed early source evidence: ' + ref.file);
      evidence[role] = JSON.parse(ref.file.endsWith('.gz') ? gunzipSync(b) : b);
    }
    const alpha = evidence.alphaMeasure;
    assert.equal(alpha.summary.total, 295);
    assert.equal(alpha.summary.changed, 4);
    assert.equal(alpha.summary.unchanged, 291);
    assert.equal(alpha.summary.regressed, 0);
    assert(
      alpha.rows.filter((r) => r.changed).every((r) => r.outsideRules === 0 && r.delta100 > 0),
    );
    assert.equal(evidence.alphaNative.rows.length, 295);
    assert.equal(evidence.betaParity.total, 10);
    assert.equal(evidence.betaParity.changed, 2);
    assert.equal(evidence.betaParity.unchanged, 8);
    assert(evidence.betaParity.rows.every((r) => r.exactPriorNativeMatch));
    assert.equal(evidence.keys.rows.length, 597);
    assert(evidence.keys.rows.every((r) => !r.maskChanged));
    assert.equal(evidence.keys.rows.filter((r) => r.faceChanged).length, 297);
    assert.equal(evidence.catalog.changed, 231);
    assert(evidence.catalog.changes.every((r) => r.set === '2ed'));
    return { ...p, verifiedEvidence: evidence };
  }));
}

/** Exact printing/component footprint; wording readiness is separate from a
 * rendered-layout fit. Unchanged components may retain their old receipts. */
export async function earlyCalibrationAffected(set, group, task, originalInput = false) {
  const proof = await earlyProof(),
    ids = new Set(group.printingIds ?? []);
  if (originalInput && set !== '2ed') return false;
  if (set === 'lea' && ['rules', 'fullCard', 'release'].includes(task))
    return proof.verifiedEvidence.alphaMeasure.rows.some((r) => r.changed && ids.has(r.id));
  if (set === 'leb' && ['frameGeometry', 'frameColor', 'fullCard', 'release'].includes(task))
    return proof.verifiedEvidence.betaParity.rows.some((r) => r.changed && ids.has(r.id));
  if (set === '2ed' && ['references', 'headings', 'rules', 'fullCard', 'release'].includes(task))
    return proof.verifiedEvidence.catalog.changes.some((r) => ids.has(r.id));
  return false;
}

/** Source restoration is used only after the caller chooses an unaffected
 * component. It must not approve a changed component's historical fit. */
export async function preEarlyCalibrationSource(file, bytes, set) {
  bytes = await preProfilePreparationSource(file, bytes, set);
  bytes = await preM21BodyFieldSource(file, bytes, set);
  bytes = await preOracleInsetSource(file, bytes);
  const proof = await earlyProof();
  const entry = proof.files[file];
  if (!entry) return preUnlimitedEmptySource(file, bytes);
  if (hash(bytes) === entry.before) return bytes;
  assert.equal(hash(bytes), entry.after, 'Unreviewed early source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of entry.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), entry.before);
  return before;
}
