"""Shared family registration of the light-face contour, with signed transitions.
Ambiguous/ink probes are reported, never turned into nearest-edge overlap wins.
"""
import sys,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,map_coordinates,spline_filter
from scipy.signal import find_peaks

def boundary(path,family):
 a=np.asarray(Image.open(path).convert('RGB'),float)/255;g=spline_filter(gaussian_filter(a@np.array([.2126,.7152,.0722]),1.1),order=3)
 top=(1037 if family=='tall' else 1175)/2100*680
 specs=[('top',np.arange(55,430,2.),np.arange(top-2,top+12,.1),1),('bottom',np.arange(55,400,2.),np.arange(top+32,top+38.5,.1),-1),('left',np.arange(top+14,top+26,.5),np.arange(24,38,.1),1),('right',np.arange(top+14,top+26,.5),np.arange(448,467,.1),-1)]
 result={}
 for side,along,normal,sign in specs:
  points=[]
  for t in along:
   xs,ys=(np.full_like(normal,t),normal) if side in ['top','bottom'] else (normal,np.full_like(normal,t));v=map_coordinates(g,[(ys+.5)*a.shape[0]/680-.5,(xs+.5)*a.shape[1]/488-.5],order=3,prefilter=False,mode='nearest');d=np.gradient(v,.1)*sign
   peaks,_=find_peaks(d,height=.08,distance=10)
   if not len(peaks):continue
   best=peaks[0] if side=='bottom' else max(peaks,key=lambda i:d[i]);other=[i for i in peaks if abs(normal[i]-normal[best])>1 and d[i]>=.8*d[best]]
   if other and side!='bottom':continue
   points.append([float(t),float(normal[best]),float(d[best])])
  result[side]=points
 return result

def main():
 root=Path(sys.argv[1]);rows=json.loads((root/'inputs.json').read_text())['records'];out=[]
 for r in rows:
  aligned=root/'calibration'/(r['id']+'-aligned.png')
  if not aligned.exists():continue
  targets=boundary(aligned,r['family']);item={k:r[k] for k in ['id','name','palette','family','cohort']};item['offsets']={}
  for run in ['baseline','source']:
   observed=boundary(root/run/(r['id']+'-full.png'),r['family']);d={}
   for side in targets:
    a={v[0]:v[1] for v in targets[side]};pairs=[a[v[0]]-v[1] for v in observed[side] if v[0] in a];d[side]=dict(pairs=len(pairs),offset=float(np.median(pairs)) if len(pairs)>=10 else None)
   item['offsets'][run]=d
  out.append(item)
 results=[]
 for f in ['regular','tall']:
  train=[r for r in out if r['family']==f and r['cohort']=='calibration'];offsets={}
  for s in ['top','bottom','left','right']:
   values=[r['offsets']['source'][s]['offset'] for r in train if r['offsets']['source'][s]['offset'] is not None];offsets[s]=float(np.median(values)) if values else 0
  # Source's alpha contour is fixed. Only one bounded rectangle registration/family.
  dx=offsets['left'];dy=offsets['top'];sx=1+(offsets['right']-dx)/(1334/1500*488);sy=1+(offsets['bottom']-dy)/(124/2100*680)
  result=dict(family=f,offsets=offsets,registration=dict(dx=dx,dy=dy,scaleX=sx,scaleY=sy));results.append(result);print(json.dumps(result))
 (root/'calibration/type-measurements.json').write_text(json.dumps(dict(schema=1,scope='Signed light-face edges; competing peaks excluded. CC contour retained; one family-level rectangle registration; fit cards only.',families=results,records=out),indent=2)+'\n')
if __name__=='__main__':main()
