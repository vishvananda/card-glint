"""Fit shared filled ink and shadow offsets against fixed native glyph coverage."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
parser=argparse.ArgumentParser();parser.add_argument('native');parser.add_argument('masks');parser.add_argument('output');args=parser.parse_args()
native=Path(args.native);masks=Path(args.masks);raw=(masks/'capture.json').read_bytes();capture=json.loads(raw);assert capture['completed']==302 and capture['status']=='native-profile-ink-masks-complete';old=json.loads((native/'capture.json').read_bytes());assert capture['source']['nativeCaptureHash']==hashlib.sha256((native/'capture.json').read_bytes()).hexdigest();assert capture['source']['rendererHash']==old['source']['rendererHash'];source={'maskCaptureHash':hashlib.sha256(raw).hexdigest(),'nativeCaptureHash':capture['source']['nativeCaptureHash'],'rendererHash':capture['source']['rendererHash'],'profileHash':capture['source']['profileHash'],'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
sha=lambda b:hashlib.sha256(b).hexdigest()
def load(file,h=None):
 b=Path(file).read_bytes()
 if h:assert sha(b)==h
 return np.asarray(Image.open(Path(file)).convert('RGBA'),dtype=np.float64)
def shifted(a,s,method):
 if method!='bilinear':s=float(np.floor(s) if method=='floor' else np.floor(s+.5))
 lo=int(np.floor(s));f=s-lo;h,w=a.shape;p=np.pad(a,((lo+1,0),(lo+1,0)));v=(1-f)**2*p[1:1+h,1:1+w]+f*(1-f)*(p[:h,1:1+w]+p[1:1+h,:w])+f*f*p[:h,:w]
 return v
# A fixed support covers every allowed shadow and survives source/color differences.
def support(a):
 result=a>0
 out=result.copy();h,w=a.shape
 p=np.pad(result,((6,6),(6,6)))
 for dy in range(13):
  for dx in range(13):out|=p[dy:dy+h,dx:dx+w]
 return out
shadow=np.array([23.,20.,15.]);observations=[];methods={k:[] for k in ['bilinear','floor','nearest']};shadows=np.array([0,.25,.5,.75,1,1.25,1.5,1.75,2.]);grays=np.arange(90.,221.)
for i,row in enumerate(capture['rows']):
 parent=next(r for r in old['rows'] if r['id']==row['id']);actual=load(native/'candidate'/(row['id']+'.png'),row['controlHash']);ref=load(native/(row['id']+'-scan.png'),row['scanHash']);bg=load(masks/row['assets']['background']['file'],row['assets']['background']['sha256'])
 assert np.array_equal(actual[:,:,3],bg[:,:,3])
 for role,state in row['states'].items():
  asset=row['assets'][role];plane=load(masks/asset['file'],asset['sha256']);a=plane[:,:,3]/255.;ys,xs=np.nonzero(a);assert len(xs)>0
  l=max(0,int(xs.min())-8);r=min(732,int(xs.max())+9);t=max(0,int(ys.min())-8);b=min(1020,int(ys.max())+9)
  a=a[t:b,l:r];B=bg[t:b,l:r,:3];R=ref[t:b,l:r,:3];native_rgb=actual[t:b,l:r,:3];valid=support(a)&(actual[t:b,l:r,3]>0);n=int(valid.sum())*3
  assert n>0 and state['trim']==0
  A=a[:,:,None];base_shadow=state['shadow']*state['transform'][3]
  native_mse=float(np.mean((native_rgb[valid]-R[valid])**2));composite_errors={}
  # Baseline reconstruction is diagnostic, never relabeled native parity.
  for method in methods:
   S=shifted(a,base_shadow,method)[:,:,None];C=B*(1-S)+shadow*S;P=np.round(C*(1-A)+state['gray']*A);err=float(np.mean((P[valid]-native_rgb[valid])**2));methods[method].append(err);composite_errors[method]=err
  record={'id':row['id'],'name':row['name'],'material':row['material'],'cohort':row['cohort'],'role':role,'supportPixels':n//3,'nativeBaselineMse':native_mse,'compositeMse':composite_errors,'gray':state['gray'],'shadow':state['shadow'],'models':{}}
  for method in methods:
   values=[]
   for offset in shadows:
    S=shifted(a,float(offset)*state['transform'][3],method)[:,:,None];C=(B*(1-S)+shadow*S)*(1-A);E=R-C
    aa=float(np.broadcast_to(A*A,E.shape)[valid].sum()/n);ae=float((E*A)[valid].sum()/n);ee=float((E*E)[valid].sum()/n)
    values.append([aa,ae,ee])
   record['models'][method]=values
  observations.append(record)
 if (i+1)%50==0:print('Native ink observations',i+1,flush=True)
method=min(methods,key=lambda k:float(np.mean(methods[k])))
# Native reconstruction selects the interpolation model only; scan validation does not.
summary={'reconstruction':{k:{'rmse':float(np.sqrt(np.mean(v))),'worstRmse':float(np.sqrt(max(v)))} for k,v in methods.items()},'method':method,'roles':{}}
for role in ['title','type','artist','stats']:
 records=[r for r in observations if r['role']==role];coeff=np.array([r['models'][method] for r in records]);errors=coeff[:,:,0,None]*grays[None,None,:]**2-2*coeff[:,:,1,None]*grays[None,None,:]+coeff[:,:,2,None];errors=np.maximum(0,errors);cal=np.array([r['cohort']=='calibration' for r in records]);assert cal.any();baseline=np.array([r['nativeBaselineMse'] for r in records]);objective=errors[cal].mean(axis=0)+.25*np.maximum(0,errors[cal]-baseline[cal,None,None]).max(axis=0);j,k=np.unravel_index(np.argmin(objective),objective.shape);candidate={'gray':float(grays[k]),'shadow':float(shadows[j])};pred=errors[:,j,k]
 groups={}
 for label,mask in [('all',np.ones(len(records),bool)),('calibration',cal),('validation',~cal)]+[(m,np.array([r['material']==m for r in records])) for m in sorted({r['material'] for r in records})]:
  if not mask.any():continue
  groups[label]={'count':int(mask.sum()),'nativeBeforeRmse':float(np.sqrt(baseline[mask].mean())),'predictedAfterRmse':float(np.sqrt(pred[mask].mean())),'improved':int((pred[mask]<baseline[mask]).sum()),'regressed':int((pred[mask]>baseline[mask]).sum()),'worstMseRegression':float(np.maximum(0,pred[mask]-baseline[mask]).max())}
 per_material={}
 for m in sorted({r['material'] for r in records}):
  mask=cal&np.array([r['material']==m for r in records])
  if not mask.any():continue
  local=errors[mask].mean(axis=0)+.25*np.maximum(0,errors[mask]-baseline[mask,None,None]).max(axis=0);a,b=np.unravel_index(np.argmin(local),local.shape);per_material[m]={'count':int(mask.sum()),'gray':float(grays[b]),'shadow':float(shadows[a]),'objective':float(local[a,b])}
 summary['roles'][role]={'status':'predicted-shared-ink-candidate-needs-native-replay','candidate':candidate,'grayBound':k in [0,len(grays)-1],'shadowBound':j in [0,len(shadows)-1],'objective':float(objective[j,k]),'groups':groups,'perMaterialDiagnostic':per_material,'rows':[{'id':r['id'],'name':r['name'],'material':r['material'],'cohort':r['cohort'],'beforeMse':r['nativeBaselineMse'],'predictedMse':float(pred[n]),'compositeRmse':float(np.sqrt(r['compositeMse'][method]))} for n,r in enumerate(records)]}
out={'schema':1,'status':'native-mask-shared-filled-ink-proposals','scope':'All 302 fixed Original scan poses and 998 actual native filled glyph masks (including 92 P/T fields). Gray and shadow offsets are selected using calibration names only; validation is reused development evidence. No hollow/outline candidate or per-card ink/layout is introduced. Predictions use a measured compositing model and require actual full native replay before adoption. RGB RMSE measures appearance, not a compliance score. Material diagnostics are not renderer overrides.','source':source,'shadowColor':[23,20,15],'shadows':shadows.tolist(),'grayBounds':[90,220],'selection':'Mean calibration MSE plus one quarter of its worst regression against the actual native baseline; scan validation never selects values. Interpolation mode is selected using native reconstruction alone.','summary':summary}
Path(args.output).write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({k:{'candidate':v['candidate'],'bound':[v['grayBound'],v['shadowBound']],'all':v['groups']['all'],'perMaterial':v['perMaterialDiagnostic']} for k,v in summary['roles'].items()},indent=2));print('Reconstruction',summary['reconstruction'])
