# Shared frame reconstruction experiment

These offline tools compare a supplied blank frame with full native card
renders. They do not change defaults, the public API, or release calibration
status. Keep externally supplied assets, cached scans and generated galleries
under ignored `test-results/`; the Magic pack's source and fan-content policy
still applies.

The first experiment uses one Alpha white source and one shared geometry/color
profile. Frozen scan transforms are measurement inputs, never renderer options.
The full native painter supplies wording, fonts, symbols, art and compositing.
Only trusted frame pixels drive texture fitting: excluded lettering, artwork,
symbols and boundary halos cannot teach a compensating mark to the frame.

## Reproduce

Use a Python 3.12 virtual environment with `requirements.txt`. Generate Magic
data with `npm run magic:data:build`. The capture takes existing cache-only
study snapshots (`inputs.entries`, poses and component hashes); it does not
download or silently replace missing assets.

```sh
node games/magic/tools/accuracy/frame-reconstruction-input.mjs \
  INPUTS.json POSES.json COMPONENTS.json lea W test-results/frame-study

# Place the supplied 1062 x 1482 source here:
# test-results/frame-study/inputs/sharpened-frames/alpha-white-frame.png
python games/magic/tools/accuracy/frame-reconstruction-fit.py prepare test-results/frame-study
python games/magic/tools/accuracy/frame-reconstruction-fit.py fit test-results/frame-study
node games/magic/tools/accuracy/frame-reconstruction-native.mjs \
  test-results/frame-study INPUTS.json COMPONENTS.json train
python games/magic/tools/accuracy/frame-reconstruction-evaluate.py test-results/frame-study

PYTHONPATH=games/magic/tools/accuracy python -m unittest frame_reconstruction.test_model -v
```

Set `MAGIC_ACCURACY_CACHE` to reuse another checkout's content-addressed cache.
Do not use the same output directory for different input revisions. Capture
records source/scan hashes and the exact native baseline. Native replay must
match every released full-card PNG pixel before candidate comparisons proceed.

## Interpretation

- A deterministic split by Oracle identity holds out names from reconstruction.
  These are previously inspected development scans, not independent validation
  of the complete renderer. After evaluating the held-out result, `fit --all`
  refits the same procedure on every card; label that output as a full-data fit.
- Geometry uses median strips and one monotone shared panel remap. It cannot
  move a separate frame for each card. Current input poses are exploratory
  historical registrations; they do not certify the stricter contributor guide.
- Native scans remain untouched in the loss. The model samples the candidate
  into each scan. A matched 1.4-native-pixel Gaussian suppresses dot structure;
  evaluation also reports 3-pixel filtering. It is a restricted continuous-tone
  experiment, not a calibrated CMYK printing/scanner simulator.
- Shared HSB is fitted first and frozen. Backpropagation then optimizes a
  bounded 133 x 185 scalar texture residual, interpolated onto the source. It preserves
  dimensions and alpha and retains the source's existing high-frequency detail.
  Updates require at least five-card coverage and exclude dark stock. Shared
  HSB supplies color; the scalar texture fit cannot introduce colored speckles.
  A prior and smoothness term discourage unsupported changes. Coverage outside
  the observed patches must not be presented as recovered detail.
- Report frame and paper separately, with color error and boundary shifts.
  The contrast/structure SSIM term is an index out of 100, not a percentage or
  the Lab whole-card score. A better value alone is insufficient: inspect native
  full cards, residuals, masks and texture stability before adopting an asset.

The differentiable HSB model rejects unsupported material operations. Keep
rounding outside autograd; compare quantized exports with the native `colorFrame`
operation. Do not apply the old source's HSB correction a second time to the
new calibrated material. Geometry is applied to a derived render plate; exported
reconstructed source PNGs retain the original aperture and alpha exactly.
