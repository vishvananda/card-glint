import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalizedRgbaRegion } from './normalized-rgba-region.mjs';
import { referenceManaCircle } from './reference-mana-circle.mjs';
const [inputsFile, posesFile, refineFile, studyDir, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES REFINEMENT STUDY_DIRECTORY OUTPUT');
const raw = await Promise.all(
  [inputsFile, posesFile, refineFile, path.join(studyDir, 'study.json')].map((f) => fs.readFile(f)),
);
const [input, poses, refine, study] = raw.map((b) => JSON.parse(b));
const rows = [];
for (const row of study.rows.filter((r) =>
  ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].includes(r.name),
)) {
  const e = input.entries.find((e) => e.id === row.id),
    parent = poses.rows.find((p) => p.id === row.id);
  const transform =
    refine.rows.find((r) => r.id === row.id && r.acceptedExperimental)?.transform ??
    parent.transform;
  const rb = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(rb), e.reference.sha256);
  const nb = await fs.readFile(path.join(studyDir, row.modes.current.file));
  assert.equal(hash(nb), row.modes.current.sha256);
  const source = PNG.sync.read(rb),
    native = PNG.sync.read(nb);
  const symbols = [];
  for (const s of row.modes.current.symbols) {
    const rect = [
      Math.floor(s.x) - 7,
      Math.floor(s.y) - 7,
      Math.ceil(s.size) + 15,
      Math.ceil(s.size) + 15,
    ];
    const prior = {
      x: s.x + s.size / 2 - rect[0],
      y: s.y + s.size / 2 - rect[1],
      radius: s.size / 2,
      range: 4,
      radiusTolerance: 1.25,
    };
    const a = referenceManaCircle(normalizedRgbaRegion(source, rect, transform), prior),
      b = referenceManaCircle(normalizedRgbaRegion(native, rect), prior);
    const nativeValid =
      b.status === 'measured' &&
      Math.hypot(b.x - prior.x, b.y - prior.y) <= 0.75 &&
      Math.abs(b.radius - prior.radius) <= 0.75;
    symbols.push({
      symbol: s.symbol,
      rect,
      prior,
      reference: a,
      native: b,
      nativeValid,
      delta:
        a.status === 'measured' && nativeValid
          ? { dx: a.x - prior.x, dy: a.y - prior.y, radius: a.radius - prior.radius }
          : null,
    });
  }
  rows.push({ id: e.id, name: e.name, symbols });
}
await writeJson(out, {
  schema: 1,
  status: 'inline-disc-geometry-diagnostic',
  inputHash: hash(raw[0]),
  posesHash: hash(raw[1]),
  refinementHash: hash(raw[2]),
  studyHash: hash(raw[3]),
  rows,
});
console.log(
  JSON.stringify(
    rows.map((r) => ({
      name: r.name,
      s: r.symbols.map((s) => ({
        symbol: s.symbol,
        status: s.reference.status,
        nativeValid: s.nativeValid,
        delta: s.delta,
      })),
    })),
    null,
    2,
  ),
);
