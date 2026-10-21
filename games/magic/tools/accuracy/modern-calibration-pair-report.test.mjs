import test from 'node:test';
import assert from 'node:assert/strict';
import { compareModernScores } from './modern-calibration-pair-report.mjs';

function sample(score, credits, id = 'one') {
  return {
    definition: {
      set: 'm21',
      inputsHash: 'input',
      normalizationHash: 'pose',
      metricGraph: { hash: 'metric' },
      preprocessingGraph: { hash: 'pixels' },
      toolHash: 'tool',
    },
    rows: [
      {
        id,
        name: 'Example',
        inputHash: 'card',
        referenceHash: 'scan',
        poseHash: 'pose',
        poseAccepted: true,
        nonfoilEligible: true,
        geometry: 'normal',
        family: 'normal/W',
        normalizedReference: { sha256: 'fixed-pixels' },
        metric: {
          structuralScore: score,
          coverage: 0.96,
          expectedWeight: 100,
          measuredWeight: 96,
          components: {
            rules: { weight: 26, applicable: true, eligible: true, status: 'scored', score },
            credits: {
              weight: 4,
              applicable: true,
              eligible: false,
              status: 'unverified',
              score: credits,
            },
          },
        },
      },
    ],
  };
}

test('uses /100 units and keeps unverified credit gains out of the eligible summary', () => {
  const report = compareModernScores(sample(0.75, 0.5), sample(0.75, 0.9));
  assert.equal(report.structural.before100, 75);
  assert.equal(report.structural.delta100, 0);
  assert.equal(report.components.credits.eligible.count, 0);
  assert.equal(report.components.credits.diagnostic.delta100, 40);
});

test('refuses changed poses, scan pixels, census, metrics and eligibility', () => {
  const changes = [
    (r) => {
      r.rows[0].poseHash = 'new-pose';
    },
    (r) => {
      r.rows[0].normalizedReference.sha256 = 'new-pixels';
    },
    (r) => {
      r.rows.push(structuredClone(r.rows[0]));
    },
    (r) => {
      r.definition.metricGraph.hash = 'new-metric';
    },
    (r) => {
      r.rows[0].metric.components.credits.eligible = true;
    },
  ];
  for (const change of changes) {
    const a = sample(0.8, 0.8);
    change(a);
    assert.throws(() => compareModernScores(sample(0.7, 0.7), a));
  }
});

test('preserves missing maps rather than dropping them from the denominator', () => {
  const report = compareModernScores(sample(null, null), sample(null, null));
  assert.equal(report.denominator, 1);
  assert.equal(report.structural.count, 0);
  assert.equal(report.structural.after100, null);
  assert.throws(() => compareModernScores(sample(null, null), sample(0.8, 0.8)));
});
