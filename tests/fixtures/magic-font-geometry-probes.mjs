/** Shared document/worker probes. Font bytes are served only after SHA verification. */
export async function fontGeometryProbes({ fonts, moduleURL, assetBase, headingURL }) {
  const { measureFontText, paintFontText, strokeFontText, setFont } = await import(
    /* @vite-ignore */ moduleURL
  );
  const fontSet = typeof document === 'undefined' ? globalThis.fonts : document.fonts;
  if (!fontSet) throw Error('FontFaceSet is unavailable');
  const canvas =
    typeof document === 'undefined'
      ? new OffscreenCanvas(512, 256)
      : document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const c = canvas.getContext('2d');
  if (!c) throw Error('Canvas2D is unavailable');
  const rows = [],
    wraps = [];
  for (const font of fonts) {
    const bytes = await fetch(new URL(font.sha256, assetBase)).then((r) => {
      if (!r.ok) throw Error('Font bytes unavailable');
      return r.arrayBuffer();
    });
    const face = await new FontFace(font.family, bytes, {
      weight: font.weight,
      style: font.style,
    }).load();
    fontSet.add(face);
    if (face.status !== 'loaded') throw Error('Font was substituted: ' + font.family);
    const sample = font.family.endsWith('Artist Credit')
      ? 'a'
      : font.family.endsWith('Historic Symbols')
        ? '\uea31\ue61c'
        : /(?:Small Caps|ModMatrix|MPlantin Bold)$/.test(font.family)
          ? '1/13*'
          : 'Agjfn 0123456789';
    for (const character of sample)
      if (!Object.hasOwn(font.glyphs, String(character.codePointAt(0))))
        throw Error('Probe has a fallback character: ' + font.family + ' ' + character);
    for (const size of [11, 25.029, 30.368, 100]) {
      setFont(
        c,
        font.style +
          ' ' +
          (font.requestedWeight ?? font.weight.split(' ').at(-1)) +
          ' ' +
          size +
          'px "' +
          font.family +
          '"',
      );
      c.textAlign = 'left';
      c.fillStyle = '#111';
      c.strokeStyle = '#111';
      c.textRendering = 'optimizeSpeed';
      c.fontKerning = 'none';
      for (const baseline of ['alphabetic', 'middle', 'top', 'bottom', 'hanging', 'ideographic']) {
        c.textBaseline = baseline;
        const before = {
          font: c.font,
          baseline: c.textBaseline,
          rendering: c.textRendering,
          kerning: c.fontKerning,
          transform: c.getTransform().toString(),
        };
        const m = measureFontText(c, sample),
          draws = [],
          originalFill = c.fillText,
          originalStroke = c.strokeText;
        const rendering = c.textRendering,
          kerning = c.fontKerning;
        c.save();
        c.textRendering = 'geometricPrecision';
        c.fontKerning = 'normal';
        const nativeWidth = c.measureText(sample).width;
        c.restore();
        c.textRendering = rendering;
        c.fontKerning = kerning;
        if (Math.abs(m.width - nativeWidth) > Math.max(0.1, nativeWidth * 0.005))
          throw Error(
            'Normalized advance is implausible: ' +
              JSON.stringify({ font: font.family, size, width: m.width, nativeWidth }),
          );
        c.fillText = function (text, x, y, width) {
          draws.push({
            baseline: this.textBaseline,
            y,
            rendering: this.textRendering,
            kerning: this.fontKerning,
          });
          return originalFill.call(this, text, x, y, width);
        };
        c.strokeText = function (text, x, y, width) {
          draws.push({
            baseline: this.textBaseline,
            y,
            rendering: this.textRendering,
            kerning: this.fontKerning,
          });
          return originalStroke.call(this, text, x, y, width);
        };
        c.clearRect(0, 0, 512, 256);
        try {
          paintFontText(c, sample, 14, 150, 300);
          strokeFontText(c, sample, 14, 150, 300);
        } finally {
          c.fillText = originalFill;
          c.strokeText = originalStroke;
        }
        const after = {
          font: c.font,
          baseline: c.textBaseline,
          rendering: c.textRendering,
          kerning: c.fontKerning,
          transform: c.getTransform().toString(),
        };
        if (JSON.stringify(before) !== JSON.stringify(after))
          throw Error(
            'Font geometry leaked Canvas state ' +
              JSON.stringify({ font: font.family, size, baseline, before, after }),
          );
        if (
          draws.length !== 2 ||
          draws.some(
            (d) =>
              d.baseline !== 'alphabetic' ||
              d.rendering !== 'geometricPrecision' ||
              d.kerning !== 'normal',
          )
        )
          throw Error('Text bypassed explicit geometry');
        let ink;
        if (size === 30.368 && baseline === 'middle') {
          const bytes = c.getImageData(0, 0, 512, 256).data;
          let top = 256,
            bottom = -1;
          for (let y = 0; y < 256; y++)
            for (let x = 0; x < 512; x++)
              if (bytes[(y * 512 + x) * 4 + 3] > 127) {
                top = Math.min(top, y);
                bottom = Math.max(bottom, y);
              }
          ink = bottom < 0 ? null : [top, bottom];
        }
        rows.push({
          font: font.family,
          style: font.style,
          weight: font.weight,
          requestedWeight: font.requestedWeight ?? null,
          size,
          baseline,
          text: sample,
          width: m.width,
          ascent: m.actualBoundingBoxAscent,
          descent: m.actualBoundingBoxDescent,
          fontAscent: m.fontBoundingBoxAscent,
          fontDescent: m.fontBoundingBoxDescent,
          drawY: draws[0].y,
          ...(ink !== undefined ? { ink } : {}),
        });
      }
    }
    if (font.family === 'CardRenderer MTG Matrix' && font.weight.includes('700')) {
      const { paintFittedText } = await import(
        /* @vite-ignore */ headingURL || moduleURL.replace('font-geometry.ts', 'canvas-text.ts')
      );
      for (const baseline of ['alphabetic', 'middle', 'top']) {
        c.textBaseline = baseline;
        const native = c.fillText;
        let observed;
        c.fillText = function (text, x, y) {
          observed = { baseline: this.textBaseline, y };
        };
        try {
          paintFittedText(c, 'Serra Angel', 14, 150, 400, 30, true, 1, font.family);
        } finally {
          c.fillText = native;
        }
        const expected = 150 + font.anchors[baseline] * 30;
        if (
          !observed ||
          observed.baseline !== 'alphabetic' ||
          Math.abs(observed.y - expected) > 0.025
        )
          throw Error('Fitted headings overrode the layout anchor: ' + baseline);
      }
    }
    if (font.weight === '400') {
      const style = font.style === 'normal' ? '' : font.style + ' ';
      setFont(c, style + '400 30px "' + font.family + '"');
      const normal = measureFontText(c, sample).width;
      setFont(c, style + '700 30px "' + font.family + '"');
      if (Math.abs(measureFontText(c, sample).width - normal) > 0.025)
        throw Error('A fixed face used synthetic bold: ' + font.family);
    }
    // Positive yMin (digits/colon) and negative yMax (underscore) must not be
    // clamped to the baseline: badge centering uses these signed bounds.
    setFont(c, font.style + ' ' + font.weight.split(' ').at(-1) + ' 30px "' + font.family + '"');
    c.textBaseline = 'alphabetic';
    for (const character of ['7', ':', '_']) {
      const bounds = font.glyphs[String(character.codePointAt(0))];
      if (!bounds || (bounds[0] === 0 && bounds[1] === 0)) continue;
      const metrics = measureFontText(c, character);
      if (
        Math.abs(metrics.actualBoundingBoxAscent - (bounds[1] * 30) / font.unitsPerEm) > 0.025 ||
        Math.abs(metrics.actualBoundingBoxDescent + (bounds[0] * 30) / font.unitsPerEm) > 0.025
      )
        throw Error('Signed ink bounds were lost: ' + font.family + ' ' + character);
    }
    c.letterSpacing = '0px';
    c.wordSpacing = '0px';
    c.textAlign = 'left';
    const left = measureFontText(c, sample);
    for (const [align, factor] of [
      ['center', 0.5],
      ['right', 1],
      ['left', 0],
    ]) {
      c.textAlign = align;
      const metrics = measureFontText(c, sample);
      if (
        Math.abs(metrics.width - left.width) > 0.025 ||
        Math.abs(metrics.actualBoundingBoxLeft - left.actualBoundingBoxLeft - left.width * factor) >
          0.025 ||
        Math.abs(
          metrics.actualBoundingBoxRight - left.actualBoundingBoxRight + left.width * factor,
        ) > 0.025
      )
        throw Error('Alignment cache changed the ink anchor: ' + font.family + ' ' + align);
    }
    if (!/Artist Credit|Historic Symbols/.test(font.family)) {
      c.textAlign = 'left';
      const plain = measureFontText(c, 'Ag fn').width;
      c.letterSpacing = '.125px';
      c.wordSpacing = '.5px';
      const tracked = measureFontText(c, 'Ag fn').width;
      if (Math.abs(tracked - plain - 1.125) > 0.025)
        throw Error('Tracking differs: ' + font.family + ' ' + (tracked - plain));
      c.letterSpacing = '0px';
      c.wordSpacing = '0px';
    }
    if (!/Artist Credit|Historic Symbols/.test(font.family)) {
      setFont(
        c,
        font.style +
          ' ' +
          (font.requestedWeight ?? font.weight.split(' ').at(-1)) +
          ' 25.029px "' +
          font.family +
          '"',
      );
      c.textBaseline = 'alphabetic';
      const text = 'Flying First strike When this creature enters draw a card',
        words = text.split(' ');
      for (const budget of [100, 154.25, 233.5]) {
        const lines = [];
        let line = '';
        for (const word of words) {
          const next = line ? line + ' ' + word : word;
          if (line && measureFontText(c, next).width > budget) {
            lines.push(line);
            line = word;
          } else line = next;
        }
        if (line) lines.push(line);
        wraps.push({ font: font.family, style: font.style, weight: font.weight, budget, lines });
      }
    }
  }
  return { rows, wraps };
}

/** Native metrics survey used to regenerate the reviewed font catalog. */
export async function rawFontSurvey({ fonts, assetBase }) {
  const rows = [];
  for (const [index, font] of fonts.entries()) {
    const bytes = await fetch(new URL(font.sha256, assetBase)).then((r) => r.arrayBuffer());
    const family = 'Survey Font ' + index;
    const face = await new FontFace(family, bytes, {
      weight: font.weight,
      style: font.style,
    }).load();
    document.fonts.add(face);
    const c = document.createElement('canvas').getContext('2d'),
      cases = [];
    c.textRendering = 'geometricPrecision';
    c.fontKerning = 'normal';
    for (const size of [24, 30, 100]) {
      c.font =
        font.style + ' ' + font.weight.split(' ').at(-1) + ' ' + size + 'px "' + family + '"';
      for (const baseline of ['alphabetic', 'middle', 'top', 'bottom', 'hanging', 'ideographic']) {
        c.textBaseline = baseline;
        const m = c.measureText('Agjfn 0123456789');
        const metrics = Object.fromEntries(
          [
            'width',
            'actualBoundingBoxAscent',
            'actualBoundingBoxDescent',
            'fontBoundingBoxAscent',
            'fontBoundingBoxDescent',
            'alphabeticBaseline',
            'hangingBaseline',
            'ideographicBaseline',
          ].map((k) => [k, m[k]]),
        );
        cases.push({ size, baseline, metrics });
      }
    }
    rows.push({ ...font, cases });
  }
  return { ua: navigator.userAgent, rows };
}
