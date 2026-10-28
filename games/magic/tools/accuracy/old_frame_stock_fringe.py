"""Detect opaque white source stock leaking through a black-border aperture."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label,map_coordinates

def outer_white(image):
    rgba=np.asarray(image.convert("RGBA"))
    white=(rgba[:,:,3]>=250)&(rgba[:,:,:3].min(2)>=240)&(np.ptp(rgba[:,:,:3].astype(int),axis=2)<=15)
    components,_=label(white)
    edge=np.unique(np.r_[components[0,:],components[-1,:],components[:,0],components[:,-1]])
    edge=edge[edge!=0]
    return np.isin(components,edge)&white

def fringe_area(mask,frame,window):
    y,x=np.mgrid[:680,:488]
    fx,fy,fw,fh=np.asarray(frame)*[488,680,488,680]
    wx,wy,ww,wh=np.asarray(window)*[488,680,488,680]
    # Cell coverage separates a fractional clipping edge from an entire pixel.
    cover=np.maximum(0,np.minimum(x+1,wx+ww)-np.maximum(x,wx))*np.maximum(0,np.minimum(y+1,wy+wh)-np.maximum(y,wy))
    sx=(x+.5-fx)/fw*mask.shape[1]-.5;sy=(y+.5-fy)/fh*mask.shape[0]-.5
    sampled=map_coordinates(mask.astype(float),[sy,sx],order=1,mode="constant",cval=0)
    # Straight side strips are independent of rounded card corners and artwork.
    region=(y>=80)&(y<600)&((x<40)|(x>=448))
    value=sampled*cover*region
    return dict(total=float(value.sum()),left=float(value[:,:40].sum()),right=float(value[:,448:].sum()))

def main(image_file,before_file,after_file,out):
    image_file,before_file,after_file,out=map(Path,[image_file,before_file,after_file,out]);assert not out.exists()
    before=json.loads(before_file.read_bytes());after=json.loads(after_file.read_bytes())
    assert before["border"]==after["border"]=="black"
    mask=outer_white(Image.open(image_file))
    values={}
    for key,p in [("before",before),("after",after)]:
        f=p["frames"]["A"];values[key]=fringe_area(mask,f["frame"],f["stockWindow"])
    result=dict(schema=1,status="source-stock-fringe-measurement",
                source={name:hashlib.sha256(p.read_bytes()).hexdigest() for name,p in [("image",image_file),("before",before_file),("after",after_file),("tool",Path(__file__))]},
                scope="Opaque near-white pixels connected to the source perimeter; transparent art holes and enclosed light frame paper are excluded. Inverse source mapping and fractional aperture coverage estimate exposed source-stock area in canonical straight side strips. No scan pixels or per-card fit are used.",
                values=values)
    out.write_text(json.dumps(result,indent=2)+"\n");print(json.dumps(values))

if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    for name in ["image","before","after","output"]:p.add_argument(name)
    a=p.parse_args();main(a.image,a.before,a.after,a.output)
