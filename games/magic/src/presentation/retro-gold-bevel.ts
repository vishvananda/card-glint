/** The pinned seventh-family gold paper has reversed bevel lighting. Adjust
 * the four facets in place: moving/copying the rim also moves its baked shadow
 * texture. This face-preparation overlay needs no extra asset or readback. */
export function paintRetroGoldBevel(context: CanvasRenderingContext2D) {
  // Bounds of the existing 1500×2100 asset, excluding its black keyline.
  const x = (160 / 1500) * 488,
    y = (1255 / 2100) * 680,
    right = (1346 / 1500) * 488,
    bottom = (1861 / 2100) * 680,
    insetX = (17 / 1500) * 488,
    insetY = (17 / 2100) * 680;
  const facet = (points: readonly (readonly [number, number])[]) => {
    context.beginPath();
    context.moveTo(...points[0]!);
    for (const point of points.slice(1)) context.lineTo(...point);
    context.closePath();
    context.fill();
  };
  context.save();
  context.filter = 'none';
  context.fillStyle = '#00000047';
  facet([
    [x, y],
    [right, y],
    [right - insetX, y + insetY],
    [x + insetX, y + insetY],
  ]);
  facet([
    [right, y],
    [right, bottom],
    [right - insetX, bottom - insetY],
    [right - insetX, y + insetY],
  ]);
  context.fillStyle = '#ffffff80';
  facet([
    [x, y],
    [x + insetX, y + insetY],
    [x + insetX, bottom - insetY],
    [x, bottom],
  ]);
  facet([
    [x, bottom],
    [x + insetX, bottom - insetY],
    [right - insetX, bottom - insetY],
    [right, bottom],
  ]);
  context.restore();
}
