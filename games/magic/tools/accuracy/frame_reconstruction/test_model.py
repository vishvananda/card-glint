"""Known-truth checks for the offline reconstruction model (CPU only)."""
import unittest
import numpy as np
import torch
import torch.nn.functional as F
from .model import adjust_hsb, color_frame, gaussian, sample_scan
from .geometry import normalize, scan_card_coordinates


class ReconstructionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        torch.set_num_threads(2)

    def test_identity_tone_and_gradient(self):
        torch.manual_seed(1)
        x = (.1 + .8 * torch.rand(1, 3, 7, 9, dtype=torch.float64)).requires_grad_()
        self.assertTrue(torch.allclose(adjust_hsb(x, {}), x, atol=1e-12))
        adj = {'hueDegrees': 3, 'saturationScale': .8, 'brightnessScale': .91}
        self.assertTrue(torch.autograd.gradcheck(lambda a: adjust_hsb(a, adj), (x,)))

    def test_frozen_scan_coordinates(self):
        matrix = [1.003, .001, -.002, .997, 1.2, -.8]
        x, y = scan_card_coordinates((1040, 745), matrix)
        image = np.stack([x, y, x * 0, x * 0 + 1], -1)
        result = normalize(image, matrix)
        yy, xx = np.mgrid[:680, :488]
        np.testing.assert_allclose(result[10:-10, 10:-10, 0], xx[10:-10, 10:-10], atol=.0001)
        np.testing.assert_allclose(result[10:-10, 10:-10, 1], yy[10:-10, 10:-10], atol=.0001)

    def test_known_texture_with_unmodeled_dots(self):
        torch.manual_seed(4)
        y, x = torch.meshgrid(torch.linspace(-1, 1, 72), torch.linspace(-1, 1, 64), indexing='ij')
        clean = (.6 + .07 * torch.sin(x * 8) + .04 * torch.cos(y * 5))[None, None].repeat(1, 3, 1, 1)
        dots = .08 * torch.sin(x * 80) * torch.cos(y * 91)
        observations = [gaussian(clean + dots[None, None].roll(i, -1), 1.4).detach() for i in range(3)]
        delta = torch.nn.Parameter(torch.zeros(1, 3, 18, 16))
        optimizer = torch.optim.Adam([delta], lr=.02)
        initial = torch.full_like(clean, .6)
        before = float((clean - initial).square().mean())
        for _ in range(80):
            optimizer.zero_grad()
            candidate = initial + F.interpolate(delta, clean.shape[2:], mode='bicubic', align_corners=False)
            loss = sum((gaussian(candidate, 1.4) - v).square().mean() for v in observations)
            loss.backward()
            optimizer.step()
        after = float((candidate - clean).square().mean())
        self.assertLess(after, before / 10)

    def test_reject_unmodeled_materials(self):
        with self.assertRaises(ValueError):
            color_frame(torch.ones(1, 3, 3, 3), {'outerStock': [0, 0, 0]}, torch.zeros(1, 1, 3, 3))


if __name__ == '__main__':
    unittest.main()
