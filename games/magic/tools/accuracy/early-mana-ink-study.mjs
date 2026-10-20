// Actual native production ink expansion; no mask-scale prediction or new scan pose.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { earlyManaInkPlugin } from './early-mana-ink-plugin.mjs';
import { root, sourceHash, hash, writeJson } from './common.mjs';
const [native, auditFile, baselineDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-mana-ink-study.mjs NATIVE AUDIT GLYPH_NATIVE OUT');
const raw = await Promise.all(
  [
    path.join(native, 'capture.json'),
    path.join(native, 'inputs.json'),
    auditFile,
    path.join(baselineDirectory, 'capture.json'),
  ].map((f) => readFile(f)),
);
const [capture, inputs, audit, baseline] = raw.map((b) => JSON.parse(b));
assert.equal(baseline.completed, baseline.total);
assert.equal(baseline.source.nativeCaptureHash, hash(raw[0]));
assert.equal(baseline.source.nativeInputsHash, hash(raw[1]));
assert.equal(baseline.source.auditHash, hash(raw[2]));
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), capture.source.rendererHash);
const profile = baseline.definition.candidates.find((c) => c.id === 'glyph-fit').profile;
const entries = inputs.entries.filter((e) =>
  baseline.rows.some((r) => r.id === e.id && ['B', 'R', 'G'].includes(r.symbol)),
);
assert.equal(entries.length, 30);
const candidates = [0, 0.2, 0.4, 0.6].map((amount) => ({
  id: 'ink-' + amount,
  profile: { ...profile, inkExpansion: { B: amount, R: amount, G: amount } },
}));
await mkdir(output);
const transformed = {},
  rows = [];
const session = await openBrowser(
  { ...inputs, entries },
  { plugins: [earlyManaInkPlugin(transformed)] },
);
const source = {
  schema: 1,
  rendererHash: capture.source.rendererHash,
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  auditHash: hash(raw[2]),
  baselineHash: hash(raw[3]),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  pluginHash: hash(await readFile(new URL('./early-mana-ink-plugin.mjs', import.meta.url))),
  basePluginHash: hash(await readFile(new URL('./early-mana-trial-plugin.mjs', import.meta.url))),
  browser: session.browser.version(),
  scope:
    'Thirty predeclared B/R/G cases, unchanged native painter, shared per-color stroke weight after independently fitted disc/glyph geometry. Original words and frozen scan poses. Source expansion is pixels per nominal 24px disc; production palette and cache keys include it. No runtime adoption, new normalization, holdout or whole-card certification.',
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    assert.equal(e.face.wordingMode, 'original');
    const prior = baseline.rows.find((r) => r.id === e.id);
    const control = prior.trials.find((t) => t.id === 'glyph-fit');
    const br = capture.rows.find((r) => r.id === e.id);
    const ar = audit.rows.find((r) => r.id === e.id);
    assert.equal(br.poseHash, hash(JSON.stringify(e.pose.transform)));
    assert.equal(ar.poseHash, br.poseHash);
    const beforeBytes = await readFile(path.join(baselineDirectory, control.file));
    assert.equal(hash(beforeBytes), control.faceHash);
    const before = PNG.sync.read(beforeBytes);
    const rasters = await session.page.evaluate(
      async ({ e, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        try {
          const result = [];
          for (const candidate of candidates) {
            const image = await composeCardTexture(
              {
                face: { ...e.face, __earlyManaTrial: candidate.profile },
                printingId: e.id,
                printedImage: null,
              },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              result.push(image.toDataURL().split(',')[1]);
            } finally {
              image.width = image.height = 0;
            }
          }
          return result;
        } finally {
          lease.dispose();
        }
      },
      { e, candidates },
    );
    const trials = [];
    for (let j = 0; j < rasters.length; j++) {
      const bytes = Buffer.from(rasters[j], 'base64'),
        im = PNG.sync.read(bytes);
      assert.deepEqual([im.width, im.height], [732, 1020]);
      if (!j) assert.equal(hash(bytes), control.faceHash, 'Zero expansion changed ' + e.name);
      let changed = 0,
        outside = 0,
        alphaChanged = 0;
      const [left, top, width, height] = prior.rect;
      for (let p = 0; p < 732 * 1020; p++) {
        const i = p * 4,
          x = p % 732,
          y = Math.floor(p / 732);
        if (before.data[i + 3] !== im.data[i + 3]) alphaChanged++;
        if (![0, 1, 2, 3].some((k) => before.data[i + k] !== im.data[i + k])) continue;
        changed++;
        if (
          !(
            (x >= left * 1.5 &&
              x < (left + width) * 1.5 &&
              y >= top * 1.5 &&
              y < (top + height) * 1.5) ||
            (x >= 53 * 1.5 && x < 445 * 1.5 && y >= 404 * 1.5 && y < 603 * 1.5)
          )
        )
          outside++;
      }
      assert.equal(outside, 0);
      assert.equal(alphaChanged, 0);
      if (j) assert(changed > 0, 'Inactive ink control ' + e.name);
      const file = e.id + '-' + candidates[j].id + '.png';
      await writeFile(path.join(output, file), bytes);
      trials.push({
        id: candidates[j].id,
        amount: candidates[j].profile.inkExpansion[prior.symbol],
        faceHash: hash(bytes),
        file,
        changed,
        outside,
        alphaChanged,
        circle: control.circle,
      });
    }
    rows.push({
      id: e.id,
      name: e.name,
      symbol: prior.symbol,
      cohort: prior.cohort,
      referenceHash: br.referenceHash,
      scanHash: br.scanHash,
      poseHash: br.poseHash,
      rect: prior.rect,
      trials,
    });
    await writeJson(path.join(output, 'capture.json'), {
      source,
      transformed,
      candidates,
      total: entries.length,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/' + entries.length, e.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
