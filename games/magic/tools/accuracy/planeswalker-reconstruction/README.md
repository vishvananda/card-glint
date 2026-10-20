# Blue planeswalker reconstruction experiment

**Review status:** the v5 type-box PNG edge fit was rejected visually. Its RGB and
nearest-edge overlap gains do not certify the outline. Keep its geometry
experimental. The background-only follow-up compares a pinned alternative asset
plus HSB against reconstruction through the actual painter. See the adjacent
`drawn-shapes/README.md` for the measurement method and remaining work.

This offline prototype fits the outer blue texture and type-box asset separately.
It does not alter the shipped painter, calibration tables or default frame URLs.
Use an external output directory. Never commit downloaded scans or reconstructed
rasters to the public showcase, README images or the library package.

From a built checkout with its pinned toolchain and Node dependencies:

```sh
export MAGIC_ACCURACY_CACHE=/path/to/existing/accuracy-cache
TOOLS=games/magic/tools/accuracy/planeswalker-reconstruction
STUDY=/path/to/external/blue-walker-study
node "$TOOLS/fetch.mjs" "$STUDY"
node "$TOOLS/capture.mjs" "$STUDY"
python "$TOOLS/fit.py" "$STUDY" fit
BLUE_WALKER_CANDIDATE="$STUDY/fit" node "$TOOLS/capture.mjs" "$STUDY"
python "$TOOLS/replay.py" "$STUDY" fit
```

The Python environment needs NumPy, SciPy, Pillow and PyTorch; tested versions are
listed in requirements.txt. The CPU build of PyTorch is sufficient. Fitting uses
two CPU threads. A browser captures the component controls once per batch; fitting
iterations use PyTorch rather than launching Chromium. A fresh native painter
replay verifies the final asset pixels. Fetch honors the shared content-addressed cache and an optional
`--offline` flag; capture refuses external bytes absent from its snapshot.

Selection is deliberately narrow: monoblue, ordinary English paper, high-resolution
nonfoil scans, no frame effects, three printed ability blocks and rare/mythic stamp
treatment. M15, SOI, XLN, M19, WAR and M20 provide six examples. Inspect new scans
before expanding this family: static/uncommon, four-block, showcase, borderless,
art-overprint and alternate-geometry frames are not interchangeable. MTGJSON's
modernized Legendary label on the two older Jaces is corrected only for these
exact scan hashes; raw provider fields are preserved.

Exterior pigment rails establish a bounded affine scan pose with disjoint fit
and validation strips. Type boxes, lettering, symbols and illustrations never
participate in registration. The pose freezes before fitting. Rejected scans do
not contribute to the objective. Each card gets its own background visibility
and UV controls because loyalty badges and overprints occlude different pixels.
Those are measurement controls, not per-card renderer adjustments.

Background RGB gain, offset and a smooth shared residual field are learned through
the native compositing response; source alpha stays fixed. The type plate has
eight shared shape parameters, low-frequency color and a distance/normal-based
bevel correction. Straight edges cannot develop local waves. Masks exclude ink,
art and the neighboring rules-paper boundary; matched lowpass and coarse fields
prevent reconstruction of scan dots. Background corrections are carried into the
type underlay before fitting the plate. No per-card palette or texture is learned.

The replay measures actual fresh painter PNGs on identical native scan masks,
checks pixels outside both component supports, and writes `review/data.json` and
local comparisons. Color error is channel MAE out of255, lower is better. Type and
top-right corner edges also get separate luminance overlap/distance measurements.
These are regional diagnostics, not Lab's whole-card compliance score. SOI and
M20 are omitted from optimizer gradients, but were inspected during development;
do not describe them as a fresh blind holdout. M20's top-right mean edge distance
still slightly regresses despite improved overlap: inspect that corner before
promoting the asset. Typography, the solid blue frame layer, rules paper and stamp
remain unchanged and require separate validation.

## Background-only alternatives

Keep cached pinned alternative assets in an external directory with their URL/hash
manifest (see `fixtures/accuracy/blue-planeswalker-background-alternatives.json`).
Use the same six-scan snapshot produced above. The output and variant files below
are external artifacts, not shipped assets.

```sh
python "$TOOLS/background_hsb.py" "$STUDY" /external/alternatives /external/backgrounds
python "$TOOLS/export-backgrounds.py" "$STUDY" /external/alternatives /external/backgrounds
# Variant manifest: [{"id":"cc-hsb","file":"/external/backgrounds/cc-regular/planeswalker-bg-U.png"}, ...]
node "$TOOLS/capture-backgrounds.mjs" "$STUDY" /external/variants.json /external/backgrounds/native
python "$TOOLS/evaluate_backgrounds.py" "$STUDY" /external/backgrounds
```

Include `current-hsb`, `cc-hsb`, and `backprop` variants to reproduce the report.
The HSB fit changes only hue, saturation and brightness; no per-card correction,
local residual field or shape fit is used. Alternative full plates are sampled
into the current background component coordinates with its alpha retained. The
final replay uses the native painter and identical raw-scan masks, then proves no
pixels outside the background support changed. Regional channel MAE is /255,
lower better; it is not a whole-card compliance score.
