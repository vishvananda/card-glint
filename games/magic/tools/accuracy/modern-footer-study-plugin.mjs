import assert from 'node:assert/strict';

/** Scoped offline-study substitutions; production source is never modified. */
export function modernFooterStudyPlugin() {
  let paintedSource;
  const plugin = {
    name: 'm21-footer-study-only',
    enforce: 'pre',
    transform: async (source, id) => {
      if (!id.endsWith('/presentation/modern-footer.ts')) return;
      paintedSource = source;
      const insertion = '  const study = (globalThis as any).__m21FooterCandidate ?? {};\n';
      const needle =
        'export function paintModernFooter(c: CanvasContext, face: RenderedCardInput): void {\n';
      assert(source.includes(needle));
      const replace = (before, after) => {
        assert.equal(
          source.split(before).length,
          2,
          'Unrecognized footer source; review the study adapter',
        );
        source = source.replace(before, after);
      };
      replace(
        needle,
        needle +
          insertion +
          `
  const printedArtist = study.artistByNumber?.[face.collectorNumber ?? ''];
  if (printedArtist !== undefined) face = {...face, artist: printedArtist};
`,
      );
      replace(
        'c.fillText(printingCollectorText(face), 30, 645)',
        `(study.collectorRarityX === undefined
          ? c.fillText(printingCollectorText(face), 30, 645)
          : (() => {
            const text = printingCollectorText(face);
            if (!text) return;
            const match = /^(\\d{3}(?:\\/274)?) ([CMRUL])$/.exec(text);
            if (!match || face.setCode?.toLowerCase() !== 'm21')
              throw Error('Unreviewed collector arrangement in footer study');
            c.fillText(match[1], 30, 645);
            c.fillText(study.collectorRarityByNumber?.[face.collectorNumber ?? ''] ?? match[2], study.collectorRarityX, 645);
          })())`,
      );
      replace(
        "`${set} \u2022 ${face.collectorLanguage?.toUpperCase() ?? 'EN'}`",
        '`${set} ${study.foilStarNumbers?.includes(face.collectorNumber) ? "★" : "•"} ${face.collectorLanguage?.toUpperCase() ?? "EN"}`',
      );
      replace("c.letterSpacing = '0px';", 'c.letterSpacing = `${study.collectorTracking ?? 0}px`;');
      replace(
        'c.font = \'11px "CardRenderer MTG Relay", sans-serif\';',
        'c.font = `${study.collectorSize ?? 11}px "${study.collectorFamily ?? "CardRenderer MTG Relay"}", sans-serif`;',
      );
      replace(
        'c.font = \'11px "CardRenderer MTG Artist Credit", sans-serif\';',
        'c.letterSpacing = "0px"; c.font = `${study.artistSize ?? 11}px "CardRenderer MTG Artist Credit", sans-serif`;',
      );
      replace(
        'c.font = \'700 11px "CardRenderer MTG Beleren Small Caps", Georgia\';',
        'c.letterSpacing = `${study.artistTracking ?? 0}px`; c.font = `700 ${study.artistSize ?? 11}px "CardRenderer MTG Beleren Small Caps", Georgia`;',
      );
      replace(
        'c.font = \'10px "CardRenderer MTG MPlantin", Georgia\';',
        'c.letterSpacing = `${study.legalTracking ?? 0}px`; c.font = `${study.legalSize ?? 10}px "CardRenderer MTG MPlantin", Georgia`;',
      );
      return { code: source, map: null };
    },
  };

  return {
    plugin,
    get sourceText() {
      return paintedSource;
    },
  };
}
