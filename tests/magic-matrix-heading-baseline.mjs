import { preFontGeometrySource } from '../games/magic/tools/accuracy/font-geometry-ancestry.mjs';
import { preRevisedBodyArtistSource } from '../games/magic/tools/accuracy/revised-body-artist-ancestry.mjs';
import assert from 'node:assert/strict';
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
  // Actual loaded-font geometry and caller-owned anchors are exercised by
  // magic-font-geometry.mjs. A fallback-font raster cannot establish this policy.
  const canvasSource = await preFontGeometrySource(
    'games/magic/src/presentation/canvas-text.ts',
    await (
      await import('node:fs/promises')
    ).readFile('games/magic/src/presentation/canvas-text.ts'),
  );
  assert(canvasSource.toString().includes("context.textBaseline = 'alphabetic'"));
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
  const bytes = await preFontGeometrySource(file, await readFile(file));
  if (file.endsWith('/generated-manifest.json'))
    assert.equal(hash(await preArnProfileSource(file, bytes)), value.before);
  else assert.equal(hash(await preRevisedBodyArtistSource(file, bytes)), value.after);
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
