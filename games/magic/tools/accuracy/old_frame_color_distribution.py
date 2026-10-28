"""Shared HSV/white-balance fits with spatial and color-spread safeguards.

Uses clean native material controls and frozen reference cohorts. No renderer
pixels, scan poses or source assets are modified.
"""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
import scipy
import PIL
from PIL import Image
from scipy.ndimage import gaussian_filter,grey_closing,map_coordinates
from scipy.optimize import least_squares

FRAME=[(34,y,10,h) for y,h in [(110,50),(210,50),(310,40)]]+[(444,y,10,h) for y,h in [(110,50),(210,50),(310,40)]]
PAPER=[(80,435,328,140)]
Q=np.array([.05,.25,.5,.75,.95])
def digest(b):return hashlib.sha256(b).hexdigest()
def lab(rgb):
    a=np.asarray(rgb);a=np.where(a<=.04045,a/12.92,((a+.055)/1.055)**2.4)
    lms=a@np.array([[.4122214708,.2119034982,.0883024619],[.5363325363,.6806995451,.2817188376],[.0514459929,.1073969566,.6299787005]])
    return np.cbrt(lms)@np.array([[.2104542553,1.9779984951,.0259040371],[.793617785,-2.428592205,.7827717662],[-.0040720468,.4505937099,-.808675766]])
def hsv(rgb):
    r,g,b=np.asarray(rgb).T;v=np.max(rgb,axis=1);d=v-np.min(rgb,axis=1);den=np.where(d==0,1,d)
    h=np.where(v==r,(g-b)/den,np.where(v==g,(b-r)/den+2,(r-g)/den+4))*60
    return np.mod(np.where(d==0,0,h),360),np.divide(d,v,out=np.zeros_like(d),where=v!=0),v
def apply(rgb,p,prepared=None):
    h,s,v=hsv(rgb) if prepared is None else prepared
    hue=np.mod(h+p[0],360)/60;sr=s*np.exp(p[1]);vr=np.power(v,np.exp(p[3]))*np.exp(p[2])
    value=np.minimum(1,vr);c=value*np.minimum(1,sr);x=c*(1-np.abs(np.mod(hue,2)-1));m=value-c;zero=np.zeros_like(c)
    r=np.select([hue<1,hue<2,hue<3,hue<4,hue<5],[c,x,zero,zero,x],default=c)
    g=np.select([hue<1,hue<2,hue<3,hue<4,hue<5],[x,c,c,x,zero],default=zero)
    b=np.select([hue<1,hue<2,hue<3,hue<4,hue<5],[zero,zero,x,c,c],default=x)
    gains=np.exp([p[4],p[5],-p[4]-p[5]]);raw=(np.stack([r,g,b],axis=1)+m[:,None])*gains
    out=np.clip(raw,0,1);out[v<.075]=rgb[v<.075]
    overflow=np.maximum(0,raw-1).sum(1)+np.maximum(0,sr-1)+np.maximum(0,vr-1)
    return out,overflow
def parameters(a):
    gains=np.array(a.get("rgbScale",[1,1,1]));mean=np.exp(np.log(gains).mean())
    return np.array([a["hueDegrees"],np.log(a["saturationScale"]),np.log(a["brightnessScale"]*mean),np.log(a.get("valueGamma",1)),np.log(gains[0]/mean),np.log(gains[1]/mean)])
def adjustment(p):
    return {"hueDegrees":float(p[0]),"saturationScale":float(np.exp(p[1])),"brightnessScale":float(np.exp(p[2])),"valueGamma":float(np.exp(p[3])),"rgbScale":np.exp([p[4],p[5],-p[4]-p[5]]).tolist()}
def fit(rgb,target,initial):
    p0=parameters(initial);prepared=hsv(rgb);tl=lab(target);tq=np.quantile(tl,Q,axis=0);ts=tl.std(0)
    lower=np.array([max(-180,p0[0]-45),np.log(.03),np.log(.4),np.log(.5),-.2,-.2])
    upper=np.array([min(180,p0[0]+45),np.log(3),np.log(2),np.log(2),.2,.2])
    p0=np.clip(p0,lower+1e-8,upper-1e-8)
    def residual(p):
        out,overflow=apply(rgb,p,prepared);ol=lab(out)
        return np.r_[((ol-tl)*100/np.sqrt(len(rgb))).ravel(),
            ((np.quantile(ol,Q,axis=0)-tq)*70/np.sqrt(len(Q))).ravel(),
            (ol.std(0)-ts)*50,
            overflow*100/np.sqrt(len(rgb)),
            (p-p0)*np.array([.0005,.02,.02,.02,.02,.02])]
    starts=[p0]
    low=p0.copy();low[1]=np.log(min(.3,np.exp(low[1])));out,_=apply(rgb,low);ratio=np.median(target,axis=0)/np.maximum(.01,np.median(out,axis=0));mean=np.exp(np.log(ratio).mean());low[2]+=np.log(mean);low[4]+=np.log(ratio[0]/mean);low[5]+=np.log(ratio[1]/mean);starts.append(np.clip(low,lower+1e-8,upper-1e-8))
    runs=[least_squares(residual,start,bounds=(lower,upper),max_nfev=100,ftol=1e-7,xtol=1e-7,gtol=1e-7) for start in starts]
    best=min(runs,key=lambda r:np.sum(residual(r.x)**2))
    return best.x,{"objective":float(np.sum(residual(best.x)**2)),"evaluations":int(best.nfev),"converged":bool(best.success)}
def normalize(image):
    a=np.asarray(image.convert("RGB"),dtype=float)/255
    if image.size==(488,680):return a
    assert image.size==(732,1020)
    yy,xx=np.mgrid[:680,:488];u=(xx+.5)*1.5-.5;v=(yy+.5)*1.5-.5
    return np.floor(np.stack([map_coordinates(a[:,:,c]*255,[v,u],order=1,mode="nearest",prefilter=False) for c in range(3)],axis=2)+.5)/255
def samples(image,windows,part):
    values=[]
    for x,y,w,h in windows:
        crop=image[y:y+h,x:x+w]
        # Equal, clamped filtering on both materials and median reference fields.
        clean=grey_closing(crop,size=(3,3,1),mode="nearest")
        filtered=gaussian_filter(clean,sigma=(2,2,0),mode="nearest")
        step=4 if part=="paper" else 1
        values.append(filtered[::step,::step].reshape(-1,3))
    return np.concatenate(values)
def measures(source,target,p):
    changed,overflow=apply(source,p);a,b=lab(changed),lab(target)
    return {"pairedDeltaE":float(100*np.linalg.norm(a-b,axis=1).mean()),
        "medianDeltaE":float(100*np.linalg.norm(np.median(a,axis=0)-np.median(b,axis=0))),
        "lumaSpread":float(100*np.diff(np.quantile(a[:,0],[.1,.9]))[0]),
        "targetLumaSpread":float(100*np.diff(np.quantile(b[:,0],[.1,.9]))[0]),
        "chromaSpread":(100*a[:,1:].std(0)).tolist(),"targetChromaSpread":(100*b[:,1:].std(0)).tolist(),
        "clipping":float(np.mean(overflow>1e-6))}
def run(directory,controls,initial,out,family="mse-old",materials="WUBRGMA"):
    directory,controls,initial,out=map(Path,[directory,controls,initial,out]);assert not out.exists()
    rb=(directory/"inputs.json").read_bytes();data=json.loads(rb);nb=(controls/"capture.json").read_bytes();capture=json.loads(nb);ib=initial.read_bytes();init=json.loads(ib)
    assert capture["complete"] and not capture["faults"];assert capture["source"]["exportedHash"]==digest(rb)
    assert len(capture["rows"])<=13,"Use one clean control per material"
    tool=digest(Path(__file__).read_bytes());results=[]
    for control in capture["rows"]:
        key=control["key"]
        if key not in list(materials):continue
        group=[r for r in data["rows"] if r["accepted"] and r["key"]==key]
        cohorts={c:[r for r in group if r["cohort"]==c] for c in ["calibration","validation"]}
        if min(map(len,cohorts.values()))<3:continue
        reference={}
        for cohort,rr in cohorts.items():
            stack=[]
            for r in rr:
                f=directory/(r["id"]+".png");raw=f.read_bytes();assert digest(raw)==r["normalizedHash"];stack.append(np.asarray(Image.open(f).convert("RGB"),dtype=np.float32)/255)
            reference[cohort]=np.median(np.stack(stack),axis=0)
        b=(controls/control["file"]).read_bytes();assert digest(b)==control["sha256"];source=normalize(Image.open(controls/control["file"]))
        previous=next(r for r in init["results"] if r["key"]==key and r["family"]==family)
        parts={}
        for part,windows in [("frame",FRAME),("paper",PAPER)]:
            src=samples(source,windows,part);targets={c:samples(v,windows,part) for c,v in reference.items()}
            # Dark keylines have a separate black-point fit; they cannot drive HSB.
            support=(np.max(src,axis=1)>.15)&(np.max(targets["calibration"],axis=1)>.15)
            assert support.sum()>=100
            src=src[support];targets={c:v[support] for c,v in targets.items()}
            old=previous["parts"][part]["adjustment"];p,optimization=fit(src,targets["calibration"],old)
            parts[part]={"adjustment":adjustment(p),"optimization":optimization,"support":int(support.sum()),
                "cohorts":{c:{"names":len(set(r["name"] for r in cohorts[c])),"before":measures(src,v,parameters(old)),"after":measures(src,v,p)} for c,v in targets.items()}}
            print(data["set"],key,part,parts[part]["cohorts"],flush=True)
        results.append({"key":key,"family":family,"controlId":control["id"],"parts":parts})
        out.write_text(json.dumps({"schema":1,"status":"running","results":results},indent=2)+"\n")
    assert tool==digest(Path(__file__).read_bytes())
    out.write_text(json.dumps({"schema":1,"status":"texture-aware-pigment-proposals-not-adopted","set":data["set"],"source":{"references":digest(rb),"cleanNativeControls":digest(nb),"initial":digest(ib),"tool":tool,"numpy":np.__version__,"scipy":scipy.__version__,"pillow":PIL.__version__},
        "scope":"Six shared parameters per set/material/part: hue, saturation, value gain/exponent and two geometric-mean-normalized white-balance gains. Median frozen cohort rasters suppress text; equal clamped 3px closing and 2px blur precede fixed sampling. Calibration alone selects transforms; validation names are unchanged. Fixed colored-texture support excludes dark keylines for a separate black-point fit. Paired Oklab residual, marginal quantiles and spread oppose a flat median-only match. Nonbasic/basic land variants are excluded. No source image changes or scan-specific transforms. Native verification remains required.",
        "windows":{"frame":FRAME,"paper":PAPER},"results":results},indent=2)+"\n")
if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    for name in ["directory","controls","initial","output"]:p.add_argument(name)
    p.add_argument("--family", default="mse-old")
    p.add_argument("--materials", default="WUBRGMA")
    a=p.parse_args();run(a.directory,a.controls,a.initial,a.output,a.family,a.materials)
