import { preAbuFlowToolSource } from './abu-flow-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const receiptHash = 'd9931f040c5e9e88faf965c97795329a2a436caf9c36298bca9820b496d95ff8';
let checked;
async function equivalence() {
  return (checked ??= (async () => {
    const raw = await readFile('games/magic/fixtures/accuracy/m21-body-field-compatibility.json');
    assert.equal(hash(raw), receiptHash);
    const receipt = JSON.parse(raw),
      bytes = await readFile(receipt.evidence.file);
    assert.equal(hash(bytes), receipt.evidence.sha256);
    const proof = JSON.parse(gunzipSync(bytes));
    assert.equal(proof.rows.length, 297);
    assert.equal(new Set(proof.rows.map((r) => r.id)).size, 297);
    assert.ok(proof.rows.every((r) => r.beforeHash === r.afterHash));
    assert.equal(proof.printingFields.before, receipt.change.before);
    assert.equal(proof.printingFields.after, receipt.change.after);
    assert.equal(
      hash(preAbuFlowToolSource(receipt.change.file, await readFile(receipt.change.file))),
      receipt.change.after,
    );
    for (const item of [
      ...proof.dependencies,
      proof.tool,
      { file: 'games/magic/fixtures/accuracy/m21/corpus.json', sha256: proof.corpusHash },
      proof.legacy,
    ])
      assert.equal(
        hash(preAbuFlowToolSource(item.file, await readFile(item.file))),
        item.sha256,
        'Changed M21 body-field proof dependency: ' + item.file,
      );
    const legacy = JSON.parse(await readFile(proof.legacy.file));
    assert.equal(legacy.rows.length, 292);
    assert.deepEqual(proof.legacy.ids.slice().sort(), legacy.rows.map((r) => r.id).sort());
    for (const row of legacy.rows)
      assert.ok(proof.rows.some((r) => r.id === row.id && r.referenceHash === row.referenceHash));
    return receipt;
  })());
}
/** M21 historical original-input guards only. No other set, changed printing
 * text, Oracle score, or renderer identity inherits this compatibility. */
export async function preM21BodyFieldSource(file, bytes, set) {
  if (set !== 'm21') return bytes;
  bytes = preAbuFlowToolSource(file, bytes);
  if (file !== 'games/magic/tools/accuracy/printing-fields.mjs') return bytes;
  const { change } = await equivalence();
  if (hash(bytes) === change.before) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed M21 body-field adapter');
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const prior = Buffer.from(lines.join(''));
  assert.equal(hash(prior), change.before);
  return prior;
}
