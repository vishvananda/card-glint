import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
const receiptHash = '0b061e6bb14c96c23b68592bd556919b06398acc72bb2d5ce45ea9e22e677799';
let verified;
async function originalLayoutProof() {
  return (verified ??= (async () => {
    const raw = await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/alpha-oracle-source-proof.json',
    );
    assert.equal(hash(raw), receiptHash, 'Changed Oracle source restoration receipt');
    const proof = JSON.parse(raw);
    const evidence = await readFile(proof.evidence.file);
    assert.equal(hash(evidence), proof.evidence.sha256);
    const audit = JSON.parse(gunzipSync(evidence));
    assert.equal(audit.oracle.originalRows.length, 295);
    const ids = audit.oracle.originalRows.map((r) => r.id).sort();
    assert.equal(new Set(ids).size, 295);
    assert.deepEqual(
      ids,
      audit.history
        .at(-1)
        .rows.map((r) => r.id)
        .sort(),
    );
    assert.ok(
      audit.oracle.originalRows.every(
        (r) =>
          r.beforeLayoutHash === r.afterLayoutHash && /^[a-f0-9]{64}$/.test(r.beforeLayoutHash),
      ),
    );
    for (const [file, entry] of Object.entries(proof.files)) {
      assert.equal(
        hash(await readFile(file)),
        entry.after,
        'Unreviewed early source (Oracle inset): ' + file,
      );
    }
    return proof;
  })());
}
/** Only restores known source for historical ORIGINAL-wording guards. It does
 * not grandfather Oracle measurements, changed printing text, face cache keys
 * or fresh renderer dependency identities. Unknown edits still fail closed. */
export async function preOracleInsetSource(file, bytes) {
  const proof = await originalLayoutProof();
  const entry = proof.files[file];
  if (!entry || hash(bytes) === entry.before || entry.ancestors.includes(hash(bytes))) return bytes;
  assert.equal(hash(bytes), entry.after, 'Unreviewed early source (Oracle inset): ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of entry.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), entry.before);
  return before;
}
