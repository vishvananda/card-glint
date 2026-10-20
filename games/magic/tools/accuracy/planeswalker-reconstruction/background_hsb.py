import sys,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from scipy.optimize import least_squares
from model import prepare,sample,read,png
if len(sys.argv)!=4:raise SystemExit('Pass study, cached alternative-assets directory, external output')
study=Path(sys.argv[1]);root=study;alternatives=Path(sys.argv[2]);out=Path(sys.argv[3]);out.mkdir(parents=True,exist_ok=True)
records=prepare(study,out/'registration')['records']
old=json.loads((study/'fit/normalization.json').read_text())
poses={r['id']:r['normalization']['matrix'] for r in old['records']}
assert all(np.array_equal(r['row']['normalization']['matrix'],poses[r['row']['id']]) for r in records)
def hsv(rgb):
 mx=rgb.max(-1);mn=rgb.min(-1);d=mx-mn;s=np.divide(d,mx,out=np.zeros_like(d),where=mx>1e-8);h=np.zeros_like(d)
 for k in range(3):
  mask=(rgb[...,k]==mx)&(d>1e-8)
  h[mask]=((rgb[...,(k+1)%3]-rgb[...,(k+2)%3])[mask]/d[mask]+2*k)%6
 return np.stack([h/6,s,mx],-1)
def rgb(hsv):
 h=hsv[...,0]%1*6;s=hsv[...,1];v=hsv[...,2];i=np.floor(h).astype(int);f=h-i
 p=v*(1-s);q=v*(1-s*f);t=v*(1-s*(1-f));triples=np.stack([np.stack(x,-1) for x in [(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)]],-2)
 return np.take_along_axis(triples,(i%6)[...,None,None],axis=-2)[...,0,:]
def adjust(h,a):
 h=h.astype(np.float64);h[...,0]+=a[0]/360;h[...,1]=np.clip(h[...,1]*a[1],0,1);h[...,2]=np.clip(h[...,2]*a[2],0,1)
 return rgb(h)
sources={'current':read(root/'source/planeswalker_bg.webp')}
for name in ['cc-regular','cc-legacy','mse-mainframe']:
 source=alternatives/(name+'.png');manifest=json.loads((alternatives/'manifest.json').read_text())
 expected=next(row['sha256'] for row in manifest if row['id']==name)
 assert hashlib.sha256(source.read_bytes()).hexdigest()==expected,'Alternative source bytes changed: '+name
 sources[name]=read(source)
report=[];training=[r for r in records if r['row']['cohort']=='calibration']
for name,asset in sources.items():
 prepared=[]
 for r in records:
  iy,ix=r['bgIndex'];uv=r['bgUV'][iy,ix]
  if name=='current':source=r['bgSource'][iy,ix];coverage=1.
  else:
   # Alternative plates use a complete card canvas; the current background
   # texture is placed at this unchanged canonical rectangle.
   x=.03937*488+uv[:,0]*(.92126*488);y=.02531*680+uv[:,1]*(.92126*488*3793/2778)
   sampled=sample(asset,(x+.5)*asset.shape[1]/488-.5,(y+.5)*asset.shape[0]/680-.5)
   source=sampled[:,:3];coverage=float((sampled[:,3]>.98).mean())
  prepared.append(dict(row=r['row'],source=source,hsv=hsv(source),target=r['target'][iy,ix],coverage=coverage))
 train=[r for r in prepared if r['row']['cohort']=='calibration']
 # Equal sample count/card, fixed masks. No pixels are dropped for alternatives.
 fit=least_squares(lambda a:np.concatenate([(adjust(r['hsv'],a)-r['target']).ravel() for r in train]),[0,.8,.9],bounds=([-45,.15,.4],[45,1.6,1.6]),loss='soft_l1',f_scale=.045,max_nfev=55,diff_step=1e-4)
 results=[]
 for r in prepared:
  before=float(abs(r['source']-r['target']).mean()*255);after=float(abs(adjust(r['hsv'],fit.x)-r['target']).mean()*255)
  results.append(dict(id=r['row']['id'],name=r['row']['name'],cohort=r['row']['cohort'],before=before,after=after,coverage=r['coverage']))
 row=dict(asset=name,adjustment=dict(zip(['hueDegrees','saturationScale','brightnessScale'],fit.x)),records=results,meanBefore=float(np.mean([r['before'] for r in results])),meanAfter=float(np.mean([r['after'] for r in results])),reservedAfter=float(np.mean([r['after'] for r in results if r['cohort']=='validation'])))
 report.append(row);print(json.dumps(row),flush=True)
 if name=='current':
  result=asset.copy()
  for y in range(0,result.shape[0],128):result[y:y+128,:,:3]=adjust(hsv(result[y:y+128,:,:3]),fit.x)
  png(out/'planeswalker-bg-U.png',result)
out.joinpath('report.json').write_text(json.dumps(dict(schema=1,scope='Identical frozen unprinted background masks; fixed exterior poses; one HSB adjustment shared across four fitting scans; no per-set/per-card color or geometry; six-scan and two-reserved regional RGB error /255 lower better',records=report),indent=2)+'\n')
