import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { gunzipSync } from 'node:zlib';
import { createServer } from 'vite';
import { hash, objectFile, root, writeJson } from './common.mjs';
import { printingTextIndex } from './printing-text.mjs';
import { calibrationVariant } from './calibration-groups.mjs';
const [inputFile, captureFile, out] = process.argv.slice(2);
assert(out, 'Use FROZEN_INPUTS[.gz] NATIVE_CAPTURE[.gz] OUTPUT');
const read = async (file) => {
  const raw = await fs.readFile(file);
  return file.endsWith('.gz') ? gunzipSync(raw) : raw;
};
const bytes = await read(inputFile),
  captureBytes = await read(captureFile);
const input = JSON.parse(bytes),
  capture = JSON.parse(captureBytes);
const entries = input.entries.filter((e) => e.card.set === '4ed');
assert.equal(entries.length, 378);
assert.equal(new Set(entries.map((e) => e.id)).size, 378);
assert.equal(capture.inputHash, hash(bytes));
const providerBytes = await fs.readFile(objectFile(input.sourceData.wording));
assert.equal(hash(providerBytes), input.sourceData.wording.sha256);
const data = JSON.parse(providerBytes).data,
  text = printingTextIndex({ set: '4ed', entries }, data);
const ledger = JSON.parse(
  await fs.readFile(root + '/games/magic/fixtures/accuracy/calibration-progress.json'),
);
const inventoryIdentity = ledger.sets.find((s) => s.set === '4ed').inventory.sourceIdentity;
const guardFiles = [
  'games/magic/src/index.ts',
  'games/magic/src/lazy.ts',
  'games/magic/src/presentation-api.ts',
  'games/magic/src/data/eager-wording.ts',
  'games/magic/src/data/review-metadata.ts',
  'games/magic/tools/accuracy/calibration-groups.mjs',
  'games/magic/src/presentation/wording.ts',
  'games/magic/src/printing/resolve.ts',
  'games/magic/src/printing/review.ts',
  'games/magic/src/printing/corrections.ts',
  'games/magic/src/printing/lazy.ts',
  'games/magic/src/data/registry.ts',
  'games/magic/src/data/load.ts',
  'games/magic/src/data/loaders.ts',
  'games/magic/src/data/scopes.ts',
  'games/magic/src/data/tables.ts',
  'games/magic/src/data/wording/4ed.ts',
  'games/magic/tools/accuracy/printing-text.mjs',
  'games/magic/tools/accuracy/fourth-original-input-review.mjs',
];
const guards = async () =>
  Object.fromEntries(
    await Promise.all(guardFiles.map(async (f) => [f, hash(await fs.readFile(root + '/' + f))])),
  );
const methodGuards = await guards(),
  rows = [];
for (const mode of ['lazy', 'eager']) {
  const server = await createServer({
    root,
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const api = await server.ssrLoadModule(
      '/games/magic/src/' + (mode === 'lazy' ? 'lazy' : 'index') + '.ts',
    );
    const resolve =
      mode === 'lazy'
        ? (...args) => api.resolveSetPrintingWording('4ed', ...args)
        : api.resolvePrintingWording;
    let matched = 0;
    for (const e of entries) {
      const mtgs = data.cards.filter(
        (c) => c.language === 'English' && c.identifiers?.scryfallId === e.id,
      );
      assert.equal(mtgs.length, 1);
      const mtg = mtgs[0],
        rules = text.cards[e.id]?.originalText ?? e.card.printed_text ?? '';
      const original = {
        typeLine: mtg.originalType ?? '',
        rulesText: rules,
        flavorText: e.card.flavor_text ?? '',
        manaSymbols: [...(e.card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
      };
      const provided = {
          oracle: {
            typeLine: e.card.type_line,
            rulesText: e.card.oracle_text ?? '',
            flavorText: e.card.flavor_text ?? '',
          },
          original,
        },
        untouched = structuredClone(provided);
      const resolved = await resolve(e.id, provided, { referenceSha256: e.reference.sha256 });
      assert.equal(resolved.provenance.status, 'applied');
      const typeReview = resolved.provenance.corrections.find((r) => r.fields.includes('typeLine'));
      assert(typeReview, 'Missing exact-printing type review');
      assert.equal(typeReview.referenceSha256, e.reference.sha256);
      assert.equal(
        typeReview.source,
        'games/magic/fixtures/accuracy/4ed/annotations-printed-types.json',
      );
      const fresh = JSON.parse(
        JSON.stringify(
          api.withCardWording(e.face, resolved.wordings, 'original', {
            rulesAlignment: 'original',
            symbolStyle: 'original',
          }),
        ),
      );
      const changed = Object.keys({ ...e.face, ...fresh }).filter(
        (k) => !isDeepStrictEqual(e.face[k], fresh[k]),
      );
      assert.deepEqual(changed, [], 'Public Original fields changed: ' + e.name);
      const native = capture.rows.find((r) => r.id === e.id)?.modes.original;
      assert(native);
      assert.equal(
        hash(JSON.stringify(fresh)),
        native.inputHash,
        'Frozen native input hash changed',
      );
      assert.equal(native.inputHash, hash(JSON.stringify(e.face)));
      const control = await resolve('unreviewed-input-control', provided);
      assert.deepEqual(control.wordings.oracle, resolved.wordings.oracle);
      const stale = await resolve(e.id, provided, { referenceSha256: '0'.repeat(64) });
      assert.equal(stale.provenance.status, 'reference-mismatch');
      assert.deepEqual(stale.wordings, control.wordings);
      assert.equal(
        (await resolve(e.id, { oracle: provided.oracle })).provenance.status,
        'missing-original',
      );
      assert.throws(
        () => api.withCardWording(e.face, { oracle: resolved.wordings.oracle }, 'original'),
        /Missing original/,
      );
      assert.deepEqual(provided, untouched);
      const correctedRules = resolved.provenance.corrections.some((r) =>
        r.fields.some((f) => ['rulesText', 'rulesParagraphs'].includes(f)),
      );
      assert(
        text.cards[e.id] || e.card.printed_text != null || !e.card.oracle_text || correctedRules,
        'Missing Original rule source: ' + e.name,
      );
      if (mode === 'lazy')
        rows.push({
          id: e.id,
          set: '4ed',
          groupKey: calibrationVariant(e.card).key,
          name: e.name,
          referenceHash: e.reference.sha256,
          inputHash: native.inputHash,
          nativeHash: native.sha256,
          rules: text.cards[e.id]
            ? 'mtgjson-original-text'
            : e.card.printed_text != null
              ? 'scryfall-printed-text'
              : correctedRules
                ? 'reviewed-original'
                : 'empty-original',
          type: 'scan-reviewed',
          flavor: e.card.flavor_text
            ? 'scryfall-printing-and-exact-corrections'
            : 'empty-or-reviewed',
          providerOriginal: original,
          providerOracle: provided.oracle,
          providerUuid: mtg.uuid,
          typeLineHash: hash(fresh.typeLine),
          rulesTextHash: hash(fresh.rulesText),
          paragraphsHash: hash(JSON.stringify(fresh.rulesParagraphs)),
          alignmentHash: hash(JSON.stringify(fresh.rulesAlignment)),
        });
      else assert.equal(rows.find((r) => r.id === e.id).inputHash, hash(JSON.stringify(fresh)));
      matched++;
    }
    if (mode === 'lazy')
      assert.deepEqual(
        api.loadedMagicSets(),
        [],
        'Wording-only audit must not load calibration tables',
      );
    console.log(
      mode,
      matched,
      'exact Original inputs;Oracle,stale-reference,missing-Original and caller immutability controls passed',
    );
  } finally {
    await server.close();
  }
}
assert.deepEqual(await guards(), methodGuards);
assert.equal(hash(await read(inputFile)), hash(bytes));
assert.equal(hash(await read(captureFile)), hash(captureBytes));
await writeJson(out, {
  schema: 1,
  set: '4ed',
  status: 'current-public-original-inputs-ready',
  scope:
    'Field-level readiness only. All378 frozen Original faces are independently reconstructed from exact MTGJSON/Scryfall provider fields and reviewed public corrections,through eager and exact-set lazy APIs. Body,structured paragraphs and Original alignment references match the native input hashes exactly. No fonts,images,painting,geometry,metrics or source-transcription completion approval.',
  inventoryIdentity,
  rendererHash: capture.rendererHash,
  inputHash: hash(bytes),
  nativeReplayHash: hash(captureBytes),
  provider: { url: input.sourceData.wording.url, sha256: hash(providerBytes) },
  methodGuards,
  renderingBlockers: [],
  summary: {
    cards: 378,
    eagerExact: 378,
    lazyExact: 378,
    changedInputs: 0,
    missingRuleSources: 0,
    calibrationChunksLoadedByLazy: 0,
  },
  rows,
});
