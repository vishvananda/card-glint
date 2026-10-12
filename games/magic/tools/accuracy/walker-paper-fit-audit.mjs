import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion } from './metrics.mjs';

const planName = 'planeswalker-paper-final-plan.json',
  run = 'walker-paper-final';
const bytes = await readFile(`${fixtureRoot}/${planName}`),
  plan = JSON.parse(bytes);
const captures = {},
  rows = [];
const started = performance.now();
async function capture(set, name) {
  const key = `${set}/${name}`;
  if (!captures[key]) {
    const bytes = await readFile(`${outputRoot}/${key}/capture.json`);
    captures[key] = { hash: hash(bytes), data: JSON.parse(bytes) };
  }
  return captures[key].data;
}
async function raster(set, name, asset) {
  const bytes = await readFile(`${outputRoot}/${set}/${name}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes, { checkCRC: true }));
}
function bounds(rows) {
  const blocks = rows.map((row) => {
    const ink = row.layout.lines.map((line) => line.inkBounds);
    return {
      top: Math.min(...ink.map((b) => b[1])),
      bottom: Math.max(...ink.map((b) => b[1] + b[3])),
      font: row.font,
      lines: ink.length,
    };
  });
  return {
    blocks,
    top: Math.min(...blocks.map((b) => b.top)),
    bottom: Math.max(...blocks.map((b) => b.bottom)),
    minimumGap:
      blocks.length > 1
        ? Math.min(...blocks.slice(1).map((b, i) => b.top - blocks[i].bottom))
        : null,
  };
}
function bodyScore(reference, render, rect) {
  const a = cropGray(reference, rect),
    b = cropGray(render, rect),
    m = compareRegion(a.gray, b.gray, a.width, a.height);
  return { status: m.status, edgeF1: m.edgeF1?.[1] ?? null, p95: m.p95Distance ?? null };
}
for (const card of plan.cards) {
  const a = await capture(card.set, card.baseline),
    b = await capture(card.set, run);
  assert.equal(b.rendererHash, plan.frozenRendererHash);
  const before = a.results.find((r) => r.id === card.id),
    after = b.results.find((r) => r.id === card.id);
  assert.ok(before && after && !before.issue && !after.issue);
  assert.equal(before.inputHash, card.inputHash);
  assert.equal(after.inputHash, card.inputHash);
  assert.equal(after.images.reference.sha256, card.referenceHash);
  const anchors = (r) =>
    r.specialLayout.map(({ text, runs, top, height, font, badges, left }) => ({
      text,
      runs,
      top,
      height,
      badges,
      left,
    }));
  assert.deepEqual(anchors(before), anchors(after));
  const geometry = { before: bounds(before.specialLayout), after: bounds(after.specialLayout) };
  assert.ok(!after.specialLayout.some((r) => r.layout.overflow));
  assert.ok(geometry.after.top >= (card.frame === 'planeswalker-large' ? 388 : 435) - 0.01);
  assert.ok(geometry.after.bottom <= 618, 'Text crosses the visible paper');
  assert.ok(geometry.after.minimumGap === null || geometry.after.minimumGap >= 7.99);
  const reference = await raster(card.set, run, after.images.reference),
    scores = {},
    identical = {};
  for (const tier of ['inspect', 'table']) {
    identical[tier] = before.images[tier].sha256 === after.images[tier].sha256;
    const rect = plan.regions.body[card.frame];
    scores[tier] = {
      before: bodyScore(
        reference,
        await raster(card.set, card.baseline, before.images[tier]),
        rect,
      ),
      after: bodyScore(reference, await raster(card.set, run, after.images[tier]), rect),
    };
  }
  rows.push({ ...card, geometry, scores, identical });
}
const changed = rows.filter((r) => !r.identical.inspect || !r.identical.table);
const report = {
  schemaVersion: 1,
  planName,
  planHash: hash(bytes),
  run,
  studyHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    '80 previously examined cards, including M19 after its separate lower-frame validation. Same printing inputs and loyalty anchors; this is a glyph-bound safety correction and confirmation, not fresh typography validation.',
  limitations: [
    'Paper limits and eight-pixel gaps do not certify loyalty-silhouette clearance, printed line wrapping, font match or badge placement.',
    'Regional edge scores are raw and conditional on unverified printing text, not percent accuracy.',
  ],
  captures: Object.fromEntries(
    Object.entries(captures).map(([k, v]) => [
      k,
      { hash: v.hash, rendererHash: v.data.rendererHash },
    ]),
  ),
  summary: {
    cards: rows.length,
    changedCards: changed.length,
    unchangedCards: rows.length - changed.length,
    fontChanged: rows.filter(
      (r) =>
        JSON.stringify(r.geometry.before.blocks.map((b) => b.font)) !==
        JSON.stringify(r.geometry.after.blocks.map((b) => b.font)),
    ).length,
    maximumInkBottom: Math.max(...rows.map((r) => r.geometry.after.bottom)),
    minimumInterAbilityGap: Math.min(
      ...rows.flatMap((r) =>
        r.geometry.after.minimumGap === null ? [] : [r.geometry.after.minimumGap],
      ),
    ),
  },
  rows,
  timing: {
    milliseconds: performance.now() - started,
    scope: 'CPU cached PNG comparison and captured glyph bounds; no Chromium or GPU work.',
  },
};
await writeJson(`${fixtureRoot}/walker-paper-final-measurement.json`, report);
console.log(JSON.stringify(report.summary));
console.log(
  changed.map((r) => ({
    set: r.set,
    number: r.number,
    name: r.name,
    before: r.geometry.before.bottom,
    after: r.geometry.after.bottom,
    font: r.geometry.after.blocks.map((b) => b.font),
  })),
);
