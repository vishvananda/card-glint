import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  parseProfileData,
  profileDataGeneratorSource,
  additionalProfileDataModules,
} from '../games/magic/tools/accuracy/profile-data-modules.mjs';
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

const generator = 'games/magic/tools/build-set-data.mjs';
const bytes = await readFile(generator);
const before = await profileDataGeneratorSource(generator, bytes);
assert(before.includes(Buffer.from("for (const code of ['fem', '4ed', 'chr'])")));
await assert.rejects(() =>
  profileDataGeneratorSource(generator, Buffer.concat([bytes, Buffer.from('\n// unknown edit')])),
);
const known = new Set(
  ['4ed', 'chr', 'fem', 'lea-title'].map((s) => 'games/magic/src/calibration/sets/' + s + '.ts'),
);
assert.deepEqual(await additionalProfileDataModules(known), [
  'games/magic/src/calibration/sets/2ed.ts',
  'games/magic/src/calibration/sets/arn.ts',
  'games/magic/src/calibration/sets/atq.ts',
  'games/magic/src/calibration/sets/mir.ts',
  'games/magic/src/calibration/sets/ons.ts',
]);
console.log(
  'Registered Unlimited literal values equal generated data; historical generator reconstruction rejects unknown edits.',
);
