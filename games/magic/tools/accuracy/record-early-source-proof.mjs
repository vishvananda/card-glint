// One-time integration receipt. No scans are downloaded or pixels shipped.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { root, hash, readJson } from './common.mjs';
const [study] = process.argv.slice(2);
assert(study, 'Usage: record-early-source-proof.mjs STUDY');
const baseline = 'e8e2fc6fdd0062531b47bbe1e30570355ded4040';
const directory = 'games/magic/fixtures/accuracy/early-through-fourth';
const names = ['abu-land-palette', 'canvas-face', 'early-text-tiers', 'retro-dual-frame'].map(
  (n) => 'games/magic/src/presentation/' + n + '.ts',
);
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
assert.deepEqual(
  git('diff', '--name-only', baseline, '--', 'games/magic/src')
    .toString()
    .trim()
    .split('\n')
    .sort(),
  [...names].sort(),
);
const require = createRequire(root + '/package.json'),
  prettier = require('prettier'),
  { transform } = require('esbuild');
const canvas = 'games/magic/src/presentation/canvas-face.ts',
  oldCanvas = git('show', baseline + ':' + canvas).toString(),
  newCanvas = await readFile(path.join(root, canvas), 'utf8');
let expected =
  "import { ALPHA_RULES_REVISION } from './early-text-tiers.js';\nimport { retroDualFrameRevision } from './retro-dual-frame.js';\n" +
  oldCanvas;
const face = '  const face = input.face;';
assert.equal(expected.split(face).length, 2);
expected = expected.replace(
  face,
  face +
    "\n  const dualFrameRevision = input.layer === 'etching' ? undefined : retroDualFrameRevision(face);",
);
const key = "    'canvas-face-v148',";
assert.equal(expected.split(key).length, 2);
expected = expected.replace(
  key,
  key +
    `\n    ...(dualFrameRevision ? [dualFrameRevision] : []),
    ...(input.layer !== 'etching' && face.setCode?.toLowerCase() === 'lea' && face.wordingMode !== 'oracle'
      ? [ALPHA_RULES_REVISION] : []),`,
);
const normalized = async (code) =>
  (await transform(code, { loader: 'ts', target: 'es2022', format: 'esm', minify: true })).code;
assert.equal(
  await normalized(expected),
  await normalized(newCanvas),
  'Canvas changed beyond the reviewed imports and cache branches',
);
const alpha = await readJson(path.join(study, 'final-batch-alpha-measure.json'));
assert.equal(alpha.summary.total, 295);
assert.equal(alpha.summary.changed, 4);
assert.equal(alpha.summary.unchanged, 291);
assert.equal(alpha.summary.regressed, 0);
const beta = await readJson(path.join(study, 'final-batch-beta-parity.json'));
assert.equal(beta.total, 10);
assert.equal(beta.changed, 2);
assert(beta.rows.every((r) => r.exactPriorNativeMatch));
const keys = await readJson(path.join(study, 'final-batch-keys.json'));
assert.equal(keys.rows.length, 597);
assert(keys.rows.every((r) => !r.maskChanged));
assert.equal(keys.rows.filter((r) => r.faceChanged).length, 297);
const catalog = await readJson(path.join(study, 'early-catalog-audit.json'));
assert.equal(catalog.changed, 231);
assert(catalog.changes.every((r) => r.set === '2ed'));
assert.equal(
  catalog.afterHash,
  hash(
    await readFile(path.join(root, 'games/magic/fixtures/accuracy/printing-review-catalog.json')),
  ),
);
const evidence = {};
for (const [role, file, name] of [
  ['alphaMeasure', 'final-batch-alpha-measure.json', 'alpha-plain-wrap-measure'],
  ['alphaNative', 'final-batch-alpha/capture.json', 'alpha-plain-wrap-native'],
  ['betaParity', 'final-batch-beta-parity.json', 'beta-outline-final-parity'],
  ['keys', 'final-batch-keys.json', 'early-final-keys'],
  ['catalog', 'early-catalog-audit.json', 'early-catalog-audit'],
]) {
  const bytes = await readFile(path.join(study, file));
  JSON.parse(bytes);
  const target = directory + '/' + name + '.json.gz',
    compressed = gzipSync(bytes, { mtime: 0 });
  await writeFile(path.join(root, target), compressed);
  evidence[role] = { file: target, sha256: hash(compressed), contentSha256: hash(bytes) };
}
const files = {},
  dependencies = {};
const differ = `import sys,json,difflib
p=json.load(sys.stdin);a=p['before'].splitlines(keepends=True);b=p['after'].splitlines(keepends=True)
print(json.dumps([{'start':j1,'count':j2-j1,'lines':a[i1:i2]} for tag,i1,i2,j1,j2 in reversed(difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes()) if tag!='equal']))`;
for (const file of names) {
  const before = git('show', baseline + ':' + file),
    after = await readFile(path.join(root, file));
  const reverseEdits = JSON.parse(
    execFileSync('python3', ['-c', differ], {
      input: JSON.stringify({ before: before.toString(), after: after.toString() }),
      maxBuffer: 32 * 1024 * 1024,
    }),
  );
  const lines = after.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  assert.equal(hash(lines.join('')), hash(before));
  files[file] = { before: hash(before), after: hash(after), reverseEdits };
  dependencies[file] = hash(after);
}
const proof = {
  schema: 1,
  baselineCommit: baseline,
  candidateCommit: git('rev-parse', 'HEAD').toString().trim(),
  affectedSets: ['lea', 'leb', '2ed'],
  scope:
    'Restore exact 0.6.5 painter bytes for historical receipts only. The new Alpha layout and Beta outlines and Unlimited wording require fresh affected-set measurements. This does not reconstruct or alias the correction catalog. Existing immutable walker evidence is retained, never relabeled.',
  dependencies,
  files,
  evidence,
  audit: [
    'Compiled canvas-face statements are exactly the 0.6.5 module plus two pure imports and the reviewed face-only Alpha/Beta cache revisions. Every drawing function remains identical.',
    'All 295 original Alpha faces are paired with identical assets, references, poses and heading controls. Exactly four plain-rules passages improve; all other faces are byte-identical.',
    'All ten Beta duals match the earlier reviewed native outline candidate exactly: two changed, eight unchanged. The other nine Alpha duals remain unchanged in the whole-set replay.',
    'All 597 etching keys remain unchanged. Face keys change for Alpha original faces and the two reviewed Beta outlines only; a changed key is not a claim that every face changes pixels.',
    'All 231 correction changes belong to Unlimited. Every other correction and every artist review retains its exact values. Generated evidence locators can renumber, but are not painter inputs.',
    'Reverse edits restore every complete pre-batch source file hash. Unknown modifications, incomplete evidence or changed dependencies fail closed.',
  ],
};
const config = await prettier.resolveConfig(path.join(root, directory, 'source-proof.json'));
const formatted = await prettier.format(JSON.stringify(proof), { ...config, parser: 'json' });
await writeFile(path.join(root, directory, 'source-proof.json'), formatted);
const moduleFile = path.join(root, 'games/magic/tools/accuracy/abu-source-ancestry.mjs');
let module = await readFile(moduleFile, 'utf8');
assert(module.includes('__EARLY_SOURCE_PROOF_HASH__'));
module = module.replace('__EARLY_SOURCE_PROOF_HASH__', hash(formatted));
await writeFile(moduleFile, await prettier.format(module, { ...config, parser: 'babel' }));
console.log(
  JSON.stringify({
    proofHash: hash(formatted),
    affectedSets: proof.affectedSets,
    alpha: alpha.summary,
    beta: { changed: 2, unchanged: 8 },
    maskKeysChanged: 0,
    catalogChanges: 231,
  }),
);
