// Bind completed nonfoil native studies to the exact inventory; retain foil-only queues.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { format } from 'prettier';
import { hash, sourceHash, root, cacheRoot } from './common.mjs';
import { readObject } from './cache.mjs';
import { printingScope } from './rollout-policy.mjs';
import { calibrationVariant, calibrationApplicability } from './calibration-groups.mjs';
import { CALIBRATION_TASKS, calibrationSetStatus } from './calibration-ledger.mjs';
import { checkPublication } from './modern-publication-review.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
const FILE = 'games/magic/fixtures/accuracy/mirage-onslaught/complete-census.json.gz';
export async function applyMirageOnslaughtCensus(ledger, { onlyCurrent = false } = {}) {
  const bytes = await fs.readFile(path.join(root, FILE)),
    evidence = JSON.parse(gunzipSync(bytes));
  const actualRenderer = await sourceHash(path.join(root, 'games/magic/src'));
  if (onlyCurrent && evidence.rendererHash !== actualRenderer) return ledger;
  assert.equal(evidence.rendererHash, actualRenderer);
  assert.equal(evidence.status, 'complete-installed-original-census-publication-pending');
  const epoch = evidence.rendererHash,
    methodHash = hash(await fs.readFile(new URL(import.meta.url)));
  const now = new Date().toISOString();
  const publicationFile = 'games/magic/fixtures/accuracy/mirage-onslaught/publication-075.json';
  let publication, publicationBytes;
  try {
    publicationBytes = await fs.readFile(path.join(root, publicationFile));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  if (publicationBytes) {
    publication = JSON.parse(publicationBytes);
    assert.equal(publication.status, 'published-renderer-and-native-census');
    assert.equal(publication.published.version, '0.7.5');
    assert.equal(publication.rendererHash, epoch);
    assert.equal(publication.censusHash, hash(bytes));
    assert.equal(publication.checksumsVerified, true);
    assert.equal(
      hash(await fs.readFile(path.join(root, publication.toolFile))),
      publication.toolHash,
    );
    checkPublication(publication.release, publication.workflow, publication.published);
  }
  const sharedGuards = {};
  for (const f of [
    FILE,
    'games/magic/fixtures/accuracy/mirage-onslaught/footer-review.json.gz',
    'games/magic/assets.json',
    'games/magic/set-symbol-inventory.json',
    'games/magic/symbol-svg-patches.json',
    'games/magic/tools/accuracy/calibration-mirage-onslaught.mjs',
    'games/magic/tools/accuracy/old-frame-publication-review.mjs',
    'games/magic/tools/accuracy/modern-publication-review.mjs',
    'packages/browser/src/canvas-raster.ts',
    ...[
      'geometry-source-review',
      'typography-color-study',
      'component-proposals-native',
      'component-fit-study',
      'body-size-policy-review',
      'low-tone-native-pilot',
      'latest-native-candidates',
    ].map((name) => 'games/magic/fixtures/accuracy/mirage-onslaught/' + name + '.json'),
    ...['mir', 'ons'].flatMap((set) =>
      ['type-printing-review', 'artist-printing-review', 'source-gap-review'].map(
        (name) => 'games/magic/fixtures/accuracy/' + set + '/' + name + '.json',
      ),
    ),
  ])
    sharedGuards[f] = hash(await fs.readFile(path.join(root, f)));
  for (const code of ['mir', 'ons']) {
    const study = evidence.sets[code],
      set = ledger.sets.find((s) => s.set === code);
    assert(set);
    const source = await fs.readFile(
      path.join(root, 'games/magic/src/calibration/sets/' + code + '.ts'),
      'utf8',
    );
    const { profile } = parseProfileData(source);
    assert.equal(study.native.source.rendererHash, epoch);
    assert.equal(study.scores.summary.measured, study.members.length);
    assert.equal(study.poses.summary.rejected, 0);
    const snapshot = JSON.parse(
      await fs.readFile(path.join(cacheRoot, 'rollout/sets/' + code + '.json')),
    );
    assert.equal(snapshot.sourceIdentity, set.inventory.sourceIdentity);
    const cards = (
      await Promise.all(snapshot.pages.map(async (p) => JSON.parse(await readObject(p)).data))
    )
      .flat()
      .filter((c) => printingScope(c).status === 'ordinary');
    assert.equal(cards.length, set.inventory.ordinaryPrintings);
    const byGroup = new Map();
    for (const c of cards) {
      const variant = calibrationVariant(c);
      if (!byGroup.has(variant.key)) byGroup.set(variant.key, { variant, cards: [] });
      byGroup.get(variant.key).cards.push(c);
    }
    const groups = [];
    for (const { variant, cards: members } of byGroup.values()) {
      const ids = members.map((c) => c.id).sort(),
        old = set.groups.find((g) => g.key === variant.key);
      assert(old);
      assert.equal(old.printings, members.length);
      assert.equal(
        old.scopeHash ?? old.membershipHash,
        hash(JSON.stringify(ids)),
        'Inventory membership changed',
      );
      const { applicable, reasons } = calibrationApplicability(members);
      const rows = study.members.filter((r) => ids.includes(r.id));
      const g = {
        ...old,
        ...variant,
        printingIds: ids,
        scopeHash: hash(JSON.stringify(ids)),
        applicable,
        references: {
          nonfoil: members.filter((c) => c.nonfoil).length,
          foilOnly: members.filter((c) => !c.nonfoil).length,
          highResolutionMetadata: members.filter(
            (c) => c.highres_image && c.image_status === 'highres_scan',
          ).length,
        },
        tasks: {},
        sourceHash: hash(JSON.stringify({ profile, variant })),
        sourceHashes: {},
      };
      if (rows.length !== members.length) {
        assert.equal(rows.length, 0);
        assert.equal(g.references.nonfoil, 0, 'Uncovered nonfoil printing');
        for (const task of Object.keys(CALIBRATION_TASKS))
          g.tasks[task] =
            applicable[task] === false
              ? { status: 'not-applicable', reason: reasons[task] }
              : {
                  status: 'needs-reference',
                  reason:
                    'Foil-only alternate printing is outside this nonfoil calibration. Keep it in the follow-up queue; foil scans must not set base pigment values.',
                  printingIds: ids,
                };
        groups.push(g);
        continue;
      }
      assert.equal(g.references.foilOnly, 0);
      const names = [...new Set(rows.map((r) => r.name))].sort();
      g.sourceCensus = {
        heldOut: false,
        scope: 'all-ordinary-printings-in-variant',
        names,
        parametersHash: hash(JSON.stringify(profile)),
        parameterScope:
          'One set profile and shared renderer policies. Every member uses its own frozen source-only scan pose; no per-card render adjustments.',
        members: rows.map((r) => ({
          id: r.id,
          name: r.name,
          referenceHash: r.reference.sha256,
          poseHash: r.poseHash,
          inputHash: r.inputHash,
          nativeFaceHash: r.nativeFaceHash,
        })),
      };
      const specs = {
        references: rows.map((r) => ({
          id: r.id,
          reference: r.reference.sha256,
          wording: r.wordingEvidence,
        })),
        normalization: rows.map((r) => ({
          id: r.id,
          reference: r.reference.sha256,
          pose: r.poseHash,
        })),
        frameGeometry: profile.frames,
        frameColor: profile.colors,
        paperColor: profile.colors,
        blackLevels: profile.colors,
        manaGeometry: profile.mana,
        manaColor: profile.mana,
        setSymbol: profile.setSymbols,
        headings: { title: profile.title, type: profile.type },
        rules: profile.rulesPlacement,
        flavor: profile.rulesPlacement,
        artist: profile.footer.artist,
        footer: profile.footer.legal,
        stats: profile.footer.stats,
        specialComponents: { basic: profile.basicSymbol, frames: profile.frames },
        fullCard: profile,
        release: profile,
      };
      for (const task of Object.keys(CALIBRATION_TASKS)) {
        g.sourceHashes[task] = hash(JSON.stringify({ task, values: specs[task] ?? null }));
        if (applicable[task] === false) {
          g.tasks[task] = { status: 'not-applicable', reason: reasons[task] };
          continue;
        }
        if (task === 'release' && publication) {
          g.tasks[task] = {
            status: 'validated',
            reviewedAt: publication.reviewedAt,
            reason:
              'Published 0.7.5 artifacts and complete release CI match this full nonfoil native/scoring census. The foil-only alternate remains a separate follow-up.',
            evidence: [publicationFile, FILE],
            guards: {
              ...sharedGuards,
              [publicationFile]: hash(publicationBytes),
              [publication.toolFile]: publication.toolHash,
            },
            runtimeGuards: { 'games/magic/src': epoch },
            proof: {
              sourceHash: g.sourceHashes[task],
              scopeHash: g.scopeHash,
              gatesPassed: true,
              rendererHash: epoch,
              methodHash: publication.toolHash,
              nativeReplayHash: hash(JSON.stringify(study.native)),
              metricsHash: hash(JSON.stringify(study.scores)),
              coveredPrintings: g.printings,
              version: publication.published.version,
              publishedCommit: publication.published.sourceCommit,
              checksPassed: true,
              oldFrameAdoption: epoch,
            },
          };
          continue;
        }
        if (task === 'release') {
          g.tasks[task] = {
            status: 'in-progress',
            reason:
              'The complete nonfoil native/scoring census is installed; publication and matching deployed score revision are pending.',
            evidence: [FILE],
          };
          continue;
        }
        g.tasks[task] = {
          status: 'validated',
          reviewedAt:
            old.tasks?.references?.proof?.nativeReplayHash === hash(JSON.stringify(study.native))
              ? old.tasks.references.reviewedAt
              : now,
          reason:
            'Shared set values reviewed with complete Original native and scan coverage. Reused development data; regional residuals and the lowest-scoring cards remain visible for follow-up.',
          evidence: [
            FILE,
            ...(task === 'footer'
              ? ['games/magic/fixtures/accuracy/mirage-onslaught/footer-review.json.gz']
              : []),
            'games/magic/fixtures/accuracy/mirage-onslaught/latest-native-candidates.json',
            'games/magic/fixtures/accuracy/mirage-onslaught/body-size-policy-review.json',
          ],
          guards: sharedGuards,
          runtimeGuards: { 'games/magic/src': epoch },
          proof: {
            sourceHash: g.sourceHashes[task],
            scopeHash: g.scopeHash,
            gatesPassed: true,
            rendererHash: epoch,
            methodHash,
            nativeReplayHash: hash(JSON.stringify(study.native)),
            metricsHash: hash(JSON.stringify(study.scores)),
            coveredPrintings: g.printings,
            validationKind: 'source-census',
            calibrationNames: names.length,
            validationNames: names.length,
            scanTemplateHash: hash(
              JSON.stringify({
                parent: study.parentPoses.templates,
                recovered: study.poses.templates,
              }),
            ),
            oldFrameAdoption: epoch,
          },
        };
      }
      for (const task of ['rules', 'headings', 'artist']) {
        const field = task === 'rules' ? 'rules' : task === 'headings' ? 'type' : 'artist';
        const count = {};
        for (const r of rows) {
          const key =
            field === 'artist' ? 'scan-reviewed-field' : r.wordingEvidence[field + 'Source'];
          assert(key && key !== 'oracle');
          count[key] = (count[key] ?? 0) + 1;
        }
        g.tasks[task].originalInput = {
          status: 'ready',
          field,
          coveredPrintings: g.printings,
          sources: count,
          evidence: [FILE],
          guards: sharedGuards,
          runtimeGuards: { 'games/magic/src': epoch },
          proof: { oldFrameAdoption: epoch },
          reason:
            'Frozen Original inputs agree with the public resolver. Reviewed type/artist corrections and explicit body-source repairs are included; Oracle remains unchanged.',
        };
      }
      groups.push(g);
    }
    assert.equal(
      groups.reduce((n, g) => n + g.printings, 0),
      set.inventory.ordinaryPrintings,
    );
    set.groups = groups;
    set.inventory.review = {
      ...set.inventory.review,
      nonfoilCensus: {
        file: FILE,
        sha256: hash(bytes),
        printings: study.members.length,
        scored: study.scores.summary.measured,
        structuralMean100: study.scores.summary.structuralMean100,
        pendingFoilOnlyPrintings: cards
          .filter((c) => !c.nonfoil)
          .map((c) => ({ id: c.id, name: c.name, collectorNumber: c.collector_number })),
      },
    };
    const status = calibrationSetStatus(set);
    assert(
      status.outstanding.every(
        (r) =>
          r.task === 'release' || groups.find((g) => g.key === r.group).references.foilOnly > 0,
      ),
    );
    console.log(
      code,
      study.members.length,
      'nonfoil printings;',
      groups.length,
      'variants;',
      status.outstanding.length,
      'publication/foil-only tasks remain',
    );
  }
  return ledger;
}
if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const file = path.join(root, 'games/magic/fixtures/accuracy/calibration-progress.json');
  const ledger = await applyMirageOnslaughtCensus(JSON.parse(await fs.readFile(file)));
  await fs.writeFile(
    file,
    await format(JSON.stringify(ledger), { parser: 'json', printWidth: 100 }),
  );
}
