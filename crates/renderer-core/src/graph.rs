//! Layer and resource hazards are explicit at the public boundary.
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, BTreeSet};

#[derive(Clone, Copy, Debug, Deserialize, Serialize, Eq, Ord, PartialEq, PartialOrd)]
#[serde(rename_all = "kebab-case")]
pub enum Stage {
    UnderArt,
    PrintedContent,
    UnderFinish,
    OverFinish,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Layer {
    pub id: String,
    pub stage: Stage,
    pub order: i32,
    #[serde(default)]
    pub contributes_to_etch: bool,
}

/// # Errors
/// Rejects duplicate IDs and etching contributions above the finish boundary.
pub fn layer_order(layers: &[Layer]) -> Result<Vec<usize>, &'static str> {
    let mut ids = BTreeSet::new();
    for layer in layers {
        if layer.id.is_empty() || !ids.insert(&layer.id) {
            return Err("Duplicate or empty layer ID");
        }
        if layer.stage == Stage::OverFinish && layer.contributes_to_etch {
            return Err("Over-finish content cannot contribute to etching");
        }
    }
    let mut order: Vec<_> = (0..layers.len()).collect();
    order.sort_by_key(|&i| (layers[i].stage, layers[i].order, &layers[i].id));
    Ok(order)
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Pass {
    pub id: String,
    pub reads: Vec<String>,
    pub writes: Vec<String>,
}

/// Returns a stable topological pass order. Undeclared inputs are external assets.
/// # Errors
/// Rejects cycles, multiple writers and framebuffer feedback.
pub fn pass_order(passes: &[Pass]) -> Result<Vec<usize>, &'static str> {
    let mut writers = BTreeMap::new();
    let mut names = BTreeSet::new();
    for (i, pass) in passes.iter().enumerate() {
        if pass.id.is_empty() || !names.insert(&pass.id) {
            return Err("Duplicate pass ID");
        }
        for output in &pass.writes {
            if pass.reads.contains(output) {
                return Err("A pass cannot sample its render target");
            }
            if writers.insert(output, i).is_some() {
                return Err("Multiple writers need versioned resources");
            }
        }
    }
    let mut order = Vec::new();
    let mut ready = BTreeSet::new();
    while order.len() < passes.len() {
        let next = passes.iter().enumerate().find(|(i, p)| {
            !ready.contains(i)
                && p.reads
                    .iter()
                    .all(|r| writers.get(r).is_none_or(|i| ready.contains(i)))
        });
        let Some((i, _)) = next else {
            return Err("Render graph contains a cycle");
        };
        ready.insert(i);
        order.push(i);
    }
    Ok(order)
}

#[must_use]
pub fn coverage(base: f32, add: f32, exclude: f32) -> f32 {
    base.clamp(0., 1.).max(add.clamp(0., 1.)) * (1. - exclude.clamp(0., 1.))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn graph_refuses_feedback_and_cycles() {
        let pass = |id: &str, read: &str, write: &str| Pass {
            id: id.into(),
            reads: vec![read.into()],
            writes: vec![write.into()],
        };
        assert!(pass_order(&[pass("a", "x", "x")]).is_err());
        assert!(pass_order(&[pass("a", "b", "a"), pass("b", "a", "b")]).is_err());
        assert_eq!(
            pass_order(&[pass("b", "a", "b"), pass("a", "source", "a")]).unwrap(),
            vec![1, 0]
        );
    }
    #[test]
    fn exclusions_win_and_badges_cannot_reetch() {
        assert!(coverage(1., 1., 1.).abs() < f32::EPSILON);
        let layers = [Layer {
            id: "counter".into(),
            stage: Stage::OverFinish,
            order: 0,
            contributes_to_etch: true,
        }];
        assert!(layer_order(&layers).is_err());
    }
}
