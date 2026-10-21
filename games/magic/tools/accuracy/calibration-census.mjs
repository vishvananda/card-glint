import assert from 'node:assert/strict';
const digest = /^[a-f0-9]{64}$/;
/** A finite printing family can contain fewer than three names. Certify its
 * full observed population without claiming an independent holdout or transfer. */
export function checkSourceCensus(group, proof) {
  const census = proof.sourceCensus;
  assert(census && census.heldOut === false, 'A source census must disclose reused development');
  assert.equal(census.scope, 'all-ordinary-printings-in-variant');
  assert.equal(
    group.references.nonfoil,
    group.printings,
    'Foil-only cards cannot certify a nonfoil census',
  );
  assert(Array.isArray(census.names) && census.names.length > 0);
  assert(census.names.every((n) => typeof n === 'string' && n.trim()));
  assert.equal(new Set(census.names).size, census.names.length);
  assert.equal(proof.calibrationNames, census.names.length);
  assert.equal(proof.validationNames, census.names.length);
  assert(digest.test(census.parametersHash ?? ''), 'Missing shared parameter identity');
  assert(census.parameterScope?.trim(), 'Missing shared source/parameter description');
  assert(Array.isArray(census.members), 'Missing native census members');
  const actual = census.members.map((m) => m.id).sort();
  assert.equal(new Set(actual).size, actual.length, 'Duplicate census member');
  assert.deepEqual(actual, [...group.printingIds].sort(), 'Census must replay every printing');
  assert.equal(actual.length, group.printings);
  for (const m of census.members) {
    assert(census.names.includes(m.name), 'Unrecorded census name');
    for (const field of ['referenceHash', 'poseHash', 'inputHash', 'nativeFaceHash'])
      assert(digest.test(m[field] ?? ''), 'Missing native census ' + field);
  }
  assert.deepEqual(
    [...new Set(census.members.map((m) => m.name))].sort(),
    [...census.names].sort(),
  );
}
