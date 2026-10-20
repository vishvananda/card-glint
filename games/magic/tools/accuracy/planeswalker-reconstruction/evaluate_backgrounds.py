import sys,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import binary_dilation
from model import prepare,read,sample
if len(sys.argv)!=3:raise SystemExit('Pass study and external background-study output')
study=Path(sys.argv[1]);out=Path(sys.argv[2])
data=prepare(study,out/'registration-native');receipt=json.loads((out/'native/background-capture.json').read_text());rows=[]
for r in data['records']:
 id=r['row']['id'];bx=(r['x']+.5)*1.5-.5;by=(r['y']+.5)*1.5-.5;mask=r['bgMask'];base=read(study/'native'/(id+'-baseline.png'))[...,:3]
 row=dict(id=id,name=r['row']['name'],set=r['row']['set'],cohort=r['row']['cohort'],before=float(abs(sample(base,bx,by)-r['target'])[mask].mean()*255),candidates={})
 black=read(study/'native'/(id+'-bgBlack.png'));white=read(study/'native'/(id+'-bgWhite.png'));support=binary_dilation(np.max(abs(white-black),-1)>.001,iterations=2)
 for v in receipt['variants']:
  p=out/'native'/(id+'-'+v['id']+'.png');assert hashlib.sha256(p.read_bytes()).hexdigest()==v['rasters'][p.name]
  candidate=read(p)[...,:3];err=float(abs(sample(candidate,bx,by)-r['target'])[mask].mean()*255);outside=int(((abs(candidate-base).max(-1)>1.1/255)&~support).sum())
  assert outside==0,(id,v['id'],outside)
  row['candidates'][v['id']]=dict(error=err,outsideSupportChangedPixels=outside)
 rows.append(row)
summary={}
for cohort in ['all','calibration','validation']:
 rs=[r for r in rows if cohort=='all' or r['cohort']==cohort]
 summary[cohort]=dict(cards=len(rs),before=float(np.mean([r['before'] for r in rs])),**{v['id']:float(np.mean([r['candidates'][v['id']]['error'] for r in rs])) for v in receipt['variants']})
report=dict(schema=1,summary=summary,records=rows,scope='Actual native 0.6.2 painter replay; only background texture replaced. Fixed raw scan masks and exterior affine poses; RGB channel MAE /255 lower better; four fitting scans, two previously viewed reserved scans. Type/solid blue frame/paper/typography unchanged. All candidate changes proven inside background support only.')
(out/'native-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(summary,indent=2))
ids=[rows[0]['id'],rows[-1]['id']];canvas=Image.new('RGB',(4*366,2*530),'#ddd');draw=ImageDraw.Draw(canvas)
for j,id in enumerate(ids):
 for k,(kind,label) in enumerate([('scan','Aligned scan'),('released','Released'),('cc-hsb','CC + HSB background'),('backprop','Reconstructed background')]):
  path=study/'review'/(id+'-'+kind+'.png') if k<2 else out/'native'/(id+'-'+kind+'.png')
  im=Image.open(path).convert('RGB');im.thumbnail((366,510));canvas.paste(im,(k*366,j*530+20));draw.text((k*366,j*530+3),label,fill='black')
canvas.save(out/'native-comparison.png')
