/** Retain deliberate reviews only for the same finite printing population.
 * Reissue an identical scan-only certificate against its scan identity rather
 * than preserving its former renderer-asset identity. Manual rejections remain. */
export function preserveCalibrationReviews(group, saved) {
  if (!saved || saved.scopeHash !== group.scopeHash) return;
  for (const [task, item] of Object.entries(saved.tasks ?? {})) {
    if (!item.reviewedAt) continue;
    const next = group.tasks[task];
    const identicalScanCertificate =
      task === 'normalization' &&
      item.status === 'validated' &&
      next?.status === 'validated' &&
      item.proof?.validationKind === 'source-census' &&
      next.proof?.validationKind === 'source-census' &&
      ['methodHash', 'metricsHash', 'scanTemplateHash'].every(
        (field) => item.proof[field] && item.proof[field] === next.proof[field],
      ) &&
      item.proof.sourceCensus?.parametersHash === next.proof.sourceCensus?.parametersHash;
    if (!identicalScanCertificate) group.tasks[task] = structuredClone(item);
  }
}
