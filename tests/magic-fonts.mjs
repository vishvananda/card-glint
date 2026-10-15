// Contract tests use local outlines and original test text, without font downloads.
// Accuracy captures separately require the pinned Magic fonts and record their hashes.
export const syntheticFontCss = [
  ['Beleren', 'normal', '400 700'],
  ['Beleren Small Caps', 'normal', '700'],
  ['MPlantin', 'normal', '400'],
  ['MPlantin', 'italic', '400'],
  ['Relay', 'normal', '400'],
  ['Artist Credit', 'normal', '400'],
]
  .map(
    ([family, style, weight]) => `@font-face {
  font-family: "CardRenderer MTG ${family}"; font-style: ${style}; font-weight: ${weight};
  src: local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif");
}`,
  )
  .join('\n');
