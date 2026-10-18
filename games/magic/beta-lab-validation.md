# Beta validation experiment on 0.5.2

This is a diagnostic study, not an adopted LEB calibration. No renderer defaults,
profile revisions, historical receipts or completion claims change. The required
pixel-preserving migration remains incomplete: the current consolidated adapter
does not represent all of LEB's existing ABU behavior.

The source baseline is `v0.5.2`, commit
`1b9bcb01a53df0997c16712922efa20c336f6185`. The experiment runs on
`codex/beta-lab-validation`. See the [frozen plan](fixtures/accuracy/beta-lab-validation-plan.json),
the [result receipt](fixtures/accuracy/beta-lab-validation-result.json),
and the [runner](tools/accuracy/beta-validation.mjs).

## Inputs and independence

The cached English, ordinary, nonfoil set contains 302 printings of 292 names.
Reference scans, artwork and MTGJSON wording retain their existing content hashes;
no artwork is committed. Original rules use the contributor guide's strict adapter.
Unreviewed type lines, flavor formatting and footer fields remain diagnostic only.

All names were present in earlier development studies, so validation is
`reused-development`. The historical split placed alternate Plains and Swamp
printings in different cohorts. Before any fitting, every printing of those names
was moved into calibration. The final split is 59 calibration printings / 55 names
and 243 validation printings / 237 names. An initial draft with the inherited
identity leak is retained in ignored evidence and was never fitted.

Historical scan poses were inspected but not reused as current-policy approvals.
They used three anchors per side, and some fits admitted unequal axis scaling.
New scan targets are medians of calibration-scan outer-frame observations only.
The renderer, lettering, mana and illustration do not contribute to registration.
Current strict translation/uniform-scale, rotation and bounded-skew policy accepts
115 scans: 27 calibration printings / 23 names and 88 validation printings / 82 names. All 187 rejected scans remain in the
denominator. Targets were inspected against seven representative scan-only cards;
this is an exploratory review, not certification of every frame boundary.

Black's weak outer edge can select interior texture; its target remains explicitly
unreliable. Green fails the residual policy. The accepted material counts are
W 42/46, U 30/46, B 0/46, R 6/46, G 0/46, artifact 12/47, land 25/25.
The existing synthetic scan-frame recovery tests pass without altered limits.

All 115 accepted scan names were transcribed against six scan-only header contact
sheets before fitting. The supplemental reviewed study passes the stock evidence
validator. It adds review evidence to the frozen inputs without changing a face,
pose or crop; the runner asserts that equality. Other fields do not inherit this
name review.

## Scope and result

The released ABU frame assets, art aperture, fonts, mana policy and pigments stay
fixed. The released legacy title resolves to canonical `(33.16, 49.328)`,
27.8 px Goudy, gray `#ababab`, with its existing translucent black shadow.
ABU frame placement is `[0, 0, 1, 1]`; the ordinary art aperture remains
`[0.116, 0.1043, 0.7654, 0.441]`. Early credits retain x 49, baseline 631,
22.5 px MPlantin and the `Illus. ©` prefix. These are legacy defaults, not a
newly registered profile. The only trial is one shared title translation,
bounded to ±3 canonical
pixels with 1, 0.5 and 0.25 px steps. All three starts converge to `dx = -0.5`,
`dy = 0`, without a boundary winner or tied optimum. No per-card rendering offset
is fitted.

The CPU search uses a cached additive native-title differential over the blank
native frame, with equally weighted dual-polarity one-pixel edge F1 and filled-area
Dice. It is an approximation; the final full native replay is authoritative.
The calibration objective improves only from 0.616916 to 0.618430. Deliberately
moving the selected title two pixels right scores 0.609088; moving it two pixels
down scores 0.590535. All 60 evaluated trials, including rejected candidates and
all three searches, remain in `proposal.json`.

Native replay rejects the half-pixel candidate. The calibration objective falls
from **0.616916 to 0.616685**, while the cached prototype predicted 0.618430.
The prototype therefore fails the native ranking check. Reused-validation results:

| Material | Printings | Mean edge F1 before → after | Mean filled Dice before → after |
| -------- | --------: | --------------------------: | ------------------------------: |
| all      |        88 |         0.680810 → 0.680271 |             0.604484 → 0.603497 |
| W        |        34 |         0.736884 → 0.735753 |             0.656279 → 0.654861 |
| U        |        24 |         0.691982 → 0.691127 |             0.630720 → 0.628798 |
| R        |         5 |         0.722701 → 0.727840 |             0.591890 → 0.594884 |
| A        |        11 |         0.635159 → 0.636243 |             0.549173 → 0.549139 |
| L        |        14 |         0.546388 → 0.544522 |             0.481675 → 0.481165 |

All 302 native faces were captured before and after. Native and canonical pixels
below the title band are byte-identical. Mana, art-aperture and rules diagnostics
are retained by material/cohort; rarity and legendary strata are also recorded.
The ledger and every profile/review revision remain unchanged. Similarity scores
are not percentages of correctness. No pigment fitting follows this result.

The five largest edge improvements were inspected at 3×: Sedge Troll, Jayemdae
Tome, Guardian Angel, Blue Ward and Earthbind. Five worst printings were also
inspected: Plateau #280, Volcanic Island #287 and Forest #300/#302/#301. The
land titles retain substantial vertical/ink-shape mismatches; a horizontal shift
does not repair them. Jayemdae Tome still scores below the review threshold.
White Ward #45 regresses from 0.744221 to 0.720444 and Ankh of Mishra #231
from 0.617132 to 0.593671; both were inspected, along with blue’s largest
edge regression, Twiddle. The crops retain visible weight, contrast and geometry
differences rather than supporting a simple placement correction.

A post-fit interior-replacement sensitivity control changes 7/115 accepted
registrations; three lose acceptance. Affected names are Red Elemental Blast,
Sedge Troll, Nevinyrral’s Disk, Volcanic Island, Island, Swamp and Forest. The
control retains outer boundary locations but replaces inner material as well as
content, so it does not establish that lettering alone causes the sensitivity.
It does establish that content isolation remains unproven for these poses. The
frozen poses and cohorts were not refitted, and no failing validation card was
removed to improve the result. Sedge Troll’s attractive gain is therefore not
certified evidence. The untouched 115-row results remain exploratory.

Not every low-score trigger or rejected scan has received full visual review.
Red and artifact have only one accepted calibration printing each. No transfer
or component completion is claimed for those groups.

## Tooling and guidance findings

The documented `calibration-evidence.mjs capture` command initially failed before
Chromium opened: `fetchComponents` queried synchronous set tables in a private
Vite context without preparing the set. Its private browser context needed the
same initialization. The separate tooling commit prepares requested faces with
`prepareMagicCards`; no guard or renderer source is weakened. The corrected guide
command captures all 302 cards cache-only. Its PNG hashes match all 302 no-op
experimental baseline captures exactly.

`magic:data:build` is necessary in a fresh checkout. The first `npm run check`
also fails before `npm run build` generates WASM wrappers; after building, the
full check passes. The guide currently lists check before build, so contributors
need a first-build prerequisite. Initial read-only dependency reuse was replaced
with a local `npm ci` before build and final checks, keeping workspace package
resolution local to this branch.

`describeSetCalibration('leb')` returns `supported: false`, no revision and no
controls. Candidate creation rejects LEB. Registering a fabricated profile would
activate existing stock-window, solid-lettering and footer branches and would
not be a zero-pixel migration. A migration needs explicit ABU legacy behavior,
basic/dual-land selection, alpha-shadow and credit-prefix coverage, followed by
native differential proof. The experiment does not bypass candidate assertions
or publish an unsupported profile.

The guide supplies numeric search and metrics but no ready LEB fitting adapter.
This study therefore includes a comparison-only cached title prototype and a
native title replay probe, with strict title-hit counts and full baseline parity.
The prototype does not become a painter or a host control.

Native capture is the expensive stage: a fresh source session prepares material
rasters and encodes every full face. This study uses one browser per capture run
and CPU-only candidate trials, with no Chromium launch per candidate. Capture
wall time is workflow preparation/encoding time, not a GPU completion benchmark.
The experimental report also redecodes captures and rescans unchanged components;
a full rebuild takes several minutes. This is a limitation of this runner, not
measured per-frame renderer cost. The duplicate no-op baseline and all-card blank
title layers inflate this experiment's ignored artifact volume; a prepared-layer
and canonical-image cache would avoid that work in a subsequent pass.

## Reproduction and evidence

Use the existing reference cache through `MAGIC_ACCURACY_CACHE`; cache bytes are
content-addressed and verified, not copied. Keep downloaded art and all derived
PNGs under the ignored `test-results/` tree. With a fresh checkout:

```sh
npm ci
npm run magic:data:build
npm run build
node games/magic/tools/accuracy/calibration-study.mjs init leb test-results/beta/draft.json
node games/magic/tools/accuracy/beta-validation.mjs freeze test-results/beta PATH_TO_HISTORICAL_INPUTS_JSON
# Review templates-draft.json against scan-only frame strips; save templates-reviewed.json.
node games/magic/tools/accuracy/beta-validation.mjs normalize test-results/beta test-results/beta/templates-reviewed.json
# Review accepted scan names; preserve scan hashes and contact-sheet hashes in title-review.json.
# Save reviewed-study.json with only approved name evidence; validate it:
node games/magic/tools/accuracy/calibration-evidence.mjs check test-results/beta/reviewed-study.json
node games/magic/tools/accuracy/beta-validation.mjs capture test-results/beta
node games/magic/tools/accuracy/beta-validation.mjs fit test-results/beta
node games/magic/tools/accuracy/beta-validation.mjs replay test-results/beta
node games/magic/tools/accuracy/beta-validation.mjs isolate test-results/beta
node games/magic/tools/accuracy/beta-validation.mjs report test-results/beta
```

The historical inputs and component manifests are external study dependencies;
the committed plan pins their hashes. The manual review steps are deliberately
explicit: neither the runner nor the synthetic example certifies a template or
transcription automatically. Completed capture and proposal directories cannot
be overwritten. The evidence bundle must include the frozen study, reviewed
amendment, anchors, reviewed templates, title reviews, provenance, raw captures,
all trials, score JSON, overlays and review page.

The local comparison page is `test-results/beta/review/index.html`. Raw native
732 × 1020 before/after PNGs are under `before/` and `after/`; comparison images
use resize-then-frozen-affine 488 × 680 references. The review page includes 3×
crops, transparent overlays and red/green comparisons, and lists every rejected
normalization. Captures and art remain ignored and must be attached as PR artifacts
before any claim of remote reproducibility.

## Minimal prerequisites for a one-file LEB contribution

1. **Implement and prove the legacy ABU migration once.** Add
   `src/calibration/sets/leb.ts`, represent the existing shadow/credit/stock and
   basic/dual-land policies in `src/calibration/types.ts` and the
   `src/presentation/early-reprint-{frame,title,footer,colors}.ts` adapters, and
   register LEB in `tools/build-set-data.mjs`. The guide's older reference to a
   `profiles.ts` registration is insufficient in 0.5.2; generated set data owns
   that registration now. Preserve `Illus. ©`, avoid an invented 1995 legal
   line, and preserve the existing translucent title shadow and land selection.
   Require exact native pixels/layouts against the released source with the
   existing `tests/magic-native-host-compatibility.mjs` differential gate;
   retain the historical assertions. After that migration, numeric calibration
   can be limited to `src/calibration/sets/leb.ts`.
2. **Freeze a trustworthy scoped input study.** Review source-bound original
   visible fields through `tools/accuracy/calibration-study.mjs` and
   `calibration-wording.mjs`, then supply reviewed LEB templates and repair the
   ambiguous observation support in `tools/accuracy/scan-frame-anchors.mjs`.
   Keep `scan-frame-fit.mjs` policy limits intact. Require supported frame strips,
   successful disjoint validation, an interior-sensitivity investigation, and at
   least three calibration/validation names per claimed material. Black/green
   and the sparse red/artifact subsets cannot be declared complete from this run.
3. **Use a native-parity fitting adapter before adoption.** Replace or verify
   the additive differential approximation in `tools/accuracy/beta-validation.mjs`
   against the prepared native painter for every changed component. Fit shared
   asset/geometry/font/ink/symbol policies before pigment, retain all trials,
   and replay the exact frozen study through `calibration-evidence.mjs`. A
   prototype gain that reverses in native edge/fill scores must remain rejected.

The guide checks completed successfully after the first build: `npm run check`
(including rustfmt and strict Clippy), `npm run build`, `npm run test:package`,
`npm run test:magic`, `npm run test:magic-accuracy`,
`npm run magic:calibration:check`, `npm run test:browser`, and
`npm run test:showcase`. Preview used an isolated local port. The showcase
verified that it loads only original local assets. This is not a release or
whole-set calibration approval.
