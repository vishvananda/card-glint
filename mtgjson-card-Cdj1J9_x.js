import { f as Yr } from "./asset-fetch-BSXnVtJ9.js";
import { c as qr } from "./image-cover-QdXNryDE.js";
function Se(e, t, r, a, s, n, o = "stats", i = () => s == null ? e.fillText(t, r, a) : e.fillText(t, r, a, s), l = (d) => e.measureText(d).width) {
  const d = o === "type" ? n?.typeLine : n?.stats;
  if (!d?.length) {
    i();
    return;
  }
  const c = l(t), u = c > 0 && s != null ? Math.min(1, s / c) : 1, h = c * u, m = e.textAlign === "right" || e.textAlign === "end" && e.direction !== "rtl" || e.textAlign === "start" && e.direction === "rtl", g = r - (e.textAlign === "center" ? h / 2 : m ? h : 0), f = o === "type" ? 1 : 0, b = (p, S, y) => {
    S <= p || y && n?.omitInk || (e.save(), e.beginPath(), e.rect(p, -1e4, S - p, 2e4), e.clip(), y && (e.fillStyle = y, e.shadowColor = "transparent"), i(), e.restore());
  };
  let w = -1e4;
  for (const p of d) {
    const S = Math.max(
      w,
      p.start === 0 ? -1e4 : g + l(t.slice(0, p.start)) * u - f
    ), y = p.end == null || p.end >= t.length ? 1e4 : g + l(t.slice(0, p.end)) * u + f;
    b(w, S), b(S, y, p.color), w = y;
  }
  b(w, 1e4);
}
const j0 = /* @__PURE__ */ new WeakSet();
function Ke(e) {
  return !j0.has(e);
}
function po(e, t, r) {
  const a = j0.has(e);
  t || j0.add(e);
  try {
    r();
  } finally {
    a || j0.delete(e);
  }
}
const L4 = 1, fn = Object.freeze([
  Object.freeze({
    id: "m21-modern",
    revision: 1,
    label: "Modern · M21 defaults",
    setCode: "M21",
    note: "Provisional transfer: shared source colors and outer border; other materials retain source colors."
  })
]);
function pn(e) {
  if (!(e === "auto" || e === "printing" || e === "source") && !(e && typeof e == "object" && !Array.isArray(e) && Object.keys(e).length === 1 && Object.hasOwn(e, "profile") && fn.some((t) => t.id === e.profile)))
    throw Error("Invalid printing calibration choice");
}
function rt(e) {
  if (["split", "aftermath", "adventure", "prepare", "room", "flip"].includes(e.layout ?? "") && e.faces?.some(
    (r) => r.calibration !== void 0 && JSON.stringify(r.calibration) !== JSON.stringify(e.calibration)
  ))
    throw Error("Composite panels share one calibration policy; select it on the physical face.");
  if (e.calibration === void 0) return e;
  pn(e.calibration);
  const t = e.calibration === "source" ? void 0 : "set-hsb-v1";
  return {
    ...e,
    colorCalibration: t,
    ...e.faces ? {
      faces: e.faces.map(
        (r) => rt({
          ...r,
          calibration: r.calibration ?? e.calibration
        })
      )
    } : {}
  };
}
function bo(e) {
  return e.power != null && e.toughness != null ? {
    text: `${e.power}/${e.toughness}`,
    label: `Power ${e.power}, toughness ${e.toughness}`
  } : e.loyalty != null && e.loyalty !== "" ? { text: String(e.loyalty), label: `Starting loyalty ${e.loyalty}` } : e.defense != null && e.defense !== "" ? { text: String(e.defense), label: `Defense ${e.defense}` } : null;
}
const j = 488, T = 680, So = 0.058;
function Ie(e, t) {
  if (t === "silver") return { border: "#b8bbc2", ink: "#17140f" };
  const r = (t ?? (["2ed", "3ed", "4ed", "5ed", "6ed", "7ed", "8ed", "9ed", "chr"].includes(
    e?.toLowerCase() ?? ""
  ) ? "white" : "black")) === "white";
  return { border: r ? "#eeedeb" : "#090806", ink: r ? "#17140f" : "#fff" };
}
const wo = "M50 4 88 24v52L50 96 12 76V24Z M50 13 20 29v42l30 16 30-16V29Z", J = {
  background: [0.03937, 0.02531, 0.92126, 0.88976],
  legendaryBackground: [0.03937, 0.03993, 0.92126, 0.88976],
  frame: [0.04858, 0.03937, 0.90284, 0.88864],
  crown: [0.01575, 0.01687, 0.9622, 0.15748],
  title: [0.05669, 0.04499, 0.88662, 0.05737],
  art: [0.06929, 0.10742, 0.86142, 0.44882],
  type: [0.05669, 0.5613, 0.88662, 0.05737],
  rules: [0.07638, 0.62542, 0.84724, 0.29246],
  stats: [0.7704, 0.88752, 0.18236, 0.06974],
  footer: [0.06693, 0.93262, 0.86614, 0.045],
  stamp: [0.34, 0.76 - 0.16 * j / T, 0.32, 0.32 * j / T]
}, H = {
  titleFont: 24,
  normalTitleFont: 26,
  titleTracking: 54e-5 * j,
  titleGap: 0.02362 * j,
  plateLeft: 0.02362 * j,
  plateRight: 0.01575 * j,
  manaSize: 0.03556 * 1.35 * j,
  manaGap: 378e-5 * j,
  manaLift: -63e-4 * j,
  typeFont: 0.044 * j,
  typeGap: 945e-5 * j,
  typeLift: -315e-5 * j,
  setHeight: 0.06142 * j,
  setMaxWidth: 0.11024 * j,
  setMargin: 472e-5 * j,
  rulesPaddingX: 0.01575 * j,
  rulesPaddingY: 0.02362 * j,
  normalRulesFont: 0.04444 * j,
  longRulesFont: 0.0381 * j,
  denseRulesFont: 0.0328 * j,
  paragraphGap: 787e-5 * j,
  statsFont: 0.05333 * j,
  statsLine: 0.08661 * j,
  footerFont: 0.02167 * j,
  footerLine: 0.02126 * j,
  footerTracking: 362e-5 * j,
  artistMarginLeft: 7e-3 * j,
  artistMarginRight: 35e-4 * j,
  legendaryBackgroundLift: -0.02047 * j
}, Ua = (e) => e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
function yo(e = J) {
  return {
    ...Object.fromEntries(
      Object.entries(e).flatMap(
        ([t, r]) => r.map((a, s) => [
          `--face-${Ua(t)}-${["x", "y", "w", "h"][s]}`,
          `${a * 100}%`
        ])
      )
    ),
    ...Object.fromEntries(
      Object.entries(H).map(([t, r]) => [
        `--face-${Ua(t)}`,
        `${r / j * 100}cqw`
      ])
    )
  };
}
const G4 = yo();
function ko(e) {
  return e.length > 340 ? "dense" : e.length > 210 ? "long" : "normal";
}
function $4(e) {
  return {
    dense: H.denseRulesFont,
    long: H.longRulesFont,
    normal: H.normalRulesFont
  }[ko(e)];
}
function q0(e) {
  return e.split(/(\{[^}\n]+\})/g).filter(Boolean).map((t) => ({
    value: t,
    symbol: /^\{[^}\n]+\}$/.test(t) ? t.slice(1, -1) : null
  }));
}
function vo(e) {
  const t = e.trim().toUpperCase();
  return { LEA: "α", LEB: "β", "2ED": "∞", "3ED": "III" }[t] ?? t.slice(0, 3);
}
const jo = [
  {
    set: "arn",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "inr",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#130c0d",
    family: "retro"
  },
  {
    set: "m21",
    prefix: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/",
    geometry: "[0.04858,0.03937,0.90284,0.88864]",
    stock: "#16130e",
    family: "components"
  },
  {
    set: "mh2",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#16130e",
    family: "retro"
  },
  {
    set: "mir",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#17140f",
    family: "retro"
  },
  {
    set: "nem",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "ody",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "pcy",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "pls",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "uds",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "ulg",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "usg",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#181510",
    family: "retro"
  },
  {
    set: "vis",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#17140f",
    family: "retro"
  },
  {
    set: "wth",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
    geometry: "[0,0,1,1]",
    stock: "#17140f",
    family: "retro"
  },
  {
    set: "lea",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/",
    geometry: "[0,0,1,1]",
    stock: "#1b1b1b",
    family: "retro"
  },
  {
    set: "leb",
    prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/",
    geometry: "[0,0,1,1]",
    stock: "#1b1b1b",
    family: "retro"
  }
], Co = /* @__PURE__ */ JSON.parse('[{"set":"7ed","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":60,\\"saturationScale\\":0.4756250000000001,\\"brightnessScale\\":1.4},\\"paper\\":{\\"hueDegrees\\":-9.253827741731357,\\"saturationScale\\":0.8491438968335036,\\"brightnessScale\\":0.9401709401709403},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.08627450980392157,0.06274509803921569,0.06274509803921569],\\"paperRgb\\":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}","lift":[14,30.5,19]}]},{"set":"arn","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-21.501473124461086,\\"saturationScale\\":0.35187499999999994,\\"brightnessScale\\":0.9157303370786517},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.35,\\"brightnessScale\\":0.8834426229508195},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"arn","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.35,\\"brightnessScale\\":1.4},\\"paper\\":{\\"hueDegrees\\":1.0282170119955936,\\"saturationScale\\":0.42361231045559733,\\"brightnessScale\\":1.0091324200913243},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.11885245901639344,0.6058823529411764,0.7663934426229508,0.2720588235294118],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"ath","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":60,\\"saturationScale\\":0.7312202380952383,\\"brightnessScale\\":1.4},\\"paper\\":{\\"hueDegrees\\":-11.893466500208092,\\"saturationScale\\":0.9593076222289706,\\"brightnessScale\\":0.9487179487179488},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.08627450980392157,0.06274509803921569,0.06274509803921569],\\"paperRgb\\":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}","lift":[14,17,7.5]}]},{"set":"brb","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":60,\\"saturationScale\\":0.7403869047619052,\\"brightnessScale\\":1.4},\\"paper\\":{\\"hueDegrees\\":-9.399216201522222,\\"saturationScale\\":1.1101902451481103,\\"brightnessScale\\":0.9401709401709403},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.08627450980392157,0.06274509803921569,0.06274509803921569],\\"paperRgb\\":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}","lift":[18,23,11.5]}]},{"set":"btd","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":45.43273932063812,\\"saturationScale\\":0.47032019704433514,\\"brightnessScale\\":0.8187134502923976},\\"paper\\":{\\"hueDegrees\\":-6.666666666666629,\\"saturationScale\\":0.8142768838304553,\\"brightnessScale\\":0.7913043478260869},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.2588235294117647,0.33529411764705885,0.1647058823529412],\\"paperRgb\\":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}","lift":[24,12.5,8]}]},{"set":"inr","stock":"#130c0d","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0.6181627435848895,\\"saturationScale\\":1.054930083373806,\\"brightnessScale\\":0.9775280898876404},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.3903999999999978,\\"brightnessScale\\":1.0245901639344261},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"inr","stock":"#130c0d","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-4.142150315687218,\\"saturationScale\\":0.8832387603666523,\\"brightnessScale\\":0.9239766081871345},\\"paper\\":{\\"hueDegrees\\":-2.691511387163473,\\"saturationScale\\":1.056747448979592,\\"brightnessScale\\":1},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.2588235294117647,0.33529411764705885,0.1647058823529412],\\"paperRgb\\":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"itp","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":54.72844827586209,\\"saturationScale\\":0.667496921182266,\\"brightnessScale\\":0.9824561403508771},\\"paper\\":{\\"hueDegrees\\":-8.03571428571422,\\"saturationScale\\":0.8959469144800777,\\"brightnessScale\\":0.7304347826086957},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.2588235294117647,0.33529411764705885,0.1647058823529412],\\"paperRgb\\":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}","lift":[41,0,19]}]},{"set":"m21","stock":"#16130e","materials":[{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp","adjustment":"{\\"frame\\":{\\"hueDegrees\\":17.337752059074205,\\"saturationScale\\":0.7776986444212719,\\"brightnessScale\\":0.9675141242937855},\\"paper\\":{\\"hueDegrees\\":8.888888888888914,\\"saturationScale\\":0.6314814814814816,\\"brightnessScale\\":0.967741935483871},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],\\"feather\\":0.0026041666666666665}}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp","adjustment":"{\\"hueDegrees\\":17.337752059074205,\\"saturationScale\\":0.7776986444212719,\\"brightnessScale\\":0.9675141242937855}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp","adjustment":"{\\"hueDegrees\\":8.888888888888914,\\"saturationScale\\":0.6314814814814816,\\"brightnessScale\\":0.967741935483871}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp","adjustment":"{\\"hueDegrees\\":17.337752059074205,\\"saturationScale\\":0.7776986444212719,\\"brightnessScale\\":0.9675141242937855}","lift":null}]},{"set":"m21","stock":"#16130e","materials":[{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp","adjustment":"{\\"frame\\":{\\"hueDegrees\\":10.298505477140054,\\"saturationScale\\":0.9250450145969191,\\"brightnessScale\\":0.8881656804733729},\\"paper\\":{\\"hueDegrees\\":-4.114932885906114,\\"saturationScale\\":0.6159725971922244,\\"brightnessScale\\":0.9448979591836735},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],\\"feather\\":0.0026041666666666665}}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp","adjustment":"{\\"hueDegrees\\":10.298505477140054,\\"saturationScale\\":0.9250450145969191,\\"brightnessScale\\":0.8881656804733729}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","adjustment":"{\\"hueDegrees\\":-4.114932885906114,\\"saturationScale\\":0.6159725971922244,\\"brightnessScale\\":0.9448979591836735}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp","adjustment":"{\\"hueDegrees\\":10.298505477140054,\\"saturationScale\\":0.9250450145969191,\\"brightnessScale\\":0.8881656804733729}","lift":null}]},{"set":"m21","stock":"#16130e","materials":[{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.35,\\"brightnessScale\\":0.9580706521739131},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],\\"feather\\":0.0026041666666666665}}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":0.35,\\"brightnessScale\\":0.9580706521739131}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}","lift":null}]},{"set":"m21","stock":"#16130e","materials":[{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":37.25414989939645,\\"saturationScale\\":0.7848398354730142,\\"brightnessScale\\":0.9923161361141603},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],\\"feather\\":0.0026041666666666665}}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp","adjustment":"{\\"hueDegrees\\":37.25414989939645,\\"saturationScale\\":0.7848398354730142,\\"brightnessScale\\":0.9923161361141603}","lift":null},{"url":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}","lift":null}]},{"set":"mh2","stock":"#16130e","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-5.12371526456036,\\"saturationScale\\":0.7905520188605681,\\"brightnessScale\\":0.9741573033707864},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.35,\\"brightnessScale\\":1.0356352459016396},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"mir","stock":"#17140f","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-1.5308098591549424,\\"saturationScale\\":1.75,\\"brightnessScale\\":0.8289606741573033},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.8293023858921132,\\"brightnessScale\\":0.9695799180327868},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"mir","stock":"#17140f","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-0.21134202183861817,\\"saturationScale\\":0.7810010960906101,\\"brightnessScale\\":1.2578125},\\"paper\\":{\\"hueDegrees\\":49.72569600359225,\\"saturationScale\\":0.35,\\"brightnessScale\\":0.6826484018264841},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.11885245901639344,0.6058823529411764,0.7663934426229508,0.2720588235294118],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"nem","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-4.289738430583384,\\"saturationScale\\":0.8915652681436504,\\"brightnessScale\\":0.8235955056179776},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.5422222222222192,\\"brightnessScale\\":0.9221311475409836},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"ody","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-4.730436724826404,\\"saturationScale\\":1.1895774647887327,\\"brightnessScale\\":0.7999999999999999},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1.197101034858387,\\"brightnessScale\\":0.9361987704918033},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"pcy","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-4.633564096443024,\\"saturationScale\\":1.0799672453324602,\\"brightnessScale\\":0.7730337078651686},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.859911894273126,\\"brightnessScale\\":0.9303278688524589},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"pcy","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":17.807077308120142,\\"saturationScale\\":0.3893356835959018,\\"brightnessScale\\":0.9152046783625731},\\"paper\\":{\\"hueDegrees\\":-7.681547619047592,\\"saturationScale\\":0.7065816326530612,\\"brightnessScale\\":0.782608695652174},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.2588235294117647,0.33529411764705885,0.1647058823529412],\\"paperRgb\\":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"pls","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-7.13672588968916,\\"saturationScale\\":1.1802209231170504,\\"brightnessScale\\":0.7887640449438202},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.7511403508771918,\\"brightnessScale\\":0.9313012295081968},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"ptk","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":60,\\"saturationScale\\":0.8566071428571431,\\"brightnessScale\\":1.4},\\"paper\\":{\\"hueDegrees\\":-9.407859606185411,\\"saturationScale\\":1.1858096941603267,\\"brightnessScale\\":0.952991452991453},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.08627450980392157,0.06274509803921569,0.06274509803921569],\\"paperRgb\\":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}","lift":[14,17.5,7.5]}]},{"set":"s99","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":60,\\"saturationScale\\":0.35,\\"brightnessScale\\":1.4},\\"paper\\":{\\"hueDegrees\\":-15.019828155981486,\\"saturationScale\\":0.8201216369446448,\\"brightnessScale\\":0.9316239316239316},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.08627450980392157,0.06274509803921569,0.06274509803921569],\\"paperRgb\\":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}","lift":[21.5,27.5,16.5]}]},{"set":"s99","stock":null,"materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":42.145378655608965,\\"saturationScale\\":0.4593960416241585,\\"brightnessScale\\":0.9883040935672514},\\"paper\\":{\\"hueDegrees\\":-10.47813001605141,\\"saturationScale\\":0.5791702507449261,\\"brightnessScale\\":0.7891304347826087},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.2588235294117647,0.33529411764705885,0.1647058823529412],\\"paperRgb\\":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}","lift":[31.5,17.5,7.5]}]},{"set":"uds","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2.465900667160895,\\"saturationScale\\":1.6933264866979658,\\"brightnessScale\\":0.8089887640449439},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1.0263953488372048,\\"brightnessScale\\":0.8798975409836065},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"ulg","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":6.196897147214486,\\"saturationScale\\":1.44966853763682,\\"brightnessScale\\":0.7764044943820225},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.9164319248826271,\\"brightnessScale\\":0.8729508196721312},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"ulg","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":27.774922634836457,\\"saturationScale\\":0.6514603887857772,\\"brightnessScale\\":1.0321637426900583},\\"paper\\":{\\"hueDegrees\\":-4.285714285714221,\\"saturationScale\\":0.9254331447604949,\\"brightnessScale\\":0.8391304347826086},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.2588235294117647,0.33529411764705885,0.1647058823529412],\\"paperRgb\\":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"usg","stock":"#181510","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-0.41717349551845473,\\"saturationScale\\":1.663864073081557,\\"brightnessScale\\":0.7617977528089888},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.35,\\"brightnessScale\\":0.8950409836065574},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"vis","stock":"#17140f","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2.7191901408450576,\\"saturationScale\\":1.5913694945918608,\\"brightnessScale\\":0.8134831460674158},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.7390216244725715,\\"brightnessScale\\":0.953186475409836},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"wth","stock":"#17140f","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0.7816901408450576,\\"saturationScale\\":1.7463796482863188,\\"brightnessScale\\":0.7932584269662921},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.6375529661016933,\\"brightnessScale\\":0.9490881147540983},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"}]},{"set":"lea","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":6.19600667693885,\\"saturationScale\\":0.7922304208065458,\\"brightnessScale\\":1.0507246376811594},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.125,0.5985294117647059,0.7540983606557377,0.2852941176470588],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"lea","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":13.713669950738904,\\"saturationScale\\":0.35,\\"brightnessScale\\":0.9468014705882352},\\"paper\\":{\\"hueDegrees\\":-5.9959677419354875,\\"saturationScale\\":0.8356642416225748,\\"brightnessScale\\":0.8472803347280334},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.17647058823529413,0.2196078431372549,0.23333333333333334],\\"paperRgb\\":[0.9372549019607843,0.8,0.5941176470588235]}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"lea","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-1.9455801551389413,\\"saturationScale\\":0.7314003493819718,\\"brightnessScale\\":0.9157372986369269},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.5369823232323239,\\"brightnessScale\\":0.9283274647887324},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"lea","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":-4.361205868715615,\\"saturationScale\\":0.8628778854690737,\\"brightnessScale\\":0.9083333333333334},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2852941176470588],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"lea","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-7.274193548387075,\\"saturationScale\\":0.35562499999999997,\\"brightnessScale\\":0.9191176470588236},\\"paper\\":{\\"hueDegrees\\":19.625509683995915,\\"saturationScale\\":0.5469330921588732,\\"brightnessScale\\":0.953902027027027},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.1290983606557377,0.6014705882352941,0.7459016393442623,0.2852941176470588],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"lea","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":5.3103223868643,\\"saturationScale\\":1.0757874102425145,\\"brightnessScale\\":0.9585714285714285},\\"paper\\":{\\"hueDegrees\\":13.446120689655118,\\"saturationScale\\":0.7340938995215308,\\"brightnessScale\\":0.9952380952380953},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.23529411764705882,0.3431372549019608,0.28823529411764703],\\"paperRgb\\":[0.4117647058823529,0.2784313725490196,0.2549019607843137]}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"leb","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":-4.7686688311688386,\\"saturationScale\\":0.8968524740378744,\\"brightnessScale\\":0.8561715481171549},\\"mask\\":{\\"kind\\":\\"chroma\\",\\"bounds\\":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],\\"seed\\":[0.5,0.7352941176470589],\\"frameRgb\\":[0.17647058823529413,0.2196078431372549,0.23333333333333334],\\"paperRgb\\":[0.9372549019607843,0.8,0.5941176470588235]}}","lift":[39,1.5,0],"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"leb","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":3.454973118279554,\\"saturationScale\\":0.7697448531690021,\\"brightnessScale\\":1.1482843137254901},\\"paper\\":{\\"hueDegrees\\":10.923435302390999,\\"saturationScale\\":0.6795040998710152,\\"brightnessScale\\":1.0864864864864865},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.1290983606557377,0.6014705882352941,0.7459016393442623,0.2852941176470588],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"leb","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":-3.8366935483870748,\\"saturationScale\\":0.8704517231244031,\\"brightnessScale\\":0.9755555555555556},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2852941176470588],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"leb","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":5.7318354170936345,\\"saturationScale\\":0.9083203924844794,\\"brightnessScale\\":0.9535315985130112},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":0.37687499999999974,\\"brightnessScale\\":0.9554753521126761},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2867647058823529],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"leb","stock":"#1b1b1b","materials":[{"url":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":1.0502281478526356,\\"saturationScale\\":0.9263662460655555,\\"brightnessScale\\":1.033678756476684},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.125,0.5985294117647059,0.7540983606557377,0.2852941176470588],\\"feather\\":0.0013333333333333333}}","lift":null,"bakedStock":true,"stockMask":"https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-6.491752199413554,\\"saturationScale\\":0.8110599078341005,\\"brightnessScale\\":0.875},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8951612903225806,0.8852459016393442,0.9201680672268907]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8694331983805668,0.8615702479338844,0.8975188781014024]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.875,0.8630705394190872,0.8886486486486487]}}]}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/w.png","adjustment":"{\\"blackPoint\\":{\\"lift\\":[0.08627450980392157,0.09411764705882353,0.07058823529411765],\\"transition\\":0.3764705882352941,\\"textureMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"texture\\":[[0,[0,0,0]],[0.047058823529411764,[0,0,0]],[0.12549019607843137,[0.024243137254901962,0.008149019607843137,0.00014901960784313725]],[0.25098039215686274,[0.041372549019607845,0.018466666666666666,0.0015450980392156864]],[0.3764705882352941,[0.03971372549019608,0.031956862745098034,0.004298039215686274]],[0.5647058823529412,[0.022501960784313726,0.04212941176470588,-0.0013411764705882354]],[0.7529411764705882,[-0.01103921568627451,0.009572549019607843,-0.024062745098039216]],[0.8784313725490196,[-0.12113725490196078,-0.08109411764705882,-0.07792549019607843]],[1,[0,0,0]]]},\\"blend\\":{\\"maskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png\\",\\"outerMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"outset\\":0.014344262295081968,\\"backdrop\\":[0.7352156862745097,0.6811372549019608,0.5543529411764706],\\"amount\\":0.461},\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9392523364485981,0.9720812182741116,0.9715909090909091]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}}]}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":18.3125,\\"saturationScale\\":0.8049999999999997,\\"brightnessScale\\":0.9475},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.891304347826087,0.8851063829787235,0.9170124481327802]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.903896103896104,0.8686987104337631,0.9136771300448431]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8897435897435898,0.8779342723004694,0.9079685746352413]}}]}","lift":[20.5,27.5,34.5]}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/u.png","adjustment":"{\\"blackPoint\\":{\\"lift\\":[0.08235294117647059,0.09803921568627451,0.12156862745098039],\\"transition\\":0.3764705882352941,\\"textureMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"texture\\":[[0,[0,0,0]],[0.047058823529411764,[0,0,0]],[0.12549019607843137,[0.005286274509803922,0.013509803921568626,0.06162352941176471]],[0.25098039215686274,[0.003372549019607843,0.022811764705882354,0.10387843137254903]],[0.3764705882352941,[-0.014058823529411764,0.019941176470588236,0.09505098039215686]],[0.5647058823529412,[-0.035513725490196074,0.010701960784313725,0.0654235294117647]],[0.7529411764705882,[-0.04386274509803922,0.0020666666666666667,0.04343921568627451]],[0.8784313725490196,[-0.031243137254901958,-0.02695294117647059,0.02028627450980392]],[1,[0,0,0]]]},\\"blend\\":{\\"maskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png\\",\\"outerMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"outset\\":0.014344262295081968,\\"backdrop\\":[0.5243529411764706,0.6655686274509803,0.8150196078431373],\\"amount\\":0.948},\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9784946236559141,0.9901477832512315,1.036697247706422]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.1098901098901097,1.0403225806451613,1.128980891719745]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.10989010989011,1.0423387096774193,1.1353503184713374]}}]}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-2.75,\\"saturationScale\\":0.9825000000000002,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.865546218487395,0.8620689655172413,0.8951965065502183]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8559782608695653,0.8110014104372356,0.8306801736613603]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8600508905852416,0.8215223097112861,0.8409703504043128]}}]}","lift":[8.5,13.5,22]}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/b.png","adjustment":"{\\"blackPoint\\":{\\"lift\\":[0.011764705882352941,0.027450980392156862,0.054901960784313725],\\"transition\\":0.3764705882352941,\\"textureMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"texture\\":[[0,[0,0,0]],[0.047058823529411764,[0,0,0]],[0.09411764705882353,[-0.012780392156862745,-0.008890196078431372,-0.023172549019607844]],[0.1568627450980392,[0.03188235294117647,0.06992941176470588,0.036301960784313726]],[0.25098039215686274,[-0.05876470588235294,-0.016141176470588235,-0.04176470588235294]],[0.3764705882352941,[-0.12604705882352943,-0.10672941176470589,-0.11916470588235294]],[0.5647058823529412,[-0.06932941176470588,-0.07692156862745098,-0.08024705882352942]],[0.7529411764705882,[-0.009141176470588236,-0.034470588235294114,-0.03403137254901961]],[0.8784313725490196,[0.015541176470588235,-0.010145098039215686,-0.009192156862745098]],[1,[0,0,0]]]},\\"blend\\":{\\"maskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png\\",\\"outerMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"outset\\":0.014344262295081968,\\"backdrop\\":[0.09031372549019609,0.1192156862745098,0.1312156862745098],\\"amount\\":0.737},\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0509554140127388,1.0723684210526314,1.1143790849673203]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.7767857142857142,0.724609375,0.741869918699187]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.7732142857142856,0.736328125,0.7439024390243902]}}]}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":4.1875,\\"saturationScale\\":1.0318749999999994,\\"brightnessScale\\":0.9150000000000003},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8938775510204081,0.8893805309734514,0.9065420560747663]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8801652892561984,0.8810679611650486,0.8488210818307905]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8780991735537191,0.8691931540342297,0.8393351800554018]}}]}","lift":[34,27,29.5]}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/r.png","adjustment":"{\\"blackPoint\\":{\\"lift\\":[0.12156862745098039,0.09803921568627451,0.09411764705882353],\\"transition\\":0.3764705882352941},\\"blend\\":{\\"maskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png\\",\\"outerMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"outset\\":0.014344262295081968,\\"backdrop\\":[0.5287450980392158,0.23847058823529413,0.16415686274509803],\\"amount\\":0.192},\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1.0657894736842104,1.0162601626016259]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}}]}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-39.28098739495795,\\"saturationScale\\":1.0733997252747252,\\"brightnessScale\\":0.86328125},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8818181818181817,0.8641304347826086,0.9011494252873564]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8756281407035176,0.85,0.8712121212121212]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8844221105527638,0.8489892984542211,0.8731155778894473]}}]}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/g.png","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"blackPoint\\":{\\"lift\\":[0.06274509803921569,0.07058823529411765,0.08235294117647059],\\"transition\\":0.3764705882352941},\\"blend\\":{\\"maskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png\\",\\"outerMaskSource\\":\\"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png\\",\\"outset\\":0.014344262295081968,\\"backdrop\\":[0.31623529411764706,0.3920392156862745,0.25545098039215686],\\"amount\\":0.431}}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2,\\"saturationScale\\":1.159999999999999,\\"brightnessScale\\":0.8725},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8467741935483871,0.8443579766536965,0.734375]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png","adjustment":"{\\"hueDegrees\\":4.1875,\\"saturationScale\\":1.0318749999999994,\\"brightnessScale\\":0.9150000000000003}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png","adjustment":"{\\"hueDegrees\\":-6.491752199413554,\\"saturationScale\\":0.8110599078341005,\\"brightnessScale\\":0.875}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2,\\"saturationScale\\":1.159999999999999,\\"brightnessScale\\":0.8725},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8467741935483871,0.8443579766536965,0.734375]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png","adjustment":"{\\"hueDegrees\\":-2.75,\\"saturationScale\\":0.9825000000000002,\\"brightnessScale\\":1}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png","adjustment":"{\\"hueDegrees\\":-39.28098739495795,\\"saturationScale\\":1.0733997252747252,\\"brightnessScale\\":0.86328125}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2,\\"saturationScale\\":1.159999999999999,\\"brightnessScale\\":0.8725},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8467741935483871,0.8443579766536965,0.734375]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png","adjustment":"{\\"hueDegrees\\":-39.28098739495795,\\"saturationScale\\":1.0733997252747252,\\"brightnessScale\\":0.86328125}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png","adjustment":"{\\"hueDegrees\\":18.3125,\\"saturationScale\\":0.8049999999999997,\\"brightnessScale\\":0.9475}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2,\\"saturationScale\\":1.159999999999999,\\"brightnessScale\\":0.8725},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8467741935483871,0.8443579766536965,0.734375]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png","adjustment":"{\\"hueDegrees\\":18.3125,\\"saturationScale\\":0.8049999999999997,\\"brightnessScale\\":0.9475}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png","adjustment":"{\\"hueDegrees\\":4.1875,\\"saturationScale\\":1.0318749999999994,\\"brightnessScale\\":0.9150000000000003}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2,\\"saturationScale\\":1.159999999999999,\\"brightnessScale\\":0.8725},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8467741935483871,0.8443579766536965,0.734375]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2,\\"saturationScale\\":1.159999999999999,\\"brightnessScale\\":0.8725},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8467741935483871,0.8443579766536965,0.734375]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png","adjustment":"{\\"hueDegrees\\":-6.491752199413554,\\"saturationScale\\":0.8110599078341005,\\"brightnessScale\\":0.875}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png","adjustment":"{\\"hueDegrees\\":-2.75,\\"saturationScale\\":0.9825000000000002,\\"brightnessScale\\":1}","lift":null}]},{"set":"plc","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":2,\\"saturationScale\\":1.159999999999999,\\"brightnessScale\\":0.8725},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],\\"feather\\":0.0015368852459016393},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8467741935483871,0.8443579766536965,0.734375]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"points\\":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],\\"feather\\":0.0015368852459016393},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png","adjustment":"{\\"hueDegrees\\":4.1875,\\"saturationScale\\":1.0318749999999994,\\"brightnessScale\\":0.9150000000000003}","lift":null},{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png","adjustment":"{\\"hueDegrees\\":-39.28098739495795,\\"saturationScale\\":1.0733997252747252,\\"brightnessScale\\":0.86328125}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameW.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9244897959183672,0.9248971193415638,0.93125]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/wcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9187500000000002,0.9229729729729731,1.1260000000000001]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],\\"feather\\":0.0026666666666666666},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8812095032397409,0.8817567567567567,0.9481792717086837]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0465277777777777,1.0163352272727273,1.1097770154373927]}}]}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/wpt.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9187500000000002,0.9229729729729731,1.1260000000000001]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9004329004329005,0.8952702702702703,0.9717514124293787]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.01282051282051282,\\"points\\":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameW.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9244897959183672,0.9248971193415638,0.93125]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameU.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1.0931250000000001,\\"brightnessScale\\":0.8931249999999998},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8502155172413793,0.8613445378151261,0.9300411522633745]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9047619047619047,0.9276018099547512,0.9518072289156626]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.4015151515151516,1.0086206896551724,0.9087837837837838]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/ucard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.6021739130434783,0.7878787878787878,0.9531772575250836]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],\\"feather\\":0.0026666666666666666},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.59375,0.8760683760683762,0.8777777777777778]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.6702898550724639,0.9859550561797753,1.0846774193548387]}}]}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/upt.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.6021739130434783,0.7878787878787878,0.9531772575250836]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.7395209580838322,0.8991596638655462,0.8878378378378378]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.01282051282051282,\\"points\\":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameU.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1.0931250000000001,\\"brightnessScale\\":0.8931249999999998},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8502155172413793,0.8613445378151261,0.9300411522633745]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9047619047619047,0.9276018099547512,0.9518072289156626]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.4015151515151516,1.0086206896551724,0.9087837837837838]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameB.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1.0137500000000002},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8750000000000001,0.8459821428571429,0.8392857142857143]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.736842105263158,0.8620689655172413,1.03125]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.6666666666666666,0.8181818181818182,1.0740740740740742]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameB.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1.0137500000000002},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8750000000000001,0.8459821428571429,0.8392857142857143]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.736842105263158,0.8620689655172413,1.03125]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.6666666666666666,0.8181818181818182,1.0740740740740742]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameR.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-4.625,\\"saturationScale\\":1.0362500000000012,\\"brightnessScale\\":1.065625},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9385245901639344,0.8853161843515541,0.84070796460177]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0038560411311055,0.9704301075268819,1.1162790697674418]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9128989361702128,0.9044117647058825,1.1458333333333335]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/rcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8851981351981352,0.9510309278350517,0.9543269230769231]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],\\"feather\\":0.0026666666666666666},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9145199063231849,1.0140449438202248,1.1162790697674418]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0811023622047244,0.9044117647058825,0.7366071428571429]}}]}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/rpt.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8851981351981352,0.9510309278350517,0.9543269230769231]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9608294930875576,1.0552486187845302,1.180722891566265]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.01282051282051282,\\"points\\":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ccard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.6,0.6,0.6]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],\\"feather\\":0.0026666666666666666},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.09333333333333334,0.6129032258064516],[0.9173333333333333,0.6129032258064516],[0.928,0.6451612903225806],[0.936,0.683111954459203],[0.9333333333333333,0.7400379506641366],[0.9333333333333333,0.7969639468690702],[0.9306666666666666,0.8159392789373814],[0.92,0.8538899430740038],[0.912,0.8842504743833017],[0.10133333333333333,0.8842504743833017],[0.08533333333333333,0.8538899430740038],[0.07733333333333334,0.8159392789373814],[0.06933333333333333,0.777988614800759],[0.06933333333333333,0.7210626185958254],[0.07466666666666667,0.683111954459203],[0.08266666666666667,0.6451612903225806]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1}}]}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ctypeline.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.947089947089947,0.9388297872340424,1.0242587601078168]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.6957070707070706,0.6905370843989771,0.7095046854082999]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ctextbox.png","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8893905191873589,0.8839285714285715,0.9282511210762332]}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameG.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8961038961038961,0.9102564102564102,0.8887061403508772]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.2035714285714287,1.03,1.0040322580645162]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.494318181818182,1.0045731707317074,1.1860465116279069]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameG.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8961038961038961,0.9102564102564102,0.8887061403508772]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.2035714285714287,1.03,1.0040322580645162]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.494318181818182,1.0045731707317074,1.1860465116279069]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/gcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],\\"feather\\":0.0026666666666666666},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9573863636363638,1.03,1.3833333333333333]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0026666666666666666,\\"points\\":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]}}]}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/gpt.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9746835443037973,1.0483870967741935,1.5]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.01282051282051282,\\"points\\":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameA.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":-6.794165580182494,\\"saturationScale\\":0.7130415909549775,\\"brightnessScale\\":1.083617747440273},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.9201680672268907,0.9121338912133891,0.9253112033195021]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8410958904109589,0.8910614525139665,0.9060773480662984]}},{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.002688172043010753,\\"points\\":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1,1,1]}}]}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/glcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/blcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/rlcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.1482558139534884,1.111280487804878,1.3]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/rlcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/glcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.1482558139534884,1.111280487804878,1.3]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/gltextbox.png","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.4,1.4,1.4]}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/glcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wlcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.1482558139534884,1.111280487804878,1.3]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/gltextbox.png","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.4,1.4,1.4]}","lift":null},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wltextbox.png","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8366228070175439,0.786036036036036,0.7373737373737373]}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wlcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ulcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.1482558139534884,1.111280487804878,1.3]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}","lift":null},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wltextbox.png","adjustment":"{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[0.8366228070175439,0.786036036036036,0.7373737373737373]}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ulcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/blcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.1482558139534884,1.111280487804878,1.3]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}","lift":null}]},{"set":"fut","stock":"#181510","materials":[{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":8,\\"saturationScale\\":0.6137499999999998,\\"brightnessScale\\":1.25},\\"mask\\":{\\"kind\\":\\"rect\\",\\"rect\\":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],\\"feather\\":0.0026666666666666666}}","lift":null,"bakedStock":true},{"url":"https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png","adjustment":"{\\"frame\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1},\\"paper\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.1482558139534884,1.111280487804878,1.3]},\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},\\"regions\\":[{\\"mask\\":{\\"kind\\":\\"polygon\\",\\"feather\\":0.0029498525073746312,\\"points\\":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},\\"adjustment\\":{\\"hueDegrees\\":0,\\"saturationScale\\":1,\\"brightnessScale\\":1,\\"rgbScale\\":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}","lift":null}]}]'), Ro = (e) => {
  const t = parseInt(e.slice(1), 16);
  return [(t >> 16) / 255, (t >> 8 & 255) / 255, (t & 255) / 255];
}, bn = Co;
function a0(e) {
  return (e.colorCalibration === "set-hsb-v1" || e.colorCalibration === "early-hsb-v1") && (!e.borderColor || e.borderColor === "black") && bn.some((t) => t.set === e.setCode?.toLowerCase() && t.stock !== null);
}
function Sn(e, t, r) {
  if (!["set-hsb-v1", "early-hsb-v1"].includes(e.colorCalibration ?? "")) return { materials: t };
  const a = bn.filter((o) => o.set === e.setCode?.toLowerCase());
  if (!a.length) return { materials: t };
  let s;
  const n = { ...t };
  for (const [o, i] of Object.entries(t)) {
    const l = JSON.stringify(i);
    for (const d of a) {
      const c = d.materials.find((g) => g.url === o && g.adjustment === l);
      if (!c) continue;
      if (d.stock && a0(e) && (s = d.stock), c.bakedStock && s) {
        const g = parseInt(s.slice(1), 16);
        n[o] = {
          ...i,
          outerStockMaskSource: c.stockMask,
          outerStock: [(g >> 16) / 255, (g >> 8 & 255) / 255, (g & 255) / 255]
        };
      }
      if (!c.lift || i.blackPoint) continue;
      const [u, h, m] = c.lift;
      if (c.lift.length !== 3 || u === void 0 || h === void 0 || m === void 0)
        throw new Error("Invalid printing black-point binding");
      n[o] = {
        ...n[o],
        blackPoint: { lift: [u / 255, h / 255, m / 255], transition: 96 / 255 }
      };
    }
  }
  if (r && a0(e)) {
    const o = jo.find(
      (i) => i.set === e.setCode?.toLowerCase() && r.geometry === i.geometry && r.url.startsWith(i.prefix) && (i.family === "retro" ? /^[wubrgacml]{1,2}\.png$/.test(r.url.slice(i.prefix.length)) : /^(W|U|B|R|G|WU|WB|WR|WG|UB|UR|UG|BR|BG|RG|Artifact|Gold|Colourless)\.webp$/.test(
        r.url.slice(i.prefix.length)
      ))
    );
    o && (s = o.stock, r.mask && (n[r.url] = {
      ...n[r.url] ?? { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
      outerStock: Ro(s),
      outerStockMaskSource: r.mask
    }));
  }
  return { materials: n, ...s ? { stock: s } : {} };
}
const Mo = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", xo = "https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg", To = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Do = "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1", Io = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-new-split-fuse.mse-style", Eo = "https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2", Ao = "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", K = {
  RENDERER_COMPONENT_ROOT: Mo,
  KEYRUNE_ROOT: xo,
  CONJURER_ROOT: To,
  RETRO_ROOT: Do,
  MSE_SPLIT_BRIDGE_ROOT: Io,
  RETRO_SYMBOL_FONT: Eo,
  MSE_TEMPLATE_ROOT: Ao
}, Bo = { "10e": "cmrsu", "2ed": "cmrsu", "2x2": "cmrsu", "2xm": "cmrsu", "30a": "cmrsu", "3ed": "cmrsu", "40k": "cmrsu", "4ed": "cmrsu", "5dn": "cmrsu", "5ed": "cmrsu", "6ed": "cmrsu", "7ed": "cmrsu", "8ed": "cmrsu", "9ed": "cmrsu", a25: "cmrsu", acr: "cmrsu", aer: "cmrsu", afc: "cmrsu", afr: "cmrsu", akh: "cmrsu", akr: "cmrsu", ala: "cmrsu", all: "cmrsu", ana: "cmrsu", apc: "cmrsu", arb: "cmrsu", arc: "cmrsu", archie: "cmrsu", arena: "cmrsu", arn: "cmrsu", ath: "cmrsu", atq: "cmrsu", avr: "cmrsu", azorius: "cmru", bbd: "cmrsu", bfz: "cmrsu", big: "cmrsu", blb: "cmrsu", blc: "cmrsu", bng: "cmrsu", bok: "cmrsu", boros: "cmru", bot: "cmrsu", brb: "cmrsu", brc: "cmrsu", bro: "cmrsu", brr: "cmrsu", btd: "cmrsu", c13: "cmrsu", c14: "cmrsu", c15: "cmrsu", c16: "cmrsu", c17: "cmrsu", c18: "cmrsu", c19: "cmrsu", c20: "cmrsu", c21: "cmrsu", cc1: "cmrsu", cc2: "cmrsu", ced: "cmrsu", cei: "cmrsu", chk: "cmrsu", chr: "cmrsu", clb: "cmrsu", clu: "cmrsu", cm1: "cmrsu", cm2: "cmrsu", cma: "cmrsu", cmd: "cmrsu", cmm: "cmrsu", cmr: "cmrsu", cn2: "cmrsu", cns: "cmrsu", con: "cmrsu", conf: "cmrsu", csp: "cmrsu", dci: "cmrsu", dd1: "cmrsu", dd2: "cmrsu", ddc: "cmrsu", ddd: "cmrsu", dde: "cmrsu", ddf: "cmrsu", ddg: "cmrsu", ddh: "cmrsu", ddi: "cmrsu", ddj: "cmrsu", ddk: "cmrsu", ddl: "cmrsu", ddm: "cmrsu", ddn: "cmrsu", ddo: "cmrsu", ddp: "cmrsu", ddq: "cmrsu", ddr: "cmrsu", dds: "cmrsu", ddt: "cmrsu", ddu: "cmrsu", default: "cmrsu", dft: "cmrsu", dgm: "cmrsu", dimir: "cmru", dis: "cmrsu", dka: "cmrsu", dkm: "cmrsu", dmc: "cmrsu", dmr: "cmrsu", dmu: "cmrsu", dom: "cmrsu", dpa: "cmrsu", drb: "cmrsu", drc: "cmrsu", drk: "cmrsu", dsc: "cmrsu", dsk: "cmrsu", dst: "cmrsu", dtk: "cmrsu", e01: "cmrsu", e02: "cmrsu", ecc: "cmrsu", ecl: "cmrsu", eld: "cmrsu", ema: "cmrsu", emn: "cmrsu", eoc: "cmrsu", eoe: "cmrsu", eos: "cmru", eve: "cmrsu", exo: "cmrsu", exp: "cmrsu", fca: "cmrsu", fdc: "cmrsu", fdn: "cmrsu", fem: "cmrsu", fic: "cmrsu", fin: "cmrsu", fnm: "r", fra: "cmrsu", frc: "cmrsu", frf: "cmrsu", fut: "cmrsu", gn2: "cmrsu", gn3: "cmrsu", gnt: "cmrsu", golgari: "cmru", gpt: "cmrsu", grn: "cmrsu", gruul: "cmru", gs1: "cmrsu", gtc: "cmrsu", h09: "cmrsu", h17: "cmrsu", ha1: "cmrsu", hbg: "cmrsu", hml: "cmrsu", hob: "cmrsu", hoc: "cmrsu", hop: "cmrsu", hou: "cmrsu", ice: "cmrsu", idw: "cmrsu", iko: "cmrsu", ima: "cmrsu", inr: "cmrsu", inv: "cmrsu", isd: "cmrsu", izzet: "cmru", j20: "cmrsu", j21: "cmrsu", j22: "cmrsu", j25: "cmru", jmp: "cmrsu", jou: "cmrsu", jud: "cmrsu", khc: "cmrsu", khm: "cmrsu", kld: "cmrsu", klr: "cmrsu", ktk: "cmrsu", lcc: "cmrsu", lci: "cmrsu", lea: "cmrsu", leb: "cmrsu", leg: "cmrsu", lgn: "cmrsu", lrw: "cmrsu", ltc: "cmrsu", ltr: "cmrsu", m10: "cmrsu", m11: "cmrsu", m12: "cmrsu", m13: "cmrsu", m14: "cmrsu", m15: "cmrsu", m19: "cmrsu", m20: "cmrsu", m21: "cmrsu", m3c: "cmrsu", mat: "cmrsu", mb2: "cmrsu", mbc: "cmrsu", mbs: "cmrsu", mc3: "cmrsu", md1: "cmrsu", me1: "cmrsu", me2: "cmrsu", me3: "cmrsu", me4: "cmrsu", med: "cmrsu", mh1: "cmrsu", mh2: "cmrsu", mh3: "cmrsu", mic: "cmrsu", mid: "cmrsu", mir: "cmrsu", mkc: "cmrsu", mkm: "cmrsu", mm2: "cmrsu", mm3: "cmrsu", mma: "cmrsu", mmq: "cmrsu", moc: "cmrsu", mom: "cmrsu", mor: "cmrsu", mp2: "cmrsu", mps: "cmrsu", mrd: "cmrsu", msc: "cmrsu", msh: "cmrsu", mtga: "cmrsu", mtgo: "cmrsu", mul: "cmrsu", ncc: "cmrsu", nec: "cmrsu", nem: "cmrsu", neo: "cmrsu", nph: "cmrsu", ody: "cmrsu", ogw: "cmrsu", om1: "cmrsu", omb: "cmrsu", onc: "cmrsu", one: "cmrsu", ons: "cmrsu", ori: "cmrsu", orzhov: "cmru", otc: "cmrsu", otj: "cmrsu", otp: "cmrsu", p02: "cmrsu", papac: "cmrsu", parl2: "cmrsu", past: "cmrsu", pbook: "cmrsu", pc2: "cmrsu", pca: "cmrsu", pcy: "cmrsu", pd2: "cmrsu", pd3: "cmrsu", pdrc: "c", peuro: "cmrsu", pgru: "c", phpr: "cmrsu", phuk: "cmrsu", pidw: "cmrsu", pio: "cmrsu", pip: "cmrsu", planeswalker: "cmrsu", plc: "cmrsu", pls: "cmrsu", pmps: "cmrsu", por: "cmrsu", prm: "cmrsu", ps11: "cmrsu", psal: "cmrsu", psdg: "cmrsu", psum: "cmrsu", ptg: "cmrsu", ptk: "cmrsu", pvan: "c", pxbox: "cmrsu", pz1: "cmrsu", pz2: "cmrsu", pza: "cmrsu", rav: "cmrsu", ren: "cmrsu", rex: "cmrsu", rin: "cmrsu", rix: "cmrsu", rna: "cmrsu", roe: "cmrsu", rtr: "cmrsu", rvr: "cmrsu", s00: "cmrsu", s99: "cmrsu", scd: "cmrsu", scg: "cmrsu", sds: "cmrsu", selesnya: "cmru", shm: "cmrsu", simic: "cmru", sir: "cmrsu", sis: "cmrsu", sld: "cmrsu", snc: "cmrsu", soa: "cmrsu", soc: "cmrsu", soi: "cmrsu", sok: "cmrsu", som: "cmrsu", sos: "cmrsu", spe: "cmrsu", spg: "cmrsu", spm: "cmrsu", ss1: "cmrsu", ss2: "cmrsu", ss3: "cmrsu", sta: "cmrsu", star: "cmrsu", sth: "cmrsu", stx: "cmrsu", td0: "cmrsu", td2: "cmrsu", tdc: "cmrsu", tdm: "cmrsu", thb: "cmrsu", ths: "cmrsu", tla: "cmrsu", tle: "cmrsu", tlr: "c", tmc: "cmrsu", tmp: "cmrsu", tmt: "cmrsu", tor: "cmrsu", tpr: "cmrsu", trc: "cmrsu", trk: "cmrsu", tsp: "cmrsu", tsr: "cmrsu", uds: "cmrsu", ugl: "cmrsu", ulg: "cmrsu", uma: "cmrsu", und: "cmrsu", unf: "cmrsu", unh: "cmrsu", usg: "cmrsu", ust: "cmrsu", v09: "cmrsu", v10: "cmrsu", v11: "cmrsu", v12: "cmrsu", v13: "cmrsu", v14: "cmrsu", v15: "cmrsu", v16: "cmrsu", v17: "cmrsu", van: "cmrsu", vis: "cmrsu", vma: "cmrsu", voc: "cmrsu", vow: "cmrsu", w16: "cmrsu", w17: "cmrsu", war: "cmrsu", who: "cmrsu", woc: "cmrsu", woe: "cmrsu", wor: "u", wot: "cmrsu", wth: "cmrsu", wwk: "cmrsu", x2ps: "cmrsu", xln: "cmrsu", y22: "cmrsu", y23: "cmrsu", y24: "cmrsu", y25: "cmrsu", y26: "cmrsu", zen: "cmrsu", znc: "cmrsu", zne: "cmrsu", znr: "cmrsu" }, Lo = {
  codes: Bo
}, Go = new Set(
  "arn atq leg drk fem ice hml all chr mir vis wth tmp sth por".split(" ")
), $o = new Set("lea leb 2ed 3ed 4ed 5ed ced cei sum itp".split(" "));
function wn(e) {
  return Go.has(e?.trim().toLowerCase() ?? "");
}
function Oo(e) {
  return ["arn", "atq", "leg", "drk", "chr"].includes(e?.toLowerCase() ?? "") ? 0 : 1;
}
function Po(e, t) {
  const r = e?.trim().toLowerCase() ?? "";
  return $o.has(r) || r === "atq" && t === "Reconstruction";
}
const B = K.CONJURER_ROOT, yn = `${B}/img/setSymbols/official/`, _a = Lo.codes, Wo = {
  common: "c",
  uncommon: "u",
  rare: "r",
  mythic: "m",
  special: "s",
  bonus: "s"
};
function kn(e, t = "common", r = "auto") {
  const a = e.trim().toLowerCase();
  if (r === "keyrune") return null;
  const s = wn(a) ? "c" : Wo[t];
  return s && Object.hasOwn(_a, a) && _a[a].includes(s) ? `${yn}${a}-${s}.svg` : null;
}
function Ge(e) {
  return !!e?.startsWith(yn);
}
const Fo = K.KEYRUNE_ROOT, Uo = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32]
};
function at(e) {
  return !e.setSymbol && !kn(e.setCode ?? "", e.rarity, e.setSymbolSource) ? Uo[e.setCode?.toLowerCase() ?? ""] ?? [0, 0, 1, 1] : [0, 0, 1, 1];
}
const vn = new Set(
  `
10e 2ed 2x2 2xm 3ed 40k 4ed 5dn 5ed 6ed 7ed 8ed 9ed a25 acr aer afc afr akh akr
ala all apc arb arc arn ath atq avr bbd bcore bfz big blb blc bng bok boros bot br
brb brc bro brr btd c13 c14 c15 c16 c17 c18 c19 c20 c21 cc1 cc2 chk chr clb clu
cm1 cm2 cma cmd cmm cmr cn2 cns csp dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl
ddm ddn ddo ddp ddq ddr dds ddt ddu dft dgm dimir dis dka dkm dmc dmr dmu dom dpa
drb drc drk dsc dsk dst dtk dvk e01 e02 ecc ecl eld ema emn eoc eoe eos eve evg
exo exp fdc fdn fem fic fin fra frf fut gn2 gn3 gnt gpt grn gruul gs1 gtc h09 h17
ha1 hbg hml hob hoc hop hou ice ice2 iko ima inr inv isd izzet j20 j21 j22 j25 jmp
jou jud khc khm kld klr ktk lcc lci lea leb leg lgn lrw ltc ltr m10 m11 m12 m13
m14 m15 m19 m20 m21 m3c mar mat mb1 mb2 mbs md1 me1 me2 me3 me4 med mh1 mh2 mh3
mic mid mir mkc mkm mm2 mm3 mma mmq moc mom mor mp1 mp2 mrd msc msh ncc nec nem
neo nms nph ody ogw om1 omb onc one ons ori otc otj otp papac parl parl2 parl3 past pbook
pc2 pca pcy pd2 pd3 pdep pdgc peuro pfnm pgru pidw pio pip plc pleaf pls pm2 pma pmei pmodo
pmps pmpu pmtg1 pmtg2 po2 por psega psum ptg ptk ptsa pxbox pz2 rav rex rix rna roe rtr rvr
s00 s99 scg shm simic sld2 snc soa soc soi sok som sos spe spg spm ss1 ss2 ss3 sta
sth stx td2 tdc tdm thb ths tla tle tmc tmp tmt tor tpr tsp tsr uds ugl ulg uma
una und unf unh usg ust v09 v0x v10 v11 v12 v13 v14 v15 v16 v17 van vis vma voc
vow w16 w17 war who woc woe wot wth wwk x1e x2e x2ps x2u x3e x4ea xcle xice xlcu xln
xmods xren xrin y22 y24 y25 y26 ydmu zen znc zne znr
`.trim().split(/\s+/)
);
vn.add("con_");
const _o = "GLINT", E0 = {
  common: "#171717",
  uncommon: "#8c9ba5",
  rare: "#bc923f",
  mythic: "#d66b32",
  special: "#926ab5",
  bonus: "#926ab5"
};
function No(e) {
  const t = E0[e] ?? E0.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${t}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}
function zo(e) {
  const t = E0[e] ?? E0.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${t}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}
function Yo(e, t = "common", r) {
  const a = e.trim().toLowerCase();
  if (a === "forge") return zo(t);
  if (a === _o.toLowerCase()) return No(t);
  const s = kn(a, t, r);
  if (s) return s;
  const n = a === "con" ? "con_" : a === "p02" ? "po2" : a;
  return vn.has(n) ? `${Fo}/${n}.svg` : null;
}
const Na = {
  "Abu Ja'far": "arn",
  "Active Volcano": "leg",
  "Akron Legionnaire": "leg",
  Aladdin: "arn",
  "Angelic Voices": "leg",
  "Arcades Sabboth": "leg",
  "Arena of the Ancients": "leg",
  "Argothian Pixies": "atq",
  "Ashnod's Altar": "atq",
  "Ashnod's Transmogrant": "atq",
  "Axelrod Gunnarson": "leg",
  "Ayesha Tanaka": "leg",
  "Azure Drake": "leg",
  Banshee: "drk",
  "Barl's Cage": "drk",
  "Beasts of Bogardan": "leg",
  "Blood Moon": "drk",
  "Blood of the Martyr": "drk",
  "Bog Rats": "drk",
  "Book of Rass": "drk",
  Boomerang: "leg",
  "Bronze Horse": "leg",
  "Cat Warriors": "leg",
  Chromium: "leg",
  "City of Brass": "arn",
  Cocoon: "leg",
  "Concordant Crossroads": "leg",
  "Craw Giant": "leg",
  "Cuombajj Witches": "arn",
  Cyclone: "arn",
  "D'Avenant Archer": "leg",
  "Dakkon Blackblade": "leg",
  "Dance of Many": "drk",
  Dandân: "arn",
  "Divine Offering": "leg",
  "Emerald Dragonfly": "leg",
  "Enchantment Alteration": "leg",
  "Erhnam Djinn": "arn",
  "Fallen Angel": "leg",
  "Feldon's Cane": "atq",
  "Fire Drake": "drk",
  "Fishliver Oil": "arn",
  "Flash Flood": "leg",
  "Fountain of Youth": "drk",
  "Gabriel Angelfire": "leg",
  "Gauntlets of Chaos": "leg",
  "Ghazbán Ogre": "arn",
  "Giant Slug": "leg",
  "Goblin Artisans": "atq",
  "Goblin Digging Team": "drk",
  "Goblin Shrine": "drk",
  "Goblins of the Flarg": "drk",
  "Hasran Ogress": "arn",
  "Hell's Caretaker": "leg",
  "Horn of Deafening": "leg",
  "Indestructible Aura": "leg",
  "Ivory Guardians": "leg",
  "Jalum Tome": "atq",
  "Jeweled Bird": "arn",
  Johan: "leg",
  Juxtapose: "leg",
  "Keepers of the Faith": "leg",
  "Kei Takahashi": "leg",
  "Land's Edge": "leg",
  "Living Armor": "drk",
  "Marhault Elsdragon": "leg",
  Metamorphosis: "arn",
  "Mountain Yeti": "leg",
  Nebuchadnezzar: "leg",
  "Nicol Bolas": "leg",
  "Obelisk of Undoing": "atq",
  "Palladia-Mors": "leg",
  "Petra Sphinx": "leg",
  "Primordial Ooze": "leg",
  "Puppet Master": "leg",
  "Rabid Wombat": "leg",
  Rakalite: "atq",
  Recall: "leg",
  "Remove Soul": "leg",
  "Repentant Blacksmith": "arn",
  Revelation: "leg",
  "Rubinia Soulsinger": "leg",
  Runesword: "drk",
  "Safe Haven": "drk",
  "Scavenger Folk": "drk",
  Sentinel: "leg",
  "Serpent Generator": "leg",
  "Shield Wall": "leg",
  "Shimian Night Stalker": "leg",
  "Sivitri Scarzam": "leg",
  "Sol'kanar the Swamp King": "leg",
  Stangg: "leg",
  "Storm Seeker": "leg",
  Takklemaggot: "leg",
  Teleport: "leg",
  "The Fallen": "drk",
  "The Wretched": "leg",
  "Tobias Andrion": "leg",
  "Tor Wauki": "leg",
  "Tormod's Crypt": "drk",
  Transmutation: "leg",
  "Triassic Egg": "leg",
  "Urza's Mine": "atq",
  "Urza's Power Plant": "atq",
  "Urza's Tower": "atq",
  "Vaevictis Asmadi": "leg",
  "Voodoo Doll": "leg",
  "Wall of Heat": "leg",
  "Wall of Opposition": "leg",
  "Wall of Shadows": "leg",
  "Wall of Vapor": "leg",
  "Wall of Wonder": "leg",
  "War Elephant": "arn",
  "Witch Hunter": "drk",
  "Xira Arien": "leg",
  "Yawgmoth Demon": "atq"
};
function qo(e) {
  return Object.hasOwn(Na, e) ? Na[e] : null;
}
const Dt = K.RENDERER_COMPONENT_ROOT;
function gt(e, t = "normal") {
  const r = ["normal", "adventure", "leveler"].includes(t), a = t === "saga" ? "saga" : t === "planeswalker-large" ? "planeswalker_large" : t, s = r && e.land && /^[WUBRG]$/.test(e.frame) ? e.frame : ["saga", "class"].includes(t) && e.boxes === "Colourless" ? "Land" : t.startsWith("planeswalker") && e.boxes === "Artifact" ? "Colourless" : e.boxes;
  return {
    background: xe(
      r ? "bg" : t === "class" ? "saga_bg" : `${a}_bg`,
      t.startsWith("planeswalker") && s === "Land" ? "Colourless" : r ? e.boxes : s
    ),
    frame: xe(
      ["normal", "leveler"].includes(t) ? "frames" : `${a}_frames`,
      t === "adventure" ? "WUBRG".includes(e.frame) ? e.frame : "W" : t === "class" ? e.frame === "WU" ? "UW" : e.frame.length === 2 ? "Gold" : e.frame : t === "saga" && e.frame === "Colourless" ? "Land" : t.startsWith("planeswalker") && ["Artifact", "Land"].includes(e.frame) ? "Colourless" : e.frame
    ),
    boxes: xe(t.startsWith("planeswalker") ? "planeswalker_boxes" : "boxes", s),
    nameplate: xe("nameplates", e.boxes),
    crown: xe("legendary-crowns", e.crown),
    pt: t.startsWith("planeswalker") ? xe("planeswalker", "Loyalty") : xe("pt-boxes", e.pt)
  };
}
function It(e) {
  const t = e.replace(/^\{|\}$/g, "").toLocaleUpperCase(), r = t === "∞" ? "INFINITY" : t === "½" ? "HALF" : t.replaceAll("/", "");
  return /^[A-Z0-9]+$/.test(r) ? xe("symbols", r) : null;
}
function jn(e, t, r) {
  return Yo(e, t, r);
}
function xe(e, t) {
  const r = e === "legendary-crowns" ? "legendary_crowns" : e === "pt-boxes" ? "pt_boxes" : e === "nameplates" ? "boxes" : e, a = e === "symbols" ? "svg" : "webp";
  return `${Dt}/img/${r}/${encodeURIComponent(t)}.${a}`;
}
function V(e, t = e.rarity) {
  if (e.printingElements?.setSymbol?.hidden) return null;
  const r = e.setCode?.trim().toLowerCase() ?? "";
  return e.setSymbol ?? jn(
    r === "chr" ? qo(e.name) ?? "" : r,
    t,
    e.setSymbolSource
  );
}
function Ho(e) {
  if (e.printingElements?.setSymbol?.hidden) return null;
  if (Ge(e.setSymbol)) {
    const t = new URL(e.setSymbol).pathname.match(/\/([^/]+)-[curms]\.svg$/)?.[1];
    if (t) return jn(t, "common", "cardconjurer");
  }
  return V(e, "common");
}
function Ee(e, t) {
  return e.setCode?.toLowerCase() === "plc" && e.frameAssetFamily === "eighth" && !e.frameTemplate && (!e.layout || e.layout === "normal") && (!e.borderColor || e.borderColor === "black") && t.startsWith(`${B}/img/frames/8th/`) && /^(?:[wubrgm]|colorshifted\/[wubrg])\.png$/.test(
    t.slice(`${B}/img/frames/8th/`.length)
  );
}
const Rr = (e) => 244 + (e - 244) * 1.006 - 0.5, Mr = (e) => 340 + (e - 340) * 1.008 + 0.25;
function nr([e, t, r, a]) {
  return [Rr(e * 488) / 488, Mr(t * 680) / 680, r * 1.006, a * 1.008];
}
function Xo([e, t, r, a], s) {
  const [n, o, i, l] = s ? [1.03, -0.5, 1.025, 2.5] : [1.005, 0.25, 1.005, 2.75];
  return [
    (407 + (e * 488 - 407) * n + o) / 488,
    (626 + (t * 680 - 626) * i + l) / 680,
    r * n,
    a * i
  ];
}
function Hr(e, t, r = !1) {
  const [a, s, n, o] = r ? [21, 18.75, 467.5, 661] : [22, 22, 466, 658];
  e.save(), e.beginPath(), e.rect(0, 0, 488, 680), e.rect(a, s, n - a, o - s), e.clip("evenodd"), e.drawImage(t, 0, 0, 488, 680), e.restore();
  const i = [22, 28, 460, 466], l = [22, 28, 638, 658], d = [a, Rr(28), Rr(460), n], c = [s, Mr(28), Mr(638), o];
  for (let u = 0; u < l.length - 1; u++)
    for (let h = 0; h < i.length - 1; h++) {
      const m = i[h], g = l[u], f = d[h], b = c[u];
      e.drawImage(
        t,
        m / 488 * t.width,
        g / 680 * t.height,
        (i[h + 1] - m) / 488 * t.width,
        (l[u + 1] - g) / 680 * t.height,
        f,
        b,
        d[h + 1] - f,
        c[u + 1] - b
      );
    }
}
const Jo = /* @__PURE__ */ new Set(["artist", "legal", "collector", "manaCost", "setSymbol"]);
function Cn(e) {
  if (e.printingElements !== void 0) {
    if (!e.printingElements || typeof e.printingElements != "object" || Array.isArray(e.printingElements))
      throw Error("Printing elements must be an object");
    if (Object.keys(e.printingElements).length) {
      if (e.faces?.length || e.layout && !["normal", "token"].includes(e.layout) || e.frameTemplate && e.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
        throw Error("Printing element controls require an ordinary face or Futureshifted template.");
      for (const [t, r] of Object.entries(e.printingElements)) {
        if (!Jo.has(t) || !r || typeof r != "object" || Array.isArray(r))
          throw Error("Invalid printing element");
        for (const a of Object.keys(r))
          if (!["hidden", "offset"].includes(a)) throw Error("Unknown printing element option");
        if (r.hidden !== void 0 && typeof r.hidden != "boolean")
          throw Error("Invalid element visibility");
        if (r.offset !== void 0 && (!Array.isArray(r.offset) || r.offset.length !== 2 || !r.offset.every((a) => Number.isFinite(a) && Math.abs(a) <= 100)))
          throw Error("Printing offset must be within 100 reference pixels");
      }
    }
  }
}
function X(e, t, r, a) {
  const s = t.printingElements?.[r];
  if (!s?.hidden) {
    if (!s?.offset) return a();
    e.save();
    try {
      e.translate(...s.offset), a();
    } finally {
      e.restore();
    }
  }
}
const Rn = {
  plc: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 165 },
  fut: { legal: "™ & © 1993–2007 Wizards of the Coast, Inc.", total: 180 },
  "8ed": { legal: "™ & © 1993–2003 Wizards of the Coast, Inc.", total: 350 },
  m15: { legal: "™ & © 2014 Wizards of the Coast", total: 269 },
  war: { legal: "™ & © 2019 Wizards of the Coast", total: 264 },
  m21: { legal: "™ & © 2020 Wizards of the Coast", total: 274 },
  fdn: { legal: "™ & © 2024 Wizards of the Coast", format: "rarity-first" }
};
function Xr(e) {
  return e.printingElements?.legal?.hidden ? null : e.legalText === void 0 ? Rn[e.setCode?.toLowerCase() ?? ""]?.legal ?? null : e.legalText;
}
function Jr(e, t = !0) {
  if (e.printingElements?.collector?.hidden) return "";
  const r = e.collectorNumber?.trim();
  if (!r) return "";
  const a = Rn[e.setCode?.toLowerCase() ?? ""], s = e.collectorFormat ?? a?.format ?? "number-first", n = /^Basic (?:Snow )?Land\b/.test(e.typeLine ?? "") ? "L" : (e.rarity ?? "common")[0].toUpperCase();
  if (t && s === "rarity-first")
    return `${n} ${r.split("/")[0].replace(/^(\d+)/, (c) => c.padStart(4, "0"))}`;
  const o = /^\d+$/.test(r), i = t && o ? r.padStart(3, "0") : r, l = e.collectorTotal === void 0 ? a?.total : e.collectorTotal, d = l && o && Number(r) <= l ? `${i}/${l}` : i;
  return t ? `${d} ${n}` : d;
}
const Ko = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function l0(e) {
  const t = /^Basic (?:Snow )?Land [—–-] (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.canonicalTypeLine ?? e.typeLine ?? ""
  )?.[1];
  return t ? Ko[t] : void 0;
}
function H0(e) {
  if (e.frameStyle === "retro" || e.frameTemplate || e.layout && e.layout !== "normal")
    return null;
  const t = l0(e);
  if (!t) return null;
  const r = e.rulesText ?? "";
  if (!["", t, `{${t}}`, `{T}: Add {${t}}.`, `({T}: Add {${t}}.)`].includes(r))
    return null;
  if (e.rulesParagraphs) {
    const a = e.rulesParagraphs;
    if (a.length !== 1 || a[0].role !== "rules" || a[0].align || a[0].runs.length !== 1 || a[0].runs[0].text !== r || !!a[0].runs[0].italic !== r.startsWith("("))
      return null;
  }
  return `${K.RETRO_ROOT}/img/frames/m15/basics/${t.toLowerCase()}.png`;
}
function Mn(e, t, r) {
  if (!Ke(e)) return !0;
  const a = H0(t);
  if (!a) return !1;
  const s = r.get(a);
  if (!s) throw Error(`Basic land symbol unavailable: ${a}`);
  return e.save(), e.shadowColor = "#0009", e.shadowOffsetX = -1.5, e.shadowOffsetY = 1.5, e.shadowBlur = 1.5, e.drawImage(s, 166, 440, 156, 156), e.restore(), !0;
}
const or = "WUBRG";
function O(e) {
  const t = e.canonicalTypeLine ?? e.typeLine ?? "", r = e.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(t), a = e.land ?? /(^|\s)Land(?:\s|$)/i.test(t), s = !/\bPlaneswalker\b/i.test(t) && (e.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(t)), n = e.creature ?? /(^|\s)Creature(?:\s|$)/i.test(t), o = L(e), i = o.length === 0 ? "Colourless" : o.length > 2 ? "Gold" : o.join(""), l = (r || a) && o.length === 0 ? "Artifact" : i, d = a ? "Land" : r ? "Artifact" : o.length > 1 ? "Gold" : i;
  return {
    frame: l,
    boxes: d,
    background: d,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown: a && o.length > 0 ? i : r && o.length > 0 ? o.length > 1 ? "Gold" : i : d,
    pt: d,
    artifact: r,
    land: a,
    legendary: s,
    creature: n,
    className: `rendered-card-profile-${d.toLocaleLowerCase()}`
  };
}
function L(e) {
  if (e.frameColors !== void 0) return A0(e.frameColors);
  const t = A0(e.colors ?? []), r = l0(e);
  return t.length === 0 && r && e.land !== !1 ? [r] : t;
}
function A0(e) {
  return [
    ...new Set(
      e.map((t) => t.toLocaleUpperCase()).filter((t) => or.includes(t))
    )
  ].sort((t, r) => or.indexOf(t) - or.indexOf(r));
}
function xn(e, t) {
  return Ee(e, t) ? "CardRenderer MTG ModMatrix" : void 0;
}
function za(e, t) {
  if (!t.includes("*")) {
    e.fillText(t, 407, 627, 78);
    return;
  }
  e.save();
  const r = e.measureText(t).width;
  e.translate(407, 0), e.scale(Math.min(1, 78 / r), 1), e.textAlign = "left";
  let a = "";
  for (const s of t.split(/(\*)/).filter(Boolean)) {
    const n = -r / 2 + e.measureText(a).width;
    if (s === "*") {
      const o = e.measureText(s), i = n + (o.actualBoundingBoxRight - o.actualBoundingBoxLeft) / 2, l = 627 + (o.actualBoundingBoxDescent - o.actualBoundingBoxAscent) / 2;
      e.save(), e.translate(i, l + 1.25), e.scale(0.775, 0.775), e.translate(-i, -l), e.fillText(s, n, 627), e.restore();
    } else e.fillText(s, n, 627);
    a += s;
  }
  e.restore();
}
function ir(e, t, r, a) {
  if (!Ee(t, r)) return;
  const [s, n, o, i, l, d] = a === "artist" ? [77, 634, -1, 3.25, 0.995, 1] : a === "legal" ? [36.5, 647, 4.5, 4.75, 0.995, 1.1] : [407, 627, 2, -2.25, 1.03, 1.01];
  e.translate(s + o, n + i), e.scale(l * d, l), e.translate(-s, -n);
}
let Ya = null;
function Vo(e, t) {
  const r = xn(e, t);
  return !r || e.power == null || e.toughness == null ? Promise.resolve() : Ya ??= document.fonts.load(`700 29px "${r}"`).then((a) => {
    if (!a.length || a.some((s) => s.status !== "loaded"))
      throw Error("Planar Chaos P/T needs card-glint/magic/fonts.css.");
  }).catch((a) => {
    throw Ya = null, a;
  });
}
function Tn(e) {
  return ["B", "Colourless", "Land"].includes(O(e).boxes);
}
function Dn(e) {
  return e.frameAssetFamily !== "eighth" || !e.artist ? null : `${B}/img/manaSymbols/${Tn(e) ? "whitebrush" : "brush"}.svg`;
}
function qa(e, t) {
  if (!t.includes("*")) {
    e.fillText(t, 407, 627, 78);
    return;
  }
  const r = t.split(/(\*)/).filter(Boolean), a = r.map((o) => o === "*" ? 15 : e.measureText(o).width), s = a.reduce((o, i) => o + i, 0);
  e.save(), e.translate(407, 0), e.scale(Math.min(1, 78 / s), 1), e.textAlign = "left";
  let n = -s / 2;
  for (const [o, i] of r.entries()) {
    if (i === "*") {
      e.beginPath();
      for (let l = 0; l < 10; l++) {
        const d = -Math.PI / 2 + l * Math.PI / 5, c = l % 2 ? 3.1 : 7.5, u = n + 7.5 + c * Math.cos(d), h = 622 + c * Math.sin(d);
        l === 0 ? e.moveTo(u, h) : e.lineTo(u, h);
      }
      e.closePath(), e.fill();
    } else e.fillText(i, n, 627);
    n += a[o];
  }
  e.restore();
}
function Zo(e, t, r, a = "") {
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", t.power != null && t.toughness != null) {
    e.save(), ir(e, t, a, "stats");
    const u = t.frameTreatment === "colorshifted";
    e.fillStyle = u ? "#fff" : "#17140f", u && (e.shadowColor = "#000", e.shadowOffsetX = -21e-4 * 488, e.shadowOffsetY = 15e-4 * 680);
    const h = xn(t, a);
    e.font = `700 29px "${h ?? "CardRenderer MTG Matrix Small Caps"}", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
    const m = `${t.power}/${t.toughness}`;
    if (t.textInk?.stats?.length) {
      const g = h ? void 0 : (f) => f.split(/(\*)/).reduce((b, w) => b + (w === "*" ? 15 : e.measureText(w).width), 0);
      Se(
        e,
        m,
        407,
        0,
        78,
        t.textInk,
        "stats",
        () => {
          h ? za(e, m) : qa(e, m);
        },
        g
      );
    } else h ? za(e, m) : qa(e, m);
    e.restore();
  }
  const s = t.setCode?.toLowerCase(), n = s === "8ed" ? 75 : s === "9ed" ? 79 : 77, o = s === "8ed" || s === "9ed", i = o ? 633 : 634;
  e.fillStyle = Tn(t) ? "#fff" : "#17140f", e.textBaseline = "alphabetic", e.textAlign = "left";
  const l = Dn(t);
  X(e, t, "artist", () => {
    if (l) {
      e.save(), ir(e, t, a, "artist");
      const u = r.get(l);
      if (!u) throw Error(`Eighth Edition artist brush unavailable: ${l}`);
      e.drawImage(u, 36.5, i - 10, n - 39, 13.5), e.font = `700 ${o ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
      const h = t.power != null && t.toughness != null ? 350 : 448;
      e.fillText(t.artist, n, i, h - n), e.restore();
    }
  });
  const d = Xr(t), c = Jr(t, !1);
  if (e.save(), ir(e, t, a, "legal"), e.font = '10px "CardRenderer MTG MPlantin", Georgia', !t.printingElements?.collector?.offset && !t.printingElements?.legal?.offset) {
    const u = [d, c].filter(Boolean).join(" ");
    u && e.fillText(u, 36.5, i + 13, 409);
  } else {
    const u = [d, c].filter(Boolean).join(" "), h = Math.min(1, 409 / Math.max(1, e.measureText(u).width));
    e.translate(36.5, i + 13);
    const m = (g, f) => {
      e.save(), e.scale(h, 1), e.fillText(g, f, 0), e.restore();
    };
    d && X(e, t, "legal", () => m(d, 0)), c && X(
      e,
      t,
      "collector",
      () => m(c, e.measureText(d ? d + " " : "").width)
    );
  }
  e.restore(), e.restore();
}
const Qo = {
  Plains: "W",
  Island: "U",
  Swamp: "B",
  Mountain: "R",
  Forest: "G"
};
function In(e) {
  if (!/\bBasic Land\b/.test(e.typeLine ?? "")) return null;
  const t = e.rulesText ?? "", r = /^\(?\{T\}: Add \{([WUBRG])\}\.\)?$/.exec(t);
  if (!r || t.startsWith("(") !== t.endsWith(")")) return null;
  if (e.rulesParagraphs) {
    const a = e.rulesParagraphs;
    if (a.length !== 1 || a[0].role !== "rules" || a[0].align || a[0].runs.length !== 1 || a[0].runs[0].text !== t || !!a[0].runs[0].italic !== t.startsWith("("))
      return null;
  }
  return r[1];
}
function Kr(e) {
  if (e.wordingMode === "oracle" || !["mir", "tmp"].includes(e.setCode?.toLowerCase() ?? "")) return null;
  const t = /^Basic Land — (Plains|Island|Swamp|Mountain|Forest)$/.exec(
    e.typeLine ?? ""
  )?.[1];
  if (!t) return null;
  const r = Qo[t];
  return In(e) !== r ? null : {
    typeLine: "Land",
    paragraphs: [
      {
        role: "rules",
        align: "center",
        runs: [{ text: `{T}: Add {${r}} to your mana pool.` }]
      }
    ]
  };
}
const ei = {
  lea: {
    W: "conjurer-old",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "modern"
  },
  leb: {
    W: "conjurer-old",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  "2ed": {
    W: "conjurer-old",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  ced: {
    W: "historic-font",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  cei: {
    W: "historic-font",
    U: "conjurer-old",
    B: "conjurer-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  arn: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  atq: {
    W: "historic-font",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  "3ed": {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  leg: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  sum: {
    W: "historic-font",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  drk: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "modern"
  },
  fem: {
    W: "historic-font",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  "4ed": {
    W: "modern",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  ice: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  chr: {
    W: "modern",
    U: "conjurer-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  hml: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  all: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  rqs: {
    W: "modern",
    U: "mse-old",
    B: "mse-old",
    R: "mse-old",
    G: "conjurer-old"
  },
  mir: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  itp: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  vis: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "5ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  por: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  wth: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  tmp: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  sth: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  exo: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  p02: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  usg: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ath: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ulg: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "6ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ptk: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  uds: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  s99: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  mmq: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  brb: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  nem: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  pcy: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  btd: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  inv: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  pls: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "7ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  apc: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ody: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  tor: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  jud: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  ons: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  lgn: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  scg: {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  },
  "8ed": {
    W: "modern",
    U: "modern",
    B: "modern",
    R: "modern",
    G: "modern"
  }
}, ti = {
  "W/conjurer-old": {
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldw.svg",
    discColor: "#f7f4d8",
    inkColor: "#0d0f0f",
    glyphScale: 0.92
  },
  "U/conjurer-old": {
    glyphScale: 0.94,
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldu.svg",
    discColor: "#d2f0f1",
    inkColor: "#000000"
  },
  "B/conjurer-old": {
    glyphScale: 0.94,
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldb.svg",
    discColor: "#869085",
    inkColor: "#000000"
  },
  "R/mse-old": {
    glyphScale: 0.92,
    url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-mana-old.mse-symbol-font/mana_r.png",
    discColor: "#ffcccc",
    inkColor: "#000000"
  },
  "G/conjurer-old": {
    glyphScale: 0.88,
    url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/manaSymbols/old/oldg.svg",
    discColor: "#c2e3b0",
    inkColor: "#000000"
  },
  "B/mse-old": {
    glyphScale: 0.94,
    url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-mana-old.mse-symbol-font/mana_b.png",
    discColor: "#acacac",
    inkColor: "#000000"
  },
  "U/mse-old": {
    url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-mana-old.mse-symbol-font/mana_u.png",
    discColor: "#c6eeff",
    inkColor: "#000000"
  }
}, ri = {
  "leg-black-U": [177 / 255, 230 / 255, 225 / 255],
  "leg-black-R": [228 / 255, 193 / 255, 147 / 255],
  "leg-black-G": [181 / 255, 217 / 255, 148 / 255],
  "lea-black-U": [149 / 255, 185 / 255, 194 / 255],
  "lea-black-B": [92 / 255, 100 / 255, 101 / 255],
  "lea-black-R": [199 / 255, 152 / 255, 136 / 255],
  "lea-black-G": [148 / 255, 175 / 255, 134 / 255],
  "lea-black-N": [122 / 255, 136 / 255, 139 / 255],
  "3ed-white-G": [186 / 255, 206 / 255, 176 / 255],
  "3ed-white-N": [194 / 255, 190 / 255, 184 / 255],
  "8ed-white-U": [176 / 255, 210 / 255, 227 / 255],
  "8ed-white-N": [178 / 255, 177 / 255, 168 / 255],
  "m21-black-W": [251 / 255, 249 / 255, 218 / 255],
  "m21-black-U": [190 / 255, 221 / 255, 249 / 255],
  "m21-black-R": [237 / 255, 165 / 255, 126 / 255],
  "m21-black-G": [167 / 255, 204 / 255, 172 / 255],
  "leb-black-W": [228 / 255, 228 / 255, 209 / 255],
  "leb-black-U": [163 / 255, 201 / 255, 213 / 255],
  "leb-black-B": [113 / 255, 122 / 255, 121 / 255],
  "leb-black-R": [215 / 255, 170 / 255, 152 / 255],
  "leb-black-G": [175 / 255, 199 / 255, 167 / 255],
  "leb-black-N": [156 / 255, 162 / 255, 162 / 255]
}, ai = {
  "leb/R": { family: "mse-old", pixels: 0.4 },
  "drk/B": { family: "mse-old", pixels: 0.2, paperSample: "opaque-percentile" },
  "drk/R": { family: "mse-old", pixels: 0.2, paperSample: "opaque-percentile" }
};
function Vr(e) {
  return ["arn", "atq", "drk"].includes(e.setCode?.toLowerCase() ?? "") && ae(e) && !e.frameTemplate && (e.layout ?? "normal") === "normal" && Ae(e) === "black" && !O(e).legendary && !/^Level up\b/m.test(e.rulesText ?? "") && e.symbolStyle !== "modern" && !(e.symbolStyle === void 0 && e.wordingMode === "oracle");
}
function Zr(e) {
  if (e.setCode?.toLowerCase() !== "arn" || !Vr(e)) return;
  const t = e.collectorNumber ?? "";
  return /^\d+†$/.test(t) ? "light" : /^\d+$/.test(t) ? "dark" : void 0;
}
const si = {
  W: [105, 117, 115],
  U: [53, 97, 116],
  B: [66, 78, 76],
  R: [96, 52, 46],
  G: [57, 92, 84],
  A: [92, 90, 83]
};
function ni(e) {
  if (Zr(e) !== "dark") return;
  const t = L(e), a = O(e).artifact ? "A" : t.length === 1 ? t[0] : "", s = si[a];
  return s ? { fill: e.calibration !== "source" && (e.calibration === "auto" || e.colorCalibration === "set-hsb-v1") ? `rgba(${s.join(",")},0.8)` : "rgba(0,0,0,0.4)" } : void 0;
}
function oi(e, t, r, a, s, n, o) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = n.fill, e.beginPath(), e.arc(r + s / 2 - 0.25, a + s / 2 - 0.5, s / 2 * 0.81, 0, Math.PI * 2), e.fill(), e.font = '100px "CardRenderer MTG MPlantin"', e.textAlign = "left", e.textBaseline = "alphabetic", e.fillStyle = "#111";
  const i = e.measureText(t), l = s * 0.7 * (o.numberScale ?? 1) / (i.actualBoundingBoxAscent + i.actualBoundingBoxDescent);
  e.translate(
    r + s / 2 + (o.numberDx ?? 0),
    a + s / 2 + (o.numberDy ?? 0)
  ), e.scale(l, l), e.fillText(
    t,
    (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) / 2,
    (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function d0(e, t) {
  if (!(e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle"))
    return ei[e.setCode?.toLowerCase() ?? ""]?.[t];
}
function xr(e, t) {
  const r = d0(e, t), a = r && r !== "modern" && r !== "historic-font" ? ti[`${t}/${r}`] : void 0, s = En(e, t);
  return a && s ? { ...a, inkExpansion: s.pixels } : a;
}
function ii(e, t) {
  return En(e, t)?.paperSample;
}
function En(e, t) {
  const r = ai[`${e.setCode?.toLowerCase()}/${t}`];
  if (!(!r || r.family !== d0(e, t)) && !(r.paperSample && !Vr(e)))
    return r;
}
const li = {
  shadow: [-1.0372, 2.0372],
  paper: [202, 197, 192],
  ink: [13, 15, 15]
};
function An(e) {
  return !ae(e) && e.frameAssetFamily === void 0 && e.frameTemplate === void 0 && (e.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/i.test(e.canonicalTypeLine ?? e.typeLine ?? "") && !/^Level up\b/m.test(e.rulesText ?? "");
}
function Bn(e) {
  return An(e) ? li : void 0;
}
function Ln(e, t) {
  return Bn(e) && /^\d$/.test(t) ? `${B}/img/manaSymbols/${t}.svg` : null;
}
function $e(e) {
  const t = [
    e.rulesText ?? "",
    ...(e.rulesParagraphs ?? []).flatMap((a) => a.runs.map((s) => s.text))
  ], r = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...t.flatMap(
      (a) => q0(a).flatMap((s) => s.symbol ? [s.symbol] : [])
    )
  ]);
  return [
    ...(e.manaSymbols ?? []).flatMap((a) => {
      const s = Ln(e, a);
      return s ? [s] : [];
    }),
    ...[...r].map(
      (a) => d0(e, a) === "historic-font" ? null : xr(e, a)?.url ?? It(a)
    )
  ];
}
function c0(e) {
  if (e.frameTemplate || !["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "") || e.frameStyle === "modern" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || !(e.land ?? /\bLand\b/.test(e.typeLine ?? "")) || e.layout && e.layout !== "normal")
    return;
  const t = Gn(e);
  if (t.length !== 2) return;
  const r = ["WU", "WG", "UG", "BG", "RG"].includes(t.join("")) ? [...t].reverse() : t, a = `${K.RETRO_ROOT}/img/frames/old/abu/`;
  return {
    base: `${a}${r[0].toLowerCase()}l.png`,
    overlay: `${a}${r[1].toLowerCase()}l.png`,
    mask: `${K.CONJURER_ROOT}/img/frames/old/abu/dualLand.png`
  };
}
function Gn(e) {
  return e.frameColors ? L(e) : [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([t]) => new RegExp(`\\b${t}\\b`).test(e.typeLine ?? "")).map(([, t]) => t);
}
const Ha = [19.375 / 488, 21.125 / 680, 449.625 / 488, 639.25 / 680], Xa = {
  W: {
    family: "abu",
    stockWindow: Ha,
    frame: [-0.015000000000000013, -0.016735294117647074, 1.03, 1.032],
    art: [0.1092866666666667, 0.09137899159663865, 0.7821133333333333, 0.45408000000000004]
  },
  U: {
    family: "fourth",
    frame: [0.006241180327868882, 0.003875294117647035, 0.989584, 0.995748],
    art: [0.10981763899453553, 0.09159595126050418, 0.7830908053333334, 0.4523540914285714]
  },
  B: {
    family: "abu",
    stockWindow: Ha,
    frame: [-0.015000000000000013, -0.016470588235294133, 1.03, 1.03],
    art: [0.1092866666666667, 0.09143417366946782, 0.7821133333333333, 0.4532]
  },
  R: {
    family: "fourth",
    frame: [0.006241180327868882, 0.004610588235294094, 0.989584, 0.995748],
    art: [0.10915791632786884, 0.09327957680672272, 0.7844102506666666, 0.45140576]
  },
  G: {
    family: "fourth",
    frame: [0.007265770491803308, 0.004855294117647071, 0.989584, 0.993784],
    art: [0.11084222915846996, 0.09192970173669468, 0.78177136, 0.45146187428571427]
  },
  A: {
    family: "fourth",
    frame: [0.006192590163934432, 0.004855294117647071, 0.987636, 0.993784],
    art: [0.11088200616393441, 0.09429585411764707, 0.780890864, 0.44909572190476194]
  },
  L: {
    family: "fourth",
    frame: [0.0052165901639344555, 0.00559058823529413, 0.989584, 0.993784],
    art: [0.10945277149726775, 0.09077207394957981, 0.7844102506666666, 0.4524083352380952]
  },
  M: {
    family: "fourth",
    frame: [0.0037205395409838113, 0.004187595294117773, 0.9910362339999996, 0.9947522519999996],
    art: [0.10810968952231712, 0.09276791487697494, 0.786222078973333, 0.4519017373371427]
  }
};
function we(e) {
  if (e.setCode?.toLowerCase() !== "leg" || e.frameTemplate || e.frameStyle === "modern" || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const t = e.typeLine ?? "", r = L(e), a = e.land ?? /\bLand\b/.test(t) ? "L" : e.artifact ?? /\bArtifact\b/.test(t) ? "A" : r.length > 1 ? "M" : r[0];
  if (!a || !(a in Xa)) return;
  const s = Xa[a];
  return {
    ...s,
    material: a,
    asset: `${K.RETRO_ROOT}/img/frames/old/${s.family}/${a.toLowerCase()}.png`
  };
}
const di = {
  "drk/L": {
    family: "abu",
    frame: [-0.013743852459016406, -0.014323529411764744, 1.028, 1.0235],
    art: [0.10687481420765026, 0.09290028011204479, 0.7840213333333333, 0.45034],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  },
  "drk/M": {
    family: "fourth",
    frame: [0.0037039999999999296, 0.004364999999999952, 0.990558, 0.9932930000000001],
    art: [0.10804277599999994, 0.09281537666666662, 0.78584268, 0.45123882000000004],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  }
}, ci = {
  "drk/L": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.013743852459016406,-0.014323529411764744,1.028,1.0235]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: 15.053712033967122,
        saturationScale: 0.851698443694213,
        brightnessScale: 1.3806569068931471,
        valueGamma: 1.2612117214637717
      },
      paper: {
        hueDegrees: -160.17254199917548,
        saturationScale: 0.0803808310379582,
        brightnessScale: 0.96875002416465
      },
      mask: {
        kind: "rect",
        rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
        feather: 0.0013333333333333333
      },
      accents: [
        {
          mask: {
            rings: [
              {
                outer: [
                  0.09310414939082734,
                  0.0872726227765166,
                  0.8172800918543088,
                  0.472714733181988
                ],
                inner: [
                  0.10705771193468139,
                  0.09876720595419412,
                  0.7893729667666007,
                  0.45116238972384265
                ]
              },
              {
                outer: [
                  0.12300464055622887,
                  0.5959079283887467,
                  0.7574791095235057,
                  0.2945486939279864
                ],
                inner: [
                  0.1409449352554698,
                  0.6088393344636339,
                  0.7215985201250239,
                  0.2701227046754217
                ]
              }
            ],
            hueCenter: 29,
            hueRadius: 25,
            hueFeather: 10,
            saturation: [0.25, 0.48]
          },
          adjustment: {
            hueDegrees: -121.2107567229518,
            saturationScale: 0.38346036585069093,
            brightnessScale: 0.3720930232041745
          }
        },
        {
          mask: {
            rings: [
              {
                outer: [
                  0.049250095681571744,
                  0.04273111296301621,
                  0.9029948331951266,
                  0.9210034771114112
                ],
                inner: [
                  0.06719039038081266,
                  0.05566251903790342,
                  0.8651208777189513,
                  0.889393373372798
                ]
              }
            ],
            hueCenter: 29,
            hueRadius: 25,
            hueFeather: 10,
            saturation: [0.25, 0.48]
          },
          adjustment: {
            hueDegrees: -99.32515598479127,
            saturationScale: 0.29891977136362763,
            brightnessScale: 0.5804827313632643
          }
        }
      ]
    }
  },
  "drk/M": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.0037039999999999296,0.004364999999999952,0.990558,0.9932930000000001]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -11.994683405585683,
        saturationScale: 0.6356207383906354,
        brightnessScale: 0.9313845771881127,
        valueGamma: 1.0329321771462636
      },
      paper: {
        hueDegrees: -24.105642369886258,
        saturationScale: 0.4796630967703456,
        brightnessScale: 0.9324323962458886
      },
      mask: {
        kind: "rect",
        rect: [0.1160164271047228, 0.6008146639511202, 0.7742282963611269, 0.29501617347550013],
        feather: 0.0013333333333333333
      }
    }
  }
}, ui = {
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
  },
  "drk/R": {
    family: "fourth",
    frame: [0.005497032786885287, 0.003936470588235265, 0.9905579999999999, 0.9952570000000001],
    art: [0.10785469278688528, 0.09208780487394955, 0.7865030519999999, 0.45213103714285713],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  }
}, hi = {
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
  },
  "drk/R": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.005497032786885287,0.003936470588235265,0.9905579999999999,0.9952570000000001]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -14.822680479685992,
        saturationScale: 0.713980938724586,
        brightnessScale: 0.912448781306126,
        valueGamma: 1.119045488282831
      },
      paper: {
        hueDegrees: -8.511963070441652,
        saturationScale: 0.6308842757683822,
        brightnessScale: 0.8089285714285716
      },
      mask: {
        kind: "rect",
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333
      }
    }
  }
}, mi = {
  "arn/W": {
    family: "fourth",
    frame: [0.008741918032786858, 0.005528823529411754, 0.987149, 0.991329],
    art: [0.10877301669945352, 0.09191606495798318, 0.7844544053333333, 0.45223484857142854],
    stockWindow: [0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023]
  },
  "arn/U": {
    family: "fourth",
    frame: [0.006729180327868926, 0.005528823529411754, 0.9886099999999999, 0.991329],
    art: [0.10954462032786892, 0.09238812638655462, 0.7836381933333332, 0.4512907257142857],
    stockWindow: [0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023]
  },
  "arn/B": {
    family: "abu",
    frame: [-0.014993852459016379, -0.01515441176470595, 1.0305, 1.0270000000000001],
    art: [0.10866614754098362, 0.09194701680672264, 0.7838669999999999, 0.4528580952380953],
    stockWindow: [0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023]
  },
  "arn/R": {
    family: "fourth",
    frame: [0.00599718032786886, 0.003936470588235265, 0.9900709999999999, 0.9952570000000001],
    art: [0.10830451699453551, 0.09208780487394955, 0.7861163739999999, 0.45213103714285713],
    stockWindow: [0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023]
  },
  "arn/G": {
    family: "abu",
    frame: [-0.018567622950819714, -0.015338235294117604, 1.0315, 1.027],
    art: [0.1072753770491803, 0.09176319327731097, 0.7825646666666667, 0.45285809523809517],
    stockWindow: [0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023]
  },
  "arn/A": {
    family: "fourth",
    frame: [0.00794918032786887, 0.004855000000000054, 0.9861749999999999, 0.9923109999999999],
    art: [0.11182628032786886, 0.093690460952381, 0.7810505999999998, 0.44937512428571424],
    stockWindow: [0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023]
  },
  "arn/L": {
    family: "fourth",
    frame: [0.007461180327868825, 0.006570588235294111, 0.987149, 0.99182],
    art: [0.11078277566120218, 0.09111143585434173, 0.7837963059999999, 0.45245883809523807],
    stockWindow: [0.03883726207645951, 0.03183110554486049, 0.9217417574769129, 0.9359733064602023]
  },
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
    frame: [0.0052287377049180395, 0.0055902941176471125, 0.9900709999999999, 0.9923109999999999],
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
  "drk/W": {
    family: "fourth",
    frame: [0.007241475409836138, 0.005283823529411758, 0.9886099999999999, 0.99182],
    art: [0.10742062207650278, 0.09171385210084033, 0.7856154133333332, 0.45245883809523807],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  },
  "drk/U": {
    family: "fourth",
    frame: [0.005741032786885253, 0.005651470588235287, 0.9900709999999999, 0.99182],
    art: [0.10870841678688525, 0.0925537943977591, 0.7847962793333333, 0.4515142476190476],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  },
  "drk/B": {
    family: "abu",
    frame: [-0.015750000000000042, -0.01547058823529413, 1.0315, 1.028],
    art: [0.10802999999999997, 0.09173512605042017, 0.7846276666666666, 0.4532990476190476],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  },
  "drk/G": {
    family: "abu",
    frame: [-0.021598360655737777, -0.015220588235294158, 1.0350000000000001, 1.0275],
    art: [0.10467163934426224, 0.09193298319327729, 0.78522, 0.45307857142857144],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  },
  "drk/A": {
    family: "fourth",
    frame: [0.006192590163934432, 0.004732647058823482, 0.987636, 0.9932930000000001],
    art: [0.11022358216393444, 0.09365602039215681, 0.7822077119999999, 0.44981983000000003],
    stockWindow: [
      0.038372537365304674,
      0.029927666637637684,
      0.9228063947301375,
      0.9373903798505366
    ]
  },
  ...ui,
  ...di
};
function Pt(e) {
  const t = e.setCode?.toLowerCase();
  if (!t || !["arn", "atq", "drk"].includes(t) || e.frameTemplate || e.frameStyle === "modern" || e.borderColor && e.borderColor !== "black" || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const r = e.typeLine ?? "", a = L(e), s = e.land ?? /\bLand\b/.test(r);
  if (s && (/\b(Basic|Plains|Island|Swamp|Mountain|Forest)\b/.test(r) || t === "arn" && e.name === "Mountain"))
    return;
  const n = s ? "L" : e.artifact ?? /\bArtifact\b/.test(r) ? "A" : a.length === 1 ? a[0] : a.length > 1 ? "M" : void 0, o = n && mi[`${t}/${n}`];
  if (o)
    return {
      ...o,
      material: n,
      asset: `${K.RETRO_ROOT}/img/frames/old/${o.family}/${n.toLowerCase()}.png`
    };
}
function gi(e) {
  if (e.colorCalibration !== "set-hsb-v1" || e.borderColor && e.borderColor !== "black")
    return;
  const t = we(e);
  return t && $n[`leg/black/retro/${t.material.toLowerCase()}.png`]?.source === JSON.stringify([t.asset, t.frame]) ? "#262626" : void 0;
}
const $n = {
  "leg/black/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[-0.015000000000000013,-0.016735294117647074,1.03,1.032]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
        frame: {
          hueDegrees: 31.5,
          saturationScale: 0.7737499999999997,
          brightnessScale: 1.0418750000000003
        },
        paper: {
          hueDegrees: 46.92434210526312,
          saturationScale: 1.3968055555555547,
          brightnessScale: 1.1227453271028038
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/u.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006241180327868882,0.003875294117647035,0.989584,0.995748]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png": {
        frame: {
          hueDegrees: -6,
          saturationScale: 0.6031249999999994,
          brightnessScale: 1.0975000000000001
        },
        paper: {
          hueDegrees: -10.598914565826249,
          saturationScale: 0.9226579520697171,
          brightnessScale: 1.0041322314049586
        },
        mask: {
          kind: "rect",
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.015000000000000013,-0.016470588235294133,1.03,1.03]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 5.6763925729442235,
          saturationScale: 0.8794297625777275,
          brightnessScale: 1.0209205020920502
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
          frameRgb: [0.17647058823529413, 0.22450980392156863, 0.23627450980392156],
          paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
        }
      }
    }
  },
  "leg/black/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.006241180327868882,0.004610588235294094,0.989584,0.995748]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 21.86087449126046,
          saturationScale: 0.9073305928571983,
          brightnessScale: 0.850835322195704
        },
        accents: [
          {
            mask: {
              rings: [
                {
                  outer: [
                    0.08894759288155257,
                    0.07955119284846228,
                    0.8241582023272438,
                    0.47702832443549975
                  ],
                  inner: [
                    0.10344283764610208,
                    0.07955119284846228,
                    0.8096629575626944,
                    0.4652133814154255
                  ]
                }
              ],
              hueCenter: 0,
              hueRadius: 70,
              hueFeather: 10,
              saturation: [0.01, 0.08],
              brightness: [0.65, 0.85]
            },
            adjustment: {
              hueDegrees: 9.95535714285711,
              saturationScale: 0.8848407077066573,
              brightnessScale: 1.003157894736842
            }
          },
          {
            mask: {
              rings: [
                {
                  outer: [
                    0.10344283764610208,
                    0.5964549499767128,
                    0.7889554650419093,
                    0.30128104701189456
                  ],
                  inner: [
                    0.11793808241065161,
                    0.5964549499767128,
                    0.7744602202773598,
                    0.2924198397468389
                  ]
                }
              ],
              hueCenter: 0,
              hueRadius: 70,
              hueFeather: 10,
              saturation: [0.01, 0.08],
              brightness: [0.65, 0.85]
            },
            adjustment: {
              hueDegrees: 33.20021777976331,
              saturationScale: 0.8716772230501736,
              brightnessScale: 0.9551148225469728
            }
          }
        ],
        mask: {
          kind: "rect",
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/g.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.007265770491803308,0.004855294117647071,0.989584,0.993784]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png": {
        frame: {
          hueDegrees: -9.546487090367464,
          saturationScale: 0.9883385744234803,
          brightnessScale: 1.2090680100755669
        },
        paper: {
          hueDegrees: 23.60706205559154,
          saturationScale: 0.9735775550740341,
          brightnessScale: 0.7845303867403315
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.08235432726293468,
            0.5828441356175872,
            0.8394486148045915,
            0.32346951000359414
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.23333333333333334, 0.38921568627450975, 0.28137254901960784],
          paperRgb: [0.7098039215686275, 0.5450980392156862, 0.403921568627451]
        }
      }
    }
  },
  "leg/black/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006192590163934432,0.004855294117647071,0.987636,0.993784]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png": {
        frame: {
          hueDegrees: 24.352415966386616,
          saturationScale: 1.09714025198939,
          brightnessScale: 1.158811475409836
        },
        paper: {
          hueDegrees: 18.140759005145696,
          saturationScale: 0.8517161410018563,
          brightnessScale: 1.0706188596859518
        },
        mask: {
          kind: "rect",
          rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leg/black/retro/l.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.0052165901639344555,0.00559058823529413,0.989584,0.993784]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [1.21125, 1.2400000000000002, 0.98875]
        },
        paper: {
          hueDegrees: 14.93891019140574,
          saturationScale: 0.9333152173913042,
          brightnessScale: 1
        },
        mask: {
          kind: "rect",
          rect: [0.1265358333052816, 0.6083023840900922, 0.7510856027198977, 0.2770456451419673],
          feather: 0.0013333333333333333
        },
        accents: [
          {
            mask: {
              rings: [
                {
                  outer: [0.08266666666666667, 0.0719047619047619, 0.838, 0.4866666666666667],
                  inner: [
                    0.09333333333333334,
                    0.07952380952380952,
                    0.8166666666666667,
                    0.4714285714285714
                  ]
                }
              ],
              hueCenter: 55,
              hueRadius: 35,
              hueFeather: 10,
              saturation: [0.35, 0.7]
            },
            adjustment: {
              hueDegrees: 5.553601139457442,
              saturationScale: 0.5666761230892462,
              brightnessScale: 0.9833239619377162
            }
          },
          {
            mask: {
              rings: [
                {
                  outer: [0.112, 0.5957142857142858, 0.7826666666666666, 0.30047619047619045],
                  inner: [0.12533333333333332, 0.61, 0.7533333333333333, 0.27714285714285714]
                }
              ],
              hueCenter: 55,
              hueRadius: 35,
              hueFeather: 10,
              saturation: [0.35, 0.7]
            },
            adjustment: {
              hueDegrees: 6.712541190153161,
              saturationScale: 0.682745288248337,
              brightnessScale: 0.7639751552795031
            }
          }
        ]
      }
    }
  },
  "leg/black/retro/m.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.0037205395409838113,0.004187595294117773,0.9910362339999996,0.9947522519999996]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 1.9433497536946334,
          saturationScale: 0.9884598707032473,
          brightnessScale: 1.0119047619047619
        },
        mask: {
          kind: "rect",
          rect: [0.1160164271047228, 0.6008146639511202, 0.7742282963611269, 0.29501617347550013],
          feather: 0.0013333333333333333
        }
      }
    }
  }
};
function me(e) {
  return e.setCode?.toLowerCase() === "3ed" && !e.frameTemplate && e.frameStyle !== "modern" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") && (!e.layout || e.layout === "normal") && (e.land ?? /\bLand\b/.test(e.typeLine ?? ""));
}
const e0 = `${K.RETRO_ROOT}/img/frames/old/fourth/l.png`, fi = [2.404 / 488, 9.9 / 680, 0.984, 0.99], pi = [
  (2.404 + 0.10533333333333333 * 488 * 0.984) / 488,
  (9.9 + 0.08571428571428572 * 680 * 0.99) / 680,
  0.7926666666666666 * 0.984,
  0.4552380952380952 * 0.99
];
function On(e) {
  const t = e.frameColors ?? [
    ["Plains", "W"],
    ["Island", "U"],
    ["Swamp", "B"],
    ["Mountain", "R"],
    ["Forest", "G"]
  ].filter(([r]) => new RegExp(`\\b${r}\\b`).test(e.typeLine ?? "")).map(([, r]) => r);
  return [...new Set(t)].filter((r) => "WUBRG".includes(r)).sort((r, a) => "RBWUG".indexOf(r) - "RBWUG".indexOf(a));
}
const Pn = {
  W: {
    x: [1.009125, 0.15625],
    y: [1.008625, 3.8125],
    aperture: [0.10133333333333333, 0.08714285714285715, 0.7946666666666666, 0.4561904761904762]
  },
  U: {
    x: [1.01075, -0.421875],
    y: [1.009125, 4.1875],
    aperture: [0.104, 0.08761904761904762, 0.7926666666666666, 0.4552380952380952]
  },
  B: {
    x: [1.012375, -0.265625],
    y: [1.010375, 6.65625],
    aperture: [0.10533333333333333, 0.08523809523809524, 0.7913333333333333, 0.45476190476190476]
  },
  R: {
    x: [1.010625, 0.46875],
    y: [1.010625, 4.75],
    aperture: [0.10333333333333333, 0.08857142857142856, 0.794, 0.4542857142857143]
  },
  G: {
    x: [1.01025, -0.578125],
    y: [1.00775, 4.671875],
    aperture: [0.104, 0.08714285714285715, 0.7913333333333333, 0.4552380952380952]
  },
  A: {
    x: [1.0095, 0.65625],
    y: [1.0095, 4.75],
    aperture: [0.10533333333333333, 0.08952380952380952, 0.792, 0.45285714285714285]
  }
};
function Qr(e) {
  if (e.setCode?.toLowerCase() !== "3ed" || e.frameTemplate || e.frameStyle === "modern" || e.borderColor && e.borderColor !== "white" || me(e) || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return null;
  if (/\bArtifact\b/.test(e.typeLine ?? "")) return "A";
  const t = L(e);
  if (t.length !== 1) return null;
  const r = t[0];
  return r === "W" || r === "U" || r === "B" || r === "R" || r === "G" ? r : null;
}
function Wn(e) {
  const t = Qr(e);
  if (!t) return null;
  const {
    x: [r, a],
    y: [s, n]
  } = Pn[t];
  return [
    (244 + (0.012 * 488 - 244) * r + a) / 488,
    (340 + (0.01 * 680 - 340) * s + n) / 680,
    0.974 * r,
    0.982 * s
  ];
}
function bi(e) {
  const t = Qr(e), r = Wn(e);
  if (!t || !r) return null;
  const [a, s, n, o] = Pn[t].aperture;
  return [r[0] + a * r[2], r[1] + s * r[3], n * r[2], o * r[3]];
}
function Fn(e) {
  return Qr(e) !== null;
}
const Si = K.RETRO_SYMBOL_FONT, Et = K.RETRO_ROOT, wi = `${Et}/fonts/goudy-medieval.ttf`, yi = new Set(
  "lea leb 2ed 3ed 4ed 5ed 6ed 7ed arn atq leg drk fem ice hml all mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg chr tsb".split(
    " "
  )
), ki = new Set("2ed 3ed 4ed 5ed 6ed 7ed chr".split(" "));
function ae(e) {
  return e.frameTemplate || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") ? !1 : e.frameStyle === "retro" || e.frameStyle !== "modern" && yi.has(e.setCode?.toLowerCase() ?? "");
}
function ea(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function Te(e) {
  const t = e.setCode?.toLowerCase() ?? "", r = Pt(e);
  if (r) return r.family;
  const a = we(e);
  return a ? a.family : ea(e) ? "abu" : t === "leg" && L(e).length > 1 ? "legends" : me(e) || ["3ed", "4ed", "5ed", "atq"].includes(t) && !(e.land ?? /\bLand\b/.test(e.typeLine ?? "")) ? "fourth" : "seventh";
}
function X0(e) {
  const t = Pt(e);
  if (t) return t.frame;
  const r = we(e);
  if (r) return r.frame;
  if (me(e)) return fi;
  const a = Wn(e);
  return a || (Te(e) === "fourth" ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1]);
}
function ta(e) {
  const t = ea(e), r = we(e) && (!e.borderColor || e.borderColor === "black");
  return {
    ...J,
    frame: X0(e),
    title: [t ? 0.07 : 0.1134, 0.0481, t ? 0.8467 : 0.8, 0.043],
    art: Pt(e)?.art ?? we(e)?.art ?? bi(e) ?? (me(e) ? pi : Te(e) === "legends" ? [0.112, 0.094, 0.78, 0.45] : Te(e) === "fourth" ? [0.109, 0.093, 0.779, 0.453] : t ? [0.116, 0.1043, 0.7654, 0.441] : [0.12, 0.0991, 0.7667, 0.4429]),
    type: [0.1074, 0.5486, 0.7852, 0.0543],
    rules: [0.128, 0.6067, 0.744, 0.2724],
    stats: r ? [384 / j, 617 / T, 72 / j, 30 / T] : [0.8074, 0.895, 0.1367, 0.043],
    footer: r ? [48 / j, 624 / T, 340 / j, 24 / T] : [0.1, 0.9, 0.68, 0.04],
    stamp: [0.34, 0.628, 0.32, 0.23]
  };
}
function He(e) {
  const t = Pt(e);
  if (t) return t.asset;
  const r = we(e);
  if (r) return r.asset;
  if (me(e)) return e0;
  const a = c0(e);
  if (a) return a.base;
  const s = L(e), n = e.typeLine ?? "", o = [
    ["Plains", "w"],
    ["Island", "u"],
    ["Swamp", "b"],
    ["Mountain", "r"],
    ["Forest", "g"]
  ].filter(([u]) => n.includes(u)), i = e.frameColors?.map((u) => u.toLowerCase()) ?? o.map(([, u]) => u), l = e.land ?? /\bLand\b/.test(n) ? i.length === 1 ? i[0] + "l" : "l" : e.artifact ?? /\bArtifact\b/.test(n) ? "a" : s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c", d = Te(e), c = d === "seventh" || l === "c" || d === "abu" && l === "m" ? "seventh/regular" : `old/${d}`;
  return `${Et}/img/frames/${c}/${d === "legends" ? "legendsFrameM" : l}.png`;
}
function Ae(e) {
  return e.borderColor ?? (ki.has(e.setCode?.toLowerCase() ?? "") ? "white" : "black");
}
function vi(e) {
  return Ae(e) === "silver" ? Ie(null, "silver").border : Ae(e) === "white" ? Ci : gi(e) ?? "#080808";
}
function ra(e) {
  return Te(e) === "fourth" ? `${Et}/img/frames/old/fourth/borderBlack.png` : `${Et}/img/frames/${Te(e) === "abu" ? "old/abu" : "seventh/regular"}/border.svg`;
}
function Ja(e) {
  return ea(e) ? "#ababab" : "#f2eee3";
}
function ji(e) {
  return e.setCode?.toLowerCase() === "7ed" && L(e).some((t) => t === "W" || t === "G") && !(e.land ?? /\bLand\b/.test(e.typeLine ?? "")) ? "saturate(.7) brightness(.88)" : "none";
}
function aa(e) {
  if (Kr(e)) return null;
  const t = In(e);
  return t ? `${Et}/img/frames/m15/basics/${t.toLowerCase()}.png` : null;
}
const Ci = "#eeedeb";
function Un(e) {
  if (e.printingElements?.setSymbol?.hidden) return null;
  const t = e.setCode?.toLowerCase() ?? "";
  return !e.setSymbol && t === "ice" && e.setSymbolSource === "keyrune" ? `${K.KEYRUNE_ROOT}/ice2.svg` : !e.setSymbol && Po(t, e.name) ? null : V(e);
}
function O4(e) {
  const t = (e.rulesText ?? "").length;
  return t > 340 ? 16 : t > 210 ? 19 : 23;
}
function Ri(e) {
  const t = c0(e);
  return [
    aa(e),
    He(e),
    t?.overlay,
    t?.mask,
    !me(e) && !Fn(e) && (Ae(e) !== "black" || Te(e) === "fourth" || a0(e)) ? ra(e) : null,
    e.illustration,
    Un(e),
    ...$e(e)
  ];
}
const Re = ([e, t, r, a]) => [
  e * j,
  t * T,
  r * j,
  a * T
];
function P4(e, t) {
  return ["7ed", "8ed", "9ed"].includes(e?.toLowerCase() ?? "") && ["foil", "prismatic", "etched", "cold", "opal"].includes(t ?? "") ? "black" : void 0;
}
function sa(e, t) {
  const r = l0(e)?.toLowerCase();
  return e.setCode?.toLowerCase() === "8ed" && e.frameAssetFamily === "eighth" && !e.frameTemplate && (!e.layout || e.layout === "normal") && (!e.borderColor || e.borderColor === "white") && (e.frameColors === void 0 || e.frameColors.length === 1 && e.frameColors[0]?.toLowerCase() === r) && !!r && t === `${B}/img/frames/8th/${r}l.png`;
}
const Tr = (e) => 244 + (e - 244) * 1.004 - 1.25, Dr = (e) => 340 + (e - 340) * 1.005 - 0.5;
function Mi([e, t, r, a]) {
  return [Tr(e * 488) / 488, Dr(t * 680) / 680, r * 1.004, a * 1.005];
}
function xi(e, t) {
  e.save(), e.beginPath(), e.rect(0, 0, 488, 680), e.rect(22, 22, 444, 636), e.clip("evenodd"), e.drawImage(t, 0, 0, 488, 680), e.restore();
  const r = [22, 28, 460, 466], a = [22, 28, 624, 658], s = [22, Tr(28), Tr(460), 466], n = [22, Dr(28), Dr(624), 658];
  for (let o = 0; o < a.length - 1; o++)
    for (let i = 0; i < r.length - 1; i++) {
      const l = r[i], d = a[o], c = s[i], u = n[o];
      e.drawImage(
        t,
        l / 488 * t.width,
        d / 680 * t.height,
        (r[i + 1] - l) / 488 * t.width,
        (a[o + 1] - d) / 680 * t.height,
        c,
        u,
        s[i + 1] - c,
        n[o + 1] - u
      );
    }
}
const Ir = {
  w: {
    knots: [
      [0, [0, 0, 0]],
      [12, [0, 0, 0]],
      [32, [6.182, 2.078, 0.038]],
      [64, [10.55, 4.709, 0.394]],
      [96, [10.127, 8.149, 1.096]],
      [144, [5.738, 10.743, -0.342]],
      [192, [-2.815, 2.441, -6.136]],
      [224, [-30.89, -20.679, -19.871]],
      [255, [0, 0, 0]]
    ],
    bevel: {
      amount: 0.461,
      backdrop: [187.48, 173.69, 141.36]
    }
  },
  u: {
    knots: [
      [0, [0, 0, 0]],
      [12, [0, 0, 0]],
      [32, [1.348, 3.445, 15.714]],
      [64, [0.86, 5.817, 26.489]],
      [96, [-3.585, 5.085, 24.238]],
      [144, [-9.056, 2.729, 16.683]],
      [192, [-11.185, 0.527, 11.077]],
      [224, [-7.967, -6.873, 5.173]],
      [255, [0, 0, 0]]
    ],
    bevel: {
      amount: 0.948,
      backdrop: [133.71, 169.72, 207.83]
    }
  },
  b: {
    knots: [
      [0, [0, 0, 0]],
      [12, [0, 0, 0]],
      [24, [-3.259, -2.267, -5.909]],
      [40, [8.13, 17.832, 9.257]],
      [64, [-14.985, -4.116, -10.65]],
      [96, [-32.142, -27.216, -30.387]],
      [144, [-17.679, -19.615, -20.463]],
      [192, [-2.331, -8.79, -8.678]],
      [224, [3.963, -2.587, -2.344]],
      [255, [0, 0, 0]]
    ],
    bevel: {
      amount: 0.737,
      backdrop: [23.03, 30.4, 33.46]
    }
  },
  r: {
    knots: [],
    bevel: {
      amount: 0.192,
      backdrop: [134.83, 60.81, 41.86]
    }
  },
  g: {
    knots: [],
    bevel: {
      amount: 0.431,
      backdrop: [80.64, 99.97, 65.14]
    }
  }
}, Ti = {
  w: [22 / 255, 24 / 255, 18 / 255],
  u: [21 / 255, 25 / 255, 31 / 255],
  b: [3 / 255, 7 / 255, 14 / 255],
  r: [31 / 255, 25 / 255, 24 / 255],
  g: [16 / 255, 18 / 255, 21 / 255]
};
function Wt(e, t) {
  return e.colorCalibration === "set-hsb-v1" && e.frameTreatment === "colorshifted" && t.includes("/colorshifted/") && Ee(e, t) ? "#181510" : void 0;
}
function Di(e, t) {
  if (!Wt(e, t)) return;
  const r = t.split("/").at(-1)?.replace(".png", ""), a = r && Ti[r];
  return a ? {
    lift: a,
    transition: 96 / 255,
    ...Ir[r].knots.length ? {
      textureMaskSource: `${B}/img/frames/8th/frame.png`,
      texture: Ir[r].knots.map(
        ([s, n]) => [s / 255, [n[0] / 255, n[1] / 255, n[2] / 255]]
      )
    } : {}
  } : void 0;
}
function Er(e, t) {
  if (!Wt(e, t)) return;
  const r = t.split("/").at(-1)?.replace(".png", ""), a = r && Ir[r];
  return a ? {
    maskSource: `${B}/img/frames/8th/pinline.png`,
    outerMaskSource: `${B}/img/frames/8th/frame.png`,
    outset: 7 / 488,
    backdrop: [
      a.bevel.backdrop[0] / 255,
      a.bevel.backdrop[1] / 255,
      a.bevel.backdrop[2] / 255
    ],
    amount: a.bevel.amount
  } : void 0;
}
function ke(e) {
  const t = e.frameTreatment === "colorshifted";
  if (t && e.frameAssetFamily !== "eighth")
    throw Error("Colorshifted treatment requires the eighth frame family.");
  if (!e.frameAssetFamily || ["split", "aftermath"].includes(e.layout ?? "") && e.faces?.length === 2) return null;
  if (ae(e) || e.layout && !["normal", "token"].includes(e.layout) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    throw Error("Replacement frame plates currently support ordinary modern faces only.");
  const r = e.frameAssetFamily === "eighth", a = O(e), s = l0(e), n = e.frameColors === void 0 && s ? [s] : L(e), o = n.length === 2 && "WUBRG".indexOf(n[1]) - "WUBRG".indexOf(n[0]) > 2 ? [...n].reverse() : n, i = r ? "8th" : "m15/new", l = `${B}/img/frames/${i}${t ? "/colorshifted" : ""}`, d = a.land ? "l" : a.artifact ? "a" : /\bVehicle\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") ? "v" : n.length > 1 ? "m" : n[0]?.toLowerCase() ?? "c";
  if (t && !["w", "u", "b", "r", "g", "a"].includes(d))
    throw Error("Colorshifted plates support monocolored spells and artifacts only.");
  const c = (k) => r ? `${k.toLowerCase()}l` : `l${k.toLowerCase()}`, u = a.land && o.length ? c(o.length > 2 ? "m" : o[0]) : d, h = a.land && o.length === 2 ? c(o[1]) : void 0, m = d === "l" ? r ? "l" : "c" : d, g = r ? [0.09, 0.0629, 0.824, 0.0429] : [168 / 2010, 145 / 2814, 0.8292, 0.0543], f = r ? [205 / 2010, 1611 / 2814, 1601 / 2010, 0.0358] : [168 / 2010, 1588 / 2814, 0.8292, 0.0543], b = t ? [0.7234, 0.881, 0.204, 0.0772] : r ? [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814] : [0.7573, 0.8848, 0.188, 0.0733], w = `${l}/${u}.png`, p = sa(e, w), S = Ee(e, w), y = (k) => p ? Mi(k) : S ? nr(k) : k;
  return {
    frame: w,
    rightFrame: h ? `${l}/${h}.png` : void 0,
    pinlines: S && !t && d === "m" && n.length === 2 ? {
      left: `${l}/${o[0].toLowerCase()}.png`,
      right: `${l}/${o[1].toLowerCase()}.png`,
      mask: `${l}/pinline.png`
    } : void 0,
    border: `${B}/img/frames/${i}/border.png`,
    pt: t ? `${B}/img/frames/m15/colorshifted/${m}pt.png` : r ? `${B}/img/frames/8th/pt/${m === "c" ? "l" : m}.png` : `${B}/img/frames/m15/regular/m15PT${m.toUpperCase()}.png`,
    rects: {
      ...J,
      frame: [0, 0, 1, 1],
      background: [0, 0, 1, 1],
      title: S ? nr(g) : g,
      type: S ? nr(f) : f,
      art: r ? y([180 / 2010, 341 / 2814, 1656 / 2010, 1216 / 2814]) : [0.0767, 0.1129, 0.8476, 0.4429],
      rules: r ? y([205 / 2010, 1779 / 2814, 1596 / 2010, 729 / 2814]) : [0.086, 1780 / 2814, 0.828, 0.2875],
      stats: S ? Xo(b, t) : b,
      footer: r ? [150 / 2010, 1938 / 2100, 0.81, 0.04] : J.footer
    },
    titleSize: r ? 29.2 : 26,
    typeSize: r ? 24.3 : 22,
    // Shared family adjustments measured after frame-only scan normalization.
    // Cost discs have their own baseline; they do not follow font centering.
    mana: {
      right: (r ? 0.9147 : 1864 / 2010) - (r ? 2 : 1) / 488,
      center: g[1] + g[3] / 2 + (r ? 1 : -4) / 680,
      size: r ? 22 : 23.4,
      gap: 1.5
    },
    symbol: r ? { right: 0.9079 - 2 / 488, center: 0.5886, width: 0.114, height: 0.0391 * 0.95 } : { right: 1862 / 2010 - 2 / 488, center: 0.591, width: 0.114, height: 0.041 * 0.95 }
  };
}
function Ii(e) {
  const t = ke(e);
  if (!t) return null;
  const r = Dn(e), a = H0(e), s = Er(e, t.frame);
  return [
    ...a ? [a] : [],
    ...s ? [s.maskSource, s.outerMaskSource] : [],
    ...r ? [r] : [],
    t.frame,
    ...t.rightFrame ? [t.rightFrame] : [],
    ...t.pinlines ? Object.values(t.pinlines) : [],
    ...e.power != null && e.toughness != null ? [t.pt] : [],
    ...Ie(e.setCode, e.borderColor).border !== "#090806" || e.frameAssetFamily === "m15-accurate" && e.calibration !== void 0 && e.calibration !== "source" && e.calibration !== "printing" || Wt(e, t.frame) || a0(e) ? [t.border] : []
  ];
}
const Ei = "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets", Ka = {
  "blb/black": 1,
  "blc/black": 1,
  "dft/black": 1,
  "drc/black": 1,
  "dsk/black": 1,
  "ecc/black": 1,
  "eoe/black": 1,
  "fdn/black": 1.5,
  "frc/black": 1.5,
  "hoc/black": 1,
  "iko/black": 0.5,
  "inr/black": 1,
  "j25/black": 1,
  "snc/black": 1,
  "soc/black": 1,
  "tla/black": 1,
  "tmt/black": 1
}, s0 = {
  artInset: 3,
  artRim: 0.75,
  frameInset: 1.5,
  typeWidthScale: 1.02
};
function na(e) {
  if (!e.frameAssetFamily && !O(e).legendary && (e.layout ?? "normal") === "normal" && Dt === Ei) {
    const t = e.borderColor ?? (Ie(e.setCode).border === "#eeedeb" ? "white" : "black"), r = `${e.setCode?.toLowerCase() ?? ""}/${t}`;
    if (Object.hasOwn(Ka, r)) return Ka[r];
  }
  return ["m15", "m19", "m20", "war"].includes(e.setCode?.toLowerCase() ?? "") ? s0.frameInset : 0;
}
function Ai(e) {
  const t = na(e), r = J.frame[0] * j, a = J.frame[2] * j, s = J.art[0] * j + s0.artInset, n = r + t + (s - r) * (1 - 2 * t / a), o = s0.artRim;
  return [
    n / j,
    J.art[1] + o / T,
    1 - 2 * n / j,
    J.art[3] - 2 * o / T
  ];
}
function oa(e) {
  const t = e.setCode?.toLowerCase();
  if (!t || !["lea", "leb", "3ed", "leg", "8ed", "m21"].includes(t) || e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const r = Ae(e);
  if (ae(e)) {
    if (c0(e) || me(e)) return;
    const o = He(e), i = X0(e);
    return {
      key: `${t}/${r}/retro/${o.split("/").at(-1)}`,
      family: "retro",
      frame: o,
      rect: i,
      assets: { frame: o },
      source: JSON.stringify([o, i])
    };
  }
  const a = ke(e);
  if (a)
    return a.rightFrame ? void 0 : {
      key: `${t}/${r}/${e.frameAssetFamily}/${a.frame.split("/").at(-1)}`,
      family: "plate",
      frame: a.frame,
      rect: a.rects.frame,
      assets: { frame: a.frame, pt: a.pt },
      source: JSON.stringify([a.frame, a.rects])
    };
  const s = O(e);
  if (s.land) return;
  const n = gt(s);
  return {
    key: `${t}/${r}/components/${s.boxes}/${s.frame}`,
    family: "components",
    frame: n.frame,
    rect: J.frame,
    assets: n,
    source: JSON.stringify([n, J.frame, na(e)])
  };
}
const Bi = {
  "lea/black/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 6.19600667693885,
          saturationScale: 0.7922304208065458,
          brightnessScale: 1.0507246376811594
        },
        mask: {
          kind: "rect",
          rect: [0.125, 0.5985294117647059, 0.7540983606557377, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
        frame: {
          hueDegrees: 13.713669950738904,
          saturationScale: 0.35,
          brightnessScale: 0.9468014705882352
        },
        paper: {
          hueDegrees: -5.9959677419354875,
          saturationScale: 0.8356642416225748,
          brightnessScale: 0.8472803347280334
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
          frameRgb: [0.17647058823529413, 0.2196078431372549, 0.23333333333333334],
          paperRgb: [0.9372549019607843, 0.8, 0.5941176470588235]
        }
      }
    }
  },
  "lea/black/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
        frame: {
          hueDegrees: -1.9455801551389413,
          saturationScale: 0.7314003493819718,
          brightnessScale: 0.9157372986369269
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.5369823232323239,
          brightnessScale: 0.9283274647887324
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/u.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: -4.361205868715615,
          saturationScale: 0.8628778854690737,
          brightnessScale: 0.9083333333333334
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png": {
        frame: {
          hueDegrees: -7.274193548387075,
          saturationScale: 0.35562499999999997,
          brightnessScale: 0.9191176470588236
        },
        paper: {
          hueDegrees: 19.625509683995915,
          saturationScale: 0.5469330921588732,
          brightnessScale: 0.953902027027027
        },
        mask: {
          kind: "rect",
          rect: [0.1290983606557377, 0.6014705882352941, 0.7459016393442623, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "lea/black/retro/g.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png": {
        frame: {
          hueDegrees: 5.3103223868643,
          saturationScale: 1.0757874102425145,
          brightnessScale: 0.9585714285714285
        },
        paper: {
          hueDegrees: 13.446120689655118,
          saturationScale: 0.7340938995215308,
          brightnessScale: 0.9952380952380953
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
          frameRgb: [0.23529411764705882, 0.3431372549019608, 0.28823529411764703],
          paperRgb: [0.4117647058823529, 0.2784313725490196, 0.2549019607843137]
        }
      }
    }
  },
  "leb/black/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: -4.7686688311688386,
          saturationScale: 0.8968524740378744,
          brightnessScale: 0.8561715481171549
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
          frameRgb: [0.17647058823529413, 0.2196078431372549, 0.23333333333333334],
          paperRgb: [0.9372549019607843, 0.8, 0.5941176470588235]
        }
      }
    }
  },
  "leb/black/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png": {
        frame: {
          hueDegrees: 3.454973118279554,
          saturationScale: 0.7697448531690021,
          brightnessScale: 1.1482843137254901
        },
        paper: {
          hueDegrees: 10.923435302390999,
          saturationScale: 0.6795040998710152,
          brightnessScale: 1.0864864864864865
        },
        mask: {
          kind: "rect",
          rect: [0.1290983606557377, 0.6014705882352941, 0.7459016393442623, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leb/black/retro/u.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: -3.8366935483870748,
          saturationScale: 0.8704517231244031,
          brightnessScale: 0.9755555555555556
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leb/black/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
        frame: {
          hueDegrees: 5.7318354170936345,
          saturationScale: 0.9083203924844794,
          brightnessScale: 0.9535315985130112
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.37687499999999974,
          brightnessScale: 0.9554753521126761
        },
        mask: {
          kind: "rect",
          rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "leb/black/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",[0,0,1,1]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png": {
        frame: {
          hueDegrees: 1.0502281478526356,
          saturationScale: 0.9263662460655555,
          brightnessScale: 1.033678756476684
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        mask: {
          kind: "rect",
          rect: [0.125, 0.5985294117647059, 0.7540983606557377, 0.2852941176470588],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "3ed/white/retro/g.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.005813317622950737,0.01307290441176476,0.9839835000000001,0.9896105]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png": {
        frame: {
          hueDegrees: 5.471739130434798,
          saturationScale: 0.5185480300467616,
          brightnessScale: 1.0258215962441315
        },
        paper: {
          hueDegrees: 4.58143939393949,
          saturationScale: 0.6677094989990247,
          brightnessScale: 0.6988950276243093
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.08235432726293468,
            0.5828441356175872,
            0.8394486148045915,
            0.32346951000359414
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.2372549019607843, 0.4176470588235294, 0.307843137254902],
          paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
        }
      }
    }
  },
  "3ed/white/retro/b.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",[0.00541668647540981,0.014704852941176478,0.98605325,0.99218825]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png": {
        frame: {
          hueDegrees: 11.54464285714289,
          saturationScale: 0.47346938775510233,
          brightnessScale: 1.0560344827586208
        },
        paper: {
          hueDegrees: 7.102125850340144,
          saturationScale: 0.6318309135734831,
          brightnessScale: 0.9048582995951417
        },
        mask: {
          kind: "chroma",
          bounds: [
            0.08235432726293468,
            0.5828441356175872,
            0.8394486148045915,
            0.32346951000359414
          ],
          seed: [0.5010266940451745, 0.7385887145082066],
          frameRgb: [0.18823529411764706, 0.23137254901960785, 0.19509803921568628],
          paperRgb: [0.9686274509803922, 0.7450980392156863, 0.5843137254901961]
        }
      }
    }
  },
  "3ed/white/retro/r.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.007775553278688446,0.011779044117647054,0.9843487500000001,0.9924337500000001]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png": {
        frame: {
          hueDegrees: -8.208153724492945,
          saturationScale: 0.7128092625825923,
          brightnessScale: 0.8324873096446699
        },
        paper: {
          hueDegrees: -0.25087535014006335,
          saturationScale: 0.6409551457194901,
          brightnessScale: 0.7698317307692307
        },
        mask: {
          kind: "rect",
          rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "3ed/white/retro/w.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007867184426229475,0.011380367647058751,0.9828877500000001,0.99046975]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png": {
        frame: {
          hueDegrees: 2.2140372724149984,
          saturationScale: 0.7157374226207257,
          brightnessScale: 1.1161684782608696
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.7983487654320984,
          brightnessScale: 0.9515418502202644
        },
        mask: {
          kind: "rect",
          rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "3ed/white/retro/a.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.008708774590163905,0.012330294117647026,0.983253,0.991329]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png": {
        frame: {
          hueDegrees: 1.5746966632962085,
          saturationScale: 0.5767416007905141,
          brightnessScale: 1.08641975308642
        },
        paper: {
          hueDegrees: 7.025452488687733,
          saturationScale: 0.6375122549019618,
          brightnessScale: 0.9896907216494846
        },
        mask: {
          kind: "rect",
          rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "8ed/white/eighth/w.png": {
    source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
    materials: {
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.8462234042553245,
          brightnessScale: 0.9432056451612905
        },
        mask: {
          kind: "rect",
          rect: [0.082, 0.627, 0.838, 0.29],
          feather: 9950248756218905e-19
        }
      },
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/w.png": {
        hueDegrees: 0,
        saturationScale: 0.8462234042553245,
        brightnessScale: 0.9432056451612905
      }
    }
  },
  "8ed/white/eighth/g.png": {
    source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
    materials: {
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.6045238095238094,
          brightnessScale: 0.9720380434782608
        },
        mask: {
          kind: "rect",
          rect: [0.082, 0.627, 0.838, 0.29],
          feather: 9950248756218905e-19
        }
      },
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/g.png": {
        hueDegrees: 0,
        saturationScale: 0.6045238095238094,
        brightnessScale: 0.9720380434782608
      }
    }
  },
  "8ed/white/eighth/u.png": {
    source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
    materials: {
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1.275610047846888,
          brightnessScale: 0.944808091286307
        },
        mask: {
          kind: "rect",
          rect: [0.082, 0.627, 0.838, 0.29],
          feather: 9950248756218905e-19
        }
      },
      "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/u.png": {
        hueDegrees: 0,
        saturationScale: 1.275610047846888,
        brightnessScale: 0.944808091286307
      }
    }
  },
  "m21/black/components/U/U": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp": {
        frame: {
          hueDegrees: 17.337752059074205,
          saturationScale: 0.7776986444212719,
          brightnessScale: 0.9675141242937855
        },
        paper: {
          hueDegrees: 8.888888888888914,
          saturationScale: 0.6314814814814816,
          brightnessScale: 0.967741935483871
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp": {
        hueDegrees: 8.888888888888914,
        saturationScale: 0.6314814814814816,
        brightnessScale: 0.967741935483871
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp": {
        hueDegrees: 17.337752059074205,
        saturationScale: 0.7776986444212719,
        brightnessScale: 0.9675141242937855
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp": {
        hueDegrees: 8.888888888888914,
        saturationScale: 0.6314814814814816,
        brightnessScale: 0.967741935483871
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp": {
        hueDegrees: 17.337752059074205,
        saturationScale: 0.7776986444212719,
        brightnessScale: 0.9675141242937855
      }
    }
  },
  "m21/black/components/G/G": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 0.35,
          brightnessScale: 0.9580706521739131
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp": {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9580706521739131
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp": {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9580706521739131
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      }
    }
  },
  "m21/black/components/R/R": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp": {
        frame: {
          hueDegrees: 10.298505477140054,
          saturationScale: 0.9250450145969191,
          brightnessScale: 0.8881656804733729
        },
        paper: {
          hueDegrees: -4.114932885906114,
          saturationScale: 0.6159725971922244,
          brightnessScale: 0.9448979591836735
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp": {
        hueDegrees: -4.114932885906114,
        saturationScale: 0.6159725971922244,
        brightnessScale: 0.9448979591836735
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp": {
        hueDegrees: 10.298505477140054,
        saturationScale: 0.9250450145969191,
        brightnessScale: 0.8881656804733729
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp": {
        hueDegrees: -4.114932885906114,
        saturationScale: 0.6159725971922244,
        brightnessScale: 0.9448979591836735
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp": {
        hueDegrees: 10.298505477140054,
        saturationScale: 0.9250450145969191,
        brightnessScale: 0.8881656804733729
      }
    }
  },
  "m21/black/components/Artifact/Artifact": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp": {
        frame: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        paper: {
          hueDegrees: 37.25414989939645,
          saturationScale: 0.7848398354730142,
          brightnessScale: 0.9923161361141603
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp": {
        hueDegrees: 37.25414989939645,
        saturationScale: 0.7848398354730142,
        brightnessScale: 0.9923161361141603
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp": {
        hueDegrees: 37.25414989939645,
        saturationScale: 0.7848398354730142,
        brightnessScale: 0.9923161361141603
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp": {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      }
    }
  },
  "3ed/white/retro/u.png": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.005889502049180328,0.011686838235294103,0.9844705,0.9909607500000001]]',
    materials: {
      "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png": {
        frame: {
          hueDegrees: 4.66481543145278,
          saturationScale: 0.4908900383397078,
          brightnessScale: 1.0187590187590188
        },
        paper: {
          hueDegrees: -2.4850427350427253,
          saturationScale: 1.1119809394145677,
          brightnessScale: 0.9338842975206612
        },
        mask: {
          kind: "rect",
          rect: [0.118, 0.6071428571428571, 0.762, 0.2819047619047619],
          feather: 0.0013333333333333333
        }
      }
    }
  },
  "m21/black/components/B/B": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/B.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/B.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/B.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/B.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/B.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/B.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    legendary: !1,
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/B.webp": {
        frame: {
          hueDegrees: -25.615373450085436,
          saturationScale: 0.474605353403811,
          brightnessScale: 0.8839908987957145,
          valueGamma: 0.9532541359332688
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/B.webp": {
        hueDegrees: -25.615373450085436,
        saturationScale: 0.474605353403811,
        brightnessScale: 0.8839908987957145,
        valueGamma: 0.9532541359332688
      }
    }
  }
}, Li = {
  "m21/black/components/R/R": {
    source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
    legendary: !1,
    materials: {
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp": {
        frame: {
          hueDegrees: 6.340194313841702,
          saturationScale: 0.9999999999999968,
          brightnessScale: 0.8957653067671145,
          valueGamma: 0.9500990476406066,
          rgbScale: [1.0154051686851842, 0.9992551312126245, 0.9855626639694447]
        },
        paper: {
          hueDegrees: -4.114932885906114,
          saturationScale: 0.6159725971922244,
          brightnessScale: 0.9448979591836735
        },
        mask: {
          kind: "rect",
          rect: [
            0.032440800650188735,
            0.6662377838116825,
            0.9396578084020479,
            0.3172337426923378
          ],
          feather: 0.0026041666666666665
        }
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp": {
        hueDegrees: -4.114932885906114,
        saturationScale: 0.6159725971922244,
        brightnessScale: 0.9448979591836735
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp": {
        hueDegrees: 6.340194313841702,
        saturationScale: 0.9999999999999968,
        brightnessScale: 0.8957653067671145,
        valueGamma: 0.9500990476406066,
        rgbScale: [1.0154051686851842, 0.9992551312126245, 0.9855626639694447]
      },
      "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp": {
        hueDegrees: -4.114932885906114,
        saturationScale: 0.6159725971922244,
        brightnessScale: 0.9448979591836735
      }
    }
  }
}, Gi = {
  "arn-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -21.501473124461086,
        saturationScale: 0.35187499999999994,
        brightnessScale: 0.9157303370786517
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.8834426229508195
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "arn-black-L": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: 1.0282170119955936,
        saturationScale: 0.42361231045559733,
        brightnessScale: 1.0091324200913243
      },
      mask: {
        kind: "rect",
        rect: [0.11885245901639344, 0.6058823529411764, 0.7663934426229508, 0.2720588235294118],
        feather: 0.0013333333333333333
      }
    }
  },
  "leg-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 14.296790811986057,
        saturationScale: 1.0286132997102524,
        brightnessScale: 1.0213483146067415
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.75,
        brightnessScale: 0.9776331967213114
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "fem-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 10.238420910075774,
        saturationScale: 0.8891222334004024,
        brightnessScale: 0.8179775280898877
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.4099365482233503,
        brightnessScale: 0.8023770491803277
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "4ed-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: -6.651960784313815,
        saturationScale: 1.0475972265564049,
        brightnessScale: 1.0161725067385445
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.6786248131539612,
        brightnessScale: 0.9823788546255507
      },
      mask: {
        kind: "rect",
        rect: [0.1160164271047228, 0.6068048400622977, 0.7637088901605682, 0.2845333652809393],
        feather: 0.0013333333333333333
      }
    }
  },
  "4ed-white-R": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 0.9473365617433274,
        saturationScale: 0.7790679728967409,
        brightnessScale: 0.8409669211195929
      },
      paper: {
        hueDegrees: -1.5370879120878271,
        saturationScale: 0.7975936392842132,
        brightnessScale: 0.8755980861244019
      },
      mask: {
        kind: "rect",
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333
      }
    }
  },
  "4ed-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 4.748297537978033,
        saturationScale: 0.7365248790437341,
        brightnessScale: 0.9202898550724637
      },
      paper: {
        hueDegrees: -1.2028743315507882,
        saturationScale: 0.7347446151409566,
        brightnessScale: 0.9060773480662984
      },
      mask: {
        kind: "chroma",
        bounds: [0.08235432726293468, 0.5828441356175872, 0.8394486148045915, 0.32346951000359414],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.24313725490196078, 0.40588235294117647, 0.29411764705882354],
        paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
      }
    }
  },
  "4ed-white-A": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: -4.166705840874329,
        saturationScale: 0.8970156657190242,
        brightnessScale: 1.045643153526971
      },
      paper: {
        hueDegrees: 3.573863636363626,
        saturationScale: 0.7584100356294544,
        brightnessScale: 0.9611872146118722
      },
      mask: {
        kind: "rect",
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333
      }
    }
  },
  "chr-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -10.093309859154942,
        saturationScale: 0.6057336832224741,
        brightnessScale: 0.8303370786516854
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.8523565573770491
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "chr-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.5470263556198997,
        brightnessScale: 1.1472478070175438
      },
      paper: {
        hueDegrees: -10.756302521008365,
        saturationScale: 0.7279174397031539,
        brightnessScale: 0.7173913043478262
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "rqs-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -3.9569462227912027,
        saturationScale: 0.675647699087608,
        brightnessScale: 0.8932584269662921
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9122336065573771
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "rqs-white-R": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/r.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -11.305000607238298,
        saturationScale: 0.7892046722427082,
        brightnessScale: 0.9791955617198335
      },
      paper: {
        hueDegrees: -15.011290079783294,
        saturationScale: 0.8518182848079755,
        brightnessScale: 0.9417475728155339
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
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
  },
  "itp-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.2012644046094465,
        saturationScale: 1.1224918378193693,
        brightnessScale: 0.8337078651685392
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35000000000000003,
        brightnessScale: 0.8798975409836065
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "itp-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 54.72844827586209,
        saturationScale: 0.667496921182266,
        brightnessScale: 0.9824561403508771
      },
      paper: {
        hueDegrees: -8.03571428571422,
        saturationScale: 0.8959469144800777,
        brightnessScale: 0.7304347826086957
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "vis-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 2.7191901408450576,
        saturationScale: 1.5913694945918608,
        brightnessScale: 0.8134831460674158
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.7390216244725715,
        brightnessScale: 0.953186475409836
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "por-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 33.79094827586209,
        saturationScale: 0.4635736808609119,
        brightnessScale: 0.8713450292397661
      },
      paper: {
        hueDegrees: -6.285714285714221,
        saturationScale: 0.7974474662746454,
        brightnessScale: 0.7695652173913043
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "wth-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0.7816901408450576,
        saturationScale: 1.7463796482863188,
        brightnessScale: 0.7932584269662921
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.6375529661016933,
        brightnessScale: 0.9490881147540983
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "usg-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -0.41717349551845473,
        saturationScale: 1.663864073081557,
        brightnessScale: 0.7617977528089888
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.8950409836065574
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "ath-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.7312202380952383,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -11.893466500208092,
        saturationScale: 0.9593076222289706,
        brightnessScale: 0.9487179487179488
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "ulg-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 6.196897147214486,
        saturationScale: 1.44966853763682,
        brightnessScale: 0.7764044943820225
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.9164319248826271,
        brightnessScale: 0.8729508196721312
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "ulg-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 27.774922634836457,
        saturationScale: 0.6514603887857772,
        brightnessScale: 1.0321637426900583
      },
      paper: {
        hueDegrees: -4.285714285714221,
        saturationScale: 0.9254331447604949,
        brightnessScale: 0.8391304347826086
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "6ed-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.4424509803921568,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.796244277985807,
        saturationScale: 0.9636483807005948,
        brightnessScale: 0.9444444444444445
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "6ed-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 6.568010131532219,
        saturationScale: 0.6071820777509336,
        brightnessScale: 0.9181286549707602
      },
      paper: {
        hueDegrees: -8.571428571428555,
        saturationScale: 0.8757351823708206,
        brightnessScale: 0.8173913043478261
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "ptk-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.8566071428571431,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.407859606185411,
        saturationScale: 1.1858096941603267,
        brightnessScale: 0.952991452991453
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "uds-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 2.465900667160895,
        saturationScale: 1.6933264866979658,
        brightnessScale: 0.8089887640449439
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.0263953488372048,
        brightnessScale: 0.8798975409836065
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "s99-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.35,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -15.019828155981486,
        saturationScale: 0.8201216369446448,
        brightnessScale: 0.9316239316239316
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "s99-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 42.145378655608965,
        saturationScale: 0.4593960416241585,
        brightnessScale: 0.9883040935672514
      },
      paper: {
        hueDegrees: -10.47813001605141,
        saturationScale: 0.5791702507449261,
        brightnessScale: 0.7891304347826087
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "brb-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.7403869047619052,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.399216201522222,
        saturationScale: 1.1101902451481103,
        brightnessScale: 0.9401709401709403
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "brb-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 28.994895644283133,
        saturationScale: 0.5908991706678307,
        brightnessScale: 0.9239766081871345
      },
      paper: {
        hueDegrees: -4.285714285714221,
        saturationScale: 0.8685969387755101,
        brightnessScale: 0.7999999999999999
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "nem-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.289738430583384,
        saturationScale: 0.8915652681436504,
        brightnessScale: 0.8235955056179776
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.5422222222222192,
        brightnessScale: 0.9221311475409836
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "pcy-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.633564096443024,
        saturationScale: 1.0799672453324602,
        brightnessScale: 0.7730337078651686
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.859911894273126,
        brightnessScale: 0.9303278688524589
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "pcy-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 17.807077308120142,
        saturationScale: 0.3893356835959018,
        brightnessScale: 0.9152046783625731
      },
      paper: {
        hueDegrees: -7.681547619047592,
        saturationScale: 0.7065816326530612,
        brightnessScale: 0.782608695652174
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "btd-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 45.43273932063812,
        saturationScale: 0.47032019704433514,
        brightnessScale: 0.8187134502923976
      },
      paper: {
        hueDegrees: -6.666666666666629,
        saturationScale: 0.8142768838304553,
        brightnessScale: 0.7913043478260869
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "pls-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -7.13672588968916,
        saturationScale: 1.1802209231170504,
        brightnessScale: 0.7887640449438202
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.7511403508771918,
        brightnessScale: 0.9313012295081968
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "7ed-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 60,
        saturationScale: 0.4756250000000001,
        brightnessScale: 1.4
      },
      paper: {
        hueDegrees: -9.253827741731357,
        saturationScale: 0.8491438968335036,
        brightnessScale: 0.9401709401709403
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
        paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
      }
    }
  },
  "ody-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.730436724826404,
        saturationScale: 1.1895774647887327,
        brightnessScale: 0.7999999999999999
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.197101034858387,
        brightnessScale: 0.9361987704918033
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "tor-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.125844105730266,
        saturationScale: 1.3379202774282588,
        brightnessScale: 0.7797752808988764
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.2835277777777736,
        brightnessScale: 0.9177561475409837
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mh2-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -5.12371526456036,
        saturationScale: 0.7905520188605681,
        brightnessScale: 0.9741573033707864
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 1.0356352459016396
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "rvr-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -5.432334166885994,
        saturationScale: 0.8071559831369582,
        brightnessScale: 0.9327485380116958
      },
      paper: {
        hueDegrees: -0.8894878706198597,
        saturationScale: 1.07695026062373,
        brightnessScale: 1.0043478260869565
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "rvr-black-A": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/a.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -1.3874016938898421,
        saturationScale: 0.9385034153567606,
        brightnessScale: 1.0527638190954773
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.75,
        brightnessScale: 0.9644727366255146
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mh3-black-C": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/c.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1.3783333333333334,
        brightnessScale: 1
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.9614659685863863,
        brightnessScale: 0.9979166666666666
      },
      mask: {
        kind: "rect",
        rect: [0.10860655737704918, 0.5985294117647059, 0.7868852459016393, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "mh3-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -5.728282493368738,
        saturationScale: 0.8035133376707874,
        brightnessScale: 0.9298245614035087
      },
      paper: {
        hueDegrees: -0.8894878706198597,
        saturationScale: 1.07695026062373,
        brightnessScale: 1.0043478260869565
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "inr-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0.6181627435848895,
        saturationScale: 1.054930083373806,
        brightnessScale: 0.9775280898876404
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.3903999999999978,
        brightnessScale: 1.0245901639344261
      },
      mask: {
        kind: "rect",
        rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "inr-black-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: -4.142150315687218,
        saturationScale: 0.8832387603666523,
        brightnessScale: 0.9239766081871345
      },
      paper: {
        hueDegrees: -2.691511387163473,
        saturationScale: 1.056747448979592,
        brightnessScale: 1
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
        paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
      }
    }
  },
  "lea-black-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",
    rect: [0, 0, 1, 1],
    adjustment: {
      frame: {
        hueDegrees: 0.07692307692309441,
        saturationScale: 0.8721979027962715,
        brightnessScale: 0.920343137254902
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.5488573232323238,
        brightnessScale: 0.9289524647887324
      },
      mask: {
        kind: "rect",
        rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-G": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 14.90078457567256,
        saturationScale: 0.653073971761817,
        brightnessScale: 1.0440835266821344
      },
      paper: {
        hueDegrees: 1.278409090909122,
        saturationScale: 0.5333302459988145,
        brightnessScale: 0.6657458563535911
      },
      mask: {
        kind: "chroma",
        bounds: [0.08866597098326993, 0.5813465915897927, 0.8310330898441446, 0.32945968611477183],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.2450980392156863, 0.42254901960784313, 0.3088235294117647],
        paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
      }
    }
  },
  "3ed-white-A": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 1.5746966632962085,
        saturationScale: 0.5767416007905141,
        brightnessScale: 1.08641975308642
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.5332231404958686,
        brightnessScale: 1.0076912100456623
      },
      mask: {
        kind: "rect",
        rect: [0.12266666666666666, 0.6095238095238096, 0.7573333333333333, 0.2795238095238095],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-W": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 0.5817307692307168,
        saturationScale: 1.0365597519207619,
        brightnessScale: 1.1704225352112676
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1.0189145738203973,
        brightnessScale: 0.9653827092511013
      },
      mask: {
        kind: "rect",
        rect: [0.116, 0.6071428571428571, 0.764, 0.2842857142857143],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-U": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 4.66481543145278,
        saturationScale: 0.4908900383397078,
        brightnessScale: 1.0187590187590188
      },
      paper: {
        hueDegrees: -2.4850427350427253,
        saturationScale: 1.1119809394145677,
        brightnessScale: 0.9338842975206612
      },
      mask: {
        kind: "rect",
        rect: [0.118, 0.6071428571428571, 0.762, 0.2819047619047619],
        feather: 0.0013333333333333333
      }
    }
  },
  "3ed-white-B": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: 11.54464285714289,
        saturationScale: 0.47346938775510233,
        brightnessScale: 1.0560344827586208
      },
      paper: {
        hueDegrees: 6.655906593406598,
        saturationScale: 0.5819440807296368,
        brightnessScale: 0.9186991869918698
      },
      mask: {
        kind: "chroma",
        bounds: [0.08866597098326993, 0.5813465915897927, 0.8310330898441446, 0.32945968611477183],
        seed: [0.5010266940451745, 0.7385887145082066],
        frameRgb: [0.18627450980392157, 0.22745098039215686, 0.19117647058823528],
        paperRgb: [0.9647058823529412, 0.7450980392156863, 0.5803921568627451]
      }
    }
  },
  "3ed-white-R": {
    asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",
    rect: [0.012, 0.01, 0.974, 0.982],
    adjustment: {
      frame: {
        hueDegrees: -9.881086142322147,
        saturationScale: 0.7089456692675254,
        brightnessScale: 0.8498727735368956
      },
      paper: {
        hueDegrees: -3.849587912087827,
        saturationScale: 0.637973137973138,
        brightnessScale: 0.7751196172248803
      },
      mask: {
        kind: "rect",
        rect: [0.11733333333333333, 0.6061904761904762, 0.7626666666666667, 0.28285714285714286],
        feather: 0.0013333333333333333
      }
    }
  }
}, $i = {
  "arn-black-U": [0.6803921568627451, 0.8078431372549021, 0.896078431372549],
  "atq-black-W": [0.8647058823529412, 0.8549019607843137, 0.7941176470588235],
  "atq-black-U": [0.7137254901960784, 0.8509803921568626, 0.8901960784313725],
  "sum-white-N": [0.9117450980392157, 0.9034513771597749, 0.895157656280334],
  "sum-white-W": [0.9411764705882353, 0.9529411764705882, 0.8803921568627451],
  "sum-white-G": [0.8607843137254901, 0.9313725490196079, 0.8254901960784313],
  "fem-black-N": [0.7775392156862744, 0.7489971713561662, 0.7204551270260577],
  "fem-black-W": [0.8156862745098039, 0.8294117647058823, 0.7313725490196078],
  "4ed-white-N": [0.801921568627451, 0.7741905244286774, 0.7464594802299036],
  "4ed-white-W": [0.9372549019607843, 0.9235294117647059, 0.8156862745098039],
  "4ed-white-U": [0.7607843137254902, 0.8627450980392157, 0.8941176470588236],
  "4ed-white-B": [0.681642156862745, 0.6581474364807804, 0.6346527160988157],
  "4ed-white-R": [0.8901960784313725, 0.7588235294117647, 0.7098039215686275],
  "4ed-white-G": [0.7725490196078432, 0.8313725490196077, 0.7235294117647058],
  "ice-black-W": [0.9176470588235294, 0.8941176470588236, 0.7568627450980392],
  "ice-black-U": [0.7294117647058823, 0.8117647058823529, 0.8509803921568627],
  "chr-white-N": [0.7788088235294118, 0.749940847954281, 0.7210728723791499],
  "chr-white-W": [0.9098039215686274, 0.8901960784313725, 0.792156862745098],
  "chr-white-B": [0.6470392156862745, 0.6242150965428648, 0.6013909773994549],
  "chr-white-R": [0.8784313725490196, 0.7372549019607845, 0.6784313725490196],
  "chr-white-G": [0.7862745098039214, 0.8431372549019608, 0.7372549019607844],
  "hml-black-W": [0.8803921568627451, 0.892156862745098, 0.8137254901960784],
  "hml-black-N": [0.8451372549019607, 0.8365603669190448, 0.8279834789361288],
  "hml-black-U": [0.8, 0.8627450980392157, 0.8813725490196078],
  "hml-black-R": [0.8924019607843137, 0.8034685790167723, 0.7430811941004472],
  "all-black-N": [0.7901176470588235, 0.7687034108259793, 0.7472891745931349],
  "all-black-W": [0.9058823529411765, 0.8980392156862746, 0.7784313725490196],
  "rqs-white-N": [0.7999215686274509, 0.7684890069889343, 0.7370564453504174],
  "rqs-white-W": [0.9235294117647059, 0.9019607843137254, 0.7901960784313725],
  "rqs-white-B": [0.6684117647058823, 0.6399132680547467, 0.6114147714036109],
  "rqs-white-R": [0.9215686274509804, 0.7490196078431373, 0.7019607843137255],
  "rqs-white-G": [0.7333333333333333, 0.8431372549019608, 0.6980392156862745],
  "mir-black-N": [0.7515, 0.718947400990099, 0.686394801980198],
  "mir-black-W": [0.9313725490196079, 0.9117647058823526, 0.7215686274509804],
  "mir-black-G": [0.6803921568627451, 0.8, 0.5588235294117647],
  "itp-white-N": [0.7553970588235294, 0.725230379996705, 0.6950637011698805],
  "itp-white-W": [0.8941176470588236, 0.8666666666666669, 0.7549019607843137],
  "itp-white-B": [0.7294411764705881, 0.7071826870096959, 0.6849241975488034],
  "itp-white-R": [0.8411764705882353, 0.6156862745098035, 0.5215686274509804],
  "itp-white-G": [0.7196078431372549, 0.7764705882352941, 0.6686274509803921],
  "vis-black-N": [0.7397941176470588, 0.7077485803727434, 0.6757030430984275],
  "vis-black-W": [0.9215686274509803, 0.8980392156862743, 0.7313725490196078],
  "5ed-white-N": [0.7058039215686275, 0.6768467433508057, 0.6478895651329839],
  "5ed-white-U": [0.6470588235294118, 0.8235294117647061, 0.8784313725490196],
  "5ed-white-B": [0.7122794117647059, 0.6923545533905743, 0.6724296950164426],
  "5ed-white-R": [0.8274509803921568, 0.5588235294117643, 0.45098039215686275],
  "5ed-white-G": [0.7450980392156863, 0.8235294117647058, 0.7686274509803923],
  "por-black-N": [0.7000196078431372, 0.6772464841423832, 0.6544733604416291],
  "por-black-W": [0.8980392156862745, 0.8862745098039213, 0.75],
  "por-black-R": [0.8549019607843137, 0.5921568627450975, 0.49019607843137253],
  "wth-black-N": [0.7210588235294119, 0.6898248398369251, 0.6585908561444381],
  "wth-black-W": [0.9147058823529411, 0.8980392156862745, 0.7196078431372549],
  "tmp-black-R": [0.8568627450980392, 0.5725490196078433, 0.4588235294117647],
  "sth-black-W": [0.9039215686274511, 0.9176470588235294, 0.7411764705882353],
  "sth-black-G": [0.5843137254901961, 0.7294117647058823, 0.5941176470588235],
  "exo-black-W": [0.8980392156862745, 0.8882352941176469, 0.7490196078431373],
  "exo-black-N": [0.7292549019607844, 0.7020432246165794, 0.6748315472723744],
  "p02-black-N": [0.7077843137254901, 0.6771253397398564, 0.6464663657542224],
  "p02-black-W": [0.8745098039215686, 0.8509803921568627, 0.7176470588235294],
  "p02-black-R": [0.8313725490196079, 0.5872549019607844, 0.4745098039215686],
  "p02-black-G": [0.5705882352941176, 0.7098039215686275, 0.5725490196078433],
  "usg-black-N": [0.692735294117647, 0.6627281959813629, 0.6327210978450786],
  "usg-black-W": [0.8765490196078433, 0.8599897089339418, 0.678618595825427],
  "ath-white-N": [0.7181617647058823, 0.6920793333286794, 0.6659969019514763],
  "ath-white-W": [0.8901960784313725, 0.8784313725490196, 0.7490196078431373],
  "ath-white-B": [0.6902352941176471, 0.6832304309842749, 0.6762255678509027],
  "ath-white-R": [0.8509803921568627, 0.5813725490196081, 0.4862745098039216],
  "ath-white-G": [0.5519607843137255, 0.7176470588235294, 0.592156862745098],
  "ulg-black-W": [0.8666666666666667, 0.8588235294117645, 0.6901960784313725],
  "ulg-black-N": [0.7232156862745098, 0.69188827412153, 0.6605608619685499],
  "6ed-white-N": [0.7096078431372548, 0.6791772592700446, 0.6487466754028343],
  "6ed-white-W": [0.8862745098039215, 0.8666666666666667, 0.7156862745098039],
  "6ed-white-B": [0.7284411764705883, 0.6968874126383229, 0.6653336488060572],
  "ptk-white-N": [0.7037843137254901, 0.6732986070665891, 0.6428129004076878],
  "ptk-white-W": [0.907843137254902, 0.8784313725490197, 0.7098039215686275],
  "ptk-white-B": [0.6922156862745099, 0.6622310959037083, 0.6322465055329064],
  "ptk-white-R": [0.8490196078431372, 0.5666666666666665, 0.42745098039215684],
  "uds-black-N": [0.7138774509803922, 0.6829545415938655, 0.6520316322073385],
  "uds-black-W": [0.8549019607843137, 0.8509803921568626, 0.696078431372549],
  "s99-white-N": [0.7151519607843138, 0.7015578851410496, 0.6879638094977854],
  "s99-white-W": [0.8901960784313725, 0.8862745098039215, 0.7803921568627451],
  "s99-white-B": [0.6936225490196078, 0.6876134427781013, 0.6816043365365948],
  "s99-white-R": [0.8333333333333334, 0.5960784313725492, 0.5411764705882353],
  "mmq-black-N": [0.7071323529411764, 0.6796084513322656, 0.6520845497233546],
  "mmq-black-G": [0.6098039215686275, 0.7058823529411764, 0.5784313725490196],
  "brb-white-N": [0.7013872549019609, 0.6710053812366532, 0.6406235075713455],
  "brb-white-B": [0.6907107843137253, 0.6607913815278587, 0.6308719787419917],
  "brb-white-W": [0.8980392156862745, 0.8823529411764705, 0.7333333333333334],
  "brb-white-R": [0.8509803921568627, 0.5764705882352936, 0.44901960784313727],
  "brb-white-G": [0.5882352941176471, 0.7215686274509804, 0.5745098039215686],
  "nem-black-N": [0.7646666666666668, 0.7369052030713278, 0.7091437394759885],
  "nem-black-W": [0.8980392156862745, 0.8823529411764705, 0.788235294117647],
  "pcy-black-W": [0.9098039215686274, 0.8901960784313723, 0.7725490196078432],
  "pcy-black-G": [0.5362745098039216, 0.6901960784313725, 0.5999999999999999],
  "btd-white-N": [0.6705098039215687, 0.641465443603184, 0.6124210832847992],
  "btd-white-B": [0.6277892156862745, 0.6043636651257039, 0.5809381145651331],
  "btd-white-R": [0.8411764705882353, 0.541176470588235, 0.4352941176470588],
  "inv-black-N": [0.6763333333333332, 0.6470367161716172, 0.6177400990099009],
  "inv-black-W": [0.9019607843137255, 0.8745098039215686, 0.7156862745098039],
  "inv-black-G": [0.5372549019607843, 0.6862745098039216, 0.5411764705882353],
  "pls-black-W": [0.9, 0.880392156862745, 0.7607843137254902],
  "7ed-white-N": [0.6787696078431372, 0.671299468668047, 0.6638293294929567],
  "7ed-white-W": [0.8784313725490196, 0.8823529411764706, 0.8],
  "7ed-white-B": [0.6719166666666667, 0.664174656559406, 0.6564326464521453],
  "7ed-white-R": [0.8156862745098039, 0.5568627450980393, 0.4823529411764706],
  "7ed-white-G": [0.4980392156862745, 0.6823529411764706, 0.603921568627451],
  "apc-black-R": [0.8705882352941177, 0.5764705882352935, 0.4588235294117647],
  "ody-black-W": [0.8862745098039215, 0.8705882352941177, 0.7294117647058824],
  "ody-black-N": [0.696735294117647, 0.6665549286546302, 0.6363745631916132],
  "tor-black-N": [0.6698186274509803, 0.6516680813893724, 0.6335175353277643],
  "tor-black-W": [0.884313725490196, 0.8598039215686275, 0.7254901960784313],
  "jud-black-N": [0.6904362745098039, 0.660528762618909, 0.630621250728014],
  "jud-black-R": [0.8313725490196079, 0.5392156862745099, 0.43333333333333335],
  "ons-black-W": [0.9627450980392157, 0.9549019607843137, 0.7843137254901961],
  "scg-black-W": [0.9222549019607845, 0.9106216656928856, 0.7140037950664139],
  "tsb-black-W": [0.925, 0.9161764705882351, 0.759313725490196],
  "tsb-black-U": [0.6666666666666665, 0.7960784313725485, 0.9411764705882351],
  "tsb-black-R": [0.8568627450980392, 0.6137254901960782, 0.4980392156862745],
  "tsr-black-W": [0.9927647058823531, 0.9899625474383303, 0.9479301707779888],
  "tsr-black-N": [0.855279411764706, 0.8478698129004079, 0.8404602140361096],
  "mh2-black-W": [0.9843137254901959, 0.9725490196078431, 0.8999999999999999],
  "brc-black-R": [0.9254901960784314, 0.66078431372549, 0.6313725490196078],
  "dmr-black-U": [0.7705882352941177, 0.8784313725490195, 0.9882352941176471],
  "dmr-black-R": [0.9107843137254901, 0.6421568627450981, 0.5931372549019607],
  "rvr-black-W": [1, 0.976470588235294, 0.8470588235294118],
  "rvr-black-U": [0.7098039215686275, 0.8784313725490198, 0.9764705882352941],
  "rvr-black-B": [0.8111911764705881, 0.7810601428272423, 0.7509291091838963],
  "rvr-black-R": [0.9686274509803922, 0.6745098039215688, 0.5568627450980392],
  "mh3-black-W": [0.996078431372549, 0.9725490196078431, 0.8549019607843137],
  "mh3-black-U": [0.7098039215686275, 0.8745098039215684, 0.9647058823529412],
  "mh3-black-R": [0.9607843137254901, 0.6745098039215689, 0.5529411764705883],
  "mh3-black-B": [0.8132107843137254, 0.7823282841363888, 0.7514457839590519],
  "inr-black-W": [0.996078431372549, 0.9764705882352941, 0.8509803921568627],
  "inr-black-U": [0.6802606033829841, 0.8765397843821006, 0.9723970588235294],
  "inr-black-R": [0.9647058823529412, 0.6745098039215687, 0.5529411764705883],
  "lea-black-W": [0.8588235294117647, 0.8666666666666667, 0.807843137254902],
  "lea-black-U": [0.6480392156862745, 0.7490196078431373, 0.7862745098039216],
  "leb-black-U": [0.6764705882352942, 0.8088235294117648, 0.8627450980392157],
  "2ed-white-W": [0.9215686274509804, 0.9235294117647059, 0.8431372549019608],
  "2ed-white-U": [0.6784313725490196, 0.8176470588235295, 0.8754901960784314],
  "2ed-white-R": [0.8745098039215686, 0.6960784313725488, 0.6196078431372549],
  "3ed-white-W": [0.8647058823529412, 0.8607843137254902, 0.788235294117647],
  "3ed-white-U": [0.7372549019607844, 0.8764705882352941, 0.903921568627451],
  "3ed-white-B": [0.6431764705882351, 0.6285728524927555, 0.6139692343972758],
  "3ed-white-R": [0.8784313725490196, 0.7607843137254902, 0.6980392156862745],
  "3ed-white-G": [0.7529411764705881, 0.8274509803921568, 0.7294117647058823]
}, Va = {
  "arn-black-W": [229 / 255, 229 / 255, 223 / 255],
  "arn-black-U": [170 / 255, 205 / 255, 224 / 255],
  "arn-black-G": [180 / 255, 200 / 255, 185 / 255],
  "arn-black-N": [185 / 255, 186 / 255, 185 / 255],
  "arn-black-B": [154 / 255, 150 / 255, 151 / 255],
  "arn-black-R": [213 / 255, 182 / 255, 177 / 255],
  "atq-black-N": [188 / 255, 183 / 255, 177 / 255],
  "atq-black-B": [158 / 255, 152 / 255, 141 / 255],
  "atq-black-R": [215 / 255, 182 / 255, 164 / 255],
  "atq-black-W": [220 / 255, 224 / 255, 205 / 255],
  "atq-black-U": [183 / 255, 214 / 255, 224 / 255],
  "atq-black-G": [194 / 255, 213 / 255, 185 / 255],
  // Robust glyph separation now uses the intended paper rather than a darkened
  // rim probe. Preserve the previous rendered disc's measured median color.
  "drk-black-B": [146 / 255, 124 / 255, 118 / 255],
  "drk-black-G": [179 / 255, 195 / 255, 158 / 255],
  "drk-black-U": [177 / 255, 205 / 255, 218 / 255],
  "drk-black-N": [185 / 255, 171 / 255, 162 / 255],
  "drk-black-W": [233 / 255, 224 / 255, 192 / 255],
  "drk-black-R": [210 / 255, 165 / 255, 151 / 255],
  "arn-dark-black-W": [228 / 255, 228 / 255, 223 / 255],
  "arn-light-black-W": [233 / 255, 232 / 255, 211 / 255],
  "arn-dark-black-B": [151 / 255, 148 / 255, 148 / 255],
  "arn-light-black-B": [167 / 255, 181 / 255, 181 / 255]
}, Oi = {
  kind: "polygon",
  feather: 2 / 744,
  points: [
    [65.5, 651.5],
    [678, 651.5],
    [680, 660],
    [682, 675],
    [686, 700],
    [689, 725],
    [691, 750],
    [692, 775],
    [691, 800],
    [690, 825],
    [687, 850],
    [683, 875],
    [677, 900],
    [668.5, 919.5],
    [568, 919.5],
    [566.5, 922.5],
    [74.5, 922.5],
    [73.5, 920],
    [66.5, 900],
    [60.5, 875],
    [55.5, 850],
    [53, 825],
    [51.5, 800],
    [51, 775],
    [51.5, 750],
    [54, 725],
    [57, 700],
    [60.5, 675],
    [63.5, 660]
  ].map(([e, t]) => [e / 744, t / 1039])
}, _n = (e) => ({
  kind: "polygon",
  feather: 2 / 744,
  points: e.map(([t, r]) => [t / 744, r / 1039])
}), Pi = _n([
  [87, 118],
  [92, 100],
  [104, 79],
  [120, 62],
  [135, 51],
  [149, 44],
  [681, 44],
  [689, 47],
  [693, 54],
  [693, 118]
]), Wi = _n([
  [74, 582],
  [677, 582],
  [688, 590],
  [696, 605],
  [705, 615],
  [705, 628],
  [696, 642],
  [682, 650],
  [82, 650]
]), Fi = { title: [1, 1, 1], type: [1, 1, 1], stats: [1.0297029702970297, 1.0088832487309645, 1.0299401197604792] }, Ui = { title: [0.9047619047619047, 0.9276018099547512, 0.9518072289156626], type: [1.4015151515151516, 1.0086206896551724, 0.9087837837837838], stats: [1.5, 1.1030927835051547, 1.0265624999999998] }, _i = { title: [0.736842105263158, 0.8620689655172413, 1.03125], type: [0.6666666666666666, 0.8181818181818182, 1.0740740740740742], stats: [0.8936170212765957, 1.0612244897959184, 1.146551724137931] }, Ni = { title: [1.0038560411311055, 0.9704301075268819, 1.1162790697674418], type: [0.9128989361702128, 0.9044117647058825, 1.1458333333333335], stats: null }, zi = { title: [1.2035714285714287, 1.03, 1.0040322580645162], type: [1.494318181818182, 1.0045731707317074, 1.1860465116279069], stats: [1.5, 1.1079545454545454, 1.276595744680851] }, Yi = { title: [0.8410958904109589, 0.8910614525139665, 0.9060773480662984], type: [1, 1, 1], stats: null }, qi = {
  W: Fi,
  U: Ui,
  B: _i,
  R: Ni,
  G: zi,
  A: Yi
}, Za = `${K.CONJURER_ROOT}/img/frames/future/regular`, ia = K.MSE_TEMPLATE_ROOT, Me = `${ia}/magic-future.mse-style`, f0 = `${ia}/magic-future-textless.mse-style`;
function de(e) {
  return e.futureTreatment ?? "regular";
}
function Nn(e) {
  if ((e.manaSymbols?.length || 0) > 6)
    throw Error("Futureshifted cost exceeds the six source positions");
  if (Je(e), de(e) === "full-art" && (e.rulesParagraphs?.some((t) => t.runs.some((r) => r.text.trim())) || !e.rulesParagraphs && e.rulesText?.trim()))
    throw Error("Futureshifted full-art treatment has no rules panel for the supplied wording");
}
function zn(e) {
  const t = L(e);
  return t.join("") === "WG" ? ["G", "W"] : t.join("") === "WR" ? ["R", "W"] : t;
}
function Je(e) {
  const t = O(e), r = zn(e), a = de(e), s = a === "full-art", n = t.land && !s, o = a === "regular" && !n && !t.artifact && r.length === 0, i = n || o, l = r.length > 1 ? "M" : r[0] ?? (t.artifact ? "A" : "C"), d = (r[0]?.toLowerCase() ?? "c") + "l", c = n && r.length === 2, u = (r[1]?.toLowerCase() ?? "c") + "l", h = e.power != null && e.toughness != null;
  if (s && !/^[WUBRG]$/.test(l))
    throw Error("Futureshifted full-art plates require one printed frame color");
  const m = ["U", "B", "R", "G"].includes(l) && !(n && c), g = e.canonicalTypeLine ?? e.typeLine ?? "", f = [
    "Artifact",
    "Creature",
    "Enchantment",
    "Instant",
    "Land",
    "Planeswalker",
    "Sorcery"
  ].filter((p) => new RegExp(`\\b${p}\\b`).test(g));
  /\b(?:Tribal|Kindred)\b/.test(g) && f.push("Tribal");
  const b = f.length > 1 ? "multitype" : f[0]?.toLowerCase(), w = n ? ["U", "B", "R", "G"].includes(r[0] ?? "") : m;
  return {
    kind: "future",
    base: s ? `${f0}/${l.toLowerCase()}card.jpg` : i ? `${Me}/${o ? "c" : d}card.jpg` : `${Za}/futureFrame${l}.png`,
    ...s ? { mask: `${f0}/mask_image.png` } : {},
    ...i ? {
      mask: `${Me}/mask_image.png`,
      paper: `${Me}/${o ? "c" : t.creature ? l.toLowerCase() : d}textbox.png`,
      type: `${Me}/${o ? "c" : d}typeline.png`
    } : {},
    ...c ? {
      reverseBase: `${Me}/${u}card.jpg`,
      reversePaper: `${Me}/${u}textbox.png`,
      reverseType: `${Me}/${u}typeline.png`,
      neutralBase: `${Me}/clcard.jpg`,
      neutralType: `${Me}/cltypeline.png`,
      baseBlend: `${Me}/hybrid_blend_card.png`,
      typeBlend: `${Me}/hybrid_blend_typeline.png`
    } : {},
    ...h ? {
      stats: s ? `${f0}/${l.toLowerCase()}pt.jpg` : i ? `${Me}/${o ? "c" : d}pt.png` : `${Za}/futurePT${l}.png`,
      ...s ? { statsMask: `${f0}/mask_pt.png` } : {}
    } : {},
    ...b ? {
      typeSymbol: `${ia}/magic-future-common.mse-include/${b}_${w ? "white" : "black"}.png`
    } : {},
    ...e.artist ? {
      brush: `${K.CONJURER_ROOT}/img/manaSymbols/${n || m ? "whitebrush" : "brush"}.svg`
    } : {}
  };
}
function la(e) {
  const t = de(e), r = t === "full-art";
  return {
    art: r ? [32, 83, 433, 476] : t === "clear" || e.artPlacement?.mode === "behind-text" ? [23, 22, 442, 637] : [32, 83, 433, 297],
    title: [86, 32, 360, 43],
    type: [59, r ? 560 : 382, 367, 40],
    rules: [50, 433, 393, 166],
    stats: [377, 609, 69, 40],
    symbol: [431, r ? 571 : 389, 29, 29],
    footer: [38, 611, 404, 35]
  };
}
const Hi = { frame: [0.9187500000000002, 0.9229729729729731, 1.1260000000000001], title: [0.8812095032397409, 0.8817567567567567, 0.9481792717086837], type: [1.0465277777777777, 1.0163352272727273, 1.1097770154373927], stats: [0.9004329004329005, 0.8952702702702703, 0.9717514124293787] }, Xi = { frame: [0.6021739130434783, 0.7878787878787878, 0.9531772575250836], title: [0.59375, 0.8760683760683762, 0.8777777777777778], type: [0.6702898550724639, 0.9859550561797753, 1.0846774193548387], stats: [0.7395209580838322, 0.8991596638655462, 0.8878378378378378] }, Ji = { frame: [0.8851981351981352, 0.9510309278350517, 0.9543269230769231], title: [0.9145199063231849, 1.0140449438202248, 1.1162790697674418], type: [1.0811023622047244, 0.9044117647058825, 0.7366071428571429], stats: [0.9608294930875576, 1.0552486187845302, 1.180722891566265] }, Ki = { frame: [1, 1, 1], title: [0.9573863636363638, 1.03, 1.3833333333333333], type: [1, 1, 1], stats: [0.9746835443037973, 1.0483870967741935, 1.5] }, Vi = {
  W: Hi,
  U: Xi,
  R: Ji,
  G: Ki
}, da = (e, t = 375, r = 527) => ({
  kind: "polygon",
  feather: 1 / t,
  points: e.map(([a, s]) => [a / t, s / r])
}), Zi = da([
  [44, 60],
  [52, 42],
  [66, 29],
  [75, 26],
  [344, 26],
  [347, 29],
  [347, 60]
]), Qi = da([
  [43, 438],
  [337, 438],
  [341, 443],
  [336, 448],
  [335, 458],
  [339, 466],
  [43, 466]
]), e3 = da(
  [
    [12, 16],
    [64, 16],
    [64, 35],
    [60, 42],
    [12, 42]
  ],
  78,
  51
), t3 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, St = (e) => ({
  hueDegrees: 0,
  saturationScale: 1,
  brightnessScale: 1,
  rgbScale: e
});
function r3(e) {
  const t = Je(e);
  for (const [r, a] of Object.entries(Vi)) {
    const s = K.MSE_TEMPLATE_ROOT + "/magic-future-textless.mse-style/";
    if (t.base === s + r.toLowerCase() + "card.jpg")
      return {
        [t.base]: {
          frame: St([1, 1, 1]),
          paper: St(a.frame),
          mask: t3,
          regions: [
            { mask: Zi, adjustment: St(a.title) },
            { mask: Qi, adjustment: St(a.type) }
          ]
        },
        ...t.stats ? {
          [t.stats]: { frame: St(a.frame), paper: St(a.stats), mask: e3 }
        } : {}
      };
  }
  return {};
}
const a3 = { frame: { hueDegrees: 8, saturationScale: 0.6137499999999998, brightnessScale: 1.25 }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.1482558139534884, 1.111280487804878, 1.3] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.0692640692640691, 1.036873156342183, 1.1861510791366907] } }, s3 = { W: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8366228070175439, 0.786036036036036, 0.7373737373737373] }, G: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [1.4, 1.4, 1.4] } }, n3 = { frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6, 0.6, 0.6] }, paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.8893905191873589, 0.8839285714285715, 0.9282511210762332] }, title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.947089947089947, 0.9388297872340424, 1.0242587601078168] }, type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, rgbScale: [0.6957070707070706, 0.6905370843989771, 0.7095046854082999] } }, wt = {
  land: a3,
  paper: s3,
  colorless: n3
}, p0 = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Yn = (e) => ({
  kind: "polygon",
  feather: 1 / 339,
  points: e.map(([t, r]) => [t / 339, r / 464])
}), o3 = Yn([
  [26, 43],
  [34, 25],
  [48, 12],
  [57, 9],
  [326, 9],
  [329, 12],
  [329, 43]
]), i3 = Yn([
  [12, 277],
  [319, 277],
  [330, 285],
  [337, 294],
  [330, 310],
  [319, 314],
  [20, 314]
]), l3 = {
  kind: "rect",
  rect: [20 / 375, 470 / 527, 338 / 375, 40 / 527],
  feather: 1 / 375
}, d3 = {
  kind: "rect",
  rect: [19 / 375, 19 / 527, 340 / 375, 491 / 527],
  feather: 1 / 375
}, c3 = {
  kind: "polygon",
  feather: 1 / 375,
  points: [
    [35, 323],
    [344, 323],
    [348, 340],
    [351, 360],
    [350, 390],
    [350, 420],
    [349, 430],
    [345, 450],
    [342, 466],
    [38, 466],
    [32, 450],
    [29, 430],
    [26, 410],
    [26, 380],
    [28, 360],
    [31, 340]
  ].map(([e, t]) => [e / 375, t / 527])
}, Yt = (e) => ({
  ...e,
  rgbScale: e.rgbScale
});
function u3(e) {
  const t = Je(e), r = Me + "/";
  if (!t.base.startsWith(r)) return {};
  const a = t.base === r + "ccard.jpg", s = {}, n = a ? wt.colorless : wt.land;
  for (const o of [t.base, t.reverseBase, t.neutralBase])
    o && (s[o] = a ? {
      frame: p0,
      paper: Yt(wt.colorless.frame),
      mask: d3,
      regions: [{ mask: c3, adjustment: p0 }]
    } : { frame: p0, paper: wt.land.frame, mask: l3 });
  for (const o of [t.type, t.reverseType, t.neutralType])
    o === r + (a ? "c" : "cl") + "typeline.png" && (s[o] = {
      frame: p0,
      paper: Yt(n.title),
      mask: o3,
      regions: [{ mask: i3, adjustment: Yt(n.type) }]
    });
  for (const o of [t.paper, t.reversePaper])
    if (o)
      if (a) s[o] = Yt(wt.colorless.paper);
      else
        for (const [i, l] of Object.entries(wt.paper))
          o === r + i.toLowerCase() + "ltextbox.png" && (s[o] = Yt(l));
  return s;
}
const h3 = {
  A: {
    frame: {
      hueDegrees: -6.794165580182494,
      saturationScale: 0.7130415909549775,
      brightnessScale: 1.083617747440273
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9201680672268907, 0.9121338912133891, 0.9253112033195021]
    }
  },
  W: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9244897959183672, 0.9248971193415638, 0.93125]
    }
  },
  U: {
    frame: {
      hueDegrees: 0,
      saturationScale: 1.0931250000000001,
      brightnessScale: 0.8931249999999998
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8502155172413793, 0.8613445378151261, 0.9300411522633745]
    }
  },
  B: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1.0137500000000002 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8750000000000001, 0.8459821428571429, 0.8392857142857143]
    }
  },
  R: {
    frame: { hueDegrees: -4.625, saturationScale: 1.0362500000000012, brightnessScale: 1.065625 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9385245901639344, 0.8853161843515541, 0.84070796460177]
    }
  },
  G: {
    frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8961038961038961, 0.9102564102564102, 0.8887061403508772]
    }
  }
};
function m3(e) {
  if (e.frameTemplate !== "future" || e.setCode?.toLowerCase() !== "fut" || e.colorCalibration !== "set-hsb-v1")
    return {};
  if (de(e) === "full-art") return r3(e);
  if (de(e) !== "regular") return {};
  const t = Je(e).base;
  for (const [r, a] of Object.entries(h3))
    if (t === K.CONJURER_ROOT + "/img/frames/future/regular/futureFrame" + r + ".png") {
      const s = qi[r], n = (i) => ({
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: i
      }), o = Je(e).stats;
      return {
        [t]: {
          ...a,
          mask: Oi,
          regions: [
            { mask: Pi, adjustment: n(s.title) },
            { mask: Wi, adjustment: n(s.type) }
          ]
        },
        ...o && s.stats ? { [o]: n(s.stats) } : {}
      };
    }
  return u3(e);
}
const Qa = {
  "ordinary/W": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",
    frame: {
      hueDegrees: -6.491752199413554,
      saturationScale: 0.8110599078341005,
      brightnessScale: 0.875
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8951612903225806, 0.8852459016393442, 0.9201680672268907]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8694331983805668, 0.8615702479338844, 0.8975188781014024]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.875, 0.8630705394190872, 0.8886486486486487]
    }
  },
  "colorshifted/W": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/w.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9392523364485981, 0.9720812182741116, 0.9715909090909091]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    }
  },
  "ordinary/U": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",
    frame: {
      hueDegrees: 18.3125,
      saturationScale: 0.8049999999999997,
      brightnessScale: 0.9475
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.891304347826087, 0.8851063829787235, 0.9170124481327802]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.903896103896104, 0.8686987104337631, 0.9136771300448431]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8897435897435898, 0.8779342723004694, 0.9079685746352413]
    }
  },
  "colorshifted/U": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/u.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.9784946236559141, 0.9901477832512315, 1.036697247706422]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.1098901098901097, 1.0403225806451613, 1.128980891719745]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.10989010989011, 1.0423387096774193, 1.1353503184713374]
    }
  },
  "ordinary/B": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png",
    frame: {
      hueDegrees: -2.75,
      saturationScale: 0.9825000000000002,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.865546218487395, 0.8620689655172413, 0.8951965065502183]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8559782608695653, 0.8110014104372356, 0.8306801736613603]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8600508905852416, 0.8215223097112861, 0.8409703504043128]
    }
  },
  "colorshifted/B": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/b.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1.0509554140127388, 1.0723684210526314, 1.1143790849673203]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.7767857142857142, 0.724609375, 0.741869918699187]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.7732142857142856, 0.736328125, 0.7439024390243902]
    }
  },
  "ordinary/R": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png",
    frame: {
      hueDegrees: 4.1875,
      saturationScale: 1.0318749999999994,
      brightnessScale: 0.9150000000000003
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8938775510204081, 0.8893805309734514, 0.9065420560747663]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8801652892561984, 0.8810679611650486, 0.8488210818307905]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8780991735537191, 0.8691931540342297, 0.8393351800554018]
    }
  },
  "colorshifted/R": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/r.png",
    frame: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [1, 1.0657894736842104, 1.0162601626016259]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1
    }
  },
  "ordinary/G": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",
    frame: {
      hueDegrees: -39.28098739495795,
      saturationScale: 1.0733997252747252,
      brightnessScale: 0.86328125
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8818181818181817, 0.8641304347826086, 0.9011494252873564]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8756281407035176, 0.85, 0.8712121212121212]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8844221105527638, 0.8489892984542211, 0.8731155778894473]
    }
  },
  "ordinary/M": {
    source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
    frame: {
      hueDegrees: 2,
      saturationScale: 1.159999999999999,
      brightnessScale: 0.8725
    },
    paper: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8582995951417004, 0.8613445378151261, 0.9415887850467289]
    },
    title: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8467741935483871, 0.8443579766536965, 0.734375]
    },
    type: {
      hueDegrees: 0,
      saturationScale: 1,
      brightnessScale: 1,
      rgbScale: [0.8541176470588236, 0.8469656992084432, 0.7004048582995952]
    }
  }
}, qn = (e) => ({
  kind: "polygon",
  points: e.map(([t, r]) => [t / 488, r / 680]),
  feather: 0.75 / 488
}), g3 = qn([
  [43, 41],
  [445, 41],
  [449, 48],
  [450, 58],
  [446, 72],
  [42, 72],
  [38, 64],
  [37, 54],
  [39, 46]
]), f3 = qn([
  [43, 388],
  [445, 388],
  [449, 395],
  [450, 402],
  [446, 414],
  [42, 414],
  [38, 407],
  [37, 399],
  [39, 392]
]);
function p3(e) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.colorCalibration !== "set-hsb-v1" || e.frameTemplate || e.layout && e.layout !== "normal")
    return {};
  const t = ke(e);
  if (!t || !Ee(e, t.frame)) return {};
  const r = Di(e, t.frame), a = Object.entries(Qa).find(([, l]) => l.source === t.frame);
  if (!a)
    return r ? {
      [t.frame]: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        blackPoint: r,
        blend: Er(e, t.frame)
      }
    } : {};
  const [s, n] = a, o = s.endsWith("/W") || s.endsWith("/M") ? 615 : 610, i = {
    [t.frame]: {
      blackPoint: r,
      blend: Er(e, t.frame),
      frame: n.frame,
      paper: n.paper,
      mask: {
        kind: "rect",
        rect: [41 / 488, 425 / 680, 405 / 488, (o - 425) / 680],
        feather: 0.75 / 488
      },
      regions: [
        { mask: g3, adjustment: n.title },
        { mask: f3, adjustment: n.type }
      ]
    }
  };
  for (const l of t.pinlines ? [t.pinlines.left, t.pinlines.right] : []) {
    const d = Object.values(Qa).find((c) => c.source === l);
    d && (i[l] = d.frame);
  }
  return i;
}
const b3 = {
  "arn/W": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.008741918032786858,0.005528823529411754,0.987149,0.991329]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -13.640927100986662,
        saturationScale: 0.5400738710331036,
        brightnessScale: 1.0492517860747008,
        valueGamma: 0.8994679069282768
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      mask: {
        kind: "rect",
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333
      }
    }
  },
  "arn/U": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006729180327868926,0.005528823529411754,0.9886099999999999,0.991329]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: 8.695311924531383,
        saturationScale: 0.7336299706894727,
        brightnessScale: 0.9918856718215499,
        valueGamma: 0.8925193131882323
      },
      paper: {
        hueDegrees: 7.681106138107452,
        saturationScale: 1.4347665118679058,
        brightnessScale: 0.9421487603305786
      },
      mask: {
        kind: "rect",
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333
      }
    }
  },
  "arn/B": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.014993852459016379,-0.01515441176470595,1.0305,1.0270000000000001]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -13.974519149984646,
        saturationScale: 0.48077990027996853,
        brightnessScale: 1.3401551515814558,
        valueGamma: 1.2607231644949974
      },
      paper: {
        hueDegrees: -11.213063909774519,
        saturationScale: 0.5857999353587588,
        brightnessScale: 0.9227557411273487
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23333333333333334],
        paperRgb: [0.9392156862745098, 0.8, 0.596078431372549]
      }
    }
  },
  "arn/R": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.00599718032786886,0.003936470588235265,0.9900709999999999,0.9952570000000001]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -7.992651881053812,
        saturationScale: 0.70622971619805,
        brightnessScale: 0.8936224010262801,
        valueGamma: 1.38110833476772
      },
      paper: {
        hueDegrees: -5.943625631125656,
        saturationScale: 0.5376010534051938,
        brightnessScale: 0.7476190476190477
      },
      mask: {
        kind: "rect",
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333
      }
    }
  },
  "arn/G": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.018567622950819714,-0.015338235294117604,1.0315,1.027]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      paper: {
        hueDegrees: 25.416811846689825,
        saturationScale: 0.4621650250156346,
        brightnessScale: 1.1037735849056602
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.2323529411764706, 0.31176470588235294, 0.2754901960784314],
        paperRgb: [0.41568627450980394, 0.2823529411764706, 0.2549019607843137]
      }
    }
  },
  "arn/A": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.00794918032786887,0.004855000000000054,0.9861749999999999,0.9923109999999999]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: 7.632246618375651,
        saturationScale: 0.35000000000000253,
        brightnessScale: 1.1734718355876625,
        valueGamma: 1.2754055770415957
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35,
        brightnessScale: 0.9869263698630137
      },
      mask: {
        kind: "rect",
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333
      }
    }
  },
  "arn/L": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.007461180327868825,0.006570588235294111,0.987149,0.99182]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      paper: {
        hueDegrees: -1.0520296612100992,
        saturationScale: 0.6957976149956239,
        brightnessScale: 0.9456066945606694
      },
      mask: {
        kind: "rect",
        rect: [0.1265358333052816, 0.6083023840900922, 0.7510856027198977, 0.2770456451419673],
        feather: 0.0013333333333333333
      }
    }
  },
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
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
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
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      paper: {
        hueDegrees: -3.11206896551721,
        saturationScale: 0.7848932676518883,
        brightnessScale: 0.9372384937238494
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
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
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      paper: {
        hueDegrees: 17.629629629629562,
        saturationScale: 0.6774409323116217,
        brightnessScale: 1.099526066350711
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
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
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
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
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      mask: {
        kind: "rect",
        rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
        feather: 0.0013333333333333333
      }
    }
  },
  "drk/W": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007241475409836138,0.005283823529411758,0.9886099999999999,0.99182]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -7.845718158039411,
        saturationScale: 0.9701020808196514,
        brightnessScale: 1.0703611809699505,
        valueGamma: 0.7617441387795468
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 0.35000000000000037,
        brightnessScale: 0.9743421052631579
      },
      mask: {
        kind: "rect",
        rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
        feather: 0.0013333333333333333
      }
    }
  },
  "drk/U": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.005741032786885253,0.005651470588235287,0.9900709999999999,0.99182]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: 3.885649697326273,
        saturationScale: 0.5020523275923062,
        brightnessScale: 1.0303224022017168,
        valueGamma: 1.0035873157195883
      },
      paper: {
        hueDegrees: 2.104082150101476,
        saturationScale: 0.6009076119530785,
        brightnessScale: 0.9462809917355373
      },
      mask: {
        kind: "rect",
        rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
        feather: 0.0013333333333333333
      }
    }
  },
  "drk/B": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.015750000000000042,-0.01547058823529413,1.0315,1.028]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -60,
        saturationScale: 0.35,
        brightnessScale: 1.4,
        valueGamma: 1.3026215842864537
      },
      paper: {
        hueDegrees: -7.0356800766284096,
        saturationScale: 0.6512602087114338,
        brightnessScale: 0.9539748953974896
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23333333333333334],
        paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
      }
    }
  },
  "drk/G": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.021598360655737777,-0.015220588235294158,1.0350000000000001,1.0275]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: -27.640570574898614,
        saturationScale: 0.5938588241247582,
        brightnessScale: 1.0755759219987682,
        valueGamma: 0.8179143870418026
      },
      paper: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      mask: {
        kind: "chroma",
        bounds: [0.09221311475409837, 0.5823529411764706, 0.8176229508196722, 0.3176470588235294],
        seed: [0.5, 0.7352941176470589],
        frameRgb: [0.23137254901960785, 0.31176470588235294, 0.27647058823529413],
        paperRgb: [0.4117647058823529, 0.2823529411764706, 0.25882352941176473]
      }
    }
  },
  "drk/A": {
    source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006192590163934432,0.004732647058823482,0.987636,0.9932930000000001]]',
    stock: "#181510",
    adjustment: {
      frame: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1
      },
      paper: {
        hueDegrees: -1.9224806201550564,
        saturationScale: 0.8278170951089796,
        brightnessScale: 1.0182648401826484
      },
      mask: {
        kind: "rect",
        rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
        feather: 0.0013333333333333333
      }
    }
  },
  ...hi,
  ...ci
};
function ca(e) {
  if (e.colorCalibration !== "set-hsb-v1") return;
  const t = Pt(e);
  if (!t) return;
  const r = b3[`${e.setCode?.toLowerCase()}/${t.material}`];
  if (r?.source === JSON.stringify([t.asset, t.frame]))
    return { materials: { [t.asset]: r.adjustment }, stock: r.stock };
}
function Ft(e) {
  if (e.frameTemplate) return !1;
  const t = ["lea", "leb", "2ed", "3ed"].includes(e.setCode?.toLowerCase() ?? "");
  return (ae(e) || !!oa(e)) && (!e.layout || e.layout === "normal") && (e.colorCalibration === "set-hsb-v1" || t && e.colorCalibration === "early-hsb-v1");
}
function S3(e) {
  if (!Ft(e) || !ae(e) || c0(e)) return;
  const t = He(e), r = t.split("/").at(-1).replace(".png", "").toUpperCase(), a = Gi[`${e.setCode?.toLowerCase()}-${Ae(e)}-${r}`];
  if (!(a?.asset !== t || !a.rect.every((s, n) => s === X0(e)[n])))
    return t.endsWith("/old/fourth/w.png") ? {
      ...a.adjustment,
      mask: {
        kind: "rect",
        rect: [162 / 1500, 1259 / 2100, 1174 / 1500, 627 / 2100],
        feather: 2 / 1500
      }
    } : a.adjustment;
}
function Hn(e, t) {
  if (!Ft(e) || e.setCode?.toLowerCase() === "leg" && !we(e)) return;
  const r = `${e.setCode?.toLowerCase()}-${Ae(e)}-${t}`;
  if (Vr(e)) {
    const a = Zr(e);
    return a && (t === "W" || t === "B") ? Va[`arn-${a}-black-${t}`] : Va[r];
  }
  return ri[r] ?? $i[r];
}
function ua(e) {
  const t = ca(e);
  if (t) return t.materials;
  if (e.frameTemplate === "future") return m3(e);
  if (e.setCode?.toLowerCase() === "plc") return p3(e);
  if (!Ft(e)) return {};
  const r = oa(e), a = r && ((O(e).legendary ? void 0 : Li[r.key]) ?? Bi[r.key] ?? $n[r.key]);
  if (a && a.source === r?.source && (a.legendary === void 0 || a.legendary === O(e).legendary))
    return a.materials;
  const s = S3(e);
  return s ? { [He(e)]: s } : {};
}
function w3(e) {
  return Object.keys(ua(e)).length > 0;
}
function es(e) {
  const t = ca(e);
  return t ? t.materials : Sn(e, ua(e), Xn(e)).materials;
}
function y3(e) {
  const t = ca(e);
  return t ? t.stock : Sn(e, ua(e), Xn(e)).stock;
}
function Xn(e) {
  if (a0(e) && !e.frameTemplate && !ae(e) && !ke(e) && (e.layout ?? "normal") === "normal" && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") && O(e).land)
    return {
      url: gt(O(e)).frame,
      geometry: JSON.stringify(J.frame)
    };
  if (!Ft(e)) return;
  if (ae(e))
    return {
      url: He(e),
      geometry: JSON.stringify(X0(e)),
      mask: ra(e)
    };
  const t = oa(e);
  return t?.family === "components" ? { url: t.frame, geometry: JSON.stringify(t.rect) } : void 0;
}
const Vt = /* @__PURE__ */ new WeakMap();
function k3(e, t, r, a) {
  return Vt.get(e)?.(t, r, a) ?? !1;
}
function v3(e, t, r) {
  const a = t.printingOmissions;
  if (!a?.length) return r();
  const s = e.fillText, n = e.strokeText, o = (l, d, c) => {
    const u = e.getTransform().transformPoint({ x: d, y: c }), h = u.x * 488 / e.canvas.width, m = u.y * 680 / e.canvas.height;
    return a.some(({ rect: g, rotation: f = 0, texts: b }) => {
      if (!b.includes(String(l))) return !1;
      const w = f * Math.PI / 180, p = h - g[0] * 488, S = m - g[1] * 680, y = p * Math.cos(w) + S * Math.sin(w), k = -p * Math.sin(w) + S * Math.cos(w);
      return y >= -8 && y <= g[2] * 488 + 8 && k >= -8 && k <= g[3] * 680 + 25;
    });
  }, i = Vt.get(e);
  Vt.set(e, (l, d, c) => o(l, d, c) || (i?.(l, d, c) ?? !1)), e.fillText = function(l, d, c, u) {
    o(l, d, c) || s.call(this, l, d, c, ...u === void 0 ? [] : [u]);
  }, e.strokeText = function(l, d, c, u) {
    o(l, d, c) || n.call(this, l, d, c, ...u === void 0 ? [] : [u]);
  };
  try {
    r();
  } finally {
    i ? Vt.set(e, i) : Vt.delete(e), e.fillText = s, e.strokeText = n;
  }
}
function j3(e, t, r, a, s) {
  const [n, o, i] = r;
  if (k3(e, t, n, o)) return;
  const l = e.getTransform(), d = Math.hypot(l.a, l.b), c = (Math.floor((n - 4) * d + l.e) - l.e) / d, u = (Math.floor((o - a) * d + l.f) - l.f) / d, h = document.createElement("canvas");
  h.width = Math.ceil((i + 8) * d), h.height = Math.ceil(a * 2 * d);
  const m = h.getContext("2d");
  if (!m) throw Error("Magic heading ink needs Canvas2D");
  try {
    m.scale(d, d), m.translate(-c, -u), m.font = e.font, m.fillStyle = e.fillStyle, m.textAlign = e.textAlign, m.textBaseline = e.textBaseline, m.fillText(t, n, o, i), m.globalCompositeOperation = "destination-out", m.lineWidth = s, m.strokeStyle = "#000", m.strokeText(t, n, o, i), e.drawImage(
      h,
      0,
      0,
      h.width,
      h.height,
      c,
      u,
      h.width / d,
      h.height / d
    );
  } finally {
    h.width = h.height = 0;
  }
}
function ha(e, t, r, a, s, n = "#efe7cb", o) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = n, e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.clip(), e.fillStyle = "#0d0f0f", e.font = '100px "CardRenderer MTG Historic Symbols"', e.textAlign = "left", e.textBaseline = "alphabetic";
  const i = "", l = e.measureText(i), d = l.actualBoundingBoxLeft + l.actualBoundingBoxRight, c = l.actualBoundingBoxAscent + l.actualBoundingBoxDescent, u = s * (o?.scale ?? 1) / Math.max(d, c);
  e.translate(t + a / 2 + (o?.dx ?? 0), r + a / 2 + (o?.dy ?? 0)), e.scale(u, u), e.fillText(
    i,
    (l.actualBoundingBoxLeft - l.actualBoundingBoxRight) / 2,
    (l.actualBoundingBoxAscent - l.actualBoundingBoxDescent) / 2
  ), e.restore();
}
const W4 = "symbols-v3";
function ma(e) {
  if (e.symbolAdjustment) {
    if (e.layout && e.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
      throw Error("Symbol adjustment currently supports ordinary faces only.");
    for (const [t, r] of Object.entries(e.symbolAdjustment)) {
      if (t !== "mana" && t !== "set") throw Error("Unknown symbol adjustment group.");
      if (!r || typeof r != "object") throw Error("Invalid symbol adjustment.");
      for (const [a, s] of Object.entries(r)) {
        if (t === "mana" && a === "glyphs") {
          C3(s);
          continue;
        }
        const n = a === "dx" || a === "dy", o = t === "mana" && (a === "numberDx" || a === "numberDy"), i = t === "mana" && a === "spacing", l = a === "scaleX" || a === "scaleY" || t === "mana" && a === "numberScale", d = i || o ? 4 : 8;
        if (!n && !o && !i && !l || typeof s != "number" || !Number.isFinite(s) || s < (l ? 0.75 : -d) || s > (l ? 1.25 : d))
          throw Error("Symbol adjustment exceeds supported bounds.");
      }
    }
  }
}
function C3(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    throw Error("Invalid mana glyph controls.");
  for (const [t, r] of Object.entries(e)) {
    if (!/^[WUBRG]$/.test(t) || !r || typeof r != "object" || Array.isArray(r))
      throw Error("Invalid mana glyph color.");
    for (const [a, s] of Object.entries(r)) {
      const n = a === "scale";
      if (!n && a !== "dx" && a !== "dy" || typeof s != "number" || !Number.isFinite(s) || s < (n ? 0.75 : -4) || s > (n ? 1.25 : 4))
        throw Error("Mana glyph control exceeds supported bounds.");
    }
  }
}
function n0(e, t) {
  return /^[WUBRG]$/.test(t) ? e?.glyphs?.[t] : void 0;
}
function ht(e, t) {
  const { dx: r = 0, dy: a = 0, scaleX: s = 1, scaleY: n = 1 } = t ?? {};
  if (!r && !a && s === 1 && n === 1) return e;
  const [o, i, l, d] = e;
  return [o + l + r - l * s, i + d / 2 + a - d * n / 2, l * s, d * n];
}
function At(e, t, r, a) {
  const s = ht(t, r);
  if (s === t || !t[2] || !t[3]) {
    a();
    return;
  }
  e.save();
  const n = s[2] / t[2], o = s[3] / t[3];
  e.transform(n, 0, 0, o, s[0] - t[0] * n, s[1] - t[1] * o);
  try {
    a();
  } finally {
    e.restore();
  }
}
function R3(e, t, r) {
  const a = Math.max(0, t - 1) * (r?.spacing ?? 0);
  return a ? [e[0] - a, e[1], e[2] + a, e[3]] : e;
}
function Bt(e) {
  if (!/^#[a-f0-9]{6}$/i.test(e)) throw Error("Invalid mana palette color");
  return [
    parseInt(e.slice(1, 3), 16) / 255,
    parseInt(e.slice(3, 5), 16) / 255,
    parseInt(e.slice(5, 7), 16) / 255
  ];
}
const M3 = {
  W: "#efe7cb",
  U: "#3d7ac3",
  B: "#33313c",
  R: "#c2432e",
  G: "#3b8a4e"
}, x3 = "#9aa4ae", lr = {
  W: "#f8f6d8",
  U: "#c1d7e9",
  B: "#cac5c0",
  R: "#e49977",
  G: "#a3c095",
  N: "#cac5c0"
};
function ga(e, t, r, a) {
  const s = [];
  for (const n of t.split(`
`)) {
    let o = [], i = 0;
    const l = q0(n).flatMap(
      (d) => d.symbol ? [{ text: d.symbol, symbol: !0 }] : (d.value.match(/\s+|\S+/g) ?? []).map((c) => ({ text: c, symbol: !1 }))
    );
    for (const d of l) {
      const c = !d.symbol && e.measureText(d.text).width > r ? [...d.text].map((u) => ({ text: u, symbol: !1 })) : [d];
      for (const u of c) {
        const h = u.symbol ? a * 0.94 : e.measureText(u.text).width;
        i + h > r && o.length && (s.push(o), o = [], i = 0), !(!o.length && /^\s+$/.test(u.text)) && (o.push({ ...u, width: h }), i += h);
      }
    }
    s.push(o);
  }
  return s;
}
function te(e, t, r, a, s, n, o = !1, i) {
  if (t === "W" && n.originalWhiteGlyph) {
    ha(
      e,
      r,
      a,
      s,
      s * 0.87,
      n.manaColors?.W,
      n0(i, t)
    );
    return;
  }
  const l = /^\d+$/.test(t);
  if (l && i && n.manaCostNumeral) {
    oi(e, t, r, a, s, n.manaCostNumeral, i);
    return;
  }
  const d = n0(i, t), c = n.manaGlyphScales?.[t] ?? 1, u = l ? i ? n.manaNumerals?.get(t) : void 0 : c !== 1 || d ? n.manaGlyphs?.get(t) : void 0, h = n.get(It(t) ?? "");
  if (e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, o) {
    const m = e.getTransform();
    e.shadowColor = "#000d";
    const [g, f] = n.manaCostShadow ?? [-1.5372, 1.5372];
    e.shadowOffsetX = g * m.a + f * m.c, e.shadowOffsetY = g * m.b + f * m.d;
  }
  if (e.fillStyle = n.manaColors?.[t] ?? M3[t] ?? x3, e.beginPath(), e.arc(r + s / 2, a + s / 2, s / 2, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", u && e.drawImage(u.image, 0, 0, u.width, u.height, r, a, s, s), u) {
    const m = l ? i?.numberDx ?? 0 : d?.dx ?? 0, g = l ? i?.numberDy ?? 0 : d?.dy ?? 0, f = l ? i?.numberScale ?? 1 : c * (d?.scale ?? 1);
    l || (e.beginPath(), e.arc(r + s / 2, a + s / 2, s / 2, 0, Math.PI * 2), e.clip()), (m || g || f !== 1) && (e.translate(r + s / 2 + m, a + s / 2 + g), e.scale(f, f), e.translate(-r - s / 2, -a - s / 2));
  }
  if (u || h) {
    u ? e.drawImage(
      u.image,
      u.width,
      0,
      u.width,
      u.height,
      r,
      a,
      s,
      s
    ) : e.drawImage(h, r, a, s, s), e.restore();
    return;
  }
  e.fillStyle = t === "B" ? "white" : "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `bold ${s * 0.62}px Georgia`, e.fillText(t, r + s / 2, a + s / 2, s * 0.9), e.restore();
}
function Jn(e, t, r, a, s, n, o) {
  if (!Ke(e)) return;
  const i = typeof n == "number" ? n : n.size;
  e.font = `${typeof n != "number" && n.italic ? "italic " : ""}${i}px "CardRenderer MTG MPlantin", Georgia`;
  const l = t.split(`
`).map((d) => ga(e, d, s, i));
  e.textBaseline = "top";
  for (const d of l) {
    for (const c of d) {
      let u = r;
      for (const h of c)
        h.symbol ? te(e, h.text, u + i * 0.07, a + i * 0.03, i * 0.8, o) : e.fillText(h.text, u, a), u += h.width;
      a += i;
    }
    a += H.paragraphGap;
  }
}
function F4(e, t, r) {
  if (e.measureText(t).width <= r) return t;
  const a = [...t];
  for (; a.length && e.measureText(`${a.join("")}…`).width > r; ) a.pop();
  return a.length || e.measureText("…").width <= r ? `${a.join("")}…` : "";
}
function re(e, t, r, a, s, n, o = !1, i = 1, l = "CardRenderer MTG Beleren", d = 0, c, u = "type") {
  if (!(s > 0)) throw Error("Magic title/type plate has no text space.");
  e.save(), e.font = `${o ? "bold " : ""}${n}px "${l}", Georgia`;
  const h = e.measureText(t).width;
  i > 1 && h * i > s && (i = 1), i !== 1 && (e.translate(r, 0), e.scale(i, 1), r = 0, s /= i), h > s && (n = Math.max(n * 0.78, n * s / h), e.font = `${o ? "bold " : ""}${n}px "${l}", Georgia`), Se(
    e,
    t,
    r,
    a,
    s,
    c,
    u,
    d > 0 ? () => j3(e, t, [r, a, s], n, d) : void 0
  ), e.restore();
}
function Ve(e, t, r, a, s, n, o, i, l = [0, 0, 1, 1]) {
  const d = [
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height
  ], c = {
    uncommon: "#aaaeb2",
    rare: "#bc923f",
    mythic: "#c65c2d",
    special: "#8664af",
    bonus: "#bc923f"
  }[a ?? "common"];
  if (!c || ["forge", "glint"].includes(r?.toLowerCase() ?? "")) {
    e.drawImage(t, ...d, s, n, o, i);
    return;
  }
  const u = document.createElement("canvas");
  u.width = Math.max(1, Math.ceil(o * 2)), u.height = Math.max(1, Math.ceil(i * 2));
  const h = u.getContext("2d");
  h.drawImage(t, ...d, 0, 0, u.width, u.height), h.globalCompositeOperation = "source-in", h.fillStyle = c, h.fillRect(0, 0, u.width, u.height), e.drawImage(u, s, n, o, i), u.width = u.height = 0;
}
function J0(e) {
  return /^[WUBRG]$/.test(e) ? `${K.MSE_TEMPLATE_ROOT}/magic-mana-future.mse-symbol-font/mana_${e.toLowerCase()}.png` : /^(?:[0-9]|1[0-9]|20|X)$/.test(e) ? `${K.CONJURER_ROOT}/img/manaSymbols/future/f0.png` : /^[WUBRG]\/[WUBRG]$/.test(e) ? `${K.CONJURER_ROOT}/img/manaSymbols/future/f${e.toLowerCase().replace("/", "")}.png` : null;
}
function T3(e) {
  const t = e.manaSymbols ?? [];
  return [
    .../* @__PURE__ */ new Set([
      ...t.map(J0).filter((r) => r !== null),
      ...t.some((r) => /^(?:\d+|X)$/.test(r)) ? Ar() : []
    ])
  ];
}
function Ar() {
  return ["0", "1", "2", "3", "4", "5", "6", "x"].map(
    (e) => `${K.CONJURER_ROOT}/img/manaSymbols/future/f${e}.png`
  );
}
function D3(e, t, r) {
  const a = [91, 61, 46, 46, 59, 106], s = [140, 207, 281, 356, 437, 512], n = t.manaSymbols ?? [];
  if (n.length > a.length) throw Error("Futureshifted cost exceeds the six source positions");
  n.forEach((o, i) => {
    const l = de(t) === "full-art" && i > 0 && i < 3, d = l || de(t) === "regular" && i < 4, c = d ? /^[WUBRG]$/.test(o) ? 37.125 : 38.125 : 59 * 488 / 744, u = l ? [79.0376, 58.6102, 56.1465] : [78.1626, 59.4852, 51.6465, 51.6465], h = l ? [113.101, 161.7009, 217.5071] : [111.851, 154.0759, 202.5071, 252.3427], m = d ? u[i] - c / 2 : a[i] * 488 / 744, g = d ? h[i] - c / 2 : s[i] * 680 / 1039, f = J0(o), b = f ? r.get(f) : void 0;
    if (f && !b) throw Error(`Futureshifted mana asset unavailable: ${f}`);
    b ? (e.drawImage(b, m, g, c, c), /^(?:\d+|X)$/.test(o) && (e.save(), e.translate(m + c / 2 - 0.75 * c / 38.125, g + c / 2 + 1.75 * c / 38.125), e.scale(0.9375, 1), e.font = `700 ${c * 31.25 / 38.125}px "CardRenderer MTG MPlantin"`, e.fillStyle = "#111", e.textAlign = "center", e.textBaseline = "middle", e.fillText(o, 0, 0, c * 0.73), e.restore())) : te(e, o, m, g, c, r, !1);
  });
}
const ts = K.MSE_TEMPLATE_ROOT, fa = {
  future: {
    size: [375, 523],
    style: "magic-future.mse-style",
    title: [73, 30, 269, 26],
    art: [32, 44, 327, 310],
    type: [49, 300, 279, 20],
    rules: [42, 332, 291, 134],
    stats: [287, 469, 60, 28],
    footer: [30, 475, 245, 27],
    symbol: [331, 302, 22, 22],
    titleSize: 18,
    typeSize: 14,
    rulesSize: 13,
    minimumSize: 6
  },
  flip: {
    size: [375, 523],
    style: "magic-new-flip.mse-style",
    title: [32, 30, 311, 23],
    art: [32, 162, 311, 182],
    type: [33, 134, 310, 18],
    rules: [37, 59, 302, 67],
    stats: [290, 130, 60, 28],
    footer: [58, 479, 217, 26],
    symbol: [309, 482, 44, 22],
    titleSize: 17,
    typeSize: 14,
    rulesSize: 14,
    minimumSize: 8
  },
  battle: {
    size: [523, 375],
    style: "magic-m15-mainframe-battles.mse-style",
    title: [67, 21, 410, 22],
    art: [41, 15, 467, 345],
    type: [67, 219, 366, 22],
    rules: [69, 254, 400, 96],
    stats: [480, 336, 22, 24],
    footer: [20, 350, 420, 20],
    symbol: [441, 220, 44, 22],
    titleSize: 16,
    typeSize: 13,
    rulesSize: 14,
    minimumSize: 6
  }
};
function rs(e) {
  const t = L(e);
  return /\bLand\b/.test(e.typeLine ?? "") || e.land ? (t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c") + "l" : /\bArtifact\b/.test(e.typeLine ?? "") || e.artifact ? "a" : t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "c";
}
function pa(e) {
  if (!e.frameTemplate) return null;
  const t = e.frameTemplate, r = fa[t];
  if (!r) throw Error("Unknown standard frame template");
  if (e.frameAssetFamily) throw Error("Choose one frame template or plate family");
  if (t === "future") return Je(e);
  const a = `${ts}/${r.style}`, s = rs(t === "flip" ? e.faces?.[0] ?? e : e);
  if (t === "battle")
    return {
      kind: t,
      base: `${a}/cards/${s.replace(/l$/, "")}card.png`,
      defense: `${ts}/magic-modules.mse-include/loyalty/defense.png`,
      texture: `${a}/cards/texture/${s.replace(/l$/, "")}card.png`,
      border: `${a}/border.png`
    };
  const n = `${a}/${s}card.jpg`;
  if (t === "flip") {
    const o = e.faces?.[1] ?? e, i = e.faces?.[0] ?? e, l = rs(o);
    return {
      kind: t,
      base: n,
      reverse: `${a}/${l}card.jpg`,
      ...i.power != null && i.toughness != null ? { stats: `${a}/${s}pt.jpg`, statsMask: `${a}/mask_pt.png` } : {},
      ...o.power != null && o.toughness != null ? {
        reverseStats: `${a}/${l}pt2.jpg`,
        reverseStatsMask: `${a}/mask_pt2.png`
      } : {}
    };
  }
  throw Error("Unknown standard template asset branch");
}
function I3(e) {
  const t = pa(e);
  if (!t) return [];
  const { kind: r, ...a } = t;
  return [
    ...Object.values(a).filter((s) => typeof s == "string"),
    ...e.frameTemplate === "future" ? T3(e) : []
  ];
}
function E3(e) {
  if (!e.frameTemplate) return null;
  if (e.frameTemplate === "future") {
    const a = la(e), s = (n) => [n[0] / 488, n[1] / 680, n[2] / 488, n[3] / 680];
    return {
      ...J,
      frame: [0, 0, 1, 1],
      title: s(a.title),
      art: s(a.art),
      type: s(a.type),
      rules: s(a.rules),
      stats: s(a.stats),
      footer: s(a.footer)
    };
  }
  const t = fa[e.frameTemplate];
  if (!t) throw Error("Unknown standard frame template");
  const r = (a) => {
    const [s, n, o, i] = a, [l, d] = t.size;
    return e.frameTemplate === "battle" ? [n / d, 1 - (s + o) / l, i / d, o / l] : [s / l, n / d, o / l, i / d];
  };
  return {
    ...J,
    frame: [0, 0, 1, 1],
    title: r(t.title),
    art: r(t.art),
    type: r(t.type),
    rules: r(t.rules),
    stats: r(t.stats),
    footer: r(t.footer)
  };
}
function We(e) {
  return e.securityStamp !== void 0 ? e.securityStamp === "oval" : !ae(e) && e.frameAssetFamily !== "eighth" && ["rare", "mythic"].includes(e.rarity ?? "");
}
const Kn = `${B}/img/frames/m15/holoStamps/stamp.png`, B0 = 310.216, as = {
  frame: [52, 20, 298, 449],
  title: [70, 40, 261, 26],
  art: [65, 76.5, 270, 183.8],
  type: [70, 265, 261, 23],
  rules: [74, 301, 255, 160],
  artistY: 0,
  legalY: 0
}, A3 = `${B}/img/frames/m15/split`, ss = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style", Vn = [
  `${ss}/namebox/texture/normal/c.png`,
  `${ss}/typebox/texture/normal/c.png`
], ba = (e) => `${A3}${e.layout?.endsWith("-fuse") ? "/fuse" : ""}`;
function Sa(e) {
  const t = L(e);
  return `${ba(e)}/${t.length > 1 ? "m" : t[0]?.toLowerCase() ?? "a"}.png`;
}
function Zn(e) {
  const t = e.manaSymbols ?? [];
  return t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function Qn(e) {
  const t = L(e);
  return [
    Sa(e),
    ...t.length === 2 ? t.map((r) => `${ba(e)}/${r.toLowerCase()}.png`) : [],
    ...t.length === 2 && Zn(e) ? Vn : [],
    ...We(e) ? [Kn] : []
  ];
}
const yt = /* @__PURE__ */ new Map(), dr = /* @__PURE__ */ new WeakMap();
let B3 = 0, cr = 0;
const L3 = (e) => (dr.has(e) || dr.set(e, ++B3), dr.get(e));
function b0(e, t, r, a, s, n) {
  e.moveTo(t + n, r), e.lineTo(t + a - n, r), e.quadraticCurveTo(t + a + n * 0.25, r + s / 2, t + a - n, r + s), e.lineTo(t + n, r + s), e.quadraticCurveTo(t - n * 0.25, r + s / 2, t + n, r), e.closePath();
}
function G3(e, t) {
  const r = (g) => {
    const f = t.get(g);
    if (!f) throw Error(`Modern split asset unavailable: ${g}`);
    return f;
  }, a = r(Sa(e)), s = L(e);
  if (s.length !== 2) return a;
  "WUBRG".indexOf(s[1]) - "WUBRG".indexOf(s[0]) > 2 && s.reverse();
  const n = Zn(e), o = [
    ...s.map((g) => r(`${ba(e)}/${g.toLowerCase()}.png`)),
    ...n ? Vn.map(r) : [a]
  ], i = s.join("") + (n ? "-hybrid-" : "-gold-") + [a, ...o].map(L3).join("/"), l = yt.get(i);
  if (l)
    return yt.delete(i), yt.set(i, l), l;
  const d = document.createElement("canvas");
  d.width = a.width, d.height = a.height;
  const c = d.getContext("2d");
  c.scale(d.width / 488, d.height / 680), c.translate(0, 680), c.rotate(-Math.PI / 2);
  const u = (g) => {
    c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(g, 0, 0, 488, 680), c.restore();
  }, h = e.layout?.endsWith("-fuse") ?? !1;
  u(a);
  for (const g of [0, B0]) {
    if (c.save(), c.beginPath(), n ? c.rect(g + 50, 0, B0, 488) : (b0(c, g + 57.5, 29, 286, 47, 9), c.rect(g + 64, 74, 273, h ? 362 : 394), b0(c, g + 57.5, 260, 286, 34, 7)), h)
      for (const [p, S] of [
        [29, 47],
        [260, 34]
      ])
        c.moveTo(334, p), c.lineTo(356, p + S / 2), c.lineTo(378, p), c.lineTo(378, p + S), c.lineTo(356, p + S / 2), c.lineTo(334, p + S), c.closePath();
    c.clip(), u(o[0]);
    const f = document.createElement("canvas");
    f.width = d.width, f.height = d.height;
    const b = f.getContext("2d");
    b.drawImage(o[1], 0, 0, f.width, f.height), b.globalCompositeOperation = "destination-in";
    const w = b.createLinearGradient(
      0,
      (680 - g - 175) / 680 * f.height,
      0,
      (680 - g - 230) / 680 * f.height
    );
    if (w.addColorStop(0, "#0000"), w.addColorStop(1, "#000"), b.fillStyle = w, b.fillRect(0, 0, f.width, f.height), c.save(), c.translate(680, 0), c.rotate(Math.PI / 2), c.drawImage(f, 0, 0, 488, 680), c.restore(), c.restore(), f.width = f.height = 0, c.save(), c.beginPath(), b0(c, g + 62.5, 34.5, 276, 37.5, 7), b0(c, g + 62.5, 265, 276, 24, 5), h)
      for (const [p, S] of [
        [35, 37],
        [265, 24]
      ])
        c.moveTo(332, p), c.lineTo(349, p + S / 2), c.lineTo(332, p + S), c.closePath(), c.moveTo(380, p), c.lineTo(363, p + S / 2), c.lineTo(380, p + S), c.closePath();
    c.clip(), n ? (c.drawImage(o[2], 22, 7, 196, 19, g + 62.5, 34.5, 276, 37.5), c.drawImage(o[3], 22, 192, 196, 11, g + 62.5, 265, 276, 24)) : u(o[2]), c.restore();
  }
  const m = d.width * d.height * 4;
  for (const [g, f] of yt) {
    if (cr + m <= 16 * 1024 * 1024) break;
    cr -= f.width * f.height * 4, yt.delete(g), f.width = f.height = 0;
  }
  return m <= 16 * 1024 * 1024 && (yt.set(i, d), cr += m), d;
}
function ft(e) {
  return ["split", "aftermath"].includes(e.layout ?? "") && e.faces?.length === 2 && (e.layout === "aftermath" || /^Aftermath\b/m.test(e.faces[1].rulesText ?? ""));
}
const ct = 373, e1 = 257, t1 = `${B}/img/frames/saga/stamp.png`;
function r1(e) {
  const t = L(e), r = t.length > 1 ? "m" : t[0]?.toLowerCase();
  if (!r) throw Error("No validated colorless Aftermath plate is available.");
  return `${B}/img/frames/m15/aftermath/${r}.png`;
}
function a1(e) {
  return ft(e) ? [
    ...e.faces.map(r1),
    ...We(e) ? [t1] : []
  ] : [];
}
const wa = {
  title: [41.7, 35.5, 405, 37],
  art: [37.4, 76.5, 413.2, 151.8],
  type: [41.7, 235.8, 405, 37],
  rules: [41.7, 281.5, 405, 76]
}, ya = {
  title: [12, 37.5, 227, 37],
  art: [11, 80.7, 240.9, 137.9],
  // Align the rotated type plate in its reading orientation (all type labels).
  type: [9, 226.2, 230, 37],
  rules: [14, 276.5, 232, 169]
};
function $3(e) {
  const t = e ? ya : wa, r = e ? e1 : 488, a = e ? 488 : ct, s = (n) => {
    const [o, i, l, d] = t[n];
    return [o / r, i / a, l / r, d / a];
  };
  return {
    ...J,
    title: s("title"),
    art: s("art"),
    type: s("type"),
    rules: s("rules"),
    footer: [0, 1, 0, 0]
  };
}
const s1 = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data", O3 = new Set("dis plc cmd pc2 dgm mma c13".split(" "));
function Pe(e) {
  return e.layout !== "split" || e.faces?.length !== 2 || ft(e) || e.faces.some(
    (t) => !/^(Instant|Sorcery)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "")
  ) ? null : ae({ ...e, layout: "normal", frameStyle: e.frameStyle ?? e.faces[0]?.frameStyle }) ? "old" : e.frameAssetFamily === "eighth" || O3.has(e.setCode?.toLowerCase() ?? "") ? "eighth" : "m15";
}
function Lt(e) {
  const t = (r) => [
    r.rulesText ?? "",
    ...(r.rulesParagraphs ?? []).map((a) => a.runs.map((s) => s.text).join(""))
  ];
  return [e, ...e.faces ?? []].some((r) => t(r).some((a) => /^Fuse\b/m.test(a)));
}
const n1 = 251 * 680 / 523, ns = 680 / 523, L0 = 488 / 375, lt = (e, t, r, a) => [
  e * ns,
  t * L0,
  r * ns,
  a * L0
];
function Ut(e, t) {
  if (e === "m15")
    return t ? { ...as, rules: [74, 301, 255, 128] } : as;
  const r = e === "old";
  return {
    frame: lt(18, 18, t ? 244 : 236, 338),
    title: lt(r ? 35 : 30, r ? 23 : 28, r ? 207 : 214, 21),
    art: r ? lt(37, 47, 197, 130) : lt(27, 56, 217, 152),
    type: lt(r ? 35 : 30, r ? 182 : 211, 210, r ? 21 : 17),
    rules: r ? lt(43, 207, 187, 109) : lt(30, 233, 213, t ? 74 : 95),
    artistY: (r ? 332 : t ? 344 : 339) * L0,
    legalY: (r ? 347 : 354) * L0
  };
}
function P3(e) {
  const t = e.layout?.startsWith("split-old") ? "old" : e.layout?.startsWith("split-m15") ? "m15" : "eighth", r = t === "m15" ? B0 : n1, a = Ut(t, e.layout?.endsWith("-fuse") ?? !1), s = (n) => [
    n[0] / r,
    n[1] / 488,
    n[2] / r,
    n[3] / 488
  ];
  return {
    ...J,
    frame: s(a.frame),
    title: s(a.title),
    art: s(a.art),
    type: s(a.type),
    rules: s(a.rules),
    footer: [0, 1, 0, 0]
  };
}
function G0(e, t, r, a) {
  if (t === "m15") return Sa(e);
  const s = L(e), n = s.length > 1 ? "m" : s[0]?.toLowerCase() ?? "c";
  return `${s1}/${t === "old" ? "magic-old-split" : r ? "magic-new-split-fuse" : "magic-new-split"}.mse-style/${n}card${r ? a + 1 : ""}.${r ? "png" : "jpg"}`;
}
function o1(e) {
  for (const t of [e, ...e.faces ?? []]) {
    const r = t.rulesParagraphs?.find(
      (s) => /^Fuse\b/.test(s.runs.map((n) => n.text).join(""))
    );
    if (r) return [r];
    const a = t.rulesText?.split(`
`).find((s) => /^Fuse\b/.test(s));
    if (a) return [{ role: "rules", runs: [{ text: a }] }];
  }
  return [];
}
const S0 = `${B}/img/frames/saga`, i1 = [
  `${S0}/sagaMaskPinline.png`,
  `${S0}/sagaMaskBanner.png`,
  `${S0}/sagaMaskBannerRight.png`,
  `${S0}/sagaMidStripe.png`
];
function l1(e) {
  const t = L(e);
  return t.length !== 2 || e.layout === "transform" || e.land || /\bLand\b/.test(e.typeLine ?? "") ? [] : ("WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t.map(
    (r) => `${B}/data/images/cardImages/saga/sagaFrame${r}.png`
  ));
}
function W3(e) {
  const t = l1(e);
  return t.length ? [...t, ...i1] : [];
}
const os = /* @__PURE__ */ new WeakMap();
function F3(e, t, r) {
  const a = l1(t);
  if (!a.length) return;
  const s = [...a, ...i1].map((y) => {
    const k = r.get(y);
    if (!k) throw Error(`Saga color asset unavailable: ${y}`);
    return k;
  }), n = os.get(s[0]);
  if (n && n.sources.every((y, k) => y === s[k])) {
    e.drawImage(n.canvas, 0, 0, 488, 680);
    return;
  }
  const [o, i, l, d, c, u] = s, h = document.createElement("canvas");
  h.width = o.width, h.height = o.height;
  const m = document.createElement("canvas");
  m.width = h.width, m.height = h.height;
  const g = document.createElement("canvas");
  g.width = h.width, g.height = h.height;
  const f = h.getContext("2d"), b = m.getContext("2d"), w = g.getContext("2d"), p = h.width, S = h.height;
  w.drawImage(l, 0, 0, p, S), w.drawImage(d, 0, 0, p, S), f.drawImage(o, 0, 0, p, S), f.globalCompositeOperation = "destination-in", f.drawImage(g, 0, 0), f.globalCompositeOperation = "source-over", w.clearRect(0, 0, p, S), w.save(), w.beginPath(), w.rect(p / 2, 0, p / 2, S), w.clip(), w.drawImage(l, 0, 0, p, S), w.restore(), w.drawImage(c, 0, 0, p, S), b.drawImage(i, 0, 0, p, S), b.globalCompositeOperation = "destination-in", b.drawImage(g, 0, 0), f.drawImage(m, 0, 0), f.drawImage(u, 0.0727 * p, 0.3058 * S, 87e-4 * p, 0.4762 * S), os.set(o, { sources: s, canvas: h }), m.width = m.height = g.width = g.height = 0, e.drawImage(h, 0, 0, 488, 680);
}
const o0 = `${B}/img/frames/saga`;
function ka(e) {
  const t = L(e), r = t.length > 1 ? "M" : t[0];
  if (/\bLand\b/.test(e.typeLine ?? "") || e.land) return `${o0}/regular/l.png`;
  if (e.layout === "transform" && r) return `${o0}/dfc/${r.toLowerCase()}.png`;
  if (r) return `${B}/data/images/cardImages/saga/sagaFrame${r}.png`;
  throw Error("No ordinary colorless or artifact Saga plate is available.");
}
function Br(e) {
  return e.layout === "transform" && e.setCode?.toLowerCase() === "neo" ? `${B}/img/frames/m15/transform/icons/fanClosed.svg` : null;
}
const d1 = `${o0}/sagaChapter.png`, c1 = `${o0}/sagaDivider.png`, u0 = `${o0}/stamp.png`, Oe = {
  shape: "chapter",
  x: 18.8,
  width: 38.4,
  height: 42.8,
  centerX: 38.1,
  numeralOffsetY: 0.7,
  gap: 49,
  fontSize: 22,
  fontFamily: "CardRenderer MTG Chapter",
  minimumRowHeight: 55
};
function U3(e) {
  return [
    ka(e),
    ...W3(e),
    d1,
    c1,
    ...Br(e) ? [Br(e)] : [],
    ...We(e) ? [u0] : []
  ];
}
const u1 = {
  ...J,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.5007, 0.1134, 0.4233, 0.724],
  type: [0.0854, 0.8481, 0.8292, 0.0543],
  rules: [0.0867, 0.1129, 0.404, 0.7248],
  stamp: [0.17, 0.48, 0.23, 0.16506]
}, mt = `${B}/img/frames/adventure/regular`, h1 = `${mt}/bookLeft.png`, m1 = `${mt}/pinline.svg`, g1 = "https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style/namebox/texture/normal/c.png", h0 = (e) => e.layout === "adventure" && e.faces?.length === 2;
function Xe(e) {
  const t = e.manaSymbols ?? [];
  return L(e).length === 2 && t.some((r) => /^[WUBRG]\/[WUBRG]$/.test(r)) && !t.some((r) => /^[WUBRG]$/.test(r));
}
function va(e) {
  const t = O(e), r = L(e);
  return t.land ? "l" : t.artifact ? "a" : r.length > 1 ? "m" : r[0]?.toLowerCase() ?? "a";
}
const $0 = (e) => `${mt}/${va(e)}.png`;
function ja(e) {
  const t = Xe(e) ? "W" : va(e).toUpperCase();
  return `${B}/img/frames/m15/regular/m15PT${t === "L" ? "C" : t}.png`;
}
const f1 = (e) => `${B}/img/frames/m15/crowns/m15Crown${va(e).toUpperCase()}.png`;
function p1(e) {
  const t = e.faces?.[1];
  if (!h0(e) || !t) throw Error("Adventure needs a permanent and an inset spell.");
  const r = (a) => {
    const s = L(a);
    return [
      $0(a),
      ...s.length === 2 ? s.map((n) => `${mt}/${n.toLowerCase()}.png`) : []
    ];
  };
  return [
    .../* @__PURE__ */ new Set([
      ...r(e),
      ...r(t),
      h1,
      ...L(e).length === 2 && !Xe(e) ? [m1] : [],
      ...Xe(e) ? [g1] : [],
      ...O(e).legendary ? [f1(e)] : [],
      ...e.power != null && e.toughness != null ? [ja(e)] : [],
      ...We(e) ? [u0] : []
    ])
  ];
}
const Ca = {
  ...J,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.5267, 0.65, 0.3867, 0.2647],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.58, 0.74, 0.25, 0.1794]
}, K0 = `${B}/img/frames/prepare/regular`, V0 = (e) => e.layout === "prepare";
function _t(e) {
  if (e.faces?.length !== 2) throw Error("Prepared needs a creature and an inset spell.");
  return e.faces[1];
}
function Ra(e) {
  const t = O(e), r = L(e);
  if (t.land) return "l";
  if (/\bVehicle\b/.test(e.typeLine ?? "")) return "v";
  if (t.artifact) return "a";
  if (r.length > 1) return "m";
  if (r.length) return r[0].toLowerCase();
  throw Error("The pinned Prepared source has no colorless plate.");
}
const xt = (e) => `${K0}/${Ra(e)}.png`, C0 = (e) => `${K0}/${e}.png`;
function Mt(e) {
  const t = L(e);
  return t.length === 2 && "WUBRG".indexOf(t[1]) - "WUBRG".indexOf(t[0]) > 2 && t.reverse(), t;
}
const Lr = (e) => `${B}/img/frames/m15/crowns/m15Crown${e.toUpperCase()}.png`, _3 = (e) => ja(e);
function b1(e) {
  const t = _t(e), r = (s) => Mt(s).length === 2 ? Mt(s).map((n) => `${K0}/${n.toLowerCase()}.png`) : [], a = Mt(e);
  return [
    .../* @__PURE__ */ new Set([
      xt(e),
      xt(t),
      C0("prepare"),
      ...r(e),
      ...r(t),
      ...a.length === 2 ? ["pinline", "rules", "rulesRight"].map(C0) : [],
      ...Mt(t).length === 2 ? ["prepareRight", "prepareTypeTitle"].map(C0) : [],
      ...O(e).legendary ? (a.length === 2 ? a : [Ra(e)]).map(Lr) : [],
      ...e.power != null && e.toughness != null ? [_3(e)] : [],
      ...We(e) ? [u0] : []
    ])
  ];
}
const Ma = {
  ...J,
  background: [0, 0, 1, 1],
  frame: [0, 0, 1, 1],
  title: [0.0854, 0.0522, 0.8292, 0.0543],
  art: [0.0767, 0.1129, 0.8476, 0.4429],
  type: [0.0854, 0.5664, 0.8292, 0.0543],
  rules: [0.086, 0.6303, 808 / 2010, 0.2875],
  stats: [0.7573, 0.8848, 0.188, 0.0733],
  stamp: [0.17, 0.72, 0.25, 0.1794]
}, N3 = {
  title: [1042 / 2010, 0.6391, 0.4, 0.0296],
  type: [1042 / 2010, 1932 / 2814, 0.4, 0.0296],
  rules: [1035 / 2010 + 2 / 488, 2059 / 2814, 0.3947, 438 / 2814]
}, z3 = [
  [
    [84, 53],
    [86, 52],
    [87, 50],
    [88, 48],
    [89, 47],
    [90, 46],
    [91, 45],
    [92, 44],
    [93, 44],
    [94, 43],
    [95, 43],
    [106, 41],
    [126, 37],
    [146, 34],
    [166, 31],
    [186, 28],
    [206, 26],
    [226, 25],
    [246, 24],
    [266, 23],
    [286, 22],
    [306, 22],
    [326, 21],
    [346, 21],
    [366, 21],
    [386, 22],
    [406, 22],
    [426, 22],
    [446, 23],
    [466, 24],
    [486, 24],
    [506, 25],
    [526, 27],
    [546, 29],
    [566, 32],
    [586, 36],
    [606, 40],
    [611, 42],
    [612, 43],
    [613, 43],
    [614, 44],
    [615, 44],
    [616, 45],
    [617, 46],
    [618, 47],
    [619, 48],
    [620, 50],
    [622, 53]
  ],
  [
    [84, 53],
    [86, 52],
    [87, 50],
    [88, 48],
    [89, 47],
    [90, 46],
    [91, 45],
    [92, 44],
    [93, 44],
    [94, 43],
    [95, 43],
    [106, 41],
    [126, 37],
    [146, 34],
    [166, 31],
    [186, 28],
    [206, 26],
    [226, 24],
    [246, 23],
    [266, 22],
    [286, 22],
    [306, 21],
    [326, 21],
    [346, 22],
    [366, 22],
    [386, 23],
    [406, 24],
    [426, 25],
    [446, 27],
    [466, 29],
    [486, 32],
    [506, 36],
    [526, 41],
    [530, 42],
    [531, 42],
    [532, 43],
    [533, 43],
    [534, 44],
    [535, 45],
    [536, 46],
    [537, 47],
    [538, 48],
    [539, 50],
    [541, 53]
  ]
], tt = 0.91339 * j / 768, Gr = 0.04724 * j, $r = 0.02655 * T;
function Y3(e) {
  return [
    (Gr + 20 * tt) / j,
    ($r + 84 * tt) / T,
    728 * tt / j,
    ((e ? 541 : 622) - 84) * tt / T
  ];
}
function q3(e, t) {
  const r = z3[t ? 1 : 0];
  e.beginPath(), r.forEach(([a, s], n) => {
    const o = Gr + (s - 1) * tt, i = $r + a * tt;
    n === 0 ? e.moveTo(o, i) : e.lineTo(o, i);
  });
  for (let a = r.length - 1; a >= 0; a--) {
    const [s, n] = r[a];
    e.lineTo(Gr + (769 - n) * tt, $r + s * tt);
  }
  e.closePath(), e.clip();
}
function m0(e) {
  const t = e.layout === "saga" || /\bSaga\b/i.test(e.canonicalTypeLine ?? e.typeLine ?? "");
  return (t ? (e.rulesText ?? "").replace(/\|(?=\s*[IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*\s*[—–-]\s)/g, `
`) : e.rulesText ?? "").split(`
`).filter((a) => a.trim()).map((a) => {
    const s = t ? a.match(/^\s*([IVXLCDM]+(?:\s*,\s*[IVXLCDM]+)*)\s*[—–-]\s*(.+)$/) : null;
    if (s)
      return { text: s[2], badges: s[1].split(/\s*,\s*/), reminder: !1 };
    const n = t ? null : a.match(/^\s*\[?([+−-]?(?:\d+|X))\]?\s*:\s*(.*)$/i);
    return n ? {
      text: n[2],
      badges: [n[1].replace("-", "−").toUpperCase()],
      reminder: !1
    } : { text: a, badges: [], reminder: t && /^\s*\(/.test(a) };
  });
}
function ee(e) {
  return e.layout === "ability" ? "normal" : e.layout === "prepare" ? "prepare" : e.layout === "adventure" && e.faces?.length === 2 ? "adventure" : e.layout === "class" || /\bClass\b/i.test(e.canonicalTypeLine ?? e.typeLine ?? "") ? "class" : e.layout === "leveler" || /^Level up\b/m.test(e.rulesText ?? "") ? "leveler" : e.layout === "saga" || /\bSaga\b/i.test(e.canonicalTypeLine ?? e.typeLine ?? "") ? "saga" : e.layout === "planeswalker" || /\bPlaneswalker\b/i.test(e.canonicalTypeLine ?? e.typeLine ?? "") ? m0(e).length > 3 ? "planeswalker-large" : "planeswalker" : "normal";
}
function Be(e) {
  const t = E3(e);
  if (t) return t;
  if (e.layout === "aftermath-top" || e.layout === "aftermath-bottom")
    return $3(e.layout === "aftermath-bottom");
  if (/^split-(old|eighth|m15)(-fuse)?$/.test(e.layout ?? "")) return P3(e);
  const r = ke(e);
  if (r) return r.rects;
  if (ae(e)) return ta(e);
  const a = ee(e);
  if (a === "adventure") return Ca;
  if (a === "prepare") return Ma;
  if (a === "class")
    return {
      ...J,
      background: [0.03937, 2.5 / 88.9, 0.92126, 0.93926],
      art: [4.3 / 63.5, 10 / 88.9, 27.3 / 63.5, 64.3 / 88.9],
      type: [0.05669, 74.4 / 88.9, 0.88662, 0.05737],
      rules: [31.8 / 63.5, 10.1 / 88.9, 26.4 / 63.5, 63.65 / 88.9],
      stamp: [0.57, 0.55, 0.25, 0.1794]
    };
  if (a === "saga") return u1;
  if (a.startsWith("planeswalker")) {
    const s = a === "planeswalker-large", n = [
      0.04409,
      s ? 0.55118 : 0.62655,
      0.88827,
      s ? 0.37534 : 0.29997
    ], o = J.stamp[2], i = J.stamp[3];
    return {
      ...J,
      // Preserve the complete lower curve in the pinned 2778x3793 background
      // and 2736x3810 frame. Ordinary-face heights cut both off near the paper.
      background: [0.03937, 0.02531, 0.92126, 0.92126 * j * 3793 / 2778 / T],
      frame: [0.04724, 0.02655, 0.91339, 0.91339 * j * 3810 / 2736 / T],
      art: Y3(s),
      title: [0.05669, 0.03375, 0.88662, 0.05737],
      type: [
        0.05669 + 1.5 / j,
        (s ? 0.49044 : 0.55793) + 5 / T,
        0.88662,
        0.05737
      ],
      rules: n,
      stats: [0.792 + 1 / j, 0.881 - 3 / T, 0.16, 0.069],
      stamp: [
        n[0] + (n[2] - o) / 2,
        n[1] + (n[3] - i) / 2,
        o,
        i
      ]
    };
  }
  return e.layout === "split-half" ? {
    ...J,
    background: [0.03937, 0.02531, 0.92126, 0.94],
    frame: [0.04858, 0.03937, 0.90284, 0.93],
    title: [0.05669, 0.045, 0.88662, 0.09],
    art: [0.06929, 0.14, 0.86142, 0.38],
    type: [0.05669, 0.525, 0.88662, 0.07],
    rules: [0.07638, 0.605, 0.84724, 0.32]
  } : { ...J, art: Ai(e) };
}
function H3(e) {
  const t = ee(e) === "saga", r = Be(e).rules, a = m0(e), s = r[2] * 488 - (t ? 32 : 70), n = r[3] * 680;
  let o = t ? 21 : 19;
  const i = (b, w) => Math.max(1, Math.ceil(b.length * w * 0.49 / s)), l = (b, w) => Math.max(t ? b.badges.length * 36 : 34, i(b.text, w) * w + 16), d = (b) => a.reduce((w, p) => w + l(p, b), 0);
  for (; o > 8 && d(o) > n; ) o -= 0.5;
  const c = a.map((b) => l(b, o)), u = Math.max(0, n - d(o)) / Math.max(1, a.length);
  let h = n / Math.max(1, a.length), m = n, g = a.length;
  if (!t)
    for (const b of [...c].sort((w, p) => p - w)) {
      if (b <= h) break;
      m -= b, h = m / Math.max(1, --g);
    }
  let f = 0;
  return a.map((b, w) => {
    const p = t ? c[w] + u : Math.max(h, c[w]), S = { ...b, top: f, height: p, font: o, left: t ? 27 : 62, width: s };
    return f += p, S;
  });
}
const xa = {
  azorius: ["W", "U"],
  dimir: ["U", "B"],
  rakdos: ["B", "R"],
  gruul: ["R", "G"],
  selesnya: ["G", "W"],
  orzhov: ["W", "B"],
  izzet: ["U", "R"],
  golgari: ["B", "G"],
  boros: ["R", "W"],
  simic: ["G", "U"]
};
function X3(e, t) {
  if (t.watermark) return t.watermark;
  if (e.watermark) return e.watermark;
  const r = [...new Set(e.faces?.map((n) => n.watermark).filter(Boolean))];
  if (r.length !== 1) return t.watermark;
  const a = xa[r[0]], s = new Set(e.faces?.flatMap(L));
  return a && s.size === 2 && a.every((n) => s.has(n)) ? r[0] : t.watermark;
}
function Or(e) {
  return e.watermark && Object.hasOwn(xa, e.watermark) ? `${B}/img/watermarks/guild-${e.watermark}.svg` : null;
}
function S1(e, t) {
  return `${s1}/magic-new-split${e ? "-fuse" : ""}.mse-style/multicolor_blend_card${e ? t + 1 : ""}.png`;
}
function J3(e, t, r, a) {
  if (t === "m15") return [...Qn(e), Or(e)];
  const s = L(e);
  return [
    G0(e, t, r, a),
    Or(e),
    ...t === "eighth" && s.length === 2 ? [
      S1(r, a),
      ...s.map(
        (n) => G0({ ...e, colors: [n], frameColors: void 0 }, t, r, a)
      )
    ] : [],
    ...t === "eighth" && e.artist ? [`${B}/img/manaSymbols/brush.svg`] : []
  ];
}
const is = /* @__PURE__ */ new WeakMap();
function w1(e) {
  const t = is.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d", { willReadFrequently: !0 });
  a.drawImage(e, 0, 0);
  const s = a.getImageData(0, 0, r.width, r.height);
  for (let n = 0; n < s.data.length; n += 4) s.data[n + 3] = s.data[n];
  return a.putImageData(s, 0, 0), is.set(e, r), r;
}
const ls = /* @__PURE__ */ new WeakMap();
function K3(e, t, r, a, s) {
  const n = (S) => {
    const y = s.get(S);
    if (!y) throw Error(`Split asset unavailable: ${S}`);
    return y;
  }, o = n(G0(e, t, r, a)), i = L(e);
  if (t !== "eighth" || i.length !== 2) return o;
  "WUBRG".indexOf(i[1]) - "WUBRG".indexOf(i[0]) > 2 && i.reverse();
  const [l, d] = i.map(
    (S) => n(
      G0({ ...e, colors: [S], frameColors: void 0 }, t, r, a)
    )
  ), c = n(S1(r, a)), u = i.join(""), h = ls.get(o) ?? /* @__PURE__ */ new Map();
  ls.set(o, h);
  const m = h.get(u);
  if (m?.left === l && m.right === d && m.mask === c) return m.canvas;
  const g = document.createElement("canvas");
  g.width = o.width, g.height = o.height;
  const f = document.createElement("canvas");
  f.width = o.width, f.height = o.height;
  const b = g.getContext("2d"), w = f.getContext("2d");
  w.drawImage(d, 0, 0), w.globalCompositeOperation = "destination-in";
  const p = w.createLinearGradient(0, 0, o.width, 0);
  return p.addColorStop(0, "#0000"), p.addColorStop(0.4, "#0000"), p.addColorStop(0.6, "#000"), p.addColorStop(1, "#000"), w.fillStyle = p, w.fillRect(0, 0, o.width, o.height), b.drawImage(l, 0, 0), b.drawImage(f, 0, 0), b.globalCompositeOperation = "destination-in", b.drawImage(w1(c), 0, 0), b.globalCompositeOperation = "destination-over", b.drawImage(o, 0, 0), b.globalCompositeOperation = "source-over", f.width = f.height = 0, h.set(u, { left: l, right: d, mask: c, canvas: g }), g;
}
const ds = /* @__PURE__ */ new WeakMap();
function V3(e, t, r, a) {
  const s = Or(t);
  if (!s) return;
  const n = r.get(s);
  if (!n) throw Error(`Split watermark unavailable: ${s}`);
  const o = L(t), i = o.length === 1 ? [o[0], o[0]] : xa[t.watermark], l = i.join(""), d = ds.get(n) ?? /* @__PURE__ */ new Map();
  ds.set(n, d);
  let c = d.get(l);
  if (!c) {
    c = document.createElement("canvas"), c.width = n.width, c.height = n.height;
    const f = c.getContext("2d");
    f.drawImage(n, 0, 0), f.globalCompositeOperation = "source-in";
    const b = {
      W: "#b39f4d",
      U: "#718dac",
      B: "#998795",
      R: "#b6723f",
      G: "#69936e"
    }, [w, p] = i, S = f.createLinearGradient(0, 0, c.width, 0);
    S.addColorStop(0, b[w]), S.addColorStop(0.499, b[w]), S.addColorStop(0.5, b[p]), S.addColorStop(1, b[p]), f.fillStyle = S, f.fillRect(0, 0, c.width, c.height), d.set(l, c);
  }
  const u = t.layout?.startsWith("split-m15") ?? !1, h = Math.min(
    (u ? 135 : 110) / n.width,
    (u ? 125 : t.setCode?.toLowerCase() === "dgm" ? 75 : 100) / n.height
  ), m = n.width * h, g = n.height * h;
  e.save(), e.globalAlpha = 0.3, e.drawImage(c, (u ? 199.5 : 177) - m / 2, a - g / 2, m, g), e.restore();
}
function De(e) {
  if (e.frameTemplate) return [];
  if (!["split", "aftermath"].includes(e.layout ?? "") || e.faces?.length !== 2) return [];
  const t = ft(e), r = Pe(e), a = r === "m15" ? B0 : n1;
  return e.faces.map((s, n) => {
    const o = t ? 0.615 : 0.5, i = {
      setCode: e.setCode,
      calibration: e.calibration,
      colorCalibration: e.colorCalibration,
      frameStyle: e.frameStyle,
      rarity: e.rarity,
      securityStamp: e.securityStamp,
      artist: e.artist,
      setSymbol: e.setSymbol,
      setSymbolSource: e.setSymbolSource,
      setSymbolMask: e.setSymbolMask,
      ...s,
      watermark: r ? X3(e, s) : s.watermark,
      layout: t ? n === 0 ? "aftermath-top" : "aftermath-bottom" : r ? `split-${r}${Lt(e) && r !== "old" ? "-fuse" : ""}` : "split-half",
      frameAssetFamily: void 0,
      faces: void 0,
      rulesText: s.rulesText?.split(`
`).filter((l) => !/^Fuse\b/.test(l)).join(`
`),
      rulesParagraphs: s.rulesParagraphs?.filter(
        (l) => !/^Fuse\b/.test(l.runs.map((d) => d.text).join(""))
      ),
      illustration: s.illustration ?? e.illustration,
      etchedIllustration: s.etchedIllustration ?? (s.illustration ? void 0 : e.etchedIllustration),
      illustrationCrop: s.illustrationCrop ?? (!s.illustration && e.illustration ? [n ? o : 0, 0, n ? 1 - o : o, 1] : void 0)
    };
    return t ? n === 0 ? { face: i, x: 0, y: 0, width: 488, height: ct, rotation: 0 } : {
      face: i,
      x: 488,
      y: ct,
      width: e1,
      height: 488,
      rotation: 90
    } : r ? {
      face: i,
      x: 0,
      y: 680 - n * a,
      width: a,
      height: 488,
      rotation: -90
    } : {
      face: i,
      x: 5,
      y: (n ? 333 : 648) - (Ta(e) ? 12 : 0),
      width: 333,
      height: 488,
      rotation: -90
    };
  });
}
function U4(e) {
  return {
    left: `${e.x / j * 100}%`,
    top: `${e.y / T * 100}%`,
    width: `${e.width / j * 100}%`,
    height: `${e.height / T * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function y1(e, t) {
  e.translate(t.x, t.y), e.rotate(t.rotation * Math.PI / 180), e.scale(t.width / j, t.width / j);
}
function cs(e, t) {
  const r = t[0] * e.width, a = t[1] * e.height, s = t[2] * e.width, n = t[3] * e.height;
  return e.rotation === -90 ? [
    (e.x + a) / j,
    (e.y - r - s) / T,
    n / j,
    s / T
  ] : e.rotation === 90 ? [
    (e.x - a - n) / j,
    (e.y + r) / T,
    n / j,
    s / T
  ] : [(e.x + r) / j, (e.y + a) / T, s / j, n / T];
}
function Z3(e) {
  return e.layout === "split-half" || e.layout === "aftermath-bottom" ? 1.5 : 1;
}
const Ta = Lt;
function Gt(e) {
  if (ae(e) || e.frameAssetFamily === "eighth" || e.frameTemplate === "future" || e.frameTemplate === "flip")
    return !1;
  const t = Pe(e);
  return !t || t === "m15" || ft(e);
}
function Q3(e) {
  if (!Gt(e)) return { shared: [], stock: [] };
  const t = (a) => ({ shared: [], stock: a });
  if (e.frameAssetFamily === "m15-accurate") {
    const a = ke(e);
    return t(
      a ? [a.frame, ...a.rightFrame ? [a.rightFrame] : [], a.border] : []
    );
  }
  if (e.frameTemplate === "battle") {
    const a = pa(e);
    return t(a?.kind === "battle" ? [a.border] : []);
  }
  if (h0(e))
    return t(
      Xe(e) ? L(e).map((a) => `${mt}/${a.toLowerCase()}.png`) : [$0(e)]
    );
  if (V0(e)) return t([xt(e)]);
  if (ft(e))
    return t(a1(e).filter((a) => a.includes("/aftermath/")));
  if (Pe(e) === "m15")
    return t(
      De(e).flatMap(
        (a) => Qn(a.face).filter((s) => /\/[wubrgma]\.png$/.test(s))
      )
    );
  if (ee(e) === "saga") return t([ka(e)]);
  const r = gt(O(e), ee(e));
  return {
    shared: [
      r.frame,
      r.background,
      r.boxes,
      r.pt,
      ...O(e).legendary ? [r.crown] : []
    ],
    stock: []
  };
}
const e2 = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, t2 = "#16130e", r2 = [22 / 255, 19 / 255, 14 / 255];
function Da(e) {
  const t = rt(e), r = t.calibration, a = { ...t }, s = typeof r == "object";
  if (s && !Gt(t))
    throw Error("M21 calibration requires a modern frame.");
  const n = t.frameAssetFamily ? ke(a) : null, o = r === "source" ? void 0 : (n ? Wt(a, n.frame) : void 0) ?? y3(a), i = r === "source" ? {} : es(a), l = s ? {} : { ...i }, d = [];
  let c = s ? void 0 : o, u = !1;
  if ((r === "auto" || s) && Gt(t)) {
    const h = Q3(t), m = O(t), g = {
      name: "",
      setCode: "M21",
      frameStyle: "modern",
      layout: "normal",
      typeLine: m.land ? "Land" : m.artifact ? "Artifact" : "Creature",
      colors: t.colors,
      frameColors: t.frameColors,
      land: m.land,
      artifact: m.artifact,
      legendary: m.legendary,
      colorCalibration: "set-hsb-v1"
    }, f = new Set(h.shared);
    for (const [b, w] of Object.entries(es(g)))
      !f.has(b) || l[b] || (l[b] = w, d.push(b));
    if (!c && Ie(t.setCode, t.borderColor).border === "#090806") {
      c = t2, u = !0;
      for (const b of h.stock)
        l[b] = { ...l[b] ?? e2, outerStock: r2 };
    }
  }
  return {
    face: t,
    materials: l,
    measured: i,
    border: c,
    fallbackStock: u,
    fallbackAssets: d,
    assets: gt(O(t)),
    explicitProfile: s
  };
}
const k1 = (e) => Da(e).materials, ve = (e) => Da(e).border, v1 = (e, t) => {
  const r = rt(e);
  return r.calibration === "source" ? void 0 : Hn(r, t);
};
function Ia(e, t, r = 1, a = 1) {
  const s = e.illustrationPlacement;
  if (!s) return t;
  if (!s.every(Number.isFinite) || s[2] <= 0 || s[3] <= 0)
    throw Error("Artwork placement requires finite coordinates and positive dimensions");
  return [s[0] * r, s[1] * a, s[2] * r, s[3] * a];
}
function O0(e, t, r, a) {
  return qr(e, t, r, a);
}
function a2(e, t, r, a, s) {
  const n = [a[0] * e, a[1] * t, a[2] * e, a[3] * t];
  return [...n, ...O0(n[2], n[3], r, s)];
}
function j1(e) {
  return e.faces?.length || e.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    e.layout
  ) || e.frameTemplate && e.frameTemplate !== "future" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? "") ? {
    modes: [],
    reason: "Art placement currently requires an ordinary physical face or Futureshifted template."
  } : {
    modes: e.frameTemplate === "future" && e.futureTreatment !== "full-art" ? ["window", "behind-text"] : ["window"]
  };
}
function Ea(e) {
  const t = e.artPlacement;
  if (t !== void 0) {
    if (!t || typeof t != "object" || Array.isArray(t))
      throw Error("Invalid artwork placement");
    if (Object.keys(t).some((r) => !["mode", "focalPoint", "zoom", "paperOpacity"].includes(r)))
      throw Error("Unknown artwork placement option");
    if (!j1(e).modes.includes(t.mode))
      throw Error("This frame does not support the selected art placement.");
    if (t.paperOpacity !== void 0 && (t.mode !== "behind-text" || !Number.isFinite(t.paperOpacity) || t.paperOpacity < 0 || t.paperOpacity > 1))
      throw Error("Paper opacity requires behind-text mode and a value within 0..1");
    qr(1, 1, [0, 0, 1, 1], t);
  }
}
function s2(e, t) {
  const { illustrationPlacement: r, ...a } = e, s = { ...a, artPlacement: structuredClone(t) };
  return Ea(s), s;
}
function _4(e, t, r) {
  if (Ea(e), !Number.isFinite(t) || !Number.isFinite(r) || t <= 0 || r <= 0)
    throw Error("Artwork dimensions must be positive");
  const a = e.illustrationCrop ?? [0, 0, 1, 1], s = Be(e).art, n = Ia(e, s), o = qr(
    t * a[2],
    r * a[3],
    [n[0] * 488, n[1] * 680, n[2] * 488, n[3] * 680],
    e.artPlacement
  );
  return {
    source: a,
    destination: [o[0] / 488, o[1] / 680, o[2] / 488, o[3] / 680],
    aperture: s
  };
}
const R0 = {
  fontSize: 19.5,
  fontFamily: '"CardRenderer MTG Beleren", Georgia',
  fontWeight: 700,
  ink: "#fff",
  numeralOffsetX: -0.5,
  numeralOffsetY: { plus: -0.25, zero: -3.25, minus: -4.5 },
  horizontalInset: 10,
  widthScale: 0.97
};
function n2(e, t, [r, a, s, n]) {
  C1(e, t, 24, r + s / 2, a + n / 2 + 2.5, s * 0.72);
}
function o2(e, t, [r, a, s, n]) {
  const o = R0, i = o.numeralOffsetY[t.startsWith("+") ? "plus" : t === "0" ? "zero" : "minus"];
  C1(
    e,
    t,
    o.fontSize,
    r + s / 2 + o.numeralOffsetX,
    a + n / 2 + i,
    s - o.horizontalInset,
    o.widthScale
  );
}
function C1(e, t, r, a, s, n, o = 1) {
  e.save(), e.fillStyle = R0.ink, e.font = `${R0.fontWeight} ${r}px ${R0.fontFamily}`, e.textAlign = "center", e.textBaseline = "alphabetic", e.letterSpacing = "0px", e.shadowColor = "transparent";
  const i = e.measureText(t), l = Math.min(n, i.width * o), d = Math.min(1, l / Math.max(1, i.width)), c = a + (i.actualBoundingBoxLeft - i.actualBoundingBoxRight) * d / 2, u = s + (i.actualBoundingBoxAscent - i.actualBoundingBoxDescent) / 2;
  e.fillText(t, c, u, l), e.restore();
}
function Pr(e, t) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.letterSpacing = "0px", e.fillStyle = Ie(t.setCode, t.borderColor).ink, e.textBaseline = "alphabetic", e.textAlign = "left", e.font = '11px "CardRenderer MTG Relay", sans-serif', X(
    e,
    t,
    "collector",
    () => e.fillText(Jr(t), 30, 645)
  );
  const r = (t.collectorSetCode ?? t.setCode)?.trim().toUpperCase() ?? "", a = r ? `${r} • ${t.collectorLanguage?.toUpperCase() ?? "EN"}` : "";
  X(e, t, "collector", () => e.fillText(a, 30, 658));
  const s = Xr(t), n = t.power != null && t.toughness != null || t.loyalty != null;
  let o = 30 + e.measureText(a).width + (a ? 7 : 0);
  X(e, t, "artist", () => {
    t.artist && (e.font = '11px "CardRenderer MTG Artist Credit", sans-serif', e.fillText("a", o, 658), o += e.measureText("a").width + 2, e.font = '700 11px "CardRenderer MTG Beleren Small Caps", Georgia', e.fillText(t.artist, o, 658, Math.max(1, (s && n ? 272 : 456) - o)));
  }), s && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', X(e, t, "legal", () => e.fillText(s, 456, n ? 658 : 645, 178))), e.restore();
}
const us = /* @__PURE__ */ new WeakMap();
function i2(e) {
  const t = us.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = r.height = 16;
  try {
    const a = r.getContext("2d", { willReadFrequently: !0 });
    a.drawImage(e, 0, 0, 16, 16);
    const s = a.getImageData(0, 0, 16, 16).data, n = [[], [], []];
    for (let i = 0; i < 16; i++)
      for (let l = 0; l < 16; l++) {
        if (l > 0 && l < 15 && i > 0 && i < 15) continue;
        const d = (i * 16 + l) * 4;
        s[d + 3] < 128 || n.forEach((c, u) => c.push(s[d + u]));
      }
    const o = `rgb(${n.map((i) => i.sort((l, d) => l - d)[Math.floor(i.length / 2)] ?? 128).join(" ")})`;
    return us.set(e, o), o;
  } finally {
    r.width = r.height = 0;
  }
}
function Le(e, t, r, a, s) {
  const [n, o, i, l] = a, d = ee(t);
  if (e.save(), d.startsWith("planeswalker") && q3(e, d === "planeswalker-large"), s === "printing") {
    e.clearRect(n, o, i, l), e.restore();
    return;
  }
  const c = r.get(t.illustration ?? "");
  if ((s === "artwork" || d.startsWith("planeswalker") || t.illustrationPlacement) && (e.fillStyle = c && t.illustrationPlacement ? i2(c) : "#80745c", e.fillRect(n, o, i, l)), !c) {
    e.restore();
    return;
  }
  e.beginPath(), e.rect(n, o, i, l), e.clip();
  const u = Ia(t, a, 488, 680);
  t.illustrationCrop ? e.drawImage(
    c,
    ...a2(
      c.width,
      c.height,
      u,
      t.illustrationCrop,
      t.artPlacement
    )
  ) : e.drawImage(
    c,
    ...O0(c.width, c.height, u, t.artPlacement)
  ), e.restore();
}
const hs = /* @__PURE__ */ new WeakMap();
function M0(e) {
  const t = hs.get(e);
  if (t) return t;
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d", { willReadFrequently: !0 });
  a.drawImage(e, 0, 0);
  const s = a.getImageData(0, 0, r.width, r.height);
  for (let n = 0; n < s.data.length; n += 4)
    s.data[n + 3] = Math.round(s.data[n] * s.data[n + 3] / 255), s.data[n] = s.data[n + 1] = s.data[n + 2] = 255;
  return a.putImageData(s, 0, 0), hs.set(e, r), r;
}
function l2(e) {
  const t = de(e) === "full-art", r = O(e), a = !t && (r.land || de(e) === "regular" && !r.artifact && L(e).length === 0), [s, n, o, i] = t ? [0.9967, 0.9995, -2.125, -0.85] : a ? [0.9976, 0.997, -1.925, -0.3] : [0.9867, 0.9929, 0, -0.175], l = t || a ? [0, 680] : [0, 85, 370, 385, 416, 430, 610, 680], d = t || a ? [0, 0] : [0, 0, 1, 1, 1.45, 1.45, 0, 0];
  return {
    sx: s,
    tx: o,
    source: l,
    target: l.map((c, u) => 340 + (c - 340) * n + i + d[u])
  };
}
function d2(e, t) {
  const r = document.createElement("canvas");
  r.width = e.width, r.height = e.height;
  const a = r.getContext("2d"), s = l2(t), n = e.height / 680;
  try {
    for (let o = 0; o < s.source.length - 1; o++) {
      const i = s.source[o], l = s.source[o + 1], d = s.target[o], c = s.target[o + 1], u = (c - d) / (l - i), h = Math.round(d * n), m = Math.round(c * n);
      a.save(), a.beginPath(), a.rect(0, h, r.width, m - h), a.clip(), a.transform(
        s.sx,
        0,
        0,
        u,
        (244 * (1 - s.sx) + s.tx) * n,
        (d - u * i) * n
      ), a.drawImage(e, 0, 0), a.restore();
    }
    return r;
  } catch (o) {
    throw r.width = r.height = 0, o;
  }
}
function i0(e, t) {
  const r = document.createElement("canvas");
  return r.width = e, r.height = t, r;
}
function c2(e, t) {
  const r = i0(e.width, e.height), a = r.getContext("2d"), s = i0(e.width, e.height), n = s.getContext("2d");
  for (const [o, i] of [e, t].entries()) {
    n.clearRect(0, 0, s.width, s.height), n.globalCompositeOperation = "source-over", n.drawImage(i, 0, 0, s.width, s.height);
    const l = n.createLinearGradient(s.width * 0.4, 0, s.width * 0.6, 0);
    l.addColorStop(0, o ? "#0000" : "#000"), l.addColorStop(1, o ? "#000" : "#0000"), n.globalCompositeOperation = "destination-in", n.fillStyle = l, n.fillRect(0, 0, s.width, s.height), a.globalCompositeOperation = "lighter", a.drawImage(s, 0, 0);
  }
  return s.width = s.height = 0, r;
}
function u2(e, t) {
  const r = Je(e), a = i0(976, 1360), s = a.getContext("2d"), n = (l) => {
    const d = t.get(l);
    if (!d) throw Error(`Futureshifted frame asset unavailable: ${l}`);
    return d;
  }, o = (l, d, c, u) => {
    if (!d) return n(l);
    const h = c2(n(l), n(d));
    if (c && u) {
      const m = h.getContext("2d");
      m.globalCompositeOperation = "destination-in", m.drawImage(M0(n(u)), 0, 0, h.width, h.height), m.globalCompositeOperation = "destination-over", m.drawImage(n(c), 0, 0, h.width, h.height);
    }
    return h;
  }, i = (l, d, c, u, h) => {
    s.drawImage(l, d, c, u, h), l instanceof HTMLCanvasElement && (l.width = l.height = 0);
  };
  try {
    if (s.scale(976 / 375, 1360 / 523), i(
      o(r.base, r.reverseBase, r.neutralBase, r.baseBlend),
      0,
      0,
      375,
      523
    ), r.mask) {
      s.save(), s.globalCompositeOperation = "destination-out";
      const l = de(e) === "full-art";
      if (!l && de(e) !== "clear") {
        const [, m, , g] = la({ ...e, artPlacement: void 0 }).art;
        s.beginPath(), s.rect(0, m * 523 / 680, 375, g * 523 / 680), s.clip();
      }
      const [d, c, u, h] = l ? [37, 46, 322, 418] : [32, 44, 327, 310];
      s.drawImage(M0(n(r.mask)), d, c, u, h), s.restore();
    }
    if (r.paper && i(o(r.paper, r.reversePaper), 23, 320, 335, 152), r.type && i(
      o(r.type, r.reverseType, r.neutralType, r.typeBlend),
      18,
      17,
      339,
      464
    ), e.artPlacement?.mode === "behind-text") {
      s.save(), s.globalCompositeOperation = "destination-out", s.globalAlpha = 1 - (e.artPlacement.paperOpacity ?? 0.8);
      const l = new Path2D("M33 326 C25 350 22 413 37 465 L337 465 C351 450 354 379 344 326 Z");
      s.fill(l), s.restore();
    }
    if (r.stats)
      if (r.statsMask) {
        const l = i0(156, 102), d = l.getContext("2d");
        d.drawImage(n(r.stats), 0, 0, 156, 102), d.globalCompositeOperation = "destination-in", d.drawImage(M0(n(r.statsMask)), 0, 0, 156, 102), i(l, 279, 454, 78, 51);
      } else r.paper ? s.drawImage(n(r.stats), 285, 452, 70, 52) : s.drawImage(n(r.stats), 375 * 0.7621, 523 * 0.8834, 375 * 0.1734, 523 * 0.0781);
    return d2(a, e);
  } finally {
    a.width = a.height = 0;
  }
}
function h2(e, t) {
  const r = i0(e.width, e.height), a = r.getContext("2d");
  return a.fillStyle = "white", de(t) === "clear" || t.artPlacement?.mode === "behind-text" ? a.fillRect(46, 44, 442 * 2, 637 * 2) : (a.fillRect(48, 160, 444 * 2, (de(t) === "full-art" ? 482 : 303) * 2), a.globalCompositeOperation = "destination-out", a.drawImage(e, 0, 0)), r;
}
const Wr = (e, t = !1) => `${t ? "italic " : ""}${e}px "CardRenderer MTG MPlantin", Georgia`;
function m2(e) {
  const t = [];
  let r = [], a = !1;
  const s = () => {
    r.length && (t.push({ pieces: r, space: a }), r = [], a = !1);
  };
  for (const n of e)
    for (const o of q0(n.text))
      if (o.symbol) r.push({ text: o.symbol, symbol: !0, italic: !1 });
      else
        for (const i of o.value.split(/(\n|[^\S\n]+)/).filter(Boolean))
          /^\s+$/.test(i) ? (s(), i === `
` ? (t.push({ pieces: [], space: !1, newline: !0 }), a = !1) : a = !0) : r.push({ text: i, symbol: !1, italic: !!n.italic });
  return s(), t;
}
function dt(e, t, r, a = 1) {
  const s = [];
  for (const n of t) {
    const o = n.symbol ? n : { ...n, text: n.text.replaceAll("­", "") };
    if (!o.text) continue;
    const i = s.at(-1);
    i && !i.symbol && !o.symbol && i.italic === o.italic ? i.text += o.text : s.push({ ...o });
  }
  return s.map((n) => {
    e.font = Wr(r, n.italic);
    const o = e.measureText(n.text);
    return {
      ...n,
      ...n.symbol || a === 1 ? {} : { textWidth: a },
      size: r,
      width: n.symbol ? r * 0.88 : o.width * a,
      ascent: n.symbol ? r * 0.72 : o.actualBoundingBoxAscent,
      descent: n.symbol ? r * 0.08 : o.actualBoundingBoxDescent,
      inkLeft: n.symbol ? r * 0.025 : -o.actualBoundingBoxLeft * a,
      inkRight: n.symbol ? r * 0.825 : o.actualBoundingBoxRight * a
    };
  });
}
function g2(e, t, r, a, s, n = 1) {
  let o = null;
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (!l.symbol)
      for (let d = 0; d < l.text.length; d++) {
        const c = l.text[d] === "—";
        if (l.text[d] !== "­" && !c || ![...r.slice(0, i), { ...l, text: l.text.slice(0, d) }].some(
          (m) => m.text.replaceAll("­", "").length
        ))
          continue;
        const u = [
          ...r.slice(0, i),
          { ...l, text: l.text.slice(0, d) + (c ? "—" : "-") }
        ], h = [{ ...l, text: l.text.slice(d + 1) }, ...r.slice(i + 1)];
        h.some((m) => m.text.replaceAll("­", "").length) && dt(e, [...t, ...u], s, n).reduce((m, g) => m + g.width, 0) <= a && (o = { head: u, tail: h });
      }
  }
  return o;
}
function R1(e, t, r, a, s = 1) {
  const n = [];
  let o = [];
  for (const i of t) {
    if (i.newline) {
      n.push(dt(e, o, a, s)), o = [];
      continue;
    }
    let l = i.pieces, d = o.length && i.space ? [{ text: " ", italic: i.pieces[0]?.italic ?? !1, symbol: !1 }] : [];
    for (; ; ) {
      if (dt(e, [...o, ...d, ...l], a, s).reduce((h, m) => h + m.width, 0) <= r) {
        o.push(...d, ...l);
        break;
      }
      const u = g2(
        e,
        [...o, ...d],
        l,
        r,
        a,
        s
      );
      if (u)
        n.push(dt(e, [...o, ...d, ...u.head], a, s)), o = [], d = [], l = u.tail;
      else if (o.length)
        n.push(dt(e, o, a, s)), o = [], d = [];
      else {
        o.push(...l);
        break;
      }
    }
  }
  return o.length && n.push(dt(e, o, a, s)), n;
}
function ms(e, t, r, a, s = 1) {
  const n = R1(e, t, r, a, s);
  if (n.length < 2) return n;
  const o = /* @__PURE__ */ new Map(), i = (h, m) => {
    const g = `${h}:${m}`;
    let f = o.get(g);
    if (!f) {
      const b = [];
      for (let w = h; w < m; w++) {
        const p = t[w];
        w > h && p.space && b.push({ text: " ", italic: p.pieces[0]?.italic ?? !1, symbol: !1 }), b.push(...p.pieces);
      }
      f = dt(e, b, a, s), o.set(g, f);
    }
    return f;
  }, l = /* @__PURE__ */ new Map(), d = (h, m) => {
    if (!m) return h === t.length ? { cost: 0, cuts: [] } : null;
    const g = `${h}:${m}`;
    if (l.has(g)) return l.get(g);
    let f = null;
    for (let b = h + 1; b <= t.length - m + 1; b++) {
      const w = i(h, b).reduce((y, k) => y + k.width, 0);
      if (w > r) break;
      const p = d(b, m - 1);
      if (!p) continue;
      const S = p.cost + (r - w) ** 2;
      (!f || S < f.cost) && (f = { cost: S, cuts: [b, ...p.cuts] });
    }
    return l.set(g, f), f;
  }, c = d(0, n.length);
  if (!c) return n;
  let u = 0;
  return c.cuts.map((h) => {
    const m = i(u, h);
    return u = h, m;
  });
}
function gs(e, t, r, a, s = !1, n = 1) {
  const o = m2(t);
  if (!s || o.length > 64 || t.some((d) => d.text.includes("­")))
    return R1(e, o, r, a, n);
  const i = [];
  let l = [];
  for (const d of o)
    d.newline ? (i.push(
      ...l.length ? ms(e, l, r, a, n) : [[]]
    ), l = []) : l.push(d);
  return l.length && i.push(...ms(e, l, r, a, n)), i;
}
const f2 = new Set(
  "mir vis 5ed wth tmp sth exo usg ulg 6ed uds mmq nem pcy inv pls 7ed apc ody tor jud ons lgn scg por p02 ptk".split(
    " "
  )
);
function p2(e) {
  return f2.has(e?.toLowerCase() ?? "");
}
function b2(e) {
  if (e.role !== "flavor" || e.align !== void 0) return [e];
  const t = e.runs.map((o) => o.text).join(""), r = [...t.matchAll(/(?:^|\n)[^\S\n]*(?:—|–|--)[^\S\n]*(?=\S)/g)].at(-1);
  if (!r) return [e];
  const a = r.index, s = a + (t[a] === `
` ? 1 : 0), n = (o, i) => {
    let l = 0;
    return e.runs.flatMap((d) => {
      const c = d.text.slice(Math.max(0, o - l), Math.max(0, i - l));
      return l += d.text.length, c ? [{ ...d, text: c }] : [];
    });
  };
  return [
    ...a ? [{ ...e, runs: n(0, a) }] : [],
    { ...e, align: "right", runs: n(s, t.length) }
  ];
}
const P0 = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9
};
function W(e, t, r, a = 24, s = 15, n = P0) {
  const o = n.textWidth ?? 1;
  if (!Number.isFinite(o) || o <= 0)
    throw Error("Magic rules text width must be finite and positive.");
  e.save(), e.letterSpacing = "0px", e.textBaseline = "alphabetic", e.textAlign = "left";
  try {
    const i = n.flavorAttribution === "right" ? t.flatMap(b2) : t;
    let l, d = a;
    do {
      const c = [], u = [];
      let h = 0, m;
      for (const v of i) {
        let C = d, M = gs(
          e,
          v.runs,
          r.width,
          C,
          n.balanceLines && (!n.balanceCenteredOnly || v.align === "center"),
          o
        );
        if (v.role === "flavor" && n.flavorOrphans !== !1 && M.length > 2 && M.at(-1).reduce((R, x) => R + x.width, 0) < r.width * 0.3)
          for (let R = C - 0.25; R >= C * 0.94; R -= 0.25) {
            const x = gs(
              e,
              v.runs,
              r.width,
              R,
              n.balanceLines && (!n.balanceCenteredOnly || v.align === "center"),
              o
            );
            if (x.length < M.length) {
              C = R, M = x;
              break;
            }
          }
        if (M.length) {
          m && (m === "rules" && v.role === "flavor" ? h += d * n.flavorGap : (m !== "flavor" || v.role !== "flavor") && (h += d * n.paragraphGap));
          for (const R of M) {
            const x = Math.max(0, ...R.map((Y) => Y.ascent)), I = Math.max(0, ...R.map((Y) => Y.descent)), D = R.reduce((Y, Q) => Y + Q.width, 0), E = r.x + (v.align === "right" ? r.width - D : v.align === "center" ? (r.width - D) / 2 : 0);
            let $ = 0, U = 1 / 0, Z = -1 / 0;
            for (const Y of R)
              U = Math.min(U, $ + Y.inkLeft), Z = Math.max(Z, $ + Y.inkRight), $ += Y.width;
            c.push({
              x: E,
              runs: R,
              role: v.role,
              baseline: h,
              width: D,
              inkBounds: [
                E + (R.length ? U : 0),
                h - x,
                R.length ? Z - U : 0,
                x + I
              ]
            }), h += C * n.leading;
          }
          m = v.role;
        }
      }
      if (n.flavorSeparator !== !1)
        for (let v = 1; v < c.length; v++) {
          const C = c[v - 1], M = c[v];
          if (C.role !== "rules" || M.role !== "flavor") continue;
          const R = C.inkBounds[1] + C.inkBounds[3];
          u.push((R + M.inkBounds[1]) / 2 - 0.3);
        }
      const g = c[0]?.inkBounds[1] ?? 0, f = c.at(-1)?.inkBounds, b = f ? f[1] + f[3] - g : 0, w = Math.max(0, r.height - b), p = r.y + Math.max(0, Math.min(w, w / 2 + (n.centerOffset ?? 0))), S = Math.max(r.y, r.verticalLimits?.[0] ?? r.y), y = Math.min(
        r.y + r.height,
        r.verticalLimits?.[1] ?? r.y + r.height
      ), k = Math.max(S, Math.min(y - b, p)) - g;
      if (l = {
        size: d,
        x: r.x,
        top: g + k,
        width: r.width,
        height: b,
        overflow: b > y - S + 0.01 || c.some((v) => v.width > r.width + 0.01),
        lines: c.map((v) => ({
          ...v,
          baseline: v.baseline + k,
          inkBounds: [
            v.inkBounds[0],
            v.inkBounds[1] + k,
            v.inkBounds[2],
            v.inkBounds[3]
          ]
        })),
        separators: u.map((v) => v + k)
      }, l.overflow ||= l.lines.some(
        (v) => r.exclusions?.some(([C, M, R, x]) => {
          const [I, D, E, $] = v.inkBounds;
          return I < C + R && I + E > C && D < M + x && D + $ > M;
        })
      ), !l.overflow || d <= s) break;
      d = Math.max(s, d - 0.25);
    } while (!0);
    return l;
  } finally {
    e.restore();
  }
}
function S2(e, t, r) {
  const [a, s, n, o] = r, i = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((l) => ({ role: "rules", runs: [{ text: l }] }));
  return W(
    e,
    i,
    { x: a - 0.375, y: s, width: n, height: o },
    17.6 * 4 / 3,
    32 / 3,
    {
      leading: 0.95,
      paragraphGap: 0.4,
      flavorGap: 0.5,
      flavorOrphans: !1,
      flavorSeparator: !1,
      centerOffset: 0.875
    }
  );
}
function Nt(e, t, r, a, s, n, o, i, l = 1 / 0) {
  const d = (m) => (m.align === void 0 || m.align === "center") && m.runs.length > 0 && m.runs.every((g) => !g.text.includes(`
`));
  if (!r.length || !r.every(d) || !t.every(d)) return null;
  const c = r.map((m) => m.runs.map((g) => g.text).join("")).join(`
`);
  if (Array.from(c.replace(/\{[^}]+\}/g, "●")).length > l) return null;
  const u = (m) => m.map((g) => ({ ...g, align: "center" })), h = W(e, u(r), a, s, s, i);
  return h.overflow || h.lines.length > o ? null : W(e, u(t), a, s, n, i);
}
const $t = {
  ordinary: [0.436 * 488, 0.9034 * 680, 0.128 * 488, 0.0458 * 680],
  planeswalker: [0.4394 * 488, 0.9015 * 680, 0.1214 * 488, 0.051 * 680],
  saga: [213.7, 620.2, 60.5, 25.3],
  aftermath: [222, 623, 43, 20],
  split: [223.5, 620, 43, 21.5]
}, N4 = {
  ordinary: { size: [192, 96], interior: [29, 29, 134, 67] },
  planeswalker: { size: [182, 107], interior: [24, 26, 134, 67] },
  saga: { size: [186, 78], interior: [26, 11, 134, 67] },
  plain: { size: [134, 67], interior: [0, 0, 134, 67] }
};
function ut(e) {
  if (!We(e) || ae(e) || e.frameAssetFamily === "eighth" || e.frameTemplate || e.faces?.length || e.layout && !["normal", "planeswalker", "transform", "modal_dfc", "meld"].includes(e.layout))
    return null;
  const t = ee(e), r = t.startsWith("planeswalker");
  if (t !== "normal" && !r) return null;
  const a = O(e), s = a.boxes === "Gold" ? "M" : a.boxes === "Artifact" ? "A" : a.boxes === "Land" ? "L" : a.boxes === "Colourless" ? r ? "A" : "C" : a.boxes, n = L(e);
  n.length === 2 && "WUBRG".indexOf(n[1]) - "WUBRG".indexOf(n[0]) > 2 && n.reverse();
  const o = n.length > 2 ? ["M"] : n.length ? n : [s], i = (l) => r ? `${B}/img/frames/planeswalker/holo/${l.toLowerCase()}.png` : `${B}/img/frames/m15/holoStamps/m15HoloStamp${l}.png`;
  return {
    image: i(o[0]),
    ...o.length === 2 ? { rightImage: i(o[1]) } : {},
    rect: r ? $t.planeswalker : $t.ordinary
  };
}
function M1(e, t, r) {
  const a = ut(t);
  if (!a) return;
  const s = r.get(a.image);
  if (!s) throw Error("Authenticity stamp asset is unavailable.");
  e.save(), e.shadowColor = "transparent", e.drawImage(s, ...a.rect), e.restore();
}
const w2 = new Set(
  "8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd m12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 h17 phtr xln g17 ddt ima e02 ust rix a25".split(" ")
);
function y2(e) {
  return !w2.has(e?.trim().toLowerCase() ?? "");
}
function k2(e) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal")
    return;
  const t = ke(e);
  if (!(!t || !Ee(e, t.frame)))
    return e.frameTreatment === "colorshifted" ? [0.7234, 0.881, 0.204, 0.0772] : [1461 / 2010, 2481 / 2814, 414 / 2010, 218 / 2814];
}
function v2(e, t, r) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal")
    return t;
  const a = ke(e);
  if (!a || !Ee(e, a.frame) || !t.lines.length)
    return t;
  let s = 0;
  const n = t.lines.map((h, m) => {
    if (m) {
      const g = t.lines[m - 1], f = g.runs[0]?.size ?? t.size, b = h.baseline - g.baseline - f, w = g.role === "rules" && h.role === "flavor" ? 0.625 / 0.9 : 0.4375 / 0.45;
      s += f * (0.965 - 1) + b * (w - 1);
    }
    return {
      ...h,
      x: (h.x ?? t.x) + 2.25,
      baseline: h.baseline + s,
      inkBounds: [
        h.inkBounds[0] + 2.25,
        h.inkBounds[1] + s,
        h.inkBounds[2],
        h.inkBounds[3]
      ]
    };
  }), o = n[0], i = n.at(-1), l = i.inkBounds[1] + i.inkBounds[3] - o.inkBounds[1], d = r.y + Math.max(0, (r.height - l) / 2), c = d - o.inkBounds[1], u = n.map((h) => ({
    ...h,
    baseline: h.baseline + c,
    inkBounds: [
      h.inkBounds[0],
      h.inkBounds[1] + c,
      h.inkBounds[2],
      h.inkBounds[3]
    ]
  }));
  return l > r.height + 0.01 || u.some(
    (h) => r.exclusions?.some(([m, g, f, b]) => {
      const [w, p, S, y] = h.inkBounds;
      return w < m + f && w + S > m && p < g + b && p + y > g;
    })
  ) ? t : { ...t, x: t.x + 2.25, top: d, height: l, lines: u };
}
function j2(e, t, r, a, s) {
  if (t.setCode?.toLowerCase() !== "plc" || t.frameAssetFamily !== "eighth" || t.frameTemplate || t.layout && t.layout !== "normal" || a.size !== 24.5 || a.lines.length > 5)
    return a;
  const n = ke(t);
  if (!n || !Ee(t, n.frame)) return a;
  const o = {
    leading: 0.965,
    paragraphGap: 0.4375,
    flavorGap: 0.625,
    flavorSeparator: !1
  }, i = { ...s, x: a.x }, l = (d) => r.some((c) => {
    if (c.runs.some((m) => m.text.includes(`
`))) return !1;
    const u = W(
      e,
      [c],
      { ...i, height: 1e3, exclusions: [] },
      d,
      d,
      o
    ), h = u.lines.at(-1);
    return u.lines.length < 2 || !h || h.width >= s.width * 0.35 ? !1 : c.role === "rules" || (h.runs.map((m) => m.text).join("").trim().match(/\S+/g)?.length ?? 0) === 1;
  });
  if (!l(a.size)) return a;
  for (let d = a.size - 0.25; d >= a.size - 2; d -= 0.25) {
    const c = W(e, r, i, d, d, o);
    if (!c.overflow && c.lines.length < a.lines.length && !l(d))
      return c;
  }
  return a;
}
function x1(e, t, r = T, a = 1) {
  const s = Be(t), n = k2(t), o = n ?? s.stats, i = {
    ...P0,
    flavorSeparator: t.frameAssetFamily === "eighth" ? !1 : y2(t.setCode)
  }, [l, d, c, u] = s.rules, h = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((p) => ({ role: "rules", runs: [{ text: p }] })), m = ut(t), g = {
    x: l * j + (t.frameAssetFamily ? 0 : 3.5),
    y: d * r + (t.frameAssetFamily ? 0 : 7),
    width: c * j - (t.frameAssetFamily ? 0 : 9.5),
    height: u * r - (t.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: [
      ...t.power != null && t.toughness != null ? [
        [
          o[0] * j - 2,
          o[1] * r - 2,
          o[2] * j + 4,
          o[3] * r + 4
        ]
      ] : [],
      ...m ? [
        [
          m.rect[0] - 1,
          (m.rect[1] - 1) * r / T,
          m.rect[2] + 2,
          (m.rect[3] + 2) * r / T
        ]
      ] : []
    ]
  }, f = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? h : h;
  if (t.rulesAlignment?.mode !== "left" && ["10e", "m10", "m11", "m12", "m13", "m14"].includes(t.setCode?.toLowerCase() ?? "") && f.every((p) => p.role === "rules")) {
    const p = Nt(
      e,
      h,
      f,
      g,
      24.5 * a,
      15 * a,
      3,
      { ...i, balanceLines: !0 }
    );
    if (p) return p;
  }
  const b = t.rulesAlignment?.mode === "left" ? h.map((p) => p.role === "rules" ? { ...p, align: "left" } : p) : h;
  let w = W(e, b, g, 24.5 * a, 15 * a, i);
  return w.overflow && n && (w = W(e, b, g, w.size, 12 * a, i)), j2(
    e,
    t,
    b,
    v2(t, w, g),
    g
  );
}
function ye(e, t, r, a = te, s = 0, n = "#17140f") {
  if (!Ke(e)) return;
  if (t.overflow) throw Error("Magic rules text does not fit the available area.");
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  for (const l of t.separators) {
    const d = e.createLinearGradient(t.x, l, t.x + t.width, l);
    d.addColorStop(0, "#17140f00"), d.addColorStop(0.15, "#17140f55"), d.addColorStop(0.85, "#17140f55"), d.addColorStop(1, "#17140f00"), e.fillStyle = d, e.fillRect(t.x, l, t.width, 0.6);
  }
  e.fillStyle = n;
  const o = s > 0 ? document.createElement("canvas") : null;
  o && (o.width = e.canvas.width, o.height = e.canvas.height);
  const i = o ? o.getContext("2d") : e;
  if (!i) throw Error("Missing rules text context");
  o && (i.setTransform(e.getTransform()), i.textAlign = "left", i.textBaseline = "alphabetic", i.letterSpacing = "0px", i.fillStyle = n);
  for (const l of t.lines) {
    let d = l.x ?? t.x;
    for (const c of l.runs)
      c.symbol ? a(
        e,
        c.text,
        d + c.size * 0.025,
        l.baseline - c.size * 0.72,
        c.size * 0.8,
        r
      ) : (i.font = Wr(c.size, c.italic), fs(i, c, d, l.baseline, !1)), d += c.width;
  }
  if (o) {
    i.globalCompositeOperation = "destination-out", i.lineJoin = "round";
    for (const l of t.lines) {
      let d = l.x ?? t.x;
      for (const c of l.runs)
        c.symbol || (i.font = Wr(c.size, c.italic), i.lineWidth = c.size * s * 2, fs(i, c, d, l.baseline, !0)), d += c.width;
    }
    e.resetTransform(), e.drawImage(o, 0, 0), o.width = o.height = 0;
  }
  e.restore();
}
function fs(e, t, r, a, s) {
  const n = t.textWidth ?? 1;
  if (n === 1) {
    s ? e.strokeText(t.text, r, a) : e.fillText(t.text, r, a);
    return;
  }
  e.save(), e.translate(r, a), e.scale(n, 1), s ? e.strokeText(t.text, 0, 0) : e.fillText(t.text, 0, 0), e.restore();
}
function C2(e) {
  const t = de(e);
  if (e.setCode?.toLowerCase() !== "fut" || t === "clear") return;
  const r = V(e), a = K.CONJURER_ROOT + "/img/setSymbols/official/fut-";
  if (!["c", "u", "r"].some((l) => r === a + l + ".svg")) return;
  const [s, n, o, i] = t === "full-art" ? [443.5625, 581.8125, 28.1875, 20.976866533333336] : Je(e).base.includes("/future/regular/futureFrame") ? [443.5, 405.125, 29, 21.851866533333336] : [443.5, 405.5, 27.875, 22.226866533333336];
  return [s - o / 2, n - i / 2, o, i];
}
function R2(e, t, r, a, s) {
  Nn(t);
  const n = u2(t, r), o = h2(n, t), i = la(t), l = Je(t), d = O(t), c = zn(t);
  e.save();
  try {
    if (!a) {
      const v = ve(t);
      e.fillStyle = v ?? "#080808", e.fillRect(0, 0, 488, 680), v && (e.fillStyle = "#080808", e.fillRect(17, 17, 454, 646));
    }
    if (s && e.drawImage(s, 0, 0, 488, 680), a !== "printing") {
      const v = document.createElement("canvas");
      v.width = 976, v.height = 1360;
      try {
        const C = v.getContext("2d");
        C.scale(2, 2);
        const M = de(t) === "clear" ? [23, 22, 442, 637] : i.art;
        Le(C, t, r, M, "artwork"), C.globalCompositeOperation = "destination-in", C.drawImage(o, 0, 0, 488, 680), e.drawImage(v, 0, 0, 488, 680);
      } finally {
        v.width = v.height = 0;
      }
    }
    if (a === "artwork") return;
    e.drawImage(n, 0, 0, 488, 680), l.typeSymbol && e.drawImage(r.get(l.typeSymbol), 31.2, 31.2, 27.3, 26), e.shadowColor = "transparent", X(e, t, "manaCost", () => D3(e, t, r));
    const u = c.length === 1 && c[0] !== "W", h = (v, C, M, R, x = !1) => {
      e.textAlign = "left", e.textBaseline = "middle", re(
        e,
        v,
        C[0] + 1.25,
        C[1] + C[3] / 2 + R,
        C[2],
        M,
        !0,
        1,
        "CardRenderer MTG Matrix",
        0,
        x ? t.textInk : void 0
      );
    };
    e.fillStyle = u ? "#fff" : "#111", h(t.name, i.title, 30.248, 1.25), h(t.typeLine ?? "", i.type, 24.969, -1.5, !0);
    const m = d.land && c.length === 2 && !c.includes("W") ? "#fff" : "#111";
    de(t) !== "full-art" && ye(e, S2(e, t, i.rules), r, void 0, 0, m), t.power != null && t.toughness != null && (e.fillStyle = u ? "#fff" : "#111", e.textAlign = "center", e.textBaseline = "middle", e.font = '700 29.97px "CardRenderer MTG Matrix Small Caps"', e.save(), e.translate(i.stats[0] + i.stats[2] / 2 - 1.5, i.stats[1] + i.stats[3] / 2 - 0.25), e.scale(0.99, 1), Se(e, `${t.power}/${t.toughness}`, 0, 0, i.stats[2] / 0.99, t.textInk), e.restore());
    const g = r.get(V(t) ?? "");
    X(e, t, "setSymbol", () => {
      if (g) {
        const [v, C, M, R] = i.symbol, x = Math.min(M / g.width, R / g.height), I = C2(t) ?? [
          v + (M - g.width * x) / 2,
          C + (R - g.height * x) / 2,
          g.width * x,
          g.height * x
        ];
        e.drawImage(g, I[0], I[1], I[2], I[3]);
      }
    }), e.fillStyle = d.land || u ? "#fff" : "#111", e.textAlign = "right", e.textBaseline = "alphabetic";
    const f = t.power != null && t.toughness != null ? 361 : 442, b = de(t) === "full-art", w = b ? 16.6 : 17.845, p = b ? 627 : 626.5;
    e.font = `400 ${w}px "CardRenderer MTG Matrix"`;
    const S = t.artist ?? "";
    X(e, t, "artist", () => {
      e.fillText(S, f, p, f - 70);
      const v = l.brush ? r.get(l.brush) : void 0;
      v && e.drawImage(v, f - e.measureText(S).width - 40, p - 10, 36, 8);
    });
    const y = Xr(t), k = Jr(t, !1);
    if (y || k) {
      e.font = '11.804px "CardRenderer MTG MPlantin"';
      const v = [y, k].filter(Boolean).join(" ");
      if (!t.printingElements?.legal?.offset && !t.printingElements?.collector?.offset)
        e.fillText(v, f - 0.25, 641.25, f - 40);
      else {
        const C = e.measureText(v).width, M = Math.min(1, (f - 40) / Math.max(1, C));
        e.save(), e.translate(f - 0.25, 641.25), e.textAlign = "left";
        const R = (x, I) => {
          e.save(), e.scale(M, 1), e.fillText(x, I, 0), e.restore();
        };
        y && X(e, t, "legal", () => R(y, -C)), k && X(
          e,
          t,
          "collector",
          () => R(k, -e.measureText(k).width)
        ), e.restore();
      }
    }
  } finally {
    n.width = n.height = o.width = o.height = 0, e.restore();
  }
}
const Ot = 96 / 72;
function t0(e, t, r, a, s, n) {
  const [o, i, l, d] = r;
  e.textAlign = "left", e.textBaseline = "middle", re(
    e,
    t,
    o,
    i + d / 2,
    l,
    a * Ot,
    s !== "CardRenderer MTG Matrix",
    1,
    s,
    0,
    n
  );
}
function T1(e, t, r, a, s, n) {
  const o = t.manaSymbols ?? [], i = n + 1;
  return o.forEach(
    (l, d) => te(e, l, a - o.length * i + d * i, s, n, r, !0)
  ), o.length * i;
}
function D1(e, t, r, a, s, n, o = "#17140f") {
  if (!Ke(e)) return;
  const [i, l, d, c] = a, u = t.rulesParagraphs ?? (t.rulesText ?? "").split(`
`).filter(Boolean).map((m) => ({ role: "rules", runs: [{ text: m }] })), h = W(e, u, { x: i, y: l, width: d, height: c }, s * Ot, n * Ot, {
    leading: 0.95,
    paragraphGap: 0.4,
    flavorGap: 0.5,
    flavorOrphans: !1
  });
  if (h.overflow) throw Error("Standard template text exceeds its minimum readable size.");
  ye(e, h, r, void 0, 0, o);
}
function I1(e, t, r, a, s) {
  if (t.power == null || t.toughness == null) return;
  const [n, o, i, l] = r;
  e.font = `bold ${a * Ot}px "${s}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", Se(e, `${t.power}/${t.toughness}`, n + i / 2, o + l / 2, i, t.textInk);
}
function E1(e, t, r, a) {
  const [s, n, o] = r;
  e.fillStyle = a, e.textAlign = "left", e.textBaseline = "top", e.font = `${10 * Ot}px "CardRenderer MTG Matrix", Georgia`, e.fillText(t.artist ?? "", s, n, o), t.legalText && (e.font = `${6.5 * Ot}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(t.legalText, s, n + 14, o));
}
const ps = [
  {
    title: [32, 30, 311, 23],
    rules: [37, 59, 302, 67],
    type: [33, 134, 310, 18],
    stats: [290, 130, 60, 28]
  },
  {
    title: [32, 49, 311, 23],
    rules: [37, 80, 302, 67],
    type: [33, 155, 310, 18],
    stats: [290, 150, 60, 28]
  }
];
function M2(e, t, r, a, s) {
  if (t.faces?.length !== 2) throw Error("A flip template needs exactly two printed panels.");
  const n = t.faces[0], o = t.faces[1];
  if (s !== "artwork")
    for (const [h, m] of [a.base, a.reverse].entries()) {
      const g = r.get(m);
      if (!g) throw Error(`Flip frame unavailable: ${m}`);
      e.save(), h && (e.beginPath(), e.rect(0, 344, 375, 179), e.clip()), e.drawImage(g, 0, 0, 375, 523), e.restore();
    }
  if (Le(e, t, r, [32, 162, 311, 182], s), s === "artwork") return;
  for (const [h, m, g] of [
    [a.stats, a.statsMask, [285, 123, 70, 38]],
    [a.reverseStats, a.reverseStatsMask, [18, 342, 70, 38]]
  ]) {
    if (!h || !m) continue;
    const f = r.get(h), b = r.get(m);
    if (!f || !b) throw Error("Missing flip statistics plate");
    const w = document.createElement("canvas");
    w.width = 140, w.height = 76;
    const p = w.getContext("2d");
    p.drawImage(f, 0, 0, 140, 76), p.globalCompositeOperation = "destination-in", p.drawImage(M0(b), 0, 0, 140, 76), e.drawImage(w, g[0], g[1], g[2], g[3]), w.width = w.height = 0;
  }
  e.shadowColor = "transparent", e.fillStyle = "#17140f";
  const i = "CardRenderer MTG Matrix", l = (h, m, g, f, b) => {
    const w = T1(e, h, r, m[0] + m[2], m[1] + 1, 15);
    t0(
      e,
      h.name,
      [m[0], m[1], Math.max(1, m[2] - w - 4), m[3]],
      17,
      i
    ), t0(
      e,
      h.typeLine ?? "",
      [f[0], f[1], f[2] - (h.power != null ? 60 : 0), f[3]],
      14,
      i,
      h.textInk
    ), D1(e, h, r, g, 14, 8), I1(e, h, b, 17, i);
  }, d = ps[0], c = ps[1];
  l(n, d.title, d.rules, d.type, d.stats), e.save(), e.translate(375, 523), e.rotate(Math.PI), l(o, c.title, c.rules, c.type, c.stats), e.restore();
  const u = r.get(V(t) ?? "");
  if (u) {
    const h = Math.min(44 / u.width, 22 / u.height);
    e.drawImage(u, 353 - u.width * h, 482, u.width * h, u.height * h);
  }
  E1(e, t, [58, 479, 217, 26], "#17140f");
}
function x2(e, t, r, a, s) {
  const n = t.frameTemplate;
  if (!n) throw Error("Missing standard template");
  if (n === "future") return R2(e, t, r, a, s);
  const o = fa[n], i = (c) => {
    const u = r.get(c);
    if (!u) throw Error(`Standard template asset unavailable: ${c}`);
    return u;
  }, l = pa(t);
  if (!l) throw Error("Missing template assets");
  const d = i(l.base);
  e.save();
  try {
    if (a !== "artwork" && (e.fillStyle = ve(t) ?? "#090806", e.fillRect(0, 0, 488, 680)), s && e.drawImage(s, 0, 0, 488, 680), n === "battle" ? (e.translate(0, 680), e.rotate(-Math.PI / 2), e.scale(680 / 523, 488 / 375)) : e.scale(488 / 375, 680 / 523), l.kind === "flip") {
      M2(e, t, r, l, a);
      return;
    }
    if (l.kind !== "battle") throw Error("Unexpected standard template branch");
    if (a !== "artwork" && e.drawImage(i(l.texture), 0, 0, 523, 375), Le(e, t, r, o.art, a), a === "artwork") return;
    e.drawImage(d, 0, 0, o.size[0], o.size[1]), e.drawImage(i(l.border), 0, 0, 523, 375), t.defense != null && e.drawImage(i(l.defense), 459, 322, 64, 52), e.shadowColor = "transparent", e.fillStyle = "#17140f";
    const c = "CardRenderer MTG Beleren";
    let u = o.title;
    const h = T1(e, t, r, 484, 20, 15);
    u = [u[0], u[1], Math.max(1, u[2] - h - 5), u[3]], t0(e, t.name, u, o.titleSize, c), t0(e, t.typeLine ?? "", o.type, o.typeSize, c, t.textInk), e.fillStyle = "#17140f", D1(e, t, r, o.rules, o.rulesSize, o.minimumSize), n === "battle" && t.defense != null ? (e.fillStyle = "white", t0(e, String(t.defense), o.stats, 17, c)) : I1(e, t, o.stats, 18, c);
    const m = r.get(V(t) ?? "");
    if (m) {
      const [g, f, b, w] = o.symbol, p = Math.min(b / m.width, w / m.height);
      e.drawImage(
        m,
        g + b - m.width * p,
        f + (w - m.height * p) / 2,
        m.width * p,
        m.height * p
      );
    }
    E1(e, t, o.footer, "white");
  } finally {
    e.restore();
  }
}
let bs;
function T2(e) {
  return !e.frameTemplate || e.frameTemplate === "battle" ? Promise.resolve() : bs ??= Promise.all([
    document.fonts.load('400 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 24px "CardRenderer MTG Matrix Small Caps"')
  ]).then(() => {
  }).catch((t) => {
    throw bs = void 0, t;
  });
}
function D2(e) {
  if (e.setCode?.toLowerCase() !== "plc" || e.frameAssetFamily !== "eighth" || e.frameTemplate || e.layout && e.layout !== "normal")
    return;
  const t = ke(e);
  if (!(!t || !Ee(e, t.frame)))
    return { dx: 1.25, dy: -2.9375, scaleX: 1.005, scaleY: 0.99375 };
}
function I2(e, t, r) {
  if (!(e.setSymbol || !Ee(e, t) || !["c", "u", "r"].some(
    (a) => r === `${B}/img/setSymbols/official/plc-${a}.svg`
  )))
    return [411, 388.75, 34, 25.5];
}
const E2 = {
  scaleX: 1.01,
  scaleY: 1.01,
  numberScale: 0.98,
  numberDx: -0.25
}, A2 = {}, B2 = {
  arn: {
    dx: 5.25,
    dy: -7.75,
    scaleX: 1.045,
    scaleY: 1.0098,
    spacing: 0.875,
    glyphs: {
      W: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      U: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      G: {
        scale: 1.09,
        dx: 0,
        dy: -0.25
      },
      B: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      R: {
        scale: 1.05,
        dx: 0,
        dy: 0.25
      }
    },
    numberScale: 1.01,
    numberDx: 0,
    numberDy: -0.25
  },
  atq: {
    dx: 5.25,
    dy: -8,
    scaleX: 1.0293249999999998,
    scaleY: 1.02,
    spacing: 0.9784688995215312,
    glyphs: {
      B: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      R: {
        scale: 1.05,
        dx: 0.25,
        dy: 0.75
      },
      W: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      U: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      G: {
        scale: 1.09,
        dx: 0.25,
        dy: 0.25
      }
    },
    numberScale: 0.98,
    numberDx: -0.5,
    numberDy: -0.5
  },
  drk: {
    dx: 4.5,
    dy: -7.25,
    scaleX: 1.039775,
    scaleY: 1.0048499999999998,
    spacing: 0.8696172248803828,
    glyphs: {
      B: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      G: {
        scale: 1,
        dx: -0.5,
        dy: 0
      },
      U: {
        scale: 1,
        dx: 0,
        dy: 0
      },
      W: {
        scale: 1.02,
        dx: -0.5,
        dy: 0.25
      },
      R: {
        scale: 1.06,
        dx: 0.25,
        dy: 0.5
      }
    },
    numberScale: 1,
    numberDx: -0.75,
    numberDy: -0.75
  },
  leb: {
    dx: -1.5,
    spacing: 1.75,
    numberDy: -1,
    glyphs: {
      W: { scale: 1.09, dx: 0, dy: 0 },
      U: { scale: 1, dx: 0.5, dy: -1 },
      B: { scale: 1.03, dx: 0.25, dy: -1.25 },
      R: { scale: 1, dx: 0.5, dy: 0.5 },
      G: { scale: 1.12, dx: 0, dy: -1 }
    }
  },
  "8ed": {
    dy: -2,
    scaleX: 1.02,
    scaleY: 1.02,
    numberScale: 0.97,
    numberDx: -0.5,
    numberDy: -1.25,
    glyphs: {
      W: { scale: 0.98, dx: -0.5, dy: -2 },
      U: { scale: 0.94, dx: -0.5, dy: -1.5 },
      B: { scale: 0.97, dx: -0.25, dy: -2 },
      R: { scale: 0.95, dx: 0, dy: -1.5 },
      G: { scale: 1.04, dx: -0.25, dy: -3 }
    }
  }
};
function L2(e) {
  const t = D2(e);
  if (t) return t;
  const r = e.setCode?.toLowerCase() ?? "";
  if (An(e)) return { ...E2, ...A2[r] };
  const a = B2[r], s = ["lea", "leb", "3ed", "arn", "atq", "drk"].includes(r);
  if (!(!a || e.frameTemplate !== void 0 || /^Level up\b/m.test(e.rulesText ?? "") || (e.layout ?? "normal") !== "normal" || (e.legendary ?? /\bLegendary\b/.test(e.typeLine ?? "")) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? "") || Ae(e) !== (["3ed", "8ed"].includes(r) ? "white" : "black") || s && (!ae(e) || e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode === "oracle") || r === "8ed" && (ae(e) || e.frameAssetFamily !== "eighth")))
    return Zr(e) === "dark" ? { ...a, numberScale: 0.87, numberDx: -0.25, numberDy: -0.25 } : a;
}
function Z0(e) {
  const t = e.symbolAdjustment?.mana, r = L2(e);
  if (!r) return t;
  const a = { ...t };
  for (const s of ["dx", "dy", "spacing", "numberDx", "numberDy"])
    r[s] !== void 0 && (a[s] = r[s] + (t?.[s] ?? 0));
  for (const s of ["scaleX", "scaleY", "numberScale"])
    r[s] !== void 0 && (a[s] = r[s] * (t?.[s] ?? 1));
  if (r.glyphs) {
    a.glyphs = { ...t?.glyphs };
    for (const s of ["W", "U", "B", "R", "G"]) {
      const n = r.glyphs[s], o = t?.glyphs?.[s];
      n && (a.glyphs[s] = {
        scale: (n.scale ?? 1) * (o?.scale ?? 1),
        dx: (n.dx ?? 0) + (o?.dx ?? 0),
        dy: (n.dy ?? 0) + (o?.dy ?? 0)
      });
    }
  }
  return a;
}
class Q0 {
  constructor(t) {
    if (this.limit = t, !Number.isSafeInteger(t) || t < 1) throw RangeError("Invalid material budget");
  }
  limit;
  entries = /* @__PURE__ */ new Map();
  bytes = 0;
  peakBytes = 0;
  builds = 0;
  hits = 0;
  evictions = 0;
  waiting = /* @__PURE__ */ new Set();
  get stats() {
    return {
      bytes: this.bytes,
      peakBytes: this.peakBytes,
      entries: this.entries.size,
      builds: this.builds,
      hits: this.hits,
      evictions: this.evictions
    };
  }
  destroy(t) {
    t.bitmap?.close(), t.bitmap = void 0, t.accounted && (this.bytes -= t.bytes, t.accounted = !1);
  }
  admit(t) {
    const r = new Set(t.map((s) => s.key)), a = t.reduce((s, n) => {
      const o = this.entries.get(n.key);
      if (o && o.bytes !== n.bytes)
        throw Error("Material cache key has inconsistent dimensions");
      return s + (o ? 0 : n.bytes);
    }, 0);
    for (const [s, n] of this.entries) {
      if (this.bytes + a <= this.limit) break;
      n.users || r.has(s) || (this.entries.delete(s), n.retired = !0, this.destroy(n), this.evictions++);
    }
    if (!(this.bytes + a > this.limit))
      return this.bytes += a, this.peakBytes = Math.max(this.peakBytes, this.bytes), t.map((s) => {
        let n = this.entries.get(s.key);
        if (n)
          this.hits++, this.entries.delete(s.key), this.entries.set(s.key, n);
        else {
          const o = {
            users: 0,
            bytes: s.bytes,
            accounted: !0,
            retired: !1,
            promise: Promise.resolve().then(async () => {
              this.builds++;
              const i = await s.build();
              if (i.width * i.height * 4 !== s.bytes)
                throw i.close(), Error("Derived bitmap dimensions differ from its cache reservation");
              return o.bitmap = i, i;
            })
          };
          o.promise = o.promise.catch((i) => {
            throw this.entries.get(s.key) === o && this.entries.delete(s.key), o.retired = !0, this.destroy(o), this.notify(), i;
          }), this.entries.set(s.key, o), n = o;
        }
        return n.users++, n;
      });
  }
  notify() {
    for (const t of [...this.waiting]) t();
  }
  wait(t) {
    return t.throwIfAborted(), new Promise((r, a) => {
      const s = () => {
        this.waiting.delete(n), t.removeEventListener("abort", o);
      }, n = () => {
        s(), r();
      }, o = () => {
        s(), a(t.reason);
      };
      this.waiting.add(n), t.addEventListener("abort", o, { once: !0 });
    });
  }
  async acquire(t, r, a, s) {
    return (await this.acquireMany([{ key: t, bytes: r, build: a }], s))[0];
  }
  /** Admit a complete face atomically. Per-component waiting could deadlock two
   * faces that each hold half their required components while awaiting the rest. */
  async acquireMany(t, r) {
    if (r.throwIfAborted(), new Set(t.map((n) => n.key)).size !== t.length)
      throw Error("Duplicate key in material batch");
    if (t.some((n) => !Number.isSafeInteger(n.bytes) || n.bytes < 1) || t.reduce((n, o) => n + o.bytes, 0) > this.limit)
      throw RangeError("Material batch exceeds derived-image budget");
    let a;
    for (; !(a = this.admit(t)); )
      await this.wait(r), r.throwIfAborted();
    const s = a.map((n) => {
      let o = !1;
      return () => {
        o || (o = !0, n.users--, n.retired && !n.users && this.destroy(n), this.notify());
      };
    });
    try {
      const o = (await Promise.allSettled(a.map((i) => i.promise))).find((i) => i.status === "rejected");
      if (o?.status === "rejected") throw o.reason;
      return r.throwIfAborted(), a.map((i, l) => ({ value: i.bitmap, release: s[l] }));
    } catch (n) {
      for (const o of s) o();
      throw n;
    }
  }
  /** Retire active results; their final lease closes them. New work may start
   * after teardown, but retired pending/leased bytes still count toward budget. */
  clear() {
    for (const t of this.entries.values())
      t.retired = !0, t.users || this.destroy(t);
    this.entries.clear(), this.notify();
  }
}
const A1 = new Q0(16 * 1024 * 1024), Aa = new Q0(8 * 1024 * 1024), z4 = () => {
  A1.clear(), Aa.clear();
};
function G2(e) {
  if (!e.length || e.length % 4) throw Error("Invalid mana source pixels.");
  const t = new Uint32Array(766);
  let r = 0;
  for (let n = 0; n < e.length; n += 4) {
    if (e[n + 3] !== 255) continue;
    const o = e[n] + e[n + 1] + e[n + 2];
    t[o] = t[o] + 1, r++;
  }
  if (!r) throw Error("Mana source has no opaque paper sample.");
  let a = 0, s = 0;
  for (; s < t.length && (a += t[s], !(a >= r * 0.9)); s++)
    ;
  for (let n = 0; n < e.length; n += 4)
    if (e[n + 3] === 255 && e[n] + e[n + 1] + e[n + 2] === s)
      return [e[n], e[n + 1], e[n + 2]];
  throw Error("Mana source paper sample is inconsistent.");
}
const $2 = new Q0(16 * 1024 * 1024), Ss = /* @__PURE__ */ new WeakMap();
let O2 = 0;
async function P2(e, t, r) {
  const a = Z0(e), s = Bn(e), n = ni(e), o = !n && (!!s || !!a && (!!(a.numberDx || a.numberDy) || (a.numberScale ?? 1) !== 1));
  if (!n && !s && !o && !a?.glyphs && !Object.keys(t.manaGlyphScales ?? {}).length)
    return { images: t, dispose() {
    } };
  const i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), d = [
    .../* @__PURE__ */ new Set([...e.manaSymbols ?? [], ...Object.keys(t.manaGlyphScales ?? {})])
  ].flatMap((u) => {
    const h = n0(a, u), m = !!h && (!!(h.dx || h.dy) || (h.scale ?? 1) !== 1);
    if (!(/^\d+$/.test(u) && o) && !m && (t.manaGlyphScales?.[u] ?? 1) === 1)
      return [];
    const g = Ln(e, u), f = t.get(g ?? It(u) ?? "");
    if (g && !f) throw Error("Modern cost numeral asset is missing.");
    if (!f) return [];
    let b = Ss.get(f);
    return b || Ss.set(f, b = ++O2), [
      {
        symbol: u,
        source: f,
        identity: b,
        cost: g ? s : void 0,
        paperSample: ii(e, u)
      }
    ];
  });
  let c = [];
  try {
    return c = await $2.acquireMany(
      d.map(({ source: u, identity: h, cost: m, paperSample: g }) => ({
        key: `numeral-v2:${h}:${m ? JSON.stringify(m) : "source"}${g ? ":" + g : ""}`,
        bytes: u.width * u.height * 8,
        build: () => W2(u, m, g)
      })),
      r
    ), d.forEach(({ symbol: u, source: h }, m) => {
      (/^\d+$/.test(u) ? i : l).set(u, {
        image: c[m].value,
        width: h.width,
        height: h.height
      });
    }), {
      images: Object.assign(new Map(t), {
        manaCostShadow: s?.shadow,
        manaCostNumeral: n,
        manaColors: t.manaColors,
        originalManaGlyphs: t.originalManaGlyphs,
        originalWhiteGlyph: t.originalWhiteGlyph,
        manaNumerals: i,
        manaGlyphs: l,
        manaGlyphScales: t.manaGlyphScales
      }),
      dispose: () => c.forEach((u) => u.release())
    };
  } catch (u) {
    throw c.forEach((h) => h.release()), u;
  }
}
async function W2(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.width, a.height = e.height;
  try {
    const s = a.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Mana glyph preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, a.width, a.height), o = n.data, i = (Math.floor(e.height * 0.04) * e.width + Math.floor(e.width / 2)) * 4, l = r ? G2(o) : [o[i], o[i + 1], o[i + 2]];
    let d = i;
    for (let g = 0; g < o.length; g += 4)
      o[g + 3] === 255 && o[g] + o[g + 1] + o[g + 2] < o[d] + o[d + 1] + o[d + 2] && (d = g);
    const c = [o[d], o[d + 1], o[d + 2]], u = l.map((g, f) => g - c[f]), h = u.reduce((g, f) => g + f * f, 0);
    if (h < 100) throw Error("Mana asset has no separable glyph.");
    const m = new ImageData(new Uint8ClampedArray(o), e.width, e.height);
    for (let g = 0; g < o.length; g += 4) {
      if (t) for (let b = 0; b < 3; b++) m.data[g + b] = t.paper[b];
      if (o[g + 3] < 255) {
        o[g + 3] = 0;
        continue;
      }
      for (let b = 0; b < 3; b++) m.data[g + b] = t?.paper[b] ?? l[b];
      const f = Math.max(
        0,
        Math.min(1, u.reduce((b, w, p) => b + w * (l[p] - o[g + p]), 0) / h)
      );
      o[g + 3] = Math.round(o[g + 3] * f);
      for (let b = 0; b < 3; b++) o[g + b] = t?.ink[b] ?? c[b];
    }
    return a.width = e.width * 2, s.putImageData(m, 0, 0), s.putImageData(n, e.width, 0), await createImageBitmap(a);
  } finally {
    a.width = a.height = 0;
  }
}
function W0([e, t, r]) {
  const a = Math.max(e, t, r), s = a - Math.min(e, t, r);
  return [((s === 0 ? 0 : a === e ? (t - r) / s : a === t ? (r - e) / s + 2 : (e - t) / s + 4) * 60 % 360 + 360) % 360, a === 0 ? 0 : s / a, a];
}
function F2(e, t, r) {
  const a = (e % 360 + 360) % 360 / 60, s = r * t, n = s * (1 - Math.abs(a % 2 - 1)), o = r - s, i = a < 1 ? [s, n, 0] : a < 2 ? [n, s, 0] : a < 3 ? [0, s, n] : a < 4 ? [0, n, s] : a < 5 ? [n, 0, s] : [s, 0, n];
  return [i[0] + o, i[1] + o, i[2] + o];
}
function _e(e, t) {
  const [r, a, s] = W0(e), n = t.valueGamma === void 0 ? s : s ** t.valueGamma, o = F2(
    r + t.hueDegrees,
    Math.min(1, a * t.saturationScale),
    Math.min(1, n * t.brightnessScale)
  );
  return t.rgbScale ? [
    Math.max(0, Math.min(1, o[0] * t.rgbScale[0])),
    Math.max(0, Math.min(1, o[1] * t.rgbScale[1])),
    Math.max(0, Math.min(1, o[2] * t.rgbScale[2]))
  ] : o;
}
function ws(e) {
  const t = e.valueGamma;
  if (t !== void 0 && (!Number.isFinite(t) || t < 0.5 || t > 2))
    throw RangeError("Frame value exponent must be finite and between 0.5 and 2.");
}
const U2 = {
  W: { hueDegrees: 0, saturationScale: 0.439924, brightnessScale: 1.21405 },
  U: { hueDegrees: 17.808301, saturationScale: 0.546189, brightnessScale: 1.239832 },
  B: { hueDegrees: 0, saturationScale: 0.261951, brightnessScale: 1.149978 },
  R: { hueDegrees: -7.214766, saturationScale: 0.471958, brightnessScale: 1.212936 },
  G: { hueDegrees: 0, saturationScale: 0.227323, brightnessScale: 1.290867 }
};
function ur(e, t, r) {
  if (t.colorCalibration !== "set-hsb-v1" || !["eld", "woe"].includes(t.setCode?.toLowerCase() ?? ""))
    return;
  const a = U2[r.toUpperCase()];
  if (!a) return;
  const s = e.getContext("2d"), n = e.width, o = e.height, i = [
    Math.floor(31 * n / 488),
    Math.floor(487 * o / 680),
    Math.ceil(214 * n / 488),
    Math.ceil(142 * o / 680)
  ], l = s.getImageData(...i);
  for (let c = 0; c < l.data.length; c += 4) {
    if (!l.data[c + 3]) continue;
    const u = _e(
      [l.data[c] / 255, l.data[c + 1] / 255, l.data[c + 2] / 255],
      a
    );
    for (let h = 0; h < 3; h++)
      l.data[c + h] = Math.round(u[h] * 255);
  }
  const d = document.createElement("canvas");
  d.width = i[2], d.height = i[3], d.getContext("2d").putImageData(l, 0, 0), s.save(), s.scale(n / 488, o / 680), s.beginPath(), s.moveTo(31.8, 488.3), s.lineTo(218, 488.3), s.bezierCurveTo(235, 488.3, 241, 490.5, 244, 496), s.lineTo(244, 627.4), s.lineTo(31.8, 627.4), s.closePath(), s.clip(), s.drawImage(
    d,
    i[0] * 488 / n,
    i[1] * 680 / o,
    i[2] * 488 / n,
    i[3] * 680 / o
  ), s.restore(), d.width = d.height = 0;
}
const kt = /* @__PURE__ */ new Map(), hr = /* @__PURE__ */ new WeakMap();
let _2 = 0, mr = 0;
const N2 = (e) => (hr.has(e) || hr.set(e, ++_2), hr.get(e));
function z2(e, t) {
  const r = e.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (w) => {
    const p = t.get(w);
    if (!p) throw Error(`Adventure asset unavailable: ${w}`);
    return p;
  }, s = p1(e).map(a), n = JSON.stringify([
    e.setCode,
    e.colorCalibration,
    e.colors,
    e.frameColors,
    e.manaSymbols,
    r.colors,
    r.frameColors,
    r.manaSymbols,
    s.map(N2)
  ]), o = kt.get(n);
  if (o)
    return kt.delete(n), kt.set(n, o), o;
  const i = a($0(e)), l = document.createElement("canvas");
  l.width = i.width, l.height = i.height;
  const d = l.getContext("2d"), c = l.width, u = l.height, h = () => {
    const w = document.createElement("canvas");
    return w.width = c, w.height = u, w;
  }, m = (w, p) => {
    const S = h(), y = S.getContext("2d"), k = L(w);
    if (y.drawImage(a($0(w)), 0, 0, c, u), p && k.length === 1 && ur(S, e, k[0]), k.length === 2) {
      "WUBRG".indexOf(k[1]) - "WUBRG".indexOf(k[0]) > 2 && k.reverse(), y.drawImage(a(`${mt}/${k[0].toLowerCase()}.png`), 0, 0, c, u), p && ur(S, e, k[0]);
      const v = h(), C = v.getContext("2d");
      C.drawImage(a(`${mt}/${k[1].toLowerCase()}.png`), 0, 0, c, u), p && ur(v, e, k[1]), C.globalCompositeOperation = "destination-in";
      const M = C.createLinearGradient(
        c * (p ? 0.22 : 0.43),
        0,
        c * (p ? 0.36 : 0.57),
        0
      );
      M.addColorStop(0, "#0000"), M.addColorStop(1, "#000"), C.fillStyle = M, C.fillRect(0, 0, c, u), y.drawImage(v, 0, 0), v.width = v.height = 0;
    }
    return S;
  };
  if (d.drawImage(i, 0, 0), L(e).length === 2) {
    const w = m(e, !1), p = w.getContext("2d");
    Xe(e) || (p.globalCompositeOperation = "destination-in", p.drawImage(a(m1), 0, 0, c, u)), d.drawImage(w, 0, 0), w.width = w.height = 0;
  }
  const g = m(r, !0), f = g.getContext("2d");
  if (f.globalCompositeOperation = "destination-in", f.drawImage(a(h1), 0, 0, c, u), d.save(), Xe(r) && (d.filter = "grayscale(1)"), d.drawImage(g, 0, 0), d.restore(), g.width = g.height = 0, Xe(e)) {
    d.save(), d.scale(c / 488, u / 680), d.beginPath();
    for (const [w, p] of [
      [34, 34],
      [388, 28]
    ])
      d.moveTo(38, w), d.lineTo(450, w), d.quadraticCurveTo(461, w + p / 2, 450, w + p), d.lineTo(38, w + p), d.quadraticCurveTo(29, w + p / 2, 38, w), d.closePath();
    d.clip();
    for (const [w, p] of [
      [34, 34],
      [388, 28]
    ])
      d.drawImage(a(g1), 22, 7, 196, 19, 29, w, 432, p);
    d.restore();
  }
  const b = c * u * 4;
  for (const [w, p] of kt) {
    if (mr + b <= 16 * 1024 * 1024) break;
    mr -= p.width * p.height * 4, kt.delete(w), p.width = p.height = 0;
  }
  return b <= 16 * 1024 * 1024 && (kt.set(n, l), mr += b), l;
}
const Y2 = ["ice", "chr", "all"], q2 = { leg: { "Adun Oakenshield": "{G}{R}{B}", "Angus Mackenzie": "{W}{U}{G}", "Arcades Sabboth": "{2}{W}{W}{G}{G}{U}{U}", "Axelrod Gunnarson": "{4}{B}{B}{R}{R}", "Ayesha Tanaka": "{U}{U}{W}{W}", "Barktooth Warbeard": "{4}{B}{R}{R}", "Bartel Runeaxe": "{3}{G}{R}{B}", "Boris Devilboon": "{3}{B}{R}", Chromium: "{2}{B}{B}{U}{U}{W}{W}", "Dakkon Blackblade": "{2}{B}{U}{U}{W}", "Gabriel Angelfire": "{3}{W}{W}{G}{G}", "Gosta Dirk": "{3}{W}{W}{U}{U}", "Gwendlyn Di Corci": "{R}{B}{B}{U}", Halfdane: "{1}{B}{U}{W}", "Hazezon Tamar": "{4}{W}{G}{R}", "Hunding Gjornersen": "{3}{U}{U}{W}", "Jacques le Vert": "{1}{W}{G}{R}", "Jasmine Boreal": "{3}{W}{G}", "Jedit Ojanen": "{4}{U}{W}{W}", "Jerrard of the Closed Fist": "{3}{G}{G}{R}", Johan: "{3}{W}{G}{R}", "Kasimir the Lone Wolf": "{4}{U}{W}", "Kei Takahashi": "{2}{W}{G}", "Lady Caleria": "{3}{W}{W}{G}{G}", "Lady Evangela": "{B}{U}{W}", "Lady Orca": "{5}{B}{R}", "Livonya Silone": "{2}{G}{G}{R}{R}", "Lord Magnus": "{3}{W}{W}{G}", "Marhault Elsdragon": "{3}{G}{R}{R}", Nebuchadnezzar: "{3}{B}{U}", "Nicol Bolas": "{2}{U}{U}{B}{B}{R}{R}", "Palladia-Mors": "{2}{W}{W}{G}{G}{R}{R}", "Pavel Maliki": "{4}{B}{R}", "Princess Lucrezia": "{3}{B}{U}{U}", Ragnar: "{U}{W}{G}", "Ramirez DePietro": "{3}{B}{B}{U}", "Ramses Overdark": "{2}{B}{B}{U}{U}", "Rasputin Dreamweaver": "{4}{W}{U}", "Riven Turnbull": "{5}{B}{U}", "Rohgahh of Kher Keep": "{2}{B}{B}{R}{R}", "Rubinia Soulsinger": "{2}{U}{W}{G}", "Sir Shandlar of Eberyn": "{4}{W}{G}", "Sivitri Scarzam": "{5}{B}{U}", "Sol'kanar the Swamp King": "{2}{R}{B}{U}", Stangg: "{4}{G}{R}", "Sunastian Falconer": "{3}{G}{R}", "Tetsuo Umezawa": "{R}{B}{U}", "The Lady of the Mountain": "{4}{G}{R}", "Tobias Andrion": "{3}{U}{W}", "Tor Wauki": "{2}{B}{B}{R}", "Torsten Von Ursus": "{3}{W}{G}{G}", "Tuknir Deathlock": "{G}{G}{R}{R}", "Ur-Drago": "{3}{B}{B}{U}{U}", "Vaevictis Asmadi": "{2}{B}{B}{R}{R}{G}{G}", "Xira Arien": "{G}{R}{B}" }, drk: { "Dark Heart of the Wood": "{B}{G}", "Marsh Goblins": "{B}{R}", "Scarwood Goblins": "{G}{R}" } }, ys = {
  wubrgSets: Y2,
  overrides: q2
};
function B1(e, t) {
  const r = e.setCode?.toLowerCase() ?? "", s = ys.overrides[r]?.[e.name ?? ""];
  if (s) {
    const n = [...s.matchAll(/\{([^}]+)\}/g)].map((o) => o[1]);
    return [...n].sort().join("|") === [...t].sort().join("|") ? n : [...t];
  }
  return !ys.wubrgSets.includes(r) || t.some((n) => !/^(?:\d+|X|[WUBRG])$/.test(n)) ? [...t] : [
    ...t.filter((n) => !"WUBRG".includes(n)),
    ...t.filter((n) => "WUBRG".includes(n)).sort((n, o) => "WUBRG".indexOf(n) - "WUBRG".indexOf(o))
  ];
}
function L1(e) {
  if (!/\bLand\b/.test(e)) return;
  const t = ["Plains", "Island", "Swamp", "Mountain", "Forest"].flatMap(
    (r, a) => new RegExp(`\\b${r}\\b`).test(e) ? ["WUBRG"[a]] : []
  );
  return t.length >= 1 && t.length <= 2 ? t : void 0;
}
function H2(e, t, r, a, s) {
  if (!/\bLand\b/.test(e) || t.length) return;
  const n = L1(e);
  if (n || /\b(Plains|Island|Swamp|Mountain|Forest)\b/.test(e) || ["lea", "leb", "2ed", "3ed"].includes(r?.toLowerCase() ?? ""))
    return n;
  if (!["2003", "2015", "future"].includes(a) || /\bArtifact\b/.test(e) || s == null) return;
  if (!Array.isArray(s) || !s.every((i) => typeof i == "string" && /^[WUBRGC]$/.test(i)))
    throw Error("Invalid produced mana.");
  const o = [..."WUBRG"].filter((i) => s.includes(i));
  return o.length >= 1 && o.length <= 2 ? o : void 0;
}
function X2(e) {
  const t = e.split(`
`).flatMap((r) => {
    const a = /^\(?\{T\}: Add (\{[WUBRGC]\}(?:,? (?:or )?\{[WUBRGC]\})*)\.\)?$/.exec(r);
    return a ? [...a[1].matchAll(/\{([WUBRGC])\}/g)].map((s) => s[1]) : [];
  });
  return t.length ? [...new Set(t)] : void 0;
}
function J2(e, t, r) {
  return /\b(Saga|Class|Planeswalker|Battle)\b/.test(t) || /^Level up\b/m.test(r) ? { ...e, frameAssetFamily: void 0 } : e;
}
function zt(e) {
  return e.rulesParagraphs ?? e.rulesText.split(`
`).filter(Boolean).map((t) => ({ role: "rules", runs: [{ text: t }] }));
}
function K2(e, t, r = "oracle", a = {}) {
  const s = t[r];
  if (!s) throw Error(`Missing ${r} printing wording`);
  if (typeof s.typeLine != "string" || typeof s.rulesText != "string")
    throw Error("Wording requires a type line and rules text");
  const n = a.rulesAlignment ?? r, o = n === "left" ? void 0 : t[n];
  if (n !== "left" && !o) throw Error(`Missing ${n} alignment wording`);
  const i = O({ ...e, typeLine: t.oracle.typeLine });
  return {
    ...e,
    ...s,
    canonicalTypeLine: e.canonicalTypeLine ?? t.oracle.typeLine,
    frameColors: e.frameColors ?? (i.land && !e.colors?.length ? L1(e.canonicalTypeLine ?? t.oracle.typeLine) : void 0),
    manaSymbols: s.manaSymbols ?? (r === "original" ? B1(e, e.manaSymbols ?? []) : t.oracle.manaSymbols ?? e.manaSymbols),
    // Clearing an absent paragraph override matters when switching from an
    // annotated printing: stale original runs must not replace Oracle text.
    rulesParagraphs: s.rulesParagraphs,
    rulesAlignment: o ? { mode: "auto", reference: zt(o) } : { mode: "left" },
    artifact: e.artifact ?? i.artifact,
    land: e.land ?? i.land,
    creature: e.creature ?? i.creature,
    legendary: e.legendary ?? i.legendary,
    wordingMode: r,
    symbolStyle: a.symbolStyle ?? (r === "oracle" ? "modern" : "original")
  };
}
const ks = {
  permanent: { x: 261, y: 438, width: 189, height: 178 },
  spell: { x: 41.7, y: 499, width: 191, height: 122 }
};
function V2(e, t) {
  const r = t.faces?.[1];
  if (!r) throw Error("Adventure spell is missing.");
  const a = (h) => {
    const m = zt({
      rulesText: h.rulesText ?? "",
      rulesParagraphs: h.rulesParagraphs
    });
    return h.rulesAlignment?.mode === "left" ? m.map((g) => g.role === "rules" ? { ...g, align: "left" } : g) : m;
  }, s = { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }, n = a(t), o = {
    ...ks.permanent,
    exclusions: t.power != null && t.toughness != null ? [[368, 601, 94, 51]] : []
  }, i = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? n : n, l = t.rulesAlignment?.mode !== "left" && i.length === 1 && i[0].role === "rules" ? Nt(e, n, i, o, 22.5, 9, 1, s) : null, d = a(r), c = ks.spell, u = W(e, d, c, 20.25, 20.25, s);
  return {
    permanent: l || W(e, n, o, 22.5, 9, s),
    spell: !u.overflow && u.lines.length <= 4 ? u : W(e, d, c, 22.5, 9, s)
  };
}
function Z2(e) {
  const t = (e.rarity ?? "common")[0].toUpperCase(), r = e.collectorNumber ?? "";
  if ((e.collectorFormat ?? (e.setCode?.toLowerCase() === "woe" ? "rarity-first" : "number-first")) === "number-first") return `${r} ${t}`.trim();
  const s = r.split("/")[0].replace(/^(\d+)/, (n) => n.padStart(4, "0"));
  return `${t} ${s}`.trim();
}
function G1(e, t, r) {
  if (t.power != null && t.toughness != null) {
    const s = r.get(ja(t));
    if (!s) throw Error("Adventure power/toughness plate is unavailable.");
    const [n, o, i, l] = Ca.stats;
    e.drawImage(s, n * 488, o * 680, i * 488, l * 680), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia', Se(e, `${t.power}/${t.toughness}`, 420, 627, 77, t.textInk);
  }
  if (We(t)) {
    const s = r.get(u0);
    if (!s) throw Error("Adventure authenticity stamp is unavailable.");
    e.drawImage(s, ...$t.saga);
  }
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(Z2(t), 32, 645), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), t.artist && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 93, 658), e.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', e.fillText(t.artist, 108, 658, 210)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 658, 182));
}
let vs = null;
function $1() {
  return vs ??= document.fonts.load('700 25px "CardRenderer MTG Beleren Small Caps"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Inset card footer lettering needs card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw vs = null, e;
  });
}
function Q2(e, t, r) {
  if (e.drawImage(z2(t, r), 0, 0, 488, 680), O(t).legendary) {
    const a = r.get(f1(t));
    if (!a) throw Error("Adventure crown is unavailable.");
    e.fillStyle = ve(t) ?? "#000", e.fillRect(19.2, 18.8, 449.6, 12.1), e.drawImage(a, 13.4, 13, 461.4, 113.4);
  }
}
function e5(e, t, r) {
  const a = t.manaSymbols ?? [], s = 23.4, n = 1.8, o = 452, i = a.length * s + Math.max(0, a.length - 1) * n;
  e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle", re(
    e,
    t.name,
    41.7,
    51,
    (a.length ? o - i - 8 : 449) - 41.7,
    26,
    !0
  ), a.forEach(
    (f, b) => te(e, f, o - i + b * (s + n), 38.7, s, r, !0)
  );
  const l = V(t), d = r.get(l ?? ""), c = at(t), u = d ? Math.min(58.56 / (d.width * c[2]), 27.9 / (d.height * c[3])) : 0, h = d ? d.width * c[2] * u : 0, m = d ? d.height * c[3] * u : 0, g = [450.3 - h, 402 - m / 2, h, m];
  re(
    e,
    t.typeLine ?? "",
    41.7,
    401.5,
    (d ? g[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    t.textInk
  ), d && (Ge(l) || t.setSymbol ? e.drawImage(d, ...g) : Ve(e, d, t.setCode, t.rarity, ...g, c));
}
function t5(e, t, r) {
  const a = t.manaSymbols ?? [], s = 19.8, n = 1.2, o = 233, i = a.length * s + Math.max(0, a.length - 1) * n;
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "middle", re(
    e,
    t.name,
    40,
    443,
    (a.length ? o - i - 4 : o) - 40,
    20.1,
    !0
  ), a.forEach(
    (l, d) => te(e, l, o - i + d * (s + n), 432, s, r, !0)
  ), re(
    e,
    t.typeLine ?? "",
    40,
    473.5,
    193,
    20.1,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    t.textInk
  );
}
function r5(e, t, r, a, s) {
  const n = t.faces?.[1];
  if (!n) throw Error("Adventure spell is missing.");
  e.save(), e.fillStyle = ve(t) ?? "#000", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && Q2(e, t, r);
  const [o, i, l, d] = Ca.art;
  if (Le(e, t, r, [o * 488, i * 680, l * 488, d * 680], s), s !== "artwork") {
    e5(e, t, r), t5(e, n, r);
    const c = V2(e, t);
    ye(e, c.permanent, r), ye(e, c.spell, r), G1(e, t, r);
  }
  e.restore();
}
const vt = /* @__PURE__ */ new Map(), gr = /* @__PURE__ */ new WeakMap();
let a5 = 0, fr = 0;
const s5 = (e) => (gr.has(e) || gr.set(e, ++a5), gr.get(e));
function n5(e, t) {
  const r = _t(e), a = (S) => {
    const y = t.get(S);
    if (!y) throw Error(`Prepared asset unavailable: ${S}`);
    return y;
  }, s = b1(e).map(a), n = Mt(e), o = Mt(r), i = O(e).legendary, l = JSON.stringify([
    n,
    o,
    i,
    Xe(r),
    s.map(s5)
  ]), d = vt.get(l);
  if (d)
    return vt.delete(l), vt.set(l, d), d;
  const c = a(xt(e)), u = c.width, h = c.height, m = () => {
    const S = document.createElement("canvas");
    return S.width = u, S.height = h, S;
  }, g = m(), f = g.getContext("2d");
  f.drawImage(c, 0, 0);
  const b = (S, y, k = !1) => {
    const v = m(), C = v.getContext("2d");
    k && (C.filter = "grayscale(1)"), C.drawImage(S, 0, 0, u, h), C.filter = "none", C.globalCompositeOperation = "destination-in", C.drawImage(a(C0(y)), 0, 0, u, h), f.drawImage(v, 0, 0), v.width = v.height = 0;
  }, w = (S) => a(`${K0}/${S.toLowerCase()}.png`);
  if (n.length === 2) {
    const S = m(), y = S.getContext("2d");
    y.drawImage(w(n[0]), 0, 0, u, h);
    const k = m(), v = k.getContext("2d");
    v.drawImage(w(n[1]), 0, 0, u, h), v.globalCompositeOperation = "destination-in";
    const C = v.createLinearGradient(u * 0.43, 0, u * 0.57, 0);
    C.addColorStop(0, "#0000"), C.addColorStop(1, "#000"), v.fillStyle = C, v.fillRect(0, 0, u, h), y.drawImage(k, 0, 0), b(S, "pinline"), b(w(n[0]), "rules"), b(w(n[1]), "rulesRight"), S.width = S.height = k.width = k.height = 0;
  }
  if (o.length === 2 ? (b(w(o[0]), "prepare"), b(w(o[1]), "prepareRight"), b(a(xt(r)), "prepareTypeTitle", Xe(r))) : b(a(xt(r)), "prepare"), i) {
    f.save(), f.scale(u / 488, h / 680), f.fillStyle = ve(e) ?? "#000", f.fillRect(19.2, 18.8, 449.6, 12.1);
    const S = n.length === 2 ? n : [Ra(e)];
    if (f.drawImage(a(Lr(S[0])), 13.4, 13, 461.4, 113.4), S.length === 2) {
      const y = m(), k = y.getContext("2d");
      k.scale(u / 488, h / 680), k.drawImage(a(Lr(S[1])), 13.4, 13, 461.4, 113.4), k.globalCompositeOperation = "destination-in";
      const v = k.createLinearGradient(210, 0, 278, 0);
      v.addColorStop(0, "#0000"), v.addColorStop(1, "#000"), k.fillStyle = v, k.fillRect(0, 0, 488, 680), f.drawImage(y, 0, 0, 488, 680), y.width = y.height = 0;
    }
    f.restore();
  }
  const p = u * h * 4;
  for (const [S, y] of vt) {
    if (fr + p <= 16 * 1024 * 1024) break;
    fr -= y.width * y.height * 4, vt.delete(S), y.width = y.height = 0;
  }
  return p <= 16 * 1024 * 1024 && (vt.set(l, g), fr += p), g;
}
function o5(e, t) {
  const r = _t(t), a = (s, n, o, i) => {
    const l = zt({
      rulesText: s.rulesText ?? "",
      rulesParagraphs: s.rulesParagraphs
    });
    return W(
      e,
      s.rulesAlignment?.mode === "left" ? l.map((d) => d.role === "rules" ? { ...d, align: "left" } : d) : l,
      {
        x: n[0] * 488,
        y: n[1] * 680,
        width: n[2] * 488,
        height: n[3] * 680,
        exclusions: i
      },
      o,
      9,
      { leading: 1, paragraphGap: 0.4, flavorGap: 0.75, flavorSeparator: !0 }
    );
  };
  return {
    permanent: a(
      t,
      Ma.rules,
      21.75,
      We(t) ? [[213, 620, 63, 26]] : []
    ),
    spell: a(
      r,
      N3.rules,
      21.75,
      t.power != null && t.toughness != null ? [[370, 603, 93, 49]] : []
    )
  };
}
function i5(e, t, r) {
  e.drawImage(n5(t, r), 0, 0, 488, 680);
}
function l5(e, t, r) {
  const a = (h, m) => {
    const g = h.manaSymbols ?? [], f = m ? 19.8 : 23.4, b = m ? 1.2 : 1.8, w = m ? 1042 / 2010 * 488 : 41.7, p = 452, S = g.length * f + Math.max(0, g.length - 1) * b;
    e.fillStyle = m ? "#fff" : "#17140f", e.textAlign = "left", e.textBaseline = "middle", re(
      e,
      h.name,
      w,
      m ? 444 : 52,
      (g.length ? p - S - (m ? 4 : 8) : p) - w,
      m ? 20 : 26,
      !0
    ), g.forEach(
      (y, k) => te(
        e,
        y,
        p - S + k * (f + b),
        m ? 434.5 : 38.7,
        f,
        r,
        !0
      )
    );
  };
  a(t, !1);
  const s = V(t), n = r.get(s ?? ""), o = at(t), i = n ? Math.min(58.56 / (n.width * o[2]), 27.9 / (n.height * o[3])) : 0, l = n ? n.width * o[2] * i : 0, d = n ? n.height * o[3] * i : 0, c = [450.3 - l, 402 - d / 2, l, d];
  re(
    e,
    t.typeLine ?? "",
    41.7,
    401.5,
    (n ? c[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    t.textInk
  ), n && (Ge(s) || t.setSymbol ? e.drawImage(n, ...c) : Ve(e, n, t.setCode, t.rarity, ...c, o));
  const u = _t(t);
  a(u, !0), re(
    e,
    u.typeLine ?? "",
    1042 / 2010 * 488,
    477,
    195.2,
    20,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    u.textInk
  );
}
function d5(e, t, r, a, s) {
  _t(t), e.save(), e.fillStyle = ve(t) ?? "#000", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && i5(e, t, r);
  const [n, o, i, l] = Ma.art;
  if (Le(e, t, r, [n * 488, o * 680, i * 488, l * 680], s), s !== "artwork") {
    l5(e, t, r);
    const d = o5(e, t);
    ye(e, d.permanent, r), ye(e, d.spell, r), G1(
      e,
      { ...t, collectorFormat: t.collectorFormat ?? "rarity-first" },
      r
    );
  }
  e.restore();
}
function c5(e, t, r) {
  e.fillStyle = ve(t) ?? "#000", e.fillRect(0, 0, 488, 680);
  const a = De(t), s = a.map((n) => G3(n.face, r));
  if (a.forEach((n, o) => {
    e.save(), e.beginPath(), e.rect(0, o ? 0 : 324, 488, o ? 324 : 356), e.clip(), e.drawImage(s[o], 0, 0, 488, 680), e.restore();
  }), a[0]?.face.layout?.endsWith("-fuse")) {
    const n = document.createElement("canvas");
    n.width = 488, n.height = 680;
    const o = n.getContext("2d");
    o.drawImage(s[1], 0, 0, 488, 680), o.globalCompositeOperation = "destination-in";
    const i = o.createLinearGradient(0, 344, 0, 304);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), o.fillStyle = i, o.fillRect(0, 0, 488, 680), e.save(), e.beginPath(), e.rect(434, 0, 54, 680), e.clip(), e.drawImage(s[0], 0, 0, 488, 680), e.drawImage(n, 0, 0), e.restore(), n.width = n.height = 0;
  }
}
function u5(e, t, r) {
  const o = t.manaSymbols ?? [], i = o.length * 23.4 + Math.max(0, o.length - 1) * 1.7;
  e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left", re(
    e,
    t.name,
    70,
    53,
    Math.max(1, (o.length ? 331 - i - 7 : 331) - 70),
    26,
    !0
  ), o.forEach((g, f) => te(e, g, 331 - i + f * (23.4 + 1.7), 39.5, 23.4, r, !0));
  const l = V(t), d = r.get(l ?? ""), c = at(t), u = d ? Math.min(26 / (d.width * c[2]), 15.5 / (d.height * c[3])) : 0, h = d ? d.width * c[2] * u : 0, m = d ? d.height * c[3] * u : 0;
  if (re(
    e,
    t.typeLine ?? "",
    70,
    277,
    (d ? 331 - h - 6 : 331) - 70,
    18.5,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    t.textInk
  ), d) {
    const g = [331 - h, 277 - m / 2, h, m];
    Ge(l) || t.setSymbol ? e.drawImage(d, ...g) : Ve(e, d, t.setCode, t.rarity, ...g, c);
  }
}
function h5(e, t, r) {
  e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic";
  const a = [
    ...new Set((t.faces ?? []).map((s) => s.artist ?? t.artist ?? "").filter(Boolean))
  ].join(" & ");
  if (e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""} ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    646
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 660), a && (e.font = '11px "CardRenderer MTG Artist Credit", serif', e.fillText("a", 95, 660), e.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif', e.fillText(a, 110, 660, 193)), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 455, 646, 170)), We(t)) {
    const s = r.get(Kn);
    if (!s) throw Error("Modern split authenticity stamp unavailable.");
    e.drawImage(s, ...$t.split);
  }
}
const pr = K.MSE_SPLIT_BRIDGE_ROOT;
function O1(e, t) {
  const r = L(e);
  r.length === 2 && "WUBRG".indexOf(r[1]) - "WUBRG".indexOf(r[0]) > 2 && r.reverse();
  const a = (t ? r[0] : r.at(-1))?.toLowerCase() ?? "c";
  return {
    color: `${pr}/${a}bridge.png`,
    gold: r.length > 1 ? `${pr}/mbridge.png` : null,
    mask: r.length > 1 ? `${pr}/bridgemask.png` : null
  };
}
function m5(e) {
  return (e.faces ?? []).flatMap((t, r) => Object.values(O1(t, r)));
}
function g5(e, t, r) {
  const a = (c) => {
    const u = r.get(c);
    if (!u) throw Error(`Fuse bridge asset unavailable: ${c}`);
    return u;
  }, s = t.faces.map((c, u) => {
    const h = O1(c, u), m = a(h.color), g = document.createElement("canvas");
    g.width = m.width, g.height = m.height;
    const f = g.getContext("2d");
    return f.drawImage(m, 0, 0), h.gold && h.mask && (f.globalCompositeOperation = "destination-in", f.drawImage(w1(a(h.mask)), 0, 0, g.width, g.height), f.globalCompositeOperation = "destination-over", f.drawImage(a(h.gold), 0, 0, g.width, g.height)), g;
  }), [n, o] = s, i = o.getContext("2d");
  i.globalCompositeOperation = "destination-in";
  const l = i.createLinearGradient(0, 0, o.width, 0);
  l.addColorStop(0, "#0000"), l.addColorStop(1, "#000"), i.fillStyle = l, i.fillRect(0, 0, o.width, o.height), e.save(), e.translate(0, 680), e.rotate(-Math.PI / 2);
  const d = [
    253 * 680 / 523,
    306 * 488 / 375,
    16 * 680 / 523,
    30 * 488 / 375
  ];
  e.drawImage(n, ...d), e.drawImage(o, ...d), e.restore();
  for (const c of s) c.width = c.height = 0;
}
function f5(e, t, r, a) {
  const [s, n, o, i] = Ut(r, a).rules, l = zt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), d = { x: s, y: n, width: o, height: i }, c = {
    leading: 1.02,
    paragraphGap: 0.4,
    flavorGap: 0.65,
    centerOffset: r === "old" ? 0 : 2
  }, u = r === "old" ? 24.5 : r === "m15" ? a ? 20.25 : 24.25 : 21.5;
  if ((r !== "m15" || a) && t.rulesAlignment?.mode !== "left" && l.length === 1) {
    const h = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? l : l, m = Nt(e, l, h, d, u, 13, 2, c);
    if (m) return m;
  }
  return W(e, l, d, u, 13, c);
}
function p5(e, t, r) {
  const a = Pe(t);
  if (!a) throw Error("No native split plate for this printing.");
  if (a === "m15") return c5(e, t, r);
  const s = a !== "old" && Lt(t), n = Ut(a, s);
  e.fillStyle = Ie(t.setCode, t.borderColor).border, e.fillRect(0, 0, 488, 680), De(t).forEach((o, i) => {
    const l = K3(o.face, a, s, i, r);
    e.save(), e.translate(o.x, o.y), e.rotate(-Math.PI / 2);
    const [d, c, u, h] = n.frame;
    e.drawImage(l, d - (s && i ? 8 * 680 / 523 : 0), c, u, h), e.restore();
  }), s && g5(e, t, r);
}
function b5(e, t, r, a, s) {
  if (r === "m15") return u5(e, t, s);
  const n = Ut(r, a), o = r === "old", [i, l, d, c] = n.title, u = t.manaSymbols ?? [], h = 23.4, m = 1.7, g = 316, f = u.length * h + Math.max(0, u.length - 1) * m;
  if (e.fillStyle = o ? "#f2eee3" : "#17140f", e.textBaseline = "middle", e.textAlign = "left", o) {
    const C = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = C.a + C.c, e.shadowOffsetY = C.b + C.d;
  }
  re(
    e,
    t.name,
    i,
    l + c / 2 - (o ? 2 : 0),
    Math.max(1, u.length ? g - f - i - 7 : d),
    o ? 29 : 26.5,
    !o,
    1,
    o ? "CardRenderer MTG Goudy" : "CardRenderer MTG Matrix"
  ), u.forEach(
    (C, M) => te(e, C, g - f + M * (h + m), o ? 30.5 : 40, h, s, !o)
  );
  const b = V(t), w = s.get(b ?? ""), p = at(t), [S, y, k, v] = n.type;
  if (re(
    e,
    t.typeLine ?? "",
    S,
    y + v / 2,
    k - (w ? 33 : 0),
    o ? 22 : 21.5,
    !1,
    1,
    o ? "CardRenderer MTG MPlantin" : "CardRenderer MTG Matrix",
    0,
    t.textInk
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, w) {
    const C = Math.min(
      32 / (w.width * p[2]),
      (o ? 26 : 22) / (w.height * p[3])
    ), M = w.width * p[2] * C, R = w.height * p[3] * C, x = [(o ? 306 : 316) - M, y + v / 2 - (o ? 1.5 : 0) - R / 2, M, R];
    Ge(b) || t.setSymbol ? e.drawImage(w, ...x) : Ve(e, w, t.setCode, t.rarity, ...x, p);
  }
}
function S5(e, t, r, a, s, n) {
  const o = Ut(a, s), i = a === "old";
  e.fillStyle = i ? "#eeeae1" : "#17140f", e.textAlign = i ? "center" : "left", e.textBaseline = "middle", e.font = i ? '19px "CardRenderer MTG MPlantin", Georgia' : '700 14px "CardRenderer MTG Matrix", Georgia';
  const l = n.get(`${B}/img/manaSymbols/brush.svg`);
  if (!i && l && e.drawImage(l, 36, o.artistY - 4, 20, 8), i) {
    const d = e.getTransform();
    e.shadowColor = "#000b", e.shadowOffsetX = d.a + d.c, e.shadowOffsetY = d.b + d.d;
  }
  e.fillText(
    `${i ? "Illus. " : ""}${t.artist ?? r.artist ?? ""}`,
    i ? 177 : 60,
    o.artistY,
    272
  ), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.font = `${i ? 10.2 : 10}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && e.fillText(
    `${r.legalText}${r.collectorNumber ? " " + r.collectorNumber : ""}`,
    i ? 177 : 36,
    o.legalY,
    280
  );
}
function w5(e, t, r, a, s) {
  const n = Pe(t);
  if (!n) throw Error("No native split plate for this printing.");
  const o = n !== "old" && Lt(t), i = Ut(n, o);
  e.save(), s !== "artwork" && p5(e, t, r), a && e.drawImage(a, 0, 0, 488, 680);
  for (const l of De(t))
    e.save(), e.translate(l.x, l.y), e.rotate(-Math.PI / 2), Le(e, l.face, r, i.art, s), s !== "artwork" && (b5(e, l.face, n, o, r), V3(e, l.face, r, i.rules[1] + i.rules[3] / 2), ye(e, f5(e, l.face, n, o), r), n !== "m15" && S5(e, l.face, t, n, o, r)), e.restore();
  if (n === "m15" && s !== "artwork" && h5(e, t, r), o && s !== "artwork") {
    e.translate(0, 680), e.rotate(-Math.PI / 2);
    const l = o1(t).map(
      (d) => n === "m15" ? { ...d, align: "center" } : d
    );
    ye(
      e,
      W(
        e,
        l,
        n === "m15" ? { x: 70, y: 441, width: 577, height: 20 } : { x: 38, y: 407, width: 608, height: 26 },
        n === "m15" ? 18 : 21,
        12
      ),
      r
    );
  }
  e.restore();
}
let js;
function y5(e) {
  return Pe(e) === "m15" ? $1() : Pe(e) !== "eighth" ? Promise.resolve() : js ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('24px "CardRenderer MTG Matrix"')
  ]).then((t) => {
    if (t.some((r) => !r.length || r.some((a) => a.status !== "loaded")))
      throw Error("Split Matrix fonts are unavailable. Load card-glint/magic/fonts.css.");
  }).catch((t) => {
    throw js = void 0, t;
  });
}
const Qe = {
  reminder: { x: 42.3, y: 78, width: 197 },
  chapters: { x: 65.1, width: 171 },
  top: 80,
  reminderBottom: 201,
  bottom: 569,
  reverseStatsBottom: 535
}, k5 = {
  maximumSize: 20.7,
  padding: 24,
  equalCells: 0,
  lastLift: 0,
  bottomSpace: 0.15
};
function v5(e, t, r = k5) {
  const a = m0(t), s = a.filter((f) => !f.badges.length), n = a.filter((f) => f.badges.length), o = (f, b = !1) => [
    {
      role: "rules",
      runs: b ? [{ text: f, italic: !0 }] : f.split(/(\([^)]*\))/g).filter(Boolean).map((w) => ({ text: w, italic: w.startsWith("(") }))
    }
  ], i = { leading: 0.98, paragraphGap: 0.3, flavorGap: 0 }, l = s.length ? Qe.reminderBottom : Qe.top, d = t.reverseStats && t.layout === "transform" ? Qe.reverseStatsBottom : Qe.bottom, c = W(
    e,
    s.flatMap((f) => o(f.text, f.reminder)),
    { ...Qe.reminder, height: l - Qe.top },
    20.4,
    12,
    { ...i, centerOffset: -3 }
  );
  let u = r.maximumSize, h = [], m = [];
  for (; ; ) {
    const f = n.map(
      (y) => Math.max(
        W(
          e,
          o(y.text),
          { ...Qe.chapters, y: 0, height: 2e3 },
          u,
          u,
          i
        ).height + r.padding,
        Oe.minimumRowHeight + Math.max(0, y.badges.length - 1) * Oe.gap
      )
    ), b = d - l;
    if (f.reduce((y, k) => y + k, 0) > b && u > 12) {
      u = Math.max(12, u - 0.25);
      continue;
    }
    if (f.reduce((y, k) => y + k, 0) > b)
      throw Error("Saga chapter text or badges do not fit the available column.");
    const w = Math.max(0, b - f.reduce((y, k) => y + k, 0)) * (1 - (n.length === 2 && n[0].badges.length > 1 ? r.bottomSpace : 0)) / Math.max(1, n.length);
    m = f.map((y) => y + w);
    const p = b / Math.max(1, n.length);
    m = m.map((y) => y * (1 - r.equalCells) + p * r.equalCells);
    let S = l;
    h = n.map((y, k) => {
      const v = m[k], C = W(
        e,
        o(y.text),
        { ...Qe.chapters, y: S + 7, height: v - 14 },
        u,
        u,
        { ...i, centerOffset: k === n.length - 1 ? -r.lastLift : 0 }
      );
      return S += v, C;
    });
    break;
  }
  let g = l;
  return {
    reminder: c,
    size: u,
    rows: n.map((f, b) => {
      const w = { ...f, top: g, height: m[b], layout: h[b] };
      return g += w.height, w;
    })
  };
}
function j5(e, t, r, a, s) {
  const n = (k) => {
    const v = r.get(k);
    if (!v) throw Error(`Saga asset unavailable: ${k}`);
    return v;
  };
  e.save(), e.fillStyle = ve(t) ?? "#090806", e.fillRect(0, 0, j, T), a && e.drawImage(a, 0, 0, j, T), s !== "artwork" && (e.drawImage(n(ka(t)), 0, 0, j, T), F3(e, t, r));
  const o = u1.art;
  if (Le(e, t, r, [o[0] * j, o[1] * T, o[2] * j, o[3] * T], s), s === "artwork") {
    e.restore();
    return;
  }
  const i = Br(t);
  i && e.drawImage(n(i), 33.5, 35.6, 29, 32), e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const l = t.manaSymbols ?? [], d = 23.4, c = 1.8, u = 452, h = l.length * d + Math.max(0, l.length - 1) * c, m = t.layout === "transform" ? 78 : 41.7;
  re(
    e,
    t.name,
    m,
    51,
    (l.length ? u - h - 8 : 449) - m,
    26,
    !0
  ), l.forEach(
    (k, v) => te(e, k, u - h + v * (d + c), 38.7, d, r, !0)
  );
  const g = V(t), f = r.get(g ?? ""), b = at(t), w = f ? Math.min(58.56 / (f.width * b[2]), 25.9 / (f.height * b[3])) : 0, p = f ? f.width * b[2] * w : 0, S = f ? f.height * b[3] * w : 0, y = [450.3 - p, 594.25 - S / 2, p, S];
  if (re(
    e,
    t.typeLine ?? "",
    41.7,
    594.5,
    (f ? y[0] - 7 : 449) - 41.7,
    22,
    !0,
    1,
    "CardRenderer MTG Beleren",
    0,
    t.textInk
  ), f && (Ge(g) || t.setSymbol ? e.drawImage(f, ...y) : Ve(e, f, t.setCode, t.rarity, ...y, b)), t.reverseStats && t.layout === "transform" && (e.fillStyle = "#65605a", e.font = 'italic 20px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.fillText(`${t.reverseStats.power}/${t.reverseStats.toughness}`, 41, 553)), Ke(e)) {
    const k = v5(e, t);
    ye(e, k.reminder, r);
    for (const v of k.rows)
      e.drawImage(n(c1), 48.8, v.top - 1, 192.6, 2), ye(e, v.layout, r), v.badges.forEach((C, M) => {
        const R = v.top + v.height / 2 + (M - (v.badges.length - 1) / 2) * Oe.gap;
        e.drawImage(
          n(d1),
          Oe.x,
          R - Oe.height / 2,
          Oe.width,
          Oe.height
        ), e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.font = `550 ${Oe.fontSize}px "${Oe.fontFamily}", Georgia`, e.fillText(
          C,
          Oe.centerX,
          R + Oe.numeralOffsetY
        );
      });
  }
  We(t) && e.drawImage(n(u0), ...$t.saga), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 210), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 182)), e.restore();
}
let Cs = null;
function C5() {
  return Cs ??= document.fonts.load('550 22px "CardRenderer MTG Chapter"').then((e) => {
    if (!e.length || e.some((t) => t.status !== "loaded"))
      throw Error("Saga chapter numerals need card-glint/magic/fonts.css.");
  }).catch((e) => {
    throw Cs = null, e;
  });
}
function R5(e, t, r) {
  const [a, s, n, o] = (r ? ya : wa).rules, i = zt({
    rulesText: t.rulesText ?? "",
    rulesParagraphs: t.rulesParagraphs
  }), l = { x: a, y: s, width: n, height: o }, d = {
    leading: 0.98,
    paragraphGap: 0.32,
    flavorGap: 0.65,
    centerOffset: r ? 0 : 2.5
  };
  let c = r ? 22 : t.setCode?.toLowerCase() === "hou" ? 24.5 : 22.5, u = W(e, i, l, c, 14, d);
  if (!r && i.length === 1 && u.lines.length > 1 && u.lines.at(-1).width < n * 0.18)
    for (let h = c - 0.25; h >= c * 0.9; h -= 0.25) {
      const m = W(e, i, l, h, h, d);
      if (!m.overflow && m.lines.length < u.lines.length) {
        c = h, u = m;
        break;
      }
    }
  if (!r && t.rulesAlignment?.mode !== "left") {
    const h = t.rulesAlignment?.mode === "auto" ? t.rulesAlignment.reference ?? i : i, m = Nt(
      e,
      i,
      h,
      l,
      c,
      14,
      1,
      d
    );
    if (m) return m;
  }
  return u;
}
function M5(e, t, r, a, s) {
  const n = De(t), o = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Aftermath asset unavailable: ${i}`);
    return l;
  };
  e.save(), e.fillStyle = ve(t) ?? "#090806", e.fillRect(0, 0, 488, 680), a && e.drawImage(a, 0, 0, 488, 680), s !== "artwork" && n.forEach((i, l) => {
    e.save(), e.beginPath(), e.rect(0, l ? ct : 0, 488, l ? 680 - ct : ct), e.clip(), e.drawImage(o(r1(i.face)), 0, 0, 488, 680), e.restore();
  }), n.forEach((i, l) => {
    e.save(), l && (e.translate(488, ct), e.rotate(Math.PI / 2));
    const d = i.face, c = l ? ya : wa;
    if (Le(e, d, r, c.art, s), s !== "artwork") {
      e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
      const u = d.manaSymbols ?? [], h = 23.4, m = 1.6, g = l ? 246 : 451, f = u.length * h + Math.max(0, u.length - 1) * m, [b, w] = c.title;
      re(e, d.name, b, w + 15.5, g - f - b - 7, 26, !0), u.forEach(
        (S, y) => te(e, S, g - f + y * (h + m), w + 3, h, r, !0)
      );
      const p = l ? void 0 : r.get(V(d) ?? "");
      if (re(
        e,
        d.typeLine ?? "",
        c.type[0],
        c.type[1] + 16.5,
        c.type[2] - (p ? 45 : 0),
        23,
        !0,
        1,
        "CardRenderer MTG Beleren",
        0,
        d.textInk
      ), p) {
        const S = at(d), y = Math.min(50 / (p.width * S[2]), 27 / (p.height * S[3])), k = p.width * S[2] * y, v = p.height * S[3] * y, C = [451 - k, 252.3 - v / 2, k, v];
        Ge(V(d)) || d.setSymbol ? e.drawImage(p, ...C) : Ve(e, p, d.setCode, d.rarity, ...C, S);
      }
      ye(e, R5(e, d, !!l), r);
    }
    e.restore();
  }), s !== "artwork" && (We(t) && e.drawImage(o(t1), ...$t.aftermath), e.fillStyle = "#fff", e.textAlign = "left", e.textBaseline = "alphabetic", e.font = '11px "CardRenderer MTG Relay", sans-serif', e.fillText(
    `${t.collectorNumber ?? ""}  ${(t.rarity ?? "common")[0].toUpperCase()}`,
    32,
    645
  ), e.fillText(`${t.setCode?.toUpperCase() ?? ""} • EN`, 32, 658), e.font = '11px "CardRenderer MTG Artist Credit", serif', t.artist && e.fillText("a", 93, 658), e.font = '11px "CardRenderer MTG Beleren", serif', e.fillText(t.artist ?? "", 108, 658, 220), t.legalText && (e.textAlign = "right", e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.fillText(t.legalText, 454, 646, 177))), e.restore();
}
function x5(e, t, r, a) {
  const s = a.inkExpansion ?? 0;
  if (!Number.isFinite(s) || s < 0 || s > 1)
    throw Error("Historical mana ink expansion is outside its supported range.");
  if (!s) return;
  if (!Number.isInteger(t) || !Number.isInteger(r) || t <= 0 || r <= 0 || e.length !== t * r * 4)
    throw Error("Historical mana ink pixels do not match their dimensions.");
  const n = Bt(a.discColor), o = Bt(a.inkColor), i = n.map((m, g) => m - o[g]), l = i.reduce((m, g) => m + g * g, 0);
  if (l < 0.01) throw Error("Historical mana palette has no ink contrast");
  const d = new Float32Array(t * r);
  for (let m = 0; m < d.length; m++)
    e[m * 4 + 3] < 255 || (d[m] = Math.max(
      0,
      Math.min(1, i.reduce((g, f, b) => g + f * (n[b] - e[m * 4 + b] / 255), 0) / l)
    ));
  const c = Math.min(t, r) * s / 24, u = Math.ceil(c), h = [];
  for (let m = -u; m <= u; m++)
    for (let g = -u; g <= u; g++) {
      const f = Math.max(0, Math.min(1, c + 1 - Math.hypot(g, m)));
      f && h.push({ x: g, y: m, weight: f });
    }
  for (let m = 0; m < r; m++)
    for (let g = 0; g < t; g++) {
      const f = m * t + g;
      if (e[f * 4 + 3] < 255) continue;
      let b = d[f];
      for (const w of h) {
        const p = g + w.x, S = m + w.y;
        p >= 0 && p < t && S >= 0 && S < r && (b = Math.max(b, d[S * t + p] * w.weight));
      }
      if (!(b <= d[f]))
        for (let w = 0; w < 3; w++)
          e[f * 4 + w] = Math.round(255 * (n[w] * (1 - b) + o[w] * b));
    }
}
function T5(e, t, r) {
  const a = Bt(t.discColor), s = Bt(t.inkColor), n = a.map((i, l) => i - s[l]), o = n.reduce((i, l) => i + l * l, 0);
  if (o < 0.01) throw Error("Historical mana palette has no ink contrast");
  for (let i = 0; i < e.length; i += 4) {
    if (!e[i + 3]) continue;
    const l = Math.max(
      0,
      Math.min(1, n.reduce((d, c, u) => d + (e[i + u] / 255 - s[u]) * c, 0) / o)
    );
    for (let d = 0; d < 3; d++)
      e[i + d] = Math.round(255 * (s[d] * (1 - l) + r[d] * l));
  }
}
async function D5(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.width, a.height = e.height;
  try {
    const s = a.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("Historical mana preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, a.width, a.height);
    return t.inkExpansion && x5(n.data, a.width, a.height, t), T5(n.data, t, r), s.putImageData(n, 0, 0), await createImageBitmap(a);
  } finally {
    a.width = a.height = 0;
  }
}
function I5(e, t, r) {
  const { width: a, height: s, data: n } = e;
  if (t.width !== a || t.height !== s || t.data.length !== n.length || !Number.isInteger(r) || r < 0 || r > Math.max(a, s))
    throw RangeError("Invalid frame material selection");
  const o = new Uint8Array(a * s), i = new Uint8Array(a * s), l = new Int32Array(Math.max(a, s));
  for (const d of [!1, !0]) {
    const c = d ? s : a, u = d ? a : s;
    for (let h = 0; h < u; h++) {
      let m = 0, g = 0, f = -1;
      const b = (p) => d ? p * a + h : h * a + p, w = (p) => d ? o[b(p)] : n[b(p) * 4 + 3];
      for (let p = 0; p < c; p++) {
        const S = Math.min(c - 1, p + r);
        for (; f < S; ) {
          for (f++; g > m && w(l[g - 1]) <= w(f); ) g--;
          l[g++] = f;
        }
        for (; m < g && l[m] < p - r; ) m++;
        (d ? i : o)[b(p)] = w(l[m]);
      }
    }
  }
  for (let d = 0; d < i.length; d++)
    n[d * 4 + 3] = Math.max(
      n[d * 4 + 3],
      Math.round(i[d] * t.data[d * 4 + 3] / 255)
    );
}
function E5(e, t, r) {
  if (t.width !== e.width || t.height !== e.height || t.data.length !== e.data.length || !Number.isFinite(r.amount) || r.amount < 0 || r.amount > 1 || r.backdrop.length !== 3 || r.backdrop.some((a) => !Number.isFinite(a) || a < 0 || a > 1))
    throw RangeError("Invalid frame material blend");
  for (let a = 0; a < e.data.length; a += 4) {
    if (!e.data[a + 3] || !t.data[a + 3]) continue;
    const s = r.amount * t.data[a + 3] / 255;
    for (let n = 0; n < 3; n++)
      e.data[a + n] = Math.round(
        e.data[a + n] * (1 - s) + Math.min(e.data[a + n], 255 * r.backdrop[n]) * s
      );
  }
}
function A5(e, t) {
  const { width: r, height: a, data: s } = e, n = new Uint8Array(r * a), o = new Uint32Array(r * a);
  let i = 0;
  if (t) {
    for (let d = 0; d < r * a; d++) {
      const c = d * 4;
      s[c + 3] && t.data[c + 3] && Math.max(s[c], s[c + 1], s[c + 2]) < 96 && (o[i++] = d);
    }
    return o.slice(0, i);
  }
  const l = (d, c) => {
    if (d < 0 || c < 0 || d >= r || c >= a || d > r * 0.075 && d < r * 0.925 && c > a * 0.06 && c < a * 0.94) return;
    const u = c * r + d;
    if (n[u]) return;
    n[u] = 1;
    const h = u * 4, m = s[h], g = s[h + 1], f = s[h + 2];
    !s[h + 3] || Math.max(m, g, f) >= 96 || Math.max(m, g, f) - Math.min(m, g, f) > 6 || (o[i++] = u);
  };
  for (let d = 0; d < r; d++)
    l(d, 0), l(d, a - 1);
  for (let d = 0; d < a; d++)
    l(0, d), l(r - 1, d);
  for (let d = 0; d < i; d++) {
    const c = o[d], u = c % r, h = Math.floor(c / r);
    l(u - 1, h), l(u + 1, h), l(u, h - 1), l(u, h + 1);
  }
  return o.slice(0, i);
}
function B5(e, t, r, a, s) {
  P1(a);
  for (const n of r) {
    const o = n * 4, i = Math.max(0, 1 - Math.max(t[o], t[o + 1], t[o + 2]) / 96) ** 2, l = s ? s.data[o + 3] / 255 : 1;
    for (let d = 0; d < 3; d++)
      e.data[o + d] = Math.round(
        e.data[o + d] * (1 - l) + (t[o + d] + a[d] * 255 * i) * l
      );
  }
}
function P1(e) {
  if (e.length !== 3 || e.some((t) => !Number.isFinite(t) || t < 0 || t > 48 / 255))
    throw RangeError("Invalid baked stock black level");
}
const br = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, Sr = (e) => {
  const t = Math.max(1e-3, e[0] + e[1] + e[2]);
  return e.map((r) => r / t);
};
function Rs(e, t) {
  const { width: r, height: a, data: s } = e, n = new Float32Array(r * a);
  if (t.kind === "polygon") {
    if (t.points.length < 3 || !Number.isFinite(t.feather) || t.feather <= 0 || t.points.some((R) => R.some((x) => !Number.isFinite(x) || x < 0 || x > 1)))
      throw Error(
        "Paper outline requires at least three normalized points and positive feathering."
      );
    const S = t.points.map(([R, x]) => [R * r, x * a]), y = t.feather * r, k = Math.max(0, Math.floor(Math.min(...S.map((R) => R[0])) - y)), v = Math.min(r, Math.ceil(Math.max(...S.map((R) => R[0])) + y)), C = Math.max(0, Math.floor(Math.min(...S.map((R) => R[1])) - y)), M = Math.min(a, Math.ceil(Math.max(...S.map((R) => R[1])) + y));
    for (let R = C; R < M; R++)
      for (let x = k; x < v; x++) {
        let I = !1, D = 1 / 0;
        const E = x + 0.5, $ = R + 0.5;
        for (let U = 0; U < S.length; U++) {
          const [Z, Y] = S[U], [Q, le] = S[(U + 1) % S.length], ne = Q - Z, _ = le - Y, F = ne * ne + _ * _, G = F ? Math.max(0, Math.min(1, ((E - Z) * ne + ($ - Y) * _) / F)) : 0;
          D = Math.min(D, Math.hypot(E - Z - G * ne, $ - Y - G * _)), Y > $ != le > $ && E < Z + ($ - Y) * ne / _ && (I = !I);
        }
        n[R * r + x] = br((I ? D : -D) / y + 0.5);
      }
    return n;
  }
  if (t.kind === "rect") {
    const [S, y, k, v] = t.rect;
    for (let C = 0; C < a; C++)
      for (let M = 0; M < r; M++) {
        const R = Math.min(
          M / r - S,
          S + k - M / r,
          C / a - y,
          y + v - C / a
        );
        n[C * r + M] = br(R / t.feather + 0.5);
      }
    return n;
  }
  const o = Sr(t.frameRgb), i = Sr(t.paperRgb), l = i.map((S, y) => S - o[y]), d = l.reduce((S, y) => S + y * y, 0);
  if (d < 1e-3) throw Error("Paper and frame chroma are too similar for this mask.");
  const [c, u, h, m] = t.bounds;
  for (let S = 0; S < a; S++)
    for (let y = 0; y < r; y++) {
      if (y / r < c || y / r > c + h || S / a < u || S / a > u + m)
        continue;
      const k = S * r + y, v = k * 4;
      if (s[v + 3] < 250) continue;
      const M = Sr([s[v] / 255, s[v + 1] / 255, s[v + 2] / 255]).reduce((R, x, I) => R + (x - o[I]) * l[I], 0) / d;
      n[k] = br((M - 0.22) / 0.56);
    }
  const g = new Uint8Array(n.length), f = new Int32Array(n.length), b = Math.round(t.seed[1] * a) * r + Math.round(t.seed[0] * r);
  if (!(n[b] > 0.08)) throw Error("Paper mask seed is outside the paper.");
  let w = 0, p = 1;
  for (f[0] = b, g[b] = 1; w < p; ) {
    const S = f[w++], y = S % r;
    for (const k of [S - r, S + r, y ? S - 1 : -1, y < r - 1 ? S + 1 : -1])
      k >= 0 && k < g.length && !g[k] && n[k] > 0.08 && (g[k] = 1, f[p++] = k);
  }
  for (let S = 0; S < n.length; S++) g[S] || (n[S] = 0);
  return n;
}
const wr = (e) => {
  const t = Math.max(0, Math.min(1, e));
  return t * t * (3 - 2 * t);
}, Ms = ([e, t, r, a], s, n) => s >= e && n >= t && s < e + r && n < t + a;
function L5(e, t) {
  if (!(t.hueCenter >= 0 && t.hueCenter < 360) || !(t.hueRadius > 0 && t.hueRadius <= 180) || !(t.hueFeather > 0 && t.hueFeather <= t.hueRadius) || !(t.saturation[0] >= 0 && t.saturation[1] > t.saturation[0] && t.saturation[1] <= 1) || t.brightness !== void 0 && !(t.brightness[0] >= 0 && t.brightness[1] > t.brightness[0] && t.brightness[1] <= 1))
    throw Error("Invalid source pigment mask.");
  for (const { outer: a, inner: s } of t.rings)
    if (![...a, ...s].every(Number.isFinite) || a[2] <= 0 || a[3] <= 0 || s[2] <= 0 || s[3] <= 0 || s[0] < a[0] || s[1] < a[1] || // Normalized shared edges can differ by one floating-point rounding bit.
    s[0] + s[2] > a[0] + a[2] + 1e-12 || s[1] + s[3] > a[1] + a[3] + 1e-12)
      throw Error("Source pigment rings need nested positive rectangles.");
  const r = new Float32Array(e.width * e.height);
  for (let a = 0; a < e.height; a++)
    for (let s = 0; s < e.width; s++) {
      const n = a * e.width + s, o = n * 4, i = (s + 0.5) / e.width, l = (a + 0.5) / e.height;
      if (!e.data[o + 3] || !t.rings.some((m) => Ms(m.outer, i, l) && !Ms(m.inner, i, l)))
        continue;
      const [d, c, u] = W0([
        e.data[o] / 255,
        e.data[o + 1] / 255,
        e.data[o + 2] / 255
      ]), h = Math.abs((d - t.hueCenter + 540) % 360 - 180);
      r[n] = wr((t.hueRadius - h) / t.hueFeather) * wr((c - t.saturation[0]) / (t.saturation[1] - t.saturation[0])) * (t.brightness ? wr((u - t.brightness[0]) / (t.brightness[1] - t.brightness[0])) : 1);
    }
  return r;
}
function G5({ lift: e, transition: t, texture: r }) {
  if (!Number.isFinite(t) || t <= 0 || t > 1 || e.length !== 3 || e.some((a) => !Number.isFinite(a) || a < 0 || a > t / 2))
    throw RangeError("Invalid frame black-point curve");
  if (r) {
    if (r.length < 2 || r.length > 16 || r[0]?.[0] !== 0 || r[0]?.[1].some((a) => a !== 0) || r.at(-1)?.[0] !== 1 || r.at(-1)?.[1].some((a) => a !== 0) || r.some(
      ([a, s]) => !Number.isFinite(a) || s.length !== 3 || s.some((n) => !Number.isFinite(n))
    ))
      throw RangeError("Invalid frame texture curve");
    for (let a = 1; a < r.length; a++) {
      const [s, n] = r[a - 1], [o, i] = r[a];
      if (o <= s || e.some(
        (l, d) => 1 - 2 * l / t * Math.max(0, 1 - s / t) + (i[d] - n[d]) / (o - s) < 0
      ))
        throw RangeError("Frame texture curve reverses contrast");
    }
  }
}
function $5(e, t, r) {
  const a = t.transition * 255, s = new Float64Array(256 * 3);
  for (let n = 1; n < (t.texture?.length ?? 0); n++) {
    const [o, i] = t.texture[n - 1], [l, d] = t.texture[n];
    for (let c = Math.ceil(o * 255); c < l * 255; c++)
      for (let u = 0; u < 3; u++)
        s[c * 3 + u] = 255 * (i[u] + (d[u] - i[u]) * (c / 255 - o) / (l - o));
  }
  for (let n = 0; n < e.data.length; n += 4) {
    if (e.data[n + 3] === 0) continue;
    const o = Math.max(e.data[n], e.data[n + 1], e.data[n + 2]);
    if (o >= a && !t.texture) continue;
    const i = Math.max(0, 1 - o / a) ** 2;
    for (let l = 0; l < 3; l++)
      e.data[n + l] = Math.round(
        e.data[n + l] + 255 * t.lift[l] * i + s[o * 3 + l] * (r ? r.data[n + 3] / 255 : 1)
      );
  }
}
function O5(e, t, r, a) {
  if ("mask" in t)
    for (const u of [
      t.frame,
      t.paper,
      ...t.regions?.map((h) => h.adjustment) ?? [],
      ...t.accents?.map((h) => h.adjustment) ?? []
    ])
      ws(u);
  else ws(t);
  if (t.blackPoint && G5(t.blackPoint), t.outerStock && P1(t.outerStock), t.outerStockMaskSource && (!a || a.width !== e.width || a.height !== e.height || a.data.length !== e.data.length))
    throw RangeError("Frame stock correction needs its source selection");
  if (t.blackPoint?.textureMaskSource && (!r || r.width !== e.width || r.height !== e.height || r.data.length !== e.data.length))
    throw RangeError("Frame texture correction needs its source selection");
  const s = "mask" in t ? t : void 0, n = s ? Rs(e, s.mask) : void 0, o = "mask" in t ? t.frame : t, i = s?.regions?.map((u) => ({
    values: Rs(e, u.mask),
    adjustment: u.adjustment
  })) ?? [], l = [
    ...i,
    ...s?.accents?.map((u) => ({
      values: L5(e, u.mask),
      adjustment: u.adjustment
    })) ?? []
  ];
  for (let u = 0; u < e.data.length; u += 4) {
    if (e.data[u + 3] === 0) continue;
    const h = [e.data[u] / 255, e.data[u + 1] / 255, e.data[u + 2] / 255], m = Math.max(...h), g = m === 0 ? 0 : (m - Math.min(...h)) / m;
    if (m < 0.075 || !s && g < 0.025 && m > 0.97) continue;
    const f = n?.[u / 4] ?? 0, b = _e(h, f === 1 && s ? s.paper : o), w = f > 0 && f < 1 && s ? _e(h, s.paper) : b;
    for (let p = 0; p < 3; p++)
      e.data[u + p] = Math.round(
        Math.round(255 * b[p]) * (1 - f) + Math.round(255 * w[p]) * f
      );
    for (const p of l) {
      const S = p.values[u / 4];
      if (!S) continue;
      const y = _e(h, p.adjustment);
      for (let k = 0; k < 3; k++)
        e.data[u + k] = Math.round(
          e.data[u + k] * (1 - S) + 255 * y[k] * S
        );
    }
  }
  const d = t.outerStock ? e.data.slice() : void 0, c = t.outerStock ? A5(e, a) : void 0;
  t.blackPoint && $5(e, t.blackPoint, r), t.outerStock && d && c && B5(e, d, c, t.outerStock, a);
}
const P5 = { hueDegrees: -1.0625, saturationScale: 0.9087500000000004, brightnessScale: 0.9406250000000002, gamma: 0.738125 }, W5 = { W: { header: { hueDegrees: -14.024193548387075, saturationScale: 0.5265905874026912, brightnessScale: 0.9495967741935485 }, paper: { hueDegrees: -1.1750690607734668, saturationScale: 0.7998024425287352, brightnessScale: 0.9392712550607287 }, pinline: { hueDegrees: -8.203598940779898, saturationScale: 0.4898632906133164, brightnessScale: 0.9302788844621516 }, glyph: { source: [0.9882352941176471, 0.996078431372549, 1], target: [0.9431372549019608, 0.9352941176470588, 0.9372549019607843] } }, U: { header: { hueDegrees: 42.78801843317967, saturationScale: 0.45884697719052203, brightnessScale: 0.9842342342342343 }, paper: { hueDegrees: 32.97916666666663, saturationScale: 0.5842800834685827, brightnessScale: 1.0133928571428572 }, pinline: { hueDegrees: 17.557840616966587, saturationScale: 0.5557142857142856, brightnessScale: 1.1666666666666667 }, glyph: { source: [0, 0.4588235294117647, 0.7450980392156863], target: [0.396078431372549, 0.4392156862745098, 0.7176470588235293] } }, B: { header: { hueDegrees: -14.404807692307713, saturationScale: 1.421528644784533, brightnessScale: 1.0159574468085106 }, paper: { hueDegrees: -12.3125, saturationScale: 1.2126352339181279, brightnessScale: 1.0239520958083832 }, pinline: { hueDegrees: -88.07559082483772, saturationScale: 1.277991260837483, brightnessScale: 1.308125 }, glyph: { source: [0.15294117647058825, 0.14901960784313725, 0.1411764705882353], target: [0.11568627450980393, 0.09607843137254901, 0.12941176470588234] } }, R: { header: { hueDegrees: 2.5092658770676053, saturationScale: 0.7511073790822655, brightnessScale: 0.9318181818181819 }, paper: { hueDegrees: 8.412850307587178, saturationScale: 1.0477689369398555, brightnessScale: 0.9504310344827587 }, pinline: { hueDegrees: 3.0543379373086736, saturationScale: 1.0001076704423102, brightnessScale: 1.0559610705596107 }, glyph: { source: [0.9372549019607843, 0.2196078431372549, 0.15294117647058825], target: [0.8196078431372549, 0.24901960784313726, 0.20588235294117646] } }, G: { header: { hueDegrees: -59.16304347826099, saturationScale: 1.0029481528127626, brightnessScale: 0.9543269230769231 }, paper: { hueDegrees: -26.824145962732928, saturationScale: 0.9416448402304863, brightnessScale: 0.969626168224299 }, pinline: { hueDegrees: -21.627829393491652, saturationScale: 0.47678542547538166, brightnessScale: 1.16243654822335 }, glyph: { source: [0, 0.4823529411764706, 0.2627450980392157], target: [0.22745098039215686, 0.4568627450980392, 0.29411764705882354] } } }, W1 = {
  outer: P5,
  colors: W5
}, xs = (e) => {
  if (e.length !== 3 || e.some((t) => !Number.isFinite(t) || t < 0 || t > 1))
    throw Error("Invalid Eighth basic-land palette.");
  return [e[0], e[1], e[2]];
}, F5 = new Map(
  Object.entries(W1.colors).map(([e, t]) => [
    e,
    { ...t, glyph: { source: xs(t.glyph.source), target: xs(t.glyph.target) } }
  ])
), Fr = W1.outer;
function Ba(e) {
  if (e.colorCalibration !== "set-hsb-v1" || e.frameAssetFamily !== "eighth" || e.setCode?.toLowerCase() !== "8ed" || e.frameTemplate || e.layout && e.layout !== "normal")
    return;
  const t = l0(e), r = t ? F5.get(t) : void 0;
  if (!r) return;
  const a = ke(e);
  if (!(!a || !sa(e, a.frame)))
    return { color: t, palette: r, frame: a.frame, glyph: H0(e) };
}
const U5 = { left: [[34.1933, 40.6667], [34.6766, 39.4527], [35.4016, 38.4816], [35.6432, 38.4816], [36.6098, 37.2677], [36.8515, 37.2677], [38.3014, 35.8109], [39.7512, 34.8398], [42.1677, 33.8687], [46.7591, 32.6547], [51.1087, 32.1692], [51.3504, 31.9264], [53.5252, 31.9264], [53.7669, 31.6836], [60.2914, 31.6836], [60.533, 31.9264], [62.4662, 31.9264], [63.9161, 32.4119], [65.6077, 32.4119], [67.5409, 32.8975], [71.4072, 34.1114], [74.7903, 35.8109], [77.4485, 37.7532], [380.4762, 37.7532], [384.8259, 35.3254], [388.6923, 34.1114], [394.7335, 33.3831], [394.9751, 33.1403], [402.2246, 32.8975], [402.4662, 33.1403], [405.366, 33.1403], [405.6077, 33.3831], [411.4072, 34.1114], [415.032, 35.3254], [417.9318, 36.7821], [418.6567, 37.5104], [420.8316, 37.5104], [421.0732, 37.7532], [610.7676, 37.7532], [611.0092, 37.996], [613.6674, 37.996]], right: [[34.435, 448.79], [35.8849, 450.7323], [36.1265, 450.7323], [36.3682, 451.2179], [38.0597, 452.6746], [39.0263, 452.9174], [40.9595, 454.1313], [44.8259, 455.5881], [46.5174, 455.8308], [48.4506, 456.5592], [53.5252, 456.802], [53.7669, 457.0448], [54.9751, 457.0448], [55.2168, 456.802], [59.3248, 457.0448], [59.5665, 456.802], [66.091, 456.5592], [66.8159, 456.0736], [70.6823, 455.3453], [73.0988, 453.8886], [73.5821, 453.8886], [76.2402, 451.9463], [77.6901, 451.2179], [103.3049, 451.2179], [103.5466, 451.4607], [104.9964, 451.4607], [105.2381, 451.2179], [124.0867, 451.4607], [124.3284, 451.2179], [125.5366, 451.2179], [125.7783, 451.4607], [129.8863, 451.4607], [130.1279, 451.7035], [139.3106, 451.7035], [139.5522, 451.4607], [143.4186, 451.4607], [143.6603, 451.2179], [144.6269, 451.4607], [148.7349, 451.4607], [148.9765, 451.2179], [161.059, 451.2179], [161.3006, 451.4607], [163.9588, 451.4607], [164.2004, 451.2179], [169.0334, 451.2179], [169.2751, 451.4607], [171.2082, 451.4607], [171.4499, 451.2179], [172.6581, 451.4607], [174.833, 451.4607], [175.0746, 451.2179], [175.7996, 451.4607], [179.4243, 451.4607], [179.666, 451.2179], [181.8408, 451.2179], [182.0824, 451.4607], [187.6404, 451.4607], [187.882, 451.2179], [192.4733, 451.2179], [192.715, 451.4607], [193.4399, 451.2179], [199.7228, 451.2179], [199.9645, 451.4607], [200.9311, 451.2179], [208.1805, 451.2179], [208.4222, 451.4607], [209.6304, 451.4607], [209.8721, 451.2179], [227.9957, 451.2179], [228.2374, 451.4607], [229.9289, 451.4607], [230.1706, 451.2179], [246.8443, 451.2179], [247.086, 451.4607], [259.6517, 451.4607], [259.8934, 451.2179], [261.1016, 451.4607], [261.8266, 451.2179], [263.0348, 451.2179], [263.2765, 451.4607], [263.7598, 451.2179], [265.9346, 451.2179], [266.1763, 451.4607], [268.8344, 451.4607], [269.076, 451.2179], [367.1855, 451.4607], [367.4271, 451.2179], [374.9183, 451.2179], [375.1599, 451.4607], [377.8181, 451.4607], [378.0597, 451.2179], [379.9929, 451.2179], [381.9261, 452.1891], [382.651, 452.9174], [385.3092, 454.1313], [389.9005, 455.3453], [394.7335, 455.8308], [394.9751, 456.0736], [405.366, 456.0736], [405.6077, 455.8308], [408.7491, 455.5881], [413.0988, 454.6169], [415.5153, 453.6458], [416.4819, 453.6458], [419.14, 451.4607], [419.865, 451.2179], [426.3895, 451.2179], [426.6311, 451.4607], [432.1891, 451.4607], [432.4307, 451.2179], [434.8472, 451.2179], [435.0888, 451.4607], [613.6674, 451.2179]] }, _5 = { left: [[39.0263, 39.4527], [39.7512, 38.7244], [43.6176, 36.5393], [49.4172, 35.0826], [53.7669, 34.8398], [54.0085, 34.597], [59.8081, 34.597], [60.0498, 34.8398], [65.8493, 35.0826], [68.7491, 35.8109], [73.0988, 37.5104], [75.032, 38.7244], [76.7235, 40.4239], [76.9652, 60.8179]], right: [[39.0263, 449.0328], [39.7512, 449.7612], [42.651, 451.4607], [48.209, 453.1602], [49.4172, 453.1602], [51.1087, 453.6458], [57.3916, 453.6458], [58.5999, 453.8886], [58.8415, 453.6458], [63.4328, 453.6458], [70.199, 452.1891], [75.032, 449.7612], [76.7235, 448.0617], [76.9652, 447.5761]] }, N5 = { left: [[384.1009, 41.395], [385.5508, 40.1811], [387.484, 39.21], [392.317, 37.7532], [395.7001, 37.5104], [395.9417, 37.2677], [408.2658, 37.5104], [412.6155, 38.7244], [415.2736, 39.9383], [417.9318, 41.6378], [418.4151, 42.3662], [418.6567, 60.8179], [418.8984, 60.8179]], right: [[384.1009, 447.8189], [385.3092, 448.79], [388.9339, 450.4896], [392.5586, 451.4607], [396.9083, 451.7035], [397.15, 451.9463], [404.3994, 451.9463], [404.6411, 451.7035], [408.7491, 451.4607], [413.5821, 450.004], [415.9986, 448.79], [418.4151, 446.8478], [418.6567, 428.8816], [418.8984, 428.8816]] }, z5 = { left: [[424.2146, 41.6378], [608.3511, 41.6378], [609.3177, 41.395], [609.5593, 60.8179], [609.801, 60.8179]], right: [[424.2146, 446.3622], [424.6979, 446.1194], [602.3099, 446.1194], [602.5515, 446.3622], [608.5928, 446.1194], [609.076, 446.3622], [609.3177, 446.1194], [609.5593, 428.8816], [609.801, 428.8816]] }, Zt = {
  outer: U5,
  title: _5,
  type: N5,
  paper: z5
}, Y5 = Zt, F0 = (e) => Math.max(0, Math.min(1, e)), F1 = (e) => {
  const t = F0(e);
  return t * t * (3 - 2 * t);
}, Ts = (e, t) => {
  let r = 0;
  for (; r + 1 < e.length - 1 && e[r + 1][0] < t; ) r++;
  const a = e[r], s = e[r + 1];
  return a[1] + F0((t - a[0]) / (s[0] - a[0])) * (s[1] - a[1]);
};
function w0(e, t) {
  const { left: r, right: a } = t, s = Math.max(r[0][0], a[0][0]), n = Math.min(r.at(-1)[0], a.at(-1)[0]);
  return Array.from({ length: e }, (o, i) => {
    const l = (i + 0.5) * 680 / e;
    return [Ts(r, l), Ts(a, l), Math.min(l - s, n - l)];
  });
}
const y0 = (e, t) => F1(0.5 + Math.min(t - e[0], e[1] - t, e[2]) / 0.4), yr = (e, t, r) => [
  e[0] + r * (t[0] - e[0]),
  e[1] + r * (t[1] - e[1]),
  e[2] + r * (t[2] - e[2])
];
function q5(e, t) {
  const r = w0(e.height, Zt.outer), a = w0(e.height, Zt.title), s = w0(e.height, Zt.type), n = w0(e.height, Zt.paper);
  for (let o = 0; o < e.height; o++)
    for (let i = 0; i < e.width; i++) {
      const l = (o * e.width + i) * 4;
      if (!e.data[l + 3]) continue;
      const d = [e.data[l] / 255, e.data[l + 1] / 255, e.data[l + 2] / 255], c = Math.max(...d);
      if (c < 0.075) continue;
      const u = (i + 0.5) * 488 / e.width, h = y0(r[o], u), m = Math.max(y0(a[o], u), y0(s[o], u)), g = y0(n[o], u);
      let f;
      if (h < 1) {
        const b = Math.pow(c, Fr.gamma) / c, w = _e([d[0] * b, d[1] * b, d[2] * b], Fr);
        f = yr(d, w, F1((c - 0.075) / 0.125));
      } else f = d;
      if (h > 0) {
        const b = g > 0 ? t.paper : t.header, w = Math.max(m, g), p = w === 1 ? d : _e(d, t.pinline), S = w > 0 ? yr(p, _e(d, b), w) : p;
        f = yr(f, S, h);
      }
      for (let b = 0; b < 3; b++) e.data[l + b] = Math.round(255 * f[b]);
    }
}
function H5(e, t) {
  const r = (o) => (o[0] + o[1] + o[2]) / 3, a = r(t.source), s = t.source.map((o) => o - a), n = s.reduce((o, i) => o + i * i, 0);
  if (n <= 1e-6) throw Error("Basic glyph fill cannot be separated from neutral details.");
  for (let o = 0; o < e.data.length; o += 4) {
    if (!e.data[o + 3]) continue;
    const i = [e.data[o] / 255, e.data[o + 1] / 255, e.data[o + 2] / 255], l = r(i), d = F0(i.reduce((c, u, h) => c + (u - l) * s[h], 0) / n);
    for (let c = 0; c < 3; c++)
      e.data[o + c] = Math.round(
        255 * F0(i[c] + d * (t.target[c] - t.source[c]))
      );
  }
}
function X5(e, t) {
  const r = Ba(e);
  return r ? [
    {
      url: r.frame,
      kind: "frame",
      color: (s) => q5(s, r.palette)
    },
    ...r.glyph ? [
      {
        url: r.glyph,
        kind: "glyph",
        color: (s) => H5(s, r.palette.glyph)
      }
    ] : []
  ].map(({ url: s, kind: n, color: o }) => {
    const i = t.get(s);
    if (!i) throw Error(`Eighth basic-land material unavailable: ${s}`);
    return {
      url: s,
      key: JSON.stringify([
        "eighth-basic-material-v1",
        s,
        i.width,
        i.height,
        n === "frame" ? [r.palette, Fr, Y5] : r.palette.glyph
      ]),
      bytes: i.width * i.height * 4,
      build: async () => {
        const l = document.createElement("canvas");
        l.width = i.width, l.height = i.height;
        try {
          const d = l.getContext("2d", { willReadFrequently: !0 });
          if (!d) throw Error("Basic-land color preparation needs Canvas2D.");
          d.drawImage(i, 0, 0);
          const c = d.getImageData(0, 0, l.width, l.height);
          return o(c), d.putImageData(c, 0, 0), await createImageBitmap(l);
        } finally {
          l.width = l.height = 0;
        }
      }
    };
  }) : [];
}
function J5(e, t) {
  if (e.width !== t.width || e.height !== t.height)
    throw Error("Stamp palette dimensions differ.");
  for (let r = 0; r < e.height; r++)
    for (let a = 0; a < e.width; a++) {
      const s = (r * e.width + a) * 4, n = Math.max(0, Math.min(1, ((a + 0.5) / e.width - 0.35) / 0.3)), o = e.data[s + 3] * (1 - n), i = t.data[s + 3] * n, l = o + i;
      for (let d = 0; d < 3; d++)
        e.data[s + d] = l ? (e.data[s + d] * o + t.data[s + d] * i) / l : 0;
      e.data[s + 3] = l;
    }
}
function K5(e, t) {
  const r = ut(e);
  if (!r) return [];
  const a = Ie(e.setCode, e.borderColor).border === "#090806";
  if (!a && !r.rightImage) return [];
  const s = e.calibration === void 0 ? "#090806" : ve(e) ?? "#090806", n = [1, 3, 5].map((l) => parseInt(s.slice(l, l + 2), 16)), o = t.get(r.image);
  if (!o) throw Error("Authenticity stamp asset is unavailable.");
  const i = r.rightImage ? t.get(r.rightImage) : void 0;
  if (r.rightImage && !i) throw Error("Authenticity stamp asset is unavailable.");
  if (i && (i.width !== o.width || i.height !== o.height))
    throw Error("Authenticity stamp palette sources have different dimensions.");
  return [
    {
      url: r.image,
      key: JSON.stringify([
        "security-stamp-frame-palette-v5",
        r.image,
        r.rightImage ?? null,
        a,
        s,
        o.width,
        o.height
      ]),
      bytes: o.width * o.height * 4,
      build: async () => {
        const l = document.createElement("canvas");
        l.width = o.width, l.height = o.height;
        try {
          const d = l.getContext("2d", { willReadFrequently: !0 });
          if (!d) throw Error("Stamp preparation needs Canvas2D.");
          let c;
          i && (d.drawImage(i, 0, 0), c = d.getImageData(0, 0, l.width, l.height), d.clearRect(0, 0, l.width, l.height)), d.drawImage(o, 0, 0);
          const u = d.getImageData(0, 0, l.width, l.height);
          c && J5(u, c);
          for (let h = 0; a && h < u.data.length; h += 4) {
            if (!u.data[h + 3]) continue;
            const m = Math.max(u.data[h], u.data[h + 1], u.data[h + 2]);
            if (m >= 24) continue;
            const g = (1 - m / 24) ** 2;
            u.data[h] = u.data[h] + n[0] * g, u.data[h + 1] = u.data[h + 1] + n[1] * g, u.data[h + 2] = u.data[h + 2] + n[2] * g;
          }
          return d.putImageData(u, 0, 0), await createImageBitmap(l);
        } finally {
          l.width = l.height = 0;
        }
      }
    }
  ];
}
const V5 = {
  N: [
    [0.64, 0.67, 0.73],
    [0.7, 0.72, 0.76]
  ],
  W: [
    [0.86, 0.86, 0.86],
    [0.92, 0.93, 1.02]
  ],
  U: [
    [0.64, 0.64, 0.7],
    [0.61, 0.66, 0.73]
  ],
  B: [
    [0.63, 0.58, 0.54],
    [0.51, 0.5, 0.5]
  ],
  R: [
    [0.79, 0.77, 0.7],
    [0.91, 0.98, 0.76]
  ],
  G: [
    [0.81, 0.71, 0.78],
    [0.91, 0.77, 0.91]
  ]
};
function Z5(e, t) {
  if (e.frameTemplate !== "future") return [];
  const r = e.setCode?.toLowerCase() === "fut" && e.colorCalibration === "set-hsb-v1", a = /* @__PURE__ */ new Set();
  return [...new Set(e.manaSymbols ?? [])].flatMap((s) => {
    const n = /^(?:\d+|X)$/.test(s), o = r ? V5[n ? "N" : s] : void 0, i = J0(s), l = i ? t.get(i) : void 0;
    if (!o && !n || !i || !l || a.has(i)) return [];
    a.add(i);
    const d = n ? Ar().map((c) => {
      const u = t.get(c);
      if (!u || u.width !== l.width || u.height !== l.height)
        throw Error("Future generic medallion requires all matching pinned numeral sources");
      return u;
    }) : [];
    return [
      {
        url: i,
        key: JSON.stringify([
          "future-mana-color-blank-v2",
          i,
          l.width,
          l.height,
          o,
          n ? Ar() : null
        ]),
        bytes: l.width * l.height * 4,
        build: () => Q5(l, o, d)
      }
    ];
  });
}
async function Q5(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.width, a.height = e.height;
  try {
    const s = a.getContext("2d", { willReadFrequently: !0 });
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, a.width, a.height);
    for (const l of r) {
      s.clearRect(0, 0, a.width, a.height), s.drawImage(l, 0, 0);
      const d = s.getImageData(0, 0, a.width, a.height).data;
      for (let c = 0; c < n.data.length; c++)
        c % 4 !== 3 && (n.data[c] = Math.max(n.data[c], d[c]));
    }
    const [o, i] = t ?? [
      [1, 1, 1],
      [1, 1, 1]
    ];
    for (let l = 0; l < a.height; l++)
      for (let d = 0; d < a.width; d++) {
        const c = (l * a.width + d) * 4;
        if (!n.data[c + 3]) continue;
        const u = Math.hypot((d + 0.5) / a.width - 0.5, (l + 0.5) / a.height - 0.5), h = Math.max(0, Math.min(1, (u - 0.31) / 0.03)), m = h * h * (3 - 2 * h);
        for (let g = 0; g < 3; g++)
          n.data[c + g] = Math.round(
            n.data[c + g] * (o[g] * (1 - m) + i[g] * m)
          );
      }
    return s.putImageData(n, 0, 0), await createImageBitmap(a);
  } finally {
    a.width = a.height = 0;
  }
}
async function el(e, t, r) {
  e = rt(e);
  const a = { images: t, dispose() {
  } }, s = new Map(Object.entries(k1(e))), n = {}, o = {}, i = /* @__PURE__ */ new Set(), l = [], d = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...(e.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((p) => p[1])
  ]);
  for (const p of e.rulesParagraphs ?? [])
    for (const S of p.runs) for (const y of S.text.matchAll(/\{([^}]+)\}/g)) d.add(y[1]);
  for (const p of d) {
    const S = /^\d+$/.test(p) ? "N" : p, y = xr(e, p), k = y?.discColor ?? lr[S], v = v1(e, S) ?? (y && lr[S] ? Bt(S === "W" ? "#efe7cb" : lr[S]) : void 0);
    if (y && i.add(p), y?.glyphScale !== void 0 && (o[p] = y.glyphScale), !v || !k) continue;
    const C = y?.url ?? It(p);
    if (y) {
      const M = t.get(y.url);
      if (!M) throw Error(`Historical mana asset unavailable: ${p}`);
      l.push({ url: y.url, source: M, palette: y, target: v });
    } else C && s.set(C, al(k, v));
    n[p] = `rgb(${v.map((M) => Math.round(M * 255)).join(" ")})`;
  }
  const c = d.has("W") && d0(e, "W") === "historic-font", u = X5(e, t), h = K5(e, t), m = Z5(e, t);
  if (!s.size && !l.length && !u.length && !h.length && !m.length && !Object.keys(n).length && !c)
    return a;
  const g = Object.assign(new Map(t), {
    manaColors: n,
    originalManaGlyphs: i,
    originalWhiteGlyph: c,
    manaGlyphScales: o
  }), f = [...s].flatMap(([p, S]) => {
    const y = t.get(p);
    return y ? [{ url: p, source: y, adjustment: S }] : [];
  }), b = [
    ...u,
    ...h,
    ...m,
    ...f.map(({ url: p, source: S, adjustment: y }) => ({
      url: p,
      key: tl(p, S.width, S.height, y),
      bytes: S.width * S.height * 4,
      build: () => rl(S, y, t)
    })),
    ...l.map(({ url: p, source: S, palette: y, target: k }) => ({
      url: p,
      key: JSON.stringify([
        "historical-mana-palette-v1",
        p,
        S.width,
        S.height,
        y,
        k
      ]),
      bytes: S.width * S.height * 4,
      build: () => D5(S, y, k)
    }))
  ];
  let w = [];
  try {
    w = await A1.acquireMany(b, r), b.forEach(({ url: p }, S) => g.set(p, w[S].value));
    for (const p of i) {
      const S = xr(e, p), y = g.get(S.url), k = It(p);
      if (!y || !k) throw Error(`Historical mana asset unavailable: ${p}`);
      g.set(k, y);
    }
    return { images: g, dispose: () => w.forEach((p) => p.release()) };
  } catch (p) {
    throw w.forEach((S) => S.release()), p;
  }
}
function tl(e, t, r, a) {
  return JSON.stringify(["frame-hsb-paper-mask-v3", e, t, r, a]);
}
async function rl(e, t, r) {
  const a = document.createElement("canvas");
  a.width = e.width, a.height = e.height;
  try {
    const s = a.getContext("2d", { willReadFrequently: !0 });
    if (!s) throw Error("HSB preparation needs Canvas2D.");
    s.drawImage(e, 0, 0);
    const n = s.getImageData(0, 0, a.width, a.height), o = (u) => {
      const h = r.get(u);
      if (!h) throw Error(`Frame material mask unavailable: ${u}`);
      return s.clearRect(0, 0, a.width, a.height), s.drawImage(h, 0, 0, a.width, a.height), s.getImageData(0, 0, a.width, a.height);
    }, i = t.blackPoint?.textureMaskSource, l = i ? o(i) : void 0, d = t.blend ? o(t.blend.maskSource) : void 0;
    if (t.blend && d) {
      const u = t.blend.outerMaskSource === i && l ? l : o(t.blend.outerMaskSource);
      if (I5(d, u, Math.round(t.blend.outset * a.width)), l)
        for (let h = 3; h < l.data.length; h += 4)
          l.data[h] = Math.round(l.data[h] * (1 - d.data[h] / 255));
    }
    const c = t.outerStockMaskSource ? o(t.outerStockMaskSource) : void 0;
    return O5(n, t, l, c), t.blend && d && E5(n, d, t.blend), s.putImageData(n, 0, 0), await createImageBitmap(a);
  } finally {
    a.width = a.height = 0;
  }
}
function al(e, t) {
  const r = Bt(e), [a, s, n] = W0(r), [o, i, l] = W0(t);
  if (s <= 0 || n <= 0) throw Error("Mana source requires a chromatic disc.");
  return {
    hueDegrees: (o - a + 540) % 360 - 180,
    saturationScale: i / s,
    brightnessScale: l / n
  };
}
function La(e, t) {
  if (e.layout && e.layout !== "normal") return [0, 0];
  const r = e.setCode?.toLowerCase();
  if (e.borderColor && e.borderColor !== (r === "8ed" ? "white" : "black")) return [0, 0];
  if (t === "retro" && we(e)) return [-18.5, -6];
  if (e.legendary ?? /\bLegendary\b/.test(e.typeLine ?? "")) return [0, 0];
  if (t === "retro") {
    if (r === "lea") return [-1.5, 1.5];
    if (r === "leb") return [-1, 2];
  }
  return t === "eighth" && r === "8ed" ? [0.5, -2] : t === "modern" && r === "m21" ? [-1, 1] : [0, 0];
}
const Ds = [0.08, 0.36, 0.64, 0.92, 1], sl = [0.18, 0.18, 0.17];
function Ur(e, t, r, a, s, n) {
  if (s.length !== 2) return;
  const { box: o, width: i } = n, l = e - r / 2, d = e + r / 2, c = t - a / 2, u = t + a / 2;
  if (d <= o.left || l >= o.right || u <= o.top || c >= o.bottom || l >= o.left + i.left && d <= o.right - i.right && c >= o.top + i.top && u <= o.bottom - i.bottom)
    return;
  const h = (b) => Math.max(
    0,
    Math.min(d, o.right - i.right * b) - Math.max(l, o.left + i.left * b)
  ) * Math.max(
    0,
    Math.min(u, o.bottom - i.bottom * b) - Math.max(c, o.top + i.top * b)
  ) / (r * a);
  let m = h(0), g = 0;
  const f = [0, 0, 0];
  for (let b = 0; b < Ds.length; b++) {
    const w = h(Ds[b]), p = Math.max(0, m - w), S = b === 0 || b === 4 ? sl : s[b === 2 ? 1 : 0];
    for (let y = 0; y < 3; y++) f[y] += S[y] * p;
    g += p, m = w;
  }
  if (g)
    return { color: [f[0] / g, f[1] / g, f[2] / g], alpha: g };
}
const qe = {
  left: 61.063333333333325 / (488 / 1500),
  right: 427.9656666666666 / (488 / 1500),
  top: 404.6309523809524 / (680 / 2100),
  bottom: 606.325 / (680 / 2100)
}, Ce = { left: 188, right: 1324, top: 1253, bottom: 1871 }, qt = { left: 26, right: 29, top: 29, bottom: 28 }, Is = 6.375 / (488 / 1500), Es = 6.375 / (680 / 2100), nl = { left: Is, right: Is, top: Es, bottom: Es }, ol = {
  W: [186 / 255, 177 / 255, 176 / 255],
  U: [72 / 255, 110 / 255, 137 / 255],
  B: [88 / 255, 77 / 255, 85 / 255],
  R: [182 / 255, 62 / 255, 81 / 255],
  G: [129 / 255, 149 / 255, 92 / 255]
};
function il(e, t) {
  if (t.length !== 2) return;
  const a = [...t].sort((u, h) => "RGUBW".indexOf(u) - "RGUBW".indexOf(h)).map((u) => ol[u]);
  if (!a[0] || !a[1]) return;
  const s = 1500 / e.width, n = 2100 / e.height, o = e.data.slice(), i = Math.min(qe.left, Ce.left), l = Math.max(qe.right, Ce.right), d = Math.min(qe.top, Ce.top), c = Math.max(qe.bottom, Ce.bottom);
  for (let u = Math.floor(d / n); u < Math.ceil(c / n); u++)
    for (let h = Math.floor(i / s); h < Math.ceil(l / s); h++) {
      const m = Ur((h + 0.5) * s, (u + 0.5) * n, s, n, [a[0], a[1]], {
        box: qe,
        width: nl
      }), g = (h + 0.5) * s, f = (u + 0.5) * n, b = Ur(g, f, s, n, [a[0], a[1]], {
        box: Ce,
        width: qt
      });
      if (!m && !b) continue;
      const w = (u * e.width + h) * 4;
      if (e.data[w + 3]) {
        if (b) {
          const p = [
            g - Ce.left,
            Ce.right - g,
            f - Ce.top,
            Ce.bottom - f
          ], S = p.indexOf(Math.min(...p)), y = g >= qe.left && g < qe.right && f >= qe.top && f < qe.bottom, k = S === 0 ? Ce.left + (y ? qt.left + 2 : -2) : S === 1 ? Ce.right - (y ? qt.right + 2 : -2) : g, v = S === 2 ? Ce.top + (y ? qt.top + 2 : -2) : S === 3 ? Ce.bottom - (y ? qt.bottom + 2 : -2) : f, C = (Math.floor(v / n) * e.width + Math.floor(k / s)) * 4;
          for (let M = 0; M < 3; M++)
            e.data[w + M] = o[w + M] * (1 - b.alpha) + o[C + M] * b.alpha;
        }
        if (m)
          for (let p = 0; p < 3; p++)
            e.data[w + p] = e.data[w + p] * (1 - m.alpha) + m.color[p] * 255 * m.alpha;
      }
    }
}
const Qt = { left: 166.8794, right: 1338.8298, top: 1255.6105, bottom: 1882.7268 }, As = 6.375 / (488 * 0.984 / 1500 * 1.001), Bs = 6.375 / (680 * 0.99 / 2100 * 1.001), ll = { left: As, right: As, top: Bs, bottom: Bs };
function dl(e, t, r, a, s) {
  return Ur(e, t, r, a, s, {
    box: Qt,
    width: ll
  });
}
const kr = {
  W: { hueDegrees: 8.4847, saturationScale: 0.42831, brightnessScale: 0.97071 },
  U: { hueDegrees: 164.886, saturationScale: 0.25883, brightnessScale: 0.841 },
  B: { hueDegrees: 157.329, saturationScale: 0.20015, brightnessScale: 0.62552 },
  R: { hueDegrees: -23.3867, saturationScale: 0.88939, brightnessScale: 0.9205 },
  G: { hueDegrees: 30.7835, saturationScale: 0.6094, brightnessScale: 0.79916 }
}, cl = {
  W: { hueDegrees: 7.44281, saturationScale: 0.570206, brightnessScale: 0.845188 },
  U: { hueDegrees: -177.38556, saturationScale: 0.121282, brightnessScale: 0.656904 },
  B: { hueDegrees: 0, saturationScale: 0, brightnessScale: 0.452356 },
  R: { hueDegrees: -34.23136, saturationScale: 1.238404, brightnessScale: 0.866109 },
  G: { hueDegrees: 42.19413, saturationScale: 0.716825, brightnessScale: 0.656904 }
}, Ls = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }, Gs = {
  W: [0.9, 0.91, 0.9],
  U: [0.32, 0.58, 0.75],
  B: [0.38, 0.4, 0.38],
  R: [0.8, 0.32, 0.34],
  G: [0.6, 0.66, 0.29]
}, $s = { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.992232 };
function ul(e, t, r) {
  const a = r ? kr : cl, s = t[0], n = t[1] ?? s;
  if (!s || !n || !kr[s] || !kr[n]) return;
  const o = t.length === 2 ? [...t].sort((l, d) => "RGUBW".indexOf(l) - "RGUBW".indexOf(d)).map((l) => Gs[l]) : [], i = o.length ? e.data.slice() : void 0;
  for (let l = 0; l < e.height; l++)
    for (let d = 0; d < e.width; d++) {
      const c = (l * e.width + d) * 4;
      if (!e.data[c + 3]) continue;
      const u = (d + 0.5) * 1500 / e.width, h = (l + 0.5) * 2100 / e.height, m = [e.data[c] / 255, e.data[c + 1] / 255, e.data[c + 2] / 255], g = Math.max(...m), f = dl(u, h, 1500 / e.width, 2100 / e.height, o), b = i ? u >= Qt.left && u < Qt.right && h >= Qt.top && h < Qt.bottom : u >= 187 && u < 1320 && h >= 1280 && h < 1864, w = i && u >= 165 && u <= 1345 && h >= 1248 && h <= 1885;
      if (!f && g < 0.075 && !(i && b) && !w) continue;
      const p = Math.min(u - 126, 1379 - u, h - 153, 1171 - h), S = Math.min(u - 170, 1340 - u, h - 1253, 1880 - h), y = p >= -1 && p < 13 || S >= -1 && S < 29;
      let k;
      if (b) {
        const v = Math.min(
          (u - 187) * 488 * 0.984 / 1500,
          (1320 - u) * 488 * 0.984 / 1500,
          (h - 1280) * 680 * 0.99 / 2100,
          (1864 - h) * 680 * 0.99 / 2100
        ), C = Math.floor(Math.max(0, v) / 11.5);
        let M = m;
        if (i && (u < 190 || h < 1284)) {
          const R = Math.min(e.width - 1, Math.max(d, Math.ceil(190 * e.width / 1500))), I = (Math.min(
            e.height - 1,
            Math.max(l, Math.ceil(1284 * e.height / 2100))
          ) * e.width + R) * 4;
          M = [i[I] / 255, i[I + 1] / 255, i[I + 2] / 255];
        }
        k = _e(M, a[C % 2 ? n : s]);
      } else if (w) {
        const v = [u - 165, 1345 - u, h - 1248, 1885 - h], C = v.indexOf(Math.min(...v)), M = C === 0 ? 160 : C === 1 ? 1350 : u, R = C === 2 ? 1240 : C === 3 ? 1890 : h, x = Math.min(e.width - 1, Math.floor(M * e.width / 1500)), D = (Math.min(e.height - 1, Math.floor(R * e.height / 2100)) * e.width + x) * 4;
        k = _e(
          [i[D] / 255, i[D + 1] / 255, i[D + 2] / 255],
          r ? $s : Ls
        );
      } else if (y && m[0] > 0.45 && m[1] > 0.35 && m[2] < Math.min(m[0], m[1]) * 0.72) {
        const v = Gs[(p >= -1 && p < 13 ? p < 6 : S < 14) ? n : s], C = g / 0.97;
        k = [
          Math.min(1, v[0] * C),
          Math.min(1, v[1] * C),
          Math.min(1, v[2] * C)
        ];
      } else k = _e(m, r ? $s : Ls);
      for (let v = 0; v < 3; v++)
        e.data[c + v] = Math.round(
          255 * (f ? f.color[v] * f.alpha + k[v] * (1 - f.alpha) : k[v])
        );
    }
}
async function hl(e, t, r) {
  if (!me(e)) return { images: t, dispose() {
  } };
  const a = t.get(e0);
  if (!a) throw Error("Revised land frame asset unavailable");
  const s = On(e), n = Ft(e), o = await Aa.acquire(
    JSON.stringify([
      "revised-fourth-land-v5",
      e0,
      a.width,
      a.height,
      s,
      n
    ]),
    a.width * a.height * 4,
    async () => {
      const l = document.createElement("canvas");
      l.width = a.width, l.height = a.height;
      try {
        const d = l.getContext("2d", { willReadFrequently: !0 });
        if (!d) throw Error("Revised land preparation needs Canvas2D");
        d.drawImage(a, 0, 0);
        const c = d.getImageData(0, 0, l.width, l.height);
        ul(c, s, n), d.putImageData(c, 0, 0);
        const u = l.width * 160 / 1500, h = l.height * 1240 / 2100, m = l.width * 1190 / 1500, g = l.height * 654 / 2100, f = l.width * (244 - 2.404) / (488 * 0.984), b = l.height * (515 - 9.9) / (680 * 0.99);
        return d.drawImage(
          l,
          u,
          h,
          m,
          g,
          f + (u - f) * 1.001,
          b + (h - b) * 1.001 + l.height * 0.25 / (680 * 0.99),
          m * 1.001,
          g * 1.001
        ), await createImageBitmap(l);
      } finally {
        l.width = l.height = 0;
      }
    },
    r
  ), i = Object.assign(new Map(t), t);
  return i.set(e0, o.value), { images: i, dispose: () => o.release() };
}
async function ml(e, t, r) {
  if (me(e)) return hl(e, t, r);
  const a = c0(e);
  if (!a) return { images: t, dispose() {
  } };
  const s = (c) => {
    const u = t.get(c);
    if (!u) throw Error(`Historical dual-land asset unavailable: ${c}`);
    return u;
  }, n = s(a.base), o = s(a.overlay), i = s(a.mask), [l] = await Aa.acquireMany(
    [
      {
        key: JSON.stringify([
          "abu-dual-frame-v2",
          a,
          n.width,
          n.height,
          k1(e)
        ]),
        bytes: n.width * n.height * 4,
        build: async () => {
          const c = document.createElement("canvas"), u = document.createElement("canvas");
          c.width = u.width = n.width, c.height = u.height = n.height;
          try {
            const h = c.getContext("2d"), m = u.getContext("2d");
            if (!h || !m) throw Error("Historical dual-land preparation needs Canvas2D.");
            m.drawImage(o, 0, 0, n.width, n.height), m.globalCompositeOperation = "destination-in", m.drawImage(i, 0, 0, n.width, n.height), h.drawImage(n, 0, 0), h.drawImage(u, 0, 0);
            const g = h.getImageData(0, 0, n.width, n.height);
            return il(g, Gn(e)), h.putImageData(g, 0, 0), await createImageBitmap(c);
          } finally {
            c.width = c.height = u.width = u.height = 0;
          }
        }
      }
    ],
    r
  ), d = Object.assign(new Map(t), t);
  return d.set(a.base, l.value), { images: d, dispose: () => l.release() };
}
const gl = "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf", Os = {
  "apc/retro/black": [0, -1, 1.18, 1.18],
  "arn/retro/black": [-3, 0, 0.88, 0.88],
  "chr/retro/white": [6.5, -1, 1.06, 0.92],
  "drk/retro/black": [1, -3, 1.26, 1.32],
  "mmq/retro/black": [0, -1, 1, 1.02],
  "nem/retro/black": [2, -2.5, 1.12, 1.26],
  "ody/retro/black": [1.5, -2, 1.14, 1.06],
  "ons/retro/black": [5, -2.5, 1.2, 1.14],
  "pcy/retro/black": [2.5, -2, 1.26, 1.2],
  "s99/retro/white": [2, -1, 1.24, 1.24],
  "tsr/retro/black": [3.5, 0, 1.06, 1.16],
  "uds/retro/black": [0, 0, 1.2, 1.14],
  "ulg/retro/black": [2.5, -1, 1.14, 1.12],
  "vis/retro/black": [3, 1, 1.28, 1.24],
  "2x2/component/black": [2.5, -2.5, 0.98, 0.92],
  "2xm/component/black": [2.5, -1, 0.86, 0.84],
  "2xm/m15-accurate/black": [2.5, 0, 0.94, 0.94],
  "a25/m15-accurate/black": [-2, 1, 1.04, 1.08],
  "aer/component/black": [-0.5, -1, 0.94, 0.92],
  "aer/m15-accurate/black": [-0.5, 0.5, 1.02, 1.04],
  "afc/component/black": [-1, -2, 1.16, 1.08],
  "afc/m15-accurate/black": [-1.5, 0, 1.22, 1.22],
  "afr/m15-accurate/black": [0, 0, 1.28, 1.22],
  "ala/eighth/black": [0, 0, 1.12, 1.04],
  "arb/eighth/black": [-2, 1, 1, 1.02],
  "avr/eighth/black": [-2, 0.5, 0.96, 1.06],
  "bbd/component/black": [2, 0, 0.92, 0.88],
  "bbd/m15-accurate/black": [2, 1, 1.02, 1.04],
  "blb/component/black": [-2, -1.5, 0.98, 1],
  "blb/m15-accurate/black": [-1.5, -1, 1.14, 1.2],
  "blc/component/black": [2, -1, 1, 1],
  "blc/m15-accurate/black": [1.5, 1, 1.1, 1.14],
  "bng/eighth/black": [4, 1.5, 1, 0.9],
  "bok/eighth/black": [0.5, 0.5, 1.02, 1.08],
  "bro/component/black": [-1, -2.5, 0.96, 0.96],
  "bro/m15-accurate/black": [-1, -1.5, 1.08, 1.1],
  "c13/eighth/black": [2, 0, 1.1, 1.02],
  "c14/m15-accurate/black": [-1.5, 0, 0.96, 0.94],
  "c15/component/black": [-4.5, -0.5, 0.82, 0.8],
  "c15/m15-accurate/black": [-4.5, 0, 0.94, 0.9],
  "c19/component/black": [-1, 0, 0.92, 0.88],
  "c21/component/black": [-1, -0.5, 0.96, 0.96],
  "c21/m15-accurate/black": [-0.5, 0, 1.08, 1.08],
  "clb/component/black": [0, -2, 0.92, 0.92],
  "clb/m15-accurate/black": [0.5, -1.5, 1.08, 1.06],
  "cm2/m15-accurate/black": [-0.5, 1, 1.08, 1.06],
  "cmd/eighth/black": [3, 1, 1.08, 0.98],
  "cmm/component/black": [-1, -1, 0.96, 0.94],
  "cmm/m15-accurate/black": [-1, 0, 1.08, 1.12],
  "cn2/component/black": [-2, -1, 0.92, 0.84],
  "cn2/m15-accurate/black": [-2, 1, 1, 1],
  "cns/eighth/black": [2, 0, 1.08, 0.96],
  "con/eighth/black": [1.5, 0, 1.22, 1],
  "csp/eighth/black": [0.5, 1, 1, 1.06],
  "dd2/eighth/black": [2.5, 1, 1.04, 1.04],
  "ddc/eighth/black": [5, 1, 1.04, 1],
  "dde/eighth/black": [3.5, 0.5, 1.1, 1.06],
  "ddf/eighth/black": [1, 1, 1.06, 1.08],
  "ddg/eighth/black": [3.5, 0.5, 1.06, 1.1],
  "ddh/eighth/black": [3, 0.5, 0.92, 0.9],
  "ddi/eighth/black": [3, 0.5, 1.04, 1.02],
  "ddj/eighth/black": [2.5, 0, 1.1, 1.08],
  "ddl/eighth/black": [1.5, 1, 0.96, 0.92],
  "ddn/m15-accurate/black": [-2, 0, 0.9, 0.92],
  "ddo/component/black": [0, -1, 0.88, 0.84],
  "ddq/component/black": [0, -1.5, 0.98, 0.9],
  "ddq/m15-accurate/black": [0, 0, 1.1, 1.02],
  "dds/component/black": [-3, -1, 0.92, 0.92],
  "dds/m15-accurate/black": [-2.5, 0.5, 1.06, 1.02],
  "ddt/component/black": [0, -1, 0.9, 0.88],
  "ddu/m15-accurate/black": [-1, 1, 1.1, 1.1],
  "dft/component/black": [1, -1, 0.88, 0.84],
  "dft/m15-accurate/black": [0, 0.5, 0.98, 0.98],
  "dgm/eighth/black": [0, 0, 1.04, 1.04],
  "dka/eighth/black": [2.5, 0, 0.96, 0.92],
  "dmc/component/black": [2, -1.5, 0.98, 0.98],
  "dmr/m15-accurate/black": [4.5, 0.5, 1.18, 1.06],
  "dmu/component/black": [2.5, -2, 1, 0.96],
  "dmu/m15-accurate/black": [1, -1, 1.06, 1.12],
  "dpa/eighth/black": [1, 1, 1.08, 1.12],
  "drc/component/black": [0, -1, 0.98, 0.92],
  "drc/m15-accurate/black": [0, 0, 1.1, 1.04],
  "dsc/component/black": [3, -1, 0.94, 0.94],
  "dsc/m15-accurate/black": [2.5, 0.5, 1.04, 1.06],
  "dsk/component/black": [3, 0, 0.92, 0.92],
  "dsk/m15-accurate/black": [2, 1.5, 0.88, 0.88],
  "dst/eighth/black": [-3, 1, 0.96, 0.94],
  "e01/component/black": [-2, -0.5, 0.84, 0.86],
  "e01/m15-accurate/black": [-2, 1, 0.96, 1.04],
  "ecc/component/black": [-3, -1.5, 0.92, 0.92],
  "ecc/m15-accurate/black": [-3, 0, 1.04, 1.12],
  "ecl/component/black": [-1, -1.5, 0.96, 0.94],
  "ecl/m15-accurate/black": [-1, 0, 1.08, 1.04],
  "eld/m15-accurate/black": [-1, 1, 1.1, 0.96],
  "ema/component/black": [-3, -1, 0.86, 0.88],
  "ema/m15-accurate/black": [-3, 0.5, 0.96, 0.98],
  "emn/m15-accurate/black": [2, 0, 1.04, 1.08],
  "eoc/component/black": [1, -1, 0.94, 0.96],
  "eoc/m15-accurate/black": [1, 0.5, 1.06, 1.06],
  "eoe/component/black": [1.5, -1, 0.96, 0.96],
  "eve/eighth/black": [4.5, 1, 1.08, 1.02],
  "fdc/component/black": [1.5, -1, 0.98, 0.96],
  "fdc/m15-accurate/black": [1, -0.5, 1.06, 1.1],
  "fdn/component/black": [1.5, -1.5, 1.02, 1],
  "fdn/m15-accurate/black": [1.5, -0.5, 1.14, 1.16],
  "frc/m15-accurate/black": [0.5, 0.5, 1.1, 1.04],
  "frf/component/black": [-0.5, -0.5, 0.96, 0.92],
  "frf/m15-accurate/black": [-1, 0.5, 1.06, 1.02],
  "gn3/component/black": [0.5, -2, 0.98, 0.92],
  "gnt/m15-accurate/black": [3, 1, 1.06, 1.08],
  "hob/component/black": [-1, -1, 0.96, 0.94],
  "hob/m15-accurate/black": [-1, 1, 1.08, 1.04],
  "hoc/component/black": [-0.5, -1, 0.96, 0.98],
  "hoc/m15-accurate/black": [-1, 0.5, 1.08, 1.06],
  "hop/eighth/black": [4, 0, 1.06, 1.04],
  "hou/component/black": [-3, -1, 0.96, 0.88],
  "hou/m15-accurate/black": [-3, 0, 1.12, 0.96],
  "iko/component/black": [-1.5, -0.5, 0.92, 0.92],
  "iko/m15-accurate/black": [-1.5, 0.5, 1.04, 1.02],
  "ima/component/black": [-0.5, -0.5, 0.92, 0.9],
  "ima/m15-accurate/black": [0, 1, 1.06, 1],
  "inr/component/black": [-1, -1.5, 0.96, 0.98],
  "inr/m15-accurate/black": [-1, 0, 1.08, 1.12],
  "j22/component/black": [3, -2, 0.96, 0.98],
  "j22/m15-accurate/black": [3, -1, 1.08, 1.12],
  "j25/component/black": [0, -1.5, 0.96, 0.98],
  "j25/m15-accurate/black": [0, 0, 1.1, 1.08],
  "jmp/m15-accurate/black": [0.5, 0, 0.92, 0.94],
  "jou/eighth/black": [0, 1, 0.98, 0.96],
  "kld/component/black": [0, -0.5, 0.88, 0.92],
  "ktk/m15-accurate/black": [-0.5, 0, 1.06, 1.1],
  "lcc/component/black": [-1, -1, 1, 0.94],
  "lcc/m15-accurate/black": [-2, 0, 1.08, 1.08],
  "lci/component/black": [0, -1.5, 0.98, 0.96],
  "lci/m15-accurate/black": [0, 0, 1.1, 1.1],
  "m10/eighth/black": [5, 0.5, 1.08, 1],
  "m11/eighth/black": [4, 0.5, 1.06, 1.02],
  "m12/eighth/black": [4, 0.5, 1.06, 1],
  "m13/eighth/black": [4.5, 0.5, 1.06, 1.06],
  "m15/component/black": [1, -0.5, 0.94, 0.9],
  "m19/component/black": [2.5, 1, 1.04, 0.98],
  "m19/m15-accurate/black": [3, 1.5, 1.08, 1.02],
  "m20/component/black": [1.5, 0.5, 1.02, 1.02],
  "mbs/eighth/black": [1, -0.5, 1.06, 1.04],
  "mh1/component/black": [0, 0, 0.92, 0.94],
  "mh2/component/black": [1, -1, 0.96, 0.94],
  "mh2/m15-accurate/black": [0.5, 0, 1.04, 1.06],
  "mid/m15-accurate/black": [-1.5, 1, 1.1, 1.08],
  "mkc/m15-accurate/black": [-3, 0, 1.04, 1.14],
  "mkm/m15-accurate/black": [-1.5, 0, 1.1, 1.1],
  "mm3/m15-accurate/black": [2, 1, 0.88, 1.08],
  "mma/eighth/black": [1.5, 0, 0.94, 0.96],
  "moc/component/black": [-1, -2, 0.96, 0.96],
  "moc/m15-accurate/black": [-1, -1.5, 1.08, 1.08],
  "mom/component/black": [0.5, -2, 0.92, 0.92],
  "msc/component/black": [-3.5, -1, 0.9, 0.88],
  "msh/component/black": [-5.5, -1.5, 0.92, 0.88],
  "msh/m15-accurate/black": [-6, -1, 0.92, 0.96],
  "ncc/component/black": [-4, -2, 0.96, 0.92],
  "ncc/m15-accurate/black": [-4, -1, 1.08, 1.08],
  "nec/m15-accurate/black": [-1, 0.5, 1.1, 1.12],
  "neo/m15-accurate/black": [2, -1, 0.88, 0.86],
  "nph/eighth/black": [-1, 0.5, 1.08, 1],
  "ogw/component/black": [-3.5, -0.5, 0.92, 0.86],
  "ogw/m15-accurate/black": [-4, 0, 1, 1.06],
  "one/component/black": [1, -1.5, 0.98, 0.96],
  "ori/component/black": [0, -1, 0.8, 0.78],
  "ori/m15-accurate/black": [0, 0.5, 0.9, 0.9],
  "otc/component/black": [2, -1.5, 0.96, 1.02],
  "otc/m15-accurate/black": [2, -0.5, 1.12, 1.18],
  "otj/component/black": [2.5, -2, 0.98, 0.96],
  "otj/m15-accurate/black": [3, -1, 1.1, 1.12],
  "pc2/eighth/black": [3.5, 0.5, 1, 0.98],
  "plc/eighth/black": [2.5, 0.5, 1.02, 1],
  "rtr/eighth/black": [2.5, 0, 1.1, 1.02],
  "rvr/component/black": [-2.5, -1, 0.96, 0.9],
  "rvr/m15-accurate/black": [-2.5, -1.5, 1.06, 1.08],
  "scd/component/black": [1.5, -2, 1.04, 0.88],
  "scd/m15-accurate/black": [1, 0.5, 1.1, 1.12],
  "shm/eighth/black": [5, 0, 0.9, 0.92],
  "sld/component/black": [-2, -0.5, 1.14, 1.18],
  "sld/m15-accurate/black": [-2.5, 0.5, 1.1, 1.12],
  "snc/component/black": [1, -1, 0.88, 0.84],
  "snc/m15-accurate/black": [1.5, -0.5, 1, 1.02],
  "soc/component/black": [1.5, -1, 0.96, 0.94],
  "soi/component/black": [-1.5, -1, 0.94, 0.96],
  "soi/m15-accurate/black": [-2, 0, 1.06, 1.04],
  "sok/eighth/black": [2, 0.5, 1, 0.94],
  "som/eighth/black": [1, 0.5, 1.08, 1],
  "sos/component/black": [1.5, -1, 0.96, 0.94],
  "sos/m15-accurate/black": [1, 0, 1.06, 1],
  "spm/component/black": [1.5, -1, 0.94, 0.96],
  "spm/m15-accurate/black": [0.5, 0, 1.02, 1.1],
  "stx/component/black": [0, -1, 1, 1],
  "stx/m15-accurate/black": [0, 1, 1.1, 1.1],
  "ths/eighth/black": [2.5, 0.5, 0.98, 0.96],
  "tla/component/black": [-1.5, -1.5, 0.9, 0.94],
  "tla/m15-accurate/black": [-1.5, -0.5, 1.02, 1.1],
  "tle/m15-accurate/black": [-3.5, 0, 1.08, 1.12],
  "tmc/component/black": [0, -1, 0.94, 0.94],
  "tmc/m15-accurate/black": [0, 0.5, 1.04, 1.1],
  "tmt/component/black": [0, -1, 0.94, 0.94],
  "tmt/m15-accurate/black": [0, 0.5, 1.06, 1.08],
  "uma/m15-accurate/black": [3, 1, 0.98, 1],
  "unf/component/black": [6, -2, 0.92, 0.88],
  "unf/m15-accurate/black": [5.5, -2, 0.92, 1],
  "voc/component/black": [-7, -1.5, 0.96, 0.88],
  "vow/component/black": [0.5, -1, 0.96, 0.96],
  "vow/m15-accurate/black": [1, 0, 1.1, 1.1],
  "war/component/black": [0.5, -1.5, 0.92, 0.9],
  "war/m15-accurate/black": [2, -1, 1.08, 1.08],
  "woc/component/black": [-0.5, -1, 1, 1.04],
  "woc/m15-accurate/black": [-1, -0.5, 1.12, 1.12],
  "woe/component/black": [2.5, -1, 0.96, 0.96],
  "wwk/eighth/black": [1, 0, 1.08, 1.12],
  "xln/component/black": [3, -0.5, 1, 1.08],
  "xln/m15-accurate/black": [4, 0, 1.22, 1.24],
  "zen/eighth/black": [1.5, 0, 1.02, 1],
  "znr/m15-accurate/black": [0, 1, 1.02, 1.06]
}, Ps = {
  // Black outer contour after the checksum-guarded LEG SVG repair.
  "leg/retro/black": [3.25, 1.5, 1.05, 1.125],
  "6ed/retro/white": [2, -2, 1.08, 1.08],
  // Filled crescent after rim repair; independent width/height on fixed poses.
  "drk/retro/black": [2.5, -1.25, 1.146, 1.203]
}, Ws = {
  m15: { family: "m15-accurate", delta: [1, 0, 1, 1] },
  m21: { family: "m15-accurate", delta: [2, 0, 1.1, 1.06] },
  woe: { family: "m15-accurate", delta: [2, 0, 1.08, 1.08] },
  tdm: { family: "m15-accurate", delta: [0, 0, 1.08, 1.08] },
  "8ed": { family: "eighth", delta: [-4, 0, 1, 0.92] },
  "9ed": { family: "eighth", delta: [0, 1, 0.9, 0.92] }
};
function fl(e, t, r) {
  if (e.frameTreatment === "colorshifted") return r;
  const a = e.setCode?.toLowerCase() ?? "", s = Object.hasOwn(Ws, a) ? Ws[a] : void 0;
  let n = r;
  return s && !e.setSymbol && Ge(t) && s.family === e.frameAssetFamily && (n = U1(r, s.delta)), e.frameAssetFamily ? Ga(e, t, n, e.frameAssetFamily) : n;
}
function Ga(e, t, r, a) {
  if (e.setSymbol || !Ge(t) || B !== gl || (e.layout ?? "normal") !== "normal" || ["component", "m15-accurate"].includes(a) && O(e).legendary)
    return r;
  const s = e.borderColor ?? (a === "retro" ? Ae(e) : Ie(e.setCode).border === "#eeedeb" ? "white" : "black"), n = `${e.setCode?.trim().toLowerCase() ?? ""}/${a}/${s}`;
  if (n === "leg/retro/black" && !we(e)) return r;
  const o = Object.hasOwn(Ps, n) ? Ps[n] : Object.hasOwn(Os, n) ? Os[n] : void 0;
  return o ? U1(r, o) : r;
}
function U1(e, t) {
  const [r, a, s, n] = e, [o, i, l, d] = t;
  return [r + s + o - s * l, a + n / 2 + i - n * d / 2, s * l, n * d];
}
const pl = 0.045;
function bl(e) {
  return ae(e) ? So : pl;
}
const Ht = "#fbf0c5", jt = "#ccdaf2", k0 = "#9c9995", Xt = "#edaa8d", Ct = "#dde6e2", Sl = {
  W: [Ht, Ht],
  U: [jt, jt],
  B: [k0, k0],
  R: [Xt, Xt],
  G: [Ct, Ct],
  WU: [Ht, jt],
  WB: ["#f0e0b5", "#a99da8"],
  WR: [Xt, Ht],
  WG: [Ct, Ht],
  UB: [jt, k0],
  UR: [jt, Xt],
  UG: [Ct, jt],
  BR: ["#b4afb5", "#f2b096"],
  BG: [k0, Ct],
  RG: [Xt, Ct]
};
function wl(e, t, r) {
  if (!t.land) return;
  const a = Sl[t.frame];
  if (!a) return;
  const s = 34 + r, n = 420 - 2 * r, o = e.createLinearGradient(s, 0, s + n, 0);
  o.addColorStop(0, a[0]), o.addColorStop(0.35, a[0]), o.addColorStop(0.65, a[1]), o.addColorStop(1, a[1]), e.save(), e.globalCompositeOperation = "multiply", e.fillStyle = o, e.fillRect(s, 425, n, 203.5), e.restore();
}
function yl(e, t, r, a) {
  if (!t.land || t.frame !== "Artifact") {
    a();
    return;
  }
  const s = 34 + r, n = 420 - 2 * r;
  for (const o of [!1, !0])
    e.save(), e.beginPath(), o || e.rect(0, 0, 488, 680), e.rect(s, 425, n, 203.5), e.clip("evenodd"), e.filter = `grayscale(1) brightness(${o ? 0.9 : 0.63})`, a(), e.restore();
}
function kl(e, t, r) {
  if (!t.land) return;
  e.save(), e.shadowColor = "transparent";
  const a = e.createLinearGradient(0, 625.75, 0, 628.25);
  a.addColorStop(0, "#ffffff00"), a.addColorStop(0.3, "#ffffffb0"), a.addColorStop(0.7, "#ffffffb0"), a.addColorStop(1, "#ffffff00"), e.fillStyle = a, e.fillRect(34 + r, 625.75, 420 - 2 * r, 2.5), e.restore();
}
function _1(e) {
  if (e.setSymbol) return null;
  const t = e.setCode?.toLowerCase();
  return t === "m15" || t === "war" ? t : null;
}
function N1(e, t, r, a, s, n, o, i, l, d) {
  const [c, u, h, m] = d ? r === "m15" ? [0.92, 2, -1, 0.7] : [0.85, 0, -1, 1.2] : [1, 0, 0, r === "m15" ? 0.7 : 1.2];
  s += u - o * (c - 1) / 2, n += h - i * (c - 1) / 2, o *= c, i *= c;
  const g = !a || a === "common", f = document.createElement("canvas"), b = 3, w = 4;
  f.width = Math.ceil((o + b * 2) * w), f.height = Math.ceil((i + b * 2) * w);
  const p = f.getContext("2d");
  p.scale(w, w), p.translate(b, b), p.drawImage(
    t,
    l[0] * t.width,
    l[1] * t.height,
    l[2] * t.width,
    l[3] * t.height,
    0,
    0,
    o,
    i
  ), p.globalCompositeOperation = "source-in";
  const S = a === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : a === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], y = p.createLinearGradient(0, i * 0.65, o, i * 0.35);
  y.addColorStop(0, S[0]), y.addColorStop(0.35, S[1]), y.addColorStop(0.6, S[2]), y.addColorStop(1, S[3]), p.fillStyle = g ? "#111111" : y, p.fillRect(0, 0, o, i);
  const k = r === "m15" ? 32 : 27, v = new Path2D(
    r === "m15" ? "M29.655 7.6c0 0 2.095 4.174 2.095 8.4s-2.095 8.4-2.095 8.4H2.376s-2.033-4.16-2.031-8.398C.343 11.76 2.376 7.6 2.376 7.6Z" : "M13.438 0 15.628 16.075 17.07 15.661 19.608 2.323 21.483 14.101 22.943 13.404 24.884 6.519 26.875 16.92 26.543 16.44C26.7 17.6 26.742 19 26.742 20.538c0 2.986-3.567 4.048-3.6 4.064-.066.033-7.531 2.77-9.721 7.399-2.206-4.612-9.655-7.382-9.721-7.399-.033 0-3.6-1.078-3.6-4.064 0-1.5.1-2.938.232-4.098L0 16.921 1.991 6.519 3.932 13.404 5.392 14.102 7.267 2.307 9.822 15.761 11.248 16.075Z"
  ), C = new DOMMatrix().translate(-l[0] * o / l[2], -l[1] * i / l[3]).scale(o / (k * l[2]), i / (32 * l[3])), M = new Path2D();
  M.addPath(v, C), p.globalCompositeOperation = "destination-over", p.fillStyle = g ? "#f8f8f5" : "#111111", p.fill(M), p.strokeStyle = p.fillStyle, p.lineWidth = r === "war" && g ? 2 : m, p.lineJoin = "round", p.stroke(M), e.drawImage(
    f,
    s - b,
    n - b,
    f.width / w,
    f.height / w
  ), f.width = f.height = 0;
}
function vl(e, t, r) {
  e.save(), e.fillStyle = r, e.beginPath(), e.rect(0, 0, j, T), e.rect(...t), e.fill("evenodd"), e.restore();
}
function jl(e, t, [r, a, s, n], o) {
  const c = document.createElement("canvas");
  c.width = 756, c.height = 1044;
  try {
    const u = c.getContext("2d");
    if (!u) throw new Error("Retro stock preparation requires Canvas2D.");
    u.drawImage(t, 12, 12, 732, 1020), u.fillRect(0, 0, c.width, 12), u.fillRect(0, 1032, c.width, 12), u.fillRect(0, 12, 12, 1020), u.fillRect(744, 12, 12, 1020), u.globalCompositeOperation = "source-in", u.fillStyle = o, u.fillRect(0, 0, c.width, c.height), e.drawImage(
      c,
      r - 12 * s / 732,
      a - 12 * n / 1020,
      c.width * s / 732,
      c.height * n / 1020
    );
  } finally {
    c.width = c.height = 0;
  }
}
const Fs = {
  // Frozen frame-normalized train/held-out study: legends-symbols.json.
  "leg/black": [436, 39.25, 26.975, 23.9],
  "sum/white": [434.5, 44.5, 26.5, 23.4],
  "chr/white": [434, 42, 27, 23.4],
  "hml/black": [433, 44.5, 27, 23.4],
  "rqs/white": [435.5, 42.5, 26.5, 23.4],
  "5ed/white": [437, 42, 26.5, 23.4],
  "por/black": [438.5, 44.5, 26.5, 23.4],
  "exo/black": [438.5, 44.5, 26.5, 23.4],
  "usg/black": [438.5, 44, 26.5, 23.4],
  "ath/white": [439, 43.5, 26, 23.4],
  "ulg/black": [438.5, 44, 26.5, 23.4],
  "6ed/white": [439, 43.5, 26.5, 23.4],
  "ptk/white": [439, 43, 26.5, 23.4],
  "uds/black": [439, 44, 26, 23.4],
  "s99/white": [439, 43, 26.5, 23.4],
  "brb/white": [438.5, 43.5, 26.5, 23.4],
  "btd/white": [438.5, 43.5, 26, 23.4],
  "apc/black": [439, 44, 27, 23.4],
  "ody/black": [438.5, 44, 27, 23.4],
  "jud/black": [439, 44, 26.5, 23.4],
  "tsb/black": [438.5, 46, 26.5, 23.4],
  "sld/black": [436.5, 46.5, 26, 23.4],
  "tsr/black": [437.5, 46.5, 26, 23.4],
  "brc/black": [437.5, 46, 26.5, 23.4],
  "dmr/black": [436.5, 46.5, 26, 23.4],
  "rvr/black": [436.5, 46, 25.5, 23.4],
  "mh3/black": [436.5, 46, 25.5, 23.4]
};
function Cl(e) {
  if ((e.layout ?? "normal") !== "normal") return;
  const t = `${e.setCode?.toLowerCase() ?? ""}/${Ae(e)}`;
  if (!(t === "leg/black" && !we(e)))
    return Object.hasOwn(Fs, t) ? Fs[t] : void 0;
}
function Rl(e, t, r, a, s, n) {
  e.save();
  const o = e.getTransform();
  e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const i = document.createElement("canvas");
  i.width = e.canvas.width, i.height = e.canvas.height;
  const l = i.getContext("2d");
  if (!l) throw Error("Solid title needs a Canvas2D context");
  l.setTransform(o), l.font = e.font, l.textAlign = e.textAlign, l.textBaseline = e.textBaseline, l.letterSpacing = e.letterSpacing, l.fillStyle = `rgb(${n.gray},${n.gray},${n.gray})`, l.fillText(t, r, a, s), n.trim > 0 && (l.globalCompositeOperation = "destination-out", l.lineWidth = n.trim * 2, l.strokeText(t, r, a, s)), e.resetTransform(), e.shadowColor = "#17140f", e.shadowOffsetX = o.a / n.width * n.shadow, e.shadowOffsetY = o.d * n.shadow, e.drawImage(i, 0, 0), e.restore(), i.width = i.height = 0;
}
const Ml = {
  arn: { size: 26.75, x: 37.75, y: 42.5, width: 0.995, shadow: 1.25, trim: 0.4, gray: 196 },
  atq: { size: 26.5, x: 38, y: 42.5, width: 1, shadow: 1.25, trim: 0.4, gray: 196 },
  drk: { size: 27.25, x: 37.25, y: 43, width: 1, shadow: 1.5, trim: 0.2, gray: 208 }
};
function xl(e) {
  const t = e.setCode?.toLowerCase();
  if (t !== "arn" && t !== "atq" && t !== "drk" || e.frameTemplate || e.frameStyle === "modern" || e.layout && e.layout !== "normal" || e.borderColor && e.borderColor !== "black" || e.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const r = e.typeLine ?? "", a = e.land ?? /\bLand\b/.test(r), s = e.artifact ?? /\bArtifact\b/.test(r), n = L(e).length;
  if (!(!a && !s && n !== 1 && !(t === "drk" && n === 2)))
    return Ml[t];
}
function Tl(e, t, r) {
  const a = xl(t);
  if (!a) return !1;
  e.save(), e.translate(a.x, a.y), e.scale(a.width, 1), e.font = `${a.size}px "CardRenderer MTG Goudy", Georgia`;
  const s = Math.max(1, (r - a.x) / a.width);
  return Rl(e, t.name, 0, 0, s, a), e.restore(), !0;
}
function Dl(e) {
  const t = (!e.borderColor || e.borderColor === "black") && !!we(e);
  return {
    fontSize: t ? 21.7 * 1.03 : 21.7,
    dx: t ? -2.5 : 0,
    dy: 0
  };
}
const Il = {
  size: 18,
  x: 49.25,
  width: 1.04,
  shadow: 2,
  inset: 0.1,
  align: "left",
  maximum: 338
}, El = {
  size: 27.8,
  x: 452.25,
  width: 0.99,
  shadow: 1.75,
  inset: 0.3,
  align: "right",
  maximum: 68
};
function Us(e, t, r, a) {
  const s = document.createElement("canvas");
  s.width = e.canvas.width, s.height = e.canvas.height;
  const n = s.getContext("2d");
  if (!n) throw Error("Legends footer needs a Canvas2D context");
  const o = e.getTransform();
  n.setTransform(o), n.translate(r.x, 640), n.scale(r.width, 1), n.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, n.textAlign = r.align, n.textBaseline = "alphabetic", n.letterSpacing = "0px", n.fillStyle = "#f2eee3", Se(n, t, 0, 0, r.maximum / r.width, a), n.globalCompositeOperation = "destination-out", n.lineWidth = 2 * r.inset, n.strokeText(t, 0, 0, r.maximum / r.width), e.save(), e.resetTransform(), e.shadowColor = "#17140f", e.shadowBlur = 0, e.shadowOffsetX = e.shadowOffsetY = r.shadow * o.a, e.drawImage(s, 0, 0), e.restore(), s.width = s.height = 0;
}
function vr(e, t) {
  return !we(t) || t.borderColor && t.borderColor !== "black" ? !1 : (t.artist && Us(e, `Illus. © 1994 ${t.artist}`, Il), t.power != null && t.toughness != null && Us(e, `${t.power}/${t.toughness}`, El, t.textInk), !0);
}
function Al(e, t) {
  return t.printingElements?.artist ? vr(e, { ...t, artist: null }) ? (X(e, t, "artist", () => {
    vr(e, { ...t, power: null, toughness: null });
  }), !0) : !1 : vr(e, t);
}
function Bl(e, t) {
  const r = t.setCode?.toLowerCase();
  if (!["usg", "ulg", "uds"].includes(r ?? "") || (t.layout ?? "normal") !== "normal")
    return !1;
  e.save(), e.textAlign = "center", e.textBaseline = "alphabetic", e.shadowColor = "#17140f", e.shadowOffsetX = e.shadowOffsetY = 1.5 * e.getTransform().a, e.fillStyle = "#f2eee3", e.font = '19px "CardRenderer MTG MPlantin", Georgia';
  const a = t.power != null && t.toughness != null ? 292 : 365;
  X(e, t, "artist", () => {
    t.artist && e.fillText(`Illus. ${t.artist}`, 244, 626, a);
  }), t.power != null && t.toughness != null && (e.shadowColor = "#000b", e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, Se(
    e,
    `${t.power}/${t.toughness}`,
    (0.8074 + 0.1367 / 2) * 488,
    (0.895 + 0.043 / 2) * 680,
    0.1367 * 488,
    t.textInk
  )), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.textBaseline = "alphabetic", e.font = '9.5px "CardRenderer MTG MPlantin", Georgia';
  const s = L(t), n = !/\bLand\b/.test(t.typeLine ?? "") && !(s.length === 1 && ["W", "R"].includes(s[0]));
  e.fillStyle = n ? "#f2eee3" : "#17140f";
  const o = r === "usg" ? 1998 : 1999, i = t.collectorTotal === void 0 ? r === "usg" ? 350 : 143 : t.collectorTotal, l = t.collectorNumber?.trim(), d = l && !t.printingElements?.collector?.hidden && (t.legalText === void 0 || t.collectorTotal !== void 0) ? `${l}${i ? "/" + i : ""}` : "", c = t.printingElements?.legal?.hidden ? null : t.legalText === void 0 ? `©1993–${o} Wizards of the Coast, Inc.` : t.legalText, u = [c, d].filter(Boolean).join(" ");
  if (!t.printingElements?.legal?.offset && !t.printingElements?.collector?.offset)
    u && e.fillText(u, 244, 640, 365);
  else if (u) {
    const h = e.measureText(u).width, m = Math.min(1, 365 / Math.max(1, h));
    e.translate(244, 640), e.textAlign = "left";
    const g = (f, b) => {
      e.save(), e.scale(m, 1), e.fillText(f, b, 0), e.restore();
    };
    c && X(e, t, "legal", () => g(c, -h / 2)), d && X(
      e,
      t,
      "collector",
      () => g(d, h / 2 - e.measureText(d).width)
    );
  }
  return e.restore(), !0;
}
function Ll(e, t, r) {
  r.endsWith("/seventh/regular/w.png") && e.drawImage(
    t,
    182 / 1500 * t.width,
    1258 / 2100 * t.height,
    1160 / 1500 * t.width,
    585 / 2100 * t.height,
    160 / 1500 * 488,
    1256 / 2100 * 680,
    1184 / 1500 * 488,
    605 / 2100 * 680
  );
}
function Gl(e, t) {
  const r = 52.053333333333335, a = 1255 / 2100 * 680, s = 1346 / 1500 * 488, n = 1861 / 2100 * 680, o = 17 / 1500 * 488, i = 17 / 2100 * 680, l = (c) => {
    e.moveTo(...c[0]);
    for (const u of c.slice(1)) e.lineTo(...u);
    e.closePath();
  };
  e.save();
  const d = e.filter;
  e.filter = "none", e.fillStyle = "#00000047", e.beginPath(), l([
    [r, a],
    [s, a],
    [s - o, a + i],
    [r + o, a + i]
  ]), l([
    [s, a],
    [s, n],
    [s - o, n - i],
    [s - o, a + i]
  ]), e.fill(), e.beginPath(), l([
    [r, a],
    [r + o, a + i],
    [r + o, n - i],
    [r, n]
  ]), l([
    [r, n],
    [r + o, n - i],
    [s - o, n - i],
    [s, n]
  ]), e.clip(), e.filter = `${d === "none" ? "" : d + " "}brightness(1.35)`, e.drawImage(t, 0, 0, 488, 680), e.restore();
}
const se = {
  arn: {
    right: 439,
    centerY: 394,
    width: 65,
    height: 22,
    crop: [0, 0.283203125, 1, 0.435546875],
    sampling: "high"
  },
  // Native anvil bounds across Antiquities colors/materials; no added outer rim.
  atq: { right: 415, centerY: 391.5, width: 33, height: 16, crop: [0, 0.240234375, 1, 0.51953125] },
  drk: {
    right: 445,
    centerY: 397.25,
    width: 21,
    height: 18.5,
    crop: [0, 0.09375, 0.9884259259259259, 0.814453125]
  },
  // Crown and detached foot measured together; preserve the existing white rim.
  fem: {
    right: 441.75,
    centerY: 390.75,
    width: 20.75,
    height: 16.75,
    crop: [0, 0.12109375, 1, 0.724609375]
  },
  // Frozen globe ink bounds across Homelands materials; preserve its white rim.
  hml: {
    right: 440.75,
    centerY: 392.5,
    width: 23.5,
    height: 22.5,
    crop: [0, 0.083984375, 0.9861111111111112, 0.83203125]
  },
  // The printed Visions V is white inside its black triangle, with no white rim.
  vis: {
    right: 436.5,
    centerY: 390.5,
    width: 23,
    height: 27,
    crop: [0.004807692307692308, 0.037109375, 0.9903846153846154, 0.92578125],
    outline: 0
  },
  leg: {
    right: 443.75,
    centerY: 394,
    width: 25.5,
    height: 22.5,
    crop: [0, 0.1264957264957265, 1, 0.764102564102564],
    sampling: "high"
  },
  all: {
    right: 429,
    centerY: 393.5,
    width: 56.5,
    height: 24.5,
    crop: [390625e-8, 0.2890625, 0.994140625, 0.421875],
    sampling: "high"
  },
  wth: {
    right: 434,
    centerY: 390,
    width: 34,
    height: 22,
    crop: [0, 0.154296875, 0.998046875, 0.646484375],
    sampling: "high"
  },
  // Native silhouettes, after independent outer-frame registration. These
  // retain the source contours and use one placement per printed set.
  mir: {
    right: 437,
    centerY: 391,
    width: 26.75,
    height: 25,
    crop: [1953125e-9, 0.037109375, 0.99609375, 0.91015625],
    sampling: "high"
  },
  tmp: {
    right: 433.5,
    centerY: 390.5,
    width: 20.5,
    height: 19.5,
    crop: [0, 0.13982300884955753, 0.984375, 0.7964601769911505],
    outline: 2,
    sampling: "high"
  },
  sth: {
    right: 434.75,
    centerY: 390.75,
    width: 18.75,
    height: 19.5,
    crop: [0, 0.10381679389312977, 0.998046875, 0.7923664122137405],
    sampling: "high"
  },
  por: {
    right: 435.5,
    centerY: 391,
    width: 23,
    height: 23,
    crop: [0, 0.08401976935749589, 0.98828125, 0.8336079077429983],
    sampling: "high"
  },
  // Independent ink-axis measurements across common Exodus scans; retain the 2 px rim.
  exo: { right: 430.5, centerY: 390, width: 55.5, height: 21, crop: [0, 0.30859375, 1, 0.3828125] },
  ice: {
    right: 443.5,
    centerY: 394.5,
    width: 20,
    height: 21,
    crop: [0, 0.04296875, 1, 0.9140625],
    outline: 0
  }
}, $l = {
  W: { ...se.por, right: 436.75, centerY: 389.75 },
  U: { ...se.por, right: 436.5, centerY: 392.75 },
  R: { ...se.por, right: 433.75, centerY: 392 },
  G: { ...se.por, right: 434, centerY: 390.75 }
}, Ol = {
  all: {
    U: { ...se.all, right: 427.5, centerY: 393.25 },
    W: { ...se.all, right: 427.25, centerY: 392.75 }
  },
  mir: {
    G: { ...se.mir, right: 437, centerY: 390.25 },
    W: { ...se.mir, right: 437.75, centerY: 389.25 }
  },
  sth: {
    G: { ...se.sth, right: 434, centerY: 391 },
    R: { ...se.sth, right: 433.5, centerY: 391.75 },
    W: { ...se.sth, right: 435.25, centerY: 389.25 }
  },
  tmp: {
    U: { ...se.tmp, right: 433, centerY: 392.75 },
    W: { ...se.tmp, right: 433.25, centerY: 389.5 }
  },
  vis: {
    W: { ...se.vis, right: 437.5, centerY: 389.25 }
  },
  wth: {
    W: { ...se.wth, right: 435.75, centerY: 389.75 }
  },
  hml: {
    R: { ...se.hml, right: 437.75, centerY: 393.5 }
  },
  por: $l
};
function Pl(e) {
  const t = e.setCode?.toLowerCase() ?? "";
  if (e.setSymbol || !Object.hasOwn(se, t)) return null;
  const r = L(e);
  return r.length === 1 && !/\b(?:Land|Artifact)\b/.test(e.typeLine ?? "") ? Ol[t]?.[r[0]] ?? se[t] : se[t];
}
function Wl(e) {
  return e.setSymbol || e.setCode?.toLowerCase() !== "exo" ? null : e.rarity === "uncommon" ? ["#7f9196", "#cdd7da", "#7c8d92"] : e.rarity === "rare" ? ["#8e7934", "#d3bd66", "#91803b"] : ["#4a5251", "#252b2b", "#555e5d"];
}
const _r = {
  arn: { count: 6, white: [2] },
  leg: { count: 6, white: [0, 1, 2, 3, 4] },
  hml: { count: 5, white: [3] },
  vis: { count: 2, white: [1] },
  all: { count: 5, white: [0, 1, 2] },
  wth: { count: 8, white: [0, 1, 2, 3, 4, 5, 6] },
  exo: { count: 6, white: [0, 1, 2, 3, 4] },
  ice2: { count: 16, white: [0] },
  por: { count: 21, white: Array.from({ length: 20 }, (e, t) => t) },
  tmp: { count: 2, white: [1] }
}, z1 = (e) => `${e}#opaque-print-details-v1`, Fl = (e) => Object.keys(_r).some((t) => e === `${K.KEYRUNE_ROOT}/${t}.svg`);
async function Ul(e, t) {
  const r = Object.keys(_r).find((c) => e === `${K.KEYRUNE_ROOT}/${c}.svg`);
  if (!r) return null;
  const a = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), s = a.documentElement, n = a.querySelectorAll("path"), o = n[0]?.getAttribute("d") ?? "", i = o.match(/M[^M]*/g) ?? [], l = _r[r];
  if (s.localName !== "svg" || a.querySelector("parsererror") || n.length !== 1 || i.length !== l.count || i.some((c) => /m/.test(c) || !/[zZ]\s*$/.test(c)))
    throw new Error(`Unexpected pinned ${r} symbol paths.`);
  const d = a.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", l.white.map((c) => i[c]).join("")), d.setAttribute("fill", "#fff"), s.replaceChildren(d), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
const _l = "symbol-svg-v6", Nl = { "leg-c": { sha256: "289e33fd164ee77b5b5d5982b299f485ca668c576368ec796be3b8260de592fd", recipe: "remove-outer-white", pathCount: 7 }, "drk-c": { sha256: "d83257eede46a709ad6f6bf8800928e5954121a75fa8511a255bef4caa382ffa", recipe: "remove-outer-white", pathCount: 2, fill: "#221c13", outline: { stroke: "#505050", width: 24 } }, "6ed-u": { sha256: "631daa24b47c80669e3b27044d9213faa69e9207940a5a7283d67ab7db54e65b", recipe: "white-outer-rim" }, "6ed-r": { sha256: "a6175526471668969615caecff1070f8d9d119ff69b03fc6c03af1ad5fc0f198", recipe: "white-outer-rim" }, "m15-u": { sha256: "bfd962ff9640a846e5690d76c0fe88324e9d49cb6771744b5ab8f34f7afe7362", recipe: "m15" }, "m15-r": { sha256: "933756b97cebe7389ff7cee219a34b1ac13bc504743a2be037a286ee5ffc4b0d", recipe: "m15" }, "m15-m": { sha256: "6e9f87473f1ed8ecb05647fbde6f13e22faeab18fe56b8f76cfa1759bb4210e7", recipe: "m15" }, "8ed-u": { sha256: "6c20e8da28fdd5cdb030814e5c1339978f276c77f4ad9d99ca816adb8d970880", recipe: "8ed" }, "8ed-r": { sha256: "eccde74c56b4810434ecdf4e99206046d6970ea601e4fed2f73eb2ee855053a2", recipe: "8ed" }, "9ed-u": { sha256: "acb7ea7f3422f50dca2aef4e07aa3977aa1641ff2cb54f6eb64ae1bc17abbf53", recipe: "9ed" }, "9ed-r": { sha256: "c1cbcc1aea4f032c5f2ccf7f1d63073813bf9c6f050ba2f5385170ff3deca8a5", recipe: "9ed" }, "7ed-u": { sha256: "94c67d433ba3012f3aa1c494a7ef0ae1e7de58ce4614dfd50ee8f52de527d7e4", recipe: "white-outer-rim" }, "7ed-r": { sha256: "8b30917e85b2c9c3549bfa6c2f62261801df33ff7debcc138bf89c4a9ba9689f", recipe: "white-outer-rim" } }, $a = {
  revision: _l,
  sources: Nl
}, _s = `${B}/img/setSymbols/official/`, Ns = $a.sources;
function Oa(e) {
  if (!e.startsWith(_s) || !e.endsWith(".svg")) return;
  const t = e.slice(_s.length, -4);
  return Object.hasOwn(Ns, t) ? Ns[t] : void 0;
}
function zl(e) {
  return !!Oa(e);
}
async function Yl(e, t) {
  const r = Oa(e);
  if (!r) return t;
  const a = await t.arrayBuffer();
  if ([...new Uint8Array(await crypto.subtle.digest("SHA-256", a))].map((u) => u.toString(16).padStart(2, "0")).join("") !== r.sha256) throw Error(`Unexpected pinned symbol checksum: ${e}`);
  const o = new DOMParser().parseFromString(new TextDecoder().decode(a), "image/svg+xml"), i = o.documentElement, l = [...i.querySelectorAll("path")], d = i.querySelector("linearGradient, radialGradient");
  if (i.localName !== "svg" || o.querySelector("parsererror") || !d && r.recipe !== "remove-outer-white")
    throw Error(`Unexpected pinned symbol SVG: ${e}`);
  const c = (u, h) => {
    for (const [m, g] of Object.entries(h)) u.setAttribute(m, g);
  };
  if (r.recipe === "remove-outer-white") {
    if (l.length !== r.pathCount || !/fill:\s*#ffffff\b/i.test(l[0].getAttribute("style") ?? ""))
      throw Error("Unexpected monochrome symbol topology.");
    l[0].remove(), r.fill && l[1].setAttribute("fill", r.fill);
  } else if (r.recipe === "white-outer-rim") {
    if (l.length !== 3) throw Error("Unexpected rimmed symbol topology.");
    l[0].setAttribute("fill", "#fff");
  } else if (r.recipe === "m15") {
    if (l.length !== 6) throw Error("Unexpected M15 path topology.");
    c(l[0], { fill: `url(#${d.id})`, stroke: "#000", "stroke-width": "8" });
    for (const u of l.slice(1)) u.setAttribute("fill", "#000");
  } else if (r.recipe === "8ed" || r.recipe === "9ed") {
    if (l.length !== 4) throw Error("Unexpected numeric shield path topology.");
    const u = l[2], h = u.parentElement?.getAttribute("transform");
    if (!h) throw Error("Missing numeric shield coordinate transform.");
    if (l[0].setAttribute("fill", "#000"), l[3].setAttribute("fill", "#000"), r.recipe === "9ed") {
      const m = d.cloneNode(!0);
      c(m, {
        id: "glint-root-metal",
        gradientTransform: `${h} ${d.getAttribute("gradientTransform") ?? ""}`
      }), d.after(m), c(l[3], {
        stroke: "url(#glint-root-metal)",
        "stroke-width": "12",
        "paint-order": "stroke fill"
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${r.recipe}`);
  return i.setAttribute("data-card-glint-patch", $a.revision), new Blob([new XMLSerializer().serializeToString(o)], { type: "image/svg+xml" });
}
const Y1 = (e) => `${e}#printed-outline-v1`;
async function ql(e, t) {
  const r = Oa(e)?.outline;
  if (!r) return null;
  const a = new DOMParser().parseFromString(await t.text(), "image/svg+xml"), s = a.documentElement, n = [...s.querySelectorAll("path")];
  if (s.localName !== "svg" || a.querySelector("parsererror") || s.getAttribute("data-card-glint-patch") !== $a.revision || n.length !== 1)
    throw Error(`Unexpected prepared symbol outline: ${e}`);
  const o = n[0];
  return o.setAttribute("stroke", r.stroke), o.setAttribute("stroke-width", String(r.width)), o.setAttribute("stroke-linejoin", "round"), o.setAttribute("paint-order", "stroke fill"), new Blob([new XMLSerializer().serializeToString(a)], { type: "image/svg+xml" });
}
function Hl(e, t, r, a, s, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0;
  const o = document.createElement("canvas");
  o.width = e.canvas.width, o.height = e.canvas.height;
  const i = o.getContext("2d");
  if (!i) throw Error("Retro lettering needs a Canvas2D context");
  const l = e.getTransform();
  i.font = e.font, i.textAlign = e.textAlign, i.textBaseline = e.textBaseline, i.letterSpacing = e.letterSpacing, e.resetTransform();
  for (const [d, c, u] of [
    [0, n, "#f2eee3"],
    [n, 0, "#17140f"]
  ])
    i.resetTransform(), i.clearRect(0, 0, o.width, o.height), i.setTransform(l), i.globalCompositeOperation = "source-over", i.fillStyle = u, i.fillText(t, r + d, a + d, s), i.globalCompositeOperation = "destination-out", i.fillText(t, r + c, a + c, s), e.drawImage(o, 0, 0);
  o.width = o.height = 0, e.restore();
}
function g0(e, t, r, a, s, n, o = "#ababab", i, l = "stats") {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, Se(e, t, r + n, a + n, s, i, l, () => {
    e.fillStyle = "#17140f", e.fillText(t, r + n, a + n, s);
  }), e.fillStyle = o, Se(e, t, r, a, s, i, l), e.restore();
}
const Xl = {
  title: { x: 38, y: 47.312, size: 25.75, width: 1 },
  type: { x: 49, y: 395.71, size: 21.95, width: 1 },
  artist: { x: 48, y: 642.5, size: 22.25, width: 1.01 },
  basic: {
    x: 70,
    y: 406.556,
    width: 348,
    height: 177.232,
    size: 27.5,
    leading: 1.1,
    offset: 0,
    paragraph: 0
  },
  dual: {
    x: 71.5,
    y: 420,
    width: 342,
    height: 187,
    size: 15.5,
    leading: 1.2,
    offset: -18,
    paragraph: 0.075
  }
};
function q1() {
  return Xl;
}
function jr(e, t, r, a, s) {
  const n = q1()[r];
  e.save(), e.translate(n.x, n.y), e.scale(n.width, 1), e.font = `${n.size}px "CardRenderer MTG ${r === "title" ? "Goudy" : "MPlantin"}", Georgia`, e.textAlign = "left", e.textBaseline = r === "artist" ? "alphabetic" : "middle", g0(
    e,
    t,
    0,
    0,
    a / n.width,
    r === "artist" ? 1.25 : 1,
    "#ababab",
    r === "type" ? s : void 0,
    "type"
  ), e.restore();
}
function Jl(e, t, r, a) {
  const s = q1(), n = t.wordingMode === "oracle" ? 10 : 15, o = r.reduce((d, c) => d + c.runs.reduce((u, h) => u + h.text.length, 0), 0) > 150, i = (d) => ({
    leading: d.leading,
    paragraphGap: d.paragraph,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: d.offset
  });
  if (t.rulesAlignment?.mode !== "left") {
    const d = Nt(
      e,
      r,
      a,
      s.basic,
      s.basic.size,
      n,
      5,
      { ...i(s.basic), balanceLines: !0 },
      150
    );
    if (d)
      return o ? W(
        e,
        r.map((c) => ({ ...c, align: "center" })),
        s.dual,
        s.dual.size,
        Math.min(n, s.dual.size),
        { ...i(s.dual), balanceLines: !0 }
      ) : d;
  }
  const l = o ? s.dual.size : s.basic.size;
  return W(e, r, s.dual, l, Math.min(n, l), i(s.dual));
}
function Kl(e, t, r, a = !1, s) {
  H1(
    e,
    t,
    r,
    {
      right: 435,
      centerY: 44.5,
      pitch: 27,
      size: 23.4,
      whiteSize: 21
    },
    a,
    s
  );
}
function Vl(e, t, r, a = !1, s) {
  H1(
    e,
    t,
    r,
    {
      right: 432,
      centerY: 46,
      pitch: 27,
      size: 23.9,
      whiteSize: 20.5
    },
    a,
    s
  );
}
function H1(e, t, r, a, s, n) {
  t.forEach((o, i) => {
    const { size: l } = a, d = a.right - (t.length - 1 - i) * (a.pitch + (n?.spacing ?? 0)) - l / 2, c = a.centerY - l / 2;
    if (o !== "W" || s || r.originalManaGlyphs?.has("W")) {
      te(e, o, d, c, l, r, !1, n);
      return;
    }
    ha(
      e,
      d,
      c,
      l,
      a.whiteSize,
      r.manaColors?.W,
      n0(n, o)
    );
  });
}
const X1 = (e, t, r, a, s, n, o = !1, i) => {
  if (t !== "W" || n.originalManaGlyphs?.has("W"))
    return te(e, t, r, a, s, n, o, i);
  ha(
    e,
    r,
    a,
    s,
    s * 0.87,
    n.manaColors?.W,
    n0(i, t)
  );
};
function Zl(e) {
  return ["lea", "leb", "2ed"].includes(e.setCode?.toLowerCase() ?? "");
}
function Ql(e, t) {
  e.save(), e.font = '22.5px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", g0(e, `Illus. © ${t}`, 49, 631, 338, 1.25), e.restore();
}
function e8(e, t, r, a, s, n) {
  e.save();
  const o = document.createElement("canvas");
  try {
    const i = e.getTransform();
    e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#17140f", e.fillText(t, r + n.shadow / n.width, a + n.shadow, s), o.width = e.canvas.width, o.height = e.canvas.height;
    const l = o.getContext("2d");
    if (!l) throw Error("Artist ink needs a Canvas2D context");
    l.setTransform(i), l.font = e.font, l.textAlign = e.textAlign, l.textBaseline = e.textBaseline, l.letterSpacing = e.letterSpacing, l.fillStyle = "#f2eee3", l.fillText(t, r, a, s), n.trim > 0 && (l.globalCompositeOperation = "destination-out", l.globalAlpha = 0.65, l.lineWidth = n.trim * 2, l.strokeText(t, r, a, s)), e.resetTransform(), e.drawImage(o, 0, 0);
  } finally {
    o.width = o.height = 0, e.restore();
  }
}
const zs = {
  arn: { size: 22, x: 49.75, y: 638.5, width: 1.02, edge: 1.25 },
  atq: { size: 21, x: 48.75, y: 638.5, width: 1.075, edge: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.5, width: 1.045, edge: 1.25 }
}, t8 = {
  arn: { size: 22, x: 49.25, y: 638.5, width: 1.025, trim: 0.8, shadow: 1.5 },
  atq: { size: 21, x: 48.5, y: 638.5, width: 1.075, trim: 0.75, shadow: 1.5 },
  drk: { size: 18, x: 48.75, y: 639.25, width: 1.045, trim: 0.55, shadow: 1.5 }
};
function J1(e) {
  const t = e.setCode?.toLowerCase();
  if (t !== "arn" && t !== "atq" && t !== "drk" || e.frameTemplate || e.frameStyle === "modern" || e.layout && e.layout !== "normal" || e.borderColor && e.borderColor !== "black" || e.legendary || /\b(Legendary|Saga|Class|Planeswalker|Battle)\b/.test(e.typeLine ?? ""))
    return;
  const r = e.typeLine ?? "", a = e.land ?? /\bLand\b/.test(r), s = e.artifact ?? /\bArtifact\b/.test(r), n = L(e).length;
  if (!(!a && !s && n !== 1 && !(t === "drk" && n === 2)))
    return t8[t];
}
function r8(e, t) {
  const r = t.setCode?.toLowerCase();
  if (!t.artist || r !== "arn" && r !== "atq" && r !== "drk") return !1;
  const a = J1(t), s = a ?? zs[r];
  e.save(), e.translate(s.x, s.y), e.scale(s.width, 1), e.font = `${s.size}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "left", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
  const n = `Illus. © ${r === "drk" ? "1994 " : ""}${t.artist}`;
  return a ? e8(e, n, 0, 0, 338 / s.width, a) : Hl(e, n, 0, 0, 338 / s.width, zs[r].edge), e.restore(), !0;
}
const a8 = {
  arn: { x: 452, y: 638, size: 26, width: 1.03, trim: 0.9, shadow: 2, shadowTrim: 0.4 },
  atq: { x: 452.5, y: 639, size: 27.5, width: 0.97, trim: 0.9, shadow: 1.5, shadowTrim: 0.2 },
  drk: { x: 452, y: 640, size: 27, width: 1.01, trim: 0.8, shadow: 1.25, shadowTrim: 0.3 }
};
function s8(e) {
  const t = e.setCode?.toLowerCase();
  if (!(t !== "arn" && t !== "atq" && t !== "drk" || e.power == null || e.toughness == null || !J1(e)))
    return a8[t];
}
function n8(e, t) {
  const r = s8(t);
  if (!r) return !1;
  e.save();
  try {
    e.translate(r.x, r.y), e.scale(r.width, 1), e.font = `${r.size}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "alphabetic", e.letterSpacing = "0px";
    const a = `${t.power}/${t.toughness}`.replaceAll("-", "–");
    o8(e, a, 132 / r.width, r, t.textInk);
  } finally {
    e.restore();
  }
  return !0;
}
function o8(e, t, r, a, s) {
  const n = document.createElement("canvas");
  e.save();
  try {
    n.width = e.canvas.width, n.height = e.canvas.height;
    const o = n.getContext("2d");
    if (!o) throw Error("Stats ink needs a Canvas2D context");
    const i = e.getTransform();
    o.font = e.font, o.textAlign = e.textAlign, o.textBaseline = e.textBaseline, o.letterSpacing = e.letterSpacing, e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.resetTransform();
    for (const [l, d, c] of [
      [a.shadow, a.shadowTrim, "#17140f"],
      [0, a.trim, "#f2eee3"]
    ]) {
      o.resetTransform(), o.clearRect(0, 0, n.width, n.height), o.setTransform(i), o.globalAlpha = 1, o.globalCompositeOperation = "source-over", o.fillStyle = c;
      const u = l / a.width;
      Se(o, t, u, l, r, s, "stats", () => {
        l && (o.fillStyle = c), o.fillText(t, u, l, r);
      }), d > 0 && (o.globalCompositeOperation = "destination-out", o.globalAlpha = 0.65, o.lineWidth = d * 2, o.strokeText(t, u, l, r)), e.drawImage(n, 0, 0);
    }
  } finally {
    n.width = n.height = 0, e.restore();
  }
}
const U0 = (e) => e?.runs.map((t) => t.text).join("") ?? "", Ys = (e) => e.length === 2 && /^[A-Za-z ,]+$/.test(U0(e[0])) && U0(e[0]).length <= 20;
function i8(e, t, r, a, s, n, o, i) {
  const l = (m) => m.role === "rules" && m.runs.length > 0 && !U0(m).includes(`
`) && m.align === void 0;
  if (!r.length || !r.every(l) || t.some((m) => m.align) || r.length !== 1 && !Ys(r)) return null;
  const d = (m) => m.map(
    (g, f) => ({
      ...g,
      align: g.align ?? (g.role === "flavor" || Ys(m) && f === 0 && !/^Enchant\b/.test(U0(g)) ? "left" : "center")
    })
  ), c = { x: 70, y: a - 6, width: 348, height: s - 8 }, u = {
    leading: 1.1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    balanceLines: !0,
    centerOffset: 0
  }, h = W(e, d(r), c, n, n, u);
  return h.overflow || h.lines.length > 5 ? null : W(
    e,
    d(t),
    { ...c, verticalLimits: i },
    n,
    o,
    u
  );
}
function qs(e, t) {
  return !we(e) || e.symbolStyle === "modern" || e.symbolStyle === void 0 && e.wordingMode !== "original" ? t : t.map(
    (r) => r.role !== "rules" ? r : {
      ...r,
      runs: r.runs.map((a) => ({
        ...a,
        text: a.text.replace(/\{(\d+|[XYZ])\}/g, "$1")
      }))
    }
  );
}
const _0 = (e) => e.runs.map((t) => t.text).join(""), l8 = (e) => e.role === "rules" && /^[A-Za-z ,]+$/.test(_0(e)) && _0(e).length <= 28, v0 = { x: 72, y: 413, width: 344, height: 182 }, Cr = {
  leading: 1,
  paragraphGap: 0,
  flavorGap: 0,
  flavorOrphans: !1,
  flavorSeparator: !1,
  centerOffset: -14
}, Hs = (e) => e.map((t, r) => ({
  ...t,
  align: t.role === "rules" && (e.some((a) => a.role === "flavor") || r === 0 && e.length > 1 && l8(t)) ? "left" : "center"
}));
function d8(e, t, r, a) {
  if (!we(t) || t.borderColor && t.borderColor !== "black") return null;
  const s = t.wordingMode === "oracle" ? 10 : 15, n = a.reduce(
    (l, d) => l + _0(d).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
    0
  );
  if (t.rulesAlignment?.mode !== "left" && n <= (a.every((l) => l.role === "flavor") ? 135 : 130) && a.length > 0 && a.every((l) => l.align === void 0 && !_0(l).includes(`
`)) && r.every((l) => l.align === void 0)) {
    const l = {
      ...Cr,
      leading: 1.1,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, d = W(e, Hs(a), v0, 27.5, 27.5, l);
    if (!d.overflow && d.lines.length <= 5)
      return W(e, Hs(r), v0, 27.5, s, l);
  }
  const i = W(e, r, v0, 22.25, 21.75, Cr);
  return i.overflow ? W(e, r, v0, 15.5, s, {
    ...Cr,
    leading: 1.2
  }) : i;
}
const c8 = {
  arn: {
    regular: 23,
    textWidth: 1,
    threshold: 130,
    offset: -10,
    compact: 17.5,
    compactLeading: 1.15
  },
  atq: {
    regular: 22.5,
    textWidth: 1.02,
    threshold: 130,
    offset: -10,
    compact: 15.5,
    compactLeading: 1.2
  },
  drk: {
    regular: 22.5,
    textWidth: 1,
    threshold: 130,
    offset: -4,
    compact: 15.5,
    compactLeading: 1.2
  }
}, Jt = { x: 70, y: 414, width: 348, height: 184 }, N0 = (e) => e.runs.map((t) => t.text).join(""), u8 = (e) => e.reduce(
  (t, r) => t + N0(r).replace(/\{[^}]+\}/g, "●").replaceAll("­", "").length,
  0
), h8 = (e) => e.role === "rules" && /^[A-Za-z ,]+$/.test(N0(e)) && N0(e).length <= 28, Xs = (e, t = !1) => e.map((r, a) => ({
  ...r,
  align: !t && r.role === "rules" && (e.some((s) => s.role === "flavor") || a === 0 && e.length > 1 && h8(r)) ? "left" : "center"
}));
function m8(e, t, r, a) {
  const s = t.setCode?.toLowerCase();
  if (s !== "arn" && s !== "atq" && s !== "drk" || t.frameTemplate || t.frameAssetFamily || t.frameStyle === "modern" || t.borderColor && t.borderColor !== "black" || t.layout && t.layout !== "normal" || /\b(Saga|Class|Planeswalker|Battle)\b/.test(t.typeLine ?? ""))
    return null;
  const n = c8[s], o = t.wordingMode === "oracle" ? 10 : 15, i = {
    textWidth: n.textWidth,
    leading: 1,
    paragraphGap: 0,
    flavorGap: 0,
    flavorOrphans: !1,
    flavorSeparator: !1,
    centerOffset: n.offset
  };
  if (t.rulesAlignment?.mode !== "left" && a.length > 0 && u8(a) <= n.threshold && a.every((c) => c.align === void 0 && !N0(c).includes(`
`)) && r.every((c) => c.align === void 0)) {
    const c = s === "drk", u = c ? { ...Jt, x: 76, width: 336 } : Jt, h = {
      ...i,
      textWidth: 1,
      leading: 1.1,
      centerOffset: c ? 0 : -14,
      balanceLines: !0,
      balanceCenteredOnly: !0
    }, m = W(
      e,
      Xs(a, c),
      u,
      27.5,
      27.5,
      h
    );
    if (!m.overflow && m.lines.length <= 5) {
      const g = Xs(r, c), f = W(e, g, u, 27.5, o, h);
      return !c || f.lines.length >= 5 ? f : W(e, g, u, 27.5, o, {
        ...h,
        centerOffset: -2 * (5 - f.lines.length)
      });
    }
  }
  return W(e, r, Jt, 22.5, 21.75, {
    ...i,
    textWidth: 1
  }).overflow ? W(e, r, Jt, n.compact, o, {
    ...i,
    textWidth: 1,
    leading: n.compactLeading
  }) : W(
    e,
    r,
    Jt,
    n.regular,
    Math.min(n.regular, 21.75 / Math.max(1, n.textWidth)),
    i
  );
}
const Js = {
  leading: 1,
  paragraphGap: 0.25,
  flavorGap: 0.8,
  flavorOrphans: !1,
  flavorSeparator: !1
};
function g8(e, t) {
  if (aa(t)) return null;
  const [r, a, s, n] = Re(ta(t).rules), o = Kr(t), i = qs(
    t,
    o?.paragraphs ?? zt({
      rulesText: t.rulesText ?? "",
      rulesParagraphs: t.rulesParagraphs
    })
  ), l = t.rulesAlignment?.mode === "left", d = l ? i.map((D) => D.role === "rules" ? { ...D, align: "left" } : D) : i, c = t.rulesAlignment?.mode === "auto" ? qs(t, t.rulesAlignment.reference ?? d) : d, u = t.wordingMode === "oracle" ? 10 : 15;
  if (me(t)) return Jl(e, t, d, c);
  const h = d8(e, t, d, c);
  if (h) return h;
  const m = m8(e, t, d, c);
  if (m) return m;
  const g = t.setCode?.toLowerCase(), f = p2(g) ? { ...Js, flavorAttribution: "right" } : Js, b = g === "lea" && t.wordingMode === "oracle" ? [428, 590] : void 0, w = ["lea", "leb", "2ed"].includes(g ?? ""), p = w || g === "3ed" && Te(t) === "fourth";
  if (p && !l) {
    const D = i8(
      e,
      d,
      c,
      a,
      n,
      w ? 32.5 : 27.5,
      u,
      b
    );
    if (D) return D;
  }
  const S = c.length === 1 ? c[0] : void 0, y = S?.runs.length === 1 ? S.runs[0] : void 0;
  if (!l && g === "4ed" && Te(t) === "fourth" && c.some((D) => D.role === "flavor")) {
    const D = Nt(
      e,
      d,
      c,
      { x: 72, y: a + 2, width: 344, height: n - 8 },
      25,
      u,
      5,
      {
        ...f,
        leading: 1.1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines: !0
      },
      150
    );
    if (D) return D;
  }
  const k = !l && g === "4ed" && Te(t) === "fourth" && d.every((D) => D.align === void 0 || D.align === "center") && S?.role === "rules" && (S.align === void 0 || S.align === "center") && y && !y.italic && !y.text.includes(`
`) && y.text.length > 0 && y.text.length <= 100, v = (p || g === "4ed" && Te(t) === "fourth") && (d.length > 1 || d.reduce((D, E) => D + E.runs.reduce(($, U) => $ + U.text.length, 0), 0) > 100), C = v && p, M = v && g === "4ed", R = (g === "mir" || g === "tmp") && !o && !/\b(?:Land|Artifact)\b/.test(t.typeLine ?? "") && L(t).join("") === "W", x = W(
    e,
    k ? d.map((D) => ({ ...D, align: "center" })) : d,
    {
      x: p ? 70 : M || k ? 72 : r,
      y: a + (o ? 1.5 : k ? -6 : M ? 0 : 4),
      // Insets belong to the frame, not paragraph count or italic styling.
      width: p ? 346 : M || k ? 344 : s + (R ? 10 : 0),
      height: n - 8,
      verticalLimits: b
    },
    o ? 24 : k ? 25 : 22.5,
    u,
    k ? { ...f, leading: 1, balanceLines: !0 } : v ? {
      ...f,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: C ? -10 : 0
    } : f
  ), I = d.reduce(
    (D, E) => D + E.runs.reduce(($, U) => $ + U.text.length, 0),
    0
  );
  return !C || I <= 270 || x.size >= 22 ? x : W(
    e,
    d,
    { x: 70, y: a + 4, width: 346, height: n + 8, verticalLimits: b },
    15.5,
    u,
    {
      ...f,
      leading: 1.25,
      paragraphGap: 0,
      flavorGap: 0,
      centerOffset: -18
    }
  );
}
function f8(e) {
  return e.setCode?.toLowerCase() === "3ed" && Te(e) === "fourth";
}
function p8(e, t, r, a, s) {
  e.save(), e.font = '26px "CardRenderer MTG Goudy", Georgia', g0(e, t, 40, a, s + r - 40, 1), e.restore();
}
function b8(e, t, r, a) {
  e.save(), e.font = '27.25px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", g0(e, t, 451, r + 11, 130, 1.25, "#d4d4d4", a), e.restore();
}
function S8(e, t) {
  e.save(), e.font = '22px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.textBaseline = "alphabetic", g0(e, `Illus. © ${t}`, 50, 642, 338, 1.25), e.restore();
}
function w8(e) {
  return ["4ed", "5ed"].includes(e.setCode?.toLowerCase() ?? "") && !/\bLand\b/.test(e.typeLine ?? "") ? { right: 451, yOffset: 3, maxWidth: 130 } : null;
}
function Ks(e) {
  const t = String(e.toughness ?? ""), r = e.wordingMode !== "oracle" && e.setCode?.toLowerCase() === "4ed" && /^\d+-\*$/.test(t) ? `(${t})` : t;
  return `${e.power ?? ""}/${r}`;
}
function y8(e) {
  const t = e.setCode?.toLowerCase(), r = t === "4ed" && !/\bLand\b/.test(e.typeLine ?? "");
  if (t !== "mir" && t !== "tmp" && !r) return null;
  const a = L(e);
  return {
    titleX: r ? 42.5 : void 0,
    titleYOffset: r ? -5 : 0,
    typeX: r ? 42.5 : void 0,
    manaRight: r ? 446.5 : 448,
    manaTop: r ? 27.5 : 33.5,
    manaSize: 23.4,
    manaGap: r ? 3.6 : 1.7,
    statsShadow: r ? 1 : 1.5,
    statsOpaqueShadow: !r,
    setRight: t === "mir" ? 434 : 432.5,
    setCenterY: t === "mir" ? 388 : 387.5,
    setHeight: t === "mir" ? 26 : 23.4,
    setOutline: 1.25,
    artistX: r ? 42.5 : 52,
    artistBaseline: r ? 628.5 : 624,
    artistSize: 19.5,
    legalBaseline: r ? 640.5 : 637.5,
    legalSize: 10.5,
    legalLight: r ? /\bArtifact\b/.test(e.typeLine ?? "") || a.length === 1 && ["B", "G"].includes(a[0]) : !/\bLand\b/.test(e.typeLine ?? "") && !(a.length === 1 && ["W", "R"].includes(a[0])),
    legalText: e.legalText === void 0 ? r ? "©1995 Wizards of the Coast, Inc. All rights reserved." : t === "mir" ? "©1996 Wizards of the Coast, Inc. All rights reserved." : "©1997 Wizards of the Coast, Inc." : e.legalText
  };
}
const Pa = (e, t, r, a, s, n) => {
  if (t !== "T") return te(e, t, r, a, s, n);
  K1(e, r, a, s, "", 0.88);
}, Nr = (e, t, r, a, s, n) => {
  if (t !== "T") return X1(e, t, r, a, s, n);
  K1(e, r, a, s, "", 0.8);
}, k8 = (e, t, r, a, s, n) => {
  if (t !== "T") return te(e, t, r, a, s, n);
  Pa(e, t, r, a, s, n);
}, v8 = new Set(
  "5ed 6ed 7ed ice hml all chr mir vis wth tmp sth exo usg ulg uds mmq nem pcy inv pls apc ody tor jud ons lgn scg brb btd ath dkm s99 s00 por po2 ptk".split(
    " "
  )
);
function j8(e) {
  const t = e?.toLowerCase() ?? "";
  return ["3ed", "leg", "drk", "fem"].includes(t) || ["lea", "leb", "2ed", "arn", "atq"].includes(t) ? Nr : t === "4ed" ? k8 : v8.has(t) ? Pa : te;
}
function K1(e, t, r, a, s, n) {
  e.save(), e.shadowColor = "transparent", e.shadowOffsetX = e.shadowOffsetY = 0, e.fillStyle = "#c9c4be", e.beginPath(), e.arc(t + a / 2, r + a / 2, a / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#0d0f0f", e.font = `${a * n}px "CardRenderer MTG Historic Symbols"`, e.textAlign = "left", e.textBaseline = "alphabetic";
  const o = e.measureText(s);
  e.fillText(
    s,
    t + (a - o.actualBoundingBoxLeft - o.actualBoundingBoxRight) / 2 + o.actualBoundingBoxLeft,
    r + (a + o.actualBoundingBoxAscent - o.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function C8(e, t, r, a, s, n, o, i = [0, 0, 1, 1], l = null, d = "low") {
  const c = document.createElement("canvas"), u = Math.ceil(o * 2) + 1;
  c.width = Math.ceil(s * 2) + u * 2, c.height = Math.ceil(n * 2) + u * 2;
  const h = c.getContext("2d");
  h.imageSmoothingQuality = d, h.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    u,
    u,
    s * 2,
    n * 2
  ), h.globalCompositeOperation = "source-in", h.fillStyle = "#fff", h.fillRect(0, 0, c.width, c.height), e.save(), e.shadowColor = "transparent";
  for (let m = 0; o > 0 && m < 16; m++) {
    const g = m * Math.PI / 8;
    e.drawImage(
      c,
      r - u / 2 + Math.cos(g) * o,
      a - u / 2 + Math.sin(g) * o,
      c.width / 2,
      c.height / 2
    );
  }
  if (h.fillStyle = "#17140f", l) {
    const m = h.createLinearGradient(u, u, u + s * 2, u);
    l.forEach((g, f) => m.addColorStop(f / 2, g)), h.fillStyle = m;
  }
  h.fillRect(0, 0, c.width, c.height), e.drawImage(c, r - u / 2, a - u / 2, c.width / 2, c.height / 2), e.restore(), c.width = c.height = 0;
}
function R8(e, t, r) {
  e.save(), e.textAlign = "left", e.textBaseline = "alphabetic", X(e, t, "artist", () => {
    t.artist && (e.fillStyle = "#f2eee3", e.shadowColor = "#000", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = `${r.artistSize}px "CardRenderer MTG MPlantin", Georgia`, e.fillText(`Illus. ${t.artist}`, r.artistX, r.artistBaseline, 338));
  }), e.shadowColor = "transparent", e.fillStyle = r.legalLight ? "#f2eee3" : "#17140f", e.font = `${r.legalSize}px "CardRenderer MTG MPlantin", Georgia`, r.legalText && X(
    e,
    t,
    "legal",
    () => e.fillText(r.legalText, r.artistX, r.legalBaseline, 380)
  ), e.restore();
}
function M8(e, t, r, a, s) {
  const n = ta(t), o = y8(t), i = f8(t);
  if (s === "artwork") {
    Le(e, t, r, Re(n.art), s);
    return;
  }
  const d = ve(t) ?? vi(t);
  e.fillStyle = d, e.fillRect(0, 0, 488, 680), e.fillStyle = "#686050", e.fillRect(24.4, 27.2, 439.2, 625.6), e.fillStyle = "#e5dec5", e.fillRect(...Re(n.rules)), e.fillStyle = "#746b58", e.fillRect(...Re(n.art)), a && e.drawImage(a, 0, 0, 488, 680), Le(e, t, r, Re(n.art), s);
  const c = r.get(He(t));
  c && (e.save(), e.filter = ji(t), e.drawImage(c, ...Re(n.frame)), Ll(e, c, He(t)), He(t).endsWith("/seventh/regular/m.png") && Gl(e, c), e.restore());
  const u = Pt(t)?.stockWindow ?? we(t)?.stockWindow;
  if (u)
    vl(e, Re(u), d);
  else if (me(t) || Fn(t))
    e.save(), e.fillStyle = d, e.beginPath(), e.rect(0, 0, 488, 680), e.rect(24, 29, 440, 623), e.fill("evenodd"), e.strokeStyle = "#30312e", e.lineWidth = 1.5, e.strokeRect(24.5, 29.5, 439, 622), e.restore();
  else if (Ae(t) !== "black" || Te(t) === "fourth") {
    const N = r.get(ra(t));
    N && jl(e, N, Re(n.frame), d);
  }
  e.fillStyle = Ja(t), e.textBaseline = "middle", e.textAlign = "left", e.letterSpacing = "0px";
  const [h, m, g, f] = Re(n.title), b = t.manaSymbols ?? [], w = Cl(t), p = w?.[3] ?? o?.manaSize ?? 23.4, S = w ? w[2] - p : o?.manaGap ?? 1.7, y = b.length * (p + S), k = w ? w[0] + p / 2 - y + S : o ? o.manaRight - y + S : h + g - y, v = ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? ""), C = i || v ? [
    (i ? 435 : 432) - Math.max(0, b.length - 1) * 27 - (i ? 23.4 : 23.9) / 2,
    (i ? 44.5 : 46) - (i ? 23.4 : 23.9) / 2,
    Math.max(0, b.length - 1) * 27 + (i ? 23.4 : 23.9),
    i ? 23.4 : 23.9
  ] : [
    k,
    w ? w[1] - p / 2 : o?.manaTop ?? m + f / 2 - p / 2,
    Math.max(0, y - S),
    p
  ], M = Z0(t), R = R3(C, b.length, M), x = ht(R, M);
  e.shadowColor = "#000b", e.shadowOffsetX = e.shadowOffsetY = e.getTransform().a, e.font = '27.8px "CardRenderer MTG Goudy", Georgia';
  const I = o?.titleX ?? h, D = m + f / 2 + (o?.titleYOffset ?? 0), E = Math.max(
    1,
    b.length ? k + x[0] - C[0] - I - 5 : o?.titleX == null ? g - 5 : h + g - I - 5
  );
  e.save(), e.translate(...La(t, "retro")), me(t) ? jr(e, t.name, "title", E) : i ? p8(e, t.name, I, D, E) : Tl(e, t, I + E) || e.fillText(t.name, I, D, E), e.restore();
  const $ = t.symbolStyle === "modern" || t.symbolStyle === void 0 && t.wordingMode === "oracle", U = t.symbolStyle === "original" || t.symbolStyle === void 0 && t.wordingMode === "original", Z = U && ["lea", "leb", "2ed", "3ed"].includes(t.setCode?.toLowerCase() ?? "");
  X(
    e,
    t,
    "manaCost",
    () => At(e, R, M, () => {
      i ? Kl(e, b, r, $, M) : ["lea", "2ed"].includes(t.setCode?.toLowerCase() ?? "") ? Vl(e, b, r, $, M) : b.forEach(
        (N, oe) => (Z ? X1 : te)(
          e,
          N,
          k + oe * (p + S) - (b.length - 1 - oe) * (M?.spacing ?? 0),
          w ? w[1] - p / 2 : o?.manaTop ?? m + f / 2 - p / 2,
          p,
          r,
          !1,
          M
        )
      );
    })
  );
  const [Y, Q, le, ne] = Re(n.type), _ = Un(t) ?? "", F = r.get(_), G = Pl(t), q = Wl(t), st = F ? Math.min(44 / F.width, (o?.setHeight ?? 23.4) / F.height) : 0, ge = G?.width ?? (F?.width ?? 0) * st, nt = G?.height ?? (F?.height ?? 0) * st, ot = [
    (G?.right ?? o?.setRight ?? Y + le) - ge,
    (G?.centerY ?? o?.setCenterY ?? Q + ne / 2) - nt / 2,
    ge,
    nt
  ], Fe = Ga(t, _, ot, "retro"), Ue = ht(Fe, t.symbolAdjustment?.set), Ne = Dl(t);
  e.font = `${Ne.fontSize}px "CardRenderer MTG MPlantin", Georgia`;
  const pt = me(t) ? (N, oe, fe, pe) => jr(e, N, "type", pe, t.textInk) : (N, oe, fe, pe) => Se(e, N, oe, fe, pe, t.textInk, "type");
  e.save(), e.translate(Ne.dx, Ne.dy), pt(
    Kr(t)?.typeLine ?? t.typeLine ?? "",
    o?.typeX ?? Y,
    Q + ne / 2,
    F ? Math.max(
      1,
      Math.min(
        le - 48,
        G ? G.right - G.width - Y - 6 : le,
        Ue !== ot ? Ue[0] - (o?.typeX ?? Y) - 6 : le
      )
    ) : le
  ), e.restore(), X(
    e,
    t,
    "setSymbol",
    () => At(e, Fe, t.symbolAdjustment?.set, () => {
      if (F) {
        const N = Math.min(44 / F.width, (o?.setHeight ?? 23.4) / F.height), oe = G?.width ?? F.width * N, fe = G?.height ?? F.height * N, pe = G?.right ?? o?.setRight ?? Y + le, A = G?.centerY ?? o?.setCenterY ?? Q + ne / 2, z = G?.crop ?? [0, 0, 1, 1], ie = Ge(_), je = !ie && !t.setSymbol && r.get(z1(_));
        if (je && (e.save(), e.shadowColor = "transparent", t.setCode?.toLowerCase() === "arn" && (e.filter = "brightness(0.7)"), e.drawImage(
          je,
          z[0] * je.width,
          z[1] * je.height,
          z[2] * je.width,
          z[3] * je.height,
          pe - oe,
          A - fe / 2,
          oe,
          fe
        ), e.restore()), ie || t.setSymbol) {
          e.save(), e.shadowColor = "transparent";
          const Ye = !t.setSymbol && t.setCode?.toLowerCase() === "drk" && Ae(t) === "black" && O(t).boxes === "B" ? r.get(Y1(_)) : void 0;
          e.drawImage(Ye ?? F, ...Fe), e.restore();
        } else q || o || wn(t.setCode) ? C8(
          e,
          F,
          pe - oe,
          A - fe / 2,
          oe,
          fe,
          G?.outline ?? (q ? 2 : o?.setOutline ?? Oo(t.setCode)),
          z,
          q,
          G?.sampling
        ) : Ve(
          e,
          F,
          t.setCode,
          t.rarity,
          Y + le - F.width * N,
          Q + ne / 2 - F.height * N / 2,
          F.width * N,
          F.height * N
        );
      }
    })
  ), e.shadowColor = "transparent";
  const [bt, it, ze, Ze] = Re(n.rules);
  e.fillStyle = "#17140f";
  const ce = r.get(aa(t) ?? "");
  if (ce && Ke(e)) {
    const N = Math.min(ze * 0.4 / ce.width, Ze * 0.75 / ce.height);
    e.drawImage(
      ce,
      bt + (ze - ce.width * N) / 2,
      it + (Ze - ce.height * N) / 2,
      ce.width * N,
      ce.height * N
    );
  } else {
    const N = g8(e, t);
    N && ye(
      e,
      N,
      r,
      $ ? te : U ? j8(t.setCode) : t.setCode?.toLowerCase() === "3ed" ? Nr : o ? Pa : te,
      t.setCode?.toLowerCase() === "lea" ? 0.012 : 0
    );
  }
  if (Al(e, t)) {
    Vs(e, t, !0);
    return;
  }
  if (!Bl(e, t)) {
    if (e.shadowColor = o?.statsOpaqueShadow ? "#000" : "#000b", o && (e.shadowOffsetX = e.shadowOffsetY = o.statsShadow * e.getTransform().a), e.fillStyle = Ja(t), e.font = '27.8px "CardRenderer MTG MPlantin", Georgia', e.textBaseline = "middle", t.power != null && t.toughness != null && !n8(e, t)) {
      const [N, oe, fe, pe] = Re(n.stats), A = w8(t);
      e.textAlign = A ? "right" : "center", i ? b8(e, Ks(t), oe + pe / 2, t.textInk) : Se(
        e,
        Ks(t),
        A?.right ?? N + fe / 2,
        oe + pe / 2 + (A?.yOffset ?? 0),
        A?.maxWidth ?? fe,
        t.textInk
      );
    }
    o ? R8(e, t, o) : X(e, t, "artist", () => {
      if (!r8(e, t)) {
        if (me(t) && t.artist)
          jr(e, `Illus. © ${t.artist}`, "artist", 390);
        else if (i && t.artist) S8(e, t.artist);
        else if (t.artist && Zl(t)) Ql(e, t.artist);
        else if (t.artist) {
          const [N, oe, fe, pe] = Re(n.footer);
          e.textAlign = "center", e.font = '15.6px "CardRenderer MTG MPlantin", Georgia', e.fillText(`Illus. ${t.artist}`, N + fe / 2, oe + pe / 2, fe);
        }
      }
    }), Vs(e, t, !o), e.shadowColor = "transparent";
  }
}
function Vs(e, t, r) {
  r && t.legalText && X(e, t, "legal", () => {
    e.save(), e.shadowColor = "transparent", e.fillStyle = Ie(t.setCode, t.borderColor).ink, e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "left", e.fillText(t.legalText, 49, 646, 390), e.restore();
  });
  const a = t.collectorNumber?.trim();
  a && t.collectorTotal !== void 0 && X(e, t, "collector", () => {
    e.save(), e.shadowColor = "transparent", e.fillStyle = Ie(t.setCode, t.borderColor).ink, e.font = '10px "CardRenderer MTG MPlantin", Georgia', e.textAlign = "right", e.fillText(
      a + (t.collectorTotal ? "/" + t.collectorTotal : ""),
      439,
      660,
      180
    ), e.restore();
  }), e.shadowColor = "transparent";
}
let Zs;
const x8 = [
  { family: "CardRenderer MTG Goudy", url: wi, weight: "400", style: "normal" },
  {
    family: "CardRenderer MTG Historic Symbols",
    url: Si,
    weight: "400",
    style: "normal"
  }
];
function T8() {
  return typeof FontFace != "function" ? Promise.resolve() : Zs ??= Promise.all(
    x8.map(async ({ family: e, url: t }) => {
      if ([...document.fonts].some(
        (a) => a.family.replace(/^"|"$/g, "") === e && a.status === "loaded"
      ))
        return;
      const r = await Yr(t);
      if (!r.ok) throw Error(`Retro font unavailable: ${e}`);
      document.fonts.add(await new FontFace(e, await r.arrayBuffer()).load());
    })
  ).then(() => {
  }).catch((e) => {
    throw Zs = void 0, e;
  });
}
const V1 = `${Dt}/img/class_level_bg.webp`, Z1 = (e) => ["adventure", "class", "leveler"].includes(ee(e)), Rt = (e, t, r, a) => ({
  x: e / 63.5 * 488,
  y: t / 88.9 * 680,
  width: r / 63.5 * 488,
  height: a / 88.9 * 680
}), D8 = {
  W: "#dcc8af",
  U: "#b9c0da",
  B: "#af9aa5",
  R: "#d7a67c",
  G: "#b2c0b0"
};
function I8(e, t, r, a = 21) {
  const s = e.replace(/\{[^}]+\}/g, "●").split(`
`);
  let n = a;
  for (; n > 8 && s.reduce(
    (o, i) => o + Math.max(1, Math.ceil(i.length * n * 0.53 / t)) * n + 4,
    0
  ) > r; )
    n -= 0.5;
  return n;
}
function er(e) {
  const t = ee(e), r = [], a = (s, n, o, i = {}) => {
    r.push({ kind: s, text: n, ...o, font: I8(n, o.width, o.height), ...i });
  };
  if (t === "adventure") {
    const s = e.faces?.[1];
    if (!s) return [];
    const n = (s.manaSymbols ?? []).map((i) => `{${i}}`).join(""), o = (s.manaSymbols?.length ?? 0) * 2.5;
    a("heading", s.name, Rt(5.6, 55.3, 25 - o, 4.2), {
      color: "white",
      font: Math.min(18, (25 - o) * 488 / 63.5 / Math.max(1, s.name.length * 0.55))
    }), a("rules", n, Rt(30 - o, 55.3, o, 4.2), { color: "white", font: 17 }), a("heading", s.typeLine ?? "", Rt(5.6, 59.5, 25, 4.2), {
      color: "white",
      font: Math.min(17, 25 * 488 / 63.5 / Math.max(1, (s.typeLine ?? "").length * 0.52))
    }), a("rules", s.rulesText ?? "", Rt(5.6, 64.5, 24.7, 15.6)), a("rules", e.rulesText ?? e.faces?.[0]?.rulesText ?? "", Rt(33, 54.9, 25.5, 25));
  } else if (t === "class") {
    const [s, n, o, i] = Be(e).rules.map(
      (S, y) => S * (y % 2 ? T : j)
    ), l = O(e);
    a(
      "band",
      "",
      { x: s, y: n, width: o, height: i },
      {
        fill: "#e3d8bb",
        asset: xe(
          "saga_textboxes",
          l.boxes === "Colourless" ? "Land" : l.boxes
        )
      }
    );
    const d = [];
    for (const S of (e.rulesText ?? "").split(`
`).filter(Boolean))
      d.length && !/^.*:\s*Level\s+\d+\s*$/i.test(S) && !/^.*:\s*Level\s+\d+\s*$/i.test(d.at(-1)) && !d.at(-1).startsWith("(") ? d[d.length - 1] += `
` + S : d.push(S);
    const c = (S) => /^.*:\s*Level\s+\d+\s*$/i.test(S), u = 28, h = 20, m = (S, y) => S.split(`
`).reduce(
      (k, v) => k + Math.max(1, Math.ceil(v.length * y * 0.53 / (o - 10))),
      0
    ), g = d.map(
      (S) => c(S) ? u : m(S, S.startsWith("(") ? 16 : h) * (S.startsWith("(") ? 16 : h) + 8
    ), f = d.filter((S) => !c(S)).length, b = Math.max(0, i - g.reduce((S, y) => S + y, 0)) / Math.max(1, f), w = Math.min(
      1,
      (i - d.filter(c).length * u) / g.reduce((S, y, k) => S + (c(d[k]) ? 0 : y), 0)
    );
    let p = n;
    d.forEach((S, y) => {
      const k = c(S), v = k ? u : g[y] * w + b;
      if (k) {
        const [C, M] = S.split(/:\s*/);
        a("band", "", { x: s, y: p, width: o, height: v }, { asset: V1 }), a("rules", C + ":", { x: s + 5, y: p, width: o / 2 - 5, height: v }, { font: 18 }), a(
          "heading",
          M,
          { x: s + o / 2, y: p, width: o / 2 - 5, height: v },
          { font: 18, align: "right" }
        );
      } else
        a(
          "rules",
          S,
          { x: s + 5, y: p + 4, width: o - 10, height: v - 8 },
          { font: (S.startsWith("(") ? 16 : h) * w, italic: S.startsWith("(") }
        );
      p += v;
    });
  } else if (t === "leveler") {
    const s = e.rulesText ?? "", n = s.split(/^LEVEL\s+([^\n]+)\n/gm), o = [
      {
        range: "",
        text: n[0] ?? "",
        stats: e.power != null && e.toughness != null ? `${e.power}/${e.toughness}` : ""
      }
    ];
    for (let c = 1; c < n.length; c += 2) {
      const u = n[c + 1] ?? "", h = u.match(/^([*X\d+−-]+\/[*X\d+−-]+)(?:\n|$)/);
      o.push({
        range: n[c],
        stats: h?.[1] ?? "",
        text: h ? u.slice(h[0].length) : u
      });
    }
    const i = Rt(4.9, 55.6, 53.7, 25.5), l = i.height / o.length, d = D8[O(e).frame] ?? "#dcc8af";
    o.forEach((c, u) => {
      const h = i.y + u * l;
      u && a(
        "band",
        "",
        { x: i.x, y: h, width: i.width, height: l },
        { fill: u % 2 ? "#00000018" : "#00000028" }
      );
      const m = c.range ? 55 : 7, g = c.stats ? 72 : 7;
      a("rules", c.text, {
        x: i.x + m,
        y: h + 4,
        width: i.width - m - g,
        height: l - 8
      }), c.range && a(
        "level",
        `LEVEL
${c.range}`,
        { x: i.x - 12, y: h + l / 2 - 23, width: 65, height: 46 },
        { fill: d, font: 13 }
      ), c.stats && a(
        "stats",
        c.stats,
        { x: i.x + i.width - 68, y: h + l / 2 - 22, width: 77, height: 44 },
        { asset: xe("pt-boxes", O(e).pt), font: 26 }
      );
    });
  }
  return r;
}
function E8(e) {
  return er(e).flatMap((t) => [
    t.asset ?? null,
    ...q0(t.text).flatMap((r) => r.symbol ? [It(r.symbol)] : [])
  ]);
}
function A8(e) {
  if (["adventure", "prepare"].includes(ee(e))) {
    const t = e.faces?.[1];
    return t ? [
      t.name,
      t.typeLine,
      t.colors,
      t.frameColors,
      t.manaSymbols,
      t.rulesText,
      t.rulesParagraphs,
      t.rulesAlignment,
      t.wordingMode,
      t.symbolStyle,
      O(t)
    ] : null;
  }
  return Z1(e) ? er(e) : null;
}
function B8(e, t, r) {
  let a = !0;
  for (const s of er(t)) {
    if (!Ke(e) && (s.asset === V1 || s.kind !== "band" && s.kind !== "stats" && s.kind !== "level"))
      continue;
    const { x: n, y: o, width: i, height: l, font: d } = s;
    e.save(), e.textAlign = "left", e.fillStyle = s.fill ?? "transparent", s.kind === "level" ? (e.beginPath(), e.moveTo(n, o), e.lineTo(n + i * 0.72, o), e.lineTo(n + i, o + l / 2), e.lineTo(n + i * 0.72, o + l), e.lineTo(n, o + l), e.closePath(), e.fill(), e.strokeStyle = "#0008", e.lineWidth = 1, e.stroke()) : s.fill && e.fillRect(n, o, i, l);
    const c = s.asset ? r.get(s.asset) : null;
    if (c && e.drawImage(c, n, o, i, l), e.beginPath(), e.rect(n, o, i, l), e.clip(), e.fillStyle = s.color ?? "#17140f", ["stats", "level"].includes(s.kind)) {
      e.font = `${d}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle";
      const u = s.text.split(`
`);
      u.forEach(
        (h, m) => Se(
          e,
          h,
          n + i * (s.kind === "level" ? 0.43 : 0.5),
          o + l / 2 + (m - (u.length - 1) / 2) * d,
          i * 0.85,
          s.kind === "stats" && a && t.power != null && t.toughness != null ? t.textInk : void 0
        )
      ), s.kind === "stats" && (a = !1);
    } else if (s.align === "right")
      e.font = `${d}px "CardRenderer MTG MPlantin", Georgia`, e.textAlign = "right", e.textBaseline = "middle", e.fillText(s.text, n + i, o + l / 2, i);
    else {
      e.font = `${s.italic ? "italic " : ""}${d}px "CardRenderer MTG MPlantin", Georgia`;
      const u = ga(e, s.text, i, d).length * d + (s.text.split(`
`).length - 1) * H.paragraphGap;
      Jn(
        e,
        s.text,
        n,
        o + Math.max(0, (l - u) / 2),
        i,
        { size: d, italic: !!s.italic },
        r
      );
    }
    e.restore();
  }
}
const L8 = 5, G8 = 0.02655 * T + 0.91339 * j * 3810 / 2736;
function Wa(e) {
  const t = e ? 382 : 429;
  return { top: t, scale: 1 - L8 / (G8 - t) };
}
function $8(e) {
  const { top: t, scale: r } = Wa(e);
  return [t + 6, t + (625 - t) * r - 4];
}
function Qs(e, t, r, a, s, n) {
  const { top: o, scale: i } = Wa(n), l = t.height * s / t.width, d = Math.max(0, Math.min(l, o - a)), c = d * t.width / s;
  d > 0 && e.drawImage(t, 0, 0, t.width, c, r, a, s, d), d < l && e.drawImage(
    t,
    0,
    c,
    t.width,
    t.height - c,
    r,
    a + d,
    s,
    (l - d) * i
  );
}
const be = {
  badgeWidth: 54,
  badgeHeight: 40,
  textLeft: 67,
  staticTextLeft: 45,
  rightInset: 8,
  separatorLeft: 40,
  separatorHeight: 1.5,
  minimumRowHeight: 34,
  colonOffsetX: 4,
  colonOffsetY: 1.5,
  colonFontSize: 24,
  colonFontFamily: '"CardRenderer MTG MPlantin", Georgia',
  colonInk: "#17140f"
};
function O8(e, t, r) {
  const a = e.rulesParagraphs?.filter((o) => o.role === "rules")[r], s = (e.rulesText ?? "").split(`
`).filter((o) => o.trim())[r];
  if (!a || a.runs.map((o) => o.text).join("") !== s) return [{ text: t }];
  let n = s.length - t.length;
  return a.runs.flatMap((o) => {
    const i = Math.min(n, o.text.length);
    return n -= i, i === o.text.length ? [] : [{ ...o, text: o.text.slice(i) }];
  });
}
function P8(e, t) {
  const r = ee(t) === "planeswalker-large", a = m0(t), s = !r && a.length < 3, n = Be(t).rules, o = n[0] * j, i = n[1] * T, l = n[2] * j, d = n[3] * T - (r ? 24 : s ? 4 : 16), c = r ? 8 : s ? 3 : 0, u = r ? { ...P0, leading: 0.9 } : P0, h = a.map((R, x) => ({
    ...R,
    runs: O8(t, R.text, x),
    left: R.badges.length ? be.textLeft : be.staticTextLeft
  })), m = (R) => h.map(
    (x) => W(
      e,
      [{ role: "rules", runs: x.runs }],
      {
        x: o + x.left,
        y: 0,
        width: l - x.left - be.rightInset,
        height: 1e3
      },
      R,
      R,
      u
    )
  );
  let g = r ? 17.5 : s ? 24 : 19, f = m(g);
  const [b, w] = $8(r), p = () => {
    const R = d / Math.max(1, h.length), x = f.map((E, $) => i + c + R * ($ + 0.5) - E.height / 2);
    let I = b - 8;
    for (let E = 0; E < x.length; E++)
      x[E] = Math.max(x[E], I + 8), I = x[E] + f[E].height;
    let D = w + 8;
    for (let E = x.length - 1; E >= 0; E--)
      x[E] = Math.min(x[E], D - 8 - f[E].height), D = x[E];
    return x;
  }, S = () => (p()[0] ?? b) >= b, y = () => f.map(
    (R) => Math.max(be.minimumRowHeight, R.height + 16)
  ), k = () => {
    const R = d / Math.max(1, h.length);
    return f.every((x, I) => {
      const D = R * (I + 0.5);
      return D - x.height / 2 >= 6 && D + x.height / 2 <= d + 6 && (!I || R - (x.height + f[I - 1].height) / 2 >= 8);
    });
  };
  for (; g > 8 && (y().reduce((R, x) => R + x, 0) > d || !k() || !S()); )
    g -= 0.25, f = m(g);
  const v = d / Math.max(1, h.length), C = p();
  let M = c;
  return h.map((R, x) => {
    const I = v, D = f[x].height, E = W(
      e,
      [{ role: "rules", runs: R.runs }],
      {
        x: o + R.left,
        y: C[x],
        width: l - R.left - be.rightInset,
        height: D
      },
      g,
      g,
      u
    );
    E.overflow ||= M + I > c + d + 0.01, E.overflow ||= !k(), E.overflow ||= !S(), E.overflow ||= E.lines.some(
      (U) => U.inkBounds[1] < b - 0.01 || U.inkBounds[1] + U.inkBounds[3] > w + 0.01
    );
    const $ = { ...R, top: M, height: I, font: g, width: E.width, layout: E };
    return M += I, $;
  });
}
function Q1(e, t) {
  return e === "saga" ? /^(I|II|III|IV)$/.test(t) ? xe("saga", t) : null : xe(
    "planeswalker",
    t.startsWith("+") ? "LoyaltyPlus" : t === "0" ? "LoyaltyZero" : "LoyaltyMinus"
  );
}
function eo(e, t) {
  return ee(e) === "saga" ? xe("saga_textboxes", t === "Colourless" ? "Land" : t) : null;
}
function W8(e) {
  return {
    W: "#eee9d9f0",
    U: "#d3e4ecf0",
    B: "#ddd8e4f0",
    R: "#ecd4c8f0",
    G: "#d4e2d0f0",
    Gold: "#e8dfbef0",
    Colourless: "#f2f2f0f0"
  }[O(e).boxes] ?? "#dededbf0";
}
function F8(e, t) {
  const { top: r, scale: a } = Wa(ee(t) === "planeswalker-large");
  e.save(), e.translate(0, r), e.scale(1, a), e.translate(0, -r), e.beginPath(), e.moveTo(66, r), e.lineTo(448, r), e.quadraticCurveTo(456, r, 456, r + 8), e.lineTo(456, 613), e.bezierCurveTo(456, 623, 420, 629, 257, 629), e.bezierCurveTo(94, 629, 58, 623, 58, 613), e.lineTo(58, r + 8), e.quadraticCurveTo(58, r, 66, r), e.closePath(), e.clip(), e.fillStyle = W8(t), e.fillRect(58, r, 398, 629 - r), e.restore();
}
function U8(e, t, r) {
  e.save(), e.fillStyle = be.colonInk, e.font = `${be.colonFontSize}px ${be.colonFontFamily}`, e.textAlign = "center", e.textBaseline = "alphabetic";
  const a = e.measureText(":");
  e.fillText(
    ":",
    t,
    r + be.colonOffsetY + (a.actualBoundingBoxAscent - a.actualBoundingBoxDescent) / 2
  ), e.restore();
}
function _8(e, t, r) {
  const a = ee(t), s = a === "saga", n = Be(t).rules, o = n[0] * j, i = n[1] * T, l = n[2] * j, d = n[3] * T;
  s && (e.fillStyle = "#e3d8bb", e.fillRect(o, i, l, d));
  const c = eo(t, O(t).boxes), u = c ? r.get(c) : void 0;
  if (u && e.drawImage(u, o, i, l, d), !Ke(e)) return;
  const h = s ? H3(t) : P8(e, t);
  for (const [m, g] of h.entries()) {
    if (m > 0) {
      const w = h[m - 1]?.layout, p = g.layout && w ? Math.max(w.top + w.height + 3, Math.min(i + g.top, g.layout.top - 3)) : i + g.top;
      e.fillStyle = "#0002", e.fillRect(
        o + (s ? 0 : be.separatorLeft),
        p,
        l - (s ? 0 : be.separatorLeft),
        be.separatorHeight
      );
    }
    if (e.fillStyle = "#17140f", e.textAlign = "left", g.layout) ye(e, g.layout, r);
    else {
      e.font = `${g.reminder ? "italic " : ""}${g.font}px "CardRenderer MTG MPlantin", Georgia`;
      const w = ga(e, g.text, g.width, g.font).length * g.font;
      Jn(
        e,
        g.text,
        o + g.left,
        i + g.top + (g.height - w) / 2,
        g.width,
        { size: g.font, italic: g.reminder },
        r
      );
    }
    const f = s ? 36 : be.badgeWidth, b = s ? 36 : be.badgeHeight;
    g.badges.forEach((w, p) => {
      const S = o + (s ? -18 : 0), y = i + g.top + g.height / 2 + (p - g.badges.length / 2) * b, k = Q1(a, w), v = k ? r.get(k) : null;
      if (v) {
        if (e.save(), !s) {
          const C = e.getTransform().a;
          e.shadowColor = "#0009", e.shadowBlur = 3 * C, e.shadowOffsetY = 2 * C;
        }
        e.drawImage(v, S, y, f, b), e.restore();
      } else
        e.fillStyle = "#29231c", e.fillRect(S, y, f, b);
      s ? v || (e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.font = 'bold 19px "CardRenderer MTG Beleren", Georgia', e.fillText(w, S + f / 2, y + b / 2, f - 3)) : (o2(e, w, [S, y, f, b]), U8(
        e,
        S + f + be.colonOffsetX,
        y + b / 2
      ));
    });
  }
}
const to = 0.7;
function N8(e, t, r, a = !1) {
  const [s, n, o, i] = [
    r[0] * j,
    r[1] * T,
    r[2] * j,
    r[3] * T - 1
  ], l = new Path2D();
  l.moveTo(s + 14, n), l.lineTo(s + o - 14, n), l.quadraticCurveTo(s + o, n, s + o, n + 14), l.lineTo(s + o, n + i - 7), l.quadraticCurveTo(s + o, n + i, s + o - 7, n + i), l.lineTo(s + 9, n + i), l.quadraticCurveTo(s - 2, n + i, s - 2, n + i - 9), l.quadraticCurveTo(s - 2, n + 17, s + 2, n + 9), l.quadraticCurveTo(s + 5, n, s + 14, n), l.closePath(), e.save();
  const d = e.getTransform().a;
  e.shadowColor = "#0009", e.shadowBlur = 1.4 * d, e.shadowOffsetX = -1.2 * d, e.shadowOffsetY = 3.5 * d, e.fillStyle = "#191816", e.fill(l), e.shadowColor = "transparent", e.save(), e.clip(l);
  const c = t.width / o, u = [
    20 * c,
    t.height - (i - 4) * c,
    t.width - 40 * c,
    (i - 12) * c,
    s - 2,
    n,
    o + 2,
    i
  ];
  e.drawImage(t, ...u), a && (e.globalAlpha *= to, e.drawImage(t, ...u)), e.restore(), e.strokeStyle = "#191816", e.lineWidth = 1.2, e.stroke(l), e.restore();
}
function z8(e, t, r) {
  if (!t.pinlines) return;
  const a = (i) => {
    const l = r.get(i);
    if (!l) throw Error(`Planar pinline asset unavailable: ${i}`);
    return l;
  }, s = () => {
    const i = document.createElement("canvas");
    i.width = 732, i.height = 1020;
    const l = i.getContext("2d");
    if (!l) throw Error("Missing Planar pinline composition context");
    return { canvas: i, context: l };
  }, n = s(), o = s();
  try {
    n.context.drawImage(a(t.pinlines.left), 0, 0, 732, 1020), o.context.drawImage(a(t.pinlines.right), 0, 0, 732, 1020), o.context.globalCompositeOperation = "destination-in";
    const i = o.context.createLinearGradient(732 * 0.47, 0, 732 * 0.53, 0);
    i.addColorStop(0, "#0000"), i.addColorStop(1, "#000"), o.context.fillStyle = i, o.context.fillRect(0, 0, 732, 1020), n.context.drawImage(o.canvas, 0, 0), n.context.globalCompositeOperation = "destination-in", n.context.drawImage(a(t.pinlines.mask), 0, 0, 732, 1020), Hr(e, n.canvas);
  } finally {
    n.canvas.width = n.canvas.height = 0, o.canvas.width = o.canvas.height = 0;
  }
}
function en(e, t, r) {
  if (!Ee(e, t)) return { dx: 0, dy: 0, size: 1 };
  const a = e.frameTreatment === "colorshifted";
  return r === "title" ? a ? { dx: 0.25, dy: 0.75, size: 1.04 } : { dx: 1, dy: 0.75, size: 1.035 } : a ? { dx: -0.75, dy: -1.25, size: 1.03 } : { dx: 0.5, dy: 0, size: 1.025 };
}
const Y8 = 1.1;
function ro(e) {
  return !e.setSymbol && ["m19", "m20", "m21"].includes(e.setCode?.toLowerCase() ?? "");
}
function ao(e, t, r, a, s, n, o, i, l = 1) {
  const d = !r || r === "common", c = document.createElement("canvas"), u = 2, h = 4;
  c.width = Math.ceil((n + u * 2) * h), c.height = Math.ceil((o + u * 2) * h);
  const m = c.getContext("2d");
  m.scale(h, h), m.translate(u, u), m.drawImage(
    t,
    i[0] * t.width,
    i[1] * t.height,
    i[2] * t.width,
    i[3] * t.height,
    0,
    0,
    n,
    o
  ), m.globalCompositeOperation = "source-in";
  const g = r === "mythic" ? ["#9c2408", "#e97816", "#ffbf46", "#a73312"] : r === "uncommon" ? ["#506b80", "#a5c3d4", "#ccdce4", "#708898"] : ["#766326", "#c3af5c", "#eee1a0", "#907b36"], f = m.createLinearGradient(0, o * 0.65, n, o * 0.35);
  f.addColorStop(0, g[0]), f.addColorStop(0.35, g[1]), f.addColorStop(0.6, g[2]), f.addColorStop(1, g[3]), m.fillStyle = d ? "#111111" : f, m.fillRect(0, 0, n, o), m.beginPath(), m.moveTo(n * 0.046, 0), m.lineTo(n * 0.953, 0), m.bezierCurveTo(
    n * 1.016,
    o * 0.38,
    n * 1.016,
    o * 0.62,
    n * 0.953,
    o
  ), m.lineTo(n * 0.046, o), m.bezierCurveTo(-n * 0.017, o * 0.62, -n * 0.017, o * 0.38, n * 0.046, 0), m.closePath(), m.globalCompositeOperation = "destination-over", m.fillStyle = d ? "#f8f8f5" : "#111111", m.fill(), m.globalCompositeOperation = "source-over", m.strokeStyle = d ? "#f8f8f5" : "#111111", m.lineWidth = l, m.stroke(), e.drawImage(
    c,
    a - u,
    s - u,
    c.width / h,
    c.height / h
  ), c.width = c.height = 0;
}
function q8(e, t, r, a) {
  const s = document.createElement("canvas");
  s.width = 732, s.height = 1020;
  try {
    const n = s.getContext("2d");
    if (!n) throw Error("Missing frame stock composition context");
    a ? (n.save(), n.scale(1.5, 1.5), Hr(n, t, a === "colorshifted"), n.restore()) : n.drawImage(t, 0, 0, s.width, s.height), n.globalCompositeOperation = "source-in", n.fillStyle = r, n.fillRect(0, 0, s.width, s.height), e.drawImage(s, 0, 0, 488, 680);
  } finally {
    s.width = s.height = 0;
  }
}
const Kt = (e) => [
  e[0] * j,
  e[1] * T,
  e[2] * j,
  e[3] * T
];
function H8(e, t, r, a, s) {
  const n = ke(t);
  if (!n) throw Error("Missing replacement frame family.");
  const o = (_) => {
    const F = r.get(_);
    if (!F) throw Error(`Replacement frame asset unavailable: ${_}`);
    return F;
  }, { rects: i } = n, l = t.frameAssetFamily === "eighth", d = Wt(t, n.frame) ?? ve(t) ?? Ie(t.setCode, t.borderColor).border;
  if (e.save(), e.fillStyle = d, e.fillRect(0, 0, j, T), a && e.drawImage(a, 0, 0, j, T), Le(e, t, r, Kt(i.art), s), s === "artwork") {
    e.restore();
    return;
  }
  if (sa(t, n.frame) ? xi(e, o(n.frame)) : Ee(t, n.frame) ? Hr(e, o(n.frame), t.frameTreatment === "colorshifted") : e.drawImage(o(n.frame), 0, 0, j, T), z8(e, n, r), n.rightFrame) {
    const _ = document.createElement("canvas");
    _.width = 732, _.height = 1020;
    const F = _.getContext("2d");
    F.drawImage(o(n.rightFrame), 0, 0, _.width, _.height);
    const G = document.createElement("canvas");
    G.width = _.width, G.height = _.height;
    const q = G.getContext("2d"), st = (ze, Ze) => {
      const ce = q.createLinearGradient(G.width * ze, 0, G.width * Ze, 0);
      return ce.addColorStop(0, "#0000"), ce.addColorStop(1, "#000"), ce;
    };
    q.fillStyle = st(0.47, 0.53), q.fillRect(0, 0, G.width, G.height);
    const ge = l ? [0.08, 0.627, 0.84, 0.29] : [0.071, 0.629, 0.858, 0.294], [nt, ot, Fe, Ue] = ge, Ne = nt * G.width, pt = ot * G.height, bt = Fe * G.width, it = Ue * G.height;
    q.clearRect(Ne, pt, bt, it), q.fillStyle = st(0.27, 0.73), q.fillRect(Ne, pt, bt, it), F.globalCompositeOperation = "destination-in", F.drawImage(G, 0, 0), e.drawImage(_, 0, 0, j, T), _.width = _.height = 0, G.width = G.height = 0;
  }
  d !== "#090806" && q8(
    e,
    o(n.border),
    d,
    Ee(t, n.frame) ? t.frameTreatment === "colorshifted" ? "colorshifted" : "planar" : void 0
  ), M1(e, t, r), e.fillStyle = "#17140f", e.textAlign = "left", e.textBaseline = "middle";
  const c = Z0(t), u = l ? "CardRenderer MTG Matrix" : "CardRenderer MTG Beleren", [h, m, g, f] = Kt(i.title), b = t.manaSymbols ?? [], { size: w } = n.mana, p = n.mana.gap + (c?.spacing ?? 0), S = n.mana.right * j, y = b.length * w + Math.max(0, b.length - 1) * p, k = [
    S - y,
    n.mana.center * T - w / 2,
    y,
    w
  ], v = ht(k, c);
  e.font = `bold ${n.titleSize}px "${u}", Georgia`, e.save(), l && e.translate(...La(t, "eighth"));
  const C = en(t, n.frame, "title");
  e.translate(C.dx, C.dy), rn(e, t, n.frame), re(
    e,
    t.name,
    h,
    m + f / 2,
    b.length ? v[0] - h - 8 : g,
    n.titleSize * C.size,
    !0,
    1,
    u,
    t.frameTreatment === "colorshifted" ? 0.5 : 0
  ), e.restore(), X(
    e,
    t,
    "manaCost",
    () => At(e, k, c, () => {
      b.forEach(
        (_, F) => te(
          e,
          _,
          S - y + F * (w + p),
          n.mana.center * T - w / 2,
          w,
          r,
          !0,
          c
        )
      );
    })
  );
  const M = V(t), R = r.get(M ?? ""), x = at(t), I = R ? Math.min(
    n.symbol.width * j / (R.width * x[2]),
    n.symbol.height * T / (R.height * x[3])
  ) : 0, D = R ? R.width * x[2] * I : 0, E = R ? R.height * x[3] * I : 0, $ = I2(t, n.frame, M) ?? fl(t, M, [
    n.symbol.right * j - D,
    n.symbol.center * T - E / 2,
    D,
    E
  ]), U = ht($, t.symbolAdjustment?.set), [Z, Y, Q, le] = Kt(i.type);
  e.save();
  const ne = en(t, n.frame, "type");
  if (e.translate(ne.dx, ne.dy), rn(e, t, n.frame), e.font = `bold ${n.typeSize}px "${u}", Georgia`, re(
    e,
    t.typeLine ?? "",
    Z,
    Y + le / 2,
    R ? U[0] - Z - 7 : Q,
    n.typeSize * ne.size,
    !0,
    1,
    u,
    t.frameTreatment === "colorshifted" ? 0.5 : 0,
    t.textInk,
    "type"
  ), e.restore(), X(
    e,
    t,
    "setSymbol",
    () => At(e, $, t.symbolAdjustment?.set, () => {
      if (R) {
        const _ = _1(t);
        Ge(M) || t.setSymbol ? e.drawImage(R, ...$) : ro(t) ? ao(e, R, t.rarity, ...$, x, 1.5) : _ ? N1(e, R, _, t.rarity, ...$, x, !1) : Ve(e, R, t.setCode, t.rarity, ...$, x);
      }
    })
  ), Mn(e, t, r) || ye(e, x1(e, t), r), t.power != null && t.toughness != null && e.drawImage(o(n.pt), ...Kt(i.stats)), l) {
    Zo(e, t, r, n.frame), e.restore();
    return;
  }
  if (t.power != null && t.toughness != null) {
    const [_, F, G, q] = Kt(i.stats);
    e.font = `bold 25px "${u}", Georgia`, e.textAlign = "center", e.textBaseline = "middle", Se(
      e,
      `${t.power}/${t.toughness}`,
      _ + G * 0.52,
      F + q * 0.52,
      G * 0.85,
      t.textInk
    );
  }
  Pr(e, t), e.restore();
}
let tn = null;
function X8(e) {
  if (e.frameAssetFamily !== "eighth") return Promise.resolve();
  const t = tn ??= Promise.all([
    document.fonts.load('700 24px "CardRenderer MTG Matrix"'),
    document.fonts.load('700 29px "CardRenderer MTG Matrix Small Caps"')
  ]).then((r) => {
    if (r.some((a) => !a.length || a.some((s) => s.status !== "loaded")))
      throw Error("Replacement Eighth Edition frames need card-glint/magic/fonts.css.");
  }).catch((r) => {
    throw tn = null, r;
  });
  return Promise.all([t, Vo(e, ke(e)?.frame ?? "")]).then(
    () => {
    }
  );
}
function rn(e, t, r) {
  t.frameTreatment === "colorshifted" && (e.fillStyle = "#fff", e.shadowColor = Wt(t, r) ?? "#000", e.shadowOffsetX = -21e-4 * j, e.shadowOffsetY = 15e-4 * T, e.shadowBlur = 0);
}
function J8(e, t, [r, a, s, n]) {
  const o = t.height * s / t.width;
  e.save(), e.beginPath(), e.rect(r, a, s, n / 2), e.clip(), e.drawImage(t, r, a + n - o + 1, s, o), e.restore();
}
function K8(e, [t, r, a, s], n) {
  if (!["W", "U", "B", "R", "G", "Artifact"].includes(n)) return;
  e.save(), e.shadowColor = "transparent";
  const o = e.createLinearGradient(t, 0, t + a, 0);
  o.addColorStop(0, "rgba(255,255,255,0)"), o.addColorStop(0.025, "rgba(255,255,255,0.2)"), o.addColorStop(0.975, "rgba(255,255,255,0.2)"), o.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = o, e.fillRect(t, r + s - 4, a, 2.3), e.restore();
}
const et = /* @__PURE__ */ new Map();
function so(e) {
  if (!(!e.retired || e.users)) {
    if (!e.sources) {
      e.controller.abort();
      return;
    }
    URL.revokeObjectURL(e.sources.original), e.sources.backing && URL.revokeObjectURL(e.sources.backing), e.sources.outlined && URL.revokeObjectURL(e.sources.outlined), e.sources = void 0;
  }
}
function Y4() {
  for (const e of et.values())
    e.retired = !0, so(e);
  et.clear();
}
async function V8(e, t) {
  t.throwIfAborted();
  let r = et.get(e);
  if (!r) {
    const l = {
      users: 0,
      retired: !1,
      controller: new AbortController(),
      promise: Promise.resolve().then(async () => {
        const d = await Yr(e, {
          mode: "cors",
          signal: l.controller.signal
        });
        if (!d.ok) throw Error(`Symbol source ${d.status}: ${e}`);
        const c = await Yl(e, await d.blob()), u = await Ul(e, c), h = await ql(e, c);
        l.controller.signal.throwIfAborted();
        const m = URL.createObjectURL(c);
        let g, f;
        try {
          g = u ? URL.createObjectURL(u) : void 0, f = h ? URL.createObjectURL(h) : void 0;
          const b = { original: m, backing: g, outlined: f };
          return l.sources = b, b;
        } catch (b) {
          throw URL.revokeObjectURL(m), g && URL.revokeObjectURL(g), f && URL.revokeObjectURL(f), b;
        }
      })
    };
    l.promise = l.promise.catch((d) => {
      throw et.get(e) === l && et.delete(e), d;
    }), et.set(e, l), r = l;
  }
  r.users++;
  const a = r;
  let s = !1;
  const n = () => {
    s || (s = !0, a.users--, !a.users && !a.sources && (a.retired = !0, et.get(e) === a && et.delete(e)), so(a));
  };
  let o = () => {
  };
  const i = new Promise((l, d) => {
    o = () => {
      n(), d(t.reason);
    }, t.addEventListener("abort", o, { once: !0 });
  });
  try {
    const l = await Promise.race([a.promise, i]);
    return t.throwIfAborted(), { sources: l, release: n };
  } catch (l) {
    throw n(), l;
  } finally {
    t.removeEventListener("abort", o);
  }
}
async function Z8(e, t) {
  t.throwIfAborted();
  const r = [...new Set(e.filter((l) => !!l))], a = [], s = /* @__PURE__ */ new Map(), n = () => {
    for (const l of a) l.release();
    a.length = 0;
  }, i = (await Promise.allSettled(
    r.map(async (l) => {
      if (!Fl(l) && !zl(l)) {
        s.set(l, l);
        return;
      }
      const d = await V8(l, t);
      a.push(d), s.set(l, d.sources.original), d.sources.backing && s.set(z1(l), d.sources.backing), d.sources.outlined && s.set(Y1(l), d.sources.outlined);
    })
  )).find((l) => l.status === "rejected");
  if (i?.status === "rejected")
    throw n(), i.reason;
  return t.aborted && (n(), t.throwIfAborted()), { urls: [...new Set(s.values())], aliases: s, dispose: n };
}
function Q8(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const [a, s] of e) {
    const n = t.get(s);
    n && r.set(a, n);
  }
  return r;
}
async function e4(e, t) {
  return t.throwIfAborted(), Yr(e, { signal: t, mode: "cors" });
}
function t4(e) {
  if (e.startsWith(`${B}/img/frames/m15/holoStamps/`) || e.startsWith(`${B}/img/frames/planeswalker/holo/`) || e.startsWith(B) && /\/saga\/(sagaChapter|sagaDivider|sagaMidStripe|stamp)\.png$/.test(e))
    return;
  if (e.startsWith(`${B}/data/images/cardImages/saga/`)) return 768;
  if (e.startsWith(`${B}/img/frames/future/regular/futurePT`)) return;
  if (e.startsWith(`${B}/img/frames/`) && e.endsWith(".png"))
    return /\/pt\/|\/m15PT/.test(e) ? 256 : 768;
  if (e.startsWith(`${Et}/img/frames/`) && e.endsWith(".png")) return 768;
  const t = e.startsWith(`${Dt}/img/`) ? e.slice(`${Dt}/img/`.length) : "";
  return t === "class_level_bg.webp" || /^(bg|frames|adventure_frames|class_frames|boxes|legendary_crowns|saga_(?:bg|frames|textboxes)|planeswalker_(?:large_)?(?:bg|frames|boxes))\//.test(
    t
  ) ? 768 : void 0;
}
async function r4(e) {
  if (!e.type.includes("svg")) return e;
  const t = new DOMParser().parseFromString(await e.text(), "image/svg+xml"), r = t.documentElement;
  if (r.localName !== "svg" || t.querySelector("parsererror"))
    throw new Error("Invalid SVG asset.");
  const a = (r.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number), s = a[2] ?? parseFloat(r.getAttribute("width") ?? ""), n = a[3] ?? parseFloat(r.getAttribute("height") ?? "");
  if (!(s > 0 && n > 0 && Number.isFinite(s + n)))
    throw new Error("SVG asset needs a finite viewport.");
  const o = 512 / Math.max(s, n);
  return r.hasAttribute("viewBox") || r.setAttribute("viewBox", `0 0 ${s} ${n}`), r.setAttribute("width", String(Math.max(1, Math.round(s * o)))), r.setAttribute("height", String(Math.max(1, Math.round(n * o)))), new Blob([new XMLSerializer().serializeToString(r)], { type: "image/svg+xml" });
}
async function a4(e, t, r) {
  if (t.throwIfAborted(), !e.type.includes("svg"))
    return r ? createImageBitmap(e, { resizeWidth: r, resizeQuality: "high" }) : createImageBitmap(e);
  const a = URL.createObjectURL(await r4(e)), s = new Image(), n = document.createElement("canvas"), o = () => {
    s.src = "";
  };
  t.addEventListener("abort", o, { once: !0 });
  try {
    t.throwIfAborted(), s.src = a, await s.decode(), t.throwIfAborted(), n.width = s.naturalWidth, n.height = s.naturalHeight;
    const i = n.getContext("2d", { willReadFrequently: !0 });
    if (!i || !n.width || !n.height)
      throw new Error("SVG asset could not be rasterized.");
    return i.drawImage(s, 0, 0), await createImageBitmap(n);
  } finally {
    t.removeEventListener("abort", o), s.src = "", URL.revokeObjectURL(a), n.width = 0, n.height = 0;
  }
}
async function no(e, t) {
  const r = await Z8(e, t), a = r.urls, s = /* @__PURE__ */ new Map();
  let n = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(4, a.length) }, async () => {
        for (; n < a.length && !t.aborted; ) {
          const i = a[n++];
          try {
            const l = await e4(i, t);
            if (!l.ok) continue;
            const d = await l.blob(), c = await a4(d, t, t4(i));
            t.aborted ? c.close() : s.set(i, c);
          } catch {
          }
        }
      })
    );
  } finally {
    r.dispose();
  }
  const o = Q8(r.aliases, s);
  return {
    images: o,
    dispose: () => {
      for (const i of s.values()) i.close();
      s.clear(), o.clear();
    }
  };
}
function oo(e) {
  if (e = rt(e), e.frameTemplate)
    return [
      ...I3(e),
      e.illustration,
      V(e),
      ...$e(
        e.frameTemplate === "future" ? { ...e, manaSymbols: e.manaSymbols?.filter((o) => !J0(o)) } : e
      ),
      ...(e.faces ?? []).flatMap($e)
    ];
  if (V0(e))
    return [
      ...b1(e),
      e.illustration,
      V(e),
      ...$e(e),
      ...$e(_t(e))
    ];
  if (h0(e))
    return [
      ...p1(e),
      e.illustration,
      V(e),
      ...$e(e),
      ...$e(e.faces[1])
    ];
  if (ft(e))
    return [
      ...a1(e),
      ...De(e).flatMap((o) => [
        o.face.illustration,
        ...$e(o.face)
      ]),
      V(De(e)[0].face)
    ];
  const t = Pe(e);
  if (t)
    return [
      ...De(e).flatMap((o, i) => [
        ...J3(o.face, t, Lt(e) && t === "eighth", i),
        o.face.illustration,
        V(o.face),
        ...$e(o.face)
      ]),
      ...t === "eighth" && Lt(e) ? m5(e) : []
    ];
  const r = Ii(e);
  if (r)
    return [
      ...r,
      ut(e)?.image,
      ut(e)?.rightImage,
      e.illustration,
      V(e),
      ...$e(e)
    ];
  if (ae(e)) return Ri(e);
  if (ee(e) === "saga")
    return [...U3(e), e.illustration, V(e), ...$e(e)];
  const a = De(e);
  if (a.length) return a.flatMap((o) => oo(o.face));
  const s = O(e), n = gt(s, ee(e));
  return [
    ut(e)?.image,
    ut(e)?.rightImage,
    ee(e) === "normal" ? H0(e) : null,
    ...E8(e),
    n.background,
    n.frame,
    n.boxes,
    n.pt,
    eo(e, s.boxes),
    ...["saga", "planeswalker", "planeswalker-large"].includes(ee(e)) ? m0(e).flatMap(
      (o) => o.badges.map((i) => Q1(ee(e), i))
    ) : [],
    s.legendary ? n.crown : null,
    e.illustration,
    V(e),
    ...$e(e)
  ];
}
let an = null;
function sn() {
  return an ??= Promise.all([
    document.fonts.load('24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 24px "CardRenderer MTG Beleren"'),
    document.fonts.load('700 11px "CardRenderer MTG Beleren Small Caps"'),
    document.fonts.load('24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('italic 24px "CardRenderer MTG MPlantin"'),
    document.fonts.load('14px "CardRenderer MTG Relay"'),
    document.fonts.load('14px "CardRenderer MTG Artist Credit"')
  ]).then((e) => {
    if (e.some((t) => !t.length || t.some((r) => r.status !== "loaded")))
      throw Error(
        "Magic fonts are unavailable. Load card-glint/magic/fonts.css before preparing cards."
      );
  }).catch((e) => {
    throw an = null, e;
  });
}
function x0(e) {
  return Be(e).art;
}
const nn = /* @__PURE__ */ new WeakMap(), T0 = ([e, t, r, a]) => [e, 1 - t - a, e + r, 1 - t], s4 = [T0(Be({ name: "" }).art), [0, 0, 0, 0]];
function q4(e) {
  if (!e) return s4;
  const t = nn.get(e);
  if (t) return t;
  const r = De(e), a = r.length ? [
    T0(cs(r[0], x0(r[0].face))),
    T0(cs(r[1], x0(r[1].face)))
  ] : [T0(x0(e)), [0, 0, 0, 0]];
  return nn.set(e, a), a;
}
const n4 = new Q0(4 * 1024 * 1024), on = /* @__PURE__ */ new WeakMap();
let o4 = 0;
async function i4(e, t, r, a) {
  if (a.throwIfAborted(), r !== void 0 && !["auto", "alpha", "ink"].includes(r))
    throw Error("Invalid set symbol mask mode");
  if (!(r === "ink" || (r === void 0 || r === "auto") && Ge(t))) return { value: e, release() {
  } };
  let n = on.get(e);
  n === void 0 && on.set(e, n = ++o4);
  const o = Math.min(1, 512 / Math.max(e.width, e.height)), i = Math.max(1, Math.round(e.width * o)), l = Math.max(1, Math.round(e.height * o));
  return n4.acquire(
    JSON.stringify(["set-symbol-ink-v1", n, i, l]),
    i * l * 4,
    async () => {
      const d = document.createElement("canvas");
      d.width = i, d.height = l;
      try {
        const c = d.getContext("2d", { willReadFrequently: !0 });
        if (!c) throw Error("Set symbol mask needs Canvas2D");
        c.drawImage(e, 0, 0, i, l);
        const u = c.getImageData(0, 0, i, l);
        for (let h = 0; h < u.data.length; h += 4) {
          const m = u.data[h] * 0.2126 + u.data[h + 1] * 0.7152 + u.data[h + 2] * 0.0722;
          u.data[h + 3] = Math.round(u.data[h + 3] * (1 - m / 255)), u.data[h] = u.data[h + 1] = u.data[h + 2] = 255;
        }
        return c.putImageData(u, 0, 0), await createImageBitmap(d);
      } finally {
        d.width = d.height = 0;
      }
    },
    a
  );
}
async function l4(e, t, r, a, s, n, o = no, i) {
  return io(e, t, r, a, {
    threshold: s,
    resolveEtching: i,
    beforePaint: n,
    loadImages: o,
    height: T
  });
}
async function io(e, t, r, a, s) {
  const { threshold: n, beforePaint: o, loadImages: i, height: l } = s, d = De(t);
  if (d.length) {
    for (const y of d) {
      e.save();
      try {
        y1(e, y), await io(e, y.face, r, a, {
          ...s,
          height: y.height * j / y.width
        });
      } finally {
        e.restore();
      }
    }
    return;
  }
  if (t.illustration && s.resolveEtching) {
    let y;
    try {
      const k = await s.resolveEtching(t, r, a, n, o);
      y = await i([k, t.illustration], a);
      const v = y.images.get(k ?? "");
      if (v && !a.aborted) {
        await o?.(), a.throwIfAborted();
        const [C, M, R, x] = Be(t).art, I = C * j, D = M * l, E = R * j, $ = x * l, U = y.images.get(t.illustration) ?? v;
        e.save(), e.beginPath();
        const Z = x0(t);
        e.rect(
          Z[0] * j,
          Z[1] * l,
          Z[2] * j,
          Z[3] * l
        ), e.clip(), e.imageSmoothingQuality = "low";
        const Y = Ia(t, [I, D, E, $], j, l);
        if (t.illustrationCrop) {
          const Q = t.illustrationCrop, le = O0(
            U.width * Q[2],
            U.height * Q[3],
            Y,
            t.artPlacement
          );
          e.drawImage(
            v,
            Q[0] * v.width,
            Q[1] * v.height,
            Q[2] * v.width,
            Q[3] * v.height,
            ...le
          );
        } else
          e.drawImage(
            v,
            ...O0(U.width, U.height, Y, t.artPlacement)
          );
        e.restore();
      }
    } catch {
    } finally {
      y?.dispose();
    }
  }
  if (a.throwIfAborted(), !t.setCode || t.printingElements?.setSymbol?.hidden) return;
  const [c, u, h, m] = Be(t).stamp, g = c * j, f = u * l, b = h * j, w = m * l, p = Ho(t), S = await i([p], a);
  try {
    await o?.(), a.throwIfAborted();
    const y = p ? S.images.get(p) : null;
    e.save();
    try {
      if (t.printingElements?.setSymbol?.offset && e.translate(...t.printingElements.setSymbol.offset), e.globalAlpha = 0.68, y) {
        const k = await i4(y, p, t.setSymbolMask, a);
        try {
          a.throwIfAborted();
          const v = Math.min(b / k.value.width, w / k.value.height);
          e.drawImage(
            k.value,
            g + (b - k.value.width * v) / 2,
            f + (w - k.value.height * v) / 2,
            k.value.width * v,
            k.value.height * v
          );
        } finally {
          k.release();
        }
      } else
        e.translate(g, f), e.scale(b / 100, w / 100), e.fillStyle = "white", e.fill(new Path2D(wo)), e.font = "bold 43px Georgia", e.textAlign = "center", e.textBaseline = "alphabetic", e.fillText(vo(t.setCode), 50, 65);
    } finally {
      e.restore();
    }
  } finally {
    S.dispose();
  }
}
function d4(e) {
  return e.replace(
    /^(https:\/\/cards\.scryfall\.io\/)normal(\/(?:front|back)\/[^?#]+)\.jpg$/,
    "$1png$2.png"
  );
}
const c4 = {
  table: { right: 0.015, bottom: 0.0325, width: 0.44, height: 0.16 },
  inspect: { right: 0.015, bottom: 0.0325, width: 0.24, height: 0.09 }
}, ln = /* @__PURE__ */ new WeakMap();
function u4(e, t) {
  let r = ln.get(t);
  if (r || (r = new Path2D(t.path), ln.set(t, r)), e.save(), t.viewBox) {
    const [a, s, n, o] = t.viewBox;
    e.scale(24 / n, 24 / o), e.translate(-a, -s);
  }
  t.transform && e.transform(...t.transform), t.filled ? (e.fillStyle = e.strokeStyle, e.fill(r)) : e.stroke(r), e.restore();
}
function dn(e, t, r, a, s = !1) {
  const n = j * 0.105, o = j * 0.015, i = Math.floor(j * 0.9 / (n + o));
  if (t.forEach((m, g) => {
    e.save(), e.translate(
      j * 0.05 + g % i * (n + o),
      T * 0.13 + Math.floor(g / i) * (n + o)
    ), e.fillStyle = "#17201fed", e.strokeStyle = "#c6af7977", e.lineWidth = 1, e.beginPath(), e.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2), e.fill(), e.stroke(), e.translate(n * 0.14, n * 0.14), e.scale(n * 0.72 / 24, n * 0.72 / 24), e.strokeStyle = "#f3e9cf", e.lineWidth = 1.8, e.lineCap = "round", e.lineJoin = "round", u4(e, m), e.restore();
  }), r?.power == null || r.toughness == null) return;
  e.save();
  const l = c4[s ? "inspect" : "table"], d = j * l.width, c = T * l.height, u = j * (1 - l.right - l.width), h = T * (1 - l.bottom - l.height);
  a ? e.drawImage(a, u, h, d, c) : (e.fillStyle = "#eee5cf", e.strokeStyle = "#746854", e.lineWidth = 2, e.beginPath(), e.roundRect(
    u + d * (s ? 0.14 : 0.1),
    h + c * (s ? 0.19 : 0.18),
    d * (s ? 0.72 : 0.8),
    c * (s ? 0.62 : 0.64),
    c * 0.12
  ), e.fill(), e.stroke()), e.font = `bold ${j * (s ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`, e.fillStyle = "#17140f", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
    `${r.power}/${r.toughness}`,
    u + d / 2,
    s ? h + c / 2 - j * 0.01 : h + c * 0.48,
    d * 0.72
  ), e.restore();
}
function H4(e) {
  return e.currentStats?.power != null && e.currentStats.toughness != null && e.statusLayout !== "inspect" ? { ...e, statusLayout: "inspect" } : e;
}
function X4(e, t) {
  if (e.custom)
    return JSON.stringify([
      "custom-face-v1",
      e.custom.key,
      t,
      e.layer ?? "face",
      e.layer === "etching" ? e.etchThreshold ?? 20 : null
    ]);
  const r = e.face, a = zr(r, e.layer === "etching"), s = e.currentStats?.power != null && e.currentStats.toughness != null ? [e.currentStats.power, e.currentStats.toughness] : null;
  return JSON.stringify([
    Dt,
    B,
    "canvas-face-v148",
    e.paintLayer ?? null,
    e.rulesText !== !1,
    t,
    e.printingId,
    e.layer === "etching" ? null : e.printedImage,
    a,
    e.layer ?? "face",
    e.layer === "etching" ? e.etchThreshold ?? 14 : null,
    e.layer === "etching" ? null : [
      (e.emblems ?? []).map((n) => [
        n.path,
        n.viewBox ?? null,
        n.transform ?? null,
        !!n.filled
      ]),
      s,
      s ? e.statusLayout ?? t : null
    ]
  ]);
}
function zr(e, t) {
  const r = [
    e.printingElements,
    e.collectorTotal,
    e.collectorLanguage,
    e.collectorSetCode,
    ...e.calibration !== void 0 ? [["printing-calibration-v1", e.calibration]] : []
  ], a = r.some((n) => n !== void 0) ? [["printing-elements-v1", ...r]] : [], s = De(e);
  return s.length ? [
    e.layout,
    ...a,
    e.artist ?? null,
    e.collectorNumber ?? null,
    e.legalText ?? null,
    e.borderColor ?? null,
    s.map((n) => [n.x, n.y, n.width, n.height, n.rotation, zr(n.face, t)]),
    !t && Ta(e),
    !t && o1(e),
    ...!t && e.printingOmissions?.length ? [e.printingOmissions] : [],
    ...!t && e.blackBorderLift ? [["border-ink", e.blackBorderLift]] : []
  ] : t ? [
    ...e.printingElements?.setSymbol?.hidden ? [["hidden-set-symbol"]] : [],
    ...e.printingElements?.setSymbol?.offset ? [["set-symbol-offset", e.printingElements.setSymbol.offset]] : [],
    e.illustration ?? null,
    e.etchedIllustration ?? null,
    e.illustrationCrop ?? null,
    e.illustrationPlacement ?? null,
    ...e.artPlacement ? [["art-placement-v1", e.artPlacement]] : [],
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    ["set-symbol-mask-v1", e.setSymbolMask ?? "auto"],
    Be(e)
  ] : [
    ...a,
    ae(e) ? [He(e), Ae(e)] : null,
    e.borderColor ?? null,
    e.frameAssetFamily ?? null,
    e.frameTreatment ?? null,
    e.frameTemplate ?? null,
    e.futureTreatment ?? null,
    e.defense ?? null,
    e.faces?.map((n) => zr(n, t)) ?? null,
    e.name,
    e.manaSymbols ?? [],
    e.symbolAdjustment ?? null,
    e.typeLine ?? "",
    e.canonicalTypeLine ?? null,
    e.rulesText ?? "",
    e.rulesParagraphs ?? null,
    e.wordingMode ?? null,
    e.symbolStyle ?? null,
    e.colorCalibration ?? null,
    e.rulesAlignment ?? null,
    e.illustration ?? null,
    e.illustrationCrop ?? null,
    e.illustrationPlacement ?? null,
    ...e.artPlacement ? [["art-placement-v1", e.artPlacement]] : [],
    A8(e),
    e.artist ?? null,
    e.watermark ?? null,
    e.collectorNumber ?? null,
    e.collectorFormat ?? null,
    e.legalText === void 0 ? ["default"] : e.legalText,
    e.setCode ?? null,
    e.setSymbol ?? null,
    e.setSymbolSource ?? null,
    e.rarity ?? "common",
    e.securityStamp ?? "default",
    e.textInk ?? null,
    e.power ?? null,
    e.toughness ?? null,
    e.loyalty ?? null,
    e.reverseStats ?? null,
    e.layout ?? null,
    Be(e),
    O(e),
    ...e.printingOmissions?.length ? [e.printingOmissions] : [],
    ...e.blackBorderLift ? [["border-ink", e.blackBorderLift]] : []
  ];
}
function h4(e) {
  const t = document.createElement("canvas");
  return t.width = e === "table" ? 244 : 732, t.height = e === "table" ? 340 : 1020, t;
}
async function J4(e, t, r, a) {
  if (e = { ...e, face: rt(e.face) }, Ea(e.face), Cn(e.face), ma(e.face), e.custom)
    return await a?.beforePaint?.(), r.throwIfAborted(), e.custom.compose(t, r, e.layer ?? "face", e.etchThreshold);
  const s = a?.loadImages ?? no, n = h4(t);
  try {
    const o = n.getContext("2d", {
      willReadFrequently: !!a?.cpuPixels
    });
    if (!o) throw new Error("Card composition needs Canvas2D.");
    if (o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "high", o.scale(n.width / j, n.height / T), e.layer === "etching")
      return await l4(
        o,
        e.face,
        e.printingId,
        r,
        e.etchThreshold,
        a?.beforePaint,
        s,
        a?.resolveEtching
      ), n;
    o.fillStyle = "#090806", o.fillRect(0, 0, j, T);
    const i = e.currentStats?.power != null && e.currentStats.toughness != null ? gt(O(e.face)).pt : null;
    if (e.printedImage) {
      const h = t === "inspect" ? d4(e.printedImage) : e.printedImage;
      i && await (a?.loadFonts ?? sn)();
      const m = await s(i ? [h, i] : [h], r);
      try {
        const g = m.images.get(h);
        if (g && !r.aborted) {
          if (await a?.beforePaint?.(), r.throwIfAborted(), o.drawImage(g, 0, 0, j, T), e.paintLayer !== "artwork" && e.face.blackBorderLift && (e.face.borderColor ?? "black") === "black") {
            if (!Number.isFinite(e.face.blackBorderLift) || e.face.blackBorderLift < 0 || e.face.blackBorderLift > 0.2)
              throw Error("Invalid black border lift");
            const f = Math.round(e.face.blackBorderLift * 255), b = j * 0.035;
            o.save(), o.globalCompositeOperation = "lighten", o.fillStyle = `rgb(${f},${f},${f})`, o.beginPath(), o.rect(0, 0, j, T), o.rect(b, b, j - 2 * b, T - 2 * b), o.fill("evenodd"), o.restore();
          }
          return dn(
            o,
            e.emblems ?? [],
            e.currentStats,
            i ? m.images.get(i) : void 0,
            e.statusLayout === "inspect" || t === "inspect"
          ), cn(o, e.face), n;
        }
      } finally {
        m.dispose();
      }
    }
    e.paintLayer !== "artwork" && await Promise.all([
      (a?.loadFonts ?? sn)(),
      Pe(e.face) ? y5(e.face) : X8(e.face),
      T2(e.face),
      ee(e.face) === "saga" ? C5() : Promise.resolve(),
      h0(e.face) || V0(e.face) ? $1() : Promise.resolve(),
      ae(e.face) || Pe(e.face) === "old" || d0(e.face, "W") === "historic-font" ? (a?.loadRetroFont ?? T8)() : Promise.resolve()
    ]), r.throwIfAborted();
    const l = await s(oo(e.face), r);
    let d, c, u;
    try {
      e.paintLayer !== "artwork" && (d = await el(e.face, l.images, r)), e.paintLayer !== "artwork" && (c = await ml(e.face, d?.images ?? l.images, r)), u = e.paintLayer === "artwork" ? { images: l.images, dispose() {
      } } : await P2(
        e.face,
        c?.images ?? d?.images ?? l.images,
        r
      ), await a?.beforePaint?.(), r.throwIfAborted();
      const h = u.images;
      if (po(
        o,
        e.rulesText !== !1,
        () => v3(
          o,
          e.face,
          () => lo(
            o,
            e.face,
            h,
            T,
            !1,
            a?.underArt,
            e.paintLayer
          )
        )
      ), e.paintLayer !== "artwork" && e.face.blackBorderLift && (e.face.borderColor ?? "black") === "black") {
        if (!Number.isFinite(e.face.blackBorderLift) || e.face.blackBorderLift < 0 || e.face.blackBorderLift > 0.2)
          throw Error("Invalid black border lift");
        const m = Math.round(e.face.blackBorderLift * 255), g = j * 0.035;
        o.save(), o.globalCompositeOperation = "lighten", o.fillStyle = `rgb(${m},${m},${m})`, o.beginPath(), o.rect(0, 0, j, T), o.rect(g, g, j - 2 * g, T - 2 * g), o.fill("evenodd"), o.restore();
      }
      return dn(
        o,
        e.emblems ?? [],
        e.currentStats,
        i ? l.images.get(i) : void 0,
        e.statusLayout === "inspect" || t === "inspect"
      ), cn(o, e.face), n;
    } finally {
      u?.dispose(), c?.dispose(), d?.dispose(), l.dispose();
    }
  } catch (o) {
    throw n.width = n.height = 0, o;
  }
}
function cn(e, t) {
  e.save(), e.setTransform(
    e.canvas.width / j,
    0,
    0,
    e.canvas.height / T,
    0,
    0
  ), e.globalCompositeOperation = "destination-in", e.globalAlpha = 1, e.shadowColor = "transparent", e.filter = "none", e.fillStyle = "#000", e.beginPath(), e.roundRect(0, 0, j, T, bl(t) * j), e.fill(), e.restore();
}
function lo(e, t, r, a = T, s = !1, n, o) {
  if (t = rt(t), t.frameTemplate) {
    x2(e, t, r, o, n);
    return;
  }
  if (V0(t)) {
    d5(e, t, r, n, o);
    return;
  }
  if (h0(t)) {
    r5(e, t, r, n, o);
    return;
  }
  if (ft(t)) {
    M5(e, t, r, n, o);
    return;
  }
  if (Pe(t)) {
    w5(e, t, r, n, o);
    return;
  }
  if (t.frameAssetFamily) {
    H8(e, t, r, n, o);
    return;
  }
  if (ae(t)) {
    M8(e, t, r, n, o);
    return;
  }
  if (ee(t) === "saga") {
    j5(e, t, r, n, o);
    return;
  }
  const i = De(t);
  if (i.length) {
    e.fillStyle = ve(t) ?? Ie(t.setCode, t.borderColor).border, e.fillRect(0, 0, j, T);
    for (const A of i)
      e.save(), y1(e, A), lo(
        e,
        A.face,
        r,
        A.height * j / A.width,
        !0,
        n,
        o
      ), e.restore();
    if (o === "artwork") return;
    Pr(e, t), Ta(t) && Ke(e) && (e.font = '14px "CardRenderer MTG MPlantin", Georgia', e.fillStyle = "white", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
      "Fuse (You may cast one or both halves of this card from your hand.)",
      j / 2,
      T - 12,
      j * 0.9
    ));
    return;
  }
  const l = (A) => [
    A[0] * j,
    A[1] * a,
    A[2] * j,
    A[3] * a
  ];
  e.fillStyle = ve(t) ?? Ie(t.setCode, t.borderColor).border, e.fillRect(0, 0, j, a);
  const d = Be(t), c = ee(t);
  if (o === "artwork") {
    Le(e, t, r, l(d.art), o);
    return;
  }
  const u = O(t), h = gt(u, c), g = {
    W: "#d7cda9",
    U: "#447e9a",
    B: "#5b5260",
    R: "#a84f3e",
    G: "#477553",
    Gold: "#a38335"
  }[u.boxes] ?? "#827d72", f = (A, z, ie = "top") => {
    const je = r.get(A);
    if (!je) return !1;
    const [Ye, rr, ar, sr] = l(z);
    e.save(), e.beginPath(), e.rect(Ye, rr, ar, sr), e.clip();
    const Fa = ie === "stretch" ? sr : je.height * ar / je.width;
    return e.drawImage(
      je,
      Ye,
      ie === "bottom" ? rr + sr - Fa : rr,
      ar,
      Fa
    ), e.restore(), !0;
  }, [b, w, p, S] = l(u.legendary ? d.legendaryBackground : d.background);
  if (e.save(), e.beginPath(), e.roundRect(b, w, p, S, [
    { x: p * 0.01282, y: S * 962e-5 },
    { x: p * 0.01282, y: S * 962e-5 },
    { x: p * 0.06838, y: S * 0.05128 },
    { x: p * 0.06838, y: S * 0.05128 }
  ]), e.clip(), s) {
    const A = g.slice(1).match(/../g).map(
      (z, ie) => Math.round(parseInt(z, 16) * 0.62 + [244, 236, 217][ie] * 0.38)
    );
    e.fillStyle = `rgb(${A.join(",")})`, e.fillRect(b, w, p, S);
  }
  const y = r.get(h.background), k = c.startsWith("planeswalker");
  if (y && k ? Qs(e, y, b, w, p, c === "planeswalker-large") : y ? e.drawImage(
    y,
    b,
    w + (u.legendary ? H.legendaryBackgroundLift : 0),
    p,
    s ? S : y.height * p / y.width
  ) : (e.fillStyle = g, e.fillRect(b, w, p, S)), e.restore(), e.fillStyle = "#e3d8bb", !r.has(h.frame))
    if (c === "adventure")
      for (const A of er(t).filter((z) => z.kind === "rules" && !z.color))
        e.fillRect(A.x, A.y, A.width, A.height);
    else e.fillRect(...l(d.rules));
  r.has(h.boxes) || (e.fillRect(...l(d.title)), e.fillRect(...l(d.type))), e.fillStyle = "#80745c", k || e.fillRect(...l(d.art));
  const v = r.get(h.frame);
  if (v && c === "normal" && !s) {
    const A = na(t);
    yl(
      e,
      u,
      A,
      () => un(e, v, u.legendary, d.frame, !0, A)
    ), wl(e, u, A), kl(e, u, A);
  }
  if (n && (e.save(), e.beginPath(), e.rect(0, 0, j, a), e.clip(), e.resetTransform(), e.drawImage(n, 0, 0, e.canvas.width, e.canvas.height), e.restore()), c === "normal" && !s) {
    const [A, z, ie, je] = l(d.art), Ye = s0.artRim;
    e.fillStyle = "#090806", e.fillRect(A - Ye, z - Ye, ie + 2 * Ye, je + 2 * Ye);
  }
  if (Le(e, t, r, l(d.art), o), k && F8(e, t), v && k) {
    const [A, z, ie] = l(d.frame);
    Qs(e, v, A, z, ie, c === "planeswalker-large");
  } else v && c !== "normal" && un(e, v, u.legendary, d.frame);
  if (u.legendary && f(h.crown, d.crown), s) {
    const A = r.get(h.boxes);
    if (A) {
      const ie = A.height * 0.104;
      e.drawImage(A, 0, 0, A.width, ie, ...l(d.title)), e.drawImage(A, 0, A.height - ie, A.width, ie, ...l(d.type));
    }
    const z = r.get(h.frame);
    e.fillStyle = "#e3d8bb", e.fillRect(...l(d.rules)), z && e.drawImage(
      z,
      z.width * 0.035,
      z.height * 0.675,
      z.width * 0.93,
      z.height * 0.325,
      ...l(d.rules)
    );
  } else {
    const A = k && ["Colourless", "Artifact", "Land"].includes(u.boxes);
    f(h.boxes, d.title), A && (e.save(), e.globalAlpha *= to, f(h.boxes, d.title), e.restore());
    const z = r.get(h.boxes);
    k && z ? N8(e, z, d.type, A) : (f(h.boxes, d.type, "bottom"), c === "normal" && z && (J8(e, z, l(d.type)), K8(e, l(d.type), u.boxes)));
  }
  s || M1(e, t, r), e.fillStyle = "#17140f", e.textBaseline = "middle", e.textAlign = "left";
  const [C, M, R, x] = l(d.title), I = C + H.plateLeft + (c === "normal" ? 1 : 0), D = Z0(t), E = Z3(t), $ = t.manaSymbols ?? [], U = H.manaSize * E, Z = H.manaGap + (D?.spacing ?? 0), Y = $.length * U + Math.max(0, $.length - 1) * Z, Q = C + R - H.plateRight, le = Q - Y, ne = [
    le,
    M + x / 2 - U / 2 + H.manaLift / 2,
    Y,
    U
  ], _ = $.length ? ht(ne, D) : ne, F = (c === "normal" && !s ? H.normalTitleFont : H.titleFont) * E;
  e.font = `bold ${F}px "CardRenderer MTG Beleren", Georgia`, e.letterSpacing = `${H.titleTracking}px`, e.save(), c === "normal" && !s && e.translate(...La(t, "modern")), re(
    e,
    t.name,
    I,
    M + x / 2 + (c === "normal" ? 1 : 0),
    _[0] - I - ($.length ? H.titleGap : 0),
    F,
    !0
  ), e.restore(), e.letterSpacing = "0px", X(
    e,
    t,
    "manaCost",
    () => At(e, ne, D, () => {
      $.forEach(
        (A, z) => te(
          e,
          A,
          le + z * (U + Z),
          M + x / 2 - U / 2 + H.manaLift / 2,
          U,
          r,
          !0,
          D
        )
      );
    })
  );
  const G = V(t), q = r.get(G ?? ""), st = Ge(G), ge = at(t), nt = ro(t), ot = _1(t), Fe = nt && c === "normal", Ue = Fe ? Y8 : 1, Ne = H.setMargin + (Fe ? 2 : 0), [, pt, , bt] = l(d.type), it = pt + bt / 2 + H.typeLift / 2 + (c === "normal" || k ? 2 : 0), ze = q ? Math.min(
    H.setMaxWidth,
    H.setHeight * q.width * ge[2] / (q.height * ge[3])
  ) : 0, Ze = q ? Math.min(
    ze / (q.width * ge[2]),
    H.setHeight / (q.height * ge[3])
  ) : 0, ce = [
    Q - Ne - ze - ze * (Ue - 1) / 2 + (k ? 1.5 : 0),
    it - (q?.height ?? 0) * ge[3] * Ze * Ue / 2 - (Fe ? 1 : 0),
    (q?.width ?? 0) * ge[2] * Ze * Ue,
    (q?.height ?? 0) * ge[3] * Ze * Ue
  ], N = c === "normal" && !s ? Ga(t, G, ce, "component") : ce, oe = ht(N, t.symbolAdjustment?.set), fe = Math.max(
    1,
    Math.min(
      Q - I - (q ? ze * (1 + (Ue - 1) / 2) + Ne + H.typeGap : 0),
      q && oe !== ce ? oe[0] - I - H.typeGap : 1 / 0
    )
  );
  e.font = `${H.typeFont * E}px "CardRenderer MTG Beleren", Georgia`, re(
    e,
    t.typeLine ?? "",
    I + (k ? 1.5 : 0),
    it,
    fe,
    H.typeFont * E,
    !1,
    c === "normal" && !s ? s0.typeWidthScale : 1,
    "CardRenderer MTG Beleren",
    0,
    t.textInk
  ), X(
    e,
    t,
    "setSymbol",
    () => At(e, N, t.symbolAdjustment?.set, () => {
      q && (st || t.setSymbol ? (e.save(), e.shadowColor = "transparent", e.drawImage(q, ...N), e.restore()) : nt ? ao(
        e,
        q,
        t.rarity,
        ...N,
        ge,
        Fe ? 1.5 : 1
      ) : ot ? N1(
        e,
        q,
        ot,
        t.rarity,
        ...N,
        ge,
        c === "normal"
      ) : Ve(
        e,
        q,
        t.setCode,
        t.rarity,
        ...N,
        ge
      ));
    })
  ), Z1(t) ? B8(e, t, r) : c !== "normal" ? _8(e, t, r) : Mn(e, t, r) || ye(e, x1(e, t, a, E), r);
  const pe = bo(t);
  if (pe && c !== "leveler")
    if (f(h.pt, d.stats, "stretch"), c.startsWith("planeswalker"))
      n2(e, pe.text, l(d.stats));
    else {
      const [A, z, ie] = l(d.stats);
      e.fillStyle = "#17140f", e.font = `bold ${H.statsFont}px "CardRenderer MTG Beleren", Georgia`, e.textAlign = "center", e.textBaseline = "middle", Se(
        e,
        pe.text,
        A + ie / 2,
        z + H.statsLine / 2 + (c === "normal" ? 2 : 0),
        ie,
        t.textInk
      );
    }
  s || Pr(e, t);
}
function un(e, t, r, a = J.frame, s = !1, n = 0) {
  const [o, i, l, d] = m4(a), c = n, u = o + c, h = l - 2 * c, m = Math.min(t.height, d * t.width / l), g = m * l / t.width, f = e.getTransform().a, b = () => {
    if (!s) {
      e.drawImage(t, 0, 0, t.width, m, u, i, h, g);
      return;
    }
    const w = 424, p = 436;
    e.save(), e.beginPath(), e.rect(0, 0, j, w), e.rect(0, p, j, T - p), e.clip(), e.drawImage(t, 0, 0, t.width, m, u, i, h, g), e.restore(), e.save(), e.beginPath(), e.rect(0, w, j, p - w), e.clip(), e.drawImage(t, 0, 0, t.width, m, u, i - 1, h, g), e.restore();
  };
  e.save(), e.shadowColor = "black", e.shadowOffsetX = -394e-5 * j * f, e.shadowOffsetY = 394e-5 * j * f, e.shadowBlur = 236e-5 * j * f, b(), r || (e.shadowColor = "#ffffffa0", e.shadowOffsetX = 157e-5 * j * f, e.shadowOffsetY = -315e-5 * j * f, e.shadowBlur = 157e-5 * j * f, b()), e.restore();
}
function m4(e) {
  return [e[0] * j, e[1] * T, e[2] * j, e[3] * T];
}
const g4 = [
  {
    id: "match",
    label: "Match printing",
    family: "match",
    note: "Keep all supplied printing fields."
  },
  {
    id: "lea",
    label: "Alpha",
    family: "retro",
    setCode: "LEA",
    note: "Early black-border printing."
  },
  {
    id: "leb",
    label: "Beta",
    family: "retro",
    setCode: "LEB",
    note: "Early black-border printing."
  },
  {
    id: "2ed",
    label: "Unlimited",
    family: "retro",
    setCode: "2ED",
    note: "Early white-border printing."
  },
  {
    id: "3ed",
    label: "Revised",
    family: "retro",
    setCode: "3ED",
    note: "Revised printing and original mana."
  },
  {
    id: "4ed",
    label: "Fourth Edition",
    family: "retro",
    setCode: "4ED",
    note: "Fourth Edition lettering and credits."
  },
  {
    id: "leg",
    label: "Legends",
    family: "retro",
    setCode: "LEG",
    note: "Legends stock and symbol policy."
  },
  {
    id: "mir",
    label: "Mirage",
    family: "retro",
    setCode: "MIR",
    note: "Mirage lettering, symbols and legal line."
  },
  { id: "7ed", label: "Seventh Edition", family: "retro", setCode: "7ED", note: "Late old frame." },
  {
    id: "8ed",
    label: "Eighth Edition",
    family: "eighth",
    setCode: "8ED",
    note: "Complete Eighth-family plates."
  },
  {
    id: "plc",
    label: "Planar Chaos",
    family: "eighth",
    setCode: "PLC",
    note: "Regular 2007 printing."
  },
  {
    id: "plc-colorshifted",
    label: "Planar Chaos · Colorshifted",
    family: "eighth",
    setCode: "PLC",
    treatment: "colorshifted",
    note: "Monocolored spells and artifacts only."
  },
  {
    id: "fut-regular",
    label: "Future Sight · Regular",
    family: "eighth",
    setCode: "FUT",
    note: "Ordinary printing; the set does not imply Futureshifted."
  },
  {
    id: "fut",
    label: "Future Sight · Futureshifted",
    family: "future",
    setCode: "FUT",
    note: "Shaped frame with curved mana rail."
  },
  {
    id: "m15",
    label: "Magic 2015",
    family: "modern",
    setCode: "M15",
    note: "Modern component frame and footer."
  },
  {
    id: "m21",
    label: "Core Set 2021",
    family: "modern",
    setCode: "M21",
    note: "Modern set-specific printing."
  }
], tr = Object.freeze(
  g4.map((e) => Object.freeze(e))
), K4 = 1;
function co(e, t) {
  if (t.family === "match") return { ...e };
  const {
    frameStyle: r,
    frameTemplate: a,
    frameAssetFamily: s,
    frameTreatment: n,
    futureTreatment: o,
    borderColor: i,
    setSymbol: l,
    symbolAdjustment: d,
    setSymbolSource: c,
    setSymbolMask: u,
    legalText: h,
    collectorFormat: m,
    collectorTotal: g,
    collectorLanguage: f,
    collectorSetCode: b,
    printingElements: w,
    illustrationPlacement: p,
    artPlacement: S,
    ...y
  } = e;
  return {
    ...y,
    ...["transform", "modal_dfc", "reversible_card", "meld"].includes(e.layout ?? "") ? { layout: "normal" } : {},
    setCode: t.setCode,
    symbolStyle: "original",
    colorCalibration: "set-hsb-v1",
    ...t.family === "retro" ? { frameStyle: "retro", securityStamp: "none" } : {},
    ...t.family === "eighth" ? { frameStyle: "modern", frameAssetFamily: "eighth", securityStamp: "none" } : {},
    ...t.family === "modern" ? { frameStyle: "modern", securityStamp: void 0 } : {},
    ...t.family === "future" ? { frameTemplate: "future", securityStamp: "none" } : {},
    ...t.treatment ? { frameTreatment: t.treatment } : {}
  };
}
function uo(e, t) {
  const r = tr.find((s) => s.id === t);
  if (!r) return { supported: !1, reason: "Unknown printing preset." };
  if (r.family === "match") return { supported: !0 };
  if (e.layout === "split" && e.faces?.length === 2)
    return r.family === "future" || r.treatment ? { supported: !1, reason: "This preset has no split-card painter." } : e.faces.some(
      (s) => !/^(Instant|Sorcery)\b/.test(s.canonicalTypeLine ?? s.typeLine ?? "")
    ) ? { supported: !1, reason: "Native split frames require two spell faces." } : { supported: !0 };
  if (e.faces?.length || e.layout && !["normal", "token", "transform", "modal_dfc", "reversible_card", "meld"].includes(
    e.layout
  ) || /\b(Saga|Class|Planeswalker|Battle)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") || /^Level up\b/m.test(e.rulesText ?? ""))
    return {
      supported: !1,
      reason: "This prototype supports ordinary single faces and spell splits; retain the layout-specific painter."
    };
  try {
    r.family === "eighth" && ke(co({ ...e, layout: "normal" }, r));
  } catch (s) {
    return { supported: !1, reason: s.message };
  }
  return { supported: !0 };
}
function Tt(e, t) {
  if (!t || typeof t != "object" || Array.isArray(t) || Object.keys(t).some((o) => !["preset", "overrides", "art"].includes(o)))
    throw Error("Invalid printing selection");
  const r = uo(
    t.overrides?.frameColors === void 0 ? e : { ...e, frameColors: t.overrides.frameColors },
    t.preset
  );
  if (!r.supported) throw Error(r.reason);
  const a = tr.find((o) => o.id === t.preset);
  let s = co(e, a);
  if (t.overrides === null) throw Error("Printing overrides must be an object");
  const n = t.overrides ?? {};
  if (typeof n != "object" || Array.isArray(n))
    throw Error("Printing overrides must be an object");
  if (e.faces?.length && n.elements && Object.keys(n.elements).length)
    throw Error(
      "Element movement/visibility in composite layouts is not implemented in this prototype."
    );
  for (const [o, i] of Object.entries(n))
    if (i !== void 0) {
      if (o === "calibration") {
        pn(i), s.calibration = structuredClone(i);
        continue;
      }
      if (o !== "setSymbolCode") {
        if (o === "styleSetCode") {
          if (typeof i != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(i))
            throw Error("Invalid styling set code");
          s.setCode = i;
          continue;
        }
        if (o === "symbolAdjustment") {
          s.symbolAdjustment = structuredClone(i);
          continue;
        }
        if (o === "frameColors") {
          if (!Array.isArray(i) || i.length > 5 || !i.every((l) => typeof l == "string" && /^[WUBRG]$/.test(l)) || new Set(i).size !== i.length)
            throw Error("Invalid frame colors");
          s.frameColors = [...i];
          continue;
        }
        if (o === "elements") s.printingElements = structuredClone(i);
        else if ([
          "artist",
          "legalText",
          "collectorNumber",
          "collectorTotal",
          "collectorFormat",
          "collectorLanguage",
          "collectorSetCode",
          "setCode",
          "setSymbol",
          "setSymbolMask",
          "symbolStyle",
          "borderColor",
          "securityStamp",
          "futureTreatment"
        ].includes(o))
          Object.assign(s, { [o]: i });
        else throw Error("Unknown printing override: " + o);
      }
    }
  if (n.setSymbolMask !== void 0 && !["auto", "alpha", "ink"].includes(n.setSymbolMask))
    throw Error("Invalid set symbol mask mode");
  if (n.futureTreatment !== void 0 && (!["regular", "full-art", "clear"].includes(n.futureTreatment) || s.frameTemplate !== "future"))
    throw Error("Future treatment requires a Futureshifted frame.");
  if (n.styleSetCode !== void 0 && n.setCode !== void 0)
    throw Error("Choose one styling set code");
  if (n.symbolAdjustment !== void 0) {
    if (s.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
    ma(s);
  }
  for (const [o, i] of Object.entries(n)) {
    if (["artist", "legalText", "collectorNumber", "setSymbol"].includes(o) && i !== null && i !== void 0 && (typeof i != "string" || i.length > (o === "setSymbol" ? 65536 : 2048)))
      throw Error("Invalid printing text override");
    if (o === "setSymbol" && i === "") throw Error("Invalid symbol asset");
  }
  if (s.symbolStyle !== void 0 && !["original", "modern"].includes(s.symbolStyle))
    throw Error("Invalid mana symbol style");
  if (s.borderColor !== void 0 && !["black", "white", "silver"].includes(s.borderColor))
    throw Error("Invalid border color");
  if (n.setSymbolCode !== void 0) {
    if (typeof n.setSymbolCode != "string" || !/^[A-Za-z0-9_-]{1,16}$/.test(n.setSymbolCode))
      throw Error("Invalid symbol set code");
    if (n.setSymbol !== void 0) throw Error("Choose a symbol code or URL, not both.");
    s.setSymbol = V({
      name: s.name,
      setCode: n.setSymbolCode,
      rarity: s.rarity
    });
  }
  if (n.setSymbol === null && (s.printingElements = {
    ...s.printingElements,
    setSymbol: { ...s.printingElements?.setSymbol, hidden: !0 }
  }), n.collectorNumber === null && (s.printingElements = {
    ...s.printingElements,
    collector: { ...s.printingElements?.collector, hidden: !0 }
  }), n.collectorNumber !== void 0 && s.collectorTotal === void 0 && (s.collectorTotal = null), s.collectorFormat !== void 0 && !["number-first", "rarity-first"].includes(s.collectorFormat))
    throw Error("Invalid collector format");
  for (const o of ["setCode", "collectorSetCode"])
    if (s[o] !== void 0 && s[o] !== null && (typeof s[o] != "string" || !/^[A-Za-z0-9_-]{1,16}$/.test(s[o])))
      throw Error("Invalid printing set code");
  if (s.securityStamp !== void 0 && !["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(s.securityStamp))
    throw Error("Invalid security stamp");
  if (s.printingElements && Object.keys(s.printingElements).length && !z0(s).supported)
    throw Error(z0(s).reason);
  if (Cn(s), s.collectorTotal !== void 0 && s.collectorTotal !== null && (!Number.isInteger(s.collectorTotal) || s.collectorTotal < 1 || s.collectorTotal > 99999))
    throw Error("Invalid collector total");
  if (s.collectorLanguage !== void 0 && !/^[A-Za-z]{2,5}$/.test(s.collectorLanguage))
    throw Error("Invalid collector language");
  if (s.frameTemplate === "future" && Nn(s), t.art !== void 0 && (s = s2(s, t.art)), e.layout === "split" && e.faces && (s = {
    ...s,
    faces: e.faces.map(
      (o) => Tt({ ...o, layout: "normal" }, t)
    )
  }), typeof s.calibration == "object" && !Gt(s))
    throw Error("M21 calibration requires a modern frame.");
  return rt(s);
}
function z0(e) {
  return !e.faces?.length && (!e.layout || ["normal", "token"].includes(e.layout)) && (!e.frameTemplate || e.frameTemplate === "future") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(e.canonicalTypeLine ?? e.typeLine ?? "") && !/^Level up\b/m.test(e.rulesText ?? "") ? { supported: !0, elements: ["artist", "legal", "collector", "manaCost", "setSymbol"] } : {
    supported: !1,
    elements: [],
    reason: "Element controls currently require an ordinary single face or Futureshifted template."
  };
}
function f4(e) {
  const t = {
    setCode: e.set?.toUpperCase(),
    symbolStyle: "original"
  };
  return e.frame === "future" ? (t.frameTemplate = "future", e.textless && (t.futureTreatment = "full-art")) : e.frame === "1993" || e.frame === "1997" ? t.frameStyle = "retro" : e.frame === "2003" ? (t.frameStyle = "modern", t.frameAssetFamily = "eighth") : e.frame === "2015" && (t.frameStyle = "modern"), e.frame_effects?.includes("colorshifted") && (t.frameStyle = "modern", t.frameAssetFamily = "eighth", t.frameTreatment = "colorshifted", delete t.frameTemplate, delete t.futureTreatment), ["black", "white", "silver"].includes(e.border_color ?? "") && (t.borderColor = e.border_color), e.security_stamp && ["none", "oval", "triangle", "acorn", "circle", "arena", "heart"].includes(e.security_stamp) ? t.securityStamp = e.security_stamp : t.securityStamp = "none", t;
}
function p4(e) {
  const t = e.rulesParagraphs ? e.rulesParagraphs.flatMap((s) => s.runs.map((n) => n.text)).join(`
`) : e.rulesText ?? "", r = /* @__PURE__ */ new Set([
    ...e.manaSymbols ?? [],
    ...[...t.matchAll(/\{([^}]+)\}/g)].map((s) => s[1])
  ]), a = Ba(e);
  return {
    frame: w3(e) || !!a || me(e) && Ft(e) && On(e).length > 0,
    manaSymbols: [
      .../* @__PURE__ */ new Set([
        ...[...r].filter((s) => !!Hn(e, /^\d+$/.test(s) ? "N" : s)),
        ...a?.glyph ? [a.color] : []
      ])
    ]
  };
}
const hn = (e) => "mask" in e || e.hueDegrees !== 0 || e.saturationScale !== 1 || e.brightnessScale !== 1 || e.rgbScale !== void 0 || e.valueGamma !== void 0;
function b4(e) {
  const t = Da(e), { face: r, materials: a, assets: s } = t, n = Object.entries(a), o = (p) => {
    if (!p.length) return { status: "source", assets: [] };
    const S = p.filter((y) => t.fallbackAssets.includes(y));
    return {
      status: S.length === p.length ? "fallback" : S.length ? "mixed" : "measured",
      ...S.length === p.length ? { profile: "m21-modern", revision: 1 } : S.length ? {} : { profile: `printing:${r.setCode?.toLowerCase() ?? ""}`, revision: 1 },
      assets: p
    };
  }, i = o(
    n.filter(
      ([p, S]) => hn(S) && ("mask" in S || p === s.boxes || p.includes("/pt_boxes/"))
    ).map(([p]) => p)
  ), l = o(
    n.filter(
      ([p, S]) => hn(S) && (p !== s.boxes && !p.includes("/pt_boxes/") || "mask" in S)
    ).map(([p]) => p)
  ), d = p4(r), c = Ba(r), u = c?.frame ?? (me(r) ? e0 : void 0);
  if (u && d.frame)
    for (const p of [l, i])
      Object.assign(p, {
        status: "measured",
        profile: `printing:${r.setCode?.toLowerCase()}`,
        revision: 1,
        assets: [u]
      });
  const h = o(n.filter(([, p]) => p.blackPoint).map(([p]) => p)), g = [.../* @__PURE__ */ new Set([
    ...r.manaSymbols ?? [],
    ...[...(r.rulesText ?? "").matchAll(/\{([^}]+)\}/g)].map((p) => p[1]),
    ...(r.rulesParagraphs ?? []).flatMap(
      (p) => p.runs.flatMap((S) => [...S.text.matchAll(/\{([^}]+)\}/g)].map((y) => y[1]))
    )
  ])].filter(
    (p) => v1(r, /^\d+$/.test(p) ? "N" : p)
  ), f = g.length ? {
    status: "measured",
    profile: `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: 1,
    assets: [],
    symbols: g
  } : c?.glyph ? { status: "measured", profile: "printing:8ed", revision: 1, assets: [c.glyph] } : { status: "source", assets: [] }, b = t.border ? {
    status: t.fallbackStock ? "fallback" : "measured",
    profile: t.fallbackStock ? "m21-modern" : `printing:${r.setCode?.toLowerCase() ?? ""}`,
    revision: 1,
    color: t.border,
    assets: n.filter(([, p]) => p.outerStock).map(([p]) => p)
  } : { status: "source", assets: [] }, w = [];
  return (t.fallbackStock || t.fallbackAssets.length) && w.push(
    "Using provisional M21 defaults for compatible materials; this is not a measured calibration of this printing."
  ), (r.calibration === "auto" || typeof r.calibration == "object") && [l, i, h].some((p) => p.status === "source") && w.push("Some frame materials retain source colors or ink levels."), {
    mode: r.calibration ?? "legacy",
    components: { frame: l, textBox: i, border: b, interiorInk: h, manaSymbols: f },
    notices: w
  };
}
function V4(e) {
  return fn.map((t) => ({
    ...t,
    supported: Gt(e),
    ...Gt(e) ? {} : { reason: "Requires a modern frame." }
  }));
}
const S4 = /^[a-z0-9][a-z0-9-]{0,47}$/;
function ue(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e) || ![Object.prototype, null].includes(Object.getPrototypeOf(e)))
    throw Error("Invalid " + t);
}
function he(e, t, r) {
  if (Object.keys(e).some((a) => !t.includes(a)))
    throw Error("Unknown " + r + " field");
}
function D0(e) {
  if (typeof e != "string" || !S4.test(e)) throw Error("Invalid printing style ID");
}
const w4 = [
  "calibration",
  "artist",
  "legalText",
  "collectorNumber",
  "collectorTotal",
  "collectorFormat",
  "collectorLanguage",
  "collectorSetCode",
  "setCode",
  "styleSetCode",
  "setSymbol",
  "setSymbolCode",
  "setSymbolMask",
  "symbolStyle",
  "borderColor",
  "securityStamp",
  "frameColors",
  "futureTreatment",
  "symbolAdjustment",
  "elements"
];
function r0(e) {
  if (ue(e, "printing layer"), he(e, ["overrides", "art"], "printing layer"), e.overrides !== void 0) {
    if (ue(e.overrides, "printing overrides"), he(e.overrides, w4, "printing override"), e.overrides.elements !== void 0) {
      ue(e.overrides.elements, "printing elements"), he(
        e.overrides.elements,
        ["artist", "legal", "collector", "manaCost", "setSymbol"],
        "printing element"
      );
      for (const t of Object.values(e.overrides.elements))
        ue(t, "printing element"), he(t, ["hidden", "offset"], "printing element");
    }
    if (e.overrides.symbolAdjustment !== void 0) {
      ue(e.overrides.symbolAdjustment, "symbol adjustment"), he(e.overrides.symbolAdjustment, ["mana", "set"], "symbol adjustment");
      for (const [t, r] of Object.entries(e.overrides.symbolAdjustment))
        if (ue(r, "symbol transform"), he(
          r,
          t === "set" ? ["dx", "dy", "scaleX", "scaleY"] : [
            "dx",
            "dy",
            "scaleX",
            "scaleY",
            "spacing",
            "numberScale",
            "numberDx",
            "numberDy",
            "glyphs"
          ],
          "symbol transform"
        ), r.glyphs !== void 0) {
          ue(r.glyphs, "mana glyphs"), he(r.glyphs, ["W", "U", "B", "R", "G"], "mana glyph");
          for (const a of Object.values(r.glyphs))
            ue(a, "mana glyph"), he(a, ["scale", "dx", "dy"], "mana glyph");
        }
    }
  }
  if (e.art !== void 0 && (ue(e.art, "art placement"), he(e.art, ["mode", "zoom", "focalPoint", "paperOpacity"], "art placement")), e.overrides?.futureTreatment !== void 0 && !["regular", "full-art", "clear"].includes(e.overrides.futureTreatment))
    throw Error("Invalid future treatment");
  Tt(
    { name: "Style validation", typeLine: "Creature", colors: ["U"] },
    {
      preset: "match",
      ...e.overrides ? {
        overrides: Object.fromEntries(
          Object.entries(e.overrides).filter(
            ([t]) => t !== "futureTreatment"
          )
        )
      } : {}
    }
  ), e.art && Tt(
    { name: "Art validation", typeLine: "Creature", colors: ["U"], frameTemplate: "future" },
    { preset: "match", art: { mode: "behind-text", ...e.art } }
  );
}
function ho(e) {
  if (ue(e, "printing style"), he(
    e,
    [
      "version",
      "id",
      "label",
      "defaults",
      "collectorSetCode",
      "symbols",
      "defaultFrame",
      "frames",
      "rules"
    ],
    "printing style"
  ), e.version !== 1) throw Error("Unsupported printing style version");
  if (D0(e.id), typeof e.label != "string" || !e.label.trim() || e.label.length > 160)
    throw Error("Invalid printing style label");
  if (e.collectorSetCode !== void 0 && (typeof e.collectorSetCode != "string" || !/^[-A-Za-z0-9_]{1,16}$/.test(e.collectorSetCode)))
    throw Error("Invalid collector set code");
  if (e.defaults !== void 0 && r0(e.defaults), !Array.isArray(e.frames) || !e.frames.length || e.frames.length > 64)
    throw Error("A printing style needs 1..64 frame options");
  const t = /* @__PURE__ */ new Set();
  for (const r of e.frames) {
    if (ue(r, "frame option"), he(r, ["id", "label", "selection"], "frame option"), D0(r.id), t.has(r.id)) throw Error("Duplicate frame option");
    if (t.add(r.id), typeof r.label != "string" || !r.label.trim() || r.label.length > 160)
      throw Error("Invalid frame label");
    if (ue(r.selection, "frame selection"), he(r.selection, ["preset", "overrides", "art"], "frame selection"), !tr.some((n) => n.id === r.selection.preset))
      throw Error("Unknown frame preset");
    const { preset: a, ...s } = r.selection;
    r0(s);
  }
  if (!t.has(e.defaultFrame)) throw Error("Unknown default frame");
  if (e.symbols !== void 0) {
    ue(e.symbols, "symbol pack"), he(
      e.symbols,
      ["default", "common", "uncommon", "rare", "mythic", "special"],
      "symbol pack"
    );
    for (const r of Object.values(e.symbols))
      if (r !== null && (typeof r != "string" || !r || r.length > 65536))
        throw Error("Invalid symbol asset");
  }
  if (e.rules !== void 0) {
    if (!Array.isArray(e.rules) || e.rules.length > 128) throw Error("Invalid frame rules");
    const r = /* @__PURE__ */ new Set();
    for (const a of e.rules) {
      if (ue(a, "frame rule"), he(a, ["id", "when", "frame", "defaults"], "frame rule"), D0(a.id), r.has(a.id)) throw Error("Duplicate frame rule");
      if (r.add(a.id), !t.has(a.frame)) throw Error("Unknown rule frame");
      if (ue(a.when, "frame condition"), he(
        a.when,
        [
          "colors",
          "colorSource",
          "colorCount",
          "types",
          "layouts",
          "templates",
          "treatments",
          "rarities",
          "artifact",
          "land",
          "legendary"
        ],
        "frame condition"
      ), a.when.colors !== void 0 && (!Array.isArray(a.when.colors) || a.when.colors.length > 5 || !a.when.colors.every((s) => typeof s == "string" && /^[WUBRG]$/.test(s)) || new Set(a.when.colors).size !== a.when.colors.length))
        throw Error("Invalid rule colors");
      if (a.when.colorSource !== void 0 && !["printing", "card"].includes(a.when.colorSource))
        throw Error("Invalid rule color source");
      if (a.when.colorCount !== void 0 && (!Array.isArray(a.when.colorCount) || a.when.colorCount.length !== 2 || !a.when.colorCount.every((s) => Number.isInteger(s) && s >= 0 && s <= 5) || a.when.colorCount[0] > a.when.colorCount[1]))
        throw Error("Invalid color count");
      for (const s of ["types", "layouts", "templates", "treatments", "rarities"])
        if (a.when[s] !== void 0 && (!Array.isArray(a.when[s]) || !a.when[s].length || a.when[s].length > 32 || !a.when[s].every(
          (n) => typeof n == "string" && /^[-a-zA-Z0-9_]{1,48}$/.test(n)
        )))
          throw Error("Invalid rule " + s);
      for (const s of ["artifact", "land", "legendary"])
        if (a.when[s] !== void 0 && typeof a.when[s] != "boolean")
          throw Error("Invalid rule trait");
      a.defaults !== void 0 && r0(a.defaults);
    }
  }
  return structuredClone(e);
}
function y4(e) {
  ue(e, "printing style choice"), he(e, ["frame", "overrides", "art"], "printing style choice");
  const { frame: t, ...r } = e;
  t !== void 0 && D0(t), r0(r);
}
const Z4 = 1;
function Y0(e) {
  return Array.isArray(e) ? e.map(Y0) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).filter(([, t]) => t !== void 0).map(([t, r]) => [t, Y0(r)])
  ) : e;
}
function k4(e, ...t) {
  const r = structuredClone(e);
  for (const a of t) {
    if (r0(a), a.art && (r.art = { mode: "window", ...r.art, ...Y0(structuredClone(a.art)) }), !a.overrides) continue;
    const s = r.overrides || {}, n = Y0(structuredClone(a.overrides)), o = { ...s, ...n };
    if (n.elements) {
      o.elements = structuredClone(s.elements || {});
      for (const i of Object.keys(n.elements))
        o.elements[i] = { ...o.elements[i], ...n.elements[i] };
    }
    if (n.symbolAdjustment) {
      o.symbolAdjustment = { ...s.symbolAdjustment, ...n.symbolAdjustment };
      for (const i of ["mana", "set"])
        n.symbolAdjustment[i] && (o.symbolAdjustment[i] = {
          ...s.symbolAdjustment?.[i],
          ...n.symbolAdjustment[i]
        });
      if (n.symbolAdjustment.mana?.glyphs) {
        o.symbolAdjustment.mana.glyphs = { ...s.symbolAdjustment?.mana?.glyphs };
        for (const i of Object.keys(n.symbolAdjustment.mana.glyphs))
          o.symbolAdjustment.mana.glyphs[i] = {
            ...s.symbolAdjustment?.mana?.glyphs?.[i],
            ...n.symbolAdjustment.mana.glyphs[i]
          };
      }
    }
    Object.hasOwn(n, "setSymbol") && delete o.setSymbolCode, Object.hasOwn(n, "setSymbolCode") && delete o.setSymbol, Object.hasOwn(n, "styleSetCode") && delete o.setCode, Object.hasOwn(n, "setCode") && delete o.styleSetCode, r.overrides = o;
  }
  return r;
}
function v4(e, t) {
  const r = e.faces?.length ? e.faces : [e], a = A0(
    r.flatMap(
      (o) => t.colorSource === "card" ? [...o.colors || []] : L({ ...o, frameColors: void 0 })
    )
  );
  if (t.colors && A0(t.colors).join("") !== a.join("") || t.colorCount && (a.length < t.colorCount[0] || a.length > t.colorCount[1]))
    return !1;
  const s = O(e);
  for (const o of ["artifact", "land", "legendary"])
    if (t[o] !== void 0 && t[o] !== s[o]) return !1;
  const n = (e.canonicalTypeLine ?? e.typeLine ?? "").split(/[—–]/)[0].split(/\s+/).map((o) => o.toLowerCase());
  for (const [o, i] of [
    ["creature", "creature"],
    ["artifact", "artifact"],
    ["land", "land"],
    ["legendary", "legendary"]
  ])
    s[o] && !n.includes(i) && n.push(i);
  if (t.types && !t.types.some((o) => n.includes(o.toLowerCase())))
    return !1;
  for (const [o, i] of [
    ["layouts", e.layout || "normal"],
    ["templates", e.frameTemplate || "normal"],
    ["treatments", e.futureTreatment || e.frameTreatment || "regular"],
    ["rarities", e.rarity || "common"]
  ]) {
    const l = t[o];
    if (l && !l.includes(i)) return !1;
  }
  return !0;
}
function j4(e, t) {
  const r = {};
  if (e.collectorSetCode !== void 0 && (r.collectorSetCode = e.collectorSetCode), e.symbols) {
    const a = t.rarity || "common", s = Object.hasOwn(e.symbols, a) ? e.symbols[a] : e.symbols.default, n = Object.hasOwn(e.symbols, a) && e.symbols[a] === null;
    (n || s !== void 0) && (r.setSymbol = n ? null : s);
  }
  return { overrides: r };
}
function Q4(e, t, r = {}, a = {}) {
  const s = go.includes(t) ? t : ho(t);
  return s.frames.map((n) => {
    try {
      const o = R4(e, s, r, { ...a, frame: n.id });
      return {
        id: n.id,
        label: n.label,
        supported: !0,
        notices: o.notices,
        calibration: o.calibration
      };
    } catch (o) {
      return {
        id: n.id,
        label: n.label,
        supported: !1,
        reason: o.message
      };
    }
  });
}
function C4(e, t) {
  return t === void 0 ? e : {
    ...e,
    frameColors: t,
    ...e.faces ? { faces: e.faces.map((r) => ({ ...r, frameColors: t })) } : {}
  };
}
function R4(e, t, r = {}, a = {}) {
  const s = go.includes(t) ? t : ho(t);
  for (const k of [r, a])
    if (y4(k), k.frame !== void 0 && !s.frames.some((v) => v.id === k.frame))
      throw Error("Unknown chosen frame");
  const { frame: n, ...o } = r, { frame: i, ...l } = a, d = i ?? n, c = s.rules?.find((k) => v4(e, k.when));
  let u = i !== void 0 ? "face" : n !== void 0 ? "card" : c ? "rule" : "default", h = s.frames.find((k) => k.id === (d ?? c?.frame ?? s.defaultFrame));
  const m = [], g = (k, v = k.selection.preset) => k4(
    { ...k.selection, preset: v },
    s.defaults || {},
    j4(s, e),
    c?.defaults || {},
    o,
    l
  );
  let f = g(h);
  const b = (k) => {
    const v = g(k), C = uo(
      C4(e, v.overrides?.frameColors),
      v.preset
    );
    if (!C.supported) return C;
    try {
      return Tt(e, {
        preset: v.preset,
        overrides: Object.fromEntries(
          Object.entries(v.overrides || {}).filter(
            ([M]) => !["elements", "symbolAdjustment"].includes(M)
          )
        )
      }), C;
    } catch (M) {
      return { supported: !1, reason: M.message };
    }
  }, w = b(h);
  if (!w.supported) {
    if (d !== void 0) throw Error(w.reason);
    u = "fallback";
    const k = s.frames.find((v) => v.id === s.defaultFrame);
    k.id !== h.id && b(k).supported ? (h = k, f = g(h), m.push("Automatic frame is unsupported; using the default frame. " + w.reason)) : (f = g(h, "match"), m.push("Keeping the native layout. " + w.reason));
  }
  const p = Tt(e, {
    preset: f.preset,
    overrides: Object.fromEntries(
      Object.entries(f.overrides || {}).filter(
        ([k]) => !["elements", "symbolAdjustment", "futureTreatment"].includes(k)
      )
    )
  });
  if (f.overrides?.futureTreatment !== void 0)
    if (p.frameTemplate !== "future") {
      if (r.overrides?.futureTreatment || a.overrides?.futureTreatment)
        throw Error("Future treatment requires a Futureshifted frame.");
      delete f.overrides.futureTreatment, m.push("Inherited Future treatment is unavailable for this layout.");
    } else p.futureTreatment = f.overrides.futureTreatment;
  if (f.overrides?.elements && !z0(p).supported) {
    if (r.overrides?.elements || a.overrides?.elements)
      throw Error(z0(p).reason);
    delete f.overrides.elements, m.push("Inherited element positioning is unavailable for this layout.");
  }
  if (f.overrides?.symbolAdjustment)
    try {
      if (p.frameTemplate) throw Error("Fine symbol adjustments require an ordinary frame.");
      ma({
        ...p,
        symbolAdjustment: f.overrides.symbolAdjustment
      });
    } catch (k) {
      if (r.overrides?.symbolAdjustment || a.overrides?.symbolAdjustment) throw k;
      delete f.overrides.symbolAdjustment, m.push("Inherited symbol adjustments are unavailable for this layout.");
    }
  if (f.art && !j1(p).modes.includes(f.art.mode)) {
    if (r.art || a.art)
      throw Error("This frame does not support the selected art placement.");
    delete f.art, m.push("Inherited artwork placement is unavailable for this frame.");
  }
  f = structuredClone(f);
  const S = Tt(e, f), y = b4(S);
  return {
    face: S,
    calibration: y,
    selection: f,
    frame: h.id,
    frameSource: u,
    ...c ? { rule: c.id } : {},
    notices: [...m, ...y.notices]
  };
}
function mo(e) {
  if (e && typeof e == "object") {
    for (const t of Object.values(e)) mo(t);
    Object.freeze(e);
  }
  return e;
}
const go = Object.freeze(
  tr.filter((e) => !["plc-colorshifted", "fut"].includes(e.id)).map((e) => {
    const t = [
      {
        id: "regular",
        label: e.id === "fut-regular" ? "Regular" : e.label,
        selection: { preset: e.id }
      }
    ], r = [];
    if (e.id === "plc" && t.push({
      id: "colorshifted",
      label: "Colorshifted",
      selection: { preset: "plc-colorshifted" }
    }), e.id === "fut-regular") {
      t.push({ id: "futureshifted", label: "Futureshifted", selection: { preset: "fut" } });
      for (const [a, s] of [
        ["full-art", "Futureshifted · Full art"],
        ["clear", "Futureshifted · Clear"]
      ])
        t.push({
          id: a,
          label: s,
          selection: { preset: "fut", overrides: { futureTreatment: a } }
        }), r.push({
          id: "existing-" + a,
          when: { templates: ["future"], treatments: [a] },
          frame: a
        });
      r.push({
        id: "existing-futureshifted",
        when: { templates: ["future"] },
        frame: "futureshifted"
      });
    }
    return e.id === "plc" && r.push({
      id: "existing-colorshifted",
      when: { treatments: ["colorshifted"] },
      frame: "colorshifted"
    }), mo({
      version: 1,
      id: e.id === "fut-regular" ? "fut" : e.id,
      label: e.id === "fut-regular" ? "Future Sight" : e.label,
      defaultFrame: "regular",
      frames: t,
      ...r.length ? { rules: r } : {}
    });
  })
);
function I0(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    throw Error("Expected a card object.");
  return e;
}
function P(e, t = "", r = 32768) {
  if (e == null) return t;
  if (typeof e != "string" || e.length > r) throw Error("Invalid card text.");
  return e;
}
function mn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.length > 5 || !e.every((t) => typeof t == "string" && /^[WUBRG]$/.test(t)))
    throw Error("Invalid card colors.");
  return [...new Set(e)];
}
function M4(e) {
  const t = P(e, "", 200);
  if (!/^(?:\{[0-9A-Z/∞]+\}\s*)*$/.test(t)) throw Error("Invalid mana cost.");
  return [...t.matchAll(/\{([^}]+)\}/g)].map((r) => r[1]);
}
function x4(e) {
  if (e == null) return null;
  const t = P(e, "", 4096), r = new URL(t);
  if (r.protocol !== "https:" || r.username || r.password)
    throw Error("Provider artwork requires an HTTPS URL.");
  return r.href;
}
function gn(e, t = "") {
  return [
    ...e.split(`
`).filter(Boolean).map((r) => ({
      role: "rules",
      runs: r.split(/(\([^)]*\))/g).filter(Boolean).map((a) => ({ text: a, ...a.startsWith("(") ? { italic: !0 } : {} }))
    })),
    ...t.split(`
`).filter(Boolean).map((r) => ({
      role: "flavor",
      runs: r.split("*").map((a, s) => ({ text: a, italic: s % 2 === 0 })).filter((a) => a.text)
    }))
  ];
}
function T4(e, t, r, a) {
  const s = a.wording ?? "oracle";
  if (!["oracle", "original"].includes(s)) throw Error("Invalid wording choice.");
  if (a.symbolStyle !== void 0 && !["original", "modern"].includes(a.symbolStyle))
    throw Error("Invalid symbol style.");
  const n = {
    ...r ?? t,
    manaSymbols: B1(e, t.manaSymbols ?? [])
  };
  return K2(e, { oracle: t, original: n }, s, {
    symbolStyle: a.symbolStyle ?? "original"
  });
}
function fo(e, t, r, a = null) {
  if (!e.length || e.length > 2) throw Error("Supply one card with at most two faces.");
  if (r.illustrations !== void 0 && (!Array.isArray(r.illustrations) || r.illustrations.length !== e.length || !r.illustrations.every(
    (n) => n === null || typeof n == "string" && n.length <= 4096
  )))
    throw Error("Invalid illustration overrides.");
  r.illustrations && (a = null), e = e.map((n, o) => ({
    ...n,
    ...r.illustrations?.[o] !== void 0 ? { illustration: r.illustrations[o] } : {}
  }));
  const s = r.faceIndex ?? 0;
  if (!Number.isInteger(s) || s < 0 || s >= e.length)
    throw Error("This card does not have that face.");
  if (r.faceIndex !== void 0 || e.length === 1 || ["transform", "modal_dfc", "reversible_card", "meld", "double_faced_token"].includes(t)) {
    const n = e[s];
    return {
      ...n,
      ...s > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(t) ? { securityStamp: "none" } : {},
      illustration: n.illustration ?? a,
      ...t === "battle" && s === 0 ? { frameTemplate: "battle", frameAssetFamily: void 0 } : {}
    };
  }
  if (!["split", "aftermath", "flip", "adventure", "prepare", "room", "battle"].includes(t))
    throw Error("Unsupported multiple-face layout: " + t);
  return t === "battle" ? {
    ...e[s],
    frameTemplate: s === 0 ? "battle" : void 0,
    frameAssetFamily: void 0
  } : {
    ...e[0],
    layout: t === "room" ? "split" : t,
    faces: e,
    illustration: a,
    ...["adventure", "prepare", "room"].includes(t) ? { frameAssetFamily: void 0 } : {},
    ...t === "flip" ? { frameTemplate: "flip", frameAssetFamily: void 0 } : {}
  };
}
function D4(e, t = {}) {
  const r = I0(e), a = P(r.name, "", 256);
  if (!a.trim()) throw Error("The Scryfall card needs a name.");
  const s = r.card_faces === void 0 ? [r] : r.card_faces;
  if (!Array.isArray(s) || !s.length || s.length > 2)
    throw Error("Supply one Scryfall card with at most two faces.");
  const n = f4({
    set: P(r.set),
    frame: P(r.frame),
    frame_effects: r.frame_effects === void 0 ? void 0 : I4(r.frame_effects),
    border_color: P(r.border_color),
    security_stamp: P(r.security_stamp),
    textless: r.textless === !0
  }), o = (u) => u.image_uris ? x4(I0(u.image_uris).art_crop) : null, l = ["common", "uncommon", "rare", "mythic", "special", "bonus"].find((u) => u === (r.rarity ?? "common"));
  if (!l) throw Error("Invalid card rarity.");
  const d = s.map((u, h) => {
    const m = I0(u), g = P(m.type_line, P(r.type_line), 512);
    if (!g.trim()) throw Error("The Scryfall face needs a type line.");
    const f = P(m.oracle_text), b = M4(m.mana_cost), w = mn(
      m.colors ?? m.color_indicator ?? (s.length === 1 ? r.colors : [..."WUBRG"].filter(
        (v) => b.some((C) => C.split("/").includes(v)) && (r.colors == null || mn(r.colors).includes(v))
      ))
    ), p = H2(
      g,
      w,
      n.setCode,
      P(r.frame),
      m.produced_mana ?? r.produced_mana
    ), S = {
      name: P(m.name, a, 256),
      typeLine: g,
      rulesText: f,
      manaSymbols: b,
      rulesParagraphs: gn(f, P(m.flavor_text))
    }, k = typeof m.printed_text == "string" || typeof m.printed_type_line == "string" || typeof m.printed_name == "string" ? {
      ...S,
      name: P(m.printed_name, S.name, 256),
      typeLine: P(m.printed_type_line, g, 512),
      rulesText: P(m.printed_text, f),
      rulesParagraphs: gn(
        P(m.printed_text, f),
        P(m.flavor_text)
      )
    } : void 0;
    return T4(
      {
        ...J2(n, g, f),
        ...h > 0 && ["transform", "modal_dfc", "battle", "double_faced_token"].includes(String(r.layout)) ? { securityStamp: "none" } : {},
        name: S.name,
        colors: w,
        ...p ? { frameColors: p } : {},
        rarity: l,
        artist: P(m.artist, P(r.artist), 256),
        collectorNumber: P(r.collector_number, "", 64),
        ...typeof r.lang == "string" && /^[a-z]{2,5}$/i.test(r.lang) ? { collectorLanguage: r.lang } : {},
        ...m.watermark == null && r.watermark == null ? {} : { watermark: P(m.watermark ?? r.watermark, "", 64) },
        power: m.power == null ? void 0 : P(m.power),
        toughness: m.toughness == null ? void 0 : P(m.toughness),
        loyalty: m.loyalty == null ? void 0 : P(m.loyalty),
        defense: m.defense == null ? void 0 : P(m.defense),
        illustration: o(m),
        colorCalibration: "set-hsb-v1"
      },
      S,
      k,
      t
    );
  });
  let c = P(r.layout, "normal", 64);
  if (s.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(c))
    throw Error("Supply both Scryfall faces for this layout.");
  return c === "split" && /\bAftermath\b/.test(d[1]?.rulesText ?? "") && (c = "aftermath"), fo(d, c, t, s.length > 1 ? o(r) : null);
}
function I4(e) {
  if (!Array.isArray(e) || e.length > 32) throw Error("Invalid frame effects.");
  return e.map((t) => P(t, "", 64));
}
function E4(e, t) {
  const r = e.map((o) => ({ type: o.originalType, text: o.originalText }));
  if (e.length !== 2 || !["split", "aftermath", "adventure", "prepare", "flip"].includes(t))
    return r;
  const a = (o) => P(o).replace(/\r\n?/g, `
`), s = e.map((o) => a(o.originalText));
  if (t === "flip") {
    if (!s.some((c) => /\n-{3,}\n/.test(c))) return r;
    const o = s[0].split(/\n-{3,}\n/), i = o[1]?.split(`
`);
    if (s[0] !== s[1] || o.length !== 2 || !i || i[0] !== e[1].faceName || !i[1] || !/^\S+\/\S+$/.test(i[2] ?? "") || i.length < 4)
      throw Error("Ambiguous joined MTGJSON original flip text.");
    const l = (c) => a(c).replace(/[—–-]/g, " ").replace(/\s+/g, " ").trim(), d = [e[1].originalType, e[1].type].find(
      (c) => typeof c == "string" && l(c) === l(i[1])
    ) ?? i[1];
    return [
      { type: r[0].type, text: o[0] },
      { type: d, text: i.slice(3).join(`
`) }
    ];
  }
  if (!s.some((o) => /\s+\/\/\s+/.test(o))) return r;
  const n = s[0].split(/\s+\/\/\s+/);
  if (s[0] !== s[1] || n.length !== 2)
    throw Error("Ambiguous joined MTGJSON original panel text.");
  return e.map((o, i) => {
    const l = t === "adventure" ? 1 - i : i;
    let d = n[l].trim();
    const c = [o.faceName ?? o.name, o.manaCost, o.originalType];
    if (l === 1 && c.every((b) => typeof b == "string")) {
      const b = c.join(`
`) + `
`;
      d.startsWith(b) && (d = d.slice(b.length));
    }
    const u = P(o.originalType);
    l === 1 && u && d.startsWith(u + `
`) && (d = d.slice(u.length + 1));
    const h = P(o.type), m = e[0].originalType === e[1].originalType, g = /^(Instant|Sorcery)$/.test(u) && /^(Instant|Sorcery)$/.test(h), f = t === "adventure" && /^(Instant|Sorcery)\s*[—–-]\s*Adventure$/.test(h);
    return { text: d, type: m && (g || f) ? h : o.originalType };
  });
}
function e6(e, t = {}) {
  const r = (Array.isArray(e) ? e : [e]).map(I0), a = [...r];
  if (!r.length || r.length > 2)
    throw Error("Supply the associated records of one MTGJSON card.");
  if (t.illustrations !== void 0 && (!Array.isArray(t.illustrations) || t.illustrations.length !== r.length))
    throw Error("Supply one illustration override per input record.");
  if (r.length > 1) {
    const [d, c] = r;
    if (d.uuid !== void 0 && d.uuid === c.uuid || d.side !== void 0 && d.side === c.side || d.layout !== c.layout)
      throw Error("Supply two distinct associated MTGJSON faces with the same layout.");
    const u = (f, b) => typeof b.uuid == "string" && Array.isArray(f.otherFaceIds) && f.otherFaceIds.includes(b.uuid), h = u(d, c) || u(c, d), m = [d.uuid, c.uuid, d.otherFaceIds, c.otherFaceIds].some(
      (f) => f !== void 0
    ), g = d.name === c.name && typeof d.faceName == "string" && typeof c.faceName == "string" && d.faceName !== c.faceName;
    if ((m ? !h : !g) || d.setCode !== void 0 && c.setCode !== void 0 && d.setCode !== c.setCode || d.number !== void 0 && c.number !== void 0 && P(d.number).replace(/[ab]$/, "") !== P(c.number).replace(/[ab]$/, "") || [
      [d, c],
      [c, d]
    ].some(([f, b]) => Array.isArray(f.otherFaceIds) && !f.otherFaceIds.includes(b.uuid)))
      throw Error("The MTGJSON records are not associated faces of one card.");
    r.every((f) => typeof f.side == "string") && r.sort((f, b) => P(f.side).localeCompare(P(b.side)));
  }
  const s = r[0], n = P(s.layout, "normal", 64);
  if (r.length === 1 && ["split", "aftermath", "flip", "adventure", "prepare", "room"].includes(n))
    throw Error("Supply both MTGJSON face records for this layout.");
  const o = t.wording === "original" ? E4(r, n) : void 0, i = r.map((d, c) => ({
    name: d.faceName ?? d.name,
    type_line: d.type,
    oracle_text: d.text ?? "",
    mana_cost: d.manaCost ?? "",
    colors: d.colors,
    produced_mana: X2(P(d.text)),
    watermark: d.watermark,
    power: d.power,
    toughness: d.toughness,
    loyalty: d.loyalty,
    defense: d.defense,
    artist: d.artist,
    flavor_text: d.flavorText,
    printed_type_line: o?.[c]?.type ?? d.originalType,
    printed_text: o?.[c]?.text ?? d.originalText
  })), l = r.map(
    (d, c) => D4(
      {
        ...i[c],
        set: d.setCode,
        rarity: d.rarity,
        collector_number: d.number,
        frame: d.frameVersion,
        frame_effects: d.frameEffects,
        border_color: d.borderColor,
        security_stamp: d.securityStamp,
        textless: d.isTextless
      },
      { wording: t.wording, symbolStyle: t.symbolStyle }
    )
  );
  return fo(l, n, {
    ...t,
    ...t.illustrations ? { illustrations: r.map((d) => t.illustrations[a.indexOf(d)]) } : {}
  });
}
export {
  Te as $,
  H as A,
  j1 as B,
  k4 as C,
  e6 as D,
  D4 as E,
  J as F,
  It as G,
  L4 as H,
  V4 as I,
  fn as J,
  z0 as K,
  K4 as L,
  uo as M,
  tr as N,
  Z4 as O,
  Kn as P,
  Q4 as Q,
  go as R,
  N4 as S,
  gt as T,
  s2 as U,
  O as V,
  L as W,
  b4 as X,
  Tt as Y,
  R4 as Z,
  f4 as _,
  h0 as a,
  A0 as a$,
  ta as a0,
  jn as a1,
  Ea as a2,
  pn as a3,
  ho as a4,
  K2 as a5,
  x8 as a6,
  kn as a7,
  ks as a8,
  V1 as a9,
  Ie as aA,
  p4 as aB,
  n0 as aC,
  xe as aD,
  a2 as aE,
  a4 as aF,
  F4 as aG,
  vo as aH,
  E8 as aI,
  er as aJ,
  A8 as aK,
  q4 as aL,
  h4 as aM,
  yo as aN,
  $e as aO,
  V as aP,
  bo as aQ,
  e4 as aR,
  ke as aS,
  Ii as aT,
  Z1 as aU,
  O0 as aV,
  H4 as aW,
  W as aX,
  sn as aY,
  no as aZ,
  T8 as a_,
  s4 as aa,
  wo as ab,
  So as ac,
  T as ad,
  G4 as ae,
  j as af,
  ps as ag,
  _o as ah,
  ts as ai,
  R0 as aj,
  be as ak,
  c4 as al,
  Dt as am,
  wi as an,
  Et as ao,
  Si as ap,
  Ci as aq,
  P0 as ar,
  d1 as as,
  Oe as at,
  u1 as au,
  Qe as av,
  fa as aw,
  W4 as ax,
  ht as ay,
  oo as az,
  ft as b,
  x1 as b0,
  u4 as b1,
  At as b2,
  lo as b3,
  dn as b4,
  l4 as b5,
  B8 as b6,
  re as b7,
  Le as b8,
  te as b9,
  Q1 as bA,
  ko as bB,
  Wr as bC,
  $4 as bD,
  ga as bE,
  v5 as bF,
  eo as bG,
  at as bH,
  Yo as bI,
  r4 as bJ,
  R3 as bK,
  W8 as bL,
  H3 as bM,
  m0 as bN,
  Ta as bO,
  Z3 as bP,
  I3 as bQ,
  pa as bR,
  E3 as bS,
  q0 as bT,
  rs as bU,
  ma as bV,
  zt as bW,
  F8 as ba,
  M8 as bb,
  Jn as bc,
  ye as bd,
  Ve as be,
  _8 as bf,
  U4 as bg,
  y1 as bh,
  m4 as bi,
  $8 as bj,
  P8 as bk,
  P4 as bl,
  Ri as bm,
  aa as bn,
  Ae as bo,
  ra as bp,
  ea as bq,
  He as br,
  ji as bs,
  X0 as bt,
  Ja as bu,
  Re as bv,
  O4 as bw,
  Un as bx,
  vi as by,
  g8 as bz,
  ae as c,
  $t as d,
  Ia as e,
  ee as f,
  Be as g,
  We as h,
  V0 as i,
  N3 as j,
  bl as k,
  J4 as l,
  ut as m,
  Pe as n,
  Ho as o,
  cs as p,
  X4 as q,
  Y4 as r,
  De as s,
  z4 as t,
  n4 as u,
  x0 as v,
  _4 as w,
  Z8 as x,
  t4 as y,
  Q8 as z
};
