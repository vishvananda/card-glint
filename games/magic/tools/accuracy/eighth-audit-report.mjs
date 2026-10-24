// Join the complete native Eighth audit without copying reference artwork.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
const [directory, output] = process.argv.slice(2);
assert(output, 'Usage: eighth-audit-report.mjs PRIVATE_STUDY OUTPUT_JSON');
const read = async (file) => {
  const bytes = await readFile(path.join(directory, file));
  return { bytes, value: JSON.parse(bytes), hash: hash(bytes) };
};
const inputs = await read('inputs-final.json');
const stages = await Promise.all(
  ['scores-baseline-native', 'scores-reviewed-inputs-native', 'scores-policy-070'].map((s) =>
    read(s + '/scores.json'),
  ),
);
for (const stage of stages) {
  assert.equal(stage.value.rows.length, 357);
  assert.equal(stage.value.summary.acceptedPoses, 357);
  assert.equal(
    stage.value.definition.normalizationHash,
    stages[2].value.definition.normalizationHash,
  );
  assert.equal(
    stage.value.definition.metricGraph.hash,
    stages[2].value.definition.metricGraph.hash,
  );
}
const captures = await Promise.all(
  ['native-final', 'native-final-prepared', 'native-adoption-v2'].map((s) =>
    read(s + '/capture.json'),
  ),
);
const completeCapture = await read('native-policy-070/capture.json');
const pigmentCapture = await read('native-complete-070/capture.json');
for (const row of completeCapture.value.rows) {
  const prior = pigmentCapture.value.rows.find((r) => r.id === row.id);
  assert(prior);
  assert.equal(row.inputHash, prior.inputHash);
  assert.equal(row.referenceHash, prior.referenceHash);
  assert.deepEqual(row.layers, prior.layers, 'Source-color opt-out changed the calibrated census');
}

const verifyLayer = async (dir, layer) => {
  assert.equal(path.basename(layer.file), layer.file);
  const bytes = await readFile(path.join(directory, dir, layer.file));
  assert.equal(hash(bytes), layer.sha256);
  return bytes;
};
let exactPairs = 0;
const changed = [];
for (const row of captures[1].value.rows) {
  const old = captures[0].value.rows.find((r) => r.id === row.id);
  const v2 = captures[2].value.rows.find((r) => r.id === row.id);
  assert(old && v2);
  for (const layer of ['face', 'etching']) {
    await verifyLayer('native-final', old.layers[layer]);
    const final = await verifyLayer('native-final-prepared', row.layers[layer]);
    assert.equal(row.layers[layer].sha256, old.layers[layer].sha256);
    exactPairs++;
    if (layer === 'face' && v2.layers.face.sha256 !== row.layers.face.sha256) {
      const prior = PNG.sync.read(await verifyLayer('native-adoption-v2', v2.layers.face));
      const now = PNG.sync.read(final);
      let left = now.width,
        top = now.height,
        right = -1,
        bottom = -1,
        pixels = 0;
      for (let y = 0; y < now.height; y++)
        for (let x = 0; x < now.width; x++) {
          const at = 4 * (y * now.width + x);
          if (now.data.subarray(at, at + 4).equals(prior.data.subarray(at, at + 4))) continue;
          pixels++;
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      assert(
        left >= 40 && right <= 690 && top >= 630 && bottom <= 930,
        'Final text refinements escaped rules box',
      );
      changed.push({
        id: row.id,
        name: row.name,
        changedPixels: pixels,
        boundsNative: [left, top, right - left + 1, bottom - top + 1],
      });
    }
  }
}
assert.equal(exactPairs, 714);
assert.equal(changed.length, 13);
const colorRefinements = [];
let unchangedColorLayers = 0;
for (const row of completeCapture.value.rows) {
  const prior = captures[1].value.rows.find((r) => r.id === row.id);
  assert(prior);
  for (const layer of ['face', 'etching']) {
    await verifyLayer('native-policy-070', row.layers[layer]);
    if (row.layers[layer].sha256 === prior.layers[layer].sha256) unchangedColorLayers++;
    else {
      assert.equal(layer, 'face', 'Color-only refinement changed etching coverage');
      const entry = inputs.value.entries.find((e) => e.id === row.id);
      assert(entry.face.land && entry.face.frameColors.length === 2);
      colorRefinements.push({
        id: row.id,
        name: row.name,
        before: prior.layers.face.sha256,
        after: row.layers.face.sha256,
      });
    }
  }
}
assert.equal(colorRefinements.length, 5);
assert.equal(unchangedColorLayers, 709);

const names = new Map(inputs.value.entries.map((e) => [e.id, e]));
const rows = stages[2].value.rows.map((row) => {
  const entry = names.get(row.id);
  assert(entry);
  const before = stages[0].value.rows.find((r) => r.id === row.id);
  const corrected = stages[1].value.rows.find((r) => r.id === row.id);
  for (const r of [before, corrected]) {
    assert.equal(r.referenceHash, row.referenceHash);
    assert.equal(r.poseHash, row.poseHash);
    assert.equal(r.normalizedReference.sha256, row.normalizedReference.sha256);
  }
  assert(entry.card.finishes.includes('nonfoil'));
  const scores = [before, corrected, row].map((r) => r.metric.structuralScore * 100);
  const components = Object.fromEntries(
    Object.entries(row.metric.components)
      .filter(([, c]) => c.applicable && c.score !== null)
      .map(([k, c]) => [k, c.score * 100]),
  );
  return {
    id: row.id,
    name: row.name,
    number: row.number,
    geometry: row.geometry,
    rarity: row.rarity,
    referenceHash: row.referenceHash,
    poseHash: row.poseHash,
    inputHash: row.inputHash,
    nativeFaceHash: row.renderHash,
    normalizedReferenceHash: row.normalizedReference.sha256,
    baseline100: scores[0],
    correctedInput100: scores[1],
    final100: scores[2],
    components,
  };
});
const mean = (key) => rows.reduce((a, r) => a + r[key], 0) / rows.length;
const group = (key) =>
  Object.fromEntries(
    [...new Set(rows.map((r) => r[key]))].sort().map((k) => {
      const members = rows.filter((r) => r[key] === k);
      return [
        k,
        {
          printings: members.length,
          before100: members.reduce((a, r) => a + r.correctedInput100, 0) / members.length,
          after100: members.reduce((a, r) => a + r.final100, 0) / members.length,
        },
      ];
    }),
  );
const regionalMeans100 = Object.fromEntries(
  [...new Set(rows.flatMap((r) => Object.keys(r.components)))].map((key) => {
    const before = stages[1].value.rows
      .map((r) => r.metric.components[key]?.score)
      .filter((v) => v !== undefined && v !== null);
    const after = rows.filter((r) => r.components[key] !== undefined);
    return [
      key,
      {
        printings: after.length,
        before100: (100 * before.reduce((n, v) => n + v, 0)) / before.length,
        after100: after.reduce((n, r) => n + r.components[key], 0) / after.length,
      },
    ];
  }),
);
const cross = await read('cross-final-scores-native-poses.json');
const body = {
  schema: 1,
  set: '8ed',
  status: 'full-nonfoil-audit-with-recorded-residuals',
  targetVersion: '0.7.0',
  scope: {
    ordinaryRecords: 707,
    nonfoilMeasured: 357,
    foilOnlyExcluded: 350,
    heldOut: false,
    wording: 'Original with reviewed exact-printing corrections',
    posePolicy: 'One frozen native affine physical-frame pose per scan; renderer never consumes it',
    metric: 'Diagnostic structure index /100, not percentage fidelity or pigment accuracy',
    eligibility:
      'Development measurements. Publication and complete-set certification require their own gates.',
  },
  definition: {
    rendererHash: completeCapture.value.source.rendererHash,
    inputsHash: inputs.hash,
    nativeCaptureHash: completeCapture.hash,
    normalizationHash: stages[2].value.definition.normalizationHash,
    metricGraph: stages[2].value.definition.metricGraph.hash,
    scoreHashes: stages.map((s) => s.hash),
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary: {
    baseline100: mean('baseline100'),
    correctedInput100: mean('correctedInput100'),
    final100: mean('final100'),
    acceptedPoses: 357,
    regionalMeans100,
    improvedPrintings: rows.filter((r) => r.final100 > r.correctedInput100).length,
    regressedPrintings: rows.filter((r) => r.final100 < r.correctedInput100).length,
    exactPreparationPairs: exactPairs,
    byColorOrMaterial: group('geometry'),
    byRarity: group('rarity'),
  },
  pigmentSourceReplay: {
    scope:
      'All714 calibrated face/etching layers are identical across the source-color opt-out fix. Existing pixel-bound pigment measurements remain applicable; source-color behavior is tested separately.',
    beforeRenderer: pigmentCapture.value.source.rendererHash,
    afterRenderer: completeCapture.value.source.rendererHash,
    beforeCaptureHash: pigmentCapture.hash,
    afterCaptureHash: completeCapture.hash,
    exactPairs: 714,
  },
  finalTextChanges: changed,
  finalDualColorRefinements: { unchangedLayers: unchangedColorLayers, rows: colorRefinements },
  crossStock: {
    scope: cross.value.scope,
    sets: cross.value.sets.map(({ set, count, beforeMean100, afterMean100 }) => ({
      set,
      count,
      before100: beforeMean100,
      after100: afterMean100,
    })),
  },
  remainingReview: [
    {
      component: 'art',
      issue:
        'The physical aperture follows the measured frame, but the art_crop image and scan illustration are not identical crops on every printing. The separate art-region index is retained, including its regression; frame fitting never stretches a crop just to improve that score.',
    },

    {
      component: 'asset',
      issue:
        'Existing large white basic-land glyph has a heavier inner ring/baked bevel than the scan. Shared contour and placement are fitted; source-shape replacement is separate work.',
    },
    {
      component: 'asset',
      issue:
        'Source texture and baked bevels are not pixel-identical. Measured shared pigment/keyline corrections preserve their texture; matching average color is not a claim of exact texture.',
    },
    {
      component: 'rules/flavor',
      issue:
        'Some manual printing-specific line breaks and flavor orphans remain. A universal shrink rule was rejected because it regressed other cards; inspect the low-text list rather than overfit per scan.',
    },
    {
      component: 'foil',
      issue:
        '350 foil-only records are inventory and wording controls, excluded from ordinary pigment fitting. Their individual appearance has not been certified.',
    },
    {
      component: 'receiving sets',
      issue:
        '9ED/MRD samples validate baseline transfer only. Their own symbols, legal text and reviewed overrides remain; full receiving-set audits are still required.',
    },
  ],
  lowTextReview: rows
    .filter((r) => r.components.rules !== undefined)
    .sort((a, b) => a.components.rules - b.components.rules)
    .slice(0, 30)
    .map(({ id, name, number, components }) => ({
      id,
      name,
      number,
      rules100: components.rules,
      flavor100: components.flavor ?? null,
    })),
  rows,
};
const raw = Buffer.from(JSON.stringify(body) + '\n'),
  compressed = gzipSync(raw, { level: 9 });
const evidence = output.replace(/[.]json$/, '.json.gz');
await writeFile(evidence, compressed);
await writeJson(output, {
  ...body,
  rows: undefined,
  evidence: {
    file: evidence,
    sha256: hash(compressed),
    contentSha256: hash(raw),
    rows: rows.length,
  },
});
console.log(JSON.stringify(body.summary, null, 2));
