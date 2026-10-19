import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preHostWorkerSource } from './magic-host-worker-source-guard.mjs';

export const battleSources = JSON.parse(
  await readFile(new URL('./magic-battle-sources.json', import.meta.url), 'utf8'),
);
let verified;
export async function battleSourceProof() {
  verified ??= (async () => {
    assert.equal(battleSources.schema, 1);
    for (const [file, digest] of Object.entries(battleSources.dependencies))
      assert.equal(
        hash(await preHostWorkerSource(file)),
        digest,
        'Unreviewed Battle dependency: ' + file,
      );
    return battleSources;
  })();
  return verified;
}

/** @param {string} file */
export async function preBattleSource(file) {
  const bytes = await preHostWorkerSource(file);
  const change = battleSources.files[file];
  if (!change) return bytes;
  await battleSourceProof();
  assert.equal(hash(bytes), change.after, 'Unreviewed Battle correction: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), change.before, 'Pre-Battle source reconstruction failed: ' + file);
  return before;
}
