import type { SetCalibrationProfile } from '../types.js';

/** Unlimited shared printing controls; source-only migration seed, not validated defaults. */
export const profile = {
  schema: 1,
  revision: 1,
  set: '2ed',
  border: 'white',
  frames: {
    W: {
      family: 'abu',
      assetKey: 'w',
      frame: [0, 0, 1, 1],
      art: [0.116, 0.1043, 0.7654, 0.441],
      stockWindow: [0, 0, 1, 1],
      stockMask: 'source',
    },
    U: {
      family: 'abu',
      assetKey: 'u',
      frame: [0, 0, 1, 1],
      art: [0.116, 0.1043, 0.7654, 0.441],
      stockWindow: [0, 0, 1, 1],
      stockMask: 'source',
    },
    B: {
      family: 'abu',
      assetKey: 'b',
      frame: [0, 0, 1, 1],
      art: [0.116, 0.1043, 0.7654, 0.441],
      stockWindow: [0, 0, 1, 1],
      stockMask: 'source',
    },
    R: {
      family: 'abu',
      assetKey: 'r',
      frame: [0, 0, 1, 1],
      art: [0.116, 0.1043, 0.7654, 0.441],
      stockWindow: [0, 0, 1, 1],
      stockMask: 'source',
    },
    G: {
      family: 'abu',
      assetKey: 'g',
      frame: [0, 0, 1, 1],
      art: [0.116, 0.1043, 0.7654, 0.441],
      stockWindow: [0, 0, 1, 1],
      stockMask: 'source',
    },
    A: {
      family: 'abu',
      assetKey: 'a',
      frame: [0, 0, 1, 1],
      art: [0.116, 0.1043, 0.7654, 0.441],
      stockWindow: [0, 0, 1, 1],
      stockMask: 'source',
    },
    L: {
      family: 'abu',
      assetKey: 'l',
      frame: [0, 0, 1, 1],
      art: [0.116, 0.1043, 0.7654, 0.441],
      stockWindow: [0, 0, 1, 1],
      stockMask: 'source',
      landPalette: true,
    },
  },
  colors: {
    W: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    U: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    B: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    R: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    G: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    A: {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    'L-W': {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/wl.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    'L-U': {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/ul.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    'L-B': {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/bl.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    'L-R': {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/rl.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
    'L-G': {
      source:
        '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/gl.png",[0,0,1,1]]',
      stock: '#eeedeb',
      adjustment: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
    },
  },
  mana: {
    geometry: {},
    paper: {
      W: [0.9215686274509804, 0.9235294117647059, 0.8431372549019608],
      U: [0.6784313725490196, 0.8176470588235295, 0.8754901960784314],
      R: [0.8745098039215686, 0.6960784313725488, 0.6196078431372549],
    },
    ink: [0.050980392156862744, 0.058823529411764705, 0.058823529411764705],
  },
  title: {
    x: 34.16,
    y: 47.328,
    size: 27.8,
    width: 1,
    shadow: 1,
    trim: 0,
    gray: 171,
  },
  type: {
    x: 52.4112,
    y: 391.51,
    size: 21.7,
    width: 1,
    shadow: 1,
    trim: 0,
    gray: 171,
  },
  footer: {
    artist: {
      x: 49,
      y: 631,
      size: 22.5,
      width: 1,
      shadow: 1.25,
      trim: 0,
      gray: 171,
    },
    legal: {
      x: 49,
      y: 645,
      size: 8,
      width: 1,
      shadow: 0,
      trim: 0,
      lightGray: 171,
      darkGray: 35,
    },
    stats: {
      x: 451,
      y: 632.5,
      size: 27.8,
      width: 1,
      shadow: 1.25,
      trim: 0,
      gray: 171,
    },
  },
  footerText: {
    artistPrefix: 'Illus. © ',
    legal: '',
  },
} satisfies SetCalibrationProfile;

export const review = {
  revision: 1,
  scope:
    'Unreleased Unlimited audit seed. Existing ABU assets and printing geometry; original wording supplied independently. Numeric baseline values are not a completed calibration.',
  evidence: ['games/magic/fixtures/accuracy/2ed/audit-preparation/review.json'],
  pending: [
    'frame family and aperture geometry',
    'heading and footer ink/placement',
    'rules/flavor policy',
    'mana geometry and pigment',
    'frame/paper pigment and black levels',
    'full native score and outlier validation',
  ],
};
