import {
  preOldFrameSource,
  oldFrameSourceRuntimeCompatible,
} from '../games/magic/tools/accuracy/old-frame-source-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash, root } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthBasicSymbolDelta,
  preFourthBasicSymbolSource,
  fourthBasicSymbolHistoricalHash,
} from '../games/magic/tools/accuracy/fourth-basic-symbol-ancestry.mjs';
import {
  validateFourthBasicSymbolSource,
  fourthBasicSymbolPaths,
} from '../games/magic/tools/accuracy/fourth-basic-symbol-source-check.mjs';
const p = await fourthBasicSymbolDelta();
assert.equal(
  await oldFrameSourceRuntimeCompatible('games/magic/src', p.afterRenderer, '4ed'),
  false,
  'Current typography is newer than this historical symbol proof',
);
assert.equal(await fourthBasicSymbolHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const bytes = await preOldFrameSource(file, await fs.readFile(root + '/' + file));
  assert.equal(hash(bytes), r.after);
  assert.equal(hash(await preFourthBasicSymbolSource(file, bytes)), r.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unreviewed\n')]);
  assert.deepEqual(await preFourthBasicSymbolSource(file, unknown), unknown);
  assert.deepEqual(await preFourthBasicSymbolSource(file + '.foreign', bytes), bytes);
}
const artifact = async (ref) => JSON.parse(gunzipSync(await fs.readFile(root + '/' + ref.file)));
const native = await artifact(p.native),
  scores = await artifact(p.scores);
assert.equal(native.rows.length, 492);
assert.equal(native.nativeVariants, 1968);
assert.deepEqual(native.counts.original, { changed: 20, unchanged: 472, keysChanged: 408 });
assert.equal(scores.summary.actualNativeJoined, 378);
assert.equal(scores.summary.fresh, 0);
assert.equal(scores.summary.prototypeFresh, 15);
assert.equal(scores.summary.gains, 15);
assert.equal(scores.summary.losses, 0);
assert(scores.summary.current100 > scores.summary.before100);
assert.equal(scores.rows.filter((r) => r.delta100 > 1e-9).length, 15);
assert.equal(scores.rows.filter((r) => r.delta100 < -1e-9).length, 0);
const bad = structuredClone(p),
  record = bad.files[fourthBasicSymbolPaths.profile];
record.afterSource = record.afterSource.replace('title: { size: 27.25', 'title: { size: 27.5');
record.after = hash(record.afterSource);
await assert.rejects(() => validateFourthBasicSymbolSource(bad), /Unrelated profile/);
const painter = structuredClone(p),
  file = 'games/magic/src/presentation/rules-paint.ts';
painter.files[file].afterSource = painter.files[file].afterSource.replace(
  'run.size * 0.8 * (layout.symbolOffsetY',
  'run.size * 0.81 * (layout.symbolOffsetY',
);
painter.files[file].after = hash(painter.files[file].afterSource);
await assert.rejects(() => validateFourthBasicSymbolSource(painter), /Unreviewed runtime edit/);
const foreign = structuredClone(p),
  index = foreign.afterInventory.findIndex(([f]) => f === 'presentation/retro-paint.ts');
foreign.afterInventory[index][1] = '0'.repeat(64);
foreign.afterRenderer = hash(JSON.stringify(foreign.afterInventory));
await assert.rejects(() => validateFourthBasicSymbolSource(foreign), /Unlisted source/);
const duplicate = structuredClone(p);
duplicate.ids[0] = duplicate.ids[1];
await assert.rejects(() => validateFourthBasicSymbolSource(duplicate));
console.log(
  'Fourth basic symbols:1968 actual native variants,20 independent exact prototypes,1948 unchanged renders/layouts,15 whole-card gains,408 scoped revisions;other profile edits,unknown source and duplicate identities reject.',
);
