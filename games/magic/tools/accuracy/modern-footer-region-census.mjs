// Compare cached native footer regions. No browser, font loading or scan refit.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import { readPng } from './pixels.mjs';
import { hash, sourceHash, writeJson } from './common.mjs';
import { readCensus } from './modern-publication-review.mjs';
import {
  footerRegions,
  footerPatch,
  patchMeasurement,
  displacementDice,
  FOOTER_REGION_POLICY,
} from './modern-footer-regions.mjs';
const mean = (values) => {
  const v = values.filter(Number.isFinite);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};
const roles = ['collector', 'artist', 'legal'];
const outOf100 = (value) => (value === null ? null : 100 * value);
const measured = (items) => ({
  fillDice100: outOf100(mean(items.map((x) => x.fillDice))),
  edgeF1At1: outOf100(mean(items.map((x) => x.edgeF1?.[1]))),
  meanDistance: mean(items.map((x) => x.meanDistance)),
  fields: items.length,
  statuses: items.reduce((r, x) => ((r[x.status] = (r[x.status] ?? 0) + 1), r), {}),
});
export async function main(args) {
  const [inputsFile, beforeDir, currentDir, scoresDir, output] = args;
  assert(output && args.length === 5, 'Use INPUTS RELEASED_NATIVE CURRENT_NATIVE SCORES OUTPUT');
  const started = performance.now(),
    load = async (file) => {
      const bytes = await readFile(file);
      return { bytes, data: JSON.parse(bytes), sha256: hash(bytes) };
    };
  const [inputs, before, current, scores] = await Promise.all([
    load(inputsFile),
    load(path.join(beforeDir, 'capture.json')),
    load(path.join(currentDir, 'capture.json')),
    load(path.join(scoresDir, 'scores.json')),
  ]);
  const census = await readCensus(
    'games/magic/fixtures/accuracy/m21/current-component-census.json',
  );
  const comparison = await readCensus(
    'games/magic/fixtures/accuracy/m21/release-0612-comparison.json',
  );
  const content = await load(
    'games/magic/fixtures/accuracy/m21/current-footer-content-census.json',
  );
  const d = census.detail.definition,
    c = comparison.detail.definition;
  assert.equal(inputs.sha256, d.inputsHash);
  assert.equal(before.sha256, c.beforeCaptureHash);
  assert.equal(current.sha256, d.nativeCaptureHash);
  assert.equal(scores.sha256, d.scoresHash);
  assert.equal(await sourceHash('games/magic/src'), d.rendererHash);
  assert.equal(content.data.definition.rendererHash, d.rendererHash);
  const by = (rows) => {
    const m = new Map(rows.map((r) => [r.id, r]));
    assert.equal(m.size, 297);
    return m;
  };
  const old = by(before.data.rows),
    now = by(current.data.rows),
    scored = by(scores.data.rows),
    natives = by(census.detail.rows),
    texts = by(content.data.rows);
  const rows = [],
    work = [];
  for (const e of inputs.data.entries) {
    const a = old.get(e.id),
      b = now.get(e.id),
      s = scored.get(e.id),
      n = natives.get(e.id),
      t = texts.get(e.id);
    assert(a && b && s && n && t);
    assert.equal(e.face.wordingMode, 'original');
    assert.equal(hash(JSON.stringify(e.face)), n.inputHash);
    assert.equal(a.inputHash, b.inputHash);
    assert.equal(b.inputHash, n.inputHash);
    assert.equal(b.layers.face.sha256, n.nativeFaceHash);
    for (const r of [a, b, s, t]) assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(s.normalizedReference.sha256, t.normalizedHash);
    const paths = [
      path.join(beforeDir, a.layers.face.file),
      path.join(currentDir, b.layers.face.file),
      path.join(scoresDir, s.normalizedReference.file),
    ];
    const expected = [a.layers.face.sha256, b.layers.face.sha256, s.normalizedReference.sha256];
    const images = [];
    for (let i = 0; i < paths.length; i++) {
      const bytes = await readFile(paths[i]);
      assert.equal(hash(bytes), expected[i]);
      images.push(await readPng(paths[i]));
    }
    const region = footerRegions(e.face),
      fields = {};
    const row = {
      id: e.id,
      name: e.name,
      number: e.card.collector_number,
      nonfoil: n.nonfoil,
      referenceHash: n.referenceHash,
      poseHash: n.poseHash,
      inputHash: n.inputHash,
      nativeFaceHash: n.nativeFaceHash,
      beforeFaceHash: a.layers.face.sha256,
      normalizedHash: t.normalizedHash,
      kind:
        e.face.loyalty != null
          ? 'planeswalker'
          : e.face.land
            ? 'land'
            : e.face.artifact
              ? 'artifact'
              : 'ordinary',
      fields: {},
    };
    for (const role of roles) {
      const patches = region[role].map((rect) => {
        const target = footerPatch(images[2], rect),
          current = footerPatch(images[1], rect),
          before = footerPatch(images[0], rect);
        return { rect, target, current, before };
      });
      fields[role] = patches.map((p) => [p.target, p.current]);
      row.fields[role] = {
        rects: region[role],
        before: patches.map((p) => patchMeasurement(p.target, p.before)),
        current: patches.map((p) => patchMeasurement(p.target, p.current)),
      };
    }
    rows.push(row);
    work.push({ name: e.name, nonfoil: n.nonfoil, fields });
    if (rows.length % 50 === 0) console.log('decoded ' + rows.length + '/297');
  }
  const decodedAt = performance.now(),
    proposals = {};
  for (const role of roles) {
    const cache = new Map();
    const evaluate = (dx, dy) => {
      const key = dx + ',' + dy;
      if (!cache.has(key)) {
        const byName = new Map();
        for (const w of work.filter((w) => w.nonfoil)) {
          const value = displacementDice(w.fields[role], dx, dy);
          if (value == null) continue;
          if (!byName.has(w.name)) byName.set(w.name, []);
          byName.get(w.name).push(value);
        }
        cache.set(key, { dx, dy, score: mean([...byName.values()].map(mean)) });
      }
      return cache.get(key);
    };
    let best = evaluate(0, 0);
    const choose = (v) => {
      if (
        v.score > best.score + 1e-10 ||
        (Math.abs(v.score - best.score) < 1e-10 &&
          Math.hypot(v.dx, v.dy) < Math.hypot(best.dx, best.dy))
      )
        best = v;
    };
    for (let dy = -2; dy <= 2; dy += 0.5)
      for (let dx = -2; dx <= 2; dx += 0.5) choose(evaluate(dx, dy));
    const coarse = { ...best };
    for (const dy of [-0.25, 0, 0.25])
      for (const dx of [-0.25, 0, 0.25])
        if (Math.abs(coarse.dx + dx) <= 2 && Math.abs(coarse.dy + dy) <= 2)
          choose(evaluate(coarse.dx + dx, coarse.dy + dy));
    const zero = evaluate(0, 0);
    proposals[role] = {
      ...best,
      baseline: zero.score,
      gain100: 100 * (best.score - zero.score),
      objective:
        'Equal name-weighted nonfoil filled-ink Dice. Complete reused-development census, no holdout.',
      trials: [...cache.values()],
      boundaryWinner: Math.abs(best.dx) === 2 || Math.abs(best.dy) === 2,
    };
    for (let i = 0; i < rows.length; i++) {
      const pairs = work[i].fields[role];
      rows[i].fields[role].sharedProposal = pairs.map(([a, b]) =>
        patchMeasurement(a, b, best.dx, best.dy),
      );
      rows[i].fields[role].fixedDisplacements = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2],
      ].map(([dx, dy]) => ({ dx, dy, fillDice: displacementDice(pairs, dx, dy) }));
    }
    console.log(
      role +
        ' shared displacement ' +
        JSON.stringify({ dx: best.dx, dy: best.dy, gain100: proposals[role].gain100 }),
    );
  }
  const summary = {
    printings: rows.length,
    nonfoil: rows.filter((r) => r.nonfoil).length,
    foilOnlyControls: 5,
    roles: {},
  };
  for (const role of roles) {
    const boundaryRows = rows.filter((r) =>
      r.fields[role].current.some(
        (field) => field.boundaryReview?.reference.length || field.boundaryReview?.rendered.length,
      ),
    );
    const subset = rows.filter((r) => r.nonfoil);
    summary.roles[role] = {
      independentRegionApproval: false,
      boundaryReview: {
        printings: boundaryRows.length,
        ids: boundaryRows.map((r) => r.id),
        reason:
          'Fixed cells can clip glyphs or include the adjacent footer row. These indices remain diagnostics; use isolated painter masks and scan-only field segmentation before approving a regional fit.',
      },
      before: measured(subset.flatMap((r) => r.fields[role].before)),
      current: measured(subset.flatMap((r) => r.fields[role].current)),
      sharedProposal: measured(subset.flatMap((r) => r.fields[role].sharedProposal)),
      worst: subset
        .map((r) => ({
          id: r.id,
          name: r.name,
          number: r.number,
          fillDice100: 100 * mean(r.fields[role].current.map((p) => p.fillDice)),
        }))
        .sort((a, b) => a.fillDice100 - b.fillDice100)
        .slice(0, 12),
    };
  }
  const toolFiles = [
    'modern-footer-region-census.mjs',
    'modern-footer-regions.mjs',
    'metrics.mjs',
    'edges.mjs',
    'pixels.mjs',
  ];
  const detail = {
    schema: 1,
    set: 'm21',
    status: 'current-fixed-cell-footer-diagnostics-not-calibration-approval',
    definition: {
      rendererHash: d.rendererHash,
      inputsHash: inputs.sha256,
      beforeCaptureHash: before.sha256,
      nativeCaptureHash: current.sha256,
      normalizationHash: d.normalizationHash,
      scoresHash: scores.sha256,
      contentHash: content.sha256,
      policy: FOOTER_REGION_POLICY,
      sources: Object.fromEntries(
        await Promise.all(
          toolFiles.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
        ),
      ),
      method:
        'Cached PNGs only. Bilinear native-to-canonical sampling; independently contrast-normalized HSV value foreground; filled-ink Dice, local edge F1 and distance. Scan transforms remain fixed. Shared role displacement proposals are diagnostic; no printing-specific offsets or rendering changes.',
    },
    summary,
    proposals,
    rows,
    benchmark: {
      decodedAndMeasuredMs: decodedAt - started,
      searchAndFinalMetricsMs: performance.now() - decodedAt,
      scope:
        'One Node process: CPU PNG decoding, hashing, foreground extraction and regional search. No browser/GPU capture; not GPU completion time.',
    },
    limitations: [
      'Original printed content verified for current renderer; older release fields are diagnostic.',
      'No color/saturation match is claimed. Foil-only scans remain excluded from fitting.',
      'Fixed region cells have boundary contacts and possible adjacent-row contamination. No independent per-field calibration approval follows from these diagnostics.',
      'Fractional raster shifts also change antialiasing; filled-overlap gains that conflict with edge scores require isolated native-renderer verification.',
      'A displacement gain alone does not approve a shared adjustment or certify the set.',
    ],
  };
  const raw = Buffer.from(JSON.stringify(detail) + '\n'),
    compressed = gzipSync(raw, { level: 9 });
  await writeFile(output + '.gz', compressed);
  await writeJson(output, {
    ...detail,
    rows: undefined,
    evidence: {
      file: path.basename(output) + '.gz',
      sha256: hash(compressed),
      contentSha256: hash(raw),
    },
  });
  console.log(JSON.stringify({ summary, benchmark: detail.benchmark }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await main(process.argv.slice(2));
