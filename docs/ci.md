# CI verification and release

CI builds once, then runs four independent verification jobs. Each job executes
its assigned checks serially. The final renderer check requires a successful
build, every verification job, and a complete result list for the same commit
and test plan. Missing, duplicated, foreign or failed results fail the gate.

The plan expands the existing npm test aliases in scripts/ci/suites.json.
Identical Node commands run once. Different arguments remain separate checks,
including source/built and browser/worker variants. A coverage test preserves
every command from the previous CI plan. The original plan ran 367 commands;
18 repeated the old-frame census. All 349 distinct checks remain, plus tests for
the new CI runner.

## Run checks locally

Existing individual npm test commands still work. To inspect the CI allocation:

    npm run test:ci:list

To run the full deduplicated plan, install Chromium and WebKit, build/package the
current committed checkout, and start the preview server:

    npm run build
    npm run package:release
    npx playwright install chromium webkit
    npm run preview

In another terminal:

    npm run test:ci

To reproduce one CI job:

    npm run test:ci -- --shards 4 --shard 2

Keep the checkout unchanged during the run. Some tests use Vite module graphs;
editing source or rebuilding generated data during verification can invalidate
their loaded registries. Tests continue after a failed case to collect all
failures in one run.

## Timing and coverage

The runner records each command's process wall time in evidence/ci-times-N.json.
This includes process startup, CPU work, I/O and GPU waits. It does not measure
hardware GPU throughput or cached-frame submission performance.

baseline.json contains scheduling estimates from the previous Ubuntu 24.04
software-GPU run. Initial per-command estimates divide suite time by command
count; they are not individual benchmarks. The longest estimated checks are
assigned first to the least-loaded job. CI uploads actual command timings and
lists the slowest checks in its summary, so estimates can be revised from
measurements.

Build artifacts include generated set data, WASM, browser bundles and checked
release archives. Every verification job uses the same build. Browser dependencies
remain pinned by the package lockfile and the Ubuntu runner. Evidence artifacts
are kept separate for each job.

Pushes to main and pull requests run verification. A feature branch can use
workflow_dispatch; branch pushes do not also repeat the pull-request run.

## Publish a release

Wait for successful main CI on the exact release commit, then push its matching
version tag. The Release workflow selects only a successful main push from this
repository with that exact SHA. It requires a non-expired build artifact bound
to the same run and commit, then checks archive provenance and checksums before
publishing.

This reuses the verified build instead of rebuilding and rerunning every test
for the tag. PR, fork, failed, incomplete and different-commit runs cannot supply
a release. Build artifacts remain available for 14 days. If they expire, rerun
main CI for that commit before tagging or retrying publication. Published CDN
trees and release archives retain their existing immutable retry checks.
