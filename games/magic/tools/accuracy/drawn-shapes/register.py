import sys,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from scipy.optimize import least_squares
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'planeswalker-reconstruction'))
from model import read,canonical,peak,sample
if len(sys.argv)!=2:raise SystemExit('Pass external modern capture directory')
root=Path(sys.argv[1])
rows=json.loads((root/'receipt.json').read_text())['records']
def pose(ref,base):
 a=canonical(ref)[...,:3].max(-1);b=canonical(base)[...,:3].max(-1);points=[]
 specs=[('left',0,12,29,1,range(100,611,17)),('right',0,459,477,-1,range(100,611,17)),('top',1,12,34,1,range(75,416,13)),('bottom',1,611,645,-1,list(range(75,191,10))+list(range(305,376,10)))]
 for side,axis,lo,hi,sign,positions in specs:
  for i,t in enumerate(positions):
   if axis==0 and 367<t<436:continue
   bp=peak(b,axis,t,lo,hi,sign);rp=peak(a,axis,t,lo,hi,sign,bp)
   if bp is not None and rp is not None:points.append((axis,rp if axis==0 else t,t if axis==0 else rp,bp,side,i%2))
 train=[p for p in points if p[-1]==0];valid=[p for p in points if p[-1]==1]
 def residual(v,rows):
  m=np.array([[1+v[0],v[1],v[2]],[v[3],1+v[4],v[5]]]);return np.array([m[axis]@np.array([x,y,1])-target for axis,x,y,target,side,k in rows])
 if len(train)<20 or len(valid)<20 or any(sum(p[4]==s for p in train)<6 or sum(p[4]==s for p in valid)<6 for s,_,_,_,_,_ in specs):return dict(accepted=False,reason='Insufficient exterior evidence')
 fit=least_squares(lambda v:residual(v,train),np.zeros(6),loss='soft_l1',f_scale=.35,bounds=([-.025,-.012,-7,-.012,-.025,-7],[.025,.012,7,.012,.025,7]));v=fit.x
 m=np.array([[1+v[0],v[1],v[2]],[v[3],1+v[4],v[5]],[0,0,1]])
 rms=float(np.sqrt(np.mean(residual(v,valid)**2)));sides={s:float(np.sqrt(np.mean(residual(v,[p for p in valid if p[4]==s])**2))) for s,_,_,_,_,_ in specs}
 return dict(matrix=m.tolist(),validationRms=rms,sideRms=sides,accepted=bool(rms<1.2 and max(sides.values())<1.7 and all(sum(p[4]==s for p in train)>=6 for s in sides)))
out=Image.new('RGB',(1380,155*len(rows)),'#ddd');d=ImageDraw.Draw(out)
for j,r in enumerate(rows):
 assert hashlib.sha256((root/(r['id']+'-raw.png')).read_bytes()).hexdigest()==r['referenceSha256'],'Reference bytes changed: '+r['id']
 assert hashlib.sha256((root/(r['id']+'-released.png')).read_bytes()).hexdigest()==r['renderSha256'],'Native render bytes changed: '+r['id']
 ref=read(root/(r['id']+'-raw.png'));base=read(root/(r['id']+'-released.png'));p=pose(ref,base);r['normalization']=p
 print(r['set'],r['name'],p['accepted'],p.get('validationRms'),flush=True)
 if not p['accepted']:continue
 m=np.linalg.inv(p['matrix']);yy,xx=np.mgrid[:1020,:732];x=(xx+.5)/1.5-.5;y=(yy+.5)/1.5-.5;sx=m[0,0]*x+m[0,1]*y+m[0,2];sy=m[1,0]*x+m[1,1]*y+m[1,2]
 aligned=sample(ref,(sx+.5)*ref.shape[1]/488-.5,(sy+.5)*ref.shape[0]/680-.5)
 im=Image.fromarray(np.uint8(np.clip(aligned,0,1)*255));im.save(root/(r['id']+'-scan.png'))
 d.text((0,j*155),r['set']+' '+r['name']+' | aligned scan / released',fill='black')
 for k,a in enumerate([im,Image.open(root/(r['id']+'-released.png'))]):
  out.paste(a.crop((25,560,710,640)),(k*690,j*155+20))
out.save(root/'type-strips.png');(root/'registration.json').write_text(json.dumps(dict(schema=1,records=rows,scope='Max-channel exterior pigment rails, fit/validation strips separate; type/name/rules excluded; uncertainty retained'),indent=2)+'\n')
