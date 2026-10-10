//! Packed scene planning. Coordinates are homogeneous clip coordinates after
//! multiplying the caller's view-projection with each instance transform.
use crate::deformation::Shape;
use std::collections::BTreeSet;

pub type Matrix = [f32; 16];

#[derive(Default)]
pub struct Scene {
    ids: Vec<u32>,
    transforms: Vec<Matrix>,
    orders: Vec<i32>,
    clips: Vec<[[f32; 4]; 4]>,
    visible: Vec<usize>,
    shapes: Vec<Shape>,
    time: f32,
}

fn transform(m: &Matrix, v: [f32; 4]) -> [f32; 4] {
    std::array::from_fn(|row| (0..4).map(|col| m[col * 4 + row] * v[col]).sum())
}

impl Scene {
    /// Replace one atomic scene snapshot. IDs remain separate from face recipes.
    /// # Errors
    /// Refuses duplicate IDs, malformed lengths, non-finite data or excessive work.
    pub fn update(
        &mut self,
        ids: &[u32],
        matrices: &[f32],
        orders: &[i32],
    ) -> Result<(), &'static str> {
        if ids.len() > 100_000
            || matrices.len() != ids.len() * 16
            || orders.len() != ids.len()
            || matrices.iter().any(|v| !v.is_finite())
            || ids.iter().collect::<BTreeSet<_>>().len() != ids.len()
        {
            return Err("Invalid packed scene snapshot");
        }
        self.ids = ids.to_vec();
        self.orders = orders.to_vec();
        self.transforms = matrices
            .as_chunks::<16>()
            .0
            .iter()
            .map(|m| std::array::from_fn(|i| m[i]))
            .collect();
        self.clips.clear();
        self.visible.clear();
        Ok(())
    }

    /// Frustum-cull and order cards. Depth resolves world overlap; numeric order
    /// and stable IDs define coplanar ties. Partly near-clipped quads stay visible.
    /// # Errors
    /// Refuses a non-finite camera transform.
    pub fn plan(&mut self, camera: &Matrix) -> Result<Vec<u32>, &'static str> {
        self.plan_shaped(camera, &[1., 0., 0., 0.].repeat(self.ids.len()), 0.)
    }

    /// Plan expanded silhouettes and retain their mapping for picking this frame.
    /// Shapes contain four floats per instance: aspect, radius, amplitude, seed.
    /// # Errors
    /// Refuses invalid cameras, times or shape data without replacing the last plan.
    pub fn plan_shaped(
        &mut self,
        camera: &Matrix,
        shapes: &[f32],
        time: f32,
    ) -> Result<Vec<u32>, &'static str> {
        if camera.iter().any(|v| !v.is_finite())
            || !time.is_finite()
            || time < 0.
            || shapes.len() != self.ids.len() * 4
        {
            return Err("Invalid camera, time or packed shapes");
        }
        let shapes = shapes
            .as_chunks::<4>()
            .0
            .iter()
            .map(|values| Shape::decode(values))
            .collect::<Result<Vec<_>, _>>()?;
        self.clips = self
            .transforms
            .iter()
            .zip(&shapes)
            .map(|(m, shape)| shape.corners().map(|p| transform(camera, transform(m, p))))
            .collect();
        self.shapes = shapes;
        self.time = time;
        self.visible = self
            .clips
            .iter()
            .enumerate()
            .filter_map(|(i, corners)| {
                let outside = (0..3).any(|axis| {
                    corners.iter().all(|p| p[axis] < -p[3])
                        || corners.iter().all(|p| p[axis] > p[3])
                });
                (!outside).then_some(i)
            })
            .collect();
        self.visible.sort_by_key(|&i| (self.orders[i], self.ids[i]));
        Ok(self
            .visible
            .iter()
            .filter_map(|&i| u32::try_from(i).ok())
            .collect())
    }

    /// Hit test the last planned scene in NDC. Perspective-correct UVs allow
    /// hosts to resolve a game pack's editable regions without DOM hit targets.
    #[must_use]
    pub fn hit(&self, point: [f32; 2]) -> Option<(u32, [f32; 2])> {
        let mut selected = None;
        let mut best = f32::INFINITY;
        for &i in &self.visible {
            let shape = self.shapes[i];
            let corners = shape.corners();
            for indices in [[0, 1, 2], [2, 1, 3]] {
                let clip = indices.map(|index| self.clips[i][index]);
                if clip.iter().any(|p| p[3] <= 0.) {
                    continue;
                }
                let screen = clip.map(|p| [p[0] / p[3], p[1] / p[3]]);
                let Some(weights) = barycentric(screen, point) else {
                    continue;
                };
                let depth: f32 = (0..3).map(|j| weights[j] * clip[j][2] / clip[j][3]).sum();
                if !(-1. ..=1.).contains(&depth) || depth > best {
                    continue;
                }
                let reciprocal: f32 = (0..3).map(|j| weights[j] / clip[j][3]).sum();
                let uv = std::array::from_fn(|axis| {
                    (0..3)
                        .map(|j| weights[j] * corners[indices[j]][axis] / clip[j][3])
                        .sum::<f32>()
                        / reciprocal
                });
                let uv = shape.source(uv, self.time);
                if !shape.contains(uv) {
                    continue;
                }
                best = depth;
                selected = Some((self.ids[i], uv));
            }
        }
        selected
    }
}

#[allow(
    clippy::many_single_char_names,
    reason = "Conventional barycentric coordinates and triangle vertices"
)]
fn barycentric(vertices: [[f32; 2]; 3], p: [f32; 2]) -> Option<[f32; 3]> {
    let [a, b, c] = vertices;
    let d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
    if d.abs() < 1e-8 {
        return None;
    }
    let u = ((b[1] - c[1]) * (p[0] - c[0]) + (c[0] - b[0]) * (p[1] - c[1])) / d;
    let v = ((c[1] - a[1]) * (p[0] - c[0]) + (a[0] - c[0]) * (p[1] - c[1])) / d;
    let w = 1. - u - v;
    (u >= 0. && v >= 0. && w >= 0.).then_some([u, v, w])
}

#[cfg(test)]
mod tests {
    use super::*;
    const IDENTITY: Matrix = [
        1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1.,
    ];
    #[test]
    fn depth_culling_and_picking_agree() {
        let mut scene = Scene::default();
        let mut front = IDENTITY;
        front[14] = -0.5;
        let mut hidden = IDENTITY;
        hidden[12] = 10.;
        scene
            .update(&[7, 8, 9], &[IDENTITY, front, hidden].concat(), &[0, 0, 0])
            .unwrap();
        assert_eq!(scene.plan(&IDENTITY).unwrap(), vec![0, 1]);
        let (id, uv) = scene.hit([0.25, 0.5]).unwrap();
        assert_eq!(id, 8);
        assert!((uv[0] - 0.25).abs() < 1e-6);
        assert!(scene.hit([-0.5, 0.]).is_none());
    }
    #[test]
    fn bad_update_does_not_destroy_scene() {
        let mut scene = Scene::default();
        scene.update(&[7], &IDENTITY, &[0]).unwrap();
        assert!(
            scene
                .update(&[7, 7], &[IDENTITY, IDENTITY].concat(), &[0, 0])
                .is_err()
        );
        assert_eq!(scene.plan(&IDENTITY).unwrap(), vec![0]);
    }
    #[test]
    fn expanded_envelope_and_clipped_pick_fallthrough() {
        let mut scene = Scene::default();
        let mut front = IDENTITY;
        front[14] = -0.5;
        scene
            .update(&[1, 2], &[IDENTITY, front].concat(), &[0, 0])
            .unwrap();
        let shapes = [1., 0., 0., 0., 1., 0.1, 0.02, 0.25];
        scene.plan_shaped(&IDENTITY, &shapes, 2.).unwrap();
        assert_eq!(scene.hit([0.001, 0.001]).unwrap().0, 1);
        assert_eq!(scene.hit([0.5, 0.5]).unwrap().0, 2);
        assert!(scene.plan_shaped(&IDENTITY, &[f32::NAN; 8], 2.).is_err());
        assert_eq!(scene.hit([0.5, 0.5]).unwrap().0, 2);
        let mut offscreen = IDENTITY;
        offscreen[12] = 1.01;
        scene.update(&[1], &offscreen, &[0]).unwrap();
        assert!(scene.plan(&IDENTITY).unwrap().is_empty());
        assert_eq!(
            scene
                .plan_shaped(&IDENTITY, &[1., 0., 0.02, 0.], 0.)
                .unwrap(),
            vec![0]
        );
    }
}
