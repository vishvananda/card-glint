import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import {
  readJson,
  writeJson,
  atomicWrite,
  root,
  fixtureRoot,
  cacheRoot,
  outputRoot,
  hash,
  sourceHash,
} from './common.mjs';
import { readPng, normalize, cropGray, savePng } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { compareRegion } from './metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';

const phase = process.argv[2];
const study = process.argv[3] ?? 'printing-style';
assert.match(study, /^[a-z][a-z0-9-]*$/);
assert.ok(['before', 'after', 'report'].includes(phase));
const planBytes = await readFile(path.join(fixtureRoot, study + '-plan.json'));
const plan = JSON.parse(planBytes);
const out = path.join(outputRoot, study);
if (phase !== 'report') {
  const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
  if (phase === 'before') assert.equal(rendererHash, plan.baselineRendererHash);
  const results = [];
  for (const set of new Set(plan.cards.map((c) => c.set))) {
    const snapshot = await readJson(path.join(cacheRoot, 'sets', set + '.json'));
    const session = await openBrowser(snapshot);
    try {
      for (const card of plan.cards.filter((c) => c.set === set)) {
        assert.equal(hash(JSON.stringify(card.face)), card.inputHash);
        const entry = snapshot.entries.find((c) => c.id === card.id);
        assert.equal(entry.reference.sha256, card.referenceHash);
        const captures = await session.page.evaluate(async (face) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const images = {};
          let layout = null;
          for (const tier of ['inspect', 'table']) {
            const canvas = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              tier,
              new AbortController().signal,
              {
                loadImages: async (urls, signal) => {
                  const loaded = await loadCanvasImages(urls, signal);
                  const missing = urls.filter((u) => u && !loaded.images.has(u));
                  if (missing.length) {
                    loaded.dispose();
                    throw Error('Missing assets: ' + missing.join(', '));
                  }
                  return loaded;
                },
              },
            );
            images[tier] = canvas.toDataURL('image/png');
            if (tier === 'inspect') {
              const { retroTextLayout } = await import(
                '/games/magic/src/presentation/retro-rules.ts'
              );
              layout = retroTextLayout(canvas.getContext('2d'), face);
            }
            canvas.width = canvas.height = 0;
          }
          if ([...document.fonts].some((f) => f.status === 'error')) throw Error('Font failed');
          return { images, layout };
        }, card.face);
        const images = {};
        for (const [tier, data] of Object.entries(captures.images)) {
          const bytes = Buffer.from(data.split(',')[1], 'base64');
          const file = `${phase}/${set}-${card.number}.${tier}.png`;
          await atomicWrite(path.join(out, file), bytes);
          images[tier] = { file, sha256: hash(bytes) };
        }
        results.push({ ...card, images, layout: captures.layout });
      }
      assert.deepEqual(session.faults, []);
    } finally {
      await session.close();
    }
  }
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
  await writeJson(path.join(out, phase + '.json'), {
    source: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    sourceDiffHash: hash(execFileSync('git', ['diff', '--', 'games/magic/src'], { cwd: root })),
    planHash: hash(planBytes),
    rendererHash,
    results,
  });
  console.log(`Captured ${results.length} cards at both tiers (${phase}).`);
} else {
  const before = await readJson(path.join(out, 'before.json'));
  const after = await readJson(path.join(out, 'after.json'));
  assert.equal(before.planHash, hash(planBytes));
  assert.equal(after.planHash, hash(planBytes));
  const rows = [];
  for (const card of after.results) {
    const old = before.results.find((c) => c.id === card.id);
    assert.deepEqual(card.face, old.face);
    const snapshot = await readJson(path.join(cacheRoot, 'sets', card.set + '.json'));
    const entry = snapshot.entries.find((c) => c.id === card.id);
    const refBytes = await readFile(path.join(cacheRoot, 'objects', entry.reference.sha256));
    assert.equal(hash(refBytes), card.referenceHash);
    const reference = normalize(PNG.sync.read(refBytes), plan.alignment);
    for (const region of card.regions) {
      const images = { reference };
      const r = cropGray(reference, region.rect);
      const scores = {};
      for (const tier of ['inspect', 'table']) {
        scores[tier] = {};
        for (const [side, input] of [
          ['before', old],
          ['after', card],
        ]) {
          const bytes = await readFile(path.join(out, input.images[tier].file));
          assert.equal(hash(bytes), input.images[tier].sha256);
          const image = normalize(PNG.sync.read(bytes));
          if (tier === 'inspect') images[side] = image;
          const p = cropGray(image, region.rect);
          scores[tier][side] = {
            ...(['mana', 'body'].includes(region.id)
              ? { edgeF1: compareRegion(r.gray, p.gray, r.width, r.height).edgeF1[1] }
              : compareLettering(r.gray, p.gray, r.width, r.height)),
            contrast: letteringContrast(r.gray, p.gray, r.width, r.height),
          };
        }
      }
      const [x, y, w, h] = region.rect;
      const crop = new PNG({ width: w * 3, height: h });
      for (const [i, image] of Object.values(images).entries())
        for (let yy = 0; yy < h; yy++)
          for (let xx = 0; xx < w; xx++) {
            const src = ((y + yy) * image.width + x + xx) * 4;
            crop.data.set(image.data.subarray(src, src + 4), (yy * crop.width + i * w + xx) * 4);
          }
      const file = `${card.set}-${card.number}-${region.id}.png`;
      await savePng(path.join(out, file), crop);
      rows.push({
        set: card.set,
        id: card.id,
        name: card.name,
        number: card.number,
        cohort: card.cohort,
        region,
        referenceHash: card.referenceHash,
        inputHash: card.inputHash,
        scores,
        ...(region.id === 'body' ? { beforeLayout: old.layout, afterLayout: card.layout } : {}),
        crop: { file, sha256: hash(await readFile(path.join(out, file))) },
      });
    }
  }
  const report = {
    schemaVersion: 1,
    planHash: hash(planBytes),
    beforeRendererHash: before.rendererHash,
    afterRendererHash: after.rendererHash,
    rows,
    note: 'Fixed identity alignment. Reserved diagnostic sample, not whole-set accuracy or a fresh holdout after visual review. Edge F1 includes frame texture and does not certify interior fill; signed contrast is also texture-sensitive. Node-only measurement after Chromium raster capture.',
  };
  await writeJson(path.join(fixtureRoot, study + '-measurement.json'), report);
  await atomicWrite(
    path.join(out, 'index.html'),
    `<!doctype html><meta charset="utf-8"><title>${study} comparison</title><style>body{font:16px system-ui;background:#182128;color:#eee;margin:30px}img{width:min(100%,1500px);image-rendering:auto}article{margin:30px 0}p{max-width:1000px}a{color:#aaf}</style><h1>${study} comparison</h1><p>Each strip: scan · previous branch · corrected branch. Shared geometry; no scan-specific fitting. <a href="../main-review/">Full cards against main</a></p>${rows.map((r) => `<article><h2>${r.name} (${r.set.toUpperCase()}) — ${r.region.id}</h2><p>${r.cohort}; inspect edge F1 ${r.scores.inspect.before.edgeF1.toFixed(3)} → ${r.scores.inspect.after.edgeF1.toFixed(3)}, signed contrast ${r.scores.inspect.before.contrast?.toFixed(3)} → ${r.scores.inspect.after.contrast?.toFixed(3)}</p><img src="${r.crop.file}"></article>`).join('')}`,
  );
  console.log(
    JSON.stringify(
      rows.map((r) => ({
        card: r.set + ' ' + r.name,
        region: r.region.id,
        before: r.scores.inspect.before.edgeF1,
        after: r.scores.inspect.after.edgeF1,
      })),
      null,
      2,
    ),
  );
}
