/** Study-only interception at complete native paint operations. Recording an
 * offscreen fillText alone loses its trimming and final composite shadow. */
export function typographyReplayTransform(source, id) {
  if (id.endsWith('/retro-rules.ts'))
    return source.replace('function baseRetroTextLayout(', 'export function baseRetroTextLayout(');
  if (id.endsWith('/rules-paint.ts'))
    return source.replace(
      '  if (!rulesInkVisible(context)) return;',
      '  if ((globalThis as any).__abuBody?.(context, layout, images, paintSymbol, inkInsetEm, color)) return;\n  if (!rulesInkVisible(context)) return;',
    );
  if (id.endsWith('/solid-title.ts'))
    return source.replace(
      '  c.save();',
      '  if ((globalThis as any).__abuSolidTitle?.(c, text, x, y, maxWidth, p, colors)) return;\n  c.save();',
    );
  if (id.endsWith('/early-reprint-footer-ink.ts'))
    return source.replace(
      "  const layer = document.createElement('canvas');",
      "  if ((globalThis as any).__abuFooterInk?.(c, text, maxWidth, p)) return;\n  const layer = document.createElement('canvas');",
    );
}
