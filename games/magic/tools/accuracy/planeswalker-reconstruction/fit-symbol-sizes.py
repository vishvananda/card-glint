from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import gaussian_filter,label,binary_fill_holes,distance_transform_edt,map_coordinates
from scipy.optimize import differential_evolution
import sys
root=Path(sys.argv[1]);d=root/'actual-before';rows=json.loads((d/'cards.json').read_text());poses={r['id']:r for r in json.loads((root/'calibration/report.json').read_text())['normalization']};records=[];sheet=Image.new('RGB',(900,60*len(rows)),'#ddd');draw=ImageDraw.Draw(sheet);index=0
for row in rows:
 rid=row['id']
 if not poses[rid]['accepted']:continue
 meta=json.loads((d/(rid+'.json')).read_text());sym=meta.get('symbol')
 if not sym:continue
 scan=np.asarray(Image.open(root/'calibration'/(rid+'-aligned.png')).convert('RGB'))/255;alpha=np.asarray(Image.open(d/(rid+'-symbol.png')))[...,3]/255
 x,y,w,h=np.array(sym['bounds'])*1.5;right=x+w;bottom=y+h
 x0=int(x-8);x1=int(right+2);y0=int(y-8);y1=int(bottom+2)
 # Estimate paper immediately left of the symbol, away from heading lettering.
 plate=np.array(meta['rects']['type'])*np.array([732,1020,732,1020]);paper=np.median(scan[int(plate[1]+7):int(plate[1]+plate[3]-7),150:500],axis=(0,1));rgb=gaussian_filter(scan[y0:y1,x0:x1],(.35,.35,0));dist=np.max(abs(rgb-paper),axis=2)
 target=dist>.20
 # Drop the thin type-frame line bordering the crop, not symbol pixels.
 target[:1]=False;target[-1:]=False;target[:,:1]=False;target[:,-1:]=False
 labs,n=label(target);counts=np.bincount(labs.ravel());keep=counts>5;keep[0]=False;target=keep[labs];target=binary_fill_holes(target)
 cand=alpha>.45;cy,cx=np.where(cand)
 if target.sum()<30 or not len(cx):continue
 ref=np.array(np.where(target),dtype=float);ref[0]+=y0;ref[1]+=x0;cp=np.array([cy,cx],dtype=float);dt=distance_transform_edt(~target);dc=distance_transform_edt(~cand)
 def objective(v):
  sx,sy=v;xp=right+(cp[1]-right)*sx;yp=bottom+(cp[0]-bottom)*sy
  da=map_coordinates(dt,[yp-y0,xp-x0],order=1,mode='constant',cval=4);db=map_coordinates(dc,[bottom+(ref[0]-bottom)/sy,right+(ref[1]-right)/sx],order=1,mode='constant',cval=4)
  return float((np.minimum(da,4).mean()+np.minimum(db,4).mean())/2)
 opt=differential_evolution(objective,[(.75,1.2),(.75,1.2)],seed=19,popsize=7,maxiter=25,tol=.0005)
 records.append(dict(id=rid,name=row['name'],set=row['set'],family=row['family'],palette=row['palette'],cohort=row['cohort'],sx=float(opt.x[0]),sy=float(opt.x[1]),before=objective([1,1]),after=float(opt.fun),paper=paper.tolist(),bbox=[x0,y0,x1,y1],referenceInkPixels=int(target.sum())))
 print(row['name'],row['set'],np.round(opt.x,3),'loss',round(objective([1,1]),3),round(opt.fun,3),flush=True)
 crop=Image.fromarray(np.uint8(scan[y0:y1,x0:x1]*255)).resize((160,55));sheet.paste(crop,(0,index*60));mask=Image.fromarray(np.uint8(target)*255).convert('RGB').resize((160,55));sheet.paste(mask,(170,index*60));draw.text((350,index*60+10),row['name']+' '+str(np.round(opt.x,3)),fill='black');index+=1
(d/'symbol-fit-v4.json').write_text(json.dumps(dict(scope='Fixed bottom/right anchors, separate width/height. Source alpha vs paper-relative scan ink; diagnostic targets require review.',records=records),indent=2)+'\n');sheet.crop((0,0,900,index*60)).save(d/'symbol-targets-v4.png')
for cohort in ['calibration','validation']:
 v=[r for r in records if r['cohort']==cohort];print(cohort,len(v),'median',np.median([[r['sx'],r['sy']] for r in v],axis=0),flush=True)
