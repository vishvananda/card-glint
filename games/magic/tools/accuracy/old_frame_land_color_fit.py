"""Source-local land paper fits, including both endpoints of each gradient."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import grey_closing,gaussian_filter,map_coordinates
from scipy.optimize import least_squares
from old_frame_color_distribution import normalize,apply,hsv,lab,parameters,adjustment,fit,measures

def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def clean(v):return gaussian_filter(grey_closing(v,size=(11,11,1),mode="nearest"),sigma=(2,2,0),mode="nearest")
def metrics(pred,target):
    a,b=lab(pred),lab(target)
    return dict(pairedDeltaE=float(np.linalg.norm(a-b,axis=1).mean()*100),
                medianDeltaE=float(np.linalg.norm(np.median(a,axis=0)-np.median(b,axis=0))*100),
                lumaSpread=float(np.diff(np.quantile(a[:,0],[.1,.9]))[0]*100),
                targetLumaSpread=float(np.diff(np.quantile(b[:,0],[.1,.9]))[0]*100))

def initial(rgb,target):
    sh,ss,sv=hsv(rgb);th,ts,tv=hsv(target)
    # Circular hue estimate; explicit source-local initialization avoids using
    # a blue-source correction on a white-source gradient plate.
    h=float((np.median(th)-np.median(sh)+180)%360-180)
    return dict(hueDegrees=h,saturationScale=float(np.clip(np.median(ts)/max(.02,np.median(ss)),.03,3)),
                brightnessScale=float(np.clip(np.median(tv)/max(.02,np.median(sv)),.4,2)))

def fit_gradient(rgb,target,t):
    left=t<.27;right=t>.73
    assert min(left.sum(),right.sum())>50
    seed=np.r_[parameters(initial(rgb[left],target[left])),parameters(initial(rgb[right],target[right]))]
    lower=np.tile([-180,np.log(.03),np.log(.4),np.log(.65),-.2,-.2],2)
    upper=np.tile([180,np.log(3),np.log(2),np.log(1.6),.2,.2],2)
    seed=np.clip(seed,lower+1e-7,upper-1e-7)
    prepared=hsv(rgb);target_lab=lab(target)
    def predict(p):
        a,oa=apply(rgb,p[:6],prepared);b,ob=apply(rgb,p[6:],prepared)
        return a*(1-t[:,None])+b*t[:,None],oa+ob
    def residual(p):
        out,overflow=predict(p)
        # Paired fields preserve the gradient and texture. RGB endpoint gains
        # are regularized toward a single scalar gain, avoiding tinted whites.
        return np.r_[((lab(out)-target_lab)*100/np.sqrt(len(rgb))).ravel(),
                     overflow*70/np.sqrt(len(rgb)),
                     (p-seed)*np.tile([.0005,.02,.02,.1,.15,.15],2)]
    result=least_squares(residual,seed,bounds=(lower,upper),max_nfev=150,ftol=1e-7,xtol=1e-7,gtol=1e-7)
    return result.x,dict(converged=bool(result.success),evaluations=int(result.nfev),objective=float(np.sum(residual(result.x)**2)))

def main(inputs_file,exported_dir,controls_dir,profile_file,output):
    inputs_file,exported_dir,controls_dir,profile_file,output=map(Path,[inputs_file,exported_dir,controls_dir,profile_file,output])
    assert not output.exists()
    inputs=json.loads(inputs_file.read_bytes());exported=json.loads((exported_dir/"inputs.json").read_bytes())
    assert exported["inputHash"]==digest(inputs_file)
    cap=json.loads((controls_dir/"capture.json").read_bytes())
    control_profiles=json.loads((controls_dir/"profiles.json").read_bytes())
    control_profile=control_profiles["mse-old"]
    profile=json.loads(profile_file.read_bytes());assert profile["set"]==inputs["set"]=="ons"
    rows=[];proposals={}
    yy,xx=np.mgrid[435:575:4,80:408:4];x=xx.ravel();y=yy.ravel()
    for key in ["L-red"]+list(dict.fromkeys(profile["landMaterials"].values())):
        names=[name for name,value in profile["landMaterials"].items() if value==key]
        entries=[e for e in inputs["entries"] if e["material"]=="L" and
                 ((key=="L-red" and e["name"] not in profile["landMaterials"] and not e["card"]["type_line"].startswith("Basic Land")) or e["name"] in names)]
        entries=[e for e in entries if next(r for r in exported["rows"] if r["id"]==e["id"])["accepted"]]
        if not entries:continue
        framekey="L" if key=="L-red" else key
        desired=profile["frames"][framekey]
        asset=desired["assetKey"]
        sourcekey="L" if asset=="cl" else asset[0].upper()+"L"
        control=next(r for r in cap["rows"] if r["key"]==sourcekey)
        oldframe=control_profile["frames"]["L" if sourcekey=="L" else "L-"+sourcekey[0]]
        assert oldframe["assetKey"]==asset
        file=controls_dir/control["file"];assert digest(file)==control["sha256"]
        source=normalize(Image.open(file))
        old=np.array(oldframe["frame"])*[488,680,488,680]
        new=np.array(desired["frame"])*[488,680,488,680]
        # Reuse clean native source pixels, remapped to the named land's plate.
        sx=old[0]+(xx-new[0])/new[2]*old[2]
        sy=old[1]+(yy-new[1])/new[3]*old[3]
        rgb=np.stack([map_coordinates(clean(source)[:,:,c],[sy,sx],order=1,mode="nearest").ravel() for c in range(3)],axis=1)
        refs=[]
        for e in entries:
            r=next(r for r in exported["rows"] if r["id"]==e["id"])
            f=exported_dir/(e["id"]+".png");assert digest(f)==r["normalizedHash"]
            refs.append((e,r["cohort"],clean(normalize(Image.open(f)))[y,x]))
        calibration=[v for e,co,v in refs if co=="calibration"] or [v for e,co,v in refs]
        target=np.median(calibration,axis=0)
        a=profile["colors"][key]["adjustment"];gradient=len(key)==4 and key.startswith("L-")
        if gradient:
            left,_,width,_=a["regions"][0]["mask"]["rect"]
            native_left=new[0]+left*new[2];native_width=width*new[2]
            t=np.clip((x-native_left)/native_width,0,1)
            p,opt=fit_gradient(rgb,target,t)
            proposal=dict(paper=adjustment(p[:6]),right=adjustment(p[6:]))
            before=apply(rgb,parameters(a["paper"]))[0]*(1-t[:,None])+apply(rgb,parameters(a["regions"][0]["adjustment"]))[0]*t[:,None]
            after=apply(rgb,p[:6])[0]*(1-t[:,None])+apply(rgb,p[6:])[0]*t[:,None]
        else:
            p,opt=fit(rgb,target,initial(rgb,target))
            proposal=dict(paper=adjustment(p))
            before=apply(rgb,parameters(a["paper"]))[0];after=apply(rgb,p)[0]
        observations=[dict(id=e["id"],name=e["name"],cohort=co,before=metrics(before,ref),after=metrics(after,ref)) for e,co,ref in refs]
        proposals[key]=proposal
        rows.append(dict(key=key,sourceAsset=asset,controlHash=control["sha256"],sourceFrame=oldframe["frame"],targetFrame=desired["frame"],
                         optimization=opt,scope="Independent names" if len(set(e["name"] for e,co,v in refs))>=6 else "Sparse printing class: reused development field; no independent-name validation",
                         observations=observations))
        print(key,[(r["name"],r["before"]["pairedDeltaE"],r["after"]["pairedDeltaE"]) for r in observations],flush=True)
    output.write_text(json.dumps(dict(schema=1,status="source-local-land-paper-proposals-not-adopted",set="ons",
        source=dict(inputs=digest(inputs_file),exported=digest(exported_dir/"inputs.json"),controls=digest(controls_dir/"capture.json"),controlProfiles=digest(controls_dir/"profiles.json"),profile=digest(profile_file),tool=digest(__file__)),
        method="Clean native material pixels remapped between explicit source rectangles; fixed paper field with equal 11px closing and 2px blur removes printed ink. Single colors use source-local HSV/gamma/WB. Each two-color gradient fits both transforms to the SAME source bitmap, using the actual linear mask in source coordinates. Cohort medians select ordinary neutral land paper; sparse printed treatments remain development measurements. Frozen scan poses are unchanged.",
        proposals=proposals,rows=rows),indent=2)+"\n")

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    for name in ["inputs","exported","controls","profile","output"]:parser.add_argument(name)
    a=parser.parse_args();main(a.inputs,a.exported,a.controls,a.profile,a.output)
