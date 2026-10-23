// Reconcile adopted mana measurements with the released native census; no refit.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync, gunzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { hash, sourceHash, writeJson } from './common.mjs';
import { manaInterior, checkManaReuse } from './modern-mana-reuse.mjs';
const prefix = 'games/magic/fixtures/accuracy/m21/';
export async function manaMetadata(inputs) {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const load = async (n) => server.ssrLoadModule('/games/magic/src/presentation/' + n + '.ts');
    const { framePlate } = await load('frame-plates'),
      { faceRects, faceFrame } = await load('special-frames');
    const { FACE_RECTS, FACE_TEXT } = await load('face-layout'),
      { printingManaAdjustment } = await load('printing-mana-adjustment');
    const { M21_COMPONENT_CALIBRATION } = await load('m21-component-calibration');
    const rows = inputs.entries.map((e) => {
      const face = e.face,
        plate = framePlate(face),
        tokens = face.manaSymbols ?? [];
      const adjustment = printingManaAdjustment(face) ?? {},
        sx = adjustment.scaleX ?? 1,
        sy = adjustment.scaleY ?? 1;
      const title = (plate ? FACE_RECTS.title : faceRects(face).title).map(
        (v, i) => v * (i % 2 ? 680 : 488),
      );
      const size = plate?.mana.size ?? FACE_TEXT.manaSize,
        gap = (plate?.mana.gap ?? FACE_TEXT.manaGap) + (adjustment.spacing ?? 0);
      const right = plate ? plate.mana.right * 488 : title[0] + title[2] - FACE_TEXT.plateRight;
      const cy = plate ? plate.mana.center * 680 : title[1] + title[3] / 2 + FACE_TEXT.manaLift / 2;
      return {
        id: e.id,
        family: faceFrame(face).startsWith('planeswalker') ? 'walker' : 'normal',
        adjustment,
        tokens: tokens.map((symbol, index) => ({
          symbol,
          index,
          x:
            right -
            0.5 +
            (adjustment.dx ?? 0) -
            (size / 2 + (tokens.length - index - 1) * (size + gap)) * sx,
          y: cy - 0.5 + (adjustment.dy ?? 0),
          radiusX: (size * sx) / 2,
          radiusY: (size * sy) / 2,
        })),
      };
    });
    return { mana: M21_COMPONENT_CALIBRATION.mana, rows };
  } finally {
    await server.close();
  }
}
export async function main(args) {
  const [beforeInputs, beforeDirectory, inputsFile, nativeDirectory, output] = args;
  assert(
    output && args.length === 5,
    'Use ADOPTED_INPUTS ADOPTED_NATIVE CURRENT_INPUTS CURRENT_NATIVE OUTPUT',
  );
  const started = performance.now(),
    guards = {};
  const load = async (file) => {
    const bytes = await readFile(file);
    return { data: JSON.parse(bytes), sha256: hash(bytes) };
  };
  const evidence = async (name) => {
    const file = prefix + name + '.json',
      summary = await load(file);
    guards[file] = summary.sha256;
    const e = summary.data.evidence;
    if (!e) {
      const compressedFile = file + '.gz',
        compressed = await readFile(compressedFile);
      assert.equal(hash(compressed), summary.data.source.detailsHash);
      guards[compressedFile] = hash(compressed);
      return { summary: summary.data, detail: JSON.parse(gunzipSync(compressed)) };
    }
    const compressedFile = e.file.startsWith('games/')
      ? e.file
      : path.join(path.dirname(file), e.file);
    const compressed = await readFile(compressedFile);
    assert.equal(hash(compressed), e.sha256);
    const raw = gunzipSync(compressed);
    assert.equal(hash(raw), e.contentSha256);
    guards[compressedFile] = hash(compressed);
    return { summary: summary.data, detail: JSON.parse(raw) };
  };
  const [a, b, old, current, census, adoption, style] = await Promise.all([
    load(beforeInputs),
    load(inputsFile),
    load(path.join(beforeDirectory, 'capture.json')),
    load(path.join(nativeDirectory, 'capture.json')),
    evidence('current-component-census'),
    evidence('component-profile-adoption-native-review'),
    evidence('mana-paper-shadow-walker-native-review'),
  ]);
  // The filled-glyph fit and independent perimeter controls remain part of the reused proof.
  await evidence('mana-glyph-native-review');
  await evidence('mana-disc-measurement-review');
  assert.equal(old.sha256, adoption.summary.source.nativeCapture);
  assert.equal(a.sha256, adoption.summary.source.inputs);
  assert.equal(current.sha256, census.detail.definition.nativeCaptureHash);
  assert.equal(b.sha256, census.detail.definition.inputsHash);
  assert.equal(await sourceHash('games/magic/src'), census.detail.definition.rendererHash);
  for (const capture of [old.data, current.data]) {
    assert.equal(capture.completed, 297);
    assert.equal(capture.denominator, 297);
    assert.deepEqual(capture.faults, []);
  }
  assert.equal(old.data.source.inputsHash, a.sha256);
  assert.equal(current.data.source.inputsHash, b.sha256);
  assert.equal(old.data.source.rendererHash, adoption.summary.source.renderer);
  assert.equal(old.data.source.browser, current.data.source.browser);
  assert.equal(current.data.source.rendererHash, census.detail.definition.rendererHash);
  for (const input of [a.data, b.data]) {
    assert.equal(input.set, 'm21');
    assert.equal(input.entries.length, 297);
    assert(input.entries.every((e) => e.face.wordingMode === 'original'));
  }
  for (const [base, entries] of [
    ['games/magic', current.data.source.packMetadata],
    ['packages/browser/src', current.data.source.rasterHelpers],
  ])
    for (const [file, digest] of entries) {
      const name = path.join(base, file);
      assert.equal(hash(await readFile(name)), digest, 'Changed native helper/metadata');
      guards[name] = digest;
    }

  const meta = await manaMetadata(b.data),
    previous = await manaMetadata(a.data);
  assert.deepEqual(meta, previous, 'Cost-critical geometry or inputs changed after adoption');
  const fit = style.detail.parameters;
  const selectedParameters = {
    normal: fit.normalParameters.rendererControls,
    walker: fit.walkerParameters.walkerControls,
    shadow: fit.normalParameters.shadow,
    paperTargets: fit.walkerParameters.paperTargets,
  };
  assert.deepEqual(meta.mana, selectedParameters);
  assert.deepEqual(fit.normalParameters.shadow, fit.walkerParameters.shadow);
  const indexed = (rows) => {
    const m = new Map(rows.map((r) => [r.id, r]));
    assert.equal(m.size, 297);
    return m;
  };
  const oldRows = indexed(old.data.rows),
    newRows = indexed(current.data.rows),
    nativeRows = indexed(census.detail.rows);
  assert.deepEqual([...oldRows.keys()].sort(), [...newRows.keys()].sort());
  const components = new Map(current.data.source.components);
  const manaSources = old.data.source.components
    .filter(([url]) => /mana/i.test(url))
    .map(([url, beforeHash]) => ({ url, beforeHash, afterHash: components.get(url) }));
  for (const s of manaSources) assert.equal(s.beforeHash, s.afterHash);
  // Extract the unchanged painting function, rather than unrelated title-font code in its module.
  const file = 'games/magic/src/presentation/canvas-text.ts';
  const oldCode = execFileSync('git', ['show', old.data.source.commit + ':' + file], {
    encoding: 'utf8',
  });
  const newCode = await readFile(file, 'utf8');
  const paint = (code) => {
    const start = code.indexOf('export function paintMana('),
      end = code.indexOf('\nexport function ', start + 1);
    assert(start >= 0 && end > start);
    return code.slice(start, end);
  };
  const shadowPainters = [
    {
      file,
      section: 'paintMana',
      beforeHash: hash(paint(oldCode)),
      afterHash: hash(paint(newCode)),
    },
  ];
  assert.equal(shadowPainters[0].beforeHash, shadowPainters[0].afterHash);
  const rows = [];
  for (const m of meta.rows) {
    if (!m.tokens.length) continue;
    const o = oldRows.get(m.id),
      n = newRows.get(m.id),
      c = nativeRows.get(m.id);
    assert.equal(o.referenceHash, n.referenceHash);
    assert.equal(n.referenceHash, c.referenceHash);
    assert.equal(n.inputHash, c.inputHash);
    assert.equal(n.layers.face.sha256, c.nativeFaceHash);
    const images = [];
    for (const [directory, row] of [
      [beforeDirectory, o],
      [nativeDirectory, n],
    ]) {
      const bytes = await readFile(path.join(directory, row.layers.face.file));
      assert.equal(hash(bytes), row.layers.face.sha256);
      const image = PNG.sync.read(bytes, { checkCRC: true });
      assert.equal(image.width, 732);
      assert.equal(image.height, 1020);
      images.push(image);
    }
    const tokens = m.tokens.map((t) => {
      const before = manaInterior(images[0], t),
        after = manaInterior(images[1], t);
      assert.deepEqual(before, after, 'Native mana interior changed: ' + c.name + ' ' + t.symbol);
      return { ...t, pixels: after.pixels, beforeHash: before.sha256, afterHash: after.sha256 };
    });
    const { id, name, number, nonfoil, referenceHash, poseHash, inputHash, nativeFaceHash } = c;
    rows.push({
      id,
      name,
      number,
      nonfoil,
      referenceHash,
      poseHash,
      inputHash,
      nativeFaceHash,
      adoptedFaceHash: o.layers.face.sha256,
      family: m.family,
      score100: c.components.mana.score100,
      tokens,
    });
  }
  const sources = Object.fromEntries(
    await Promise.all(
      ['modern-mana-adoption-review.mjs', 'modern-mana-reuse.mjs', 'calibration-m21-mana.mjs'].map(
        async (n) => [
          'games/magic/tools/accuracy/' + n,
          hash(await readFile(new URL(n, import.meta.url))),
        ],
      ),
    ),
  );
  const receipt = {
    schema: 1,
    set: 'm21',
    status: 'released-mana-calibration-reused-with-native-parity',
    reviewedAt: new Date().toISOString(),
    policy: {
      independentHoldout: false,
      foilPigmentFit: false,
      rendererChanges: false,
      scope:
        'Cost-disc geometry and color only. All264 cost-bearing Original printings; shared normal and walker fits. Nine nonfoil walker donors cover all WUBRG/N colors; five foil-only walkers receive the same geometry/style without pigment fitting.',
      method:
        'Reuse the measured perimeter, filled-glyph, paper and shadow trials adopted in profile6. Current controls match exactly. At native732x1020, hash every RGBA pixel inside each cost ellipse inset by2 canonical pixels. This checks opaque glyph/paper and placement without mixing in changed title backgrounds. Edge/shadow reuse additionally requires identical selected controls, pinned asset bytes and paintMana source. No whole-card or unrelated-component approval.',
    },
    definition: {
      ...census.detail.definition,
      beforeInputsHash: a.sha256,
      beforeCaptureHash: old.sha256,
      beforeRendererHash: old.data.source.rendererHash,
      browser: current.data.source.browser,
      manaSources,
      shadowPainters,
      sources,
      evidenceGuards: guards,
    },
    parameters: meta.mana,
    selectedParameters,
    summary: {
      cards: rows.length,
      nonfoilCards: rows.filter((r) => r.nonfoil).length,
      foilOnlyCards: rows.filter((r) => !r.nonfoil).length,
      tokens: rows.reduce((n, r) => n + r.tokens.length, 0),
      pixels: rows.reduce((n, r) => n + r.tokens.reduce((v, t) => v + t.pixels, 0), 0),
      changedInteriors: 0,
      nonfoilStructure100:
        rows.filter((r) => r.nonfoil).reduce((n, r) => n + r.score100, 0) /
        rows.filter((r) => r.nonfoil).length,
      transferredFoilIds: rows.filter((r) => !r.nonfoil).map((r) => r.id),
    },
    rows,
    benchmark: {
      elapsedMs: performance.now() - started,
      scope:
        'One Node process, cached PNG decoding and CPU hashing plus Vite module evaluation. No Chromium rendering, scan fit or GPU submission/completion.',
    },
  };
  checkManaReuse(receipt, census.detail);
  const raw = Buffer.from(JSON.stringify(receipt) + '\n'),
    compressed = gzipSync(raw, { level: 9 });
  await writeFile(output + '.gz', compressed);
  await writeJson(output, {
    ...receipt,
    rows: undefined,
    evidence: {
      file: path.basename(output) + '.gz',
      sha256: hash(compressed),
      contentSha256: hash(raw),
    },
  });
  console.log(JSON.stringify(receipt.summary));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await main(process.argv.slice(2));
