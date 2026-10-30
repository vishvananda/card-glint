/** Later normalization evidence supersedes poses, not historical color scores. */
export function applyM21BoundaryRefinement(group, receipt, guardsMatch) {
  const rows = receipt.rows.filter((r) => group.printingIds.includes(r.id));
  if (!rows.length) return;
  const accepted = rows.filter((r) => r.accepted),
    material = receipt.materials[rows[0].material],
    complete = accepted.length === group.printings,
    land = rows[0].material === 'plain-land';
  const prefix = land
    ? 'modern-land-coverage/normalization/'
    : 'calibration-gaps/normalization-mono-v2/';
  group.tasks.normalization = {
    status: !guardsMatch ? 'stale' : complete ? 'validated' : 'partial',
    reason: `${accepted.length}/${group.printings} frozen scan poses pass independent frame checks and raster replay. Refined interpolation passes ${material.knownPosePassed}/${material.knownPoseTests} known-transform tests for this material. Comparison data only; review-service deployment remains open.`,
    evidence: ['games/magic/fixtures/accuracy/m21-component-boundaries-v2.json'],
    coveredPrintings: accepted.length,
    rejectedPrintings: rows
      .filter((r) => !r.accepted)
      .map(({ id, name }) => ({
        id,
        name,
        reason: 'Independent frame support or warped-raster certification failed.',
      })),
    ...(complete && guardsMatch
      ? {
          guards: Object.fromEntries(
            Object.entries(receipt.sourceGuards).map(([f, h]) => [
              'games/magic/src/presentation/' + f,
              h,
            ]),
          ),
          proof: {
            sourceHash: group.sourceHashes?.normalization ?? group.sourceHash,
            scopeHash: group.scopeHash,
            gatesPassed: true,
            rendererHash: receipt.rendererHash,
            methodHash: receipt.tools['modern-boundary-fit.mjs'],
            nativeReplayHash: receipt.artifacts[prefix + 'results.json'],
            metricsHash:
              receipt.artifacts[
                land
                  ? prefix + 'known-poses.json'
                  : 'calibration-gaps/normalization-mono/known-poses-cubic.json'
              ],
            scanTemplateHash: material.templateHash,
            coveredPrintings: accepted.length,
            calibrationNames: material.calibrationNames,
            validationNames: material.validationNames,
            validationKind: 'reused-development',
            choice: 'shared-material-fit',
          },
        }
      : {}),
  };
  if (group.palette === 'R' && group.tasks.frameColor?.status === 'needs-audit')
    group.tasks.frameColor.reason =
      'Refined normalization now passes known-transform checks. Rerun pigment diagnostics with these frozen poses before adopting a replacement; historical color results retain the earlier failed normalization.';
}

/** Outer stock does not close the separate interior-ink obligation. */
export function applyM21StockTransfer(group, receipt, guardsMatch) {
  const rows = receipt.native.rows.filter(
    (r) => r.stockChanged && group.printingIds.includes(r.id),
  );
  if (!rows.length) return;
  const measured = receipt.metrics.rows.filter((r) => group.printingIds.includes(r.id));
  group.tasks.blackLevels = {
    status: guardsMatch ? 'partial' : 'stale',
    reason: `${rows.length}/${group.printings} printings use the existing source-bound M21 outer-stock target; ${measured.length} have directly measured land references. Interior ink is still uncalibrated. Other palettes and legendary-land style controls are family transfers, not newly certified references.`,
    evidence: ['games/magic/fixtures/accuracy/modern-land-stock-transfer.json'],
    coveredPrintings: rows.length,
    measuredPrintings: measured.length,
    measurements: receipt.metrics.summary,
  };
}

/** An unchanged source is calibrated only after its actual references pass. */
export function applyM21WhiteDefault(group, source, receipt, guardsMatch) {
  const rows = receipt.rows.filter((r) => group.printingIds.includes(r.id));
  if (!rows.length) return;
  const current = guardsMatch && source?.source === receipt.source.source,
    complete = rows.length === group.printings;
  group.tasks.frameColor = {
    status: !current ? 'stale' : complete ? 'validated-default' : 'partial',
    reason:
      (!current
        ? 'Source or receipt dependencies differ; revalidate this retained color measurement. Historical result: '
        : '') +
      `${rows.length}/${group.printings} unchanged native white-frame pigments pass absolute regional and ten-bin texture color checks. Paper, plates, texture frequency, geometry and typography remain separate.`,
    evidence: ['games/magic/fixtures/accuracy/m21-white-default.json'],
    coveredPrintings: rows.length,
    measurements: receipt.summaries,
    ...(current && complete
      ? {
          guards: {
            ...Object.fromEntries(
              Object.entries(receipt.sourceGuards).map(([f, h]) => [
                'games/magic/src/presentation/' + f,
                h,
              ]),
            ),
            ...receipt.methodGuards,
          },
          proof: {
            sourceHash: group.sourceHashes?.frameColor ?? group.sourceHash,
            scopeHash: group.scopeHash,
            gatesPassed: true,
            rendererHash: receipt.rendererHash,
            methodHash: receipt.tools['m21-refined-pigment-audit.mjs'],
            nativeReplayHash: receipt.artifacts['stock-replay.json'],
            metricsHash: receipt.artifacts['refined-pigment-audit.json'],
            scanTemplateHash: receipt.normalization.templateHash,
            coveredPrintings: rows.length,
            calibrationNames: receipt.summaries.calibration.names,
            validationNames: receipt.summaries.validation.names,
            validationKind: 'reused-development',
            choice: 'source-default',
          },
        }
      : {}),
  };
}

/** Source wording is a prerequisite; it cannot certify text placement. */
export function applyM21OriginalWording(group, receipt, guardsMatch) {
  const rows = receipt.rows.filter((r) => group.printingIds.includes(r.id));
  if (!rows.length) return;
  group.tasks.rules.originalInput = {
    status: !guardsMatch ? 'stale' : rows.length === group.printings ? 'ready' : 'partial',
    coveredPrintings: rows.length,
    sources: Object.fromEntries(
      Object.entries(Object.groupBy(rows, (r) => r.rules)).map(([key, values]) => [
        key,
        values.length,
      ]),
    ),
    evidence: [receipt.evidenceFile ?? 'games/magic/fixtures/accuracy/m21-original-wording.json'],
    guards: receipt.methodGuards,
    reason:
      'Printing-sourced rules available; original type/flavor review and text calibration remain separate. Historical Oracle-input color checks are not text evidence.',
  };
}

/** Ordinary pigment measurements do not transfer to crowns or colored artifacts. */
export function applyM21RedColor(group, source, receipt, guardsMatch) {
  const rows = receipt.metrics.rows.filter((r) => group.printingIds.includes(r.id));
  if (!rows.length) return;
  const current = guardsMatch && source?.source === receipt.source.source;
  const complete = rows.length === group.printings;
  group.tasks.frameColor = {
    status: !current ? 'stale' : complete ? 'validated' : 'partial',
    reason:
      (!current
        ? 'Source or receipt dependencies differ; revalidate this retained color measurement. Historical result: '
        : '') +
      `${rows.length}/${group.printings} ordinary red frame pigments pass current/raw color and texture gates with original-wording native replay. Paper, crowns and typography remain separate; Chandra's Firemaw remains a reference/printing-batch review item.`,
    evidence: ['games/magic/fixtures/accuracy/m21-red-color-adoption.json'],
    coveredPrintings: rows.length,
    measurements: receipt.metrics.summaries,
    ...(current && complete
      ? {
          guards: {
            ...Object.fromEntries(
              Object.entries(receipt.sourceGuards).map(([f, h]) => [
                'games/magic/src/presentation/' + f,
                h,
              ]),
            ),
            ...receipt.methodGuards,
          },
          proof: {
            sourceHash: group.sourceHashes?.frameColor ?? group.sourceHash,
            scopeHash: group.scopeHash,
            gatesPassed: true,
            rendererHash: receipt.native.rendererHash,
            methodHash: receipt.tools['m21-red-metrics.mjs'],
            nativeReplayHash: receipt.artifacts['native-replay.json'],
            metricsHash: receipt.artifacts['native-metrics.json'],
            scanTemplateHash: receipt.normalization.templateHash,
            coveredPrintings: rows.length,
            calibrationNames: receipt.metrics.summaries.calibration.names,
            validationNames: receipt.metrics.summaries.validation.names,
            validationKind: 'reused-development',
            choice: 'shared-material-fit',
          },
        }
      : {}),
  };
}
