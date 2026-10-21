// Compare frozen native replays with identical references, poses and metric code.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { hash, writeJson } from './common.mjs';

function index(rows) {
  const result = new Map(rows.map((r) => [r.id, r]));
  assert.equal(result.size, rows.length, 'Duplicate printing IDs');
  return result;
}

function paired(before, after) {
  for (const value of [before, after])
    assert(value === null || (Number.isFinite(value) && value >= 0 && value <= 1));
  assert.equal(before === null, after === null, 'Changed score availability');
  return before === null
    ? null
    : { before100: before * 100, after100: after * 100, delta100: (after - before) * 100 };
}

function summary(rows) {
  const measured = rows.filter(Boolean),
    count = measured.length;
  return {
    count,
    before100: count ? measured.reduce((s, r) => s + r.before100, 0) / count : null,
    after100: count ? measured.reduce((s, r) => s + r.after100, 0) / count : null,
    delta100: count ? measured.reduce((s, r) => s + r.delta100, 0) / count : null,
    improved: measured.filter((r) => r.delta100 > 1e-7).length,
    regressed: measured.filter((r) => r.delta100 < -1e-7).length,
    unchanged: measured.filter((r) => Math.abs(r.delta100) <= 1e-7).length,
  };
}

export function compareModernScores(before, after) {
  for (const key of [
    'set',
    'inputsHash',
    'normalizationHash',
    'metricGraph',
    'preprocessingGraph',
    'toolHash',
  ])
    assert.deepEqual(
      before.definition[key],
      after.definition[key],
      'Changed comparison dependency: ' + key,
    );
  const original = index(before.rows),
    candidate = index(after.rows);
  assert.deepEqual(
    [...original.keys()].sort(),
    [...candidate.keys()].sort(),
    'Changed printing census',
  );
  const rows = after.rows.map((r) => {
    const b = original.get(r.id);
    for (const key of [
      'inputHash',
      'referenceHash',
      'poseHash',
      'poseAccepted',
      'nonfoilEligible',
      'normalizedReference',
      'geometry',
      'family',
    ])
      assert.deepEqual(b[key], r[key], 'Changed printing comparison dependency: ' + key);
    for (const key of ['coverage', 'expectedWeight', 'measuredWeight'])
      assert.equal(b.metric[key], r.metric[key], 'Changed regional coverage');
    assert.deepEqual(
      Object.keys(b.metric.components).sort(),
      Object.keys(r.metric.components).sort(),
    );
    const components = Object.fromEntries(
      Object.entries(r.metric.components).map(([key, c]) => {
        const prior = b.metric.components[key];
        for (const field of ['weight', 'applicable', 'eligible', 'status'])
          assert.deepEqual(prior[field], c[field], 'Changed component eligibility');
        return [
          key,
          { eligible: c.eligible, status: c.status, score: paired(prior.score, c.score) },
        ];
      }),
    );
    return {
      id: r.id,
      name: r.name,
      number: r.number,
      geometry: r.geometry,
      family: r.family,
      inputHash: r.inputHash,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
      nonfoil: r.nonfoilEligible,
      poseAccepted: r.poseAccepted,
      structural: paired(b.metric.structuralScore, r.metric.structuralScore),
      components,
    };
  });
  const components = Object.fromEntries(
    Object.keys(rows[0]?.components ?? {}).map((key) => [
      key,
      {
        eligible: summary(
          rows.map((r) => (r.components[key].eligible ? r.components[key].score : null)),
        ),
        diagnostic: summary(rows.map((r) => r.components[key].score)),
      },
    ]),
  );
  return {
    denominator: rows.length,
    structural: summary(rows.map((r) => r.structural)),
    components,
    rows,
  };
}

async function main() {
  const [beforeScores, afterScores, beforeNative, afterNative, out] = process.argv.slice(2);
  assert(
    out,
    'Usage: modern-calibration-pair-report.mjs BEFORE_SCORES AFTER_SCORES BEFORE_NATIVE AFTER_NATIVE OUT',
  );
  const read = async (file) => {
    const bytes = await readFile(file);
    return { sha256: hash(bytes), data: JSON.parse(bytes) };
  };
  const [b, a, bn, an] = await Promise.all(
    [beforeScores, afterScores, beforeNative, afterNative].map(read),
  );
  assert.equal(b.data.definition.nativeCaptureHash, bn.sha256);
  assert.equal(a.data.definition.nativeCaptureHash, an.sha256);
  assert.equal(an.data.source.baselineHash, bn.sha256);
  for (const [scores, native] of [
    [b.data, bn.data],
    [a.data, an.data],
  ]) {
    assert.deepEqual(native.faults, []);
    assert.equal(native.completed, scores.rows.length);
    assert.equal(native.source.inputsHash, scores.definition.inputsHash);
    const captures = index(native.rows);
    for (const row of scores.rows)
      assert.equal(
        captures.get(row.id)?.layers.face.sha256,
        row.renderHash,
        'Score belongs to a different native face',
      );
  }
  const comparison = compareModernScores(b.data, a.data);
  const base = index(bn.data.rows),
    candidate = index(an.data.rows);
  assert.equal(base.size, comparison.denominator);
  assert.equal(candidate.size, comparison.denominator);
  let unchangedEtchings = 0;
  for (const row of comparison.rows) {
    const old = base.get(row.id),
      next = candidate.get(row.id);
    assert(old && next && !old.issue && !next.issue);
    for (const c of [old, next]) {
      assert.equal(c.inputHash, row.inputHash);
      assert.equal(c.referenceHash, row.referenceHash);
    }
    for (const layer of ['face', 'etching']) {
      const invariant = next.invariants[layer];
      assert.equal(invariant.outsideApprovedRegions, 0);
      assert.equal(invariant.alphaChanged, 0);
    }
    unchangedEtchings += Number(old.layers.etching.sha256 === next.layers.etching.sha256);
  }
  assert.deepEqual(an.data.faults, []);
  const report = {
    schema: 1,
    status: 'experimental-native-pair',
    eligibleForPublication: false,
    scope:
      'Same Original inputs, scan poses, reference pixels, metric code and coverage. Regional changes remain experimental. Diagnostic components excluded by the metric do not contribute to the structural total. Retains unsupported region maps, foil-only references and normalization review cases; no set certification.',
    source: {
      beforeScores: b.sha256,
      afterScores: a.sha256,
      beforeNative: bn.sha256,
      afterNative: an.sha256,
      tool: hash(await readFile(new URL(import.meta.url))),
    },
    invariants: {
      checkedPrintings: comparison.denominator,
      outsideApprovedRegions: 0,
      alphaChanged: 0,
      unchangedEtchings,
    },
    ...comparison,
  };
  await writeJson(out, report);
  console.log(
    JSON.stringify({
      structural: report.structural,
      credits: report.components.credits,
      invariants: report.invariants,
    }),
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
