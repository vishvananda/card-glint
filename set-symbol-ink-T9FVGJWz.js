import { bb as r, b$ as a } from "./face-editor-BhKZ88yd.js";
const s = `@font-face {
  font-family: 'CardRenderer MTG Beleren';
  /* This file already contains bold outlines. Match both requested weights
     without a second, synthetic emboldening in Canvas2D (notably WebKit). */
  font-weight: 400 700;
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/beleren-bold_P1.01.ttf')
    format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG MPlantin';
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/mplantin.woff')
    format('woff');
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG MPlantin';
  /* The former MPlantin-Italic.ttf has overlapping SFNT tables and fails OTS. */
  src: url('https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/fonts/mplantin-i.ttf')
    format('truetype');
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG Relay';
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/relay-medium.ttf')
    format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG Artist Credit';
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/NDPMTG.ttf')
    format('truetype');
  font-display: swap;
}

/* Eighth Edition plate headers; fetched only when this family is prepared. */
@font-face {
  font-family: 'CardRenderer MTG Matrix';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/matrix-b.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

/* Matrix small-caps has the lining numerals printed in the 2003 PT badge. */
@font-face {
  font-family: 'CardRenderer MTG Matrix Small Caps';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/data/fonts/matrix-bsc.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

/* PLC's native P/T face: proportional 1 and a real variable-stat star. */
@font-face {
  font-family: 'CardRenderer MTG ModMatrix';
  src: url('https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/Magic%20-%20Fonts/ModMatrix.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

/* Chapter numerals from the pinned Saga layout's Plantin Semibold face. */
@font-face {
  font-family: 'CardRenderer MTG Chapter';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/plantin-semibold.otf')
    format('opentype');
  font-weight: 550;
  font-display: block;
}

/* Regular Matrix is the type-line face on the 2003 split plates. */
@font-face {
  font-family: 'CardRenderer MTG Matrix';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/matrix.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 400;
  font-display: block;
}

/* Printed small caps and numerals for native Adventure artist and P/T lines. */
@font-face {
  font-family: 'CardRenderer MTG Beleren Small Caps';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/data/fonts/beleren-bsc.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

/* M21 collector rows; prepared only for this measured footer profile. */
@font-face {
  font-family: 'CardRenderer MTG Gotham';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/data/fonts/gotham-medium.ttf')
    format('truetype');
  font-display: block;
}

/* Beleren2016 includes the contextual descending n used by modern headings.
   Loaded only when a printing profile selects it; regular Beleren stays available. */
@font-face {
  font-family: 'CardRenderer MTG Beleren 2016';
  font-weight: 400 700;
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/beleren-b.ttf')
    format('truetype');
  font-display: block;
}
`, f = [
  ...[...s.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(([, e]) => ({
    family: /font-family:\s*'([^']+)'/.exec(e)[1],
    url: /src:\s*url\('([^']+)'\)/.exec(e)[1],
    weight: /font-weight:\s*([^;]+)/.exec(e)?.[1]?.trim() ?? "400",
    style: /font-style:\s*([^;]+)/.exec(e)?.[1]?.trim() ?? "normal"
  })),
  ...r
];
function i(e, n, t) {
  return !e || ["forge", "glint"].includes(e.toLowerCase()) || a(e, n, t) ? "none" : {
    uncommon: "brightness(0) invert(.65)",
    rare: "brightness(0) invert(.62) sepia(.8) saturate(2) hue-rotate(5deg)",
    mythic: "brightness(0) invert(.48) sepia(1) saturate(4) hue-rotate(340deg)",
    special: "brightness(0) invert(.45) sepia(.5) saturate(2) hue-rotate(220deg)",
    bonus: "brightness(0) invert(.6) sepia(.8) saturate(2)"
  }[n ?? "common"] ?? "none";
}
export {
  f as c,
  i as s
};
