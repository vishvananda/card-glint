import manifest from '../../assets.json' with { type: 'json' };
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { atomicWrite, cacheRoot, hash, objectFile, readJson, writeJson } from './common.mjs';

const pending = new Map();
let apiQueue = Promise.resolve();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const userAgent = 'card-glint-accuracy/1.0 (https://github.com/vishvananda/card-glint)';
// Only the pinned styles/includes used by our standard-template painter.
const templateRoots = [
  'magic-future.mse-style',
  'magic-future-textless.mse-style',
  'magic-future-common.mse-include',
  'magic-mana-future.mse-symbol-font',
  'magic-new-flip.mse-style',
  'magic-m15-mainframe-battles.mse-style',
  'magic-modules.mse-include/loyalty',
].map((style) => `${manifest.MSE_TEMPLATE_ROOT}/${style}/`);

function checkUrl(url) {
  const parsed = new URL(url);
  if (
    parsed.protocol !== 'https:' ||
    parsed.username ||
    parsed.password ||
    ![
      'api.scryfall.com',
      'cards.scryfall.io',
      'svgs.scryfall.io',
      'cdn.jsdelivr.net',
      'mtgjson.com',
      'raw.githubusercontent.com',
    ].includes(parsed.hostname) ||
    (parsed.hostname === 'raw.githubusercontent.com' &&
      !parsed.href.startsWith(manifest.CONJURER_ROOT + '/') &&
      !parsed.href.startsWith(manifest.MSE_MANA_ROOT + '/') &&
      !templateRoots.some((root) => parsed.href.startsWith(root)) &&
      !parsed.href.startsWith(manifest.MSE_SPLIT_BRIDGE_ROOT + '/')) ||
    (parsed.hostname === 'svgs.scryfall.io' && !/^\/sets\/[a-z0-9]+\.svg$/.test(parsed.pathname)) ||
    (parsed.hostname === 'mtgjson.com' && !/^\/api\/v5\/[A-Z0-9]+\.json$/.test(parsed.pathname))
  )
    throw Error(`Unapproved accuracy asset host: ${url}`);
  return parsed;
}

export async function readObject(asset) {
  const bytes = await readFile(objectFile(asset));
  if (hash(bytes) !== asset.sha256 || bytes.length !== asset.bytes)
    throw Error(`Corrupt cache object: ${asset.url}`);
  return bytes;
}

export function cachedFetch(url, { offline = false, refresh = false } = {}) {
  checkUrl(url);
  const key = `${url}:${offline}:${refresh}`;
  if (!pending.has(key)) {
    const job = fetchObject(url, { offline, refresh });
    pending.set(key, job);
    job.catch(() => pending.delete(key));
  }
  return pending.get(key);
}

async function fetchObject(url, { offline, refresh }) {
  const pointer = path.join(cacheRoot, 'urls', hash(url) + '.json');
  if (!refresh) {
    let old;
    try {
      old = await readJson(pointer);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (old) {
      await readObject(old);
      return old;
    }
  }
  if (offline) throw Error(`Offline cache miss: ${url}`);
  const api = new URL(url).hostname === 'api.scryfall.com';
  for (let attempt = 0; attempt < 3; attempt++) {
    if (api) {
      apiQueue = apiQueue.then(() => pause(150));
      await apiQueue;
    }
    let response;
    try {
      response = await fetch(url, {
        headers: { 'User-Agent': userAgent, Accept: api ? 'application/json' : '*/*' },
        signal: AbortSignal.timeout(45000),
      });
    } catch (error) {
      if (attempt === 2) throw error;
      await pause(1000 * 2 ** attempt);
      continue;
    }
    if (response.status === 429 || response.status >= 500) {
      const retry = response.headers.get('retry-after');
      const delay = retry
        ? /^\d+$/.test(retry)
          ? Number(retry) * 1000
          : Date.parse(retry) - Date.now()
        : 1000 * 2 ** attempt;
      if (attempt === 2 || delay > 60000)
        throw Error(`Rate limited/unavailable (${response.status}): ${url}; retry later`);
      await response.body?.cancel();
      await pause(Math.max(1000, Number.isFinite(delay) ? delay : 1000));
      continue;
    }
    if (!response.ok) throw Error(`Asset HTTP ${response.status}: ${url}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const mime = response.headers.get('content-type')?.split(';')[0] ?? '';
    if (!bytes.length || mime.includes('text/html')) throw Error(`Invalid asset response: ${url}`);
    if (api || new URL(url).hostname === 'mtgjson.com') JSON.parse(bytes.toString('utf8'));
    const asset = {
      url,
      sha256: hash(bytes),
      bytes: bytes.length,
      mime,
      fetchedAt: new Date().toISOString(),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    };
    await atomicWrite(objectFile(asset), bytes);
    await writeJson(pointer, asset);
    return asset;
  }
  throw Error(`Download attempts exhausted: ${url}`);
}
