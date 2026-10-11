export interface AbilityEmblem {
  name: string;
  path: string;
  viewBox?: readonly [number, number, number, number];
  transform?: readonly [number, number, number, number, number, number];
  filled?: boolean;
}
