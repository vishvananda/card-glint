import type { CardDocument, Frame, Instance, Raster, Rect, SceneLayer } from './types.js';
import { validateDeformation } from './deformation.js';
export function uint32(value: number) {
  return Number.isInteger(value) && value >= 0 && value <= 0xffffffff;
}
function rect(value: Rect) {
  if (
    value.length !== 4 ||
    value.some((v) => !Number.isFinite(v)) ||
    value[2] <= 0 ||
    value[3] <= 0
  )
    throw Error('Invalid normalized rectangle');
}
function raster(value: Raster) {
  if (!value.key || value.key.length > 131072) throw Error('Invalid raster key');
  const [w, h] = value.size;
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 || w * h > 4194304)
    throw Error('Invalid raster size');
}
export function validateDocument(document: CardDocument) {
  if (!uint32(document.id) || !Number.isSafeInteger(document.revision) || document.revision < 0)
    throw Error('Invalid card identity');
  const recipe = document.recipe;
  raster(recipe.color);
  if (recipe.stamp) raster(recipe.stamp);
  if (!recipe.pack || recipe.artWindows.length > 8 || recipe.edges.length > 32)
    throw Error('Invalid recipe or too many regions');
  if (!Number.isFinite(recipe.cornerRadius) || recipe.cornerRadius < 0 || recipe.cornerRadius > 0.5)
    throw Error('Invalid corner radius');
  const base = recipe.finishCoverageBase ?? 1;
  if (!Number.isFinite(base) || base < 0 || base > 1) throw Error('Invalid base coverage');
  if (recipe.overlayFoil) {
    const { tone, strength } = recipe.overlayFoil;
    if (
      !['gold', 'silver', 'prismatic'].includes(tone) ||
      !Number.isFinite(strength) ||
      strength < 0 ||
      strength > 1
    )
      throw Error('Invalid overlay foil');
  }
  recipe.artWindows.forEach(rect);
  recipe.regions.forEach((region) => rect(region.rect));
  for (const edge of recipe.edges) {
    rect(edge.crop);
    rect(edge.destination);
    rect(edge.clip);
    if (
      edge.crop[0] < 0 ||
      edge.crop[1] < 0 ||
      edge.crop[0] + edge.crop[2] > 1.000001 ||
      edge.crop[1] + edge.crop[3] > 1.000001
    )
      throw Error('Crop leaves the source image');
    if (
      !Number.isInteger(edge.threshold) ||
      edge.threshold < 0 ||
      edge.threshold > 255 ||
      ![-90, 0, 90].includes(edge.rotation ?? 0)
    )
      throw Error('Invalid edge recipe');
  }
  for (const layer of document.layers ?? []) {
    raster(layer.raster);
    if (layer.clip) rect(layer.clip);
    if (!Number.isInteger(layer.order) || Math.abs(layer.order) > 2147483647)
      throw Error('Invalid layer order');
    for (const mask of [
      layer.finishCoverage?.add,
      layer.finishCoverage?.exclude,
      layer.etchCoverage?.add,
      layer.etchCoverage?.exclude,
    ])
      if (mask) raster(mask);
  }
}
export function validateInstance(item: Instance) {
  validateDeformation(item.deformation);
  if (
    !uint32(item.id) ||
    !uint32(item.card) ||
    item.transform.length !== 16 ||
    item.transform.some((v) => !Number.isFinite(v))
  )
    throw Error('Invalid instance identity or transform');
  if (!Number.isInteger(item.order ?? 0) || Math.abs(item.order ?? 0) > 2147483647)
    throw Error('Invalid instance order');
  if (
    !['regular', 'gloss', 'etched', 'prismatic', 'cold', 'opal', 'rain', 'heat', 'pool'].includes(
      item.finish ?? 'regular',
    )
  )
    throw Error('Unknown finish');
  if (
    item.normal &&
    (item.normal.length !== 3 ||
      item.normal.some((v) => !Number.isFinite(v)) ||
      Math.hypot(...item.normal) < 1e-8)
  )
    throw Error('Invalid surface normal');
}
export function validateFrame(frame: Frame) {
  if (!Number.isFinite(frame.time ?? 0) || (frame.time ?? 0) < 0)
    throw Error('Frame time must be finite, nonnegative seconds');
  if (
    frame.hover &&
    (!uint32(frame.hover.instance) ||
      frame.hover.uv.length !== 2 ||
      frame.hover.uv.some((n) => !Number.isFinite(n) || n < 0 || n > 1))
  )
    throw Error('Invalid card-local hover');
}
export function validateSceneLayer(layer: SceneLayer) {
  raster(layer.raster);
  if (
    !layer.id ||
    !Number.isInteger(layer.order) ||
    layer.transform.length !== 16 ||
    layer.transform.some((v) => !Number.isFinite(v))
  )
    throw Error('Invalid scene layer');
  if (
    !['world-under-cards', 'world-interleaved', 'scene-overlay', 'hud'].includes(layer.stage) ||
    !['test-write', 'test-readonly', 'ignore'].includes(layer.depth)
  )
    throw Error('Invalid scene layer stage or depth');
  if (['scene-overlay', 'hud'].includes(layer.stage) && layer.depth !== 'ignore')
    throw Error('Overlay/HUD layers must ignore depth');
}
