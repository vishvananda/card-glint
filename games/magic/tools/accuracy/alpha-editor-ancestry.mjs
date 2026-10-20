import { preHeadingSpacingSource } from './heading-spacing-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';

// Historical receipt reconstruction, not reuse of scores for corrected lands.
export const ALPHA_EDITOR_PROOF_HASH =
  'ca99ff97004177106251d1dfebf020a7ba3a297cc042ef6a87ea8187ac4544c8';
let checked;
export function alphaEditorAncestry() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      'games/magic/fixtures/accuracy/alpha-name-editor/source-proof.json',
    );
    assert.equal(hash(bytes), ALPHA_EDITOR_PROOF_HASH);
    const proof = JSON.parse(bytes);
    for (const [file, sha] of Object.entries(proof.dependencies))
      assert.equal(
        hash(await preHeadingSpacingSource(file, await readFile(file))),
        sha,
        'Changed Alpha editor dependency: ' + file,
      );
    const evidence = await readFile(proof.nativeEvidence);
    assert.equal(hash(evidence), proof.nativeHash);
    const native = JSON.parse(evidence);
    assert.equal(native.rows.length, 27);
    assert.equal(new Set(native.rows.map((r) => r.id)).size, 27);
    for (const row of native.rows) {
      assert.equal(row.after, row.zero, 'Untouched title proposal changes pixels: ' + row.name);
      if (!['Taiga', 'Plateau', 'Badlands', 'Tundra', 'Scrubland'].includes(row.name))
        assert.equal(row.before, row.after, 'Unexpected default change: ' + row.name);
      if (row.titleEdit) {
        assert(row.titleEdit.changedPixels > 0);
        assert.equal(row.titleEdit.outsideTitle, 0);
      }
    }
    assert(native.rows.some((r) => r.titleEdit));
    return proof;
  })());
}
export async function preAlphaEditorSource(file, bytes) {
  bytes = await preHeadingSpacingSource(file, bytes);
  const proof = await alphaEditorAncestry(),
    change = proof.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed Alpha editor source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before);
  return before;
}
