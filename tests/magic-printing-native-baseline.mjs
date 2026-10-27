import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'magic-native-baseline-'));
try {
  const cache = path.join(directory, 'cache'),
    native = path.join(directory, 'native'),
    out = path.join(directory, 'scores');
  await fs.mkdir(path.join(cache, 'objects'), { recursive: true });
  await fs.mkdir(native);
  const raster = (rgb) => {
    const image = new PNG({ width: 488, height: 680 });
    for (let i = 0; i < image.data.length; i += 4) image.data.set([...rgb, 255], i);
    return PNG.sync.write(image);
  };
  const refs = [raster([10, 200, 0]), raster([10, 200, 0]), raster([55, 200, 0])],
    rendered = [refs[0], raster([30, 0, 0]), refs[2]],
    entries = await Promise.all(
      ['a', 'b', 'c'].map(async (key, i) => {
        const sha256 = hash(refs[i]);
        await fs.writeFile(path.join(cache, 'objects', sha256), refs[i]);
        await fs.writeFile(path.join(native, key + '.png'), rendered[i]);
        return {
          id: 'printing-' + key,
          name: 'Control ' + key,
          material: i ? 'A' : 'W',
          card: { id: 'printing-' + key, finishes: ['nonfoil'] },
          face: { wordingMode: 'original', typeLine: 'Artifact' },
          reference: { sha256 },
        };
      }),
    ),
    inputFile = path.join(directory, 'inputs.json'),
    inputBytes = JSON.stringify({ set: 'test', entries }),
    captureFile = path.join(native, 'capture.json'),
    capture = {
      status: 'complete',
      faults: [],
      rendererHash: 'frozen-archived-painter',
      inputHash: hash(inputBytes),
      rows: entries.map((e, i) => ({
        id: e.id,
        name: e.name,
        referenceHash: e.reference.sha256,
        modes: {
          original: {
            inputHash: hash(JSON.stringify(e.face)),
            file: ['a', 'b', 'c'][i] + '.png',
            sha256: hash(rendered[i]),
          },
        },
      })),
    },
    posesFile = path.join(directory, 'poses.json'),
    poses = {
      set: 'test',
      inputHash: hash(inputBytes),
      rows: entries.map((e, i) => ({
        id: e.id,
        referenceHash: e.reference.sha256,
        accepted: i !== 2,
        cohort: 'calibration',
        transform: {},
      })),
    },
    metricFile = path.join(directory, 'metric.mjs'),
    calls = path.join(directory, 'calls.txt');
  await fs.writeFile(inputFile, inputBytes);
  await fs.writeFile(captureFile, JSON.stringify(capture));
  await fs.writeFile(posesFile, JSON.stringify(poses));
  await fs.writeFile(
    metricFile,
    "import {appendFileSync} from 'node:fs';\nexport function scoreRegions(a,b){appendFileSync(" +
      JSON.stringify(calls) +
      ",'call\\n');return {structuralScore:a.data[0]===b.data[0]?1:0.5,coverage:b.data[1]>0?1:0.4};}\n",
  );
  const run = () =>
    execFileSync(
      process.execPath,
      [
        'games/magic/tools/accuracy/printing-native-baseline-score.mjs',
        inputFile,
        captureFile,
        posesFile,
        metricFile,
        out,
      ],
      { env: { ...process.env, MAGIC_ACCURACY_CACHE: cache }, stdio: 'pipe' },
    );
  run();
  const first = JSON.parse(await fs.readFile(path.join(out, 'scores.json')));
  assert.deepEqual(first.reuse, { resumed: 0, fresh: 3 });
  assert.equal(first.summary.all.cards, 3);
  assert.equal(first.summary.all.acceptedPoses, 2);
  assert.equal(first.summary.all.rankedDiagnostics, 1);
  assert.equal(first.summary.all.alignmentReview, 1);
  assert.equal(first.summary.all.contentReview, 1);
  assert.equal(first.summary.all.acceptedPoseMean100, 100);
  assert.equal(first.rows.find((r) => r.id === 'printing-c').score.structuralScore, 1);
  assert.equal(first.rows.find((r) => r.id === 'printing-c').aggregateEligible, false);
  const callBytes = await fs.readFile(calls);
  run();
  const resumed = JSON.parse(await fs.readFile(path.join(out, 'scores.json')));
  assert.deepEqual(resumed.reuse, { resumed: 3, fresh: 0 });
  assert.deepEqual(resumed.rows, first.rows);
  assert.deepEqual(await fs.readFile(calls), callBytes, 'Resuming must not recompute metrics');
  const rowFile = path.join(out, 'rows', 'printing-a.json'),
    oldRow = await fs.readFile(rowFile),
    altered = JSON.parse(oldRow);
  altered.row.score.structuralScore = 0.001;
  await fs.writeFile(rowFile, JSON.stringify(altered));
  assert.throws(run, /Corrupt baseline score row/);
  await fs.writeFile(rowFile, oldRow);
  await fs.writeFile(path.join(native, 'a.png'), rendered[1]);
  assert.throws(run, /AssertionError/, 'Changed pixels cannot reuse a cached score');
  await fs.writeFile(path.join(native, 'a.png'), rendered[0]);
  await fs.writeFile(captureFile, JSON.stringify({ ...capture, status: 'in-progress' }));
  assert.throws(run, /in-progress/, 'Partial face revisions cannot enter a baseline');
  await fs.writeFile(captureFile, JSON.stringify(capture));
  await fs.appendFile(metricFile, '\n// changed metric graph\n');
  assert.throws(run, /Use a new output/, 'A different metric graph cannot reuse rows');
} finally {
  await fs.rm(directory, { recursive: true, force: true });
}
console.log(
  'Native baseline scores retain alignment/content exclusions,score archived native bytes without a browser,resume without metric calls,and reject changed pixels,rows,partial captures or metric graphs.',
);
