import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  recentSymbolHistory,
  preRecentSymbolSource,
  recentSymbolHistoricalFiles,
} from '../games/magic/tools/accuracy/recent-symbol-source-ancestry.mjs';
const proof = await recentSymbolHistory();
for (const [file, entry] of Object.entries(proof.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), entry.after);
  assert.equal(
    hash(await preRecentSymbolSource(file, bytes)),
    entry.beforeSource === null ? entry.after : entry.before,
  );
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unknown source\n')]);
  assert.deepEqual(await preRecentSymbolSource(file, foreign), foreign);
  assert.deepEqual(
    await recentSymbolHistoricalFiles([file]),
    entry.beforeSource === null ? [] : [file],
  );
}
assert.equal(proof.scoreReuse, false);
console.log(
  'Recent-symbol history: exact pre-extension sources, added module exclusion and foreign-source rejection; no blanket score reuse.',
);
