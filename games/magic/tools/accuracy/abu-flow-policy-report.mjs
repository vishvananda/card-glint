// Regional edge/filled-ink evidence for actual native shared flow proposals.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
const [inputFile, output, ...dirs] = process.argv.slice(2);
assert(dirs.length, 'Usage: abu-flow-policy-report.mjs INPUTS OUTPUT_GZ STUDY [STUDY...]');
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib),
  tool = await readFile(new URL(import.meta.url));
const methodFiles = [
  'abu-flow-policy-report.mjs',
  'text-filled-objective.mjs',
  'abu-type-objective.mjs',
  'pixels-pure.mjs',
  'edges.mjs',
];
const methods = await Promise.all(
  methodFiles.map(async (file) => {
    const text = await readFile(new URL(file, import.meta.url), 'utf8');
    return { file, sha256: hash(text), text };
  }),
);
const captures = [],
  rows = [];
const source = {
  rendererHash: await sourceHash('games/magic/src'),
  inputHash: hash(ib),
  toolHash: hash(tool),
  rect: [54, 405, 390, 197],
  objective:
    '55% symmetric local-contrast edge agreement +45% filled-ink overlap. Diagnostic out of100, separate from published whole-card score. Frozen references/poses, original wording and unchanged source/color assets. All regressions and newly unsafe layouts retained; no rule is promoted by this report.',
};
for (const dir of dirs) {
  const cb = await readFile(path.join(dir, 'capture.json')),
    capture = JSON.parse(cb);
  assert.equal(capture.status, 'complete-native-flow-policy-study-not-adopted');
  assert.equal(capture.source.closed, true);
  assert.equal(capture.source.rendererHash, source.rendererHash);
  assert.equal(capture.source.inputHash, source.inputHash);
  assert.deepEqual(capture.faults, []);
  assert.equal(capture.completed, capture.total);
  assert.equal(capture.rows.length, capture.total * capture.trials.length);
  for (const [file, key] of [
    ['method-study.mjs', 'toolHash'],
    ['method-plugin.mjs', 'pluginHash'],
  ]) {
    const text = await readFile(path.join(dir, file), 'utf8');
    assert.equal(hash(text), capture.source[key]);
    methods.push({ file, sha256: hash(text), text });
  }
  captures.push({ hash: hash(cb), capture });
  for (const id of new Set(capture.rows.map((r) => r.id))) {
    assert(!rows.some((r) => r.id === id), 'Duplicate study printing');
    const e = inputs.entries.find((e) => e.id === id);
    assert(e);
    const scan = await readFile(objectFile(e.reference));
    assert.equal(hash(scan), e.reference.sha256);
    const ref = cropGray(normalize(PNG.sync.read(scan), e.pose.transform), source.rect),
      objective = new TextFilledObjective(
        ref.gray,
        ref.width,
        ref.height,
        new Uint8Array(ref.gray.length).fill(1),
      );
    const related = capture.rows.filter((r) => r.id === id),
      current = related.find((r) => r.trial === 'current');
    assert.equal(related.length, capture.trials.length);
    let baselineScore;
    for (const r of related) {
      assert.equal(r.referenceHash, e.reference.sha256);
      assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
      assert.equal(r.poseHash, hash(JSON.stringify(e.pose)));
      const b = await readFile(path.join(dir, id + '-' + r.trial + '.png'));
      assert.equal(hash(b), r.nativeFaceHash);
      const score = objective.score(nativeGrayCrop(PNG.sync.read(b), source.rect));
      if (r.trial === 'current') baselineScore = score;
      assert(baselineScore);
      rows.push({
        ...r,
        score,
        score100: score.score * 100,
        delta100: 100 * (score.score - baselineScore.score),
        rowDelta: r.layout.lines.length - current.layout.lines.length,
        addedUnsafe: r.unsafe && !current.unsafe,
        correctedUnsafe: !r.unsafe && current.unsafe,
      });
    }
    assert.deepEqual(rows.find((r) => r.id === id && r.trial === 'control').score, baselineScore);
    console.log(e.set, e.name);
  }
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const summarize = (a) => ({
  cards: a.length,
  score100: mean(a.map((r) => r.score100)),
  delta100: mean(a.map((r) => r.delta100)),
  gains: a.filter((r) => r.delta100 > 0.5).length,
  regressions: a.filter((r) => r.delta100 < -0.5).length,
  changed: a.filter((r) => r.changed > 0).length,
  addedRows: a.filter((r) => r.rowDelta > 0).length,
  addedUnsafe: a.filter((r) => r.addedUnsafe).length,
  correctedUnsafe: a.filter((r) => r.correctedUnsafe).length,
  worstDelta100: Math.min(...a.map((r) => r.delta100)),
});
const summary = Object.fromEntries(
  captures[0].capture.trials.map((t) => [
    t.id,
    {
      all: summarize(rows.filter((r) => r.trial === t.id)),
      ...Object.fromEntries(
        ['lea', 'leb', '2ed'].map((set) => [
          set,
          summarize(rows.filter((r) => r.trial === t.id && r.set === set)),
        ]),
      ),
    },
  ]),
);
assert.equal(await sourceHash('games/magic/src'), source.rendererHash);
assert.equal(hash(await readFile(new URL(import.meta.url))), source.toolHash);
await writeFile(
  output,
  gzipSync(
    Buffer.from(
      JSON.stringify({
        schema: 1,
        status: 'native-shared-flow-policy-study-not-adopted',
        source,
        methods,
        captures,
        summary,
        rows,
      }) + '\n',
    ),
    { mtime: 0 },
  ),
);
console.log(JSON.stringify(summary));
