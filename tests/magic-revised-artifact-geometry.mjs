import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedArtifactGeometryDelta,
  preRevisedArtifactGeometrySource,
  revisedArtifactGeometryHistoricalHash,
} from '../games/magic/tools/accuracy/revised-artifact-geometry-ancestry.mjs';
const p = await revisedArtifactGeometryDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await revisedArtifactGeometryHistoricalHash(), p.beforeRenderer);
for (const [file, entry] of Object.entries(p.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), entry.after);
  assert.equal(hash(await preRevisedArtifactGeometrySource(file, bytes)), entry.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unknown edit\n')]);
  assert.deepEqual(await preRevisedArtifactGeometrySource(file, unknown), unknown);
}
const unknown = Buffer.from('unknown');
assert.deepEqual(await preRevisedArtifactGeometrySource('unrelated.ts', unknown), unknown);
assert.equal(p.selection.selected, -1.25);
assert.equal(p.native.nativeOriginals, 306);
assert.equal(p.native.unchangedOriginals, 255);
assert.equal(p.native.nativeVariants, 204);
assert.equal(p.normalization.accepted, 47);
assert.equal(p.normalization.rejected.length, 4);
console.log(
  'Revised artifact geometry:51 exact native prototype adoptions,204 layer/wording variants,255 unchanged Originals,all306 body layouts unchanged,immutable pigment values and scoped history.',
);
