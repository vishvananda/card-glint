import { checkSourceCensus } from './calibration-census.mjs';
import assert from 'node:assert/strict';

/** Completion is evidence-based, not the presence of an override. Keep this
 * offline study/reporting contract outside the renderer and its public API. */
export const CALIBRATION_TASKS = {
  references: 'Reference quality and original printing wording',
  normalization: 'Independent frame translation, scale, rotation/skew validation',
  frameGeometry: 'Frame source, stock/corners, art aperture, boxes and crown geometry',
  frameColor: 'Frame pigment and texture contrast',
  paperColor: 'Text-box pigment and gradients',
  blackLevels: 'Interior ink and outer stock, measured separately',
  manaGeometry: 'Cost-disc placement, spacing, glyph and generic-number geometry',
  manaColor: 'Mana-disc and glyph colors, outline/shadow treatment',
  setSymbol: 'Expansion-symbol contour, rarity fills/rims, size and placement',
  headings: 'Name and type fonts, weight, spacing, position and shadows',
  rules: 'Rules size, margins, alignment, line spacing and inline symbols',
  flavor: 'Flavor spacing, divider and attribution alignment',
  artist: 'Illustrator wording, font, size, alignment and shadow',
  footer: 'Copyright, trademarks, collector number and lower information',
  stats: 'Power/toughness or loyalty geometry, typography and shadows',
  specialComponents: 'Basic-land glyph, stamp and layout-specific components',
  fullCard: 'Every-printing native replay, regional/full scores and outlier review',
  release: 'Renderer checks, published revision and matching score revision',
};

export const CALIBRATION_STATES = [
  'pending',
  'needs-audit',
  'in-progress',
  'partial',
  'rejected',
  'needs-reference',
  'needs-asset',
  'stale',
  'validated',
  'validated-default',
  'not-applicable',
];
const approved = new Set(['validated', 'validated-default']);
const hash = /^[a-f0-9]{64}$/;

export function calibrationTaskStatus(group, task) {
  assert.ok(task in CALIBRATION_TASKS, `Unknown calibration task: ${task}`);
  const item = group.tasks?.[task] ?? { status: 'pending' };
  assert.ok(CALIBRATION_STATES.includes(item.status), `Unknown calibration state: ${item.status}`);
  if (item.status === 'not-applicable') {
    assert.equal(group.applicable?.[task], false, `Unproven not-applicable task: ${task}`);
    assert.ok(item.reason?.trim(), `Missing applicability reason: ${task}`);
    return item;
  }
  if (!approved.has(item.status)) return item;
  const proof = item.proof;
  assert.ok(item.evidence?.length && proof, `Missing calibration evidence: ${task}`);
  assert.equal(proof.gatesPassed, true, `Calibration gates have not passed: ${task}`);
  for (const field of [
    'sourceHash',
    'rendererHash',
    'methodHash',
    'nativeReplayHash',
    'metricsHash',
  ])
    assert.ok(hash.test(proof[field] ?? ''), `Missing ${field}: ${task}`);
  const sourceHash = group.sourceHashes?.[task] ?? group.sourceHash;
  if (!sourceHash || proof.sourceHash !== sourceHash)
    return { ...item, status: 'stale', reason: 'Source or geometry changed after validation.' };
  assert.ok(hash.test(proof.scopeHash ?? ''), `Missing printing scope identity: ${task}`);
  if (proof.scopeHash !== group.scopeHash)
    return { ...item, status: 'stale', reason: 'Printing membership changed after validation.' };
  assert.ok(
    Number.isInteger(proof.coveredPrintings) && proof.coveredPrintings === group.printings,
    `Incomplete or inconsistent printing coverage: ${task}`,
  );
  if (task !== 'release') {
    if (proof.validationKind === 'source-census') checkSourceCensus(group, proof, task);
    else {
      assert.ok(
        proof.calibrationNames >= 3 && proof.validationNames >= 3,
        `Insufficient independent names; record a validated family transfer instead: ${task}`,
      );
    }
    assert.ok(
      ['fresh', 'reused-development', 'family-transfer', 'source-census'].includes(
        proof.validationKind,
      ),
      `Missing validation independence label: ${task}`,
    );
    assert.ok(
      hash.test(proof.scanTemplateHash ?? ''),
      `Missing frame normalization identity: ${task}`,
    );
  } else {
    assert.ok(
      /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(proof.version ?? '') &&
        /^[a-f0-9]{40}$/.test(proof.publishedCommit ?? '') &&
        proof.checksPassed === true,
      'A local checkpoint is not a released calibration',
    );
  }
  if (item.status === 'validated-default')
    assert.equal(proof.choice, 'source-default', 'An absent override is not a validated default');
  return item;
}

export function calibrationSetStatus(set) {
  const groups = set.groups ?? [];
  assert.equal(new Set(groups.map((g) => g.key)).size, groups.length, 'Duplicate frame variant');
  const counts = Object.fromEntries(CALIBRATION_STATES.map((s) => [s, 0]));
  const outstanding = [];
  for (const group of groups) {
    assert.ok(Number.isInteger(group.printings) && group.printings > 0);
    for (const task of Object.keys(CALIBRATION_TASKS)) {
      const item = calibrationTaskStatus(group, task);
      counts[item.status]++;
      if (!approved.has(item.status) && item.status !== 'not-applicable')
        outstanding.push({
          group: group.key,
          task,
          status: item.status,
          reason: item.reason ?? null,
        });
    }
  }
  const inventoryReady =
    set.inventory?.status === 'verified' &&
    set.inventory.classificationReview === 0 &&
    groups.length > 0 &&
    groups.reduce((n, g) => n + g.printings, 0) === set.inventory.ordinaryPrintings;
  return {
    set: set.set,
    complete: inventoryReady && outstanding.length === 0,
    inventoryReady,
    groups: groups.length,
    counts,
    outstanding,
  };
}
