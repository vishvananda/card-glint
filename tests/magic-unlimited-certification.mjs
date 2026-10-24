import { abuCurrentApproval } from '../games/magic/tools/accuracy/abu-current-review.mjs';
import { abuFlowAffected } from '../games/magic/tools/accuracy/abu-flow-ancestry.mjs';
import { validateUnlimitedRasterGeometry } from '../games/magic/tools/accuracy/unlimited-raster-geometry-policy.mjs';
import { abuPaperDelta } from '../games/magic/tools/accuracy/abu-paper-ancestry.mjs';
import { abuRasterDelta } from '../games/magic/tools/accuracy/abu-raster-ancestry.mjs';
import { gunzipSync } from 'node:zlib';
import { abuRasterAffected } from '../games/magic/tools/accuracy/abu-raster-ancestry.mjs';
import ts from 'typescript';
import { parseProfileData } from '../games/magic/tools/accuracy/profile-data-modules.mjs';
import assert from 'node:assert/strict';
import { restoreUnlimitedProfilePayload } from '../games/magic/tools/accuracy/unlimited-tone-payload.mjs';
import { readFile } from 'node:fs/promises';
import { hash, readJson } from '../games/magic/tools/accuracy/common.mjs';
import {
  CALIBRATION_TASKS,
  calibrationTaskStatus,
} from '../games/magic/tools/accuracy/calibration-ledger.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
import {
  unlimitedCalibrationEvidence,
  applyUnlimitedEvidence,
} from '../games/magic/tools/accuracy/calibration-unlimited-current.mjs';
const data = await unlimitedCalibrationEvidence();
assert.equal(data.current, true);
for (const [file, expected] of Object.entries(data.receipt.artifacts))
  assert.equal(hash(await readFile(file)), expected, 'Changed Unlimited evidence ' + file);
const ledger = await readJson('games/magic/fixtures/accuracy/calibration-progress.json');
const set = ledger.sets.find((s) => s.set === '2ed');

const geometry = JSON.parse(
  gunzipSync(
    await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/2ed-raster-geometry-review.json.gz',
    ),
  ),
);
const paperDelta = await abuPaperDelta(),
  rasterDelta = await abuRasterDelta();
validateUnlimitedRasterGeometry(geometry, paperDelta, rasterDelta);
for (const mutate of [
  (r) => r.rows.pop(),
  (r) => {
    r.rows[1] = r.rows[0];
  },
  (r) => {
    delete r.rows[0].strips.top;
  },
  (r) => {
    r.rows[0].poseHash = '0'.repeat(64);
  },
  (r) => {
    r.rows[0].currentFaceHash = '0'.repeat(64);
  },
  (r) => {
    r.rows[0].strips.left.best.shift = 0.5;
  },
  (r) => {
    r.rows[0].strips.left.referenceAfter100 = 0;
  },
  (r) => {
    r.rows[0].strips.left.samePosition100 = Number.NaN;
  },
  (r) => {
    r.rows[0].strips.left.negative[0].score = 100;
  },
]) {
  const invalid = structuredClone(geometry);
  mutate(invalid);
  assert.throws(() => validateUnlimitedRasterGeometry(invalid, paperDelta, rasterDelta));
}
for (const row of geometry.rows) {
  const group = set.groups.find((g) => g.printingIds.includes(row.id));
  assert.equal(
    group.tasks.frameGeometry.status,
    'validated',
    'Five unchanged raster-selection variants require their own geometry review',
  );
  assert.equal(group.tasks.frameGeometry.proof.exactCurrentRenderer, paperDelta.afterRenderer);
}

assert.equal(set.groups.length, 27);
assert.equal(
  set.groups.reduce((n, g) => n + g.printings, 0),
  302,
);
for (const original of set.groups) {
  const group = structuredClone(original);
  applyUnlimitedEvidence(group, data);
  for (const task of Object.keys(CALIBRATION_TASKS)) {
    const item = calibrationTaskStatus(group, task);
    if (group.applicable?.[task] === false) assert.equal(item.status, 'not-applicable');
    else if (task !== 'release') assert.equal(item.status, 'validated', group.key + '/' + task);
  }
  const stale = structuredClone(original);
  applyUnlimitedEvidence(stale, { ...data, current: false });
  assert.equal(stale.tasks.fullCard.status, 'stale');
  const moved = structuredClone(original);
  moved.sourceHash = 'a'.repeat(64);
  applyUnlimitedEvidence(moved, data);
  assert.equal(moved.tasks.frameGeometry.status, 'stale');
  const missing = structuredClone(data);
  missing.receipt.rows = missing.receipt.rows.filter((r) => r.id !== group.printingIds[0]);
  assert.throws(() => applyUnlimitedEvidence(structuredClone(original), missing));
}
const historicalRelease = structuredClone(set.groups[0]);
historicalRelease.tasks.release = {
  ...historicalRelease.tasks.release,
  status: 'validated',
  proof: { ...(historicalRelease.tasks.release.proof ?? {}), rendererHash: '0'.repeat(64) },
};
applyUnlimitedEvidence(historicalRelease, data);
assert.equal(
  historicalRelease.tasks.release.status,
  'pending',
  'A historical release cannot certify new renderer pixels',
);
const reports = await calibrationReport({ sets: [set] });
// The historical census still verifies the unchanged profile. The new ABU
// text policy and five raster-outline variants have their own current replays
// and must not inherit old approvals; every other component remains reusable.
const changedTasks = new Set(['rules', 'flavor', 'fullCard', 'release']);
let expectedValidated = 0;
for (const group of set.groups)
  for (const task of Object.keys(CALIBRATION_TASKS)) {
    if (group.applicable?.[task] === false) continue;
    const recorded = group.tasks[task];
    const outstanding = reports[0].outstanding.find(
      (r) => r.group === group.key && r.task === task,
    );
    const outlineChanged =
      task === 'frameGeometry' && (await abuRasterAffected('2ed', task, false, group));
    if (
      ['validated', 'validated-default'].includes(recorded.status) &&
      (await abuCurrentApproval(recorded, group, task, false, '2ed'))
    ) {
      assert.equal(outstanding, undefined, 'Exact current source census lost approval');
      expectedValidated++;
    } else if (await abuFlowAffected('2ed', task, false, group)) {
      if (['validated', 'validated-default'].includes(recorded.status))
        assert.equal(
          outstanding?.status,
          'needs-audit',
          'Changed Stasis reference needs a current review',
        );
      else assert.equal(outstanding?.status, recorded.status);
    } else if (!changedTasks.has(task) && !outlineChanged) {
      assert.equal(
        outstanding,
        undefined,
        'Unchanged Unlimited component reopened: ' + group.key + '/' + task,
      );
      expectedValidated++;
    } else if (['validated', 'validated-default'].includes(recorded.status)) {
      assert.equal(outstanding, undefined, 'Exact unchanged native group lost approval');
      expectedValidated++;
    } else {
      assert.equal(outstanding?.status, recorded.status, 'Current scoped review state was lost');
    }
  }
assert.equal(reports[0].counts.validated, expectedValidated);
const sourceChangedGroups = [];
for (const group of set.groups)
  if (await abuFlowAffected('2ed', 'rules', true, group)) sourceChangedGroups.push(group);
const unreviewedSourceGroups = [];
for (const group of sourceChangedGroups)
  if (!(await abuCurrentApproval(group.tasks.rules.originalInput, group, 'rules', true, '2ed')))
    unreviewedSourceGroups.push(group);
const staleRules = unreviewedSourceGroups.reduce((sum, g) => sum + g.printings, 0);
assert.equal(sourceChangedGroups.length, 1);
assert.equal(reports[0].originalRulesInputs.ready, 302 - staleRules);
assert.equal(reports[0].originalRulesInputs.stale, staleRules);
assert.equal(reports[0].originalTypeInputs.ready, 302);
assert.equal(reports[0].counts['needs-audit'], unreviewedSourceGroups.length);
assert.equal(reports[0].complete, false, 'An unpublished audit cannot complete Unlimited');
for (const row of reports[0].outstanding) {
  if (changedTasks.has(row.task)) continue;
  const group = set.groups.find((g) => g.key === row.group);
  if (row.task === 'references') {
    assert(await abuFlowAffected('2ed', row.task, false, group));
    continue;
  }
  assert.equal(row.task, 'frameGeometry');
  assert(
    await abuRasterAffected('2ed', row.task, false, group),
    'Only the five repainted outline variants may reopen geometry',
  );
}
// Group-level guards must invalidate every applicable dependent task.
const tampered = structuredClone(set);
const guarded = tampered.groups.find((g) => g.tasks.fullCard.status === 'validated');
assert(guarded, 'Need an unchanged approved group as a tamper control');
guarded.guards['games/magic/src/calibration/sets/2ed.ts'] = '0'.repeat(64);
const invalid = await calibrationReport({ sets: [tampered] });
assert(
  invalid[0].outstanding.some(
    (r) =>
      r.task === 'fullCard' &&
      r.status === (guarded.tasks.fullCard.proof.abuCurrentReview ? 'needs-audit' : 'stale'),
  ),
);
assert(data.receipt.metricCoverage.includes('excluded'));
assert.equal(data.receipt.native.artistOnlyOriginalChanges, 0);
assert.equal(data.receipt.native.historicalArtistCorrections, 13);
console.log(
  'Unlimited:302 exact census members,27 variants,340 scoped checks; changed source/geometry/member and group guards reject; publication remains a separate gate.',
);

const templates = await readJson('games/magic/fixtures/accuracy/2ed/certified-scan-templates.json');
assert.equal(templates.references.length, 302);
assert.equal(templates.templateHash, data.receipt.scanTemplateHash);
for (const row of data.receipt.rows) {
  const reference = templates.references.find((r) => r.id === row.id);
  assert(reference?.accepted && reference.contentIsolationPassed);
  assert.equal(reference.referenceHash, row.referenceHash);
  assert.equal(hash(JSON.stringify(reference.transform)), row.poseHash);
  assert.equal(reference.nativeScoredPoseHash, row.poseHash);
}
console.log('Published scan templates preserve all302 certified reference/pose joins.');

// Current tone certification extends, rather than rewrites, the crop history.
const { gunzipSync: decodeTone } = await import('node:zlib');
const toneFile = 'games/magic/fixtures/accuracy/early-through-fourth/2ed-tone-replay.json.gz';
const toneBytes = await readFile(toneFile);
assert.equal(hash(toneBytes), data.receipt.artifacts[toneFile]);
const tone = JSON.parse(decodeTone(toneBytes));
for (const [key, value] of Object.entries(tone.documents))
  assert.equal(hash(value), tone.documentHashes[key]);
const toneMetadata = JSON.parse(tone.documents.metadata);
// The certified renderer identity is historical. Current applicability is
// established by exact scoped guards, not unrelated sets' source-tree bytes.
assert.equal(data.current, true);
assert(data.compatibility?.sources.length > 0);
assert.equal(hash(await readFile(data.compatibility.file)), data.compatibility.sha256);
assert.equal(toneMetadata.afterTreeHash, data.receipt.rendererHash);
assert.equal(
  hash(await readFile('games/magic/src/calibration/sets/2ed.ts')),
  hash(toneMetadata.afterSource),
);
for (const [name, source] of Object.entries(tone.tools))
  assert.equal(hash(source), hash(await readFile('games/magic/tools/accuracy/' + name)));
const toneCapture = JSON.parse(tone.documents.capture),
  tonePrevious = JSON.parse(tone.documents.previous),
  toneSummary = JSON.parse(tone.documents.summary),
  toneScores = JSON.parse(tone.documents.scores);
assert.equal(toneCapture.completed, 302);
assert.equal(toneSummary.nativeFaces, 906);
assert.equal(toneSummary.unchangedFaces, 876);
assert.deepEqual(toneSummary.overflow, []);
assert.equal(hash(tone.documents.capture), toneScores.source.finalCaptureHash);
assert.equal(hash(tone.documents.previous), toneCapture.source.previousCaptureHash);
assert.equal(hash(tone.documents.inputs), toneCapture.source.inputsHash);
assert.equal(toneScores.reuse.unchanged, 292);
assert.equal(toneScores.reuse.fresh, 10);
for (const row of toneCapture.rows) {
  const before = tonePrevious.rows.find((r) => r.id === row.id);
  const joined = data.receipt.rows.find((r) => r.id === row.id);
  assert.equal(row.referenceHash, before.referenceHash);
  assert.equal(row.poseHash, before.poseHash);
  assert.equal(row.variants.original.rasters.face, joined.nativeFaceHash);
  for (const [mode, face] of Object.entries(row.variants)) {
    assert.deepEqual(face.body, before.variants[mode].body);
    assert.equal(face.etchingUnchanged, true);
    assert.equal(hash(JSON.stringify(face.input)), face.inputHash);
  }
}
assert.equal(data.receipt.pigmentDecision.fitPrintings, 9);
assert.equal(data.receipt.pigmentDecision.reportPrintings, 10);
assert(
  data.receipt.pigmentDecision.backgroundMAE.after <
    data.receipt.pigmentDecision.backgroundMAE.before,
);
assert(
  toneScores.summary.all.components.structural100.regressed > 0,
  'Do not hide contrast-sensitive score regressions',
);
for (const row of tone.isolation) {
  assert(row.changedPixels > 0);
  assert.equal(row.alphaUnchanged, true);
  assert.equal(row.interiorArtChanges, 0);
}
const toneBeforeMap = new Map(toneMetadata.beforeMap),
  toneAfterMap = new Map(toneMetadata.afterMap);
assert.deepEqual([...toneBeforeMap.keys()], [...toneAfterMap.keys()]);
assert.deepEqual(
  [...toneBeforeMap.keys()].filter((k) => toneBeforeMap.get(k) !== toneAfterMap.get(k)),
  ['calibration/sets/2ed.ts', 'data/eager.ts', 'data/generated-manifest.json', 'data/sets/2ed.ts'],
);
assert.equal(hash(JSON.stringify(toneMetadata.beforeMap)), toneMetadata.beforeTreeHash);
assert.equal(hash(JSON.stringify(toneMetadata.afterMap)), toneMetadata.afterTreeHash);
for (const file of ['data/sets/2ed.ts']) {
  const actual = await readFile('games/magic/src/' + file, 'utf8');
  const restored = await restoreUnlimitedProfilePayload(actual, tone.profileProof.before);
  assert.equal(hash(restored), toneBeforeMap.get(file));
  assert.equal(hash(actual), toneAfterMap.get(file));
}
// Both delivery modes must carry the exact certified Unlimited payload.
// Other sets can add tables/reviews without invalidating Unlimited.
const literal = (node, ast) =>
  parseProfileData('export const profile = ' + node.getText(ast) + '; export const review = {};')
    .profile;
const eagerText = await readFile('games/magic/src/data/eager.ts', 'utf8');
const eagerAst = ts.createSourceFile('eager.ts', eagerText, ts.ScriptTarget.Latest, true);
const eagerPayloads = eagerAst.statements
  .filter((s) => ts.isExpressionStatement(s) && ts.isCallExpression(s.expression))
  .map((s) => literal(s.expression.arguments[0], eagerAst))
  .filter((p) => p.set === '2ed' && p.kind === 'calibration');
assert.equal(eagerPayloads.length, 1);
const setText = await readFile('games/magic/src/data/sets/2ed.ts', 'utf8');
const setAst = ts.createSourceFile('2ed.ts', setText, ts.ScriptTarget.Latest, true);
const declaration = setAst.statements.find((s) => ts.isVariableStatement(s));
assert.deepEqual(
  eagerPayloads[0],
  literal(declaration.declarationList.declarations[0].initializer, setAst),
);
console.log(
  'Revision3:906 installed faces; nine-scan pigment fit, dark scan retained in reports, fixed geometry/wording and disclosed structural-score tradeoff.',
);

{
  const data = await unlimitedCalibrationEvidence({ revision: 'crop' });
  // A better aggregate must not silently close a visibly wrong frame edge.
  const cropReview = await readJson(
    'games/magic/fixtures/accuracy/early-through-fourth/2ed-dual-crop-review.json',
  );
  assert(['resolved-awaiting-release', 'resolved'].includes(cropReview.status));
  assert.equal(cropReview.resolution.profileRevision, 2);
  assert.equal(cropReview.resolution.adopted, true);
  const historical = await readJson(data.receipt.parent.file);
  assert.equal(hash(await readFile(data.receipt.parent.file)), data.receipt.parent.sha256);
  assert.equal(cropReview.candidateStudy.adopted, false);
  const archive = await readFile(cropReview.candidateStudy.file);
  assert.equal(hash(archive), cropReview.candidateStudy.sha256);
  const { gunzipSync } = await import('node:zlib');
  const cropStudy = JSON.parse(gunzipSync(archive));
  assert.equal(cropStudy.capture.rows.length, 10);
  assert.equal(cropStudy.scores.rows.length, 10);
  for (const row of cropStudy.capture.rows) {
    const original = data.receipt.rows.find((r) => r.id === row.id);
    assert.equal(row.referenceHash, original.referenceHash);
    assert.equal(row.poseHash, original.poseHash);
    assert.equal(row.variants.length, 4);
    assert.equal(row.variants[0].hash, historical.rows.find((r) => r.id === row.id).nativeFaceHash);
    for (const variant of row.variants)
      assert.deepEqual(
        variant.values,
        cropStudy.capture.rows[0].variants.find((v) => v.name === variant.name).values,
      );
  }
  const summary = cropStudy.scores.summary;
  assert(summary['up-3-art'].structural100 > summary.current.structural100);
  assert(summary['up-3-art'].strips.top > summary['up-3.5-art'].strips.top);
  assert(summary['up-3.5-art'].structural100 > summary['up-3-art'].structural100);
  console.log(
    'Dual crop:40 native candidates,10 exact baseline matches; boundary diagnostic rejects the misleading aggregate optimum. Combined crop/bevel proof is separate from this rejected crop-only study.',
  );

  const revisionFile = 'games/magic/fixtures/accuracy/early-through-fourth/2ed-crop-replay.json.gz';
  const revisionBytes = await readFile(revisionFile);
  assert.equal(hash(revisionBytes), data.receipt.artifacts[revisionFile]);
  const revision = JSON.parse(gunzipSync(revisionBytes));
  for (const [key, text] of Object.entries(revision.documents))
    assert.equal(hash(text), revision.documentHashes[key]);
  const native = JSON.parse(revision.documents.capture);
  const nativeSummary = JSON.parse(revision.documents.summary);
  const scores = JSON.parse(revision.documents.scores);
  const metadata = JSON.parse(revision.documents.metadata);
  assert.equal(native.completed, 302);
  assert.equal(nativeSummary.nativeFaces, 906);
  assert.equal(nativeSummary.unchangedFaces, 876);
  assert.equal(nativeSummary.bodyLayoutsUnchanged, 906);
  assert.deepEqual(nativeSummary.overflow, []);
  assert.equal(scores.reuse.unchanged, 292);
  assert.equal(scores.reuse.fresh, 10);
  assert.equal(scores.summary.all.components.structural100.improved, 10);
  assert.equal(scores.summary.all.components.structural100.regressed, 0);
  assert.equal(hash(revision.documents.capture), metadata.nativeCaptureHash);
  assert.equal(native.source.rendererHash, metadata.beforeTreeHash);
  assert.equal(metadata.afterTreeHash, data.receipt.rendererHash);
  assert.equal(toneMetadata.beforeTreeHash, metadata.afterTreeHash);
  assert.equal(hash(metadata.afterSource), hash(toneMetadata.beforeSource));
  assert.equal(hash(JSON.stringify(metadata.beforeMap)), metadata.beforeTreeHash);
  assert.equal(hash(JSON.stringify(metadata.afterMap)), metadata.afterTreeHash);
  const beforeFiles = new Map(metadata.beforeMap),
    afterFiles = new Map(metadata.afterMap);
  assert.deepEqual([...beforeFiles.keys()], [...afterFiles.keys()]);
  assert.deepEqual(
    [...beforeFiles.keys()].filter((file) => beforeFiles.get(file) !== afterFiles.get(file)),
    ['calibration/sets/2ed.ts', 'data/generated-manifest.json'],
  );
  assert.deepEqual(
    JSON.parse(metadata.manifestBefore).files,
    JSON.parse(metadata.manifestAfter).files,
  );
  for (const [name, source] of Object.entries(revision.tools))
    assert.equal(hash(source), hash(await readFile('games/magic/tools/accuracy/' + name)));
  assert.equal(native.source.toolHash, hash(revision.tools['early-profile-revision-native.mjs']));
  assert.equal(scores.source.toolHash, hash(revision.tools['early-profile-revision-score.mjs']));
  assert.equal(metadata.toolHash, hash(revision.tools['early-profile-review-metadata.mjs']));
  assert.equal(revision.materialIsolation.length, 10);
  for (const row of revision.materialIsolation) {
    assert(row.changedPixels > 0);
    assert.equal(row.outsideLowerBand, 0);
    assert.equal(row.alphaUnchanged, true);
    assert(row.bounds[1] >= 969 && row.bounds[1] + row.bounds[3] <= 982);
  }
  for (const row of native.rows) {
    const current = data.receipt.rows.find((r) => r.id === row.id);
    assert.equal(row.referenceHash, current.referenceHash);
    assert.equal(row.poseHash, current.poseHash);
    assert.equal(row.variants.original.rasters.face, current.nativeFaceHash);
    for (const face of Object.values(row.variants)) {
      assert.equal(face.etchingUnchanged, true);
      assert.equal(hash(JSON.stringify(face.input)), face.inputHash);
      assert.equal(face.body?.overflow ?? false, false);
    }
  }
  console.log(
    'Revision2:906 installed faces,292 unchanged printings,10 corrected duals; isolated lower bezel and exact review-only source bridge.',
  );
}
