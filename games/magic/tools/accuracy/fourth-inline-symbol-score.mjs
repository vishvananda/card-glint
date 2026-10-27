import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
const [inputsFile, posesFile, refinementFile, studyDirectory, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES LAND_REFINEMENT STUDY_DIRECTORY OUTPUT');
const files = [inputsFile, posesFile, refinementFile, path.join(studyDirectory, 'study.json')];
const raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [input, poses, refinement, study] = raw.map((b) => JSON.parse(b));
assert.equal(study.inputHash, hash(raw[0]));
assert.equal(refinement.parentHash, hash(raw[1]));
assert.equal(refinement.inputHash, hash(raw[0]));
const rows = [];
for (const r of study.rows) {
  const e = input.entries.find((e) => e.id === r.id),
    pose = poses.rows.find((p) => p.id === r.id);
  assert(e && pose?.accepted);
  const p =
    refinement.rows.find((p) => p.id === r.id && p.acceptedExperimental)?.transform ??
    pose.transform;
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const reference = normalize(PNG.sync.read(bytes), p);
  const native = PNG.sync.read(await fs.readFile(path.join(studyDirectory, r.modes.current.file)));
  const symbols = r.modes.current.symbols.map((s) => {
    const rect = [
      Math.floor(s.x) - 3,
      Math.floor(s.y) - 3,
      Math.ceil(s.size * (s.scaleX ?? 1)) + 7,
      Math.ceil(s.size) + 7,
    ];
    const mask = new Uint8Array(rect[2] * rect[3]).fill(1);
    return {
      ...s,
      rect,
      objective: new TextFilledObjective(cropGray(reference, rect).gray, rect[2], rect[3], mask),
    };
  });
  const row = {
    id: r.id,
    name: r.name,
    color: r.color,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(p)),
    modes: {},
  };
  for (const [mode, a] of Object.entries(r.modes)) {
    const bytes = await fs.readFile(path.join(studyDirectory, a.file));
    assert.equal(hash(bytes), a.sha256);
    const image = PNG.sync.read(bytes);
    assert.equal(image.width, 732);
    assert.equal(image.height, 1020);
    const normalized = normalize(image);
    const scores = symbols.map((s, index) => ({
      index,
      symbol: s.symbol,
      rect: s.rect,
      ...s.objective.score(cropGray(normalized, s.rect).gray),
    }));
    let changed = 0,
      outside = 0;
    for (let y = 0; y < image.height; y++)
      for (let x = 0; x < image.width; x++) {
        const i = (y * image.width + x) * 4;
        if (
          image.data[i] !== native.data[i] ||
          image.data[i + 1] !== native.data[i + 1] ||
          image.data[i + 2] !== native.data[i + 2] ||
          image.data[i + 3] !== native.data[i + 3]
        ) {
          changed++;
          if (
            !symbols.some(
              (s) =>
                x >= s.rect[0] * 1.5 &&
                x < (s.rect[0] + s.rect[2]) * 1.5 &&
                y >= s.rect[1] * 1.5 &&
                y < (s.rect[1] + s.rect[3]) * 1.5,
            )
          )
            outside++;
        }
      }
    assert.equal(outside, 0, 'Non-symbol pixels changed');
    row.modes[mode] = { sha256: a.sha256, scores, changedPixels: changed, outsidePixels: outside };
  }
  rows.push(row);
}
const groups = {};
for (const mode of study.modes.map((m) => m.id)) {
  groups[mode] = {};
  for (const symbol of ['T', 'W', 'U', 'B', 'R', 'G']) {
    const selected = rows.flatMap((r) =>
      r.modes[mode].scores.filter((s) => s.symbol === symbol).map((s) => ({ r, s })),
    );
    const before = selected.map(({ r, s }) => r.modes.current.scores[s.index].score);
    groups[mode][symbol] = {
      count: selected.length,
      before100: before.length ? (before.reduce((a, b) => a + b) / before.length) * 100 : null,
      after100: selected.length
        ? (selected.reduce((a, { s }) => a + s.score, 0) / selected.length) * 100
        : null,
      gains: selected.filter(({ s }, i) => s.score > before[i] + 1e-12).length,
      losses: selected.filter(({ s }, i) => s.score < before[i] - 1e-12).length,
    };
  }
}
await writeJson(out, {
  schema: 1,
  status: 'fixed-pose-inline-symbol-measurement-not-adopted',
  inputHash: hash(raw[0]),
  posesHash: hash(raw[1]),
  refinementHash: hash(raw[2]),
  studyHash: hash(raw[3]),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  groups,
  rows,
});
console.log(JSON.stringify(groups, null, 2));
