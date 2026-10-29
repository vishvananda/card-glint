// Full-inventory parity between reviewed study inputs and the published resolver path.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, output] = process.argv.slice(2);
assert(output, 'Use REVIEWED_INPUTS NEW_REPORT');
await fs.access(output).then(
  () => {
    throw Error('Report exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const raw = await fs.readFile(inputFile),
  input = JSON.parse(raw);
assert(['mir', 'ons'].includes(input.set));
const before = await sourceHash(path.join(root, 'games/magic/src'));
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const rows = [];
const paragraphValue = (value) =>
  JSON.parse(JSON.stringify(value, (key, v) => (key === 'italic' && v === false ? undefined : v)));
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingWording, resolvePrintingArtist, withCardWording } =
    await server.ssrLoadModule('/games/magic/src/index.ts');
  for (const e of input.entries) {
    const original = {
      typeLine: e.face.typeLine,
      rulesText: e.face.rulesText,
      flavorText: e.face.flavorText,
      rulesParagraphs: e.face.rulesParagraphs,
    };
    const oracle = { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' };
    const resolved = resolvePrintingWording(
      e.id,
      { original, oracle },
      { referenceSha256: e.reference.sha256 },
    );
    const printed = withCardWording({ ...e.face }, resolved.wordings, 'original', {
      rulesAlignment: 'original',
      symbolStyle: 'original',
    });
    const modern = withCardWording({ ...e.face }, resolved.wordings, 'oracle');
    const oracleControl = resolvePrintingWording('unreviewed-control', { original, oracle })
      .wordings.oracle;
    assert.deepEqual(
      resolved.wordings.oracle,
      oracleControl,
      e.name + ': Oracle correction leaked',
    );
    assert.equal(printed.typeLine, e.face.typeLine, e.name + ': type');
    assert.equal(printed.rulesText, e.face.rulesText, e.name + ': body');
    assert.deepEqual(
      paragraphValue(printed.rulesParagraphs),
      paragraphValue(e.face.rulesParagraphs),
      e.name + ': structured body changed',
    );
    assert.deepEqual(
      paragraphValue(printed.rulesAlignment),
      paragraphValue(e.face.rulesAlignment),
      e.name + ': alignment source changed',
    );
    assert.equal(modern.typeLine, oracleControl.typeLine, e.name + ': Oracle type changed');
    assert.equal(modern.rulesText, oracleControl.rulesText, e.name + ': Oracle body changed');
    const artist = resolvePrintingArtist(e.id, e.card.artist ?? null, {
      referenceSha256: e.reference.sha256,
    });
    assert.equal(artist.artist, e.face.artist, e.name + ': artist');
    const stale = resolvePrintingWording(
      e.id,
      { original, oracle },
      { referenceSha256: '0'.repeat(64) },
    );
    assert.equal(
      stale.provenance.status,
      'reference-mismatch',
      e.name + ': stale reference accepted',
    );
    rows.push({
      id: e.id,
      name: e.name,
      reference: e.reference.sha256,
      typeLine: printed.typeLine,
      artist: artist.artist,
      bodyHash: hash(printed.rulesText ?? ''),
      paragraphHash: hash(JSON.stringify(paragraphValue(printed.rulesParagraphs))),
      oraclePreserved: true,
      staleReferenceRejected: true,
    });
  }
} finally {
  await server.close();
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), before);
await writeJson(output, {
  schema: 1,
  status: 'public-original-source-parity',
  set: input.set,
  source: {
    inputs: hash(raw),
    renderer: before,
    tool: hash(await fs.readFile(new URL(import.meta.url))),
  },
  scope:
    'Every ordinary nonfoil printing; installed public type, rules and artist resolver output equals the frozen reviewed inputs. Oracle content remains unchanged. An incorrect reference hash must reject the reviewed correction.',
  count: rows.length,
  rows,
});
console.log(
  input.set,
  rows.length,
  'public Original resolver/artist matches; Oracle and stale-scan controls pass.',
);
