"""Known-pose controls for colored/light glyph separation and shared geometry.

Run with the pinned modern-calibration requirements. These analytic controls
do not replace native scan, source-bezel or black-shadow review.
"""
import importlib.util
from pathlib import Path
import unittest
import sys

sys.dont_write_bytecode = True

import cv2
import numpy as np

spec = importlib.util.spec_from_file_location(
    'glyph_measure', Path(__file__).with_name('modern-land-glyph-measure.py'))
glyph = importlib.util.module_from_spec(spec)
spec.loader.exec_module(glyph)


class GlyphControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        x, y, w, h = glyph.RECT
        cls.shape = np.zeros((h, w), np.float32)
        cv2.ellipse(cls.shape, (106, 92), (40, 43), 0, 0, 360, 1, -1)
        cv2.rectangle(cls.shape, (109, 49), (146, 65), 0, -1)
        cv2.circle(cls.shape, (99, 85), 9, 0, -1)
        core = cv2.erode((cls.shape > .5).astype(np.uint8), np.ones((9, 9), np.uint8))
        cls.core = np.zeros((680, 488), bool)
        cls.core[y:y+h, x:x+w] = core > 0

    def raster(self, mask, paper, ink, phase=0):
        x, y, w, h = glyph.RECT
        yy, xx = np.mgrid[:680, :488]
        texture = .4*np.sin(xx/3 + phase) + .4*np.cos(yy/5 + phase)
        background = np.asarray(paper)[None, None, :] + (
            .01*(yy-518) + .015*(xx-244) + texture)[:, :, None]
        coverage = np.zeros((680, 488), np.float32)
        coverage[y:y+h, x:x+w] = mask
        return (background*(1-coverage[:, :, None]) +
                np.asarray(ink)[None, None, :]*coverage[:, :, None]).astype(np.float32)

    def test_recovers_geometry_despite_paper_and_ink_color_changes(self):
        known = [1.5, 9, 1.08, 1.10]
        moved = cv2.warpAffine(self.shape, glyph.affine(known),
                               (glyph.RECT[2], glyph.RECT[3]), flags=cv2.INTER_LINEAR)
        palettes = [
            ('W', [212, 205, 167], [252, 254, 255], [251, 252, 241]),
            ('U', [186, 200, 214], [0, 117, 190], [22, 81, 184]),
            ('B', [166, 164, 158], [39, 38, 36], [18, 16, 12]),
            ('R', [212, 187, 172], [239, 56, 39], [211, 13, 5]),
            ('G', [184, 198, 184], [0, 123, 67], [23, 104, 61]),
        ]
        for name, paper, ink, target_ink in palettes:
            with self.subTest(symbol=name):
                source, _, _ = glyph.separate(self.raster(self.shape, paper, ink), self.core)
                target, _, _ = glyph.separate(self.raster(
                    moved, np.asarray(paper)*.94, target_ink, phase=1), self.core)
                before, after, fit = glyph.fit([{
                    'sourceMask': source, 'referenceMask': target,
                    'sourceBounds': glyph.bounds(source), 'referenceBounds': glyph.bounds(target),
                }])
                self.assertGreater(after, .99)
                self.assertGreater(after, before)
                for value, expected in zip(fit[:2], known[:2]):
                    self.assertLess(abs(value-expected), .3)
                for value, expected in zip(fit[2:], known[2:]):
                    self.assertLess(abs(value-expected), .01)

    def test_negligible_ink_contrast_is_rejected(self):
        mask, _, contrast = glyph.separate(
            self.raster(self.shape, [210, 210, 210], [212, 211, 212]), self.core)
        self.assertIsNone(mask)
        self.assertLess(contrast, 18)


if __name__ == '__main__':
    unittest.main()
