import { readFile } from 'node:fs/promises';
import { outputRoot, fixtureRoot, hash, writeJson } from './common.mjs';

const label = process.argv[2];
if (!label) throw Error('Supply the final immutable Prepared capture label.');
const bytes = await readFile(`${outputRoot}/${label}/audit.json`);
const audit = JSON.parse(bytes);
if (audit.results.some((r) => r.layout !== 'prepare' || r.frame !== 'prepare'))
  throw Error('Receipt requires a native Prepared audit.');
const accepted = audit.results.filter((r) => r.registration.accepted);
const parts = ['permanent', 'spell', 'spellHeader'];
const means = Object.fromEntries(
  parts.map((part) => [
    part,
    Object.fromEntries(
      ['before', 'after'].map((stage) => [
        stage,
        accepted.reduce((sum, r) => sum + r.scores[part][stage].edgeF1[1], 0) / accepted.length,
      ]),
    ),
  ]),
);
await writeJson(`${fixtureRoot}/prepare-native.json`, {
  schemaVersion: 1,
  createdAt: audit.createdAt,
  sourceCommit: audit.sourceCommit,
  rendererHash: audit.rendererHash,
  studyHash: audit.studyHash,
  fontHash: audit.fontHash,
  baselineLabel: audit.baselineLabel,
  baselineHash: audit.baselineHash,
  auditLabel: label,
  auditHash: hash(bytes),
  scope:
    '36 ordinary English nonfoil-eligible SOS printings. All 72 original text/type panels verified against exact full-scan hashes. Full-cohort typography refinement makes this development coverage, not held-out validation.',
  metric:
    'Local-contrast edge F1 at one canonical pixel; light polarity for inset headers. No whole-card accuracy claim.',
  cohort: audit.results.length,
  accepted: accepted.length,
  means,
  regressions: accepted.flatMap((r) =>
    parts
      .filter((part) => r.scores[part].after.edgeF1[1] < r.scores[part].before.edgeF1[1])
      .map((part) => ({
        id: r.id,
        name: r.name,
        part,
        before: r.scores[part].before.edgeF1[1],
        after: r.scores[part].after.edgeF1[1],
      })),
  ),
  overflows: audit.results
    .filter((r) => Object.values(r.rules).some((p) => p.overflow))
    .map((r) => r.id),
  sources: audit.sources,
  results: audit.results.map((r) => ({
    id: r.id,
    name: r.name,
    set: r.set,
    number: r.face.collectorNumber,
    source: r.source,
    referenceSha256: r.reference.sha256,
    artSha256: r.art.sha256,
    wordingHash: r.wordingHash,
    renderHash: r.renderHash,
    frame: r.frame,
    registration: {
      method: r.registration.method,
      accepted: r.registration.accepted,
      reason: r.registration.reason,
      model: r.registration.model ?? null,
      parameters: r.registration.parameters ?? null,
      transform: r.registration.transform ?? null,
      validation: r.registration.validation ?? null,
      templateHash: r.registration.templateHash,
    },
    rules: Object.fromEntries(
      Object.entries(r.rules).map(([k, p]) => [
        k,
        { size: p.size, lines: p.lines.length, overflow: p.overflow },
      ]),
    ),
    scores: r.scores
      ? Object.fromEntries(
          parts.map((k) => [
            k,
            { before: r.scores[k].before.edgeF1[1], after: r.scores[k].after.edgeF1[1] },
          ]),
        )
      : null,
  })),
});
console.log({ cohort: audit.results.length, accepted: accepted.length, means });
