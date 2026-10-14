# Prepared frame investigation

Prepared is the next native-frame implementation after Adventure. It is not
implemented or validated yet. Scryfall's SOS snapshot labels these cards
`layout: 'prepare'`, with creature and spell records on one physical face.
The creature rules are on the left and the spell inset on the right, as shown
in the [official mechanics reference](https://magic.wizards.com/en/news/feature/secrets-of-strixhaven-mechanics).

## Available sources

The pinned CardConjurer revision
`33f2547137fe366b40e9e8dba4eb591af190fddf` already contains
[packPrepare.js](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/js/frames/packPrepare.js)
and `img/frames/prepare/regular/` full plates. The earlier inventory's claim
that no Prepared template existed was incorrect. Its assets include:

- W/U/B/R/G, gold, artifact, land and Vehicle plates, plus Nyx variants.
- Independent masks for the main frame, pinlines, rules panels, inset spell,
  inset right half, inset pinline, and inset title/type bands.
- The standard M15 power/toughness badges, positioned over the right page.

The source definition lists a colorless `c.png`, but that file is absent from
the pinned tree. Do not silently substitute the artifact plate for it.
Downloaded assets remain in the local cache; the library will use pinned URLs.

The source art aperture is `[0.0767, 0.1129, 0.8476, 0.4429]`. Its main rules
panel starts at x=.086, y=.6303, width=808/2010, height=.2875. The spell rules
panel starts at x=1035/2010, y=2059/2814, width=.3947, height=438/2814.
These are source coordinates to validate against scans, not measured printing
corrections. Titles, mana, type, stats and legal lines need their own review.

## Implementation and acceptance

1. Freeze ordinary nonfoil SOS references, full scans and art. Preserve separate
   original creature/spell text and record provider conflicts before scoring.
2. Keep creature identity, stats and full-card art on the parent; retain the
   inset's independent colors, name, mana, type and rules. Never flip the entire
   Adventure raster or interchange the two text records.
3. Composite page and pinline masks during bounded preparation. Share art
   aperture geometry with printing holes, optical effects and hit regions.
4. Fit main and spell text independently; account for the power/toughness badge
   intruding into the right page. Use the newer rarity-first collector footer.
5. Register scans from independent frame rails, excluding text and art, then
   freeze the accepted translation/scale/rotation/skew for all component scores.
6. Review at least one example of every color, a legendary multicolor creature,
   a short spell, long spell and dense creature text; then score the complete
   ordinary cohort and retain rejected fits and regressions.

Studious First-Year / Rampant Growth is the initial visual reference. Emeritus
of Ideation / Ancestral Recall provides a short spell. No per-card renderer
settings should be learned from their scans. Prepared completion does not
complete Rooms, Battles, physical double-faced layouts, or the later queue.
