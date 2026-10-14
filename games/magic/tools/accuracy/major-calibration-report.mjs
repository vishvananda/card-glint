import { calibrationMethodHash } from './major-calibration-identity.mjs';
import { createServer } from 'vite';
import { cacheRoot, fixtureRoot, readJson, writeJson, hash, root } from './common.mjs';
import { majorFrameCandidate } from './major-frame-policy.mjs';

const plan = await readJson(`${cacheRoot}/rollout/major-calibration-plan.json`);
const directory = `${cacheRoot}/rollout/major-calibration`,
  rows = [];
const policyServer = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const { hasNoPrintedSetSymbol } = await policyServer.ssrLoadModule(
  '/games/magic/src/presentation/historical-set-symbol.ts',
);
await policyServer.close();
const methodHash = await calibrationMethodHash();
const optional = async (file) => {
  try {
    return await readJson(file);
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
};
for (const group of plan.rows) {
  const key = group.key.replaceAll('/', '-');
  const measured = await optional(`${directory}/${key}-measure.json`),
    verified = await optional(`${directory}/${key}-verified.json`),
    capture = await optional(`${directory}/${key}.json`);
  const valid =
    measured &&
    measured.methodHash === methodHash &&
    capture &&
    capture.groupHash === hash(JSON.stringify(group)) &&
    measured.captureHash === hash(JSON.stringify(capture));
  const final =
    valid &&
    verified?.measurementHash === hash(JSON.stringify(measured)) &&
    verified.rendererHash === capture.rendererHash
      ? verified
      : null;
  const absentSource =
    valid &&
    measured.symbol.status === 'no-printed-symbol' &&
    !group.samples.every((s) => hasNoPrintedSetSymbol(group.set, s.card.name));
  const status = !group.family
    ? 'unsupported'
    : !valid
      ? 'pending'
      : measured.symbol.status === 'candidate' && !final
        ? 'raster-validation-pending'
        : final?.status === 'validated'
          ? 'validated-symbol-profile'
          : absentSource
            ? 'missing-symbol-source'
            : measured.symbol.status === 'no-printed-symbol'
              ? 'no-printed-symbol'
              : 'review';
  const pose = valid ? measured.rows.filter((r) => r.fit) : [];
  const frameCheck = await optional(`${directory}/${key}-frame-verified.json`);
  const frameCandidate = valid ? majorFrameCandidate(group, measured) : null;
  const frameCalibration = !frameCandidate
    ? null
    : frameCheck?.measurementHash === hash(JSON.stringify(measured)) &&
        frameCheck.rendererHash === capture.rendererHash
      ? frameCheck
      : { status: 'pending', ...frameCandidate };
  rows.push({
    set: group.set,
    name: group.name,
    key: group.key,
    family: group.family,
    border: group.border,
    eligiblePrintings: group.eligiblePrintings,
    sourceIdentity: group.sourceIdentity,
    excludedGroups: group.issues,
    samples: group.samples.length,
    status,
    captureHash: valid ? measured.captureHash : null,
    rendererHash: valid ? capture.rendererHash : null,
    measurementHash: valid ? hash(JSON.stringify(measured)) : null,
    normalization: valid ? measured.normalization : null,
    poses: pose.map((r) => ({
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      material: r.material,
      referenceHash: r.referenceHash,
      templateHash: r.templateHash,
      fitHash: r.fitHash,
      accepted: r.fit.accepted,
      reason: r.fit.reason,
      model: r.fit.model,
      parameters: r.fit.parameters,
      transform: r.fit.transform,
      inverse: r.fit.inverse,
      validation: r.fit.validation,
    })),
    frame: valid ? measured.frame : null,
    frameCalibration,
    frameAssets: [
      ...new Set(
        (capture?.samples ?? []).flatMap((s) =>
          (s.components ?? [])
            .filter((a) => /\/img\/(?:frames|bg|boxes)\//.test(a.url))
            .map((a) => a.url),
        ),
      ),
    ].sort(),
    frameReview: valid
      ? Object.entries(measured.frame)
          .filter(([, m]) => m.status === 'shared-asset-offset')
          .map(([part, m]) => ({ part, reservedPx: m.reserved, fitPx: m.fit }))
      : [],
    symbol: final ?? (valid ? measured.symbol : null),
    failures:
      capture?.samples
        .filter((s) => s.issue)
        .map((s) => ({ id: s.id, name: s.name, issue: s.issue })) ?? [],
  });
}
const statuses = Object.fromEntries(
  [...new Set(rows.map((r) => r.status))].map((status) => [
    status,
    rows.filter((r) => r.status === status).length,
  ]),
);
const report = {
  schemaVersion: 1,
  planHash: hash(JSON.stringify(plan)),
  methodHash,
  scope: plan.scope,
  complete: !rows.some(
    (r) =>
      ['pending', 'raster-validation-pending'].includes(r.status) ||
      r.frameCalibration?.status === 'pending',
  ),
  summary: {
    ...plan.summary,
    statuses,
    acceptedFrameFits: rows.reduce((n, r) => n + (r.normalization?.accepted ?? 0), 0),
    measuredReferences: rows.reduce((n, r) => n + (r.normalization?.total ?? 0), 0),
    frameGroupsWithSharedResiduals: rows.filter((r) => r.frameReview.length).length,
    validatedFrameProfiles: rows.filter((r) => r.frameCalibration?.status === 'validated').length,
    pendingFrameProfiles: rows.filter((r) => r.frameCalibration?.status === 'pending').length,
  },
  limitations: [
    'Stratified samples; not every-card accuracy coverage.',
    'Affine comparison stretch does not certify source-frame aspect.',
    'Frame rail shifts are source-asset diagnostics, not automatically adopted deformations.',
    'No glyph contour or frame asset is synthesized to conceal a mismatch.',
    'Special layouts/effects and modern crowns remain separate adapters.',
  ],
  rows,
};
await writeJson(`${fixtureRoot}/major-set-calibration.json`, report);
console.log(JSON.stringify({ complete: report.complete, ...report.summary }, null, 2));
