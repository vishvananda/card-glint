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
    for (const rect of ['frame', 'art', 'stockWindow'] as const)
      frame[rect].forEach((value, i) =>
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
      const gray = /gray/i.test(key),
        ratio = key === 'width';
      number(
        `${role}.${key}`,
        value,
        role.startsWith('footer') ? 'footer' : 'lettering',
        'all',
        key === 'x' || key === 'y' ? 0 : ratio ? 0.6 : 0,
        key === 'x' ? 488 : key === 'y' ? 680 : gray ? 255 : key === 'size' ? 60 : ratio ? 1.5 : 4,
        gray ? 1 : 0.05,
        ratio ? 'ratio' : gray ? 'sRGB 0–255' : 'px',
      );
    }
  }
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
    const values = profile.rulesAdjustments?.[scope];
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
          key === 'centerOffset' ? -20 : 0,
          key === 'centerOffset' ? 20 : 3,
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
  rgb('mana.ink', profile.mana.ink, 'all');
  for (const [key, paper] of Object.entries(profile.mana.paper))
    if (paper) rgb(`mana.paper.${key}`, paper, key);
  for (const [scope, pigment] of Object.entries(profile.colors)) {
    if (!pigment) continue;
    choice(`colors.${scope}.stock`, pigment.stock, 'colors', scope);
    const adjustment = pigment.adjustment;
    const tones =
      'mask' in adjustment
        ? ([
            ['frame', adjustment.frame],
            ['paper', adjustment.paper],
          ] as const)
        : ([['', adjustment]] as const);
    for (const [part, tone] of tones) {
      const prefix = `colors.${scope}.adjustment${part ? '.' + part : ''}`;
      for (const key of ['hueDegrees', 'saturationScale', 'brightnessScale', 'valueGamma'] as const)
        number(
          `${prefix}.${key}`,
          tone[key] ?? 1,
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
  return controls;
}
