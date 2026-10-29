import { applyMirageOnslaughtCensus } from './calibration-mirage-onslaught.mjs';
import { m21ManaEvidence, applyM21Mana } from './calibration-m21-mana.mjs';
import { m21PublicationEvidence, applyM21Publication } from './calibration-m21-publication.mjs';
import {
  m21NormalizationEvidence,
  applyM21Normalization,
} from './calibration-m21-normalization.mjs';
import {
  unlimitedCalibrationEvidence,
  applyUnlimitedEvidence,
} from './calibration-unlimited-current.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { cacheRoot, fixtureRoot, hash, readJson, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { printingScope, summarizeSet } from './rollout-policy.mjs';
import { calibrationVariant, calibrationApplicability } from './calibration-groups.mjs';
import { CALIBRATION_TASKS, calibrationSetStatus } from './calibration-ledger.mjs';
import { preserveCalibrationReviews } from './calibration-reviews.mjs';
import { calibrationReport } from './calibration-report.mjs';
import {
  applyM21Evidence,
  applyM21MonoEvidence,
  applyM21PigmentAudit,
} from './calibration-m21-evidence.mjs';
import {
  applyM21BoundaryRefinement,
  applyM21StockTransfer,
  applyM21WhiteDefault,
  applyM21OriginalWording,
  applyM21RedColor,
} from './calibration-m21-scope.mjs';
import { applyEarlyOriginalWording } from './calibration-original-wording.mjs';

const inventory = await readJson(fixtureRoot + '/rollout-inventory.json');
const [selectedSet, ...extra] = process.argv.slice(2);
assert(extra.length === 0 && (!selectedSet || /^[a-z0-9]{2,10}$/.test(selectedSet)), 'Use [set]');
assert(
  !selectedSet || inventory.sets.some((s) => s.set === selectedSet && s.status === 'major'),
  'Unknown major set',
);
const active = new Set([
  'lea',
  'leb',
  '2ed',
  '3ed',
  '8ed',
  'm21',
  'arn',
  'atq',
  'drk',
  'leg',
  'mir',
  'ons',
]);
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
const earlyWording = await readJson(fixtureRoot + '/early-expansion-corrected-inputs.json');
const historical = await readJson(fixtureRoot + '/five-set-hsb-adoption.json');
const colorGaps = await readJson(fixtureRoot + '/showcased-color-gap-review.json');
const m21Color = await readJson(fixtureRoot + '/m21-normal-color-adoption.json');
const m21Boundaries = await readJson(fixtureRoot + '/m21-normal-boundaries.json');
const m21MonoBoundaries = await readJson(fixtureRoot + '/m21-mono-boundaries.json');
const m21ExistingPigment = await readJson(fixtureRoot + '/m21-existing-pigment-audit.json');
const m21Refined = await readJson(fixtureRoot + '/m21-component-boundaries-v2.json');
const m21Stock = await readJson(fixtureRoot + '/modern-land-stock-transfer.json');
const m21White = await readJson(fixtureRoot + '/m21-white-default.json');
const m21Wording = await readJson(fixtureRoot + '/m21-original-input-compatibility.json');
const m21Red = await readJson(fixtureRoot + '/m21-red-color-adoption.json');
const matchGuards = async (receipt) =>
  (
    await Promise.all(
      [
        ...Object.entries(receipt.sourceGuards).map(([f, h]) => [
          'games/magic/src/presentation/' + f,
          h,
        ]),
        ...Object.entries(receipt.methodGuards ?? {}),
      ].map(async ([f, h]) => hash(await readFile(f)) === h),
    )
  ).every(Boolean);
const m21RefinedGuardsMatch = await matchGuards(m21Refined);
const m21StockGuardsMatch = await matchGuards(m21Stock);
const m21WhiteGuardsMatch = await matchGuards(m21White);
// Exact content-helper extensions belong to every printing covered by the
// reviewed wording receipt, independently of material-group membership.
const wordingSet = previous?.sets.find((set) => set.set === 'm21');
const reviewedIds = new Set(m21Wording.rows.map((row) => row.id));
const wordingGroups = (wordingSet?.groups ?? []).filter(
  (group) =>
    group.tasks.rules?.originalInput?.status === 'ready' &&
    group.printingIds.every((id) => reviewedIds.has(id)),
);
let inventoryM21Wording = m21Wording;
let m21WordingGuardsMatch = await matchGuards(m21Wording);
if (!m21WordingGuardsMatch && wordingGroups.length) {
  const shared = wordingGroups[0].tasks.rules.originalInput;
  // Never choose among disagreeing dependency reviews implicitly.
  const identities = new Set(
    wordingGroups.map((group) => hash(JSON.stringify(group.tasks.rules.originalInput.guards))),
  );
  if (identities.size === 1) {
    const probe = structuredClone(wordingGroups[0]);
    probe.tasks = { rules: { status: 'needs-audit', originalInput: structuredClone(shared) } };
    const [report] = await calibrationReport({ sets: [{ ...wordingSet, groups: [probe] }] });
    m21WordingGuardsMatch = report.originalRulesInputs.ready === probe.printings;
    if (m21WordingGuardsMatch)
      inventoryM21Wording = {
        ...m21Wording,
        methodGuards: shared.guards,
        guardExtensions: shared.guardExtensions,
      };
  }
}
const m21RedGuardsMatch = await matchGuards(m21Red);
const earlyWordingGuardsMatch = await matchGuards(earlyWording);
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
const unlimitedEvidence = await unlimitedCalibrationEvidence();
const m21Normalization = await m21NormalizationEvidence();
const m21Publication = await m21PublicationEvidence();
const m21Mana = await m21ManaEvidence();
const sets = [];
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
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
  const { modernPrintingProfile } = await server.ssrLoadModule(
    '/games/magic/src/presentation/modern-printing-profile.ts',
  );
  const { resolveFrameColors } = await server.ssrLoadModule(
    '/games/magic/src/presentation/profile.ts',
  );
  for (const set of inventory.sets.filter(
    (s) => s.status === 'major' && (!selectedSet || s.set === selectedSet),
  )) {
    const snapshot = await readJson(`${cacheRoot}/rollout/sets/${set.set}.json`);
    assert.equal(snapshot.sourceIdentity, set.sourceIdentity, 'Catalog changed: ' + set.set);
    const cards = [];
    for (const page of snapshot.pages) cards.push(...JSON.parse(await readObject(page)).data);
    assert.equal(new Set(cards.map((c) => c.id)).size, cards.length);
    const summary = summarizeSet(cards);
    assert.equal(summary.ordinaryPrintings, set.ordinaryPrintings);
    const byGroup = new Map();
    for (const card of cards.filter((c) => printingScope(c).status === 'ordinary')) {
      // Only exact reviewed physical traits override the catalog palette.
      // General produced-mana grouping stays unchanged for unreviewed sets.
      const identity = {
        name: card.name,
        setCode: card.set,
        collectorNumber: card.collector_number,
        typeLine: card.type_line,
        frameStyle: ['1993', '1997'].includes(card.frame) ? 'retro' : 'modern',
        ...(card.frame === '2003' ? { frameAssetFamily: 'eighth' } : {}),
        layout: card.layout,
      };
      const reviewed = modernPrintingProfile(identity)?.printedFrameColors?.[card.collector_number];
      const variant = calibrationVariant(
        card,
        reviewed?.name === card.name ? { frameColors: resolveFrameColors(identity) } : {},
      );
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
        const historicalGeometry = geometry && early.groups[`${set.set}/${geometry.material}`];
        if (
          geometry &&
          historicalGeometry?.profile.source === JSON.stringify([geometry.asset, geometry.frame])
        ) {
          const eg = historicalGeometry,
            key = `${set.set}/${geometry.material}`;
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
          applyM21BoundaryRefinement(g, m21Refined, m21RefinedGuardsMatch);
          applyM21StockTransfer(g, m21Stock, m21StockGuardsMatch);
          applyM21WhiteDefault(g, source, m21White, m21WhiteGuardsMatch);
          applyM21OriginalWording(g, inventoryM21Wording, m21WordingGuardsMatch);
          if (g.tasks.rules.originalInput && inventoryM21Wording.guardExtensions)
            g.tasks.rules.originalInput.guardExtensions = structuredClone(
              inventoryM21Wording.guardExtensions,
            );
          applyM21RedColor(g, source, m21Red, m21RedGuardsMatch);
          applyM21Normalization(g, m21Normalization);
        }
        applyEarlyOriginalWording(g, earlyWording, earlyWordingGuardsMatch);
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
      preserveCalibrationReviews(g, saved);
      if (set.set === '2ed') applyUnlimitedEvidence(g, unlimitedEvidence);
      if (set.set === 'm21') {
        applyM21Publication(g, m21Publication);
        applyM21Mana(g, m21Mana);
      }
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
if (selectedSet) {
  assert(previous, 'Targeted inventory requires an existing ledger');
  const updated = new Map(sets.map((s) => [s.set, s]));
  sets.splice(0, sets.length, ...previous.sets.map((s) => updated.get(s.set) ?? s));
}
const nextLedger = {
  schemaVersion: 1,
  asOf: inventory.asOf,
  policy:
    'Major ordinary English paper sets, at least 50 distinct cards. No set is complete from a profile count. Missing tasks are pending. Foil-only and classification-review printings stay visible. Grouped by frame, color, layout, card kind, legendary treatment and stamp; rarity coverage is explicit within each group.',
  inventoryHash: hash(await readFile(fixtureRoot + '/rollout-inventory.json')),
  tasks: CALIBRATION_TASKS,
  sets,
};
await applyMirageOnslaughtCensus(nextLedger, { onlyCurrent: true });
await writeJson(file, nextLedger);
console.log(
  `Inventoried ${sets.length} sets / ${sets.reduce((n, s) => n + s.groups.length, 0)} variants. ${sets.filter((s) => calibrationSetStatus(s).complete).length} complete.`,
);
