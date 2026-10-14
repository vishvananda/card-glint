import { calibrationMethodHash } from './major-calibration-identity.mjs';
import { calibrationPlanFile } from './major-calibration-run.mjs';
import { createServer } from 'vite';
import { cacheRoot, fixtureRoot, hash, readJson, writeJson, root, sourceHash } from './common.mjs';
import {
  calibrationRevision,
  calibrationDirectory as directory,
} from './major-calibration-run.mjs';
if (!calibrationRevision) throw Error('An explicit follow-up revision is required');
const plan = await readJson(calibrationPlanFile);
const methodHash = await calibrationMethodHash();
const rendererHash = await sourceHash(root + '/games/magic/src');
const policyServer = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const { hasNoPrintedSetSymbol } = await policyServer.ssrLoadModule(
  '/games/magic/src/presentation/historical-set-symbol.ts',
);
await policyServer.close();
const optional = async (p) => {
  try {
    return await readJson(p);
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
};
const rows = [];
for (const group of plan.rows) {
  const key = group.key.replaceAll('/', '-'),
    capture = await optional(directory + '/' + key + '.json'),
    m = await optional(directory + '/' + key + '-measure.json'),
    v = await optional(directory + '/' + key + '-verified.json');
  const valid =
    capture &&
    m &&
    capture.groupHash === hash(JSON.stringify(group)) &&
    m.captureHash === hash(JSON.stringify(capture)) &&
    m.methodHash === methodHash;
  const checked =
    valid && v && v.measurementHash === hash(JSON.stringify(m)) && v.rendererHash === rendererHash;
  const identity = valid && JSON.stringify(m.symbol.params) === '[0,0,1,1]';
  const absentSource =
    valid &&
    m.symbol.status === 'no-printed-symbol' &&
    !group.samples.every((s) => hasNoPrintedSetSymbol(group.set, s.card.name));
  const status = !group.family
    ? 'unsupported'
    : !valid
      ? 'pending'
      : m.symbol.status === 'candidate'
        ? !checked
          ? 'raster-validation-pending'
          : v.status === 'validated'
            ? 'validated-change'
            : 'review'
        : absentSource
          ? 'missing-symbol-source'
          : identity
            ? 'retain-existing-placement'
            : m.symbol.status;
  rows.push({
    key: group.key,
    set: group.set,
    family: group.family,
    border: group.border,
    status,
    rendererHash: capture?.rendererHash ?? null,
    captureHash: valid ? m.captureHash : null,
    measurementHash: valid ? hash(JSON.stringify(m)) : null,
    normalization: valid ? m.normalization : null,
    symbol: checked ? v : valid ? m.symbol : null,
    frame: valid ? m.frame : null,
    failures:
      capture?.samples
        .filter((s) => s.issue)
        .map((s) => ({ id: s.id, name: s.name, issue: s.issue })) ?? [],
    poses: valid
      ? m.rows
          .filter((r) => r.fit)
          .map((r) => ({
            id: r.id,
            referenceHash: r.referenceHash,
            fitHash: r.fitHash,
            accepted: r.fit.accepted,
            reason: r.fit.reason,
            transform: r.fit.transform,
          }))
      : [],
  });
}
const statuses = Object.fromEntries(
  [...new Set(rows.map((r) => r.status))].map((s) => [
    s,
    rows.filter((r) => r.status === s).length,
  ]),
);
const report = {
  schemaVersion: 1,
  revision: calibrationRevision,
  planHash: hash(JSON.stringify(plan)),
  methodHash,
  rendererHash,
  scope:
    'Follow-up on existing shared profiles. Exact comparison-region baseline required for production validation. Stored scan poses are comparison-only; no per-card rendering offsets.',
  complete: !rows.some((r) => ['pending', 'raster-validation-pending'].includes(r.status)),
  summary: { ...plan.summary, statuses },
  limitations: [
    'Identity proposals retain the prior placement; they do not certify perfect glyph shape.',
    'Low-confidence frame normalization, missing assets and reserved regressions stay in review.',
    'Rarity material differences and special layouts remain separate reviews.',
  ],
  rows,
};
await writeJson(fixtureRoot + '/major-symbol-followup.json', report);
console.log(report.complete, report.summary);
