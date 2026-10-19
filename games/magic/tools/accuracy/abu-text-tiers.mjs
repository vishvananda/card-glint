import path from 'node:path';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash, objectFile } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { inkEdges } from './edges.mjs';

const [inputsFile, posesDirectory, output] = process.argv.slice(2);
if (!output) throw Error('Usage: abu-text-tiers.mjs INPUTS POSES OUT');
const inputs = await readJson(inputsFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json'));
assert.equal(poses.inputHash, hash(await readFile(inputsFile)));
const median = (a) => (a.length ? [...a].sort((a, b) => a - b)[Math.floor(a.length / 2)] : null);
const rows = [];
for (const e of inputs.entries) {
  const p = poses.rows.find((p) => p.id === e.id);
  const scan = normalize(
    normalize(PNG.sync.read(await readFile(objectFile(e.reference)))),
    p.transform,
  );
  const rect = [78, 416, 340, 180],
    { gray, width, height } = cropGray(scan, rect);
  const { ink } = inkEdges(gray, width, height),
    projection = Array.from({ length: height }, (_, y) => {
      let n = 0;
      for (let x = 0; x < width; x++) n += ink[y * width + x];
      return n;
    });
  const threshold = Math.max(6, Math.max(...projection) * 0.14);
  const active = projection.map((v) => v >= threshold);
  for (let y = 1; y < height - 1; y++) if (active[y - 1] && active[y + 1]) active[y] = true;
  const bands = [];
  let start = null;
  for (let y = 0; y <= height; y++) {
    if (active[y] && start === null) start = y;
    if (!active[y] && start !== null) {
      if (y - start >= 5)
        bands.push({
          top: start + rect[1],
          bottom: y + rect[1],
          height: y - start,
          ink: projection.slice(start, y).reduce((a, b) => a + b, 0),
        });
      start = null;
    }
  }
  const paragraphs = e.face.rulesParagraphs ?? [],
    text = paragraphs.flatMap((p) => p.runs.map((r) => r.text)).join(' ');
  rows.push({
    id: e.id,
    name: e.card.name,
    material: e.material,
    cohort: p.cohort,
    accepted: p.accepted,
    characters: paragraphs.reduce((n, p) => n + p.runs.reduce((n, r) => n + r.text.length, 0), 0),
    words: text.match(/\S+/g)?.length ?? 0,
    paragraphs: paragraphs.length,
    flavor: paragraphs.some((p) => p.role === 'flavor'),
    explicitBreaks: (text.match(/\n/g) ?? []).length,
    medianBandHeight: median(bands.map((b) => b.height)),
    medianPitch: median(bands.slice(1).map((b, i) => b.top - bands[i].top)),
    bands,
    projection,
    referenceHash: e.reference.sha256,
  });
  if (rows.length % 50 === 0) console.log(rows.length, inputs.entries.length);
}
await writeJson(output, {
  schema: 1,
  scope:
    'Diagnostic scan ink-band measurements. Not renderer defaults or automatic size labels; texture and merged adjacent lines require visual certification.',
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  rows,
});
