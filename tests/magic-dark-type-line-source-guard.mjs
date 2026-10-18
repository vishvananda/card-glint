import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preDarkBodySource } from './magic-dark-body-source-guard.mjs';
import { preBorderSource } from './magic-border-source-guard.mjs';

const extension = JSON.parse(
  await readFile(
    new URL('../games/magic/fixtures/accuracy/dark-type-line-compatibility.json', import.meta.url),
  ),
);
let verified;
export function darkTypeLineProof() {
  verified ??= (async () => {
    const bytes = await readFile('games/magic/fixtures/accuracy/dark-type-line.json');
    assert.equal(hash(bytes), extension.evidenceHash);
    const evidence = JSON.parse(bytes);
    assert.equal(evidence.baselineCommit, extension.baselineCommit);
    assert.deepEqual(evidence.native.summary, {
      cards: 316,
      changed: 122,
      unchanged: 194,
      exactPrototypes: 122,
    });
    assert.equal(evidence.native.rows.length, 316);
    assert.equal(evidence.prototypes.length, 122);
    for (const row of evidence.native.rows) {
      assert.equal(row.outsideTypeChanges, 0);
      if (row.set === 'drk') {
        const prototype = evidence.prototypes.find((p) => p.id === row.id);
        assert.equal(row.proposalParity, true);
        assert.equal(row.before, prototype.before);
        assert.equal(row.after, prototype.after);
        assert.equal(prototype.outside, 0);
      } else assert.equal(row.before, row.after);
    }
    assert.equal(evidence.controls.cards, 84);
    assert.equal(evidence.controls.changed, 0);
    assert.equal(evidence.controls.rows.length, 84);
    for (const row of evidence.controls.rows) assert.equal(row.before, row.sha256);
    for (const [file, expected] of Object.entries(extension.dependencies))
      assert.equal(
        hash(await preBorderSource(file)),
        expected,
        'Unreviewed type dependency: ' + file,
      );
    return evidence;
  })();
  return verified;
}

/** Reconstruct the source for preceding measurements; keep their receipts intact. */
export async function preDarkTypeLineSource(file) {
  const bytes = await preDarkBodySource(file),
    change = extension.files[file];
  if (!change) return bytes;
  await darkTypeLineProof();
  assert.equal(hash(bytes), change.after, 'Unreviewed Dark type-line integration: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Dark type-line reconstruction failed: ' + file);
  return before;
}
