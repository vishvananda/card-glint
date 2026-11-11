# Frame registration before text review

Scan translation and uniform scale are comparison inputs only. They never alter
library rendering or the normal card browser. The review client fits one bounded
transform per scan against fixed frame-edge templates; the server applies that
transform to the cached scan before scoring or producing overlays. Text controls
cannot change registration, and lettering never participates in the fit.

The templates are built from calibration scans for a set, stock, frame family
and material. Their target coordinates are established once by the shared frame
study. This is baked reference geometry, not a second runtime per-set offset.
A scan does not target its particular card's rendered frame: source-asset shape
errors remain visible and separately flagged.

Alpha uses 18 calibration and 18 separate validation printings across the five
colors and artifacts. Existing ABU assets remain unchanged. Normalized gradient
profiles measure the thin printed plate border and adjacent shadow, excluding
the faint rectangular edge outside several source bitmaps. The shared study
places the reference at scale 1.0002, x +0.30 px, y +1.35 px in a 488 × 680 card.
Median plate correlation improves from 0.499 to 0.819 on calibration and from
0.488 to 0.770 on validation. No validation card regresses beyond the fixed gate.

Client fits are bounded to less than 3 px translation and 0.6% scale. They require
strong matches on all four sides; uncertain scans remain diagnostic and cannot
accept text proposals. All 36 study references pass this separate confidence
check. A land reference extension uses three calibration and six held-out dual
lands; all nine pass scan alignment. Its missing striped renderer asset remains
explicitly unvalidated and flagged. It does not influence the shared frame fit.
Basic lands and other source asset families are not covered by this profile.

Verified original wording and an accepted scan fit permit text review even when
a known renderer frame asset is imperfect. The persisted comparison records the
profile hash, exact scan hash, client transform, confidence, normalized images
and renderer version. Changed inputs or comparison policy invalidate scores.

Current order: deploy and score Alpha for text review; extend frame registration
to remaining old-frame sets, then new-frame sets; resume remaining set symbols.
Rejected or sparse cohorts do not silently inherit another set's registration.

Run `node games/magic/tools/accuracy/old-frame-registration-study.mjs lea` to
reproduce the shared study from the frozen reference cache. The tool accepts
other sets with one ordinary family/stock and sufficient frozen samples.
`tests/magic-plate-registration.mjs` checks known subpixel transformations,
contrast changes, exclusion of text pixels, bounded rejection and composition.
