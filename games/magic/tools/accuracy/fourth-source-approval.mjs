import { preOldFrameAdoptionSource } from './old-frame-adoption-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { isDeepStrictEqual } from 'node:util';
import { root, hash } from './common.mjs';
import {
  validateFourthSourceReadiness,
  loadFourthBodyReviews,
} from './fourth-source-readiness.mjs';

const base = 'games/magic/fixtures/accuracy/4ed/';
export const fourthSourceFiles = {
  input: base + 'flavor-fractional-inputs.json.gz',
  native: base + 'basic-symbol-native-review.json.gz',
  publicInputs: base + 'original-source-public-input-review.json.gz',
  types: base + 'annotations-printed-types.json',
  bodies: base + 'original-body-source-index.json',
  receipt: base + 'original-source-readiness-r2.json.gz',
  producer: base + 'original-source-readiness-r2-tool.mjs.gz',
  validator: 'games/magic/tools/accuracy/fourth-source-readiness.mjs',
};
const decode = (file, raw) => (file.endsWith('.gz') ? gunzipSync(raw) : raw);
export async function fourthSourceReadinessProof(set) {
  const bytes = Object.fromEntries(
    await Promise.all(
      Object.entries(fourthSourceFiles).map(async ([key, file]) => [
        key,
        await fs.readFile(root + '/' + file),
      ]),
    ),
  );
  const docs = Object.fromEntries(
    Object.entries(bytes)
      .filter(([k]) => !['producer', 'validator'].includes(k))
      .map(([k, b]) => [k, JSON.parse(decode(fourthSourceFiles[k], b))]),
  );
  const p = docs.receipt;
  assert.equal(p.status, 'reviewed-fourth-original-input-coverage');
  const input = docs.input,
    native = docs.native,
    publicInputs = docs.publicInputs,
    types = docs.types,
    bodies = await loadFourthBodyReviews(docs.bodies);
  assert.equal(p.inputHash, hash(decode(fourthSourceFiles.input, bytes.input)));
  for (const key of ['native', 'publicInputs', 'types', 'bodies'])
    assert.equal(p.sources[key], hash(decode(fourthSourceFiles[key], bytes[key])));
  assert.equal(p.toolHash, hash(decode(fourthSourceFiles.producer, bytes.producer)));
  assert.equal(p.toolHash, hash(bytes.validator));
  assert.equal(p.sources.inputs, p.inputHash);
  assert.equal(p.rendererHash, native.afterRenderer);
  assert.equal(p.inventoryIdentity, set.inventory.sourceIdentity);
  assert.deepEqual(p.sourceGuards, publicInputs.methodGuards);
  assert.deepEqual(p.bodyReviewGuards, bodies.reviewGuards);
  for (const [file, expected] of Object.entries(p.sourceGuards))
    assert.equal(
      hash(await preOldFrameAdoptionSource(file, await fs.readFile(root + '/' + file))),
      expected,
      'Changed Original source dependency: ' + file,
    );
  const checked = validateFourthSourceReadiness({
    input,
    native,
    publicInputs,
    types,
    bodies,
    set,
  });
  assert.deepEqual(checked, { summary: p.summary, groups: p.groups, rows: p.rows });
  const guards = {
    ...p.sourceGuards,
    ...Object.fromEntries(
      Object.entries(fourthSourceFiles).map(([k, file]) => [file, hash(bytes[k])]),
    ),
  };
  return { receipt: p, receiptHash: hash(bytes.receipt), guards };
}

export function fourthSourceInputDescriptor(review, group, field) {
  assert(['type', 'rules'].includes(field));
  const cohort = review.receipt.groups.find((g) => g.key === group.key);
  assert(cohort, 'Missing source-readiness group');
  assert.equal(cohort.membershipHash, group.membershipHash ?? group.scopeHash);
  assert.equal(cohort.printings, group.printings);
  const reviewed = field === 'type' ? cohort.typeIds : cohort.rulesIds;
  return {
    status: reviewed.length === group.printings ? 'ready' : 'partial',
    coveredPrintings: group.printings,
    readyPrintings: reviewed.length,
    partialPrintings: group.printings - reviewed.length,
    field,
    scanReviewedPrintings: reviewed.length,
    sources:
      reviewed.length === group.printings
        ? { 'scan-reviewed-matching-original': group.printings }
        : { 'original-public-source': group.printings },
    proof: { fourthSourceReadiness: review.receiptHash },
    guards: { [fourthSourceFiles.receipt]: review.receiptHash },
    evidence: [
      fourthSourceFiles.receipt,
      fourthSourceFiles.types,
      fourthSourceFiles.bodies,
      fourthSourceFiles.publicInputs,
    ],
    reason:
      field === 'type'
        ? 'Every physical type-line review matches both public Original wording APIs and the exact native input. Type wording readiness does not approve name/type geometry or font matching.'
        : reviewed.length === group.printings
          ? 'Names,type and complete rules boxes were visually read on every covered scan. Printing-specific rules and flavor match both public APIs and native inputs. Glyph shape/color and layout remain separate.'
          : 'Both public APIs reproduce every Original body from printing-specific providers and exact reviewed corrections. Complete scan transcription is still pending for this group;Oracle text is not substituted.',
  };
}

export async function fourthSourceInputCurrent(item, group, task, set, checked = new Map()) {
  if (set.set !== '4ed' || !['rules', 'headings'].includes(task)) return false;
  try {
    const key = hash(
      JSON.stringify([
        set.set,
        set.inventory.sourceIdentity,
        set.groups.map((g) => [g.key, g.printings, g.membershipHash ?? g.scopeHash]),
      ]),
    );
    if (!checked.has(key)) checked.set(key, fourthSourceReadinessProof(set));
    const review = await checked.get(key);
    const field = task === 'headings' ? 'type' : 'rules';
    const expected = fourthSourceInputDescriptor(review, group, field);
    const keys = [
      'status',
      'coveredPrintings',
      'readyPrintings',
      'partialPrintings',
      'field',
      'scanReviewedPrintings',
      'sources',
      'proof',
      'guards',
      'evidence',
    ];
    return keys.every((key) => isDeepStrictEqual(item[key], expected[key]));
  } catch (error) {
    if (
      error instanceof assert.AssertionError ||
      error instanceof SyntaxError ||
      error.code === 'ENOENT'
    )
      return false;
    throw error;
  }
}
