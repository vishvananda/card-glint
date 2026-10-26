import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';
import { createServer } from './magic-vite.mjs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { cardTextureKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  const base = {
    name: 'Heading',
    typeLine: 'Creature — Bird',
    colors: ['U'],
    setCode: '8ed',
    frameStyle: 'modern',
    frameAssetFamily: 'eighth',
  };
  const faces = [
    base,
    { ...base, setCode: '9ed', borderColor: 'black' },
    { ...base, setCode: 'FORGE' },
    { ...base, setCode: 'fut', frameAssetFamily: undefined, frameTemplate: 'future' },
    {
      ...base,
      name: 'One // Two',
      setCode: 'dis',
      frameAssetFamily: undefined,
      layout: 'split',
      faces: [
        { ...base, typeLine: 'Instant' },
        { ...base, typeLine: 'Sorcery' },
      ],
    },
  ];
  const input = (face) => ({ face, printedImage: null, printingId: null });
  const marker = 'matrix-heading-alphabetic-v1';
  for (const face of faces) {
    assert(JSON.parse(cardTextureKey(input(face), 'inspect')).includes(marker));
    for (const override of [
      { printedImage: 'scan.png' },
      { layer: 'etching' },
      { paintLayer: 'artwork' },
    ])
      assert.equal(
        JSON.parse(cardTextureKey({ ...input(face), ...override }, 'inspect')).includes(marker),
        false,
      );
  }
  for (const face of [
    { ...base, setCode: 'm21', frameAssetFamily: 'm15-accurate' },
    { ...base, setCode: 'lea', frameStyle: 'retro', frameAssetFamily: undefined },
  ])
    assert.equal(JSON.parse(cardTextureKey(input(face), 'inspect')).includes(marker), false);
  console.log(
    'Matrix cache revision covers ordinary, inherited, future and 2003 split headings; scans, art-only, etching and other heading fonts keep their keys.',
  );
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch({
      headless: true,
      args: engine === chromium ? ['--no-sandbox'] : [],
    });
    try {
      const page = await browser.newPage();
      await page.goto('http://127.0.0.1:' + server.httpServer.address().port);
      const results = await page.evaluate(async () => {
        const { paintFittedText } = await import('/games/magic/src/presentation/canvas-text.ts');
        const cases = [];
        // No external font fetch: the fallback deliberately has ordinary metrics.
        // This catches relying on Linux's accidental middle==alphabetic behavior
        // even on a runner where the malformed pinned Matrix font hides the bug.
        for (const family of ['CardRenderer MTG Matrix', 'CardRenderer MTG Beleren'])
          for (const baseline of ['middle', 'top', 'alphabetic'])
            for (const size of [30.368, 26])
              for (const text of ['Serra Angel', 'Creature — Angel']) {
                const make = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 600;
                  canvas.height = 160;
                  const c = canvas.getContext('2d');
                  c.fillStyle = '#17140f';
                  c.textAlign = 'left';
                  c.textBaseline = baseline;
                  c.translate(3.25, 4);
                  c.scale(1.5, 1.5);
                  return { canvas, c };
                };
                const a = make(),
                  b = make();
                const prior = {
                  baseline: a.c.textBaseline,
                  font: a.c.font,
                  transform: a.c.getTransform().toString(),
                };
                paintFittedText(a.c, text, 14, 70, 370, size, true, 1, family);
                b.c.font = 'bold ' + size + 'px "' + family + '", Georgia';
                b.c.textBaseline = family === 'CardRenderer MTG Matrix' ? 'alphabetic' : baseline;
                b.c.fillText(text, 14, 70, 370);
                const left = a.c.getImageData(0, 0, 600, 160).data;
                const right = b.c.getImageData(0, 0, 600, 160).data;
                let differences = 0;
                for (let i = 0; i < left.length; i++) differences += Number(left[i] !== right[i]);
                if (differences)
                  throw Error(JSON.stringify({ family, baseline, size, text, differences }));
                if (
                  a.c.textBaseline !== prior.baseline ||
                  a.c.font !== prior.font ||
                  a.c.getTransform().toString() !== prior.transform
                )
                  throw Error('Heading paint leaked Canvas state');
                cases.push({ family, baseline, size, text, differences });
              }
        return cases;
      });
      assert.equal(results.length, 24);
      assert(results.every((r) => r.differences === 0));
      console.log(
        engine.name() +
          ': Matrix headings use calibrated alphabetic anchors; other fonts and Canvas state retain their contracts.',
      );
    } finally {
      await browser.close();
    }
  }
} finally {
  await server.close();
}

const { readFile } = await import('node:fs/promises');
const { hash, sourceHash } = await import('../games/magic/tools/accuracy/common.mjs');
const { matrixHeadingDelta, preMatrixHeadingSource, matrixHeadingHistoricalHash } = await import(
  '../games/magic/tools/accuracy/matrix-heading-ancestry.mjs'
);
const { preArnProfileSource, arnHistoricalSourceFiles } = await import(
  '../games/magic/tools/accuracy/arn-profile-ancestry.mjs'
);
const proof = await matrixHeadingDelta();
assert.notEqual(await sourceHash('games/magic/src'), proof.beforeRenderer);
assert.equal(
  await matrixHeadingHistoricalHash(undefined, {
    projectSource: preArnProfileSource,
    selectFiles: arnHistoricalSourceFiles,
  }),
  proof.beforeRenderer,
);
for (const [file, value] of Object.entries(proof.files)) {
  const bytes = await readFile(file);
  if (file.endsWith('/generated-manifest.json'))
    assert.equal(hash(await preArnProfileSource(file, bytes)), value.before);
  else assert.equal(hash(bytes), value.after);
  assert.equal(
    hash(await preMatrixHeadingSource(file, Buffer.from(value.afterSource))),
    value.before,
  );
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unknown change\n')]);
  assert.deepEqual(await preMatrixHeadingSource(file, foreign), foreign);
}
console.log(
  'Matrix baseline evidence:714 exact native layers; four platform/engine probes; Mac Original/Oracle changes stay inside headings; unknown source changes reject.',
);
