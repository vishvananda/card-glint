# Futureshifted frames

[Magic pack](../README.md) · [Documentation index](README.md)

Future's optional `futureTreatment: 'regular' | 'full-art' | 'clear'` describes
the physical printing, independently of Oracle wording. Full-art plates have no
rules panel and reject nonempty body text instead of silently dropping it.
Colorless cards default to regular plates; the optional clear fan treatment is
never inferred from color identity. Regular plates use their visible art window
for fitting; explicit clear plates need a full-height illustration. Some Scryfall futureshifted art crops omit the curved
left side and cannot reproduce that window without a better source.

For a known incomplete illustration, `illustrationPlacement: [x, y, width, height]`
sets the supplied image's rectangle in normalized card coordinates. The frame's
art aperture stays fixed. Uncovered areas receive a solid color sampled once
from the source perimeter; they remain missing artwork for comparison purposes.
Painting, artwork edges and optical layers share this placement. Omit it for the
usual cover fit of a complete illustration. The regular FUT Scryfall 540 × 448
crops match `[105 / 488, 84 / 680, 353 / 488, 293 / 680]`; hosts must select this
only for that crop family. The 573 × 720 textless FUT crops instead match
`[72.25 / 488, 84.75 / 680, 374.5 / 488, 471 / 680]`. Neither placement applies
to arbitrary replacement art. This setting cannot reconstruct the omitted curved edge or artwork
behind translucent printing.

For ordinary FUT W/U/B/R/G plates, `colorCalibration: 'set-hsb-v1'` applies
source-bound frame, paper and panel corrections. Curved source masks keep the
paper, title and type interiors separate; P/T uses its own material. Derived
bitmaps share the material cache, with no recoloring during animation. All 46
reserved paper regions improve in the [color replay](../fixtures/accuracy/future-colors.json).
The report retains panel regressions and unchanged controls. A separate
[sparse-material replay](../fixtures/accuracy/future-sparse-colors.json) covers
artifacts, land footer and neutral panels, land white/green paper, colorless,
and four textless colors. Failed land blue/red paper and textless green-frame
transfers retain source values. Ghostfire has only within-printing evidence;
Mass of Ghouls has no accepted pose. Material texture and blend differences
remain review items. These numbers do not certify typography or whole-card accuracy.

The pinned FUT expansion symbols use separate measured placements for Conjurer
regular, MSE regular and MSE full-art plates. Width and height are independent.
All 55 reserved cards improve on grayscale edge overlap, edge distance and Census
similarity in the [symbol replay](../fixtures/accuracy/future-set-symbols.json).
Custom symbols and other printings retain the source template's default bounds.

Future's shared title and type-line lettering retains Matrix Bold after comparing
the available MSE fonts. With frozen frame-only scan poses, mean two-polarity
edge F1 on 57 reserved printings improves from 0.693 to 0.767 for titles and
0.533 to 0.793 for type lines. Five title and two type-line regressions remain
visible in the [header replay](../fixtures/accuracy/future-headers.json); these
component scores do not certify rules, footer lettering or whole-card accuracy.

The independent [footer replay](../fixtures/accuracy/future-footer.json) improves
artist-credit overlap on all 53 reserved regular-frame cards. The larger artist
fit regresses the four accepted textless cards, so that physical frame retains
its source sizing. Mean reserved copyright/collector overlap improves from
0.573 to 0.698 and P/T overlap from 0.660 to 0.738. The report retains individual
regressions; full-art artist placement remains review work.

The [rules replay](../fixtures/accuracy/future-rules.json) retains the existing
MPlantin font, fitted sizes and line breaks, adjusts the shared block position,
and removes the unprinted flavor divider. Broader font and spacing trials had
large wrapping regressions and were rejected. The original validation cohort
was reused for these comparisons; it is not an untouched test set. Printed
size and optical weight still vary beyond this shared default. Reviewed
Grandeur labels retain their printed italics and dash without replacing flavor
text or changing Oracle wording.

Across all 81 futureshifted FUT cards, the [structural report](../fixtures/accuracy/future-fullset.json)
improves from 53.0/100 to 72.6/100 on 80 independently accepted scan poses; all 80
improve. Mass of Ghouls remains excluded for its weak bottom-edge alignment.
The 99 ordinary FUT cards are outside this frame study. These fixed-region
similarity scores exclude color, incomplete artwork and legal-text diagnostics;
they are not percentages of correct pixels. River of Tears, Witch's Mist and
Street Wraith lead the remaining text/frame review queue. The local score map
still needs integration into the review application.
