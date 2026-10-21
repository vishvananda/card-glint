import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseProfileData } from '../games/magic/tools/accuracy/profile-data-modules.mjs';
const source = await readFile('games/magic/src/calibration/sets/4ed.ts', 'utf8');
const parsed = parseProfileData(source);
assert.equal(parsed.profile.set, '4ed');
assert.equal(parsed.review.revision, parsed.profile.revision);
for (const text of [
  source + '\nconsole.log("unsafe");',
  source.replace('schema: 1', 'schema: (() => 1)()'),
  source.replace('schema: 1', 'get schema() { return 1; }'),
  source.replace('schema: 1', '...globalThis'),
  source.replace('import type', 'import'),
  source.replace('schema: 1', 'schema: 1, schema: 2'),
])
  assert.throws(() => parseProfileData(text));
console.log(
  'Literal profile modules accept inert data and reject calls, getters, spreads, side effects and duplicate keys.',
);
