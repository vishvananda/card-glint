import type { FrameHsb } from './frame-hsb.js';
import type { EarlyExpansionFrameGeometry } from './early-expansion-frame-values.js';
/** Red source/geometry extension; see the red-frame calibration receipt.
 * Rejected scan poses do not influence these shared printing profiles. */
export const EARLY_EXPANSION_RED_FRAMES: Readonly<Record<string, EarlyExpansionFrameGeometry>> = {
  'atq/R': {
    family: 'fourth',
    frame: [0.005741032786885253, 0.003875294117647035, 0.9900709999999999, 0.995748],
    art: [0.10804836945355191, 0.09207011697478988, 0.7861163739999999, 0.45235409142857136],
    stockWindow: [
      0.038803990666756966, 0.030084103446862763, 0.9222112784916465, 0.9372200417779069,
    ],
  },
  'drk/R': {
    family: 'fourth',
    frame: [0.005497032786885287, 0.003936470588235265, 0.9905579999999999, 0.9952570000000001],
    art: [0.10785469278688528, 0.09208780487394955, 0.7865030519999999, 0.45213103714285713],
    stockWindow: [
      0.038372537365304674, 0.029927666637637684, 0.9228063947301375, 0.9373903798505366,
    ],
  },
};

/** Source-bound frame and paper fits; shared set stock retains its separate target. */
export const EARLY_EXPANSION_RED_COLORS: Readonly<
  Record<string, { source: string; stock: string; adjustment: FrameHsb }>
> = {
  'atq/R': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.005741032786885253,0.003875294117647035,0.9900709999999999,0.995748]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -5.06202013331654,
        saturationScale: 0.7966369226366342,
        brightnessScale: 0.8465344826879605,
        valueGamma: 1.2874975904870842,
      },
      paper: {
        hueDegrees: 1.3084229600186745,
        saturationScale: 0.7137019230769232,
        brightnessScale: 0.7142857142857143,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'drk/R': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.005497032786885287,0.003936470588235265,0.9905579999999999,0.9952570000000001]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -14.822680479685992,
        saturationScale: 0.713980938724586,
        brightnessScale: 0.912448781306126,
        valueGamma: 1.119045488282831,
      },
      paper: {
        hueDegrees: -8.511963070441652,
        saturationScale: 0.6308842757683822,
        brightnessScale: 0.8089285714285716,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
};
