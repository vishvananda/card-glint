import type { Finish } from '@card-glint/browser';

export const finishGroups = {
  mixed: ['prismatic', 'cold', 'opal', 'etched'],
  surfaces: ['rain', 'pool', 'heat', 'gloss'],
} as const satisfies Record<string, readonly Finish[]>;

export const wearLevels = { fresh: 0, light: 0.25, played: 0.6, heavy: 1 } as const;

export const finishNames: Record<Finish, string> = {
  regular: 'Uncoated',
  gloss: 'Gloss',
  holofoil: 'Holofoil',
  etched: 'Etched gold',
  cold: 'Cold foil',
  opal: 'Opal embossing',
  prismatic: 'Prismatic',
  rain: 'Rainlit window',
  heat: 'Heat shimmer',
  pool: 'Liquid prism',
};
