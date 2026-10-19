import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
import { opaqueSupport, scoreOpaqueFamily } from './frame-family-score.mjs';
import { median, quantile } from './metrics.mjs';

const [inputsFile, posesDirectory, templatesFile, templatesDirectory, output] =
  process.argv.slice(2);
if (!output)
  throw Error('Usage: set-frame-family-study.mjs INPUTS POSES TEMPLATES.json TEMPLATE_PNGS OUT');
const inputs = await readJson(inputsFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json')),
  sources = await readJson(templatesFile);
assert.equal(poses.inputHash, hash(await readFile(inputsFile)));
const choices = new Map(),
  rows = [];
const landColors = { Plains: 'W', Island: 'U', Swamp: 'B', Mountain: 'R', Forest: 'G' };
const material = (e) =>
  e.material === 'L' ? (landColors[e.card.name] ? landColors[e.card.name] + 'L' : 'L') : e.material;
for (const key of new Set(inputs.entries.map(material))) {
  const candidates = sources.rows.filter(
    (t) => t.material === key && ['abu', 'fourth', 'seventh'].includes(t.family),
  );
  assert.ok(candidates.length >= 2, 'Missing frame family candidates for ' + key);
  const plates = [];
  for (const t of candidates) {
    const bytes = await readFile(path.join(templatesDirectory, t.file));
    assert.equal(hash(bytes), t.sha256, 'Changed template raster: ' + t.file);
    assert.equal(t.url, t.asset.url);
    plates.push(normalize(PNG.sync.read(bytes, { checkCRC: true })));
  }
  const support = opaqueSupport(plates);
  choices.set(key, {
    support,
    candidates: candidates.map((t, i) => ({
      ...t,
      profiles: frameProfiles(plates[i]),
    })),
  });
}
for (const e of inputs.entries) {
  const pose = poses.rows.find((p) => p.id === e.id);
  assert.equal(pose.material, e.material);
  const key = material(e),
    spec = choices.get(key);
  if (!pose.accepted || e.issue) {
    rows.push({ id: e.id, name: e.card.name, material: key, excluded: e.issue ?? 'scan-pose' });
    continue;
  }
  const { image } = await normalizedReference(e, pose, path.join(posesDirectory, 'rasters')),
    profiles = frameProfiles(image);
  rows.push({
    id: e.id,
    name: e.card.name,
    material: key,
    cohort: pose.cohort,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(pose)),
    candidates: Object.fromEntries(
      spec.candidates.map((c) => [c.family, scoreOpaqueFamily(profiles, c.profiles, spec.support)]),
    ),
  });
  if (rows.length % 50 === 0) console.log(inputs.set, rows.length, '/', inputs.entries.length);
}
const summarize = (list) => ({
  cards: list.length,
  mean100: list.length ? (100 * list.reduce((n, x) => n + x, 0)) / list.length : null,
  median100: list.length ? 100 * median(list) : null,
  p10_100: list.length ? 100 * quantile(list, 0.1) : null,
});
const groups = Object.fromEntries(
  [...choices].map(([key, spec]) => [
    key,
    {
      support: spec.support,
      candidates: Object.fromEntries(
        spec.candidates.map((c) => [
          c.family,
          {
            source: { url: c.url, sha256: c.asset.sha256, rect: c.rect, rasterHash: c.sha256 },
            cohorts: Object.fromEntries(
              ['calibration', 'validation'].map((cohort) => [
                cohort,
                summarize(
                  rows
                    .filter((r) => r.material === key && r.cohort === cohort && !r.excluded)
                    .map((r) => r.candidates[c.family].score)
                    .filter((v) => v !== null),
                ),
              ]),
            ),
          },
        ]),
      ),
    },
  ]),
);
await writeJson(output, {
  schema: 1,
  set: inputs.set,
  status: 'diagnostic-not-selected',
  scope:
    'All available accepted original-printing scans, frozen frame-only poses. Fixed source templates, no HSB or candidate-specific scan normalization. Common opaque support excludes illustration pixels for every family. Profile gradients and relative ordering reduce sensitivity to brightness/saturation. Paper texture, source geometry and missing bevel details still need visual and native review. Basic-land art variants share a name and are not independent validation names. Dual lands compare base plates only; striped overlays are separate.',
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  templatesHash: hash(await readFile(templatesFile)),
  sources: await Promise.all(
    ['set-frame-family-study.mjs', 'frame-family-metrics.mjs', 'frame-family-score.mjs'].map(
      async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))],
    ),
  ),
  groups,
  rows,
});
console.log(
  Object.fromEntries(
    Object.entries(groups).map(([key, g]) => [
      key,
      Object.fromEntries(
        Object.entries(g.candidates).map(([family, c]) => [
          family,
          Object.fromEntries(Object.entries(c.cohorts).map(([cohort, s]) => [cohort, s.mean100])),
        ]),
      ),
    ]),
  ),
);
