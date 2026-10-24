// Attach the ABU text recheck without declaring whole sets complete.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash } from './common.mjs';
import { abuFractionalAncestry } from './abu-fractional-ancestry.mjs';
const [baselineReportFile] = process.argv.slice(2);
assert(baselineReportFile, 'Usage: apply-abu-fractional-audit.mjs BASELINE_CALIBRATION_REPORT');
const p = await abuFractionalAncestry();
const report = JSON.parse(gunzipSync(await readFile(p.evidence.selected.file)));
const native = JSON.parse(gunzipSync(await readFile(p.evidence.native.file)));
const baseline = JSON.parse(await readFile(baselineReportFile));
const file = 'games/magic/fixtures/accuracy/calibration-progress.json';
const ledger = JSON.parse(await readFile(file));
const currentGuards = Object.fromEntries(Object.entries(p.files).map(([f, e]) => [f, e.after]));
const evidence = [
  'games/magic/fixtures/accuracy/early-through-fourth/abu-fractional-source-proof.json',
  ...Object.values(p.evidence).map((r) => r.file),
  'games/magic/fixtures/accuracy/2ed/text-size-review.json',
];
let touched = 0,
  preserved = 0;
for (const code of p.affectedSets) {
  const set = ledger.sets.find((s) => s.set === code),
    reference = baseline.find((s) => s.set === code);
  assert(set && reference);
  const rows = report.rows.filter((r) => r.set === code);
  assert.equal(rows.length, set.inventory.ordinaryPrintings);
  set.textAudit = {
    status: 'audited-with-open-outliers',
    scope: 'Original rules/flavor region; not whole-card compliance',
    rendererHash: p.afterRenderer,
    capturedRendererHash: p.capturedRenderer,
    evidence: p.evidence.selected.file,
    inventory: rows.length,
    accepted: report.sets[code].accepted,
    before100: report.sets[code].before100,
    after100: report.sets[code].after100,
    regressions: report.sets[code].regressions,
    normalizationReview: report.sets[code].normalizationReview,
    reason:
      'Fractional advances retain the printing size class and a safe row budget. Unusual manual wrapping and flavor-width differences remain in the review list; no complete-set certification is claimed.',
  };
  for (const group of set.groups) {
    const members = group.printingIds.map((id) => rows.find((r) => r.id === id));
    assert(members.every(Boolean));
    const unchanged = members.every((r) => r.changed === 0),
      names = [...new Set(members.map((r) => r.name))];
    for (const task of p.affectedComponents) {
      if (group.applicable?.[task] === false) continue;
      const old = group.tasks[task] ?? {},
        oldReady =
          ['validated', 'validated-default'].includes(old.status) &&
          !reference.outstanding.some((o) => o.group === group.key && o.task === task);
      if (unchanged && oldReady && task !== 'release') {
        group.tasks[task] = {
          ...old,
          reason: (old.reason ?? '').includes(
            'Complete native replay confirms unchanged pixels after the ABU text update.',
          )
            ? old.reason
            : (old.reason ?? '') +
              ' Complete native replay confirms unchanged pixels after the ABU text update.',
          guards: { ...old.guards, ...currentGuards },
          runtimeGuards: { ...old.runtimeGuards, 'games/magic/src': p.afterRenderer },
          evidence: [...new Set([...(old.evidence ?? []), ...evidence])],
          proof: {
            ...old.proof,
            abuFractionalSource: p.afterRenderer,
            unchangedNativeReplayHash: hash(
              JSON.stringify(members.map((r) => [r.id, r.beforeFaceHash, r.afterFaceHash])),
            ),
          },
        };
        preserved++;
        continue;
      }
      const status = task === 'release' ? 'pending' : 'partial';
      group.tasks[task] = {
        status,
        reason:
          task === 'release'
            ? 'The rechecked text policy is on the development branch and has not been published.'
            : 'Complete Original native text census is recorded. Shared fitting improves the set mean; manual wrapping and flavor typography outliers remain explicit.',
        evidence,
        guards: currentGuards,
        runtimeGuards: { 'games/magic/src': p.afterRenderer },
        coveredPrintings: group.printings,
        ...(old.originalInput ? { originalInput: old.originalInput } : {}),
        proof: {
          sourceHash: group.sourceHashes?.[task] ?? group.sourceHash,
          scopeHash: group.scopeHash,
          gatesPassed: false,
          rendererHash: p.afterRenderer,
          abuFractionalSource: p.afterRenderer,
          methodHash: native.source.tool,
          nativeReplayHash: p.evidence.native.contentSha256,
          metricsHash: hash(JSON.stringify(members)),
          coveredPrintings: group.printings,
          calibrationNames: names.length,
          validationNames: names.length,
          validationKind: 'reused-development',
          scanTemplateHash: hash(JSON.stringify(members.map((r) => [r.id, r.poseHash]))),
        },
      };
      touched++;
    }
  }
}
const config = await prettier.resolveConfig(file);
await writeFile(file, await prettier.format(JSON.stringify(ledger), { ...config, parser: 'json' }));
console.log(
  JSON.stringify({
    sets: p.affectedSets,
    updatedTasks: touched,
    preservedValidatedTasks: preserved,
  }),
);
