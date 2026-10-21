import type { SetCalibrationProfile } from './types.js';
import type { CalibrationControl } from './editor-types.js';

/** Fixed source assets/masks cannot be edited. Shared plate tones and band
 * measurements remain ordinary bounded, serializable set proposals. */
export function dualCalibrationControls(profile: SetCalibrationProfile): CalibrationControl[] {
  const dual = profile.dualLand;
  if (!dual) return [];
  const controls: CalibrationControl[] = [
    {
      id: 'dualLand.stock',
      label: 'Dual land · outer stock',
      value: dual.stock,
      kind: 'color',
      group: 'colors',
      scope: 'L-dual',
    },
  ];
  const number = (
    id: string,
    value: number,
    min: number,
    max: number,
    step: number,
    unit: string,
    scope = 'L-dual',
  ) =>
    controls.push({
      id,
      label: id.split('.').slice(1).join(' · '),
      value,
      kind: 'number',
      group:
        id.startsWith('dualLand.pinline.box') || id.startsWith('dualLand.pinline.width')
          ? 'frame'
          : 'colors',
      scope,
      min,
      max,
      step,
      unit,
    });
  for (const part of ['box', 'width'] as const)
    for (const [key, value] of Object.entries(dual.pinline[part]))
      number(
        `dualLand.pinline.${part}.${key}`,
        value,
        0,
        part === 'width' ? 80 : key === 'top' || key === 'bottom' ? 2100 : 1500,
        0.25,
        'source px',
      );
  const rgb = (id: string, values: readonly number[], scope: string) =>
    values.forEach((v, i) => number(`${id}.${i}`, v, 0, 1, 0.005, 'sRGB ratio', scope));
  for (const [color, ink] of Object.entries(dual.pinline.palette))
    if (ink) rgb(`dualLand.pinline.palette.${color}`, ink, color);
  if (dual.pinline.edge) rgb('dualLand.pinline.edge', dual.pinline.edge, 'L-dual');
  for (const [color, source] of Object.entries(dual.sources)) {
    if (!source) continue;
    const adjustment = source.adjustment;
    const tones =
      'mask' in adjustment
        ? ([
            ['frame', adjustment.frame],
            ['paper', adjustment.paper],
          ] as const)
        : ([['', adjustment]] as const);
    for (const [part, tone] of tones)
      for (const key of [
        'hueDegrees',
        'saturationScale',
        'brightnessScale',
        'valueGamma',
      ] as const) {
        const hue = key === 'hueDegrees';
        number(
          `dualLand.sources.${color}.adjustment${part ? '.' + part : ''}.${key}`,
          tone[key] ?? (hue ? 0 : 1),
          hue ? -180 : key === 'valueGamma' ? 0.5 : 0,
          hue ? 180 : key === 'valueGamma' ? 2 : 3,
          hue ? 0.5 : 0.005,
          hue ? 'degrees' : 'ratio',
          color,
        );
      }
  }
  return controls;
}
