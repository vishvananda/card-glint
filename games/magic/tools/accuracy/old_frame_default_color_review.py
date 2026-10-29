"""Compare default pigments without fitting text, artwork, or scan poses."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from old_frame_color_distribution import normalize,lab
from old_frame_material_validation import fields

def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def distribution(image,part):
    values=lab(fields(image,part))
    return np.quantile(values,[.1,.25,.5,.75,.9],axis=0)
def distance(a,b):return float(np.linalg.norm(a-b,axis=1).mean()*100)
def main(study,prototypes,output):
    study,prototypes,output=map(Path,[study,prototypes,output]);assert not output.exists()
    proto=json.loads((prototypes/"capture.json").read_bytes());assert proto["complete"]
    done=json.loads((study/"default-installed-v1/complete.json").read_bytes());assert done["complete"]
    assert proto["renderer"]==done["rendererHash"]
    lookup={(r["id"],r["variant"]):r for r in proto["rows"]}
    prior={}
    for file in ["default-three-donor-results-v5.json","default-three-donor-additions-v6.json"]:
        batch=json.loads((study/file).read_bytes());assert batch["status"]=="complete"
        for r in batch["rows"]:prior[r["set"]]=study/r["output"]
    rows=[]
    for code in sorted({r["set"] for r in proto["rows"]}):
        installed=json.loads((study/"default-installed-v1"/(code+".json")).read_bytes())
        source=json.loads((prior[code]/"study.json").read_bytes())
        for r in installed["rows"]:
            if (r["id"],"ons")not in lookup:continue
            old=next(a for a in source["rows"]if a["id"]==r["id"])
            scan=prior[code]/(r["id"]+"-scan.png");assert digest(scan)==old["scanHash"]
            reference=normalize(Image.open(scan))
            target={part:distribution(reference,part)for part in ["frame","paperClear"]}
            scores={}
            for mode in ["before","mir","ons","source"]:
                if mode in ["before","mir"]:
                    p=study/"default-installed-v1"/(("before-" if mode=="before"else "after-")+r["id"]+".png")
                    expected=r["beforeHash"]if mode=="before"else r["sha256"]
                else:
                    record=lookup[r["id"],mode];p=prototypes/record["file"];expected=record["sha256"]
                assert digest(p)==expected
                image=normalize(Image.open(p))
                scores[mode]={part:distance(distribution(image,part),target[part])for part in target}
                scores[mode]["objective"]=(scores[mode]["frame"]+scores[mode]["paperClear"])/2
            rows.append(dict(id=r["id"],name=r["name"],set=code,material=r["material"],reference=old["scanHash"],scores=scores))
    groups={}
    for code in sorted({r["set"]for r in rows}):
        peers=[r for r in rows if r["set"]==code]
        materials=sorted({r["material"]for r in peers})
        # Equal material weights prevent five basic lands from dominating three per color.
        means={mode:float(np.mean([np.mean([r["scores"][mode]["objective"]for r in peers if r["material"]==m])for m in materials]))for mode in ["before","mir","ons","source"]}
        best=min(["mir","ons","source"],key=lambda k:means[k])
        groups[code]=dict(count=len(peers),materials=materials,objective=means,recommended=best,
                          gainFromMir=means["mir"]-means[best],penaltyVsPrevious=means[best]-means["before"])
        print(code,groups[code],flush=True)
    output.write_text(json.dumps(dict(schema=1,status="shared-default-color-choice-development-not-set-calibration",
      source=dict(prototypes=digest(prototypes/"capture.json"),installed=digest(study/"default-installed-v1/complete.json"),tool=digest(__file__)),
      scope="Frozen normalized scans, same installed geometry and words, no artwork samples. Five Oklab distribution quantiles on fixed frame strips and text-cleared paper; 11px closing plus blur removes lettering. Objective averages frame/paper then balances material groups. Only a choice among already calibrated shared palettes or neutral source pixels; no per-card or continuous per-set fit and no independent holdout claim.",
      groups=groups,rows=rows),indent=2)+"\n")
if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("study");p.add_argument("prototypes");p.add_argument("out")
    a=p.parse_args();main(a.study,a.prototypes,a.out)
