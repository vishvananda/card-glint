// Compile measured regional diagnostics by the current physical inventory.
// This imports scores; it does not fit parameters or certify completion.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { hash, objectFile, root, sourceHash, writeJson } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';

function indexed(rows, label) {
  const result = new Map(rows.map((row) => [row.id, row]));
  assert.equal(result.size, rows.length, 'Duplicate ' + label + ' member');
  return result;
}
function score(value) {
  assert(Number.isFinite(value) && value >= 0 && value <= 1, 'Invalid normalized score');
  return value * 100;
}
function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}
function lowest(rows, key) {
  return rows
    .filter((row) => row[key] !== null)
    .sort((a, b) => a[key] - b[key] || a.id.localeCompare(b.id))
    .slice(0, 5)
    .map((row) => ({ id: row.id, name: row.name, number: row.number, score100: row[key] }));
}
export function summarizeComponents(rows) {
  const nonfoil = rows.filter((row) => row.nonfoil);
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row.components)))].sort();
  return {
    printings: rows.length,
    nonfoil: nonfoil.length,
    foilOnly: rows.length - nonfoil.length,
    acceptedPoses: rows.filter((row) => row.poseAccepted).length,
    wholeCard: {
      measured: rows.filter((row) => row.structure100 !== null).length,
      mean100: mean(rows.flatMap((row) => (row.structure100 === null ? [] : [row.structure100]))),
      nonfoilMean100: mean(
        nonfoil.flatMap((row) => (row.structure100 === null ? [] : [row.structure100])),
      ),
      meanCoverage: mean(rows.map((row) => row.coverage)),
      lowest: lowest(nonfoil, 'structure100'),
    },
    components: Object.fromEntries(
      keys.map((key) => {
        const eligible = nonfoil.filter((row) => row.components[key]?.eligible);
        const fields = eligible.map((row) => ({ ...row, value: row.components[key].score100 }));
        return [
          key,
          {
            expectedNonfoil: nonfoil.filter((row) => row.components[key]?.applicable).length,
            measuredNonfoil: eligible.length,
            mean100: mean(fields.map((row) => row.value)),
            diagnosticMean100: mean(
              nonfoil.flatMap((row) =>
                row.components[key]?.diagnostic100 == null
                  ? []
                  : [row.components[key].diagnostic100],
              ),
            ),
            statuses: Object.fromEntries(
              [...new Set(nonfoil.map((row) => row.components[key]?.status ?? 'absent'))]
                .sort()
                .map((status) => [
                  status,
                  nonfoil.filter((row) => (row.components[key]?.status ?? 'absent') === status)
                    .length,
                ]),
            ),
            lowest: lowest(fields, 'value'),
            foilOnlyControls: rows.filter((row) => !row.nonfoil && row.components[key]?.eligible)
              .length,
          },
        ];
      }),
    ),
  };
}
export function compileComponentCensus({ inputs, native, normalization, scores, groups }) {
  assert.equal(inputs.set, 'm21');
  const entries = indexed(inputs.entries, 'input');
  const faces = indexed(native.rows, 'native');
  const poses = indexed(normalization.rows, 'pose');
  const measured = indexed(scores.rows, 'score');
  const ids = [...entries.keys()].sort();
  assert.equal(ids.length, 297, 'Complete M21 printing census required');
  for (const table of [faces, poses, measured]) assert.deepEqual([...table.keys()].sort(), ids);
  assert.deepEqual(
    groups.flatMap((group) => group.printingIds).sort(),
    ids,
    'Inventory partition changed',
  );
  assert.equal(native.completed, ids.length);
  assert.equal(native.denominator, ids.length);
  assert.deepEqual(native.faults, []);
  const rows = inputs.entries.map((entry) => {
    assert.equal(entry.face.wordingMode, 'original');
    const face = faces.get(entry.id),
      pose = poses.get(entry.id),
      measurement = measured.get(entry.id);
    const inputHash = hash(JSON.stringify(entry.face));
    for (const row of [face, measurement]) assert.equal(row.inputHash, inputHash);
    for (const row of [face, pose, measurement])
      assert.equal(row.referenceHash, entry.reference.sha256);
    assert.equal(measurement.renderHash, face.layers.face.sha256);
    assert.equal(measurement.poseHash, hash(JSON.stringify(pose.transform)));
    assert.equal(measurement.poseAccepted, pose.accepted);
    const nonfoil = entry.card.finishes.includes('nonfoil');
    assert.equal(measurement.nonfoilEligible, nonfoil);
    const metric = measurement.metric;
    assert(Number.isFinite(metric.coverage) && metric.coverage >= 0 && metric.coverage <= 1);
    return {
      id: entry.id,
      name: entry.card.name,
      number: entry.card.collector_number,
      nonfoil,
      poseAccepted: pose.accepted,
      referenceHash: entry.reference.sha256,
      poseHash: measurement.poseHash,
      inputHash,
      nativeFaceHash: face.layers.face.sha256,
      nativeEtchingHash: face.layers.etching.sha256,
      structure100: metric.structuralScore === null ? null : score(metric.structuralScore),
      coverage: metric.coverage,
      components: Object.fromEntries(
        Object.entries(metric.components).map(([key, part]) => {
          const eligible = part.applicable === true && part.eligible === true;
          assert(!eligible || part.score !== null, 'Eligible component lacks a score');
          return [
            key,
            {
              applicable: part.applicable === true,
              eligible,
              status: part.status,
              score100: eligible ? score(part.score) : null,
              diagnostic100: part.score == null ? null : score(part.score),
            },
          ];
        }),
      ),
    };
  });
  return {
    schema: 1,
    set: 'm21',
    status: 'current-measured-component-census-not-certification',
    policy:
      'Original wording; frozen comparison-only affine poses; imported regional structure indices out of100. Regional coverage is explicit. Color/saturation are not measured by this structure metric. Rules and flavor share one region; artist and copyright share credits. Those regions do not independently certify their subcomponents. Foil-only printings remain structure controls and never enter nonfoil component means. No set/task approval follows from this census.',
    summary: summarizeComponents(rows),
    groups: groups.map((group) => ({
      key: group.key,
      scopeHash: group.scopeHash,
      sourceHash: group.sourceHash,
      palette: group.palette,
      kind: group.kind,
      ...summarizeComponents(rows.filter((row) => group.printingIds.includes(row.id))),
    })),
    rows,
  };
}
async function main(args) {
  const [inputsFile, nativeDir, normalizationDir, scoresDir, metricFile, output] = args;
  assert(
    args.length === 6,
    'Usage: modern-component-census.mjs INPUTS NATIVE NORMALIZATION SCORES METRIC OUT_JSON',
  );
  const read = async (file) => {
    const bytes = await readFile(file);
    return { bytes, data: JSON.parse(bytes) };
  };
  const inputs = await read(inputsFile),
    native = await read(path.join(nativeDir, 'capture.json')),
    normalization = await read(path.join(normalizationDir, 'normalization.json')),
    scores = await read(path.join(scoresDir, 'scores.json')),
    inventory = await read(
      path.join(root, 'games/magic/fixtures/accuracy/calibration-progress.json'),
    );
  const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
  assert.equal(native.data.source.rendererHash, rendererHash, 'Native renderer is stale');
  assert.equal(native.data.source.inputsHash, hash(inputs.bytes));
  assert.equal(scores.data.definition.inputsHash, hash(inputs.bytes));
  assert.equal(scores.data.definition.nativeCaptureHash, hash(native.bytes));
  assert.equal(scores.data.definition.nativeRendererHash, rendererHash);
  assert.equal(scores.data.definition.normalizationHash, hash(normalization.bytes));
  assert.equal(scores.data.definitionHash, hash(JSON.stringify(scores.data.definition)));
  assert.deepEqual(scores.data.definition.metricGraph, await metricSourceGraph(metricFile));
  assert.deepEqual(
    scores.data.definition.preprocessingGraph,
    await metricSourceGraph(new URL('./pixels-pure.mjs', import.meta.url).pathname),
  );
  for (const [file, digest] of native.data.source.rasterHelpers)
    assert.equal(hash(await readFile(path.join(root, 'packages/browser/src', file))), digest);
  for (const [file, digest] of native.data.source.packMetadata)
    assert.equal(hash(await readFile(path.join(root, 'games/magic', file))), digest);
  const groups = inventory.data.sets.find((set) => set.set === inputs.data.set).groups;
  const census = compileComponentCensus({
    inputs: inputs.data,
    native: native.data,
    normalization: normalization.data,
    scores: scores.data,
    groups,
  });
  // Read and hash the actual files, not just manifest strings. No image bytes
  // are emitted. The scoring pass already CRC-decodes these same native rasters.
  const check = async (file, digest) =>
    assert.equal(hash(await readFile(file)), digest, 'Changed raster: ' + path.basename(file));
  for (const entry of inputs.data.entries) {
    const face = native.data.rows.find((row) => row.id === entry.id);
    const row = scores.data.rows.find((row) => row.id === entry.id);
    await check(objectFile(entry.reference), entry.reference.sha256);
    for (const layer of ['face', 'etching']) {
      const image = face.layers[layer];
      assert.equal(image.file, entry.id + (layer === 'etching' ? '-etching' : '') + '.png');
      await check(path.join(nativeDir, image.file), image.sha256);
    }
    assert.equal(row.normalizedReference.file, 'references/' + entry.id + '.png');
    await check(path.join(scoresDir, row.normalizedReference.file), row.normalizedReference.sha256);
  }
  census.definition = {
    rendererHash,
    inputsHash: hash(inputs.bytes),
    nativeCaptureHash: hash(native.bytes),
    normalizationHash: hash(normalization.bytes),
    scoresHash: hash(scores.bytes),
    metricGraphHash: scores.data.definition.metricGraph.hash,
    inventoryScopeHash: hash(JSON.stringify(groups.map((g) => [g.key, g.scopeHash]))),
    toolHash: hash(await readFile(new URL(import.meta.url))),
  };
  const raw = Buffer.from(JSON.stringify(census) + '\n'),
    compressed = gzipSync(raw, { level: 9 });
  const compressedFile = path.basename(output) + '.gz';
  await writeFile(output + '.gz', compressed);
  await writeJson(output, {
    ...census,
    rows: undefined,
    evidence: { file: compressedFile, sha256: hash(compressed), contentSha256: hash(raw) },
  });
  console.log(JSON.stringify({ ...census.summary, groups: census.groups.length }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await main(process.argv.slice(2));
