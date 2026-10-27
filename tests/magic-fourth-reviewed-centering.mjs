import {
  fourthDetailsHistoricalHash,
  preFourthDetailsSource,
} from '../games/magic/tools/accuracy/fourth-details-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthCenteredDelta,
  fourthCenteredHistoricalHash,
  preFourthCenteredSource,
  fourthCenteredAffected,
  fourthCenteredApproval,
} from '../games/magic/tools/accuracy/fourth-centered-ancestry.mjs';
import {
  centeredPaths as P,
  validateFourthCenteredData,
} from '../games/magic/tools/accuracy/fourth-centered-data-check.mjs';

const p = await fourthCenteredDelta();
assert.equal(await fourthDetailsHistoricalHash(), p.afterRenderer);
assert.equal(await fourthCenteredHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const current = await preFourthDetailsSource(file, await fs.readFile(file));
  assert.equal(hash(current), r.after);
  const restored = await preFourthCenteredSource(file, current);
  if (r.before !== null) assert.equal(hash(restored), r.before);
  const unknown = Buffer.concat([current, Buffer.from('\n// unreviewed change\n')]);
  assert.deepEqual(await preFourthCenteredSource(file, unknown), unknown);
}
const corrupt = structuredClone(p);
const annotation = JSON.parse(corrupt.files[P.annotation].afterSource);
annotation.cards[p.ids[0]].paragraphs[0].runs[0].text += ' Unprinted words.';
corrupt.files[P.annotation].afterSource = JSON.stringify(annotation);
corrupt.files[P.annotation].after = hash(corrupt.files[P.annotation].afterSource);
assert.throws(() => validateFourthCenteredData(corrupt));
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/4ed/reviewed-centering-adoption.json'),
);
assert.equal(review.afterRenderer, p.afterRenderer);
const artifacts = {},
  rawArtifacts = {};
for (const [key, ref] of Object.entries(review.artifacts)) {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  rawArtifacts[key] = raw;
  artifacts[key] = ['scores', 'study', 'studyDefinition'].includes(key) ? JSON.parse(raw) : raw;
}
const rejected = JSON.parse(rawArtifacts.rejectedCutoffStudy);
assert.equal(rejected.status, 'complete-exploratory');
assert.equal(rejected.rows.length, 360);
assert.equal(rejected.toolHash, hash(artifacts.studyTool));
assert.equal(rejected.rendererHash, p.afterRenderer);
assert.equal(rejected.inputHash, artifacts.study.inputHash);
assert.equal(rejected.baselineHash, artifacts.study.baselineHash);
for (const summary of review.rejectedCutoffs.candidates) {
  const deltas = rejected.rows.map((row) => {
    const b = row.trials[0],
      a = row.trials.find((t) => t.candidate.id === summary.candidate.id);
    return (a.metric.score - b.metric.score) * 100;
  });
  assert.equal(deltas.filter((v) => v < -0.05).length, summary.lossesOver005);
  // The receipt sums in Python; allow only floating-point accumulation roundoff.
  assert(Math.abs(deltas.reduce((a, b) => a + b, 0) / 360 - summary.meanRegionDelta100) < 1e-12);
}
const native = JSON.parse(gunzipSync(await fs.readFile(p.native.file)));
const prior = JSON.parse(gunzipSync(await fs.readFile(p.parentScores.file)));
const scores = artifacts.scores,
  study = artifacts.study;
assert.equal(native.toolHash, hash(artifacts.nativeTool));
assert.equal(scores.toolHash, hash(artifacts.scoreTool));
assert.equal(study.toolHash, hash(artifacts.studyTool));
assert.equal(study.definitionHash, hash(rawArtifacts.studyDefinition));
assert.equal(
  hash(rawArtifacts.studyDefinition),
  hash(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/reviewed-centering-study-definition.json'),
  ),
);
assert.equal(study.rendererHash, p.afterRenderer);
assert.equal(study.baselineRendererHash, p.beforeRenderer);
assert.equal(native.source.prototype, hash(rawArtifacts.study));
assert.equal(scores.centeredNativeProofHash, p.native.contentSha256);
assert.deepEqual(scores.metricGraph, prior.metricGraph);
assert.deepEqual(scores.policyGraph, prior.policyGraph);
assert.deepEqual(scores.reuse, { reused: 366, fresh: 12 });
assert.deepEqual(review.wholeCard, scores.summary.all);
assert.deepEqual(review.nativeCounts, native.counts);
assert.equal(scores.summary.all.improved, 12);
assert.equal(scores.summary.all.regressed, 0);
assert.equal(scores.rows.length, 378);
for (const row of scores.rows) {
  const old = prior.rows.find((r) => r.id === row.id),
    n = native.rows.find((r) => r.id === row.id);
  assert(old && n);
  assert.equal(row.beforeNativeHash, old.nativeHash);
  assert.equal(row.nativeHash, n.modes.original.after);
  for (const key of ['referenceHash', 'poseHash', 'regionPlanHash'])
    assert.equal(row[key], old[key]);
  assert.equal(row.beforeInputHash, old.inputHash);
  assert.equal(row.inputHash, n.inputHash);
  assert.equal(row.scoreReused, !n.scoped);
  if (!n.scoped) {
    assert.deepEqual(row.score, old.score);
    assert.equal(row.delta100, 0);
  } else {
    assert(row.delta100 > 0);
    const trial = study.rows.find((r) => r.id === row.id);
    assert.equal(trial.candidateHash, row.nativeHash);
    assert.equal(trial.referenceHash, row.referenceHash);
    const fit = trial.trials.find((t) => t.candidate.id === 'fit26');
    assert.equal(fit.layout.size, 26);
    assert.equal(fit.outside, 0);
    assert.equal(fit.alpha, 0);
  }
}
const member = native.rows.find((r) => r.scoped),
  group = { printingIds: [member.id], printings: 1 };
for (const task of ['rules', 'flavor', 'fullCard', 'release']) {
  assert(await fourthCenteredAffected('4ed', task, false, group));
  assert(!(await fourthCenteredAffected('4ed', task, true, group)));
  assert(!(await fourthCenteredAffected('4ed', task, false, { printingIds: ['other'] })));
}
for (const task of [
  'headings',
  'frameGeometry',
  'frameColor',
  'normalization',
  'manaGeometry',
  'manaColor',
  'artist',
  'footer',
  'stats',
  'setSymbol',
])
  assert(!(await fourthCenteredAffected('4ed', task, false, group)));
assert(!(await fourthCenteredAffected('3ed', 'rules', false, group)));
assert(
  !(await fourthCenteredApproval({ proof: { reviewedCenteringSource: p.afterRenderer } }, group)),
);
const approved = {
  runtimeGuards: { 'games/magic/src': p.afterRenderer },
  proof: {
    reviewedCenteringSource: p.afterRenderer,
    nativeReplayHash: p.native.contentSha256,
    coveredPrintings: 1,
    validationKind: 'source-census',
    sourceCensus: {
      members: [
        {
          id: member.id,
          name: member.name,
          referenceHash: member.referenceHash,
          poseHash: prior.rows.find((r) => r.id === member.id).poseHash,
          inputHash: member.inputHash,
          nativeFaceHash: member.modes.original.after,
        },
      ],
    },
  },
};
assert(await fourthCenteredApproval(approved, group));
for (const key of ['nativeFaceHash', 'poseHash', 'referenceHash', 'inputHash', 'id']) {
  const bad = structuredClone(approved);
  bad.proof.sourceCensus.members[0][key] = 'foreign';
  assert(!(await fourthCenteredApproval(bad, group)));
}
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const { resolveSetPrintingWording } = await server.ssrLoadModule(
    '/games/magic/src/printing/lazy.ts',
  );
  const { resolvePrintingWording } = await server.ssrLoadModule(
    '/games/magic/src/printing/resolve.ts',
  );
  for (const m of p.members) {
    const a = JSON.parse(p.files[P.annotation].afterSource).cards[m.id];
    const flavor = [
      {
        role: 'flavor',
        runs: [
          { text: 'Caller flavor ', italic: true },
          { text: 'book title', italic: false },
        ],
      },
    ];
    const input = {
      original: {
        typeLine: 'Enchantment',
        rulesText: 'Caller original words.',
        rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Caller original words.' }] }, ...flavor],
      },
      oracle: { typeLine: 'Enchantment', rulesText: 'Modern Oracle words.' },
    };
    const frozen = JSON.stringify(input),
      options = { referenceSha256: m.referenceHash };
    const lazy = await resolveSetPrintingWording('4ED', m.id, input, options);
    assert.deepEqual(lazy, resolvePrintingWording(m.id, input, options));
    assert.equal(JSON.stringify(input), frozen);
    assert.equal(lazy.provenance.status, 'applied');
    const expected =
      a.paragraphScope === 'rules-only' ? [...a.paragraphs, ...flavor] : a.paragraphs;
    assert.deepEqual(lazy.wordings.original.rulesParagraphs, expected);
    const priorTypes = JSON.parse(p.files[P.catalog].beforeSource).wording[m.id] ?? [];
    const expectedType = priorTypes.reduce(
      (value, row) => row.fields.typeLine ?? value,
      input.original.typeLine,
    );
    assert.equal(lazy.wordings.original.typeLine, expectedType);
    assert.equal(lazy.wordings.oracle.rulesText, input.oracle.rulesText);
    assert.equal(lazy.wordings.oracle.rulesParagraphs[0].align, undefined);
    const stale = await resolveSetPrintingWording('4ed', m.id, input, {
      referenceSha256: '0'.repeat(64),
    });
    assert.equal(stale.provenance.status, 'reference-mismatch');
    assert.deepEqual(stale.wordings.original.rulesParagraphs, input.original.rulesParagraphs);
    const missing = await resolveSetPrintingWording('4ed', m.id, { oracle: input.oracle }, options);
    assert.equal(missing.wordings.original, undefined);
  }
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
    const { calibratedBodyLayout } = await import('/games/magic/src/calibration/body.ts');
    const {
      describeSetCalibration,
      createSetCalibrationCandidate,
      resolveSetCalibrationCandidate,
    } = await import('/games/magic/src/calibration/editor.ts');
    const ctx = document.createElement('canvas').getContext('2d');
    const check = (ok, message) => {
      if (!ok) throw Error(message);
    };
    const d = describeSetCalibration('4ed');
    check(
      d.controls.find((c) => c.id === 'body.centered.maximumSize')?.value === 26,
      'Missing shared centered editor controls',
    );
    const candidate = createSetCalibrationCandidate('4ed', d.revision, {
      'body.centered.maximumSize': 25.5,
    });
    const profile = resolveSetCalibrationCandidate(candidate);
    check(profile.body.centered.maximumSize === 25.5, 'Centered editor did not resolve');
    const text =
      'If target creature is put into the graveyard, Creature Bond deals damage equal to the creature’s toughness to that creature’s controller.';
    const centered = [{ role: 'rules', align: 'center', runs: [{ text }] }];
    const plain = centered.map(({ align, ...p }) => p);
    const face = {
      name: 'Printing format control',
      setCode: '4ed',
      frameStyle: 'retro',
      colors: ['U'],
      manaCost: '{U}',
      typeLine: 'Enchantment',
      wordingMode: 'original',
      rulesParagraphs: centered,
      rulesAlignment: { mode: 'auto', reference: centered },
      setCalibrationCandidate: candidate,
    };
    const before = JSON.stringify(face),
      result = retroTextLayout(ctx, face);
    const expected = calibratedBodyLayout(ctx, face, profile.body.centered, centered, centered);
    check(
      JSON.stringify(result) === JSON.stringify(expected),
      'Reviewed formatting missed shared centered profile',
    );
    check(JSON.stringify(face) === before, 'Painter mutated caller input');
    const forced = retroTextLayout(ctx, { ...face, rulesAlignment: { mode: 'left' } });
    check(
      forced.lines.every((l) => l.x === forced.x),
      'Forced-left formatting ignored',
    );
    const own = {
      ...face,
      wordingMode: 'oracle',
      rulesParagraphs: plain,
      rulesAlignment: { mode: 'auto', reference: plain },
    };
    const current = retroTextLayout(ctx, own);
    check(
      JSON.stringify(current) !== JSON.stringify(expected),
      'Own Oracle reference inherited Original centering',
    );
    const visible = [
      {
        role: 'rules',
        runs: [{ text: 'Target creature gains flying until end of turn. '.repeat(16) }],
      },
    ];
    const longFace = { ...face, wordingMode: 'oracle', rulesParagraphs: visible };
    const fit = retroTextLayout(ctx, longFace);
    check(
      !fit.overflow && fit.size < 25.5 && fit.width === 344 && fit.x === 72,
      'Long Oracle did not fit within selected centered bounds',
    );
  });
} finally {
  await browser.close();
  await server.close();
}
console.log(
  'Fourth reviewed centering:12 Original formatting corrections,378 score/native joins,366 exact reuses,Oracle and rich flavor safety,shared editable typography and scoped approval guards pass.',
);
