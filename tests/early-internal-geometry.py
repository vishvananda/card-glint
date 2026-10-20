#!/usr/bin/env python3
"""Synthetic controls for shared aperture measurement; no reference downloads."""
import importlib.util
from pathlib import Path
import unittest
import sys

sys.dont_write_bytecode = True

import numpy as np

spec = importlib.util.spec_from_file_location(
    'geometry', Path(__file__).parents[1] / 'games/magic/tools/accuracy/early-internal-geometry.py')
geometry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(geometry)


class GeometryControls(unittest.TestCase):
    def setUp(self):
        self.rng = np.random.default_rng(514)
        self.art = np.zeros((1020, 732), bool)
        self.art[107:555, 86:642] = True
        self.paper = np.zeros((1020, 732), bool)
        self.paper[614:900, 96:639] = True
        self.base = np.empty((1020, 732, 3), np.float32)
        self.base[:] = [80, 140, 110]
        self.base[self.paper] = [200, 185, 160]

    def test_art_variance_rejects_narrow_bevel_peak(self):
        stack = []
        for i in range(12):
            image = self.base.copy()
            image[self.art] = [40 + 15 * i, 20 + 13 * i, 50 + 10 * i]
            # A high-variance narrow bevel outside the true aperture must not win.
            image[187:488, 77:80] = 0 if i % 2 else 250
            stack.append(image)
        stack = np.stack(stack)
        med = np.median(stack, axis=0)
        mad = np.median(abs(stack - med), axis=0).mean(axis=2)
        result = geometry.art_from_variance(mad)
        for side, expected in zip(geometry.SIDES, [86 / 1.5, 428, 107 / 1.5, 370]):
            self.assertAlmostEqual(result[side]['position'], expected, delta=.05)
        self.assertIsNone(geometry.art_from_variance(np.zeros((1020, 732)))["left"]["position"])

    def test_paper_and_alpha_bounds_survive_color_changes(self):
        alpha = np.full((1020, 732, 1), 255, np.uint8)
        alpha[self.art] = 0
        source = geometry.source_art(np.concatenate([self.base.astype(np.uint8), alpha], axis=2))
        for side, expected in zip(geometry.SIDES, [86 / 1.5, 428, 107 / 1.5, 370]):
            self.assertAlmostEqual(source[side]['position'], expected, delta=.05)
        for gains in [[1, 1, 1], [1.15, .8, 1.2]]:
            result = geometry.paper_bounds(self.base * np.array(gains))
            for side, expected in zip(geometry.SIDES, [64, 426, 614 / 1.5, 600]):
                self.assertAlmostEqual(result[side]['position'], expected, delta=.05)
        with self.assertRaises(AssertionError):
            geometry.source_art(np.full((1020, 732, 4), 255, np.uint8))

    def test_shared_affine_recovers_known_geometry(self):
        source = {kind: {s: {'position': p} for s, p in zip(geometry.SIDES, positions)}
                  for kind, positions in [('art', [86 / 1.5, 428, 107 / 1.5, 370]),
                                          ('paper', [64, 426, 614 / 1.5, 600])]}
        target = {kind: {s: {'position': v['position'] * (1.002 if s in ['left', 'right'] else .997)
                             + (-1.2 if s in ['left', 'right'] else .7)}
                         for s, v in sides.items()} for kind, sides in source.items()}
        axes = geometry.fit_axes(source, target)
        self.assertAlmostEqual(axes['x']['scale'], 1.002)
        self.assertAlmostEqual(axes['y']['scale'], .997)
        self.assertLess(axes['x']['rms'], 1e-10)
        residuals = geometry.validation_errors(axes, source, target)
        self.assertTrue(all(abs(v) < 1e-10 for sides in residuals.values() for v in sides.values()))


if __name__ == '__main__':
    unittest.main()
