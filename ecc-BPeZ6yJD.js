const c = {
  set: "ecc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ecc/component/black": [-3, -1.5, 0.92, 0.92],
      "ecc/m15-accurate/black": [-3, 0, 1.04, 1.12]
    },
    MAJOR_FRAME_INSETS: { "ecc/black": 1 }
  }
};
export {
  c as default
};
