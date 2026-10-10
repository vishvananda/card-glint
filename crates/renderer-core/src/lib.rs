//! Game-independent resource policy, scene planning and pixel operations.
//! Browser code owns fonts, decoded images and GPU handles; no game vocabulary
//! or network/runtime dependencies belong in this crate.
pub mod cache;
pub mod etching;
pub mod graph;
pub mod scene;
