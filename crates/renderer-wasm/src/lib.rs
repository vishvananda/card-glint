//! Checked browser ABI. JSON is restricted to cold policy/diagnostic calls;
//! scene matrices and pixels cross as packed numeric buffers.
use renderer_core::{cache::Cache, etching::Etcher, graph, scene::Scene};
use wasm_bindgen::prelude::*;

fn error(message: impl std::fmt::Display) -> JsValue {
    JsValue::from_str(&message.to_string())
}

#[wasm_bindgen]
pub struct ResourceCache {
    inner: Cache,
}
#[wasm_bindgen]
impl ResourceCache {
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new(bytes: u32) -> Self {
        Self {
            inner: Cache::new(u64::from(bytes)),
        }
    }
    pub fn lookup(&mut self, key: &str) -> Option<u32> {
        self.inner.get(key)
    }
    /// # Errors
    /// Refuses admission beyond the budget or exhausted handles.
    pub fn admit(&mut self, key: String, bytes: u32, priority: u8) -> Result<String, JsValue> {
        serde_json::to_string(
            &self
                .inner
                .admit_with_priority(key, u64::from(bytes), priority)
                .map_err(error)?,
        )
        .map_err(error)
    }
    /// # Errors
    /// Refuses invalid handles and unbalanced leases.
    pub fn pin(&mut self, id: u32, acquire: bool) -> Result<(), JsValue> {
        self.inner.pin(id, acquire).map_err(error)
    }
    pub fn remove(&mut self, id: u32) -> bool {
        self.inner.remove(id)
    }
    pub fn clear(&mut self) -> Vec<u32> {
        self.inner.clear()
    }
    /// # Errors
    /// Reports serialization failures.
    pub fn stats(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner.stats).map_err(error)
    }
}

#[wasm_bindgen]
#[derive(Default)]
pub struct SceneCore {
    scene: Scene,
}
#[wasm_bindgen]
impl SceneCore {
    #[wasm_bindgen(constructor)]
    #[must_use]
    pub fn new() -> Self {
        Self::default()
    }
    /// # Errors
    /// Refuses malformed, non-finite or duplicate scene data.
    pub fn update(&mut self, ids: &[u32], matrices: &[f32], orders: &[i32]) -> Result<(), JsValue> {
        self.scene.update(ids, matrices, orders).map_err(error)
    }
    /// # Errors
    /// Refuses malformed or non-finite camera data.
    pub fn plan(&mut self, camera: &[f32]) -> Result<Vec<u32>, JsValue> {
        self.scene
            .plan(
                camera
                    .try_into()
                    .map_err(|_| error("Camera needs 16 floats"))?,
            )
            .map_err(error)
    }
    #[must_use]
    pub fn hit(&self, x: f32, y: f32) -> Vec<f64> {
        self.scene.hit([x, y]).map_or_else(Vec::new, |(id, uv)| {
            vec![f64::from(id), f64::from(uv[0]), f64::from(uv[1])]
        })
    }
}

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
                u8::try_from(threshold).map_err(error)?,
            )
            .map_err(error)
    }
}

/// # Errors
/// Refuses malformed layers or illegal participation above the finish.
#[wasm_bindgen]
pub fn validate_layers(json: &str) -> Result<Vec<u32>, JsValue> {
    let layers: Vec<graph::Layer> = serde_json::from_str(json).map_err(error)?;
    graph::layer_order(&layers)
        .map_err(error)?
        .into_iter()
        .map(|i| u32::try_from(i).map_err(error))
        .collect()
}
/// # Errors
/// Refuses malformed passes, feedback, duplicate writers or cycles.
#[wasm_bindgen]
pub fn validate_passes(json: &str) -> Result<Vec<u32>, JsValue> {
    let passes: Vec<graph::Pass> = serde_json::from_str(json).map_err(error)?;
    graph::pass_order(&passes)
        .map_err(error)?
        .into_iter()
        .map(|i| u32::try_from(i).map_err(error))
        .collect()
}
