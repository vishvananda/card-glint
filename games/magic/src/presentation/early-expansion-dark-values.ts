import type { EarlyExpansionFrameGeometry } from './early-expansion-frame-values.js';
import type { FrameHsb } from './frame-hsb.js';

// The Dark's four lands and three gold cards use separate plate families.
// Frozen scan-only poses precede source/geometry selection. Colors are shared
// by material; the small gold cohort is not a donor for other sets.
// Evidence: fixtures/accuracy/early-expansion-dark-frames.json.
export const DARK_FRAMES: Readonly<Partial<Record<string, EarlyExpansionFrameGeometry>>> = {
  'drk/L': {
    family: 'abu',
    frame: [-0.013743852459016406, -0.014323529411764744, 1.028, 1.0235],
    art: [0.10687481420765026, 0.09290028011204479, 0.7840213333333333, 0.45034],
    stockWindow: [
      0.038372537365304674, 0.029927666637637684, 0.9228063947301375, 0.9373903798505366,
    ],
  },
  'drk/M': {
    family: 'fourth',
    frame: [0.0037039999999999296, 0.004364999999999952, 0.990558, 0.9932930000000001],
    art: [0.10804277599999994, 0.09281537666666662, 0.78584268, 0.45123882000000004],
    stockWindow: [
      0.038372537365304674, 0.029927666637637684, 0.9228063947301375, 0.9373903798505366,
    ],
  },
};

export const DARK_COLORS: Readonly<
  Record<string, { source: string; stock: string; adjustment: FrameHsb }>
> = {
  'drk/L': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.013743852459016406,-0.014323529411764744,1.028,1.0235]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 15.053712033967122,
        saturationScale: 0.851698443694213,
        brightnessScale: 1.3806569068931471,
        valueGamma: 1.2612117214637717,
      },
      paper: {
        hueDegrees: -160.17254199917548,
        saturationScale: 0.0803808310379582,
        brightnessScale: 0.96875002416465,
      },
      mask: {
        kind: 'rect',
        rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
        feather: 0.0013333333333333333,
      },
      accents: [
        {
          mask: {
            rings: [
              {
                outer: [
                  0.09310414939082734, 0.0872726227765166, 0.8172800918543088, 0.472714733181988,
                ],
                inner: [
                  0.10705771193468139, 0.09876720595419412, 0.7893729667666007, 0.45116238972384265,
                ],
              },
              {
                outer: [
                  0.12300464055622887, 0.5959079283887467, 0.7574791095235057, 0.2945486939279864,
                ],
                inner: [
                  0.1409449352554698, 0.6088393344636339, 0.7215985201250239, 0.2701227046754217,
                ],
              },
            ],
            hueCenter: 29,
            hueRadius: 25,
            hueFeather: 10,
            saturation: [0.25, 0.48],
          },
          adjustment: {
            hueDegrees: -121.2107567229518,
            saturationScale: 0.38346036585069093,
            brightnessScale: 0.3720930232041745,
          },
        },
        {
          mask: {
            rings: [
              {
                outer: [
                  0.049250095681571744, 0.04273111296301621, 0.9029948331951266, 0.9210034771114112,
                ],
                inner: [
                  0.06719039038081266, 0.05566251903790342, 0.8651208777189513, 0.889393373372798,
                ],
              },
            ],
            hueCenter: 29,
            hueRadius: 25,
            hueFeather: 10,
            saturation: [0.25, 0.48],
          },
          adjustment: {
            hueDegrees: -99.32515598479127,
            saturationScale: 0.29891977136362763,
            brightnessScale: 0.5804827313632643,
          },
        },
      ],
    },
  },
  'drk/M': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.0037039999999999296,0.004364999999999952,0.990558,0.9932930000000001]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -11.994683405585683,
        saturationScale: 0.6356207383906354,
        brightnessScale: 0.9313845771881127,
        valueGamma: 1.0329321771462636,
      },
      paper: {
        hueDegrees: -24.105642369886258,
        saturationScale: 0.4796630967703456,
        brightnessScale: 0.9324323962458886,
      },
      mask: {
        kind: 'rect',
        rect: [0.1160164271047228, 0.6008146639511202, 0.7742282963611269, 0.29501617347550013],
        feather: 0.0013333333333333333,
      },
    },
  },
};
