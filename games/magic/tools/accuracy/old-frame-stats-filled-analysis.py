# Fixed-position filled-ink diagnostic. Requires Pillow, NumPy and SciPy.
import json,hashlib,sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,grey_opening,grey_erosion,shift
assert len(sys.argv)==3, 'Use PRODUCTION_STATS_STUDY_DIRECTORY OUTPUT_JSON'
S,O=map(Path,sys.argv[1:])
d=json.loads((S/'study.json').read_text());rows=[r for r in d['rows'] if r['status']=='measured']
refs=[];masks={}
for r in rows:
 a=np.asarray(Image.open(S/r['scanFile']).convert('RGB'),float)
 g=gaussian_filter(a@np.array([.2126,.7152,.0722]),.5)
 refs.append(np.clip((g-grey_opening(g,size=(9,9))-8)/50,0,1)*np.clip((g-165)/45,0,1))
 for p in d['parameters']:
  a=np.asarray(Image.open(S/(r['id']+'-'+p['id']+'.png')).convert('RGBA').resize((80,42),Image.Resampling.BILINEAR),float)[:,:,3]/255
  masks.setdefault(p['id'],[]).append(gaussian_filter(a,.5))
refs=np.stack(refs);masks={k:np.stack(v) for k,v in masks.items()}
def score(b):
 return 2*np.sum(refs*b,axis=(1,2))/(np.sum(refs*refs,axis=(1,2))+np.sum(b*b,axis=(1,2))+1e-9)
before=score(masks['released']);after=score(masks['selected'])
controls={}
for dx,dy in [(2,0),(-2,0),(0,2),(0,-2)]:
 controls[str((dx,dy))]=float(score(shift(masks['selected'],(0,dy,dx),order=1,mode='constant',prefilter=False)).mean())
controls['hollow']=float(score(masks['selected']-grey_erosion(masks['selected'],size=(1,3,3))).mean())
def summary(idx):
 a=before[idx];b=after[idx];diff=b-a
 return {'count':len(a),'before':float(a.mean()),'after':float(b.mean()),'gain':float(diff.mean()),'regressions':int((diff<-.02).sum()),'worstGain':float(diff.min())}
groups={k:summary(np.array([r['cohort']==k for r in rows])) for k in ['calibration','validation','reused-development']}
groups['all']=summary(np.ones(len(rows),bool))
out={'scope':'Final fixed native production footer positions: no fitting or post-render shifts. Same source-only scan poses and name cohorts. Validation was inspected for a prior provisional component fit, so this is a repeated component check, not an untouched release holdout. Negative controls deliberately use incorrect shape or 2px shifts.','source':{'study':hashlib.sha256((S/'study.json').read_bytes()).hexdigest(),'analysis':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},'groups':groups,'negativeControls':controls,'rows':[{**r,'before':float(before[i]),'after':float(after[i]),'gain':float(after[i]-before[i])} for i,r in enumerate(rows)]}
O.write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:out[k] for k in ['groups','negativeControls']},indent=2))
