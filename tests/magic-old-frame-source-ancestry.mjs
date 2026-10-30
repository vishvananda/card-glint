import { oldFrameAdoptionHistoricalFiles } from '../games/magic/tools/accuracy/old-frame-adoption-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from './magic-font-history-view.mjs';
import path from 'node:path';
import {
  oldFrameSourceDelta,
  oldFrameBasicIconsDelta,
  preBasicIconsSource,
  oldFrameArtWindowDelta,
  oldFrameOptionalComponentsDelta,
  preOptionalComponentsSource,
  preArtWindowSource,
  oldFrameAuditToolsDelta,
  preOldFrameSource,
  oldFrameHistoricalSourceFiles,
} from '../games/magic/tools/accuracy/old-frame-source-ancestry.mjs';
import { root, hash } from '../games/magic/tools/accuracy/common.mjs';
const delta = await oldFrameSourceDelta();
const files = await oldFrameAdoptionHistoricalFiles(
  (await fs.readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort(),
);
const original = [];
for (const file of await oldFrameHistoricalSourceFiles(files)) {
  const key = path.relative(root, file),
    bytes = await fs.readFile(file);
  original.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(await preOldFrameSource(key, bytes)),
  ]);
}
assert.equal(hash(JSON.stringify(original)), delta.beforeRenderer);
for (const [file, entry] of Object.entries(delta.files)) {
  const foreign = Buffer.from('foreign source revision');
  assert.equal(
    await preOldFrameSource(file, foreign),
    foreign,
    'Foreign bytes were silently projected',
  );
  const actual = await fs.readFile(path.join(root, file));
  const projected = await preOldFrameSource(file, actual);
  assert.equal(hash(projected), entry.beforeSource === null ? entry.after : entry.before);
}
assert.equal(delta.nativeProof.count, 65);
console.log(
  'Exact source-family receipt reconstructs the parent renderer, verifies 65 unchanged native controls and refuses foreign source bytes.',
);

const routing = await oldFrameAuditToolsDelta();
for (const [file, e] of Object.entries(routing.files)) {
  const bytes = await fs.readFile(path.join(root, file));
  assert.equal(hash(await preOldFrameSource(file, bytes)), e.before);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// foreign edit\n')]);
  assert.equal(await preOldFrameSource(file, foreign), foreign);
}

const art = await oldFrameArtWindowDelta(),
  parent = [];
for (const file of files) {
  const bytes = await fs.readFile(file);
  parent.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(
      await preArtWindowSource(
        path.relative(root, file),
        await preOptionalComponentsSource(
          path.relative(root, file),
          await preBasicIconsSource(path.relative(root, file), bytes),
        ),
      ),
    ),
  ]);
}
assert.equal(hash(JSON.stringify(parent)), art.beforeRenderer);
for (const [file, e] of Object.entries(art.files)) {
  assert.equal(
    hash(
      await preArtWindowSource(
        file,
        await preOptionalComponentsSource(
          file,
          await preBasicIconsSource(file, await fs.readFile(path.join(root, file))),
        ),
      ),
    ),
    e.before,
  );
  const foreign = Buffer.from('foreign art-window source revision');
  assert.equal(await preArtWindowSource(file, foreign), foreign);
}
console.log(
  'Optional art-window source reconstructs its exact parent and preserves all 65 default native controls.',
);

const components = await oldFrameOptionalComponentsDelta(),
  beforeComponents = [];
for (const file of files)
  beforeComponents.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(
      await preOptionalComponentsSource(
        path.relative(root, file),
        await preBasicIconsSource(path.relative(root, file), await fs.readFile(file)),
      ),
    ),
  ]);
assert.equal(hash(JSON.stringify(beforeComponents)), components.beforeRenderer);
for (const [file, e] of Object.entries(components.files)) {
  assert.equal(
    hash(
      await preOptionalComponentsSource(
        file,
        await preBasicIconsSource(file, await fs.readFile(path.join(root, file))),
      ),
    ),
    e.before,
  );
  const foreign = Buffer.from('foreign optional component source');
  assert.equal(await preOptionalComponentsSource(file, foreign), foreign);
}
console.log(
  'Optional printing components reconstruct their exact parent and preserve all 65 native family controls.',
);

const basic = await oldFrameBasicIconsDelta(),
  beforeBasic = [];
for (const file of files)
  beforeBasic.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(await preBasicIconsSource(path.relative(root, file), await fs.readFile(file))),
  ]);
assert.equal(hash(JSON.stringify(beforeBasic)), basic.beforeRenderer);
for (const [file, e] of Object.entries(basic.files)) {
  assert.equal(
    hash(await preBasicIconsSource(file, await fs.readFile(path.join(root, file)))),
    e.before,
  );
  const foreign = Buffer.from('foreign basic icon source');
  assert.equal(await preBasicIconsSource(file, foreign), foreign);
}
console.log(
  'Optional flat basic icons reconstruct their exact parent; 65 native defaults stay unchanged.',
);
