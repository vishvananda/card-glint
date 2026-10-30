import { withoutModernCostRevision } from './magic-key-history.mjs';
import {
  preRevisedRequestSource,
  revisedRequestHistoricalHash,
} from '../games/magic/tools/accuracy/revised-body-request-ancestry.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from './magic-font-history-view.mjs';
import { createServer } from './magic-vite.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedBodyArtistDelta,
  preRevisedBodyArtistSource,
  revisedBodyArtistHistoricalHash,
  revisedBodyArtistAffected,
} from '../games/magic/tools/accuracy/revised-body-artist-ancestry.mjs';
const p = await revisedBodyArtistDelta();
assert.equal(await revisedRequestHistoricalHash(), p.afterRenderer);
assert.equal(await revisedBodyArtistHistoricalHash(), p.beforeRenderer);
for (const [f, e] of Object.entries(p.files)) {
  const bytes = await preRevisedRequestSource(f, await readFile(f));
  assert.equal(hash(bytes), e.after);
  assert.equal(hash(await preRevisedBodyArtistSource(f, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unknown change\n')]);
  assert.deepEqual(await preRevisedBodyArtistSource(f, unknown), unknown);
}
assert(await revisedBodyArtistAffected('3ed', 'rules'));
assert(await revisedBodyArtistAffected('3ed', 'fullCard'));
assert.equal(await revisedBodyArtistAffected('3ed', 'rules', true), false);
assert.equal(await revisedBodyArtistAffected('3ed', 'frameGeometry'), false);
for (const task of ['artist', 'fullCard', 'release']) {
  assert(await revisedBodyArtistAffected('arn', task, false, { printingIds: [p.artist.ids[0]] }));
  assert.equal(
    await revisedBodyArtistAffected('arn', task, false, { printingIds: ['another'] }),
    false,
  );
  assert.equal(
    await revisedBodyArtistAffected('lea', task, false, { printingIds: p.artist.ids }),
    false,
  );
}
const virtual = path.resolve('games/magic/src/presentation/__revised-body-key-before.ts');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  plugins: [
    {
      name: 'revised-body-key-reference',
      resolveId(id) {
        if (id.endsWith('/__revised-body-key-before.ts')) return virtual;
      },
      load(id) {
        if (id === virtual)
          return p.files['games/magic/src/presentation/canvas-face.ts'].beforeSource;
      },
    },
  ],
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { cardTextureKey: currentAfter } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-face.ts',
    ),
    { cardTextureKey: before } = await server.ssrLoadModule(
      '/games/magic/src/presentation/__revised-body-key-before.ts',
    ),
    { usesRevisedFractionalRules } = await server.ssrLoadModule(
      '/games/magic/src/presentation/retro-rules.ts',
    ),
    { resolvePrintingArtist } = await server.ssrLoadModule('/games/magic/src/printing/artist.ts');
  // Isolate the earlier body-key change. Later footer/mana revisions have
  // their own exact-source, native and affected/bypass cache tests.
  const after = (...args) =>
    JSON.stringify(
      JSON.parse(withoutModernCostRevision(currentAfter(...args))).filter(
        (value) =>
          value !== 'revised-footer-geometry-v1' &&
          value !== 'revised-mana-fit-v1' &&
          value !== 'revised-heading-fit-v1',
      ),
    );
  const base = {
    name: 'A test creature',
    typeLine: 'Summon Test',
    canonicalTypeLine: 'Creature — Test',
    frameStyle: 'retro',
    setCode: '3ed',
    wordingMode: 'original',
    colors: ['G'],
    manaSymbols: ['G'],
    rulesText: 'A sufficiently long printed paragraph.',
  };
  const input = (face) => ({ face, printingId: null, printedImage: null });
  assert(usesRevisedFractionalRules(base));
  const old = JSON.parse(before(input(base), 'inspect')),
    next = JSON.parse(after(input(base), 'inspect')),
    marker = 'revised-original-fractional-v1';
  assert(next.includes(marker));
  assert.deepEqual(
    next.filter(
      (v) => v !== marker && v !== 'revised-footer-geometry-v1' && v !== 'revised-heading-fit-v1',
    ),
    old,
  );
  for (const props of [
    { printedImage: 'scan.png' },
    { layer: 'etching' },
    { paintLayer: 'artwork' },
    { rulesText: false },
  ]) {
    const x = { ...input(base), ...props };
    assert.equal(after(x, 'inspect'), before(x, 'inspect'));
  }
  for (const face of [
    { ...base, setCode: 'lea' },
    { ...base, setCode: 'leb' },
    { ...base, setCode: '2ed' },
    { ...base, setCode: 'arn' },
    { ...base, setCode: 'atq' },
    { ...base, setCode: '4ed' },
    { ...base, setCode: 'm21' },
    { ...base, wordingMode: 'oracle' },
    { ...base, frameStyle: 'modern' },
    {
      ...base,
      typeLine: 'Land',
      canonicalTypeLine: 'Land',
      land: true,
      colors: [],
      frameColors: [],
    },
    { ...base, frameTemplate: 'future' },
  ]) {
    assert.equal(usesRevisedFractionalRules(face), false);
    assert.equal(after(input(face), 'inspect'), before(input(face), 'inspect'));
  }
  const fixture = JSON.parse(await readFile(p.artist.fixture));
  for (const row of fixture.rows) {
    const canonical = row.providerArtist;
    const resolved = resolvePrintingArtist(row.id, canonical, {
      referenceSha256: row.referenceHash,
    });
    assert.equal(resolved.artist, row.printedArtist);
    assert.equal(resolved.provenance.status, 'applied');
    assert.equal(resolved.provenance.corrections[0].before, canonical);
    const stale = resolvePrintingArtist(row.id, canonical, { referenceSha256: '0'.repeat(64) });
    assert.equal(stale.artist, canonical);
    assert.equal(stale.provenance.status, 'reference-mismatch');
    assert.equal(row.providerArtist, canonical);
  }
  assert.equal(resolvePrintingArtist('unreviewed-printing', 'A Name').artist, 'A Name');
} finally {
  await server.close();
}
console.log(
  'Revised body:281 exact native adoptions,843 unchanged variants,25 unchanged lands; ARN six scan-bound credits,350 unchanged variants;1001 unaffected Originals and scoped source/cache guards pass.',
);
