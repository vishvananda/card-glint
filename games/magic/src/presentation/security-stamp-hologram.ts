import type { Hologram, Raster, Rect } from '../../../../packages/browser/src/index.js';
import type { RenderedCardInput } from './face-layout.js';
import { isAdventure } from './adventure-frame.js';
import { isPrepared } from './prepare-frame.js';
import { isAftermath } from './aftermath-frame.js';
import { nativeSplitEra } from './split-frame.js';
import { isRetro } from './retro-frame.js';
import { faceFrame } from './special-frames.js';
import { hasOvalSecurityStamp } from './security-stamp-policy.js';
import { mountedSecurityStamp } from './security-stamp-paint.js';
import { PLAIN_SECURITY_STAMP } from './security-stamp-assets.js';
import { SECURITY_STAMP_RECTS, SECURITY_STAMP_SOURCES } from './security-stamp-geometry.js';

/** Small, shared alpha mask. Its source is decoded by the host's bounded image
 * cache; no readback or private cache is needed. Inset the outer gray rim. */
const mask: Raster = {
  key: JSON.stringify(['magic-oval-interior-v1', PLAIN_SECURITY_STAMP, 2, 1]),
  size: [134, 67],
  async paint(host, signal) {
    const lease = await host.images([{ url: PLAIN_SECURITY_STAMP }], signal);
    try {
      signal.throwIfAborted();
      const source = lease.value.get(PLAIN_SECURITY_STAMP);
      if (!source) throw Error('Authenticity stamp mask is unavailable.');
      const output = document.createElement('canvas');
      output.width = 134;
      output.height = 67;
      const context = output.getContext('2d');
      if (!context) throw Error('Authenticity stamp mask needs Canvas2D.');
      context.drawImage(source, 2, 1, 130, 65);
      return output;
    } finally {
      lease.release();
    }
  },
};

/** Follow the static painter's precedence; never coat an absent stamp. */
export function securityStampHologram(face: RenderedCardInput): Hologram | undefined {
  if (face.securityStampEffect === 'static' || face.frameTemplate || !hasOvalSecurityStamp(face))
    return undefined;
  const mounted = mountedSecurityStamp(face);
  let target: Rect;
  let source: (typeof SECURITY_STAMP_SOURCES)[keyof typeof SECURITY_STAMP_SOURCES];
  if (isPrepared(face) || isAdventure(face)) {
    target = SECURITY_STAMP_RECTS.saga;
    source = SECURITY_STAMP_SOURCES.saga;
  } else if (isAftermath(face)) {
    target = SECURITY_STAMP_RECTS.aftermath;
    source = SECURITY_STAMP_SOURCES.saga;
  } else if (nativeSplitEra(face) === 'm15') {
    target = SECURITY_STAMP_RECTS.split;
    source = SECURITY_STAMP_SOURCES.plain;
  } else if (!isRetro(face) && !face.frameAssetFamily && faceFrame(face) === 'saga') {
    target = SECURITY_STAMP_RECTS.saga;
    source = SECURITY_STAMP_SOURCES.saga;
  } else if (mounted) {
    target = mounted.rect;
    source = faceFrame(face).startsWith('planeswalker')
      ? SECURITY_STAMP_SOURCES.planeswalker
      : SECURITY_STAMP_SOURCES.ordinary;
  } else return undefined;
  const [x, y, width, height] = target;
  const [sx, sy, sw, sh] = source.interior;
  const [sourceWidth, sourceHeight] = source.size;
  return {
    mask,
    rect: [
      (x + (sx / sourceWidth) * width) / 488,
      (y + (sy / sourceHeight) * height) / 680,
      ((sw / sourceWidth) * width) / 488,
      ((sh / sourceHeight) * height) / 680,
    ],
    strength: 0.8,
    // The same foil stock has the same pattern across printings. Placement and
    // material do not create unnecessary per-card uniforms/batch breaks.
    seed: 1914,
  };
}
