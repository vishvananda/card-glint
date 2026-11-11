// Run the browser differential first. This records exact source history, not fit approval.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { format } from 'prettier';
import { hash } from './common.mjs';
const baseline = 'a39f137a23a8cac7b47fcaf31c18e88b1af4f241';
const evidence = JSON.parse(await readFile('evidence/color-indicators/painter-parity.json'));
assert.equal(evidence.parent, baseline);
assert(evidence.rows.length >= 84);
assert(evidence.rows.every((r) => r.changedDefaultBytes === 0 && r.changedIndicatorBytes > 0));
const files = {};
for (const [file, after] of Object.entries(evidence.sources)) {
  assert(file.startsWith('games/magic/src/') || file === 'games/magic/tools/accuracy/adapter.mjs');
  assert.equal(
    hash(await readFile(file)),
    after,
    'Rerun the browser differential after editing ' + file,
  );
  let beforeSource = null;
  try {
    beforeSource = execFileSync('git', ['show', `${baseline}:${file}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    /* Exact added modules are excluded only from historical trees. */
  }
  files[file] = { before: beforeSource === null ? null : hash(beforeSource), after, beforeSource };
}
assert(Object.keys(files).length >= 25);
// The generated manifest records source identities as well as unchanged tables.
// Reconstruct only this exact metadata transition, preserving every data payload.
const manifestFile = 'games/magic/src/data/generated-manifest.json';
const manifestBytes = await readFile(manifestFile),
  manifest = JSON.parse(manifestBytes);
for (const [file, e] of Object.entries(files)) {
  if (!Object.hasOwn(manifest.sources, file)) continue;
  assert.equal(manifest.sources[file], e.after, 'Regenerate set data after editing ' + file);
  if (e.beforeSource === null) delete manifest.sources[file];
  else manifest.sources[file] = e.before;
}
const priorManifest = await format(JSON.stringify(manifest), { parser: 'json', printWidth: 100 });
files[manifestFile] = {
  after: hash(manifestBytes),
  before: hash(priorManifest),
  beforeSource: priorManifest,
};
const proof = {
  schema: 1,
  kind: 'optional-color-indicators-default-painter-parity',
  baseline,
  scoreReuse: false,
  scope: 'Historical default faces without visible indicators only',
  files,
  evidence,
};
const bytes = gzipSync(Buffer.from(JSON.stringify(proof)), { level: 9 });
const directory = 'games/magic/fixtures/accuracy/color-indicators';
await mkdir(directory, { recursive: true });
await writeFile(directory + '/source-proof.json.gz', bytes);
console.log(
  JSON.stringify({
    file: directory + '/source-proof.json.gz',
    sha256: hash(bytes),
    files: Object.keys(files).length,
    controls: evidence.rows.length,
  }),
);
