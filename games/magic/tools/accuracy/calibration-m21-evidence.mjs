/** Import measured subsets without certifying the rest of a shared source key. */
export function applyM21Evidence(group, source, color, boundaries, guardsMatch) {
  const root = 'games/magic/fixtures/accuracy/';
  const rows = boundaries.rows.filter((r) => group.printingIds.includes(r.id));
  const guards = Object.fromEntries(
    Object.entries(color.sourceGuards).map(([file, value]) => [
      'games/magic/src/presentation/' + file,
      value,
    ]),
  );
  const proof = (task, covered, material) => ({
    sourceHash: group.sourceHashes?.[task] ?? group.sourceHash,
    scopeHash: group.scopeHash,
    gatesPassed: true,
    rendererHash: color.native.rendererHash,
    methodHash:
      color.tools[
        task === 'normalization' ? 'm21-normal-boundaries.mjs' : 'm21-normal-color-metrics.mjs'
      ],
    nativeReplayHash:
      color.artifacts[
        task === 'normalization' ? 'normalization/results.json' : 'full-candidate.json'
      ],
    metricsHash:
      color.artifacts[
        task === 'normalization' ? 'normalization/known-poses.json' : 'full-color-metrics.json'
      ],
    scanTemplateHash: boundaries.templateHash,
    coveredPrintings: covered,
    calibrationNames: boundaries.rows.filter(
      (r) => r.material === material && r.accepted && r.cohort === 'calibration',
    ).length,
    validationNames: boundaries.rows.filter(
      (r) => r.material === material && r.accepted && r.cohort === 'validation',
    ).length,
    validationKind: 'reused-development',
    choice: 'shared-material-fit',
  });
  if (rows.length) {
    const accepted = rows.filter((r) => r.accepted);
    const complete = accepted.length === group.printings;
    group.tasks.normalization = {
      status: !guardsMatch ? 'stale' : complete ? 'validated' : 'partial',
      reason: `${accepted.length}/${group.printings} scan-only poses pass fit, independent selection, certification and raster replay. Shared material templates pass 20 known-pose/color-change tests. Local comparison evidence; review-service deployment remains open.`,
      evidence: [root + 'm21-normal-boundaries.json'],
      coveredPrintings: accepted.length,
      rejectedPrintings: rows
        .filter((r) => !r.accepted)
        .map(({ id, name }) => ({ id, name, reason: 'Independent boundary support failed.' })),
      ...(complete && guardsMatch
        ? { guards, proof: proof('normalization', accepted.length, rows[0].material) }
        : {}),
    };
  }
  if (source?.key !== color.key || group.references.foilOnly) return;
  if (group.legendary) {
    group.tasks.frameColor = {
      status: 'needs-audit',
      reason:
        'The normal black fit excludes legendary crowns. A shared source key does not establish treatment coverage.',
      evidence: [root + 'm21-normal-color-adoption.json'],
    };
    return;
  }
  const measured = color.metrics.rows.filter((r) => group.printingIds.includes(r.id));
  const replayed = color.native.rows.filter((r) => group.printingIds.includes(r.id) && r.changed);
  const current = guardsMatch && source.source === color.profile.source;
  const complete = measured.length === group.printings && replayed.length === group.printings;
  group.tasks.frameColor = {
    status: !current ? 'stale' : complete ? 'validated' : 'partial',
    reason: `${measured.length}/${group.printings} accepted color references; ${replayed.length}/${group.printings} native renders. Shared normal-black curve passes all fixed cohort/color/texture gates. Paper, crown and full-card accuracy are separate.`,
    evidence: [root + 'm21-normal-color-adoption.json'],
    coveredPrintings: measured.length,
    rejectedPrintings: color.normalization.unresolved.filter((r) =>
      group.printingIds.includes(r.id),
    ),
    metrics: color.metrics.summaries,
    ...(complete && current ? { guards, proof: proof('frameColor', measured.length, 'B') } : {}),
  };
}

/** Keep a failed known-pose test open even when real-scan correlations pass. */
export function applyM21MonoEvidence(group, receipt, rendererHash, guardsMatch) {
  if (!['U', 'R', 'G'].includes(group.palette)) return;
  const rows = receipt.rows.filter((r) => group.printingIds.includes(r.id));
  if (!rows.length) return;
  const material = receipt.materials[group.palette];
  const accepted = rows.filter((r) => r.accepted);
  const complete = accepted.length === group.printings;
  group.tasks.normalization = {
    status: !guardsMatch
      ? 'stale'
      : !material.methodPassed
        ? 'rejected'
        : complete
          ? 'validated'
          : 'partial',
    reason: material.methodPassed
      ? `${accepted.length}/${group.printings} frozen scan-only poses pass independent checks; ${material.knownPosePassed}/${material.knownPoseTests} known-pose tests pass. Local comparison evidence; review-service deployment remains open.`
      : `Real-scan correlations pass, but only ${material.knownPosePassed}/${material.knownPoseTests} known-pose cases meet the fixed 0.30-pixel limit (worst ${material.maxResidual.toFixed(2)} pixels). These poses are not adopted.`,
    evidence: ['games/magic/fixtures/accuracy/m21-mono-boundaries.json'],
    coveredPrintings: accepted.length,
    ...(complete && guardsMatch && material.methodPassed
      ? {
          guards: Object.fromEntries(
            Object.entries(receipt.sourceGuards).map(([file, value]) => [
              'games/magic/src/presentation/' + file,
              value,
            ]),
          ),
          proof: {
            sourceHash: group.sourceHash,
            scopeHash: group.scopeHash,
            gatesPassed: true,
            rendererHash,
            methodHash: receipt.tools['m21-mono-boundaries.mjs'],
            nativeReplayHash: receipt.artifacts['normalization-mono/results.json'],
            metricsHash: receipt.artifacts['normalization-mono/known-poses.json'],
            scanTemplateHash: receipt.templateHash,
            coveredPrintings: accepted.length,
            calibrationNames: material.calibrationNames,
            validationNames: material.validationNames,
            validationKind: 'reused-development',
            choice: 'shared-material-fit',
          },
        }
      : {}),
  };
}
