import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, readJson, writeJson, hash } from './common.mjs';
import { normalize } from './pixels.mjs';
import { measurePlate, plateDifference, PLATE_GEOMETRY_VERSION } from './plate-geometry.mjs';
import { median } from './metrics.mjs';

const [set, planName = 'set-symbol-topology-all-plan'] = process.argv.slice(2);
assert.match(set ?? '', /^[a-z0-9]+$/);
assert.match(planName, /^[a-z0-9-]+$/);
const planBytes = await readFile(`${fixtureRoot}/${planName}.json`),
  plan = JSON.parse(planBytes),
  run = typeof plan.run === 'string' ? plan.run : plan.run[set],
  directory = `${outputRoot}/${set}/${run}`,
  captureBytes = await readFile(`${directory}/capture.json`),
  capture = JSON.parse(captureBytes),
  symbolBytes = await readFile(
    `${fixtureRoot}/${planName.replace(/-plan$/, '')}-${set}-measurement.json`,
  ),
  symbols = JSON.parse(symbolBytes);
assert.equal(capture.rendererHash, plan.rendererHashes.after);
assert.equal(capture.snapshotIdentity, plan.sets[set].snapshotIdentity);
assert.equal(symbols.planHash, hash(planBytes));
assert.equal(symbols.captures.after.hash, hash(captureBytes));
const symbolById = new Map(symbols.rows.map((r) => [r.id, r]));
// Fixed straight-edge windows, independent of the symbol crop. Tried first on
// the twenty previously examined WAR rim-reservation cards, then frozen for
// this corpus diagnostic. No landmark is used to move or register an image.
const windows = {
  type: {
    top: [381, 395],
    bottom: [409, 423],
    spans: [
      [95, 70],
      [220, 70],
      [325, 60],
    ],
    inkX: [60, 360],
  },
  title: {
    top: [29, 43],
    bottom: [57, 73],
    spans: [
      [95, 70],
      [220, 70],
      [315, 45],
    ],
    inkX: [60, 350],
  },
};
async function raster(asset) {
  const bytes = await readFile(`${directory}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes, { checkCRC: true }));
}
const rows = [],
  started = performance.now();
for (const card of capture.results) {
  if (card.issue || card.frame !== 'normal') continue;
  const reference = await raster(card.images.reference),
    rendered = await raster(card.images.inspect),
    measurements = {};
  for (const [name, policy] of Object.entries(windows)) {
    // The crown changes the upper outline; it is not the flat normal title cap.
    if (name === 'title' && /Legendary/.test(card.face.typeLine)) {
      measurements[name] = { status: 'excluded-legendary-crown' };
      continue;
    }
    const a = measurePlate(reference, policy),
      b = measurePlate(rendered, policy);
    measurements[name] = { reference: a, rendered: b, difference: plateDifference(a, b) };
  }
  const symbol = symbolById.get(card.id);
  assert.ok(symbol?.scores?.inspect);
  const offset = symbol.scores.inspect.after.offset,
    plate = measurements.type.difference,
    title = measurements.title.difference,
    reliableOffset =
      ['close', 'placement'].includes(offset.status) && offset.objectiveDisagreementPx <= 1.5;
  rows.push({
    id: card.id,
    number: card.collectorNumber,
    name: card.name,
    category: card.category,
    colors: card.face.colors,
    rarity: card.face.rarity,
    referenceHash: card.images.reference.sha256,
    renderedHash: card.images.inspect.sha256,
    measurements,
    symbol: symbol.scores.inspect.after,
    // Positive means the rendered plate is too low. The diagnostic symbol
    // move has the opposite sign; their sum removes a shared plate translation
    // algebraically, without resampling either image or replacing its raw score.
    symbolMoveRelativeToType:
      plate.status === 'measured' && reliableOffset ? offset.dy + plate.center : null,
    titleMinusTypeCenter:
      plate.status === 'measured' && title?.status === 'measured'
        ? title.center - plate.center
        : null,
  });
  if (rows.length % 50 === 0) console.log(`${set}: independent plate landmarks ${rows.length}`);
}
const material = (r) =>
    r.colors.length === 1 ? r.colors[0] : r.colors.length ? 'multicolor' : 'colorless',
  summary = {};
const med = (values) => {
  const usable = values.filter(Number.isFinite);
  return usable.length ? median(usable) : null;
};
for (const group of ['all', 'W', 'U', 'B', 'R', 'G', 'multicolor', 'colorless']) {
  const cards = rows.filter((r) => group === 'all' || material(r) === group),
    type = cards.map((r) => r.measurements.type.difference).filter((d) => d.status === 'measured'),
    title = cards
      .map((r) => r.measurements.title.difference)
      .filter((d) => d?.status === 'measured');
  summary[group] = {
    cards: cards.length,
    reliableType: type.length,
    reliableTitle: title.length,
    type: Object.fromEntries(
      ['top', 'bottom', 'center', 'height'].map((key) => [key, med(type.map((d) => d[key]))]),
    ),
    titleCenter: med(title.map((d) => d.center)),
    symbolMoveRelativeToType: med(cards.map((r) => r.symbolMoveRelativeToType)),
    titleMinusTypeCenter: med(cards.map((r) => r.titleMinusTypeCenter)),
  };
}
await writeJson(`${fixtureRoot}/normal-plate-symbol-${set}-measurement.json`, {
  schemaVersion: 1,
  set,
  scope:
    'Exploratory independent normal-frame plate landmarks, inspect tier only. Fixed normalization and windows; no per-scan fitting or renderer correction. Differences alone do not distinguish scan registration from frame geometry. Uncertain strips and crowned titles remain excluded from aggregate plate statistics.',
  planHash: hash(planBytes),
  captureHash: hash(captureBytes),
  symbolReportHash: hash(symbolBytes),
  studyHash: hash(await readFile(new URL(import.meta.url))),
  detectorVersion: PLATE_GEOMETRY_VERSION,
  methods: Object.fromEntries(
    await Promise.all(
      ['plate-geometry', 'pixels', 'edges', 'metrics'].map(async (name) => [
        name,
        hash(await readFile(new URL(`./${name}.mjs`, import.meta.url))),
      ]),
    ),
  ),
  windows,
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - started,
    scope:
      'CPU PNG decoding, fixed normalization, signed plate transitions; no Chromium or GPU work.',
  },
});
console.log(JSON.stringify({ set, summary }, null, 2));
