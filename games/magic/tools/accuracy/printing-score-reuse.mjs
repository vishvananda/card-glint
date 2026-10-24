/** Whole metric reuse requires identical raster, pose, semantics and reference.
 * Metric/preprocessor/decoder identities are verified once by the caller. */
export function reusablePrintingScore(prior, before, entry, native, pose, hash) {
  return Boolean(
    prior &&
      before &&
      prior.inputHash === hash(JSON.stringify(before.face)) &&
      prior.inputHash === native.inputHash &&
      native.inputHash === hash(JSON.stringify(entry.face)) &&
      hash(JSON.stringify(before.card)) === hash(JSON.stringify(entry.card)) &&
      prior.referenceHash === entry.reference.sha256 &&
      prior.renderHash === native.layers.face.sha256 &&
      prior.poseHash === hash(JSON.stringify(pose.transform)) &&
      prior.poseAccepted === pose.accepted &&
      prior.nonfoilEligible === entry.card.finishes.includes('nonfoil') &&
      prior.metric &&
      prior.normalizedReference,
  );
}
