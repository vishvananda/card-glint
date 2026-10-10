//! Inverse mapping for the card silhouette, shared conceptually with the browser
//! deformation shader. Cross-backend pixel/picking tests enforce their agreement.

#[derive(Clone, Copy)]
pub struct Shape {
    aspect: f32,
    radius: f32,
    amount: f32,
    seed: f32,
}

impl Shape {
    /// Packed aspect, corner radius, heat amplitude and stable phase seed.
    /// # Errors
    /// Rejects malformed or unbounded shape parameters before changing a scene.
    pub fn decode(values: &[f32]) -> Result<Self, &'static str> {
        let &[aspect, radius, amount, seed] = values else {
            return Err("Shape needs four floats");
        };
        if values.iter().any(|v| !v.is_finite())
            || aspect <= 0.
            || !(0. ..=0.5).contains(&radius)
            || !(0. ..=0.02).contains(&amount)
            || !(0. ..=1.).contains(&seed)
        {
            return Err("Invalid card shape");
        }
        Ok(Self {
            aspect,
            radius,
            amount,
            seed,
        })
    }

    /// Conservative raster/culling envelope, in top-left local coordinates.
    #[must_use]
    pub fn corners(self) -> [[f32; 4]; 4] {
        let x = self.amount;
        let y = self.amount * 0.18;
        [
            [-x, -y, 0., 1.],
            [1. + x, -y, 0., 1.],
            [-x, 1. + y, 0., 1.],
            [1. + x, 1. + y, 0., 1.],
        ]
    }

    /// Map a physical location back into printed card coordinates. Keep this
    /// formula in step with gpu/deformation-shader.ts, including the y convention.
    #[must_use]
    pub fn source(self, local: [f32; 2], time: f32) -> [f32; 2] {
        if self.amount == 0. {
            return local;
        }
        let [x, y] = local;
        let phase = self.seed * std::f32::consts::TAU;
        [
            x + self.amount
                * (0.72 * (y * 43. + time * 2.1 + phase).sin()
                    + 0.28 * (y * 81. - time * 3.4 + phase * 0.7).sin()),
            y + self.amount * 0.18 * (x * 29. - time * 1.3 + phase).sin(),
        ]
    }

    /// Same rounded-rectangle signed distance as the fragment shader. Rejected
    /// pixels must allow a hit to fall through to another card behind them.
    #[must_use]
    pub fn contains(self, source: [f32; 2]) -> bool {
        let dx = (source[0] - 0.5).abs() - (0.5 - self.radius);
        let dy = ((source[1] - 0.5) * self.aspect).abs() - (self.aspect * 0.5 - self.radius);
        dx.max(0.).hypot(dy.max(0.)) + dx.max(dy).min(0.) - self.radius <= 0.
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn envelope_bounds_displacement_and_rounding() {
        let shape = Shape::decode(&[1.5, 0.04, 0.02, 0.375]).unwrap();
        for tick in 0_u16..50 {
            for row in 0_u16..100 {
                let local = [0.2, f32::from(row) / 99.];
                let source = shape.source(local, f32::from(tick) * 0.1);
                assert!((source[0] - local[0]).abs() <= 0.020_001);
                assert!((source[1] - local[1]).abs() <= 0.003_601);
            }
        }
        assert!(!shape.contains([0., 0.]));
        assert!(shape.contains([0.001, 0.5]));
        assert!(shape.contains([0.5, 0.001]));
        assert!(!shape.contains([-0.001, 0.5]));
    }
}
