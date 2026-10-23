import {
  preNormalizationCensusSource,
  normalizationCensusReview,
  NORMALIZATION_CENSUS_REVIEW,
} from './normalization-census-ancestry.mjs';
// Current applicability is separate from the immutable Unlimited certifier.
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';
import { preM21StyleSource } from './m21-style-ancestry.mjs';
import {
  unlimitedCalibrationEvidence as historicalEvidence,
  applyUnlimitedEvidence as installHistoricalEvidence,
} from './calibration-unlimited-evidence.mjs';

export async function unlimitedCurrentGuards(receipt, readSource = readFile) {
  const reused = [];
  const current = (
    await Promise.all(
      Object.entries(receipt.guards).map(async ([file, expected]) => {
        const bytes = await readSource(file);
        if (hash(bytes) === expected) return true;
        const before = await preNormalizationCensusSource(
          file,
          await preM21StyleSource(file, bytes),
        );
        if (hash(before) !== expected) return false;
        reused.push(file);
        return true;
      }),
    )
  ).every(Boolean);
  return { current, reused: reused.sort() };
}
export async function unlimitedCalibrationEvidence(options) {
  const data = await historicalEvidence(options);
  if (data.current) return data;
  const { current, reused } = await unlimitedCurrentGuards(data.receipt);
  const file = 'games/magic/fixtures/accuracy/m21/style-source-compatibility.json';
  const census = await normalizationCensusReview();
  return {
    ...data,
    current,
    ...(reused.length
      ? {
          compatibility: {
            file,
            sha256: hash(await readFile(file)),
            sources: reused,
            reviews: [{ file: NORMALIZATION_CENSUS_REVIEW, sha256: census.sha256 }],
          },
        }
      : {}),
  };
}
export function applyUnlimitedEvidence(group, data) {
  installHistoricalEvidence(group, data);
  const c = data.compatibility;
  if (!c) return;
  group.guards = {
    ...group.guards,
    [c.file]: c.sha256,
    ...Object.fromEntries((c.reviews ?? []).map((r) => [r.file, r.sha256])),
  };
  for (const item of Object.values(group.tasks))
    if (item.proof && item.status === 'validated') {
      item.evidence = [
        ...new Set([...(item.evidence ?? []), c.file, ...(c.reviews ?? []).map((r) => r.file)]),
      ];
      item.proof = { ...item.proof, compatibility: c };
    }
}
