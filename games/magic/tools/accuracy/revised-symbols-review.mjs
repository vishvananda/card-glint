import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, readPng, cropGray } from './pixels.mjs';
import { compareRegion } from './metrics.mjs';
import { readJson, writeJson, atomicWrite, fixtureRoot, outputRoot, hash } from './common.mjs';

const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'inline-symbols-plan.json'));
const targets = await readJson(path.join(fixture, 'inline-symbols-targets.json'));
const frozen = await readJson(path.join(fixture, 'inline-symbols-candidate.json'));
const directory = path.join(outputRoot, '3ed');
const base = path.join(directory, plan.sourceRun);
const captureBytes = await readFile(path.join(base, 'capture.json'));
assert.equal(hash(captureBytes), plan.captureHash);
const capture = JSON.parse(captureBytes);
const out = path.join(directory, 'inline-symbols-validation');
const trial = await readJson(path.join(out, 'trial.json'));
assert.equal(trial.experimentHash, frozen.experimentHash);
const results = [],
  articles = [];
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
function cropUrl(image, [x, y, width, height]) {
  const crop = new PNG({ width, height });
  for (let row = 0; row < height; row++)
    crop.data.set(
      image.data.subarray(
        ((y + row) * image.width + x) * 4,
        ((y + row) * image.width + x + width) * 4,
      ),
      row * width * 4,
    );
  return 'data:image/png;base64,' + PNG.sync.write(crop).toString('base64');
}
for (const target of targets.cards) {
  const card = capture.results.find((r) => r.id === target.id);
  assert.equal(card.images.reference.sha256, target.referenceHash);
  const measured = trial.results.find((r) => r.id === target.id);
  let tap;
  for (const line of card.layout.lines) {
    let x = line.x ?? card.layout.x;
    for (const run of line.runs) {
      if (run.symbol && run.text === 'T')
        tap = { x: x + run.size * 0.425, y: line.baseline - run.size * 0.32 };
      x += run.width;
    }
    if (tap) break;
  }
  assert.ok(tap);
  const [tx, ty, width, height] = target.rect;
  const renderRect = [Math.round(tap.x - width / 2), Math.round(tap.y - height / 2), width, height];
  const reference = normalize(await readPng(path.join(base, card.images.reference.file)));
  const a = cropGray(reference, target.rect);
  const scores = [],
    previews = [reference];
  for (const score of measured.scores) {
    assert.equal(hash(await readFile(path.join(out, score.file))), score.sha256);
    const image = normalize(await readPng(path.join(out, score.file)));
    const fixed = cropGray(image, target.rect),
      centered = cropGray(image, renderRect);
    const raw = compareRegion(a.gray, fixed.gray, width, height);
    const shape = compareRegion(a.gray, centered.gray, width, height);
    scores.push({
      candidate: score.candidate,
      tier: score.tier,
      fixedWindowF1: raw.edgeF1[1],
      atMatchedCentersF1: shape.edgeF1[1],
      atMatchedCentersDistance: shape.meanDistance,
    });
    if (score.tier === 'inspect') previews.push(image);
  }
  const offset = [tap.x - tx - width / 2, tap.y - ty - height / 2];
  results.push({ ...target, renderRect, renderedCenterOffset: offset, scores });
  const [before, after] = scores.filter((s) => s.tier === 'inspect');
  articles.push(
    `<article id="card-${card.collectorNumber}"><h2>${escape(card.name)}</h2><p>Rendered disc center relative to the scan window: ${offset.map((n) => n.toFixed(1)).join(', ')}px. Fixed-window F1: ${before.fixedWindowF1.toFixed(3)} → ${after.fixedWindowF1.toFixed(3)}. Shape crop F1: ${before.atMatchedCentersF1.toFixed(3)} → ${after.atMatchedCentersF1.toFixed(3)}.</p>${card.name === 'Royal Assassin' ? '<p class="warning">Review: the diagonal-T identity is correct, but this shape score regresses. Residual position, stroke weight and background extraction still need review; the failed score is retained.</p>' : ''}<div class="triptych">${previews.map((image, i) => `<figure><figcaption>${['Scryfall scan', 'Before this change', 'Diagonal-T candidate'][i]}</figcaption><img class="body" alt="${escape(card.name)} rules" src="${cropUrl(image, [50, 400, 390, 205])}"><img class="glyph" alt="${escape(card.name)} isolated tap" src="${cropUrl(image, i ? renderRect : target.rect)}"></figure>`).join('')}</div></article>`,
  );
}
const numericControl = trial.results.find((r) => r.name === 'Atog');
for (const tier of ['inspect', 'table']) {
  const pair = numericControl.scores.filter((s) => s.tier === tier);
  assert.equal(pair[0].sha256, pair[1].sha256);
}
const report = {
  schemaVersion: 1,
  candidate: frozen.candidate.id,
  experimentHash: trial.experimentHash,
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  rendererHash: trial.rendererHash,
  captureHash: trial.captureHash,
  note: 'Seven reserved taps visually verify the diagonal-T identity; Atog has no tap and its complete PNG is unchanged at both tiers. Fixed-window F1 keeps global alignment. The separately labeled atMatchedCenters crop uses the independent scan window and the known rendered disc center, with no scaling or fitting; it diagnoses shape only, never substitutes for placement scores or changes the renderer. Long-body typography remains inaccurate on several examples.',
  results,
  numericControl,
  visualReview: {
    tapIdentityMatched: 7,
    numericOnlyUnchanged: 1,
    notes: [
      'All seven reserved scans use the diagonal T, including white/blue/black/red/green and artifact bodies.',
      'Royal Assassin remains a shape-score review case: the glyph identity is now correct, but the fixed-center heuristic score decreases. Do not hide or refit this result.',
      'Five colored examples put the rendered tap center about 5.5px left of the independent scan window center. Prodigal Sorcerer, Dwarven Warriors and Aladdin’s Lamp also expose vertical body placement errors; glyph changes do not correct those.',
    ],
  },
};
await writeJson(path.join(fixture, 'inline-symbols-transfer.json'), report);
await atomicWrite(
  path.join(out, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised tap glyph review</title><style>body{margin:0;background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui}main{max-width:1300px;margin:auto;padding:30px}a{color:#b4d6dd}h1{font-size:30px}article{padding:28px 0;border-top:1px solid #52606a}.triptych{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}figure{margin:0}figcaption{margin-bottom:10px}.body{width:100%;display:block}.glyph{width:126px;height:126px;object-fit:contain;image-rendering:pixelated;display:block;margin:16px auto}.warning{color:#ffce93}@media(max-width:700px){.triptych{gap:6px}.glyph{width:90px;height:90px}main{padding:15px}}</style><main><h1>Revised: the diagonal tap mark</h1><p>Seven reserved tap printings, plus one unchanged numeric-only control. Same inputs, fonts and frame assets; no per-scan fitting. Both candidates use the same layout. The tap glyph comes from the existing pinned Mana font.</p><p>Large rules crops retain fixed frame alignment. Small crops compare the scan window with the known rendered disc center to inspect shape separately. Their scores do not measure placement or percent accuracy. All seven glyph identities match; the shape metric improves on six of seven and retains Royal Assassin for review.</p><p>${results.map((r) => `<a href="#card-${capture.results.find((c) => c.id === r.id).collectorNumber}">${escape(r.name)}</a>`).join(' · ')}</p>${articles.join('')}<p>Local fan rendering study. Magic imagery © Wizards of the Coast; cached scans through Scryfall. External assets are excluded from the public showcase.</p></main></html>`,
);
console.log(`Reviewed ${results.length} taps; numeric-only control identical at both tiers.`);
