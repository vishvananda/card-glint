// Replays immutable Original recipes through the native painter; never downloads.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';

const [inputFile, output, scope = 'affected'] = process.argv.slice(2);
assert(
  inputFile && output && ['affected', 'all'].includes(scope),
  'Usage: revised-semantic-frame-review.mjs INPUTS OUTPUT [affected|all]',
);
const inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes);
assert.equal(inputs.set, '3ed');
assert.equal(inputs.entries.length, 306);
const affectedNames = ['Animate Artifact', 'Steal Artifact', 'Warp Artifact', 'Living Artifact'];
const selected = inputs.entries.filter((e) => scope === 'all' || affectedNames.includes(e.name));
const beforeSource = await sourceHash(path.join(root, 'games/magic/src'));
await mkdir(output, { recursive: true });
const session = await openBrowser(inputs),
  rows = [];
try {
  for (const entry of selected) {
    const affected = affectedNames.includes(entry.name);
    const result = await session.page.evaluate(
      async ({ entry, affected }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const { withCardWording } = await import('/games/magic/src/presentation/wording.ts');
        const { revisedFrameRect, revisedArtRect } = await import(
          '/games/magic/src/presentation/revised-frame-geometry.ts'
        );
        const { retroFrameAsset } = await import('/games/magic/src/presentation/retro-frame.ts');
        const { printingCalibrationMaterials } = await import(
          '/games/magic/src/presentation/printing-calibration-materials.ts'
        );
        const { printingColorSource } = await import(
          '/games/magic/src/presentation/printing-color-source.ts'
        );
        const face = entry.face,
          card = entry.card;
        const oracle = withCardWording(
          face,
          {
            original: face,
            oracle: { typeLine: card.type_line, rulesText: card.oracle_text ?? '' },
          },
          'oracle',
          { symbolStyle: 'original' },
        );
        const modes = [{ id: 'original', face }];
        if (affected)
          modes.push({ id: 'oracle', face: oracle }, { id: 'etching', face, layer: 'etching' });
        const signal = new AbortController().signal,
          out = {};
        for (const mode of modes) {
          const lease = await loadAccuracyImages(
            canvasAssetUrls(mode.face),
            signal,
            mode.face.illustration,
          );
          try {
            const canvas = await composeCardTexture(
              {
                face: mode.face,
                printingId: entry.id,
                printedImage: null,
                ...(mode.layer ? { layer: mode.layer } : {}),
              },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              const layout = retroTextLayout(canvas.getContext('2d'), mode.face);
              if (layout?.overflow) throw Error(entry.name + ' overflows');
              out[mode.id] = {
                png: canvas.toDataURL().split(',')[1],
                input: mode.face,
                frame: revisedFrameRect(mode.face),
                art: revisedArtRect(mode.face),
                asset: retroFrameAsset(mode.face),
                colorSource: printingColorSource(mode.face),
                materials: printingCalibrationMaterials(mode.face),
                layout: layout
                  ? {
                      size: layout.size,
                      x: layout.x,
                      width: layout.width,
                      top: layout.top,
                      height: layout.height,
                      overflow: false,
                      lines: layout.lines.map((l) => l.runs.map((r) => r.text).join('')),
                    }
                  : null,
              };
            } finally {
              canvas.width = canvas.height = 0;
            }
          } finally {
            lease.dispose();
          }
        }
        return out;
      },
      { entry, affected },
    );
    const modes = {};
    for (const [mode, { png, input, ...metadata }] of Object.entries(result)) {
      const bytes = Buffer.from(png, 'base64'),
        file = entry.id + '-' + mode + '.png';
      await writeFile(path.join(output, file), bytes);
      modes[mode] = {
        file,
        sha256: hash(bytes),
        inputHash: hash(JSON.stringify(input)),
        ...metadata,
      };
    }
    rows.push({
      id: entry.id,
      name: entry.name,
      affected,
      referenceHash: entry.reference.sha256,
      artHash: entry.art?.sha256,
      modes,
    });
    if (rows.length % 25 === 0 || scope === 'affected')
      console.log(rows.length, '/', selected.length, entry.name);
    await writeJson(path.join(output, 'capture.json'), {
      schema: 1,
      set: '3ed',
      status: rows.length === selected.length ? 'complete' : 'in-progress',
      source: {
        rendererHash: beforeSource,
        inputHash: hash(inputBytes),
        toolHash: hash(await readFile(new URL(import.meta.url))),
      },
      scope:
        'Native production painter, cached immutable assets, Original inputs. Four Enchant Artifact cases also capture Oracle with historical symbols and etching. No scan pose or typography adjustment.',
      browser: session.browser.version(),
      rows,
      faults: session.faults,
    });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(
    await sourceHash(path.join(root, 'games/magic/src')),
    beforeSource,
    'Renderer changed while capturing',
  );
} catch (error) {
  console.error(session.faults);
  throw error;
} finally {
  await session.close();
}
