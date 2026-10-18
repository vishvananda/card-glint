"""Numerical contracts for the optional reconstruction ablations."""
import importlib.util
from pathlib import Path
import unittest
import numpy as np

spec = importlib.util.spec_from_file_location(
    'refine', Path(__file__).parents[1] / 'frame-reconstruction-refine.py')
refine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refine)


class RefinementTests(unittest.TestCase):
    def test_native_identity_sampling_does_not_translate_half_pixel(self):
        x, y = refine.scan_coordinates((1020, 732, 3), [1, 0, 0, 1, 0, 0])
        yy, xx = np.mgrid[:1020, :732]
        np.testing.assert_allclose(x, xx, atol=1e-10)
        np.testing.assert_allclose(y, yy, atol=1e-10)

    def test_zero_warp_preserves_visible_color_and_alpha(self):
        rng = np.random.default_rng(5)
        source = rng.random((20, 30, 4)).astype(np.float32)
        source[:2, :, 3] = 0
        result = refine.warp_full(source, np.zeros((10, 15, 2), np.float32))
        np.testing.assert_array_equal(result[..., 3], source[..., 3])
        visible = source[..., 3] > 0
        np.testing.assert_allclose(result[..., :3][visible], source[..., :3][visible], atol=1e-7)

    def test_unobserved_pixels_do_not_bleed_into_consensus_smoothing(self):
        values = np.full((60, 60, 3), 100., np.float32)
        weight = np.zeros((60, 60), np.float32)
        weight[20:40, 20:40] = 1
        values[20:40, 20:40] = .25
        result = refine.weighted_smooth(values, weight, 4)
        np.testing.assert_allclose(result[weight > 0], .25, atol=1e-6)


if __name__ == '__main__':
    unittest.main()
