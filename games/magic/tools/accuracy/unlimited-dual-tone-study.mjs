// Offline ablations before registry freezing, never a production or per-card override.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash } from './common.mjs';
const [base, out, selection = 'all'] = process.argv.slice(2);
assert(
  base && out,
  'Usage: unlimited-dual-tone-study.mjs BASE_NATIVE OUT [all|outer-only-1.20|current]',
);
const input = JSON.parse(await fs.readFile(path.join(base, 'inputs.json')));
const entries = input.entries.filter((e) => e.face.land && e.face.frameColors?.length === 2);
assert.equal(entries.length, 10);
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  inputsHash: hash(await fs.readFile(path.join(base, 'inputs.json'))),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
};
await fs.mkdir(out, { recursive: true });
const allVariants = [
  'current',
  'no-texture',
  'half-texture',
  'shadow-lift-06',
  'charcoal-1.08',
  'charcoal-1.20',
  'outer-only-1.10',
  'outer-only-1.20',
  'outer-only-1.30',
  'background-nine',
  'combined-nine',
];
assert(selection === 'all' || allVariants.includes(selection));
const variants = selection === 'all' ? allVariants : [selection];
const rows = [];
for (const variant of variants) {
  const session = await openBrowser(input, {
    plugins: [
      {
        name: 'study-only-profile-hook',
        transform(code, id) {
          if (id.endsWith('/data/registry.ts')) {
            assert.equal(
              code.split('freeze(data);').length,
              2,
              'Offline study hook no longer matches registry',
            );
            return code.replace('freeze(data);', 'globalThis.__study?.(data); freeze(data);');
          }
        },
      },
    ],
  });
  try {
    await session.page.evaluate(async (variant) => {
      globalThis.__study = (data) => {
        if (data.set !== '2ed' || data.kind !== 'calibration') return;
        const p = data.tables.setCalibrationProfiles['2ed'];
        for (const [color, source] of Object.entries(p.dualLand.sources)) {
          if (variant === 'background-nine' || variant === 'combined-nine')
            source.adjustment.frame.rgbScale = [
              1.036764705882353, 1.0327868852459017, 1.0256410256410255,
            ];
          if ((variant.startsWith('outer-only') || variant === 'combined-nine') && color === 'B') {
            const accent = source.adjustment.accents[0],
              outer = structuredClone(accent);
            outer.mask.rings = outer.mask.rings.slice(0, 1);
            accent.mask.rings = accent.mask.rings.slice(1);
            outer.adjustment.brightnessScale =
              variant === 'combined-nine' ? 1.2 : Number(variant.split('-')[2]);
            source.adjustment.accents.push(outer);
          }
          if (variant.startsWith('charcoal')) {
            delete source.adjustment.blackPoint.texture;
            if (color === 'B')
              source.adjustment.accents[0].adjustment.brightnessScale = Number(
                variant.split('-')[1],
              );
          }
          if (variant === 'no-texture') delete source.adjustment.blackPoint.texture;
          if (variant === 'half-texture')
            for (const knot of source.adjustment.blackPoint.texture)
              knot[1] = knot[1].map((v) => v * 0.5);
          if (variant === 'shadow-lift-06') source.adjustment.blackPoint.lift = [0.06, 0.06, 0.06];
        }
      };
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
    }, variant);
    for (const e of entries) {
      const result = await session.page.evaluate(async (e) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { calibratedFrameMaterials } = await import(
          '/games/magic/src/presentation/printing-calibration-materials.ts'
        );
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        try {
          const image = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            new AbortController().signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          try {
            return {
              png: image.toDataURL().split(',')[1],
              materials: calibratedFrameMaterials(e.face),
            };
          } finally {
            image.width = image.height = 0;
          }
        } finally {
          lease.dispose();
        }
      }, e);
      const bytes = Buffer.from(result.png, 'base64');
      delete result.png;
      await fs.mkdir(path.join(out, variant), { recursive: true });
      await fs.writeFile(path.join(out, variant, e.id + '.png'), bytes);
      if (variant === 'current')
        assert.equal(
          hash(bytes),
          hash(await fs.readFile(path.join(base, 'original', e.id + '.png'))),
          'Baseline drift ' + e.name,
        );
      rows.push({
        variant,
        id: e.id,
        name: e.name,
        hash: hash(bytes),
        referenceHash: e.reference.sha256,
        poseHash: hash(JSON.stringify(e.pose.transform)),
        ...result,
      });
      console.log(variant, e.name);
    }
    assert.equal(session.faults.length, 0);
  } finally {
    await session.close();
  }
  await fs.writeFile(
    path.join(out, 'capture.json'),
    JSON.stringify(
      {
        source,
        scope:
          'Tone ablations only; fixed installed 0.6.8 geometry, Original wording and scan poses',
        rows,
      },
      null,
      2,
    ) + '\n',
  );
}
