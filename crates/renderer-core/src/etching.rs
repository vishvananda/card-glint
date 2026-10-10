//! Reusable integer luminance/blur/Sobel workspace; matches the GPU recipe.
#[derive(Default)]
pub struct Etcher {
    gray: Vec<u8>,
    horizontal: Vec<u8>,
    blurred: Vec<u8>,
    strength: Vec<u8>,
    soft: Vec<u8>,
}

fn blur(size: [usize; 2], values: &[u8], horizontal: &mut Vec<u8>, out: &mut Vec<u8>) {
    let [w, h] = size;
    horizontal.resize(values.len(), 0);
    out.resize(values.len(), 0);
    for y in 0..h {
        let row = y * w;
        horizontal[row] = values[row];
        horizontal[row + w - 1] = values[row + w - 1];
        for x in 1..w - 1 {
            let a = row + x;
            horizontal[a] = u8::try_from(
                (u16::from(values[a - 1]) + 2 * u16::from(values[a]) + u16::from(values[a + 1]))
                    >> 2,
            )
            .unwrap_or(255);
        }
    }
    out.copy_from_slice(horizontal);
    for y in 1..h - 1 {
        for x in 0..w {
            let a = y * w + x;
            out[a] = u8::try_from(
                (u16::from(horizontal[a - w])
                    + 2 * u16::from(horizontal[a])
                    + u16::from(horizontal[a + w]))
                    >> 2,
            )
            .unwrap_or(255);
        }
    }
}

impl Etcher {
    /// Return a linear R8 mask in the input's row order. Scratch is reused.
    /// # Errors
    /// Rejects zero/oversized images and mismatched RGBA lengths.
    #[allow(
        clippy::many_single_char_names,
        reason = "Sobel coordinates and stencil notation follow the checked GPU kernel"
    )]
    pub fn run(
        &mut self,
        size: [usize; 2],
        rgba: &[u8],
        threshold: u8,
    ) -> Result<Vec<u8>, &'static str> {
        let [w, h] = size;
        let n = w.checked_mul(h).ok_or("Image size overflow")?;
        if w == 0 || h == 0 || n > 4_194_304 || rgba.len() != n * 4 {
            return Err("Invalid image size or RGBA length");
        }
        self.gray.resize(n, 0);
        self.strength.resize(n, 0);
        self.strength.fill(0);
        for (gray, pixel) in self.gray.iter_mut().zip(rgba.as_chunks::<4>().0) {
            *gray = u8::try_from(
                (54 * u32::from(pixel[0]) + 183 * u32::from(pixel[1]) + 19 * u32::from(pixel[2]))
                    >> 8,
            )
            .unwrap_or(255);
        }
        blur(size, &self.gray, &mut self.horizontal, &mut self.blurred);
        for y in 1..h - 1 {
            for x in 1..w - 1 {
                let a = y * w + x;
                let b = &self.blurred;
                let gx = -i32::from(b[a - w - 1]) + i32::from(b[a - w + 1])
                    - 2 * i32::from(b[a - 1])
                    + 2 * i32::from(b[a + 1])
                    - i32::from(b[a + w - 1])
                    + i32::from(b[a + w + 1]);
                let gy =
                    -i32::from(b[a - w - 1]) - 2 * i32::from(b[a - w]) - i32::from(b[a - w + 1])
                        + i32::from(b[a + w - 1])
                        + 2 * i32::from(b[a + w])
                        + i32::from(b[a + w + 1]);
                self.strength[a] = u8::try_from(
                    ((((gx.abs() + gy.abs()) >> 2) - i32::from(threshold)) * 8).clamp(0, 255),
                )
                .unwrap_or(255);
            }
        }
        blur(size, &self.strength, &mut self.horizontal, &mut self.soft);
        Ok(self
            .strength
            .iter()
            .zip(&self.soft)
            .map(|(&a, &b)| a.max(b).saturating_mul(2))
            .collect())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn edges_are_bounded_and_small_images_are_defined() {
        let mut etcher = Etcher::default();
        assert_eq!(
            etcher.run([1, 1], &[255, 255, 255, 255], 20).unwrap(),
            vec![0]
        );
        assert!(etcher.run([0, 1], &[], 20).is_err());
        assert_eq!(etcher.run([8, 8], &[255; 256], 20).unwrap(), vec![0; 64]);
        let rgba: Vec<_> = (0..64)
            .flat_map(|i| if i % 8 < 4 { [0, 0, 0, 255] } else { [255; 4] })
            .collect();
        assert!(etcher.run([8, 8], &rgba, 20).unwrap().contains(&255));
    }
}
