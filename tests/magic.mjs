import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import {
  magic,
  faceFrame,
  faceRects,
  resolveCardProfile,
  retroFamily,
  withCardWording,
} from '../dist/lib/magic.js';

const creature = {
  name: 'Example Adept',
  typeLine: 'Creature — Human Wizard',
  colors: ['U'],
  manaSymbols: ['2', 'U'],
  rulesText: 'When this creature enters, draw a card.',
  power: '2',
  toughness: '2',
};
const walker = {
  name: 'Example Wanderer',
  typeLine: 'Legendary Planeswalker — Example',
  colors: ['U'],
  loyalty: '3',
  rulesText:
    '+1: Draw a card.\n−2: Return target creature to its owner’s hand.\n−7: Draw seven cards.',
};
const originalFace = {
  ...creature,
  setCode: '3ed',
  rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Obsolete annotated wording.' }] }],
};
const wordings = {
  oracle: { typeLine: 'Creature — Elemental', rulesText: 'Modern wording with {T}.' },
  original: { typeLine: 'Summon Force', rulesText: 'Printed wording with {T}.' },
};
const originalInput = JSON.stringify(originalFace);
const originalWording = withCardWording(originalFace, wordings, 'original');
const oracleWording = withCardWording(originalFace, wordings);
assert.equal(originalWording.typeLine, 'Summon Force');
assert.equal(
  originalWording.creature,
  true,
  'Historical labels must retain creature frame semantics',
);
assert.equal(oracleWording.wordingMode, 'oracle', 'New wording selection defaults to Oracle');
assert.equal(
  oracleWording.rulesParagraphs,
  undefined,
  'Original paragraph runs must not override Oracle',
);
assert.equal(JSON.stringify(originalFace), originalInput, 'Selection must not mutate host data');
assert.deepEqual(faceRects(originalWording), faceRects(oracleWording));
assert.notEqual(
  magic.describe({ ...originalWording, wordingMode: 'original' }, 'inspect').color.key,
  magic.describe({ ...originalWording, wordingMode: 'oracle' }, 'inspect').color.key,
  'Symbol-only mode changes must invalidate the raster cache',
);
assert.throws(
  () => withCardWording(originalFace, { oracle: wordings.oracle }, 'original'),
  /Missing original/,
);
assert.equal(
  withCardWording(originalFace, wordings, 'oracle', { rulesAlignment: 'left' }).rulesAlignment.mode,
  'left',
);
assert.throws(
  () =>
    withCardWording(originalFace, { oracle: wordings.oracle }, 'oracle', {
      rulesAlignment: 'original',
    }),
  /Missing original alignment/,
);
assert.notEqual(
  magic.describe(
    withCardWording(originalFace, wordings, 'oracle', { rulesAlignment: 'left' }),
    'inspect',
  ).color.key,
  magic.describe(oracleWording, 'inspect').color.key,
  'Alignment choice must invalidate the raster cache',
);
assert.notEqual(
  magic.describe(
    withCardWording(originalFace, wordings, 'oracle', { rulesAlignment: 'original' }),
    'inspect',
  ).color.key,
  magic.describe(oracleWording, 'inspect').color.key,
  'Alignment reference must invalidate the raster cache',
);
const oracleHistoric = withCardWording(originalFace, wordings, 'oracle', {
  symbolStyle: 'original',
});
assert.equal(oracleHistoric.rulesText, wordings.oracle.rulesText);
assert.equal(oracleHistoric.typeLine, wordings.oracle.typeLine);
assert.equal(oracleHistoric.wordingMode, 'oracle');
assert.equal(oracleHistoric.symbolStyle, 'original');
assert.equal(oracleWording.symbolStyle, 'modern');
assert.equal(originalWording.symbolStyle, 'original');
assert.deepEqual(faceRects(oracleHistoric), faceRects(oracleWording));
assert.notEqual(
  magic.describe(oracleHistoric, 'inspect').color.key,
  magic.describe(oracleWording, 'inspect').color.key,
  'Changing symbol style without changing Oracle text must invalidate the face',
);
assert.equal(faceFrame(walker), 'planeswalker');
assert.equal(
  faceFrame({ ...walker, rulesText: walker.rulesText + '\n0: Scry 1.' }),
  'planeswalker-large',
);
assert.equal(resolveCardProfile({ typeLine: 'Legendary Land', colors: ['R', 'U'] }).crown, 'UR');
assert.equal(
  resolveCardProfile({ typeLine: 'Legendary Artifact — Equipment', colors: ['R'] }).crown,
  'R',
);
assert.equal(retroFamily({ ...creature, setCode: 'LEA' }), 'abu');
const printedPalette = { ...creature, frameColors: ['G'] };
assert.equal(resolveCardProfile(printedPalette).frame, 'G');
assert.equal(resolveCardProfile(printedPalette).boxes, 'G');
assert.deepEqual(printedPalette.colors, ['U']);
assert.deepEqual(printedPalette.manaSymbols, ['2', 'U']);
assert.equal(resolveCardProfile({ ...creature, frameColors: [] }).frame, 'Colourless');
assert.notEqual(
  magic.describe(printedPalette, 'inspect').color.key,
  magic.describe(creature, 'inspect').color.key,
);
assert.notDeepEqual(faceRects(walker).rules, faceRects(creature).rules);
const basic = {
  name: 'Plains',
  typeLine: 'Basic Land — Plains',
  colors: [],
  setCode: 'MIR',
  rulesText: '({T}: Add {W}.)',
};
const fixtures = [
  creature,
  walker,
  { ...walker, rulesText: walker.rulesText + '\n0: Scry 1.' },
  { ...creature, frameStyle: 'retro', setCode: 'LEA' },
  { ...creature, frameStyle: 'retro', setCode: '4ED' },
  { ...creature, frameStyle: 'retro', setCode: '7ED' },
  {
    ...creature,
    frameStyle: 'retro',
    setCode: 'MIR',
    artist: 'Example Artist',
    rulesText: '{T}: Draw a card.',
  },
  { ...creature, frameStyle: 'retro', setCode: 'TMP', artist: 'Example Artist' },
  {
    ...printedPalette,
    name: 'Printed Green Adept',
    typeLine: 'Summon Adept',
    creature: true,
    frameStyle: 'retro',
    setCode: '3ED',
  },
  {
    name: 'Example Chronicle',
    typeLine: 'Enchantment — Saga',
    colors: ['G'],
    rulesText: 'I — Draw a card.\nII, III — Create a 1/1 green Saproling creature token.',
  },
  {
    name: 'Example Class',
    typeLine: 'Enchantment — Class',
    colors: ['U'],
    rulesText:
      'When this enchantment enters, draw a card.\n{1}{U}: Level 2\nCreatures you control have flying.',
  },
  {
    ...creature,
    layout: 'split',
    faces: [
      {
        name: 'Ember',
        typeLine: 'Instant',
        colors: ['R'],
        rulesText: 'Deal 2 damage to target creature.',
      },
      { name: 'Thought', typeLine: 'Sorcery', colors: ['U'], rulesText: 'Draw a card.' },
    ],
  },
  {
    ...creature,
    layout: 'aftermath',
    faces: [
      { name: 'First Light', typeLine: 'Sorcery', colors: ['W'], rulesText: 'Draw a card.' },
      {
        name: 'Last Light',
        typeLine: 'Instant',
        colors: ['B'],
        rulesText: 'Aftermath\nReturn a card from your graveyard to your hand.',
      },
    ],
  },
  {
    ...creature,
    layout: 'adventure',
    faces: [
      creature,
      {
        name: 'Find a Path',
        typeLine: 'Sorcery — Adventure',
        colors: ['U'],
        rulesText: 'Draw a card.',
      },
    ],
  },
  basic,
  {
    ...basic,
    setCode: 'TMP',
    name: 'Forest',
    typeLine: 'Basic Land — Forest',
    rulesText: '({T}: Add {G}.)',
  },
  {
    name: 'Example Relic',
    typeLine: 'Artifact',
    colors: [],
    frameStyle: 'retro',
    setCode: '3ED',
    borderColor: 'white',
    rulesText: '{2}, {T}: Draw a card.',
  },
];
for (const setCode of ['apc', 'dis', 'dgm'])
  fixtures.push({
    name: 'Dawn // Dusk',
    layout: 'split',
    setCode,
    faces: [
      { name: 'Dawn', typeLine: 'Instant', colors: ['W'], rulesText: 'Draw a card.' },
      {
        name: 'Dusk',
        typeLine: 'Sorcery',
        colors: ['U'],
        rulesText:
          setCode === 'dgm' ? 'Scry 1.\nFuse (You may cast one or both halves.)' : 'Scry 1.',
      },
    ],
  });
for (const face of fixtures) {
  const before = JSON.stringify(face);
  const recipe = magic.describe(face, 'inspect');
  assert.equal(JSON.stringify(face), before, 'Recipes must not mutate input');
  assert.equal(recipe.color.key, magic.describe(face, 'inspect').color.key);
  const changed = structuredClone(face);
  changed.name += ' II';
  if (changed.faces) changed.faces[0].name += ' II';
  assert.notEqual(recipe.color.key, magic.describe(changed, 'inspect').color.key);
  for (const rect of recipe.artWindows) assert.ok(rect.every(Number.isFinite));
}

const root = path.resolve('dist/lib');
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') return res.end('<!doctype html><title>Magic pack test</title>');
    const file = path.resolve(root, '.' + url.pathname);
    if (!file.startsWith(root + '/')) throw Error('Outside package');
    res.setHeader(
      'Content-Type',
      file.endsWith('.js') ? 'text/javascript' : 'application/octet-stream',
    );
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
// This checks Canvas contracts; GPU completion/readback is covered by browser tests.
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
try {
  const page = await browser.newPage();
  // No external art/font downloads in CI. Geometry and painting use original
  // synthetic bitmaps; real frame fidelity is checked separately in the host.
  await page.route('https://**/*', (route) =>
    route.request().url().endsWith('/svg/tmp.svg')
      ? route.fulfill({
          status: 200,
          contentType: 'image/svg+xml',
          body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M0 0H32V32H0Z M10 10H22V22H10Z"/></svg>',
        })
      : route.fulfill({ status: 404, body: '' }),
  );
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const result = await page.evaluate(async (fixtures) => {
    const { magic, opticalDocument, withCardWording } = await import('/magic.js');
    const { loadCanvasFonts, layoutRules, retroTextLayout } = await import(
      '/magic-presentation.js'
    );
    let missingFontsRejected = false;
    try {
      await loadCanvasFonts();
    } catch {
      missingFontsRejected = true;
    }
    if (!missingFontsRejected) throw Error('Missing font stylesheet was silently accepted');
    // Original test content, using local system outlines; no third-party fonts in CI.
    const local = 'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
    for (const [family, style, weight] of [
      ['Goudy', 'normal', '400'],
      ['Historic Symbols', 'normal', '400'],
      ['Beleren', 'normal', '400 700'],
      ['MPlantin', 'normal', '400'],
      ['MPlantin', 'italic', '400'],
      ['Relay', 'normal', '400'],
      ['Artist Credit', 'normal', '400'],
      ['Chapter', 'normal', '550'],
    ])
      document.fonts.add(
        await new FontFace('CardRenderer MTG ' + family, local, { style, weight }).load(),
      );
    await loadCanvasFonts(); // A failed attempt must be retryable after CSS/FontFaces arrive.
    const bitmap = document.createElement('canvas');
    bitmap.width = 64;
    bitmap.height = 64;
    const ctx = bitmap.getContext('2d');
    const { planeswalkerRuleRows } = await import('/magic-presentation.js');
    const ability = {
      typeLine: 'Planeswalker — Example',
      rulesText:
        'You may act during another turn.\n+1: Draw a card.\n−3: Choose a creature. (It phases out.)\n−9: Take another turn.',
      rulesParagraphs: [
        { role: 'rules', runs: [{ text: 'You may act during another turn.' }] },
        { role: 'rules', runs: [{ text: '+1: Draw a card.' }] },
        {
          role: 'rules',
          runs: [{ text: '−3: Choose a creature. ' }, { text: '(It phases out.)', italic: true }],
        },
        { role: 'rules', runs: [{ text: '−9: Take another turn.' }] },
      ],
    };
    ctx.letterSpacing = '2px';
    const abilityRows = planeswalkerRuleRows(ctx, ability);
    if (ctx.letterSpacing !== '2px') throw Error('Ability measurement leaked canvas state');
    ctx.letterSpacing = '0px';
    if (abilityRows.length !== 4 || abilityRows.some((r) => r.layout.overflow))
      throw Error('Measured abilities did not fit the taller rules panel');
    if (abilityRows[0].layout.x >= abilityRows[1].layout.x)
      throw Error('Static planeswalker text incorrectly retains the badge indent');
    const normalizedText = (row) =>
      row.layout.lines
        .map((l) => l.runs.map((r) => r.text).join(''))
        .join(' ')
        .replace(/\s+/g, ' ');
    for (const row of abilityRows)
      if (normalizedText(row) !== row.text)
        throw Error('Ability layout dropped text or duplicated the loyalty prefix');
    if (!abilityRows[2].layout.lines.some((l) => l.runs.some((r) => r.italic)))
      throw Error('Explicit italic reminder style was lost in a planeswalker row');
    const shortPassive = planeswalkerRuleRows(ctx, {
      typeLine: ability.typeLine,
      rulesText:
        'This spell cannot be countered.\n+2: Each opponent gets an emblem with a triggered ability that deals damage at the beginning of their upkeep.\n−3: Deal 3 damage to each non-Elemental creature.\n−X: Deal X damage to target creature or planeswalker. If a permanent dealt damage this way would die this turn, exile it instead.',
    });
    if (shortPassive[0].height < 48 || shortPassive.some((r) => r.layout.overflow))
      throw Error('Short static text lost its row or crowded a dense final ability');
    for (let i = 1; i < shortPassive.length; i++) {
      const previous = shortPassive[i - 1].layout;
      if (shortPassive[i].layout.top - previous.top - previous.height < 7.99)
        throw Error('Dense planeswalker abilities have overlapping ink');
    }
    const densePair = planeswalkerRuleRows(ctx, {
      typeLine: ability.typeLine,
      rulesText:
        'Whenever a player casts a spell, put a marker on a permanent you control.\n−2: Choose another permanent you control. Until the beginning of your next turn, it becomes a copy of a creature you control, except it is an artifact in addition to its other types.',
    });
    for (const row of densePair) {
      if (
        row.layout.overflow ||
        normalizedText(row) !== row.text ||
        row.layout.lines.some(
          (line) => line.inkBounds[1] < 435 || line.inkBounds[1] + line.inkBounds[3] > 618,
        )
      )
        throw Error('Dense two-row ability crosses the visible planeswalker paper');
    }
    if (densePair[1].layout.top - densePair[0].layout.top - densePair[0].layout.height < 7.99)
      throw Error('Fitting the lower ability overlapped the static paragraph');
    const unrelatedParagraphs = planeswalkerRuleRows(ctx, {
      ...ability,
      rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Unrelated ordinary-face text.' }] }],
    });
    if (unrelatedParagraphs.some((r, i) => normalizedText(r) !== abilityRows[i].text))
      throw Error('Ordinary paragraphs replaced the special-frame wording');
    const overfullAbility = planeswalkerRuleRows(ctx, {
      ...ability,
      rulesText: '+1: ' + 'W'.repeat(1000),
      rulesParagraphs: undefined,
    });
    if (!overfullAbility.some((r) => r.layout.overflow))
      throw Error('An overfull ability was silently clipped');
    const paragraphs = [
      {
        role: 'rules',
        runs: [{ text: 'Draw a card. ' }, { text: '(Then choose a card.)', italic: true }],
      },
      { role: 'flavor', runs: [{ text: 'An original quotation for this test.', italic: true }] },
    ];
    ctx.textBaseline = 'middle';
    const measured = layoutRules(ctx, paragraphs, { x: 0, y: 0, width: 180, height: 105 });
    ctx.textBaseline = 'alphabetic';
    const repeated = layoutRules(ctx, paragraphs, { x: 0, y: 0, width: 180, height: 105 });
    if (JSON.stringify(measured) !== JSON.stringify(repeated))
      throw Error('Layout depends on caller baseline');
    if (
      measured.overflow ||
      measured.size >= 24 ||
      measured.separators.length !== 1 ||
      !measured.lines.some((l) => l.runs.some((r) => r.italic))
    )
      throw Error('Measured styled layout failed');
    // Separators must clear actual ink, including italic ascenders and symbol
    // descenders. Exercise wrapping and the fitter instead of a fixed baseline.
    for (const width of [145, 250, 400]) {
      for (const height of [115, 220]) {
        const passage = layoutRules(
          ctx,
          [
            { role: 'rules', runs: [{ text: 'Pay {T}: Draw a card, then discard a card.' }] },
            {
              role: 'flavor',
              runs: [
                {
                  text: 'A flying dragon guards the high tower. Beyond it lies a forgotten city.',
                  italic: true,
                },
              ],
            },
          ],
          { x: 12, y: 30, width, height },
        );
        if (passage.overflow) throw Error('Separator fixture did not fit');
        const lastRules = passage.lines.filter((line) => line.role === 'rules').at(-1);
        const firstFlavor = passage.lines.find((line) => line.role === 'flavor');
        const separator = passage.separators[0];
        if (
          passage.separators.length !== 1 ||
          separator <= lastRules.inkBounds[1] + lastRules.inkBounds[3] ||
          separator + 0.6 >= firstFlavor.inkBounds[1]
        )
          throw Error('Flavor separator overlaps lettering');
      }
    }
    const impossible = layoutRules(ctx, [{ role: 'rules', runs: [{ text: 'W'.repeat(100) }] }], {
      x: 0,
      y: 0,
      width: 100,
      height: 60,
    });
    if (!impossible.overflow) throw Error('Oversize word was silently clipped');
    const exclusion = [0, 70, 180, 30];
    const unobstructed = layoutRules(
      ctx,
      [{ role: 'rules', runs: [{ text: 'Original test rules text.' }] }],
      {
        x: 0,
        y: 0,
        width: 180,
        height: 100,
      },
    );
    const obstructed = layoutRules(
      ctx,
      [{ role: 'rules', runs: [{ text: 'Original test rules text.' }] }],
      {
        x: 0,
        y: 0,
        width: 180,
        height: 100,
        exclusions: [exclusion],
      },
    );
    if (
      obstructed.overflow ||
      obstructed.size >= unobstructed.size ||
      obstructed.lines.some((line) => line.inkBounds[1] + line.inkBounds[3] > exclusion[1])
    )
      throw Error('Text intersects its reserved power/toughness area');
    const symbols = layoutRules(ctx, [{ role: 'rules', runs: [{ text: '{T}: Add {W}{U}.' }] }], {
      x: 0,
      y: 0,
      width: 90,
      height: 100,
    });
    if (symbols.lines.flatMap((l) => l.runs).filter((r) => r.symbol).length !== 3)
      throw Error('Inline symbols lost while wrapping');
    const balancedStyle = { leading: 1, paragraphGap: 0, flavorGap: 0, balanceLines: true };
    for (const centerOffset of [-1000, 1000]) {
      const bounded = layoutRules(
        ctx,
        paragraphs,
        { x: 10, y: 20, width: 180, height: 160 },
        22.5,
        15,
        { ...balancedStyle, centerOffset },
      );
      if (bounded.overflow || bounded.top < 20 || bounded.top + bounded.height > 180.01)
        throw Error('Optical centering moved text outside its physical bounds');
    }
    ctx.font = '24px "CardRenderer MTG MPlantin", Georgia';
    const balanceBox = {
      x: 0,
      y: 0,
      width: ctx.measureText('word word word word word').width + 0.1,
      height: 200,
    };
    const balanceText = [{ role: 'rules', runs: [{ text: 'word word word word word word word' }] }];
    const greedyLines = layoutRules(ctx, balanceText, balanceBox, 24, 24);
    const balancedLines = layoutRules(ctx, balanceText, balanceBox, 24, 24, balancedStyle);
    const raggedness = (layout) =>
      layout.lines.reduce((sum, line) => sum + (balanceBox.width - line.width) ** 2, 0);
    if (
      balancedLines.lines.length !== greedyLines.lines.length ||
      raggedness(balancedLines) >= raggedness(greedyLines)
    )
      throw Error('Balanced wrapping must reduce raggedness without adding a line');
    const styledBalance = layoutRules(
      ctx,
      [
        {
          role: 'rules',
          runs: [
            { text: 'An original ' },
            { text: 'italic passage ', italic: true },
            { text: 'with {T} and another word.\n\nA final line.' },
          ],
        },
      ],
      { x: 0, y: 0, width: 190, height: 300 },
      24,
      24,
      balancedStyle,
    );
    const styledRuns = styledBalance.lines.flatMap((line) => line.runs);
    if (
      styledBalance.overflow ||
      !styledRuns.some((r) => r.italic) ||
      styledRuns.filter((r) => r.symbol).length !== 1 ||
      !styledBalance.lines.some((line) => line.runs.length === 0) ||
      styledBalance.lines
        .at(-1)
        .runs.map((r) => r.text)
        .join('') !== 'A final line.'
    )
      throw Error('Balancing lost styling, an inline symbol or an explicit line break');
    const shortFourth = { ...fixtures[4], rulesText: 'An original short passage.' };
    const centeredFourth = retroTextLayout(ctx, shortFourth);
    if (
      centeredFourth.size !== 25 ||
      centeredFourth.width !== 344 ||
      centeredFourth.lines.some((line) => Math.abs(line.x + line.width / 2 - 244) > 0.01)
    )
      throw Error('Short Fourth Edition text is not centered in its shared bounds');
    const explicitLeft = retroTextLayout(ctx, {
      ...shortFourth,
      rulesParagraphs: [{ role: 'rules', align: 'left', runs: [{ text: shortFourth.rulesText }] }],
    });
    if (explicitLeft.size !== 22.5 || explicitLeft.lines.some((line) => line.x !== explicitLeft.x))
      throw Error('Historical centering overrode explicit host alignment');
    const paladinParagraphs = [
      { role: 'rules', runs: [{ text: '{W}{W}, {T}: Destroy target black permanent.' }] },
      {
        role: 'flavor',
        runs: [{ text: '“Look to the north; there you will find aid and comfort.”', italic: true }],
      },
      { role: 'flavor', runs: [{ text: '—The Book of Tal' }] },
    ];
    const fourthPaladin = retroTextLayout(ctx, {
      ...shortFourth,
      rulesParagraphs: paladinParagraphs,
    });
    if (
      fourthPaladin.overflow ||
      fourthPaladin.lines.length !== 5 ||
      fourthPaladin.lines.some((line) => Math.abs(line.x + line.width / 2 - 244) > 0.01)
    )
      throw Error('Fourth short rules/flavor block lost centered lines or attribution');
    const longFourth = retroTextLayout(ctx, {
      ...shortFourth,
      rulesParagraphs: [
        paladinParagraphs[0],
        { role: 'flavor', runs: [{ text: 'A longer flavor passage. '.repeat(12), italic: true }] },
      ],
    });
    if (longFourth.lines.some((line) => line.x !== longFourth.x))
      throw Error('Fourth long flavor passage was incorrectly centered');
    const sisters = {
      ...shortFourth,
      rulesParagraphs: [
        {
          role: 'rules',
          runs: [{ text: '{T}: Add {R} to your mana pool. Play this ability as an interrupt.' }],
        },
        {
          role: 'flavor',
          runs: [
            {
              text: 'We are many wicks sharing a common tallow; we feed the skies with the ashes of our prey.',
              italic: true,
            },
          ],
        },
      ],
    };
    const sistersLayout = retroTextLayout(ctx, sisters);
    if (sistersLayout.lines.some((line) => line.x !== sistersLayout.x))
      throw Error('Dense Fourth flavor block was centered solely because it fit five lines');
    const shortReference = retroTextLayout(ctx, {
      ...sisters,
      rulesAlignment: { mode: 'auto', reference: paladinParagraphs },
    });
    if (shortReference.lines.some((line) => Math.abs(line.x + line.width / 2 - 244) > 0.01))
      throw Error('Fourth character boundary ignored the chosen alignment reference');
    const { ordinaryTextLayout } = await import('/magic-presentation.js');
    // Printing cosmetics stay historical even when the displayed text is Oracle.
    for (const wordingMode of ['original', 'oracle']) {
      for (const setCode of [
        '8ed',
        'M15',
        'ddk',
        'ori',
        'soi',
        'xln',
        'rix',
        'a25',
        'ddu',
        'dom',
        'm19',
        'war',
      ]) {
        const layout = ordinaryTextLayout(ctx, {
          name: 'Divider era control',
          typeLine: 'Instant',
          rulesParagraphs: paragraphs,
          setCode,
          wordingMode,
        });
        const expected = ['ddu', 'dom', 'm19', 'war'].includes(setCode) ? 1 : 0;
        if (layout.separators.length !== expected)
          throw Error(`Incorrect flavor divider era: ${setCode}, ${wordingMode}`);
      }
    }
    const wrath = {
      name: 'Wrath of God',
      typeLine: 'Sorcery',
      rulesText: 'Destroy all creatures. They can’t be regenerated.',
      colors: ['W'],
    };
    for (const setCode of ['8ed', '9ed', '10e', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15']) {
      const layout = ordinaryTextLayout(ctx, { ...wrath, setCode });
      const shouldCenter = !['8ed', '9ed', 'm15'].includes(setCode);
      if (
        layout.lines.some((line) =>
          shouldCenter
            ? Math.abs(line.x + line.width / 2 - layout.x - layout.width / 2) > 0.01
            : line.x !== layout.x,
        )
      )
        throw Error(`Incorrect short-passage alignment for ${setCode}`);
    }
    for (const options of [
      { rulesAlignment: { mode: 'left' } },
      { rulesParagraphs: [{ role: 'rules', align: 'left', runs: [{ text: wrath.rulesText }] }] },
      {
        rulesAlignment: {
          mode: 'auto',
          reference: [
            { role: 'rules', runs: [{ text: 'A lengthy original rules passage. '.repeat(12) }] },
          ],
        },
      },
    ]) {
      const layout = ordinaryTextLayout(ctx, { ...wrath, setCode: '10e', ...options });
      if (layout.lines.some((line) => line.x !== layout.x))
        throw Error('Modern centering ignored explicit alignment or the chosen reference');
    }
    const shortRevised = {
      ...shortFourth,
      setCode: '3ed',
      rulesText: 'An original passage that needs more than one line.',
    };
    const centeredRevised = retroTextLayout(ctx, shortRevised);
    if (
      centeredRevised.size !== 27.5 ||
      centeredRevised.lines.length < 2 ||
      Math.abs(centeredRevised.lines[1].baseline - centeredRevised.lines[0].baseline - 30.25) >
        0.01 ||
      centeredRevised.lines.some((line) => Math.abs(line.x + line.width / 2 - 244) > 0.01)
    )
      throw Error('Revised short passages lost their printed size, leading or centered position');
    if (
      retroTextLayout(ctx, { ...shortRevised, rulesText: 'Target creature gains +2/+1.' }).lines
        .length !== 1
    )
      throw Error('Revised width introduced an extra line in a printed single-line passage');
    for (const paragraphs of [
      [{ role: 'rules', align: 'right', runs: [{ text: shortRevised.rulesText }] }],
      [{ role: 'rules', runs: [{ text: 'Explicit\nprinted breaks.' }] }],
      [
        { role: 'rules', runs: [{ text: 'A passage.' }] },
        { role: 'flavor', runs: [{ text: 'Original flavor.', italic: true }] },
      ],
    ]) {
      if (retroTextLayout(ctx, { ...shortRevised, rulesParagraphs: paragraphs }).size !== 22.5)
        throw Error('Revised automatic centering overrode a different paragraph policy');
    }
    const laceRules = [
      {
        role: 'rules',
        runs: [
          { text: 'Target spell or permanent becomes white. ' },
          { text: '(Mana symbols on that permanent remain unchanged.)', italic: true },
        ],
      },
    ];
    const lace = retroTextLayout(ctx, { ...shortRevised, rulesParagraphs: laceRules });
    if (
      lace.x !== 70 ||
      lace.width > 348 ||
      lace.overflow ||
      !lace.lines.flatMap((l) => l.runs).some((r) => r.italic) ||
      lace.lines.some((l) => Math.abs(l.x + l.width / 2 - 244) > 0.01)
    )
      throw Error('Short italic reminder escaped the shared inset or centered policy');
    const laceLeft = retroTextLayout(ctx, {
      ...shortRevised,
      rulesParagraphs: laceRules,
      rulesAlignment: { mode: 'left' },
    });
    if (laceLeft.x !== 70 || laceLeft.lines.some((l) => l.x !== 70))
      throw Error('Left-aligned styled text escaped the safe panel inset');
    const alignmentWords = {
      original: {
        typeLine: 'Instant',
        rulesText: 'A sufficiently long original passage. '.repeat(12),
      },
      oracle: { typeLine: 'Instant', rulesText: shortRevised.rulesText },
    };
    const fromOriginal = retroTextLayout(
      ctx,
      withCardWording(shortRevised, alignmentWords, 'oracle', { rulesAlignment: 'original' }),
    );
    const fromOracle = retroTextLayout(
      ctx,
      withCardWording(shortRevised, alignmentWords, 'oracle', { rulesAlignment: 'oracle' }),
    );
    if (
      fromOriginal.lines.some((l) => l.x !== 70) ||
      fromOracle.lines.some((l) => Math.abs(l.x + l.width / 2 - 244) > 0.01)
    )
      throw Error('Alignment was not classified from the chosen wording source');
    const aura = retroTextLayout(ctx, {
      ...shortRevised,
      rulesText: "Enchant Wall\nEnchanted Wall can attack as though it didn't have defender.",
    });
    if (aura.lines.some((l) => Math.abs(l.x + l.width / 2 - 244) > 0.01))
      throw Error('Aura heading was separated from its centered passage');
    const pegasus = {
      ...shortRevised,
      wordingMode: 'oracle',
      rulesParagraphs: [
        {
          role: 'rules',
          runs: [
            { text: 'Flying; banding ' },
            {
              text: "(Any creatures with banding, and up to one without, can attack in a band. Bands are blocked as a group. If any creatures with banding you control are blocking or being blocked by a creature, you divide that creature's combat damage, not its controller, among any of the creatures it's being blocked by or is blocking.)",
              italic: true,
            },
          ],
        },
        {
          role: 'flavor',
          runs: [
            {
              text: 'Before a woman marries in the village of Sursi, she must visit the land of the Mesa Pegasus. Legend has it that if the woman is pure of heart and her love is true, a Mesa Pegasus will appear, blessing her family with long life and good fortune.',
              italic: true,
            },
          ],
        },
      ],
    };
    const pegasusLayout = retroTextLayout(ctx, pegasus);
    const normalizeWords = (t) => t.replace(/\s+/g, ' ').trim();
    if (
      pegasusLayout.overflow ||
      normalizeWords(
        pegasusLayout.lines.map((l) => l.runs.map((r) => r.text).join('')).join(' '),
      ) !==
        normalizeWords(pegasus.rulesParagraphs.flatMap((p) => p.runs.map((r) => r.text)).join(' '))
    )
      throw Error('Long Oracle reminder failed to fit or lost text');
    const alphaDense = {
      ...pegasus,
      setCode: 'lea',
      name: 'Dense Alpha wording',
    };
    const alphaDenseLayout = retroTextLayout(ctx, alphaDense);
    if (
      alphaDenseLayout.overflow ||
      alphaDenseLayout.lines.some((line) => {
        const [, top, , height] = line.inkBounds;
        return top < 428 - 0.01 || top + height > 590 + 0.01;
      }) ||
      normalizeWords(
        alphaDenseLayout.lines.map((l) => l.runs.map((r) => r.text).join('')).join(' '),
      ) !==
        normalizeWords(
          alphaDense.rulesParagraphs.flatMap((p) => p.runs.map((r) => r.text)).join(' '),
        )
    )
      throw Error('Dense Alpha wording crossed the panel inset or lost reminder/flavor text');
    const flyingPassage = [
      { role: 'rules', runs: [{ text: 'Flying' }] },
      {
        role: 'rules',
        runs: [{ text: 'Serendib Efreet does 1 damage to you during your upkeep.' }],
      },
    ];
    const largeRevised = retroTextLayout(ctx, { ...shortRevised, rulesParagraphs: flyingPassage });
    if (
      largeRevised.size !== 27.5 ||
      largeRevised.lines.length < 3 ||
      largeRevised.lines[0].x !== 70 ||
      largeRevised.lines.slice(1).some((line) => Math.abs(line.x + line.width / 2 - 244) > 0.01)
    )
      throw Error('Revised keyword heading and large centered continuation lost their alignment');
    const explicitFlying = retroTextLayout(ctx, {
      ...shortRevised,
      rulesParagraphs: flyingPassage.map((p) => ({ ...p, align: 'left' })),
    });
    if (explicitFlying.size !== 22.5 || explicitFlying.lines.some((line) => line.x !== 70))
      throw Error('Automatic Revised large type overrode explicit host alignment');
    const retro = retroTextLayout(ctx, {
      ...fixtures[3],
      rulesParagraphs: [
        ...paragraphs,
        { role: 'flavor', align: 'right', runs: [{ text: '—Original attribution', italic: true }] },
      ],
    });
    const attribution = retro.lines.at(-1);
    if (
      retro.overflow ||
      retro.separators.length ||
      !retro.lines.some((l) => l.runs.some((r) => r.italic)) ||
      attribution.x <= retro.x ||
      Math.abs(attribution.x + attribution.width - (retro.x + retro.width)) > 0.01
    )
      throw Error('Retro styles, alignment or separator policy lost');
    const historicalLand = retroTextLayout(ctx, fixtures.at(-2));
    const landLine = historicalLand.lines[0];
    if (
      historicalLand.overflow ||
      historicalLand.lines.length !== 1 ||
      !landLine.runs
        .map((r) => (r.symbol ? `{${r.text}}` : r.text))
        .join('')
        .includes('to your mana pool.') ||
      Math.abs(landLine.x + landLine.width / 2 - (historicalLand.x + historicalLand.width / 2)) >
        0.01
    )
      throw Error('Historical basic land lost printed wording or centered alignment');
    const customLand = retroTextLayout(ctx, {
      ...fixtures.at(-2),
      rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Custom printed rules.' }] }],
    });
    if (
      customLand.lines.map((l) => l.runs.map((r) => r.text).join('')).join('') !==
      'Custom printed rules.'
    )
      throw Error('Historical land policy replaced explicit custom text');
    ctx.fillStyle = '#164d65';
    ctx.fillRect(0, 0, 64, 64);
    let leases = 0,
      released = 0;
    const host = {
      images: async (refs) => {
        leases++;
        return { value: new Map(refs.map((ref) => [ref.url, bitmap])), release: () => released++ };
      },
    };
    const sizes = [];
    for (const face of fixtures)
      for (const tier of ['table', 'inspect']) {
        const recipe = magic.describe(face, tier);
        const canvas = await recipe.color.paint(host, new AbortController().signal);
        sizes.push([canvas.width, canvas.height]);
        if (canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3] !== 0)
          throw Error('Canvas silhouette has square corners');
        if (
          !canvas.getContext('2d').getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data[3]
        )
          throw Error(
            `Blank painted face: ${face.name} / ${face.frameStyle ?? face.layout ?? face.typeLine} / ${tier}`,
          );
        canvas.width = canvas.height = 0;
      }
    const { composeCardTexture, cardTextureKey, faceSetSymbol, retroSetSymbol } = await import(
      '/magic-presentation.js'
    );
    // The real frame loader downsizes its bitmaps. Bevel correction must
    // preserve shadow locations and the paper center at both tiers.
    for (const decodedWidth of [750, 300]) {
      const source = document.createElement('canvas');
      source.width = decodedWidth;
      source.height = decodedWidth * 1.4;
      const ink = source.getContext('2d');
      ink.scale(source.width / 488, source.height / 680);
      ink.fillStyle = '#777';
      ink.fillRect(0, 0, 488, 680);
      ink.fillStyle = '#aaa';
      ink.fillRect(52, 406, 386, 197);
      ink.fillStyle = '#ccc';
      ink.fillRect(52, 406, 386, 6);
      ink.fillRect(432, 406, 6, 197);
      ink.fillStyle = '#888';
      ink.fillRect(52, 406, 6, 197);
      ink.fillRect(52, 597, 386, 6);
      // An asymmetric shadow on the left must stay on the left at this height.
      ink.fillStyle = '#222';
      ink.fillRect(52, 480, 6, 10);
      const frame = await createImageBitmap(source);
      for (const tier of ['inspect', 'table']) {
        const canvas = await composeCardTexture(
          {
            face: {
              name: '',
              typeLine: '',
              colors: ['W', 'B'],
              frameStyle: 'retro',
              setCode: 'tmp',
            },
            printingId: null,
            printedImage: null,
          },
          tier,
          new AbortController().signal,
          {
            loadImages: async (urls) => ({
              images: new Map(urls.filter((u) => u?.endsWith('/m.png')).map((u) => [u, frame])),
              dispose() {},
            }),
          },
        );
        const c = canvas.getContext('2d');
        const red = (x, y) =>
          c.getImageData((x * canvas.width) / 488, (y * canvas.height) / 680, 1, 1).data[0];
        const center = red(240, 500);
        if (
          Math.abs(center - 170) > 3 ||
          red(55, 500) < center + 5 ||
          red(240, 600) < center + 5 ||
          red(435, 500) > center - 15 ||
          red(240, 409) > center - 15
        )
          throw Error(`Gold bevel failed with resized bitmap: ${decodedWidth}, ${tier}`);
        if (red(55, 485) > red(55, 470) - 20)
          throw Error('Bevel correction moved the original shadow texture');
        // Location alone is insufficient: a pale overlay retains a faint mark
        // but destroys the dark shadow that continues into the bevel.
        const shadowRatio = red(55, 485) / red(55, 470);
        if (shadowRatio > 0.35 || shadowRatio < 0.18)
          throw Error(`Bevel correction washed out the shadow: ${shadowRatio}`);
        canvas.width = canvas.height = 0;
      }
      frame.close();
      source.width = source.height = 0;
    }
    // The same stencil must print identically at every pre-Exodus rarity.
    // Exodus is the boundary control, with genuinely different rarity ink.
    const historicalStencil = document.createElement('canvas');
    historicalStencil.width = historicalStencil.height = 64;
    const historicalInk = historicalStencil.getContext('2d');
    historicalInk.fillStyle = '#444';
    historicalInk.fillRect(12, 8, 40, 48);
    historicalInk.clearRect(24, 20, 16, 24);
    for (const setCode of ['arn', 'ice', 'sth', 'por', 'exo']) {
      const renders = [];
      for (const rarity of ['common', 'uncommon', 'rare']) {
        const face = {
          name: '',
          typeLine: '',
          colors: ['U'],
          frameStyle: 'retro',
          setCode,
          rarity,
          setSymbolSource: 'keyrune',
        };
        const canvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
          {
            loadImages: async (urls) => ({
              images: new Map(
                urls.map((url) => [url, url === retroSetSymbol(face) ? historicalStencil : bitmap]),
              ),
              dispose() {},
            }),
          },
        );
        renders.push(canvas.toDataURL());
        canvas.width = canvas.height = 0;
      }
      if (new Set(renders).size !== (setCode === 'exo' ? 3 : 1))
        throw Error(`Incorrect historical set-symbol rarity treatment: ${setCode}`);
    }
    historicalStencil.width = historicalStencil.height = 0;
    if (!faceSetSymbol({ setCode: 'p02', setSymbolSource: 'keyrune' })?.endsWith('/po2.svg'))
      throw Error('Portal Second Age must use the pinned po2 glyph alias');
    for (const [name, code] of [
      ["D'Avenant Archer", 'leg'],
      ["Abu Ja'far", 'arn'],
      ['Dance of Many', 'drk'],
      ["Urza's Tower", 'atq'],
    ])
      if (!faceSetSymbol({ name, setCode: 'chr' })?.endsWith(`/${code}-c.svg`))
        throw Error(`Chronicles lost its original expansion symbol: ${name}`);
    if (
      faceSetSymbol({ name: 'Unknown custom card', setCode: 'chr' }) !== null ||
      faceSetSymbol({ name: 'constructor', setCode: 'chr' }) !== null ||
      faceSetSymbol({ name: "Abu Ja'far", setCode: 'chr', setSymbol: 'test:custom' }) !==
        'test:custom'
    )
      throw Error('Chronicles must preserve custom symbols and avoid guessing unknown identities');
    // A wide glyph inside a square SVG viewport must retain its visible size.
    // Synthetic padded art exercises the complete painter without remote assets.
    for (const [setCode, customSymbol] of [
      ['m15', false],
      ['m15', true],
      ['m19', false],
      ['m20', false],
      ['m21', false],
      ['m21', true],
    ]) {
      const coreShield = !customSymbol && ['m19', 'm20', 'm21'].includes(setCode);
      const tintedSymbol = coreShield || (!customSymbol && setCode === 'm15');
      const symbol = document.createElement('canvas');
      symbol.width = symbol.height = 320;
      const c = symbol.getContext('2d');
      c.fillStyle = '#ff00ff';
      if (setCode === 'm15') c.fillRect(2.5, 76, 315, 168);
      else c.fillRect(0, 93.3, 320, 133.4);
      const face = {
        ...fixtures[1],
        typeLine: 'Artifact',
        rulesText: '',
        setCode,
        rarity: 'common',
        setSymbolSource: 'keyrune',
        ...(customSymbol ? { setSymbol: 'test:padded-symbol' } : {}),
      };
      const url = faceSetSymbol(face);
      for (const tier of ['table', 'inspect']) {
        const canvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          tier,
          new AbortController().signal,
          {
            loadImages: async (urls) => ({
              images: new Map(urls.map((u) => [u, u === url ? symbol : bitmap])),
              dispose() {},
            }),
          },
        );
        const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let left = canvas.width,
          right = -1,
          top = canvas.height,
          bottom = -1;
        for (let i = 0; i < pixels.length; i += 4)
          if (
            tintedSymbol
              ? pixels[i] < 30 &&
                pixels[i + 1] < 30 &&
                pixels[i + 2] < 30 &&
                pixels[i + 3] > 240 &&
                (i / 4) % canvas.width > canvas.width * 0.79 &&
                (i / 4) % canvas.width < canvas.width * 0.935 &&
                Math.floor(i / 4 / canvas.width) > canvas.height * 0.572 &&
                Math.floor(i / 4 / canvas.width) < canvas.height * 0.61
              : pixels[i] > 220 && pixels[i + 1] < 30 && pixels[i + 2] > 220
          ) {
            const x = (i / 4) % canvas.width;
            left = Math.min(left, x);
            right = Math.max(right, x);
            top = Math.min(top, Math.floor(i / 4 / canvas.width));
            bottom = Math.max(bottom, Math.floor(i / 4 / canvas.width));
          }
        const width = ((right - left + 1) * 488) / canvas.width;
        if (
          customSymbol
            ? width < 27 || width > 32
            : coreShield
              ? width < 55 || width > 60
              : width < 47 || width > 52
        )
          throw Error(
            `Visible set glyph has the wrong size: ${setCode}, custom=${customSymbol}, ${tier}: ${width}`,
          );
        const visibleHeight = ((bottom - top + 1) * 680) / canvas.height;
        // At table scale one raster row spans two canonical pixels; the ink
        // threshold excludes antialiasing and the pale rim from this envelope.
        if (coreShield && (visibleHeight < 19 || visibleHeight > 25))
          throw Error(`Core shield aspect was distorted: ${setCode}, ${tier}: ${visibleHeight}`);
        canvas.width = canvas.height = 0;
      }
      symbol.width = symbol.height = 0;
    }
    // The letters in core-set stencils are holes. They need opaque white ink
    // for commons and black ink for other rarities, independent of the plate.
    const stencil = document.createElement('canvas');
    stencil.width = stencil.height = 320;
    const stencilContext = stencil.getContext('2d');
    stencilContext.fillRect(0, 93.3, 320, 133.4);
    stencilContext.clearRect(130, 120, 60, 65);
    for (const setCode of ['m15', 'm21']) {
      for (const rarity of ['common', 'uncommon', 'rare', 'mythic']) {
        const face = {
          name: '',
          typeLine: 'Artifact',
          rulesText: '',
          setCode,
          rarity,
          setSymbolSource: 'keyrune',
        };
        const url = faceSetSymbol(face);
        for (const tier of ['table', 'inspect']) {
          const canvas = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
            {
              loadImages: async (urls) => ({
                images: new Map(urls.map((u) => [u, u === url ? stencil : bitmap])),
                dispose() {},
              }),
            },
          );
          const c = canvas.getContext('2d'),
            scale = canvas.width / 488;
          const sample = (x, y) => [...c.getImageData(x * scale, y * scale, 1, 1).data];
          const hole = sample(setCode === 'm15' ? 422 : 420, 400);
          if (
            rarity === 'common'
              ? hole.slice(0, 3).some((v) => v < 240)
              : hole.slice(0, 3).some((v) => v > 30)
          )
            throw Error(`Core shield letter holes show the plate: ${setCode}, ${rarity}, ${tier}`);
          if (rarity !== 'common') {
            const left = sample(400, 402),
              center = sample(430, 402);
            if (Math.abs(left[0] - center[0]) + Math.abs(left[1] - center[1]) < 30)
              throw Error(`Core shield lost its rarity gradient: ${setCode}, ${rarity}, ${tier}`);
          }
          canvas.width = canvas.height = 0;
        }
      }
    }
    stencil.width = stencil.height = 0;
    const printed = { ...fixtures[0], setCode: '3ed', frameColors: ['G'] };
    const immutablePrinted = magic.describe(printed, 'table');
    printed.frameColors[0] = 'R';
    const printedUrls = [];
    await immutablePrinted.color.paint(
      {
        images: async (assets) => {
          printedUrls.push(...assets.map((a) => a.url));
          return { value: new Map(assets.map((a) => [a.url, bitmap])), release() {} };
        },
      },
      new AbortController().signal,
    );
    if (
      !printedUrls.some((url) => url.endsWith('/old/fourth/g.png')) ||
      printedUrls.some((url) => url.endsWith('/old/fourth/r.png'))
    )
      throw Error('Printed frame palette was not captured immutably');
    const custom = {
      ...fixtures[0],
      setCode: 'CUSTOM',
      setSymbol: 'test:symbol',
      illustration: 'test:art',
    };
    if (faceSetSymbol(custom) !== 'test:symbol') throw Error('Custom symbol ignored');
    const input = { face: custom, printingId: null, printedImage: null, layer: 'etching' };
    const styledInput = {
      ...input,
      layer: 'face',
      face: { ...custom, rulesParagraphs: paragraphs },
    };
    if (
      cardTextureKey(styledInput, 'inspect') ===
      cardTextureKey({ ...styledInput, face: { ...styledInput.face, legalText: null } }, 'inspect')
    )
      throw Error('Default and suppressed legal text share a cache identity');
    const styledChange = structuredClone(styledInput);
    styledChange.face.rulesParagraphs[0].runs[0].italic = true;
    if (cardTextureKey(styledInput, 'inspect') === cardTextureKey(styledChange, 'inspect'))
      throw Error('Rules style absent from cache identity');
    const alignedChange = structuredClone(styledInput);
    alignedChange.face.rulesParagraphs[0].align = 'right';
    if (cardTextureKey(styledInput, 'inspect') === cardTextureKey(alignedChange, 'inspect'))
      throw Error('Paragraph alignment absent from cache identity');
    if (
      cardTextureKey(input, 'table') ===
      cardTextureKey({ ...input, face: { ...custom, setSymbol: 'test:other' } }, 'table')
    )
      throw Error('Symbol absent from cache identity');
    let masks = 0,
      disposed = 0;
    const controller = new AbortController();
    const loadImages = async (urls) => ({
      images: new Map(urls.map((url) => [url, bitmap])),
      dispose() {
        disposed++;
      },
    });
    for (const setCode of ['3ed', '4ed']) {
      const symbolFace = {
        ...fixtures[3],
        setCode,
        manaSymbols: ['W'],
        rulesParagraphs: undefined,
        rulesText: '{T}: Add {W}.',
        wordingMode: 'oracle',
        symbolStyle: 'modern',
      };
      const historicalFace = { ...symbolFace, symbolStyle: 'original' };
      if (
        JSON.stringify(retroTextLayout(ctx, symbolFace)) !==
        JSON.stringify(retroTextLayout(ctx, historicalFace))
      )
        throw Error('Symbol selection changed Oracle text layout');
      const symbolRasters = [];
      for (const face of [symbolFace, historicalFace]) {
        const canvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          controller.signal,
          { loadImages },
        );
        symbolRasters.push(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height));
        canvas.width = canvas.height = 0;
      }
      const changedIn = ([x, y, w, h]) => {
        for (let yy = Math.floor(y * 1.5); yy < Math.ceil((y + h) * 1.5); yy++)
          for (let xx = Math.floor(x * 1.5); xx < Math.ceil((x + w) * 1.5); xx++) {
            const n = (yy * symbolRasters[0].width + xx) * 4;
            if (
              [0, 1, 2, 3].some(
                (k) => symbolRasters[0].data[n + k] !== symbolRasters[1].data[n + k],
              )
            )
              return true;
          }
        return false;
      };
      if (
        changedIn([415, 26, 38, 40]) !== (setCode === '3ed') ||
        !changedIn([65, 410, 355, 190]) ||
        changedIn([35, 85, 380, 310])
      )
        throw Error(
          'Historic symbols must retain frame/art and the Fourth sun, while changing tap and the Revised sun',
        );
    }
    const beforeFailure = disposed;
    let rejectedOverflow = false;
    try {
      await composeCardTexture(
        {
          face: { ...fixtures[3], rulesText: 'W'.repeat(1000) },
          printingId: null,
          printedImage: null,
        },
        'inspect',
        controller.signal,
        { loadImages },
      );
    } catch (error) {
      rejectedOverflow = /does not fit/.test(String(error));
    }
    if (!rejectedOverflow || disposed !== beforeFailure + 1)
      throw Error('Retro overflow must reject the face and release its image lease');
    disposed = 0;
    const mask = await composeCardTexture(input, 'table', controller.signal, {
      loadImages,
      resolveEtching: async (face, id, signal, threshold) => {
        if (face !== custom || id !== null || signal !== controller.signal)
          throw Error('Mask resolution context lost');
        masks++;
        return 'test:mask';
      },
    });
    const alpha = mask.getContext('2d').getImageData(122, 110, 1, 1).data[3];
    if (!alpha || masks !== 1 || disposed !== 2)
      throw Error(
        `Missing mask or leaked image lease: ${JSON.stringify({ alpha, masks, disposed })}`,
      );
    const empty = await composeCardTexture(
      { ...input, face: { ...custom, setCode: undefined } },
      'table',
      controller.signal,
      { loadImages, resolveEtching: async () => null },
    );
    if (empty.getContext('2d').getImageData(122, 110, 1, 1).data[3])
      throw Error('Absent mask paints art');
    const scan = 'https://cards.scryfall.io/normal/front/a/b/abcd.jpg';
    const requested = [];
    await composeCardTexture(
      { face: fixtures[0], printingId: 'abcd', printedImage: scan },
      'inspect',
      controller.signal,
      {
        loadImages: async (urls) => {
          requested.push(...urls);
          return { images: new Map(urls.map((url) => [url, bitmap])), dispose() {} };
        },
      },
    );
    if (requested[0] !== 'https://cards.scryfall.io/png/front/a/b/abcd.png')
      throw Error('Inspection scan is not lossless');
    const optical = opticalDocument(1, 1, fixtures[0], 'silver');
    return {
      sizes,
      leases,
      released,
      stage: optical.layers[0].stage,
      tone: optical.recipe.overlayFoil.tone,
      edges: optical.recipe.edges.length,
    };
  }, fixtures);
  assert.deepEqual(
    result.sizes,
    fixtures.flatMap(() => [
      [244, 340],
      [732, 1020],
    ]),
  );
  assert.equal(result.leases, result.released, 'Release every image lease');
  assert.equal(result.stage, 'over-finish');
  assert.equal(result.tone, 'silver');
  assert.equal(result.edges, 0);
  console.log(
    `${fixtures.length} Magic layouts painted at both tiers; profiles, immutable recipes, lease release and optical layering passed.`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
