import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, median, delta } from './hsb-color.mjs';
import { fixtureRoot, outputRoot, readJson, writeJson, hash, atomicWrite } from './common.mjs';
import { revisedDualSpecs } from './revised-dual-hsb-specs.mjs';

const candidates = await readJson(fixtureRoot + '/revised-frame-color-candidates.json'),
  audit = await readJson(fixtureRoot + '/revised-color-calibration-audit.json'),
  plan = await readJson(fixtureRoot + '/early-hsb-plan.json');
assert.equal(candidates.auditHash, hash(JSON.stringify(audit)));
assert.equal(candidates.samplingHash, hash(JSON.stringify(plan.sampling)));
const specs = revisedDualSpecs(candidates),
  components = await Promise.all(specs.map((s) => cachedFetch(s.asset, { offline: true })));
components.forEach((c, i) => assert.equal(c.sha256, specs[i].sourceHash));
const session = await openBrowser({ entries: [], components }, { fonts: false });
const groups = [];
try {
  for (const spec of specs) {
    const images = await session.page.evaluate(async (spec) => {
      const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { colorFrame } = await import('/games/magic/src/presentation/frame-hsb.ts');
      const { calibratedFrameProfile } = await import(
        '/games/magic/tools/accuracy/legacy-hsb-profiles.ts'
      );
      const loaded = await loadCanvasImages([spec.asset], new AbortController().signal);
      const result = {};
      try {
        const source = loaded.images.get(spec.asset),
          native = document.createElement('canvas');
        native.width = source.width;
        native.height = source.height;
        const ctx = native.getContext('2d', { willReadFrequently: true });
        const current = calibratedFrameProfile({
          name: 'Color study',
          setCode: '3ed',
          colors: spec.material === 'A' ? [] : [spec.material],
          typeLine: spec.material === 'A' ? 'Artifact' : 'Instant',
          colorCalibration: 'set-hsb-v1',
        });
        for (const [mode, adjustment] of [
          ['source', undefined],
          ['current', current],
          ['dual', spec.adjustment],
        ]) {
          ctx.clearRect(0, 0, native.width, native.height);
          ctx.drawImage(source, 0, 0);
          if (adjustment) {
            const pixels = ctx.getImageData(0, 0, native.width, native.height);
            colorFrame(pixels, adjustment);
            ctx.putImageData(pixels, 0, 0);
          }
          const c = document.createElement('canvas');
          c.width = 732;
          c.height = 1020;
          const target = c.getContext('2d');
          target.scale(1.5, 1.5);
          target.drawImage(native, ...spec.rect.map((v, i) => v * (i % 2 ? 680 : 488)));
          result[mode] = c.toDataURL();
          c.width = c.height = 0;
        }
        native.width = native.height = 0;
      } finally {
        loaded.dispose();
      }
      return result;
    }, spec);
    const samples = {},
      imageHashes = {};
    for (const [mode, image] of Object.entries(images)) {
      const bytes = Buffer.from(image.split(',')[1], 'base64'),
        rendered = normalize(PNG.sync.read(bytes));
      await atomicWrite(`${outputRoot}/revised-dual-hsb/${spec.material}-${mode}.png`, bytes);
      imageHashes[mode] = hash(bytes);
      samples[mode] = Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          sampleColor(rendered, plan.sampling[c + 'Patches'], {
            paper: c === 'paper',
            tileSize: 20,
          }),
        ]),
      );
    }
    const cards = audit.rows
      .filter((r) => r.material === spec.material && !r.issue)
      .map((r) => ({
        id: r.id,
        name: r.name,
        cohort: r.cohort,
        referenceHash: r.referenceHash,
        errors: Object.fromEntries(
          Object.entries(samples).map(([mode, s]) => [
            mode,
            Object.fromEntries(
              ['frame', 'paper'].map((c) => [c, delta(s[c].rgb, r.samples[c].rgb)]),
            ),
          ]),
        ),
      }));
    const reserved = cards.filter((r) => r.cohort === 'validation');
    const errors = Object.fromEntries(
      ['source', 'current', 'dual'].map((mode) => [
        mode,
        Object.fromEntries(
          ['frame', 'paper'].map((c) => [c, median(reserved.map((r) => r.errors[mode][c]))]),
        ),
      ]),
    );
    const accepted =
      reserved.length >= 5 && ['frame', 'paper'].every((c) => errors.dual[c] < errors.current[c]);
    groups.push({ ...spec, imageHashes, samples, cards, errors, accepted });
    console.log(spec.material, accepted, errors);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
await writeJson(fixtureRoot + '/revised-dual-hsb.json', {
  schemaVersion: 1,
  complete: groups.length === 6 && groups.every((g) => g.accepted),
  scope:
    'Revised white-stock regular Fourth frames only. Fixed per-material dual fits, thirty reserved cards from the existing cohort (not a new blind sample). Pixel-rendered held-out median Oklab color error, separately for frame and paper. No whole-card accuracy claim. Source-only masks; no per-scan fitting.',
  candidatesHash: hash(JSON.stringify(candidates)),
  auditHash: hash(JSON.stringify(audit)),
  samplingHash: hash(JSON.stringify(plan.sampling)),
  groups,
});
