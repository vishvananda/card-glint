# Native Adventure frames

Adventure uses pinned full book plates, independent permanent/spell materials,
and measured text. Set `layout: 'adventure'`, with `faces` ordered permanent
then inset spell. The parent owns the full-card art and permanent identity.
Native art geometry also drives printing holes, optical effects and hit regions.
Prepared is a separate right-inset layout; it must not use this painter.

## Sources and preparation

The pinned CardConjurer revision `33f2547137fe366b40e9e8dba4eb591af190fddf`
provides 1500 × 2100 plates in `img/frames/adventure/regular/`, plus book-left
and pinline masks. Its [frame definition](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packAdventure.js)
defines two header bands and independent text pages. The
[MSE Adventure style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/blob/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-adventure.mse-style/style)
provides further text-fitting and material-selection references. Hybrid label
paper comes from the same pinned MSE source used by modern splits.

The permanent and spell retain their own colors, costs, names, types and rules.
Two-color pinlines, hybrid labels, artifact plates, legendary crowns, native
power/toughness badges and stamps are composed separately. Prepared materials
use a 16 MiB LRU keyed by decoded sources, set and calibration policy. RGB paper
calibration occurs only during preparation on a cache miss; no render-loop
readback, decoding or font loading occurs. Borrowed source bitmaps remain owned
by the asset loader.

Beleren Bold Small Caps supplies artist and power/toughness lettering. WOE uses
rarity-first, four-digit collector numbering; `collectorFormat` lets hosts select
`number-first` or `rarity-first` explicitly. The host supplies the printed serial;
the renderer does not infer collector totals.

## Comparison inputs and corrections

The cohort contains 111 ordinary nonfoil-eligible printings: ELD 30, WOE 51,
CLB 30. Full scans, art and provider metadata are locally cached. MTGJSON repeats
joined `originalText` on both face records for 109 cards. That field follows the
printed book order (spell first), while face identity is permanent first. The
adapter separates only an identical pair with exactly one delimiter.

Two CLB reprints instead contain unrelated original text and types on both
records: Bonecrusher Giant and Embereth Shieldbreaker. These are invalid inputs,
not font regressions. The adapter now rejects identical unsplit panel text unless
scan review has supplied independent fields. The
[reviewed corrections](fixtures/accuracy/adventure-printing-corrections.json)
are bound to exact scan hashes and preserve the rejected provider values. They
also restore Oakhame Ranger's printed Elf Knight type without the later Ranger
erratum. Changes to the physical scan require another review.

The immutable `adventure-v0217-input-v3` baseline recaptures affected cards using
v0.2.17 and the same corrected inputs as the candidate. Collector totals are
removed for printings beyond their numbered main set. Earlier input-v2 and
native-v2/v3/v4 captures retain the bad CLB fields and cannot substantiate those
cards' text scores. Their historical receipts are marked as superseded.

## Normalization and typography

Frame-only registration measures outside rails and the straight book edge,
excluding art, lettering, symbols, stats and stamp. Its target is an independent
**uncalibrated** frame raster: changing paper tone cannot change the target's
edge selection. Both renderer versions use the same accepted normalized scan.
Rejected fits remain raw and unscored; acceptance gates are not relaxed.

ELD development sweeps selected the permanent-page position and a shared spell
policy: a passage that fits within four measured lines at 20.25 canonical pixels
keeps that size, while longer passages fit down from 22.5. This avoids expanding
short spells into spare page space. It uses measured glyphs and style runs, not
a character-count cutoff. Explicit left alignment is honored; a single short
permanent rules line can center. Body text excludes the power/toughness badge.

The [refined receipt](fixtures/accuracy/adventure-refined.json) records the
complete cohort, hashes, regions, rejected fits and all 14 component regressions.
No card overflows its text area. WOE and CLB retain the ELD-selected text policy.

| Set               | Accepted / total | Permanent text F1 | Spell text F1 | White inset headers F1 |
| ----------------- | ---------------- | ----------------- | ------------- | ---------------------- |
| ELD (development) | 25 / 30          | 0.237 → 0.519     | 0.315 → 0.649 | 0.457 → 0.872          |
| WOE (held out)    | 43 / 51          | 0.282 → 0.467     | 0.370 → 0.545 | 0.516 → 0.881          |
| CLB (held out)    | 12 / 30          | 0.320 → 0.547     | 0.321 → 0.626 | 0.459 → 0.892          |

These are local-contrast text-edge F1 scores at a one-pixel tolerance, not visual
accuracy percentages. Inset headers use light-ink polarity. Stomp improves from
0.309 to 0.861 in ELD and 0.338 to 0.794 in CLB. CLB's low registration acceptance
limits conclusions about its complete set.

## Paper color

Opt-in `colorCalibration: 'set-hsb-v1'` applies separate W/U/B/R/G spell-paper
profiles for ELD and WOE. The correction follows the curved body edge and keeps
the header bands, left fold, book outline and bottom rail intact. It is applied
before two-color page blending. Gold and artifact paper have no fitted profile.

Profiles were fitted on alternating accepted ELD mono-color cards. Remaining
ELD cards and later sets are reserved checks. Neutral hues are locked to prevent
near-gray paper from acquiring a spurious tint. Actual raster samples, rather
than only predicted transformed medians, are retained in the paper receipt.
The [paper receipt](fixtures/accuracy/adventure-paper.json) records mean Oklab
color distance ×100 (lower is better): reserved ELD 13.27 → 0.84, and WOE
10.72 → 3.38. All admitted mono-color holdouts improve. Every normalized pose
matches the uncalibrated comparison, and CLB's paper samples remain identical.
CLB deliberately retains its darker source material: the ELD correction worsens
some of its printings. One blue calibration has a small predicted highlight-
clipping fraction, retained in the diagnostics.

## Remaining limits

- Cast Off, Granted and several other spells still have incorrect wrapping.
  Permanent-page spacing and type/title widths have visible outliers. No per-card
  exploratory optimum is installed in the runtime.
- Header material colors, paper texture, stamp detail and some hybrid materials
  remain approximations. The paper HSB study does not certify those components.
- Thirty-one scans fail independent frame registration and are unscored.
- Nyx plates and further Adventure treatments are not validated by this cohort.
- The deployed search adapter still needs dedicated special-frame routing;
  the complete comparison gallery remains separate from the library.

```sh
node tests/magic-special-frame-input.mjs
MAGIC_CAPTURE_ROOT=/path/to/v0.2.17 node games/magic/tools/accuracy/adventure-input-revision.mjs adventure-v0217-input-v3
node games/magic/tools/accuracy/adventure-study.mjs adventure-native-v5
node games/magic/tools/accuracy/adventure-paper-check.mjs adventure-native-v2 adventure-native-v5
node tests/magic-adventure.mjs
node tests/magic-adventure-registration.mjs
```

Captures are immutable and ignored by Git; choose new labels when reproducing.
One browser session prepares a batch, while subsequent structural/color scoring
runs on the CPU. External images never enter the public showcase or package.
