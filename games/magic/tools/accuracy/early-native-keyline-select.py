#!/usr/bin/env python3
"""Select shared source black-point curves from completed native trials.

Run after early-frame-ink-audit.py and early-native-color-audit.mjs for each
variant in DEFINITION. Calibration cohorts alone select one variant per material.
Validation is a reused development check, not a fresh blind test. Native PNGs
are verified before recording art-core, alpha and etching invariance.
"""
import argparse
import hashlib
import gzip
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.dont_write_bytecode = True
_spec = importlib.util.spec_from_file_location(
    "keyline_tone", Path(__file__).with_name("early-keyline-tone-fit.py")
)
_tone = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_tone)


def read(path):
    raw = path.read_bytes()
    return json.loads(gzip.decompress(raw) if path.suffix == ".gz" else raw), hashlib.sha256(raw).hexdigest()


def index(rows):
    result = {row["id"]: row for row in rows}
    if len(result) != len(rows):
        raise ValueError("Duplicate printing ID")
    return result


def require_equal(left, right, message):
    if left != right:
        raise ValueError(message)


def observations(ink, color, baseline_ink, baseline_color, ids):
    rows = []
    for ident in ids:
        source, base = ink[ident], baseline_ink[ident]
        before = float(_tone.delta(base["rendered"]["rgb"], base["reference"]["rgb"]))
        after = float(_tone.delta(source["rendered"]["rgb"], source["reference"]["rgb"]))
        components = {}
        for name in ["frame", "paper"]:
            a = baseline_color[ident]["components"][name]
            b = color[ident]["components"][name]
            components[name] = {
                "before": a["deltaE"], "after": b["deltaE"],
                "contrastErrorBefore": abs(a["renderSpread"] - a["referenceSpread"]),
                "contrastErrorAfter": abs(b["renderSpread"] - b["referenceSpread"]),
            }
        rows.append({"id": ident, "name": source["name"], "material": source["material"],
                     "cohort": source["cohort"], "inkBefore": before, "inkAfter": after,
                     "components": components})
    if not rows:
        raise ValueError("Empty evaluation cohort")
    summary = {key: float(np.median([r[key] for r in rows]))
               for key in ["inkBefore", "inkAfter"]}
    summary.update({"count": len(rows),
                    "inkImproved": sum(r["inkAfter"] < r["inkBefore"] - 1e-9 for r in rows),
                    "inkRegressed": sum(r["inkAfter"] > r["inkBefore"] + 1e-9 for r in rows),
                    "worstInkRegression": max(r["inkAfter"] - r["inkBefore"] for r in rows)})
    for name in ["frame", "paper"]:
        parts = [r["components"][name] for r in rows]
        summary[name] = {
            "before": float(np.median([r["before"] for r in parts])),
            "after": float(np.median([r["after"] for r in parts])),
            "colorPenalty": float(np.mean([max(0, r["after"] - r["before"]) for r in parts])),
            "contrastPenalty": float(np.mean([max(0, r["contrastErrorAfter"] - r["contrastErrorBefore"]) for r in parts])),
        }
    summary["objective"] = summary["inkAfter"] + sum(
        summary[name]["colorPenalty"] + .25 * summary[name]["contrastPenalty"]
        for name in ["frame", "paper"]
    )
    return summary, rows


def image(path, expected):
    raw = path.read_bytes()
    require_equal(hashlib.sha256(raw).hexdigest(), expected, "Native raster hash mismatch: " + str(path))
    result = np.array(Image.open(path).convert("RGBA"))
    require_equal(result.shape, (1020, 732, 4), "Unexpected native dimensions")
    return result


def select(definition, captures, inks, colors):
    """Pure selection: validation pixels cannot affect the selected variant."""
    variants = [r["id"] for r in definition["trials"]]
    if len(set(variants)) != len(variants) or variants[0] != "material-control":
        raise ValueError("Expected unique variants beginning with material-control")
    ids = set(captures)
    require_equal(ids, set(definition["ids"]), "Definition printing coverage mismatch")
    for variant in variants:
        require_equal(set(inks[variant]), ids, "Ink printing coverage mismatch")
        require_equal(set(colors[variant]), ids, "Color printing coverage mismatch")
        for ident in ids:
            native = captures[ident]
            for row in [inks[variant][ident], colors[variant][ident]]:
                for field in ["id", "material", "cohort", "referenceHash", "poseHash"]:
                    require_equal(row[field], native[field], "Trial identity mismatch: " + field)
                require_equal(row["renderHash"], native["trials"][variant]["faceHash"], "Trial raster mismatch")
                if "accepted" in row and not row["accepted"]:
                    raise ValueError("Rejected color observation")
            for column in ["reference"]:
                require_equal(inks[variant][ident][column], inks[variants[0]][ident][column], "Changed reference ink")
            for name in ["frame", "paper"]:
                reference = colors[variants[0]][ident]["components"][name]
                current = colors[variant][ident]["components"][name]
                for field in ["referenceRgb", "referenceSpread"]:
                    require_equal(current[field], reference[field], "Changed color reference")
    groups = []
    for material in sorted({r["material"] for r in captures.values()}):
        subset = sorted(i for i in ids if captures[i]["material"] == material)
        calibration = [i for i in subset if captures[i]["cohort"] == "calibration"]
        validation = [i for i in subset if captures[i]["cohort"] == "validation"]
        if len(calibration) < 3 or len(validation) < 3 or len(calibration) + len(validation) != len(subset):
            raise ValueError("Insufficient or unknown cohorts")
        trials = []
        for order, variant in enumerate(variants):
            result, _ = observations(inks[variant], colors[variant], inks[variants[0]], colors[variants[0]], calibration)
            trials.append({"variant": variant, "order": order, **result})
        best = min(trials, key=lambda t: (t["objective"], t["order"]))
        selected = best["variant"]
        evaluation, _ = observations(inks[selected], colors[selected], inks[variants[0]], colors[variants[0]], validation)
        overall, rows = observations(inks[selected], colors[selected], inks[variants[0]], colors[variants[0]], subset)
        recipe = next(t for t in definition["trials"] if t["id"] == selected)["materials"][material]
        groups.append({"material": material, "variant": selected, "materialRecipe": recipe,
                       "calibration": best, "validation": evaluation, "overall": overall,
                       "candidates": trials, "rows": rows})
    return groups


def replay(observations_file, selection_file):
    """Recheck compact numerical evidence without claiming a new raster audit."""
    data, _ = read(observations_file)
    proof, _ = read(selection_file)
    for field in ["nativeCaptureHash", "trialCaptureHash", "definitionHash", "rendererHash"]:
        require_equal(data[field], proof[field], "Compact evidence identity mismatch")
    for name, digest in proof["diagnostics"].items():
        require_equal(data["diagnostics"][name], digest, "Compact diagnostic identity mismatch")
    groups = select(data["definition"], index(data["capture"]["rows"]),
                    {k: index(v) for k, v in data["inks"].items()},
                    {k: index(v) for k, v in data["colors"].items()})
    expected = json.loads(json.dumps(proof["groups"]))
    for group in expected:
        for row in group["rows"]:
            row.pop("proof", None)
    require_equal(groups, expected, "Compact numerical selection does not reproduce")
    print("Reproduced", len(groups), "shared material choices and", proof["count"],
          "paired numerical rows; native raster invariants are not rerun in this mode.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("native", type=Path)
    parser.add_argument("trial", type=Path)
    parser.add_argument("definition", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    native, native_hash = read(args.native / "capture.json")
    trial, trial_hash = read(args.trial / "capture.json")
    definition, definition_hash = read(args.definition)
    require_equal(trial["source"]["nativeCaptureHash"], native_hash, "Native capture mismatch")
    require_equal(trial["source"]["definitionHash"], definition_hash, "Definition mismatch")
    captures, refs = index(trial["rows"]), index(native["rows"])
    inks, colors, sources = {}, {}, {}
    for candidate in definition["trials"]:
        variant = candidate["id"]
        for kind, target in [("ink", inks), ("color", colors)]:
            name = args.trial.name + "-" + variant + "-" + kind + ".json"
            report, digest = read(args.trial.parent / name)
            require_equal(report["trialCaptureHash"], trial_hash, "Diagnostic capture mismatch")
            require_equal(report["nativeCaptureHash"], native_hash, "Diagnostic native mismatch")
            require_equal(report["rendererHash"], trial["source"]["rendererHash"], "Diagnostic renderer mismatch")
            if kind == "ink" and report.get("whiteCaptureHash") is not None:
                raise ValueError("Mixed white capture is not accepted")
            if kind == "color":
                require_equal(report["trialName"], variant, "Diagnostic variant mismatch")
            target[variant] = index(report["rows"])
            sources[name] = digest
    groups = select(definition, captures, inks, colors)
    for group in groups:
        for row in group["rows"]:
            ident, variant = row["id"], group["variant"]
            cap, reference = captures[ident], refs[ident]
            if not cap["baselineParity"]:
                raise ValueError("Released baseline parity failed")
            for field in ["referenceHash", "poseHash"]:
                require_equal(reference[field], cap[field], "Native reference identity mismatch")
            control, selected = (cap["trials"][v] for v in ["material-control", variant])
            before = image(args.trial / "material-control" / (ident + ".png"), control["faceHash"])
            after = image(args.trial / variant / (ident + ".png"), selected["faceHash"])
            # Conservative common interior of all studied illustration windows,
            # explicitly excluding the frame and art-edge antialiasing.
            art = (slice(round(85 * 1.5), round(355 * 1.5)), slice(round(70 * 1.5), round(415 * 1.5)))
            if not np.array_equal(before[art], after[art]):
                raise ValueError("Art core changed: " + ident)
            if not np.array_equal(before[:, :, 3], after[:, :, 3]):
                raise ValueError("Face alpha changed: " + ident)
            require_equal(control["etchingHash"], selected["etchingHash"], "Etching changed")
            for v, data in [("material-control", control), (variant, selected)]:
                image(args.trial / v / (ident + "-etching.png"), data["etchingHash"])
            row["proof"] = {"referenceHash": cap["referenceHash"], "poseHash": cap["poseHash"],
                            "beforeHash": control["faceHash"], "afterHash": selected["faceHash"],
                            "appliedMaterialHash": selected.get("appliedMaterialHash"),
                            "etchingHash": selected["etchingHash"], "artCoreUnchanged": True,
                            "alphaUnchanged": True,
                            "outerBoundaryBefore": control["outerBoundary"]["medianResidualPx"],
                            "outerBoundaryAfter": selected["outerBoundary"]["medianResidualPx"]}
        print(group["material"], group["variant"], "keyline median", round(group["overall"]["inkBefore"], 3),
              "->", round(group["overall"]["inkAfter"], 3), "validation", round(group["validation"]["inkAfter"], 3))
    report = {"schema": 1, "status": "native-shared-keyline-candidates-remaining-components-open",
              "scope": "One native source-material curve per material, selected on calibration only. Objective: median keyline Oklab distance plus mean positive frame and paper color regressions plus 0.25 times positive texture-spread-error regressions. Ties prefer the earlier, weaker variant. Validation is reused development, not blind certification. Frozen scan transforms, original wording, illustration core, face alpha and empty etching layers remain unchanged. This regional study does not certify a complete set or improve published whole-card scores.",
              "nativeCaptureHash": native_hash, "trialCaptureHash": trial_hash,
              "definitionHash": definition_hash, "rendererHash": trial["source"]["rendererHash"],
              "toolHash": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
              "toneToolHash": hashlib.sha256(Path(__file__).with_name("early-keyline-tone-fit.py").read_bytes()).hexdigest(),
              "diagnostics": sources, "artCore": [70, 85, 345, 270], "count": len(captures), "groups": groups}
    args.output.write_text(json.dumps(report, indent=2) + "\n")


if __name__ == "__main__":
    if len(sys.argv) == 4 and sys.argv[1] == "--replay":
        replay(Path(sys.argv[2]), Path(sys.argv[3]))
    else:
        main()
