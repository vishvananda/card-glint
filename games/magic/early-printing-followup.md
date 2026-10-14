# Early printing title and dual-land corrections

The title study fits shared translations in 488 × 680 card coordinates while
keeping the scan-frame transform frozen. Four UUID-sorted ordinary,
nonlegendary cards per available nonland material alternate between training
and validation. A CPU raster search proposes offsets; the real Canvas renderer
then replays them. All 114 runtime headers match their frozen proposals to
within one byte per channel. Nothing below the title strip moves.

| Set            | Translation x / y | Reserved cards | Title match before / after |
| -------------- | ----------------- | -------------: | -------------------------: |
| Alpha          | −1.5 / +1.5       |             12 |            0.6621 / 0.6845 |
| Beta           | −1 / +2           |             12 |            0.7077 / 0.7354 |
| Revised        | unchanged         |             12 |            0.4506 / 0.4506 |
| Eighth Edition | +0.5 / −2         |              8 |            0.5263 / 0.5814 |
| M21            | −1 / +1           |             12 |            0.8760 / 0.9145 |

These are lettering similarity indices, not percentages of correct pixels.
Revised's lower match needs a separate font-shape/weight study; a translation
does not improve it. Legendary, special layouts, other stocks and other sets
do not inherit these offsets. The evidence and exact scan hashes are in
`fixtures/accuracy/title-placement.json`.

All 39 dual-land printings and all four Dwarven Warriors printings in Alpha,
Beta, Unlimited and Revised have individually checked original type labels:
`Land` and `Summon Dwarves`. Partial reviews are bound to the printing UUID and
scan hash; they do not certify rules text. Original and Oracle views retain the
same semantic frame palette while showing their respective type lines.
MTGJSON `originalType` is retained as audit data, not an automatic override:
these entries currently contain modern types.

ABU dual lands combine the two pinned colored land plates through Card
Conjurer's `old/abu/dualLand.png` alpha mask. Its blue RGB is visualization,
not printed color. The mask preserves the art aperture and produces alternating
nested paper bands and colored frame lines. The new source assets do not inherit
the old neutral-land HSB coefficients. Their colors still need a separate fit.
Revised's different striped-paper treatment remains unimplemented.

The composite is prepared once and retained in an 8 MiB derived-material cache.
It has a separate budget from the 16 MiB HSB cache because it borrows HSB leases
while building; sharing that budget could deadlock concurrent preparations.
Cache keys include pinned sources, dimensions and their calibration recipe.
Animated frames do no decoding, mask readback or composition.

Registration uses independent scan-frame templates. The rejected Beta Bayou,
Badlands and Dwarven Warriors scans remain rejected: corrected names, types and
renderer assets cannot change those frame-only gate results. Their comparison
images are diagnostic until the template/scan disagreement is resolved.

Beta's original mana costs now use the reviewed ink fit by default: shared
spacing and horizontal placement, separate numeral placement, larger black and
green glyphs, and the centered white sun. Disc size and vertical position stay
unchanged. Editor adjustments are deltas from these printing defaults; Oracle
words with explicitly original symbols also retain them. Modern symbols, inline
symbols, other printings, other stocks and special layouts do not inherit them.
The material preparation cache still separates glyph ink from its stationary
disc once per source. No new reads or decoding occur during animated rendering.

An independent replay of 81 complete cards reproduced the reviewed candidate
pixels exactly with no editor adjustment supplied. A fresh normalization of all
302 Beta scans accepted 296 and rejected the same six, with identical poses and
confidence values. The 81 browser replays also reproduced their stored normalized
scan hashes exactly. The remaining rejects are Bayou, Badlands, Mountain, Swamp,
Healing Salve and Dwarven Warriors. One additional card has a content-review flag;
registration acceptance does not imply every text component is verified.

The mana-height check separates outer-disc edges from the adjacent frame rules.
Across colors, median rebuilt discs lie about 0.6–0.8 canonical pixels below their
scans, while the upper frame and art-frame rules lie about 0.75–1.5 pixels below.
This makes the circles appear high relative to our frame. On 36 held-out cards,
moving the costs down 0.5 pixels reduced mean mana edge overlap from 0.8387 to
0.8088; moving down 1 pixel reduced it to 0.7609. The independent 36-card fitting
group agreed. These are overlap indices, not fractions of a whole card that are
correct. The ring detector's maximum response to an inner-white-glyph-only change
was 0.28 pixels, so subpixel landmark estimates remain diagnostic. Frame-rule
placement, the six rejected frame matches, ABU dual colors and Revised striped
paper remain follow-up work.
The per-card mana results and replay hashes are recorded in
`fixtures/accuracy/beta-mana-placement.json`.

Source: [Card Conjurer ABU frame pack](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/js/frames/packABU.js),
[pinned stripe mask](https://github.com/joshbirnholz/cardconjurer/blob/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/old/abu/dualLand.png).
Magic imagery belongs to Wizards of the Coast; see [fan notice](NOTICE.md).
