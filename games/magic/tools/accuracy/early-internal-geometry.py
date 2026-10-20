#!/usr/bin/env python3
"""Measure shared old-frame apertures on frozen independent scan poses.

Requires numpy, Pillow and scipy. Native capture and family-study directories
contain external rasters; output contains numerical evidence and diagnostics.
Only predeclared calibration scans fit transforms. Validation scans do not fit.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter1d

SCALE = 1.5
MATERIALS = ("W", "U", "B", "R", "G", "A")
ART_WINDOWS = {
    "left": ("x", 46, 72, 125, 325, False),
    "right": ("x", 414, 442, 125, 325, True),
    "top": ("y", 62, 83, 110, 385, False),
    "bottom": ("y", 354, 383, 110, 385, True),
}
PAPER_WINDOWS = {
    "left": ("x", 48, 82, 445, 580, False),
    "right": ("x", 405, 447, 445, 580, True),
    "top": ("y", 397, 428, 105, 385, False),
    "bottom": ("y", 587, 617, 105, 385, True),
}
SIDES = ("left", "right", "top", "bottom")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def read_json(file):
    raw = file.read_bytes()
    return json.loads(raw), digest(raw)


def write_json(file, data):
    file.write_text(json.dumps(data, indent=2) + "\n")


def window_curve(image, spec):
    axis, lo, hi, start, end, reverse = spec
    segment = (image[round(start * SCALE):round(end * SCALE)] if axis == "x"
               else image[:, round(start * SCALE):round(end * SCALE)])
    curve = gaussian_filter1d(np.median(segment, axis=0 if axis == "x" else 1), .6, axis=0)
    indices = np.arange(round(lo * SCALE), round(hi * SCALE) + 1)
    if reverse:
        indices = indices[::-1]
    return (indices + .5) / SCALE, curve[indices]


def sustained_crossing(coords, values, threshold, minimum, span=9):
    choices = [i for i in range(1, len(values) - span)
               if values[i - 1] < threshold <= values[i]
               and np.median(values[i:i + span + 1]) >= threshold
               and np.min(values[i + 1:i + span + 1]) >= minimum]
    if not choices:
        return None
    i = choices[0]
    return float(coords[i - 1] + (threshold - values[i - 1]) /
                 (values[i] - values[i - 1]) * (coords[i] - coords[i - 1]))


def art_from_variance(variance):
    result = {}
    for side, spec in ART_WINDOWS.items():
        coords, values = window_curve(variance, spec)
        low, high = float(np.median(values[:7])), float(np.median(values[-7:]))
        threshold = (low + high) / 2
        position = (sustained_crossing(coords, values, threshold, threshold * .9)
                    if high - low > 3 else None)
        result[side] = {"position": position, "outsideMad": low, "insideMad": high,
                        "coords": coords.tolist(), "profile": values.tolist()}
    return result


def paper_bounds(image):
    result = {}
    for side, spec in PAPER_WINDOWS.items():
        coords, rgb = window_curve(image, spec)
        outside, inside = np.median(rgb[:6], axis=0), np.median(rgb[-6:], axis=0)
        direction = inside - outside
        contrast = float(np.linalg.norm(direction))
        values = (rgb - outside) @ direction / max(1e-9, float(direction @ direction))
        position = sustained_crossing(coords, values, .5, .25, 8) if contrast > 8 else None
        result[side] = {"position": position, "contrast": contrast,
                        "coords": coords.tolist(), "profile": values.tolist()}
    return result


def source_art(image):
    alpha = image[:, :, 3] / 255
    profiles = {"x": np.median(alpha[180:490], axis=0),
                "y": np.median(alpha[:, 160:580], axis=1)}
    result = {}
    for side, spec in ART_WINDOWS.items():
        axis, lo, hi, _, _, reverse = spec
        indices = np.arange(round(lo * SCALE), round(hi * SCALE) + 1)
        if reverse:
            indices = indices[::-1]
        values = 1 - profiles[axis][indices]
        choices = [i for i in range(1, len(values)) if values[i - 1] < .5 <= values[i]]
        assert choices, (side, "No source aperture")
        i = choices[0]
        result[side] = {"position": float((indices[i - 1] + (.5 - values[i - 1]) /
                                          (values[i] - values[i - 1]) *
                                          (indices[i] - indices[i - 1]) + .5) / SCALE)}
    return result


def fit_axes(source, target):
    result = {}
    for axis, sides, center in [("x", SIDES[:2], 244), ("y", SIDES[2:], 340)]:
        a = np.array([source[k][s]["position"] for k in ["art", "paper"] for s in sides])
        b = np.array([target[k][s]["position"] for k in ["art", "paper"] for s in sides])
        if None in a or None in b:
            raise ValueError((axis, "Missing joint boundary"))
        scale, offset = np.linalg.lstsq(np.column_stack([a, np.ones(4)]), b, rcond=None)[0]
        errors = a * scale + offset - b
        result[axis] = {"scale": float(scale), "shift": float(offset - center * (1 - scale)),
                        "offset": float(offset), "residuals": errors.tolist(),
                        "rms": float(np.sqrt(np.mean(errors ** 2)))}
    return result


def validation_errors(axes, source, target):
    result = {}
    for kind in ["art", "paper"]:
        result[kind] = {}
        for side in SIDES:
            axis = "x" if side in SIDES[:2] else "y"
            position = target[kind][side]["position"]
            result[kind][side] = (None if position is None else
                                 source[kind][side]["position"] * axes[axis]["scale"] +
                                 axes[axis]["offset"] - position)
    return result


def transformed_rect(rect, axes):
    x, y, w, h = rect
    sx, sy = axes["x"], axes["y"]
    return [(x * 488 * sx["scale"] + sx["offset"]) / 488,
            (y * 680 * sy["scale"] + sy["offset"]) / 680,
            w * sx["scale"], h * sy["scale"]]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("native", type=Path)
    parser.add_argument("family", type=Path)
    parser.add_argument("outer_proposal", type=Path)
    parser.add_argument("out", type=Path)
    args = parser.parse_args()
    capture, capture_hash = read_json(args.native / "capture.json")
    inputs, inputs_hash = read_json(args.native / "inputs.json")
    family, family_hash = read_json(args.family / "family-study.json")
    outer, outer_hash = read_json(args.outer_proposal)
    assert capture["source"]["rendererHash"] == family["rendererHash"]
    assert capture["source"]["rendererHash"] == inputs["source"]["rendererHash"]
    rows = {r["id"]: r for r in capture["rows"]}
    args.out.mkdir(parents=True, exist_ok=True)
    materials, trials = {}, {}
    for material in MATERIALS:
        groups = {}
        entries = [e for e in inputs["entries"] if e["material"] == material]
        for cohort in ["calibration", "validation"]:
            selected = [e for e in entries if e["pose"]["cohort"] == cohort]
            assert len(selected) >= 8
            arrays = []
            for entry in selected:
                row = rows[entry["id"]]
                assert entry["pose"]["accepted"] and row["accepted"]
                assert entry["reference"]["sha256"] == row["referenceHash"]
                raw = (args.native / entry["set"] / (entry["id"] + "-scan.png")).read_bytes()
                assert digest(raw) == row["scanHash"]
                image = np.asarray(Image.open(args.native / entry["set"] /
                                              (entry["id"] + "-scan.png")).convert("RGB"),
                                   dtype=np.float32)
                assert image.shape == (1020, 732, 3)
                stock = np.median(np.concatenate([image[180:800, 10:24].reshape(-1, 3),
                                                  image[180:800, 710:724].reshape(-1, 3)]), axis=0)
                arrays.append(image * (240 / np.maximum(stock, 1)))
            stack = np.stack(arrays)
            median = np.median(stack, axis=0)
            variance = np.median(np.abs(stack - median[None]), axis=0).mean(axis=2)
            groups[cohort] = {"ids": [e["id"] for e in selected],
                              "art": art_from_variance(variance), "paper": paper_bounds(median)}
            Image.fromarray(np.uint8(np.clip(median, 0, 255))).save(
                args.out / (material + "-" + cohort + "-median.png"))
            del stack, arrays, median, variance
        sources = {}
        for name in ["abu", "fourth", "seventh"]:
            asset = next(a for a in family["assets"] if a["key"] == material and a["family"] == name)
            file = args.family / "plates" / asset["raster"]["file"]
            assert digest(file.read_bytes()) == asset["raster"]["sha256"]
            plate = np.asarray(Image.open(file).convert("RGBA"))
            source = {"art": source_art(plate), "paper": paper_bounds(plate[:, :, :3].astype(np.float32))}
            axes = fit_axes(source, groups["calibration"])
            frame = transformed_rect(asset["rect"], axes)
            sources[name] = {"source": source, "axes": axes, "frame": frame,
                             "validationResiduals": validation_errors(axes, source, groups["validation"])}
        materials[material] = {"cohorts": groups, "families": sources}
        axes = sources["abu"]["axes"]
        assert all(.97 < a["scale"] < 1.03 and abs(a["shift"]) < 5 for a in axes.values())
        mask = outer["materials"][material]["axes"]
        stock_mask = transformed_rect([0, 0, 1, 1], {
            k: dict(v, offset=({"x": 244, "y": 340}[k] * (1 - v["scale"]) + v["shift"]))
            for k, v in mask.items()})
        trials[material] = {"family": "abu", "frame": sources["abu"]["frame"],
                            "stockMaskFrame": stock_mask}
        print(material, {k: {"scale": round(v["scale"], 6), "shift": round(v["shift"], 4),
                             "rms": round(v["rms"], 4)} for k, v in axes.items()}, flush=True)
    proof = {"schema": 1, "status": "proposal-needs-native-replay", "method": "shared-art-paper-boundaries-v2",
             "scope": "Stock-normalized medians and cross-printing RGB median absolute deviation isolate apertures. "
                      "Fit one two-axis source affine per material using calibration scans only. Frozen independent "
                      "scan poses never change; validation medians are diagnostics, not fresh blind validation. "
                      "No typography, illustration, color or runtime calibration is adopted.",
             "toolHash": digest(Path(__file__).read_bytes()), "nativeCaptureHash": capture_hash,
             "nativeInputsHash": inputs_hash, "familyStudyHash": family_hash, "outerProposalHash": outer_hash,
             "rendererHash": capture["source"]["rendererHash"], "materials": materials}
    write_json(args.out / "study.json", proof)
    write_json(args.out / "geometry.json", {k: {f: {"frame": v["frame"]} for f, v in m["families"].items()}
                                            for k, m in materials.items()})
    write_json(args.out / "definition.json", {"schema": 1, "ids": [e["id"] for e in inputs["entries"]
                                                                 if e["material"] in MATERIALS],
                                               "trials": [{"id": "joint-art-paper", "materials": trials}]})


if __name__ == "__main__":
    main()
