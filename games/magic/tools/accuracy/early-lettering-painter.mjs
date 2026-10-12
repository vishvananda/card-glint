/** Prototype only: production parity is checked before adoption. */
export function paintEarlyTrial(c, native, text, x, y, maxWidth, candidate, role, face) {
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  const spec = candidate[role];
  if (role === 'title') {
    maxWidth += x - spec.x;
    x = spec.x;
    y += spec.dy;
    c.font = `${spec.size}px "CardRenderer MTG Goudy", Georgia`;
  } else {
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    c.font = `${spec.size}px "CardRenderer MTG MPlantin", Georgia`;
    text = `Illus. © ${face.artist}`;
    x = spec.x;
    y = spec.baseline;
    maxWidth = 338;
  }
  if (spec.mode === 'dark-highlight') {
    c.fillStyle = '#17140f';
    c.shadowColor = '#f2eee3';
    c.shadowOffsetX = c.shadowOffsetY = -spec.offset * c.getTransform().a;
    native.call(c, text, x, y, maxWidth);
  } else {
    const layer = document.createElement('canvas');
    layer.width = c.canvas.width;
    layer.height = c.canvas.height;
    const ink = layer.getContext('2d');
    if (!ink) throw Error('Missing lettering context');
    const matrix = c.getTransform();
    ink.font = c.font;
    ink.textAlign = c.textAlign;
    ink.textBaseline = c.textBaseline;
    ink.letterSpacing = c.letterSpacing;
    c.resetTransform();
    for (const [shift, subtract, color] of [
      [0, spec.offset, '#f2eee3'],
      [spec.offset, 0, '#17140f'],
    ]) {
      ink.resetTransform();
      ink.clearRect(0, 0, layer.width, layer.height);
      ink.setTransform(matrix);
      ink.globalCompositeOperation = 'source-over';
      ink.fillStyle = color;
      native.call(ink, text, x + shift, y + shift, maxWidth);
      ink.globalCompositeOperation = 'destination-out';
      native.call(ink, text, x + subtract, y + subtract, maxWidth);
      c.drawImage(layer, 0, 0);
    }
    layer.width = layer.height = 0;
  }
  c.restore();
}
