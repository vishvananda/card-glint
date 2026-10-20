// Diagnose shared heading/credit geometry with filled ink at a fixed gray value.
import assert from 'node:assert/strict';
import path from 'node:path';
import { PNG } from 'pngjs';
import { normalize } from './pixels-pure.mjs';
import { readFile } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
const [nativeDirectory, output, sharedDefinitionFile] = process.argv.slice(2);
const sharedBytes = sharedDefinitionFile ? await readFile(sharedDefinitionFile) : null;
const sharedDefinition = sharedBytes ? JSON.parse(sharedBytes) : null;
assert(output, 'Usage: early-heading-study.mjs NATIVE_CAPTURE OUTPUT [SHARED_DEFINITION]');
const captureBytes = await readFile(path.join(nativeDirectory, 'capture.json'));
const inputsBytes = await readFile(path.join(nativeDirectory, 'inputs.json'));
const capture = JSON.parse(captureBytes),
  inputs = JSON.parse(inputsBytes);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(capture.source.rendererHash, rendererHash);
assert.equal(inputs.source.rendererHash, rendererHash);
assert(
  inputs.entries.every((e) => e.set === '2ed'),
  'These lettering windows are measured for Unlimited only',
);
const entries = inputs.entries.filter((e) => {
  assert.equal(e.face.wordingMode, 'original');
  assert(e.pose.accepted);
  if (e.material === 'L') return true;
  const peers = inputs.entries
    .filter((p) => p.material === e.material && p.pose.cohort === e.pose.cohort)
    .sort((a, b) => a.id.localeCompare(b.id));
  return peers.slice(0, e.pose.cohort === 'calibration' ? 3 : 2).some((p) => p.id === e.id);
});
const transformed = {};
const session = await openBrowser(
  { ...inputs, entries },
  {
    plugins: [
      {
        name: 'early-heading-commands',
        enforce: 'pre',
        transform(source, id) {
          const file = id.split('/').at(-1);
          let needle, replacement;
          if (file === 'abu-type-browser.mjs') {
            const replacements = [
              [
                '  sc.drawImage(await image(scanUrl), 0, 0);',
                `  const referenceImage = await image(scanUrl);
  if (referenceImage.naturalWidth !== 488 || referenceImage.naturalHeight !== 680)
    throw Error('Typography reference must be canonical 488x680');
  sc.drawImage(referenceImage, 0, 0);`,
              ],
              ['  title: [29, 29, 408, 41],', '  title: [29, 33, 408, 34],'],
              ['  type: [29, 362, 417, 42],', '  type: [29, 378, 417, 25],'],
              [
                'for (const [role, rect] of Object.entries(rects)) {',
                `const costCount = face.manaSymbols?.length ?? 0;
  const costLeft = costCount ? 432 - (costCount - 1) * 27 - 23.9 / 2 - 4 : 437;
  const textRects = { ...rects, title: [29, 33, Math.min(408, Math.floor(costLeft) - 29), 34] };
  for (const [role, rect] of Object.entries(textRects)) {`,
              ],
            ];
            let code = source;
            for (const [needle, replacement] of replacements) {
              assert.equal(code.split(needle).length, 2, 'Heading ROI hook changed');
              code = code.replace(needle, replacement);
            }
            const proof = { before: hash(source), after: hash(code) };
            if (transformed[file]) assert.deepEqual(transformed[file], proof);
            transformed[file] = proof;
            return code;
          }
          if (file === 'retro-rules.ts') {
            needle = 'function baseRetroTextLayout(';
            replacement = 'export function baseRetroTextLayout(';
          } else if (file === 'rules-paint.ts') {
            needle = '  if (!rulesInkVisible(context)) return;';
            replacement =
              '  if ((globalThis as any).__abuBody?.(context, layout, images, paintSymbol, inkInsetEm, color)) return;\n' +
              needle;
          } else return;
          assert.equal(source.split(needle).length, 2, file + ' hook changed');
          const code = source.replace(needle, replacement);
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
    globalThis.__headingStudy = await import('/games/magic/tools/accuracy/abu-type-browser.mjs');
  });
  for (const entry of entries) {
    const baseline = capture.rows.find((r) => r.id === entry.id);
    assert(baseline && baseline.accepted);
    for (const field of ['referenceHash', 'poseHash'])
      assert.equal(
        baseline[field],
        field === 'referenceHash'
          ? entry.reference.sha256
          : hash(JSON.stringify(entry.pose.transform)),
      );
    const scan = await readFile(path.join(nativeDirectory, entry.set, entry.id + '-scan.png'));
    assert.equal(hash(scan), baseline.scanHash);
    const nativeScan = PNG.sync.read(scan);
    assert.deepEqual([nativeScan.width, nativeScan.height], [732, 1020]);
    const canonicalScan = normalize(nativeScan);
    assert.deepEqual([canonicalScan.width, canonicalScan.height], [488, 680]);
    const canonicalBytes = PNG.sync.write({
      width: 488,
      height: 680,
      data: Buffer.from(canonicalScan.data),
    });
    const prepared = await session.page.evaluate(
      ({ entry, url }) =>
        globalThis.__headingStudy.prepare(entry, url, ['title', 'type', 'artist']),
      { entry, url: 'data:image/png;base64,' + canonicalBytes.toString('base64') },
    );
    assert.equal(
      hash(Buffer.from(prepared.png.split(',').at(-1), 'base64')),
      baseline.renderHash,
      'Native heading control changed: ' + entry.name,
    );
    delete prepared.png;
    const fits = sharedDefinition
      ? await session.page.evaluate((definition) => {
          const api = globalThis.__headingStudy;
          return Object.fromEntries(
            Object.entries(definition.candidates).map(([role, candidates]) => [
              role,
              {
                baseline: api.measure(role, {}),
                fixedGray: api.measure(role, { gray: 130 }),
                candidates: candidates.map((candidate) => ({
                  ...candidate,
                  score: api.measure(role, candidate.adjustment),
                })),
              },
            ]),
          );
        }, sharedDefinition)
      : await session.page.evaluate(() => {
          const api = globalThis.__headingStudy;
          const roles = Object.keys(globalThis.__abuState.prepared);
          const fit = (role, family) => {
            const base = { gray: 130, ...(family ? { family } : {}) };
            let best = { ...base },
              value = api.measure(role, best),
              trials = 1;
            const baseline = api.measure(role, {}),
              fixedGray = value;
            const dimensions =
              role === 'type'
                ? { dx: [-25, 3, 1], dy: [-5, 5, 0.5], size: [-3, 3, 0.5], width: [-12, 16, 1] }
                : role === 'artist'
                  ? { dx: [-15, 5, 1], dy: [-8, 5, 0.5], size: [-4, 3, 0.5], width: [-10, 10, 1] }
                  : { dx: [-8, 8, 0.5], dy: [-5, 5, 0.5], size: [-3, 2, 0.5], width: [-12, 16, 1] };
            for (let pass = 0; pass < 2; pass++)
              for (const [key, [lo, hi, step]] of Object.entries(dimensions)) {
                let winner = best;
                for (let v = lo; v <= hi + 1e-8; v += step) {
                  const candidate = { ...best, [key]: v },
                    s = api.measure(role, candidate);
                  trials++;
                  if (s > value + 1e-9) {
                    value = s;
                    winner = candidate;
                  }
                }
                best = winner;
              }
            return { baseline, fixedGray, value, adjustment: best, trials };
          };
          return Object.fromEntries(
            roles.map((role) => [
              role,
              role === 'artist'
                ? { MPlantin: fit(role, 'MPlantin'), Goudy: fit(role, 'Goudy') }
                : fit(role),
            ]),
          );
        });
    await session.page.evaluate(() => globalThis.__headingStudy.finish());
    rows.push({
      id: entry.id,
      name: entry.name,
      material: entry.material,
      cohort: entry.pose.cohort,
      referenceHash: baseline.referenceHash,
      poseHash: baseline.poseHash,
      baselineHash: baseline.renderHash,
      nativeScanHash: baseline.scanHash,
      canonicalReferenceHash: hash(canonicalBytes),
      commands: prepared.commands,
      zeroReplayMaximumError: prepared.parity,
      fits,
    });
    await writeJson(output, {
      schema: 1,
      status:
        rows.length === entries.length
          ? sharedDefinition
            ? 'shared-heading-matrix-complete'
            : 'diagnostic-heading-probes-complete'
          : 'heading-study-in-progress',
      scope: sharedDefinition
        ? 'Native original-printing commands with one fixed shared candidate grid per role. All native baselines, canonical reference dimensions, independent scan poses and zero-command replay checks remain enforced. Filled gray ink is fixed at 130; no hollow font or per-printing defaults. Selection must use calibration rows only; named validation rows are reused development evidence. This matrix is not runtime profile adoption, a body-text fit or whole-set certification.'
        : 'Native original-printing commands, frozen independent scan poses and exact native full-card baseline hashes. Three calibration and two validation names per ordinary material, plus all twenty-five lands. Geometry probes keep filled gray ink fixed at 130; artist compares MPlantin and Goudy. Title windows exclude the fixed mana-cost area; type windows exclude artwork/frame borders. Per-card probes are diagnostics only and cannot become printing overrides. Shared defaults require calibration-only selection, held-out checking and native profile replay after frame/color integration. Gray, shadow and body-text calibration remain separate.',
      rendererHash,
      ...(sharedBytes ? { sharedDefinitionHash: hash(sharedBytes), sharedDefinition } : {}),
      nativeCaptureHash: hash(captureBytes),
      nativeInputsHash: hash(inputsBytes),
      toolHash: hash(await readFile(new URL(import.meta.url))),
      dependencies: await Promise.all(
        [
          'abu-type-browser.mjs',
          'abu-type-objective.mjs',
          'browser.mjs',
          'pixels-pure.mjs',
          'edges.mjs',
        ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
      ),
      browser: session.browser.version(),
      transformed,
      total: entries.length,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/' + entries.length, entry.name);
  }
} finally {
  await session.close();
}
