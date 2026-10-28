// Reporting-only history; no renderer or calibration approval is projected.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
const FILE = 'games/magic/tools/accuracy/calibration-report.mjs';
const CURRENT = '21f4b6214084a86e8f032a7cbf4c1b2b19a894f7e99a0bfc09adc38d333a6124';
const BEFORE = 'c19ef31ed4a1c7c94ee0da04684c162d6652d31d19dbb37159e81d7fd7ade267';
const ARCHIVE = 'games/magic/fixtures/accuracy/4ed/pre-source-readiness-report.mjs.gz';
const ARCHIVE_HASH = 'e484ec5ea15e325e1a65b9ad39520cf5865e767b219d4cb66e9bb7cef7484eba';
export async function preFourthSourceReport(file, bytes) {
  if (file !== FILE || hash(bytes) !== CURRENT) return bytes;
  const raw = await fs.readFile(root + '/' + ARCHIVE);
  assert.equal(hash(raw), ARCHIVE_HASH, 'Changed reporting history archive');
  const previous = gunzipSync(raw);
  assert.equal(hash(previous), BEFORE, 'Changed historical reporting source');
  return previous;
}
