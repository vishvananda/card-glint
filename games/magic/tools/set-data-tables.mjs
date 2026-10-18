// Authoritative calibration tables. Shared frame algorithms stay in the painter.
export const tables = [
  {
    file: 'old-dual-hsb-profiles',
    names: ['DUAL_HSB_PROFILES', 'DUAL_MANA_TARGETS'],
  },
  {
    file: 'printing-color-profiles',
    names: ['PRINTING_COLOR_PROFILES'],
  },
  {
    file: 'ordinary-color-profiles',
    names: ['ORDINARY_COLOR_PROFILES'],
  },
  {
    file: 'legends-color-profiles',
    names: ['LEGENDS_COLOR_PROFILES'],
  },
  {
    file: 'mana-printing-profiles',
    names: ['MANA_PRINTING_TARGETS', 'MANA_PRINTING_INK'],
  },
  {
    file: 'printing-mana-profiles',
    names: ['PRINTING_MANA_PROFILES', 'MODERN_MANA_OVERRIDES'],
  },
  {
    file: 'retro-mana-profiles',
    names: ['RETRO_MANA_PROFILES'],
  },
  {
    file: 'major-symbol-profiles',
    names: ['MAJOR_SYMBOL_PROFILES'],
  },
  {
    file: 'major-frame-profiles',
    names: ['MAJOR_FRAME_INSETS'],
  },
  {
    file: 'early-expansion-frame-values',
    names: ['EARLY_EXPANSION_FRAMES'],
  },
  {
    file: 'early-expansion-color-values',
    names: ['EARLY_EXPANSION_COLORS'],
  },
  {
    file: 'early-expansion-mana-colors',
    names: ['EARLY_EXPANSION_MANA_TARGETS'],
  },
  {
    file: 'planar-color-values',
    names: ['PLANAR_COLORS'],
    set: 'plc',
  },
  {
    file: 'planar-texture-values',
    names: ['PLANAR_TEXTURE'],
    set: 'plc',
  },
];
