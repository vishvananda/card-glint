import { readFile, writeFile } from 'node:fs/promises';
import manifest from '../../assets.json' with { type: 'json' };

// A pinned Git tree is enough: no external SVG bytes belong in the package.
const [, owner, name, revision] = new URL(manifest.CONJURER_ROOT).pathname.split('/');
const repository = `${owner}/${name}`;
const url = `https://api.github.com/repos/${repository}/git/trees/${revision}?recursive=1`;
const source = process.argv[2];
const tree = source
  ? JSON.parse(await readFile(source, 'utf8'))
  : await fetch(url).then(async (response) => {
      if (!response.ok) throw Error(`Inventory HTTP ${response.status}`);
      return response.json();
    });
if (tree.truncated || tree.sha !== revision) throw Error('Incomplete or mismatched source tree');
const codes = {};
for (const { path, type } of tree.tree) {
  const match = /^img\/setSymbols\/official\/([a-z0-9]+)-([curms])\.svg$/.exec(path);
  if (type === 'blob' && match) codes[match[1]] = (codes[match[1]] ?? '') + match[2];
}
const output = {
  source: url,
  revision,
  note: 'Exact available rarity files, not a claim of historical accuracy or redistribution rights.',
  codes: Object.fromEntries(Object.entries(codes).sort(([a], [b]) => a.localeCompare(b))),
};
await writeFile(
  new URL('../../set-symbol-inventory.json', import.meta.url),
  JSON.stringify(output, null, 2) + '\n',
);
console.log(
  `${Object.keys(codes).length} sets; ${Object.values(codes).join('').length} styled rarity vectors`,
);
