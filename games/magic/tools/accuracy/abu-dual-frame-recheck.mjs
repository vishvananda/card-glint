// Recheck the nineteen printed Alpha/Beta dual frames without refitting scans.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson, objectFile, sourceHash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { abuFractionalAncestry } from './abu-fractional-ancestry.mjs';

const [nativeDir, inputFile, alphaDir, betaDir, out] = process.argv.slice(2);
assert(out, 'Usage: abu-dual-frame-recheck.mjs NATIVE INPUTS ALPHA_PRIOR BETA_PRIOR OUT');
const proof = await abuFractionalAncestry();
assert.equal(await sourceHash('games/magic/src'), proof.afterRenderer);
const nativeBytes = await readFile(path.join(nativeDir, 'proof.json'));
assert.equal(hash(nativeBytes), proof.evidence.native.contentSha256);
const native = JSON.parse(nativeBytes),
  inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes);
assert.equal(hash(inputBytes), native.source.inputsHash);
assert.equal(native.source.afterRenderer, proof.capturedRenderer);
assert.equal(native.completed, 899);
assert.deepEqual(native.faults, []);
const old = {};
for (const [set, dir] of [
  ['lea', alphaDir],
  ['leb', betaDir],
]) {
  const bytes = await readFile(path.join(dir, 'capture.json'));
  old[set] = { dir, data: JSON.parse(bytes), captureHash: hash(bytes) };
}
const entries = inputs.entries.filter(
  (e) => ['lea', 'leb'].includes(e.set) && e.face.frameColors?.length === 2,
);
assert.equal(entries.length, 19);
assert.equal(new Set(entries.map((e) => e.id)).size, 19);
const median = (a) => {
  const b = [...a].sort((a, b) => a - b);
  return (b[Math.floor((b.length - 1) / 2)] + b[Math.ceil((b.length - 1) / 2)]) / 2;
};
const strips = {
  left: [20, 100, 25, 500, 'x'],
  right: [443, 100, 25, 500, 'x'],
  top: [80, 20, 330, 30, 'y'],
  bottom: [80, 632, 330, 32, 'y'],
  artLeft: [44, 125, 34, 200, 'x'],
  artRight: [408, 125, 36, 200, 'x'],
  artTop: [110, 60, 275, 30, 'y'],
  artBottom: [110, 350, 275, 40, 'y'],
  paperLeft: [45, 450, 40, 125, 'x'],
  paperRight: [402, 450, 45, 125, 'x'],
  paperTop: [110, 392, 275, 40, 'y'],
  paperBottom: [110, 583, 275, 40, 'y'],
};
function edgeProfile(image, [x, y, w, h, axis]) {
  const n = axis === 'x' ? w : h,
    along = axis === 'x' ? h : w;
  let rgb = Array.from({ length: n }, (_, i) =>
    [0, 1, 2].map((k) =>
      median(
        Array.from(
          { length: along },
          (_, j) =>
            image.data[((y + (axis === 'x' ? j : i)) * 488 + x + (axis === 'x' ? i : j)) * 4 + k],
        ),
      ),
    ),
  );
  for (let p = 0; p < 2; p++)
    rgb = rgb.map((v, i) =>
      v.map((_, k) => (rgb[Math.max(0, i - 1)][k] + 2 * v[k] + rgb[Math.min(n - 1, i + 1)][k]) / 4),
    );
  const edge = rgb.slice(1).map((v, i) => Math.hypot(...v.map((c, k) => c - rgb[i][k])));
  return { rgb, edge };
}
function cosine(a, b, shift) {
  let xy = 0,
    aa = 0,
    bb = 0;
  for (let i = 4; i < a.length - 4; i++) {
    const at = i - shift,
      lo = Math.floor(at),
      f = at - lo;
    const v = b[lo] * (1 - f) + b[Math.min(b.length - 1, lo + 1)] * f;
    xy += a[i] * v;
    aa += a[i] * a[i];
    bb += v * v;
  }
  return aa && bb ? xy / Math.sqrt(aa * bb) : null;
}
await mkdir(out, { recursive: true });
const rows = [];
for (const e of entries) {
  assert.equal(e.face.wordingMode, 'original');
  const n = native.rows.find((r) => r.id === e.id),
    p = old[e.set].data.rows.find((r) => r.id === e.id);
  assert(n && p);
  assert.equal(n.referenceHash, e.reference.sha256);
  assert.equal(p.referenceHash, e.reference.sha256);
  assert.equal(n.poseHash, hash(JSON.stringify(e.pose)));
  // Older tools hash just the transform; the new replay hashes the complete pose.
  assert.equal(p.poseHash, hash(JSON.stringify(e.pose.transform)));
  const b = await readFile(path.join(nativeDir, e.id + '.png'));
  assert.equal(hash(b), n.afterFaceHash);
  const pb = await readFile(path.join(old[e.set].dir, e.set, e.id + '.png'));
  assert.equal(hash(pb), p.renderHash);
  const image = PNG.sync.read(b),
    previous = PNG.sync.read(pb);
  assert.deepEqual(
    [image.width, image.height, previous.width, previous.height],
    [732, 1020, 732, 1020],
  );
  let nonRulesChanged = 0,
    rulesChanged = 0;
  for (let y = 0; y < 1020; y++)
    for (let x = 0; x < 732; x++) {
      const i = (y * 732 + x) * 4;
      if ([0, 1, 2, 3].some((k) => image.data[i + k] !== previous.data[i + k])) {
        if (x >= 75 && x <= 678 && y >= 600 && y <= 908) rulesChanged++;
        else nonRulesChanged++;
      }
    }
  assert.equal(nonRulesChanged, 0, 'A prior frame is no longer pixel-identical: ' + e.name);
  const rb = await readFile(objectFile(e.reference));
  assert.equal(hash(rb), e.reference.sha256);
  const scan = normalize(PNG.sync.read(rb), e.pose.transform),
    render = normalize(image);
  const sides = {};
  for (const [side, rect] of Object.entries(strips)) {
    const a = edgeProfile(scan, rect),
      b = edgeProfile(render, rect);
    const candidates = Array.from({ length: 33 }, (_, i) => {
      const shift = (i - 16) / 4;
      return { shift, cosine: cosine(a.edge, b.edge, shift) };
    }).filter((r) => r.cosine !== null);
    candidates.sort((a, b) => b.cosine - a.cosine || Math.abs(a.shift) - Math.abs(b.shift));
    const best = candidates[0] ?? null;
    sides[side] = {
      edgeCosine100: cosine(a.edge, b.edge, 0) * 100,
      bestDiagnostic: best,
      reference: a,
      rendered: b,
    };
  }
  const scanBytes = PNG.sync.write(scan),
    renderBytes = PNG.sync.write(render);
  await writeFile(path.join(out, e.id + '-scan.png'), scanBytes);
  await writeFile(path.join(out, e.id + '-render.png'), renderBytes);
  rows.push({
    id: e.id,
    set: e.set,
    name: e.name,
    colors: e.face.frameColors,
    referenceHash: e.reference.sha256,
    poseHash: n.poseHash,
    transformHash: p.poseHash,
    priorCaptureHash: old[e.set].captureHash,
    priorRenderHash: p.renderHash,
    renderHash: n.afterFaceHash,
    nonRulesChanged,
    rulesChanged,
    scanPreviewHash: hash(scanBytes),
    renderPreviewHash: hash(renderBytes),
    sides,
  });
}
await writeJson(path.join(out, 'report.json'), {
  schema: 1,
  status: 'native-frame-recheck-not-complete-set-certification',
  scope:
    'All nineteen printed Alpha/Beta dual lands. Exact frame-pixel replay versus previously reviewed native outline candidates. Same source scans and frozen transforms, despite the two historical pose-hash formats. Fixed outer, art and paper RGB-gradient magnitudes reduce sensitivity to hue/saturation; bounded shifts are diagnostic only and are never applied to the scan or renderer. This recheck does not fit geometry, palette, text, or certify the whole card. Existing source-frame shape limitations remain visible.',
  rendererHash: proof.afterRenderer,
  capturedRendererHash: proof.capturedRenderer,
  nativeHash: hash(nativeBytes),
  inputsHash: hash(inputBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  strips,
  summary: {
    inventory: rows.length,
    frameIdentical: rows.filter((r) => r.nonRulesChanged === 0).length,
    sets: Object.fromEntries(
      ['lea', 'leb'].map((s) => [
        s,
        {
          inventory: rows.filter((r) => r.set === s).length,
          sideMedianAbsDiagnosticShift: median(
            rows
              .filter((r) => r.set === s)
              .flatMap((r) =>
                Object.values(r.sides).map((s) => Math.abs(s.bestDiagnostic?.shift ?? 0)),
              ),
          ),
        },
      ]),
    ),
  },
  rows,
});
console.log(
  JSON.stringify({
    completed: rows.length,
    frameIdentical: rows.every((r) => r.nonRulesChanged === 0),
  }),
);
