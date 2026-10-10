import { canvas, type CardDocument, type CardLayer } from '@card-glint/browser';

const scopeId = 'showcase-art-scope';

/** Use the pack's declared art windows and the renderer's existing coverage contract. */
export function withArtworkCoverage(document: CardDocument, artworkOnly: boolean): CardDocument {
  const { size } = document.recipe.color;
  const windows = document.recipe.artWindows;
  const layers = (document.layers ?? []).filter((layer) => layer.id !== scopeId);
  if (artworkOnly) {
    const coverage: CardLayer = {
      id: scopeId,
      order: -1,
      stage: 'over-finish',
      raster: {
        key: JSON.stringify(['empty-scope-v1', size]),
        size,
        async paint() {
          return canvas(size);
        },
      },
      finishCoverage: {
        add: {
          key: JSON.stringify(['art-scope-v1', size, windows]),
          size,
          async paint() {
            const output = canvas(size),
              ctx = output.getContext('2d')!;
            ctx.fillStyle = '#fff';
            for (const [x, y, w, h] of windows) {
              ctx.fillRect(x * size[0], y * size[1], w * size[0], h * size[1]);
            }
            return output;
          },
        },
      },
    };
    layers.push(coverage);
  }
  return {
    ...document,
    revision: document.revision + 1,
    recipe: { ...document.recipe, finishCoverageBase: artworkOnly ? 0 : 1 },
    layers,
  };
}
