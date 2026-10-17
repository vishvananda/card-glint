# Provider card imports

`card-glint/magic` and `card-glint/magic/presentation` export
`fromScryfallCard`, `fromMtgjsonCard`, and the `CardImportOptions` type.
Both functions return a `MagicCard` ready for `magic.describe`, `opticalDocument`,
the Canvas painter, or the browser renderer. These pure adapters never fetch,
upload, save, start inference, or select a foil finish.

```ts
import { fromScryfallCard, fromMtgjsonCard } from 'card-glint/magic';
const card = fromScryfallCard(scryfallRecord);
const original = fromScryfallCard(scryfallRecord, { wording: 'original' });
const otherSide = fromScryfallCard(scryfallRecord, { faceIndex: 1 });
const customArt = fromMtgjsonCard(mtgjsonRecord, {
  illustrations: ['/my-art.png'],
});
```

Scryfall input is one [Card object](https://scryfall.com/docs/api/cards), including
`card_faces`. MTGJSON input is a [CardSet](https://www.mtgjson.com/data-models/card/card-set/)
or CardAtomic record, or the associated records of one two-face card. MTGJSON
face records are ordered by `side` when supplied. Unrelated records and incomplete
same-side composite layouts throw; neither adapter truncates a multi-face input.
Illustration overrides follow the input record order, so sorting the records never
swaps their artwork. `faceIndex` selects the resulting side order (front first).
CardSet pairs must have agreeing face links and printing identity. CardAtomic
pairs without UUIDs use their shared card name and distinct face names.
Hosts select cards from lists, sets and collections before calling an adapter.

Omitting `faceIndex` assembles split/Aftermath, Adventure, Prepare and flip
layouts, or selects the front physical side of a two-sided card. Explicit
`faceIndex` selects a source face or panel for separate rendering/editing.
Physical frame metadata is retained independently of wording. `frame: future`
is Futureshifted, `frame_effects: ['colorshifted']` is Colorshifted; a set code
alone does not imply either. MTGJSON `frameVersion` and `frameEffects` use the
same resolver. Unsupported source frame effects are not invented by the adapter;
conversion does not certify painter coverage for every provider treatment.

Oracle wording is the default. Original mode uses supplied `printed_*` or
`originalText`/`originalType`, falling back to the supplied Oracle fields where
original fields are missing. This fallback does not certify historical wording.
An agreeing pair of joined original texts is split at its explicit panel divider;
flip cards additionally require the named reverse-face header. Ambiguous joined
records throw instead of printing both panels' wording on each face. Reviewed
historical mana ordering applies in original mode independently of glyph style.
Hosts can use `resolvePrintingWording` for reviewed exact-printing corrections.
Reminder and flavor text use explicit italic runs; flavor remains separate from
rules. Original glyph styling and set color calibration are the defaults;
`symbolStyle: 'modern'` opts into modern symbols. Semantic colors and mana cost
remain distinct from frame-palette overrides applied after importing.

Only Scryfall `image_uris.art_crop` is used as illustration. Full-card scans are
never guessed to be cropped art. MTGJSON has no illustration field, so its output
has no art until the host supplies `illustrations`. When supplied, this array
must contain one URL or null per source face and replaces provider artwork;
null explicitly omits artwork. Downloading, crop corrections for incomplete
source art, uploads, authentication and URL persistence remain host concerns.
The provider reference URLs must be HTTPS. Explicit host illustration references
may be relative URLs, blob URLs, or another renderer-supported source.

Printed land colors use basic subtypes or a one/two-color `produced_mana` palette.
MTGJSON instead recognizes literal `{T}: Add …` mana sentences. Ambiguous lands
retain the default palette; hosts may set `frameColors` explicitly. Color identity
is not used to guess their frames. Split faces without explicit colors use their
own costs and the parent colors, preserving independent panel palettes. Dedicated
planeswalker, leveler and composite painters remain independent of the 2003 frame
era. Conversion does not certify scan accuracy or source art completeness.
