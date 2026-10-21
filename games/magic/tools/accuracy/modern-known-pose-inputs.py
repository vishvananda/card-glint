"""Freeze source selection, then generate full-resolution geometric/color controls.

Without a plan, keep the original UUID-first two-source, seven-warp trial.
An optional JSON plan can confirm new transforms over the complete source census.
No renderer pixels determine registration or control selection.
"""
import hashlib
import json
import math
from pathlib import Path
import re
import shutil
import sys

import cv2
import numpy as np


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def matrix(case):
    angle = math.radians(case["rotation"])
    c, s = math.cos(angle), math.sin(angle)
    k = math.tan(math.radians(case["shear"]))
    sx, sy = case["sx"], case["sy"]
    return [sx*c, sx*s, sy*(c*k-s), sy*(s*k+c), case["tx"], case["ty"]]


def native_warp(image, m):
    h, w = image.shape[:2]
    f = min(488/w, 680/h)
    px, py = (488-w*f)/2, (680-h*f)/2
    center = np.array([(244-px+.5)/f-.5, (340-py+.5)/f-.5])
    a, b, c, d, tx, ty = m
    linear = np.array([[a,c],[b,d]])
    shift = np.array([tx,ty])/f + (np.eye(2)-linear) @ center
    return cv2.warpAffine(image, np.column_stack((linear,shift)), (w,h),
                          flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=0)


def photometry(image, policy):
    assert policy["space"] == "HSV"
    color = image[:,:,:3].astype(np.float32)/255
    hsv = cv2.cvtColor(color, cv2.COLOR_BGR2HSV)
    hsv[:,:,1] *= policy["saturationScale"]
    hsv[:,:,2] = hsv[:,:,2]*policy["valueScale"] + policy["valueOffset"]
    assert np.min(hsv[:,:,1:]) >= 0 and np.max(hsv[:,:,1:]) <= 1, "Avoid clipped color controls"
    result = np.rint(cv2.cvtColor(hsv,cv2.COLOR_HSV2BGR)*255).clip(0,255).astype(np.uint8)
    if image.shape[2] == 4:
        result = np.dstack((result,image[:,:,3]))
    return result


def main():
    assert len(sys.argv) in (6,7), "Usage: modern-known-pose-inputs.py OBS INPUTS TEMPLATES CACHE OUT [PLAN]"
    obs_file, input_file, template_file, cache_dir, out_dir = map(Path,sys.argv[1:6])
    plan_file = Path(sys.argv[6]) if len(sys.argv)==7 else None
    obs, inputs, templates = read(obs_file), read(input_file), read(template_file)
    assert obs["inputHash"] == sha(input_file)
    assert templates["observationsHash"] == sha(obs_file)
    by_id = {e["id"]:e for e in inputs["entries"]}
    observations = {e["id"]:e for e in obs["rows"]}
    plan = read(plan_file) if plan_file else None
    if plan:
        assert plan["schema"] == 1 and plan["selection"] == "complete-reference-census"
        assert plan["set"] == inputs["set"] and plan["expectedSources"] == len(by_id)
        cases = plan["cases"]
        scope = plan["scope"]
    else:
        raw = [("identity",1,1,0,0,0,0),("translation",1,1,1.3,-1.1,0,0),
               ("uniform",1.004,1.004,0,0,0,0),("rotation",1,1,0,0,.2,0),
               ("shear",1,1,0,0,0,.15),("axis-scale",.997,1.005,0,0,0,0),
               ("combined",1.003,.998,1.1,-.8,.15,-.1)]
        cases = [dict(zip(["label","sx","sy","tx","ty","rotation","shear"],v)) for v in raw]
        scope = "UUID-selected first two distinct names per frozen geometry/material template, or all available names and a second printing when fewer exist. Selection precedes control fitting; no acceptance-score filtering. Full-resolution source warps precede frame extraction."
    assert cases and len({c["label"] for c in cases}) == len(cases)
    for case in cases:
        assert re.fullmatch(r"[a-z0-9-]+",case["label"])
        assert all(math.isfinite(case[k]) for k in ["sx","sy","tx","ty","rotation","shear"])
        assert case["sx"] > 0 and case["sy"] > 0
    controls = []
    for family, template in sorted(templates["templates"].items()):
        if plan:
            selected = sorted(template["members"])
        else:
            selected, names = [], set()
            for identifier in sorted(template["members"]):
                if observations[identifier]["oracleId"] not in names:
                    selected.append(identifier)
                    names.add(observations[identifier]["oracleId"])
                if len(selected)==2:
                    break
            if len(selected) < min(2,len(template["members"])):
                selected += [i for i in sorted(template["members"]) if i not in selected][:2-len(selected)]
        for identifier in selected:
            for case in cases:
                row = {"id":identifier,"name":by_id[identifier]["card"]["name"],
                       "geometry":family,"label":case["label"],
                       "parameters":{k:case[k] for k in ["sx","sy","tx","ty","rotation","shear"]},
                       "matrix":matrix(case),"referenceHash":by_id[identifier]["reference"]["sha256"],
                       "file":identifier+"/"+case["label"]+".png"}
                if case.get("photometry"):
                    row["photometry"] = case["photometry"]
                controls.append(row)
    if plan:
        assert {c["id"] for c in controls} == set(by_id) == set(observations)
        assert len(controls) == len(by_id)*len(cases)
    definition = {"schema":1,"scope":scope,"observationsHash":sha(obs_file),
                  "inputsHash":sha(input_file),"templatesHash":sha(template_file),
                  "generatorHash":sha(Path(__file__)),"opencv":cv2.__version__,
                  "numpy":np.__version__,"controls":controls}
    if plan:
        definition.update({"planHash":sha(plan_file),"plan":plan})
    out_dir.mkdir(parents=True,exist_ok=True)
    selection = out_dir/"selection.json"
    if selection.exists():
        assert read(selection)==definition, "Use a new directory after selection/method changes"
    else:
        selection.write_text(json.dumps(definition,indent=2)+"\n")
    for i,row in enumerate(controls):
        source = cache_dir/"objects"/row["referenceHash"]
        assert sha(source)==row["referenceHash"]
        target = out_dir/row["file"]
        target.parent.mkdir(exist_ok=True)
        identity = row["matrix"] == [1,0,0,1,0,0]
        if identity and not row.get("photometry"):
            shutil.copyfile(source,target)
        else:
            image = cv2.imread(str(source),cv2.IMREAD_UNCHANGED)
            assert image is not None
            warped = image if identity else native_warp(image,row["matrix"])
            if row.get("photometry"):
                warped = photometry(warped,row["photometry"])
            assert cv2.imwrite(str(target),warped)
        row["sha256"], row["bytes"] = sha(target), target.stat().st_size
        if (i+1)%35==0:
            print("known raster",i+1,"/",len(controls),flush=True)
    manifest = {**definition,"selectionHash":sha(selection),"controls":controls}
    (out_dir/"controls.json").write_text(json.dumps(manifest,indent=2)+"\n")
    print(json.dumps({"sources":len({r["id"] for r in controls}),"controls":len(controls)}))


if __name__ == "__main__":
    main()
