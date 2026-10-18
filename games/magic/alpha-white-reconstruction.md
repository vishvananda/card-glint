# Alpha white frame reconstruction experiment

The supplied white frame, one shared geometry correction and HSB calibration
improved native whole-card structural matching against the released 0.5.2
frame. A constrained texture reconstruction added a smaller further gain.
This is an offline experiment, not an approved set profile or a renderer release.

## Native results

The 34-card fit was evaluated on 11 other white cards, selected deterministically
by Oracle identity before fitting. These scans appeared in prior development
studies; this is a holdout from this reconstruction, not fresh validation of the
entire renderer or of the supplied source asset.

| Mean on 11 held-out cards                      | Released 0.5.2 | Supplied + geometry/HSB | + Reconstruction |
| ---------------------------------------------- | -------------: | ----------------------: | ---------------: |
| Whole-card structure, /100                     |          68.95 |                   74.16 |            74.66 |
| Masked frame/paper structure, /100             |          77.71 |                   77.46 |            85.24 |
| Frame/paper RGB absolute error, 8-bit levels ↓ |           7.33 |                    6.93 |             6.04 |
| Boundary gradient agreement, /100              |          69.57 |                   95.60 |            95.55 |
| Median boundary residual, canonical pixels ↓   |           0.81 |                    0.13 |             0.13 |

The whole-card metric covers about 95.3% of eligible component weight. It is
the externally supplied `printing-structure-v1` diagnostic; it is not the same
metric as the masked frame contrast/structure SSIM term. Scores are indices,
not percentages of correctly rendered pixels. No scores were uploaded to a
production database.

Texture reconstruction improved whole-card structure on all 11 held-out cards
and 43 of all 45 cards. The two development regressions relative to the supplied
calibrated frame were Resurrection (−0.232) and Animate Wall (−0.171).
The separate whole-card frame-edge component slightly regressed on the holdout,
88.50 to 88.46. The texture gain does not establish better edge placement.

After recording this result, HSB and texture were refitted on all 45 cards.
The shared geometry and scan registrations remained frozen. That final asset
has no held-out evaluation; its separate results are in the evidence receipt.

## Forward model and fitting

1. Capture the exact 0.5.2 full-card painter using frozen original-wording and
   original-symbol inputs. Keep artwork, typography, mana and all other layers
   fixed. Candidate captures must first reproduce all 45 baseline PNGs exactly.
2. Preserve each historical scan's affine transform: translation, X/Y scale,
   rotation and shear. These transforms are measurement inputs, not renderer
   defaults. Fit one shared monotone panel remap from median frame boundary
   strips on the 34 calibration cards.
3. Fit shared frame/paper HSB with 80 Adam steps. The differentiable model
   implements the native encoded-sRGB material operations. Apply these new
   source adjustments once; do not also apply the old source's frame correction.
4. Freeze HSB and geometry. Learn a bounded scalar texture residual on a
   133 × 185 grid, bicubically expanded onto the 1062 × 1482 source. Use 200
   Adam steps, Huber pixel loss, a source prior and a smoothness penalty.
   Limit changes to ±0.10 and require support from at least five different cards.
5. Exclude artwork, title/type/footer bands, rules ink, mana, boundary halos
   and dark stock. Match scans at their original resolution with a 1.4-pixel
   Gaussian filter; also report 3-pixel filtered measurements. Do not optimize
   per-card colors, blur or geometry together with the frame.
6. Replay the exported candidate through the native material and full-card
   painter. Evaluate color, frame texture, boundary alignment and whole-card
   structure separately; inspect the native cards and overlays.

The exported source retains the original dimensions and alpha bytes exactly.
The derived render plate applies the geometry remap and therefore changes the
art aperture's rendered placement. Both source and plate are available locally;
the plate already includes HSB and must not receive it again.

An initial unconstrained RGB residual was rejected after training-side visual
inspection because it produced colored blotches and modified dark stock.
The retained scalar residual uses shared HSB for color and leaves stock fixed.
Its apparent texture is only supported where the coverage map shows observations.

This is a restricted continuous-tone reconstruction. It does not yet implement
a physical CMYK screen, ink-spread or scanner point-spread model. The native
Canvas painter is not differentiated: a restricted Torch model supplies gradients,
and native replay checks the exported result. Opaque material colors agree
within one 8-bit level; partial-alpha corner RGB is excluded from that comparison
because Canvas premultiplication rounds it.

## Next experiments

The first three experiments below have now been implemented and measured in
[the refinement follow-up](alpha-white-refinement.md). The list records their
motivation; alternating full layout calibration remains future work.

- Recover a robust shared texture from all supported scan pixels, with an
  agreement/uncertainty map. Subpixel sampling may provide additional detail,
  but detail must recur across independent cards. Use the supplied asset where
  observations disagree or are hidden. This follows the observation-model idea
  in [Bayesian multi-frame reconstruction](https://papers.neurips.cc/paper_files/paper/2006/hash/10ce03a1ed01077e3e289f3e53c72813-Abstract.html).
- Replace the separable panel remap with a small smooth 2D control grid when
  residual overlays show local bevel/curve mismatch. Keep one warp per frame,
  protect straight edges and reject folding. [B-spline free-form deformation](https://webdocs.cs.ualberta.ca/~vis/readingMedIm/papers/RueckertFreeForm.pdf)
  supplies a suitable model; it does not justify distorting every scan to fit.
- Estimate and freeze a restricted print/scan blur model before recovering
  sharper material. Separately test very low-frequency chroma residuals; the
  current reconstruction can change luminance texture but not local hue.
- Alternate shared frame fitting with native layout/font/symbol calibration.
  Full-card metrics are useful for checking the combined result, while component
  masks prevent one layer from absorbing errors that belong to another.

The next experiment should compare each addition independently against this
frozen baseline. A small held-out group is useful while choosing the method;
the final shared asset can then use all available cards.

## Evidence and reproduction

See [the tool instructions](tools/accuracy/frame_reconstruction/README.md) and
[the result receipt](fixtures/accuracy/alpha-white-reconstruction-result.json).
The receipt pins the source archive, strategy, frame, scan bytes, frozen poses,
cohort identities, native outputs, method files and metric modules.
All external images, generated material and galleries remain in ignored local
artifacts; none enters the package, public showcase or README imagery.

The supplied archive is `alpha-dual-land-frames-and-sharpening (1).zip`.
The initial download was truncated and was not used. The local comparison has
scan/released/calibrated/reconstructed columns plus transparent, red/green and
difference overlays. It includes every white card and both fitting cohorts.

The current scan poses use three historical anchors per side, below the newer
contributor policy. Rerun strict frame-only registration and its sensitivity
controls before proposing adoption. Existing text/title differences visible in
the full cards are fixed inputs, not problems this frame experiment resolves.

Verification includes exact native baseline parity, quantized material parity,
source-alpha preservation, four model tests (including synthetic texture recovery
with unmodeled dots), strict Clippy/rustfmt and desktop/mobile comparison checks.
No renderer code, public interfaces, profile values or release status changed.
