// Offline score reuse must invalidate only changed inputs and metric graphs.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'glint-baseline-reuse-'));
try {
  await fs.mkdir(path.join(dir, 'objects'));
  const png = PNG.sync.write({ width: 4, height: 4, data: Buffer.alloc(64, 255) });
  const sha = hash(png);
  await fs.writeFile(path.join(dir, 'objects', sha), png);
  const entries = ['one', 'two'].map((id) => ({
    id,
    name: id,
    material: 'W',
    reference: { sha256: sha },
    face: { name: id },
    card: {},
    wordingEvidence: { typeSource: 'scan-reviewed-field', rulesSource: 'scan-reviewed-field' },
  }));
  const put = async (name, data) => {
    const file = path.join(dir, name);
    const raw = JSON.stringify(data);
    await fs.writeFile(file, raw);
    return { file, hash: hash(raw) };
  };
  const input = await put('inputs.json', { set: 'test', entries });
  const poses = {
    inputHash: input.hash,
    rows: entries.map((e) => ({
      id: e.id,
      accepted: true,
      referenceHash: sha,
      transform: { matrix: [1, 0, 0, 1, 0, 0] },
    })),
  };
  const parent = await put('poses.json', poses);
  const capture = await put('capture.json', {
    complete: true,
    faults: [],
    source: { inputHash: input.hash },
    rows: entries.map((e) => ({
      id: e.id,
      referenceHash: sha,
      inputHash: hash(JSON.stringify(e.face)),
      sha256: sha,
    })),
  });
  for (const e of entries) await fs.writeFile(path.join(dir, e.id + '.png'), png);
  const metric = path.join(dir, 'metric.mjs');
  await fs.writeFile(
    metric,
    'export function scoreRegions() { return { structuralScore: .5, components: {} }; }\n',
  );
  const cli = new URL(
    '../games/magic/tools/accuracy/old-frame-set-baseline-score.mjs',
    import.meta.url,
  ).pathname;
  const run = (pose, out, reuse = false, nativeFile = capture.file, parentCaptureFile) =>
    spawnSync(
      process.execPath,
      [
        cli,
        input.file,
        pose,
        nativeFile,
        metric,
        path.join(dir, out),
        ...(reuse
          ? [
              path.join(dir, 'baseline.json'),
              parent.file,
              ...(parentCaptureFile ? [parentCaptureFile] : []),
            ]
          : []),
      ],
      { encoding: 'utf8', env: { ...process.env, MAGIC_ACCURACY_CACHE: dir } },
    );
  const check = (r) => assert.equal(r.status, 0, r.stderr);
  const read = async (name) => JSON.parse(await fs.readFile(path.join(dir, name), 'utf8'));
  check(run(parent.file, 'baseline.json'));
  check(run(parent.file, 'same.json', true));
  assert.deepEqual((await read('same.json')).reuse, { reused: 2, fresh: 0, rejected: 0 });
  const nextCapture = await put('next-capture.json', {
    ...JSON.parse(await fs.readFile(capture.file, 'utf8')),
    source: { inputHash: input.hash, rendererHash: 'new-renderer-same-pixels' },
  });
  check(run(parent.file, 'next-same-pixels.json', true, nextCapture.file, capture.file));
  assert.deepEqual((await read('next-same-pixels.json')).reuse, {
    reused: 2,
    fresh: 0,
    rejected: 0,
  });
  const differentPng = PNG.sync.write({ width: 4, height: 4, data: Buffer.alloc(64, 128) });
  await fs.writeFile(path.join(dir, 'new-one.png'), differentPng);
  const changedNativeData = JSON.parse(await fs.readFile(nextCapture.file, 'utf8'));
  Object.assign(changedNativeData.rows[0], { file: 'new-one.png', sha256: hash(differentPng) });
  const changedNative = await put('changed-native.json', changedNativeData);
  check(run(parent.file, 'changed-native-scores.json', true, changedNative.file, capture.file));
  assert.deepEqual((await read('changed-native-scores.json')).reuse, {
    reused: 1,
    fresh: 1,
    rejected: 0,
  });
  const noParent = run(parent.file, 'unbound-new-capture.json', true, nextCapture.file);
  assert.notEqual(noParent.status, 0);
  await fs.writeFile(path.join(dir, 'one.png'), Buffer.from('corrupt native bytes'));
  const corrupt = run(parent.file, 'corrupt-cached-face.json', true);
  assert.notEqual(corrupt.status, 0, 'Cached rows must verify current PNG bytes');
  await fs.writeFile(path.join(dir, 'one.png'), png);
  poses.rows[0].transform.matrix[4] += 2;
  const changed = await put('changed.json', poses);
  check(run(changed.file, 'changed-scores.json', true));
  assert.deepEqual((await read('changed-scores.json')).reuse, { reused: 1, fresh: 1, rejected: 0 });
  poses.rows[1].accepted = false;
  const rejected = await put('rejected.json', poses);
  check(run(rejected.file, 'rejected-scores.json', true));
  assert.deepEqual((await read('rejected-scores.json')).reuse, {
    reused: 0,
    fresh: 1,
    rejected: 1,
  });
  await fs.appendFile(metric, '// metric revision\n');
  const stale = run(parent.file, 'stale.json', true);
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /Metric graph changed/);
  const renamed = JSON.parse(await fs.readFile(capture.file, 'utf8'));
  renamed.rows[0].file = 'candidate-one.png';
  await fs.rename(path.join(dir, 'one.png'), path.join(dir, 'candidate-one.png'));
  const named = await put('named-capture.json', renamed);
  check(run(parent.file, 'named-scores.json', false, named.file));
  assert.deepEqual((await read('named-scores.json')).reuse, { reused: 0, fresh: 2, rejected: 0 });
  renamed.rows[0].file = '../one.png';
  const unsafe = await put('unsafe-capture.json', renamed);
  const invalid = run(parent.file, 'unsafe-scores.json', false, unsafe.file);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /Invalid native capture filename/);
  console.log(
    'Frozen baseline reuse preserves unchanged rows, rescores changed poses, excludes rejected poses and rejects stale metric graphs.',
  );
} finally {
  await fs.rm(dir, { recursive: true, force: true });
}
