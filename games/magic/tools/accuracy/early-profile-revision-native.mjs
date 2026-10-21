import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash } from './common.mjs';
const [previousDirectory, candidatesDirectory, out] = process.argv.slice(2);
assert(out, 'Usage: profile-revision-native.mjs PRIOR_NATIVE CANDIDATES OUT');
const previousBytes = await fs.readFile(path.join(previousDirectory, 'capture.json'));
const inputsBytes = await fs.readFile(path.join(previousDirectory, 'inputs.json'));
const previous = JSON.parse(previousBytes),
  inputs = JSON.parse(inputsBytes);
const candidates = JSON.parse(await fs.readFile(path.join(candidatesDirectory, 'capture.json')));
const allowed = new Set(candidates.rows.map((r) => r.id));
assert.equal(allowed.size, 10);
assert.equal(previous.completed, 302);
assert.equal(inputs.entries.length, 302);
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  previousRendererHash: previous.source.rendererHash,
  previousCaptureHash: hash(previousBytes),
  inputsHash: hash(inputsBytes),
  candidateCaptureHash: hash(await fs.readFile(path.join(candidatesDirectory, 'capture.json'))),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
};
const variants = ['original', 'oracle-original', 'oracle-modern'];
await fs.mkdir(out, { recursive: true });
await fs.writeFile(path.join(out, 'inputs.json'), inputsBytes);
let rows = [];
try {
  const prior = JSON.parse(await fs.readFile(path.join(out, 'capture.json')));
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
    const old = previous.rows.find((r) => r.id === e.id);
    assert.equal(old.referenceHash, e.reference.sha256);
    assert.equal(old.poseHash, hash(JSON.stringify(e.pose.transform)));
    const faces = Object.fromEntries(variants.map((v) => [v, old.variants[v].input]));
    for (const v of variants)
      assert.equal(hash(JSON.stringify(faces[v])), old.variants[v].inputHash);
    const rendered = await session.page.evaluate(
      async ({ id, faces }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const lease = await loadAccuracyImages(
            Object.values(faces).flatMap((f) => canvasAssetUrls(f)),
            new AbortController().signal,
            faces.original.illustration,
          ),
          results = {};
        try {
          for (const [variant, face] of Object.entries(faces)) {
            const layers = {};
            let body;
            for (const layer of ['face', 'etching']) {
              const image = await composeCardTexture(
                {
                  face,
                  printingId: id,
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
                  const layout = retroTextLayout(image.getContext('2d'), face);
                  body = layout
                    ? {
                        size: layout.size,
                        overflow: layout.overflow,
                        horizontalScale: layout.horizontalScale ?? 1,
                        lines: layout.lines.map((l) => ({
                          role: l.role,
                          text: l.runs.map((r) => r.text).join(''),
                          baseline: l.baseline,
                          inkBounds: l.inkBounds,
                        })),
                      }
                    : null;
                }
              } finally {
                image.width = image.height = 0;
              }
            }
            results[variant] = { ...layers, body };
          }
        } finally {
          lease.dispose();
        }
        return results;
      },
      { id: e.id, faces },
    );
    const row = {
      id: e.id,
      name: e.name,
      referenceHash: old.referenceHash,
      poseHash: old.poseHash,
      scanHash: old.scanHash,
      allowedGeometryChange: allowed.has(e.id),
      variants: {},
    };
    for (const v of variants) {
      const value = rendered[v],
        rasters = {};
      await fs.mkdir(path.join(out, v), { recursive: true });
      for (const layer of ['face', 'etching']) {
        const bytes = Buffer.from(value[layer], 'base64');
        rasters[layer] = hash(bytes);
        await fs.writeFile(
          path.join(out, v, e.id + (layer === 'face' ? '' : '-etching') + '.png'),
          bytes,
        );
        if (!allowed.has(e.id))
          assert.equal(
            rasters[layer],
            old.variants[v].rasters[layer],
            'Unexpected change ' + e.name + ' ' + v + ' ' + layer,
          );
      }
      assert.deepEqual(value.body, old.variants[v].body, 'Body layout changed ' + e.name + ' ' + v);
      if (v === 'original' && allowed.has(e.id))
        assert.equal(
          rasters.face,
          candidates.rows.find((r) => r.id === e.id).variants.find((r) => r.name === 'bottom-0.65')
            .hash,
          'Installed/candidate mismatch ' + e.name,
        );
      row.variants[v] = {
        input: faces[v],
        inputHash: old.variants[v].inputHash,
        rasters,
        body: value.body,
        pixelsUnchanged: rasters.face === old.variants[v].rasters.face,
        etchingUnchanged: rasters.etching === old.variants[v].rasters.etching,
      };
    }
    rows.push(row);
    await fs.writeFile(
      path.join(out, 'capture.json'),
      JSON.stringify(
        { schema: 1, source, denominator: 302, completed: rows.length, rows },
        null,
        2,
      ) + '\n',
    );
    if (rows.length % 10 === 0) console.log(rows.length, '/302');
  }
  assert.equal(session.faults.length, 0);
  const summary = {
    printings: rows.length,
    nativeFaces: rows.length * 3,
    unchangedFaces: rows.reduce(
      (n, r) => n + Object.values(r.variants).filter((v) => v.pixelsUnchanged).length,
      0,
    ),
    changedPrintings: rows.filter((r) => !r.variants.original.pixelsUnchanged).map((r) => r.id),
    bodyLayoutsUnchanged: rows.length * 3,
    overflow: rows.flatMap((r) =>
      Object.entries(r.variants)
        .filter(([, v]) => v.body?.overflow)
        .map(([mode]) => ({ id: r.id, mode })),
    ),
    faults: session.faults,
    source,
  };
  assert.deepEqual(new Set(summary.changedPrintings), allowed);
  assert.equal(summary.overflow.length, 0);
  await fs.writeFile(path.join(out, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(summary);
} finally {
  await session.close();
}
