// Offline Revised body study. Use NATIVE_RENDERER_ROOT for the frozen baseline checkout.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
const [inputFile, captureFile, coloredFile, artifactFile, outputFile, mode = 'selected'] =
  process.argv.slice(2);
assert(
  inputFile &&
    captureFile &&
    coloredFile &&
    artifactFile &&
    outputFile &&
    ['selected', 'grid'].includes(mode),
  'Usage: revised-body-native-study.mjs INPUTS BASELINE_CAPTURE COLORED_POSES ARTIFACT_POSES NEW_OUTPUT [selected|grid]',
);
const sourceRoot = path.resolve(process.env.NATIVE_RENDERER_ROOT ?? root);
await fs.writeFile(
  outputFile,
  JSON.stringify({
    status: 'starting',
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  }),
  { flag: 'wx' },
);
const ib = await fs.readFile(inputFile),
  inputs = JSON.parse(ib),
  cb = await fs.readFile(captureFile),
  capture = JSON.parse(cb);
assert.equal(inputs.set, '3ed');
assert.equal(capture.source.inputHash, hash(ib));
const rendererHash = await sourceHash(path.join(sourceRoot, 'games/magic/src'));
assert.equal(capture.source.rendererHash, rendererHash);
const colored = JSON.parse(await fs.readFile(coloredFile)),
  artifact = JSON.parse(await fs.readFile(artifactFile)),
  poses = [...Object.values(colored.groups).flatMap((g) => g.rows), ...artifact.rows],
  entries = inputs.entries.filter((e) => !e.face.land);
assert.equal(entries.length, 281);
const candidates =
  mode === 'selected'
    ? [
        { id: 'current', fractional: false, last: 1, textWidth: 1, dx: 0, extra: 0 },
        { id: 'selected', fractional: true, last: 1, model: true, dx: 0, extra: 0 },
      ]
    : [
        { id: 'current', fractional: false, last: 1, textWidth: 1, dx: 0, extra: 0 },
        { id: 'fractional', fractional: true, last: 1, textWidth: 1, dx: 0, extra: 0 },
        ...[0, 2, 4].flatMap((dx) =>
          [-2, 0, 2, 4].map((extra) => ({
            id: 'class-width-x' + dx + '-extra' + extra,
            fractional: true,
            last: 1,
            model: true,
            dx,
            extra,
          })),
        ),
      ];
const imageDirectory = outputFile.replace(/\.json$/, '') + '-images';
if (mode === 'selected') await fs.mkdir(imageDirectory);
const prototype = {},
  plugin = {
    name: 'bounded-revised-body-policy',
    enforce: 'pre',
    transform(code, id) {
      let after = code;
      const once = (needle, replacement) => {
        assert.equal(after.split(needle).length, 2, id);
        after = after.replace(needle, replacement);
      };
      if (id.split('?')[0].endsWith('/retro-rules.ts')) {
        once(
          'const result = tiers || fractional ? withRulesLayoutRequests(context, run) : run();',
          `const requested = (globalThis as any).__revisedBodyFractional === true && face.setCode?.toLowerCase()==='3ed' && face.wordingMode==='original';
  const result = tiers || fractional || requested ? withRulesLayoutRequests(context, run) : run();
  if (requested && result) return fractionalEarlyRules(context, result);`,
        );
      } else if (id.split('?')[0].endsWith('/rules-wrap.ts')) {
        once(
          'const cost = rest.cost + (width - used) ** 2;',
          'const cost = rest.cost + (width - used) ** 2 * (lines === 1 ? ((globalThis as any).__revisedLastWeight ?? 1) : 1);',
        );
      } else if (id.split('?')[0].endsWith('/early-text-tiers.ts')) {
        once(
          '    request.bounds,\n    original.size,\n    Math.max(10, original.size - 0.5),',
          '    {...request.bounds, x: request.bounds.x + ((globalThis as any).__revisedBodyDx ?? 0), width: Math.min(424 - (request.bounds.x + ((globalThis as any).__revisedBodyDx ?? 0)), request.bounds.width * ((globalThis as any).__revisedTextWidth ?? 1) + ((globalThis as any).__revisedBodyExtra ?? 0))},\n    original.size,\n    Math.max(10, original.size - 0.5),',
        );
        once(
          '...(original.size < 19 ? { textWidth: smallTextWidth } : {}),',
          'textWidth: (globalThis as any).__revisedTextWidth ?? (original.size < 19 ? smallTextWidth : 1),',
        );
      } else return;
      prototype[id.split('?')[0].split('/').at(-1)] = { before: hash(code), after: hash(after) };
      return after;
    },
  };
const session = await openBrowser(inputs, { sourceRoot, plugins: [plugin] }),
  rows = [];
const rect = [63, 405, 362, 199];
try {
  for (const entry of entries) {
    const p = poses.find((p) => p.id === entry.id);
    assert(p);
    let reference = null;
    if (p.accepted) {
      const bytes = await fs.readFile(objectFile(entry.reference));
      assert.equal(hash(bytes), entry.reference.sha256);
      reference = Array.from(cropGray(normalize(PNG.sync.read(bytes), p.transform), rect).gray);
    }
    const result = await session.page.evaluate(
      async ({ id, face, reference, rect, candidates }) => {
        await import('/games/magic/src/data/eager.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts'),
          { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts'),
          { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
          { nativeTextWindow } = await import('/games/magic/tools/accuracy/native-text-window.mjs'),
          { JsTextObjective, nativeGrayCrop } = await import(
            '/games/magic/tools/accuracy/abu-type-objective.mjs'
          );
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration),
          objective = reference
            ? new JsTextObjective(new Float32Array(reference), rect[2], rect[3])
            : null,
          out = [],
          cache = new Map();
        let baselineSize;
        const digest = async (bytes) =>
          Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (v) =>
            v.toString(16).padStart(2, '0'),
          ).join('');
        try {
          for (const candidate of candidates) {
            const large = baselineSize >= 26,
              textWidth = candidate.model
                ? large
                  ? 1
                  : baselineSize < 22.5
                    ? 1.02
                    : 1.01
                : candidate.textWidth,
              dx = candidate.model && large ? 0 : candidate.dx,
              extra = candidate.model && large ? 0 : candidate.extra,
              tuning = { textWidth, dx, extra },
              cacheKey = JSON.stringify([
                candidate.fractional,
                candidate.last,
                textWidth,
                dx,
                extra,
              ]);
            if (cache.has(cacheKey)) {
              out.push({
                ...cache.get(cacheKey),
                id: candidate.id,
                reusedFrom: cache.get(cacheKey).id,
              });
              continue;
            }
            globalThis.__revisedBodyDx = dx;
            globalThis.__revisedBodyExtra = extra;
            globalThis.__revisedTextWidth = textWidth;
            globalThis.__revisedBodyFractional = candidate.fractional;
            globalThis.__revisedLastWeight = candidate.last;
            const canvas = await composeCardTexture(
              { face, printingId: id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              const c = canvas.getContext('2d'),
                layout = retroTextLayout(c, face),
                window = nativeTextWindow(rect, [0, 0], [canvas.width, canvas.height]),
                pixels = c.getImageData(window.x, window.y, window.width, window.height),
                gray = nativeGrayCrop(pixels, rect, window.origin),
                baselineHash =
                  candidate.id === 'current'
                    ? await digest(
                        Uint8Array.from(atob(canvas.toDataURL().split(',')[1]), (ch) =>
                          ch.charCodeAt(0),
                        ),
                      )
                    : null;
              out.push({
                id: candidate.id,
                tuning,
                ...(candidate.id === 'selected' ? { png: canvas.toDataURL().split(',')[1] } : {}),
                score: objective ? Array.from(objective.score(gray)) : null,
                grayHash: await digest(new Uint8Array(gray.buffer)),
                baselineHash,
                layout: layout
                  ? {
                      size: layout.size,
                      x: layout.x,
                      top: layout.top,
                      width: layout.width,
                      height: layout.height,
                      fractionalMetrics: layout.fractionalMetrics ?? false,
                      overflow: layout.overflow,
                      lines: layout.lines.map((l) => ({
                        text: l.runs.map((r) => (r.symbol ? '{' + r.text + '}' : r.text)).join(''),
                        x: l.x ?? layout.x,
                        baseline: l.baseline,
                        width: l.width,
                      })),
                    }
                  : null,
              });
              if (candidate.id === 'current') baselineSize = layout.size;
              cache.set(cacheKey, out.at(-1));
            } finally {
              canvas.width = canvas.height = 0;
            }
          }
          return out;
        } finally {
          delete globalThis.__revisedBodyDx;
          delete globalThis.__revisedBodyExtra;
          delete globalThis.__revisedTextWidth;
          delete globalThis.__revisedBodyFractional;
          delete globalThis.__revisedLastWeight;
          lease.dispose();
        }
      },
      { id: entry.id, face: entry.face, reference, rect, candidates },
    );
    const before = capture.rows.find((r) => r.id === entry.id).modes.original;
    assert.equal(result[0].baselineHash, before.sha256, entry.name + ' baseline drift');
    assert.equal(result[0].layout.size, before.layout.size);
    if (mode === 'selected') {
      const selected = result.find((r) => r.id === 'selected'),
        bytes = Buffer.from(selected.png, 'base64');
      delete selected.png;
      await fs.writeFile(imageDirectory + '/' + entry.id + '.png', bytes);
      selected.pngHash = hash(bytes);
      selected.file = entry.id + '.png';
      const baselineBytes = await fs.readFile(path.join(path.dirname(captureFile), before.file));
      assert.equal(hash(baselineBytes), before.sha256);
      const a = PNG.sync.read(baselineBytes),
        z = PNG.sync.read(bytes);
      assert.deepEqual([z.width, z.height], [732, 1020]);
      let outside = 0,
        alpha = 0,
        changed = 0;
      for (let i = 0; i < a.data.length; i += 4) {
        if (a.data[i + 3] !== z.data[i + 3]) alpha++;
        if ([0, 1, 2, 3].some((k) => a.data[i + k] !== z.data[i + k])) {
          changed++;
          const x = (i / 4) % 732,
            y = Math.floor(i / 4 / 732);
          if (x < 60 * 1.5 || x >= 430 * 1.5 || y < 402 * 1.5 || y >= 606 * 1.5) outside++;
        }
      }
      assert.equal(outside, 0, entry.name + ' outside body');
      assert.equal(alpha, 0, entry.name + ' silhouette');
      selected.isolation = { outside, alpha, changed };
    }

    rows.push({
      id: entry.id,
      name: entry.name,
      material: entry.face.artifact ? 'A' : (entry.face.frameColors ?? entry.face.colors)[0],
      cohort: p.cohort,
      accepted: p.accepted,
      referenceHash: entry.reference.sha256,
      poseHash: hash(JSON.stringify(p.transform)),
      inputHash: before.inputHash,
      trials: result,
    });
    if (rows.length % 10 === 0) console.log('Native body policies', rows.length, '/281');
    await fs.writeFile(
      outputFile,
      JSON.stringify(
        {
          schema: 1,
          status:
            rows.length === entries.length ? 'complete-experimental-not-adopted' : 'in-progress',
          inputHash: hash(ib),
          captureHash: hash(cb),
          rendererHash,
          rect,
          candidates,
          prototype,
          toolHash: hash(await fs.readFile(new URL(import.meta.url))),
          rows,
          faults: session.faults,
        },
        null,
        2,
      ) + '\n',
    );
  }
} finally {
  await session.close();
}
assert.equal(await sourceHash(path.join(sourceRoot, 'games/magic/src')), rendererHash);
assert.deepEqual(session.faults, []);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
for (const cohort of ['calibration', 'validation'])
  console.log(
    cohort,
    candidates.map((c) => {
      const rs = rows.filter(
        (r) => r.accepted && r.cohort === cohort && r.trials[0].score?.[0] >= 0,
      );
      const deltas = rs.map(
        (r) => (r.trials.find((t) => t.id === c.id).score[0] - r.trials[0].score[0]) * 100,
      );
      return {
        id: c.id,
        cards: rs.length,
        before: mean(rs.map((r) => r.trials[0].score[0])) * 100,
        delta: mean(deltas),
        improved: deltas.filter((v) => v > 1e-9).length,
        regressed: deltas.filter((v) => v < -1e-9).length,
      };
    }),
  );
