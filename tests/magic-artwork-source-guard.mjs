import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preAlphaInkSource } from './magic-alpha-ink-source-guard.mjs';

const manifest = JSON.parse(
  await readFile(new URL('./magic-artwork-sources.json', import.meta.url)),
);

function apply(bytes, edits) {
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) || [];
  for (const edit of edits) lines.splice(edit.start, edit.count, ...edit.lines);
  return Buffer.from(lines.join(''));
}

/** Historical receipts continue to describe the source that produced them. */
export async function preArtworkSource(file) {
  const bytes = await preAlphaInkSource(file),
    change = manifest.files[file];
  if (!change) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed artwork mask integration: ' + file);
  const before = apply(bytes, change.reverseEdits);
  assert.equal(hash(before), change.before, 'Pre-artwork source reconstruction failed: ' + file);
  return before;
}

/** Keep the preparation optimization active during the native differential gate.
 * Calibration changes are rewound separately; they do not touch this module. */
export function restoreArtworkPreparation(file, bytes) {
  if (file !== 'games/magic/src/presentation/canvas-face.ts') return bytes;
  const change = manifest.files[file];
  assert.equal(hash(bytes), change.before, 'Unexpected artwork comparison source');
  const after = apply(bytes, change.forwardEdits);
  assert.equal(hash(after), change.after, 'Artwork comparison reconstruction failed');
  return after;
}
