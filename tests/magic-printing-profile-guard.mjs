import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  printingProfileGuardDelta,
  prePrintingProfileGuardSource,
  printingProfileGuardHistoricalHash,
  printingProfileGuardRuntimeCompatible,
} from '../games/magic/tools/accuracy/printing-profile-guard-ancestry.mjs';
const p = await printingProfileGuardDelta();
for (const [file, entry] of Object.entries(p.files)) {
  const current = await readFile(file);
  assert.equal(hash(current), entry.after);
  assert.equal(hash(await prePrintingProfileGuardSource(file, current)), entry.before);
  assert.deepEqual(
    await prePrintingProfileGuardSource(file, Buffer.from(entry.beforeSource)),
    Buffer.from(entry.beforeSource),
  );
  const edited = Buffer.concat([current, Buffer.from('\n// unrelated edit\n')]);
  assert.deepEqual(
    await prePrintingProfileGuardSource(file, edited),
    edited,
    'Unknown bytes must keep their changed identity, never receive a historical approval',
  );
}
const unknown = Buffer.from('An unrelated dependency retains its own identity.');
assert.deepEqual(await prePrintingProfileGuardSource('unknown.ts', unknown), unknown);
assert.equal(await printingProfileGuardHistoricalHash(), p.beforeRenderer);
assert.notEqual(
  await sourceHash('games/magic/src'),
  p.beforeRenderer,
  'Real source hashes must retain the new source identity',
);
assert(await printingProfileGuardRuntimeCompatible('games/magic/src', p.beforeRenderer));
assert.equal(await printingProfileGuardRuntimeCompatible('games/magic/src', '0'.repeat(64)), false);
assert.equal(
  await printingProfileGuardRuntimeCompatible('packages/browser/src', p.beforeRenderer),
  false,
);
const manifestFile = 'games/magic/src/data/generated-manifest.json';
const before = JSON.parse(p.files[manifestFile].beforeSource);
const after = JSON.parse(await readFile(manifestFile));
assert.deepEqual(after.files, before.files, 'Every generated runtime payload is unchanged');
assert.deepEqual(Object.keys(after.sources), Object.keys(before.sources));
for (const [file, digest] of Object.entries(after.sources)) {
  const entry = p.files[file];
  assert.equal(digest, entry?.after ?? before.sources[file]);
  if (entry) assert.equal(before.sources[file], entry.before);
}
console.log(
  'Named Eighth guard: exact two-source/metadata projection; unchanged payloads; real new identity and unknown-edit rejection.',
);
