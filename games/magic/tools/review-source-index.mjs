import assert from 'node:assert/strict';

/** Stable compact evidence IDs. Retired entries stay reserved. */
export function extendReviewSourceIndex(index, referenced, { check = false } = {}) {
  assert.equal(index.schema, 1);
  assert(Array.isArray(index.sources));
  const valid = (source) =>
    typeof source === 'string' &&
    source.startsWith('games/magic/fixtures/accuracy/') &&
    !source.split('/').includes('..');
  assert(index.sources.every(valid));
  assert.equal(new Set(index.sources).size, index.sources.length, 'Duplicate review source ID');
  assert(Array.isArray(referenced) && referenced.every(valid));
  const existing = new Set(index.sources);
  const additions = [...new Set(referenced)].filter((source) => !existing.has(source)).sort();
  if (check) assert.equal(additions.length, 0, 'Regenerate the review source index');
  return { ...index, sources: [...index.sources, ...additions] };
}
