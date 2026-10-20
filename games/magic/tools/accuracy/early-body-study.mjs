// Full-set native text policy matrix, sharing the production count/fit code.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';

const [nativeDirectory, definitionFile, output, nativeOutputDirectory] = process.argv.slice(2);
if (nativeOutputDirectory) await mkdir(nativeOutputDirectory, { recursive: true });
assert(output, 'Usage: early-body-study.mjs NATIVE_CAPTURE DEFINITION OUTPUT [NATIVE_OUTPUT]');
const captureBytes = await readFile(path.join(nativeDirectory, 'capture.json'));
const inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json'));
const definitionBytes = await readFile(definitionFile);
const capture = JSON.parse(captureBytes),
  inputs = JSON.parse(inputBytes),
  definition = JSON.parse(definitionBytes);
assert.equal(definition.schema, 1);
assert(Array.isArray(definition.candidates) && definition.candidates[0].id === 'current');
assert.deepEqual(definition.candidates[0].adjustment, {});
assert.equal(new Set(definition.candidates.map((c) => c.id)).size, definition.candidates.length);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(capture.source.rendererHash, rendererHash);
assert.equal(inputs.source.rendererHash, rendererHash);
assert(
  inputs.entries.every(
    (e) => e.set === '2ed' && e.pose.accepted && e.face.wordingMode === 'original',
  ),
);
if (nativeOutputDirectory)
  assert.equal(
    definition.candidates.length,
    2,
    'Native verification expects current plus one shared candidate',
  );
const transformed = {};
const once = (code, needle, replacement) => {
  assert.equal(code.split(needle).length, 2, 'Typography study hook changed');
  return code.replace(needle, replacement);
};
const session = await openBrowser(inputs, {
  plugins: [
    {
      name: 'early-native-body-policy',
      enforce: 'pre',
      transform(source, id) {
        const file = id.split('/').at(-1);
        let code = source;
        if (file === 'retro-rules.ts')
          code = once(
            code,
            'function baseRetroTextLayout(',
            'export function baseRetroTextLayout(',
          );
        else if (file === 'rules-paint.ts')
          code = once(
            code,
            '  if (!rulesInkVisible(context)) return;',
            '  if ((globalThis as any).__abuBody?.(context, layout, images, paintSymbol, inkInsetEm, color)) return;\n  if (!rulesInkVisible(context)) return;',
          );
        else if (
          file === 'abu-count-layout.mjs' &&
          definition.candidates.some((c) => c.adjustment.retainRegularAboveLines !== undefined)
        ) {
          code = once(
            code,
            "  if (!base) throw Error('Count study requires the native base layout');",
            `  if (!base) throw Error('Count study requires the native base layout');
  const limit=options.retainRegularAboveLines;
  if(limit!==undefined){
    if(!Number.isInteger(limit)||limit<1)throw Error('Invalid shared regular density limit');
    if(base.size>=19&&base.size<30&&base.lines.length>limit)return base;
  }`,
          );
        } else if (file === 'abu-type-browser.mjs') {
          code = "import {nativeTextWindow} from './native-text-window.mjs';\n" + code;
          code = once(
            code,
            '  sc.drawImage(await image(scanUrl), 0, 0);',
            `  const referenceImage = await image(scanUrl);
  if(referenceImage.naturalWidth!==488||referenceImage.naturalHeight!==680)throw Error('Typography reference must be canonical 488x680');
  sc.drawImage(referenceImage,0,0);`,
          );
          code = once(
            code,
            '    c.save();\n    c.setTransform(\n      ...body.transform.slice(0, 4),',
            '    globalThis.__earlyBodyLayout=layout;\n    c.save();\n    c.setTransform(\n      ...body.transform.slice(0, 4),',
          );
          code = once(
            code,
            `  return p.objective.score_raster(
    pixels(p.out).data,
    p.out.width,
    new Float64Array(p.origin),`,
            `  const window=nativeTextWindow(p.rect,p.origin,[p.out.width,p.out.height]);
  const readback=p.ctx.getImageData(window.x,window.y,window.width,window.height);
  return p.objective.score_raster(
    readback.data,
    readback.width,
    new Float64Array(window.origin),`,
          );
        } else return;
        const proof = { before: hash(source), after: hash(code) };
        if (transformed[file]) assert.deepEqual(transformed[file], proof);
        transformed[file] = proof;
        return code;
      },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url !== '/__type_kernel/config.json') return next();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ wasm: false }));
        });
      },
    },
  ],
});
const rows = [];
const studyToolHash = hash(await readFile(new URL(import.meta.url)));
const dependencies = await Promise.all(
  [
    'abu-type-browser.mjs',
    'abu-type-objective.mjs',
    'abu-count-layout.mjs',
    'native-text-window.mjs',
    'pixels-pure.mjs',
    'edges.mjs',
    'browser.mjs',
  ].map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
);
try {
  let prior;
  try {
    prior = JSON.parse(await readFile(output, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (prior) {
    for (const [key, value] of Object.entries({
      rendererHash,
      nativeCaptureHash: hash(captureBytes),
      nativeInputsHash: hash(inputBytes),
      definitionHash: hash(definitionBytes),
      toolHash: studyToolHash,
      nativeVerification: Boolean(nativeOutputDirectory),
    }))
      assert.equal(prior[key], value, 'Stale body checkpoint: ' + key);
    assert.deepEqual(prior.dependencies, dependencies);
    assert.equal(prior.completed, prior.rows.length);
    for (let i = 0; i < prior.rows.length; i++) {
      const row = prior.rows[i],
        entry = inputs.entries[i],
        original = capture.rows.find((r) => r.id === entry.id);
      assert.equal(row.id, entry.id);
      assert.equal(row.baselineHash, original.renderHash);
      assert.equal(row.nativeScanHash, original.scanHash);
      assert.equal(row.poseHash, original.poseHash);
      if (nativeOutputDirectory) {
        assert.equal(
          hash(await readFile(path.join(nativeOutputDirectory, row.id + '.png'))),
          row.native.faceHash,
        );
        assert.equal(
          hash(await readFile(path.join(nativeOutputDirectory, row.id + '-etching.png'))),
          row.native.etchingHash,
        );
      }
      rows.push(row);
    }
  }
  await session.page.evaluate(async () => {
    globalThis.__bodyStudy = await import('/games/magic/tools/accuracy/abu-type-browser.mjs');
  });
  for (const e of inputs.entries.slice(rows.length)) {
    const before = capture.rows.find((r) => r.id === e.id);
    assert(before && before.accepted);
    assert.equal(before.referenceHash, e.reference.sha256);
    assert.equal(before.poseHash, hash(JSON.stringify(e.pose.transform)));
    const scanBytes = await readFile(path.join(nativeDirectory, e.set, e.id + '-scan.png'));
    assert.equal(hash(scanBytes), before.scanHash);
    const image = PNG.sync.read(scanBytes);
    assert.deepEqual([image.width, image.height], [732, 1020]);
    const reference = normalize(image);
    assert.deepEqual([reference.width, reference.height], [488, 680]);
    const canonicalBytes = PNG.sync.write({
      width: 488,
      height: 680,
      data: Buffer.from(reference.data),
    });
    const prepared = await session.page.evaluate(
      ({ e, url }) => globalThis.__bodyStudy.prepare(e, url, ['rules']),
      { e, url: 'data:image/png;base64,' + canonicalBytes.toString('base64') },
    );
    assert.equal(
      hash(Buffer.from(prepared.png, 'base64')),
      before.renderHash,
      'Native baseline changed: ' + e.name,
    );
    const trials = await session.page.evaluate((definition) => {
      const api = globalThis.__bodyStudy,
        s = globalThis.__abuState;
      const visible = (layout) =>
        layout.lines
          .flatMap((l) => l.runs.map((r) => r.text))
          .join('')
          .replace(/\s/g, '');
      const expected = visible(s.body.layout);
      return definition.candidates.map((candidate) => {
        globalThis.__earlyBodyLayout = null;
        const score = api.measure('rules', candidate.adjustment),
          layout = globalThis.__earlyBodyLayout;
        if (score < 0 || !layout) return { id: candidate.id, score, invalid: true };
        if (visible(layout) !== expected)
          throw Error(
            'Body trial lost or changed printed text: ' + s.face.name + '/' + candidate.id,
          );
        const bounds = layout.lines.map((l) => l.inkBounds),
          sx = layout.horizontalScale ?? 1;
        return {
          id: candidate.id,
          score,
          invalid: false,
          size: layout.size,
          left: layout.x * sx,
          width: layout.width * sx,
          top: layout.top,
          height: layout.height,
          lineCount: layout.lines.length,
          horizontalScale: sx,
          overflow: layout.overflow ?? false,
          sizeClass: layout.size >= 30 ? 'large' : layout.size < 19 ? 'dense' : 'medium',
          inkBounds: bounds.length
            ? [
                Math.min(...bounds.map((b) => b[0] * sx)),
                Math.min(...bounds.map((b) => b[1])),
                Math.max(...bounds.map((b) => (b[0] + b[2]) * sx)),
                Math.max(...bounds.map((b) => b[1] + b[3])),
              ]
            : null,
        };
      });
    }, definition);
    let native;
    if (nativeOutputDirectory) {
      const candidate = definition.candidates[1];
      const actual = await session.page.evaluate(async (adjustment) => {
        const s = globalThis.__abuState;
        const result = await globalThis.__bodyStudy.nativeRulesTrial(adjustment);
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const control = await composeCardTexture(
          { ...s.input, layer: 'etching' },
          'inspect',
          new AbortController().signal,
          { loadImages: async () => ({ ...s.lease, dispose() {} }) },
        );
        let controlEtching;
        try {
          controlEtching = control.toDataURL().split(',')[1];
        } finally {
          control.width = control.height = 0;
        }
        let bodyCalls = 0,
          etch;
        globalThis.__abuBody = () => {
          bodyCalls++;
          throw Error('Old-frame etching unexpectedly paints rules');
        };
        try {
          etch = await composeCardTexture(
            { ...s.input, layer: 'etching' },
            'inspect',
            new AbortController().signal,
            { loadImages: async () => ({ ...s.lease, dispose() {} }) },
          );
          return {
            ...result,
            controlEtching,
            etching: etch.toDataURL().split(',')[1],
            etchingBodyCalls: bodyCalls,
          };
        } finally {
          delete globalThis.__abuBody;
          if (etch) etch.width = etch.height = 0;
        }
      }, candidate.adjustment);
      const faceBytes = Buffer.from(actual.png, 'base64'),
        etchingBytes = Buffer.from(actual.etching, 'base64');
      const facePixels = PNG.sync.read(faceBytes),
        beforePixels = PNG.sync.read(Buffer.from(prepared.png, 'base64')),
        etchingPixels = PNG.sync.read(etchingBytes);
      assert.deepEqual([facePixels.width, facePixels.height], [732, 1020]);
      assert.equal(actual.etchingBodyCalls, 0);
      assert.equal(
        hash(etchingBytes),
        hash(Buffer.from(actual.controlEtching, 'base64')),
        'Body policy changed the default etching plane',
      );
      let etchingCoveredPixels = 0;
      for (let i = 3; i < etchingPixels.data.length; i += 4)
        if (etchingPixels.data[i]) etchingCoveredPixels++;
      for (let i = 3; i < facePixels.data.length; i += 4)
        assert.equal(facePixels.data[i], beforePixels.data[i], 'Body policy changed silhouette');
      const rect = [54, 405, 390, 197],
        objective = new JsTextObjective(cropGray(reference, rect).gray, rect[2], rect[3]);
      const score = objective.score(nativeGrayCrop(facePixels, rect))[0],
        predicted = trials[1].score;
      assert(Math.abs(score - predicted) <= 0.005, 'Native body prediction error: ' + e.name);
      const control = trials[0],
        limit = candidate.adjustment.retainRegularAboveLines;
      const retainedBase =
        limit !== undefined && control.size >= 19 && control.size < 30 && control.lineCount > limit;
      if (retainedBase)
        assert.equal(
          hash(faceBytes),
          before.renderHash,
          'Density retention changed a full native face',
        );
      await writeFile(path.join(nativeOutputDirectory, e.id + '.png'), faceBytes);
      await writeFile(path.join(nativeOutputDirectory, e.id + '-etching.png'), etchingBytes);
      native = {
        faceHash: hash(faceBytes),
        etchingHash: hash(etchingBytes),
        controlEtchingHash: hash(Buffer.from(actual.controlEtching, 'base64')),
        etchingCoveredPixels,
        score,
        predictedScore: predicted,
        predictionError: Math.abs(score - predicted),
        maximumReplayGrayError: actual.maximum,
        outsideChangedBytes: actual.outside,
        silhouetteChanged: 0,
        etchingBodyCalls: actual.etchingBodyCalls,
        retainedBase,
      };
    }
    await session.page.evaluate(() => globalThis.__bodyStudy.finish());
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: e.pose.cohort,
      characters: (e.face.rulesParagraphs ?? []).reduce(
        (sum, p) => sum + p.runs.reduce((n, r) => n + r.text.length, 0),
        0,
      ),
      referenceHash: before.referenceHash,
      poseHash: before.poseHash,
      nativeScanHash: before.scanHash,
      canonicalReferenceHash: hash(canonicalBytes),
      baselineHash: before.renderHash,
      zeroReplayMaximumError: prepared.parity,
      trials,
      ...(native ? { native } : {}),
    });
    if (rows.length % 10 === 0 || rows.length === inputs.entries.length) {
      await writeJson(output, {
        schema: 1,
        set: '2ed',
        status:
          rows.length === inputs.entries.length
            ? 'native-body-policy-matrix-complete'
            : 'native-body-policy-matrix-in-progress',
        scope: nativeOutputDirectory
          ? 'One shared original-text body policy replayed through the full native painter on every Unlimited printing. Independent frozen scans, exact current PNGs, complete text sequences, cropped readback parity, actual score predictions and zero changes outside the rules region are checked. Face alpha stays unchanged. Dense regular retention must preserve the entire current PNG byte-for-byte. The default etching plane is composed before/after and must be byte-identical without running a body callback; its coverage is recorded rather than assumed empty. Hash-bound checkpoints resume only the same code, inputs, policies and pixels. This is still a regional candidate, not material integration or complete-set certification.'
          : 'Original text only, all supplied Unlimited printings, fixed independently normalized scans and unchanged full native current PNGs. Candidate policies use the production count/wrap code. Every accepted trial preserves the entire rendered text sequence. Cropped Canvas2D readback uses the exact existing bilinear footprint, not a resized crop. No per-card fit or runtime adoption; independent native candidate isolation and whole-set validation remain required.',
        rendererHash,
        nativeCaptureHash: hash(captureBytes),
        nativeInputsHash: hash(inputBytes),
        definitionHash: hash(definitionBytes),
        definition,
        toolHash: studyToolHash,
        nativeVerification: Boolean(nativeOutputDirectory),
        dependencies,
        transformed,
        browser: session.browser.version(),
        total: inputs.entries.length,
        completed: rows.length,
        rows,
      });
      console.log(rows.length + '/' + inputs.entries.length, e.name);
    }
  }
} finally {
  await session.close();
}
