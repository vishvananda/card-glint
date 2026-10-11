import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createPixelKernels } from '../dist/lib/kernels.js';
const options = { wasmUrl: await readFile('dist/lib/pixels_bg.wasm') };
const [a, b] = await Promise.all([createPixelKernels(options), createPixelKernels(options)]);
try {
  const pixels = Uint8Array.from({ length: 256 }, (_, i) => (i % 32 < 16 ? 0 : 255));
  const first = a.etch(8, 8, pixels, 14),
    saved = first.slice();
  assert.ok(first.some((v) => v > 0));
  const strict = b.etch(8, 8, pixels, 255);
  assert.ok(strict.every((v) => v === 0));
  a.etch(8, 8, new Uint8Array(256), 20);
  assert.deepEqual(first, saved, 'Returned masks are owned independently of scratch');
  for (const args of [
    [0, 8, pixels],
    [8, 8, pixels, 256],
    [8, 8, pixels, -1],
    [8, 8, pixels, NaN],
    [4294967304, 8, pixels],
    [8, 8, pixels.subarray(1)],
  ])
    assert.throws(() => a.etch(...args));
  a.dispose();
  a.dispose();
  assert.throws(() => a.etch(8, 8, pixels), /disposed/);
  assert.deepEqual(b.etch(8, 8, pixels, 14), saved, 'Disposing one workspace preserves the other');
} finally {
  a.dispose();
  b.dispose();
}
console.log(
  'Public kernels: shared initialization, owned output, checked inputs and independent lifetimes passed.',
);
