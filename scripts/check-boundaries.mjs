import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
async function walk(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(path.join(root, e.name)) : path.join(root, e.name),
      ),
    )
  ).flat();
}
for (const root of ['crates', 'packages/browser/src', 'games'])
  for (const file of await walk(root)) {
    if (!/\.(?:rs|ts|js)$/.test(file)) continue;
    const source = await readFile(file, 'utf8');
    assert.ok(
      !/\/home\/|\.reference\/|vendor\/|from\s+['"](?:vue|three|@host-app)|src\/features\//.test(
        source,
      ),
      `Host dependency in ${file}`,
    );
    if (root !== 'games')
      assert.ok(
        !/games\/|references\/|manaSymbols|typeLine|loyalty/i.test(source),
        `Game vocabulary or asset leaked into ${file}`,
      );
    if (file.startsWith('games/'))
      assert.ok(!/from\s+['"][^'"]*games\//.test(source), `Cross-game dependency in ${file}`);
    if (file.endsWith('.rs'))
      assert.ok(source.split('\n').length <= 800, `Split the Rust module ${file}`);
  }
console.log('Game/host boundaries and Rust module sizes passed.');
