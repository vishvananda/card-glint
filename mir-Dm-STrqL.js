const e = {
  set: "mir",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "mir-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -1.5308098591549424,
            saturationScale: 1.75,
            brightnessScale: 0.8289606741573033
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.8293023858921132,
            brightnessScale: 0.9695799180327868
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "mir-black-L": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -0.21134202183861817,
            saturationScale: 0.7810010960906101,
            brightnessScale: 1.2578125
          },
          paper: {
            hueDegrees: 49.72569600359225,
            saturationScale: 0.35,
            brightnessScale: 0.6826484018264841
          },
          mask: {
            kind: "rect",
            rect: [0.11885245901639344, 0.6058823529411764, 0.7663934426229508, 0.2720588235294118],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "mir-black-N": [0.7515, 0.718947400990099, 0.686394801980198],
      "mir-black-W": [0.9313725490196079, 0.9117647058823526, 0.7215686274509804],
      "mir-black-G": [0.6803921568627451, 0.8, 0.5588235294117647]
    },
    setCalibrationProfiles: {
      mir: {
        schema: 1,
        revision: 1,
        set: "mir",
        border: "black",
        frames: {
          U: {
            family: "mse-old",
            assetKey: "u",
            frame: [-0.002715163934426358, 0.0027794117647058788, 1.0062500000000003, 0.9965],
            art: [0.1187303965309311, 0.0999728525257585, 0.765065740731217, 0.44231471484326657],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          A: {
            family: "mse-old",
            assetKey: "a",
            frame: [
              -0.0012151639344260094,
              0.001860294117647106,
              1.0032499999999995,
              0.9927499999999999
            ],
            art: [
              0.11880333141789827,
              0.10008441111933818,
              0.7651017296828873,
              0.44227676864244736
            ],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          G: {
            family: "mse-old",
            assetKey: "g",
            frame: [
              -0.0025245901639345996,
              0.0014558823529410058,
              1.0030000000000003,
              0.9965000000000004
            ],
            art: [0.11883908428837009, 0.09990271595991641, 0.7649546666666671, 0.4423636869863214],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          W: {
            family: "mse-old",
            assetKey: "w",
            frame: [
              -0.001045081967213201,
              -0.007882352941176557,
              1.0025000000000002,
              1.0090000000000001
            ],
            art: [0.11906519076353601, 0.09998458202945604, 0.7645733333333335, 0.4423082235760599],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          B: {
            family: "mse-old",
            assetKey: "b",
            frame: [-5901639344259955e-19, 0.0014558823529411732, 1.0019999999999996, 0.9965],
            art: [0.11922929379225639, 0.09998570656043626, 0.7641919999999998, 0.4422665420553772],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          R: {
            family: "mse-old",
            assetKey: "r",
            frame: [
              -0.0015594262295083275,
              0.0031249999999998328,
              1.0002500000000003,
              0.9937500000000004
            ],
            art: [0.11989382327438916, 0.09994266538073292, 0.7628573333333337, 0.4423482889278164],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          M: {
            family: "mse-old",
            assetKey: "m",
            frame: [-5450819672130268e-19, 0.0033750000000000234, 1.0014999999999998, 0.99325],
            art: [
              0.11952915592634052,
              0.09997641805910547,
              0.7638106666666666,
              0.44229886683654457
            ],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          L: {
            family: "seventh",
            assetKey: "lMirage",
            frame: [-0.00417418032786869, -1250000000000535e-19, 1.0042499999999996, 1.00025],
            art: [0.11855596756124587, 0.1007177226925378, 0.7652167768257709, 0.4410626190476191],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [
                0.12066666666666669,
                0.09999999999999999,
                0.7653333333333333,
                0.440952380952381
              ],
              lowerAnchor: 0.55
            }
          },
          "L-W": {
            family: "mse-old",
            assetKey: "wl",
            frame: [-0.0016249999999998965, 7205882352941144e-19, 1.0032499999999998, 0.9965],
            art: [0.1187919755988077, 0.1000156150878952, 0.7650367116807141, 0.4422979320029018],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          "L-U": {
            family: "mse-old",
            assetKey: "ul",
            frame: [
              -0.00162499999999978,
              0.0016029411764706685,
              1.0032499999999995,
              0.9964999999999998
            ],
            art: [0.11879523226784044, 0.0999624507788035, 0.7650543522673686, 0.44230813072262004],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          "L-B": {
            family: "mse-old",
            assetKey: "bl",
            frame: [
              -0.0012499999999998532,
              0.0019338235294118617,
              1.0024999999999997,
              0.9952499999999999
            ],
            art: [0.11909173500961023, 0.10004263633934354, 0.7645733333333332, 0.4422919813893549],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          "L-R": {
            family: "mse-old",
            assetKey: "rl",
            frame: [-0.0017500000000000276, 0.0012867647058822358, 1.0035, 0.9962500000000002],
            art: [0.11883435202623867, 0.09997802605917097, 0.765007031057858, 0.4422807724628308],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          },
          "L-G": {
            family: "mse-old",
            assetKey: "gl",
            frame: [-0.0022049180327868836, -38235294117650736e-20, 1.004, 0.9990000000000001],
            art: [0.11886735929054516, 0.1000194395832249, 0.7650023041138597, 0.4422780396298528],
            stockWindow: [
              0.04918032786885246,
              0.03823529411764706,
              0.9016393442622951,
              0.9220588235294118
            ],
            artWindow: {
              source: [0.12, 0.09751434034416825, 0.7626666666666667, 0.44550669216061184],
              lowerAnchor: 0.5487571701720841
            }
          }
        },
        colors: {
          U: {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/ucard.jpg",[-0.002715163934426358,0.0027794117647058788,1.0062500000000003,0.9965]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 7.020430177927716,
                saturationScale: 1.0445079986732708,
                brightnessScale: 1.0974679136444814,
                valueGamma: 1.0226361240799828,
                rgbScale: [1.1506391232665591, 1.0240889601313363, 0.848639376701522]
              },
              paper: {
                hueDegrees: -2.0439383038195493,
                saturationScale: 1.0857649099332052,
                brightnessScale: 0.9526336325343592,
                valueGamma: 0.500000030118257,
                rgbScale: [1.066521891720329, 0.9811934210239744, 0.9555988052787247]
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          A: {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/acard.jpg",[-0.0012151639344260094,0.001860294117647106,1.0032499999999995,0.9927499999999999]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -0.17412598337365304,
                saturationScale: 0.8527032429277667,
                brightnessScale: 0.9001567681373233,
                valueGamma: 0.6662958821056133,
                rgbScale: [1.0970847032641344, 1.015266488483044, 0.8978003883067993]
              },
              paper: {
                hueDegrees: -2.6699113052010492,
                saturationScale: 0.7215335068661576,
                brightnessScale: 0.9466664399787315,
                valueGamma: 0.6308527500403318,
                rgbScale: [1.0278397506499024, 1.005453124731303, 0.9676376594030421]
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          G: {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/gcard.jpg",[-0.0025245901639345996,0.0014558823529410058,1.0030000000000003,0.9965000000000004]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 8.610958296479858,
                saturationScale: 0.5500334279333405,
                brightnessScale: 1.1102440441943013,
                valueGamma: 1.0343851501826022,
                rgbScale: [1.0232243268918086, 1.2214027581313585, 0.8001478576885552]
              },
              paper: {
                hueDegrees: -7.12711295335707,
                saturationScale: 0.855189228278615,
                brightnessScale: 0.9526491770102354,
                valueGamma: 0.7525942285052065,
                rgbScale: [1.0448161805390173, 1.0635855291268932, 0.8998864044621944]
              },
              mask: {
                kind: "chroma",
                bounds: [
                  0.10133333333333333,
                  0.5965583173996176,
                  0.7973333333333333,
                  0.30019120458891013
                ],
                seed: [0.5, 0.75],
                frameRgb: [0.2323529411764706, 0.30196078431372547, 0.22941176470588237],
                paperRgb: [0.7294117647058823, 0.5725490196078431, 0.4627450980392157]
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569],
              blackPoint: {
                lift: [0, 0, 0],
                transition: 0.5,
                texture: [
                  [0, [0, 0, 0]],
                  [
                    0.26666666666666666,
                    [0.0039215686274509665, -0.04509803921568628, -0.00784313725490196]
                  ],
                  [0.3, [0, 0, 0]],
                  [1, [0, 0, 0]]
                ]
              }
            }
          },
          W: {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/wcard.jpg",[-0.001045081967213201,-0.007882352941176557,1.0025000000000002,1.0090000000000001]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -5.472883378339195,
                saturationScale: 0.8805787938577354,
                brightnessScale: 0.9101693502499375,
                valueGamma: 0.7275987658655229,
                rgbScale: [1.0364044327039734, 1.0488039624622658, 0.9199758325341352]
              },
              paper: {
                hueDegrees: 1.9661786154216072,
                saturationScale: 0.6980842197213095,
                brightnessScale: 0.9983786642421661,
                valueGamma: 0.6531963808420956,
                rgbScale: [1.0077295988461847, 0.9921227543469127, 1.0002085782516286]
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569],
              blackPoint: {
                lift: [0, 0, 0],
                transition: 0.5,
                texture: [
                  [0, [0, 0, 0]],
                  [
                    0.5411764705882354,
                    [-0.09264705882352946, -0.1029411764705882, -0.06617647058823527]
                  ],
                  [0.6, [0, 0, 0]],
                  [1, [0, 0, 0]]
                ]
              }
            }
          },
          B: {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/bcard.jpg",[-0.0005901639344259955,0.0014558823529411732,1.0019999999999996,0.9965]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -179.99999999999997,
                saturationScale: 0.030000000005813,
                brightnessScale: 0.8900710451016454,
                valueGamma: 0.9946903419326346,
                rgbScale: [1.034745755217356, 1.0876846395542694, 0.8885121093708244]
              },
              paper: {
                hueDegrees: -11.760172620731906,
                saturationScale: 1.0626749565501323,
                brightnessScale: 1.0202613304440087,
                valueGamma: 1.0456959573315066,
                rgbScale: [0.9980041128458528, 1.0835986920616032, 0.9246964637618469]
              },
              mask: {
                kind: "chroma",
                bounds: [
                  0.10133333333333333,
                  0.5965583173996176,
                  0.7973333333333333,
                  0.30019120458891013
                ],
                seed: [0.5, 0.75],
                frameRgb: [0.11666666666666667, 0.12254901960784315, 0.14019607843137255],
                paperRgb: [0.8980392156862745, 0.7294117647058823, 0.6]
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          R: {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/rcard.jpg",[-0.0015594262295083275,0.0031249999999998328,1.0002500000000003,0.9937500000000004]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -12.25793844932921,
                saturationScale: 0.8208829977728177,
                brightnessScale: 0.8999112755901386,
                valueGamma: 0.7974295036899174,
                rgbScale: [1.1983259554920083, 0.9811346776858557, 0.850543261042685]
              },
              paper: {
                hueDegrees: -3.372509333939619,
                saturationScale: 0.9261698535696634,
                brightnessScale: 0.9895401573061257,
                valueGamma: 0.8187101755351133,
                rgbScale: [1.028373093088216, 0.9570163716589976, 1.0160847369564898]
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          M: {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/mcard.jpg",[-0.0005450819672130268,0.0033750000000000234,1.0014999999999998,0.99325]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -7.699875458606101,
                saturationScale: 1.1694789337031994,
                brightnessScale: 1.0044904209630419,
                valueGamma: 0.9849688283037226,
                rgbScale: [0.9891668948370346, 1.0544126066011101, 0.9587819229933505]
              },
              paper: {
                hueDegrees: 32.542615320912255,
                saturationScale: 2.990747853855007,
                brightnessScale: 1.4547967864520133,
                valueGamma: 1.7625739811001797,
                rgbScale: [0.9286594094251598, 0.9719000790526738, 1.107954483009363]
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          "L-red": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/lMirage.png",[-0.00417418032786869,-0.0001250000000000535,1.0042499999999996,1.00025]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -27.03089610855672,
                saturationScale: 1.2155556962973602,
                brightnessScale: 1.079794743720659,
                valueGamma: 1.2554460836101142,
                rgbScale: [0.9851650930638202, 1.0810474788916393, 0.9389581079148931]
              },
              paper: {
                hueDegrees: -31.40338117475774,
                saturationScale: 2.9999982681047754,
                brightnessScale: 1.3180596913909564,
                valueGamma: 1.9999992124796886,
                rgbScale: [1.1472744849580765, 0.8335385381455258, 1.0456996939670864]
              },
              mask: {
                kind: "rect",
                feather: 0.0020491803278688526,
                rect: [
                  0.11230344805070241,
                  0.5985047855683138,
                  0.7794741202349036,
                  0.2955143567049414
                ]
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569],
              blackPoint: {
                lift: [0, 0, 0],
                transition: 0.5,
                texture: [
                  [0, [0, 0, 0]],
                  [
                    0.1588235294117647,
                    [0.0607843137254902, 0.05098039215686273, 0.06470588235294117]
                  ],
                  [0.3, [0, 0, 0]],
                  [1, [0, 0, 0]]
                ]
              }
            }
          },
          "L-W": {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/wlcard.jpg",[-0.0016249999999998965,0.0007205882352941144,1.0032499999999998,0.9965]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 5.443016133206811,
                saturationScale: 1.1371101005904878,
                brightnessScale: 1.132882882882883
              },
              paper: {
                hueDegrees: 5.456959706959765,
                saturationScale: 0.9644758332327011,
                brightnessScale: 1.0247747747747746
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          "L-U": {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/ulcard.jpg",[-0.00162499999999978,0.0016029411764706685,1.0032499999999995,0.9964999999999998]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 1.9072912957882409,
                saturationScale: 1.1611198875500817,
                brightnessScale: 1.1475225225225225
              },
              paper: {
                hueDegrees: -72.19999999999987,
                saturationScale: 0.7429719387755112,
                brightnessScale: 1.0539316958277252
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          "L-B": {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/blcard.jpg",[-0.0012499999999998532,0.0019338235294118617,1.0024999999999997,0.9952499999999999]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 6.053282932891534,
                saturationScale: 1.141522101991482,
                brightnessScale: 1.1509009009009008
              },
              paper: {
                hueDegrees: 9.120967741935488,
                saturationScale: 3,
                brightnessScale: 1.221081349206349
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          "L-R": {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/rlcard.jpg",[-0.0017500000000000276,0.0012867647058822358,1.0035,0.9962500000000002]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 3.042120717106741,
                saturationScale: 1.1623077225906855,
                brightnessScale: 1.1042600896860986
              },
              paper: {
                hueDegrees: -1.4938053097345119,
                saturationScale: 1.0907425213675213,
                brightnessScale: 1.0353982300884956
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          },
          "L-G": {
            source: '["https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old.mse-style/glcard.jpg",[-0.0022049180327868836,-0.00038235294117650736,1.004,0.9990000000000001]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 5.913510101010161,
                saturationScale: 1.1344203885257809,
                brightnessScale: 1.146067415730337
              },
              paper: {
                hueDegrees: 0.8417561011467569,
                saturationScale: 1.401664731682147,
                brightnessScale: 1.1147540983606559
              },
              mask: {
                kind: "rect",
                rect: [
                  0.10666666666666667,
                  0.6022944550669216,
                  0.7866666666666666,
                  0.29063097514340347
                ],
                feather: 0.0026666666666666666
              },
              outerStock: [0.09411764705882353, 0.08235294117647059, 0.06274509803921569]
            }
          }
        },
        mana: {
          geometry: {
            dx: 0.875,
            dy: -0.5,
            scaleX: 0.98,
            scaleY: 0.985,
            spacing: 1.5,
            glyphs: {
              U: { scale: 1.04, dx: 0, dy: -0.5 },
              W: { scale: 1, dx: 0.5, dy: 0 },
              B: { scale: 1.05, dx: 0, dy: 0 },
              R: { scale: 1.034, dx: -0.25, dy: 0.5 },
              G: { scale: 1.0621999999999998, dx: 0, dy: -0.25 }
            },
            numberScale: 1,
            numberDx: 0,
            numberDy: -0.5
          },
          paper: {
            W: [0.9411764705882353, 0.9137254901960784, 0.7333333333333333],
            U: [0.6980392156862745, 0.8117647058823529, 0.8431372549019608],
            B: [0.7607843137254902, 0.6980392156862745, 0.6274509803921569],
            R: [0.8823529411764706, 0.5647058823529412, 0.4745098039215686],
            G: [0.6627450980392157, 0.796078431372549, 0.5490196078431373],
            N: [0.7725490196078432, 0.6745098039215687, 0.6039215686274509]
          },
          ink: [0.0784313725490196, 0.07058823529411765, 0.058823529411764705]
        },
        title: {
          size: 27.25,
          x: 54.5,
          y: 48,
          width: 1.0352999999999999,
          shadow: 1,
          trim: 0.3,
          gray: 232
        },
        type: { x: 52.75, y: 391.5, size: 22, width: 0.98, shadow: 0.75, trim: 0.2, gray: 239 },
        footer: {
          artist: { x: 50, y: 625.5, size: 19, width: 0.98, shadow: 1.25, trim: 0.2, gray: 238 },
          legal: {
            x: 49.25,
            y: 639.5,
            size: 11,
            width: 1,
            shadow: 0,
            trim: 0,
            lightGray: 205,
            darkGray: 42,
            defaultText: "©1996 Wizards of the Coast, Inc. All rights reserved.",
            lightMaterials: ["U", "B", "G", "M", "A"]
          },
          stats: { x: 444.75, y: 634.5, size: 28, width: 1.03, shadow: 1, trim: 0.3, gray: 238 }
        },
        rulesPlacement: {
          W: {
            baselineScale: 1.04,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          },
          U: {
            baselineScale: 1.04,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          },
          B: {
            baselineScale: 1.04,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          },
          R: {
            baselineScale: 1.04,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          },
          G: {
            baselineScale: 1.04,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          },
          A: {
            baselineScale: 1.04,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          },
          M: {
            baselineScale: 1.04,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          },
          L: {
            baselineScale: 1.06,
            offset: [1, 0],
            verticalLimits: [412, 603],
            maximumHeight: 159
          }
        },
        setSymbols: {
          default: {
            right: 438.5,
            centerY: 391,
            width: 30.5,
            height: 26.25,
            placement: "native",
            crop: [1953125e-9, 0.037109375, 0.99609375, 0.91015625],
            sampling: "high"
          }
        }
      }
    },
    printingBlackPoints: {
      mir: [
        {
          set: "mir",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-1.5308098591549424,"saturationScale":1.75,"brightnessScale":0.8289606741573033},"paper":{"hueDegrees":0,"saturationScale":0.8293023858921132,"brightnessScale":0.9695799180327868},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "mir",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
              adjustment: '{"frame":{"hueDegrees":-0.21134202183861817,"saturationScale":0.7810010960906101,"brightnessScale":1.2578125},"paper":{"hueDegrees":49.72569600359225,"saturationScale":0.35,"brightnessScale":0.6826484018264841},"mask":{"kind":"rect","rect":[0.11885245901639344,0.6058823529411764,0.7663934426229508,0.2720588235294118],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      mir: [
        {
          set: "mir",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#17140f",
          family: "retro"
        }
      ]
    }
  }
};
export {
  e as default
};
