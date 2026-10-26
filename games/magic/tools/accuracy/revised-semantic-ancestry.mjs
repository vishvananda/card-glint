// Exact source history for the Original Enchant Artifact frame correction.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
export const REVISED_SEMANTIC_RECEIPT =
  '1e21b6c0eeb198728c91a09af4db7b8316e3f18bc9ea2a7426ed03beaa40f998';
let checked;
export function revisedSemanticDelta() {
  return (checked ??= (async () => {
    const z = await readFile(
      path.join(
        root,
        'games/magic/fixtures/accuracy/3ed-recheck/semantic-frame-source-delta.json.gz',
      ),
    );
    assert.equal(hash(z), REVISED_SEMANTIC_RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.equal(p.status, 'complete-native-revised-semantic-frame-fix');
    assert.deepEqual(p.affectedSets, ['3ed']);
    assert.deepEqual(Object.keys(p.files).sort(), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/revised-frame-geometry.ts',
    ]);
    for (const entry of Object.values(p.files)) {
      assert.equal(hash(entry.beforeSource), entry.before);
      assert.equal(hash(entry.afterSource), entry.after);
    }
    const geometry = p.files['games/magic/src/presentation/revised-frame-geometry.ts'];
    assert.equal(
      geometry.beforeSource
        .replace(
          "import { resolveFrameColors } from './profile.js';",
          "import { resolveCardProfile, resolveFrameColors } from './profile.js';",
        )
        .replace(
          "if (/\\bArtifact\\b/.test(face.typeLine ?? '')) return 'A';",
          "if (resolveCardProfile(face).artifact) return 'A';",
        ),
      geometry.afterSource,
      'Only semantic material selection may change',
    );
    const load = async (entry) => {
      const bytes = await readFile(path.join(root, entry.file));
      assert.equal(hash(bytes), entry.sha256);
      const raw = gunzipSync(bytes);
      if (entry.contentSha256) assert.equal(hash(raw), entry.contentSha256);
      return JSON.parse(raw);
    };
    const before = await load(p.artifacts['semantic-frame-before.json.gz']),
      after = await load(p.artifacts['semantic-frame-after.json.gz']),
      scores = await load(p.artifacts['semantic-frame-scores.json.gz']),
      parent = await load(p.originalBaseline);
    assert.equal(before.source.rendererHash, p.beforeRenderer);
    assert.equal(after.source.rendererHash, p.afterRenderer);
    assert.equal(before.source.inputHash, after.source.inputHash);
    for (const capture of [before, after]) {
      assert.equal(capture.status, 'complete');
      assert.deepEqual(capture.faults, []);
    }
    assert.equal(before.rows.length, 4);
    assert.equal(after.rows.length, 306);
    assert.equal(new Set(after.rows.map((r) => r.id)).size, 306);
    assert.equal(parent.rows.length, 306);
    assert.equal(scores.rows.length, 306);
    assert.deepEqual(p.affected.map((r) => r.name).sort(), [
      'Animate Artifact',
      'Living Artifact',
      'Steal Artifact',
      'Warp Artifact',
    ]);
    let controls = 0;
    for (const row of after.rows) {
      const old = parent.rows.find((r) => r.id === row.id),
        native = row.modes.original,
        score = scores.rows.find((r) => r.id === row.id);
      assert(old && score);
      assert.equal(native.inputHash, old.inputHash);
      assert.equal(row.referenceHash, old.referenceHash);
      assert.deepEqual(native.layout, old.layout);
      assert.equal(score.after, native.sha256);
      assert.equal(score.before, old.sha256);
      if (!row.affected) {
        assert.equal(native.sha256, old.sha256);
        assert.equal(score.scoreReused, true);
        assert.equal(score.delta100, 0);
        controls++;
        continue;
      }
      const b = before.rows.find((r) => r.id === row.id);
      assert(b && p.affected.some((r) => r.id === row.id));
      assert.equal(b.modes.original.sha256, old.sha256);
      assert.notEqual(native.sha256, old.sha256);
      assert.equal(row.modes.oracle.sha256, b.modes.oracle.sha256);
      assert.equal(row.modes.oracle.inputHash, b.modes.oracle.inputHash);
      for (const field of ['frame', 'art', 'asset'])
        assert.deepEqual(native[field], row.modes.oracle[field]);
      assert.deepEqual(native.materials.materials, row.modes.oracle.materials.materials);
      assert.equal(Object.keys(b.modes.original.materials.materials).length, 0);
      assert.equal(Object.keys(native.materials.materials).length, 1);
      assert(score.delta100 > 0);
    }
    assert.equal(controls, 302);
    assert.deepEqual(p.controls, {
      nativeOriginals: 306,
      unchangedOriginals: 302,
      unchangedOracle: 4,
      unchangedBodyLayouts: 306,
    });
    return p;
  })());
}
/** Unknown bytes keep their changed identity; this never approves a Revised fit. */
export async function preRevisedSemanticSource(file, bytes) {
  const entry = (await revisedSemanticDelta()).files[file];
  return entry && hash(bytes) === entry.after ? Buffer.from(entry.beforeSource) : bytes;
}
