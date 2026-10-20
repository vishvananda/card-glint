from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt,map_coordinates,gaussian_filter,label
from scipy.optimize import differential_evolution,minimize
import sys
root=Path(sys.argv[1]);d=root/'actual-before';rows=json.loads((d/'cards.json').read_text());poses={r['id']:r for r in json.loads((root/'calibration/report.json').read_text())['normalization']};records=[]
for row in rows:
 rid=row['id']
 if not poses[rid]['accepted']:continue
 meta=json.loads((d/(rid+'.json')).read_text());scan=np.asarray(Image.open(root/'calibration'/(rid+'-aligned.png')).convert('RGB'))/255;gray=scan@np.array([.2126,.7152,.0722])
 for h in meta['headings']:
  role=h['role'];a=np.asarray(Image.open(d/(rid+'-'+role+'.png')))[...,3]/255;yy,xx=np.where(a>.45)
  if not len(xx):continue
  ax=h['x']*1.5;bb=[xx.min(),yy.min(),xx.max(),yy.max()];right=min((ax+(bb[2]-ax)*1.19+4), (h['x']+h['width'])*1.5)
  x0=max(0,int(ax-4));x1=min(732,int(right+1));y0=max(0,int(bb[1]-5));y1=min(1020,int(bb[3]+6));target=gaussian_filter(gray[y0:y1,x0:x1],.35)<.38
  labs,n=label(target);counts=np.bincount(labs.ravel());keep=counts>=3;keep[0]=False;target=keep[labs]
  if target.sum()<40:continue
  ref=np.array(np.where(target),dtype=float);ref[0]+=y0;ref[1]+=x0
  cand=np.array([yy,xx],dtype=float);cand=cand[:,::max(1,cand.shape[1]//1600)];ref=ref[:,::max(1,ref.shape[1]//1800)]
  dt=distance_transform_edt(~target);dc=distance_transform_edt(a<=.45)
  def objective(v):
   scale,dx,dy=v;sx=ax+(cand[1]-ax)*scale+dx;sy=cand[0]+dy
   da=map_coordinates(dt,[sy-y0,sx-x0],order=1,mode='constant',cval=4)
   db=map_coordinates(dc,[ref[0]-dy,ax+(ref[1]-ax-dx)/scale],order=1,mode='constant',cval=4)
   return (np.minimum(da,4).mean()+np.minimum(db,4).mean())/2
  opt=differential_evolution(objective,[(.9,1.17),(-3,3),(-4,4)],seed=17,popsize=7,maxiter=24,polish=True,tol=.001)
  base=minimize(lambda v:objective([1,*v]),[0,0],bounds=[(-3,3),(-4,4)],method='Powell')
  records.append(dict(id=rid,name=row['name'],set=row['set'],family=row['family'],palette=row['palette'],cohort=row['cohort'],role=role,scale=float(opt.x[0]),dx=float(opt.x[1]/1.5),dy=float(opt.x[2]/1.5),before=float(base.fun),after=float(opt.fun),inkPixels=int(len(xx)),roi=[x0,y0,x1,y1]))
  print(row['name'],role,round(opt.x[0],4),round(base.fun,3),round(opt.fun,3),flush=True)
(d/'heading-fit.json').write_text(json.dumps(dict(scope='Dark ink bidirectional capped chamfer at frozen frame alignment. Translation is a bounded diagnostic nuisance; fit shared width using training cards only.',records=records),indent=2)+'\n')
for role in ['title','type']:
 for cohort in ['calibration','validation']:
  v=[r for r in records if r['role']==role and r['cohort']==cohort]
  print(role,cohort,len(v),'median',np.median([r['scale'] for r in v]),'IQR',np.quantile([r['scale'] for r in v],[.25,.75]),flush=True)
