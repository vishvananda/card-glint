// Source-bound heading geometry trial. Only filled font painters are candidates.
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, poseFile, nativeDirectory, definitionFile, output, mode = 'pilot'] =
  process.argv.slice(2);
assert(
  output && ['pilot', 'full'].includes(mode),
  'Usage: revised-heading-native-study.mjs INPUTS POSES NATIVE DEFINITION NEW_OUTPUT [pilot|full]',
);
const files = [inputFile, poseFile, path.join(nativeDirectory, 'capture.json'), definitionFile],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, definition] = bytes.map((b) => JSON.parse(b)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  proof = {},
  rows = [];
assert.equal(capture.rendererHash, rendererHash);
assert.equal(capture.inputHash, hash(bytes[0]));
assert.equal(poses.source.inputHash, hash(bytes[0]));
assert.equal(inputs.set, '3ed');
for (const role of ['title', 'type']) {
  const cs = definition[role];
  assert(Array.isArray(cs) && cs.length && cs.length <= 150);
  assert.deepEqual(cs[0], { id: 'current', dx: 0, dy: 0, sizeDelta: 0, width: 1 });
  for (const c of cs) {
    assert(['dx', 'dy', 'sizeDelta', 'width'].every((k) => Number.isFinite(c[k])));
    assert(
      Math.abs(c.dx) <= 8 &&
        Math.abs(c.dy) <= 8 &&
        Math.abs(c.sizeDelta) <= 3 &&
        c.width >= 0.9 &&
        c.width <= 1.1,
    );
    assert(
      !c.font ||
        ['Goudy', 'MPlantin', ...(definition.fonts ?? []).map((f) => f.id)].includes(c.font),
    );
    assert(c.gray === undefined || (Number.isFinite(c.gray) && c.gray >= 0 && c.gray <= 255));
    assert(c.offset === undefined || (Number.isFinite(c.offset) && c.offset >= 0 && c.offset <= 2));
    assert(
      c.wordSpacing === undefined ||
        (Number.isFinite(c.wordSpacing) && Math.abs(c.wordSpacing) <= 3),
    );
    assert(c.shadow === undefined || ['native', 'solid'].includes(c.shadow));
  }
}
const moduleNames = [
  'text-filled-objective.mjs',
  'edges.mjs',
  'abu-type-objective.mjs',
  'pixels-pure.mjs',
  'scan-transform.mjs',
  'metrics.mjs',
  'browser.mjs',
  'abu-assets.mjs',
  'native-rgba-crop.mjs',
  'hsb-color.mjs',
];
const moduleHashes = async () =>
  Object.fromEntries(
    await Promise.all(
      moduleNames.map(async (file) => [
        file,
        hash(await fs.readFile(new URL(file, import.meta.url))),
      ]),
    ),
  );
const modules = await moduleHashes();
const plugin = {
  name: 'revised-heading-retained-native',
  enforce: 'pre',
  transform(source, id) {
    let needle, replacement;
    if (id.endsWith('/revised-lettering.ts')) {
      needle = ') {\n  c.save();\n  c.font = \'26px "CardRenderer MTG Goudy", Georgia\';';
      replacement =
        ') {\n  if((globalThis as any).__headingProbe?.("title",c,{text,originalX,y,maxWidth}))return;\n  c.save();\n  c.font = \'26px "CardRenderer MTG Goudy", Georgia\';';
    } else if (id.endsWith('/retro-paint.ts')) {
      needle = '    : (text: string, x: number, y: number, width: number) => {';
      replacement =
        needle +
        '\n        if((globalThis as any).__headingProbe?.("type",c,{text,x,y,width}))return;';
    } else return;
    assert.equal(source.split(needle).length, 2);
    const code = source.replace(needle, replacement),
      file = id.split('/').at(-1),
      p = { before: hash(source), after: hash(code) };
    if (proof[file]) assert.deepEqual(proof[file], p);
    proof[file] = p;
    return code;
  },
};
const session = await openBrowser(
  {
    ...inputs,
    components: [
      ...(inputs.components ?? []),
      ...capture.extraAssets,
      ...(definition.fonts ?? []).map((f) => f.asset),
    ],
  },
  { plugins: [plugin] },
);
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
try {
  await session.page.evaluate(async (fonts) => {
    for (const font of fonts) {
      const r = await fetch(font.asset.url);
      if (!r.ok) throw Error('Study font unavailable');
      const f = new FontFace('CardRenderer MTG ' + font.id, await r.arrayBuffer(), {
        weight: '400',
      });
      document.fonts.add(await f.load());
    }
  }, definition.fonts ?? []);
  for (const [material, g] of Object.entries(poses.groups)) {
    const eligible = g.rows.filter((p) => p.accepted),
      selected =
        mode === 'full'
          ? eligible
          : ['calibration', 'validation'].flatMap((cohort) =>
              eligible.filter((p) => p.cohort === cohort).slice(0, 1),
            );
    for (const p of selected) {
      const e = inputs.entries.find((e) => e.id === p.id),
        n = capture.rows.find((n) => n.id === p.id),
        scanBytes = await fs.readFile(objectFile(e.reference));
      assert.equal(e.face.wordingMode, 'original');
      assert.equal(hash(scanBytes), p.referenceHash);
      const scan = normalize(PNG.sync.read(scanBytes), p.transform),
        url =
          'data:image/png;base64,' +
          PNG.sync
            .write({ width: 488, height: 680, data: Buffer.from(scan.data) })
            .toString('base64');
      const value = await session.page.evaluate(
        async ({ e, url, definition, material }) => {
          await import('/games/magic/src/data/eager.ts');
          await import('/games/magic/src/data/eager-wording.ts');
          const { composeCardTexture } = await import(
              '/games/magic/src/presentation/canvas-face.ts'
            ),
            { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
            { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
            { paintRevisedTitle } = await import(
              '/games/magic/src/presentation/revised-lettering.ts'
            ),
            { paintRetroGrayText } = await import(
              '/games/magic/src/presentation/retro-lettering.ts'
            ),
            { paintTextInk } = await import('/games/magic/src/presentation/text-ink.ts'),
            { nativeRgbaCrop } = await import('/games/magic/tools/accuracy/native-rgba-crop.mjs'),
            { delta } = await import('/games/magic/tools/accuracy/hsb-color.mjs'),
            { TextFilledObjective } = await import(
              '/games/magic/tools/accuracy/text-filled-objective.mjs'
            ),
            { nativeGrayCrop } = await import('/games/magic/tools/accuracy/abu-type-objective.mjs'),
            { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs'),
            signal = new AbortController().signal,
            lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
            hooks = { loadImages: async () => ({ ...lease, dispose() {} }) },
            scratch = [];
          const canvas = (w, h) => {
            const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
            scratch.push(c);
            return c;
          };
          const props = [
            'font',
            'textAlign',
            'textBaseline',
            'letterSpacing',
            'wordSpacing',
            'fillStyle',
            'shadowColor',
            'shadowBlur',
            'shadowOffsetX',
            'shadowOffsetY',
            'globalAlpha',
            'globalCompositeOperation',
            'filter',
            'fontKerning',
            'textRendering',
          ];
          try {
            const full = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              hooks,
            );
            scratch.push(full);
            const fullBytes = Uint8Array.from(atob(full.toDataURL().split(',')[1]), (v) =>
                v.charCodeAt(0),
              ),
              fullHash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', fullBytes))]
                .map((v) => v.toString(16).padStart(2, '0'))
                .join(''),
              calls = {};
            globalThis.__headingProbe = (role, c, args) => {
              if (calls[role]) throw Error('Repeated heading role');
              const m = c.getTransform();
              calls[role] = {
                args,
                m: [m.a, m.b, m.c, m.d, m.e, m.f],
                props: Object.fromEntries(props.map((k) => [k, c[k]])),
              };
              return true;
            };
            let background;
            try {
              background = await composeCardTexture(
                { face: e.face, printingId: e.id, printedImage: null },
                'inspect',
                signal,
                hooks,
              );
              scratch.push(background);
            } finally {
              delete globalThis.__headingProbe;
            }
            if (!calls.title || !calls.type) throw Error('Missing heading observation');
            const refImage = new Image();
            refImage.src = url;
            await refImage.decode();
            const reference = canvas(488, 680);
            reference.getContext('2d').drawImage(refImage, 0, 0);
            const refPixels = reference.getContext('2d').getImageData(0, 0, 488, 680),
              result = {};
            for (const role of ['title', 'type']) {
              const s = calls[role],
                cost = e.face.manaSymbols?.length ?? 0,
                right = cost ? Math.floor(435 - (cost - 1) * 27 - 23.4 / 2 - 4) : 458,
                rect = role === 'title' ? [32, 32, right - 32, 32] : [42, 378, 407, 34],
                origin = [Math.floor(rect[0] * 1.5) - 2, Math.floor(rect[1] * 1.5) - 2],
                w = Math.ceil((rect[0] + rect[2]) * 1.5) + 2 - origin[0],
                h = Math.ceil((rect[1] + rect[3]) * 1.5) + 2 - origin[1],
                under = background.getContext('2d').getImageData(...origin, w, h),
                native = full.getContext('2d').getImageData(...origin, w, h),
                trial = canvas(w, h),
                c = trial.getContext('2d', { willReadFrequently: true }),
                inverted = material !== 'W',
                values = (a) => (inverted ? Float32Array.from(a, (v) => 255 - v) : a),
                target = cropGray(refPixels, rect).gray,
                objective = new TextFilledObjective(
                  values(target),
                  rect[2],
                  rect[3],
                  new Uint8Array(rect[2] * rect[3]).fill(1),
                ),
                setup = () => {
                  c.resetTransform();
                  c.clearRect(0, 0, w, h);
                  c.putImageData(under, 0, 0);
                  Object.assign(c, s.props);
                  c.setTransform(
                    s.m[0],
                    s.m[1],
                    s.m[2],
                    s.m[3],
                    s.m[4] - origin[0],
                    s.m[5] - origin[1],
                  );
                },
                read = () => nativeGrayCrop(c.getImageData(0, 0, w, h), rect, origin);
              const original = () => {
                if (role === 'title')
                  paintRevisedTitle(c, s.args.text, s.args.originalX, s.args.y, s.args.maxWidth);
                else
                  paintTextInk(
                    c,
                    s.args.text,
                    s.args.x,
                    s.args.y,
                    s.args.width,
                    e.face.textInk,
                    'type',
                  );
              };
              setup();
              original();
              const referenceNative = nativeGrayCrop(native, rect, origin),
                replayed = read(),
                parity = Math.max(...replayed.map((v, i) => Math.abs(v - referenceNative[i])));
              if (parity > 1.001) throw Error('Heading baseline parity ' + role + ' ' + parity);
              const readRaster = () => c.getImageData(0, 0, w, h);
              const draw = (p, override) => {
                setup();
                c.save();
                const title = role === 'title',
                  x = title ? 40 : s.args.x,
                  y = s.args.y,
                  family = p.font ?? (title ? 'Goudy' : 'MPlantin'),
                  width = title ? s.args.maxWidth + s.args.originalX - (x + p.dx) : s.args.width,
                  shade = override ?? p.gray,
                  fill =
                    shade === undefined
                      ? undefined
                      : 'rgb(' + [shade, shade, shade].join(',') + ')';
                c.translate(x + p.dx, y + p.dy);
                const nativeLine = c.measureText('Hg');
                c.scale(p.width, 1);
                c.font =
                  (title ? 26 : 21.7) +
                  p.sizeDelta +
                  'px "CardRenderer MTG ' +
                  family +
                  '", Georgia';
                if (p.font && p.alignFont) {
                  const line = c.measureText('Hg');
                  c.translate(
                    0,
                    (-nativeLine.actualBoundingBoxAscent +
                      nativeLine.actualBoundingBoxDescent +
                      line.actualBoundingBoxAscent -
                      line.actualBoundingBoxDescent) /
                      2,
                  );
                }
                c.wordSpacing =
                  (parseFloat(s.props.wordSpacing) || 0) + (p.wordSpacing ?? 0) + 'px';
                if (title)
                  paintRetroGrayText(
                    c,
                    s.args.text,
                    0,
                    0,
                    width / p.width,
                    p.offset ?? 1,
                    fill ?? '#ababab',
                  );
                else if (p.shadow === 'solid')
                  paintRetroGrayText(
                    c,
                    s.args.text,
                    0,
                    0,
                    width / p.width,
                    p.offset ?? 1,
                    fill ?? String(s.props.fillStyle),
                    e.face.textInk,
                    'type',
                  );
                else {
                  if (fill) c.fillStyle = fill;
                  if (p.offset !== undefined) c.shadowOffsetX = c.shadowOffsetY = p.offset * 1.5;
                  paintTextInk(c, s.args.text, 0, 0, width / p.width, e.face.textInk, 'type');
                }
                c.restore();
                const raster = readRaster();
                return {
                  gray: nativeGrayCrop(raster, rect, origin),
                  rgba: definition.measureColor ? nativeRgbaCrop(raster, rect, origin) : null,
                };
              };
              const trimmed = (a) => {
                const sorted = a.slice().sort((a, b) => a - b),
                  kept = sorted.slice(Math.floor(a.length * 0.1), Math.ceil(a.length * 0.9));
                return kept.reduce((s, v) => s + v, 0) / kept.length;
              };
              const scores = [];
              for (const p of definition[role]) {
                const image = draw(p);
                if (p.id === 'current') {
                  const d = Math.max(...image.gray.map((v, i) => Math.abs(v - referenceNative[i])));
                  if (d > 1.001) throw Error('Candidate default parity ' + role + ' ' + d);
                }
                const score = objective.score(values(image.gray));
                if (definition.measureColor) {
                  const black = draw(p, 0).rgba,
                    white = draw(p, 255).rgba,
                    core = [];
                  for (let i = 0; i < rect[2] * rect[3]; i++)
                    if (
                      [0, 1, 2].every((k) => white.data[i * 4 + k] - black.data[i * 4 + k] >= 230)
                    )
                      core.push(i);
                  if (core.length >= 8) {
                    const reference = [0, 1, 2].map((k) =>
                        trimmed(
                          core.map(
                            (i) =>
                              refPixels.data[
                                ((Math.floor(i / rect[2]) + rect[1]) * 488 +
                                  (i % rect[2]) +
                                  rect[0]) *
                                  4 +
                                  k
                              ],
                          ),
                        ),
                      ),
                      rendered = [0, 1, 2].map((k) =>
                        trimmed(core.map((i) => image.rgba.data[i * 4 + k])),
                      );
                    const q = (a, p) => {
                      const v = a.slice().sort((a, b) => a - b),
                        at = (v.length - 1) * p,
                        l = Math.floor(at),
                        h = Math.ceil(at);
                      return l === h ? v[l] : v[l] * (h - at) + v[h] * (at - l);
                    };
                    const referenceQuantiles = Object.fromEntries(
                      [0.2, 0.5, 0.8].map((f) => [
                        String(f),
                        [0, 1, 2].map((k) =>
                          q(
                            core.map(
                              (i) =>
                                refPixels.data[
                                  ((Math.floor(i / rect[2]) + rect[1]) * 488 +
                                    (i % rect[2]) +
                                    rect[0]) *
                                    4 +
                                    k
                                ],
                            ),
                            f,
                          ),
                        ),
                      ]),
                    );
                    score.ink = {
                      pixels: core.length,
                      referenceQuantiles,
                      reference,
                      rendered,
                      error: delta(
                        reference.map((v) => v / 255),
                        rendered.map((v) => v / 255),
                      ),
                    };
                  } else
                    score.ink = { pixels: core.length, status: 'insufficient-opaque-glyph-core' };
                }
                scores.push(score);
              }
              result[role] = {
                rect,
                inverted,
                args: s.args,
                font: s.props.font,
                baselineParity: parity,
                scores,
              };
            }
            return { fullHash, roles: result };
          } finally {
            delete globalThis.__headingProbe;
            lease.dispose();
            for (const c of scratch) c.width = c.height = 0;
          }
        },
        { e, url, definition, material },
      );
      assert.equal(value.fullHash, n.modes.original.sha256, 'Unchanged observer PNG');
      rows.push({
        id: e.id,
        name: e.name,
        material,
        cohort: p.cohort,
        referenceHash: p.referenceHash,
        poseHash: hash(JSON.stringify(p.transform)),
        nativeHash: n.modes.original.sha256,
        ...value,
      });
      console.log('Heading native trial', rows.length, e.name);
    }
  }
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
  assert.deepEqual(session.faults, []);
  assert.deepEqual(await moduleHashes(), modules);
  await writeJson(output, {
    schema: 1,
    status:
      mode === 'pilot'
        ? 'native-revised-heading-pilot-not-adopted'
        : 'native-revised-heading-study-not-adopted',
    modules,
    scope:
      'Fixed frame poses and Original wording. Retained role commands on native pixel-phase ROI canvases; zero-replay controls and full native PNG hashes. Filled painters only; per-material light/dark polarity is an explicit pilot heuristic. Reference ink uses a high-opacity native black/white glyph stencil, never reference brightness. No defaults adopted.',
    rendererHash,
    sources: Object.fromEntries(files.map((f, i) => [path.basename(f), hash(bytes[i])])),
    toolHash,
    definition,
    proof,
    mode,
    rows,
    faults: session.faults,
  });
} finally {
  await session.close();
}
