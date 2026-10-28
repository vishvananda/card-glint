"""Texture-only source-family diagnostics after shared geometry fitting."""
import argparse
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, map_coordinates
from old_frame_geometry import Plate, digest, LUMA

PATCHES=[(x,y,13,24) for x in [34,441] for y in [100,200,300,440,520,570]]

def signal(rgb):
    gray=gaussian_filter(rgb @ LUMA,1.1,mode="nearest")
    yy,xx=np.mgrid[:gray.shape[0],:gray.shape[1]]
    xx=xx-xx.mean();yy=yy-yy.mean()
    flat=gray-gray.mean()
    flat-=xx*np.sum(flat*xx)/np.sum(xx*xx)
    flat-=yy*np.sum(flat*yy)/np.sum(yy*yy)
    return flat.ravel(),float(np.std(flat))

def sample(plate,p,rect):
    x,y,w,h=rect;yy,xx=np.mgrid[y:y+h,x:x+w]
    tx,ty,sx,sy=p;bx,by,bw,bh=plate.rect
    u=(((xx+.5-244-tx)/sx+244-bx)/bw)*plate.width-.5
    v=(((yy+.5-340-ty)/sy+340-by)/bh)*plate.height-.5
    return np.stack([map_coordinates(plate.rgb[:,:,c],[v,u],order=1,mode="nearest",prefilter=False) for c in range(3)],axis=2)

def run(directory,geometry,cache,out):
    directory,geometry,cache,out=map(Path,[directory,geometry,cache,out])
    assert not out.exists()
    gb=geometry.read_bytes();g=json.loads(gb)
    data=json.loads((directory/"inputs.json").read_text())
    assert g["inputHash"]==digest((directory/"inputs.json").read_bytes())
    assert g["status"]=="shared-source-geometry-candidates-not-adopted"
    refs={}
    for r in data["rows"]:
        if not r["accepted"]:continue
        b=(directory/(r["id"]+".png")).read_bytes();assert digest(b)==r["normalizedHash"]
        image=np.asarray(Image.open(directory/(r["id"]+".png")).convert("RGB"),dtype=float)
        refs[r["id"]]=[signal(image[y:y+h,x:x+w]) for x,y,w,h in PATCHES]
    results=[]
    for candidate in g["results"]:
        asset=candidate["asset"];b=(cache/"objects"/asset["sha256"]).read_bytes();assert digest(b)==asset["sha256"]
        plate=Plate(Image.open(cache/"objects"/asset["sha256"]),asset["rect"],candidate["alphaHoleFillRgb"])
        samples=[signal(sample(plate,candidate["parameters"],p)) for p in PATCHES]
        rows=[]
        for r in data["rows"]:
            if not r["accepted"] or r["key"]!=candidate["key"]:continue
            values=[]
            for (ref,rs),(src,ss) in zip(refs[r["id"]],samples):
                if rs<.5 or ss<.5:values.append(None);continue
                values.append(float(np.dot(ref,src)/(np.linalg.norm(ref)*np.linalg.norm(src))))
            valid=[v for v in values if v is not None]
            rows.append({"id":r["id"],"name":r["name"],"cohort":r["cohort"],"correlation":float(np.mean(valid)) if len(valid)>=8 else None,"patches":values})
        summary={}
        for cohort in ["calibration","validation","development"]:
            rr=[r for r in rows if r["cohort"]==cohort]
            values=[r["correlation"] for r in rr if r["correlation"] is not None]
            summary[cohort]={"count":len(rr),"measured":len(values),"median":float(np.median(values)) if values else None}
        results.append({"key":candidate["key"],"family":candidate["family"],"summary":summary,"rows":rows})
        print(data["set"],candidate["key"],candidate["family"],summary,flush=True)
    out.write_text(json.dumps({"schema":1,"status":"texture-diagnostic-only","set":data["set"],"geometryHash":digest(gb),"toolHash":digest(Path(__file__).read_bytes()),"patches":PATCHES,"scope":"Low-pass, plane-detrended, normalized grayscale correlation on fixed side-rail patches at fitted geometry. No color fit or local shifts. Low-signal patches remain explicit. This measures texture similarity separately from boundary alignment; poor phase agreement cannot certify an asset match.","results":results},indent=2)+"\n")

if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("directory");p.add_argument("geometry");p.add_argument("cache");p.add_argument("output");a=p.parse_args();run(a.directory,a.geometry,a.cache,a.output)
