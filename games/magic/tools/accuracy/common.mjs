import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../../../../', import.meta.url));
export const cacheRoot = process.env.MAGIC_ACCURACY_CACHE
  ? path.resolve(process.env.MAGIC_ACCURACY_CACHE)
  : path.join(root, 'games/magic/.cache/accuracy');
export const outputRoot = path.join(root, 'test-results/magic-accuracy');
export const fixtureRoot = path.join(root, 'games/magic/fixtures/accuracy');
export const hash = (value) => createHash('sha256').update(value).digest('hex');
export const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
export const referenceIdentity = (entries) =>
  hash(
    JSON.stringify(
      entries
        .map((entry) => [
          entry.id,
          entry.reference?.sha256 ?? entry.images?.reference?.sha256 ?? null,
        ])
        .sort((a, b) => a[0].localeCompare(b[0])),
    ),
  );

export async function atomicWrite(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`;
  await writeFile(temp, value);
  await rename(temp, file);
}

export const writeJson = (file, value) => atomicWrite(file, JSON.stringify(value, null, 2) + '\n');

export function options(args = process.argv.slice(2)) {
  const result = {
    set: 'm21',
    run: 'current',
    baseline: 'baseline-reviewed',
    cohort: 'all',
    limit: undefined,
    refresh: false,
    offline: false,
  };
  for (let i = 0; i < args.length; i++) {
    const key = args[i].replace(/^--/, '');
    if (!(key in result)) throw Error(`Unknown option: ${args[i]}`);
    if (['refresh', 'offline'].includes(key)) result[key] = true;
    else {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw Error(`Missing ${key} value`);
      result[key] = key === 'limit' ? Number(args[++i]) : args[++i];
    }
  }
  for (const key of ['set', 'run', 'baseline'])
    if (!/^[a-z0-9][a-z0-9_-]{0,50}$/.test(result[key])) throw Error(`Invalid ${key}`);
  if (result.limit !== undefined && (!Number.isInteger(result.limit) || result.limit < 1))
    throw Error('Limit must be a positive integer');
  if (result.refresh && result.offline) throw Error('Refresh and offline are mutually exclusive');
  if (!['all', 'calibration', 'held-out'].includes(result.cohort)) throw Error('Invalid cohort');
  return result;
}

/** Includes untracked source files so a working-tree capture is reproducible. */
export async function sourceHash(directory, extensions = /\.(?:ts|mjs|css)$/) {
  if (directory instanceof URL) directory = fileURLToPath(directory);
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile() && extensions.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (file) => [path.relative(directory, file), hash(await readFile(file))]),
      ),
    ),
  );
}

export function objectFile(asset) {
  if (!/^[a-f0-9]{64}$/.test(asset.sha256)) throw Error('Invalid asset hash');
  return path.join(cacheRoot, 'objects', asset.sha256);
}

export async function mapLimit(items, concurrency, work) {
  let index = 0;
  const results = new Array(items.length);
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (index < items.length) {
        const i = index++;
        results[i] = await work(items[i], i);
      }
    }),
  );
  return results;
}
