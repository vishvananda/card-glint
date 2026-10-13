import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { hash } from './common.mjs';
const [directory, ...files] = process.argv.slice(2);
if (!directory || !files.length)
  throw Error('Usage: styled-symbol-report.mjs CAPTURE_DIRECTORY GRID_JSON...');
const read = (name) => readFile(path.join(directory, name));
const normalized = JSON.parse(await read('placement-normalization.json'));
const examples = JSON.parse(await read('examples.json'));
const merged = new Map(),
  grids = [];
const parameters = (p) => ({ dx: p.dx, dy: p.dy, sx: p.sx, sy: p.sy });
const key = (p) => JSON.stringify(parameters(p));
for (const file of files) {
  const bytes = await read(file),
    grid = JSON.parse(bytes);
  grids.push({ file, sha256: hash(bytes) });
  for (const row of grid.rows) {
    let entry = merged.get(row.slug);
    if (!entry) {
      entry = { ...row, scores: new Map() };
      merged.set(row.slug, entry);
    }
    for (const p of row.scores) entry.scores.set(key(p), p);
  }
}
const rows = [...merged.values()],
  sets = [...new Set(rows.map((r) => r.slug.split('-')[0]))];
const baseline = key({ dx: 0, dy: 0, sx: 1, sy: 1 });
const summaries = [];
for (const set of sets) {
  const selected = rows.filter((r) => r.slug.startsWith(set + '-'));
  const candidates = [...selected[0].scores.keys()].filter((k) =>
    selected.every((r) => r.scores.has(k)),
  );
  const choose = (rs) =>
    candidates
      .map((k) => ({
        key: k,
        mean: rs.reduce((sum, r) => sum + r.scores.get(k).f1, 0) / rs.length,
      }))
      .sort((a, b) => b.mean - a.mean)[0];
  const best = choose(selected),
    heldOut =
      selected.length < 2
        ? []
        : selected.map((r, i) => {
            const fit = choose(selected.filter((_, j) => j !== i));
            return {
              slug: r.slug,
              parameters: JSON.parse(fit.key),
              before: r.scores.get(baseline).f1,
              after: r.scores.get(fit.key).f1,
            };
          });
  const heldOutDelta = heldOut.reduce((s, r) => s + r.after - r.before, 0) / selected.length;
  const adopt =
    selected.length >= 3 &&
    heldOutDelta > 0.005 &&
    heldOut.every((r) => r.after - r.before > -0.02);
  const applied = adopt ? best.key : baseline;
  summaries.push({
    set,
    family: selected[0].family,
    count: selected.length,
    parameters: JSON.parse(applied),
    adopted: adopt,
    best: JSON.parse(best.key),
    before: selected.reduce((s, r) => s + r.scores.get(baseline).f1, 0) / selected.length,
    after: selected.reduce((s, r) => s + r.scores.get(applied).f1, 0) / selected.length,
    heldOutDelta,
    heldOut,
    rows: selected.map((r) => {
      const saved = normalized.find((n) => n.slug === r.slug);
      if (saved.resultHash !== hash(JSON.stringify(saved.fit)))
        throw Error('Frozen normalization changed');
      return {
        slug: r.slug,
        source: examples.find((e) => e.slug === r.slug).source,
        identity: saved.identity,
        normalizationHash: saved.resultHash,
        transform: saved.fit.transform,
        before: r.scores.get(baseline),
        after: r.scores.get(applied),
      };
    }),
  });
}
const report = {
  schemaVersion: 1,
  scope:
    'Styled set-symbol placement on replacement base plates. Patched material topology fixed before fitting; source gradient colors retained. Tight 74×33 region at [382,385], edge F1 at 1 px; no per-card rendering offsets. Frames normalized independently with frozen translation/scale/rotation/skew fits. Leave-one-out within this development cohort is not an independent corpus accuracy estimate. Rejected frame fits are not scored.',
  grids,
  summaries,
  rejected: normalized.filter((r) => !r.fit.accepted).map((r) => r.slug),
};
await writeFile(
  path.join(directory, 'styled-symbol-calibration.json'),
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  summaries.map(({ set, count, parameters, before, after, heldOutDelta, adopted }) => ({
    set,
    count,
    parameters,
    before,
    after,
    heldOutDelta,
    adopted,
  })),
);
