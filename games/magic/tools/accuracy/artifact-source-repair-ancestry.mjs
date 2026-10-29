import { preArnSymbolRoleSource } from './arn-symbol-role-ancestry.mjs';
// Exact, scoped compatibility for two artifact materials; no set approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';

const FILE = 'games/magic/fixtures/accuracy/mirage-onslaught/artifact-source-delta.json.gz';
const SHA = 'f27c9ebcf141106990b927842fdc9043035f9404571d8e3a046ffe474129ebf7';
let checked;
export function artifactSourceRepairDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed artifact material receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.kind, 'arn-atq-artifact-source-repair');
    assert.deepEqual(p.affectedSets, ['arn', 'atq']);
    assert.deepEqual(
      Object.keys(p.files).sort(),
      [
        'games/magic/src/calibration/sets/arn.ts',
        'games/magic/src/calibration/sets/atq.ts',
        'games/magic/src/data/generated-manifest.json',
        'games/magic/src/data/eager.ts',
        'games/magic/src/data/sets/arn.ts',
        'games/magic/src/data/sets/atq.ts',
        'games/magic/tools/accuracy/arn-profile-ancestry.mjs',
        'games/magic/tools/accuracy/atq-profile-ancestry.mjs',
        'games/magic/tools/accuracy/calibration-report.mjs',
      ].sort(),
    );
    for (const e of Object.values(p.files)) assert.equal(hash(e.beforeSource), e.before);
    const study = JSON.parse(await fs.readFile(path.join(root, p.studyFile)));
    assert.equal(hash(await fs.readFile(path.join(root, p.studyFile))), p.studyHash);
    for (const set of p.affectedSets) {
      const { before, after } = p.profileData[set];
      const projected = structuredClone(after);
      projected.revision = before.revision;
      projected.frames.A.stockWindow = before.frames.A.stockWindow;
      projected.colors.A.adjustment.frame = before.colors.A.adjustment.frame;
      projected.colors.A.adjustment.paper = before.colors.A.adjustment.paper;
      assert.deepEqual(projected, before, 'Unrelated profile values changed');
      assert.deepEqual(after.frames.A, study.sets[set].candidate.frame);
      assert.deepEqual(after.colors.A, study.sets[set].candidate.color);
      assert.equal(p.installed[set].rendererHash, p.afterRenderer);
      assert.equal(p.installed[set].rows.length, study.sets[set].printings);
      for (const row of p.installed[set].rows) {
        const candidate = study.sets[set].rows.find((r) => r.id === row.id);
        assert(candidate);
        assert.equal(row.nativeHash, candidate.afterNative);
        assert.equal(row.referenceHash, candidate.referenceHash);
        assert.equal(candidate.artChanged, 0);
      }
    }
    const { nativeProof, nativeTool } = p;
    for (const [file, entry] of Object.entries(p.nativeProbeDelta.files))
      assert.deepEqual(entry, p.files[file]);
    assert.equal(
      nativeProof.source.deltaHash,
      hash(JSON.stringify(p.nativeProbeDelta, null, 2) + '\n'),
    );
    assert.equal(nativeProof.status, 'unchanged-native-frame-family-controls');
    assert.equal(nativeProof.count, 65);
    assert.equal(nativeProof.changed, 0);
    assert.equal(nativeProof.source.rendererHash, p.afterRenderer);
    assert.equal(nativeProof.source.toolHash, nativeTool.sha256);
    assert.equal(hash(await fs.readFile(path.join(root, nativeTool.file))), nativeTool.sha256);
    return p;
  })());
}
export async function preArtifactSourceRepair(file, bytes) {
  bytes = await preArnSymbolRoleSource(file, bytes);
  const e = (await artifactSourceRepairDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export function artifactSourceRepairAffected(set, group, task, original = false) {
  return (
    !original &&
    ['arn', 'atq'].includes(set?.toLowerCase()) &&
    group?.kind === 'artifact' &&
    ['frameGeometry', 'frameColor', 'paperColor', 'fullCard', 'release'].includes(task)
  );
}
