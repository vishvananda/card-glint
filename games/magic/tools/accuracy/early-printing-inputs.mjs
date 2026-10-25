// Build calibration inputs from immutable cached printing data, with explicit
// provenance for historical type-family proposals that still need scan review.
import assert from 'node:assert/strict';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { readFile, mkdir, readdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, cacheRoot, hash, readJson, writeJson, sourceHash } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { printingTextIndex } from './printing-text.mjs';
import { presentation } from './adapter.mjs';
const [set, out] = process.argv.slice(2);
assert(out && /^[a-z0-9]{2,5}$/.test(set), 'Usage: early-printing-inputs.mjs SET OUT');
const snapshot = await readJson(path.join(cacheRoot, 'sets', set + '.json'));
assert.equal(snapshot.set, set);
assert(snapshot.complete);
const source = await cachedFetch('https://mtgjson.com/api/v5/' + set.toUpperCase() + '.json', {
  offline: true,
});
const mtg = JSON.parse((await readObject(source)).toString()),
  text = printingTextIndex(snapshot, mtg.data);
let family = new Map();
if (set === '2ed') {
  const b = JSON.parse(
    gunzipSync(
      await readFile(path.join(root, 'games/magic/fixtures/accuracy/abu-054/leb-inputs.json.gz')),
    ),
  );
  family = new Map(
    b.entries.map((e) => [
      e.card.name,
      { typeLine: e.face.typeLine, id: e.id, referenceHash: e.reference.sha256 },
    ]),
  );
}
const annotationDir = path.join(root, 'games/magic/fixtures/accuracy', set);
const annotationFiles = (await readdir(annotationDir))
  .filter((f) => /^annotations(?:-[a-z0-9-]+)?\.json$/.test(f))
  .sort(
    (a, b) =>
      Number(a !== 'annotations.json') - Number(b !== 'annotations.json') || a.localeCompare(b),
  );
const annotations = await Promise.all(
  annotationFiles.map(async (file) => {
    const bytes = await readFile(path.join(annotationDir, file));
    return { file, sha256: hash(bytes), data: JSON.parse(bytes) };
  }),
);
const server = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true, hmr: false },
  }),
  entries = [],
  unavailable = [],
  unresolved = [];
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingWording, resolvePrintingArtist, withCardWording } =
    await server.ssrLoadModule('/games/magic/src/index.ts');
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { RETRO_FONT, RETRO_SYMBOL_FONT } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  for (const e of snapshot.entries) {
    if (e.issue || !e.reference || !e.art) {
      unavailable.push({ id: e.id, name: e.card.name, issue: e.issue ?? 'missing-source' });
      continue;
    }
    for (const a of [e.reference, e.art]) assert.equal(hash(await readObject(a)), a.sha256);
    let annotation = {};
    const allowed = [
      'name',
      'printedName',
      'typeLine',
      'rulesText',
      'flavorText',
      'paragraphs',
      'manaSymbols',
      'power',
      'toughness',
      'artist',
      'frameColors',
      'reviewed',
      'referenceHash',
    ];
    for (const source of annotations) {
      const row = source.data.cards?.[e.id];
      if (!row) continue;
      // Historical layout studies also store name/cohort labels. Those are not
      // printing corrections and need no scan binding; they must not overwrite
      // a separate wording review's status. Actual field changes remain strict.
      const payload = allowed.some(
        (key) => !['name', 'reviewed', 'referenceHash'].includes(key) && Object.hasOwn(row, key),
      );
      if (
        !payload &&
        (!Object.hasOwn(row, 'name') || row.name === e.card.name) &&
        !row.reviewedFields?.length
      )
        continue;
      assert.equal(
        row.referenceHash,
        e.reference.sha256,
        'Stale printing annotation ' + source.file,
      );
      const fields = [
        ...new Set([...(annotation.reviewedFields ?? []), ...(row.reviewedFields ?? [])]),
      ];
      annotation = {
        ...annotation,
        ...Object.fromEntries(allowed.filter((k) => Object.hasOwn(row, k)).map((k) => [k, row[k]])),
        reviewedFields: fields,
      };
    }
    const adapted = presentation(e, { [e.id]: annotation }, text.cards),
      f = adapted.face,
      reviewedType = adapted.reviewedFields.includes('typeLine'),
      proposed = family.get(e.card.name);
    const original = {
      ...f,
      typeLine: reviewedType ? f.typeLine : (proposed?.typeLine ?? f.typeLine),
    };
    const resolved = resolvePrintingWording(
      e.id,
      { original, oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' } },
      { referenceSha256: e.reference.sha256 },
    );
    const artist = resolvePrintingArtist(e.id, f.artist, { referenceSha256: e.reference.sha256 });
    assert.notEqual(resolved.provenance.status, 'reference-mismatch');
    assert.notEqual(artist.provenance.status, 'reference-mismatch');
    const fields = new Set(resolved.provenance.corrections.flatMap((c) => c.fields));
    if (
      !text.cards[e.id] &&
      e.card.oracle_text &&
      !fields.has('rulesText') &&
      !adapted.annotation.reviewed
    ) {
      unresolved.push({ id: e.id, name: e.card.name, reason: 'nonempty-oracle-fallback' });
      continue;
    }
    const face = withCardWording(
      { ...f, ...resolved.wordings.original, artist: artist.artist },
      {
        original: { ...f, ...resolved.wordings.original },
        oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' },
      },
      'original',
      { rulesAlignment: 'original', symbolStyle: 'original' },
    );
    Object.assign(face, {
      colorCalibration: 'set-hsb-v1',
      artifact: /\bArtifact\b/.test(e.card.type_line),
      land: /\bLand\b/.test(e.card.type_line),
      creature: /\bCreature\b/.test(e.card.type_line),
      legendary: /\bLegendary\b/.test(e.card.type_line),
      rulesAlignment: { mode: 'auto', reference: face.rulesParagraphs },
    });
    const land = face.land,
      material = land
        ? 'L'
        : face.artifact
          ? 'A'
          : e.card.colors?.length === 1
            ? e.card.colors[0]
            : e.card.colors?.length > 1
              ? 'M'
              : 'C';
    entries.push({
      ...e,
      name: e.card.name,
      material,
      face,
      wordingEvidence: {
        rules: text.cards[e.id]
          ? 'mtgjson-original-text'
          : fields.has('rulesText') || adapted.annotation.reviewed
            ? 'scan-reviewed'
            : 'printing-empty',
        type:
          reviewedType || fields.has('typeLine')
            ? 'scan-reviewed'
            : proposed
              ? 'family-transfer-pending'
              : e.card.printed_type_line
                ? 'printing-reference'
                : 'oracle-fallback',
        ...(proposed && !reviewedType && !fields.has('typeLine')
          ? {
              proposedFrom: { set: 'leb', ...proposed },
              typeReview:
                'The Beta type is a proposed original label, not a reviewed correction for this printing. Confirm against its own scan before certifying heading wording.',
            }
          : {}),
      },
      correctionEvidence: { wording: resolved.provenance, artist: artist.provenance },
    });
  }
  const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8'),
    urls = new Set(
      [...css.matchAll(/url\('([^']+)'\)/g)]
        .map((m) => m[1])
        .concat(RETRO_FONT, RETRO_SYMBOL_FONT, ...entries.flatMap((e) => canvasAssetUrls(e.face)))
        .filter((u) => u?.startsWith('https:')),
    ),
    components = [];
  for (const url of urls) components.push(await cachedFetch(url, { offline: true }));
  await mkdir(out, { recursive: true });
  await writeJson(path.join(out, 'inputs.json'), {
    schema: 1,
    set,
    snapshotIdentity: snapshot.identity,
    referenceIdentity: snapshot.referenceIdentity,
    rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    sourceData: {
      wording: source,
      annotations: annotations.map(({ file, sha256 }) => ({ file, sha256 })),
    },
    inventory: snapshot.entries.length,
    unavailable,
    unresolved,
    entries,
    components,
  });
  console.log(
    JSON.stringify({
      set,
      inventory: snapshot.entries.length,
      ready: entries.length,
      unavailable: unavailable.length,
      unresolved,
      types: entries.reduce(
        (o, e) => ((o[e.wordingEvidence.type] = (o[e.wordingEvidence.type] ?? 0) + 1), o),
        {},
      ),
    }),
  );
  assert.equal(
    unresolved.length,
    0,
    'Unresolved original body text; inspect inputs before fitting',
  );
} finally {
  await server.close();
}
