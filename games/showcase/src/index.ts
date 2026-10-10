import {
  canvas,
  type GamePack,
  type Rect,
  type Tier,
  type Raster,
  type CardDocument,
  type FaceRecipe,
} from '../../../packages/browser/src/index.js';
import { frame, engravings, palettes, type ShowcaseCard } from './frame.js';
import assets from '../assets.json' with { type: 'json' };
export type { ShowcaseCard } from './frame.js';
const art = assets.layout.art as unknown as Rect;
export const showcase: GamePack<ShowcaseCard> = {
  id: 'showcase',
  describe(value, tier) {
    return describe(value, tier);
  },
};
function describe(value: ShowcaseCard, tier: Tier, includeFrame = true): FaceRecipe {
  const face = structuredClone(value);
  const size = (tier === 'inspect' ? [720, 1000] : [252, 350]) as readonly [number, number];
  return {
    pack: 'showcase',
    cornerRadius: 0.035,
    artWindows: [art],
    regions: [
      { id: 'illustration', rect: art },
      { id: 'title', rect: [0.1, 0.69, 0.7, 0.07] },
    ],
    color: {
      key: JSON.stringify([assets.revision, face, tier, includeFrame]),
      size,
      async paint(host, signal, underArt) {
        const output = canvas(size),
          ctx = output.getContext('2d')!;
        const lease = await host.images([{ url: face.illustration, width: 960 }], signal);
        try {
          ctx.scale(size[0] / 720, size[1] / 1000);
          ctx.fillStyle = palettes[face.theme].ink;
          ctx.fillRect(0, 0, 720, 1000);
          if (underArt) ctx.drawImage(underArt, 0, 0, 720, 1000);
          const image = lease.value.get(face.illustration)!;
          ctx.drawImage(
            image,
            image.width * 0.125,
            0,
            image.width * 0.75,
            image.height,
            0,
            40,
            720,
            640,
          );
          if (includeFrame) frame(ctx, face);
          signal.throwIfAborted();
          return output;
        } catch (error) {
          output.width = output.height = 0;
          throw error;
        } finally {
          lease.release();
        }
      },
    },
    stamp: {
      key: JSON.stringify([assets.revision, 'engraving', face.theme, tier]),
      size,
      async paint() {
        const output = canvas(size),
          ctx = output.getContext('2d')!;
        ctx.scale(size[0] / 720, size[1] / 1000);
        engravings(ctx, face.theme, true);
        return output;
      },
    },
    edges: [
      {
        key: face.illustration,
        asset: { url: face.illustration, width: 512 },
        crop: [0.125, 0, 0.75, 1],
        destination: art,
        clip: art,
        threshold: 20,
      },
    ],
  };
}

/** Separate printing from the illustration so refraction never samples the frame.
 * Move the named frame layer above the finish for artwork-only presentation. */
export function showcaseDocument(
  id: number,
  value: ShowcaseCard,
  tier: Tier = 'inspect',
): CardDocument {
  const face = structuredClone(value),
    recipe = describe(face, tier, false);
  const raster: Raster = {
    key: JSON.stringify([assets.revision, 'separate-frame-v1', face, tier]),
    size: recipe.color.size,
    async paint() {
      const output = canvas(recipe.color.size),
        ctx = output.getContext('2d')!;
      ctx.scale(recipe.color.size[0] / 720, recipe.color.size[1] / 1000);
      frame(ctx, face);
      return output;
    },
  };
  return {
    id,
    revision: 1,
    recipe,
    layers: [
      {
        id: 'showcase-frame',
        order: -2,
        stage: 'under-finish',
        raster,
      },
    ],
  };
}
