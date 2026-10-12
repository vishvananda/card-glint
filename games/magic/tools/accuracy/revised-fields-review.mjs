import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { readJson, writeJson, atomicWrite, outputRoot, fixtureRoot, hash } from './common.mjs';

const fixture = path.join(fixtureRoot, '3ed'),
  base = path.join(outputRoot, '3ed');
const plan = await readJson(path.join(fixture, 'printing-fields-plan.json'));
const beforeBytes = await readFile(path.join(base, plan.baselineRun, 'capture.json'));
assert.equal(hash(beforeBytes), plan.baselineCaptureHash);
const before = JSON.parse(beforeBytes),
  after = await readJson(path.join(base, 'revised-fields/capture.json'));
assert.equal(before.rendererHash, plan.baselineRendererHash);
assert.equal(after.rendererHash, before.rendererHash);
assert.equal(after.complete, true);
assert.equal(after.results.length, 306);
const alignment = await readJson(path.join(fixture, 'alignment.json'));
assert.deepEqual(alignment.frameFamilies['retro-fourth'].transform, {
  tx: 0,
  ty: 0,
  scale: 1,
  rotation: 0,
});
let unchanged = 0;
const reviewed = [],
  articles = [];
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
for (const card of after.results) {
  const old = before.results.find((r) => r.id === card.id),
    correction = plan.reviewed.find((r) => r.id === card.id);
  assert.equal(card.issue, null);
  assert.deepEqual(card.layout, old.layout);
  assert.equal(card.contentStatus, old.contentStatus, 'Partial review must not certify the rules');
  assert.equal(card.inputHash !== old.inputHash, !!correction, card.name);
  const decoded = {};
  for (const [run, record] of [
    [plan.baselineRun, old],
    ['revised-fields', card],
  ]) {
    decoded[run] = {};
    for (const tier of ['reference', 'inspect', 'table']) {
      const bytes = await readFile(path.join(base, run, record.images[tier].file));
      assert.equal(hash(bytes), record.images[tier].sha256);
      if (correction) decoded[run][tier] = PNG.sync.read(bytes);
    }
  }
  if (!correction) {
    for (const tier of ['reference', 'inspect', 'table'])
      assert.equal(card.images[tier].sha256, old.images[tier].sha256);
    unchanged++;
    continue;
  }
  assert.equal(old.inputHash, correction.previousInputHash);
  assert.equal(card.images.reference.sha256, correction.referenceHash);
  assert.deepEqual(card.reviewedFields, Object.keys(correction.fields));
  for (const [field, value] of Object.entries(correction.fields))
    assert.deepEqual(card.face[field], value);
  const expected = { ...old.face, ...correction.fields };
  if (correction.fields.typeLine !== undefined)
    expected.creature = /\bCreature\b/.test(old.face.typeLine);
  assert.deepEqual(card.face, expected);
  const windows = [
    ...(correction.fields.typeLine
      ? [{ id: 'type', rect: [35, 368, 405, 40], crop: [0, 360, 488, 60] }]
      : []),
    ...(correction.fields.manaSymbols
      ? [{ id: 'mana', rect: [360, 20, 105, 50], crop: [0, 15, 488, 70] }]
      : []),
    ...(correction.fields.power !== undefined
      ? [{ id: 'stats', rect: [326, 607, 134, 43], crop: [0, 600, 488, 64] }]
      : []),
  ];
  const ref = normalize(decoded[plan.baselineRun].reference);
  const scores = [];
  for (const tier of ['inspect', 'table']) {
    const a = decoded[plan.baselineRun][tier],
      b = decoded['revised-fields'][tier],
      scale = tier === 'inspect' ? 1.5 : 0.5;
    for (let y = 0; y < a.height; y++)
      for (let x = 0; x < a.width; x++) {
        const i = (y * a.width + x) * 4;
        if (a.data.subarray(i, i + 4).equals(b.data.subarray(i, i + 4))) continue;
        assert.ok(
          windows.some(
            ({ crop: [left, top, width, height] }) =>
              x >= left * scale &&
              x < (left + width) * scale &&
              y >= top * scale &&
              y < (top + height) * scale,
          ),
          `Changed unrelated pixels: ${card.name}`,
        );
      }
    const normA = normalize(a),
      normB = normalize(b);
    scores.push({
      tier,
      regions: windows.map(({ id, rect }) => {
        const t = cropGray(ref, rect),
          u = cropGray(normA, rect),
          v = cropGray(normB, rect);
        return {
          id,
          rect,
          before: compareLettering(t.gray, u.gray, t.width, t.height),
          after: compareLettering(t.gray, v.gray, t.width, t.height),
        };
      }),
    });
  }
  const images = [];
  for (const im of [
    ref,
    normalize(decoded[plan.baselineRun].inspect),
    normalize(decoded['revised-fields'].inspect),
  ]) {
    const crop = new PNG({ width: 488, height: windows.reduce((n, w) => n + w.crop[3], 0) });
    let offset = 0;
    for (const {
      crop: [, top, width, height],
    } of windows) {
      for (let y = 0; y < height; y++)
        crop.data.set(
          im.data.subarray((top + y) * 488 * 4, (top + y + 1) * 488 * 4),
          (offset + y) * width * 4,
        );
      offset += height;
    }
    images.push('data:image/png;base64,' + PNG.sync.write(crop).toString('base64'));
  }
  articles.push(
    `<article id="card-${card.collectorNumber}"><h2>${escape(card.name)}</h2><p>${escape(JSON.stringify(correction.fields))}</p><div>${images.map((src, i) => `<figure><figcaption>${['Scan', 'Previous input', 'Corrected input'][i]}</figcaption><img src="${src}" alt="${escape(card.name)}"></figure>`).join('')}</div></article>`,
  );
  reviewed.push({
    ...correction,
    inputHash: card.inputHash,
    contentStatus: card.contentStatus,
    scores,
  });
}
assert.equal(reviewed.length, 8);
assert.equal(unchanged, 298);
await writeJson(path.join(fixture, 'printing-fields-measurement.json'), {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  alignmentHash: hash(JSON.stringify(alignment)),
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  corrected: reviewed.length,
  unchanged,
  checkedImages: 1836,
  reviewed,
  note: 'Same renderer, assets, alignment and rules layout. Eight corrected presentation inputs; all other 298 full image pairs match. Source-only gains are not attributed to the painter. Partial reviews preserve existing body confidence.',
});
await atomicWrite(
  path.join(base, 'revised-fields/index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised printing fields</title><style>body{font:16px/1.5 system-ui;background:#1c2024;color:#e4e8ea;max-width:1464px;margin:30px auto;padding:0 20px}article{border-top:1px solid #52606a;padding:20px 0}article div{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}figure{margin:0}img{width:100%}a{color:#b4d6dd}</style><h1>Revised: original printing fields</h1><p>Eight scan-reviewed input corrections. Same renderer and geometry on both sides; these changes are not counted as renderer improvements. Body layout and body review status stay unchanged. The other 298 cards retain identical full PNGs at both sizes.</p><p>Type placement, ink treatment and exact glyph shapes still need fitting after this source correction.</p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(
  JSON.stringify(
    {
      corrected: reviewed.length,
      unchanged,
      reviewed: reviewed.map((c) => ({ name: c.name, scores: c.scores })),
    },
    null,
    2,
  ),
);
