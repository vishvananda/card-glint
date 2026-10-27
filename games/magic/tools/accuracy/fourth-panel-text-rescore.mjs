import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
const [inputFile, registrationFile, nativeFile, stockFile, studyFile, studyDirectory, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: fourth-panel-text-rescore.mjs INPUTS PANEL_REGISTRATION NATIVE_CAPTURE STOCK_POSES TEXT_STUDY STUDY_DIRECTORY NEW_OUTPUT',
);
const ib = await fs.readFile(inputFile),
  inputs = JSON.parse(ib),
  registrationBytes = await fs.readFile(registrationFile),
  registration = JSON.parse(registrationBytes),
  native = JSON.parse(await fs.readFile(nativeFile)),
  stock = JSON.parse(await fs.readFile(stockFile)),
  studyBytes = await fs.readFile(studyFile),
  study = JSON.parse(studyBytes);
assert.equal(inputs.set, '4ed');
assert.equal(native.status, 'complete');
assert.equal(native.inputHash, hash(ib));
assert.equal(study.inputHash, hash(ib));
assert.equal(study.rendererHash, native.rendererHash);
const sources = Object.fromEntries(
  await Promise.all(
    [
      'fourth-panel-text-rescore.mjs',
      'text-filled-objective.mjs',
      'edges.mjs',
      'pixels-pure.mjs',
      'abu-type-objective.mjs',
    ].map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
  ),
);

assert.equal(study.status, 'complete-exploratory');
assert.equal(registration.status, 'complete-experimental-not-adopted');
assert.equal(registration.inputHash, hash(ib));
const rect = [60, 415, 370, 186],
  mask = new Uint8Array(370 * 186).fill(1),
  rows = [];
for (const r of study.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    p = registration.rows.find((p) => p.id === r.id),
    s = stock.rows.find((p) => p.id === r.id),
    n = native.rows.find((n) => n.id === r.id).modes.original,
    bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const image = PNG.sync.read(bytes),
    currentBytes = await fs.readFile(path.join(path.dirname(nativeFile), n.file));
  assert.equal(hash(currentBytes), n.sha256);
  const currentGray = nativeGrayCrop(PNG.sync.read(currentBytes), rect),
    beforeObjective = new TextFilledObjective(
      cropGray(normalize(image, s.transform), rect).gray,
      rect[2],
      rect[3],
      mask,
    ),
    afterObjective = new TextFilledObjective(
      cropGray(normalize(image, p.transform), rect).gray,
      rect[2],
      rect[3],
      mask,
    ),
    before = beforeObjective.score(currentGray),
    after = afterObjective.score(currentGray);
  assert(Math.abs(before.score - r.trials[0].metric.score) < 1e-8, 'CPU baseline drift ' + r.name);
  let candidateBefore, candidateAfter;
  if (!r.trials[1].invalid) {
    const cb = await fs.readFile(path.join(studyDirectory, r.id + '-candidate.png'));
    assert.equal(hash(cb), r.candidateHash);
    const g = nativeGrayCrop(PNG.sync.read(cb), rect);
    candidateBefore = beforeObjective.score(g);
    candidateAfter = afterObjective.score(g);
    assert(Math.abs(candidateBefore.score - r.trials[1].metric.score) < 1e-8);
  }
  const ps = e.face.rulesParagraphs,
    pure = ps.every((p) => p.role === 'rules'),
    chars = ps
      .flatMap((p) => p.runs.map((r) => r.text))
      .join('')
      .replace(/\{[^}]+\}/g, '●').length,
    b = r.trials[0],
    a = r.trials[1],
    narrow =
      !a.invalid &&
      pure &&
      ((a.selectedClass === 'compact' && b.layout.size >= 17.5 && b.layout.size < 21.75) ||
        (a.selectedClass === 'large' && chars <= 130));
  rows.push({
    id: r.id,
    name: r.name,
    material: e.material,
    accepted: p.accepted,
    referenceHash: e.reference.sha256,
    nativeHash: n.sha256,
    parentTransform: s.transform,
    panelTransform: p.transform,
    before,
    after,
    candidateBefore,
    candidateAfter,
    narrow,
  });
  if (rows.length % 30 === 0) console.log('Rescored', rows.length);
}
const mean = (a) => a.reduce((s, n) => s + n, 0) / a.length,
  accepted = rows.filter((r) => r.accepted),
  selected = accepted.filter((r) => r.narrow),
  summary = {
    cards: rows.length,
    accepted: accepted.length,
    currentStock100: 100 * mean(accepted.map((r) => r.before.score)),
    currentPanel100: 100 * mean(accepted.map((r) => r.after.score)),
    normalizationImproved: accepted.filter((r) => r.after.score > r.before.score + 1e-9).length,
    normalizationRegressed: accepted.filter((r) => r.after.score < r.before.score - 1e-9).length,
    narrowSelected: selected.length,
    narrowPanelDelta100:
      100 *
      mean(accepted.map((r) => (r.narrow ? r.candidateAfter : r.after).score - r.after.score)),
    narrowGains: selected.filter((r) => r.candidateAfter.score > r.after.score + 1e-9).length,
    narrowLosses: selected.filter((r) => r.candidateAfter.score < r.after.score - 1e-9).length,
  };
await writeJson(output, {
  schema: 1,
  status: 'complete-diagnostic-not-default-approval',
  sources,
  rendererHash: native.rendererHash,
  inputHash: hash(ib),
  registrationHash: hash(registrationBytes),
  studyHash: hash(studyBytes),
  metric: 'TextFilledObjective;regional only;whole-card stock scores unchanged',
  summary,
  rows,
});
console.log(JSON.stringify(summary));
