import { calibrationEntries, setCalibrationProfiles } from '../calibration/profiles.js';
export const REPRINT_MANA = Object.fromEntries(
  Object.entries(setCalibrationProfiles).map(([key, p]) => [key, p!.mana.geometry]),
);
export const REPRINT_MANA_PAPER = calibrationEntries((p) => p.mana.paper);
export const REPRINT_MANA_INK = Object.fromEntries(
  Object.entries(setCalibrationProfiles).map(([key, p]) => [key, p!.mana.ink]),
);
