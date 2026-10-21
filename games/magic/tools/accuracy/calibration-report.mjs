import { artistReviewSource } from './artist-review-ancestry.mjs';
import {
  preEarlyCalibrationSource,
  earlyCalibrationAffected,
  EARLY_SOURCE_RECEIPT,
} from './abu-source-ancestry.mjs';
import { preWalkerSource } from './planeswalker-reconstruction/ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fixtureRoot, root, hash, readJson } from './common.mjs';
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
    checked = new Map();
  for (const set of current.sets)
    for (const group of set.groups) {
      const dependencies = Object.entries(group.tasks ?? {}).flatMap(([task, item]) => [
        ...(['validated', 'validated-default'].includes(item.status)
          ? [{ task, item, original: false }]
          : []),
        ...(item.originalInput ? [{ task, item: item.originalInput, original: true }] : []),
      ]);
      for (const { task, item, original } of dependencies) {
        const earlyAffected = await earlyCalibrationAffected(set.set, group, task, original);
        if (earlyAffected && item.proof?.earlyBatchReceipt !== EARLY_SOURCE_RECEIPT) {
          item.status = original ? 'stale' : 'needs-audit';
          item.reason =
            'The early-set batch changes this printing/component; its previous fit needs a current source-bound review.';
          continue;
        }
        for (const [file, expected] of Object.entries(item.guards ?? {})) {
          assert.ok(!file.startsWith('/') && !file.split('/').includes('..'));
          const changedScope = group.kind === 'planeswalker' || set.set === 'm15';
          const guardKey =
            set.set +
            ':' +
            (earlyAffected ? 'early-current:' : 'early-compatible:') +
            (changedScope ? 'changed:' : 'other:') +
            (set.set === 'm21' ? 'm21-body-compatible:' : 'body-current:') +
            file;
          if (!checked.has(guardKey)) {
            try {
              const bytes = await readFile(root + '/' + file);
              const artist = await artistReviewSource(file, bytes, set.set);
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
                  hash(early),
                  hash(scoped),
                  hash(
                    changedArtist ? ancestral : await compatibleHostWorkerSource(file, ancestral),
                  ),
                ]),
              );
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
