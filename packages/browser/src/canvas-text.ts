export function ellipsizedText(
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
): string {
  if (context.measureText(text).width <= width) return text;
  const letters = [...text];
  while (letters.length && context.measureText(`${letters.join('')}…`).width > width) letters.pop();
  return letters.length || context.measureText('…').width <= width ? `${letters.join('')}…` : '';
}
