//! Packed scene planning. Coordinates are homogeneous clip coordinates after
//! multiplying the caller's view-projection with each instance transform.
use std::collections::BTreeSet;

pub type Matrix = [f32; 16];
const CORNERS: [[f32; 4]; 4] = [
    [0., 0., 0., 1.],
    [1., 0., 0., 1.],
    [0., 1., 0., 1.],
    [1., 1., 0., 1.],
];

#[derive(Default)]
pub struct Scene {
    ids: Vec<u32>,
    transforms: Vec<Matrix>,
    orders: Vec<i32>,
    clips: Vec<[[f32; 4]; 4]>,
    visible: Vec<usize>,
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
        if camera.iter().any(|v| !v.is_finite()) {
            return Err("Invalid camera matrix");
        }
        self.clips = self
            .transforms
            .iter()
            .map(|m| CORNERS.map(|p| transform(camera, transform(m, p))))
            .collect();
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
                        .map(|j| weights[j] * CORNERS[indices[j]][axis] / clip[j][3])
                        .sum::<f32>()
                        / reciprocal
                });
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
}
