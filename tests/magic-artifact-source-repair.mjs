import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  artifactSourceRepairDelta,
  artifactSourceRepairAffected,
  preArtifactSourceRepair,
} from '../games/magic/tools/accuracy/artifact-source-repair-ancestry.mjs';
import { oldFrameSourceRuntimeCompatible } from '../games/magic/tools/accuracy/old-frame-source-ancestry.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { createServer } from './magic-vite.mjs';

const p = await artifactSourceRepairDelta();
for (const [file, entry] of Object.entries(p.files)) {
  const bytes = await fs.readFile(file);
  assert.equal(hash(await preArtifactSourceRepair(file, bytes)), entry.before);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// foreign edit\n')]);
  assert.deepEqual(await preArtifactSourceRepair(file, foreign), foreign);
  assert.deepEqual(await preArtifactSourceRepair(file + '.unknown', bytes), bytes);
}
for (const set of ['arn', 'atq']) {
  const group = { kind: 'artifact' };
  for (const task of ['frameGeometry', 'frameColor', 'paperColor', 'fullCard', 'release']) {
    assert(artifactSourceRepairAffected(set, group, task));
    assert(!artifactSourceRepairAffected(set, group, task, true));
    assert(!artifactSourceRepairAffected(set, { kind: 'creature' }, task));
    assert(!artifactSourceRepairAffected('mir', group, task));
  }
  for (const task of ['references', 'normalization', 'headings', 'artist', 'setSymbol'])
    assert(!artifactSourceRepairAffected(set, group, task));
  assert.equal(
    await oldFrameSourceRuntimeCompatible('games/magic/src', p.beforeRenderer, set),
    false,
  );
}
assert(await oldFrameSourceRuntimeCompatible('games/magic/src', p.beforeRenderer, '4ed'));
assert.equal(await oldFrameSourceRuntimeCompatible('games/magic/src', p.beforeRenderer), false);

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
try {
  for (const set of p.affectedSets) {
    const { profile, review } = await server.ssrLoadModule(
      '/games/magic/src/calibration/sets/' + set + '.ts',
    );
    assert.deepEqual(profile, p.profileData[set].after);
    assert.equal(review.revision, profile.revision);
  }
} finally {
  await server.close();
}
console.log(
  'ARN/ATQ artifact source repair: exact native candidate parity, bounded profile edits, unchanged unrelated controls and scoped score invalidation.',
);
