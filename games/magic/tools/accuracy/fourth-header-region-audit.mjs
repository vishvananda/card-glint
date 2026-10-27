import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion } from './metrics.mjs';
const [inputFile, captureFile, poseFile, scoreFile, out] = process.argv.slice(2);
assert(out, 'Use ORIGINAL_INPUTS NATIVE_CAPTURE STOCK_POSES WHOLE_SCORES OUTPUT');
const contents = await Promise.all(
  [inputFile, captureFile, poseFile, scoreFile].map((f) => fs.readFile(f)),
);
const [input, capture, poses, scores] = contents.map((b) => JSON.parse(b));
assert.equal(capture.rendererHash, scores.rendererHash);
const entries = input.entries.filter((e) => e.card.set === '4ed');
const basic = entries.filter((e) => /^Basic Land\b/.test(e.card.type_line));
assert.equal(basic.length, 15);
const controls = ['W', 'U', 'B', 'R', 'G', 'A'].flatMap((material) =>
  entries
    .filter((e) => e.material === material)
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 2),
);
assert.equal(controls.length, 12);
const rows = [];
for (const e of [...basic, ...controls]) {
  const native = capture.rows.find((r) => r.id === e.id)?.modes.original,
    pose = poses.rows.find((r) => r.id === e.id);
  const score = scores.rows.find((r) => r.id === e.id);
  assert(native && pose?.accepted && score);
  assert.equal(score.nativeHash, native.sha256);
  assert.equal(score.referenceHash, e.reference.sha256);
  const rb = await fs.readFile(objectFile(e.reference)),
    nb = await fs.readFile(path.join(path.dirname(captureFile), native.file));
  assert.equal(hash(rb), e.reference.sha256);
  assert.equal(hash(nb), native.sha256);
  const scan = normalize(PNG.sync.read(rb), pose.transform),
    render = normalize(PNG.sync.read(nb));
  const trials = {};
  for (const kind of ['title', 'type']) {
    const original = score.score.components[kind].parts[0];
    assert.equal(original.kind, 'ink');
    const [x, y, w] = original.rect;
    const cases = {
      published: original.rect,
      vertical: kind === 'title' ? [x, 24, w, 32] : [x, 380, w, 23],
    };
    if (basic.includes(e)) {
      cases.text = kind === 'title' ? [34, 24, 180, 32] : [37, 380, 110, 23];
      cases.blank = kind === 'title' ? [240, 24, 190, 32] : [180, 380, 205, 23];
    }
    const result = {};
    for (const [name, rect] of Object.entries(cases)) {
      const a = cropGray(scan, rect),
        b = cropGray(render, rect);
      const m = compareRegion(a.gray, b.gray, a.width, a.height, original.lightInk);
      if (name === 'published')
        assert(
          Math.abs(m.edgeF1[1] - original.metrics.edgeF1[1]) < 1e-12,
          'Published metric drift ' + e.name,
        );
      result[name] = {
        rect,
        edge100: m.edgeF1?.[1] * 100,
        referenceEdges: m.referenceEdges,
        renderedEdges: m.renderedEdges,
      };
    }
    trials[kind] = result;
  }
  rows.push({
    id: e.id,
    name: e.name,
    number: e.card.collector_number,
    material: e.material,
    basic: basic.includes(e),
    referenceHash: e.reference.sha256,
    nativeHash: native.sha256,
    poseHash: score.poseHash,
    trials,
  });
}
const sources = {};
for (const file of [
  'fourth-header-region-audit.mjs',
  'metrics.mjs',
  'edges.mjs',
  'pixels-pure.mjs',
])
  sources[file] = hash(await fs.readFile(new URL(file, import.meta.url)));
const summary = {};
for (const group of ['basic', 'control']) {
  const rs = rows.filter((r) => r.basic === (group === 'basic'));
  summary[group] = { cards: rs.length };
  for (const kind of ['title', 'type']) {
    summary[group][kind] = {};
    for (const name of Object.keys(rs[0].trials[kind])) {
      const ms = rs.map((r) => r.trials[kind][name]);
      summary[group][kind][name] = {
        mean100: ms.reduce((n, m) => n + m.edge100, 0) / ms.length,
        meanReferenceEdges: ms.reduce((n, m) => n + m.referenceEdges, 0) / ms.length,
        meanRenderedEdges: ms.reduce((n, m) => n + m.renderedEdges, 0) / ms.length,
      };
    }
  }
}
await writeJson(out, {
  schema: 1,
  set: '4ed',
  status: 'diagnostic-region-contamination-audit',
  rendererHash: capture.rendererHash,
  sourceHashes: contents.map(hash),
  sources,
  scope:
    '15 basic-land faces plus two deterministic ID-sorted controls per ordinary nonland material. Published heading metrics are exactly reproduced before diagnostic cropping. Words,pixels,scan poses and metric equations are unchanged. No region,score,renderer or completion defaults are adopted. A blank window is known to contain no heading text; detected edges there reveal frame texture/border contamination. Diagnostic numbers from different windows are not interchangeable accuracy scores.',
  summary,
  rows,
});
console.log(summary);
