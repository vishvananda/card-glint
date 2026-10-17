import type { FrameHsb } from './frame-hsb.js';
/** Shared per-material fits. Rejected components retain source pigment.
 * Stock targets describe the cached scans, not physical ink measurements. */
export const EARLY_EXPANSION_COLORS: Readonly<
  Record<string, { source: string; stock: string; adjustment: FrameHsb }>
> = {
  'arn/W': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.008741918032786858,0.005528823529411754,0.987149,0.991329]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -13.640927100986662,
        saturationScale: 0.5400738710331036,
        brightnessScale: 1.0492517860747008,
        valueGamma: 0.8994679069282768,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      mask: {
        kind: 'rect',
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333,
      },
    },
  },
  'arn/U': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006729180327868926,0.005528823529411754,0.9886099999999999,0.991329]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 8.695311924531383,
        saturationScale: 0.7336299706894727,
        brightnessScale: 0.9918856718215499,
        valueGamma: 0.8925193131882323,
      },
      paper: {
        hueDegrees: 7.681106138107452,
        saturationScale: 1.4347665118679058,
        brightnessScale: 0.9421487603305786,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'arn/B': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.014993852459016379,-0.01515441176470595,1.0305,1.0270000000000001]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -13.974519149984646,
        saturationScale: 0.48077990027996853,
        brightnessScale: 1.3401551515814558,
        valueGamma: 1.2607231644949974,
      },
      paper: {
        hueDegrees: -11.213063909774519,
        saturationScale: 0.5857999353587588,
        brightnessScale: 0.9227557411273487,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23333333333333334],
        paperRgb: [0.9392156862745098, 0.8, 0.596078431372549],
      },
    },
  },
  'arn/R': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.00599718032786886,0.003936470588235265,0.9900709999999999,0.9952570000000001]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -7.992651881053812,
        saturationScale: 0.70622971619805,
        brightnessScale: 0.8936224010262801,
        valueGamma: 1.38110833476772,
      },
      paper: {
        hueDegrees: -5.943625631125656,
        saturationScale: 0.5376010534051938,
        brightnessScale: 0.7476190476190477,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'arn/G': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.018567622950819714,-0.015338235294117604,1.0315,1.027]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: 25.416811846689825,
        saturationScale: 0.4621650250156346,
        brightnessScale: 1.1037735849056602,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2323529411764706, 0.31176470588235294, 0.2754901960784314],
        paperRgb: [0.41568627450980394, 0.2823529411764706, 0.2549019607843137],
      },
    },
  },
  'arn/A': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.00794918032786887,0.004855000000000054,0.9861749999999999,0.9923109999999999]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 7.632246618375651,
        saturationScale: 0.35000000000000253,
        brightnessScale: 1.1734718355876625,
        valueGamma: 1.2754055770415957,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9869263698630137,
      },
      mask: {
        kind: 'rect',
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333,
      },
    },
  },
  'arn/L': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.007461180327868825,0.006570588235294111,0.987149,0.99182]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: -1.0520296612100992,
        saturationScale: 0.6957976149956239,
        brightnessScale: 0.9456066945606694,
      },
      mask: {
        kind: 'rect',
        rect: [0.1265358333052816, 0.6083023840900922, 0.7510856027198977, 0.2770456451419673],
        feather: 0.0013333333333333333,
      },
    },
  },
  'atq/W': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007729475409836071,0.005406470588235348,0.987636,0.9923109999999999]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 4.6895058968416174,
        saturationScale: 0.8399062893519177,
        brightnessScale: 1.0621330942238176,
        valueGamma: 0.871302303927114,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.3998295454545437,
        brightnessScale: 0.9655372807017544,
      },
      mask: {
        kind: 'rect',
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333,
      },
    },
  },
  'atq/U': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.0052287377049180395,0.0055902941176471125,0.9900709999999999,0.9923109999999999]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: 1.0498949579832697,
        saturationScale: 1.1699718731104778,
        brightnessScale: 0.9380165289256198,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'atq/B': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.01550000000000007,-0.01547058823529413,1.0310000000000001,1.028]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: -3.11206896551721,
        saturationScale: 0.7848932676518883,
        brightnessScale: 0.9372384937238494,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23431372549019608],
        paperRgb: [0.9372549019607843, 0.8, 0.596078431372549],
      },
    },
  },
  'atq/G': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.0180553278688525,-0.015536764705882338,1.0315,1.0285]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: 17.629629629629562,
        saturationScale: 0.6774409323116217,
        brightnessScale: 1.099526066350711,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.23431372549019608, 0.30980392156862746, 0.27450980392156865],
        paperRgb: [0.4137254901960784, 0.2823529411764706, 0.2549019607843137],
      },
    },
  },
  'atq/A': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006204737704918072,0.0046099999999999475,0.988123,0.9928020000000001]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: 2.363636363636374,
        saturationScale: 0.7043207881567981,
        brightnessScale: 0.995433789954338,
      },
      mask: {
        kind: 'rect',
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333,
      },
    },
  },
  'atq/L': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.013737704918032771,-0.011970588235294071,1.0285,1.021]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 7.884638807432336,
        saturationScale: 0.47987074486465253,
        brightnessScale: 1.3740873825800126,
        valueGamma: 1.4999999999999991,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      mask: {
        kind: 'rect',
        rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
        feather: 0.0013333333333333333,
      },
    },
  },
  'drk/W': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007241475409836138,0.005283823529411758,0.9886099999999999,0.99182]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -7.845718158039411,
        saturationScale: 0.9701020808196514,
        brightnessScale: 1.0703611809699505,
        valueGamma: 0.7617441387795468,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35000000000000037,
        brightnessScale: 0.9743421052631579,
      },
      mask: {
        kind: 'rect',
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333,
      },
    },
  },
  'drk/U': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.005741032786885253,0.005651470588235287,0.9900709999999999,0.99182]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 3.885649697326273,
        saturationScale: 0.5020523275923062,
        brightnessScale: 1.0303224022017168,
        valueGamma: 1.0035873157195883,
      },
      paper: {
        hueDegrees: 2.104082150101476,
        saturationScale: 0.6009076119530785,
        brightnessScale: 0.9462809917355373,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'drk/B': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.015750000000000042,-0.01547058823529413,1.0315,1.028]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -60,
        saturationScale: 0.35,
        brightnessScale: 1.4,
        valueGamma: 1.3026215842864537,
      },
      paper: {
        hueDegrees: -7.0356800766284096,
        saturationScale: 0.6512602087114338,
        brightnessScale: 0.9539748953974896,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23333333333333334],
        paperRgb: [0.9372549019607843, 0.8, 0.596078431372549],
      },
    },
  },
  'drk/G': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.021598360655737777,-0.015220588235294158,1.0350000000000001,1.0275]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: -27.640570574898614,
        saturationScale: 0.5938588241247582,
        brightnessScale: 1.0755759219987682,
        valueGamma: 0.8179143870418026,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.23137254901960785, 0.31176470588235294, 0.27647058823529413],
        paperRgb: [0.4117647058823529, 0.2823529411764706, 0.25882352941176473],
      },
    },
  },
  'drk/A': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006192590163934432,0.004732647058823482,0.987636,0.9932930000000001]]',
    stock: '#181510',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
      },
      paper: {
        hueDegrees: -1.9224806201550564,
        saturationScale: 0.8278170951089796,
        brightnessScale: 1.0182648401826484,
      },
      mask: {
        kind: 'rect',
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333,
      },
    },
  },
};
