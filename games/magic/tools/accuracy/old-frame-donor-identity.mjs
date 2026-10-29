// Pixel identity control for offline donor hooks, independent of score weighting.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
import { threeDonorPlugins } from './old-frame-three-donor-hooks.mjs';
const [inputFile, profileFile, output] = process.argv.slice(2);
assert(output, 'Use INPUTS PROFILE NEW_REPORT');
await fs.access(output).then(
  () => {
    throw Error('Report exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const ib = await fs.readFile(inputFile),
  pb = await fs.readFile(profileFile);
const input = JSON.parse(ib),
  profile = JSON.parse(pb);
assert.equal(input.set, 'ons');
assert.equal(profile.set, input.set);
const selected = [...new Set(input.entries.map((e) => e.material))].map((m) =>
  input.entries.find((e) => e.material === m),
);
const renderer = await sourceHash(path.join(root, 'games/magic/src'));
const session = await openBrowser(input, { plugins: threeDonorPlugins() });
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of selected) {
    const pair = [];
    for (const skipDetails of [true, false]) {
      const png = await session.page.evaluate(
        async ({ e, profile, skipDetails }) => {
          globalThis.__threeDonor = { profile, donor: 'ons', skipDetails };
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          let image;
          try {
            image = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
            );
            return image.toDataURL().split(',')[1];
          } finally {
            delete globalThis.__threeDonor;
            if (image) image.width = image.height = 0;
          }
        },
        { e, profile, skipDetails },
      );
      pair.push(hash(Buffer.from(png, 'base64')));
    }
    assert.equal(pair[0], pair[1], e.name + ': comparison hook changed an own-profile face');
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      direct: pair[0],
      hook: pair[1],
      identical: true,
    });
  }
} finally {
  await session.close();
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), renderer);
await writeJson(output, {
  schema: 1,
  status: 'native-own-onslaught-profile-hook-identity',
  source: {
    input: hash(ib),
    profile: hash(pb),
    renderer,
    hooks: hash(await fs.readFile(new URL('./old-frame-three-donor-hooks.mjs', import.meta.url))),
  },
  scope:
    'Native full faces, all available material classes. The exact Onslaught profile is rendered with its direct generic/null legacy-details path and with the donor comparison hook. PNG identity is required; no metric can conceal missing mana or geometry.',
  rows,
});
console.log('Exact hook/direct native identity:', rows.length, 'material classes');
