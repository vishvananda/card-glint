// Real, byte-verified Magic outlines. Used only by renderer tests, never the public showcase.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fontBytes } from './magic-font-assets.mjs';
export async function loadVerifiedFonts(page, families) {
  const all = JSON.parse(
    await fs.readFile('games/magic/src/presentation/font-geometry.json', 'utf8'),
  );
  const fonts = all.filter((f) => families.includes(f.family));
  for (const family of families)
    if (!fonts.some((f) => f.family === family)) throw Error('Unknown test font ' + family);
  const cache = process.env.CARD_GLINT_FONT_CACHE || path.join(os.tmpdir(), 'card-glint-fonts');
  for (const f of fonts) {
    const bytes = await fontBytes(f, cache);
    await page.route('**/__verified-font/' + f.sha256, (route) =>
      route.fulfill({ body: bytes, contentType: 'application/octet-stream' }),
    );
  }
  await page.evaluate(async (fonts) => {
    for (const f of fonts)
      document.fonts.add(
        await new FontFace(f.family, 'url(/__verified-font/' + f.sha256 + ')', {
          weight: f.weight,
          style: f.style,
        }).load(),
      );
    await document.fonts.ready;
  }, fonts);
}
