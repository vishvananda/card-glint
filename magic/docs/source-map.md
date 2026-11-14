# Source map and layout routing

[Magic pack](../README.md) · [Documentation index](README.md)

| Change                                                 | Owner                                                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Card inputs, ordinary rectangles, text sizes           | [face-layout.ts](../src/presentation/face-layout.ts)                                                                           |
| Color pairs, artifacts, lands, legendary crowns        | [profile.ts](../src/presentation/profile.ts)                                                                                   |
| Planeswalker, Saga, Adventure, Class, leveler geometry | [special-frames.ts](../src/presentation/special-frames.ts)                                                                     |
| Measured planeswalker ability text and badge rows      | [planeswalker-rules.ts](../src/presentation/planeswalker-rules.ts)                                                             |
| Retro frame families, old-set mapping and geometry     | [retro-frame.ts](../src/presentation/retro-frame.ts)                                                                           |
| Old/2003/M15 split and Fuse; Room remains a fallback   | [split-layout.ts](../src/presentation/split-layout.ts)                                                                         |
| Frame URL selection and symbols                        | [assets.ts](../src/presentation/assets.ts), [set-symbols.ts](../src/presentation/set-symbols.ts)                               |
| Text wrapping, mana symbols and rules painting         | [canvas-text.ts](../src/presentation/canvas-text.ts)                                                                           |
| Face composition and cache identity                    | [canvas-face.ts](../src/presentation/canvas-face.ts)                                                                           |
| Visible art bounds, cropping, frame overlap            | [art-apertures.ts](../src/presentation/art-apertures.ts), [illustration-layout.ts](../src/presentation/illustration-layout.ts) |
| Pack boundary, etching and foil layer placement        | [index.ts](../src/index.ts)                                                                                                    |

Geometry is normally normalized `[x, y, width, height]` with a top-left origin.
Typography uses the 488 × 680 reference face. Tier `inspect` paints at 732 × 1020;
`native` paints at 488 × 680; `table` paints at 244 × 340. Some layouts override rectangles and wrapping.
These are TypeScript definitions, not a complete declarative frame schema.

Aftermath printings use dedicated native plates and measured rules in each
reading orientation. Set `layout: 'aftermath'` with two `faces`, or use
`layout: 'split'` with an Aftermath second half. Each half can supply independent
art and crop metadata; a parent illustration is treated as the shared split-art
sheet. Native geometry also drives optical and etching apertures. See the
[25-printing comparison and remaining limits](aftermath-layout.md). This does
not validate other split or Room frames.

Old-border and 2003 spell splits use dedicated era plates, per-panel credits,
optional guild watermarks, and one shared Fuse reminder. See the
[split validation and remaining limitations](split-layout.md). M15 spell splits
use high-resolution plates with separate hybrid/gold materials and a shared
footer. Rooms still use the previous fallback; do not reuse split calibration
numbers for them.

Adventure cards use native book plates with separate permanent and inset spell
materials and measured text. Supply `layout: 'adventure'` and two `faces`, ordered
permanent then spell. The parent owns full-card art and permanent identity.
Opt-in `colorCalibration: 'set-hsb-v1'` includes the admitted ELD/WOE spell-paper
profiles; CLB retains its source colors. `collectorFormat` can explicitly select
`number-first` or `rarity-first` for the native Adventure footer. See the
[Adventure comparison and limitations](adventure-layout.md).

Prepared cards have a separate native painter with the creature on the left and
the inset spell on the right. Supply `layout: 'prepare'` and two `faces`, ordered
creature then spell, with the full illustration on the parent. Materials and text
fit independently; legendary two-color crowns and hybrid spell headers retain
their own treatments. See the [Prepared comparison and limitations](prepare-layout.md).
