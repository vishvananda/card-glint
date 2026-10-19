const e = {
  set: "atq",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "atq-black-W": [0.8647058823529412, 0.8549019607843137, 0.7941176470588235],
      "atq-black-U": [0.7137254901960784, 0.8509803921568626, 0.8901960784313725]
    },
    PRINTING_MANA_PROFILES: {
      atq: {
        dx: 5.25,
        dy: -8,
        scaleX: 1.0293249999999998,
        scaleY: 1.02,
        spacing: 0.9784688995215312,
        glyphs: {
          B: { scale: 1, dx: 0, dy: 0 },
          R: { scale: 1.05, dx: 0.25, dy: 0.75 },
          W: { scale: 1, dx: 0, dy: 0 },
          U: { scale: 1, dx: 0, dy: 0 },
          G: { scale: 1.09, dx: 0.25, dy: 0.25 }
        },
        numberScale: 0.98,
        numberDx: -0.5,
        numberDy: -0.5
      }
    },
    EARLY_EXPANSION_FRAMES: {
      "atq/W": {
        family: "fourth",
        frame: [0.007729475409836071, 0.005406470588235348, 0.987636, 0.9923109999999999],
        art: [0.10780992340983606, 0.09187928630252105, 0.7848414079999999, 0.45268282761904755],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/U": {
        family: "fourth",
        frame: [
          0.0052287377049180395,
          0.0055902941176471125,
          0.9900709999999999,
          0.9923109999999999
        ],
        art: [0.10819612170491803, 0.09253563887955187, 0.7847962793333333, 0.4517377695238095],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/B": {
        family: "abu",
        frame: [-0.01550000000000007, -0.01547058823529413, 1.0310000000000001, 1.028],
        art: [0.10821999999999996, 0.09173512605042017, 0.7842473333333334, 0.4532990476190476],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/G": {
        family: "abu",
        frame: [-0.0180553278688525, -0.015536764705882338, 1.0315, 1.0285],
        art: [0.10778767213114751, 0.09172109243697481, 0.7825646666666667, 0.45351952380952376],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/A": {
        family: "fourth",
        frame: [0.006204737704918072, 0.0046099999999999475, 0.988123, 0.9928020000000001],
        art: [0.1102870270382514, 0.09348941714285709, 0.7825934159999999, 0.4495974771428572],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/L": {
        family: "abu",
        frame: [-0.013737704918032771, -0.011970588235294071, 1.0285, 1.021],
        art: [0.10625396174863388, 0.0945051260504202, 0.785774, 0.45021238095238086],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/R": {
        family: "fourth",
        frame: [0.005741032786885253, 0.003875294117647035, 0.9900709999999999, 0.995748],
        art: [0.10804836945355191, 0.09207011697478988, 0.7861163739999999, 0.45235409142857136],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      }
    },
    EARLY_EXPANSION_COLORS: {
      "atq/W": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007729475409836071,0.005406470588235348,0.987636,0.9923109999999999]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 4.6895058968416174,
            saturationScale: 0.8399062893519177,
            brightnessScale: 1.0621330942238176,
            valueGamma: 0.871302303927114
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.3998295454545437,
            brightnessScale: 0.9655372807017544
          },
          mask: {
            kind: "rect",
            rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/U": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.0052287377049180395,0.0055902941176471125,0.9900709999999999,0.9923109999999999]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: 1.0498949579832697,
            saturationScale: 1.1699718731104778,
            brightnessScale: 0.9380165289256198
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/B": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.01550000000000007,-0.01547058823529413,1.0310000000000001,1.028]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: -3.11206896551721,
            saturationScale: 0.7848932676518883,
            brightnessScale: 0.9372384937238494
          },
          mask: {
            kind: "chroma",
            bounds: [
              0.09221311475409837,
              0.5823529411764706,
              0.8176229508196722,
              0.3176470588235294
            ],
            seed: [0.5, 0.7352941176470589],
            frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23431372549019608],
            paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
          }
        }
      },
      "atq/G": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.0180553278688525,-0.015536764705882338,1.0315,1.0285]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: 17.629629629629562,
            saturationScale: 0.6774409323116217,
            brightnessScale: 1.099526066350711
          },
          mask: {
            kind: "chroma",
            bounds: [
              0.09221311475409837,
              0.5823529411764706,
              0.8176229508196722,
              0.3176470588235294
            ],
            seed: [0.5, 0.7352941176470589],
            frameRgb: [0.23431372549019608, 0.30980392156862746, 0.27450980392156865],
            paperRgb: [0.4137254901960784, 0.2823529411764706, 0.2549019607843137]
          }
        }
      },
      "atq/A": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006204737704918072,0.0046099999999999475,0.988123,0.9928020000000001]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: 2.363636363636374,
            saturationScale: 0.7043207881567981,
            brightnessScale: 0.995433789954338
          },
          mask: {
            kind: "rect",
            rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/L": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.013737704918032771,-0.011970588235294071,1.0285,1.021]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 7.884638807432336,
            saturationScale: 0.47987074486465253,
            brightnessScale: 1.3740873825800126,
            valueGamma: 1.4999999999999991
          },
          paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          mask: {
            kind: "rect",
            rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/R": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.005741032786885253,0.003875294117647035,0.9900709999999999,0.995748]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -5.06202013331654,
            saturationScale: 0.7966369226366342,
            brightnessScale: 0.8465344826879605,
            valueGamma: 1.2874975904870842
          },
          paper: {
            hueDegrees: 1.3084229600186745,
            saturationScale: 0.7137019230769232,
            brightnessScale: 0.7142857142857143
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    EARLY_EXPANSION_MANA_TARGETS: {
      "atq-black-N": [0.7372549019607844, 0.7176470588235294, 0.6941176470588235],
      "atq-black-B": [0.6196078431372549, 0.596078431372549, 0.5529411764705883],
      "atq-black-R": [0.8431372549019608, 0.7137254901960784, 0.6431372549019608],
      "atq-black-W": [0.8627450980392157, 0.8784313725490196, 0.803921568627451],
      "atq-black-U": [0.7176470588235294, 0.8392156862745098, 0.8784313725490196],
      "atq-black-G": [0.7607843137254902, 0.8352941176470589, 0.7254901960784313]
    }
  }
};
export {
  e as default
};
