# Original and Oracle wording

[Magic pack](../README.md) · [Documentation index](README.md)

`resolvePrintingWording(printingId, { oracle, original }, options)` is a pure,
offline resolver for bundled, reviewed original-printing corrections. Hosts
continue fetching provider data. Its `PrintingText` inputs keep `rulesText`
(rules only) and optional `flavorText` separate; optional `rulesParagraphs` holds
structured rules and flavor runs. It returns `{ wordings, provenance }`, ready
for `withCardWording`. Save both results with the provider records.

```ts
import { resolvePrintingWording, withCardWording } from 'card-glint/magic';
const resolved = resolvePrintingWording(scryfallPrintingId, { oracle, original });
const visible = withCardWording(face, resolved.wordings, 'original');
// Persist resolved.wordings and resolved.provenance with the imported printing.
```

Corrections match the exact Scryfall printing ID, never a card name or set-wide
guess. They affect original wording only. Unknown IDs preserve supplied text;
missing original data stays missing. Multi-face corrections require
`{ faceName: 'Stomp' }`. Optional `referenceSha256` requires an exact match to the
reviewed scan; a mismatch returns unchanged wording and `reference-mismatch`.
Provenance records status, catalog revision, field-level before/after values,
source fixture, reason and reviewed scan hash. Matching by ID alone does not
claim that a newly downloaded scan was verified. Partial type/name reviews do
not certify unrelated body text. The public catalog is generated from the same
evidence used by accuracy tools; regenerate it with
`node games/magic/tools/build-printing-corrections.mjs` after reviewing changes.

Printing corrections can reproduce omitted paragraph breaks as well as textual
misprints. A `rulesParagraphs` entry may contain upright rules and italic flavor
runs in the same paragraph; a newline inside a run remains an explicit break.
Keep the provider's rules-only `rulesText` and separate `flavorText` alongside
those display runs. Dragon Whelp's seven English printings before Fourth Edition
use this treatment: the quotation starts inline and the attribution starts on a
new line. Fourth Edition and Oracle wording retain separate flavor paragraphs.
No card-name exception is needed in the painter.

`resolvePrintingArtist(printingId, providerArtist, { referenceSha256? })` resolves
reviewed printed artist credits separately from wording. It returns
`{ artist, provenance }`; assign `artist` to the face before choosing original or
Oracle wording, and retain the provider's canonical name in your source record.
For example, the reviewed Planar Chaos printings credit “Dan Scott” while the
catalogs identify “Dan Murayama Scott.” These corrections match exact printing
IDs and have the same optional scan-hash guard. Unknown IDs and mismatched scans
preserve the supplied credit. Reviewing the artist does not certify copyright
text or other footer fields.

`withCardWording(face, { oracle, original }, mode)` keeps the selected printing's
frame, art and typography while choosing supplied wording and symbol style. The
mode defaults to `oracle`; requesting an absent `original` throws. Each wording
requires `typeLine` and `rulesText`, with optional styled `rulesParagraphs`, separate
`flavorText`, mana
cost, stats, and `name` for titles that differ in the original printing. Supply
the title in both wordings when switching names. Missing paragraph overrides
are cleared when switching modes.

```ts
import { withCardWording, magic } from 'card-glint/magic';
const visible = withCardWording(
  face,
  {
    oracle: { typeLine: 'Creature — Elemental', rulesText: currentRules },
    original: { typeLine: 'Summon Force', rulesText: printedRules },
  },
  'original',
  { rulesAlignment: 'original' },
);
const recipe = magic.describe(visible, 'inspect');
```

The optional fourth argument also accepts `symbolStyle: 'original' | 'modern'`.
For example, `withCardWording(face, wordings, 'oracle', { symbolStyle: 'original' })`
keeps Oracle wording and types while using the printing's supported historical
symbols. It covers both header mana and inline symbols. Omission defaults to
modern symbols with Oracle wording and original symbols with original wording.
This choice is independent of centering. Before Revised, tapping was written
out; Oracle `{T}` tokens on those printings use Revised's tilted T as the
earliest-symbol fallback. Original written-out wording is unchanged. Revised
uses the tilted T and Fourth through Seventh use the tilted-card mark where
that era is supported.
[Wizards' history of the tap symbol](https://magic.wizards.com/en/news/making-magic/25-random-things-about-magic-2009-02-16)
describes those transitions.

Use `includeFlavorText: true` to combine Oracle rules with the selected
printing's flavor text. Supplied Oracle flavor takes precedence; otherwise the
helper copies the `role: 'flavor'` paragraphs (including styling and alignment)
or separate `flavorText` from `original`. It does not copy original rules or
change either source record.

```ts
const visible = withCardWording(face, wordings, 'oracle', {
  includeFlavorText: true,
});
```

`includeFlavorText: false` omits Oracle flavor. Leaving it unspecified preserves
the supplied Oracle wording. Original-mode selection always keeps the original
printing intact. Automatic Oracle text fitting includes the flavor that will
actually be displayed. The option is also accepted by `fromScryfallCard` and
`fromMtgjsonCard`; those provider imports already include their supplied flavor
by default.

The fourth argument chooses `rulesAlignment: 'left' | 'original' | 'oracle'`.
`left` disables automatic rules-text centering; flavor attributions retain their alignment. The other choices determine automatic centering
from that wording, independently of which wording is displayed. The default is
the displayed mode; requesting a missing alignment source throws. Explicit
paragraph alignment takes precedence over automatic centering.

To fit using the wording being rendered, omit the alignment override: the
selected mode supplies its own reference. For an exact scan comparison, use
`withCardWording(face, wordings, 'original')`; keep an Oracle centering preference
on the separate Oracle rebuild. Historical automatic centering also participates
in size-tier selection, so an Oracle reference is not a neutral choice for an
original-printing comparison. Alpha/Beta Oracle overflow keeps its physical inset
and reduces the font size rather than falling back to a wider box.

The early-set rule is empirical: in Alpha, Beta, Unlimited and Revised, a
rules-only passage that fits in five lines at the set's large size is centered.
A short keyword heading can precede it; flavor blocks and longer passages use
the smaller left-aligned layout. Aura eligibility (`Enchant …`) remains with
the centered body. Styling such as italic reminder text does not change the
panel inset. This is a shared set policy, not a claim to reproduce every
historical typesetting decision. Oracle mode may shrink below the original
printing's minimum size to fit full modern reminders without deleting text.

Flat inputs can force `rulesAlignment: { mode: 'left' }` or supply
`{ mode: 'auto', reference: paragraphs }` for the same classification behavior.
The reference affects layout only; its words are never painted.

The helper selects one face; apply it to each supplied child of a split card.
Flat presentation inputs still work. Their optional `wordingMode` controls
the default symbol era; an explicit `symbolStyle` overrides it. Omitting both
preserves the existing set-based policy.
Oracle mode also disables automatic historical basic-land vocabulary and Fourth
Edition stat notation. Modes are included in raster cache identity. The helper
does not fetch or certify printing data, and never guesses historical subtypes
from Oracle types. Hosts should retain field-level provenance: MTGJSON's
`originalType` is modernized for some early printings, including Revised Force
of Nature and Unlimited Howling Mine. The accuracy fixtures contain scan-hashed
corrections for those two examples.
