"""Only top-right contour curvature; position, left edge and shadow are fixed."""
from pathlib import Path
import json,sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,spline_filter,map_coordinates
from scipy.signal import find_peaks
from scipy.optimize import least_squares

def contour(path,large):
 a=np.asarray(Image.open(path).convert('RGB'),float)/255;g=spline_filter(gaussian_filter(a@np.array([.2126,.7152,.0722]),1.1),order=3);scale=a.shape[1]/488;ty=(.49044 if large else .55793)*680+5
 def values(xs,ys):return map_coordinates(g,[(ys+.5)*scale-.5,(xs+.5)*scale-.5],order=3,prefilter=False,mode='nearest')
 ys=np.arange(ty-9,ty+9,.1);xs=np.arange(90,390,3.);profiles=np.array([values(np.full_like(ys,x),ys) for x in xs]);v=np.median(profiles,axis=0);dy=np.gradient(v,.1);ids,_=find_peaks(dy,height=.10,distance=12)
 if not len(ids):return None
 k=max(ids,key=lambda k:dy[k]);top=ys[k]
 xs=np.arange(449,467,.1);ys2=np.arange(top+18,top+29,1.);v=np.median(np.array([values(xs,np.full_like(xs,y)) for y in ys2]),axis=0);dx=-np.gradient(v,.1);ids,_=find_peaks(dx,height=.10,distance=12)
 if not len(ids):return None
 k=max(ids,key=lambda k:dx[k]);right=xs[k]
 points=[]
 for d in np.arange(3,27,.5):
  x=right-d;ys=np.arange(top-.3,top+20,.1);v=values(np.full_like(ys,x),ys);dy=np.gradient(v,.1);ids,_=find_peaks(dy,height=.10,distance=12)
  if not len(ids):continue
  # First light-face transition after the independently measured straight top.
  # Reject a comparable second boundary rather than fit a set-symbol edge.
  k=ids[0];others=[i for i in ids[1:] if ys[i]-ys[k]<3 and dy[i]>.8*dy[k]]
  if others:continue
  points.append([float(d),float(ys[k]-top)])
 return dict(top=float(top),right=float(right),points=points)
def curve(ds,rx,ry):return ry*(1-np.sqrt(np.clip(ds/rx,0,1)))**2
root=Path(sys.argv[1]);inputs=json.load(open(root/'inputs.json'));rows=[];excluded=[]
for r in inputs['records']:
 path=root/'calibration'/(r['id']+'-aligned.png')
 if not path.exists():continue
 ref=contour(path,r['family']=='tall');base=contour(root/'baseline'/(r['id']+'-full.png'),r['family']=='tall')
 if not ref or not base or len(ref['points'])<15:continue
 bp=np.asarray(base['points']);control=least_squares(lambda v:curve(bp[:,0],*v)-bp[:,1],[14,14],bounds=([8,5],[30,30]),loss='soft_l1',f_scale=.4)
 if max(abs(control.x-np.array([13.5,13.3])))>2 or abs(curve(bp[:,0],*control.x)-bp[:,1]).mean()>.2:
  excluded.append(dict(id=r['id'],name=r['name'],reason='Caliper cannot recover the known 14px baseline corner; bevel/neighbor ambiguity',control=control.x.tolist()));continue
 row=dict(id=r['id'],name=r['name'],palette=r['palette'],family=r['family'],cohort=r['cohort'],reference=ref,baseline=base)
 final=root/'final'/(r['id']+'-full.png')
 if final.exists():row['candidate']=contour(final,r['family']=='tall')
 rows.append(row)
train=[r for r in rows if r['cohort']=='calibration'];
def residual(v,items):return np.concatenate([(curve(np.array(r['reference']['points'])[:,0],v[0]-.5,v[1]-.7)-np.array(r['reference']['points'])[:,1])/np.sqrt(len(r['reference']['points'])) for r in items])
fit=least_squares(lambda v:residual(v,train),[14,14],bounds=([12,10],[22,30]),loss='soft_l1',f_scale=.15)
result=dict(schema=1,scope='Top-right light-face curve only. Independently remove straight-top/right-edge offsets for shape diagnosis; renderer position, text, left edge and shadow remain untouched. First signed transition; ambiguous probes excluded. One shared quadratic corner.',radiusX=float(fit.x[0]),radiusY=float(fit.x[1]),cards=len(rows),calibrationCards=len(train),excluded=excluded,records=rows)
for label,v in [('before',[14,14]),('fit',fit.x)]:
 result[label]={c:float(np.mean([abs(residual(v,[r])).mean()*np.sqrt(len(r['reference']['points'])) for r in rows if r['cohort']==c])) for c in ['calibration','validation']}
actual={}
for kind in ['baseline','candidate']:
 values=[]
 for r in rows:
  if not r.get(kind):continue
  a=np.asarray(r['reference']['points']);b=np.asarray(r[kind]['points']);ds=np.intersect1d(a[:,0],b[:,0])
  if len(ds)<15:continue
  values.append(float(abs(np.interp(ds,a[:,0],a[:,1])-np.interp(ds,b[:,0],b[:,1])).mean()))
 actual[kind]=dict(cards=len(values),meanError=float(np.mean(values)))
result['nativeCurveReplay']=actual
print(json.dumps({k:v for k,v in result.items() if k not in ['records','excluded']}));(root/'calibration/corner-fit.json').write_text(json.dumps(result,indent=2)+'\n')
