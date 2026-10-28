"""Known geometry/polarity controls for the offline large-symbol measurement."""
import importlib.util
from pathlib import Path
import numpy as np
from scipy.ndimage import gaussian_filter
spec = importlib.util.spec_from_file_location(
    "basic_fit", Path(__file__).resolve().parents[1] /
    "games/magic/tools/accuracy/old_frame_basic_fit.py")
fit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fit)
y, x = np.mgrid[:680, :488]
# Asymmetric glyph identifies independent horizontal/vertical scale and shift.
alpha = (((x - 242) / 51) ** 2 + ((y - 508) / 62) ** 2 < 1).astype(float)
alpha[((x > 242) & (y < 503)) | ((x < 220) & (y > 521))] = 0
alpha = gaussian_filter(alpha, .65)
truth = np.array([2.3, -1.4, 4, -3])
a = fit.warp(gaussian_filter(alpha, .55), truth, x.ravel(), y.ravel(),
             (244, 507.5)).reshape(alpha.shape)
paper = np.stack([.74 + .02 * (x - 244) / 120,
                  .72 + .01 * (y - 507.5) / 90,
                  np.full(x.shape, .68)], axis=-1)
for ink in [np.array([.15, .22, .13]), np.array([.97, .94, .88])]:
    rgb = a[:, :, None] * ink + (1 - a[:, :, None]) * paper
    result = fit.fitted(alpha, rgb)
    assert result["accepted"], result
    np.testing.assert_allclose(result["parameters"], truth, atol=.08)
    np.testing.assert_allclose(result["after"]["foreground"], ink, atol=.002)
    assert result["after"]["loss"] < result["before"]["loss"] * .01
flat = np.broadcast_to([.72, .71, .69], (680, 488, 3)).copy()
assert not fit.fitted(alpha, flat)["accepted"], "Flat paper cannot approve a glyph"
outside = fit.warp(gaussian_filter(alpha, .55), [15, 0, 4, -3],
                   x.ravel(), y.ravel(), (244, 507.5)).reshape(alpha.shape)
rgb = outside[:, :, None] * [.15, .22, .13] + (1 - outside[:, :, None]) * paper
assert not fit.fitted(alpha, rgb)["accepted"], "Out-of-range shift must remain rejected"
print("Known shift/independent scales and both ink polarities recovered; flat and boundary cases rejected.")
