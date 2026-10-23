// Import current, hash-bound reuse of the already released M21 mana fits.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, sourceHash } from './common.mjs';
import { readCensus } from './modern-publication-review.mjs';
import { checkManaReuse } from './modern-mana-reuse.mjs';
import { EARLY_SOURCE_RECEIPT } from './abu-source-ancestry.mjs';
export const M21_MANA_REUSE = 'games/magic/fixtures/accuracy/m21/current-mana-adoption-review.json';
export async function m21ManaEvidence() {
  const data = await readCensus(M21_MANA_REUSE);
  const census = await readCensus(
    'games/magic/fixtures/accuracy/m21/current-component-census.json',
  );
  checkManaReuse(data.detail, census.detail);
  const guards = {
    ...data.guards,
    ...census.guards,
    ...data.detail.definition.evidenceGuards,
    ...data.detail.definition.sources,
  };
  const matches = await Promise.all(
    Object.entries(guards).map(async ([file, digest]) => {
      try {
        return hash(await readFile(file)) === digest;
      } catch {
        return false;
      }
    }),
  );
  const current =
    matches.every(Boolean) &&
    (await sourceHash('games/magic/src')) === data.detail.definition.rendererHash;
  return { receipt: data.detail, census: census.detail, guards, current };
}
export function applyM21Mana(group, { receipt, census, guards, current }) {
  if (!group.applicable.manaGeometry) {
    assert.equal(group.applicable.manaColor, false);
    return;
  }
  const variant = census.groups.find((g) => g.key === group.key);
  assert(variant);
  assert.equal(variant.scopeHash, group.scopeHash);
  const rows = receipt.rows.filter((r) => group.printingIds.includes(r.id));
  assert.equal(rows.length, group.printings, 'Incomplete current mana variant');
  assert.deepEqual(rows.map((r) => r.id).sort(), [...group.printingIds].sort());
  const names = [...new Set(rows.map((r) => r.name))].sort();
  const donors = receipt.rows.filter((r) => r.nonfoil && r.family === 'walker');
  const donorNames = [...new Set(donors.map((r) => r.name))].sort();
  const foil = group.references.nonfoil !== group.printings;
  if (foil) assert(rows.every((r) => !r.nonfoil && r.family === 'walker'));
  const parametersHash = hash(JSON.stringify(receipt.parameters));
  const member = (row) =>
    Object.fromEntries(
      ['id', 'name', 'referenceHash', 'poseHash', 'inputHash', 'nativeFaceHash'].map((k) => [
        k,
        row[k],
      ]),
    );
  const proof = {
    sourceHash: group.sourceHash,
    scopeHash: group.scopeHash,
    gatesPassed: current,
    rendererHash: receipt.definition.rendererHash,
    methodHash:
      receipt.definition.sources['games/magic/tools/accuracy/modern-mana-adoption-review.mjs'],
    nativeReplayHash: receipt.definition.nativeCaptureHash,
    metricsHash: hash(JSON.stringify(receipt.rows)),
    scanTemplateHash: receipt.definition.normalizationHash,
    coveredPrintings: group.printings,
    calibrationNames: foil ? donorNames.length : names.length,
    validationNames: foil ? donorNames.length : names.length,
    validationKind: foil ? 'family-transfer' : 'source-census',
    ...(foil
      ? {
          familyTransfer: {
            source:
              'Nine measured nonfoil M21 walker costs. Geometry and pigment controls are shared; foil references never fit nonfoil pigment.',
            heldOut: false,
            foilPigmentExcluded: true,
            parametersHash,
            donorNames,
            donors: donors.map(member),
            recipients: rows.map(member),
          },
        }
      : {
          sourceCensus: {
            scope: 'all-ordinary-printings-in-variant',
            heldOut: false,
            names,
            parametersHash,
            parameterScope:
              'Released M21 normal/walker circle, pitch, glyph, numeral, paper and shadow fits; exact native cost-interior parity to profile6 adoption. No per-printing parameters.',
            members: rows.map(member),
          },
        }),
    earlyBatchReceipt: EARLY_SOURCE_RECEIPT,
  };
  for (const task of ['manaGeometry', 'manaColor'])
    group.tasks[task] = {
      status: current ? 'validated' : 'stale',
      reviewedAt: receipt.reviewedAt,
      reason: foil
        ? 'Shared nonfoil walker calibration transferred with exact native parity. Nine nonfoil donors cover WUBRG and generic costs; foil-only scans are layout controls, excluded from pigment fitting.'
        : 'Already released shared circle/pitch, filled-glyph/numeral and paper/shadow fits match every current native cost interior. Pinned assets and shadow painter are unchanged; complete finite variant replay, without an independent holdout claim.',
      evidence: [M21_MANA_REUSE, ...Object.keys(receipt.definition.evidenceGuards)],
      guards,
      runtimeGuards: { 'games/magic/src': receipt.definition.rendererHash },
      coveredPrintings: group.printings,
      proof: structuredClone(proof),
    };
}
