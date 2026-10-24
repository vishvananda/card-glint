import { earlyFractionalInputs } from './early-fractional-inputs.mjs';
// Propose historical wording from a reviewed donor; never approve target scans.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { cacheRoot, hash } from './common.mjs';
const [donorInput, output] = process.argv.slice(2);
assert(output, 'Usage: collectors-wording-proposals.mjs REVIEWED_DONOR_INPUTS OUTPUT_GZ');
const bytes = await readFile(donorInput),
  inputs = JSON.parse(bytes);
const donors = inputs.entries.filter((e) => e.set === 'leb');
assert.equal(donors.length, 302);
const fields = (e) =>
  Object.fromEntries(
    ['typeLine', 'rulesText', 'flavorText', 'rulesParagraphs', 'manaSymbols', 'power', 'toughness']
      .filter((k) => e.face[k] !== undefined)
      .map((k) => [k, e.face[k]]),
  );
const reviewed = await earlyFractionalInputs(['leb']);
for (const donor of donors) {
  const current = reviewed.entries.find((e) => e.id === donor.id);
  assert(current);
  assert.equal(current.reference.sha256, donor.reference.sha256);
  assert.deepEqual(
    fields(donor),
    fields(current),
    'Donor fields differ from current reviewed Original inputs',
  );
}
const reviewedFieldsHash = hash(
  JSON.stringify(donors.map((e) => [e.id, fields(e)]).sort(([a], [b]) => a.localeCompare(b))),
);
const rows = [],
  unresolved = [];
for (const set of ['ced', 'cei']) {
  const raw = await readFile(path.join(cacheRoot, 'sets', set + '.json')),
    snapshot = JSON.parse(raw);
  assert(snapshot.complete);
  assert.equal(snapshot.entries.length, 302);
  for (const target of snapshot.entries) {
    const candidates = donors.filter(
      (d) => d.card.oracle_id === target.card.oracle_id && d.card.name === target.card.name,
    );
    assert(candidates.length, 'No reviewed donor for ' + target.card.name);
    const art = candidates.filter((d) => d.card.illustration_id === target.card.illustration_id);
    const options = art.length ? art : candidates,
      values = [...new Set(options.map((d) => JSON.stringify(fields(d))))];
    if (values.length !== 1) {
      unresolved.push({
        id: target.id,
        set,
        name: target.card.name,
        reason: 'ambiguous-donor-wording',
        donors: options.map((d) => d.id),
      });
      continue;
    }
    const donor = options[0];
    assert.equal(donor.face.wordingMode, 'original');
    assert(target.reference?.sha256 && donor.reference?.sha256);
    rows.push({
      id: target.id,
      set,
      name: target.card.name,
      status: 'proposal-needs-target-scan-review',
      target: {
        referenceHash: target.reference.sha256,
        oracleId: target.card.oracle_id,
        canonicalType: target.card.type_line,
        canonicalArtist: target.card.artist,
      },
      donor: {
        id: donor.id,
        set: 'leb',
        referenceHash: donor.reference.sha256,
        selection: art.length ? 'matching-illustration' : 'identical-wording-candidates',
        candidateIds: options.map((d) => d.id),
        wordingEvidence: donor.wordingEvidence,
        correctionEvidence: donor.correctionEvidence?.wording,
        fieldsHash: hash(JSON.stringify(fields(donor))),
      },
      proposedFields: fields(donor),
      artistReview: {
        status: 'separate-physical-review-required',
        donorPhysicalArtist: donor.face.artist,
        targetProviderArtist: target.card.artist,
      },
    });
  }
}
assert.equal(rows.length + unresolved.length, 604);
const out = {
  schema: 1,
  status: 'unreviewed-original-wording-proposals',
  scope:
    '604 Collectors/International Collectors targets joined by Oracle identity and name to the reviewed Beta Original inputs. Matching illustration is preferred; multiple donors are allowed only when their proposed wording fields are identical. No target is marked reviewed, no layout/scan adjustments are transferred, and physical artists need separate review. These records are intentionally outside the annotations import path and cannot enable calibration until checked against each target scan.',
  source: {
    donorInputHash: hash(bytes),
    reviewedFieldsHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
  },
  summary: Object.fromEntries(
    ['ced', 'cei'].map((s) => [
      s,
      {
        inventory: 302,
        proposals: rows.filter((r) => r.set === s).length,
        ambiguous: unresolved.filter((r) => r.set === s).length,
        canonicalTypeDifferences: rows.filter(
          (r) => r.set === s && r.proposedFields.typeLine !== r.target.canonicalType,
        ).length,
      },
    ]),
  ),
  unresolved,
  rows,
};
await writeFile(output, gzipSync(Buffer.from(JSON.stringify(out, null, 2) + '\n'), { mtime: 0 }));
console.log(JSON.stringify(out.summary));
