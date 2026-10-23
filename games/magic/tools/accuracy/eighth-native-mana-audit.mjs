// Independent disc-perimeter measurements; never changes a scan transform.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { modernManaCircle, modernManaRayTemplate } from './modern-mana-ring.mjs';
import { median, quantile } from './hsb-color.mjs';

const [inputFile, nativeDirectory, scoreDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: eighth-native-mana-audit.mjs INPUTS NATIVE SCORES OUTPUT_JSON');
const read = async (file) => {
  const bytes = await readFile(file);
  return { data: JSON.parse(bytes), sha256: hash(bytes) };
};
const toolHash = hash(await readFile(new URL(import.meta.url))),
  ringToolHash = hash(await readFile(new URL('./modern-mana-ring.mjs', import.meta.url)));
const inputs = await read(inputFile),
  native = await read(path.join(nativeDirectory, 'capture.json')),
  scores = await read(path.join(scoreDirectory, 'scores.json'));
assert.equal(inputs.data.set, '8ed');
assert.equal(inputs.data.entries.length, 357);
assert.equal(native.data.completed, 357);
assert.equal(native.data.source.inputsHash, inputs.sha256);
assert.equal(scores.data.definition.inputsHash, inputs.sha256);
assert.equal(scores.data.definition.nativeCaptureHash, native.sha256);
assert.deepEqual(native.data.faults, []);
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  native.data.source.rendererHash,
  'Expected geometry must come from the captured renderer',
);
assert(inputs.data.entries.every((e) => e.face.wordingMode === 'original'));
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
});
let metadata;
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { framePlate } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const { faceRects, faceFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/special-frames.ts',
  );
  const { FACE_RECTS, FACE_TEXT } = await server.ssrLoadModule(
    '/games/magic/src/presentation/face-layout.ts',
  );
  const { printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const { BITMAP_MANA_COLORS, hexManaColor } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-colors.ts',
  );
  const { modernCostMana } = await server.ssrLoadModule(
    '/games/magic/src/presentation/modern-cost-mana.ts',
  );
  const { calibratedManaTarget } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  metadata = inputs.data.entries.map((e) => {
    const face = e.face,
      tokens = face.manaSymbols ?? [],
      plate = framePlate(face);
    const adjustment = printingManaAdjustment(face) ?? {},
      sx = adjustment.scaleX ?? 1,
      sy = adjustment.scaleY ?? 1;
    const title = (plate ? FACE_RECTS.title : faceRects(face).title).map(
      (v, i) => v * (i % 2 ? 680 : 488),
    );
    const size = plate?.mana.size ?? FACE_TEXT.manaSize;
    const gap = (plate?.mana.gap ?? FACE_TEXT.manaGap) + (adjustment.spacing ?? 0);
    const right = plate ? plate.mana.right * 488 : title[0] + title[2] - FACE_TEXT.plateRight;
    const cy = plate ? plate.mana.center * 680 : title[1] + title[3] / 2 + FACE_TEXT.manaLift / 2;
    return {
      id: e.id,
      kind: faceFrame(face),
      adjustment,
      expected: tokens.map((symbol, index) => ({
        symbol,
        paper:
          /^\d+$/.test(symbol) && modernCostMana(face)
            ? modernCostMana(face).paper
            : (
                calibratedManaTarget(face, /^\d+$/.test(symbol) ? 'N' : symbol) ??
                hexManaColor(
                  BITMAP_MANA_COLORS[/^\d+$/.test(symbol) || symbol === 'X' ? 'N' : symbol],
                )
              ).map((v) => v * 255),
        index,
        fromRight: tokens.length - index - 1,
        x:
          right -
          0.5 +
          (adjustment.dx ?? 0) -
          (size / 2 + (tokens.length - index - 1) * (size + gap)) * sx,
        y: cy - 0.5 + (adjustment.dy ?? 0),
        radius: (size * (sx + sy)) / 4,
        radiusX: (size * sx) / 2,
        radiusY: (size * sy) / 2,
      })),
    };
  });
} finally {
  await server.close();
}

function crop(image, x, y, side = 48) {
  const left = Math.round(x - side / 2),
    top = Math.round(y - side / 2);
  assert(left >= 0 && top >= 0 && left + side < image.width && top + side < image.height);
  const data = new Uint8Array(side * side * 4);
  for (let row = 0; row < side; row++)
    data.set(
      image.data.subarray(
        ((top + row) * image.width + left) * 4,
        ((top + row) * image.width + left + side) * 4,
      ),
      row * side * 4,
    );
  return { image: { width: side, height: side, data }, left, top };
}
function ring(image, expected, template) {
  const c = crop(image, expected.x, expected.y);
  const result = modernManaCircle(c.image, {
    x: expected.x - c.left,
    y: expected.y - c.top,
    range: 3,
    radiusRange: [expected.radius - 2, expected.radius + 2],
    paper: expected.paper,
    rayMask: template.mask,
    rayThresholds: template.thresholds,
  });
  return { ...result, x: result.x + c.left, y: result.y + c.top };
}
const rows = [];
for (const e of inputs.data.entries) {
  const geometry = metadata.find((m) => m.id === e.id);
  if (!geometry.expected.length) continue;
  const captured = native.data.rows.find((r) => r.id === e.id),
    scored = scores.data.rows.find((r) => r.id === e.id);
  assert(captured && scored);
  assert.equal(captured.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(captured.layers.face.sha256, scored.renderHash);
  assert.equal(captured.referenceHash, e.reference.sha256);
  const raw = await readFile(path.join(nativeDirectory, captured.layers.face.file)),
    ref = await readFile(path.join(scoreDirectory, scored.normalizedReference.file));
  assert.equal(hash(raw), captured.layers.face.sha256);
  assert.equal(hash(ref), scored.normalizedReference.sha256);
  const render = normalize(PNG.sync.read(raw, { checkCRC: true })),
    scan = PNG.sync.read(ref, { checkCRC: true });
  assert.equal(scan.width, 488);
  assert.equal(scan.height, 680);
  const discs = geometry.expected.map((expected) => {
    const template = modernManaRayTemplate(render, expected);
    const a = ring(render, expected, template),
      b = ring(scan, expected, template);
    const nativeControl =
      Math.abs(a.x - expected.x) <= 0.75 &&
      Math.abs(a.y - expected.y) <= 0.75 &&
      Math.abs(a.radius - expected.radius) <= 0.75;
    const accepted =
      nativeControl &&
      a.status === 'measured' &&
      b.status === 'measured' &&
      scored.poseAccepted &&
      e.card.finishes.includes('nonfoil');
    return {
      ...expected,
      template,
      nativeControl,
      render: a,
      scan: b,
      accepted,
      delta: { dx: b.x - a.x, dy: b.y - a.y, diameter: 2 * (b.radius - a.radius) },
    };
  });
  rows.push({
    id: e.id,
    name: e.card.name,
    number: e.card.collector_number,
    kind: geometry.kind,
    poseAccepted: scored.poseAccepted,
    nonfoil: e.card.finishes.includes('nonfoil'),
    inputHash: captured.inputHash,
    referenceHash: captured.referenceHash,
    renderHash: scored.renderHash,
    poseHash: scored.poseHash,
    discs,
  });
  if (rows.length % 25 === 0) console.log('mana audit', rows.length);
}
function summarize(discs) {
  const accepted = discs.filter((d) => d.accepted);
  const stats = (key) =>
    accepted.length
      ? {
          median: median(accepted.map((d) => d.delta[key])),
          p10: quantile(
            accepted.map((d) => d.delta[key]),
            0.1,
          ),
          p90: quantile(
            accepted.map((d) => d.delta[key]),
            0.9,
          ),
        }
      : null;
  return {
    total: discs.length,
    accepted: accepted.length,
    dx: stats('dx'),
    dy: stats('dy'),
    diameter: stats('diameter'),
    status: Object.fromEntries(
      ['render', 'scan'].map((k) => [
        k,
        Object.fromEntries(
          [...new Set(discs.map((d) => d[k].status))]
            .sort()
            .map((s) => [s, discs.filter((d) => d[k].status === s).length]),
        ),
      ]),
    ),
  };
}
const all = rows.flatMap((r) => r.discs);
assert.equal(
  all.length,
  metadata.reduce((n, m) => n + m.expected.length, 0),
);
const groups = Object.fromEntries(
  [...new Set(rows.map((r) => r.kind))].sort().map((kind) => {
    const discs = rows.filter((r) => r.kind === kind).flatMap((r) => r.discs);
    return [
      kind,
      {
        all: summarize(discs),
        symbols: Object.fromEntries(
          [...new Set(discs.map((d) => (/^\d+$/.test(d.symbol) ? 'N' : d.symbol)))]
            .sort()
            .map((symbol) => [
              symbol,
              summarize(discs.filter((d) => (/^\d+$/.test(d.symbol) ? 'N' : d.symbol) === symbol)),
            ]),
        ),
      },
    ];
  }),
);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), native.data.source.rendererHash);
assert.equal(
  hash(await readFile(new URL(import.meta.url))),
  toolHash,
  'Audit tool changed during run',
);
assert.equal(
  hash(await readFile(new URL('./modern-mana-ring.mjs', import.meta.url))),
  ringToolHash,
  'Perimeter algorithm changed during run',
);
await writeJson(output, {
  schema: 1,
  status: 'disc-perimeter-diagnostic-not-calibration',
  eligibleForPublication: false,
  scope:
    'All Eighth Original cost tokens with fixed normalized reference rasters. Bounded independent perimeter detection measures scan/render centers and diameter; it does not change scan poses, renderer positions, glyphs, colors or shadows. Weak/boundary results and foil-only references stay explicit. Circle averages do not certify ellipses, pigment, glyph registration or shadow shape.',
  source: {
    inputsHash: inputs.sha256,
    nativeHash: native.sha256,
    scoresHash: scores.sha256,
    rendererHash: native.data.source.rendererHash,
    algorithm: 'source-paper-arcs-saturated-v4',
    toolHash,
    ringToolHash,
  },
  summary: summarize(all),
  groups,
  rows,
});
console.log(JSON.stringify({ cards: rows.length, ...summarize(all), groups }));
