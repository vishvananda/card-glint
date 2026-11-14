// Freeze exact source history after reviewing the symbol-resolution differential.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { format } from 'prettier';
const hash = (v) => createHash('sha256').update(v).digest('hex');
const baseline = 'efaa4a952840000e8d66f0522ebed2e6bbb2c11e';
const evidence = JSON.parse(await readFile('test-results/recent-set-symbols/compatibility.json'));
assert.equal(evidence.baseline, baseline);
assert(evidence.controls > 9000 && evidence.additions === 1104);
assert.equal(hash(await readFile(evidence.tool.file)), evidence.tool.sha256);
const files = {};
for (const name of ['set-symbols.ts', 'styled-set-symbols.ts', 'recent-set-symbols.ts']) {
  const file = 'games/magic/src/presentation/' + name,
    bytes = await readFile(file);
  let beforeSource = null;
  try {
    beforeSource = execFileSync('git', ['show', baseline + ':' + file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    assert.equal(name, 'recent-set-symbols.ts');
  }
  files[file] = {
    beforeSource,
    before: beforeSource === null ? null : hash(beforeSource),
    after: hash(bytes),
  };
}
const manifestFile = 'games/magic/src/data/generated-manifest.json';
const bytes = await readFile(manifestFile),
  manifest = JSON.parse(bytes);
for (const [file, entry] of Object.entries(files)) {
  assert.equal(manifest.sources[file], entry.after);
  if (entry.beforeSource === null) delete manifest.sources[file];
  else manifest.sources[file] = entry.before;
}
const prior = await format(JSON.stringify(manifest), { parser: 'json', printWidth: 100 });
files[manifestFile] = { beforeSource: prior, before: hash(prior), after: hash(bytes) };
const receipt = gzipSync(
  Buffer.from(
    JSON.stringify({
      schema: 1,
      kind: 'recent-set-symbol-resolution',
      baseline,
      scoreReuse: false,
      evidence,
      files,
    }),
  ),
  { level: 9 },
);
const file = 'games/magic/fixtures/assets/recent-symbol-source-proof.json.gz';
await writeFile(file, receipt);
console.log(JSON.stringify({ file, sha256: hash(receipt), controls: evidence.controls }));
