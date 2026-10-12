import path from 'node:path';
import { cachedFetch, readObject } from './cache.mjs';
import { cacheRoot, options, readJson, writeJson } from './common.mjs';
import { printingTextIndex } from './printing-text.mjs';

const opts = options();
const snapshot = await readJson(path.join(cacheRoot, 'sets', `${opts.set}.json`));
const source = await cachedFetch(`https://mtgjson.com/api/v5/${opts.set.toUpperCase()}.json`, opts);
const data = JSON.parse((await readObject(source)).toString('utf8'));
const indexed = printingTextIndex(snapshot, data.data);
const manifest = {
  schemaVersion: 1,
  set: opts.set,
  snapshotIdentity: snapshot.identity,
  source,
  metadata: data.meta,
  coverage: { total: snapshot.entries.length, originalText: Object.keys(indexed.cards).length },
  missing: indexed.missing,
  note: 'MTGJSON originalText matched by Scryfall printing UUID and checked against set, collector number and name. Wording source, not scan certification. OriginalType is retained for audit, never applied automatically.',
};
await writeJson(path.join(cacheRoot, 'printing-text', `${opts.set}.json`), manifest);
console.log(JSON.stringify(manifest.coverage));
