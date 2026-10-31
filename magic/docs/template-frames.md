# Future, Flip and Battle templates

[Magic pack](../README.md) · [Documentation index](README.md)

`frameTemplate: 'future' | 'flip' | 'battle'` enables initial renderers based on
pinned Magic Set Editor defaults, with Card Conjurer regular Future plates.
Flip and Battle are source-layout starting points; Future calibration remains
in progress as documented above. A flip input needs two `faces` in printed order; a Battle
uses `defense` and is drawn in its physical portrait scan orientation. Future
frames use their shaped art mask. These templates cannot be combined with
`frameAssetFamily`. Missing required plates fail the complete face preparation.

Battle fronts use the boxed illustration aperture rather than fitting cropped
artwork to the full-height spillover layer. Normalized `illustrationPlacement`
stays in physical portrait coordinates; raster painting, `artworkGeometry`,
etching and recipe edge rotation apply the same native landscape transform.
Provider imports recognize canonical Battle fronts with `layout: 'transform'`,
including when displayed type text is localized. Selecting the reverse retains
that face's own ordinary frame and illustration.

A Battle front's optional `reverseStats: { power, toughness }` prints the reverse
creature's P/T reminder independently of `defense`, including zero defense.
Provider imports populate it only from a complete creature reverse.
`battleReverseStatsLayout(context, face)` measures that reminder using the
source's ModMatrix font and bottom-right alignment. It returns native landscape
`x`, `baseline` and `inkBounds`, normalized physical portrait `rect`, and
`rotation: -90`; load the Magic fonts before measuring. The recipe's
`reverse-stats` region identifies its source field. `faceRects(face).stats`
continues to identify defense, not reverse P/T.

The [default catalog and review queue](standard-templates.md) also record source
geometry for DFC, modern, eighth, retro, leveler, Saga and Adventure frames.
Hosts should retain each double-sided face's own illustration and scan, and
label an ordinary-frame fallback explicitly. The catalog does not imply that
every source script or decorative variant is implemented.
