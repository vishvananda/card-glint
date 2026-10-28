"""Measure shared expansion-symbol geometry on frozen normalized scans."""
import argparse, json, hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, map_coordinates
from scipy.optimize import minimize

def digest(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def layer(path):
    im = Image.open(path).convert("RGBA").resize((488, 680), Image.Resampling.LANCZOS)
    v = np.asarray(im, dtype=float) / 255
    alpha = v[:, :, 3]
    gray = v[:, :, :3] @ [0.2126, 0.7152, 0.0722]
    return gaussian_filter(alpha, .55), gaussian_filter(alpha * gray, .55)

def scan(path):
    im = Image.open(path).convert("RGB")
    assert im.size == (488, 680)
    return gaussian_filter(np.asarray(im, dtype=float) @ [0.2126, .7152, .0722] / 255, .55)

def warp(v, p, x, y, anchor):
    dx, dy, sx, sy = p
    return map_coordinates(v, [anchor[1] + (y-anchor[1]-dy)/(1+sy/100),
                               anchor[0] + (x-anchor[0]-dx)/(1+sx/100)],
                           order=1, mode="constant", cval=0)

def evaluate(data, p):
    alpha, gray, x, y, ref, anchor = data
    a, g = [warp(v, p, x, y, anchor) for v in (alpha, gray)]
    design = np.stack([g, a, 1-a, (1-a)*(x-anchor[0])/25,
                       (1-a)*(y-anchor[1])/20], axis=1)
    weights = np.ones(len(a))
    for _ in range(3):
        w = np.sqrt(weights)
        coeff = np.linalg.lstsq(design*w[:, None], ref*w, rcond=None)[0]
        residual = design@coeff-ref
        weights = 1/np.sqrt(1+(residual/.035)**2)
    loss = float(np.mean(.035**2*(np.sqrt(1+(residual/.035)**2)-1)))
    coverage = a > .9
    if np.any(coverage):
        fg = coeff[0]*g[coverage]+coeff[1]
        contrast = float(np.sqrt(np.mean((fg-coeff[2])**2)))
    else:
        contrast = 0.
    return dict(loss=loss, contrast=contrast, coefficients=coeff.tolist())

def fit(data):
    starts = [(evaluate(data, [dx,dy,0,0])["loss"], [dx,dy,0,0])
              for dx in [-2,0,2] for dy in [-2,0,2]]
    start = min(starts,key=lambda p:p[0])[1]
    bounds = [(-5,5),(-5,5),(-20,25),(-20,25)]
    result = minimize(lambda p:evaluate(data,p)["loss"], start, method="Powell",
                      bounds=bounds,options=dict(maxiter=50,xtol=.02,ftol=1e-5))
    after = evaluate(data,result.x)
    boundary = any(v <= lo+.1 or v >= hi-.1
                   for v,(lo,hi) in zip(result.x,bounds))
    return dict(parameters=result.x.tolist(), before=evaluate(data,[0,0,0,0]),
                after=after, accepted=bool(not boundary and after["contrast"]>.045),
                boundary=bool(boundary), converged=bool(result.success))

def make_data(alpha, gray, reference, anchor):
    yy,xx = np.nonzero(alpha>.05)
    assert len(xx)>20
    # Fixed support, including surrounding paper. Candidate ink never defines it.
    y,x = np.mgrid[max(374,yy.min()-4):min(410,yy.max()+5),
                   max(365,xx.min()-4):min(451,xx.max()+5)]
    assert x.size>150
    return alpha,gray,x.ravel(),y.ravel(),reference[y.ravel(),x.ravel()],anchor

def main(template_dir, inputs_file, exported_dir, output):
    template_dir,inputs_file,exported_dir,output=map(Path,[template_dir,inputs_file,exported_dir,output])
    assert not output.exists()
    t=json.loads((template_dir/"templates.json").read_bytes())
    inputs=json.loads(inputs_file.read_bytes())
    exported=json.loads((exported_dir/"inputs.json").read_bytes())
    assert digest(inputs_file)==t["source"]["inputHash"]==exported["inputHash"]
    rows=[];data_by_id={}
    for row in t["rows"]:
        ref=next(r for r in exported["rows"] if r["id"]==row["id"])
        assert ref["accepted"]
        native=template_dir/row["file"];assert digest(native)==row["sha256"]
        refpath=exported_dir/(row["id"]+".png");assert digest(refpath)==ref["normalizedHash"]
        m=row["placement"]["matrix"];args=row["placement"]["args"]
        assert len(args)==4 and abs(m[1])+abs(m[2])<1e-8 and abs(m[0]-m[3])<1e-8
        x,y,w,h=args
        right=(m[0]*(x+w)+m[4])/1.5;cy=(m[3]*(y+h/2)+m[5])/1.5
        width=w*m[0]/1.5;height=h*m[3]/1.5
        a,g=layer(native);data=make_data(a,g,scan(refpath),(right,cy));data_by_id[row["id"]]=data
        measured=fit(data)
        dx,dy,sx,sy=measured["parameters"]
        geometry=dict(right=right+dx,centerY=cy+dy,width=width*(1+sx/100),height=height*(1+sy/100))
        rows.append({**row,"nativeBounds":[right,cy,width,height],"geometry":geometry,**measured})
        print(inputs["set"],row["name"],measured["accepted"],geometry,flush=True)
    selected=[r for r in rows if r["accepted"] and r["cohort"]=="calibration"]
    assert len(selected)>=3
    geometry={k:float(np.median([r["geometry"][k] for r in selected]))
              for k in ["right","centerY","width","height"]}
    # Quarter-pixel values keep the submitted profile understandable.
    rounded={k:round(v*4)/4 for k,v in geometry.items()}
    for row in rows:
        r,cy,w,h=row["nativeBounds"]
        p=[rounded["right"]-r,rounded["centerY"]-cy,
           (rounded["width"]/w-1)*100,(rounded["height"]/h-1)*100]
        row["shared"]=evaluate(data_by_id[row["id"]],p)
    summary={}
    for cohort in ["calibration","validation"]:
        peer=[r for r in rows if r["cohort"]==cohort]
        summary[cohort]=dict(count=len(peer),accepted=sum(r["accepted"] for r in peer),
                            before=float(np.mean([r["before"]["loss"] for r in peer])),
                            after=float(np.mean([r["shared"]["loss"] for r in peer])),
                            improved=sum(r["shared"]["loss"]<r["before"]["loss"] for r in peer))
    result=dict(schema=1,status="symbol-geometry-development-candidate-not-adopted",set=inputs["set"],
                source=dict(templates=digest(template_dir/"templates.json"),inputs=digest(inputs_file),
                            exported=digest(exported_dir/"inputs.json"),tool=digest(__file__)),
                method="Native RGBA coverage/luminance template, fixed surrounding paper, robust foreground transfer and background plane. Per-reference geometry is measurement only. One calibration-cohort median is replayed on validation names. Frozen affine scan poses are unchanged.",
                proposed=rounded,unrounded=geometry,summary=summary,rows=rows)
    output.write_text(json.dumps(result,indent=2)+"\n")
    print(json.dumps(dict(proposed=rounded,summary=summary)),flush=True)

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ["templates","inputs","exported","output"]:parser.add_argument(name)
    args=parser.parse_args()
    main(args.templates,args.inputs,args.exported,args.output)
