// Record source restoration and native ABU typography evidence without scan pixels.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import prettier from 'prettier';
import { root, hash, writeJson } from './common.mjs';
const [study] = process.argv.slice(2);
assert(study, 'Usage: record-abu-fractional-proof.mjs STUDY_ROOT');
const base = '67b0ec3a5c282c8d84e5860fc77d95297afa881a';
const names = ['alpha-typography', 'canvas-face', 'early-text-tiers', 'retro-rules'].map(
  (n) => 'games/magic/src/presentation/' + n + '.ts',
);
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
assert.deepEqual(
  git('diff', '--name-only', base, '--', 'games/magic/src').toString().trim().split('\n').sort(),
  [...names].sort(),
);
const native = JSON.parse(await readFile(path.join(study, 'final-native/proof.json')));
const unaffected = JSON.parse(await readFile(path.join(study, 'final-unaffected/proof.json')));
assert.equal(native.completed, 899);
assert.equal(native.rows.length, 899);
assert.deepEqual(native.faults, []);
assert(
  native.rows.every((r) => r.sourceBound && !r.prototypeMatch && r.outside === 0 && r.alpha === 0),
);
assert.equal(unaffected.source.beforeRenderer, native.source.beforeRenderer);
assert.equal(unaffected.source.afterRenderer, native.source.afterRenderer);
assert(unaffected.rows.every((r) => JSON.stringify(r.before) === JSON.stringify(r.after)));
const directory = 'games/magic/fixtures/accuracy/early-through-fourth';
const evidence = {};
for (const [role, file] of [
  ['native', 'final-native/proof.json'],
  ['unaffected', 'final-unaffected/proof.json'],
  ['raw', 'raw-report.json'],
  ['tiered', 'tiered-report.json'],
  ['selected', 'final-direct-report.json'],
  ['metadata', 'final-metadata.json'],
]) {
  const raw = await readFile(path.join(study, file)),
    data = JSON.parse(raw);
  if (['raw', 'tiered', 'selected'].includes(role)) {
    assert.equal(data.summary.inventory, 899);
    assert.equal(data.status, 'complete-development-census');
  }
  const compressed = gzipSync(raw, { level: 9, mtime: 0 }),
    target = directory + '/abu-fractional-' + role + '.json.gz';
  await writeFile(path.join(root, target), compressed);
  evidence[role] = { file: target, sha256: hash(compressed), contentSha256: hash(raw) };
}
const metadata = JSON.parse(await readFile(path.join(study, 'final-metadata.json')));
assert.equal(metadata.capturedRenderer, native.source.afterRenderer);
assert.equal(metadata.status, 'verified-generated-metadata-only');
const nativeToolBytes = await readFile(path.join(study, 'final-native/capture-tool.mjs'));
assert.equal(hash(nativeToolBytes), native.source.tool);
const nativeToolCompressed = gzipSync(nativeToolBytes, { level: 9, mtime: 0 });
const nativeToolFile = directory + '/abu-fractional-native-tool.mjs.gz';
await writeFile(path.join(root, nativeToolFile), nativeToolCompressed);
const nativeTool = {
  file: nativeToolFile,
  sha256: hash(nativeToolCompressed),
  contentSha256: hash(nativeToolBytes),
};
const oldHashes = Object.fromEntries(names.map((f) => [f, new Set()]));
for (const folder of ['games/magic/fixtures/accuracy', 'tests']) {
  const files = (await readdir(path.join(root, folder), { recursive: true })).filter(
    (f) => /\.json$/.test(f) && /source|compatib|integration|reference|proof/.test(f),
  );
  for (const file of files) {
    let value;
    try {
      value = JSON.parse(await readFile(path.join(root, folder, file)));
    } catch (e) {
      if (e instanceof SyntaxError) continue;
      throw e;
    }
    for (const key of ['files', 'dependencies', 'newModules', 'sourceInventory']) {
      const table = value[key];
      if (!table || typeof table !== 'object') continue;
      for (const name of names) {
        const v = table[name];
        if (!v) continue;
        const candidates =
          typeof v === 'string'
            ? [v]
            : [v.before, v.after, ...(v.historicalHashes ?? []), ...(v.ancestors ?? [])];
        for (const h of candidates)
          if (typeof h === 'string' && /^[a-f0-9]{64}$/.test(h)) oldHashes[name].add(h);
      }
    }
  }
}
const differ =
  "import sys,json,difflib\np=json.load(sys.stdin);a=p['before'].splitlines(keepends=True);b=p['after'].splitlines(keepends=True)\nprint(json.dumps([{'start':j1,'count':j2-j1,'lines':a[i1:i2]} for tag,i1,i2,j1,j2 in reversed(difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes()) if tag!='equal']))";
const files = {};
for (const name of names) {
  const before = git('show', base + ':' + name),
    after = await readFile(path.join(root, name));
  const reverseEdits = JSON.parse(
    execFileSync('python3', ['-c', differ], {
      input: JSON.stringify({ before: before.toString(), after: after.toString() }),
    }),
  );
  const lines = after.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  assert.equal(hash(lines.join('')), hash(before));
  files[name] = {
    before: hash(before),
    after: hash(after),
    historicalHashes: [...oldHashes[name]].filter((h) => h !== hash(after)).sort(),
    reverseEdits,
  };
}
const proof = {
  schema: 1,
  base,
  affectedSets: ['lea', 'leb', '2ed'],
  affectedComponents: ['rules', 'flavor', 'fullCard', 'release'],
  beforeRenderer: native.source.beforeRenderer,
  capturedRenderer: native.source.afterRenderer,
  afterRenderer: metadata.currentRenderer,
  nativeTool,
  scope:
    'Original ABU regular/small faces use fractional advances after selecting their reviewed size/centering class. A row-budget guard keeps the calibrated inset and reduces size by at most0.5px when needed. Large balanced passages and Oracle layouts remain unchanged. Unlimited small-face reviews and the dense cutoff take priority over regular-density retention. Direct native scores retain their original source identity; a separate certificate approves the generated dependency-manifest refresh. This receipt cannot authorize changed rules to reuse old scores.',
  files,
  evidence,
  limitations: [
    'Development scans and poses are reused; no independent holdout is claimed.',
    'Three historical Alpha pose rejections remain visible outside the accepted metric aggregate.',
    'Manual wrapping, flavor typography and source-frame residuals remain separate review items.',
    'Text-region scores are not whole-card compliance scores or percentage fidelity.',
  ],
};
const target = path.join(root, directory, 'abu-fractional-source-proof.json');
const config = await prettier.resolveConfig(target),
  formatted = await prettier.format(JSON.stringify(proof), { ...config, parser: 'json' });
await writeFile(target, formatted);
const moduleFile = path.join(root, 'games/magic/tools/accuracy/abu-fractional-ancestry.mjs');
let code = await readFile(moduleFile, 'utf8');
assert(code.includes('__ABU_FRACTIONAL_RECEIPT__'));
code = code.replace('__ABU_FRACTIONAL_RECEIPT__', hash(formatted));
await writeFile(moduleFile, await prettier.format(code, { ...config, parser: 'babel' }));
await writeJson(path.join(study, 'recorded-proof.json'), {
  receiptHash: hash(formatted),
  afterRenderer: proof.afterRenderer,
  evidence,
});
console.log(
  JSON.stringify({
    receiptHash: hash(formatted),
    afterRenderer: proof.afterRenderer,
    files: names.length,
    native: native.completed,
    unaffected: unaffected.cases.length,
  }),
);
