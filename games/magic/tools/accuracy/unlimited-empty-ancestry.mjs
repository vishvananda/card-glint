// The sole adapter change adds one scan-reviewed Unlimited entry. Historical
// non-Unlimited input receipts retain the exact original adapter, never new data.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';
const fileName = 'games/magic/tools/accuracy/empty-printing-text.mjs';
export async function preUnlimitedEmptySource(file, bytes) {
  if (file !== fileName) return bytes;
  if (hash(bytes) === 'c014fd2b2c2c950c7442338716f2cf5bc7fe50d3fbc9da4354a98fc034b1f911')
    return bytes;
  assert.equal(
    hash(bytes),
    'a6482b4145020847f58dcb1773fe16824197f3ebdda450c6bcf9c2f320c8dbc5',
    'Unreviewed Unlimited empty-text adapter',
  );
  const annotation = await readFile(
    'games/magic/fixtures/accuracy/2ed/annotations-empty-rules.json',
  );
  assert.equal(
    hash(annotation),
    'a4e72637b024d92f84ebe26596433d87a15fa6f84b87b149c6b9a31c28c0bd0b',
  );
  const review = JSON.parse(annotation).cards['d79867a0-c525-4e91-8942-c61b41f9150c'];
  assert.equal(review.name, 'Wall of Ice');
  assert.equal(
    review.referenceHash,
    '84d0d1b2e267aa044b2f556abc6283f01fc8c4c70f3f5b4d650adca1f464c1fe',
  );
  assert.equal(review.reviewed, true);
  assert.equal(review.rulesText, '');
  const before = Buffer.from(
    bytes
      .toString()
      .replace(
        "import unlimited from '../../fixtures/accuracy/2ed/annotations-empty-rules.json' with { type: 'json' };\n",
        '',
      )
      .replace("lea, leb, '2ed': unlimited,", 'lea, leb,'),
  );
  assert.equal(hash(before), 'c014fd2b2c2c950c7442338716f2cf5bc7fe50d3fbc9da4354a98fc034b1f911');
  return before;
}
