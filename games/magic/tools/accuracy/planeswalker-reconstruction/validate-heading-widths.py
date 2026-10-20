from pathlib import Path
import json,hashlib
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt,map_coordinates,gaussian_filter,label,binary_fill_holes
from scipy.optimize import minimize
import sys
root=Path(sys.argv[1]);old=root/'actual-before';new=root/'actual-geometry';rows=json.loads((old/'cards.json').read_text());poses={r['id']:r for r in json.loads((root/'calibration/report.json').read_text())['normalization']};fits=json.loads((old/'heading-fit.json').read_text())['records'];records=[]
for row in rows:
 rid=row['id']
 if not poses[rid]['accepted']:continue
 scan=np.array(Image.open(root/'calibration'/(rid+'-aligned.png')).convert('RGB'))/255;gray=scan@np.array([.2126,.7152,.0722])
 for rec in [x for x in fits if x['id']==rid]:
  role=rec['role'];x0,y0,x1,y1=rec['roi'];target=gaussian_filter(gray[y0:y1,x0:x1],.35)<.38;labs,n=label(target);counts=np.bincount(labs.ravel());keep=counts>=3;keep[0]=False;target=keep[labs];ref=np.array(np.where(target),dtype=float);ref[0]+=y0;ref[1]+=x0;ref=ref[:,::max(1,ref.shape[1]//1800)];dt=distance_transform_edt(~target);metrics={};dims={}
  for key,path in [('before',old),('after',new)]:
   alpha=np.asarray(Image.open(path/(rid+'-'+role+'.png')))[...,3]/255;yy,xx=np.where(alpha>.45);cp=np.array([yy,xx],dtype=float);cp=cp[:,::max(1,cp.shape[1]//1600)];dc=distance_transform_edt(alpha<=.45)
   def objective(v):
    dx,dy=v;da=map_coordinates(dt,[cp[0]+dy-y0,cp[1]+dx-x0],order=1,mode='constant',cval=4);db=map_coordinates(dc,[ref[0]-dy,ref[1]-dx],order=1,mode='constant',cval=4)
    return float((np.minimum(da,4).mean()+np.minimum(db,4).mean())/2)
   opt=minimize(objective,[0,0],bounds=[(-3,3),(-4,4)],method='Powell');metrics[key]=float(opt.fun);dims[key]=[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())]
  records.append(dict(id=rid,name=row['name'],role=role,cohort=row['cohort'],metrics=metrics,inkBounds=dims))
 # Preserve endpoints in the actual native full-card replay.
 a=np.array(Image.open(root/'final'/(rid+'-full.png')));b=np.array(Image.open(new/(rid+'-full.png')));assert np.array_equal(a[945:],b[945:]),(row['name'],'footer changed')
summary=[]
for role in ['title','type']:
 for cohort in ['calibration','validation']:
  v=[r for r in records if r['role']==role and r['cohort']==cohort];stats={k:float(np.mean([r['metrics'][k] for r in v]))for k in ['before','after']};entry=dict(role=role,cohort=cohort,cards=len(v),means=stats,improved=sum(r['metrics']['after']<r['metrics']['before'] for r in v));summary.append(entry);print(entry,flush=True)
print('Chandra',[r for r in records if r['id']=='49d2a680-4f3b-4bfa-b77b-d2dfaced9f23'],flush=True)
(new/'validation.json').write_text(json.dumps(dict(schema=1,scope='Native original-wording replay on frozen scan poses. Width metrics are dark-ink capped symmetric distance in captured pixels, lower better. Translation is a bounded evaluation nuisance, not a renderer correction. 39 calibration and 20 reserved cards.',summary=summary,records=records),indent=2)+'\n')
