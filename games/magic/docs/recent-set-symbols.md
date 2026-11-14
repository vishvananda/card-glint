# Recent set symbols

[Magic pack](../README.md) · [Symbol sources](set-symbol-assets.md)

The November 2026 source check covers 87 recent set entries and 230 distinct
SVG files. Each file downloaded, decoded in Chromium and produced visible pixels.
This checks asset availability and basic rendering, not scan alignment, rarity
accuracy on each printing or full-set calibration.

## Sources

Continue using Card Conjurer's pinned `official` SVG collection for complete
common, uncommon, rare and mythic artwork. Its white details, outline and
metallic gradients are preferable to recoloring a flat silhouette. Existing
entries already cover the released main sets through Star Trek, including
Reality Fracture, The Hobbit, Marvel Super Heroes, Secrets of Strixhaven,
Teenage Mutant Ninja Turtles and Lorwyn Eclipsed, plus their supplemental sets.

The main Card Conjurer and Keyrune revisions have not changed since our pins.
Recent Card Conjurer forks examined did not add missing modern symbol vectors.
Keyrune's Star Trek branch also has no additional individual SVG files compared
with the pinned SVG directory. MSE's frame pack remains useful for frame assets;
it did not provide a newer ready-to-load symbol collection in this check.

## Newly recognized codes

Forty-six explicit aliases now select an existing symbol:

- Recent promo codes use the corresponding expansion symbol, including `pfra`,
  `psos`, `pecl`, `ptla`, `pspm`, `peoe`, `pfin`, `ptdm` and `pdft`.
- Alchemy codes select the appropriate year mark, including `yfra`, `ysos`,
  `yecl`, `yeoe`, `ytdm` and `ydft`.
- Arena and Pioneer anthologies select the Arena mark. `h2r` selects MH2,
  `ha7` selects the Historic Anthology mark, and `p23` selects the archive mark.

The [catalog](../fixtures/assets/recent-set-symbols.json) lists all codes and
records Scryfall's icon identity. These are explicit mappings, not a rule that
strips `p` or `y` from arbitrary codes. A symbol alias does not copy another set's
frame, wording, placement or calibration. Custom `setSymbol` URLs still win,
`setSymbolSource: 'keyrune'` still selects the older source where available, and
hidden symbols remain hidden. Etching uses the aliased symbol's common artwork.

The Zeta Set (`slz`) now has a Scryfall monochrome SVG fallback. Rarity colors use
the existing silhouette filters; this does not provide the metallic gradients
or rims of a complete styled source. Its URL includes Scryfall's revision query,
but that endpoint is not an immutable Git object. The source audit checks the
recorded checksum so an upstream change is visible for review.

## Still awaiting usable sources

- **MDD / MDC:** Darkhold's announced common-through-mythic PNGs are visible in
  [Keyrune issue 308](https://github.com/andrewgioia/keyrune/issues/308). They are
  not yet available in the checked vector collections. The announcement's media
  and attachment endpoints did not supply CORS headers; Scryfall's symbol URLs
  returned 404. We have not substituted another set's mark.
- **NAU / NAC:** Scryfall currently supplies a generic placeholder. The
  [upstream request](https://github.com/andrewgioia/keyrune/issues/307) also
  records that a usable source is still needed.

## Repeat the check

```sh
npm run magic:symbols:audit
npm run test:recent-set-symbols
```

The network audit caches source metadata and SVGs under
`games/magic/.cache/recent-set-symbols/`. It writes `report.json`, `review.html`
and `review.png` there. Use `-- --refresh` to fetch again, `-- --since 2023-01-01`
to include earlier recent sets, or `-- --cache /path/to/cache` for another disk.
The normal tests run offline and compare 10,248 pre-existing code/rarity/source
combinations against the previous source, plus 1,104 alias combinations.

Source bytes and review images stay in the ignored cache. Only URLs, hashes,
source history and evidence metadata are tracked. A new asset needs its own
scan-normalized placement review before being marked calibrated. Check the
[fan notice and source terms](../NOTICE.md) before using external assets.
