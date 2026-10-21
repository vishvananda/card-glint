"""Registration-tolerant filled-ink experiment; keeps fixed native glyph masks."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('native');p.add_argument('masks');p.add_argument('output');a=p.parse_args();native=Path(a.native);masks=Path(a.masks);raw=(masks/'capture.json').read_bytes();d=json.loads(raw);assert d['completed']==302
sha=lambda b:hashlib.sha256(b).hexdigest()
assert sha((native/'capture.json').read_bytes())==d['source']['nativeCaptureHash']
def load(f,h):
 b=f.read_bytes();assert sha(b)==h
 return np.asarray(Image.open(f).convert('RGBA'),dtype=float)
def lum(i):return i[:,:,:3]@np.array([.2126,.7152,.0722])
def shift(v,s):
 lo=int(np.floor(s));f=s-lo;h,w=v.shape;q=np.pad(v,((lo+1,0),(lo+1,0)))
 return (1-f)**2*q[1:1+h,1:1+w]+f*(1-f)*(q[:h,1:1+w]+q[1:1+h,:w])+f*f*q[:h,:w]
def blur(v):
 q=np.pad(v,((1,1),(0,0)),mode='edge');v=.2389943*q[:-2]+.5220114*q[1:-1]+.2389943*q[2:];q=np.pad(v,((0,0),(1,1)),mode='edge');return .2389943*q[:,:-2]+.5220114*q[:,1:-1]+.2389943*q[:,2:]
def cdf(v):
 v=np.clip(np.round(v),0,255).astype(np.int64);return np.cumsum(np.bincount(v,minlength=256))/len(v)
gray=np.arange(100.,211.,5.);offsets=np.arange(0.,1.51,.25);rows=[]
for ix,row in enumerate(d['rows']):
 scan=load(native/(row['id']+'-scan.png'),row['scanHash']);bg=load(masks/row['assets']['background']['file'],row['assets']['background']['sha256']);original=next(x for x in json.loads((native/'capture.json').read_bytes())['rows'] if x['id']==row['id']);full=load(native/'candidate'/(row['id']+'.png'),row['controlHash'])
 for role,state in row['states'].items():
  m=load(masks/row['assets'][role]['file'],row['assets'][role]['sha256'])[:,:,3]/255;ys,xs=np.nonzero(m);l=max(0,int(xs.min())-8);r=min(732,int(xs.max())+9);t=max(0,int(ys.min())-8);b=min(1020,int(ys.max())+9);A=m[t:b,l:r];B=lum(bg[t:b,l:r]);R=blur(lum(scan[t:b,l:r]));F=blur(lum(full[t:b,l:r]));h,w=A.shape;q=np.pad(A>0,((6,6),(6,6)));use=np.zeros_like(A,dtype=bool)
  for y in range(13):
   for x in range(13):use|=q[y:y+h,x:x+w]
  target=cdf(R[use]);baseline=float(np.abs(cdf(F[use])-target).sum());alpha=blur(A)[use];n=int(use.sum());errors=[]
  for s in offsets:
   S=shift(A,float(s)*state['transform'][3]);C=blur((B*(1-S)+20.1984*S)*(1-A))[use];values=C[None,:]+gray[:,None]*alpha[None,:];ints=np.clip(np.round(values),0,255).astype(np.int64)+np.arange(len(gray))[:,None]*256;hist=np.bincount(ints.ravel(),minlength=len(gray)*256).reshape(len(gray),256);pred=np.cumsum(hist,axis=1)/n;errors.append(np.abs(pred-target).sum(axis=1).tolist())
  rows.append({'id':row['id'],'name':row['name'],'role':role,'material':row['material'],'cohort':row['cohort'],'baseline':baseline,'errors':errors})
 if (ix+1)%50==0:print('Blurred ink distribution',ix+1,flush=True)
summary={}
for role in ['title','type','artist','stats']:
 rs=[r for r in rows if r['role']==role];e=np.array([r['errors'] for r in rs]);old=np.array([r['baseline'] for r in rs]);cal=np.array([r['cohort']=='calibration' for r in rs]);obj=e[cal].mean(axis=0)+.25*np.maximum(0,e[cal]-old[cal,None,None]).max(axis=0);j,k=np.unravel_index(np.argmin(obj),obj.shape);pred=e[:,j,k];groups={}
 for label,mask in [('all',np.ones(len(rs),bool)),('calibration',cal),('validation',~cal)]:
  groups[label]={'count':int(mask.sum()),'nativeBefore':float(old[mask].mean()),'predictedAfter':float(pred[mask].mean()),'improved':int((pred[mask]<old[mask]).sum()),'regressed':int((pred[mask]>old[mask]).sum()),'worstRegression':float(np.maximum(0,pred[mask]-old[mask]).max())}
 summary[role]={'candidate':{'gray':float(gray[k]),'shadow':float(offsets[j])},'grayBound':k in [0,len(gray)-1],'shadowBound':j in [0,len(offsets)-1],'objective':float(obj[j,k]),'groups':groups}
out={'schema':1,'status':'registration-tolerant-ink-distribution-proposals-needs-native-replay','scope':'All 998 actual filled native masks. A symmetric one-pixel softening reduces print-dot noise in both images. Gray-luminance CDF transport avoids preferring low-contrast ink merely because a glyph is slightly displaced. It is an independent appearance diagnostic, not a structural score or substitute for a native comparison. Calibration names select shared role values; reused validation names only report. No hollow masks, per-card placements or runtime data changes.','source':{'maskCaptureHash':sha(raw),'nativeCaptureHash':d['source']['nativeCaptureHash'],'rendererHash':d['source']['rendererHash'],'profileHash':d['source']['profileHash'],'toolHash':sha(Path(__file__).read_bytes())},'grayValues':gray.tolist(),'shadowValues':offsets.tolist(),'blurKernel':[.2389943,.5220114,.2389943],'summary':summary,'rows':rows};Path(a.output).write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(summary,indent=2))
