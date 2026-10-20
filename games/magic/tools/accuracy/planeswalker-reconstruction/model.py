"""Shared, local-only blue planeswalker material reconstruction.

Scans retain native pixels. Affine poses use disjoint exterior rails, never the
type box. Source alpha/geometry stays fixed for the background; type geometry is
a bounded shared smooth warp. No per-card color, asset or renderer adjustments.
"""
import json, hashlib, os
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, gaussian_filter1d, map_coordinates, binary_dilation, binary_erosion, grey_closing, distance_transform_edt, sobel
from scipy.optimize import least_squares
import torch
import torch.nn.functional as F

torch.set_num_threads(2)
def read(p):return np.asarray(Image.open(p).convert('RGBA'),dtype=np.float32)/255
def png(p,a):Image.fromarray(np.round(np.clip(a,0,1)*255).astype(np.uint8)).save(p)
def save(p,v):p.write_text(json.dumps(v,indent=2)+'\n')
def sample(a,x,y):
    return np.stack([map_coordinates(a[...,k],[y,x],order=1,mode='nearest') for k in range(a.shape[2])],-1)
def tensor(a):return torch.tensor(np.asarray(a),dtype=torch.float32)
def raster(a):return tensor(a).permute(2,0,1)[None]
def grid(x,y,w=732,h=1020):return np.stack([2*(x+.5)/w-1,2*(y+.5)/h-1],-1).astype('float32')
def lookup(a,g):return F.grid_sample(a,g[None],align_corners=False,padding_mode='border')[0].permute(1,2,0)
def canonical(a):
    yy,xx=np.mgrid[:680,:488];return sample(a,(xx+.5)*a.shape[1]/488-.5,(yy+.5)*a.shape[0]/680-.5)
def gray(a):return a[...,:3]@np.array([.2126,.7152,.0722])
def peak(a,axis,along,lo,hi,sign,expected=None):
    p=a
    values=p[max(0,along-4):along+5,lo:hi+1].mean(0) if axis==0 else p[lo:hi+1,max(0,along-4):along+5].mean(1)
    gradient=np.gradient(gaussian_filter1d(values,.65))*sign
    ids=np.flatnonzero((gradient[1:-1]>=gradient[:-2])&(gradient[1:-1]>gradient[2:])&(gradient[1:-1]>max(.012,gradient.max()*.24)))+1
    if len(ids)==0:return None
    if expected is None:i=ids[0] if sign>0 else ids[-1]
    else:i=min(ids,key=lambda k:abs(lo+k-expected))
    d=gradient[i-1]-2*gradient[i]+gradient[i+1]
    return lo+i+(.5*(gradient[i-1]-gradient[i+1])/d if abs(d)>1e-8 else 0)
def pose(reference,baseline):
    a=canonical(reference);b=canonical(baseline);a=np.maximum(a[...,2]-a[...,0],a[...,1]-a[...,0]);b=np.maximum(b[...,2]-b[...,0],b[...,1]-b[...,0]);points=[]
    specs=[('left',0,12,29,1,range(100,611,17)),('right',0,459,477,-1,range(100,611,17)),('top',1,12,34,1,range(75,416,13)),('bottom',1,611,645,-1,list(range(75,191,10))+list(range(305,376,10)))]
    for side,axis,lo,hi,sign,positions in specs:
      for i,t in enumerate(positions):
        if axis==0 and 367<t<436:continue
        bp=peak(b,axis,t,lo,hi,sign);rp=peak(a,axis,t,lo,hi,sign,bp)
        if bp is not None and rp is not None:
          points.append((axis,rp if axis==0 else t,t if axis==0 else rp,bp,side,i%2))
    train=[p for p in points if p[-1]==0];valid=[p for p in points if p[-1]==1]
    def residual(v,rows):
      m=np.array([[1+v[0],v[1],v[2]],[v[3],1+v[4],v[5]]]);return np.array([m[axis]@np.array([x,y,1])-target for axis,x,y,target,side,k in rows])
    fit=least_squares(lambda v:residual(v,train),np.zeros(6),loss='soft_l1',f_scale=.35,bounds=([-.025,-.012,-7,-.012,-.025,-7],[.025,.012,7,.012,.025,7]))
    v=fit.x;m=np.array([[1+v[0],v[1],v[2]],[v[3],1+v[4],v[5]],[0,0,1]])
    errors=residual(v,valid);rms=float(np.sqrt(np.mean(errors**2)))
    sides={s:float(np.sqrt(np.mean(residual(v,[p for p in valid if p[4]==s])**2))) for s,_,_,_,_,_ in specs}
    accepted=rms<1.2 and max(sides.values())<1.7 and all(sum(p[4]==s for p in train)>=6 for s in sides)
    return dict(matrix=m.tolist(),accepted=bool(accepted),validationRms=rms,sideRms=sides,points=len(points),fitPoints=len(train),validationPoints=len(valid),scope='Exterior rails only; type box, text, symbols and art excluded')


CX,CY,CW,CH=20,372,450,64

def prepare(root,out):
    ROOT=Path(root);OUT=Path(out);OUT.mkdir(parents=True,exist_ok=True)
    inputs=json.loads((ROOT/'inputs.json').read_text());records=[]
    receipt=json.loads((ROOT/'native/receipt.json').read_text())
    assert hashlib.sha256((ROOT/'native-inputs.json').read_bytes()).hexdigest()==receipt['inputSha256'],'Native snapshot changed'
    for file,expected in receipt['rasters'].items():
        assert hashlib.sha256((ROOT/'native'/file).read_bytes()).hexdigest()==expected,'Native raster changed: '+file
    for group,asset in inputs['assets'].items():
        assert hashlib.sha256((ROOT/'source'/(group+'.webp')).read_bytes()).hexdigest()==asset['sha256'],'Source asset changed'
    type_full=read(ROOT/'native/typeAsset.png')
    # A small, explicit asset coordinate rectangle around the complete type box and
    # its soft down-left shadow. It includes space for a <=3px shared shape warp.
    CX,CY,CW,CH=20,372,450,64
    x0,y0,cw,ch=int(CX*1.5),int(CY*1.5),int(CW*1.5),int(CH*1.5)
    old_type=type_full[y0:y0+ch,x0:x0+cw]
    png(OUT/'type-before.png',old_type)
    rng=np.random.default_rng(1903)
    for row in inputs['records']:
      assert hashlib.sha256((ROOT/'scans'/f"{row['id']}.png").read_bytes()).hexdigest()==row['reference']['sha256'], 'Reference bytes changed'
      bgblack=read(ROOT/'native'/f"{row['id']}-bgBlack.png")[...,:3];bgwhite=read(ROOT/'native'/f"{row['id']}-bgWhite.png")[...,:3];bguv=read(ROOT/'native'/f"{row['id']}-bgUV.png")[...,:3]
      weight=np.clip((bgwhite-bgblack).mean(-1),0,1);uv=(bguv-bgblack)/np.maximum(weight[...,None],.02)
      ref=read(ROOT/'scans'/f"{row['id']}.png")
      baseline=read(ROOT/'native'/f"{row['id']}-baseline.png")
      under=read(ROOT/'native'/f"{row['id']}-underType.png")
      registration=pose(ref,baseline);row['normalization']=registration
      print(json.dumps(dict(phase='normalization',name=row['name'],**registration)),flush=True)
      if not registration['accepted']:continue
      yy,xx=np.mgrid[:ref.shape[0],:ref.shape[1]];sx=(xx+.5)*488/ref.shape[1]-.5;sy=(yy+.5)*680/ref.shape[0]-.5
      m=np.asarray(registration['matrix']);x=m[0,0]*sx+m[0,1]*sy+m[0,2];y=m[1,0]*sx+m[1,1]*sy+m[1,2]
      bx,by=(x+.5)*1.5-.5,(y+.5)*1.5-.5
      base=sample(baseline,bx,by)[...,:3];back=sample(under,bx,by)[...,:3]
      g=grid(bx-x0,by-y0,cw,ch)
      plate=sample(old_type,bx-x0,by-y0)
      clean=back*(1-plate[...,3:])+plate[...,:3]*plate[...,3:]
      content=np.max(abs(clean-base),-1)>.045
      ink=(grey_closing(gray(ref),size=(11,11))-gray(ref)>.10)&(x>41)&(x<437)&(y>390)&(y<416)
      mask=(x>CX+2)&(x<CX+CW-2)&(y>CY+2)&(y<CY+CH-2)
      mask&=binary_dilation(plate[...,3]>.025,iterations=3)
      mask&=~binary_dilation(content|ink,iterations=3)
      mask&=~((x>41)&(x<360)&(y>390)&(y<417))
      mask&=(y<423)
      mask&=~((x>408)&(x<459)&(y>391)&(y<418))
      # Mean lowpass target in native scan pixels; no resampling of reference data.
      target=gaussian_filter(ref[...,:3],(.8,.8,0))
      bw=sample(weight[...,None],bx,by)[...,0]
      guv=sample(uv,bx,by)[...,:2]
      bmask=(bw>.98)&(y>80)&(y<610)&~((y>367)&(y<436))
      bmask&=(x>15)&(x<474)&(ref[...,:3].max(-1)>.09)
      bmask=binary_erosion(bmask,iterations=1)
      debug=ref[...,:3]*.25;debug[mask|bmask]=ref[mask|bmask,:3];png(OUT/(row['id']+'-mask.png'),debug)
      def choose(mask,count):
        iy,ix=np.where(mask);idx=rng.choice(len(iy),min(count,len(iy)),replace=False);return iy[idx],ix[idx]
      ti=choose(mask,10000);bi=choose(bmask,9000)
      bgbase=sample(bgblack,bx,by)
      src=(back-bgbase)/np.maximum(bw[...,None],.02)
      r=dict(row=row,reference=ref,target=target,baseline=base,under=back,x=x,y=y,typeGrid=g,typeMask=mask,bgMask=bmask,bgWeight=bw,bgUV=guv,bgSource=src,typeIndex=ti,bgIndex=bi)
      records.append(r)
      # Full native-coordinate replay should preserve the independent type layer.
      parity=np.max(abs(clean-base),-1);check=(plate[...,3]>.99)&~binary_dilation(content,iterations=4)
      print(json.dumps(dict(phase='coverage',name=row['name'],typePixels=int(mask.sum()),backgroundPixels=int(bmask.sum()),typeReplayP99=float(np.quantile(parity[check],.99)) if check.any() else None)),flush=True)
    save(OUT/'normalization.json',dict(schema=1,records=[{k:v for k,v in r.items() if k!='card'} for r in inputs['records']],excluded=inputs['excluded']))

    return dict(inputs=inputs,records=records,old_type=old_type)
