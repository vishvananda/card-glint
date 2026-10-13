import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  readJson,
  writeJson,
  root,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  hash,
  sourceHash,
  atomicWrite,
  objectFile,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';
const action = process.argv[2] ?? 'capture';
assert.ok(['capture', 'score'].includes(action));
const base = `${outputRoot}/ice-symbol-oracle`,
  snapshot = await readJson(`${cacheRoot}/rollout/ice-symbol.json`),
  plan = await readJson(`${fixtureRoot}/ice-symbol-oracle-plan.json`),
  templates = await readJson(`${base}/templates/capture.json`),
  search = await readJson(`${fixtureRoot}/ice-symbol-candidate.json`),
  rect = search.rect,
  configurations = [
    ['original-half-rim', 'ice', 0.5],
    ['fine-white-plate', 'plate', 0.5],
    ['fine-no-rim', 'plate', 0],
    ['fine-star', 'star', 0.5],
  ].map(([name, variant, outline]) => {
    const r = search.results.find((r) => r.variant === variant && r.outline === outline);
    assert.ok(r && !r.boundary);
    return {
      name,
      stencil: variant === 'ice' ? 'ice' : 'ice2',
      backing: ['plate', 'star'].includes(variant) ? variant : null,
      outline,
      crop: r.crop,
      geometry: Object.fromEntries(
        ['right', 'centerY', 'width', 'height'].map((k) => [k, r.selected[k]]),
      ),
    };
  });
assert.equal(templates.planHash, hash(JSON.stringify(plan)));
if (action === 'capture') {
  const rendererHash = await sourceHash(`${root}/games/magic/src`),
    session = await openBrowser(snapshot),
    rows = [];
  assert.equal(rendererHash, templates.rendererHash);
  try {
    for (const e of templates.rows) {
      for (const a of [...Object.values(e.images), ...Object.values(templates.stencils)])
        assert.equal(hash(await readFile(`${base}/templates/${a.file}`)), a.sha256);
      const images = await session.page.evaluate(
        async ({ entry, stencils, configurations }) => {
          const { paintOutlinedRetroSet } = await import(
              '/games/magic/src/presentation/retro-details.ts'
            ),
            prefix = '/test-results/magic-accuracy/ice-symbol-oracle/templates/',
            loaded = {},
            results = [];
          const load = async (name) =>
            loaded[name] ??
            (loaded[name] = await createImageBitmap(await (await fetch(prefix + name)).blob()));
          try {
            for (const tier of ['inspect', 'table']) {
              const bg = await load(entry.images[tier].file);
              for (const config of configurations) {
                const stencil = await load(stencils[config.stencil].file),
                  backing = config.backing ? await load(stencils[config.backing].file) : null,
                  c = document.createElement('canvas');
                c.width = bg.width;
                c.height = bg.height;
                const ctx = c.getContext('2d');
                ctx.drawImage(bg, 0, 0);
                ctx.setTransform(bg.width / 488, 0, 0, bg.height / 680, 0, 0);
                const { right, centerY, width, height } = config.geometry,
                  [sx, sy, sw, sh] = config.crop;
                if (backing)
                  ctx.drawImage(
                    backing,
                    sx * backing.width,
                    sy * backing.height,
                    sw * backing.width,
                    sh * backing.height,
                    right - width,
                    centerY - height / 2,
                    width,
                    height,
                  );
                paintOutlinedRetroSet(
                  ctx,
                  stencil,
                  right - width,
                  centerY - height / 2,
                  width,
                  height,
                  config.outline,
                  config.crop,
                );
                results.push({ variant: config.name, tier, data: c.toDataURL() });
                c.width = c.height = 0;
              }
            }
            return results;
          } finally {
            for (const b of Object.values(loaded)) b.close();
          }
        },
        { entry: e, stencils: templates.stencils, configurations },
      );
      const variants = {};
      for (const i of images) {
        const bytes = Buffer.from(i.data.split(',')[1], 'base64'),
          file = `${e.id}.${i.variant}.${i.tier}.png`;
        await atomicWrite(`${base}/variants/${file}`, bytes);
        (variants[i.variant] ??= {})[i.tier] = { file, sha256: hash(bytes) };
      }
      rows.push({ id: e.id, name: e.name, variants });
      console.log('variants', e.name);
    }
    assert.deepEqual(session.faults, []);
    assert.equal(rendererHash, await sourceHash(`${root}/games/magic/src`));
    await writeJson(`${base}/variants/capture.json`, {
      schemaVersion: 1,
      rendererHash,
      planHash: hash(JSON.stringify(plan)),
      templateHash: hash(JSON.stringify(templates)),
      searchHash: hash(JSON.stringify(search)),
      methodHash: hash(await readFile(new URL(import.meta.url))),
      configurations,
      rows,
    });
  } finally {
    await session.close();
  }
} else {
  const capture = await readJson(`${base}/variants/capture.json`),
    baseline = await readJson(`${base}/before/capture.json`),
    rows = [];
  assert.equal(capture.planHash, baseline.planHash);
  assert.equal(capture.planHash, hash(JSON.stringify(plan)));
  assert.equal(capture.templateHash, hash(JSON.stringify(templates)));
  assert.equal(capture.searchHash, hash(JSON.stringify(search)));
  assert.equal(capture.rendererHash, baseline.rendererHash);
  assert.equal(baseline.rendererHash, plan.baselineRendererHash);
  for (const e of capture.rows) {
    const b = baseline.rows.find((r) => r.id === e.id),
      scores = {},
      ref = await cachedGrayRegion(objectFile({ sha256: b.referenceHash }), b.referenceHash, rect);
    for (const tier of ['inspect', 'table']) {
      const old = b.images[tier],
        before = await cachedGrayRegion(`${base}/before/${old.file}`, old.sha256, rect);
      scores[tier] = {
        before: compareLettering(ref.gray, before.gray, rect[2], rect[3]),
        variants: {},
      };
      for (const config of configurations) {
        const a = e.variants[config.name][tier],
          crop = await cachedGrayRegion(`${base}/variants/${a.file}`, a.sha256, rect);
        scores[tier].variants[config.name] = compareLettering(
          ref.gray,
          crop.gray,
          rect[2],
          rect[3],
        );
      }
    }
    rows.push({ id: e.id, name: e.name, referenceHash: b.referenceHash, scores });
  }
  const summary = configurations.map((c) => ({
    variant: c.name,
    tiers: Object.fromEntries(
      ['inspect', 'table'].map((tier) => [
        tier,
        {
          edgeF1: median(rows.map((r) => r.scores[tier].variants[c.name].edgeF1)),
          census: median(rows.map((r) => r.scores[tier].variants[c.name].censusSimilarity)),
          beforeEdgeF1: median(rows.map((r) => r.scores[tier].before.edgeF1)),
          regressed: rows
            .filter(
              (r) => r.scores[tier].variants[c.name].edgeF1 < r.scores[tier].before.edgeF1 - 0.02,
            )
            .map((r) => r.id),
        },
      ]),
    ),
  }));
  await writeJson(`${fixtureRoot}/ice-symbol-variant-measurement.json`, {
    schemaVersion: 1,
    scope:
      'Four calibration-only candidates using actual Canvas symbol painting on matched blank faces at both tiers. Same frozen eleven identities, explicit Oracle baseline, original symbols. Existing stencil/backing contours and prior bounded CPU candidates only; no per-scan transform. These composite candidates rank material/shape alternatives; adoption still requires complete production captures and full-set validation.',
    rendererHash: capture.rendererHash,
    planHash: capture.planHash,
    captureHash: hash(JSON.stringify(capture)),
    baselineHash: hash(JSON.stringify(baseline)),
    methodHash: hash(await readFile(new URL(import.meta.url))),
    rect,
    configurations,
    summary,
    rows,
  });
  console.log(JSON.stringify(summary, null, 2));
}
