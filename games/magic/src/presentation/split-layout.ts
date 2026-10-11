import { FACE_HEIGHT, FACE_WIDTH, type FaceRect, type RenderedCardInput } from './face-layout.js';
export interface SplitPanel {
  face: RenderedCardInput;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}
export function splitPanels(face: RenderedCardInput): SplitPanel[] {
  if (!['split', 'aftermath'].includes(face.layout ?? '') || face.faces?.length !== 2) return [];
  const aftermath =
    face.layout === 'aftermath' || /\bAftermath\b/.test(face.faces[1]!.rulesText ?? '');
  return face.faces.map((half, index) => {
    const cut = aftermath ? 0.615 : 0.5;
    const inherited = {
      setCode: face.setCode,
      rarity: face.rarity,
      artist: face.artist,
      ...half,
      layout: aftermath ? (index === 0 ? 'aftermath-top' : 'aftermath-bottom') : 'split-half',
      faces: undefined,
      rulesText: half.rulesText
        ?.split('\n')
        .filter((line) => !/^Fuse\b/.test(line))
        .join('\n'),
      illustration: half.illustration ?? face.illustration,
      etchedIllustration:
        half.etchedIllustration ?? (!half.illustration ? face.etchedIllustration : undefined),
      illustrationCrop:
        half.illustrationCrop ??
        (!half.illustration && face.illustration
          ? ([index ? cut : 0, 0, index ? 1 - cut : cut, 1] as FaceRect)
          : undefined),
    };
    return aftermath
      ? index === 0
        ? { face: inherited, x: 0, y: 0, width: 488, height: 375, rotation: 0 }
        : { face: inherited, x: 488, y: 367, width: 276, height: 488, rotation: 90 }
      : {
          face: inherited,
          x: 5,
          y: (index ? 333 : 648) - (splitHasFuse(face) ? 12 : 0),
          width: 333,
          height: 488,
          rotation: -90,
        };
  });
}
export function panelStyle(panel: SplitPanel) {
  return {
    left: `${(panel.x / FACE_WIDTH) * 100}%`,
    top: `${(panel.y / FACE_HEIGHT) * 100}%`,
    width: `${(panel.width / FACE_WIDTH) * 100}%`,
    height: `${(panel.height / FACE_HEIGHT) * 100}%`,
    transform: `rotate(${panel.rotation}deg)`,
  };
}
export function panelTransform(context: CanvasRenderingContext2D, panel: SplitPanel) {
  context.translate(panel.x, panel.y);
  context.rotate((panel.rotation * Math.PI) / 180);
  context.scale(panel.width / FACE_WIDTH, panel.width / FACE_WIDTH);
}
/** Rotate a child rectangle back into physical-card UVs. */
export function panelRect(panel: SplitPanel, rect: FaceRect): FaceRect {
  const x = rect[0] * panel.width,
    y = rect[1] * panel.height,
    w = rect[2] * panel.width,
    h = rect[3] * panel.height;
  if (panel.rotation === -90)
    return [
      (panel.x + y) / FACE_WIDTH,
      (panel.y - x - w) / FACE_HEIGHT,
      h / FACE_WIDTH,
      w / FACE_HEIGHT,
    ];
  if (panel.rotation === 90)
    return [
      (panel.x - y - h) / FACE_WIDTH,
      (panel.y + x) / FACE_HEIGHT,
      h / FACE_WIDTH,
      w / FACE_HEIGHT,
    ];
  return [(panel.x + x) / FACE_WIDTH, (panel.y + y) / FACE_HEIGHT, w / FACE_WIDTH, h / FACE_HEIGHT];
}

export function splitTextScale(face: RenderedCardInput) {
  return face.layout === 'split-half' ? 1.5 : face.layout === 'aftermath-bottom' ? 1.5 : 1;
}

export function splitHasFuse(face: RenderedCardInput): boolean {
  return (
    /\bFuse\b/.test(face.rulesText ?? '') ||
    Boolean(face.faces?.some((half) => /^Fuse\b/m.test(half.rulesText ?? '')))
  );
}
