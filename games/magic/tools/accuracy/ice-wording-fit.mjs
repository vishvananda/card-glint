import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  readJson,
  writeJson,
  root,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  hash,
  sourceHash,
  atomicWrite,
} from './common.mjs';
import { openBrowser } from './browser.mjs';

const snapshot = await readJson(`${cacheRoot}/rollout/ice-symbol.json`),
  baseline = await readJson(`${outputRoot}/ice-symbol/before/capture.json`),
  failures = baseline.rows.filter((r) => r.failure),
  rendererHash = await sourceHash(`${root}/games/magic/src`),
  session = await openBrowser(snapshot),
  rows = [];
assert.equal(failures.length, 4);
try {
  for (const row of failures) {
    const face = { ...row.face, wordingMode: 'oracle', symbolStyle: 'original' };
    const result = await session.page.evaluate(
      async ({ before, face }) => {
        const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts'),
          { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts'),
          { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        await Promise.all([loadCanvasFonts(), loadRetroFont()]);
        const c = document.createElement('canvas').getContext('2d'),
          old = retroTextLayout(c, before),
          current = retroTextLayout(c, face),
          images = [];
        for (const tier of ['inspect', 'table']) {
          const canvas = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
          );
          images.push({ tier, data: canvas.toDataURL() });
          canvas.width = canvas.height = 0;
        }
        return { before: old, after: current, images };
      },
      { before: row.face, face },
    );
    assert.equal(result.before.overflow, true);
    assert.equal(result.after.overflow, false);
    const images = {};
    for (const { tier, data } of result.images) {
      const bytes = Buffer.from(data.split(',')[1], 'base64'),
        file = `${row.id}.${tier}.png`;
      await atomicWrite(`${outputRoot}/ice-wording/${file}`, bytes);
      images[tier] = { file, sha256: hash(bytes) };
    }
    rows.push({
      id: row.id,
      name: row.name,
      referenceHash: row.referenceHash,
      originalInputHash: hash(JSON.stringify(row.face)),
      oracleInputHash: hash(JSON.stringify(face)),
      before: result.before,
      after: result.after,
      images,
    });
    console.log(row.name, result.before.size, '→', result.after.size);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(`${root}/games/magic/src`));
  await writeJson(`${fixtureRoot}/ice-wording-fit.json`, {
    schemaVersion: 1,
    scope:
      'Diagnose all four frozen Ice Age baseline failures. The symbol-study adapter supplied unverified Oracle text without wordingMode, retaining the 15 px historical minimum. Explicit Oracle wording with original symbols fits the complete supplied paragraphs using the existing supported public options. This is an input-mode coverage issue, not evidence of an unsupported frame. Preserve frozen symbol-study inputs and failures; do not silently substitute wording or change their scores. No source-text accuracy claim.',
    rendererHash,
    methodHash: hash(await readFile(new URL(import.meta.url))),
    baselineHash: hash(JSON.stringify(baseline)),
    rows,
  });
} finally {
  await session.close();
}
