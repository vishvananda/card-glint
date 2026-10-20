"""Frozen native scans and exterior affine registration; shared palette materials.
No per-card hue, type-edge warps, or text-based normalization.
"""
import sys,json,hashlib,ast
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import gaussian_filter,binary_erosion,map_coordinates
from scipy.optimize import least_squares
from model import read,canonical,peak,sample,png

# Reuse the established exterior-only validation protocol without running its CLI.
module=ast.parse((Path(__file__).parent.parent/'drawn-shapes/register.py').read_text())
node=next(n for n in module.body if isinstance(n,ast.FunctionDef) and n.name=='pose')
exec(compile(ast.Module(body=[node],type_ignores=[]),'register.py','exec'))

def hsv(rgb):
 mx=rgb.max(-1);mn=rgb.min(-1);d=mx-mn;s=np.divide(d,mx,out=np.zeros_like(d),where=mx>1e-8);h=np.zeros_like(d)
 for k in range(3):
  mask=(rgb[...,k]==mx)&(d>1e-8);h[mask]=((rgb[...,(k+1)%3]-rgb[...,(k+2)%3])[mask]/d[mask]+2*k)%6
 return np.stack([h/6,s,mx],-1)
def rgb(hsv):
 h=hsv[...,0]%1*6;s=hsv[...,1];v=hsv[...,2];i=np.floor(h).astype(int);f=h-i
 p=v*(1-s);q=v*(1-s*f);t=v*(1-s*(1-f));triples=np.stack([np.stack(x,-1) for x in [(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)]],-2)
 return np.take_along_axis(triples,(i%6)[...,None,None],axis=-2)[...,0,:]
def adjust(h,a):
 h=h.astype(np.float64).copy();h[...,0]+=a[0]/360;h[...,1]=np.clip(h[...,1]*a[1],0,1);h[...,2]=np.clip(h[...,2]*a[2],0,1);return rgb(h)

def main():
 root=Path(sys.argv[1]);out=root/'calibration';out.mkdir(exist_ok=True)
 records=json.loads((root/'inputs.json').read_text())['records'];receipt=json.loads((root/'baseline/receipt.json').read_text());included={r['id'] for r in receipt['records']}
 for f,h in receipt['rasters'].items():assert hashlib.sha256((root/'baseline'/f).read_bytes()).hexdigest()==h,f
 rng=np.random.default_rng(6301);data=[];registrations=[]
 for r in records:
  if r['id'] not in included:continue
  rid=r['id'];ref=read(root/'scans'/f'{rid}.png');base=read(root/'baseline'/f'{rid}-full.png');src=read(root/'source'/f'{rid}-full.png');p=pose(ref,base)
  registrations.append(dict(id=rid,name=r['name'],palette=r['palette'],family=r['family'],**p));print('pose',r['palette'],r['family'],r['name'],p['accepted'],round(p.get('validationRms',999),3),flush=True)
  if not p['accepted']:continue
  yy,xx=np.mgrid[:ref.shape[0],:ref.shape[1]];sx=(xx+.5)*488/ref.shape[1]-.5;sy=(yy+.5)*680/ref.shape[0]-.5;m=np.asarray(p['matrix']);x=m[0,0]*sx+m[0,1]*sy+m[0,2];y=m[1,0]*sx+m[1,1]*sy+m[1,2];bx,by=(x+.5)*1.5-.5,(y+.5)*1.5-.5
  target=gaussian_filter(ref[...,:3],(.8,.8,0));b=sample(base,bx,by)[...,:3];s=sample(src,bx,by)[...,:3]
  black=read(root/'baseline'/f'{rid}-bgBlack.png')[...,:3];white=read(root/'baseline'/f'{rid}-bgWhite.png')[...,:3];w=sample(np.clip((white-black).mean(-1),0,1)[...,None],bx,by)[...,0]
  bgmask=(w>.60)&(y>80)&(y<610)&~((y>320)&(y<436))&(x>15)&(x<474)&(ref[...,:3].max(-1)>.09);bgmask=binary_erosion(bgmask,iterations=1)
  # Type paper: horizontal unprinted strips inside the complete CC contour.
  # Exclude the printed text/symbol band, curved ends, and dark scan ink.
  top=(1037 if r['family']=='tall' else 1175)/2100*680
  typemask=(x>65)&(x<395)&(((y>top+8)&(y<top+11))|((y>top+29)&(y<top+32)))
  typemask&=(target.max(-1)-target.min(-1)<.45)&(target.mean(-1)>.23)
  # Save a native-coordinate aligned scan only for review. Fitting never repeatedly warps it.
  inv=np.linalg.inv(m);ny,nx=np.mgrid[:1020,:732];cx=(nx+.5)/1.5-.5;cy=(ny+.5)/1.5-.5;rx=inv[0,0]*cx+inv[0,1]*cy+inv[0,2];ry=inv[1,0]*cx+inv[1,1]*cy+inv[1,2]
  aligned=sample(ref,(rx+.5)*ref.shape[1]/488-.5,(ry+.5)*ref.shape[0]/680-.5);png(out/f'{rid}-aligned.png',aligned)
  item=dict(row=r,normalization=p)
  debug=ref.copy();debug[...,:3]*=.25;debug[bgmask|typemask]=ref[bgmask|typemask];png(out/f'{rid}-mask.png',debug)
  for kind,mask,count in [('background',bgmask,6000),('type',typemask,2500)]:
   iy,ix=np.where(mask);assert len(iy)>300,(rid,kind,len(iy));idx=rng.choice(len(iy),min(count,len(iy)),replace=False);iy,ix=iy[idx],ix[idx];source=s[iy,ix];truth=target[iy,ix];weight=np.ones((len(idx),1));under=np.zeros_like(truth)
   if kind=='background':
    weight=w[iy,ix,None];under=sample(black,bx[iy,ix],by[iy,ix]);source=np.clip((source-under)/weight,0,1);truth=np.clip((truth-under)/weight,0,1)
   item[kind]=dict(source=source,hsv=hsv(source),base=b[iy,ix],target=truth,weight=weight,under=under,rawTarget=target[iy,ix],count=len(idx),coords=np.stack([iy,ix],-1))
  data.append(item)
 results=[]
 for palette in 'WUBRGMA':
  for kind in ['background','type']:
   rows=[r for r in data if r['row']['palette']==palette];train=[r for r in rows if r['row']['cohort']=='calibration'];assert len(train)>=3,(palette,kind)
   def residual(a):return np.concatenate([((adjust(r[kind]['hsv'],a)-r[kind]['target'])*r[kind]['weight']).ravel()/np.sqrt(len(r[kind]['source'])) for r in train])
   fit=least_squares(residual,[0,.85,.85],bounds=([-30,.2,.45],[30,1.6,1.4]),loss='soft_l1',f_scale=.045/np.sqrt(5000),max_nfev=60,diff_step=1e-4)
   values=[]
   for r in rows:
    q=r[kind];values.append(dict(id=r['row']['id'],name=r['row']['name'],family=r['row']['family'],cohort=r['row']['cohort'],pixels=q['count'],baseline=float(abs(q['base']-q['rawTarget']).mean()*255),source=float(abs((q['source']-q['target'])*q['weight']).mean()*255),corrected=float(abs((adjust(q['hsv'],fit.x)-q['target'])*q['weight']).mean()*255)))
   result=dict(palette=palette,component=kind,adjustment=dict(zip(['hueDegrees','saturationScale','brightnessScale'],map(float,fit.x))),records=values)
   result['means']={c:float(np.mean([r[c] for r in values])) for c in ['baseline','source','corrected']};result['reservedMeans']={c:float(np.mean([r[c] for r in values if r['cohort']=='validation'])) for c in ['baseline','source','corrected']};results.append(result);print(json.dumps(result),flush=True)
 report=dict(schema=1,scope='Native raw scans, fixed baseline exterior affine transforms including scale/rotation/skew; no text normalization; fixed unprinted masks; equal weight per printing; two family heights share one HSB correction per palette and component; regional RGB MAE /255 lower is better; reserved scans never fit',normalization=registrations,excluded=receipt['excluded'],results=results)
 (out/'report.json').write_text(json.dumps(report,indent=2)+'\n')
 # Save only frozen pixel samples needed by a later exact native replay.
 arrays={}
 for r in data:
  for kind in ['background','type']:
   for field in ['rawTarget','coords']:arrays[r['row']['id']+'-'+kind+'-'+field]=r[kind][field]
 np.savez_compressed(out/'samples.npz',**arrays)
if __name__=='__main__':main()
