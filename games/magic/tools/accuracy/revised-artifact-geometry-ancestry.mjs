// Exact history for the shared Revised artifact geometry and its color binding.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
export const REVISED_ARTIFACT_GEOMETRY_RECEIPT =
  '218bdec8f6dac2237d9b14a1c0610647ae98f618552413d2b2eaedd2845fdcae';
let checked;
export function revisedArtifactGeometryDelta() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      path.join(
        root,
        'games/magic/fixtures/accuracy/3ed-recheck/artifact-geometry-source-delta.json.gz',
      ),
    );
    assert.equal(hash(bytes), REVISED_ARTIFACT_GEOMETRY_RECEIPT);
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.status, 'complete-native-revised-artifact-geometry-adoption');
    assert.deepEqual(p.affectedSets, ['3ed']);
    assert.deepEqual(Object.keys(p.files).sort(), [
      'games/magic/src/data/eager.ts',
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/data/sets/3ed.ts',
      'games/magic/src/presentation/printing-color-profiles.ts',
      'games/magic/src/presentation/revised-frame-geometry.ts',
    ]);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(hash(e.afterSource), e.after);
    }
    const geometry = p.files['games/magic/src/presentation/revised-frame-geometry.ts'];
    assert.equal(
      geometry.beforeSource.replace('x: [1.0095, 0.65625]', 'x: [1.0095, -0.59375]'),
      geometry.afterSource,
    );
    for (const file of [
      'games/magic/src/presentation/printing-color-profiles.ts',
      'games/magic/src/data/sets/3ed.ts',
      'games/magic/src/data/eager.ts',
    ])
      assert.equal(
        p.files[file].beforeSource.replace(p.binding.before, p.binding.after),
        p.files[file].afterSource,
        'Only source binding changes; no pigment adjustment',
      );
    const file = 'games/magic/src/data/generated-manifest.json',
      a = JSON.parse(p.files[file].beforeSource),
      b = JSON.parse(p.files[file].afterSource);
    assert.deepEqual(Object.keys(a.files), Object.keys(b.files));
    assert.deepEqual(Object.keys(a.sources), Object.keys(b.sources));
    assert.deepEqual(
      Object.keys(a.files)
        .filter((k) => a.files[k] !== b.files[k])
        .sort(),
      ['games/magic/src/data/eager.ts', 'games/magic/src/data/sets/3ed.ts'],
    );
    assert.deepEqual(
      Object.keys(a.sources)
        .filter((k) => a.sources[k] !== b.sources[k])
        .sort(),
      [
        'games/magic/src/presentation/printing-color-profiles.ts',
        'games/magic/src/presentation/revised-frame-geometry.ts',
      ],
    );
    const load = async (entry) => {
      const z = await readFile(path.join(root, entry.file));
      assert.equal(hash(z), entry.sha256);
      const raw = gunzipSync(z);
      if (entry.contentSha256) assert.equal(hash(raw), entry.contentSha256);
      return JSON.parse(raw);
    };
    const original = await load(p.artifacts['artifact-adopted-native-originals.json.gz']),
      variants = await load(p.artifacts['artifact-adopted-native-variants.json.gz']),
      prototype = await load(p.artifacts['artifact-geometry-prototype-variants.json.gz']),
      parent = await load(p.originalBaseline),
      poses = await load(p.artifacts['artifact-pixel-normalization.json.gz']),
      fine = await load(p.artifacts['artifact-pixel-fine-geometry-scores.json.gz']);
    for (const c of [original, variants, prototype]) {
      assert.equal(c.status, 'complete');
      assert.deepEqual(c.faults, []);
    }
    assert.equal(original.source.rendererHash, p.afterRenderer);
    assert.equal(variants.rendererHash, p.afterRenderer);
    assert.equal(prototype.rendererHash, p.beforeRenderer);
    assert.equal(parent.source.rendererHash, p.beforeRenderer);
    assert.deepEqual(variants.prototype, {});
    assert.equal(original.rows.length, 306);
    assert.equal(new Set(original.rows.map((r) => r.id)).size, 306);
    assert.equal(variants.rows.length, 51);
    assert.equal(prototype.rows.length, 51);
    let changed = 0,
      unchanged = 0,
      layers = 0;
    for (const row of original.rows) {
      const old = parent.rows.find((r) => r.id === row.id),
        trial = prototype.rows.find((r) => r.id === row.id);
      assert.equal(row.modes.original.inputHash, old.modes.original.inputHash);
      assert.deepEqual(row.modes.original.layout, old.modes.original.layout);
      if (trial) {
        assert.equal(row.modes.original.sha256, trial.modes.original.trials['-1.25'].sha256);
        changed++;
      } else {
        for (const [mode, value] of Object.entries(row.modes))
          assert.equal(value.sha256, old.modes[mode].sha256, row.name + ' ' + mode);
        unchanged++;
      }
    }
    for (const row of variants.rows) {
      const before = prototype.rows.find((r) => r.id === row.id);
      for (const [mode, value] of Object.entries(row.modes)) {
        const target = before.modes[mode];
        assert.equal(value.inputHash, target.inputHash);
        assert.equal(value.trials.current.sha256, target.trials['-1.25'].sha256);
        assert.deepEqual(value.trials.current.layout, target.trials['-1.25'].layout);
        assert.deepEqual(value.material.materials, target.material.materials);
        assert.deepEqual(value.material.materials, p.binding.materials);
        layers++;
      }
    }
    assert.equal(changed, 51);
    assert.equal(unchanged, 255);
    assert.equal(layers, 204);
    assert.equal(poses.rows.length, 51);
    const accepted = poses.rows
      .filter((r) => r.accepted)
      .map((r) => r.id)
      .sort();
    assert.equal(accepted.length, 47);
    assert.deepEqual(fine.rows.map((r) => r.id).sort(), accepted);
    assert.equal(fine.selectedByCalibrationBands, '-1.25');
    assert.equal(fine.summary['-1.25'].calibration.cards, 34);
    assert.equal(fine.summary['-1.25'].validation.cards, 13);
    assert.equal(fine.summary['-1.25'].all.regressed, 0);
    for (const row of fine.rows) {
      const actual = original.rows.find((r) => r.id === row.id);
      assert.equal(row.trials['-1.25'].sha256, actual.modes.original.sha256);
      assert(row.trials['-1.25'].delta100 > 0);
    }
    return p;
  })());
}
export async function preRevisedArtifactGeometrySource(file, bytes) {
  const e = (await revisedArtifactGeometryDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function revisedArtifactGeometryHistoricalHash(
  directory = path.join(root, 'games/magic/src'),
) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (file) => [
          path.relative(directory, file),
          hash(
            await preRevisedArtifactGeometrySource(path.relative(root, file), await readFile(file)),
          ),
        ]),
      ),
    ),
  );
}
