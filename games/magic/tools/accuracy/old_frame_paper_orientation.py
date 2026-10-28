"""Check paper orientation without rotating frame geometry or its shadows."""
import sys,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates
from old_frame_geometry import Plate,digest,LUMA
from old_frame_paper_texture import RECT,field,corr

def run(directory,geometry,cache,out):
    directory,geometry,cache,out=map(Path,[directory,geometry,cache,out]);assert not out.exists()
    raw=geometry.read_bytes();g=json.loads(raw);data=json.loads((directory/"inputs.json").read_text())
    x,y,w,h=RECT;references={}
    for r in data["rows"]:
        if r["accepted"]:
            image=np.asarray(Image.open(directory/(r["id"]+".png")).convert("RGB"),dtype=float)[y:y+h,x:x+w]@LUMA
            references[r["id"]]={sigma:field(image,sigma) for sigma in [3,10]}
    results=[]
    for c in g["results"]:
        asset=c["asset"];plate=Plate(Image.open(cache/"objects"/asset["sha256"]),asset["rect"],c["alphaHoleFillRgb"])
        for flip_x,flip_y in [(False,False),(True,False),(False,True),(True,True)]:
            yy,xx=np.mgrid[y:y+h,x:x+w];xx=488-xx if flip_x else xx;yy=1012-yy if flip_y else yy
            tx,ty,sx,sy=c["parameters"];bx,by,bw,bh=plate.rect
            u=(((xx+.5-244-tx)/sx+244-bx)/bw)*plate.width-.5;v=(((yy+.5-340-ty)/sy+340-by)/bh)*plate.height-.5
            gray=np.stack([map_coordinates(plate.rgb[:,:,ch],[v,u],order=1,mode="nearest",prefilter=False) for ch in range(3)],axis=2)@LUMA
            source={sigma:field(gray,sigma) for sigma in [3,10]};rows=[]
            for r in data["rows"]:
                if not r["accepted"] or r["key"]!=c["key"]:continue
                values={str(sigma):corr(references[r["id"]][sigma],source[sigma]) for sigma in [3,10]}
                rows.append({"id":r["id"],"cohort":r["cohort"],"correlations":values})
            summary={}
            for cohort in ["calibration","validation","development"]:
                group=[r for r in rows if r["cohort"]==cohort]
                summary[cohort]={str(sigma):float(np.median(vv)) if (vv:=[r["correlations"][str(sigma)] for r in group if r["correlations"][str(sigma)] is not None]) else None for sigma in [3,10]}
            result={"key":c["key"],"family":c["family"],"flipX":flip_x,"flipY":flip_y,"summary":summary,"rows":rows}
            results.append(result)
        if c["key"] in ["U","G","R","A"]:
            rr=results[-4:]
            print(data["set"],c["key"],c["family"],[(r["flipX"],r["flipY"],r["summary"]["calibration"]) for r in rr],flush=True)
    out.write_text(json.dumps({"schema":1,"status":"paper-orientation-candidates-not-adopted","set":data["set"],"geometryHash":digest(raw),"toolHash":digest(Path(__file__).read_bytes()),"flipCenter":[244,506],"scope":"Interior paper-pattern candidates only. Frame geometry, rims and shadows are not rotated. Calibration/validation names and frozen scan poses unchanged; correlations are gain-normalized diagnostics, not whole-card scores.","results":results},indent=2)+"\n")
if __name__=="__main__":run(*sys.argv[1:])
