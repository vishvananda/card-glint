"""Shared source-frame geometry fitted to frozen scan-only references.

Requires NumPy, SciPy and Pillow. Colors and lettering are not fitted here.
"""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
import scipy
import PIL
from PIL import Image
from scipy.ndimage import gaussian_filter1d, map_coordinates, label, find_objects

# Fixed canonical normal ranges; horizontal/vertical footprints are disjoint
# across fit, validation and certificate groups. Rules center pixels never enter.
WINDOWS = {
    "artLeft": ("x", 45, 68),
    "artRight": ("x", 420, 444),
    "artTop": ("y", 57, 80),
    "artBottom": ("y", 355, 379),
    "rulesLeft": ("x", 44, 58),
    "rulesRight": ("x", 434, 448),
    "rulesTop": ("y", 400, 411),
    "rulesBottom": ("y", 596, 614),
}
ALONG = {
    "fit": {"artV": [150], "artH": [110], "rulesV": [450], "rulesH": [110]},
    "validation": {"artV": [240], "artH": [244], "rulesV": [510], "rulesH": [244]},
    "certificate": {"artV": [330], "artH": [378], "rulesV": [570], "rulesH": [378]},
}
HALF_SPANS = {"artV": 29, "artH": 35, "rulesV": 19, "rulesH": 35}
LUMA = np.array([.2126, .7152, .0722], dtype=np.float64)
IDENTITY = np.array([0., 0., 1., 1.])

def digest(data):
    return hashlib.sha256(data).hexdigest()

def footprints(cohort):
    result = []
    for name, (axis, lo, hi) in WINDOWS.items():
        key = ("art" if name.startswith("art") else "rules") + ("V" if axis == "x" else "H")
        for at in ALONG[cohort][key]:
            normal, along = np.meshgrid(np.arange(lo, hi + 1), np.arange(at - HALF_SPANS[key], at + HALF_SPANS[key] + 1))
            x, y = (normal, along) if axis == "x" else (along, normal)
            result.append((name, x.astype(np.float64), y.astype(np.float64)))
    return result

def profile(rgb):
    # Median across a strip suppresses texture. Filtering is clamped to the
    # declared window: no hidden overscan can incorporate body lettering.
    values = gaussian_filter1d(np.median(rgb, axis=0), .8, axis=0, mode="nearest")
    derivative = (values[2:] - values[:-2]) / 2
    magnitude = np.linalg.norm(derivative, axis=1)
    magnitude = np.maximum(0, magnitude - np.quantile(magnitude, .25))
    return magnitude, derivative @ LUMA

def extract_reference(image, cohort):
    return [profile(image[y.astype(int), x.astype(int), :3]) for _, x, y in footprints(cohort)]

def cosine(a, b, signed=False):
    energy = np.linalg.norm(a) * np.linalg.norm(b)
    if energy < 1:
        return None
    v = float(np.clip(np.dot(a, b) / energy, -1, 1))
    return (v + 1) / 2 if signed else v

def compare(reference, candidate):
    values = []
    for (rm, rl), (cm, cl) in zip(reference, candidate):
        # A missing edge is a penalty, never a candidate-specific omitted region.
        mag = cosine(rm, cm)
        signed = cosine(rl, cl, signed=True)
        values.append(.75 * (mag if mag is not None else 0) + .25 * (signed if signed is not None else .5))
    return float(np.mean(values)), values

class Plate:
    def __init__(self, image, rect, fill):
        rgba = np.asarray(image.convert("RGBA"), dtype=np.float64)
        alpha = rgba[:, :, 3:4] / 255
        self.rgb = rgba[:, :, :3] * alpha + np.asarray(fill) * (1 - alpha)
        self.rect = np.asarray(rect, dtype=float) * [488, 680, 488, 680]
        self.width, self.height = image.size
        self.alpha = alpha[:, :, 0]
        self.supports = {}
        # Samples are evaluated in source pixel centers, as drawImage does.
        for cohort in ALONG:
            self.supports[cohort] = footprints(cohort)

    def profiles(self, parameters, cohort):
        tx, ty, sx, sy = parameters
        bx, by, bw, bh = self.rect
        out = []
        for _, x, y in self.supports[cohort]:
            u = (((x + .5 - 244 - tx) / sx + 244 - bx) / bw) * self.width - .5
            v = (((y + .5 - 340 - ty) / sy + 340 - by) / bh) * self.height - .5
            colors = np.stack([map_coordinates(self.rgb[:, :, c], [v, u], order=1, mode="nearest",
                                               prefilter=False) for c in range(3)], axis=2)
            out.append(profile(colors))
        return out

    def frame(self, parameters):
        tx, ty, sx, sy = parameters
        bx, by, bw, bh = self.rect
        return [((bx - 244) * sx + 244 + tx) / 488,
                ((by - 340) * sy + 340 + ty) / 680, bw * sx / 488, bh * sy / 680]

    def aperture(self, parameters):
        components, _ = label(self.alpha < .1)
        pick = components[int(self.height * .3), int(self.width * .5)]
        if not pick:
            return None
        region = find_objects(components)[pick - 1]
        if region is None:
            return None
        y, x = region
        tx, ty, sx, sy = parameters
        bx, by, bw, bh = self.rect
        left, top = bx + x.start / self.width * bw, by + y.start / self.height * bh
        return [((left - 244) * sx + 244 + tx) / 488,
                ((top - 340) * sy + 340 + ty) / 680,
                (x.stop - x.start) / self.width * bw * sx / 488,
                (y.stop - y.start) / self.height * bh * sy / 680]

def target(profiles):
    return [(np.median(np.stack([p[i][0] for p in profiles]), axis=0),
             np.median(np.stack([p[i][1] for p in profiles]), axis=0)) for i in range(len(profiles[0]))]

def optimize(plate, reference):
    def objective(p):
        return compare(reference, plate.profiles(p, "fit"))[0]
    best = None
    for initial in [IDENTITY, np.array([0., 0., .99, .99]), np.array([0., 0., 1.01, 1.01])]:
        p = initial.copy()
        value = objective(p)
        for step in [1., .4, .1]:
            for _ in range(24):
                winner, score = p, value
                for key in range(4):
                    for sign in [-1, 1]:
                        q = p.copy()
                        q[key] += sign * step * (1 if key < 2 else .0025)
                        if np.max(np.abs(q[:2])) > 5 or np.max(np.abs(q[2:] - 1)) > .025:
                            continue
                        v = objective(q)
                        if v > score + 1e-9:
                            winner, score = q, v
                if score <= value + 1e-9:
                    break
                p, value = winner, score
        if best is None or value > best[1]:
            best = p, value
    return best

def run(directory, cache, output):
    directory, cache, output = Path(directory), Path(cache), Path(output)
    if output.exists():
        raise FileExistsError(output)
    tool_hash = digest(Path(__file__).read_bytes())
    raw = (directory / "inputs.json").read_bytes()
    data = json.loads(raw)
    rows = []
    for row in data["rows"]:
        if not row["accepted"]:
            continue
        b = (directory / (row["id"] + ".png")).read_bytes()
        assert digest(b) == row["normalizedHash"]
        image = np.asarray(Image.open(directory / (row["id"] + ".png")).convert("RGB"), dtype=float)
        rows.append({**row, "profiles": {c: extract_reference(image, c) for c in ALONG},
                     "artRgb": np.median(image[100:340, 80:410], axis=(0, 1))})
    results = []
    for asset in data["assets"]:
        group = [r for r in rows if r["key"] == asset["key"]]
        if not group:
            continue
        train = [r for r in group if r["cohort"] == "calibration"]
        sparse = len(set(r["name"] for r in train)) < 3
        if sparse:
            # Repeated basics are development screens, never held-out names.
            train = group
        target_fit = target([r["profiles"]["fit"] for r in train])
        b = (cache / "objects" / asset["sha256"]).read_bytes()
        assert digest(b) == asset["sha256"]
        fill = np.median([r["artRgb"] for r in train], axis=0)
        plate = Plate(Image.open(cache / "objects" / asset["sha256"]), asset["rect"], fill)
        p, value = optimize(plate, target_fit)
        measured = []
        native_profiles = {c: plate.profiles(IDENTITY, c) for c in ALONG}
        fitted_profiles = {c: plate.profiles(p, c) for c in ALONG}
        for r in group:
            scores = {}
            for cohort in ALONG:
                before, _ = compare(r["profiles"][cohort], native_profiles[cohort])
                after, parts = compare(r["profiles"][cohort], fitted_profiles[cohort])
                scores[cohort] = {"before": before * 100, "after": after * 100,
                                 "regions": {name: float(parts[i]) * 100
                                             for i, name in enumerate(WINDOWS)}}
            measured.append({"id": r["id"], "name": r["name"], "cohort": "reused-development" if sparse else r["cohort"], "scores": scores})
        summary = {}
        for cohort in ["calibration", "validation", "reused-development"]:
            rr = [r for r in measured if r["cohort"] == cohort]
            summary[cohort] = {"names": len(set(r["name"] for r in rr)), "printings": len(rr),
                "before": float(np.mean([r["scores"]["certificate"]["before"] for r in rr])) if rr else None,
                "after": float(np.mean([r["scores"]["certificate"]["after"] for r in rr])) if rr else None}
        result = {"key": asset["key"], "family": asset["family"], "asset": asset,
                  "parameters": p.tolist(), "frame": plate.frame(p), "art": plate.aperture(p),
                  "alphaHoleFillRgb": fill.tolist(),
                  "fitObjective": value * 100, "sparseDevelopment": sparse,
                  "boundary": bool(np.max(np.abs(p[:2])) >= 4.99 or np.max(np.abs(p[2:] - 1)) >= .0249),
                  "summary": summary, "rows": measured}
        results.append(result)
        print(data["set"], asset["key"], asset["family"], np.round(p, 4).tolist(), summary, flush=True)
        output.write_text(json.dumps({"schema":1,"status":"running","results":results},indent=2)+"\n")
    report = {"schema":1,"method":"shared-rim-profile-geometry-v2","status":"shared-source-geometry-candidates-not-adopted","set":data["set"],
              "inputHash":digest(raw),"sources":{"tool":tool_hash,
              "numpy":np.__version__,"scipy":scipy.__version__,"pillow":PIL.__version__},"windows":WINDOWS,"along":ALONG,
              "halfSpans":HALF_SPANS,"validationKind":"Reused development names; parameters selected on calibration names only; disjoint validation and certificate strips.","scope":"Name-hash cohorts fixed before fitting. Only calibration names choose four shared source-frame parameters. Disjoint fit, validation and certificate frame strips; explicit small-cohort development screens. No per-scan transforms, HSB or typography fitting. Transparent art holes use one calibration-group median RGB fill for boundary measurement, shared by every family; illustration pixels are not compared or transformed. Native replay and visual verification required before adoption.",
              "results":results}
    assert digest(Path(__file__).read_bytes()) == tool_hash, "Geometry source changed during fitting"
    output.write_text(json.dumps(report,indent=2)+"\n")

if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("directory");parser.add_argument("cache");parser.add_argument("output")
    args=parser.parse_args()
    run(args.directory,args.cache,args.output)
