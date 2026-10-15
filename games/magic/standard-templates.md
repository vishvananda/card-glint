# Standard template defaults

The [catalog](fixtures/templates/mse-standard.json) records numeric layout facts
and font names from Full Magic Pack revision
`16f1d13bb7f5924613fc1ddc25da582beccfefb6`. Each style has its source URL and
SHA-256. Dynamic expressions are marked unresolved; they are not evaluated or
copied into the renderer. Images remain external references under the
[Magic pack notice](NOTICE.md).

Coordinates retain the source's native pixel dimensions. Text sizes are points:
MSE's [`Font::toWxFont`](https://github.com/twanvl/MagicSetEditor2/blob/master/src/data/font.cpp)
uses 96/72 pixels per point. The compositor applies that conversion to text,
then scales the native canvas to the pack's 488 × 680 coordinates. Symbol sizes
are independent of that text conversion.

| Layout                              | Rendering status                                                     | Next review                                                            |
| ----------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Future                              | Explicit template, shaped art mask, vertical mana cost               | Curved cost placement, art crop, foil variant, type icon and footer    |
| Kamigawa flip                       | Explicit template, both panels and inverted reverse                  | Statistics plates, font matching, panel spacing and footer             |
| Battle                              | Explicit landscape template, rotated to physical scan orientation    | Transform indicator, art crop, panel shape, stamp and footer           |
| Double-faced / modal / meld         | Cataloged; host may show separately labeled ordinary-frame fallbacks | Dedicated indicators, reverse frames, linked panels and meld geometry  |
| Prototype / mutate                  | Host may retain all text in an ordinary-frame fallback               | Dedicated inset/panel geometry and materials                           |
| Room                                | Existing two-panel fallback                                          | Shared frame, doors, reminder and footer                               |
| Saga / Class / leveler              | Existing dedicated painters                                          | Host must preserve the layout, including enchantment-land Sagas        |
| Modern / eighth / retro / Adventure | Existing painters; defaults cataloged                                | Compare alternative source plates before replacing calibrated geometry |

These new defaults have no scan-fitted color, symbol or typography profiles.
They do not inherit ordinary-frame calibration or scoring eligibility. Missing
assets or overflowing text at the minimum size reject preparation explicitly.
Each new template's geometry feeds the same face, art, semantic-region and
cache paths as other Magic layouts. A grayscale source mask is converted once
per decoded image during preparation and reused; animation performs no mask
readback or decoding.

Original flip wording can arrive from MTGJSON as the complete card repeated on
both face records. The accuracy adapter separates it only when the pair,
divider and reverse-face header agree exactly. Original type words remain
intact even when Oracle has creature-type errata. Ambiguous data requires
review rather than truncation or silent Oracle substitution.

Review these defaults against Card Conjurer and other pinned assets before
claiming scan accuracy. Rendering coverage and calibrated accuracy are separate
states.
