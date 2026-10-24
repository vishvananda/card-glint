import { abuArtAffected, abuArtRuntimeCompatible, preAbuArtSource } from './abu-art-ancestry.mjs';
import {
  printingFlavorAffected,
  printingFlavorApprovalCurrent,
  printingFlavorRuntimeCompatible,
  prePrintingFlavorData,
} from './printing-flavor-data-ancestry.mjs';
import {
  abuPaperAffected,
  abuPaperApprovalCurrent,
  abuPaperRuntimeCompatible,
  preAbuPaperSource,
} from './abu-paper-ancestry.mjs';
import {
  abuRasterAffected,
  abuRasterRuntimeCompatible,
  abuRasterApprovalCurrent,
} from './abu-raster-ancestry.mjs';
import {
  abuPerimeterApprovalCurrent,
  preAbuPerimeterSource,
  abuPerimeterAffected,
  abuPerimeterRuntimeCompatible,
} from './abu-perimeter-ancestry.mjs';
import { printingArtistDelta, printingArtistAffected } from './printing-artist-data-ancestry.mjs';
import {
  abuFractionalAncestry,
  abuFractionalAffected,
  abuFractionalRuntimeCompatible,
} from './abu-fractional-ancestry.mjs';
import {
  eighthSourceAncestry,
  eighthDefaultSetAffected,
  eighthRuntimeCompatible,
} from './eighth-source-ancestry.mjs';
import { preNormalizationCensusSource } from './normalization-census-ancestry.mjs';
import { modernDefaultAncestry, modernDefaultSetAffected } from './modern-default-ancestry.mjs';
import { m21StyleProfileSource } from './m21-style-ancestry.mjs';
import { artistReviewSource } from './artist-review-ancestry.mjs';
import {
  preEarlyCalibrationSource,
  earlyCalibrationAffected,
  EARLY_SOURCE_RECEIPT,
} from './abu-source-ancestry.mjs';
import { preWalkerSource } from './planeswalker-reconstruction/ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fixtureRoot, root, hash, readJson, sourceHash } from './common.mjs';
import {
  CALIBRATION_TASKS,
  calibrationSetStatus,
  calibrationTaskStatus,
} from './calibration-ledger.mjs';
import { preAlphaEditorSource } from './alpha-editor-ancestry.mjs';
import { compatibleHostWorkerSource } from './host-worker-compatibility.mjs';

function originalInputs(set, task) {
  return set.groups.reduce(
    (counts, group) => {
      const input = group.tasks?.[task]?.originalInput;
      if (input) counts[input.status] = (counts[input.status] ?? 0) + input.coveredPrintings;
      counts.unrecorded += group.printings - (input?.coveredPrintings ?? 0);
      return counts;
    },
    { ready: 0, partial: 0, stale: 0, unrecorded: 0 },
  );
}

export async function calibrationReport(ledger) {
  const current = structuredClone(ledger),
    checked = new Map(),
    runtimeChecked = new Map();
  for (const set of current.sets)
    for (const group of set.groups) {
      const dependencies = Object.entries(group.tasks ?? {}).flatMap(([task, item]) => [
        ...(['validated', 'validated-default'].includes(item.status)
          ? [{ task, item, original: false }]
          : []),
        ...(item.originalInput ? [{ task, item: item.originalInput, original: true }] : []),
      ]);
      for (const { task, item, original } of dependencies) {
        if (await abuArtAffected(set.set, task, original, group)) {
          item.status = 'needs-audit';
          item.reason =
            'The shared Alpha/Beta dual art aperture is two pixels shorter. Geometry and full-card approvals need the current scoped evidence; unrelated components and Original wording retain their checks.';
          continue;
        }
        const flavorAffected = await printingFlavorAffected(set.set, task, original, group);
        if (flavorAffected && !(await printingFlavorApprovalCurrent(item, group))) {
          item.status = 'needs-audit';
          item.reason =
            'Pearled Unicorn now preserves its printed attribution paragraph. This exact printing needs current flavor/reference/full-card evidence; unrelated wording and components retain their own checks.';
          continue;
        }
        const paperAffected = await abuPaperAffected(set.set, task, original, group);
        if (paperAffected && !(await abuPaperApprovalCurrent(item, group))) {
          item.status = 'needs-audit';
          item.reason =
            'The Alpha/Beta dual striped paper panel changed geometry. Frame/paper and full-card approvals require the new scoped replay; unchanged components and original wording retain their own evidence.';
          continue;
        }
        const rasterAffected = await abuRasterAffected(set.set, task, original, group);
        const rasterCurrent = rasterAffected && (await abuRasterApprovalCurrent(item, group));
        if (rasterAffected && !rasterCurrent) {
          item.status = 'needs-audit';
          item.reason =
            'Historical dual raster selection changed to remove a clip seam. Frame geometry and full-card approvals need the new scoped replay; other components and original wording retain their evidence.';
          continue;
        }
        const perimeterAffected = await abuPerimeterAffected(set.set, task, original, group);
        if (perimeterAffected && !(await abuPerimeterApprovalCurrent(item, group))) {
          item.status = 'needs-audit';
          item.reason =
            'The shared Alpha/Beta dual perimeter changed. Frame geometry and whole-card approvals need the current scoped native replay; unchanged interior components and source wording retain their own evidence.';
          continue;
        }
        const fractionalAffected = abuFractionalAffected(set.set, task, original);
        const artistDataAffected = await printingArtistAffected(set.set, task, original, group);
        if (
          artistDataAffected &&
          item.proof?.printingArtistSource !== (await printingArtistDelta()).afterRenderer
        ) {
          item.status = 'needs-audit';
          item.reason =
            'Alpha Tropical Island has a corrected physical artist credit. Artist and full-card approvals need the current scoped replay; other printing wording and components are unchanged.';
          continue;
        }
        if (
          fractionalAffected &&
          item.proof?.abuFractionalSource !== (await abuFractionalAncestry()).afterRenderer
        ) {
          item.status = 'needs-audit';
          item.reason =
            'ABU Original text uses a new fractional-metrics and small-face policy. Keep its unchanged frame and wording reviews; rules and full-card results need a current replay.';
          continue;
        }
        const eighthAffected = await eighthDefaultSetAffected(set.set, group);
        if (
          eighthAffected &&
          !original &&
          task !== 'references' &&
          item.proof?.eighthDefaultsSource !== (await eighthSourceAncestry()).rendererHash
        ) {
          item.status = 'needs-audit';
          item.reason =
            'The Eighth-family source defaults changed. Reference and wording data remain reusable; rendered components need a current review.';
          continue;
        }
        const modernDefaultsAffected = await modernDefaultSetAffected(set.set, group);
        if (
          modernDefaultsAffected &&
          !original &&
          task !== 'references' &&
          item.proof?.modernDefaultsSource !== (await modernDefaultAncestry()).rendererHash
        ) {
          item.status = 'needs-audit';
          item.reason =
            'Shared modern defaults changed this frame. Keep its reference/wording data; review rendered components against the current donor revision.';
          continue;
        }
        const earlyAffected = await earlyCalibrationAffected(set.set, group, task, original);
        if (earlyAffected && item.proof?.earlyBatchReceipt !== EARLY_SOURCE_RECEIPT) {
          item.status = original ? 'stale' : 'needs-audit';
          item.reason =
            'The early-set batch changes this printing/component; its previous fit needs a current source-bound review.';
          continue;
        }
        let runtimeCurrent = true;
        for (const [directory, expected] of Object.entries(item.runtimeGuards ?? {})) {
          assert.ok(!directory.startsWith('/') && !directory.split('/').includes('..'));
          assert.match(expected, /^[a-f0-9]{64}$/);
          if (!runtimeChecked.has(directory)) {
            try {
              runtimeChecked.set(directory, await sourceHash(root + '/' + directory));
            } catch (error) {
              if (error.code !== 'ENOENT') throw error;
              runtimeChecked.set(directory, null);
            }
          }
          if (
            runtimeChecked.get(directory) !== expected &&
            !(await abuArtRuntimeCompatible(directory, expected, set.set, task, original, group)) &&
            !(await printingFlavorRuntimeCompatible(
              directory,
              expected,
              set.set,
              task,
              original,
              group,
            )) &&
            !(await abuPaperRuntimeCompatible(
              directory,
              expected,
              set.set,
              task,
              original,
              group,
            )) &&
            !(await abuRasterRuntimeCompatible(
              directory,
              expected,
              set.set,
              task,
              original,
              group,
            )) &&
            !(await abuPerimeterRuntimeCompatible(
              directory,
              expected,
              set.set,
              task,
              original,
              group,
            )) &&
            !(await eighthRuntimeCompatible(directory, expected, set.set, group)) &&
            !(await abuFractionalRuntimeCompatible(
              directory,
              expected,
              set.set,
              task,
              original,
              group,
            ))
          ) {
            runtimeCurrent = false;
            item.status = 'stale';
            item.reason = 'Runtime source changed after the published native/scoring replay.';
            break;
          }
        }
        if (!runtimeCurrent) continue;
        for (const [file, expected] of Object.entries({ ...group.guards, ...item.guards })) {
          assert.ok(!file.startsWith('/') && !file.split('/').includes('..'));
          const changedScope = group.kind === 'planeswalker' || set.set === 'm15';
          const guardKey =
            set.set +
            (artistDataAffected ? ':artist-current:' : ':artist-compatible:') +
            (earlyAffected ? 'early-current:' : 'early-compatible:') +
            (fractionalAffected ? 'fractional-current:' : 'fractional-compatible:') +
            (modernDefaultsAffected ? 'modern-defaults-current:' : 'modern-defaults-compatible:') +
            (changedScope ? 'changed:' : 'other:') +
            (set.set === 'm21' ? 'm21-body-compatible:' : 'body-current:') +
            file;
          if (!checked.has(guardKey)) {
            try {
              const bytes = await readFile(root + '/' + file);
              if (artistDataAffected && (await printingArtistDelta()).files[file]) {
                checked.set(
                  guardKey,
                  new Set([hash(bytes), hash(await preAbuPerimeterSource(file, bytes))]),
                );
              } else if (fractionalAffected && (await abuFractionalAncestry()).files[file]) {
                checked.set(
                  guardKey,
                  new Set([hash(bytes), hash(await preAbuArtSource(file, bytes))]),
                );
              } else {
                const modern = await m21StyleProfileSource(file, bytes, set.set, group);
                const artist = await artistReviewSource(file, modern.bytes, set.set);
                const changedArtist = artist.changed;
                const early =
                  earlyAffected || changedArtist
                    ? artist.bytes
                    : await preEarlyCalibrationSource(file, artist.bytes, set.set);
                const scoped =
                  earlyAffected || changedArtist || changedScope
                    ? early
                    : await preWalkerSource(file, early);
                const ancestral =
                  file === 'games/magic/src/presentation/retro-paint.ts'
                    ? await preAlphaEditorSource(file, scoped, set.set)
                    : scoped;
                checked.set(
                  guardKey,
                  new Set([
                    hash(bytes),
                    hash(await preAbuArtSource(file, bytes)),
                    hash(await prePrintingFlavorData(file, bytes)),
                    hash(await preAbuPaperSource(file, bytes)),
                    hash(await preNormalizationCensusSource(file, bytes)),
                    hash(modern.bytes),
                    hash(early),
                    hash(scoped),
                    hash(
                      changedArtist ? ancestral : await compatibleHostWorkerSource(file, ancestral),
                    ),
                  ]),
                );
              }
            } catch (error) {
              if (error.code !== 'ENOENT') throw error;
              checked.set(guardKey, null);
            }
          }
          if (!checked.get(guardKey)?.has(expected)) {
            item.status = 'stale';
            item.reason = 'Changed evidence dependency: ' + file;
            break;
          }
        }
      }
    }
  return current.sets.map((set) => ({
    ...calibrationSetStatus(set),
    name: set.name,
    priority: set.priority,
    printings: set.inventory.ordinaryPrintings,
    nonfoil: set.groups.reduce((n, g) => n + g.references.nonfoil, 0),
    foilOnly: set.groups.reduce((n, g) => n + g.references.foilOnly, 0),
    ...(set.textAudit ? { textAudit: set.textAudit } : {}),
    originalRulesInputs: originalInputs(set, 'rules'),
    originalTypeInputs: originalInputs(set, 'headings'),
    byTask: Object.fromEntries(
      Object.keys(CALIBRATION_TASKS).map((task) => {
        const counts = {};
        for (const g of set.groups) {
          const { status } = calibrationTaskStatus(g, task);
          counts[status] = (counts[status] ?? 0) + 1;
        }
        return [task, counts];
      }),
    ),
  }));
}

export function calibrationMarkdown(ledger, reports, { setCode } = {}) {
  const selected = reports.filter((r) => (setCode ? r.set === setCode : r.priority === 'active'));
  const lines = [
    '# Set calibration completion',
    '',
    'This is a work checklist, not an accuracy percentage. A set is complete only when every applicable check passes for every ordinary variant, references and wording are verified, all printings are replayed, and a matching renderer/score revision is published.',
    '',
    `Frozen inventory: ${ledger.asOf}. ${reports.length} major sets; ${reports.reduce((n, r) => n + r.groups, 0)} variants; ${reports.filter((r) => r.complete).length} complete. The initial scope requires at least 50 distinct ordinary English paper cards.`,
    '',
    'Queued variants retain their denominators; omitted task records mean pending. Foil-only printings stay visible and cannot supply nonfoil color calibration. Historical measurements remain needs-audit until checked against current sources. Validated defaults require measurements too.',
    '',
    '| Set | Printings | Nonfoil eligible | Foil only | Variants | Verified checks | Not applicable | Open checks | Complete |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |',
  ];
  for (const r of selected)
    lines.push(
      `| ${r.set.toUpperCase()} | ${r.printings} | ${r.nonfoil} | ${r.foilOnly} | ${r.groups} | ${r.counts.validated + r.counts['validated-default']} | ${r.counts['not-applicable']} | ${r.outstanding.length} | ${r.complete ? 'yes' : 'no'} |`,
    );
  lines.push(
    '',
    'Check counts repeat shared material evidence across the variants it covers; they are not counts of independent fits.',
    '',
  );
  for (const r of selected) {
    lines.push(
      `## ${r.set.toUpperCase()} — ${r.name}`,
      '',
      '| Required check | Variant status counts |',
      '| --- | --- |',
    );
    for (const [task, label] of Object.entries(CALIBRATION_TASKS))
      lines.push(
        `| ${label} | ${Object.entries(r.byTask[task])
          .map(([s, n]) => `${s}: ${n}`)
          .join('; ')} |`,
      );
    lines.push('');
    for (const [field, counts] of [
      ['rules', r.originalRulesInputs],
      ['type line', r.originalTypeInputs],
    ])
      if (counts.ready + counts.partial + counts.stale > 0)
        lines.push(
          `Original ${field} input coverage (printings): ${Object.entries(counts)
            .map(([state, count]) => `${state}: ${count}`)
            .join('; ')}. Source availability does not approve text alignment.`,
          '',
        );
    if (setCode) {
      lines.push('| Variant | Check | State | Reason |', '| --- | --- | --- | --- |');
      for (const o of r.outstanding)
        lines.push(
          `| ${o.group} | ${o.task} | ${o.status} | ${(o.reason ?? '').replaceAll('|', '\\|')} |`,
        );
      lines.push('');
    }
  }
  return lines.join('\n') + '\n';
}

if (process.argv[1]?.endsWith('/calibration-report.mjs')) {
  const args = process.argv.slice(2),
    setCode = args.find((a) => !a.startsWith('--'));
  assert.ok(
    args.every((a) => a === '--json' || /^[a-z0-9]{2,10}$/.test(a)),
    'Use [set] [--json]',
  );
  const ledger = await readJson(fixtureRoot + '/calibration-progress.json');
  assert.ok(!setCode || ledger.sets.some((s) => s.set === setCode), 'Unknown set');
  const reports = await calibrationReport(ledger);
  console.log(
    args.includes('--json')
      ? JSON.stringify(
          reports.filter((r) => !setCode || r.set === setCode),
          null,
          2,
        )
      : calibrationMarkdown(ledger, reports, { setCode }),
  );
}
