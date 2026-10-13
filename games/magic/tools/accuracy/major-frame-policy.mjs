/** Propose the existing symmetric inset from fitting names only. */
export function majorFrameCandidate(group, measured) {
  if (group.family !== 'component') return null;
  const left = measured.frame.rulesLeft,
    right = measured.frame.rulesRight;
  if (![left, right].every((p) => p.calibration >= 3 && p.validation >= 3)) return null;
  const delta = Math.round(left.fit - right.fit) / 2;
  if (Math.abs(left.fit + right.fit) > 1.5 || Math.abs(delta) < 0.5) return null;
  const baseline = ['m15', 'm19', 'm20', 'war'].includes(group.set) ? 1.5 : 0;
  const inset = baseline + delta;
  return inset >= 0 && inset <= 3 ? { baseline, inset } : null;
}
