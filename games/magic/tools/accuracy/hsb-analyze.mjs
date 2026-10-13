import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  root,
  fixtureRoot,
  outputRoot,
  cacheRoot,
  readJson,
  writeJson,
  objectFile,
  hash,
} from './common.mjs';
import { readPng, normalize } from './pixels.mjs';
import { sampleColor, fitHsb, evaluateHsb, median, quantile, center, delta } from './hsb-color.mjs';
const action = process.argv[2];
assert.ok(['fit', 'validate'].includes(action));
const base = `${outputRoot}/early-hsb`,
  plan = await readJson(`${fixtureRoot}/early-hsb-plan.json`),
  snapshot = await readJson(`${cacheRoot}/rollout/early-hsb.json`),
  capture = await readJson(`${base}/before/capture.json`);
assert.equal(hash(JSON.stringify(snapshot)), plan.snapshotHash);
assert.equal(capture.rendererHash, plan.baselineRendererHash);
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      ['hsb-analyze.mjs', 'hsb-color.mjs', '../../src/presentation/hsb.ts'].map((p) =>
        readFile(new URL(p, import.meta.url)),
      ),
    ),
  ),
);
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const groups = [];
  let frozen;
  if (action === 'fit') {
    try {
      await readFile(`${fixtureRoot}/early-hsb-candidate.json`);
      throw Error('Candidate already frozen');
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  } else {
    frozen = await readJson(`${fixtureRoot}/early-hsb-candidate.json`);
    assert.equal(frozen.planHash, hash(JSON.stringify(plan)));
    assert.equal(frozen.methodHash, methodHash, 'Method changed after fitting');
  }
  for (const template of capture.templates) {
    const image = normalize(await readPng(`${base}/templates/${template.file}`));
    const [set, material] = template.key.split('-');
    const entries = snapshot.entries.filter(
      (e) =>
        e.card.set === set &&
        e.material === material &&
        e.cohort === (action === 'fit' ? 'calibration' : 'validation'),
    );
    const refs = await Promise.all(
      entries.map(async (e) => ({
        entry: e,
        image: normalize(await readPng(objectFile(e.reference))),
      })),
    );
    for (const component of ['frame', 'paper']) {
      const patches = plan.sampling[component + 'Patches'],
        opts = { tileSize: plan.sampling.tileSize, paper: component === 'paper' },
        source = sampleColor(image, patches, opts);
      const samples = refs.map(({ entry, image }) => ({
        id: entry.id,
        name: entry.card.name,
        ...sampleColor(image, patches, opts),
      }));
      const model =
        action === 'fit'
          ? fitHsb(source, samples, plan.model, math)
          : frozen.groups.find((g) => g.key === template.key && g.component === component);
      const measured = samples.map((r) => ({
        id: r.id,
        name: r.name,
        ...evaluateHsb(source, r, model.adjustment, math),
        rejectedFraction: r.rejectedFraction,
      }));
      // Same alternate windows for every scan. This is a robustness test, never
      // a search for the best per-scan offset or a source of fitted parameters.
      const offsetSensitivity = refs.map(({ entry, image }) => {
        const central = samples.find((s) => s.id === entry.id);
        return Math.max(
          ...[
            [2, 0],
            [-2, 0],
            [0, 2],
            [0, -2],
          ].map(([dx, dy]) =>
            delta(central.rgb, sampleColor(image, patches, { ...opts, dx, dy }).rgb),
          ),
        );
      });
      const before = median(measured.map((m) => m.before)),
        after = median(measured.map((m) => m.after));
      const group = {
        key: template.key,
        set,
        material,
        component,
        ...model,
        count: entries.length,
        summary: {
          before,
          after,
          improved: measured.filter((m) => m.after < m.before).length,
          worstRegression: Math.max(0, ...measured.map((m) => m.after - m.before)),
          maximumOffsetSensitivity: Math.max(...offsetSensitivity),
          textureSpreadRatio: median(
            measured.map((m) => m.afterSpread / Math.max(0.1, m.referenceSpread)),
          ),
          clipping: measured[0].clipping,
        },
        rows: measured,
      };
      if (action === 'validate') {
        group.flags = [...group.flags];
        if (
          model.count < plan.model.minimumCalibration ||
          entries.length < plan.model.minimumValidation
        )
          group.flags.push('sparse-group');
        if (after > before - 0.25) group.flags.push('no-material-gain');
        if (group.summary.worstRegression > 1) group.flags.push('reserved-regression');
        if (after > 3) group.flags.push('residual-color-error');
        if (group.summary.clipping > 0.01) group.flags.push('clipping');
        if (group.summary.maximumOffsetSensitivity > 1) group.flags.push('window-sensitive');
        if (group.summary.textureSpreadRatio > 2 || group.summary.textureSpreadRatio < 0.5)
          group.flags.push('texture-mismatch');
        // Texture/hue warnings remain reviewable even when the mean color fit
        // transfers. Only these conservative numerical gates permit the trial.
        group.status = group.flags.some((f) =>
          [
            'sparse-group',
            'no-material-gain',
            'reserved-regression',
            'clipping',
            'window-sensitive',
          ].includes(f),
        )
          ? 'review-only'
          : 'trial';
        delete group.rows;
        group.rows = measured;
        delete group.target;
      }
      groups.push(group);
      console.log(
        template.key,
        component,
        entries.length,
        before.toFixed(2),
        '->',
        after.toFixed(2),
        group.status ?? '',
        group.flags.join(','),
      );
    }
  }
  const report = {
    schemaVersion: 1,
    planHash: hash(JSON.stringify(plan)),
    methodHash,
    baselineRendererHash: plan.baselineRendererHash,
    policy: {
      metric:
        '100 × Euclidean Oklab distance between robust component centers; not total rendering accuracy',
      rejection:
        'Discard paper pixels below 65% of local median HSV brightness, then discard tiles retaining less than 65%; apply to source and reference equally.',
      admission:
        'At least 3 calibration / 2 reserved; reserved median improvement >0.25; worst reserved regression <=1; no >1% tile clipping; fixed-window sensitivity <=1. Texture mismatch remains flagged separately. Opt-in trial only.',
      split:
        'Card-name hash order; basic-land variants share a name and do not constitute independent card-name validation.',
      limitations:
        'No color chart or scan white balance. These profiles match this cached Scryfall corpus, not measured physical print colors. Geometry frozen at v78; fixed eroded windows avoid edge registration. Artwork, text, border stock and mana are outside fitted components.',
    },
    groups,
  };
  if (action === 'fit') await writeJson(`${fixtureRoot}/early-hsb-candidate.json`, report);
  else {
    report.candidateHash = hash(JSON.stringify(frozen));
    await writeJson(`${fixtureRoot}/early-hsb-results.json`, report);
  }
} finally {
  await server.close();
}
