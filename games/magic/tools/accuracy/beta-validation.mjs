/** Independent LEB calibration experiment. Art/captures stay in ignored test-results.
 * This deliberately does not register an incompatible consolidated profile. */
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, access } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, atomicWrite, hash, objectFile, sourceHash, root } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import { SCAN_ANCHOR_METHOD_HASH, SCAN_FIT_METHOD_HASH } from './scan-frame-cache.mjs';
import { median, quantile, compareRegion } from './metrics.mjs';
import {
  prepareLetteringEdges,
  scoreLetteringEdges,
  compareLettering,
} from './lettering-metrics.mjs';
import { titleShape, compareTitleShape } from './letter-fill-metrics.mjs';
import { searchCalibration } from './calibration-search.mjs';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { validateCalibrationStudy } from './calibration-evidence.mjs';

const [phase, directory, historicalFile] = process.argv.slice(2);
assert.ok(['freeze', 'normalize', 'capture', 'fit', 'replay', 'report'].includes(phase));
assert.ok(directory);
const file = (name) => path.join(directory, name);
const png = async (asset) => {
  const bytes = await readFile(objectFile(asset));
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes));
};
const studyFile = file('study.json');
const metric = (reference, candidate, w, h) => ({
  ...compareLettering(reference, candidate, w, h),
  ...compareTitleShape(titleShape(reference, w, h), titleShape(candidate, w, h)),
});
const objective = (scores) =>
  scores.reduce((s, v) => s + (v.edgeF1 + v.filledArea) / 2, 0) / scores.length;
if (phase === 'freeze') {
  await assert.rejects(access(file('study-draft.json')));
  assert.ok(historicalFile, 'Pass the historical inputs.json for cohort provenance');
  const bytes = await readFile(historicalFile),
    historical = JSON.parse(bytes);
  const study = await readJson(file('draft.json'));
  const prior = historical.entries.filter((e) => e.card.set === 'leb');
  assert.equal(prior.length, study.entries.length);
  const calibrationIdentities = new Set(
    prior.filter((e) => e.cohort === 'calibration').map((e) => e.card.oracle_id ?? e.card.name),
  );
  const observations = [];
  for (const e of study.entries) {
    const old = prior.find((r) => r.id === e.id);
    assert.equal(old.reference.sha256, e.reference.sha256);
    assert.equal(old.art.sha256, e.art.sha256);
    e.cohort = calibrationIdentities.has(e.card.oracle_id ?? e.card.name)
      ? 'calibration'
      : 'validation';
    e.material = old.material;
    // Preserve the released adapter's original rules. Unverified visible fields
    // remain explicit: these diagnostic captures do not certify whole-card wording.
    e.wordingEvidence.name = 'printing-metadata-unreviewed';
    const right = Math.max(120, Math.floor(419 - Math.max(0, e.face.manaSymbols.length - 1) * 27));
    e.regions = [
      {
        name: 'title',
        kind: 'ink',
        fields: ['name'],
        rect: [26, 25, right - 26, 42],
        reviewed: false,
      },
    ];
    const anchors = scanFrameAnchors(await png(e.reference), 'black');
    observations.push({ id: e.id, material: e.material, cohort: e.cohort, anchors });
  }
  const templates = Object.fromEntries(
    [...new Set(prior.map((e) => e.material))].map((material) => {
      const rows = observations.filter(
        (e) => e.material === material && e.cohort === 'calibration',
      );
      return [
        material,
        {
          reliable: false,
          method:
            'Median of per-scan outer-frame edge medians, calibration names only; no renderer input',
          names: rows.map((r) => prior.find((e) => e.id === r.id).card.name),
          sides: Object.fromEntries(
            ['left', 'right', 'top', 'bottom'].map((side) => [
              side,
              {
                position: median(
                  rows
                    .map((r) =>
                      median(
                        r.anchors.points
                          .filter((p) => p.side === side)
                          .map((p) => (['left', 'right'].includes(side) ? p.x : p.y)),
                      ),
                    )
                    .filter(Number.isFinite),
                ),
                reliable: false,
              },
            ]),
          ),
        },
      ];
    }),
  );
  study.validationKind = 'reused-development';
  study.note =
    'All names appeared in a prior development study. Original rules are supplied by the strict adapter, but most names/types/flavor/credits remain metadata or unreviewed. Title trials are exploratory and cannot complete headings or fullCard. New scan targets require visual review before acceptance.';
  study.provenance = {
    historicalInputsHash: hash(bytes),
    historicalBaseCommit: historical.baseCommit,
    anchorMethodHash: SCAN_ANCHOR_METHOD_HASH,
    fitMethodHash: SCAN_FIT_METHOD_HASH,
  };
  study.search = {
    parameters: [
      { key: 'dx', min: -3, max: 3, steps: [1, 0.5, 0.25] },
      { key: 'dy', min: -3, max: 3, steps: [1, 0.5, 0.25] },
    ],
    starts: [
      { dx: 0, dy: 0 },
      { dx: -2, dy: -2 },
      { dx: 2, dy: 2 },
    ],
    objective: 'mean((two-polarity one-pixel edge F1 + filled-area Dice)/2)',
    scope:
      'one shared title translation; no per-card rendering offset, pigment or typography changes',
  };
  await writeJson(file('templates-draft.json'), templates);
  await writeJson(file('anchors.json'), observations);
  await writeJson(file('study-draft.json'), study);
  console.log(
    Object.fromEntries(
      Object.entries(templates).map(([k, v]) => [k, { names: v.names.length, sides: v.sides }]),
    ),
  );
  process.exit(0);
}
if (phase === 'normalize') {
  await assert.rejects(access(studyFile));
  assert.ok(historicalFile, 'Pass a visually reviewed scan-only templates file');
  const study = await readJson(file('study-draft.json'));
  const templates = await readJson(historicalFile),
    observations = await readJson(file('anchors.json'));
  const templateHash = hash(JSON.stringify(templates));
  for (const e of study.entries) {
    const row = observations.find((r) => r.id === e.id);
    e.normalization = {
      ...fitScanFrame(row.anchors, templates[e.material]),
      referenceHash: e.reference.sha256,
      templateHash,
      methodHash: SCAN_FIT_METHOD_HASH,
    };
  }
  study.templateHash = templateHash;
  const names = new Map();
  for (const e of study.entries) {
    const identity = e.card.oracle_id ?? e.card.name;
    if (names.has(identity))
      assert.equal(names.get(identity), e.cohort, 'Name leaked across cohorts');
    names.set(identity, e.cohort);
  }
  await writeJson(studyFile, study);
  console.log(
    `${study.entries.filter((e) => e.normalization.accepted).length}/${study.entries.length} accepted`,
  );
  process.exit(0);
}
const study = await readJson(studyFile);
const studyHash = hash(await readFile(studyFile));
if (phase === 'capture' || phase === 'replay') {
  const destination = file(phase === 'capture' ? 'before' : 'after');
  await assert.rejects(access(path.join(destination, 'capture.json')));
  const components = await fetchComponents(study.entries, { offline: true }, (e) => e.face);
  const session = await openBrowser({ entries: study.entries, components });
  const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
  const proposal =
    phase === 'replay' ? await readJson(file('proposal.json')) : { values: { dx: 0, dy: 0 } };
  const rows = [];
  try {
    // A direct source consumer must initialize the public eager data contract.
    // The official capture runner currently omits this initialization.
    await session.page.evaluate(() => import('/games/magic/src/data/eager.ts'));
    for (const e of study.entries) {
      const captures = await session.page.evaluate(
        async ({ face, delta, blank }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const native = CanvasRenderingContext2D.prototype.fillText;
          const output = [];
          for (const mode of blank ? ['native', 'blank'] : ['native']) {
            let hits = 0;
            CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
              if (text === face.name && this.font.includes('Goudy')) {
                hits++;
                if (mode === 'blank') return;
                this.save();
                this.translate(delta.dx, delta.dy);
                try {
                  return native.call(this, text, x, y, maxWidth);
                } finally {
                  this.restore();
                }
              }
              return native.call(this, text, x, y, maxWidth);
            };
            try {
              const canvas = await composeCardTexture(
                { face, printingId: null, printedImage: null },
                'inspect',
                new AbortController().signal,
              );
              assertUnused();
              function assertUnused() {
                if (hits !== 1) throw Error(`Expected one native title, got ${hits}`);
              }
              output.push({ mode, data: canvas.toDataURL() });
              canvas.width = canvas.height = 0;
            } finally {
              CanvasRenderingContext2D.prototype.fillText = native;
            }
          }
          return output;
        },
        { face: e.face, delta: proposal.values, blank: phase === 'capture' },
      );
      const images = {};
      for (const capture of captures) {
        const bytes = Buffer.from(capture.data.split(',')[1], 'base64'),
          name = `${e.id}-${capture.mode}.png`;
        await atomicWrite(path.join(destination, name), bytes);
        images[capture.mode] = { file: name, sha256: hash(bytes) };
      }
      rows.push({ id: e.id, images });
      if (rows.length % 25 === 0) console.log(`${phase}: ${rows.length}/${study.entries.length}`);
      assert.deepEqual(session.faults, []);
    }
    assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
    await writeJson(path.join(destination, 'capture.json'), {
      schema: 1,
      studyHash,
      rendererHash,
      browser: await session.browser.version(),
      fontStylesheetHash: hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
      components,
      proposal,
      rows,
    });
  } finally {
    await session.close();
  }
} else if (phase === 'fit') {
  await assert.rejects(access(file('proposal.json')));
  const reviewBytes = await readFile(file('title-review.json'));
  const review = JSON.parse(reviewBytes),
    reviewed = await readJson(file('reviewed-study.json'));
  assert.equal(review.inputStudyHash, studyHash);
  assert.deepEqual(
    reviewed.entries.map((e) => [e.id, e.face, e.normalization, e.regions.map((r) => r.rect)]),
    study.entries.map((e) => [e.id, e.face, e.normalization, e.regions.map((r) => r.rect)]),
    'Review amendment changed frozen rendering inputs',
  );
  validateCalibrationStudy(reviewed);
  for (const e of study.entries.filter((e) => e.normalization.accepted)) {
    const row = review.rows.find((r) => r.id === e.id);
    assert.equal(row.referenceHash, e.reference.sha256);
    assert.equal(row.name, e.face.name);
  }
  const captures = await readJson(file('before/capture.json'));
  assert.equal(captures.studyHash, studyHash);
  const prepared = [];
  for (const e of study.entries.filter(
    (e) => e.cohort === 'calibration' && e.normalization.accepted,
  )) {
    const row = captures.rows.find((r) => r.id === e.id);
    const read = async (key) => {
      const bytes = await readFile(file('before/' + row.images[key].file));
      assert.equal(hash(bytes), row.images[key].sha256);
      return normalize(PNG.sync.read(bytes));
    };
    const rect = e.regions[0].rect;
    const ref = cropGray(normalize(await png(e.reference), e.normalization.transform), rect);
    const native = cropGray(await read('native'), rect),
      blank = cropGray(await read('blank'), rect);
    prepared.push({
      id: e.id,
      reference: ref,
      native,
      blank,
      edges: prepareLetteringEdges(ref.gray, ref.width, ref.height),
      shape: titleShape(ref.gray, ref.width, ref.height),
    });
  }
  assert.ok(prepared.length >= 3);
  const trial = (row, { dx, dy }) => {
    const { width: w, height: h } = row.reference;
    const difference = Float32Array.from(row.native.gray, (v, i) => v - row.blank.gray[i]);
    const out = Float32Array.from(row.blank.gray);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const sx = x - dx,
          sy = y - dy,
          ix = Math.floor(sx),
          iy = Math.floor(sy),
          fx = sx - ix,
          fy = sy - iy;
        if (ix >= 0 && iy >= 0 && ix + 1 < w && iy + 1 < h)
          out[y * w + x] +=
            difference[iy * w + ix] * (1 - fx) * (1 - fy) +
            difference[iy * w + ix + 1] * fx * (1 - fy) +
            difference[(iy + 1) * w + ix] * (1 - fx) * fy +
            difference[(iy + 1) * w + ix + 1] * fx * fy;
      }
    return out;
  };
  const trials = [];
  const evaluate = async (values) => {
    const scores = prepared.map((r) => {
      const gray = trial(r, values),
        { width, height } = r.reference;
      return {
        edgeF1: scoreLetteringEdges(r.edges, gray),
        ...compareTitleShape(r.shape, titleShape(gray, width, height)),
      };
    });
    const score = objective(scores);
    trials.push({
      values,
      score,
      edgeF1: median(scores.map((s) => s.edgeF1)),
      filledArea: median(scores.map((s) => s.filledArea)),
    });
    return score;
  };
  const searches = [];
  for (const start of study.search.starts)
    searches.push(await searchCalibration(start, study.search.parameters, evaluate));
  searches.sort((a, b) => b.score - a.score);
  const best = searches[0];
  const controls = [];
  for (const values of [
    { dx: 0, dy: 0 },
    { dx: best.values.dx + 2, dy: best.values.dy },
    { dx: best.values.dx, dy: best.values.dy + 2 },
  ])
    controls.push({ values, score: await evaluate(values) });
  await writeJson(file('proposal.json'), {
    status: 'experimental-not-adopted',
    studyHash,
    calibrationCount: prepared.length,
    titleReviewHash: hash(reviewBytes),
    reviewedStudyHash: hash(await readFile(file('reviewed-study.json'))),
    ...best,
    searches,
    controls,
    trials,
    limitation:
      'Cached additive title differential approximation; final native replay is authoritative. Reused-development names and unverified heading wording cannot complete the set.',
  });
  console.log({ best, controls });
} else {
  const before = await readJson(file('before/capture.json')),
    after = await readJson(file('after/capture.json'));
  for (const capture of [before, after]) assert.equal(capture.studyHash, studyHash);
  assert.equal(before.rendererHash, after.rendererHash);
  assert.equal(before.browser, after.browser);
  assert.equal(before.fontStylesheetHash, after.fontStylesheetHash);
  const rows = [];
  const image = async (capture, stage, id) => {
    const asset = capture.rows.find((r) => r.id === id).images.native;
    const bytes = await readFile(file(`${stage}/${asset.file}`));
    assert.equal(hash(bytes), asset.sha256);
    return normalize(PNG.sync.read(bytes));
  };
  for (const e of study.entries) {
    const a = await image(before, 'before', e.id),
      b = await image(after, 'after', e.id);
    let outside = 0;
    for (let y = 80; y < 680; y++)
      for (let x = 0; x < 488; x++)
        for (let c = 0; c < 4; c++) {
          const i = (y * 488 + x) * 4 + c;
          if (a.data[i] !== b.data[i]) outside++;
        }
    assert.equal(outside, 0, 'Native replay changed pixels outside the title band');
    const entry = {
      id: e.id,
      name: e.card.name,
      material: e.material,
      cohort: e.cohort,
      rarity: e.card.rarity,
      legendary: e.face.legendary ?? false,
      normalization: e.normalization.accepted,
      reason: e.normalization.reason,
      regions: [],
      outsideTitleChangedChannels: outside,
    };
    if (e.normalization.accepted) {
      const reference = normalize(await png(e.reference), e.normalization.transform);
      const windows = [
        { name: 'title', rect: e.regions[0].rect, ink: true },
        {
          name: 'manaCost',
          rect: [
            Math.max(340, 419 - Math.max(0, e.face.manaSymbols.length - 1) * 27),
            25,
            Math.min(
              130,
              488 - Math.max(340, 419 - Math.max(0, e.face.manaSymbols.length - 1) * 27),
            ),
            45,
          ],
          ink: true,
        },
        { name: 'art-aperture-top', rect: [55, 65, 375, 13], ink: false },
        { name: 'rules', rect: [62, 412, 364, 183], ink: true },
      ];
      for (const region of windows) {
        if (region.name === 'manaCost' && !e.face.manaSymbols.length) continue;
        const r = cropGray(reference, region.rect),
          old = cropGray(a, region.rect),
          next = cropGray(b, region.rect);
        const measure = (g) =>
          region.ink
            ? metric(r.gray, g, r.width, r.height)
            : compareRegion(r.gray, g, r.width, r.height);
        entry.regions.push({
          name: region.name,
          rect: region.rect,
          before: measure(old.gray),
          after: measure(next.gray),
          scope: region.name === 'title' ? 'exploratory-fit' : 'unchanged-diagnostic',
        });
      }
      for (const [stage, im] of [
        ['scan', reference],
        ['before', a],
        ['after', b],
      ]) {
        await atomicWrite(
          file(`review/${e.id}-${stage}.png`),
          PNG.sync.write({ width: 488, height: 680, data: Buffer.from(im.data) }),
        );
      }
      const rect = e.regions[0].rect;
      const crop = (im) => {
        const [x, y, w, h] = rect,
          out = new PNG({ width: w * 3, height: h * 3 });
        for (let yy = 0; yy < out.height; yy++)
          for (let xx = 0; xx < out.width; xx++) {
            const si = ((y + Math.floor(yy / 3)) * 488 + x + Math.floor(xx / 3)) * 4,
              di = (yy * out.width + xx) * 4;
            for (let c = 0; c < 4; c++) out.data[di + c] = im.data[si + c];
          }
        return out;
      };
      const scanCrop = crop(reference),
        afterCrop = crop(b);
      const overlay = new PNG({ width: scanCrop.width, height: scanCrop.height });
      for (let i = 0; i < overlay.data.length; i += 4) {
        const l = (v, j) => (v[j] + v[j + 1] + v[j + 2]) / 3;
        overlay.data[i] = l(scanCrop.data, i);
        overlay.data[i + 1] = l(afterCrop.data, i);
        overlay.data[i + 2] = 0;
        overlay.data[i + 3] = 255;
      }
      for (const [stage, im] of [
        ['scan-crop', scanCrop],
        ['before-crop', crop(a)],
        ['after-crop', afterCrop],
        ['red-green', overlay],
      ])
        await atomicWrite(file(`review/${e.id}-${stage}.png`), PNG.sync.write(im));
    }
    rows.push(entry);
    if (rows.length % 50 === 0) console.log(`report: ${rows.length}/${study.entries.length}`);
  }
  const distribution = (v) => ({
    mean: v.reduce((a, b) => a + b, 0) / v.length,
    median: median(v),
    p10: quantile(v, 0.1),
    minimum: Math.min(...v),
  });
  const summaries = [];
  for (const material of ['all', ...new Set(rows.map((e) => e.material))])
    for (const cohort of ['all', 'calibration', 'validation'])
      for (const region of ['title', 'manaCost', 'art-aperture-top', 'rules']) {
        const selected = rows
          .filter(
            (r) =>
              (material === 'all' || r.material === material) &&
              (cohort === 'all' || r.cohort === cohort),
          )
          .flatMap((r) =>
            r.regions.filter((x) => x.name === region).map((x) => ({ name: r.name, ...x })),
          );
        if (!selected.length) continue;
        const scores = {};
        for (const key of [
          'edgeF1',
          'filledArea',
          'contrast',
          'strokeWidthError',
          'meanDistance',
        ]) {
          const score = (r, stage) =>
            Array.isArray(r[stage][key]) ? r[stage][key][1] : r[stage][key];
          const valid = selected.filter(
            (r) => Number.isFinite(score(r, 'before')) && Number.isFinite(score(r, 'after')),
          );
          if (valid.length)
            scores[key] = {
              before: distribution(valid.map((r) => score(r, 'before'))),
              after: distribution(valid.map((r) => score(r, 'after'))),
            };
        }
        summaries.push({
          material,
          cohort,
          region,
          count: selected.length,
          scores,
          regressions: selected
            .filter(
              (r) => typeof r.before.edgeF1 === 'number' && r.after.edgeF1 < r.before.edgeF1 - 0.02,
            )
            .map((r) => ({ name: r.name, before: r.before.edgeF1, after: r.after.edgeF1 })),
        });
      }
  const titleRows = rows.filter((r) => r.normalization).map((r) => ({ ...r, title: r.regions[0] }));
  const improved = [...titleRows].sort(
    (a, b) =>
      b.title.after.edgeF1 - b.title.before.edgeF1 - (a.title.after.edgeF1 - a.title.before.edgeF1),
  );
  const worst = [...titleRows].sort((a, b) => a.title.after.edgeF1 - b.title.after.edgeF1);
  const report = {
    schema: 1,
    status: 'experimental-not-adopted',
    studyHash,
    rendererHash: before.rendererHash,
    browser: before.browser,
    fontStylesheetHash: before.fontStylesheetHash,
    methodHash: await sourceHash(
      new URL('.', import.meta.url),
      /^(beta-validation|scan-frame-anchors|scan-frame-fit|pixels-pure|scan-transform|edges|metrics|lettering-metrics|letter-fill-metrics|calibration-search).mjs$/,
    ),
    validationKind: study.validationKind,
    counts: {
      total: rows.length,
      renderedBefore: before.rows.length,
      renderedAfter: after.rows.length,
      accepted: rows.filter((r) => r.normalization).length,
      unmeasured: rows.filter((r) => !r.normalization).length,
    },
    proposal: after.proposal,
    summaries,
    improvements: improved.slice(0, 5).map((r) => r.name),
    worst: worst.slice(0, 5).map((r) => r.name),
    rows,
  };
  await writeJson(file('review/evidence.json'), report);
  const esc = (v) =>
    String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const n = (v) => (Number.isFinite(v) ? v.toFixed(4) : 'unmeasured');
  const ordered = [
    ...new Map(
      [...improved.slice(0, 5), ...worst.slice(0, 5), ...titleRows].map((r) => [r.id, r]),
    ).values(),
  ];
  await atomicWrite(
    file('review/index.html'),
    `<!doctype html><meta charset="utf-8"><title>Beta independent title experiment</title><style>body{font:16px system-ui;max-width:1400px;margin:30px auto;background:#f4f5f7;color:#15202a}section{padding:20px;margin:24px 0;background:white}.cards{display:flex;gap:12px}.cards img{width:100%}figure{margin:0;flex:1}img{max-width:100%;height:auto}.crop{image-rendering:pixelated}.overlay{position:relative;width:488px}.overlay img+img{position:absolute;inset:0;opacity:.5}pre{white-space:pre-wrap}</style><h1>LEB: exploratory shared title translation</h1><p>${report.counts.accepted}/${report.counts.total} normalized scans; all 302 native faces rendered before/after. Reused-development cohorts. No defaults changed, no group completed. Title names/type/flavor/credits are not fully scan reviewed. Current adapter cannot consolidate LEB without changing pixels.</p><p>Native delta dx=${after.proposal.values.dx}, dy=${after.proposal.values.dy}. Geometry only; pigment, fonts and wording fixed. Scores are similarity indices, not accuracy percentages.</p><pre>${esc(
      JSON.stringify(
        summaries.filter((s) => s.material === 'all' && s.region === 'title'),
        null,
        2,
      ),
    )}</pre>${ordered.map((r) => `<section id="${r.id}"><h2>${esc(r.name)} · ${r.material} · ${r.cohort}</h2><p>Dual-polarity 1px F1 ${n(r.title.before.edgeF1)} → ${n(r.title.after.edgeF1)}; filled Dice ${n(r.title.before.filledArea)} → ${n(r.title.after.filledArea)}; contrast ${n(r.title.before.contrast)} → ${n(r.title.after.contrast)}</p><div class="cards">${['scan', 'before', 'after'].map((stage) => `<figure><figcaption>${stage}</figcaption><img loading="lazy" src="${r.id}-${stage}.png"></figure>`).join('')}</div><details open><summary>3× title crops and red/green scan/candidate overlay</summary>${['scan-crop', 'before-crop', 'after-crop', 'red-green'].map((stage) => `<img class="crop" loading="lazy" src="${r.id}-${stage}.png">`).join('')}</details><details><summary>Transparent aligned overlay</summary><div class="overlay"><img loading="lazy" src="${r.id}-scan.png"><img loading="lazy" src="${r.id}-after.png"></div></details></section>`).join('')}<h2>Unavailable normalization</h2><ul>${rows
      .filter((r) => !r.normalization)
      .map((r) => `<li>${esc(r.name)} (${r.material}): ${esc(r.reason)}</li>`)
      .join('')}</ul>`,
  );
  console.log(report.counts);
}
