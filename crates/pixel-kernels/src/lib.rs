//! Checked pixel ABI, also re-exported by the full renderer module.
use renderer_core::etching::Etcher;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Default)]
pub struct PixelKernels {
    etcher: Etcher,
}
#[wasm_bindgen]
impl PixelKernels {
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new() -> Self {
        Self::default()
    }
    /// # Errors
    /// Rejects invalid dimensions, thresholds and buffer lengths.
    pub fn etch(
        &mut self,
        width: u32,
        height: u32,
        rgba: &[u8],
        threshold: u32,
    ) -> Result<Vec<u8>, JsValue> {
        self.etcher
            .run(
                [width as usize, height as usize],
                rgba,
                u8::try_from(threshold).map_err(|error| JsValue::from_str(&error.to_string()))?,
            )
            .map_err(JsValue::from_str)
    }
}
