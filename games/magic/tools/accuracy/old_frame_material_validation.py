"""Verify an artifact-only pigment/stock-window proposal on actual native faces."""
import argparse,json,hashlib,copy
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import grey_closing,gaussian_filter
from old_frame_color_distribution import normalize,samples,FRAME,PAPER,lab

def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def fields(image,part):
    if part=="paperClear":
        x,y,w,h=PAPER[0]
        crop=image[y:y+h,x:x+w]
        field=gaussian_filter(grey_closing(crop,size=(11,11,1),mode="nearest"),sigma=(2,2,0),mode="nearest")
        return field[::4,::4].reshape(-1,3)
    return samples(image,FRAME if part=="frame" else PAPER,part)
def color_error(a,b):
    aa,bb=lab(a),lab(b)
    return dict(pairedDeltaE=float(np.linalg.norm(aa-bb,axis=1).mean()*100),
                medianDeltaE=float(np.linalg.norm(np.median(aa,axis=0)-np.median(bb,axis=0))*100),
                lumaSpread=float(np.diff(np.quantile(aa[:,0],[.1,.9]))[0]*100),
                referenceSpread=float(np.diff(np.quantile(bb[:,0],[.1,.9]))[0]*100))
def load_native(directory,capture,id):
    row=next(r for r in capture["rows"] if r["id"]==id)
    p=directory/row["file"];assert digest(p)==row["sha256"]
    return normalize(Image.open(p)),row
def main(directory,output,candidate="candidate-native-v1",profile="candidate-profile-v1.json",paper_refit=False):
    directory,output=map(Path,[directory,output]);assert not output.exists()
    before_dir=directory/"before-native";after_dir=directory/candidate
    source=json.loads((directory/"inputs.json").read_bytes())
    exported=json.loads((directory/"exported/inputs.json").read_bytes())
    before=json.loads((before_dir/"capture.json").read_bytes())
    after=json.loads((after_dir/"capture.json").read_bytes())
    old=json.loads((directory/"before-profile.json").read_bytes())
    new=json.loads((directory/profile).read_bytes())
    expected=copy.deepcopy(new);expected["revision"]=old["revision"]
    expected["frames"]["A"]["stockWindow"]=old["frames"]["A"]["stockWindow"]
    for part in ["frame","paper"]:expected["colors"]["A"]["adjustment"][part]=old["colors"]["A"]["adjustment"][part]
    assert expected==old,"Proposal changed more than artifact clipping and pigment"
    for c in [before,after]:
        assert c["complete"] and not c["faults"]
        assert c["source"]["inputHash"]==digest(directory/"inputs.json")
        assert c["source"]["exportedHash"]==digest(directory/"exported/inputs.json")
    rows=[]
    for e in source["entries"]:
        a,ar=load_native(before_dir,before,e["id"]);b,br=load_native(after_dir,after,e["id"])
        assert ar["inputHash"]==br["inputHash"]
        assert ar["referenceHash"]==br["referenceHash"]==e["reference"]["sha256"]
        x,y,w,h=old["frames"]["A"]["art"]
        x0=int(np.ceil(x*488))+3;y0=int(np.ceil(y*680))+3
        x1=int(np.floor((x+w)*488))-3;y1=int(np.floor((y+h)*680))-3
        art_changed=int(np.count_nonzero(np.any(a[y0:y1,x0:x1]!=b[y0:y1,x0:x1],axis=2)))
        assert art_changed==0,"Artifact color change touched illustration: "+e["name"]
        ref=next(r for r in exported["rows"] if r["id"]==e["id"])
        if not ref["accepted"]:
            rows.append(dict(id=e["id"],name=e["name"],status="rejected-reference",artChanged=0));continue
        file=directory/"exported"/(e["id"]+".png");assert digest(file)==ref["normalizedHash"]
        image=normalize(Image.open(file))
        metrics={part:dict(before=color_error(fields(a,part),fields(image,part)),
                          after=color_error(fields(b,part),fields(image,part))) for part in ["frame","paper","paperClear"]}
        paper_unchanged=bool(np.array_equal(a[435:575,80:408],b[435:575,80:408]))
        if source["set"]=="atq" and not paper_refit:assert paper_unchanged,"Retained ATQ paper changed: "+e["name"]
        rows.append(dict(id=e["id"],name=e["name"],cohort=ref["cohort"],beforeNative=ar["sha256"],
                         afterNative=br["sha256"],referenceHash=e["reference"]["sha256"],
                         metrics=metrics,artChanged=0,paperUnchanged=paper_unchanged))
    cohorts={}
    for co in ["calibration","validation","development"]:
        peers=[r for r in rows if r.get("cohort")==co]
        if not peers:continue
        cohorts[co]={}
        for part in ["frame","paper","paperClear"]:
            a=np.array([r["metrics"][part]["before"]["pairedDeltaE"] for r in peers])
            b=np.array([r["metrics"][part]["after"]["pairedDeltaE"] for r in peers])
            cohorts[co][part]=dict(names=len({r["name"] for r in peers}),before=float(a.mean()),after=float(b.mean()),
                                  improved=int(np.sum(b<a-1e-8)),unchanged=int(np.sum(abs(b-a)<=1e-8)),
                                  worstRegression=float(max(0,np.max(b-a))))
    clip=json.loads((directory/"clip-only-native/capture.json").read_bytes());clip_rows=[]
    for r in clip["rows"]:
        a,ar=load_native(before_dir,before,r["id"]);b,_=load_native(directory/"clip-only-native",clip,r["id"])
        delta=np.any(a!=b,axis=2);yy,xx=np.mgrid[:680,:488]
        ox,oy,ow,oh=old["frames"]["A"]["stockWindow"]
        nx,ny,nw,nh=new["frames"]["A"]["stockWindow"]
        # Include one canonical pixel for raster antialiasing at each clipping edge.
        bands=(((xx>=min(ox,nx)*488-1)&(xx<=max(ox,nx)*488+1))|
               ((xx>=min(ox+ow,nx+nw)*488-1)&(xx<=max(ox+ow,nx+nw)*488+1))|
               ((yy>=min(oy,ny)*680-1)&(yy<=max(oy,ny)*680+1))|
               ((yy>=min(oy+oh,ny+nh)*680-1)&(yy<=max(oy+oh,ny+nh)*680+1)))
        outside=int(np.count_nonzero(delta&~bands));assert outside==0,"Clip-only control moved content"
        side=bands&(yy>=80)&(yy<600)&((xx<30)|(xx>458))
        white_before=int(np.count_nonzero(side&(a.min(2)>.94)))
        white_after=int(np.count_nonzero(side&(b.min(2)>.94)))
        assert white_after<=white_before
        clip_rows.append(dict(id=r["id"],name=r["name"],changedPixels=int(delta.sum()),changedOutsideBoundary=outside,
                              whiteSidePixelsBefore=white_before,whiteSidePixelsAfter=white_after,
                              meanSideBrightnessBefore=float(a[side].mean()*255),meanSideBrightnessAfter=float(b[side].mean()*255)))
    result=dict(schema=1,status="native-artifact-color-and-clipping-review-not-whole-set-approval",set=source["set"],
                sources={name:digest(directory/name) for name in ["inputs.json","poses.json","before-profile.json",profile,
                         "before-native/capture.json",candidate+"/capture.json","clip-only-native/capture.json","exported/inputs.json"]},
                method=dict(tool=digest(__file__),color=digest(Path(__file__).with_name("old_frame_color_distribution.py")),
                            scope="Real native full faces and fixed normalized scans. Existing words, typography, art rectangle and all nonartifact profile data are unchanged. Artifact illustration interiors must be byte-identical. Clip-only controls may change only stock-window boundary bands. Color fields use equal clamped filtering; paperClear uses an additional 11px closing to exclude lettering while the original 3px paper diagnostic is retained; every printing and outlier remains reported."),
                cohorts=cohorts,rows=rows,clipControls=clip_rows)
    output.write_text(json.dumps(result,indent=2)+"\n")
    print(json.dumps(dict(cohorts=cohorts,clipControls=clip_rows)),flush=True)

if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__);p.add_argument("directory");p.add_argument("output")
    p.add_argument("--candidate",default="candidate-native-v1");p.add_argument("--profile",default="candidate-profile-v1.json");p.add_argument("--paper-refit",action="store_true")
    a=p.parse_args();main(a.directory,a.output,a.candidate,a.profile,a.paper_refit)
