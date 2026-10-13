import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { cacheRoot, hash, readJson, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { median } from './metrics.mjs';
import {
  registerMajorFrame,
  internalFrameOffsets,
  symbolSample,
  searchSymbols,
  scoreSymbol,
} from './major-calibration-metrics.mjs';

const directory = `${cacheRoot}/rollout/major-calibration`;
const plan = await readJson(`${cacheRoot}/rollout/major-calibration-plan.json`),
  filter = process.argv.slice(2);
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'major-calibration-metrics.mjs',
        'major-calibration-measure.mjs',
        'scan-affine-fit.mjs',
        'scan-frame-anchors.mjs',
        'scan-frame-fit.mjs',
        'pixels-pure.mjs',
        'edges.mjs',
        'metrics.mjs',
      ].map((n) => readFile(new URL(n, import.meta.url))),
    ),
  ),
);
for (const group of plan.rows.filter(
  (r) => !filter.length || filter.includes(r.set) || filter.includes(r.family),
)) {
  const key = group.key.replaceAll('/', '-');
  let capture;
  try {
    capture = await readJson(`${directory}/${key}.json`);
  } catch (e) {
    if (e.code === 'ENOENT') continue;
    throw e;
  }
  const captureHash = hash(JSON.stringify(capture));
  try {
    const prior = await readJson(`${directory}/${key}-measure.json`);
    if (prior.captureHash === captureHash && prior.methodHash === methodHash) {
      console.log('cached', key);
      continue;
    }
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const rows = [],
    samples = [];
  for (const row of capture.samples) {
    if (row.issue) {
      rows.push(row);
      continue;
    }
    const readImage = async (asset) => {
      const bytes = await readFile(`${directory}/${asset.file}`);
      if (hash(bytes) !== asset.sha256) throw Error('Corrupt capture');
      return PNG.sync.read(bytes);
    };
    const blank = await readImage(row.images.blank),
      source = PNG.sync.read(await readObject(row.reference));
    const fit = registerMajorFrame(normalize(source), blank, group.family, group.border);
    const result = {
      id: row.id,
      name: row.name,
      cohort: row.cohort,
      rarity: row.rarity,
      material: row.material,
      referenceHash: row.reference.sha256,
      templateHash: row.images.blank.sha256,
      fitHash: hash(JSON.stringify(fit)),
      fit,
    };
    rows.push(result);
    if (!fit.accepted) continue;
    const reference = normalize(source, fit.transform);
    result.frame = internalFrameOffsets(reference, blank, group.family);
    if (row.symbol?.includes('/setSymbols/official/') && row.images.stencil && row.bounds) {
      const sample = symbolSample(
        reference,
        blank,
        await readImage(row.images.stencil),
        row.bounds,
        group.family,
      );
      samples.push({ ...sample, id: row.id, cohort: row.cohort, rarity: row.rarity });
    }
  }
  const cal = samples.filter((s) => s.cohort === 'calibration'),
    val = samples.filter((s) => s.cohort === 'validation');
  let symbol = {
    status: !capture.samples.some((s) => s.symbol)
      ? 'no-printed-symbol'
      : 'insufficient-validated-scans',
    calibration: cal.length,
    validation: val.length,
  };
  if (cal.length >= 3 && val.length >= 3) {
    const search = searchSymbols(cal);
    const validation = val.map((s) => ({
      id: s.id,
      rarity: s.rarity,
      before: scoreSymbol(s, [0, 0, 1, 1]),
      after: scoreSymbol(s, search.best.params),
    }));
    const mean = (key, field) =>
      validation.reduce((n, r) => n + r[key][field], 0) / validation.length;
    const before = mean('before', 'f1'),
      after = mean('after', 'f1'),
      regressions = validation.filter((r) => r.after.f1 < r.before.f1 - 0.02).map((r) => r.id);
    const flags = [];
    if (search.boundary) flags.push('search-boundary');
    if (after < 0.5) flags.push('poor-source-match');
    if (after - before < 0.005) flags.push('no-reserved-gain');
    if (regressions.length) flags.push('reserved-regression');
    if (mean('after', 'distance') > mean('before', 'distance') + 0.05)
      flags.push('distance-regression');
    symbol = {
      status: flags.length ? 'review' : 'candidate',
      flags,
      calibration: cal.length,
      validation: val.length,
      params: search.best.params,
      evaluated: search.evaluated,
      trainingBefore: search.baseline.f1,
      trainingAfter: search.best.f1,
      before,
      after,
      regressions,
      rows: validation,
    };
    for (const s of samples) {
      const row = rows.find((r) => r.id === s.id);
      row.symbol = {
        before: scoreSymbol(s, [0, 0, 1, 1]),
        after: scoreSymbol(s, search.best.params),
      };
    }
  }
  const frame = {};
  for (const part of ['artLeft', 'artRight', 'rulesLeft', 'rulesRight', 'rulesTop']) {
    const cohort = (name) =>
      rows
        .filter((r) => r.cohort === name && r.frame?.[part].reliable)
        .map((r) => r.frame[part].shift);
    const a = cohort('calibration'),
      b = cohort('validation'),
      training = median(a),
      validation = median(b);
    frame[part] = {
      calibration: a.length,
      validation: b.length,
      fit: training,
      reserved: validation,
      status:
        a.length >= 3 && b.length >= 3 && Math.abs(training - validation) <= 1
          ? Math.abs(validation) > 0.75
            ? 'shared-asset-offset'
            : 'matched'
          : 'inconclusive',
    };
  }
  await writeJson(`${directory}/${key}-measure.json`, {
    schemaVersion: 1,
    key: group.key,
    set: group.set,
    family: group.family,
    border: group.border,
    rendererHash: capture.rendererHash,
    captureHash,
    methodHash,
    normalization: { accepted: rows.filter((r) => r.fit?.accepted).length, total: rows.length },
    frame,
    symbol,
    rows,
  });
  console.log(
    key,
    `${rows.filter((r) => r.fit?.accepted).length}/${rows.length} frame fits`,
    symbol.status,
    symbol.params ?? '',
    symbol.before ?? '',
    symbol.after ?? '',
  );
}
