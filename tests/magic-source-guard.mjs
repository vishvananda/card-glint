import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

/** A cache-label bump can preserve historical pixel evidence only when undoing
 * that exact replacement reproduces the complete measured source byte-for-byte. */
export async function assertMagicSourceHash(file, expected) {
  const bytes = await readFile(file);
  if (hash(bytes) === expected) return;
  const proof = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/early-expansion-cache-compatibility.json'),
  );
  assert.equal(file, proof.file, 'Unproven source change: ' + file);
  assert.equal(expected, proof.before, 'Wrong compatibility ancestor: ' + file);
  assert.equal(hash(bytes), proof.after, 'Stale compatibility extension: ' + file);
  const source = bytes.toString();
  assert.equal(source.split(proof.to).length, 2);
  assert.equal(hash(source.replace(proof.to, proof.from)), expected, 'Painter changed: ' + file);
}
