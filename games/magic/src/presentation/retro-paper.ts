/** The seventh-family white source adds a gray inner left/bottom bevel absent
 * from the reviewed printings (Mirage through Seventh Edition). Expand its retained paper texture to the keyline;
 * never move the outer frame, keyline, art window or their baked shadows. */
export function paintRetroPaper(
  context: CanvasRenderingContext2D,
  frame: ImageBitmap,
  asset: string,
) {
  if (!asset.endsWith('/seventh/regular/w.png')) return;
  context.drawImage(
    frame,
    (182 / 1500) * frame.width,
    (1258 / 2100) * frame.height,
    (1160 / 1500) * frame.width,
    (585 / 2100) * frame.height,
    (160 / 1500) * 488,
    (1256 / 2100) * 680,
    (1184 / 1500) * 488,
    (605 / 2100) * 680,
  );
}
