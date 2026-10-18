// Optional full-card replay metric. The scorer is supplied explicitly; it is
// never imported by the renderer or used to optimize the experimental frame.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';

const [directory, inputsFile, scorerFile, label = 'train', candidateFile] = process.argv.slice(2);
if (!scorerFile)
  throw Error('Usage: frame-reconstruction-score.mjs OUT INPUTS SCORER_MODULE [train|all]');
assert(/^[a-z][a-z0-9-]*$/.test(label));
const manifest = candidateFile ? await readJson(candidateFile) : null;
const candidateKeys = manifest
  ? manifest.candidates.map((candidate) => candidate.key)
  : ['calibrated', 'reconstructed'];
assert.equal(new Set(candidateKeys).size, candidateKeys.length);
const { scoreRegions } = await import(pathToFileURL(path.resolve(scorerFile)));
assert.equal(typeof scoreRegions, 'function', 'Scorer must export scoreRegions');
const observations = await readJson(path.join(directory, 'observations.json'));
const inputs = await readJson(inputsFile);
const rows = [];
for (const record of observations.records) {
  const entry = inputs.entries.find((e) => e.id === record.id);
  assert(entry, `Missing input: ${record.id}`);
  const scan = normalize(
    PNG.sync.read(await readFile(record.reference.file)),
    record.normalization.transform,
  );
  const variants = {};
  for (const [key, file] of [
    ['released', record.baseline.file],
    ...candidateKeys.map((key, index) => [key, `${label}-native/${record.id}-${index}.png`]),
  ]) {
    const render = normalize(PNG.sync.read(await readFile(path.join(directory, file))));
    const result = scoreRegions(scan, render, entry.card, record.face);
    assert(Number.isFinite(result.structuralScore) && Number.isFinite(result.coverage));
    variants[key] = {
      structure100: 100 * result.structuralScore,
      coverage: result.coverage,
      components: Object.fromEntries(
        Object.entries(result.components).map(([k, v]) => [
          k,
          { score100: v.score === null ? null : 100 * v.score, eligible: v.eligible },
        ]),
      ),
    };
  }
  rows.push({ id: record.id, name: record.name, cohort: record.cohort, variants });
  console.log(rows.length, record.name);
}
const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;
const groups = Object.fromEntries(
  ['calibration', 'validation', 'all'].map((cohort) => {
    const subset = rows.filter((r) => cohort === 'all' || r.cohort === cohort);
    assert(subset.length > 0, `Empty cohort: ${cohort}`);
    return [
      cohort,
      {
        cards: subset.length,
        variants: Object.fromEntries(
          ['released', ...candidateKeys].map((key) => [
            key,
            {
              structure100: mean(subset.map((r) => r.variants[key].structure100)),
              coverage: mean(subset.map((r) => r.variants[key].coverage)),
              frame100: mean(subset.map((r) => r.variants[key].components.frame.score100)),
            },
          ]),
        ),
      },
    ];
  }),
);
await writeJson(path.join(directory, `${label}-whole-card.json`), {
  label,
  validationKind:
    label === 'all'
      ? 'Full-data refit; historical cohort labels do not represent held-out evaluation'
      : 'Held out from reconstruction only; previously inspected development scans',
  metric: 'Externally supplied structural score; diagnostic only, historical frozen poses',
  scorerSha256: hash(await readFile(scorerFile)),
  normalizationSha256: hash(
    await readFile(fileURLToPath(new URL('./pixels-pure.mjs', import.meta.url))),
  ),
  ...(manifest ? { candidates: manifest.candidates } : {}),
  groups,
  rows,
});
console.log(JSON.stringify(groups, null, 2));
