/** Bound SVG intrinsic dimensions before rasterizing it for bitmap decoding. */
export async function sizedCanvasSvg(blob: Blob): Promise<Blob> {
  if (!blob.type.includes('svg')) return blob;
  const document = new DOMParser().parseFromString(await blob.text(), 'image/svg+xml');
  const svg = document.documentElement;
  if (svg.localName !== 'svg' || document.querySelector('parsererror'))
    throw new Error('Invalid SVG asset.');
  const box = (svg.getAttribute('viewBox') ?? '')
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const width = box[2] ?? parseFloat(svg.getAttribute('width') ?? '');
  const height = box[3] ?? parseFloat(svg.getAttribute('height') ?? '');
  if (!(width > 0 && height > 0 && Number.isFinite(width + height)))
    throw new Error('SVG asset needs a finite viewport.');
  const scale = 512 / Math.max(width, height);
  if (!svg.hasAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(Math.max(1, Math.round(width * scale))));
  svg.setAttribute('height', String(Math.max(1, Math.round(height * scale))));
  return new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
}

export async function decodeCanvasImage(
  blob: Blob,
  signal: AbortSignal,
  resizeWidth?: number,
): Promise<ImageBitmap> {
  signal.throwIfAborted();
  if (!blob.type.includes('svg'))
    return resizeWidth
      ? createImageBitmap(blob, { resizeWidth, resizeQuality: 'high' })
      : createImageBitmap(blob);
  const url = URL.createObjectURL(await sizedCanvasSvg(blob)),
    image = new Image();
  const raster = document.createElement('canvas');
  const cancel = () => {
    image.src = '';
  };
  signal.addEventListener('abort', cancel, { once: true });
  try {
    signal.throwIfAborted();
    image.src = url;
    await image.decode();
    signal.throwIfAborted();
    raster.width = image.naturalWidth;
    raster.height = image.naturalHeight;
    const context = raster.getContext('2d', { willReadFrequently: true });
    if (!context || !raster.width || !raster.height)
      throw new Error('SVG asset could not be rasterized.');
    context.drawImage(image, 0, 0);
    return await createImageBitmap(raster);
  } finally {
    signal.removeEventListener('abort', cancel);
    image.src = '';
    URL.revokeObjectURL(url);
    raster.width = 0;
    raster.height = 0;
  }
}
