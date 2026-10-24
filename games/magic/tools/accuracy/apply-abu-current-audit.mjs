// Attach the completed finite review; publication remains pending.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash, sourceHash } from './common.mjs';
import { abuCurrentAudit, ABU_CURRENT_REVIEW } from './abu-current-review.mjs';
import { calibrationReport } from './calibration-report.mjs';
const a = await abuCurrentAudit(),
  p = a.flow;
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
const file = 'games/magic/fixtures/accuracy/calibration-progress.json';
const ledger = JSON.parse(await readFile(file)),
  before = await calibrationReport(ledger);
const guards = {
  ...Object.fromEntries(Object.entries(p.files).map(([f, e]) => [f, e.after])),
  [ABU_CURRENT_REVIEW]: a.reviewHash,
  ...Object.fromEntries(Object.values(a.review.artifacts).map((r) => [r.file, r.sha256])),
};
for (const f of [
  'abu-current-review.mjs',
  'abu-flow-ancestry.mjs',
  'abu-flow-data-check.mjs',
  'abu-flow-score.mjs',
  'abu-flow-native.mjs',
  'calibration-wording.mjs',
  'printing-fields.mjs',
]) {
  const file = 'games/magic/tools/accuracy/' + f;
  guards[file] = hash(await readFile(file));
}
let approved = 0,
  sources = 0;
const mean = (rows) => rows.reduce((s, r) => s + r, 0) / rows.length;
for (const set of ledger.sets.filter((s) => ['lea', 'leb', '2ed'].includes(s.set))) {
  const previous = before.find((s) => s.set === set.set);
  for (const group of set.groups) {
    const rows = group.printingIds.map((id) => a.native.rows.find((r) => r.id === id));
    assert(rows.every((r) => r?.set === set.set));
    const members = rows.map((r) => ({
      id: r.id,
      name: r.name,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
      inputHash: r.inputHash,
      nativeFaceHash: r.original.hashes['after-face'],
    }));
    const names = [...new Set(members.map((r) => r.name))];
    for (const task of [...a.review.approvedTasks, 'release']) {
      if (group.applicable?.[task] === false) continue;
      const outstanding = previous.outstanding.some(
        (r) => r.group === group.key && r.task === task,
      );
      if (['references', 'frameGeometry'].includes(task) && !outstanding) continue;
      if (task === 'references' && !rows.some((r) => r.wording)) continue;
      if (task === 'frameGeometry' && !a.art.members.some((r) => group.printingIds.includes(r.id)))
        continue;
      const old = group.tasks[task] ?? {},
        pending = task === 'release';
      // This is a fresh current native proof. Keep immutable study guards, and
      // bind inherited painter dependencies to the renderer actually replayed.
      const currentPainterGuards = {};
      for (const name of Object.keys({ ...group.guards, ...old.guards }))
        if (name.startsWith('games/magic/src/'))
          currentPainterGuards[name] = hash(await readFile(name));

      group.tasks[task] = {
        ...old,
        status: pending ? 'pending' : 'validated',
        reviewedAt: a.review.reviewedAt,
        reason: pending
          ? 'Current finite ABU audit is complete locally. Actual checked release artifacts and matching Lab scores are still required.'
          : a.review.decisions[task],
        evidence: [
          ...new Set([
            ...(old.evidence ?? []),
            ABU_CURRENT_REVIEW,
            ...Object.values(a.review.artifacts).map((r) => r.file),
          ]),
        ],
        guards: { ...old.guards, ...currentPainterGuards, ...guards },
        runtimeGuards: { 'games/magic/src': p.afterRenderer },
        coveredPrintings: group.printings,
        proof: {
          ...old.proof,
          sourceHash: group.sourceHashes?.[task] ?? group.sourceHash,
          scopeHash: group.scopeHash,
          gatesPassed: !pending,
          rendererHash: p.afterRenderer,
          abuCurrentReview: a.reviewHash,
          groupGuardsHash: hash(JSON.stringify(group.guards ?? {})),
          methodHash: p.native.toolSha256,
          nativeReplayHash: p.native.contentSha256,
          metricsHash: a.metricsHash,
          scanTemplateHash: hash(JSON.stringify(members.map((r) => [r.id, r.poseHash]))),
          coveredPrintings: group.printings,
          calibrationNames: names.length,
          validationNames: names.length,
          validationKind: 'source-census',
          sourceCensus: {
            heldOut: false,
            scope: 'all-ordinary-printings-in-variant',
            names,
            parametersHash: hash(
              JSON.stringify({
                renderer: p.afterRenderer,
                variant: group.key,
                review: a.reviewHash,
              }),
            ),
            parameterScope:
              'Shared shipped-source family geometry and set typography. Every observed member is joined to its exact current Original input, reference, frame pose and native raster. Existing development references; no independent holdout or scan-specific renderer offset.',
            members,
          },
        },
      };
      if (!pending) approved++;
    }
    if (rows.some((r) => r.wording)) {
      const item = group.tasks.rules,
        old = item.originalInput ?? {};
      item.originalInput = {
        ...old,
        status: 'ready',
        field: 'rules',
        coveredPrintings: group.printings,
        sources: { 'current-source-census': group.printings },
        reason:
          'Three exact Stasis fields are scan-reviewed; every other semantic input is identical to the earlier reviewed corpus. Rules availability does not certify unrelated flavor or type wording.',
        evidence: item.evidence,
        guards: item.guards,
        runtimeGuards: item.runtimeGuards,
        proof: { ...item.proof },
      };
      sources++;
    }
  }
  const rr = a.scores.rows.filter((r) => r.set === set.set);
  set.textAudit = {
    ...set.textAudit,
    status: 'audited-baseline-with-disclosed-residuals',
    scope:
      'Complete finite Original rules/flavor and whole-card source census; no independent holdout.',
    rendererHash: p.afterRenderer,
    evidence: ABU_CURRENT_REVIEW,
    inventory: rr.length,
    accepted: rr.filter((r) => r.normalizationAccepted).length,
    normalizationReview: 0,
    before100: mean(
      a.previousScores.rows
        .filter((r) => r.set === set.set && r.components.rules.eligible)
        .map((r) => r.components.rules.score100),
    ),
    additionalResiduals: a.review.additionalResiduals.filter(
      (r) => r.set === set.set || r.sets?.includes(set.set),
    ),
    retainedRegressions: a.scores.changes
      .filter((r) => r.set === set.set && r.delta100 < 0)
      .map((r) => ({
        id: r.id,
        name: r.name,
        delta100: r.delta100,
        reason: 'Correct printed wording retained even though the structural index decreased.',
      })),
    after100: mean(
      rr.filter((r) => r.components.rules.eligible).map((r) => r.components.rules.score100),
    ),
    fullCard: {
      ...a.scores.summary[set.set],
      evidence: a.review.artifacts['abu-flow-current-scores.json.gz'].file,
      rendererHash: p.afterRenderer,
      status: 'development-not-published',
    },
    currentReview: a.reviewHash,
    outliers: a.review.outliers[set.set],
    reason:
      'Measured shared defaults are accepted as the audited baseline. Manual wrapping, source texture and punctuation residuals remain visible. Publication is a separate gate.',
  };
}
const reports = await calibrationReport(ledger);
for (const s of reports.filter((s) => ['lea', 'leb', '2ed'].includes(s.set))) {
  assert(
    s.outstanding.every((r) => r.task === 'release'),
    JSON.stringify(s.outstanding),
  );
  assert.equal(s.originalRulesInputs.ready, s.printings);
  assert.equal(s.originalTypeInputs.ready, s.printings);
}
await writeFile(
  file,
  await prettier.format(JSON.stringify(ledger), {
    ...(await prettier.resolveConfig(file)),
    parser: 'json',
  }),
);
console.log(
  JSON.stringify({
    approvedTasks: approved,
    correctedSourceGroups: sources,
    sets: reports
      .filter((s) => ['lea', 'leb', '2ed'].includes(s.set))
      .map((s) => ({ set: s.set, counts: s.counts, outstanding: s.outstanding.length })),
  }),
);
