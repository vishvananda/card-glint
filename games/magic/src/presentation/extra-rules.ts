import { faceFrame, faceRects } from './special-frames.js';
import { FACE_WIDTH, FACE_HEIGHT, type RenderedCardInput } from './face-layout.js';
import { componentAsset, manaSymbolAsset, RENDERER_COMPONENT_ROOT } from './assets.js';
import { resolveCardProfile } from './profile.js';
import { symbolTextParts } from './face-layout.js';

/** Shared layout instructions for the upstream Adventure, Class and level-up treatments. */
export interface ExtraRuleBlock {
  kind: 'rules' | 'heading' | 'level' | 'stats' | 'band';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font: number;
  fill?: string;
  color?: string;
  asset?: string;
  italic?: boolean;
  align?: 'left' | 'right';
}
export const CLASS_LEVEL_ASSET = `${RENDERER_COMPONENT_ROOT}/img/class_level_bg.webp`;
export const hasExtraRules = (face: RenderedCardInput) =>
  ['adventure', 'class', 'leveler'].includes(faceFrame(face));
const mm = (x: number, y: number, w: number, h: number) => ({
  x: (x / 63.5) * 488,
  y: (y / 88.9) * 680,
  width: (w / 63.5) * 488,
  height: (h / 88.9) * 680,
});
const paperColors: Record<string, string> = {
  W: '#dcc8af',
  U: '#b9c0da',
  B: '#af9aa5',
  R: '#d7a67c',
  G: '#b2c0b0',
};

/** Conservative fit shared by CSS and canvas; mana tokens count as one glyph. */
function fit(text: string, width: number, height: number, max = 21) {
  const lines = text.replace(/\{[^}]+\}/g, '●').split('\n');
  let font = max;
  while (
    font > 8 &&
    lines.reduce(
      (n, line) => n + Math.max(1, Math.ceil((line.length * font * 0.53) / width)) * font + 4,
      0,
    ) > height
  )
    font -= 0.5;
  return font;
}
export function extraRuleBlocks(face: RenderedCardInput): ExtraRuleBlock[] {
  const kind = faceFrame(face),
    blocks: ExtraRuleBlock[] = [];
  const add = (
    kind: ExtraRuleBlock['kind'],
    text: string,
    rect: ReturnType<typeof mm>,
    options: Partial<ExtraRuleBlock> = {},
  ) => {
    blocks.push({ kind, text, ...rect, font: fit(text, rect.width, rect.height), ...options });
  };
  if (kind === 'adventure') {
    const spell = face.faces?.[1];
    if (!spell) return [];
    const cost = (spell.manaSymbols ?? []).map((s) => `{${s}}`).join('');
    const costWidth = (spell.manaSymbols?.length ?? 0) * 2.5;
    add('heading', spell.name, mm(5.6, 55.3, 25 - costWidth, 4.2), {
      color: 'white',
      font: Math.min(18, ((25 - costWidth) * 488) / 63.5 / Math.max(1, spell.name.length * 0.55)),
    });
    add('rules', cost, mm(30 - costWidth, 55.3, costWidth, 4.2), { color: 'white', font: 17 });
    add('heading', spell.typeLine ?? '', mm(5.6, 59.5, 25, 4.2), {
      color: 'white',
      font: Math.min(17, (25 * 488) / 63.5 / Math.max(1, (spell.typeLine ?? '').length * 0.52)),
    });
    add('rules', spell.rulesText ?? '', mm(5.6, 64.5, 24.7, 15.6));
    add('rules', face.rulesText ?? face.faces?.[0]?.rulesText ?? '', mm(33, 54.9, 25.5, 25));
  } else if (kind === 'class') {
    const [x, y, w, h] = faceRects(face).rules.map(
      (v, i) => v * (i % 2 ? FACE_HEIGHT : FACE_WIDTH),
    );
    const profile = resolveCardProfile(face);
    add(
      'band',
      '',
      { x: x!, y: y!, width: w!, height: h! },
      {
        fill: '#e3d8bb',
        asset: componentAsset(
          'saga_textboxes',
          profile.boxes === 'Colourless' ? 'Land' : profile.boxes,
        ),
      },
    );
    const rows: string[] = [];
    for (const line of (face.rulesText ?? '').split('\n').filter(Boolean)) {
      if (
        rows.length &&
        !/^.*:\s*Level\s+\d+\s*$/i.test(line) &&
        !/^.*:\s*Level\s+\d+\s*$/i.test(rows.at(-1)!) &&
        !rows.at(-1)!.startsWith('(')
      )
        rows[rows.length - 1] += '\n' + line;
      else rows.push(line);
    }
    const isHeader = (line: string) => /^.*:\s*Level\s+\d+\s*$/i.test(line);
    const headerHeight = 28,
      font = 20;
    const lineCount = (text: string, size: number) =>
      text
        .split('\n')
        .reduce(
          (n, line) => n + Math.max(1, Math.ceil((line.length * size * 0.53) / (w! - 10))),
          0,
        );
    const demand = rows.map((text) =>
      isHeader(text)
        ? headerHeight
        : lineCount(text, text.startsWith('(') ? 16 : font) * (text.startsWith('(') ? 16 : font) +
          8,
    );
    const normalCount = rows.filter((line) => !isHeader(line)).length;
    const spare = Math.max(0, h! - demand.reduce((n, v) => n + v, 0)) / Math.max(1, normalCount);
    const scale = Math.min(
      1,
      (h! - rows.filter(isHeader).length * headerHeight) /
        demand.reduce((n, v, i) => n + (isHeader(rows[i]!) ? 0 : v), 0),
    );
    let top = y!;
    rows.forEach((text, i) => {
      const header = isHeader(text),
        height = header ? headerHeight : demand[i]! * scale + spare;
      if (header) {
        const [cost, level] = text.split(/:\s*/);
        add('band', '', { x: x!, y: top, width: w!, height }, { asset: CLASS_LEVEL_ASSET });
        add('rules', cost + ':', { x: x! + 5, y: top, width: w! / 2 - 5, height }, { font: 18 });
        add(
          'heading',
          level!,
          { x: x! + w! / 2, y: top, width: w! / 2 - 5, height },
          { font: 18, align: 'right' },
        );
      } else
        add(
          'rules',
          text,
          { x: x! + 5, y: top + 4, width: w! - 10, height: height - 8 },
          { font: (text.startsWith('(') ? 16 : font) * scale, italic: text.startsWith('(') },
        );
      top += height;
    });
  } else if (kind === 'leveler') {
    const text = face.rulesText ?? '',
      parts = text.split(/^LEVEL\s+([^\n]+)\n/gm);
    const rows = [
      {
        range: '',
        text: parts[0] ?? '',
        stats:
          face.power != null && face.toughness != null ? `${face.power}/${face.toughness}` : '',
      },
    ];
    for (let i = 1; i < parts.length; i += 2) {
      const content = parts[i + 1] ?? '',
        match = content.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      rows.push({
        range: parts[i]!,
        stats: match?.[1] ?? '',
        text: match ? content.slice(match[0].length) : content,
      });
    }
    const rect = mm(4.9, 55.6, 53.7, 25.5),
      height = rect.height / rows.length;
    const color = paperColors[resolveCardProfile(face).frame] ?? '#dcc8af';
    rows.forEach((row, i) => {
      const y = rect.y + i * height;
      if (i)
        add(
          'band',
          '',
          { x: rect.x, y, width: rect.width, height },
          { fill: i % 2 ? '#00000018' : '#00000028' },
        );
      const left = row.range ? 55 : 7,
        right = row.stats ? 72 : 7;
      add('rules', row.text, {
        x: rect.x + left,
        y: y + 4,
        width: rect.width - left - right,
        height: height - 8,
      });
      if (row.range)
        add(
          'level',
          `LEVEL\n${row.range}`,
          { x: rect.x - 12, y: y + height / 2 - 23, width: 65, height: 46 },
          { fill: color, font: 13 },
        );
      if (row.stats)
        add(
          'stats',
          row.stats,
          { x: rect.x + rect.width - 68, y: y + height / 2 - 22, width: 77, height: 44 },
          { asset: componentAsset('pt-boxes', resolveCardProfile(face).pt), font: 26 },
        );
    });
  }
  return blocks;
}
export function extraRuleAssets(face: RenderedCardInput): (string | null)[] {
  return extraRuleBlocks(face).flatMap((block) => [
    block.asset ?? null,
    ...symbolTextParts(block.text).flatMap((p) => (p.symbol ? [manaSymbolAsset(p.symbol)] : [])),
  ]);
}
export function extraRuleKey(face: RenderedCardInput) {
  if (faceFrame(face) === 'adventure') {
    const spell = face.faces?.[1];
    return spell
      ? [
          spell.name,
          spell.typeLine,
          spell.colors,
          spell.frameColors,
          spell.manaSymbols,
          spell.rulesText,
          spell.rulesParagraphs,
          spell.rulesAlignment,
        ]
      : null;
  }
  return hasExtraRules(face) ? extraRuleBlocks(face) : null;
}
