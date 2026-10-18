import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import os from 'node:os';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson, objectFile, sourceHash, root } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion } from './metrics.mjs';
import { compareTitleShape, titleShape } from './letter-fill-metrics.mjs';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';

/** Portable study format. The author supplies reviewed wording, fixed frame-only
 * poses and ROIs. A renderer candidate cannot redefine its comparison target. */
export function validateCalibrationStudy(study) {
  assert.equal(study.schema, 1);
  assert.ok(study.entries?.length > 0);
  assert.equal(new Set(study.entries.map((e) => e.id)).size, study.entries.length);
  const names = new Map();
  for (const e of study.entries) {
    assert.match(e.id, /^[a-f0-9-]{36}$/);
    assert.ok(['calibration', 'validation'].includes(e.cohort));
    const name = e.card?.oracle_id ?? e.card?.name ?? e.face?.name;
    assert.ok(name);
    if (names.has(name))
      assert.equal(names.get(name), e.cohort, 'Printing variants leaked across cohorts');
    names.set(name, e.cohort);
    if (e.issue) {
      assert.equal(typeof e.issue, 'string');
      continue;
    }
    assert.match(e.reference?.sha256 ?? '', /^[a-f0-9]{64}$/);
    assert.ok(e.face && e.face.wordingMode === 'original');
    assert.equal(e.wordingEvidence?.referenceHash, e.reference.sha256);
    assert.ok(
      ['scan-reviewed', 'mtgjson-original', 'scryfall-printed'].includes(e.wordingEvidence.rules),
    );
    assert.ok(e.normalization && typeof e.normalization.accepted === 'boolean');
    assert.equal(e.normalization.referenceHash, e.reference.sha256);
    if (!e.normalization.accepted) {
      assert.ok(e.normalization.reason);
      continue;
    }
    for (const key of ['templateHash', 'methodHash'])
      assert.match(e.normalization[key] ?? '', /^[a-f0-9]{64}$/);
    const matrix = e.normalization.transform?.matrix;
    assert.ok(matrix?.length === 6 && matrix.every(Number.isFinite));
    assert.ok(Math.abs(matrix[0] * matrix[3] - matrix[1] * matrix[2]) > 0.1);
    assert.ok(e.regions?.length);
    assert.equal(new Set(e.regions.map((r) => r.name)).size, e.regions.length);
    for (const r of e.regions) {
      assert.ok(['ink', 'edge'].includes(r.kind));
      if (r.kind === 'ink') {
        assert.ok(r.fields?.length, 'Declare the wording fields in an ink window');
        for (const field of r.fields)
          assert.ok(
            ['scan-reviewed', 'mtgjson-original', 'scryfall-printed'].includes(
              e.wordingEvidence[field],
            ),
            `Unreviewed printing field: ${field}`,
          );
      }
      assert.ok(r.rect?.length === 4 && r.rect.every(Number.isFinite));
      const [x, y, w, h] = r.rect;
      assert.ok(x >= 0 && y >= 0 && w >= 3 && h >= 3 && x + w <= 488 && y + h <= 680);
      assert.ok(
        r.reviewed === true,
        'Review component presence, wording, polarity and crop boundaries',
      );
    }
  }
  assert.ok(['fresh', 'reused-development', 'family-transfer'].includes(study.validationKind));
}

async function verifiedPng(asset, directory) {
  const bytes = await readFile(directory ? path.join(directory, asset.file) : objectFile(asset));
  assert.equal(hash(bytes), asset.sha256, 'Image content changed');
  return PNG.sync.read(bytes, { checkCRC: true });
}
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

async function capture(study, studyHash, directory) {
  // Asset preparation is explicit and cache-only. Fetch any new pinned assets
  // with the assets command before capturing; faults never become fallback scores.
  const components = await fetchComponents(
    study.entries.filter((e) => !e.issue),
    { offline: true },
    (e) => e.face,
  );
  const session = await openBrowser({ entries: study.entries, components });
  const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
  const rows = [];
  try {
    for (const e of study.entries) {
      if (e.issue) {
        rows.push({ id: e.id, issue: e.issue });
        continue;
      }
      const image = await session.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const canvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        try {
          return canvas.toDataURL();
        } finally {
          canvas.width = canvas.height = 0;
        }
      }, e.face);
      assert.deepEqual(session.faults, [], 'Missing asset or font during capture');
      const bytes = Buffer.from(image.split(',')[1], 'base64'),
        file = `${e.id}.png`;
      const { atomicWrite } = await import('./common.mjs');
      await atomicWrite(path.join(directory, file), bytes);
      rows.push({ id: e.id, image: { file, sha256: hash(bytes) } });
    }
    assert.equal(
      await sourceHash(path.join(root, 'games/magic/src')),
      rendererHash,
      'Renderer changed during capture',
    );
    await writeJson(path.join(directory, 'capture.json'), {
      schema: 1,
      studyHash,
      rendererHash,
      browser: await session.browser.version(),
      platform: `${os.platform()} ${os.release()} ${os.arch()}`,
      fontStylesheetHash: hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
      components,
      rows,
    });
  } finally {
    await session.close();
  }
}

async function compare(study, studyHash, baselineDirectory, candidateDirectory, directory) {
  const baseline = await readJson(path.join(baselineDirectory, 'capture.json'));
  const candidate = await readJson(path.join(candidateDirectory, 'capture.json'));
  for (const run of [baseline, candidate]) {
    assert.match(run.fontStylesheetHash ?? '', /^[a-f0-9]{64}$/, 'Capture lacks font identity');
    assert.ok(
      typeof run.platform === 'string' && run.platform.length,
      'Capture lacks platform identity',
    );
  }
  assert.equal(baseline.studyHash, studyHash);
  assert.equal(candidate.studyHash, studyHash);
  assert.equal(baseline.browser, candidate.browser, 'Keep the rasterizer fixed');
  assert.equal(baseline.platform, candidate.platform, 'Keep the font rasterization platform fixed');
  assert.equal(
    baseline.fontStylesheetHash,
    candidate.fontStylesheetHash,
    'Keep the font stylesheet fixed',
  );
  const rows = [];
  for (const e of study.entries) {
    const reason = e.issue ?? (!e.normalization.accepted ? e.normalization.reason : null);
    if (reason) {
      rows.push({
        id: e.id,
        name: e.face?.name ?? e.card?.name,
        cohort: e.cohort,
        status: 'unmeasured',
        reason,
      });
      continue;
    }
    const before = baseline.rows.find((r) => r.id === e.id),
      after = candidate.rows.find((r) => r.id === e.id);
    assert.ok(before?.image && after?.image, 'Missing native capture');
    // Keep the resize-then-affine path fixed; never transform a candidate.
    const reference = normalize(
      normalize(await verifiedPng(e.reference)),
      e.normalization.transform,
    );
    const a = normalize(await verifiedPng(before.image, baselineDirectory)),
      b = normalize(await verifiedPng(after.image, candidateDirectory));
    const regions = e.regions.map((region) => {
      const ref = cropGray(reference, region.rect),
        old = cropGray(a, region.rect),
        next = cropGray(b, region.rect);
      const metric = (image) => ({
        ...compareRegion(ref.gray, image.gray, ref.width, ref.height, region.lightInk ?? false),
        ...(region.kind === 'ink'
          ? {
              fill: compareTitleShape(
                titleShape(ref.gray, ref.width, ref.height),
                titleShape(image.gray, ref.width, ref.height),
              ),
            }
          : {}),
      });
      return { name: region.name, rect: region.rect, before: metric(old), after: metric(next) };
    });
    const files = {};
    for (const [key, image] of [
      ['scan', reference],
      ['before', a],
      ['after', b],
    ]) {
      const bytes = PNG.sync.write({
        width: image.width,
        height: image.height,
        data: Buffer.from(image.data),
      });
      const file = e.id + '-' + key + '.png';
      const { atomicWrite } = await import('./common.mjs');
      await atomicWrite(path.join(directory, file), bytes);
      files[key] = file;
    }
    rows.push({
      id: e.id,
      name: e.face.name,
      cohort: e.cohort,
      group: e.group ?? e.card?.set,
      status: 'measured',
      regions,
      files,
    });
  }
  const measured = rows.filter((r) => r.status === 'measured');
  const groups = new Map();
  for (const row of measured)
    for (const region of row.regions) {
      const key = JSON.stringify([row.group, row.cohort, region.name]);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({
        id: row.id,
        name: row.name,
        before: region.before.edgeF1?.[1],
        after: region.after.edgeF1?.[1],
      });
    }
  const distribution = (values) => {
    const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
    if (!sorted.length) return null;
    const at = (p) => sorted[Math.floor((sorted.length - 1) * p)];
    return {
      mean: sorted.reduce((a, b) => a + b, 0) / sorted.length,
      median: at(0.5),
      p10: at(0.1),
      worst: sorted[0],
    };
  };
  const summary = [...groups].map(([key, values]) => {
    const [group, cohort, region] = JSON.parse(key);
    return {
      group,
      cohort,
      region,
      count: values.length,
      before: distribution(values.map((v) => v.before)),
      after: distribution(values.map((v) => v.after)),
      regressions: values.filter(
        (v) => Number.isFinite(v.before) && Number.isFinite(v.after) && v.after < v.before,
      ),
    };
  });
  const report = {
    schema: 1,
    studyHash,
    validationKind: study.validationKind,
    baselineHash: baseline.rendererHash,
    candidateHash: candidate.rendererHash,
    methodHash: await sourceHash(
      new URL('.', import.meta.url),
      /^(calibration-evidence|pixels-pure|scan-transform|edges|metrics|letter-fill-metrics)\.mjs$/,
    ),
    counts: {
      total: rows.length,
      measured: measured.length,
      unmeasured: rows.length - measured.length,
    },
    summary,
    rows,
  };
  await writeJson(path.join(directory, 'evidence.json'), report);
  const score = (v) => (Number.isFinite(v) ? v.toFixed(3) : 'unmeasured');
  const html = `<!doctype html><meta charset="utf-8"><title>Set calibration review</title><style>body{font:16px system-ui;background:#f5f6f8;color:#18202a;max-width:1250px;margin:32px auto;padding:0 20px}section{background:white;border:1px solid #ddd;padding:18px;margin:24px 0;border-radius:12px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}img{width:100%;height:auto}table{border-collapse:collapse;width:100%}td,th{text-align:left;padding:7px;border-bottom:1px solid #ddd}.overlay{position:relative;max-width:488px}.overlay img+img{position:absolute;inset:0;opacity:.5}</style><h1>Set calibration review</h1><p>${measured.length}/${rows.length} measured · ${escape(study.validationKind)} validation. Scores are regional similarity indices, not percentages of correctness.</p><p>Baseline ${escape(baseline.rendererHash.slice(0, 12))}; candidate ${escape(candidate.rendererHash.slice(0, 12))}. Scan poses, wording and windows are identical.</p>${rows.map((r) => `<section><h2>${escape(r.name)} · ${escape(r.cohort)}</h2>${r.status === 'unmeasured' ? `<p>Unmeasured: ${escape(r.reason)}</p>` : `<div class="cards">${['scan', 'before', 'after'].map((k) => `<figure><figcaption>${k}</figcaption><img loading="lazy" src="${r.files[k]}"></figure>`).join('')}</div><table><tr><th>Component</th><th>Edge F1 before → after</th><th>Filled area before → after</th><th>Contrast before → after</th></tr>${r.regions.map((v) => `<tr><td>${escape(v.name)}</td><td>${score(v.before.edgeF1?.[1])} → ${score(v.after.edgeF1?.[1])}</td><td>${score(v.before.fill?.filledArea)} → ${score(v.after.fill?.filledArea)}</td><td>${score(v.before.fill?.contrast)} → ${score(v.after.fill?.contrast)}</td></tr>`).join('')}</table><details><summary>Aligned transparent overlay</summary><div class="overlay"><img loading="lazy" src="${r.files.scan}"><img loading="lazy" src="${r.files.after}"></div></details>`}</section>`).join('')}`;
  const { atomicWrite } = await import('./common.mjs');
  await atomicWrite(path.join(directory, 'index.html'), html);
  console.log(report.counts);
}

if (process.argv[1]?.endsWith('/calibration-evidence.mjs')) {
  const [command, file, ...args] = process.argv.slice(2);
  if (!['check', 'assets', 'capture', 'compare'].includes(command) || !file)
    throw Error(
      'Usage: calibration-evidence.mjs check|assets|capture|compare STUDY.json [OUT | BASELINE CANDIDATE OUT]',
    );
  const bytes = await readFile(file),
    study = JSON.parse(bytes);
  validateCalibrationStudy(study);
  if (command === 'check') console.log(`${study.entries.length} frozen entries; ${hash(bytes)}`);
  if (command === 'assets')
    await fetchComponents(
      study.entries.filter((e) => !e.issue),
      {},
      (e) => e.face,
    );
  if (command === 'capture') {
    assert.equal(args.length, 1);
    let exists = false;
    try {
      await readFile(path.join(args[0], 'capture.json'));
      exists = true;
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    assert.equal(exists, false, 'Choose a new run name; preserve old captures');
    await capture(study, hash(bytes), args[0]);
  }
  if (command === 'compare') {
    assert.equal(args.length, 3);
    await compare(study, hash(bytes), ...args);
  }
}
