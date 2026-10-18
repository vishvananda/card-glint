"""Numerical invariants for phase-independent printed-texture scoring."""
import unittest
import numpy as np
from .print_dots import descriptors, distance


class PrintTextureTests(unittest.TestCase):
    def setUp(self):
        self.y,self.x=np.mgrid[:64,:64]

    def screen(self, period=4, phase=0, amount=.025):
        gray=.7+amount*np.cos(self.x*2*np.pi/period+phase)
        return np.repeat(gray[None,...,None],3,axis=-1)

    def error(self,a,b):
        return distance(descriptors(a),descriptors(b))['spectral'][0]

    def test_phase_is_not_alignment_error(self):
        source=self.screen()
        shifted=self.screen(phase=1.7)
        self.assertLess(self.error(source,shifted),.001)
        self.assertGreater(self.error(source,self.screen(period=6)),.1)

    def test_energy_matters(self):
        source=self.screen()
        self.assertGreater(self.error(source,self.screen(amount=.05)),.2)
        self.assertAlmostEqual(self.error(source,source),0)

    def test_mean_is_separate(self):
        a=self.screen();b=a+.05
        self.assertLess(self.error(a,b),1e-10)
        self.assertAlmostEqual(distance(descriptors(a),descriptors(b))['meanRgbError255'][0],12.75)

    def test_scale_is_normalized_in_frequency_space(self):
        make=lambda f:np.repeat((.7+.025*np.cos(self.x*2*np.pi*f))[None,...,None],3,axis=-1)
        native=descriptors(make(.29));scan=make(.29*.94)
        raw=distance(descriptors(scan),native)['spectral'][0]
        mapped=distance(descriptors(scan,np.array([[[.94,0],[0,.94]]])),native)['spectral'][0]
        self.assertLess(mapped,raw/10)

    def test_dark_flat_patches_remain_finite(self):
        a=np.full((2,32,6,3),.1)
        out=distance(descriptors(a),descriptors(a))
        self.assertTrue(np.isfinite(out['spectral']).all())
        self.assertTrue(np.array_equal(out['spectral'],[0,0]))


if __name__=='__main__':unittest.main()
