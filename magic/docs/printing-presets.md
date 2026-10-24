# Printing presets and artwork placement

[Magic pack](../README.md) · [Documentation index](README.md)

`printingPresets`, `printingPresetCompatibility`, `printingElementSupport`,
`resolvePrintingPreset` and `resolveScryfallPrinting` are available through
`card-glint/magic` and `card-glint/magic/presentation`. These are game-pack
presentation APIs; the renderer core has no set or frame vocabulary.

A printing preset changes the complete style: frame family/treatment, set-driven
geometry, fonts, ink calibration, mana glyph era, set symbol, legal defaults and
collector formatting. The starter catalog contains Alpha, Beta, Unlimited,
Revised, Fourth Edition, Legends, Mirage, Seventh, Eighth, ordinary and
Colorshifted Planar Chaos, ordinary and Futureshifted Future Sight, M15 and M21. It is a
selection of existing painter policies, not a claim that every material or set
has the same scan-calibration coverage. `match` preserves supplied printing
fields. Unknown IDs throw; hosts can check compatibility to show an explanation.

```ts
import {
  magic,
  printingPresets,
  printingPresetCompatibility,
  resolvePrintingPreset,
  type PrintingSelection,
} from 'card-glint/magic';

// Save the source card and selection separately. Never replace source with resolved.
const selection: PrintingSelection = {
  preset: 'plc-colorshifted',
  overrides: {
    collectorNumber: '77',
    collectorTotal: 165,
    legalText: null,
    elements: { artist: { offset: [0, -3] } },
  },
};
const choices = printingPresets.map((preset) => ({
  ...preset,
  ...printingPresetCompatibility(source, preset.id),
}));
const presented = resolvePrintingPreset(source, selection);
const recipe = magic.describe(presented, 'inspect');
// Use this same presented face for live previews, PNGs and video frames.
```

Changing the preset resets prior frame/template flags, custom set symbols,
symbol placement, credit/legal formatting, collector total/language and border
choices to the preset. Source artist, card text, stats, illustration, colors and
collector number remain authored content. Explicit overrides are reapplied.
The resolver does not mutate either source or overrides. Omitting an override
(or assigning `undefined`) restores the preset/source value; `null` hides artist,
legal text, collector information or the set symbol. Empty strings are literal
text values, not reset commands. `collectorTotal: null` suppresses the denominator;
`collectorSetCode` edits the visible modern code without changing the style set.
`setCode` changes the underlying set policies and symbol together. A custom
`setSymbol` image URL overrides the preset symbol, including on core-set frames
that normally omit one. Number formatting supports `number-first` or `rarity-first`.
Language and set-code lines apply only to the modern footer; older painters do
not gain an invented language line. Old frames show a custom collector number
only when an explicit number/total override requests it.

`elements` supports `artist`, `legal`, `collector`, `manaCost` and `setSymbol`.
Each accepts `hidden` and an `[x, y]` translation bounded to ±100 reference pixels
in the painter's 488 × 680 coordinates. Native prefixes, brush symbols, fonts,
colors and shadows move as a group; this is not a second host text renderer.
Copyright embedded in a native artist prefix (such as Legends’ “Illus. © 1994”)
remains part of that artist group; the legal control changes the separate legal
notice. Movement preserves text reservations rather than reflowing the card. Reset by
removing the element override. Security stamps use the existing `securityStamp`
choice. Arbitrary font replacement, title/rules dragging and bounding-box
editing are outside this prototype. Unknown element options throw.

The element controls currently support ordinary single faces and Futureshifted
faces. `printingElementSupport` reports that scope. Special layouts keep their
existing painters and do not silently substitute an ordinary frame. Whole spell
split cards support retro, Eighth and modern presets; Futureshifted and
Colorshifted splits are rejected. Element movement on composite cards is not
implemented. For two physical sides, resolve each side independently: a host can
link their selections or let the user choose separately. Standalone transform,
modal DFC, reversible and meld sides normalize to ordinary face painting, while
the host retains the original card relationship. Text wording remains controlled
by the existing wording API and is independent of physical frame selection.

`resolveScryfallPrinting(record)` maps physical printing metadata: `frame: future`
selects Futureshifted; `2003` selects the Eighth family; `1993`/`1997` selects
retro; `2015` selects modern. `frame_effects: ['colorshifted']` selects the Planar
Chaos treatment. Set membership alone never implies a special frame: both
ordinary and special printings exist in Future Sight and Planar Chaos. Resolve
from a fresh source presentation rather than merging over stale frame flags.
Recognized borders/stamps are retained; missing stamp metadata means `none`.
Textless Future flags select full-art, whose existing painter rejects body text.

After `npm run build && npm run preview`, open
`http://127.0.0.1:4283/card-glint/presets/printing-presets.html` for hover/focus
previews, touch selection, advanced controls and PNG export. The browser release
also includes `printing-presets.html`. It uses original illustration art and the
Magic pack's externally hosted, pinned frame/font assets. Run
`npm run test:printing-presets` with the preview running (`LAB_URL` can override
its base URL). No host application or engine checkout is required.

### Selection contract v1 and artwork

`printingPresetApiVersion === 1` identifies this selection contract. Persist the
source card separately from `{preset, overrides?, art?}`. IDs are stable strings;
unknown presets and options throw instead of selecting a different frame. Hosts
should use compatibility results to disable unsupported options and show reasons.
A symbol override can use `setSymbolCode` to select an official set's symbol
without changing frame calibration, fonts or the collector code; `setSymbol` is
the alternative custom image URL. Supplying both is an error. Rarity still comes
from the card. Resetting either reveals the preset's symbol.

`art` is independent of preset ink overrides:

```ts
const selection = {
  preset: 'fut',
  art: {
    mode: 'behind-text', // or 'window'
    focalPoint: [0.4, 0.6],
    zoom: 1.25,
    paperOpacity: 0.8,
  },
};
const presented = resolvePrintingPreset(source, selection);
```

`artPlacementSupport(face)` lists supported modes for the resolved frame.
Ordinary physical faces support `window`. Futureshifted faces with a rules panel
also support `behind-text`, retaining lettering and physical frame details.
Special/composite art positioning is not implemented yet. A host switching to a
frame without behind-text support should explicitly change the selection to
`window` and remove `paperOpacity`; the renderer rejects incompatible requests.
The separate textless Future treatment still rejects supplied body text.

The focal point is a normalized point in the cropped source image, measured from
the top left. Zoom is relative to cover fitting and lies within 1..8. Placement
is clamped to avoid gutters. Omitted fit values mean center and 1×. Behind-text
paper opacity defaults to 0.8 and accepts 0..1; it is supported only in that mode.
The regular CC source has opaque rules paper: the optional treatment lowers alpha
inside a source-space paper aperture while retaining its texture, rim and all
later printing. It does not claim that ordinary paper printings are transparent.
No frame decoding or readback is added to animation frames.

`resolveArtPlacement(face, art)` applies this same public contract independently
of preset resolution. The result is a new face; the source/selection are not
mutated. The low-level face field is `artPlacement`.
`artworkGeometry(face, imageWidth, imageHeight)` returns normalized `source`,
`destination` and `aperture` rectangles for a crop UI, using the physical 488:680
card aspect ratio. Painting, CPU etching, GPU masks and exports share cover fit;
the core's optional game-neutral `EdgeSource.fit` carries focal point and zoom.
Moving art reuses decoded sources and detected edges; only composition changes.

Legacy `illustrationCrop` is a source-image trim. `illustrationPlacement` positions
an incomplete imported crop in its original frame. Non-match preset resolution
and explicit user art placement remove the latter, so its frame-bound offset
cannot leak into another style. Replacing an image should discard both source
corrections and reset focal point/zoom. Retain the chosen art mode if supported.
The existing default rendering and cache identities remain unchanged when new
options are omitted.

## Reusable set styles

The public `PrintingStyle` API adds shared defaults, named alternative frames,
ordered color/type/layout rules, custom symbol variants and card/face inheritance.
See [the style contract and examples](printing-styles.md). The built-in
`printingStyles` catalog groups regular and alternate frames within each set.
Set membership, persistence and authoring remain host responsibilities.
