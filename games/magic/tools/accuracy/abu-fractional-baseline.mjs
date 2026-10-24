// Rebuild the frozen 0.7.0 ABU baseline from the public manifests and local cache.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { earlyFractionalInputs } from './early-fractional-inputs.mjs';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, writeJson } from './common.mjs';
const [referenceArgument, out, limitArgument] = process.argv.slice(2);
assert(out, 'Usage: abu-fractional-baseline.mjs REFERENCE_ROOT OUT [LIMIT]');
const referenceRoot = path.resolve(referenceArgument),
  limit = limitArgument === undefined ? undefined : Number(limitArgument);
assert(limit === undefined || (Number.isInteger(limit) && limit > 0));
assert.equal(
  execFileSync('git', ['rev-parse', 'HEAD'], { cwd: referenceRoot, encoding: 'utf8' }).trim(),
  '67b0ec3a5c282c8d84e5860fc77d95297afa881a',
  'Use the reviewed 0.7.0 source worktree',
);
const inputs = await earlyFractionalInputs(['lea', 'leb', '2ed']);
const source = {
  policy: 'baseline',
  census: limit === undefined,
  rendererHash: await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  inputsHash: hash(JSON.stringify(inputs)),
  tool: hash(await readFile(new URL(import.meta.url))),
};
assert.equal(
  source.rendererHash,
  'f384b2f82f5fbfab1ecd82b7879c107e9eda327faa4e02199e2e31e475d4ec24',
  'Prepare matching generated data in the reference worktree',
);
await mkdir(out, { recursive: true });
await writeJson(path.join(out, 'inputs.json'), inputs);
const session = await openBrowser(inputs, {
  sourceRoot: referenceRoot,
  plugins: [
    {
      name: 'record-baseline-body',
      enforce: 'pre',
      transform(code, id) {
        if (id !== path.join(referenceRoot, 'games/magic/src/presentation/retro-rules.ts')) return;
        const needle = '    return adjustCalibrationRules(context, face, layout);';
        assert.equal(code.split(needle).length, 2);
        return code.replace(
          needle,
          '    const result=adjustCalibrationRules(context, face, layout);\\n    (globalThis as any).__baselineBody=result;\\n    return result;'.replaceAll(
            '\\n',
            '\n',
          ),
        );
      },
    },
  ],
});
const rows = [];
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__baselineCompose = (
      await import('/games/magic/src/presentation/canvas-face.ts')
    ).composeCardTexture;
    globalThis.__baselineAssets = await import('/games/magic/tools/accuracy/abu-assets.mjs');
  });
  for (const entry of inputs.entries.slice(0, limit)) {
    const result = await session.page.evaluate(async (entry) => {
      const image = await globalThis.__baselineCompose(
        { face: entry.face, printingId: entry.id, printedImage: null },
        'inspect',
        new AbortController().signal,
        {
          loadImages: (urls, signal) =>
            globalThis.__baselineAssets.loadAccuracyImages(urls, signal, entry.face.illustration),
        },
      );
      try {
        return { png: image.toDataURL().split(',')[1], layout: globalThis.__baselineBody ?? null };
      } finally {
        image.width = image.height = 0;
      }
    }, entry);
    const dir = path.join(out, entry.set, entry.id);
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(result.png, 'base64');
    await writeFile(path.join(dir, 'current.png'), bytes);
    rows.push({
      id: entry.id,
      set: entry.set,
      name: entry.name,
      referenceHash: entry.reference.sha256,
      poseHash: hash(JSON.stringify(entry.pose)),
      accepted: entry.pose.accepted,
      variants: [{ id: 'current', renderHash: hash(bytes), layout: result.layout }],
    });
    if (rows.length % 20 === 0 || rows.length === inputs.entries.length || rows.length === limit)
      await writeJson(path.join(out, 'study.json'), {
        schema: 1,
        source,
        completed: rows.length,
        inventory: inputs.entries.length,
        faults: session.faults,
        rows,
      });
    console.log(entry.set, rows.length + '/' + inputs.entries.length, entry.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(source.rendererHash, await sourceHash(path.join(referenceRoot, 'games/magic/src')));
} finally {
  await session.close();
}
