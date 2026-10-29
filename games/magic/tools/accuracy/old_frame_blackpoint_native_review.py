"""Validate low-tone candidates on real full-face native renders, not predictions."""
import argparse, copy, hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
from old_frame_blackpoint_fit import keyline_pairs, error
from old_frame_color_distribution import normalize, samples, FRAME, PAPER, lab

def digest(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def read_image(directory, row):
    p=directory/row["file"]
    assert digest(p)==row["sha256"]
    return normalize(Image.open(p))

def contrast(a, region):
    x=lab(samples(a, FRAME if region=="frame" else PAPER, region))[:,0]
    return float(np.diff(np.quantile(x,[.1,.9]))[0]*100)

def main(root, set_code, version, out, candidate_version=12):
    root, out=Path(root), Path(out)
    assert not out.exists()
    bd=root/f"{set_code}-native-components-v{version}"
    ad=root/(f"{set_code}-native-keyline-pilot-v12" if candidate_version==12 else f"{set_code}-native-components-v{candidate_version}")
    bp=root/f"{set_code}-selected-components-v{version}.json"
    ap=root/f"{set_code}-selected-components-v{candidate_version}.json"
    old=json.loads(bp.read_bytes()); new=json.loads(ap.read_bytes())
    expected=copy.deepcopy(new)
    for key, color in expected["colors"].items():
        color["adjustment"].pop("blackPoint",None)
    assert expected==old, "Only black-point curves may differ"
    before=json.loads((bd/"capture.json").read_bytes())
    after=json.loads((ad/"capture.json").read_bytes())
    assert before["complete"] and after["complete"] and not before["faults"] and not after["faults"]
    for k in ["inputHash","exportedHash","posesHash"]:
        assert before["source"][k]==after["source"][k],k
    if "assetConfiguration" in before["source"]:
        assert before["source"]["assetConfiguration"]==after["source"]["assetConfiguration"]
    else:
        # Exact legacy MIR capture predates the manifest fields; no general bypass.
        assert set_code=="mir" and digest(bd/"capture.json")=="66f451c358bde276ef36165d013ea5f560e03dc280a7c9d1cc92d9f64dca6f8b"
        assert before["source"]["rendererHash"]=='fcc5aee417101e73fca9d7c65c4e66a6f9e4b4e2a1f754c17b7defabd975f812'
    assert before["source"]["profileHash"]==digest(bp)
    assert after["source"]["profileHash"]==digest(ap)
    rows=[]
    for r in after["rows"]:
        b=next(x for x in before["rows"] if x["id"]==r["id"])
        assert b["inputHash"]==r["inputHash"] and b["normalizedReferenceHash"]==r["normalizedReferenceHash"]
        a=read_image(bd,b); c=read_image(ad,r)
        ref_file=ad/(r["id"]+"-scan.png")
        assert digest(ref_file)==r["normalizedReferenceHash"]
        ref=normalize(Image.open(ref_file))
        key=r["key"]; material="L-"+key[0] if len(key)==2 and key.endswith("L") else key
        rect=np.asarray(new["frames"][material]["art"])*[488,680,488,680]
        x,y,w,h=rect
        interior=np.s_[int(np.ceil(y))+3:int(np.floor(y+h))-3,int(np.ceil(x))+3:int(np.floor(x+w))-3]
        assert np.array_equal(a[interior],c[interior]),r["name"]+": art changed"
        ink_a,ink_ref=keyline_pairs(a,ref,rect); ink_c,_=keyline_pairs(c,ref,rect)
        metrics={"ink":dict(before=error(ink_a,ink_ref),after=error(ink_c,ink_ref))}
        for part, patches in [("frame",FRAME),("paper",PAPER)]:
            target=samples(ref,patches,part)
            metrics[part]=dict(before=error(samples(a,patches,part),target),
                               after=error(samples(c,patches,part),target),
                               contrastBefore=contrast(a,part),contrastAfter=contrast(c,part),
                               contrastReference=contrast(ref,part))
        rows.append(dict(id=r["id"],name=r["name"],key=key,cohort=r["cohort"],before=b["sha256"],
                         after=r["sha256"],reference=r["normalizedReferenceHash"],artUnchanged=True,metrics=metrics))
    groups={}
    for key in sorted({r["key"] for r in rows}):
        group=[r for r in rows if r["key"]==key]
        groups[key]={part:{metric:float(np.mean([r["metrics"][part][metric] for r in group]))
                           for metric in group[0]["metrics"][part]}
                     for part in ["ink","frame","paper"]}
    result=dict(schema=1,status=("native-low-tone-pilot-not-full-set-approval" if after["source"]["pilot"] else "native-full-inventory-low-tone-review-not-set-approval"),set=set_code,
                source=dict(beforeCapture=digest(bd/"capture.json"),afterCapture=digest(ad/"capture.json"),
                            beforeProfile=digest(bp),afterProfile=digest(ap),tool=digest(__file__)),
                scope="Actual full-face native output on frozen references and identical wording. Illustration interiors must remain byte-identical. Keyline, texture/paper color and luminance spread are reported; full-inventory validation is still required.",
                groups=groups,rows=rows)
    out.write_text(json.dumps(result,indent=2)+"\n")
    print(set_code, json.dumps(groups))
if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("root");p.add_argument("set");p.add_argument("version",type=int);p.add_argument("out");p.add_argument("--candidate-version",type=int,default=12)
    a=p.parse_args();main(a.root,a.set,a.version,a.out,a.candidate_version)
