# Finish strength and print-texture study

The pending finish adjustment increases gloss reflection by 10% in both studio
and compatibility lighting and reduces cardstock relief by 10%. The public
settings and composition order are unchanged. In particular, cardstock still
modulates the finish; it does not darken ordinary printed ink.

The Beta Forest study compares all three LEB printings with original wording.
It uses nine blank paper patches, a single scan resize to the 732-pixel card
reference, local log-RGB high-pass spectra, and enlarged frame/type/rules crops.
The spectral comparison ignores screen phase and broad pigment differences.
It is a texture diagnostic, not the whole-card accuracy score.

The existing library defaults (amount .35, period 2, variation .5) produce
1.93–3.71 times the scan patches' fine-gradient energy. A finer/softer candidate
(amount .20, period 2, variation 1, edge spread .16 screen cells) reduces the
spectral loss from 1.300 to .363. Its gradient energy is .49–.95 times the scans'.
These numbers do not establish that the light-gap shapes match.

The current viewer preset explicitly supplies amount .15, period 3, variation 1
and inset .035. It has different frequency content from the library defaults,
despite similar total gradient energy. Both controls are included in the study.

Additional previews reduce black separation, replace it with colored plates,
or remove plate jitter. A further trial uses less-absorbing ink impressions to
create light gaps within larger colored areas. No printing default or shader
model has been promoted:
the scans' small light gaps and diamond-like clusters still need visual review.
The shared gloss/cardstock change is independent of this study.

[Zoomed comparison](https://tetrarcum.com/alpha/dots/) includes the Land type
line, colored frame and text box. Shine and cardstock relief are disabled in
that comparison to isolate ink. Scans and render crops remain deployment-only;
they are not included in the renderer package or public showcase assets.

## Soft separation and CMYK experiments

The stronger light/dark candidate retains the slight patchy edge softness and
brightness-guided gaps. New alternatives soften the completed dot pattern with
a 3×3 binomial kernel at offsets of .45 or .70 reference pixels (roughly .32
or .49 pixel standard deviation). The source color stays fixed at the current
fragment while integrating the pattern, so this does not blur the lettering.
This global softness follows the contrast-tail adjustment; soft dot edges alone
do not remove those sharp tails.

A separate CMYK candidate adds fixed subpixel plate registration, smooth drift,
slight directional spread, stable irregular dot edges, and local ink variation.
All noise is anchored to the printing; it never changes with time or card tilt.
These are offset-press approximations, not a nozzle simulation. Mechanical ink
spread and optical dot gain are distinct effects; this experiment does not claim
to reconstruct the original press or its color profile.

[Shades of Halftone](https://blog.maximeheckel.com/posts/shades-of-halftone/)
and [Paper’s CMYK article](https://paper.design/blog/retro-print-cmyk-halftone-shader)
provide useful comparisons: independently rotated channels, source sampling at
the center of each dot, neighboring-dot overlap, and soft edges. A cell-centered
sampling alternative is included alongside direct per-pixel sampling. It may
trade edge fidelity for more coherent dots, so review text as well as blank
patches. Our screen angles and neighboring-dot union were already present.
For the distinction between physical spread and paper scattering, see
[Mechanical and Optical Dot Gain in Halftone Colour Prints](https://www.imaging.org/common/uploaded%20files/pdfs/Papers/1999/RP-0-93/1810.pdf).

To regenerate candidates, put native Original face rasters named
`face-NUMBER.png` (732×1020) in a private study directory, then run from the
repository root:

```sh
node games/magic/tools/accuracy/print-texture-candidates.mjs "$STUDY_DIRECTORY"
```

The tool writes 400×365 frame/type/rules crops and a parameter/source-hash
manifest under that directory’s `preview/`. It uses the actual cached-print
fragment and its 2×2 screen integration in a headless WebGL2 context. Readback
is offline evidence generation only. The 3×3 global-pattern integration and
cell-center sampling increase this experimental capture cost; no runtime
performance claim or production default change is implied. Do not add external
scans or art crops to the repository or public showcase.

Paper’s [interactive shader](https://shaders.paper.design/halftone-cmyk) is also
rendered separately in the private preview. Those trials use its actual ink/dots
implementation with 1.7- and 1.5-reference-pixel periods, high precision, slight
grid noise, soft edges, no added grain overlay, and a 35% blend. The default
coarse filter size is not used. A 4×4 pixel-area integration in linear light
prevents the very fine screen from being judged through alias patterns; the
underlying source color is held fixed during that integration. Source and its
Apache-2.0 LICENSE/NOTICE are retained with the private experiment. Paper’s
shader is not bundled into card-glint or installed as a runtime dependency.
