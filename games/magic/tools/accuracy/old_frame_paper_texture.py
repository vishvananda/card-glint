"""Paper-pattern diagnostics after shared frame geometry; no pigment adoption."""
import sys,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,grey_closing,map_coordinates
from old_frame_geometry import Plate,digest,LUMA

RECT=(80,435,330,150)
YELLOW_BLUE=np.array([1.,.5,-1.5])
def field(gray,sigma):
    im=gaussian_filter(grey_closing(gray,size=(7,7),mode="nearest"),sigma,mode="nearest")
    yy,xx=np.mgrid[:im.shape[0],:im.shape[1]];xx=xx-xx.mean();yy=yy-yy.mean()
    im=im-im.mean();im-=xx*np.sum(im*xx)/np.sum(xx*xx);im-=yy*np.sum(im*yy)/np.sum(yy*yy)
    return im
def corr(a,b):
    n=np.linalg.norm(a)*np.linalg.norm(b)
    return float(np.sum(a*b)/n) if n>1 and np.std(a)>.25 and np.std(b)>.25 else None
def signals(rgb):
    return {kind:{sigma:field(rgb@weights,sigma).astype(np.float32) for sigma in [3,10]}
        for kind,weights in [("luma",LUMA),("yellowBlue",YELLOW_BLUE)]}
def run(directory,geometry,cache,out):
    directory,geometry,cache,out=map(Path,[directory,geometry,cache,out]);assert not out.exists()
    tool_hash=digest(Path(__file__).read_bytes());raw=geometry.read_bytes();g=json.loads(raw);data=json.loads((directory/"inputs.json").read_text());assert digest((directory/"inputs.json").read_bytes())==g["inputHash"]
    x,y,w,h=RECT;references={}
    for r in data["rows"]:
        if not r["accepted"]:continue
        rb=(directory/(r["id"]+".png")).read_bytes();assert digest(rb)==r["normalizedHash"]
        im=np.asarray(Image.open(directory/(r["id"]+".png")).convert("RGB"),dtype=float)[y:y+h,x:x+w]
        references[r["id"]]=signals(im)
    results=[]
    for c in g["results"]:
        a=c["asset"];p=c["parameters"];source_bytes=(cache/"objects"/a["sha256"]).read_bytes();assert digest(source_bytes)==a["sha256"]
        plate=Plate(Image.open(cache/"objects"/a["sha256"]),a["rect"],c["alphaHoleFillRgb"])
        yy,xx=np.mgrid[y:y+h,x:x+w];tx,ty,sx,sy=p;bx,by,bw,bh=plate.rect
        u=(((xx+.5-244-tx)/sx+244-bx)/bw)*plate.width-.5;v=(((yy+.5-340-ty)/sy+340-by)/bh)*plate.height-.5
        rgb=np.stack([map_coordinates(plate.rgb[:,:,ch],[v,u],order=1,mode="nearest",prefilter=False) for ch in range(3)],axis=2)
        source=signals(rgb);rows=[]
        for r in data["rows"]:
            if not r["accepted"] or r["key"]!=c["key"]:continue
            values={kind:{str(sigma):corr(references[r["id"]][kind][sigma],source[kind][sigma]) for sigma in [3,10]} for kind in source}
            rows.append({"id":r["id"],"cohort":r["cohort"],"correlations":values})
        summary={}
        for cohort in ["calibration","validation","development"]:
            group=[r for r in rows if r["cohort"]==cohort]
            summary[cohort]={kind:{str(sigma):float(np.median(values)) if (values:=[r["correlations"][kind][str(sigma)] for r in group if r["correlations"][kind][str(sigma)] is not None]) else None for sigma in [3,10]} for kind in source}
        results.append({"key":c["key"],"family":c["family"],"sourceSignalStd":{kind:{str(k):float(np.std(v)) for k,v in ss.items()} for kind,ss in source.items()},"summary":summary,"rows":rows})
        print(data["set"],c["key"],c["family"],summary,flush=True)
    assert digest(Path(__file__).read_bytes())==tool_hash
    out.write_text(json.dumps({"schema":2,"status":"paper-pattern-diagnostic-only","set":data["set"],"geometryHash":digest(raw),"toolHash":tool_hash,"rect":RECT,"directions":{"luma":LUMA.tolist(),"yellowBlue":YELLOW_BLUE.tolist()},"scope":"Seven-pixel closing suppresses glyph depressions; plane-detrended normalized correlations compare paper patterns at 3/10px scales. Luma and fixed yellow-blue chroma remain separate: pigmentation can reverse luminance without reversing texture location. A negative luma score alone cannot reject an asset. No fitted color axes, local translation, HSB adoption or native accuracy certification. Low-signal values remain explicit.","results":results},indent=2)+"\n")
if __name__=="__main__":run(*sys.argv[1:])
