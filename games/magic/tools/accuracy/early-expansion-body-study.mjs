// Frozen-Original native typography probes for early expansion printing policies.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, poseFile, baselineDirectory, definitionFile, output, nativeOutput] =
  process.argv.slice(2);
const toolHash = hash(await readFile(new URL(import.meta.url)));
assert(
  output,
  'Usage: early-expansion-body-study.mjs INPUTS POSES RELEASED_NATIVE DEFINITION OUTPUT [NATIVE_OUTPUT]',
);
const raw = await Promise.all(
  [inputFile, poseFile, path.join(baselineDirectory, 'capture.json'), definitionFile].map((f) =>
    readFile(f),
  ),
);
const [inputs, poses, capture, definition] = raw.map((b) => JSON.parse(b));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(inputs.rendererHash, rendererHash);
assert.equal(capture.source.rendererHash, rendererHash);
assert.equal(poses.inputHash, hash(raw[0]));
assert.equal(capture.source.inputHash, hash(raw[0]));
assert.equal(capture.source.posesHash, hash(raw[1]));
assert(capture.complete);
assert(['arn', 'atq', 'drk'].includes(inputs.set));
assert.deepEqual(definition.candidates[0], { id: 'current', adjustment: {} });
assert.equal(new Set(definition.candidates.map((c) => c.id)).size, definition.candidates.length);
if (nativeOutput) {
  assert.equal(definition.candidates.length, 2);
  await mkdir(nativeOutput, { recursive: true });
}
const transformed = {};
const once = (code, needle, replacement) => {
  assert.equal(code.split(needle).length, 2, 'Study boundary changed: ' + needle);
  return code.replace(needle, replacement);
};
const session = await openBrowser(inputs, {
  plugins: [
    {
      name: 'early-expansion-native-body-study',
      enforce: 'pre',
      transform(source, id) {
        const file = id.split('/').at(-1);
        let code = source;
        if (file === 'early-expansion-text.ts') {
          code = once(code, 'const bounds = {', 'const defaultBounds = {');
          code = once(
            code,
            '  const p = profiles[set];',
            '  const p = { ...profiles[set], ...((globalThis as any).__expansionProbe ?? {}) } as any;\n  const bounds = {...defaultBounds,...(p.bounds ?? {})};',
          );
          code = once(
            code,
            '    textWidth: p.textWidth,',
            '    fractionalMetrics: p.fractionalMetrics,\n    textWidth: p.textWidth,',
          );
          code = once(
            code,
            '      textWidth: 1,\n      leading: 1.1,',
            '      textWidth: p.largeWidth ?? 1,\n      leading: p.largeLeading ?? 1.1,',
          );
          code = code.replaceAll('27.5,', '(p.large ?? 27.5),');
          code = once(
            code,
            '    const largeBounds = dark ? { ...bounds, x: 76, width: 336 } : bounds;',
            '    const largeBounds = {...(dark ? { ...bounds, x: 76, width: 336 } : bounds),...(p.largeBounds ?? {})};',
          );
          code = once(
            code,
            '      centerOffset: dark ? 0 : -14,',
            '      centerOffset: p.largeOffset ?? (dark ? 0 : -14),',
          );
          code = once(
            code,
            '      textWidth: 1,\n      leading: set ===',
            '      textWidth: p.compactWidth ?? 1,\n      leading: set ===',
          );
          code = once(code, '    leading: 1,', '    leading: p.regularLeading ?? 1,');
        } else if (file === 'rules-paint.ts') {
          code = once(
            code,
            '  if (!rulesInkVisible(context)) return;',
            '  if ((globalThis as any).__expansionBody?.(context, layout, images, paintSymbol, inkInsetEm, color)) return;\n  if (!rulesInkVisible(context)) return;',
          );
        } else return;
        const proof = { before: hash(source), after: hash(code) };
        if (transformed[file]) assert.deepEqual(transformed[file], proof);
        transformed[file] = proof;
        return code;
      },
    },
  ],
});
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of inputs.entries) {
    const pose = poses.rows.find((p) => p.id === e.id),
      before = capture.rows.find((r) => r.id === e.id);
    assert(pose.accepted && before.poseAccepted);
    assert.equal(before.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(before.poseHash, hash(JSON.stringify(pose.transform)));
    assert.equal(e.face.wordingMode, 'original');
    assert.equal(e.reference.sha256, pose.referenceHash);
    const scan = await readObject(e.reference);
    assert.equal(hash(scan), e.reference.sha256);
    const canonical = normalize(PNG.sync.read(scan), pose.transform);
    const scanPng = PNG.sync.write({ width: 488, height: 680, data: Buffer.from(canonical.data) });
    const result = await session.page.evaluate(
      async ({ e, url, candidates, captureNative }) => {
        const { composeCardTexture, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-face.ts'
        ).then(async (m) => ({
          ...m,
          ...(await import('/games/magic/src/presentation/canvas-assets.ts')),
        }));
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { JsTextObjective, nativeGrayCrop } = await import(
          '/games/magic/tools/accuracy/abu-type-objective.mjs'
        );
        const { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const signal = new AbortController().signal,
          face = e.face,
          input = { face, printingId: e.id, printedImage: null };
        const lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration),
          hooks = { loadImages: async () => ({ ...lease, dispose() {} }) };
        let full, background;
        try {
          delete globalThis.__expansionProbe;
          full = await composeCardTexture(input, 'inspect', signal, hooks);
          let body;
          globalThis.__expansionBody = (context, layout, images, ...args) => {
            body = {
              layout,
              images,
              args,
              transform: context.getTransform(),
              properties: Object.fromEntries(
                [
                  'imageSmoothingEnabled',
                  'imageSmoothingQuality',
                  'fontKerning',
                  'textRendering',
                  'shadowColor',
                  'shadowBlur',
                  'shadowOffsetX',
                  'shadowOffsetY',
                  'globalAlpha',
                  'globalCompositeOperation',
                  'filter',
                ].map((key) => [key, context[key]]),
              ),
            };
            return true;
          };
          try {
            background = await composeCardTexture(input, 'inspect', signal, hooks);
          } finally {
            delete globalThis.__expansionBody;
          }
          if (!body) return { png: full.toDataURL().split(',')[1], empty: true };
          const rect = [54, 405, 390, 197],
            origin = [79, 605],
            readSize = [590, 301];
          const sc = document.createElement('canvas');
          sc.width = 488;
          sc.height = 680;
          const image = new Image();
          image.src = url;
          await image.decode();
          sc.getContext('2d').drawImage(image, 0, 0);
          const objective = new JsTextObjective(
            cropGray(sc.getContext('2d').getImageData(0, 0, 488, 680), rect).gray,
            rect[2],
            rect[3],
          );
          const out = document.createElement('canvas');
          out.width = 732;
          out.height = 1020;
          const c = out.getContext('2d', { willReadFrequently: true });
          const matrix = body.transform,
            trials = [];
          let replayDifference = null;
          const text = (l) =>
            l.lines
              .flatMap((r) => r.runs.map((r) => r.text))
              .join('')
              .replace(/\s/g, '');
          const expected = text(body.layout);
          const memo = new Map();
          let rasterMeasurements = 0;
          for (const candidate of candidates) {
            globalThis.__expansionProbe = candidate.adjustment;
            c.resetTransform();
            c.clearRect(0, 0, 732, 1020);
            c.drawImage(background, 0, 0);
            Object.assign(c, body.properties);
            c.setTransform(matrix);
            const layout = candidate.id === 'current' ? body.layout : retroTextLayout(c, face);
            if (!layout || layout.overflow || text(layout) !== expected) {
              trials.push({ id: candidate.id, score: null, invalid: true });
              continue;
            }
            const signature = JSON.stringify(layout);
            const cached = memo.get(signature);
            if (cached) {
              trials.push({ ...cached, id: candidate.id });
              continue;
            }
            rasterMeasurements++;
            paintRulesLayout(c, layout, body.images, ...body.args);
            c.resetTransform();
            const pixels = c.getImageData(origin[0], origin[1], readSize[0], readSize[1]);
            const gray = nativeGrayCrop(pixels, rect, origin),
              score = objective.score(gray)[0];
            if (candidate.id === 'current') {
              const actual = full
                .getContext('2d')
                .getImageData(origin[0], origin[1], readSize[0], readSize[1]);
              const controlGray = nativeGrayCrop(actual, rect, origin);
              replayDifference = Math.max(...gray.map((v, i) => Math.abs(v - controlGray[i])));
            }
            const observation = {
              id: candidate.id,
              score,
              size: layout.size,
              lines: layout.lines.length,
              overflow: layout.overflow ?? false,
              fractionalMetrics: layout.fractionalMetrics ?? false,
              rows: layout.lines.map((l) => l.runs.map((r) => r.text).join('')),
              x: layout.x,
              width: layout.width,
              top: layout.top,
              height: layout.height,
            };
            memo.set(signature, observation);
            trials.push(observation);
          }
          let native;
          if (captureNative) {
            globalThis.__expansionProbe = candidates[1].adjustment;
            const image = await composeCardTexture(input, 'inspect', signal, hooks);
            try {
              const pixels = image.getContext('2d').getImageData(0, 0, 732, 1020);
              const control = full.getContext('2d').getImageData(0, 0, 732, 1020);
              let outsideChanged = 0,
                alphaChanged = 0;
              for (let y = 0; y < 1020; y++)
                for (let x = 0; x < 732; x++) {
                  const i = (y * 732 + x) * 4;
                  if (pixels.data[i + 3] !== control.data[i + 3]) alphaChanged++;
                  const inside = x >= 52 * 1.5 && x < 446 * 1.5 && y >= 403 * 1.5 && y < 604 * 1.5;
                  if (
                    !inside &&
                    [0, 1, 2, 3].some((k) => pixels.data[i + k] !== control.data[i + k])
                  )
                    outsideChanged++;
                }
              const score = objective.score(nativeGrayCrop(pixels, rect))[0];
              const etch = async (options) => {
                globalThis.__expansionProbe = options;
                const image = await composeCardTexture(
                  { ...input, layer: 'etching' },
                  'inspect',
                  signal,
                  hooks,
                );
                try {
                  return image.toDataURL().split(',')[1];
                } finally {
                  image.width = image.height = 0;
                }
              };
              native = {
                png: image.toDataURL().split(',')[1],
                score,
                outsideChanged,
                alphaChanged,
                baselineEtching: await etch({}),
                etching: await etch(candidates[1].adjustment),
              };
            } finally {
              image.width = image.height = 0;
            }
          }
          out.width = out.height = sc.width = sc.height = 0;
          return {
            png: full.toDataURL().split(',')[1],
            replayDifference,
            trials,
            rasterMeasurements,
            native,
          };
        } finally {
          delete globalThis.__expansionProbe;
          delete globalThis.__expansionBody;
          if (full) full.width = full.height = 0;
          if (background) background.width = background.height = 0;
          lease.dispose();
        }
      },
      {
        e,
        url: 'data:image/png;base64,' + scanPng.toString('base64'),
        candidates: definition.candidates,
        captureNative: Boolean(nativeOutput),
      },
    );
    assert.equal(
      hash(Buffer.from(result.png, 'base64')),
      before.sha256,
      'Source baseline differs from the actual released renderer: ' + e.name,
    );
    assert(
      result.empty || result.replayDifference <= 1.001,
      'Body replay differs from native control: ' + e.name,
    );
    let native;
    if (nativeOutput) {
      assert(result.native, 'Native verification requires a body');
      const n = result.native,
        bytes = Buffer.from(n.png, 'base64');
      assert.equal(n.outsideChanged, 0, 'Body proposal changed another region: ' + e.name);
      assert.equal(n.alphaChanged, 0, 'Body proposal changed silhouette: ' + e.name);
      assert.equal(
        hash(Buffer.from(n.etching, 'base64')),
        hash(Buffer.from(n.baselineEtching, 'base64')),
        'Body proposal changed etching: ' + e.name,
      );
      assert(
        Math.abs(n.score - result.trials[1].score) <= 0.005,
        'Native prediction differs: ' + e.name,
      );
      await writeFile(path.join(nativeOutput, e.id + '.png'), bytes);
      native = {
        sha256: hash(bytes),
        score: n.score,
        predictedScore: result.trials[1].score,
        outsideChanged: 0,
        alphaChanged: 0,
        etchingHash: hash(Buffer.from(n.etching, 'base64')),
        etchingChanged: false,
      };
    }
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: pose.cohort,
      referenceHash: e.reference.sha256,
      poseHash: before.poseHash,
      baselineHash: before.sha256,
      empty: result.empty ?? false,
      zeroReplayMaximumError: result.replayDifference ?? null,
      trials: result.trials ?? [],
      rasterMeasurements: result.rasterMeasurements ?? 0,
      ...(native ? { native } : {}),
    });
    if (rows.length % 10 === 0 || rows.length === inputs.entries.length) {
      assert.deepEqual(session.faults, []);
      await writeJson(output, {
        schema: 1,
        set: inputs.set,
        status:
          rows.length === inputs.entries.length
            ? 'native-expansion-body-matrix-complete'
            : 'in-progress',
        scope:
          'Original wording only. Every instrumented default matches the actual published native PNG. A rules-suppressed background replays the default body within one gray level on the exact bilinear comparison grid. Probes use the production expansion count/wrap policy, preserve the complete text sequence, and keep frozen per-card frame-only scan poses. Candidates are shared policies, never per-card renderer adjustments. Regional edge scores cannot certify ink tone, frame calibration or whole-set completion.',
        rendererHash,
        inputHash: hash(raw[0]),
        normalizationHash: hash(raw[1]),
        nativeCaptureHash: hash(raw[2]),
        definitionHash: hash(raw[3]),
        toolHash,
        nativeVerification: Boolean(nativeOutput),
        transformed,
        browser: session.browser.version(),
        total: inputs.entries.length,
        completed: rows.length,
        definition,
        rows,
      });
      console.log('Native expansion body probes', rows.length, '/', inputs.entries.length);
    }
  }
  assert.equal(
    toolHash,
    hash(await readFile(new URL(import.meta.url))),
    'Study tool changed during capture',
  );
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
} finally {
  await session.close();
}
