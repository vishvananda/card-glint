# Measuring drawn shapes

Treat a frame family as a physical design, not a set-code alias. Ordinary modern,
legendary, planeswalker three/four-block, old-frame, split and other treatments
must be reviewed separately. Match ordinary high-resolution nonfoil scans.

## Order

1. Finish planeswalker type contours: identify the light-face boundary, outside
   keyline, bevel and shadow separately. The first freely recolored PNG edge fit
   was rejected visually; its improved RGB/nearest-edge scores do not certify it.
2. Check ordinary modern curves: title, type, rules, stats, art aperture and stock
   corners, with legendary and land variants kept separate.
3. Compare alternative planeswalker background assets and a shared HSB-only fit
   before considering reconstruction. Adjust this component alone.
4. Work through the remaining code-drawn print shapes by frame family.

`inventory.mjs` finds Magic-owned Canvas path/primitive/clip operations and groups
them by function. Each group starts **unmeasured**. Classify bitmap clips, printed
outlines, source masks, preparation-only rectangles and host UI separately before
counting physical shapes. This inventory does not certify source-bitmap curves.

```sh
node games/magic/tools/accuracy/drawn-shapes/inventory.mjs /external/inventory.json
node games/magic/tools/accuracy/drawn-shapes/capture.mjs /external/modern m15 m21 war
python games/magic/tools/accuracy/drawn-shapes/register.py /external/modern
python games/magic/tools/accuracy/drawn-shapes/measure.py \
  /external/modern/registration.json /external/modern /external/modern/curves.json
```

Set `MAGIC_ACCURACY_CACHE` to the existing content-addressed reference cache.
Capture uses original printing wording and a single cached browser batch. Python
needs the adjacent planeswalker-reconstruction requirements. Registration and
measurement are offline; optimization must not launch a browser for every trial.

## Measurement rules

- Freeze scan translation, scale, rotation and shear using exterior rails only.
  Keep disjoint registration fit/check strips and reject uncertain poses. A type
  outline must never align its own scan.
- Prefer a source mask or image-derived contour to an invented rounded rectangle.
  MSE coordinates are placement defaults; they do not necessarily describe a
  bitmap's actual bezel or curve. Record the asset revision/hash.
- Probe across a boundary with a known gradient polarity and ordered transitions.
  Distinguish outside frame → dark keyline → highlight → interior, and the reverse
  ordering on the other side. Missing or competing transitions stay uncertain.
- Separate straight-edge displacement from corner-shape residuals. Fit shared
  Bézier controls/line widths against consensus measurements, with no per-card
  renderer geometry. Check each corner independently.
- Freeze geometry before fitting color. Keep outline, inset bevel and cast shadow
  distinct. Inspect the underlying asset aperture too: shrinking an overlay can
  expose a larger black hole beneath it. Do not erase that with free RGB painting.
- Report paired-probe coverage, median/p95 contour residuals, line thickness and
  uncertainty. Penalize duplicate boundaries. A tolerant nearest-edge F1 can
  reward an extra parallel highlight; it is not acceptance evidence on its own.
- Replay through the actual painter, inspect color/transparent/difference views
  and verify pixels outside the intended component remain unchanged. Use matched
  lowpass sampling, premultiplied alpha and the same canonical coordinate system.
- Check reserved cards/sets before promoting a shared rule. Previously inspected
  reserved scans are not blind validation. Publish numeric evidence and source
  provenance without committing external scan/frame binaries into the showcase.

`measure.py` currently probes the **inner light-face transition of a type box**.
It excludes lettering/symbol areas, rejects similarly strong competing peaks and
reports corner residuals after subtracting straight-edge displacement. It does
not yet measure every outer contour, shadow, badge or card corner. Extend its
explicit probe policy for those families; do not silently reuse this type policy.

## Provenance and first results

The current planeswalker type Path2D was introduced locally in c405dc90 and
adjusted in 5bea7258/c0744260. Its 14px upper-right and 7px lower-right quadratics
are our approximation, not imported MSE control points. The planeswalker art clip
was traced from the pinned frame raster. Ordinary modern curves are predominantly
baked into the pinned component bitmaps; the code adds cap/bevel corrections.
Future/flip/battle template defaults explicitly come from pinned MSE styles.

The first modern diagnostic captures 18 W/U/artifact examples across M15, M21 and
WAR. Registration accepts 15; rejected and ambiguous measurements remain visible.
This is an initial type-curve audit, not a full-family completion. Mizzium Tank also
exposes a colored-artifact material mismatch; do not let a color fit hide it.

See `fixtures/accuracy/modern-curve-audit.json` and
`fixtures/accuracy/blue-planeswalker-background-alternatives.json` for numeric
evidence. Production geometry/assets are unchanged by these experimental tools.
