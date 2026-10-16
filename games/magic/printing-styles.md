# Reusable printing styles

`card-glint/magic` exports `PrintingStyle`, `PrintingStyleChoice`,
`printingStyles`, `validatePrintingStyle`, `resolvePrintingStyle`,
`printingStyleOptions`, and `composePrintingSelection`. These are pure presentation
APIs. A host owns set membership, persistence, revision IDs, asset uploads and its
editor UI. Existing `PrintingSelection` values and `resolvePrintingPreset` remain
supported.

A style offers named frame options, rather than equating one set with one frame.
The built-in Planar Chaos style offers regular and colorshifted frames. Future
Sight offers regular, Futureshifted, full-art and clear frames. Their automatic rules preserve
explicit source treatment/template markers. Colors alone cannot distinguish
those printings; an importer should still use `resolveScryfallPrinting`.

```js
const style = {
  version: 1,
  id: 'mixed',
  label: 'An original mixed-frame set',
  collectorSetCode: 'MIX',
  symbols: { default: '/symbols/common.svg', rare: '/symbols/rare.svg' },
  defaults: { overrides: { legalText: 'Original custom set', collectorTotal: 180 } },
  defaultFrame: 'regular',
  frames: [
    { id: 'regular', label: 'Regular', selection: { preset: 'plc' } },
    { id: 'shifted', label: 'Colorshifted', selection: { preset: 'plc-colorshifted' } },
    { id: 'future', label: 'Futureshifted', selection: { preset: 'fut' } },
  ],
  rules: [
    { id: 'artifacts', when: { artifact: true }, frame: 'regular' },
    { id: 'red', when: { colors: ['R'], land: false }, frame: 'shifted' },
    { id: 'blue', when: { colors: ['U'] }, frame: 'future' },
  ],
};
const automatic = resolvePrintingStyle(card, style);
const manual = resolvePrintingStyle(card, style, { frame: 'regular' });
const perFace = resolvePrintingStyle(
  card,
  style,
  {},
  {
    frame: 'future',
    overrides: { collectorNumber: '42' },
  },
);
```

## Resolution and inheritance

Frame selection uses face choice, then card choice, then the first matching rule,
then the declared default frame. Rule order is authored and stable; there is no
implicit specificity score. Conditions within a rule are ANDed; listed types,
layouts, templates, treatments and rarities are any-of. `colors` is an exact,
unordered palette, including `[]` for colorless; `colorCount: [2, 5]` matches
multicolor. `colorSource: 'card'` uses semantic colors; the default `'printing'` uses
the source printing palette, including basic-land palettes, before any explicit
`frameColors` recoloring. A palette override never selects a different frame.
Same-side split cards match the union of their panel palettes. Type conditions
also honor the semantic creature/artifact/land/legendary traits retained by the
wording adapter.

Presentation combines the chosen frame selection, shared defaults, printed set
identity, matching rule defaults, card overrides, and face overrides, in that
order. A manual frame choice overrides the frame decision while retaining the
matching rule's other defaults. Rules are evaluated once before palette overrides, preventing recursive frame
selection or a recoloring effect from switching the chosen frame.

Omission inherits. Existing null values retain explicit-hide semantics. Clear a
local override to return to its parent's value; `false` and `[0, 0]` are explicit
visibility/position overrides. Nested element and symbol-transform fields merge;
coordinate arrays replace atomically. The APIs clone supplied data and never
modify the source card or definition. Resolve once from the original card and
combined selection, rather than applying successive painted outputs as presets.

Calibration set codes belong to the chosen preset, or explicit `styleSetCode`.
The style's `collectorSetCode` and symbols supply its printed identity without
replacing those calibration sources. Existing `setCode` overrides remain
supported; using both code overrides is an error. Presentation `frameColors`
never rewrites semantic colors, mana cost or color identity, and never participates
in frame-option rules. For a temporary game effect, recolor the already-resolved
printing: `{ ...result.face, frameColors: ['G'] }`. Its preset, template, treatment,
fonts and mana symbols remain fixed. `magic.describe` never reruns style rules.
If semantic colors also change in game state, retain the resolved printing/frame
choice rather than treating those runtime changes as a newly authored card. Custom symbol assets
may vary by rarity; a missing variant uses `default`, while null hides a variant.
Fine symbol transforms are supported for ordinary frames. Futureshifted retains
native symbol geometry and supports the separate element translations.

## Compatibility and storage

`printingStyleOptions` reports supported options and reasons using the effective
palette and overrides. Explicit incompatible frame choices throw. An automatic
incompatible choice tries the declared default; if that also fails, it keeps the
native layout and reports a notice. Unsupported inherited element movement,
symbol fine adjustment or art modes are omitted with notices. Invalid explicit
card/face controls throw, allowing an editor to ask for a correction. Always show
these notices instead of disguising a layout change.

The prototype supports ordinary frames and spell splits for replacement frames;
it does not add painters for every layout. Two-sided cards are resolved once per
physical face with independent choices. Same-side split cards keep one compatible
frame era. Artwork source images and crops normally remain per-card data, even
when a set supplies an art mode or opacity default.

Definitions use schema `version: 1` and contain only bounded serializable data;
unknown fields and invalid dormant rules are rejected. Store the original
source card, the style or its pinned revision, and sparse local overrides. A
share can embed a style snapshot so later set edits do not change the shared
printing. The result includes the resolved selection, chosen frame, decision
source, matched rule and notices for previews, exports and editor explanations.
