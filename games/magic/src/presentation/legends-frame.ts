import manifest from '../../assets.json' with { type: 'json' };
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';

type Material = 'W' | 'U' | 'B' | 'R' | 'G' | 'A' | 'L' | 'M';
interface FrameGeometry {
  family: 'abu' | 'fourth';
  frame: FaceRect;
  art: FaceRect;
}
/** Legends source selection and shared frame/art geometry. Fit on 36 frozen
 * scan poses and replayed on 36 independent cards. Source choice precedes color
 * and typography calibration; see early-frame-source-review.json. */
const GEOMETRY: Readonly<Record<Material, FrameGeometry>> = {
  W: {
    family: 'abu',
    frame: [-0.015000000000000013, -0.016735294117647074, 1.03, 1.032],
    art: [0.1092866666666667, 0.09137899159663865, 0.7821133333333333, 0.45408000000000004],
  },
  U: {
    family: 'fourth',
    frame: [0.006241180327868882, 0.003875294117647035, 0.989584, 0.995748],
    art: [0.10981763899453553, 0.09159595126050418, 0.7830908053333334, 0.4523540914285714],
  },
  B: {
    family: 'abu',
    frame: [-0.015000000000000013, -0.016470588235294133, 1.03, 1.03],
    art: [0.1092866666666667, 0.09143417366946782, 0.7821133333333333, 0.4532],
  },
  R: {
    family: 'fourth',
    frame: [0.006241180327868882, 0.004610588235294094, 0.989584, 0.995748],
    art: [0.10915791632786884, 0.09327957680672272, 0.7844102506666666, 0.45140576],
  },
  G: {
    family: 'fourth',
    frame: [0.007265770491803308, 0.004855294117647071, 0.989584, 0.993784],
    art: [0.11084222915846996, 0.09192970173669468, 0.78177136, 0.45146187428571427],
  },
  A: {
    family: 'fourth',
    frame: [0.006192590163934432, 0.004855294117647071, 0.987636, 0.993784],
    art: [0.11088200616393441, 0.09429585411764707, 0.780890864, 0.44909572190476194],
  },
  L: {
    family: 'fourth',
    frame: [0.0052165901639344555, 0.00559058823529413, 0.989584, 0.993784],
    art: [0.10945277149726775, 0.09077207394957981, 0.7844102506666666, 0.4524083352380952],
  },
  M: {
    family: 'fourth',
    frame: [0.0032159999999999966, 0.003875294117647035, 0.991532, 0.995748],
    art: [0.1076573706666667, 0.09254428268907566, 0.7866153866666666, 0.4523540914285714],
  },
};
export function legendsFrame(face: RenderedCardInput) {
  if (
    face.setCode?.toLowerCase() !== 'leg' ||
    face.frameTemplate ||
    face.frameStyle === 'modern' ||
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return undefined;
  const type = face.typeLine ?? '',
    colors = resolveFrameColors(face);
  const material =
    (face.land ?? /\bLand\b/.test(type))
      ? 'L'
      : (face.artifact ?? /\bArtifact\b/.test(type))
        ? 'A'
        : colors.length > 1
          ? 'M'
          : colors[0];
  if (!material || !(material in GEOMETRY)) return undefined;
  const geometry = GEOMETRY[material as Material];
  return {
    ...geometry,
    material,
    asset: `${manifest.RETRO_ROOT}/img/frames/old/${geometry.family}/${material.toLowerCase()}.png`,
  };
}
