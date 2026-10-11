import { Worker } from 'node:worker_threads';
import path from 'node:path';
import {
  fixtureRoot,
  hash,
  options,
  outputRoot,
  readJson,
  referenceIdentity,
  sourceHash,
  writeJson,
} from './common.mjs';
import { METRIC_VERSION } from './metrics.mjs';
import { summarize, assetBacklog } from './summary.mjs';

const opts = options();
const runRoot = path.join(outputRoot, opts.set, opts.run);
const capture = await readJson(path.join(runRoot, 'capture.json'));
const profile = await readJson(path.join(fixtureRoot, opts.set, 'alignment.json'));
if (profile.set !== opts.set) throw Error('Wrong set alignment profile');
if (profile.sourceSnapshot !== capture.snapshotIdentity)
  throw Error(
    'Alignment profile belongs to a different reference snapshot; recalibrate explicitly.',
  );
const referenceHash = capture.referenceIdentity ?? referenceIdentity(capture.results);
if (profile.referenceIdentity !== referenceHash)
  throw Error('Alignment reference checksums differ; recalibrate explicitly.');
const cohorts = await readJson(path.join(fixtureRoot, opts.set, 'cohorts.json'));
const source = opts.limit ? capture.results.slice(0, opts.limit) : capture.results;
const results = new Array(source.length),
  workers = [];
let next = 0,
  finished = 0,
  cacheHits = 0;
const metricSource = await sourceHash(
  new URL('.', import.meta.url),
  /^(?:compare(?:-worker)?|common|summary|alignment|pixels|edges|metrics|regions)\.mjs$/,
);
const started = performance.now();
try {
  await new Promise((resolve, reject) => {
    if (!source.length) return resolve();
    for (let i = 0; i < Math.min(2, source.length); i++) {
      const worker = new Worker(new URL('./compare-worker.mjs', import.meta.url));
      workers.push(worker);
      const send = () => {
        if (next >= source.length) return;
        const index = next++,
          card = source[index];
        const cohort = cohorts.calibration.includes(card.collectorNumber)
          ? 'calibration'
          : cohorts.heldOut.includes(card.collectorNumber)
            ? 'held-out'
            : 'corpus';
        worker.postMessage({ index, result: { ...card, cohort }, runRoot, profile, metricSource });
      };
      worker.on('error', reject);
      worker.on('message', ({ index, result, cached }) => {
        if (cached) cacheHits++;
        results[index] = result;
        if (++finished % 25 === 0 || finished === source.length)
          console.log(`Compared ${finished}/${source.length}`);
        if (finished === source.length) resolve();
        else send();
      });
      worker.on('exit', (code) => {
        if (code && finished < source.length) reject(Error(`Comparison worker exited ${code}`));
      });
      send();
    }
  });
} finally {
  await Promise.all(workers.map((w) => w.terminate()));
}
const seconds = (performance.now() - started) / 1000;
const report = {
  schemaVersion: 1,
  metricVersion: METRIC_VERSION,
  set: opts.set,
  run: opts.run,
  createdAt: new Date().toISOString(),
  snapshotIdentity: capture.snapshotIdentity,
  referenceIdentity: referenceHash,
  alignmentProfile: profile,
  alignmentHash: hash(JSON.stringify(profile)),
  browser: capture.browser,
  captureSource: capture.source,
  captureSourceDiffHash: capture.sourceDiffHash,
  annotationHash: capture.annotationHash,
  totalPrintings: capture.totalPrintings,
  eligibleCount: capture.eligibleCount,
  excluded: capture.excluded,
  complete: capture.complete && !opts.limit,
  elapsedSeconds: seconds,
  cacheHits,
  metricSource,
  rendererHash: capture.rendererHash ?? null,
  fontStylesheetHash: capture.fontStylesheetHash ?? null,
  scoreMeaning:
    'Boundary F1 at 1 canonical pixel (488 x 680), not percentage of cards rendered correctly. Unreviewed Oracle text is diagnostic. No per-scan alignment fitting.',
  summary: summarize(results),
  cohorts: Object.fromEntries(
    ['calibration', 'held-out', 'corpus'].map((c) => [
      c,
      summarize(results.filter((r) => r.cohort === c)),
    ]),
  ),
  assets: assetBacklog(results),
  results,
};
await writeJson(path.join(runRoot, 'metrics.json'), report);
await writeJson(path.join(runRoot, 'asset-backlog.json'), report.assets);
console.log(JSON.stringify({ seconds, summary: report.summary }, null, 2));
if (results.some((r) => r.issue)) process.exitCode = 1;
