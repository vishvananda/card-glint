# Frozen ordinary-frame scan templates

These are comparison inputs, not renderer offsets. They normalize printing
scans against fixed printing geometry, preserving real asset aspect errors.
Frame selection and all calibration/validation UUIDs precede measurements.
The source scans remain in a content-addressed cache; only profiles and
attributed reference metadata are included here.

| Set | Ordinary high-resolution nonfoil inventory | Alignment accepted | Excluded |
| --- | -----------------------------------------: | -----------------: | -------: |
| LEA |                                        295 |                291 |        4 |
| LEB |                                        302 |                296 |        6 |
| 3ED |                                        306 |                306 |        0 |
| 8ED |                                        357 |                352 |        5 |
| M21 |                                        283 |                272 |       11 |

Each material reserves the first eight UUID-sorted scans (or half of a smaller
cohort) for calibration. All other scans are independent validation examples;
the artifact records their hashes, outcomes, and unresolved alignment reasons.
All materials have at least three calibration and three validation scans.

LEA/LEB/3ED use twelve broad printed-frame gradient strips and the existing
bounded translation/scale fitter. Eighth Edition uses fixed printed-stock
side targets and the existing held-out strip gates for translation/scale,
rotation, and skew. M21 uses twelve broad frame strips with its bottom windows
moved above the footer, avoiding the stamp and power/toughness box. Its windows
are included in the artifact. No art or text overlap objective drives a fit.

A denser profile experiment was less reliable on dark/textured frames and
mixed land treatments. It was not adopted. The unresolved rows remain review
items instead of widening acceptance gates or assigning card-specific offsets.

Changing an artifact invalidates dependent scores. Decode references at the
pack's intended asset resolution and keep each card's accepted scan transform
fixed while comparing candidate typography or symbol placement.
