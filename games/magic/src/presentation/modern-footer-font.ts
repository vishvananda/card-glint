import type { RenderedCardInput } from './face-layout.js';
import { modernPrintingProfile } from './modern-printing-profile.js';
import { canvasFonts } from './canvas-font-registry.js';
const pending = new Map<string, Promise<void>>();
/** Once per font realm, during face preparation. Never load inside the painter. */
export function loadModernFooterFont(face: RenderedCardInput): Promise<void> {
  const family = modernPrintingProfile(face)?.footer.collectorFamily;
  if (!family) return Promise.resolve();
  let result = pending.get(family);
  if (!result) {
    result = canvasFonts()
      .load(`12px "${family}"`)
      .then((matches) => {
        if (!matches.length || matches.some((font) => font.status !== 'loaded'))
          throw Error('Modern footer font is unavailable. Load card-glint/magic/fonts.css.');
      })
      .catch((error: unknown) => {
        pending.delete(family);
        throw error;
      });
    pending.set(family, result);
  }
  return result;
}
