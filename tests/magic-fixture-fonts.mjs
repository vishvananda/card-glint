import { readFile } from 'node:fs/promises';

/** Installed substitute outlines only; no network fonts or fidelity claim. */
export async function installedSerifFonts() {
  for (const directory of [
    '/usr/share/fonts/truetype/liberation2',
    '/usr/share/fonts/truetype/liberation',
  ]) {
    try {
      const [normal, italic] = await Promise.all(
        ['Regular', 'Italic'].map((style) => readFile(`${directory}/LiberationSerif-${style}.ttf`)),
      );
      const source = (bytes) => `url("data:font/ttf;base64,${bytes.toString('base64')}")`;
      return { normal: source(normal), italic: source(italic) };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const local = 'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
  return { normal: local, italic: local };
}

/** New modern defaults require these aliases during preparation, even in tests
 * which isolate a non-text component. Reuse installed outlines, never the CDN. */
export async function installModernFixtureFonts(page) {
  const fonts = await installedSerifFonts();
  await page.evaluate(async (source) => {
    for (const [family, weight] of [
      ['Gotham', '400'],
      ['Beleren 2016', '700'],
    ])
      document.fonts.add(
        await new FontFace('CardRenderer MTG ' + family, source.normal, { weight }).load(),
      );
  }, fonts);
}
