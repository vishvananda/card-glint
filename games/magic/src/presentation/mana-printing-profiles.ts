import type { Rgb } from './hsb.js';

/** Disc targets are independent of the chosen glyph source. Geometry and ink
 * are fitted separately; these colors are opt-in through printing calibration.
 * Evidence: fixtures/accuracy/{beta-mana-materials,showcased-mana-colors,
 * legends-mana-colors}.json. */
export const MANA_PRINTING_TARGETS: Readonly<Record<string, Rgb>> = {
  // Revised historical sources; modern-symbol palettes retain their existing keys.
  '3ed-original-white-W': [0.8521319233711989, 0.8537300452588441, 0.7805140237036171],
  '3ed-original-white-U': [0.7197916769966878, 0.8574870629987649, 0.8848519514014757],
  '3ed-original-white-B': [0.6183897045560648, 0.598906967079761, 0.5711638942333385],
  '3ed-original-white-R': [0.8453954458863518, 0.725346913054003, 0.6595513163330279],
  '3ed-original-white-G': [0.738278558074136, 0.8178270999757926, 0.7143458161436361],
  '3ed-original-white-N': [0.7546753932012926, 0.7437237486701979, 0.7230634678276427],
  '3ed-original-white-INK': [0.1568627450980392, 0.17254901960784313, 0.1411764705882353],

  'leg-black-U': [0.6941176470588235, 0.9019607843137255, 0.8823529411764706],
  'leg-black-R': [0.8941176470588236, 0.7568627450980392, 0.5764705882352941],
  'leg-black-G': [0.7098039215686275, 0.8509803921568627, 0.5803921568627451],
  'lea-black-U': [0.6078431372549019, 0.7294117647058823, 0.7803921568627451],
  'lea-black-B': [0.3607843137254902, 0.39215686274509803, 0.396078431372549],
  'lea-black-R': [0.807843137254902, 0.6313725490196078, 0.5450980392156862],
  'lea-black-G': [0.596078431372549, 0.6980392156862745, 0.5372549019607843],
  'lea-black-N': [0.47843137254901963, 0.5333333333333333, 0.5450980392156862],
  '3ed-white-G': [0.7294117647058823, 0.807843137254902, 0.6901960784313725],
  '3ed-white-N': [0.7607843137254902, 0.7450980392156863, 0.7215686274509804],
  '8ed-white-U': [0.6901960784313725, 0.8235294117647058, 0.8901960784313725],
  '8ed-white-N': [0.6980392156862745, 0.6941176470588235, 0.6588235294117647],
  'm21-black-W': [0.984313725490196, 0.9764705882352941, 0.8549019607843137],
  'm21-black-U': [0.7450980392156863, 0.8666666666666667, 0.9764705882352941],
  'm21-black-R': [0.9294117647058824, 0.6470588235294118, 0.49411764705882355],
  'm21-black-G': [0.6549019607843137, 0.8, 0.6745098039215687],
  'leb-black-W': [0.8941176470588236, 0.8941176470588236, 0.8196078431372549],
  'leb-black-U': [0.6588235294117647, 0.8, 0.8588235294117647],
  'leb-black-B': [0.44313725490196076, 0.47843137254901963, 0.4745098039215686],
  'leb-black-R': [0.8431372549019608, 0.6666666666666666, 0.596078431372549],
  'leb-black-G': [0.6862745098039216, 0.7803921568627451, 0.6549019607843137],
  'leb-black-N': [0.6352941176470588, 0.6549019607843137, 0.6588235294117647],
  'lea-black-INK': [0.08627450980392157, 0.10196078431372549, 0.11372549019607843],
  'leb-black-INK': [0.10588235294117647, 0.09411764705882353, 0.07450980392156863],
};

/** Expansion in pixels for a nominal 24px disc. Only measured printing/source
 * combinations qualify; other printings retain their source artwork. */
export const MANA_PRINTING_INK: Readonly<
  Record<string, { family: string; pixels: number; paperSample?: 'opaque-percentile' }>
> = {
  // The 4%-height probe touches the skull's antialiased forehead on this source.
  '3ed/B': { family: 'mse-old', pixels: 0, paperSample: 'opaque-percentile' },
  'leb/R': { family: 'mse-old', pixels: 0.4 },
  'drk/B': { family: 'mse-old', pixels: 0.2, paperSample: 'opaque-percentile' },
  'drk/R': { family: 'mse-old', pixels: 0.2, paperSample: 'opaque-percentile' },
};
