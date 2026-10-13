import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  readJson,
  writeJson,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  objectFile,
  hash,
} from './common.mjs';
import { measureSymbolBounds, measureRenderedSymbol } from './symbol-bounds.mjs';
import { median } from './metrics.mjs';
const [set, stage = 'before', adoptionName = 'adoption-plan'] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]{2,6}$/);
assert.match(adoptionName, /^[a-z0-9-]+$/);
const full = /^after(?:-[a-z0-9]+)*$/.test(stage);
assert.ok(stage === 'before' || full || /^candidate(?:-[a-z0-9]+)*$/.test(stage));
const base = `${outputRoot}/${set}-symbol`,
  snapshot = await readJson(`${cacheRoot}/rollout/${set}-symbol.json`),
  baseline = await readJson(`${base}/before/capture.json`),
  templates = await readJson(`${base}/templates/capture.json`),
  capture = await readJson(`${base}/${stage}/capture.json`),
  plan = await readJson(`${fixtureRoot}/${set}-symbol-plan.json`),
  configuration = await readJson(`${fixtureRoot}/${set}-symbol-measurement-profile.json`),
  profile = configuration.reference,
  rows = [];
assert.equal(hash(JSON.stringify(snapshot)), plan.snapshotHash);
for (const source of [baseline, templates, capture])
  assert.equal(source.planHash, hash(JSON.stringify(plan)));
if (stage !== 'before') {
  const adoption = await readJson(`${fixtureRoot}/${set}-symbol-${adoptionName}.json`);
  assert.equal(hash(JSON.stringify(configuration)), adoption.measurementProfileHash);
}
async function png(file, sha) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), sha);
  return PNG.sync.read(bytes, { checkCRC: true });
}
const measured = async (file, sha) => measureSymbolBounds(await png(file, sha), profile);
const renderedProfile = configuration.rendered;
for (const e of snapshot.entries.filter((e) =>
  full ? e.cohort !== 'control' : e.cohort === 'calibration',
)) {
  const a = capture.rows.find((r) => r.id === e.id),
    b = baseline.rows.find((r) => r.id === e.id),
    ref = e.reference ? await measured(objectFile(e.reference), e.reference.sha256) : null,
    renders = {},
    template = templates.rows.find((r) => r.id === e.id),
    blank = template
      ? await png(
          `${base}/templates/${template.images.inspect.file}`,
          template.images.inspect.sha256,
        )
      : null;
  for (const [variant, asset] of [['after', a?.images.inspect]])
    renders[variant] =
      blank && asset
        ? measureRenderedSymbol(
            await png(`${base}/${stage}/${asset.file}`, asset.sha256),
            blank,
            renderedProfile,
          )
        : null;
  rows.push({
    id: e.id,
    name: e.card.name,
    cohort: e.cohort,
    referenceHash: e.reference?.sha256 ?? null,
    failure: a?.failure ?? e.issue ?? null,
    reference: ref,
    before:
      blank && b?.images.inspect
        ? measureRenderedSymbol(
            await png(`${base}/before/${b.images.inspect.file}`, b.images.inspect.sha256),
            blank,
            renderedProfile,
          )
        : null,
    renders,
  });
}
const valid = rows.filter((r) => r.reference?.stable),
  dims = (rs) => Array.from({ length: 4 }, (_, j) => median(rs.map((r) => r.rect[j]))),
  summary = {
    cards: rows.length,
    stableReferences: valid.length,
    reference: valid.length ? dims(valid.map((r) => r.reference)) : null,
    variants: Object.fromEntries(
      Object.keys(rows[0].renders).map((key) => {
        const pair = valid.filter((r) => r.renders[key]?.stable);
        return [
          key,
          {
            stablePairs: pair.length,
            rendered: pair.length ? dims(pair.map((r) => r.renders[key])) : null,
            widthError: pair.length
              ? median(pair.map((r) => Math.abs(r.reference.rect[2] - r.renders[key].rect[2])))
              : null,
            heightError: pair.length
              ? median(pair.map((r) => Math.abs(r.reference.rect[3] - r.renders[key].rect[3])))
              : null,
          },
        ];
      }),
    ),
  };
await writeJson(`${fixtureRoot}/${set}-symbol-bounds-${stage}.json`, {
  schemaVersion: 1,
  scope: configuration.scope,
  configurationHash: hash(JSON.stringify(configuration)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  boundsMethodHash: hash(await readFile(new URL('./symbol-bounds.mjs', import.meta.url))),
  segmenterHash: hash(await readFile(new URL('./symbol-component-bounds.mjs', import.meta.url))),
  captureHash: hash(JSON.stringify(capture)),
  baselineHash: hash(JSON.stringify(baseline)),
  profile,
  renderedProfile,
  templateHash: hash(JSON.stringify(templates)),
  summary,
  rows,
});
console.log(JSON.stringify(summary, null, 2));
