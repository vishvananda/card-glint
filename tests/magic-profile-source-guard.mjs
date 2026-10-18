import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

let verified;
async function proof() {
  verified ??= (async () => {
    const p = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/profile-consolidation-compatibility.json'),
    );
    for (const [file, sha] of Object.entries(p.dependencies))
      assert.equal(hash(await readFile(file)), sha, 'Unreviewed profile adapter change: ' + file);
    const previous = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-reprint-footer.json'),
    );
    const originals = new Map(previous.native.rows.map((r) => [r.id, r.candidate]));
    assert.equal(p.native.cards, 44);
    assert.equal(p.native.exactProfiles, 44);
    assert.equal(new Set(p.native.rows.map((r) => r.id)).size, 44);
    for (const row of p.native.rows) {
      assert.equal(row.before, originals.get(row.id));
      assert.equal(row.outside, 0);
      assert.ok(row.changed > 0);
    }
    return p;
  })();
  return verified;
}

/** Historical source reconstruction, not approval of current set values.
 * Profile data is checked independently so a revision can be a one-file PR. */
export async function preProfileConsolidationSource(file) {
  const extension = await proof(),
    bytes = await readFile(file),
    change = extension.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before);
  return before;
}
