// Attach the finite nonfoil audit to the component ledger; never certify foils.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from './common.mjs';
import { eighthSourceAncestry } from './eighth-source-ancestry.mjs';
export const EIGHTH_AUDIT = 'games/magic/fixtures/accuracy/8ed/full-audit.json';
export async function eighthAuditEvidence() {
  const bytes = await readFile(EIGHTH_AUDIT),
    summary = JSON.parse(bytes);
  const compressed = await readFile(summary.evidence.file);
  assert.equal(hash(compressed), summary.evidence.sha256);
  const raw = gunzipSync(compressed);
  assert.equal(hash(raw), summary.evidence.contentSha256);
  const receipt = JSON.parse(raw);
  assert.equal(receipt.rows.length, 357);
  assert.equal(new Set(receipt.rows.map((r) => r.id)).size, 357);
  assert.equal(receipt.summary.acceptedPoses, 357);
  assert.equal(receipt.scope.foilOnlyExcluded, 350);
  assert.equal(receipt.scope.heldOut, false);
  assert.equal(receipt.finalDualColorRefinements.unchangedLayers, 709);
  assert.equal(receipt.finalDualColorRefinements.rows.length, 5);
  assert.equal(receipt.finalTextChanges.length, 13);
  assert.equal(
    hash(await readFile('games/magic/tools/accuracy/eighth-audit-report.mjs')),
    receipt.definition.toolHash,
  );
  const source = await eighthSourceAncestry();
  assert.equal(source.rendererHash, receipt.definition.rendererHash);
  const guards = Object.fromEntries(
    await Promise.all(
      [
        EIGHTH_AUDIT,
        summary.evidence.file,
        'games/magic/fixtures/accuracy/8ed/source-compatibility.json',
        'games/magic/fixtures/accuracy/8ed/native-normalization-review.json',
        'games/magic/src/calibration/eighth/8ed.ts',
        'games/magic/assets.json',
        'games/magic/fonts.css',
      ].map(async (f) => [f, hash(await readFile(f))]),
    ),
  );
  const current = (await sourceHash('games/magic/src')) === receipt.definition.rendererHash;
  return { receipt, guards, current };
}
export function applyEighthAudit(set, { receipt, guards, current }) {
  assert.equal(set.set, '8ed');
  const all = new Map(receipt.rows.map((r) => [r.id, r]));
  const measured = new Set([
    'references',
    'normalization',
    'frameGeometry',
    'headings',
    'manaGeometry',
    'manaColor',
    'setSymbol',
    'artist',
    'footer',
    'stats',
  ]);
  set.audit = {
    status: 'audited-with-recorded-residuals',
    evidence: EIGHTH_AUDIT,
    nonfoil: 357,
    foilOnlyExcluded: 350,
    structure100: receipt.summary.final100,
    rendererHash: receipt.definition.rendererHash,
    reason:
      'Complete ordinary nonfoil audit. Source texture, manual flavor/line-break outliers and foil appearance remain separate review items.',
  };
  let count = 0;
  for (const group of set.groups) {
    if (group.references.nonfoil !== group.printings) continue;
    const rows = group.printingIds.map((id) => all.get(id));
    assert(rows.every(Boolean), 'Audit omits a ledger printing');
    assert.equal(rows.length, group.printings);
    count += rows.length;
    const names = [...new Set(rows.map((r) => r.name))].sort();
    const proof = {
      sourceHash: group.sourceHash,
      scopeHash: group.scopeHash,
      gatesPassed: current,
      rendererHash: receipt.definition.rendererHash,
      eighthDefaultsSource: receipt.definition.rendererHash,
      methodHash: receipt.definition.toolHash,
      nativeReplayHash: receipt.definition.nativeCaptureHash,
      metricsHash: hash(JSON.stringify(rows)),
      scanTemplateHash: receipt.definition.normalizationHash,
      coveredPrintings: group.printings,
      calibrationNames: names.length,
      validationNames: names.length,
      validationKind: 'source-census',
      sourceCensus: {
        scope: 'all-ordinary-printings-in-variant',
        heldOut: false,
        names,
        parametersHash: guards['games/magic/src/calibration/eighth/8ed.ts'],
        parameterScope:
          'Shared source-bound Eighth profile. Complete native census; normalization is comparison-only. Not an independent holdout.',
        members: rows.map((r) =>
          Object.fromEntries(
            ['id', 'name', 'referenceHash', 'poseHash', 'inputHash', 'nativeFaceHash'].map((k) => [
              k,
              r[k],
            ]),
          ),
        ),
      },
    };
    group.sourceCensus = proof.sourceCensus;
    delete proof.sourceCensus;
    for (const task of measured) {
      if (group.applicable[task] === false) continue;
      group.tasks[task] = {
        status: current ? 'validated' : 'stale',
        reason:
          'Complete finite nonfoil native census with source-bound measurements and reviewed Original content; shared best-fit values, not pixel-perfect assets or an independent holdout.',
        evidence: [EIGHTH_AUDIT, ...Object.keys(guards)],
        guards,
        runtimeGuards: { 'games/magic/src': receipt.definition.rendererHash },
        coveredPrintings: group.printings,
        proof: {
          ...structuredClone(proof),
          sourceHash: group.sourceHashes?.[task] ?? group.sourceHash,
        },
      };
    }
    for (const [task, reason] of Object.entries({
      frameColor:
        'Shared source-local pigment/texture fits are installed; remaining baked-texture and contrast differences stay visible in the native pigment report.',
      paperColor:
        'Shared ordinary/basic/dual paper and header fits are installed; finite color diagnostics and manual texture review are recorded, without complete pigment certification.',
      blackLevels:
        'White stock, transferred nonfoil black stock and interior keylines remain separate; source dark-texture residuals and foil-only stock are not certified.',
      rules:
        'Shared size/centering/compact-leading fits improve the complete census. Some manually typeset line breaks remain in the low-text review list.',
      flavor:
        'A universal orphan shrink was rejected for visible regressions. Manual flavor line breaks remain for review.',
      fullCard:
        'All357 nonfoil faces have frozen aligned diagnostic scores. Known asset/text residuals and score-publication gates remain open.',
      release:
        'The audited profile is prepared for0.7.0; published revision and matching score eligibility require a separate release receipt.',
    })) {
      if (group.applicable[task] === false) continue;
      group.tasks[task] = {
        status: task === 'release' ? 'pending' : 'partial',
        reason,
        evidence: [EIGHTH_AUDIT],
        coveredPrintings: group.printings,
      };
    }
    if (group.applicable.specialComponents) {
      group.tasks.specialComponents = {
        status: group.palette === 'W' ? 'needs-asset' : 'partial',
        reason:
          group.palette === 'W'
            ? 'The fitted large white glyph retains a heavier inner ring in its source asset.'
            : 'Large basic-land glyph contour, position, body color and canonical shadow were reviewed; baked source bevels remain an asset difference.',
        evidence: [EIGHTH_AUDIT],
        coveredPrintings: group.printings,
      };
    }
  }
  assert.equal(count, 357);
}
if (process.argv[1]?.endsWith('/calibration-eighth-audit.mjs')) {
  const file = process.argv[2] ?? 'games/magic/fixtures/accuracy/calibration-progress.json';
  const ledger = JSON.parse(await readFile(file));
  applyEighthAudit(
    ledger.sets.find((s) => s.set === '8ed'),
    await eighthAuditEvidence(),
  );
  await writeFile(file, JSON.stringify(ledger, null, 2) + '\n');
  console.log('Recorded357 nonfoil audit members; foils and known residuals remain open.');
}
