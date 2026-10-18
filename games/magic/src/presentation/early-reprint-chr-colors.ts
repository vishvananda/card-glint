import type { FrameHsb } from './frame-hsb.js';
// Exact source and geometry bindings; rejected components retain source pigment.
export const COLORS: Readonly<
  Record<string, { source: string; stock: string; adjustment: FrameHsb }>
> = {
  'chr/B': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",[0.008412885245901688,0.0038750000000000173,0.984227,0.9942749999999999]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: 11.568852519850159,
        saturationScale: 0.6264093262885903,
        brightnessScale: 0.9065736283771874,
        valueGamma: 0.9541976053595044,
      },
      paper: {
        hueDegrees: -0.4410660521628355,
        saturationScale: 0.7745741938091182,
        brightnessScale: 0.9568595958706879,
        valueGamma: 0.9945011344331947,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.20784313725490197, 0.24705882352941178, 0.2107843137254902],
        paperRgb: [0.984313725490196, 0.7686274509803922, 0.6196078431372549],
      },
    },
  },
  'chr/W': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.009181327868852507,0.005528235294117663,0.984227,0.9883829999999999]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: -4.596994086979372,
        saturationScale: 0.8953055264086665,
        brightnessScale: 0.9862919182943165,
        valueGamma: 0.9609002199031605,
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.4999999999999698,
        rgbScale: [1.0106057759068157, 1.008282853201524, 1.0109840378918997],
      },
      mask: {
        kind: 'rect',
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333,
      },
    },
  },
  'chr/L-dark': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.01100000000000001,-0.013926470588235276,1.022,1.0205]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 0.9842056445484877,
        rgbScale: [0.8914069949568042, 1.0488497864510804, 1.0479594368209708],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1.1407490587958857,
        rgbScale: [0.9357938366559878, 1.1288249097144825, 1.4],
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
                  0.0942622950819672, 0.08970588235294118, 0.8176229508196722, 0.47205882352941175,
                ],
                inner: [
                  0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                ],
              },
              {
                outer: [
                  0.12295081967213115, 0.5955882352941176, 0.7581967213114754, 0.29558823529411765,
                ],
                inner: [
                  0.13934426229508196, 0.6088235294117647, 0.7233606557377049, 0.27058823529411763,
                ],
              },
            ],
            hueCenter: 28,
            hueRadius: 18,
            hueFeather: 6,
            saturation: [0.25, 0.5],
          },
          adjustment: {
            hueDegrees: -160.2939156174508,
            saturationScale: 0.2989651371356953,
            brightnessScale: 0.339984369186049,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  'chr/M': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.003875114754098333,0.004670882352941216,0.987149,0.9908379999999999]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: -8.0490737174144,
        saturationScale: 0.6638660795531984,
        brightnessScale: 0.8852346944776673,
        valueGamma: 1.2832983694072533,
      },
      paper: {
        hueDegrees: -60,
        saturationScale: 0.6449889379942318,
        brightnessScale: 0.890147821919653,
        valueGamma: 1.223770689695764,
      },
      mask: {
        kind: 'rect',
        rect: [0.1160164271047228, 0.6008146639511202, 0.7742282963611269, 0.29501617347550013],
        feather: 0.0013333333333333333,
      },
    },
  },
  'chr/A': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.008876590163934451,0.004303235294117576,0.9822789999999999,0.9908380000000001]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: -9.068551748087787,
        saturationScale: 0.8143058937854607,
        brightnessScale: 0.9951000256082394,
        valueGamma: 1,
      },
      paper: {
        hueDegrees: -8.683776843697897,
        saturationScale: 0.8933123780266717,
        brightnessScale: 0.9957798178122308,
        valueGamma: 0.9655716295151389,
      },
      mask: {
        kind: 'rect',
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333,
      },
    },
  },
  'chr/L-red': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.01100000000000001,-0.013926470588235276,1.022,1.0205]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 0.9842056445484877,
        rgbScale: [0.8914069949568042, 1.0488497864510804, 1.0479594368209708],
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 1,
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
                  0.0942622950819672, 0.08970588235294118, 0.8176229508196722, 0.47205882352941175,
                ],
                inner: [
                  0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                ],
              },
              {
                outer: [
                  0.12295081967213115, 0.5955882352941176, 0.7581967213114754, 0.29558823529411765,
                ],
                inner: [
                  0.13934426229508196, 0.6088235294117647, 0.7233606557377049, 0.27058823529411763,
                ],
              },
            ],
            hueCenter: 28,
            hueRadius: 18,
            hueFeather: 6,
            saturation: [0.25, 0.5],
          },
          adjustment: {
            hueDegrees: -8.325318175581945,
            saturationScale: 0.9021751995455712,
            brightnessScale: 0.821150624999999,
            valueGamma: 1,
          },
        },
      ],
    },
  },
  'chr/R': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.008669032786885295,0.0024044117647058997,0.984227,0.9942749999999999]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: -3.0028516308257234,
        saturationScale: 0.7275925773992532,
        brightnessScale: 0.8778657961467394,
        valueGamma: 1.2786535204287963,
      },
      paper: {
        hueDegrees: -4.211046047743708,
        saturationScale: 0.7891688428861855,
        brightnessScale: 0.8930931059454512,
        valueGamma: 0.9998539697713557,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'chr/G': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.008913032786885261,0.005283529411764741,0.98374,0.990347]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: 9.280636065714294,
        saturationScale: 0.7459343276389809,
        brightnessScale: 0.9304802532766565,
        valueGamma: 0.9613179419044761,
      },
      paper: {
        hueDegrees: -1.4889003407095591,
        saturationScale: 0.7261749369309223,
        brightnessScale: 0.9304083488244299,
        valueGamma: 0.9361395503330594,
      },
      mask: {
        kind: 'chroma',
        bounds: [0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.23823529411764705, 0.39607843137254906, 0.2823529411764706],
        paperRgb: [0.7686274509803922, 0.596078431372549, 0.4627450980392157],
      },
    },
  },
  'chr/U': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.00816888524590161,0.005222058823529382,0.9847140000000001,0.989365]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: -0.12437268196399776,
        saturationScale: 0.7347159402765367,
        brightnessScale: 0.9487507867873674,
        valueGamma: 1.2454039186238055,
      },
      paper: {
        hueDegrees: -0.8665474296334411,
        saturationScale: 1.0107456907000187,
        brightnessScale: 0.9612297817954527,
        valueGamma: 1.0265166929362035,
      },
      mask: {
        kind: 'rect',
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333,
      },
    },
  },
  'chr/L-gold': {
    source:
      '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.01100000000000001,-0.013926470588235276,1.022,1.0205]]',
    stock: '#edecea',
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        valueGamma: 0.9842056445484877,
        rgbScale: [0.8914069949568042, 1.0488497864510804, 1.0479594368209708],
      },
      paper: {
        hueDegrees: 5.66727894909966,
        saturationScale: 1.19946539448018,
        brightnessScale: 1.1411561307468574,
        valueGamma: 1.2612372349855736,
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
                  0.0942622950819672, 0.08970588235294118, 0.8176229508196722, 0.47205882352941175,
                ],
                inner: [
                  0.1168032786885246, 0.10441176470588236, 0.764344262295082, 0.43970588235294117,
                ],
              },
              {
                outer: [
                  0.12295081967213115, 0.5955882352941176, 0.7581967213114754, 0.29558823529411765,
                ],
                inner: [
                  0.13934426229508196, 0.6088235294117647, 0.7233606557377049, 0.27058823529411763,
                ],
              },
            ],
            hueCenter: 28,
            hueRadius: 18,
            hueFeather: 6,
            saturation: [0.25, 0.5],
          },
          adjustment: {
            hueDegrees: 12.803308722170211,
            saturationScale: 0.8755457636089718,
            brightnessScale: 1.326480634447674,
            valueGamma: 1,
          },
        },
      ],
    },
  },
};
