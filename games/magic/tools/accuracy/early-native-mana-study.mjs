// Retained native cost trials against fixed original scans and a verified palette.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { earlyManaRetainedPlugin } from './early-mana-retained-plugin.mjs';
const [nativeDirectory, colorDirectory, definitionFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-native-mana-study.mjs NATIVE COLOR_CAPTURE DEFINITION OUTPUT');
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    path.join(colorDirectory, 'capture.json'),
    definitionFile,
  ].map((f) => readFile(f)),
);
const [capture, inputs, color, definition] = raw.map((b) => JSON.parse(b));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, capture.source.rendererHash);
assert.equal(color.source.rendererHash, rendererHash);
assert.equal(color.completed, color.total);
assert.equal(color.source.nativeCaptureHash, hash(raw[0]));
assert.equal(color.source.nativeInputsHash, hash(raw[1]));
assert.equal(definition.colorCaptureHash, hash(raw[2]));
const profile = color.definition.candidates.find((c) => c.id === 'paper-ink').profile;
assert.deepEqual(profile, definition.baseProfile);
assert.deepEqual(definition.candidates[0], { name: 'current', delta: {} });
assert.equal(new Set(definition.candidates.map((c) => c.name)).size, definition.candidates.length);
const entries = inputs.entries.filter((e) => color.rows.some((r) => r.id === e.id));
assert.equal(entries.length, color.total);
const transformed = {},
  rows = [];
const session = await openBrowser(
  { ...inputs, entries },
  { plugins: [earlyManaRetainedPlugin(transformed)] },
);
const dependencies = await Promise.all(
  [
    'abu-mana-study-browser.mjs',
    'abu-type-objective.mjs',
    'pixels-pure.mjs',
    'early-mana-trial-plugin.mjs',
  ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
);
try {
  await session.page.evaluate(async () => {
    globalThis.__manaStudy = await import('/games/magic/tools/accuracy/abu-mana-study-browser.mjs');
  });
  for (const entry of entries) {
    const before = capture.rows.find((r) => r.id === entry.id),
      parent = color.rows.find((r) => r.id === entry.id);
    assert.equal(entry.face.wordingMode, 'original');
    assert(entry.pose.accepted);
    for (const key of ['referenceHash', 'poseHash']) assert.equal(before[key], parent[key]);
    const scanBytes = await readFile(path.join(nativeDirectory, entry.set, entry.id + '-scan.png'));
    assert.equal(hash(scanBytes), before.scanHash);
    const scan = normalize(PNG.sync.read(scanBytes));
    assert.deepEqual([scan.width, scan.height], [488, 680]);
    const canonical = PNG.sync.write({ width: 488, height: 680, data: Buffer.from(scan.data) });
    const result = await session.page.evaluate(
      ({ entry, profile, url, candidates }) =>
        globalThis.__manaStudy.measure(
          { ...entry, face: { ...entry.face, __earlyManaTrial: profile } },
          url,
          candidates,
        ),
      {
        entry,
        profile,
        url: 'data:image/png;base64,' + canonical.toString('base64'),
        candidates: definition.candidates,
      },
    );
    const nativeHash = hash(Buffer.from(result.nativePng, 'base64'));
    assert.equal(
      nativeHash,
      parent.trials.find((t) => t.id === 'paper-ink').faceHash,
      'Corrected native palette baseline changed: ' + entry.name,
    );
    delete result.nativePng;
    assert.equal(result.parity, 0);
    assert.equal(result.regionParity, 0);
    for (const error of Object.values(result.candidateParities)) assert.equal(error, 0);
    assert.equal(result.scores.length, definition.candidates.length);
    rows.push({
      id: entry.id,
      name: entry.name,
      material: entry.material,
      symbol: parent.symbol,
      cohort: entry.pose.cohort,
      referenceHash: before.referenceHash,
      poseHash: before.poseHash,
      scanHash: before.scanHash,
      canonicalReferenceHash: hash(canonical),
      baselineHash: nativeHash,
      ...result,
    });
    await writeJson(output, {
      schema: 1,
      set: '2ed',
      status:
        rows.length === entries.length
          ? 'retained-native-mana-matrix-complete'
          : 'native-mana-study-in-progress',
      scope:
        'Original Unlimited scans and verified native pigment candidates. One fixed shared geometry grid; calibration names select, reused development validation remains separate. Every palette baseline matches its actual native PNG. Retained callback and cropped sampling match exact bytes, and representative active controls are compared with full native composition. Final selected geometry still needs independent full-native score verification; long-title fitting may change with the available cost width.',
      rendererHash,
      nativeCaptureHash: hash(raw[0]),
      nativeInputsHash: hash(raw[1]),
      colorCaptureHash: hash(raw[2]),
      definitionHash: hash(raw[3]),
      definition,
      toolHash: hash(await readFile(new URL(import.meta.url))),
      pluginHash: hash(
        await readFile(new URL('./early-mana-retained-plugin.mjs', import.meta.url)),
      ),
      dependencies,
      browser: session.browser.version(),
      transformed,
      total: entries.length,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/' + entries.length, entry.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
