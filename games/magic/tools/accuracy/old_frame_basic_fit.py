"""Fit isolated basic-icon coverage independently of foreground/background color."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,map_coordinates
from scipy.optimize import minimize

def digest(b):return hashlib.sha256(b).hexdigest()
def native_alpha(file):
    im=Image.open(file).convert("RGBA");a=np.asarray(im,dtype=float)[:,:,3]/255
    if im.size==(488,680):return a
    assert im.size==(732,1020)
    yy,xx=np.mgrid[:680,:488]
    return map_coordinates(a,[(yy+.5)*1.5-.5,(xx+.5)*1.5-.5],order=1,mode="nearest")
def image_rgb(file):
    im=Image.open(file).convert("RGB");assert im.size==(488,680)
    return gaussian_filter(np.asarray(im,dtype=float)/255,sigma=(.65,.65,0))
def warp(alpha,p,x,y,center):
    dx,dy,sx,sy=p
    return map_coordinates(alpha,[
        center[1]+(y-center[1]-dy)/(1+sy/100),
        center[0]+(x-center[0]-dx)/(1+sx/100)],order=1,mode="constant",cval=0)
def evaluate(alpha,rgb,p,center=(244,507.5),step=2):
    yy,xx=np.mgrid[415:602:step,118:370:step];x=xx.ravel();y=yy.ravel()
    a=warp(alpha,p,x,y,center);v=rgb[y,x]
    design=np.stack([a,1-a,(1-a)*(x-244)/120,(1-a)*(y-507.5)/90],axis=1)
    weights=np.ones(len(a))
    for _ in range(3):
        w=np.sqrt(weights)[:,None]
        coeff=np.linalg.lstsq(design*w,v*w,rcond=None)[0]
        residual=design@coeff-v
        error=np.linalg.norm(residual,axis=1)
        weights=1/np.sqrt(1+(error/.035)**2)
    # Fixed robust loss, with all surrounding paper retained: shrinking a mask
    # cannot hide unmatched glyph ink by removing pixels from the denominator.
    loss=float(np.mean(.035**2*(np.sqrt(1+(error/.035)**2)-1)))
    contrast=float(np.linalg.norm(coeff[0]-coeff[1]))
    return {"loss":loss,"foreground":coeff[0].tolist(),"background":coeff[1].tolist(),"contrast":contrast}
def fitted(alpha,rgb,center=(244,507.5)):
    alpha=gaussian_filter(alpha,.55)
    starts=[(evaluate(alpha,rgb,[dx,dy,0,0],center)["loss"],[dx,dy,0,0]) for dx in [-3,0,3] for dy in [-3,0,3]]
    start=min(starts,key=lambda z:z[0])[1]
    run=minimize(lambda p:evaluate(alpha,rgb,p,center)["loss"],start,method="Powell",
        bounds=[(-8,8),(-8,8),(-20,30),(-20,30)],options={"maxiter":35,"xtol":.015,"ftol":1e-6})
    before=evaluate(alpha,rgb,[0,0,0,0],center);after=evaluate(alpha,rgb,run.x,center)
    boundary=any(v<=lo+.1 or v>=hi-.1 for v,(lo,hi) in zip(run.x,[(-8,8),(-8,8),(-20,30),(-20,30)]))
    valid=not boundary and after["contrast"]>.08 and all(-.03<=v<=1.03 for v in after["foreground"])
    return {"parameters":run.x.tolist(),"before":before,"after":after,"accepted":bool(valid),
        "searchBoundary":bool(boundary),"converged":bool(run.success)}
def main(templates,inputs,exported,out):
    templates,inputs,exported,out=map(Path,[templates,inputs,exported,out]);assert not out.exists()
    tb=(templates/"templates.json").read_bytes();t=json.loads(tb);ib=inputs.read_bytes();data=json.loads(ib)
    eb=(exported/"inputs.json").read_bytes();refs=json.loads(eb)
    assert t["source"]["inputHash"]==digest(ib)==refs["inputHash"]
    rows=[];groups={}
    for template in t["rows"]:
        raw=(templates/template["file"]).read_bytes();assert digest(raw)==template["glyphHash"]
        core=template.get("alphaCore")
        if core:assert digest((templates/core["file"]).read_bytes())==core["sha256"]
        alpha=native_alpha(templates/(core["file"] if core else template["file"]))
        m=template["placement"]["matrix"];x,y,w,h=template["placement"]["args"]
        center=((m[0]*(x+w/2)+m[2]*(y+h/2)+m[4])/1.5,(m[1]*(x+w/2)+m[3]*(y+h/2)+m[5])/1.5)
        peer=[e for e in data["entries"] if e["name"]==template["name"]]
        selected=[(e,next(r for r in refs["rows"] if r["id"]==e["id"])) for e in peer]
        for e,r in selected:
            if not r["accepted"]:continue
            f=exported/(e["id"]+".png");assert digest(f.read_bytes())==r["normalizedHash"]
            fit=fitted(alpha,image_rgb(f),center)
            print(e["id"],template["color"],fit,flush=True)
            rows.append({"id":e["id"],"name":e["name"],"number":e["card"]["collector_number"],
                "color":template["color"],"referenceHash":e["reference"]["sha256"],"normalizedHash":r["normalizedHash"],**fit})
        rr=[r for r in rows if r["color"]==template["color"] and r["accepted"]]
        if len(rr)<2:
            groups[template["color"]]={"accepted":len(rr),"status":"insufficient-stable-measurements"}
            continue
        parameters=np.median([r["parameters"] for r in rr],axis=0)
        inks=np.median([r["after"]["foreground"] for r in rr],axis=0)
        shared=[]
        for e,r in selected:
            if not r["accepted"]:continue
            rgb=image_rgb(exported/(e["id"]+".png"))
            before=evaluate(gaussian_filter(alpha,.55),rgb,[0,0,0,0],center)
            after=evaluate(gaussian_filter(alpha,.55),rgb,parameters,center)
            shared.append({"id":e["id"],"beforeLoss":before["loss"],"afterLoss":after["loss"],"foreground":after["foreground"]})
        groups[template["color"]]={"accepted":len(rr),"total":sum(r["accepted"] for _,r in selected),
            "sharedParameters":parameters.tolist(),"sourceKey":core["key"] if core else None,"ink":np.clip(inks,0,1).tolist(),"source":template["sourceUrl"],
            "sharedReplay":shared}
        print(template["color"],groups[template["color"]],flush=True)
    out.write_text(json.dumps({"schema":1,"status":"basic-icon-shape-and-ink-proposals-not-adopted",
        "source":{"templates":digest(tb),"inputs":digest(ib),"references":digest(eb),"tool":digest(Path(__file__).read_bytes())},
        "scope":"Actual native alpha templates and frozen normalized scans. Bounded per-reference shape measurements solve foreground ink and a paper RGB plane with robust linear fits. Only per-color medians are proposed for rendering. Three/four basic-art printings per name are development evidence, not independent-name validation. No scan poses change.",
        "groups":groups,"rows":rows},indent=2)+"\n")
if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    for name in ["templates","inputs","exported","output"]:p.add_argument(name)
    a=p.parse_args();main(a.templates,a.inputs,a.exported,a.output)
