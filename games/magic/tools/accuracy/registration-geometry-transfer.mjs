import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { cacheRoot, fixtureRoot, root, hash, readJson, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { stockBounds } from './frame-family-metrics.mjs';
import { plateProfiles } from './printed-plate-registration.mjs';

// Symbol-only painter changes invalidate the coarse source-file guard, even
// when frame pixels have not changed. Transfer an existing accepted profile
// only after reproducing every one of its measured frame-anchor targets exactly.
// Neither fitting nor changing scan transforms occurs here.
const files = (await readdir(fixtureRoot)).filter((n) =>
  /^old-frame-registration-[a-z0-9]+\.json$/.test(n),
);
const studies = await Promise.all(
  ['early-hsb', 'old-hsb-preview'].map((n) => readJson(`${cacheRoot}/rollout/${n}.json`)),
);
const components = [
  ...new Map(studies.flatMap((s) => s.components).map((a) => [a.url, a])).values(),
];
const rendererStockHash = hash(
  Buffer.concat(
    await Promise.all(
      ['retro-frame.ts', 'retro-paint.ts'].map((n) =>
        readFile(`${root}/games/magic/src/presentation/${n}`),
      ),
    ),
  ),
);
const browser = await openBrowser({ entries: [], components }, { fonts: false });
try {
  for (const file of files) {
    const profile = await readJson(`${fixtureRoot}/${file}`);
    if (!profile.accepted || profile.provenance.rendererStockHash === rendererStockHash) continue;
    const rows = [];
    for (const guard of profile.guards.sources) {
      const result = await browser.page.evaluate(
        async ({ material, set, border }) => {
          const { paintRetroFace } = await import('/games/magic/src/presentation/retro-paint.ts');
          const { retroFrameAsset, retroFrameRect, retroBorderMask } = await import(
            '/games/magic/src/presentation/retro-frame.ts'
          );
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const face = {
            name: '',
            typeLine: material === 'L' ? 'Land' : material === 'A' ? 'Artifact' : 'Creature',
            colors: ['A', 'L'].includes(material) ? [] : [material],
            setCode: set,
            borderColor: border,
            frameStyle: 'retro',
            rulesText: '',
            artist: '',
            legalText: '',
          };
          const url = retroFrameAsset(face),
            rect = retroFrameRect(face),
            maskUrl = retroBorderMask(face);
          // Registration targets contain only frame edges; omit illustration,
          // mana and the new symbol source entirely from this comparison.
          const loaded = await loadCanvasImages([url, maskUrl], new AbortController().signal);
          try {
            const c = document.createElement('canvas');
            c.width = 732;
            c.height = 1020;
            const ctx = c.getContext('2d');
            ctx.scale(1.5, 1.5);
            paintRetroFace(ctx, face, loaded.images);
            const png = c.toDataURL();
            c.width = c.height = 0;
            return { png, url, rect, maskUrl };
          } finally {
            loaded.dispose();
          }
        },
        { material: guard.material, set: profile.set, border: profile.border },
      );
      assert.equal(result.url, guard.url);
      assert.deepEqual(result.rect, guard.rect);
      assert.equal(result.maskUrl, guard.maskUrl);
      const bytes = Buffer.from(result.png.split(',')[1], 'base64');
      const image = normalize(PNG.sync.read(bytes));
      const target = stockBounds(image, profile.border);
      assert.deepEqual(
        target,
        profile.targets[guard.material],
        `Frame target changed: ${profile.set}/${guard.material}`,
      );
      if (profile.plateTargets)
        assert.deepEqual(
          plateProfiles(image),
          profile.plateTargets[guard.material],
          `Plate target changed: ${profile.set}/${guard.material}`,
        );
      rows.push({
        material: guard.material,
        renderedHash: hash(bytes),
        targetHash: hash(JSON.stringify(target)),
      });
    }
    const transfer = {
      priorProfileHash: hash(JSON.stringify(profile)),
      fromStockHash: profile.provenance.rendererStockHash,
      toStockHash: rendererStockHash,
      methodHash: hash(await readFile(new URL(import.meta.url))),
      policy:
        'Exact equality of every retained frame/plate anchor target; original reference cohorts and transforms retained.',
      rows,
    };
    profile.provenance.rendererStockHash = rendererStockHash;
    profile.geometryTransfers = [...(profile.geometryTransfers ?? []), transfer];
    await writeJson(`${fixtureRoot}/${file}`, profile);
    console.log(
      profile.set,
      rows.length,
      'frame targets unchanged; registration guard transferred',
    );
  }
  assert.deepEqual(browser.faults, []);
} finally {
  await browser.close();
}
