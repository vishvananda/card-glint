import assert from 'node:assert/strict';
import path from 'node:path';
import { access } from 'node:fs/promises';
import { createServer } from 'vite';
import { cacheRoot, readJson, writeJson, hash, objectFile, root } from './common.mjs';
import { readPrintingText } from './printing-text.mjs';
import { reviewedCalibrationInput } from './calibration-reviewed-input.mjs';
import { calibrationVariant } from './calibration-groups.mjs';
import { cachedScanFrame } from './scan-frame-cache.mjs';

const [command, input, output, templatesFile] = process.argv.slice(2);
if (!['init', 'normalize'].includes(command) || !input || !output)
  throw Error(
    'Usage: calibration-study.mjs init SET OUT.json | normalize IN.json OUT.json TEMPLATES.json',
  );
try {
  await access(output);
  throw Error('Output exists; retain the frozen study and choose a new name');
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
if (command === 'init') {
  assert.match(input, /^[a-z0-9]{2,8}$/);
  const snapshot = await readJson(path.join(cacheRoot, 'sets', input + '.json'));
  const printing = await readPrintingText(snapshot);
  const entries = [];
  const server = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true, hmr: false },
  });
  try {
    const api = await server.ssrLoadModule('/games/magic/src/index.ts');
    for (const entry of snapshot.entries) {
      const card = entry.card;
      const identity = card.oracle_id ?? card.name;
      const cohort =
        parseInt(hash(identity).slice(0, 8), 16) % 3 === 0 ? 'validation' : 'calibration';
      const base = {
        id: entry.id,
        card,
        reference: entry.reference,
        art: entry.art,
        group: calibrationVariant(card).key,
        cohort,
      };
      const issue = entry.issue ?? (card.nonfoil === false ? 'foil-only-reference' : null);
      if (issue) {
        entries.push({ ...base, issue });
        continue;
      }
      let prepared;
      try {
        prepared = reviewedCalibrationInput(entry, printing?.cards ?? {}, api);
      } catch (error) {
        entries.push({ ...base, issue: String(error.message) });
        continue;
      }
      entries.push({
        ...base,
        face: { ...prepared.face, colorCalibration: 'set-hsb-v1' },
        wordingEvidence: prepared.wordingEvidence,
        correctionEvidence: prepared.correctionEvidence,
        normalization: {
          accepted: false,
          referenceHash: entry.reference.sha256,
          reason: 'Frame template not reviewed',
        },
        regions: [],
      });
    }
  } finally {
    await server.close();
  }
  await writeJson(output, {
    schema: 1,
    set: input,
    validationKind: 'fresh',
    snapshotHash: hash(JSON.stringify(snapshot)),
    note: 'Draft. Review original names/types/flavor/artist/legal fields; add fixed regions and independent scan templates before capture. Change validationKind if any reserved names have already been used for fitting.',
    entries,
  });
  console.log(
    `${entries.length} draft entries; ${entries.filter((e) => e.issue).length} unavailable. Review scope and input fields before freezing.`,
  );
} else {
  assert.ok(templatesFile, 'Missing independent frame templates');
  const study = await readJson(input),
    templates = await readJson(templatesFile);
  for (const e of study.entries) {
    if (e.issue) continue;
    const template = templates[e.group];
    if (!template) {
      e.normalization = {
        accepted: false,
        referenceHash: e.reference.sha256,
        reason: 'Missing independently reviewed frame template',
      };
      continue;
    }
    const fit = await cachedScanFrame(
      objectFile(e.reference),
      e.reference.sha256,
      e.card.border_color,
      template,
      hash(JSON.stringify(template)),
    );
    e.normalization = {
      ...fit,
      referenceHash: e.reference.sha256,
      templateHash: fit.identity.templateHash,
      methodHash: fit.identity.methodHash,
    };
  }
  await writeJson(output, study);
  console.log(
    `${study.entries.filter((e) => e.normalization?.accepted).length}/${study.entries.length} accepted; keep rejected scans in the report.`,
  );
}
