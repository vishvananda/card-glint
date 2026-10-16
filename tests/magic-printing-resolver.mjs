import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';
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
  const artists = await fixture('planar-artist-review.json');
  for (const row of artists.rows) {
    const entry = {
      card: {
        id: row.id,
        name: row.name,
        set: artists.set,
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
    assert.deepEqual(adapted.reviewedFields, ['artist']);
    assert.equal(adapted.contentStatus, 'oracle-unverified');
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
