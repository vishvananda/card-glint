import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson, root } from './common.mjs';
import { reviewGroupMembership } from './calibration-group-membership.mjs';

/** Each review is immutable and content-addressed; new batches extend the index. */
export async function loadFourthBodyReviews(index) {
  assert.equal(index.schema, 1);
  assert.equal(index.set, '4ed');
  assert.equal(index.status, 'reviewed-original-body-sources');
  assert(index.reviews.length > 0);
  assert.equal(new Set(index.reviews.map((r) => r.file)).size, index.reviews.length);
  const cards = [],
    reviewGuards = {};
  let inputHash;
  for (const ref of index.reviews) {
    assert(
      ref.file.startsWith('games/magic/fixtures/accuracy/4ed/') &&
        !ref.file.split('/').includes('..'),
    );
    const bytes = await fs.readFile(root + '/' + ref.file);
    assert.equal(hash(bytes), ref.sha256, 'Changed body review: ' + ref.file);
    const review = JSON.parse(bytes);
    assert(
      ['scan-read-matching-original-basic-fields', 'scan-read-matching-original-fields'].includes(
        review.status,
      ),
    );
    assert.equal(review.set, '4ed');
    if (inputHash === undefined) inputHash = review.inputHash;
    assert.equal(review.inputHash, inputHash);
    cards.push(...review.cards);
    reviewGuards[ref.file] = ref.sha256;
  }
  assert.equal(new Set(cards.map((r) => r.id)).size, cards.length, 'Duplicate body review');
  return {
    schema: 1,
    set: '4ed',
    status: 'scan-read-matching-original-fields',
    inputHash,
    cards,
    reviewGuards,
  };
}

export function validateFourthSourceReadiness({ input, native, publicInputs, types, bodies, set }) {
  const entries = input.entries.filter((e) => e.card.set === '4ed');
  assert.equal(entries.length, 378);
  assert.equal(new Set(entries.map((e) => e.id)).size, 378);
  assert.equal(set.set, '4ed');
  const membership = reviewGroupMembership(set, entries);
  assert.equal(native.status, 'complete-native-basic-symbol-profile-isolation');
  assert.equal(native.rows.length, 492);
  assert.equal(new Set(native.rows.map((r) => r.id)).size, 492);
  assert.equal(publicInputs.status, 'current-public-original-inputs-ready');
  assert.equal(publicInputs.rendererHash, native.afterRenderer);
  assert.equal(publicInputs.inputHash, native.inputHash);
  assert.equal(publicInputs.nativeReplayHash, native.afterCaptureHash);
  assert.equal(publicInputs.inventoryIdentity, set.inventory.sourceIdentity);
  assert.deepEqual(publicInputs.summary, {
    cards: 378,
    eagerExact: 378,
    lazyExact: 378,
    changedInputs: 0,
    missingRuleSources: 0,
    calibrationChunksLoadedByLazy: 0,
  });
  assert.equal(publicInputs.rows.length, 378);
  assert.equal(new Set(publicInputs.rows.map((r) => r.id)).size, 378);
  assert.equal(types.status, 'scan-reviewed-original-wording');
  assert.deepEqual(Object.keys(types.cards).sort(), entries.map((e) => e.id).sort());
  assert.equal(bodies.status, 'scan-read-matching-original-fields');
  assert.equal(bodies.inputHash, publicInputs.inputHash);
  const basics = entries.filter(
    (e) => /\bBasic\b/.test(e.card.type_line) && /\bLand\b/.test(e.card.type_line),
  );
  assert.equal(basics.length, 15);
  assert(bodies.cards.length >= basics.length && bodies.cards.length <= entries.length);
  assert.equal(new Set(bodies.cards.map((r) => r.id)).size, bodies.cards.length);
  assert(
    bodies.cards.every((r) => entries.some((e) => e.id === r.id)),
    'Foreign body review',
  );
  assert(
    basics.every((e) => bodies.cards.some((r) => r.id === e.id)),
    'Missing basic-land review',
  );
  const rows = [];
  for (const e of entries) {
    const api = publicInputs.rows.find((r) => r.id === e.id),
      type = types.cards[e.id],
      body = bodies.cards.find((r) => r.id === e.id);
    const current = native.rows.find((r) => r.id === e.id);
    assert(api && type && current);
    assert.equal(api.referenceHash, e.reference.sha256);
    assert.equal(type.referenceHash, e.reference.sha256);
    assert.equal(type.name, e.name);
    assert.equal(type.collectorNumber, e.card.collector_number);
    assert(type.reviewedFields.includes('typeLine'));
    assert.equal(api.type, 'scan-reviewed');
    assert.equal(type.typeLine, e.face.typeLine, 'Reviewed physical type changed');
    assert.equal(api.typeLineHash, hash(type.typeLine));
    assert.equal(api.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(api.inputHash, current.modes.original.inputHash);
    assert.equal(api.nativeHash, current.modes.original.after);
    assert.equal(api.rulesTextHash, hash(e.face.rulesText));
    assert.equal(api.paragraphsHash, hash(JSON.stringify(e.face.rulesParagraphs)));
    if (body) {
      assert.equal(body.referenceHash, e.reference.sha256, 'Reviewed scan identity changed');
      assert.equal(body.collectorNumber, e.card.collector_number);
      assert.deepEqual(body.reviewedFields, ['name', 'typeLine', 'rulesText', 'flavorText']);
      assert.equal(body.reviewMethod, 'visual-name-type-and-complete-rules-box');
      assert.equal(body.name, e.face.name);
      assert.equal(body.typeLine, e.face.typeLine);
      assert.equal(
        body.rulesText,
        e.face.rulesText,
        'Scan transcription does not match Original rules',
      );
      const flavor = body.flavorParagraphs ?? (body.flavorText === '' ? [] : [body.flavorText]);
      assert.equal(body.flavorText, flavor.join('\n'));
      assert.deepEqual(
        flavor,
        e.face.rulesParagraphs
          .filter((p) => p.role === 'flavor')
          .map((p) => p.runs.map((r) => r.text).join('')),
        'Reviewed flavor or logical paragraph changed',
      );
      assert.equal(body.quality.lang, e.card.lang);
      assert.equal(body.quality.lang, 'en');
      assert.equal(body.quality.nonfoil, e.card.nonfoil);
      assert.equal(body.quality.nonfoil, true);
      assert.equal(body.quality.highres, e.card.highres_image);
      assert.equal(body.quality.highres, true);
      assert.equal(body.quality.imageStatus, e.card.image_status);
      assert.equal(body.quality.imageStatus, 'highres_scan');
      assert(body.quality.width >= 700 && body.quality.height >= 1000);
      assert.deepEqual(Object.keys(body.inspection.panelHashes).sort(), ['name', 'rules', 'type']);
      assert(Object.values(body.inspection.panelHashes).every((v) => /^[a-f0-9]{64}$/.test(v)));
    }
    rows.push({
      id: e.id,
      name: e.name,
      groupKey: api.groupKey,
      referenceHash: e.reference.sha256,
      inputHash: api.inputHash,
      nativeHash: api.nativeHash,
      typeLineHash: api.typeLineHash,
      rulesTextHash: api.rulesTextHash,
      paragraphsHash: api.paragraphsHash,
      type: 'scan-reviewed',
      rules: body ? 'scan-reviewed-matching-original' : api.rules,
    });
  }
  const groups = membership.rows.map((g) => {
    const selected = rows.filter((r) => r.groupKey === g.key);
    assert.deepEqual(selected.map((r) => r.id).sort(), g.printingIds);
    return {
      key: g.key,
      membershipHash: g.membershipHash,
      printings: g.printingIds.length,
      typeIds: g.printingIds,
      rulesIds: selected
        .filter((r) => r.rules === 'scan-reviewed-matching-original')
        .map((r) => r.id)
        .sort(),
    };
  });
  assert.equal(groups.length, 18);
  return {
    summary: {
      typeReady: 378,
      rulesScanReviewed: bodies.cards.length,
      rulesProviderOrOtherReview: entries.length - bodies.cards.length,
      eagerExact: 378,
      lazyExact: 378,
      changedInputs: 0,
    },
    groups,
    rows,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [inputsFile, nativeFile, publicFile, typesFile, bodiesFile, ledgerFile, out] =
    process.argv.slice(2);
  assert(out, 'Use INPUTS NATIVE_PROOF PUBLIC_INPUT_REVIEW TYPES BODIES LEDGER NEW_OUTPUT');
  const filenames = [inputsFile, nativeFile, publicFile, typesFile, bodiesFile, ledgerFile];
  const raw = await Promise.all(
    filenames.map(async (f) => {
      const b = await fs.readFile(f);
      return f.endsWith('.gz') ? gunzipSync(b) : b;
    }),
  );
  const [input, native, publicInputs, types, bodyIndex, ledger] = raw.map((b) => JSON.parse(b));
  const bodies = await loadFourthBodyReviews(bodyIndex);
  assert.equal(hash(raw[0]), publicInputs.inputHash);
  const set = ledger.sets.find((s) => s.set === '4ed');
  const result = validateFourthSourceReadiness({ input, native, publicInputs, types, bodies, set });
  for (const body of bodies.cards) {
    const e = input.entries.find((e) => e.id === body.id),
      bytes = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(bytes), body.referenceHash);
    const image = PNG.sync.read(bytes);
    assert.equal(image.width, body.quality.width);
    assert.equal(image.height, body.quality.height);
  }
  await writeJson(out, {
    schema: 1,
    set: '4ed',
    status: 'reviewed-fourth-original-input-coverage',
    scope:
      'Source readiness only. Reuses378 physical type-line reviews and explicitly indexed complete body reviews. Both public wording APIs reproduce every frozen Original input. Unreviewed bodies,geometry,font,color,artist/legal and full-set approval remain independent.',
    rendererHash: native.afterRenderer,
    inputHash: publicInputs.inputHash,
    inventoryIdentity: set.inventory.sourceIdentity,
    sources: Object.fromEntries(
      ['inputs', 'native', 'publicInputs', 'types', 'bodies'].map((k, i) => [k, hash(raw[i])]),
    ),
    sourceGuards: publicInputs.methodGuards,
    bodyReviewGuards: bodies.reviewGuards,
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    ...result,
  });
  console.log(JSON.stringify(result.summary));
}
