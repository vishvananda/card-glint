import { cp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/** @param {string} destination */
export async function copyBrowserLibrary(destination) {
  await cp('dist/lib', destination, { recursive: true });
  for (const file of await readdir(destination, { recursive: true })) {
    if (!file.endsWith('.js')) continue;
    const outputFile = path.join(destination, file);
    const source = await readFile(outputFile, 'utf8');
    await writeFile(
      outputFile,
      source.replace(
        /\(await import\((['"])(\.\/(?:renderer|pixels)_bg\.wasm)\?url\1\)\)\.default/g,
        (_, _quote, url) => `new URL(${JSON.stringify(url)},import.meta.url)`,
      ),
    );
  }
}
