// Full native power/toughness geometry matrix; ink tone stays a fixed control.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
const [nativeDirectory, definitionFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-stats-study.mjs NATIVE_CAPTURE DEFINITION OUTPUT');
const captureBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  definitionBytes = await readFile(definitionFile);
const capture = JSON.parse(captureBytes),
  inputs = JSON.parse(inputBytes),
  definition = JSON.parse(definitionBytes);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(capture.source.rendererHash, rendererHash);
assert.equal(inputs.source.rendererHash, rendererHash);
assert.equal(definition.schema, 1);
assert.equal(definition.baselineId, 'fixed-gray');
assert.equal(new Set(definition.candidates.map((c) => c.id)).size, definition.candidates.length);
const entries = inputs.entries.filter((e) => e.face.power != null && e.face.toughness != null);
assert(
  entries.every((e) => e.set === '2ed' && e.pose.accepted && e.face.wordingMode === 'original'),
);
const transformed = {};
const once = (code, needle, replacement) => {
  assert.equal(code.split(needle).length, 2, 'Native stats hook changed');
  return code.replace(needle, replacement);
};
const session = await openBrowser(
  { ...inputs, entries },
  {
    plugins: [
      {
        name: 'early-stats-matrix',
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
          else if (file === 'abu-type-browser.mjs') {
            code = once(code, '  stats: [377, 596, 87, 51],', '  stats: [377, 607, 87, 33],');
            code = once(
              code,
              '  sc.drawImage(await image(scanUrl), 0, 0);',
              `  const referenceImage=await image(scanUrl);
  if(referenceImage.naturalWidth!==488||referenceImage.naturalHeight!==680)throw Error('Typography reference must be canonical 488x680');
  sc.drawImage(referenceImage,0,0);`,
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
  },
);
const rows = [];
try {
  await session.page.evaluate(async () => {
    globalThis.__statsStudy = await import('/games/magic/tools/accuracy/abu-type-browser.mjs');
  });
  for (const e of entries) {
    const n = capture.rows.find((r) => r.id === e.id);
    assert(n && n.accepted);
    assert.equal(n.referenceHash, e.reference.sha256);
    assert.equal(n.poseHash, hash(JSON.stringify(e.pose.transform)));
    const scanBytes = await readFile(path.join(nativeDirectory, e.set, e.id + '-scan.png'));
    assert.equal(hash(scanBytes), n.scanHash);
    const image = PNG.sync.read(scanBytes);
    assert.deepEqual([image.width, image.height], [732, 1020]);
    const reference = normalize(image),
      canonical = PNG.sync.write({ width: 488, height: 680, data: Buffer.from(reference.data) });
    const prepared = await session.page.evaluate(
      ({ e, url }) => globalThis.__statsStudy.prepare(e, url, ['stats']),
      { e, url: 'data:image/png;base64,' + canonical.toString('base64') },
    );
    assert.deepEqual(
      prepared.roles,
      ['stats'],
      'Power/toughness text did not use the verified numeric path: ' + e.name,
    );
    assert.equal(hash(Buffer.from(prepared.png, 'base64')), n.renderHash);
    const trials = await session.page.evaluate(
      (definition) =>
        definition.candidates.map((c) => ({
          id: c.id,
          score: globalThis.__statsStudy.measure('stats', c.adjustment),
        })),
      definition,
    );
    await session.page.evaluate(() => globalThis.__statsStudy.finish());
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: e.pose.cohort,
      power: e.face.power,
      toughness: e.face.toughness,
      referenceHash: n.referenceHash,
      poseHash: n.poseHash,
      nativeScanHash: n.scanHash,
      canonicalReferenceHash: hash(canonical),
      baselineHash: n.renderHash,
      zeroReplayMaximumError: prepared.parity,
      trials,
    });
    if (rows.length % 10 === 0 || rows.length === entries.length) {
      await writeJson(output, {
        schema: 1,
        set: '2ed',
        status:
          rows.length === entries.length
            ? 'native-stats-matrix-complete'
            : 'native-stats-matrix-in-progress',
        scope:
          'Every Unlimited printing with power/toughness. Original words and stats, fixed independent scan poses, canonical references, exact native current face hashes and zero-command replay checks. The stats window excludes the rules-box bottom edge. Gray 130 is a geometry measurement control, not a proposed ink color. Shared selection and native profile replay are still required; no per-card offsets or complete-set certification.',
        rendererHash,
        nativeCaptureHash: hash(captureBytes),
        nativeInputsHash: hash(inputBytes),
        definitionHash: hash(definitionBytes),
        definition,
        toolHash: hash(await readFile(new URL(import.meta.url))),
        dependencies: await Promise.all(
          [
            'abu-type-browser.mjs',
            'abu-type-objective.mjs',
            'pixels-pure.mjs',
            'edges.mjs',
            'browser.mjs',
          ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
        ),
        transformed,
        browser: session.browser.version(),
        total: entries.length,
        completed: rows.length,
        rows,
      });
      console.log(rows.length + '/' + entries.length, e.name);
    }
  }
} finally {
  await session.close();
}
