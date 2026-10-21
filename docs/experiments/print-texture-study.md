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
