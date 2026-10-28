import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { root, hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  preOnslaughtSymbolSource,
  onslaughtSymbolSourceReview,
} from '../games/magic/tools/accuracy/old-frame-symbol-source-ancestry.mjs';
const p = await onslaughtSymbolSourceReview();
const current = await fs.readFile(root + '/' + p.file);
assert.equal(hash(current), p.afterSha256);
for (const set of ['m21', 'drk', '8ed', 'mir'])
  assert.equal(hash(await preOnslaughtSymbolSource(p.file, current, set)), p.beforeSha256);
assert.equal(await preOnslaughtSymbolSource(p.file, current, 'ons'), current);
const foreign = Buffer.concat([current, Buffer.from(' ')]);
assert.equal(await preOnslaughtSymbolSource(p.file, foreign, 'm21'), foreign);
assert.equal(await preOnslaughtSymbolSource('games/magic/assets.json', current, 'm21'), current);
console.log(
  'Only the exact reviewed symbol data is projected for unrelated sets; ONS and foreign edits remain current.',
);
