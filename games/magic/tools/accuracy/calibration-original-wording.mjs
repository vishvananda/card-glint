/** Field-level input readiness never approves geometry or whole-card wording. */
export function applyEarlyOriginalWording(group, receipt, guardsMatch) {
  const rows = receipt.rows.filter((r) => group.printingIds.includes(r.id));
  if (!rows.length) return;
  const evidence = ['games/magic/fixtures/accuracy/early-expansion-original-wording.json'];
  const blockers = receipt.renderingBlockers.filter((r) => group.printingIds.includes(r.id));
  if (blockers.length)
    group.tasks.frameGeometry = {
      ...group.tasks.frameGeometry,
      status: 'pending',
      reason:
        'Original wording changes frame selection; preserve semantic traits and land palettes before adoption.',
      evidence: [...(group.tasks.frameGeometry.evidence ?? []), ...evidence],
      blockers,
    };
  const sources = (field) =>
    Object.fromEntries(
      Object.entries(Object.groupBy(rows, (r) => r[field])).map(([key, values]) => [
        key,
        values.length,
      ]),
    );
  for (const [task, field] of [
    ['rules', 'rules'],
    ['headings', 'type'],
  ])
    group.tasks[task].originalInput = {
      status: !guardsMatch ? 'stale' : rows.length === group.printings ? 'ready' : 'partial',
      field,
      coveredPrintings: rows.length,
      sources: sources(field),
      evidence,
      guards: receipt.methodGuards,
      reason:
        field === 'type'
          ? 'Exact printing type lines reviewed against scan crops. Name transcription and heading placement remain separate.'
          : 'Exact printing original rules supplied and checked by the strict calibration adapter. Source transcription outliers and typography still require review.',
    };
  group.tasks.references = {
    ...group.tasks.references,
    status: guardsMatch ? 'partial' : 'stale',
    evidence: [...(group.tasks.references.evidence ?? []), ...evidence],
    reason:
      'Original rules inputs and scan-reviewed type lines are ready. Most flavor formatting, printed names, artist/footer data and source transcription outliers remain separate review obligations.',
    historicalWording: group.tasks.references.wording,
    wording: { rules: sources('rules'), type: sources('type'), flavor: sources('flavor') },
  };
}
