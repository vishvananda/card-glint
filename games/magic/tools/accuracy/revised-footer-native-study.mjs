import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { openBrowser } from './browser.mjs';

const [inputFile, poseFile, captureFile, definitionFile, out, mode = 'full'] =
  process.argv.slice(2);
assert(
  inputFile && poseFile && captureFile && definitionFile && out && ['full', 'pilot'].includes(mode),
  'Usage: revised-footer-native-study.mjs INPUTS POSES NATIVE_CAPTURE DEFINITION NEW_OUTPUT [full|pilot]',
);
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const ib = await fs.readFile(inputFile),
  pb = await fs.readFile(poseFile),
  cb = await fs.readFile(captureFile),
  db = await fs.readFile(definitionFile),
  inputs = JSON.parse(ib),
  poses = JSON.parse(pb),
  capture = JSON.parse(cb),
  definition = JSON.parse(db),
  rendererHash = await sourceHash(root + '/games/magic/src');
assert.equal(inputs.set, '3ed');
assert.equal(poses.set, '3ed');
assert.equal(capture.rendererHash, rendererHash);
assert.equal(capture.inputHash, hash(ib));
assert.equal(poses.source.inputHash, hash(ib));
const selected = {};
for (const role of ['artist', 'stats']) {
  const candidates = definition[role];
  assert(Array.isArray(candidates) && candidates.length >= 1 && candidates.length <= 200);
  assert.equal(new Set(candidates.map((p) => p.id)).size, candidates.length);
  assert.deepEqual(candidates[0], { id: 'current', dx: 0, dy: 0, sizeDelta: 0, width: 1 });
  for (const p of candidates)
    assert(
      typeof p.id === 'string' &&
        p.id.length &&
        ['dx', 'dy', 'sizeDelta', 'width'].every((k) => Number.isFinite(p[k])) &&
        Math.abs(p.dx) <= 6 &&
        Math.abs(p.dy) <= 6 &&
        Math.abs(p.sizeDelta) <= 3 &&
        p.width >= 0.9 &&
        p.width <= 1.1,
    );
  selected[role] = candidates.find((p) => p.id === (definition.selection?.[role] ?? 'current'));
  assert(selected[role]);
}
const helperNames = [
    'text-filled-objective.mjs',
    'edges.mjs',
    'abu-type-objective.mjs',
    'pixels-pure.mjs',
  ],
  helperHashes = async () =>
    Object.fromEntries(
      await Promise.all(
        helperNames.map(async (n) => [n, hash(await fs.readFile(new URL(n, import.meta.url)))]),
      ),
    ),
  kernels = await helperHashes();
await fs.writeFile(out, JSON.stringify({ status: 'starting' }), { flag: 'wx' });
const proof = {},
  session = await openBrowser(inputs, {
    plugins: [
      {
        name: 'revised-footer-observation',
        enforce: 'pre',
        transform(source, id) {
          if (!id.split('?')[0].endsWith('/revised-lettering.ts')) return;
          let code = source;
          for (const [needle, replacement] of [
            [
              'export function paintRevisedCredits(c: CanvasContext, artist: string) {',
              "export function paintRevisedCredits(c: CanvasContext, artist: string) {\n if((globalThis as any).__footerProbe?.('artist',c,{artist})) return;",
            ],
            [
              '  c.font = \'27.25px "CardRenderer MTG MPlantin", Georgia\';',
              "  if((globalThis as any).__footerProbe?.('stats',c,{text,y,liveChanges})){c.restore();return;}\n  c.font = '27.25px \"CardRenderer MTG MPlantin\", Georgia';",
            ],
          ]) {
            assert.equal(code.split(needle).length, 2, id);
            code = code.replace(needle, replacement);
          }
          const p = { before: hash(source), after: hash(code) };
          if (proof.revised) assert.deepEqual(proof.revised, p);
          proof.revised = p;
          return code;
        },
      },
    ],
  });
const rows = [],
  start = performance.now();
try {
  for (const [material, g] of Object.entries(poses.groups)) {
    const eligible = g.rows.filter((r) => r.accepted);
    for (const p of mode === 'pilot' ? eligible.slice(0, 2) : eligible) {
      const e = inputs.entries.find((e) => e.id === p.id),
        native = capture.rows.find((r) => r.id === p.id);
      assert.equal(e.face.wordingMode, 'original');
      assert.equal(p.referenceHash, e.reference.sha256);
      const sb = await readObject(e.reference);
      assert.equal(hash(sb), e.reference.sha256);
      const scan = normalize(PNG.sync.read(sb), p.transform);
      const url =
        'data:image/png;base64,' +
        PNG.sync
          .write({ width: 488, height: 680, data: Buffer.from(scan.data) })
          .toString('base64');
      const result = await session.page.evaluate(
        async ({ e, url, definition, selected }) => {
          await import('/games/magic/src/data/eager.ts');
          await import('/games/magic/src/data/eager-wording.ts');
          const { composeCardTexture } = await import(
              '/games/magic/src/presentation/canvas-face.ts'
            ),
            { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
            { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
            { paintRevisedCredits, paintRevisedStats } = await import(
              '/games/magic/src/presentation/revised-lettering.ts'
            ),
            { paintRetroGrayText } = await import(
              '/games/magic/src/presentation/retro-lettering.ts'
            ),
            { nativeGrayCrop } = await import('/games/magic/tools/accuracy/abu-type-objective.mjs'),
            { TextFilledObjective } = await import(
              '/games/magic/tools/accuracy/text-filled-objective.mjs'
            ),
            { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
          const signal = new AbortController().signal,
            face = e.face,
            input = { face, printingId: e.id, printedImage: null },
            lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration),
            hooks = { loadImages: async () => ({ ...lease, dispose() {} }) },
            scratch = [];
          const properties = [
            'font',
            'textAlign',
            'textBaseline',
            'letterSpacing',
            'fillStyle',
            'shadowColor',
            'shadowBlur',
            'shadowOffsetX',
            'shadowOffsetY',
            'globalAlpha',
            'globalCompositeOperation',
            'filter',
            'imageSmoothingEnabled',
            'imageSmoothingQuality',
            'fontKerning',
            'textRendering',
          ];
          const make = () => {
            const canvas = Object.assign(document.createElement('canvas'), {
              width: 732,
              height: 1020,
            });
            scratch.push(canvas);
            return canvas;
          };
          try {
            const full = await composeCardTexture(input, 'inspect', signal, hooks);
            scratch.push(full);
            const fullUrl = full.toDataURL(),
              calls = {};
            globalThis.__footerProbe = (role, c, args) => {
              if (calls[role]) throw Error('Repeated footer role');
              calls[role] = {
                args,
                matrix: c.getTransform(),
                properties: Object.fromEntries(properties.map((k) => [k, c[k]])),
              };
              return true;
            };
            let background;
            try {
              background = await composeCardTexture(input, 'inspect', signal, hooks);
              scratch.push(background);
            } finally {
              delete globalThis.__footerProbe;
            }
            if (!calls.artist) throw Error('Missing artist observation ' + face.name);
            const img = new Image();
            img.src = url;
            await img.decode();
            const sc = Object.assign(document.createElement('canvas'), { width: 488, height: 680 });
            scratch.push(sc);
            sc.getContext('2d').drawImage(img, 0, 0);
            const target = sc.getContext('2d').getImageData(0, 0, 488, 680),
              actual = full.getContext('2d').getImageData(0, 0, 732, 1020),
              roles = {},
              trial = make(),
              c = trial.getContext('2d', { willReadFrequently: true });
            const paintOriginal = (role, c, state) => {
              Object.assign(c, state.properties);
              c.setTransform(state.matrix);
              if (role === 'artist') paintRevisedCredits(c, state.args.artist);
              else paintRevisedStats(c, state.args.text, state.args.y, state.args.liveChanges);
            };
            for (const [role, state] of Object.entries(calls)) {
              const under = make(),
                over = make(),
                uc = under.getContext('2d'),
                oc = over.getContext('2d');
              uc.drawImage(background, 0, 0);
              let above = false;
              for (const [other, saved] of Object.entries(calls)) {
                if (other === role) {
                  above = true;
                  continue;
                }
                paintOriginal(other, above ? oc : uc, saved);
              }
              const rect = role === 'artist' ? [42, 614, 346, 40] : [386, 610, 80, 45],
                grayTarget = cropGray(target, rect).gray,
                objective = new TextFilledObjective(
                  grayTarget,
                  rect[2],
                  rect[3],
                  new Uint8Array(rect[2] * rect[3]).fill(1),
                );
              const prepare = () => {
                c.resetTransform();
                c.clearRect(0, 0, 732, 1020);
                c.drawImage(under, 0, 0);
                Object.assign(c, state.properties);
                c.setTransform(state.matrix);
              };
              const gray = () => {
                c.save();
                c.resetTransform();
                c.shadowColor = 'transparent';
                c.globalAlpha = 1;
                c.globalCompositeOperation = 'source-over';
                c.drawImage(over, 0, 0);
                c.restore();
                const origin = [Math.floor(rect[0] * 1.5) - 1, Math.floor(rect[1] * 1.5) - 1];
                return nativeGrayCrop(
                  c.getImageData(
                    ...origin,
                    Math.ceil(rect[2] * 1.5) + 4,
                    Math.ceil(rect[3] * 1.5) + 4,
                  ),
                  rect,
                  origin,
                );
              };
              prepare();
              paintOriginal(role, c, state);
              const replay = gray(),
                baseline = nativeGrayCrop(actual, rect),
                parity = Math.max(...replay.map((v, i) => Math.abs(v - baseline[i])));
              if (parity > 1.001)
                throw Error('Footer replay mismatch ' + face.name + '/' + role + ' ' + parity);
              const scores = [];

              const draw = (p, grayValue) => {
                prepare();
                const artist = role === 'artist',
                  x = artist ? 50 : 451,
                  y = artist ? 642 : state.args.y + 11;
                c.save();
                c.translate(x + p.dx, y + p.dy);
                c.scale(p.width, 1);
                c.font =
                  (artist ? 22 : 27.25) + p.sizeDelta + 'px "CardRenderer MTG MPlantin", Georgia';
                c.textAlign = artist ? 'left' : 'right';
                if (artist) c.textBaseline = 'alphabetic';
                const shade = grayValue ?? (artist ? 171 : 212);
                paintRetroGrayText(
                  c,
                  artist ? 'Illus. © ' + state.args.artist : state.args.text,
                  0,
                  0,
                  (artist ? 338 : 130) / p.width,
                  1.25,
                  'rgb(' + [shade, shade, shade].join(',') + ')',
                  artist ? undefined : state.args.liveChanges,
                );
                c.restore();
                return gray();
              };
              for (const p of definition[role]) {
                const value = draw(p);
                if (p.id === 'current') {
                  const delta = Math.max(...value.map((v, i) => Math.abs(v - baseline[i])));
                  if (delta > 1.001)
                    throw Error(
                      'Candidate default mismatch ' + face.name + '/' + role + ' ' + delta,
                    );
                }
                scores.push(objective.score(value));
              }
              const chosen = selected[role],
                black = draw(chosen, 0),
                white = draw(chosen, 255),
                values = [];
              let support = 0,
                outside = 0;
              for (let i = 0; i < grayTarget.length; i++) {
                const alpha = (white[i] - black[i]) / 255;
                if (alpha <= 0.85) continue;
                support++;
                const value = (grayTarget[i] - black[i]) / alpha;
                if (!Number.isFinite(value)) throw Error('Nonfinite tone');
                if (value < 0 || value > 255) outside++;
                values.push(value);
              }
              values.sort((a, b) => a - b);
              const quantile = (q) =>
                values.length ? values[Math.round(q * (values.length - 1))] : null;
              const tone = {
                geometry: chosen,
                support,
                outside,
                q10: quantile(0.1),
                q25: quantile(0.25),
                median: quantile(0.5),
                q75: quantile(0.75),
                q90: quantile(0.9),
              };
              roles[role] = { rect, parity, scores, tone };
            }
            return { fullUrl, roles };
          } finally {
            delete globalThis.__footerProbe;
            for (const c of scratch) c.width = c.height = 0;
            lease.dispose();
          }
        },
        { e, url, definition, selected },
      );
      const rendered = Buffer.from(result.fullUrl.split(',')[1], 'base64');
      assert.equal(
        hash(rendered),
        native.modes.original.sha256,
        'Production native mismatch ' + e.name,
      );
      delete result.fullUrl;
      rows.push({
        id: e.id,
        name: e.name,
        material,
        cohort: p.cohort,
        referenceHash: p.referenceHash,
        poseHash: hash(JSON.stringify(p.transform)),
        nativeHash: hash(rendered),
        ...result,
      });
      console.log(rows.length, e.name, Object.keys(result.roles));
    }
  }
  assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
} finally {
  await session.close();
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const rank = {};
for (const role of ['artist', 'stats']) {
  const rr = rows.filter((r) => r.roles[role]),
    cal = rr.filter((r) => r.cohort === 'calibration'),
    val = rr.filter((r) => r.cohort === 'validation');
  rank[role] = {
    cards: rr.length,
    calibration: cal.length,
    validation: val.length,
    candidates: definition[role]
      .map((candidate, i) => ({
        candidate,
        index: i,
        calibration: mean(cal.map((r) => r.roles[role].scores[i].score)),
        validation: mean(val.map((r) => r.roles[role].scores[i].score)),
      }))
      .sort((a, b) => b.calibration - a.calibration),
  };
}
const output = {
  schema: 1,
  set: '3ed',
  status: 'prototype-not-adopted',
  source: {
    rendererHash,
    inputHash: hash(ib),
    posesHash: hash(pb),
    definitionHash: hash(db),
    kernels,
    nativeCaptureHash: hash(cb),
    toolHash,
    proof,
  },
  scope:
    'Actual native Original cards with separate source-only interior poses. Shared footer proposals selected by calibration names; validation is reused development data. Production PNG and zero-command replay parity required for every card. Filled ink and edges scored, no per-card defaults.',
  definition,
  rank,
  rows,
  time: {
    cpuWallSeconds: (performance.now() - start) / 1000,
    scope: 'CPU and browser Canvas2D composition/objective work; not GPU completion.',
  },
};
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(await helperHashes(), kernels);
await fs.writeFile(out, JSON.stringify(output, null, 2) + '\n');
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(rank).map(([k, r]) => [k, { cards: r.cards, best: r.candidates.slice(0, 5) }]),
    ),
  ),
);
