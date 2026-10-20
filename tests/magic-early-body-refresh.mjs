import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm, realpath, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const dir = await mkdtemp(path.join(tmpdir(), 'glint-body-refresh-'));
const digest = (b) => createHash('sha256').update(b).digest('hex');
const save = async (name, data) => {
  const bytes = Buffer.from(JSON.stringify(data));
  await writeFile(path.join(dir, name), bytes);
  return digest(bytes);
};
try {
  const definition = {
    candidates: [
      { id: 'current', adjustment: {} },
      { id: 'selected', adjustment: { dx: 1 } },
    ],
  };
  const row = (id, baselineHash) => ({
    id,
    baselineHash,
    referenceHash: 'scan-' + id,
    poseHash: 'pose-' + id,
  });
  const oldRows = [row('a', 'old-a'), row('b', 'old-b')];
  const fresh = row('a', 'new-a');
  const capture = {
    source: {
      rendererHash: 'same-painter',
      parentCaptureHash: 'old-capture',
      parentInputsHash: 'old-inputs',
      refreshedIds: ['a'],
    },
    rows: [fresh, oldRows[1]].map((r) => ({
      id: r.id,
      renderHash: r.baselineHash,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
    })),
  };
  await save('capture.json', capture);
  await save('inputs.json', { entries: [{ id: 'a' }, { id: 'b' }] });
  await mkdir(path.join(dir, 'partial'));
  const partialCaptureHash = await save('partial/capture.json', { rows: [capture.rows[0]] });
  const partialInputsHash = await save('partial/inputs.json', { entries: [{ id: 'a' }] });
  const shared = {
    rendererHash: 'same-painter',
    toolHash: 'same-measurement',
    dependencies: [['objective', 'fixed-hash']],
    transformed: { painter: 'fixed-transform' },
    definition,
  };
  const parent = {
    ...shared,
    nativeCaptureHash: 'old-capture',
    nativeInputsHash: 'old-inputs',
    total: 2,
    completed: 2,
    rows: oldRows,
  };
  const partial = {
    ...shared,
    nativeCaptureHash: partialCaptureHash,
    nativeInputsHash: partialInputsHash,
    total: 1,
    completed: 1,
    rows: [fresh],
  };
  const tool = new URL('../games/magic/tools/accuracy/early-body-refresh.mjs', import.meta.url);
  const run = () =>
    spawnSync(
      process.execPath,
      [
        fileURLToPath(tool),
        'merge',
        path.join(dir, 'parent.json'),
        path.join(dir, 'point.json'),
        dir,
        path.join(dir, 'result.json'),
      ],
      { encoding: 'utf8' },
    );
  const originalParentHash = await save('parent.json', parent);
  const originalPartialHash = await save('point.json', partial);
  let result = run();
  assert.equal(result.status, 0, result.stderr);
  const merged = JSON.parse(await readFile(path.join(dir, 'result.json')));
  assert.deepEqual(merged.rows, [fresh, oldRows[1]]);
  assert.equal(merged.derivation.parentMatrixHash, originalParentHash);
  assert.equal(merged.derivation.partialMatrixHash, originalPartialHash);
  assert.equal(merged.derivation.reused, 1);
  assert.equal(merged.derivation.refreshed, 1);
  for (const [label, mutate] of [
    ['candidate change', (d) => (d.definition.candidates[1].adjustment.dx = 2)],
    ['painter change', (d) => (d.rendererHash = 'different')],
    ['dependency change', (d) => (d.dependencies[0][1] = 'different')],
    ['transform change', (d) => (d.transformed.painter = 'different')],
    ['pose change', (d) => (d.rows[0].poseHash = 'different')],
    ['baseline change', (d) => (d.rows[0].baselineHash = 'different')],
    ['reference change', (d) => (d.rows[0].referenceHash = 'different')],
    [
      'missing replacement',
      (d) => {
        d.rows = [];
      },
    ],
    ['unfinished study', (d) => (d.completed = 0)],
    ['wrong input ancestry', (d) => (d.nativeInputsHash = 'different')],
  ]) {
    const bad = structuredClone(partial);
    mutate(bad);
    await save('point.json', bad);
    result = run();
    assert.notEqual(result.status, 0, label + ' must reject');
  }
  await save('point.json', partial);
  assert.equal(digest(await readFile(path.join(dir, 'parent.json'))), originalParentHash);
  // Native reuse validates every referenced byte and creates relative links.
  for (const [id, where] of [
    ['a', 'point-images'],
    ['b', 'parent-images'],
  ]) {
    await mkdir(path.join(dir, where), { recursive: true });
    const native = {};
    for (const [suffix, key] of [
      ['.png', 'faceHash'],
      ['-etching.png', 'etchingHash'],
    ]) {
      const bytes = Buffer.from(id + suffix);
      await writeFile(path.join(dir, where, id + suffix), bytes);
      native[key] = digest(bytes);
    }
    (id === 'a' ? fresh : oldRows[1]).native = native;
  }
  await save('parent.json', { ...parent, nativeVerification: true });
  await save('point.json', { ...partial, nativeVerification: true });
  result = spawnSync(
    process.execPath,
    [
      fileURLToPath(tool),
      'merge',
      path.join(dir, 'parent.json'),
      path.join(dir, 'point.json'),
      dir,
      path.join(dir, 'native-result.json'),
      path.join(dir, 'parent-images'),
      path.join(dir, 'point-images'),
      path.join(dir, 'merged-images'),
    ],
    { encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    await realpath(path.join(dir, 'merged-images/a.png')),
    path.join(dir, 'point-images/a.png'),
  );
  assert.equal(
    await realpath(path.join(dir, 'merged-images/b.png')),
    path.join(dir, 'parent-images/b.png'),
  );
  console.log('Body refresh reuse: exact rows/native bytes and ten incompatible inputs checked');
} finally {
  await rm(dir, { recursive: true, force: true });
}
