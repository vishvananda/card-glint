#!/usr/bin/env python3
"""Measure existing basic-land source geometry against frozen native scans.

The three illustrations of each basic name are a small development cohort,
not independent-name validation. No scan-dependent renderer values are emitted.
Requires numpy, Pillow and scipy. All numerical outputs omit external rasters.
"""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location(
    "internal_geometry", Path(__file__).with_name("early-internal-geometry.py")
)
geometry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(geometry)
BASICS = {"Plains": "WL", "Island": "UL", "Swamp": "BL", "Mountain": "RL", "Forest": "GL"}


def read(path):
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def write(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("native", type=Path)
    parser.add_argument("family", type=Path)
    parser.add_argument("outer_proposal", type=Path)
    parser.add_argument("out", type=Path)
    args = parser.parse_args()
    capture, capture_hash = read(args.native / "capture.json")
    inputs, inputs_hash = read(args.native / "inputs.json")
    family, family_hash = read(args.family / "family-study.json")
    outer, outer_hash = read(args.outer_proposal)
    assert capture["source"]["rendererHash"] == inputs["source"]["rendererHash"] == family["rendererHash"]
    rows = {r["id"]: r for r in capture["rows"]}
    args.out.mkdir(parents=True, exist_ok=True)
    # The common aperture belongs to the shared land-frame family. Pool all
    # fifteen illustrations to separate art content from repeated frame texture;
    # three images of one name can have less art variance than frame exposure.
    pooled = []
    for entry in inputs["entries"]:
        if entry["material"] != "L" or entry["name"] not in BASICS:
            continue
        row = rows[entry["id"]]
        file = args.native / entry["set"] / (entry["id"] + "-scan.png")
        assert row["accepted"] and entry["pose"]["accepted"]
        assert entry["reference"]["sha256"] == row["referenceHash"]
        assert hashlib.sha256(file.read_bytes()).hexdigest() == row["scanHash"]
        image = np.asarray(Image.open(file).convert("RGB"), dtype=np.float32)
        assert image.shape == (1020, 732, 3)
        stock = np.median(np.concatenate([image[180:800, 10:24].reshape(-1, 3),
                                          image[180:800, 710:724].reshape(-1, 3)]), axis=0)
        pooled.append(image * (240 / np.maximum(stock, 1)))
    assert len(pooled) >= 15
    stack = np.stack(pooled)
    median = np.median(stack, axis=0)
    mad = np.median(np.abs(stack - median[None]), axis=0).mean(axis=2)
    shared_art = geometry.art_from_variance(mad)
    shared_art_count = len(pooled)
    del pooled, stack, median, mad
    source_mask = next(a for a in family["assets"] if a["key"] == "WL" and a["family"] == "abu")["url"].rsplit("/", 1)[0] + "/border.svg"
    groups = []
    for name, key in BASICS.items():
        entries = [e for e in inputs["entries"] if e["material"] == "L" and e["name"] == name]
        assert len(entries) >= 3
        arrays, identities = [], []
        for entry in entries:
            row = rows[entry["id"]]
            assert row["accepted"] and entry["pose"]["accepted"]
            assert entry["face"]["wordingMode"] == "original"
            assert entry["reference"]["sha256"] == row["referenceHash"]
            file = args.native / entry["set"] / (entry["id"] + "-scan.png")
            assert hashlib.sha256(file.read_bytes()).hexdigest() == row["scanHash"]
            image = np.asarray(Image.open(file).convert("RGB"), dtype=np.float32)
            assert image.shape == (1020, 732, 3)
            stock = np.median(np.concatenate([image[180:800, 10:24].reshape(-1, 3),
                                              image[180:800, 710:724].reshape(-1, 3)]), axis=0)
            arrays.append(image * (240 / np.maximum(stock, 1)))
            identities.append({k: row[k] for k in ["id", "name", "referenceHash", "poseHash", "scanHash"]})
        stack = np.stack(arrays)
        median = np.median(stack, axis=0)
        mad = np.median(np.abs(stack - median[None]), axis=0).mean(axis=2)
        individual_art = geometry.art_from_variance(mad)
        target = {"art": shared_art, "paper": geometry.paper_bounds(median)}
        Image.fromarray(np.uint8(np.clip(median, 0, 255))).save(args.out / (key + "-development-median.png"))
        candidates = []
        for asset in family["assets"]:
            if asset["key"] != key:
                continue
            file = args.family / "plates" / asset["raster"]["file"]
            assert hashlib.sha256(file.read_bytes()).hexdigest() == asset["raster"]["sha256"]
            plate = np.asarray(Image.open(file).convert("RGBA"))
            source = {"art": geometry.source_art(plate),
                      "paper": geometry.paper_bounds(plate[:, :, :3].astype(np.float32))}
            candidate = {"family": asset["family"], "asset": asset["url"], "mask": source_mask, "source": source}
            try:
                axes = geometry.fit_axes(source, target)
                if not all(.96 < a["scale"] < 1.04 and abs(a["shift"]) < 6 for a in axes.values()):
                    raise ValueError("Source transform exceeds predeclared shared-geometry bounds")
                frame = geometry.transformed_rect(asset["rect"], axes)
                stock = outer["materials"]["L"]["axes"]
                stock_frame = geometry.transformed_rect([0, 0, 1, 1], {
                    k: dict(v, offset={"x": 244, "y": 340}[k] * (1 - v["scale"]) + v["shift"])
                    for k, v in stock.items()
                })
                a = {side: source["art"][side]["position"] * axes["x" if side in ["left", "right"] else "y"]["scale"] +
                           axes["x" if side in ["left", "right"] else "y"]["offset"]
                     for side in geometry.SIDES}
                # A one-pixel underlap covers the antialiased aperture; the
                # opaque source frame still owns the visible art boundary.
                art = [(a["left"] - 1) / 488, (a["top"] - 1) / 680,
                       (a["right"] - a["left"] + 2) / 488, (a["bottom"] - a["top"] + 2) / 680]
                candidate.update({"status": "measured-needs-native-replay", "axes": axes,
                                  "frame": frame, "art": art, "stockMaskFrame": stock_frame,
                                  "residuals": geometry.validation_errors(axes, source, target)})
            except ValueError as error:
                candidate.update({"status": "unresolved-source-geometry", "reason": str(error)})
            candidates.append(candidate)
        assert len(candidates) == 2
        group = {"name": name, "key": key, "ids": identities, "target": target, "individualArtDiagnostic": individual_art, "candidates": candidates}
        groups.append(group)
        trials = [{"id": c["family"] + "-joint", "materials": {"L": {k: c[k] for k in
                   ["family", "asset", "mask", "frame", "art", "stockMaskFrame"]}}}
                  for c in candidates if c["status"] == "measured-needs-native-replay"]
        write(args.out / (key + "-definition.json"), {"schema": 1, "ids": [e["id"] for e in entries], "trials": trials})
        print(name, [(c["family"], c["status"],
                       {k: round(v["rms"], 3) for k, v in c.get("axes", {}).items()}) for c in candidates], flush=True)
    proof = {"schema": 1, "status": "basic-land-shared-source-geometry-needs-native-replay",
             "scope": "Shared art target pools all fifteen basic-land illustrations; paper targets use three original-wording printing variants per basic name. All are development observations; name cohorts cannot provide independent-name validation here. Original affine scan normalization is frozen and verified against native PNG hashes. One source transform per land color/family jointly fits art and paper boundaries, with the previously measured shared land stock mask. Art paint underlaps the opaque source aperture. No per-card renderer offsets, source color changes, dual-frame changes or runtime profile adoption.",
             "nativeCaptureHash": capture_hash, "nativeInputsHash": inputs_hash,
             "familyStudyHash": family_hash, "outerProposalHash": outer_hash,
             "rendererHash": capture["source"]["rendererHash"],
             "toolHash": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
             "geometryToolHash": hashlib.sha256(Path(__file__).with_name("early-internal-geometry.py").read_bytes()).hexdigest(),
             "sharedArtPrintings": shared_art_count, "groups": groups}
    write(args.out / "study.json", proof)


if __name__ == "__main__":
    main()
