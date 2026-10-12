import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, cropGray, savePng } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { readJson, writeJson, atomicWrite, outputRoot, fixtureRoot, hash } from './common.mjs';

const plan = await readJson(path.join(fixtureRoot, 'early-printing-field-review.json'));
const base = path.join(outputRoot, 'early-printing-fields');
const reviewed = [],
  captures = [],
  articles = [];
let unchanged = 0,
  checkedImages = 0;
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c],
  );
for (const set of ['lea', '2ed']) {
  const load = async (run) => {
    const bytes = await readFile(path.join(outputRoot, set, run, 'capture.json'));
    return { data: JSON.parse(bytes), hash: hash(bytes) };
  };
  const before = await load(plan.sourceRun),
    after = await load(plan.targetRun);
  assert.ok(before.data.complete && after.data.complete);
  assert.equal(after.data.rendererHash, before.data.rendererHash);
  assert.equal(after.data.results.length, set === 'lea' ? 295 : 302);
  assert.equal(before.data.results.length, after.data.results.length);
  captures.push({
    set,
    beforeHash: before.hash,
    afterHash: after.hash,
    rendererHash: after.data.rendererHash,
  });
  for (const card of after.data.results) {
    const old = before.data.results.find((r) => r.id === card.id);
    const correction = plan.fixes.find((r) => r.set === set && r.id === card.id);
    assert.equal(card.issue, null);
    assert.equal(old.issue, null);
    assert.deepEqual(card.layout, old.layout);
    assert.deepEqual(card.assets, old.assets);
    assert.equal(card.contentStatus, old.contentStatus);
    assert.equal(card.inputHash !== old.inputHash, !!correction, card.name);
    const images = {};
    for (const [run, record] of [
      [plan.sourceRun, old],
      [plan.targetRun, card],
    ]) {
      images[run] = {};
      for (const tier of ['reference', 'inspect', 'table']) {
        const bytes = await readFile(path.join(outputRoot, set, run, record.images[tier].file));
        assert.equal(hash(bytes), record.images[tier].sha256);
        checkedImages++;
        if (correction) images[run][tier] = PNG.sync.read(bytes);
      }
    }
    assert.equal(card.images.reference.sha256, old.images.reference.sha256);
    if (!correction) {
      assert.deepEqual(card.face, old.face);
      for (const tier of ['inspect', 'table'])
        assert.equal(card.images[tier].sha256, old.images[tier].sha256);
      unchanged++;
      continue;
    }
    assert.equal(old.inputHash, correction.beforeInputHash);
    assert.equal(card.images.reference.sha256, correction.referenceHash);
    assert.deepEqual(card.face, { ...old.face, ...correction.fields });
    assert.deepEqual(card.reviewedFields, Object.keys(correction.fields));
    const rect = correction.fields.artist ? [42, 607, 347, 38] : [326, 607, 134, 43];
    const reference = normalize(images[plan.sourceRun].reference);
    const target = cropGray(reference, rect);
    const scores = [];
    for (const tier of ['inspect', 'table']) {
      const a = images[plan.sourceRun][tier],
        b = images[plan.targetRun][tier];
      assert.equal(a.width, b.width);
      assert.equal(a.height, b.height);
      for (let y = 0; y < a.height; y++) {
        if (y >= (600 * a.width) / 488 && y < (664 * a.width) / 488) continue;
        const start = y * a.width * 4,
          end = start + a.width * 4;
        assert.ok(
          a.data.subarray(start, end).equals(b.data.subarray(start, end)),
          `${card.name}: pixels outside the footer changed`,
        );
      }
      const measure = (image) => {
        const crop = cropGray(normalize(image), rect);
        return compareLettering(target.gray, crop.gray, crop.width, crop.height);
      };
      scores.push({ tier, rect, before: measure(a), after: measure(b) });
    }
    const crop = new PNG({ width: 1464, height: 64 });
    for (const [j, im] of [
      reference,
      normalize(images[plan.sourceRun].inspect),
      normalize(images[plan.targetRun].inspect),
    ].entries())
      for (let y = 0; y < 64; y++)
        crop.data.set(
          im.data.subarray((600 + y) * 488 * 4, (601 + y) * 488 * 4),
          (y * 1464 + j * 488) * 4,
        );
    const file = `${set}-${card.collectorNumber}.png`;
    await savePng(path.join(base, file), crop);
    reviewed.push({
      ...correction,
      afterInputHash: card.inputHash,
      contentStatus: card.contentStatus,
      crop: { file, sha256: hash(await readFile(path.join(base, file))) },
      scores,
    });
    articles.push(
      `<article><h2>${escape(set.toUpperCase() + ' ' + card.name)}</h2><p>${escape(JSON.stringify(correction.fields))}</p><div><span>Scan</span><span>Previous input</span><span>Corrected input</span></div><img src="${file}" alt="${escape(card.name)} footer comparison"></article>`,
    );
  }
}
assert.equal(reviewed.length, 6);
assert.equal(unchanged, 591);
await writeJson(path.join(fixtureRoot, 'early-printing-field-measurement.json'), {
  schemaVersion: 1,
  captures,
  corrected: reviewed.length,
  unchanged,
  checkedImages,
  auditSourceHash: hash(await readFile(new URL(import.meta.url))),
  reviewed,
  note: 'Same renderer, assets and rules layout. Six corrected presentation inputs; all other 591 full image pairs match. Source corrections are not renderer improvements. Partial review does not certify body wording.',
});
await atomicWrite(
  path.join(base, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Early printing fields</title><style>body{font:16px/1.5 system-ui;background:#1c2024;color:#e4e8ea;max-width:1464px;margin:30px auto;padding:0 20px}article{border-top:1px solid #52606a;padding:20px 0}article div{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}img{width:100%}</style><h1>Alpha and Unlimited: original printing fields</h1><p>Six scan-reviewed source corrections. Same renderer and geometry; these are not typography gains. All other 591 full card images are identical at both sizes. Body review status is unchanged.</p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(JSON.stringify({ corrected: reviewed.length, unchanged, checkedImages }));
