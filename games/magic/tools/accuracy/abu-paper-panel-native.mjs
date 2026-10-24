// Shared paper-border width and bottom geometry; no palette, font, art or scan fitting.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { abuPaperPanelTrialPlugin } from './abu-paper-panel-plugin.mjs';
import { abuRasterDelta } from './abu-raster-ancestry.mjs';
const [inputFile, nativeDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: abu-paper-panel-native.mjs CURRENT_INPUTS CURRENT_NATIVE OUT');
const p = await abuRasterDelta();
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), p.afterRenderer);
const ib = await readFile(inputFile),
  snapshot = JSON.parse(ib),
  nb = await readFile(path.join(nativeDirectory, 'proof.json')),
  native = JSON.parse(nb);
assert.equal(hash(ib), native.source.inputHash);
assert.equal(hash(nb), p.native.contentSha256);
const entries = snapshot.entries.filter(
  (e) => ['lea', 'leb'].includes(e.set) && native.affectedIds.includes(e.id),
);
assert.equal(entries.length, 19);
const trials = [
  { id: 'current', kind: 'current', bottomUp: 0 },
  { id: 'control', kind: 'panel', bottomUp: 0 },
  { id: 'outline-up6', kind: 'outline', bottomUp: 6 },
  ...[3, 4, 5, 6, 7].map((bottomUp) => ({ id: 'panel-up' + bottomUp, kind: 'panel', bottomUp })),
];
const transformed = {},
  session = await openBrowser(
    { ...snapshot, entries },
    { plugins: [abuPaperPanelTrialPlugin(transformed)] },
  );
await mkdir(output, { recursive: true });
const rows = [];
try {
  for (const e of entries) {
    const result = await session.page.evaluate(
      async ({ e, trials }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { studyAbuPinline } = await import(
          '/games/magic/src/presentation/abu-dual-pinline.ts'
        );
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const defaults = studyAbuPinline();
        const lease = await loadAccuracyImages(
            canvasAssetUrls(e.face),
            new AbortController().signal,
            e.face.illustration,
          ),
          values = [];
        try {
          for (const t of trials) {
            const pinline = {
              ...defaults,
              paperPanel: { bottomUp: t.kind === 'panel' ? t.bottomUp : 0, pad: 2 },
              width: {
                left: (t.width ?? 6.375) / (488 / 1500),
                right: (t.width ?? 6.375) / (488 / 1500),
                top: (t.width ?? 6.375) / (680 / 2100),
                bottom: (t.width ?? 6.375) / (680 / 2100),
              },
              box: {
                ...defaults.box,
                bottom:
                  defaults.box.bottom - (t.kind === 'outline' ? t.bottomUp : 0) / (680 / 2100),
              },
            };
            const face =
              t.id === 'current' ? e.face : { ...e.face, __earlyFrameTrial: { pinline } };
            const c = await composeCardTexture(
              { face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              values.push({
                id: t.id,
                pinline: t.id === 'current' ? null : pinline,
                png: c.toDataURL().split(',')[1],
              });
            } finally {
              c.width = c.height = 0;
            }
          }
        } finally {
          lease.dispose();
        }
        return values;
      },
      { e, trials },
    );
    const baseline = native.rows.find((r) => r.id === e.id);
    assert.equal(
      hash(Buffer.from(result[0].png, 'base64')),
      baseline.original.hashes['after-face'],
      'Current instrumented face differs',
    );
    assert.equal(result[0].png, result[1].png, 'Explicit native geometry/palette control differs');
    const current = PNG.sync.read(Buffer.from(result[0].png, 'base64'));
    for (const value of result) {
      const b = Buffer.from(value.png, 'base64'),
        image = PNG.sync.read(b);
      let changed = 0,
        alpha = 0,
        outside = 0;
      for (let y = 0; y < 1020; y++)
        for (let x = 0; x < 732; x++) {
          const i = (y * 732 + x) * 4;
          if (image.data[i + 3] !== current.data[i + 3]) alpha++;
          if ([0, 1, 2, 3].some((k) => image.data[i + k] !== current.data[i + k])) {
            changed++;
            if (x < 80 || x > 660 || y < 600 || y > 930) outside++;
          }
        }
      assert.equal(alpha, 0);
      assert.equal(outside, 0, 'Pinline change outside the paper frame');
      await writeFile(path.join(output, e.id + '-' + value.id + '.png'), b);
      rows.push({
        id: e.id,
        set: e.set,
        name: e.name,
        referenceHash: e.reference.sha256,
        poseHash: baseline.poseHash,
        trial: value.id,
        pinline: value.pinline,
        renderHash: hash(b),
        changed,
        alpha,
        outside,
      });
    }
    console.log(e.set, e.name);
  }
  assert.deepEqual(session.faults, []);
  await writeJson(path.join(output, 'capture.json'), {
    schema: 1,
    status: 'native-lower-paper-pinline-trial-not-adopted',
    source: {
      rendererHash: p.afterRenderer,
      inputHash: hash(ib),
      nativeHash: hash(nb),
      toolHash: hash(await readFile(new URL(import.meta.url))),
      pluginHash: hash(await readFile(new URL('./abu-paper-panel-plugin.mjs', import.meta.url))),
      kernelHash: hash(await readFile(new URL('./abu-paper-panel-pixels.mjs', import.meta.url))),
      transformed,
      browser: session.browser.version(),
    },
    scope:
      'All19 physical Alpha/Beta duals. Current and explicit-geometry controls reproduce exactly. A shared vertical three-slice panel reflow preserves top/bottom border widths while resizing the broad striped background. Vacated stock is continued from the adjacent prepared material, with a fixed feather outside the border. Source palette/order, art, typography and scan poses stay fixed. The outline-only candidate remains as a disclosed control. Pixel changes are restricted to the declared paper frame. No parameter or acceptance is promoted.',
    trials,
    rows,
    faults: session.faults,
  });
} finally {
  await session.close();
}
