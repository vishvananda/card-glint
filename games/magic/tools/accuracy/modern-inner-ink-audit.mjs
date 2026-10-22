import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, luminance } from './pixels-pure.mjs';
import { measureWindows } from './window-geometry.mjs';
import { median } from './metrics.mjs';
import { hash, writeJson } from './common.mjs';

// Fixed art-rim strips are free of text. Detect each ridge independently;
// uncertain geometry is retained, never replaced by a brighter neighbor.
export function measureArtRimInk(image) {
  const geometry = measureWindows(image).art,
    gray = luminance(image);
  const sides = {};
  for (const side of ['left', 'right']) {
    const edge = geometry[side],
      strips = [];
    if (edge.reliable)
      for (const strip of edge.strips) {
        if (strip.status !== 'measured') continue;
        const x = Math.round(strip.position);
        // Choose the darkest complete column, rather than individual dark pixels
        // from print noise or an adjacent illustration. Three fixed columns cover
        // fractional rasterization of a one-pixel ridge.
        const columns = [-1, 0, 1]
          .map((dx) => {
            const samples = Array.from({ length: 30 }, (_, j) => {
              const pixel = (strip.y + j) * image.width + x + dx;
              return { luma: gray[pixel], rgb: [...image.data.subarray(pixel * 4, pixel * 4 + 3)] };
            });
            return {
              x: x + dx,
              luma: median(samples.map((s) => s.luma)),
              rgb: [0, 1, 2].map((c) => median(samples.map((s) => s.rgb[c]))),
            };
          })
          .sort((a, b) => a.luma - b.luma);
        strips.push({
          y: strip.y,
          position: strip.position,
          strength: strip.strength,
          ...columns[0],
        });
      }
    sides[side] = {
      status: strips.length >= 2 ? 'measured' : 'uncertain',
      geometry: edge,
      strips,
      rgb: strips.length >= 2 ? [0, 1, 2].map((c) => median(strips.map((s) => s.rgb[c]))) : null,
    };
  }
  return sides;
}

async function main() {
  const [inputFile, nativeDir, scoreDir, parameterFile, output] = process.argv.slice(2);
  assert(output, 'Usage: modern-inner-ink-audit.mjs INPUTS NATIVE SCORES PARAMETERS OUTPUT');
  const read = async (f) => {
    const bytes = await readFile(f);
    return { bytes, data: JSON.parse(bytes) };
  };
  const [inputs, native, scores, parameters] = await Promise.all([
    read(inputFile),
    read(path.join(nativeDir, 'capture.json')),
    read(path.join(scoreDir, 'scores.json')),
    read(parameterFile),
  ]);
  assert.equal(parameters.data.schema, 1);
  assert.equal(native.data.source.inputsHash, hash(inputs.bytes));
  assert.equal(scores.data.definition.inputsHash, hash(inputs.bytes));
  assert.equal(native.data.completed, inputs.data.entries.length);
  assert.equal(native.data.denominator, native.data.completed);
  assert.deepEqual(native.data.faults, []);
  const index = (rows) => {
    const map = new Map(rows.map((r) => [r.id, r]));
    assert.equal(map.size, rows.length);
    return map;
  };
  const captures = index(native.data.rows),
    references = index(scores.data.rows),
    census = index(inputs.data.entries),
    selected = new Set(parameters.data.ids);
  assert.equal(selected.size, parameters.data.ids.length);
  assert.equal(captures.size, census.size);
  assert.equal(references.size, census.size);
  const rows = [];
  for (const id of selected) {
    const e = census.get(id),
      n = captures.get(id),
      s = references.get(id);
    assert(e && n && s && !n.issue);
    assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(n.referenceHash, e.reference.sha256);
    assert.equal(s.referenceHash, e.reference.sha256);
    assert(s.poseAccepted && s.nonfoilEligible);
    const [renderBytes, referenceBytes] = await Promise.all([
      readFile(path.join(nativeDir, n.layers.face.file)),
      readFile(path.join(scoreDir, s.normalizedReference.file)),
    ]);
    assert.equal(hash(renderBytes), n.layers.face.sha256);
    assert.equal(hash(referenceBytes), s.normalizedReference.sha256);
    const reference = PNG.sync.read(referenceBytes, { checkCRC: true });
    assert.deepEqual([reference.width, reference.height], [488, 680]);
    rows.push({
      id,
      name: e.card.name,
      number: e.card.collector_number,
      color: e.face.colors?.join('') || 'A',
      renderHash: n.layers.face.sha256,
      referenceHash: s.normalizedReference.sha256,
      poseHash: s.poseHash,
      rendered: measureArtRimInk(normalize(PNG.sync.read(renderBytes, { checkCRC: true }))),
      reference: measureArtRimInk(reference),
    });
  }
  const summary = (list) =>
    Object.fromEntries(
      ['left', 'right'].map((side) => {
        const measured = list.filter(
          (r) => r.rendered[side].status === 'measured' && r.reference[side].status === 'measured',
        );
        return [
          side,
          {
            total: list.length,
            measured: measured.length,
            uncertain: list.length - measured.length,
            renderedMedianRgb: measured.length
              ? [0, 1, 2].map((c) => median(measured.map((r) => r.rendered[side].rgb[c])))
              : null,
            referenceMedianRgb: measured.length
              ? [0, 1, 2].map((c) => median(measured.map((r) => r.reference[side].rgb[c])))
              : null,
          },
        ];
      }),
    );
  const report = {
    schema: 1,
    status: 'interior-ridge-ink-diagnostic-not-set-certification',
    definition: {
      inputsHash: hash(inputs.bytes),
      nativeHash: hash(native.bytes),
      scoresHash: hash(scores.bytes),
      parametersHash: hash(parameters.bytes),
      toolHash: hash(await readFile(new URL(import.meta.url))),
      detectorHash: hash(await readFile(new URL('./window-geometry.mjs', import.meta.url))),
      preprocessingHash: hash(await readFile(new URL('./pixels-pure.mjs', import.meta.url))),
      policy:
        'Frozen accepted nonfoil references. Independent fixed art-ridge detectors measure color, without changing any pose or score. Use the darkest complete column in a three-column neighborhood, median over each 30-row strip, and require two reliable strips per side. Ambiguous/boundary/weak edges stay uncertain. This measures art side outlines only, not all interior ink or shape accuracy.',
    },
    summary: summary(rows),
    groups: Object.fromEntries(
      [...new Set(rows.map((r) => r.color))]
        .sort()
        .map((c) => [c, summary(rows.filter((r) => r.color === c))]),
    ),
    rows,
  };
  await writeJson(output, report);
  console.log(JSON.stringify({ summary: report.summary, groups: report.groups }));
}
if (process.argv[1] === new URL(import.meta.url).pathname) await main();
