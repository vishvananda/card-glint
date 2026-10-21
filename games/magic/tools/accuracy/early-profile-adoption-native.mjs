// Verify an installed printing profile through the public native painter.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
const [study, out] = process.argv.slice(2);
assert(out, 'Usage: early-profile-adoption-native.mjs CANDIDATE_NATIVE OUTPUT');
const raw = await Promise.all(
  ['capture.json', 'inputs.json'].map((f) => readFile(path.join(study, f))),
);
const [capture, inputs] = raw.map((b) => JSON.parse(b));
assert.equal(capture.completed, 302);
assert.equal(inputs.entries.length, 302);
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  candidateCaptureHash: hash(raw[0]),
  inputsHash: hash(raw[1]),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    'Actual installed profile, no runtime injection. All Original native pixels/etching must match the measured complete candidate. Oracle variants use public Scryfall import, complete text and independent symbol choices. Fixed scans and poses are retained, never refitted.',
};
await mkdir(out, { recursive: true });
let rows = [];
try {
  const prior = JSON.parse(await readFile(path.join(out, 'capture.json')));
  assert.deepEqual(prior.source, source);
  rows = prior.rows;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const session = await openBrowser(inputs);
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of inputs.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    const expected = capture.rows.find((r) => r.id === e.id);
    const result = await session.page.evaluate(async (e) => {
      const { fromScryfallCard } = await import('/games/magic/src/presentation/scryfall-card.ts');
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
      const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
      const faces = { original: e.face };
      for (const style of ['modern', 'original'])
        faces['oracle-' + style] = fromScryfallCard(e.card, {
          wording: 'oracle',
          symbolStyle: style,
          illustrations: [e.face.illustration],
        });
      const urls = [...new Set(Object.values(faces).flatMap(canvasAssetUrls))];
      const lease = await loadAccuracyImages(
        urls,
        new AbortController().signal,
        e.face.illustration,
      );
      const result = {};
      try {
        for (const [variant, face] of Object.entries(faces)) {
          const layers = {};
          let body;
          for (const layer of ['face', 'etching']) {
            const image = await composeCardTexture(
              {
                face,
                printingId: e.id,
                printedImage: null,
                layer: layer === 'face' ? undefined : 'etching',
              },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              layers[layer] = image.toDataURL().split(',')[1];
              if (layer === 'face') {
                const l = retroTextLayout(image.getContext('2d'), face);
                body = l
                  ? {
                      size: l.size,
                      overflow: l.overflow,
                      horizontalScale: l.horizontalScale ?? 1,
                      lines: l.lines.map((v) => ({
                        role: v.role,
                        text: v.runs.map((r) => r.text).join(''),
                        baseline: v.baseline,
                        inkBounds: v.inkBounds,
                      })),
                    }
                  : null;
              }
            } finally {
              image.width = image.height = 0;
            }
          }
          result[variant] = { face, body, layers };
        }
      } finally {
        lease.dispose();
      }
      return result;
    }, e);
    const variants = {};
    for (const [variant, values] of Object.entries(result)) {
      const rasters = {};
      await mkdir(path.join(out, variant), { recursive: true });
      for (const [layer, data] of Object.entries(values.layers)) {
        const bytes = Buffer.from(data, 'base64');
        rasters[layer] = hash(bytes);
        await writeFile(
          path.join(out, variant, e.id + (layer === 'face' ? '' : '-etching') + '.png'),
          bytes,
        );
      }
      if (variant === 'original') {
        assert.deepEqual(rasters, expected.rasters.candidate, 'Installed pixels differ: ' + e.name);
        assert.deepEqual(values.body, expected.body.candidate, 'Installed body differs: ' + e.name);
        assert.deepEqual(values.face, e.face);
      } else {
        assert.equal(values.face.wordingMode, 'oracle');
        assert.equal(values.face.rulesText, e.card.oracle_text ?? '');
        assert.equal(values.face.typeLine, e.card.type_line);
      }
      variants[variant] = {
        rasters,
        body: values.body,
        input: values.face,
        inputHash: hash(JSON.stringify(values.face)),
      };
    }
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: expected.poseHash,
      scanHash: expected.scanHash,
      variants,
    });
    await writeJson(path.join(out, 'capture.json'), {
      schema: 1,
      source,
      denominator: 302,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/302 ' + e.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), source.rendererHash);
const overflow = rows.flatMap((r) =>
  Object.entries(r.variants)
    .filter(([, v]) => v.body?.overflow)
    .map(([variant]) => ({ name: r.name, variant })),
);
await writeJson(path.join(out, 'summary.json'), {
  source,
  cards: rows.length,
  nativeFaces: rows.length * 3,
  originalPixelMatches: rows.length,
  overflow,
});
console.log(JSON.stringify({ completed: rows.length, overflow }));
assert.deepEqual(overflow, [], 'Native text overflow');
