import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

// Synthetic cached measurements exercise recovery without scans, fonts, GPU or
// image decoding. The target has a known monotone value curve.
const directory = await mkdtemp(path.join(os.tmpdir(), 'glint-color-study-'));
try {
  const inputs = { set: '2ed', entries: [] },
    poses = { rows: [] },
    capture = { complete: true, rendererHash: 'synthetic-color-control', rows: [] },
    rows = [];
  for (let i = 0; i < 6; i++) {
    const id = `control-${i}`,
      name = `Source control ${i}`,
      referenceHash = hash('reference-' + i),
      nativeHash = hash('native-' + i),
      cohort = i < 3 ? 'calibration' : 'validation';
    inputs.entries.push({
      id,
      card: { name },
      material: 'W',
      reference: { sha256: referenceHash },
    });
    const pose = { id, cohort, accepted: true, referenceHash, transform: [1, 0, 0, 1, 0, 0] };
    poses.rows.push(pose);
    capture.rows.push({ id, after: nativeHash });
    const source = Array.from({ length: 10 }, (_, k) =>
      [1, 0.8, 0.65].map((c) => (0.2 + k * 0.025) * c),
    );
    const target = source.map((rgb) => rgb.map((c) => c * Math.max(...rgb) ** -0.2));
    const sample = (colors) => ({
      frame: colors,
      paper: colors,
      stock: [0.93, 0.93, 0.93],
      ink: [0.1, 0.1, 0.1],
    });
    rows.push({
      id,
      name,
      material: 'W',
      group: 'W',
      cohort,
      accepted: true,
      referenceHash,
      nativeHash,
      poseHash: hash(JSON.stringify(pose)),
      render: sample(source),
      scan: sample(target),
    });
  }
  const inputBytes = JSON.stringify(inputs);
  poses.inputHash = hash(inputBytes);
  capture.inputHash = poses.inputHash;
  const parent = {
    inputHash: poses.inputHash,
    normalizationHash: hash(JSON.stringify(poses)),
    rendererHash: capture.rendererHash,
    patches: {
      frame: [
        [33, 110, 11, 50],
        [33, 200, 11, 50],
        [33, 290, 11, 50],
        [444, 110, 11, 50],
        [444, 200, 11, 50],
        [444, 290, 11, 50],
      ],
      paper: [[78, 434, 328, 140]],
      stock: [
        [6, 140, 5, 100],
        [477, 140, 5, 100],
        [130, 668, 100, 5],
      ],
      ink: [
        [22, 80, 4, 520],
        [462, 80, 4, 520],
        [40, 26, 405, 4],
        [40, 650, 405, 4],
      ],
    },
    sources: [['synthetic-sampler', 'known-value-curve']],
    rows,
  };
  await mkdir(path.join(directory, 'poses'));
  await mkdir(path.join(directory, 'native'));
  await writeFile(path.join(directory, 'input.json'), inputBytes);
  await writeFile(path.join(directory, 'poses/normalization.json'), JSON.stringify(poses));
  await writeFile(path.join(directory, 'native/capture.json'), JSON.stringify(capture));
  const run = async (value) => {
    await writeFile(path.join(directory, 'samples.json'), JSON.stringify(value));
    return spawnSync(
      process.execPath,
      [
        'games/magic/tools/accuracy/set-component-color-study.mjs',
        path.join(directory, 'input.json'),
        path.join(directory, 'poses'),
        path.join(directory, 'native'),
        path.join(directory, 'result.json'),
        path.join(directory, 'samples.json'),
      ],
      { encoding: 'utf8' },
    );
  };
  let result = await run(parent);
  assert.equal(result.status, 0, result.stderr);
  const fitted = JSON.parse(await readFile(path.join(directory, 'result.json')));
  for (const component of Object.values(fitted.groups.W.components)) {
    assert.equal(component.exhausted, false);
    assert.ok(component.cohorts.validation.after < 0.3, 'Known color curve must be recovered');
    assert.ok(component.cohorts.validation.after < component.cohorts.validation.before - 0.5);
    assert.equal(component.cohorts.validation.maximumClipping, 0);
  }
  for (const mutate of [
    (p) => (p.rendererHash = 'changed'),
    (p) => (p.rows[0].nativeHash = 'changed'),
    (p) => (p.rows[0].poseHash = 'changed'),
    (p) => (p.rows[0].cohort = 'validation'),
    (p) => (p.rows[0].scan.frame[0][0] = null),
  ]) {
    const bad = structuredClone(parent);
    mutate(bad);
    result = await run(bad);
    assert.notEqual(result.status, 0, 'Stale or invalid cached measurements must fail closed');
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log(
  'Component-color fitting recovers a known value curve; cached pose, renderer, native identity, cohort and numeric corruption fail closed.',
);
