import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createServer } from './magic-vite.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';
import { calibrationPresentation } from '../games/magic/tools/accuracy/calibration-wording.mjs';
execFileSync(process.execPath, ['games/magic/tools/build-printing-corrections.mjs', '--check']);
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
});
try {
  const { resolvePrintingWording, resolvePrintingArtist, withCardWording } =
    await server.ssrLoadModule('/games/magic/src/index.ts');
  const fixture = async (path) =>
    JSON.parse(await readFile('games/magic/fixtures/accuracy/' + path));
  const oracle = {
    name: 'Oracle name',
    typeLine: 'Creature — Elemental',
    rulesText: 'Oracle rules.',
    flavorText: 'Oracle flavor.',
  };
  const original = {
    name: 'Provider name',
    typeLine: 'Creature',
    rulesText: 'Provider rules.',
    flavorText: 'Provider flavor.',
  };
  const input = { oracle, original },
    snapshot = structuredClone(input);
  // Missing printed paragraph breaks are rich-text corrections, never global
  // layout exceptions. The physical quotation is inline only in original mode.
  for (const set of ['lea', 'leb', '2ed', 'ced', 'cei', '3ed', 'sum']) {
    const data = await fixture(set + '/annotations-zz-inline-flavor.json');
    const [[id, row]] = Object.entries(data.cards);
    const resolved = resolvePrintingWording(id, input, {
      referenceSha256: row.referenceHash,
    });
    const printed = resolved.wordings.original;
    assert.equal(resolved.provenance.status, 'applied');
    assert.deepEqual(printed.rulesParagraphs, row.paragraphs);
    assert.equal(printed.rulesParagraphs.length, 2);
    assert.equal(printed.rulesParagraphs[1].runs.length, 2);
    assert.equal(printed.rulesParagraphs[1].runs[0].italic, false);
    assert.equal(printed.rulesParagraphs[1].runs[1].italic, true);
    assert.equal(printed.rulesParagraphs[1].runs[1].text, row.flavorText);
    assert.ok(printed.rulesText.includes('turn. “O to be a dragon'));
    assert.ok(printed.rulesText.includes('”\n—Marianne Moore, “O to Be a Dragon”'));
    assert.equal(resolved.wordings.oracle.rulesText, 'Oracle rules.\nOracle flavor.');
    assert.deepEqual(
      resolved.wordings.oracle.rulesParagraphs.map((p) => p.role),
      ['rules', 'flavor'],
    );
    assert.equal(
      resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) }).provenance.status,
      'reference-mismatch',
    );
    assert.deepEqual(
      withCardWording({ name: 'Dragon Whelp', typeLine: 'Creature' }, resolved.wordings, 'oracle')
        .rulesParagraphs,
      resolved.wordings.oracle.rulesParagraphs,
    );
  }
  const fourthWhelp = resolvePrintingWording('349ff6e6-b914-4787-bb90-ea77a3550d23', input);
  assert.deepEqual(
    fourthWhelp.wordings.original.rulesParagraphs.map((p) => p.role),
    ['rules', 'flavor'],
  );
  assert.deepEqual(input, snapshot, 'Corrections must not mutate provider inputs');
  console.log(
    'Seven pre-Fourth Dragon Whelp inline quotations preserve Oracle and Fourth separation.',
  );
  const literalMana = await fixture('lea/annotations-zz-literal-mana.json');
  const [[literalId, literalRow]] = Object.entries(literalMana.cards);
  const literalOracle = { ...oracle, rulesText: 'Pay {B}{B}{B} during your upkeep.' };
  const literal = resolvePrintingWording(
    literalId,
    { original, oracle: literalOracle },
    {
      referenceSha256: literalRow.referenceHash,
    },
  );
  assert.ok(literal.wordings.original.rulesText.includes('Pay BBB during upkeep'));
  assert.ok(!literal.wordings.original.rulesText.includes('{B}'));
  assert.ok(literal.wordings.oracle.rulesText.includes('{B}{B}{B}'));
  assert.equal(
    resolvePrintingWording(literalId, input, {
      referenceSha256: '0'.repeat(64),
    }).provenance.status,
    'reference-mismatch',
  );
  const reviewedStats = await fixture('atq/annotations-stats.json');
  const alphaOutliers = await fixture('lea/annotations-text-outliers.json');
  for (const [id, row] of Object.entries(alphaOutliers.cards)) {
    const entry = {
      card: {
        id,
        name: row.name,
        set: 'lea',
        artist: 'Provider artist',
        type_line: 'Creature — Elf',
        power: '2',
        toughness: '1',
      },
      reference: { sha256: row.referenceHash },
    };
    const adapted = presentation(entry);
    for (const field of row.reviewedFields ?? []) assert.deepEqual(adapted.face[field], row[field]);
    if (row.artist) {
      assert.equal(
        resolvePrintingArtist(id, 'Provider artist', { referenceSha256: row.referenceHash }).artist,
        row.artist,
      );
      assert.equal(
        resolvePrintingArtist(id, 'Provider artist', { referenceSha256: '0'.repeat(64) }).artist,
        'Provider artist',
      );
    } else if (row.power !== undefined) {
      const input = {
        oracle: { ...oracle, power: '2', toughness: '1' },
        original: { ...original, power: '2', toughness: '1' },
      };
      const resolved = resolvePrintingWording(id, input, { referenceSha256: row.referenceHash });
      assert.equal(resolved.wordings.original.power, row.power);
      assert.equal(resolved.wordings.original.toughness, row.toughness);
      assert.equal(resolved.wordings.oracle.power, '2');
      assert.equal(resolved.wordings.oracle.toughness, '1');
    } else {
      const resolved = resolvePrintingWording(id, input, { referenceSha256: row.referenceHash });
      assert.equal(
        adapted.face.rulesText,
        [row.rulesText, row.flavorText].filter(Boolean).join('\n'),
      );
      assert.equal(
        resolved.wordings.original.rulesText,
        [row.rulesText, row.flavorText].filter(Boolean).join('\n'),
      );
      assert.equal(resolved.wordings.oracle.rulesText, 'Oracle rules.\nOracle flavor.');
    }
    assert.throws(() => presentation({ ...entry, reference: { sha256: '0'.repeat(64) } }), /stale/);
  }
  for (const [id, name, provider, printed, scan] of [
    [
      'b3dd94c5-42f6-4148-be6e-2a3a4226cc0e',
      'Circle of Protection: Red',
      'Mark Tedin',
      'Anson Maddocks',
      '48f8316cba5dc2dbcdf4cea077a5ba615243159606f3b7f7e07bced5b25ce980',
    ],
    [
      '92df19c9-e127-42d9-8dd2-7fa5a7095428',
      'Circle of Protection: White',
      'Douglas Shuler',
      'Douglas Schuler',
      'd55bc208415027e08f91f8753134fe2e58bb5d74362f6a803b30e0f0fe6473e9',
    ],
  ]) {
    const entry = {
      card: { id, name, set: 'lea', artist: provider, type_line: 'Enchantment' },
      reference: { sha256: scan },
    };
    const snapshot = structuredClone(entry);
    assert.equal(presentation(entry).face.artist, printed);
    assert.deepEqual(entry, snapshot, 'Provider artist metadata must remain untouched');
    const resolved = resolvePrintingArtist(id, provider, { referenceSha256: scan });
    assert.equal(resolved.artist, printed);
    assert.equal(resolved.provenance.status, 'applied');
    assert.equal(resolved.provenance.corrections[0].before, provider);
    assert.equal(
      resolvePrintingArtist(id, provider, { referenceSha256: '0'.repeat(64) }).artist,
      provider,
    );
    assert.throws(() => presentation({ ...entry, reference: { sha256: '0'.repeat(64) } }), /stale/);
    assert.throws(() => presentation({ ...entry, card: { ...entry.card, set: 'leb' } }), /stale/);
  }
  const creditAudit = await fixture('abu-artist-credit-audit.json');
  assert.equal(creditAudit.rows.length, 114);
  let misspellings = 0;
  for (const row of creditAudit.rows) {
    const entry = {
      card: {
        id: row.id,
        name: row.name,
        set: row.set,
        collector_number: row.collectorNumber,
        artist: row.providerArtist,
        type_line: 'Enchantment',
      },
      reference: { sha256: row.referenceHash },
    };
    const source = structuredClone(entry);
    assert.equal(presentation(entry).face.artist, row.printedArtist, row.set + ' ' + row.name);
    assert.deepEqual(entry, source);
    const resolved = resolvePrintingArtist(row.id, row.providerArtist, {
      referenceSha256: row.referenceHash,
    });
    assert.equal(resolved.artist, row.printedArtist);
    if (row.printedArtist !== row.providerArtist) {
      misspellings++;
      assert.equal(resolved.provenance.status, 'applied');
      assert.equal(
        resolvePrintingArtist(row.id, row.providerArtist, { referenceSha256: '0'.repeat(64) })
          .artist,
        row.providerArtist,
      );
    } else
      assert.equal(
        resolved.provenance.status,
        'unreviewed',
        'Correctly printed exceptions must not inherit a spelling override',
      );
  }
  assert.equal(misspellings, 82);
  const alphaTypes = await fixture('lea/annotations-colored-types.json');
  for (const [id, row] of Object.entries(alphaTypes.cards)) {
    const resolved = resolvePrintingWording(id, input, { referenceSha256: row.referenceHash });
    assert.equal(resolved.wordings.original.typeLine, row.typeLine);
    assert.equal(resolved.wordings.oracle.typeLine, oracle.typeLine);
    assert.equal(
      presentation({
        card: { id, name: row.name, set: 'lea', type_line: oracle.typeLine },
        reference: { sha256: row.referenceHash },
      }).face.typeLine,
      row.typeLine,
    );
  }
  for (const [id, row] of Object.entries(reviewedStats.cards)) {
    const values = {
      oracle: { ...oracle, power: '1+*', toughness: '7-*' },
      original: { ...original, power: '1+*', toughness: '7-*' },
    };
    const snapshot = structuredClone(values);
    const resolved = resolvePrintingWording(id, values, { referenceSha256: row.referenceHash });
    assert.equal(resolved.wordings.original.power, row.power);
    assert.equal(resolved.wordings.original.toughness, row.toughness);
    assert.equal(resolved.wordings.oracle.power, values.oracle.power);
    assert.equal(resolved.wordings.oracle.toughness, values.oracle.toughness);
    assert.equal(
      withCardWording({ name: row.name }, resolved.wordings, 'original').toughness,
      row.toughness,
    );
    assert.equal(
      withCardWording({ name: row.name }, resolved.wordings, 'oracle').toughness,
      values.oracle.toughness,
    );
    const rejected = resolvePrintingWording(id, values, { referenceSha256: '0'.repeat(64) });
    assert.equal(rejected.provenance.status, 'reference-mismatch');
    assert.equal(rejected.wordings.original.power, values.original.power);
    assert.equal(rejected.wordings.original.toughness, values.original.toughness);
    assert.deepEqual(values, snapshot);
  }
  let earlyTypes = 0;
  const reviewedBodies = new Set();
  for (const set of ['arn', 'atq', 'drk']) {
    const types = await fixture(set + '/annotations-printed-types.json');
    const bodies =
      set === 'arn' ? { cards: {} } : await fixture(set + '/annotations-missing-rules.json');
    const outliers = await fixture(set + '/annotations-text-outliers.json');
    for (const [id, row] of Object.entries(types.cards)) {
      const body = outliers.cards[id] ?? bodies.cards[id];
      if (outliers.cards[id]?.reviewed) reviewedBodies.add(id);
      const resolved = resolvePrintingWording(id, input, {
        referenceSha256: row.referenceHash,
      });
      assert.equal(resolved.provenance.status, 'applied');
      assert.equal(resolved.wordings.original.typeLine, row.typeLine);
      assert.equal(resolved.wordings.oracle.typeLine, oracle.typeLine);
      assert.equal(resolved.wordings.oracle.rulesText, 'Oracle rules.\nOracle flavor.');
      const rules = body?.rulesText ?? original.rulesText,
        flavor = body?.flavorText ?? original.flavorText;
      assert.equal(
        resolved.wordings.original.rulesText,
        [rules, flavor.replaceAll('*', '')].filter(Boolean).join('\n'),
      );
      assert.equal(
        resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) }).provenance.status,
        'reference-mismatch',
      );
      const entry = {
        card: {
          id,
          set,
          name: row.name,
          collector_number: row.collectorNumber,
          type_line: row.review.oracleType,
          oracle_text: oracle.rulesText,
        },
        reference: { sha256: row.referenceHash },
      };
      const annotations = { [id]: { ...body, ...row } };
      const adapted = calibrationPresentation(entry, annotations, {
        [id]: { originalText: original.rulesText },
      });
      assert.equal(adapted.face.typeLine, row.typeLine);
      assert.equal(
        adapted.face.creature,
        /\bCreature\b/.test(entry.card.type_line),
        'Historical type wording keeps semantic identity',
      );
      assert.equal(adapted.wordingEvidence.type, 'scan-reviewed');
      assert.equal(
        adapted.wordingEvidence.rules,
        body?.reviewed ? 'scan-reviewed' : 'mtgjson-original',
      );
      if (!body?.reviewed)
        assert.throws(
          () => calibrationPresentation(entry, annotations),
          /Original rules unavailable/,
        );
      assert.throws(
        () =>
          calibrationPresentation({ ...entry, reference: { sha256: '0'.repeat(64) } }, annotations),
        /stale/,
      );
      earlyTypes++;
    }
  }
  assert.equal(earlyTypes, 316);
  const artists = await fixture('planar-artist-review.json');
  const earlyArtists = await fixture('early-expansion-footer-wording.json');
  for (const row of [
    ...artists.rows.map((row) => ({ ...row, set: artists.set })),
    ...earlyArtists.rows.filter((row) => !row.artistMatchesProvider),
  ]) {
    const entry = {
      card: {
        id: row.id,
        name: row.name,
        set: row.set,
        collector_number: row.number,
        artist: row.providerArtist,
        type_line: 'Creature',
        oracle_text: 'Provider rules.',
      },
      reference: { sha256: row.referenceHash },
    };
    const snapshot = structuredClone(entry);
    const resolved = resolvePrintingArtist(row.id, row.providerArtist, {
      referenceSha256: row.referenceHash,
    });
    assert.equal(resolved.artist, row.printedArtist);
    assert.equal(resolved.provenance.status, 'applied');
    assert.equal(resolved.provenance.identity, 'printing-id-and-scan');
    assert.equal(resolved.provenance.corrections[0].before, row.providerArtist);
    const adapted = presentation(entry);
    assert.equal(adapted.face.artist, resolved.artist);
    assert.ok(adapted.reviewedFields.includes('artist'));
    assert.equal(
      adapted.contentStatus,
      reviewedBodies.has(row.id) ? 'scan-reviewed' : 'oracle-unverified',
    );
    assert.equal(
      withCardWording(adapted.face, { oracle, original }, 'oracle').artist,
      row.printedArtist,
    );
    assert.equal(
      withCardWording(adapted.face, { oracle, original }, 'original').artist,
      row.printedArtist,
    );
    assert.deepEqual(entry, snapshot);
    const stale = resolvePrintingArtist(row.id, row.providerArtist, {
      referenceSha256: '0'.repeat(64),
    });
    assert.equal(stale.artist, row.providerArtist);
    assert.equal(stale.provenance.status, 'reference-mismatch');
    assert.deepEqual(stale.provenance.corrections, []);
    assert.throws(
      () => presentation({ ...entry, reference: { sha256: '0'.repeat(64) } }),
      /artist credit review is stale/,
    );
    for (const changed of [{ set: 'other' }, { collector_number: '999' }])
      assert.throws(
        () => presentation({ ...entry, card: { ...entry.card, ...changed } }),
        /artist credit review is stale/,
      );
    const supplied = { [row.id]: { artist: 'Custom credit' } };
    assert.equal(presentation(entry, supplied).face.artist, row.providerArtist);
    const reviewed = {
      [row.id]: {
        artist: 'Re-reviewed credit',
        reviewedFields: ['artist'],
        referenceHash: row.referenceHash,
      },
    };
    assert.equal(presentation(entry, reviewed).face.artist, 'Re-reviewed credit');
    resolved.provenance.corrections[0].artist = 'Mutated';
    assert.equal(resolvePrintingArtist(row.id, null).artist, row.printedArtist);
  }
  for (const set of ['lea', '2ed', 'tmp']) {
    const annotations = await fixture(set + '/annotations.json');
    for (const [id, row] of Object.entries(annotations.cards)) {
      if (!row.reviewedFields?.includes('artist')) continue;
      const resolved = resolvePrintingArtist(id, 'Canonical name', {
        referenceSha256: row.referenceHash,
      });
      assert.equal(resolved.artist, row.artist);
      assert.equal(resolved.provenance.status, 'applied');
      assert.equal(
        resolved.provenance.corrections[0].source.endsWith(set + '/annotations.json'),
        true,
      );
    }
  }
  for (const id of ['unknown-printing', '__proto__', 'constructor'])
    for (const artist of [undefined, null, 'Dan Murayama Scott']) {
      const resolved = resolvePrintingArtist(id, artist);
      assert.equal(resolved.artist, artist);
      assert.equal(resolved.provenance.status, 'unreviewed');
    }
  assert.throws(() => resolvePrintingArtist('', 'Artist'), /must not be empty/);
  for (const id of ['unknown-printing', '__proto__', 'constructor']) {
    const r = resolvePrintingWording(id, input);
    assert.equal(r.provenance.status, 'unreviewed');
    assert.equal(r.wordings.original.rulesText, 'Provider rules.\nProvider flavor.');
  }
  const artifacts = await fixture('leb/annotations-historic-artifact-types.json');
  const [id, artifact] = Object.entries(artifacts.cards).find(
    ([, r]) => r.typeLine === 'Continuous Artifact',
  );
  const r = resolvePrintingWording(id, input, { referenceSha256: artifact.referenceHash });
  assert.equal(r.wordings.original.typeLine, 'Continuous Artifact');
  assert.equal(r.wordings.original.rulesText, 'Provider rules.\nProvider flavor.');
  assert.equal(r.wordings.oracle.typeLine, oracle.typeLine);
  assert.equal(r.provenance.identity, 'printing-id-and-scan');
  assert.ok(r.provenance.corrections.some((c) => c.fields.includes('typeLine')));
  assert.ok(r.provenance.corrections.every((c) => !c.fields.includes('rulesText')));
  assert.equal(
    resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) }).provenance.status,
    'reference-mismatch',
  );
  assert.equal(resolvePrintingWording(id, { oracle }).provenance.status, 'missing-original');
  assert.equal(resolvePrintingWording(id, { oracle }).wordings.original, undefined);
  const legends = await fixture('leg/annotations-creature-types.json');
  const [berserkerId, berserker] = Object.entries(legends.cards).find(([, r]) => r.printedName);
  const b = resolvePrintingWording(berserkerId, input);
  assert.equal(b.wordings.original.name, 'rathi Berserker');
  assert.equal(
    withCardWording({ name: 'Host', typeLine: 'Creature' }, b.wordings, 'oracle').name,
    'Oracle name',
  );
  assert.equal(
    withCardWording({ name: 'Host', typeLine: 'Creature' }, b.wordings, 'original').name,
    berserker.printedName,
  );
  const paladins = await fixture('3ed/annotations.json');
  const [paladinId, paladin] = Object.entries(paladins.cards).find(([, r]) => r.flavorReviewNote);
  const runs = [
    { role: 'rules', runs: [{ text: 'Provider rules.', italic: true }] },
    { role: 'flavor', runs: [{ text: 'Provider flavor.' }] },
  ];
  const p = resolvePrintingWording(paladinId, {
    oracle,
    original: { ...original, rulesParagraphs: runs },
  });
  assert.equal(p.wordings.original.rulesParagraphs[0].runs[0].italic, true);
  assert.equal(p.wordings.original.rulesText, 'Provider rules.\n' + paladin.flavorText);
  const full = await fixture('future-printing-corrections.json');
  const planar = await fixture('planar-printing-corrections.json');
  for (const [id, correction] of Object.entries(planar.cards)) {
    const resolved = resolvePrintingWording(id, input, {
      referenceSha256: correction.referenceSha256,
    });
    const printed = correction.faces[0];
    assert.equal(resolved.wordings.original.typeLine, printed.originalType ?? original.typeLine);
    assert.equal(resolved.wordings.oracle.typeLine, oracle.typeLine);
    assert.equal(
      resolved.wordings.original.rulesText,
      (printed.originalText ?? original.rulesText) + '\nProvider flavor.',
    );
    assert.equal(resolved.wordings.oracle.rulesText, 'Oracle rules.\nOracle flavor.');
    if (printed.originalText) {
      assert.ok(resolved.wordings.original.rulesText.startsWith('Choose one — '));
      const rich = resolvePrintingWording(id, {
        oracle,
        original: { ...original, rulesParagraphs: runs },
      });
      assert.equal(rich.wordings.original.rulesParagraphs[0].runs[0].text, printed.originalText);
      assert.deepEqual(rich.wordings.original.rulesParagraphs.at(-1), runs[1]);
    }
  }
  const fullId = Object.keys(full.cards)[0];
  const f = resolvePrintingWording(fullId, { oracle, original: { ...original, flavorText: '' } });
  assert.equal(f.wordings.original.rulesText, '');
  const taroxId = '0b06bd73-c45a-4560-bd8d-413608c5f89e';
  const tarox = resolvePrintingWording(taroxId, input);
  const grandeur = tarox.wordings.original.rulesParagraphs.find((p) =>
    p.runs[0].text.startsWith('Grandeur'),
  );
  assert.deepEqual(grandeur.runs[0], { text: 'Grandeur', italic: true });
  assert.ok(grandeur.runs[1].text.startsWith(' — Discard'));
  assert.equal(tarox.wordings.original.rulesParagraphs.at(-1).runs[0].text, 'Provider flavor.');
  assert.equal(tarox.wordings.oracle.rulesText, 'Oracle rules.\nOracle flavor.');
  assert.ok(tarox.provenance.corrections.some((c) => c.paragraphScope === 'rules-only'));
  const richFlavor = {
    role: 'flavor',
    align: 'right',
    runs: [{ text: 'Rich flavor.', italic: false }],
  };
  const styled = resolvePrintingWording(taroxId, {
    oracle,
    original: { ...original, rulesParagraphs: [runs[0], richFlavor] },
  });
  assert.deepEqual(styled.wordings.original.rulesParagraphs.at(-1), richFlavor);
  const special = await fixture('adventure-printing-corrections.json');
  const [specialId, specialRow] = Object.entries(special.cards)[0];
  assert.equal(resolvePrintingWording(specialId, input).provenance.status, 'face-required');
  assert.equal(
    resolvePrintingWording(specialId, input, { faceName: 'Unrelated' }).provenance.status,
    'face-not-found',
  );
  const s = resolvePrintingWording(specialId, input, { faceName: 'Stomp' });
  assert.equal(
    s.wordings.original.typeLine,
    specialRow.faces.find((f) => f.name === 'Stomp').originalType,
  );
  assert.equal(s.wordings.oracle.rulesText, 'Oracle rules.\nOracle flavor.');
  r.wordings.original.rulesParagraphs[0].runs[0].text = 'mutated';
  r.provenance.corrections[0].after.typeLine = 'mutated';
  assert.equal(resolvePrintingWording(id, input).wordings.original.typeLine, 'Continuous Artifact');
  assert.deepEqual(input, snapshot);
  assert.throws(() => resolvePrintingWording('', input), /must not be empty/);
  console.log(
    'Public printing resolver: exact identity, field provenance, stale scans, face selection, empty bodies, Oracle preservation and isolation pass.',
  );
} finally {
  await server.close();
}
