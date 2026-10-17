const hidden = new WeakSet<CanvasRenderingContext2D>();

export function rulesInkVisible(context: CanvasRenderingContext2D): boolean {
  return !hidden.has(context);
}

export function withRulesInk(
  context: CanvasRenderingContext2D,
  visible: boolean,
  paint: () => void,
): void {
  const wasHidden = hidden.has(context);
  if (!visible) hidden.add(context);
  try {
    paint();
  } finally {
    if (!wasHidden) hidden.delete(context);
  }
}
