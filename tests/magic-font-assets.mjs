import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
/** Immutable external font references; only verified bytes enter the cache. */
export async function fontBytes(font, cache) {
  const digest = (value) => createHash('sha256').update(value).digest('hex');
  await fs.mkdir(cache, { recursive: true });
  const file = path.join(cache, font.sha256);
  try {
    const value = await fs.readFile(file);
    if (digest(value) !== font.sha256) throw Error('Corrupt cached font: ' + font.family);
    return value;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  let failure;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(font.source ?? font.url, {
        headers: { 'User-Agent': 'card-glint-font-geometry/1' },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw Error('Font HTTP ' + response.status);
      const value = Buffer.from(await response.arrayBuffer());
      if (digest(value) !== font.sha256) throw Error('Changed upstream font: ' + font.family);
      await fs.writeFile(file, value);
      return value;
    } catch (error) {
      failure = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  throw Error('Unable to load verified font: ' + font.family, { cause: failure });
}
