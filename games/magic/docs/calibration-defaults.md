# Calibration defaults and printing colors

[Magic pack](../README.md) · [Documentation index](README.md)

Compatible M15-era frames use the shared M21 layout and typography when they have
no exact profile. This includes source-compatible mana and basic-land symbols,
headings, ordinary body text, power/toughness, footer styles and printing colors
when color calibration is enabled. Dedicated layouts retain their own geometry.
Eighth/2003 frames use the separate Eighth baseline described below.
Older families and Futureshifted, flip and leveler layouts keep their own policies. An explicit M15 asset-family choice can override the implicit set era.

Source-bound independent fits take precedence. M21 collector exceptions, rarity
labels, foil-star printing IDs and planeswalker-deck collector IDs never transfer.
Original and Oracle wording each fit their own text. These defaults are a starting
point for other sets, not a claim that those printings have been calibrated.
`resolvePrintingCalibration(face).defaults` identifies inherited styles.

Use `calibration: 'printing'` for exact-set profiles only. `calibration: 'source'`
keeps source colors while retaining the chosen frame's layout and typography.
`calibration: 'auto'` also fills compatible material gaps. Existing
`colorCalibration` controls remain supported.

With `card-glint/magic/lazy`, await `prepareMagicCards(faces)` before synchronous
asset, layout or cache-key queries. It loads M21 calibration only for compatible
modern faces (or explicitly requested material defaults), never M21 wording.
The lazy compositor does this automatically. `loadMagicSet(code)` also loads
the shared calibration dependency for modern sets, preserving existing set-only
callers. Face-aware preparation avoids that extra data for later retro treatments
and exact-only policies. The compatibility `card-glint/magic` entry remains eager.

## Eighth-style defaults

Ordinary Eighth-style frames inherit the named `8ed-eighth` baseline. The
interior geometry and materials are shared, while white and black surrounds
remain separate. Exact set or component fits win. The recipient keeps its
expansion symbol, copyright and collector data. Printing-specific centering and
Original wording exceptions do not transfer. Dedicated Planar Chaos and special
layouts remain independent. See the [Eighth audit](eighth-edition.md).

`loadMagicSet(code)` loads the Eighth donor for known Eighth-era sets;
`prepareMagicCards(faces)` uses the actual selected frame and policy.
Exact-only preparation avoids the donor, including faces with inherited set codes.
Alpha-only views download neither modern donor.

## Older-frame defaults

Ice Age now uses Fourth Edition's profile as an inherited starting point for
ordinary monocolor, artifact and supported land frames. Its black surround,
Original wording, mana glyph era and expansion symbol remain local. Gold,
custom frames and exact-printing policies keep their existing defaults.
Independent set profiles take precedence. Enable printing colors as described
below to use the donor's source-bound frame/paper adjustments.

The lazy loader shares the Fourth calibration chunk; it does not load Fourth
wording or ship a duplicate Ice Age profile. The calibration report labels these
materials as fallback from `printing:4ed` and includes an inheritance notice.
It does not mark Ice Age independently calibrated.

Other old sets retain their existing profiles and family fallbacks. For the next
release, independently fit Mirage and Onslaught, then compare Fourth, Mirage and
Onslaught as donors for each remaining set. See the
[experiment and reproduction steps](../fixtures/accuracy/old-frame-defaults/README.md).
There is no named, universally applicable old-frame profile.

## Measured set colors

Set `colorCalibration: 'set-hsb-v1'` to opt into admitted printing-color profiles. LEA, LEB, Revised, Eighth and M21
have additional fits against frame-normalized, reserved scans; Eighth uses its
2003 plate and M21 its component frame. See the [five-set color audit](five-set-colors.md).
Separate HSB adjustments cover the outer frame and rules paper; mana discs
have independent targets. Source-derived masks follow irregular green/black
paper edges, including their shadows. Other paper interiors use fixed masks. `early-hsb-v1` restricts the trial to Alpha,
Beta, Unlimited and Revised. Omission keeps original source colors. Unsupported,
sparse and rejected groups stay unchanged; this option is not an assertion that
every printing is calibrated. The default artwork and lettering are untouched.

Profiles are shared by set, border stock and material. A different source URL or
placement disables its frame profile. The [calibration report](hsb-calibration.md)
records coverage, reserved results and exclusions. These are matches to cached
scan colors, not measurements of physical printing ink.

`colorCalibrationCoverage(face)` reports whether the exact face receives a
frame profile and which visible mana symbols have targets. Hosts should use
this to distinguish adjusted materials from source colors. Rejected profiles
do not fall back to older combined frame/paper coefficients. The
[Revised audit](calibration-rollout.md#revised-color-audit) explains why one HSB
multiplier cannot match both frame and paper reliably. Admission checks frame
chroma, shadow tint and texture contrast independently of average color, using
frame-normalized scans and reserved cards.

Recolored bitmaps are prepared once and shared across cards and raster tiers in
a 16 MiB Magic-owned LRU cache, in addition to the host's source-image budget.
Whole-face admission waits when concurrent work exhausts that budget. This limit
counts retained and pending decoded results; temporary Canvas/ImageData staging
is additional. Pack disposal retires cached results after active leases finish.
No decoding, pixel readback or color conversion occurs during animated frames.
Historical symbol backings use the same source resolver in direct composition
and the public pack, preserving white details in both paths.
