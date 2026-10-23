// Fixed source-alpha support; candidate shadows cannot select their own mask.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
import { blur } from './edges.mjs';
const [beforeDir, afterDir, proposalDir, scoreDir, fieldsFile, trialFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: modern-basic-shadow-native-audit.mjs BEFORE AFTER PROPOSAL SCORES FIELDS_GZ TRIAL OUTPUT',
);
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const [before, after, proposal, scores, trial] = await Promise.all(
  [
    path.join(beforeDir, 'capture.json'),
    path.join(afterDir, 'capture.json'),
    path.join(proposalDir, 'capture.json'),
    path.join(scoreDir, 'scores.json'),
    trialFile,
  ].map(read),
);
const fieldBytes = await readFile(fieldsFile),
  fields = JSON.parse(gunzipSync(fieldBytes));
for (const c of [before, after]) {
  assert.equal(c.data.completed, 297);
  assert.equal(c.data.denominator, 297);
  assert.equal(c.data.rows.length, 297);
  assert.deepEqual(c.data.faults, []);
}
assert.equal(before.data.source.inputsHash, after.data.source.inputsHash);
assert.equal(scores.data.definition.inputsHash, before.data.source.inputsHash);
assert.equal(proposal.data.completed, 15);
assert.equal(fields.length, 15);
assert.deepEqual(proposal.data.faults, []);
const index = (rows) => new Map(rows.map((r) => [r.id, r]));
const now = index(after.data.rows),
  proposed = index(proposal.data.rows),
  refs = index(scores.data.rows),
  fixed = index(fields),
  searched = index(trial.data.rows),
  rows = [];
const raster = async (dir, m) => {
  const bytes = await readFile(path.join(dir, m.file));
  assert.equal(hash(bytes), m.sha256);
  return PNG.sync.read(bytes, { checkCRC: true });
};
const contrast = (gray, w, h) => {
  const mean = blur(gray, w, h, 7);
  return Float32Array.from(gray, (v, i) => 255 - Math.min(255, Math.max(0, mean[i] - v - 25) * 2));
};
let unchangedFaces = 0,
  exactEtchings = 0;
for (const b of before.data.rows) {
  const a = now.get(b.id);
  assert(a);
  assert.equal(a.inputHash, b.inputHash);
  assert.equal(a.referenceHash, b.referenceHash);
  const oldEtch = await raster(beforeDir, b.layers.etching),
    newEtch = await raster(afterDir, a.layers.etching);
  assert(oldEtch.data.equals(newEtch.data), 'Changed etching ' + b.name);
  exactEtchings++;
  const old = await raster(beforeDir, b.layers.face),
    image = await raster(afterDir, a.layers.face),
    f = fixed.get(b.id);
  if (!f) {
    assert(old.data.equals(image.data), 'Changed unrelated face ' + b.name);
    unchangedFaces++;
    continue;
  }
  const proposalRow = proposed.get(b.id);
  assert(proposalRow);
  assert.equal(proposalRow.inputHash, b.inputHash);
  assert.equal(proposalRow.referenceHash, b.referenceHash);
  assert(
    image.data.equals((await raster(proposalDir, proposalRow.layers.face)).data),
    'Proposal mismatch ' + f.name,
  );
  const [rx, ry, w, h] = f.rect,
    mask = Uint8Array.from(f.mask);
  assert.equal(mask.length, w * h);
  let changedPixels = 0;
  for (let y = 0; y < old.height; y++)
    for (let x = 0; x < old.width; x++) {
      const k = (y * old.width + x) * 4;
      if (!old.data.subarray(k, k + 4).equals(image.data.subarray(k, k + 4))) {
        changedPixels++;
        assert(
          x >= rx * 1.5 && x < (rx + w) * 1.5 && y >= ry * 1.5 && y < (ry + h) * 1.5,
          'Change outside basic symbol ' + f.name,
        );
      }
    }
  const r = refs.get(b.id);
  assert(r.nonfoilEligible && r.poseAccepted);
  const ref = await raster(scoreDir, r.normalizedReference);
  const reference = Float32Array.from({ length: w * h }, (_, i) => {
    const k = ((ry + Math.floor(i / w)) * ref.width + rx + (i % w)) * 4;
    return 0.2126 * ref.data[k] + 0.7152 * ref.data[k + 1] + 0.0722 * ref.data[k + 2];
  });
  const objectives = {
    raw: new TextFilledObjective(reference, w, h, mask),
    ink: new TextFilledObjective(contrast(reference, w, h), w, h, mask),
  };
  const measure = (im) => {
    const gray = nativeGrayCrop(im, f.rect, [0, 0]);
    const raw = objectives.raw.score(gray),
      ink = objectives.ink.score(contrast(gray, w, h));
    return { score: 0.8 * ink.score + 0.2 * raw.score, raw, ink };
  };
  const previous = measure(old),
    current = measure(image),
    trials = searched.get(b.id).trials;
  assert(
    Math.abs(previous.score - trials.find((t) => t.id === 'current').score) < 1e-7,
    'Baseline drift ' + f.name,
  );
  assert(
    Math.abs(current.score - trials.find((t) => t.id === 'a0.6-x-1-y3-b1').score) < 1e-7,
    'Candidate drift ' + f.name,
  );
  rows.push({
    id: b.id,
    name: f.name,
    number: f.number,
    maskPixels: mask.reduce((n, v) => n + v, 0),
    changedPixels,
    before100: previous.score * 100,
    after100: current.score * 100,
    delta100: (current.score - previous.score) * 100,
  });
}
assert.equal(rows.length, 15);
assert.equal(unchangedFaces, 282);
assert.equal(exactEtchings, 297);
await writeJson(output, {
  schema: 1,
  set: 'm21',
  status: 'native-basic-cast-shadow-adoption-not-set-completion',
  definition: {
    beforeCapture: hash(before.bytes),
    afterCapture: hash(after.bytes),
    proposalCapture: hash(proposal.bytes),
    beforeRenderer: before.data.source.rendererHash,
    afterRenderer: after.data.source.rendererHash,
    references: hash(scores.bytes),
    fields: hash(fieldBytes),
    trial: hash(trial.bytes),
    tool: hash(await readFile(new URL(import.meta.url))),
    method:
      'Frozen nonfoil frame-normalized scans; unchanged source geometry/colors. Fixed six-pixel support around the opaque source-alpha boundary.80% local-contrast filled/edge ink plus20% raw filled/edge ink. No per-card transform or mask fitting.',
  },
  summary: {
    fields: 15,
    beforeMean100: rows.reduce((n, r) => n + r.before100, 0) / 15,
    afterMean100: rows.reduce((n, r) => n + r.after100, 0) / 15,
    improved: rows.filter((r) => r.delta100 > 1e-7).length,
    regressed: rows.filter((r) => r.delta100 < -1e-7).length,
    worstDelta100: Math.min(...rows.map((r) => r.delta100)),
    exactProposalFaces: 15,
    unchangedOtherFaces: unchangedFaces,
    exactEtchings,
  },
  rows,
  review: [
    'Only the additional cast shadow changes; baked source bevels/rings remain. A white-sun rim-color mismatch remains separate.',
    'Canonical shadow units scale with the preparation transform; tested at244,488,732 widths. Unreviewed sources and sets retain previous rendering.',
  ],
});
console.log('Audited15 native basic shadows,282 unchanged faces and297 unchanged etchings');
