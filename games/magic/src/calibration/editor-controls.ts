import type { HsbAdjustment } from '../presentation/hsb.js';
import { dualCalibrationControls } from './dual-controls.js';
import type { SetCalibrationProfile } from './types.js';
import type { CalibrationControl, CalibrationGroup, CalibrationValue } from './editor-types.js';

/** Explicit control families. Asset URLs, masks and evidence are never writable paths. */
export function calibrationControls(profile: SetCalibrationProfile): CalibrationControl[] {
  const controls: CalibrationControl[] = [];
  const number = (
    id: string,
    value: number,
    group: CalibrationGroup,
    scope: string,
    min: number,
    max: number,
    step: number,
    unit = 'px',
  ) => {
    controls.push({
      id,
      label: id
        .split('.')
        .slice(scope === 'all' ? 0 : 2)
        .join(' · '),
      value,
      group,
      scope,
      kind: 'number',
      min,
      max,
      step,
      unit,
    });
  };
  const choice = (
    id: string,
    value: CalibrationValue,
    group: CalibrationGroup,
    scope: string,
    options?: string[],
  ) =>
    controls.push({
      id,
      label: id.split('.').slice(2).join(' · '),
      value,
      group,
      scope,
      kind: typeof value === 'boolean' ? 'boolean' : options ? 'choice' : 'color',
      options,
    });
  for (const [key, frame] of Object.entries(profile.frames)) {
    if (!frame) continue;
    for (const rect of [
      'frame',
      'art',
      frame.stockMaskFrame ? 'stockMaskFrame' : 'stockWindow',
    ] as const)
      frame[rect]!.forEach((value, i) =>
        number(
          `frames.${key}.${rect}.${i}`,
          value,
          'frame',
          key,
          i < 2 ? -0.15 : 0.05,
          1.3,
          0.0005,
          'card fraction',
        ),
      );
  }
  number(
    'cornerRadius',
    profile.cornerRadius ?? 0.045,
    'frame',
    'all',
    0.01,
    0.09,
    0.001,
    'card width',
  );
  for (const role of ['title', 'type', 'footer.artist', 'footer.legal', 'footer.stats']) {
    const p = role.startsWith('footer.')
      ? profile.footer[role.slice(7) as keyof SetCalibrationProfile['footer']]
      : profile[role as 'title' | 'type'];
    for (const [key, value] of Object.entries(p)) {
      if (typeof value !== 'number' || key === 'collectorTotal') continue;
      const gray = /gray/i.test(key),
        ratio = key === 'width';
      number(
        `${role}.${key}`,
        value,
        role.startsWith('footer') ? 'footer' : 'lettering',
        'all',
        key === 'x' || key === 'y' ? 0 : ratio ? 0.6 : 0,
        key === 'x' || key === 'maxWidth'
          ? 488
          : key === 'y'
            ? 680
            : gray
              ? 255
              : key === 'size'
                ? 60
                : ratio
                  ? 1.5
                  : 4,
        gray ? 1 : 0.05,
        ratio ? 'ratio' : gray ? 'sRGB 0–255' : 'px',
      );
    }
  }
  if (profile.footer.legal.align !== undefined)
    choice('footer.legal.align', profile.footer.legal.align, 'footer', 'all', [
      'left',
      'center',
      'right',
    ]);
  if (profile.basicSymbol?.bounds)
    profile.basicSymbol.bounds.forEach((value, i) =>
      number(
        'basicSymbol.bounds.' + i,
        value,
        'symbols',
        'basic lands',
        i < 2 ? 0 : 0.01,
        1,
        0.0005,
        'card fraction',
      ),
    );
  for (const [color, spec] of Object.entries(profile.basicSymbol?.symbols ?? {})) {
    if (!spec?.placement) continue;
    for (const key of ['dx', 'dy', 'scaleX', 'scaleY'] as const) {
      const scale = /scale/.test(key);
      number(
        'basicSymbol.symbols.' + color + '.placement.' + key,
        spec.placement[key] ?? (scale ? 1 : 0),
        'symbols',
        'basic ' + color,
        scale ? 0.7 : -12,
        scale ? 1.4 : 12,
        scale ? 0.005 : 0.125,
        scale ? 'ratio' : 'px',
      );
    }
  }
  for (const [scope, p] of Object.entries(profile.rulesPlacement ?? {})) {
    if (!p) continue;
    number(
      'rulesPlacement.' + scope + '.baselineScale',
      p.baselineScale,
      'body',
      scope,
      0.9,
      1.1,
      0.005,
      'ratio',
    );
    p.offset.forEach((value, i) =>
      number('rulesPlacement.' + scope + '.offset.' + i, value, 'body', scope, -8, 8, 0.25),
    );
    p.verticalLimits.forEach((value, i) =>
      number(
        'rulesPlacement.' + scope + '.verticalLimits.' + i,
        value,
        'body',
        scope,
        0,
        680,
        0.25,
      ),
    );
    if (p.maximumHeight !== undefined)
      number(
        'rulesPlacement.' + scope + '.maximumHeight',
        p.maximumHeight,
        'body',
        scope,
        1,
        240,
        0.25,
      );
  }
  if (profile.footer.artist.align !== undefined)
    choice('footer.artist.align', profile.footer.artist.align, 'footer', 'all', [
      'left',
      'center',
      'right',
    ]);
  if (profile.footer.artist.baseline !== undefined)
    choice('footer.artist.baseline', profile.footer.artist.baseline, 'footer', 'all', [
      'alphabetic',
      'middle',
      'top',
      'bottom',
    ]);
  if (profile.footer.artist.inkStyle !== undefined)
    choice('footer.artist.inkStyle', profile.footer.artist.inkStyle, 'footer', 'all', [
      'filled',
      'separate-shadow',
    ]);
  if (profile.expansionBody) {
    const variants = [
      ['expansionBody', profile.expansionBody, 'all'],
      ['expansionBody.unconstrained', profile.expansionBody.unconstrained, 'unconstrained'],
    ] as const;
    for (const [path, values, scope] of variants)
      for (const [key, value] of Object.entries(values ?? {})) {
        if (typeof value === 'boolean') {
          choice(path + '.' + key, value, 'body', scope);
          continue;
        }
        if (typeof value !== 'number') continue;
        const count = key === 'threshold' || key === 'flavorOrphanMinCharacters',
          freeSpace = key === 'minimumFreeSpace',
          ratio = /Width|Leading/i.test(key),
          offset = /offset/i.test(key);
        number(
          path + '.' + key,
          value,
          'body',
          scope,
          offset ? -30 : ratio ? 0.5 : freeSpace ? 0 : count ? (key === 'threshold' ? 1 : 0) : 6,
          offset ? 30 : ratio ? 1.5 : freeSpace ? 680 : count ? 1000 : 48,
          count ? 1 : ratio ? 0.005 : 0.25,
          count ? 'count' : ratio ? 'ratio' : 'px',
        );
      }
    for (const [key, value] of Object.entries(profile.expansionBody.bounds ?? {}))
      number(
        'expansionBody.bounds.' + key,
        value,
        'body',
        'all',
        0,
        key === 'y' || key === 'height' ? 680 : 488,
        0.25,
      );
  }
  if (profile.bodyClasses) {
    const scope = 'size classes';
    for (const [key, value] of Object.entries(profile.bodyClasses.bounds))
      number(
        'bodyClasses.bounds.' + key,
        value,
        'body',
        scope,
        0,
        key === 'y' || key === 'height' ? 680 : 488,
        0.25,
      );
    for (const family of ['centered', 'compact'] as const)
      for (const [key, value] of Object.entries(profile.bodyClasses[family])) {
        const count = key === 'maxCharacters' || key === 'maxLines';
        const ratio = key === 'leading';
        number(
          'bodyClasses.' + family + '.' + key,
          value,
          'body',
          scope,
          count ? 1 : ratio ? 0.5 : 6,
          key === 'maxCharacters' ? 1000 : key === 'maxLines' ? 30 : ratio ? 2 : 48,
          count ? 1 : ratio ? 0.01 : 0.25,
          count ? 'count' : ratio ? 'ratio' : 'px',
        );
      }
    for (const [key, value] of Object.entries(profile.bodyClasses.typography)) {
      if (typeof value === 'boolean') choice('bodyClasses.typography.' + key, value, 'body', scope);
      else if (typeof value === 'number') {
        const offset = key === 'centerOffset';
        const symbol = key === 'symbolOffsetY';
        const ratio = key === 'textWidth' || key === 'leading' || symbol;
        number(
          'bodyClasses.typography.' + key,
          value,
          'body',
          scope,
          symbol ? -0.5 : offset ? -24 : ratio ? 0.5 : 0,
          symbol ? 0.5 : offset ? 24 : ratio ? 2 : 30,
          ratio ? 0.01 : 0.25,
          ratio ? 'ratio' : 'px',
        );
      }
    }
  }
  if (profile.textTiers)
    for (const [key, value] of Object.entries(profile.textTiers)) {
      if (typeof value === 'boolean') choice(`textTiers.${key}`, value, 'body', 'all');
      else if (typeof value === 'number') {
        const ratio = key === 'denseWidth';
        const count = ['largeMaximum', 'mediumMaximum', 'retainRegularAboveLines'].includes(key);
        number(
          `textTiers.${key}`,
          value,
          'body',
          'all',
          ratio ? 0.7 : count ? 1 : -24,
          ratio ? 1.3 : count ? 1000 : 488,
          ratio ? 0.005 : count ? 1 : 0.25,
          ratio ? 'ratio' : count ? 'count' : 'px',
        );
      }
    }
  if (profile.footer.stats.inkStyle !== undefined)
    choice('footer.stats.inkStyle', profile.footer.stats.inkStyle, 'footer', 'all', [
      'filled',
      'separate-shadow',
    ]);
  if (profile.footer.stats.baseline !== undefined)
    choice('footer.stats.baseline', profile.footer.stats.baseline, 'footer', 'all', [
      'alphabetic',
      'middle',
    ]);
  controls.push(...dualCalibrationControls(profile));
  const mana = profile.mana.geometry;
  for (const key of [
    'dx',
    'dy',
    'scaleX',
    'scaleY',
    'spacing',
    'numberScale',
    'numberDx',
    'numberDy',
  ] as const) {
    const scale = /scale/i.test(key);
    number(
      `mana.geometry.${key}`,
      mana[key] ?? (scale ? 1 : 0),
      'symbols',
      'all',
      scale ? 0.7 : -12,
      scale ? 1.4 : 12,
      scale ? 0.005 : 0.25,
      scale ? 'ratio' : 'px',
    );
  }
  for (const color of ['W', 'U', 'B', 'R', 'G'] as const)
    for (const key of ['dx', 'dy', 'scale'] as const)
      number(
        `mana.geometry.glyphs.${color}.${key}`,
        mana.glyphs?.[color]?.[key] ?? (key === 'scale' ? 1 : 0),
        'symbols',
        color,
        key === 'scale' ? 0.5 : -6,
        key === 'scale' ? 1.5 : 6,
        key === 'scale' ? 0.005 : 0.25,
        key === 'scale' ? 'ratio' : 'px',
      );
  for (const [color, policy] of Object.entries(profile.mana.sourceInk ?? {})) {
    if (policy)
      number(
        `mana.sourceInk.${color}.pixels`,
        policy.pixels,
        'symbols',
        color,
        0,
        1,
        0.05,
        'px per 24px disc',
      );
  }
  for (const [key, symbol] of Object.entries(profile.setSymbols ?? {})) {
    if (!symbol) continue;
    for (const name of ['right', 'centerY', 'width', 'height', 'outline'] as const)
      number(
        `setSymbols.${key}.${name}`,
        symbol[name] ?? 0,
        'symbols',
        key,
        name === 'width' || name === 'height' ? 1 : 0,
        name === 'right' ? 488 : name === 'centerY' ? 680 : name === 'outline' ? 6 : 100,
        0.25,
      );
  }
  for (const scope of ['default', ...Object.keys(profile.frames)]) {
    const values = { ...profile.rulesAdjustments?.default, ...profile.rulesAdjustments?.[scope] };
    choice(`rulesAdjustments.${scope}.alignment`, values?.alignment ?? 'printing', 'body', scope, [
      'printing',
      'left',
      'center',
    ]);
    for (const key of [
      'leftMargin',
      'rightMargin',
      'vertical',
      'fontSize',
      'textWidth',
      'leading',
      'paragraphGap',
      'flavorGap',
    ] as const) {
      const ratio = ['textWidth', 'leading', 'paragraphGap', 'flavorGap'].includes(key);
      const limit = key === 'fontSize' ? 4 : ratio ? 0.3 : 24;
      number(
        `rulesAdjustments.${scope}.${key}`,
        values?.[key] ?? 0,
        'body',
        scope,
        -limit,
        limit,
        ratio ? 0.005 : 0.25,
        ratio ? 'ratio delta' : 'px delta',
      );
    }
  }
  for (const [scope, body] of Object.entries(profile.body ?? {})) {
    if (!body) continue;
    for (const [key, value] of Object.entries(body.bounds))
      number(
        `body.${scope}.bounds.${key}`,
        value,
        'body',
        scope,
        0,
        key === 'y' || key === 'height' ? 680 : 488,
        0.25,
      );
    for (const key of ['minimumSize', 'maximumSize'] as const)
      number(`body.${scope}.${key}`, body[key], 'body', scope, 6, 48, 0.25);
    for (const [key, value] of Object.entries(body.typography)) {
      if (typeof value === 'number')
        number(
          `body.${scope}.typography.${key}`,
          value,
          'body',
          scope,
          key === 'symbolOffsetY' ? -0.5 : key === 'centerOffset' ? -20 : 0,
          key === 'symbolOffsetY' ? 0.5 : key === 'centerOffset' ? 20 : 3,
          0.01,
          'ratio',
        );
      else if (typeof value === 'boolean')
        choice(`body.${scope}.typography.${key}`, value, 'body', scope);
    }
    if (body.centered)
      for (const [key, value] of Object.entries(body.centered))
        number(
          `body.${scope}.centered.${key}`,
          value,
          'body',
          scope,
          0,
          key === 'maxCharacters' ? 1000 : key === 'maxLines' ? 30 : 48,
          key === 'maximumSize' ? 0.25 : 1,
        );
  }
  const rgb = (id: string, value: readonly number[], scope: string, max = 1) =>
    value.forEach((n, i) => number(`${id}.${i}`, n, 'colors', scope, 0, max, 0.005, 'sRGB ratio'));
  for (const [color, spec] of Object.entries(profile.basicSymbol?.symbols ?? {}))
    if (spec) rgb('basicSymbol.symbols.' + color + '.ink', spec.ink, 'basic ' + color);
  if (profile.footer.artist.tint) rgb('footer.artist.tint', profile.footer.artist.tint, 'all', 1.5);
  if (profile.footer.stats.tint) rgb('footer.stats.tint', profile.footer.stats.tint, 'all', 1.5);
  for (const [variant, values] of Object.entries(profile.mana.variants ?? {})) {
    for (const [key, value] of Object.entries(values?.geometry ?? {})) {
      if (typeof value !== 'number') continue;
      const ratio = /scale/i.test(key);
      number(
        'mana.variants.' + variant + '.geometry.' + key,
        value,
        'symbols',
        variant,
        ratio ? 0.7 : -12,
        ratio ? 1.4 : 12,
        ratio ? 0.005 : 0.25,
        ratio ? 'ratio' : 'px',
      );
    }
    for (const [symbol, paper] of Object.entries(values?.paper ?? {}))
      if (paper)
        rgb('mana.variants.' + variant + '.paper.' + symbol, paper, variant + '/' + symbol);
  }
  rgb('mana.ink', profile.mana.ink, 'all');
  for (const [material, tone] of Object.entries(profile.mana.inlineGeneric ?? {})) {
    rgb('mana.inlineGeneric.' + material + '.paper', tone.paper, 'Inline generic / ' + material);
    number(
      'mana.inlineGeneric.' + material + '.alpha',
      tone.alpha,
      'colors',
      'Inline generic / ' + material,
      0,
      1,
      0.01,
      'opacity',
    );
  }
  for (const [key, paper] of Object.entries(profile.mana.paper))
    if (paper) rgb(`mana.paper.${key}`, paper, key);
  for (const [scope, pigment] of Object.entries(profile.colors)) {
    if (!pigment) continue;
    choice(`colors.${scope}.stock`, pigment.stock, 'colors', scope);
    const adjustment = pigment.adjustment;
    const tones: (readonly [string, HsbAdjustment])[] =
      'mask' in adjustment
        ? [
            ['frame', adjustment.frame],
            ['paper', adjustment.paper],
            ...(adjustment.regions ?? []).map(
              (r, i) => ['regions.' + i + '.adjustment', r.adjustment] as const,
            ),
            ...(adjustment.accents ?? []).map(
              (r, i) => ['accents.' + i + '.adjustment', r.adjustment] as const,
            ),
          ]
        : [['', adjustment]];
    for (const [part, tone] of tones) {
      const prefix = `colors.${scope}.adjustment${part ? '.' + part : ''}`;
      for (const key of ['hueDegrees', 'saturationScale', 'brightnessScale', 'valueGamma'] as const)
        number(
          `${prefix}.${key}`,
          tone[key] ?? (key === 'hueDegrees' ? 0 : 1),
          'colors',
          scope,
          key === 'hueDegrees' ? -180 : key === 'valueGamma' ? 0.5 : 0,
          key === 'hueDegrees' ? 180 : key === 'valueGamma' ? 2 : 3,
          key === 'hueDegrees' ? 0.5 : 0.005,
          key === 'hueDegrees' ? 'degrees' : 'ratio',
        );
      rgb(`${prefix}.rgbScale`, tone.rgbScale ?? [1, 1, 1], scope, 3);
    }
    if (adjustment.blackPoint) {
      rgb(`colors.${scope}.adjustment.blackPoint.lift`, adjustment.blackPoint.lift, scope, 0.5);
      number(
        `colors.${scope}.adjustment.blackPoint.transition`,
        adjustment.blackPoint.transition,
        'colors',
        scope,
        0.01,
        1,
        0.005,
        'sRGB ratio',
      );
    }
    if (adjustment.outerStock)
      rgb(`colors.${scope}.adjustment.outerStock`, adjustment.outerStock, scope);
  }
  return controls.map((control) => {
    const match = /^rulesAdjustments\.([^.]+)\.([^.]+)$/.exec(control.id);
    if (!match || match[1] === 'default') return control;
    const own = profile.rulesAdjustments?.[match[1]!] as Record<string, unknown> | undefined;
    return own?.[match[2]!] === undefined
      ? { ...control, inheritedFrom: `rulesAdjustments.default.${match[2]}` }
      : control;
  });
}
