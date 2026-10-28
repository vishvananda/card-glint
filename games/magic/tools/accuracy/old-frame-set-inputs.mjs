// Complete, frozen old-frame inputs. Provider type labels remain review candidates.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, cacheRoot, hash, writeJson, sourceHash, mapLimit } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { printingScope, referenceIssue } from './rollout-policy.mjs';
import { printingTextIndex } from './printing-text.mjs';
import { presentation } from './adapter.mjs';
import { fetchComponents } from './components.mjs';

export function originalFields(card, mtg, text, annotation = {}) {
  if (annotation.referenceHash) {
    assert.equal(annotation.name, card.name);
    assert.equal(annotation.collectorNumber ?? card.collector_number, card.collector_number);
  }
  if (mtg) {
    assert.equal(mtg.identifiers.scryfallId, card.id);
    assert.equal(mtg.name, card.name);
    assert.equal(mtg.number, card.collector_number);
    assert.equal(mtg.setCode.toLowerCase(), card.set);
  }
  const typeLine = annotation.typeLine ?? card.printed_type_line ?? mtg?.originalType;
  assert.equal(typeof typeLine, 'string', 'Missing Original type: ' + card.name);
  let rulesText, rulesSource;
  if (Object.hasOwn(annotation, 'rulesText')) {
    rulesText = annotation.rulesText;
    rulesSource = annotation.reviewed ? 'scan-reviewed-field' : 'explicit-candidate';
  } else if (text) {
    rulesText = text.originalText;
    rulesSource = 'mtgjson-original-text';
  } else if (!card.oracle_text) {
    rulesText = '';
    rulesSource = 'empty-provider-text-candidate';
  } else throw Error('Nonempty Oracle fallback is forbidden: ' + card.name);
  assert.equal(typeof rulesText, 'string');
  return {
    typeLine: typeLine.replace(/ – /g, ' — '),
    rulesText,
    typeSource: Object.hasOwn(annotation, 'typeLine')
      ? annotation.reviewedFields?.includes('typeLine')
        ? 'scan-reviewed-field'
        : 'legacy-annotation'
      : card.printed_type_line
        ? 'scryfall-printed-type'
        : 'mtgjson-original-type-candidate',
    rawType: typeLine,
    rulesSource,
  };
}

/** Exact reviewed credit, rather than the provider's normalized artist alias. */
export function originalArtist(card, fallback, annotation = {}) {
  if (!annotation.reviewedFields?.includes('artist')) return fallback;
  assert.equal(annotation.name, card.name);
  assert.equal(annotation.collectorNumber, card.collector_number);
  assert.match(annotation.referenceHash, /^[a-f0-9]{64}$/);
  assert.equal(typeof annotation.artist, 'string');
  assert(annotation.artist.trim().length > 0);
  return annotation.artist;
}

async function main(set, out) {
  assert(['mir', 'ons'].includes(set) && out, 'Use mir|ons NEW_OUTPUT');
  await fs.access(out).then(
    () => {
      throw Error('Output already exists');
    },
    (error) => {
      if (error.code !== 'ENOENT') throw error;
    },
  );
  const raw = await fs.readFile(path.join(cacheRoot, 'rollout/sets', set + '.json'));
  const inventory = JSON.parse(raw);
  const cards = (
    await Promise.all(
      inventory.pages.map(async (p) => {
        const bytes = await readObject(p);
        assert.equal(hash(bytes), p.sha256);
        return JSON.parse(bytes).data;
      }),
    )
  ).flat();
  assert.equal(new Set(cards.map((c) => c.id)).size, cards.length);
  const excluded = [],
    selected = [];
  for (const card of cards) {
    const scope = printingScope(card),
      issue = referenceIssue(card);
    const reason =
      scope.status !== 'ordinary'
        ? scope.reason
        : !card.finishes.includes('nonfoil')
          ? 'foil-only'
          : issue;
    if (reason)
      excluded.push({ id: card.id, name: card.name, number: card.collector_number, reason });
    else {
      assert.equal(card.layout, 'normal');
      selected.push(card);
    }
  }
  const wording = await cachedFetch('https://mtgjson.com/api/v5/' + set.toUpperCase() + '.json');
  const data = JSON.parse(await readObject(wording)).data;
  const text = printingTextIndex(
    { set, entries: selected.map((card) => ({ id: card.id, card })) },
    data,
  );
  const directory = path.join(root, 'games/magic/fixtures/accuracy', set);
  const reviews = await Promise.all(
    (await fs.readdir(directory))
      .filter(
        (f) =>
          /^annotations(?:-[a-z0-9-]+)?\.json$/.test(f) ||
          [
            'source-gap-review.json',
            'type-printing-review.json',
            'artist-printing-review.json',
          ].includes(f),
      )
      .sort()
      .map(async (file) => {
        const bytes = await fs.readFile(path.join(directory, file));
        return { file, sha256: hash(bytes), data: JSON.parse(bytes) };
      }),
  );
  const entries = await mapLimit(selected, 2, async (card) => {
    const reference = await cachedFetch(card.image_uris.png);
    const art = await cachedFetch(card.image_uris.art_crop);
    const image = PNG.sync.read(await readObject(reference), { checkCRC: true });
    assert(image.width >= 700 && image.height >= 1000);
    return {
      id: card.id,
      card,
      reference,
      art,
      referenceDimensions: [image.width, image.height],
      category: 'normal',
      cohort: 'development',
    };
  });
  const server = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true, hmr: false },
  });
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
    const { fromScryfallCard, resolvePrintingWording, resolvePrintingArtist, withCardWording } =
      await server.ssrLoadModule('/games/magic/src/index.ts');
    for (const e of entries) {
      let annotation = {};
      for (const review of reviews) {
        const row = review.data.cards?.[e.id];
        if (!row) continue;
        assert.equal(row.referenceHash, e.reference.sha256, 'Stale scan review: ' + e.card.name);
        const fields = [
          ...new Set([...(annotation.reviewedFields ?? []), ...(row.reviewedFields ?? [])]),
        ];
        annotation = { ...annotation, ...row, reviewedFields: fields };
      }
      const matches = data.cards.filter(
        (c) => c.language === 'English' && c.identifiers?.scryfallId === e.id,
      );
      assert(matches.length <= 1);
      const fields = originalFields(e.card, matches[0], text.cards[e.id], annotation);
      const candidate = { ...annotation, typeLine: fields.typeLine, rulesText: fields.rulesText };
      // Rules-only reviews must not replace the provider's flavor paragraphs.
      if (candidate.paragraphScope === 'rules-only') delete candidate.paragraphs;
      const base = presentation(e, { [e.id]: candidate }, text.cards).face;
      const semantic = fromScryfallCard(e.card);
      Object.assign(base, {
        ...(semantic.frameColors ? { frameColors: semantic.frameColors } : {}),
        canonicalTypeLine: e.card.type_line,
        creature: /\bCreature\b/.test(e.card.type_line),
        artifact: /\bArtifact\b/.test(e.card.type_line),
        land: /\bLand\b/.test(e.card.type_line),
        legendary: /\bLegendary\b/.test(e.card.type_line),
        colorCalibration: 'set-hsb-v1',
      });
      const published = resolvePrintingWording(
        e.id,
        {
          original: base,
          oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' },
        },
        { referenceSha256: e.reference.sha256 },
      );
      const resolved = published;
      assert.equal(
        resolved.wordings.original.typeLine,
        fields.typeLine,
        'Unexpected Original type override',
      );
      const artist = resolvePrintingArtist(e.id, originalArtist(e.card, base.artist, annotation), {
        referenceSha256: e.reference.sha256,
      });
      assert.notEqual(resolved.provenance.status, 'reference-mismatch');
      assert.notEqual(artist.provenance.status, 'reference-mismatch');
      e.face = withCardWording({ ...base, artist: artist.artist }, resolved.wordings, 'original', {
        rulesAlignment: 'original',
        symbolStyle: 'original',
      });
      assert.deepEqual(e.face.rulesAlignment, { mode: 'auto', reference: e.face.rulesParagraphs });
      e.name = e.card.name;
      e.material = base.land
        ? 'L'
        : base.artifact
          ? 'A'
          : e.card.colors.length === 1
            ? e.card.colors[0]
            : 'M';
      e.wordingEvidence = {
        ...fields,
        wording: resolved.provenance,
        publishedWording: published.provenance,
        calibrationReviewHash: hash(JSON.stringify(annotation)),
        artist: artist.provenance,
        artistSource: annotation.reviewedFields?.includes('artist')
          ? 'scan-reviewed-field'
          : 'provider-or-published-correction',
      };
    }
  } finally {
    await server.close();
  }
  const components = await fetchComponents(entries, {}, (e) => e.face);
  const counts = (key) =>
    Object.fromEntries(
      Object.entries(Object.groupBy(entries, (e) => e.wordingEvidence[key])).map(([k, v]) => [
        k,
        v.length,
      ]),
    );
  await writeJson(out, {
    schema: 1,
    set,
    status: 'full-original-input-census',
    inventory: cards.length,
    nonfoil: entries.length,
    scope:
      'Complete frozen ordinary English nonfoil census. Reference metadata and decoded dimensions are checked; actual scan finish remains a visual color-audit gate. Original body/type providers are explicit, no nonempty Oracle fallback. MTGJSON types remain candidates until scan review. Display-only dash normalization preserves raw labels. Stock poses and typography are not approved by this input census.',
    rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
    sourceData: {
      inventoryHash: hash(raw),
      sourceIdentity: inventory.sourceIdentity,
      pages: inventory.pages,
      wording,
      annotations: reviews.map(({ file, sha256 }) => ({ file, sha256 })),
    },
    summary: { types: counts('typeSource'), rules: counts('rulesSource') },
    excluded,
    unresolved: [],
    unavailable: [],
    entries,
    components,
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  });
  console.log(
    JSON.stringify({
      set,
      inventory: cards.length,
      nonfoil: entries.length,
      excluded: excluded.length,
      types: counts('typeSource'),
      rules: counts('rulesSource'),
    }),
  );
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main(...process.argv.slice(2));
