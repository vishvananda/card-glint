import type { Finish } from '@card-glint/browser';

export const finishGroups = {
  mixed: ['prismatic', 'cold', 'opal', 'etched'],
  surfaces: ['rain', 'pool', 'heat', 'gloss'],
} as const satisfies Record<string, readonly Finish[]>;

export const finishNames: Record<Finish, string> = {
  regular: 'Uncoated',
  gloss: 'Gloss',
  etched: 'Etched silver',
  cold: 'Cold foil',
  opal: 'Opal embossing',
  prismatic: 'Prismatic',
  rain: 'Rainlit window',
  heat: 'Heat shimmer',
  pool: 'Liquid prism',
};
