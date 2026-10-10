export type Theme = 'orbit' | 'tide' | 'garden';
export const palettes = {
  orbit: { ink: '#151827', metal: '#c8b3ec', accent: '#c2d6fc', label: 'CELESTIAL ARCHIVE' },
  tide: { ink: '#092728', metal: '#d9be87', accent: '#7ee0cb', label: 'DEEPWATER RELICS' },
  garden: { ink: '#321a25', metal: '#eac091', accent: '#ffc09b', label: 'THE LIVING EMBER' },
};
export interface ShowcaseCard {
  name: string;
  subtitle: string;
  rules: string;
  theme: Theme;
  charge: number;
  serial: string;
  illustration: string;
}
type Ctx = CanvasRenderingContext2D;
function line(ctx: Ctx, points: number[][]) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x!, y!) : ctx.moveTo(x!, y!)));
  ctx.stroke();
}
export function emblem(ctx: Ctx, x: number, y: number, radius: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8,
      r = i % 2 ? radius * 0.35 : radius;
    const x = Math.sin(a) * r,
      y = -Math.cos(a) * r;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
export function engravings(ctx: Ctx, theme: Theme, monochrome = false) {
  ctx.strokeStyle = monochrome ? '#fff' : palettes[theme].metal;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = 1.5;
  line(ctx, [
    [38, 140],
    [38, 48],
    [125, 48],
  ]);
  line(ctx, [
    [595, 48],
    [682, 48],
    [682, 850],
    [626, 916],
    [94, 916],
    [38, 858],
    [38, 658],
  ]);
  line(ctx, [
    [52, 143],
    [52, 61],
    [125, 61],
  ]);
  line(ctx, [
    [595, 61],
    [668, 61],
    [668, 842],
    [619, 902],
    [100, 902],
    [52, 851],
    [52, 666],
  ]);
  for (const y of [198, 264, 330]) {
    ctx.beginPath();
    ctx.arc(72, y, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(72, y, 21, 0, Math.PI * 2);
    ctx.stroke();
  }
  emblem(ctx, 360, 940, 15);
  for (let i = 0; i < 7; i++) {
    const x = 270 + i * 30;
    ctx.beginPath();
    ctx.arc(x, 676, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (theme === 'tide') {
    for (let i = 0; i < 4; i++)
      line(ctx, [
        [568 + i * 19, 720],
        [583 + i * 19, 737],
        [568 + i * 19, 754],
      ]);
  } else if (theme === 'garden') {
    for (let i = 0; i < 4; i++) emblem(ctx, 642, 740 + i * 25, 6);
  } else {
    ctx.beginPath();
    ctx.arc(621, 748, 24, 0, Math.PI * 2);
    ctx.stroke();
    line(ctx, [
      [592, 748],
      [650, 748],
    ]);
    line(ctx, [
      [621, 719],
      [621, 777],
    ]);
  }
}
function wrap(ctx: Ctx, text: string, x: number, y: number, width: number) {
  for (const paragraph of text.split('\n')) {
    let row = '';
    for (const word of paragraph.split(' ')) {
      if (row && ctx.measureText(row + ' ' + word).width > width) {
        ctx.fillText(row, x, y);
        y += 29;
        row = word;
      } else row += (row ? ' ' : '') + word;
    }
    ctx.fillText(row, x, y);
    y += 38;
  }
}
export function frame(ctx: Ctx, card: ShowcaseCard) {
  const style = palettes[card.theme];
  const veil = ctx.createLinearGradient(0, 430, 0, 860);
  veil.addColorStop(0, 'transparent');
  veil.addColorStop(0.54, style.ink + 'cc');
  veil.addColorStop(1, style.ink);
  ctx.fillStyle = veil;
  ctx.fillRect(0, 430, 720, 570);
  // Separate medallions keep the illustration visible between the stats.
  for (const y of [198, 264, 330]) {
    const enamel = ctx.createRadialGradient(64, y - 9, 0, 72, y, 25);
    enamel.addColorStop(0, style.ink + 'd9');
    enamel.addColorStop(1, style.ink);
    ctx.fillStyle = enamel;
    ctx.beginPath();
    ctx.arc(72, y, 25, 0, Math.PI * 2);
    ctx.fill();
  }
  engravings(ctx, card.theme);
  ctx.textAlign = 'center';
  ctx.fillStyle = style.metal;
  ctx.font = '600 14px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(style.label, 360, 57);
  ctx.letterSpacing = '0px';
  ctx.font = '600 21px sans-serif';
  [card.charge, 'II', '07'].forEach((v, i) => ctx.fillText(String(v), 72, 205 + i * 66));
  ctx.textAlign = 'left';
  ctx.fillStyle = style.accent;
  ctx.font = '500 15px sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(card.subtitle.toUpperCase(), 90, 631);
  ctx.letterSpacing = '0px';
  ctx.font = '500 48px serif';
  ctx.fillStyle = '#fff1dd';
  ctx.fillText(card.name, 86, 734, 480);
  ctx.fillStyle = '#e2decc';
  ctx.font = '22px sans-serif';
  wrap(ctx, card.rules, 90, 790, 500);
  ctx.fillStyle = style.metal;
  ctx.font = '12px sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('GLINT  /  ORIGINAL SERIES', 68, 969);
  ctx.textAlign = 'right';
  ctx.fillText(card.serial, 652, 969);
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0px';
}
