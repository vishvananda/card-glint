import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { cacheRoot, fixtureRoot, hash, readJson, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { printingScope, summarizeSet } from './rollout-policy.mjs';
import { calibrationVariant, calibrationApplicability } from './calibration-groups.mjs';
import { CALIBRATION_TASKS, calibrationSetStatus } from './calibration-ledger.mjs';
import {
  applyM21Evidence,
  applyM21MonoEvidence,
  applyM21PigmentAudit,
} from './calibration-m21-evidence.mjs';

const inventory = await readJson(fixtureRoot + '/rollout-inventory.json');
const active = new Set(['lea', 'leb', '2ed', '3ed', '8ed', 'm21', 'arn', 'atq', 'drk', 'leg']);
const file = fixtureRoot + '/calibration-progress.json';
let previous;
try {
  previous = await readJson(file);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const early = await readJson(fixtureRoot + '/early-expansion-colors.json');
const earlyFrames = await readJson(fixtureRoot + '/early-expansion-calibration.json');
const earlyScores = await readJson(fixtureRoot + '/early-expansion-full-scores.json');
const historical = await readJson(fixtureRoot + '/five-set-hsb-adoption.json');
const colorGaps = await readJson(fixtureRoot + '/showcased-color-gap-review.json');
const m21Color = await readJson(fixtureRoot + '/m21-normal-color-adoption.json');
const m21Boundaries = await readJson(fixtureRoot + '/m21-normal-boundaries.json');
const m21MonoBoundaries = await readJson(fixtureRoot + '/m21-mono-boundaries.json');
const m21ExistingPigment = await readJson(fixtureRoot + '/m21-existing-pigment-audit.json');
const m21GuardsMatch = (
  await Promise.all(
    Object.entries(m21Color.sourceGuards).map(
      async ([file, expected]) =>
        hash(await readFile('games/magic/src/presentation/' + file)) === expected,
    ),
  )
).every(Boolean);
const m21MonoGuardsMatch = (
  await Promise.all(
    Object.entries(m21MonoBoundaries.sourceGuards).map(
      async ([file, expected]) =>
        hash(await readFile('games/magic/src/presentation/' + file)) === expected,
    ),
  )
).every(Boolean);
const evidence = 'games/magic/fixtures/accuracy/early-expansion-colors.json';
const earlyGuards = Object.fromEntries(
  await Promise.all(
    Object.entries(early.sourceGuards).map(async ([f, h]) => [
      f,
      hash(await readFile('games/magic/src/presentation/' + f)) === h,
    ]),
  ),
);
const sets = [];
try {
  const { printingColorSource } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-color-source.ts',
  );
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { earlyExpansionFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-frame.ts',
  );
  const { calibratedFrameMaterials, hasCalibratedFramePigment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  for (const set of inventory.sets.filter((s) => s.status === 'major')) {
    const snapshot = await readJson(`${cacheRoot}/rollout/sets/${set.set}.json`);
    assert.equal(snapshot.sourceIdentity, set.sourceIdentity, 'Catalog changed: ' + set.set);
    const cards = [];
    for (const page of snapshot.pages) cards.push(...JSON.parse(await readObject(page)).data);
    assert.equal(new Set(cards.map((c) => c.id)).size, cards.length);
    const summary = summarizeSet(cards);
    assert.equal(summary.ordinaryPrintings, set.ordinaryPrintings);
    const byGroup = new Map();
    for (const card of cards.filter((c) => printingScope(c).status === 'ordinary')) {
      const variant = calibrationVariant(card);
      if (!byGroup.has(variant.key)) byGroup.set(variant.key, { variant, cards: [] });
      byGroup.get(variant.key).cards.push(card);
    }
    const groups = [];
    for (const { variant, cards: members } of byGroup.values()) {
      const { applicable, reasons } = calibrationApplicability(members);
      const g = {
        ...variant,
        printings: members.length,
        printingIds: members.map((c) => c.id).sort(),
        rarities: Object.fromEntries(
          [...new Set(members.map((c) => c.rarity))]
            .sort()
            .map((r) => [r, members.filter((c) => c.rarity === r).length]),
        ),
        references: {
          nonfoil: members.filter((c) => c.nonfoil).length,
          foilOnly: members.filter((c) => !c.nonfoil).length,
          highResolutionMetadata: members.filter(
            (c) => c.highres_image && c.image_status === 'highres_scan',
          ).length,
        },
        applicable,
        tasks: {},
      };
      g.scopeHash = hash(JSON.stringify(g.printingIds));
      for (const [task, applies] of Object.entries(applicable))
        if (!applies) g.tasks[task] = { status: 'not-applicable', reason: reasons[task] };
      if (active.has(set.set)) {
        const card = members[0];
        const face = {
          name: card.name,
          setCode: card.set,
          typeLine: card.type_line,
          colors: card.colors,
          ...(variant.kind.includes('land')
            ? { frameColors: variant.palette === 'C' ? [] : [...variant.palette] }
            : {}),
          frameStyle: ['1993', '1997'].includes(card.frame) ? 'retro' : 'modern',
          ...(card.frame === '2003' ? { frameAssetFamily: 'eighth' } : {}),
          borderColor: card.border_color,
          layout: card.layout,
          rarity: card.rarity,
          securityStamp: card.security_stamp ?? 'none',
          manaSymbols: [],
          rulesText: '',
          colorCalibration: 'set-hsb-v1',
        };
        const source = printingColorSource(face),
          geometry = earlyExpansionFrame(face);
        g.sourceHash = hash(
          JSON.stringify({
            assets: [...canvasAssetUrls(face)].sort(),
            source: source?.source ?? null,
            geometry: geometry ?? null,
            variant,
          }),
        );
        g.sourceKey = source?.key ?? null;
        const materials = calibratedFrameMaterials(face);
        const hasLegacyPigment = hasCalibratedFramePigment(face);
        g.sourceHashes = {
          frameColor: hash(g.sourceHash + JSON.stringify(materials)),
          paperColor: hash(g.sourceHash + JSON.stringify(materials)),
        };
        for (const task of Object.keys(CALIBRATION_TASKS))
          if (!g.tasks[task])
            g.tasks[task] = {
              status: 'needs-audit',
              reason: 'Existing work must be matched to this complete variant and current source.',
            };
        const earlyRows = earlyFrames.rows.filter((r) => g.printingIds.includes(r.id));
        if (earlyRows.length) {
          const accepted = earlyRows.filter((r) => r.normalization === 'interior-normalized');
          g.tasks.normalization = {
            status: accepted.length === g.printings ? 'needs-audit' : 'partial',
            reason: `${accepted.length}/${g.printings} frozen interior poses; audit the receipt against current completion requirements. Investigate remaining boundary anchors without relabeling scans as bad.`,
            evidence: ['games/magic/fixtures/accuracy/early-expansion-calibration.json'],
            rejectedPrintings: earlyRows
              .filter((r) => r.normalization !== 'interior-normalized')
              .map((r) => ({ id: r.id, name: r.name, status: r.normalization })),
          };
          g.tasks.references = {
            status: 'partial',
            evidence: ['games/magic/fixtures/accuracy/early-expansion-calibration.json'],
            reason:
              'Scan/art bytes and printing text are cached; original type-line verification and any missing original rules remain open.',
            wording: Object.fromEntries(
              ['rules', 'type'].map((field) => [
                field,
                Object.fromEntries(
                  [...new Set(earlyRows.map((r) => r.wording[field]))].map((status) => [
                    status,
                    earlyRows.filter((r) => r.wording[field] === status).length,
                  ]),
                ),
              ]),
            ),
          };
          g.tasks.frameGeometry = {
            status: geometry ? 'partial' : 'pending',
            evidence: ['games/magic/fixtures/accuracy/early-expansion-calibration.json'],
            reason: geometry
              ? 'Shared replacement source and aperture adopted; boundary diagnostics pass. Complete frame/corner and variant certification remains open.'
              : 'No replacement source/geometry has been adopted for this material.',
          };
          const scored = earlyScores.rows.filter((r) => g.printingIds.includes(r.id) && r.after);
          g.tasks.fullCard = {
            status: 'partial',
            evidence: ['games/magic/fixtures/accuracy/early-expansion-full-scores.json'],
            reason: `${scored.length}/${g.printings} fixed-region before/after diagnostics. Unverified type lines and fallback rules are excluded; remaining wording, normalization and outlier review prevent full-card certification.`,
            coveredPrintings: scored.length,
          };
        }
        const old = source && historical.results.find((r) => r.key === source.key);
        for (const [task, component] of [
          ['frameColor', 'frame'],
          ['paperColor', 'paper'],
        ]) {
          g.tasks[task] = {
            status: old
              ? old.accepted?.[component]
                ? 'needs-audit'
                : 'rejected'
              : hasLegacyPigment
                ? 'needs-audit'
                : 'pending',
            reason: old
              ? old.accepted?.[component]
                ? 'Historical fit needs current native replay across this variant.'
                : 'Historical proposal rejected; no validated-default claim.'
              : hasLegacyPigment
                ? 'Current renderer has pigment adjustments; component evidence and coverage need audit.'
                : 'No source-bound fit recorded for this variant.',
            ...(old
              ? {
                  evidence: ['games/magic/fixtures/accuracy/five-set-hsb-adoption.json'],
                  historicalKey: source.key,
                }
              : {}),
          };
        }
        if (geometry) {
          const key = `${set.set}/${geometry.material}`,
            eg = early.groups[key];
          assert.ok(eg);
          assert.equal(eg.profile.source, JSON.stringify([geometry.asset, geometry.frame]));
          const covered = early.native.rows.filter((r) => g.printingIds.includes(r.id));
          for (const [task, component] of [
            ['frameColor', 'frame'],
            ['paperColor', 'paper'],
          ]) {
            const c = eg.components[component];
            const valid =
              c.selected &&
              c.passes &&
              covered.length === g.printings &&
              Object.values(earlyGuards).every(Boolean);
            g.tasks[task] = {
              status: valid ? 'validated' : c.selected ? 'stale' : 'rejected',
              evidence: [evidence],
              reason: valid
                ? 'Native shared-material fit; all variant printings replayed. Reserved names are reused development validation.'
                : c.selected
                  ? 'Evidence coverage or source guards changed.'
                  : 'Candidate failed frozen color/texture gates; raw pigment retained.',
              historicalKey: key,
              ...(valid
                ? {
                    guards: Object.fromEntries(
                      Object.entries(early.sourceGuards).map(([f, h]) => [
                        'games/magic/src/presentation/' + f,
                        h,
                      ]),
                    ),
                    proof: {
                      sourceHash: g.sourceHashes[task],
                      scopeHash: g.scopeHash,
                      gatesPassed: true,
                      rendererHash: hash(JSON.stringify(early.sourceGuards)),
                      methodHash:
                        early.tools['early-expansion-color-metrics.mjs'] ??
                        hash(JSON.stringify(early.tools)),
                      nativeReplayHash: early.artifacts['color-replay.json'],
                      metricsHash: early.artifacts['color-metrics.json'],
                      scanTemplateHash: early.artifacts['scans/manifest.json'],
                      coveredPrintings: covered.length,
                      calibrationNames: c.summary.calibration.names,
                      validationNames: c.summary.validation.names,
                      validationKind: 'reused-development',
                      choice: 'fitted',
                    },
                    metrics: c.summary.validation,
                  }
                : {}),
            };
          }
          g.tasks.blackLevels = {
            status: 'partial',
            evidence: [evidence],
            reason:
              'Outer stock measured separately; replacement source has no interior ink-floor fit.',
          };
        }
        if (g.references.foilOnly) {
          for (const task of ['references', 'frameColor', 'paperColor', 'blackLevels'])
            g.tasks[task] = {
              status: 'needs-reference',
              reason:
                'Foil-only printings remain in coverage. Do not fit a nonfoil pigment curve to a foil scan.',
            };
        }
        const gap = source && colorGaps.groups[source.key];
        if (gap && !g.references.foilOnly) {
          g.tasks.frameColor = {
            status:
              gap.source.source !== source.source
                ? 'stale'
                : gap.status === 'awaiting-full-replay'
                  ? 'in-progress'
                  : 'rejected',
            reason: gap.next,
            evidence: ['games/magic/fixtures/accuracy/showcased-color-gap-review.json'],
            historicalKey: source.key,
            componentMeasurements: gap.summary.validation,
          };
        } else if (set.set === 'm21' && source?.family === 'components') {
          g.tasks.frameColor = {
            status: 'needs-audit',
            reason:
              'Historical side windows overlap the art keyline; remeasure pigment and texture in clear frame rails.',
            evidence: ['games/magic/fixtures/accuracy/showcased-color-gap-review.json'],
          };
        }
        const failedPoses = Object.values(colorGaps.groups)
          .flatMap((r) => r.expandedQuietRailCheck?.rejected ?? [])
          .filter((r) => g.printingIds.includes(r.id));
        if (failedPoses.length)
          g.tasks.normalization = {
            status: 'partial',
            reason:
              'Expanded color check retains these normalization failures. Investigate frame anchors before certifying their component scores.',
            evidence: ['games/magic/fixtures/accuracy/showcased-color-gap-review.json'],
            rejectedPrintings: failedPoses,
          };
        if (set.set === 'm21') {
          applyM21Evidence(g, source, m21Color, m21Boundaries, m21GuardsMatch);
          applyM21MonoEvidence(
            g,
            m21MonoBoundaries,
            m21Color.native.rendererHash,
            m21MonoGuardsMatch,
          );
          applyM21PigmentAudit(g, m21ExistingPigment);
        }
        g.tasks.release = {
          status: 'pending',
          reason: 'No complete-set certification and matching published score revision.',
        };
      }
      // Preserve deliberate later reviews. Source changes make approved work
      // stale via calibrationTaskStatus, rather than silently overwriting it.
      const saved = previous?.sets
        .find((s) => s.set === set.set)
        ?.groups.find((v) => v.key === g.key);
      for (const [task, item] of Object.entries(saved?.tasks ?? {}))
        if (item.reviewedAt) g.tasks[task] = item;
      // Queued sets keep exact variant denominators without duplicating every
      // printing UUID and applicability explanation from the frozen catalog.
      groups.push(
        active.has(set.set)
          ? g
          : {
              key: g.key,
              printings: g.printings,
              membershipHash: hash(JSON.stringify(g.printingIds)),
              rarities: g.rarities,
              references: g.references,
            },
      );
    }
    groups.sort((a, b) => a.key.localeCompare(b.key));
    const result = {
      set: set.set,
      name: set.name,
      releasedAt: set.releasedAt,
      waves: [...new Set(set.groups.map((g) => g.wave))].sort(),
      priority: active.has(set.set) ? 'active' : 'queued',
      inventory: {
        status: 'verified',
        sourceIdentity: set.sourceIdentity,
        ordinaryPrintings: summary.ordinaryPrintings,
        distinctOrdinary: summary.distinctOrdinary,
        classificationReview: summary.classificationReview,
        excluded: summary.excluded,
        review: summary.review,
      },
      groups,
    };
    calibrationSetStatus(result);
    sets.push(result);
  }
} finally {
  await server.close();
}
await writeJson(file, {
  schemaVersion: 1,
  asOf: inventory.asOf,
  policy:
    'Major ordinary English paper sets, at least 50 distinct cards. No set is complete from a profile count. Missing tasks are pending. Foil-only and classification-review printings stay visible. Grouped by frame, color, layout, card kind, legendary treatment and stamp; rarity coverage is explicit within each group.',
  inventoryHash: hash(await readFile(fixtureRoot + '/rollout-inventory.json')),
  tasks: CALIBRATION_TASKS,
  sets,
});
console.log(
  `Inventoried ${sets.length} sets / ${sets.reduce((n, s) => n + s.groups.length, 0)} variants. ${sets.filter((s) => calibrationSetStatus(s).complete).length} complete.`,
);
