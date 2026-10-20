// Source identity comparison. This predicts no runtime font or placement changes.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [native, currentFile, auditFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-mana-x-study.mjs NATIVE CURRENT_INPUTS AUDIT OUT');
const raw = await Promise.all(
  [path.join(native, 'capture.json'), path.join(native, 'inputs.json'), currentFile, auditFile].map(
    (f) => readFile(f),
  ),
);
const [capture, inputs, current, audit] = raw.map((b) => JSON.parse(b));
const entries = current.entries.filter((e) => e.face.manaSymbols?.includes('X'));
assert.equal(entries.length, 13);
assert(!entries.some((e) => e.name === 'Drain Life'));
const fonts = inputs.components.filter(
  (a) => /\/fonts\//.test(a.url) && !/(mana\.woff|mplantin-i|relay|beleren|NDPMTG)/.test(a.url),
);
assert.equal(fonts.length, 6);
const asset = inputs.components.find((a) => a.url.endsWith('/X.svg'));
assert(asset);
const candidates = [
  { id: 'source-X', ...asset },
  ...fonts.map((a, i) => ({ ...a, id: 'font-' + i })),
];
await mkdir(output);
const session = await openBrowser({ ...inputs, entries }, { fonts: false }),
  sources = [];
try {
  for (const candidate of candidates) {
    const data = await session.page.evaluate(
      async ({ candidate }) => {
        const c = document.createElement('canvas');
        c.width = c.height = 100;
        const ctx = c.getContext('2d');
        if (candidate.id === 'source-X') {
          const im = new Image();
          im.crossOrigin = 'anonymous';
          im.src = candidate.url;
          await im.decode();
          ctx.drawImage(im, 0, 0, 100, 100);
        } else {
          const font = new FontFace(candidate.id, await (await fetch(candidate.url)).arrayBuffer());
          await font.load();
          document.fonts.add(font);
          ctx.fillStyle = '#cac5c0';
          ctx.beginPath();
          ctx.arc(50, 50, 50, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#0d0f0f';
          ctx.font = '100px ' + candidate.id;
          const m = ctx.measureText('X'),
            w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
            h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
          if (!(w > 0 && h > 0)) throw Error('Font has no measurable X');
          ctx.translate(50, 50);
          const s = 70 / Math.max(w, h);
          ctx.scale(s, s);
          ctx.fillText(
            'X',
            (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
            (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
          );
        }
        return c.toDataURL().split(',')[1];
      },
      { candidate },
    );
    const bytes = Buffer.from(data, 'base64'),
      file = candidate.id + '.png';
    await writeFile(path.join(output, file), bytes);
    sources.push({ ...candidate, file, pngHash: hash(bytes) });
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const thresholds = [0.38, 0.48, 0.58];
const sourceMasks = await Promise.all(
  sources.map(async (s) => {
    const bytes = await readFile(path.join(output, s.file));
    assert.equal(hash(bytes), s.pngHash);
    const im = PNG.sync.read(bytes);
    return thresholds.map((thresholdFraction) =>
      manaGlyphMask(im, { x: 50, y: 50, radius: 50 }, false, {
        normalizeBounds: true,
        thresholdFraction,
      }),
    );
  }),
);
const rows = [];
for (const e of entries) {
  const old = inputs.entries.find((a) => a.id === e.id),
    r = capture.rows.find((a) => a.id === e.id),
    a = audit.rows.find((a) => a.id === e.id);
  assert.deepEqual(e.face.manaSymbols, old.face.manaSymbols);
  assert.equal(e.reference.sha256, r.referenceHash);
  assert.equal(a.poseHash, r.poseHash);
  assert.equal(hash(JSON.stringify(old.pose.transform)), r.poseHash);
  const bytes = await readFile(path.join(native, old.set, e.id + '-scan.png'));
  assert.equal(hash(bytes), r.scanHash);
  const im = normalize(PNG.sync.read(bytes));
  // Perimeter localization is a measurement of the symbol, never a raster registration.
  const circle = outerManaCircle(im, {
    x: a.scan.circle.x - (e.face.manaSymbols.length - 1) * 27,
    y: a.scan.circle.y,
    range: 5,
    radiusRange: [9.5, 14],
  });
  const masks = thresholds.map((thresholdFraction) =>
    manaGlyphMask(im, circle, false, { normalizeBounds: true, thresholdFraction }),
  );
  const failures = [
    ...(circle.status === 'measured' ? [] : [circle.status]),
    ...masks.flatMap((m) => (m.status === 'measured' ? [] : [m.status])),
  ];
  const scores = sources.map((s, i) => ({
    id: s.id,
    score: failures.length
      ? null
      : median(
          masks.map((m, j) => {
            assert.equal(sourceMasks[i][j].status, 'measured');
            return compareManaGlyph(m.ink, sourceMasks[i][j].ink).score;
          }),
        ),
  }));
  rows.push({
    id: e.id,
    name: e.name,
    cohort: old.pose.cohort,
    referenceHash: r.referenceHash,
    scanHash: r.scanHash,
    poseHash: r.poseHash,
    circle,
    failures,
    scores,
  });
}
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const accepted = rows.filter((r) => !r.failures.length);
const groups = Object.fromEntries(
  ['all', 'calibration', 'validation'].map((cohort) => {
    const rr = accepted.filter((r) => cohort === 'all' || r.cohort === cohort);
    return [
      cohort,
      {
        count: rr.length,
        candidates: sources
          .map((s) => ({
            id: s.id,
            mean100: 100 * mean(rr.map((r) => r.scores.find((t) => t.id === s.id).score)),
          }))
          .sort((a, b) => b.mean100 - a.mean100),
      },
    ];
  }),
);
await writeJson(path.join(output, 'report.json'), {
  schema: 1,
  status: 'source-identity-diagnostic-not-native-candidate',
  sources: {
    nativeCapture: hash(raw[0]),
    nativeInputs: hash(raw[1]),
    currentInputs: hash(raw[2]),
    audit: hash(raw[3]),
    tool: hash(await readFile(new URL(import.meta.url))),
    dependencies: await Promise.all(
      ['abu-mana-ring.mjs', 'mana-glyph-metrics.mjs', 'pixels-pure.mjs', 'hsb-color.mjs'].map(
        async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))],
      ),
    ),
  },
  scope:
    'All thirteen actual Unlimited X costs; corrected Drain Life excluded before selection. Existing cached font/source bytes only. Three-threshold bounds-normalized shape identity discards physical scale/centering and is not a rendered placement score. Circle searches measure pips without changing fixed scan poses. A source winner still requires physical geometry fitting, actual native whole-card replay and component/alpha isolation before runtime adoption. Validation is reused development data.',
  thresholds,
  candidates: sources,
  total: rows.length,
  accepted: accepted.length,
  groups,
  rows,
});
console.log(JSON.stringify(groups, null, 2));
