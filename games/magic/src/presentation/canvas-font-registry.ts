/** The caller loads matching FontFace assets into this realm before painting. */
export function canvasFonts(): FontFaceSet {
  const fonts =
    typeof document !== 'undefined'
      ? document.fonts
      : (globalThis as typeof globalThis & { fonts?: FontFaceSet }).fonts;
  if (!fonts) throw Error('Card fonts require a document or worker FontFaceSet');
  return fonts;
}
