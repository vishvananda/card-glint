"""Offline reconstruction color audit; reference rasters stay local.

Requires NumPy, Pillow and SciPy. Existing observations, candidates and frozen
reference bytes are inputs. No asset downloads or scan-specific color fits.
"""
import argparse,json,sys,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,grey_closing,binary_dilation,binary_erosion
from scipy.optimize import least_squares
def rgb_to_hsv(rgb):
 r,g,b=np.moveaxis(rgb,-1,0);v=rgb.max(-1);d=v-rgb.min(-1);idx=rgb.argmax(-1);safe=np.maximum(d,1e-8)
 h=np.where(idx==0,(g-b)/safe,np.where(idx==1,(b-r)/safe+2,(r-g)/safe+4));h=np.where(d==0,0,(h/6)%1)
 return np.stack([h,np.where(v>0,d/np.maximum(v,1e-8),0),v],-1)
def hsv_to_rgb(hsv):
 h,s,v=np.moveaxis(hsv,-1,0);h=h*6;c=v*s;x=c*(1-np.abs(h%2-1));z=np.zeros_like(v);i=np.floor(h).astype(int)%6
 return np.stack([np.where((i==0)|(i==5),c,np.where((i==1)|(i==4),x,z)),np.where((i==1)|(i==2),c,np.where((i==0)|(i==3),x,z)),np.where((i==3)|(i==4),c,np.where((i==2)|(i==5),x,z))],-1)+(v-c)[...,None]
sys.path.insert(0,str(Path(__file__).parent))
from frame_reconstruction.geometry import read_image,normalize
parser=argparse.ArgumentParser(description='Audit existing reconstructed materials with frozen scan poses; RGB color diagnostic, not the full-card metric.');parser.add_argument('study',type=Path);parser.add_argument('output',type=Path);parser.add_argument('--apply-green-paper',action='store_true');args=parser.parse_args();root=args.study;out=args.output;out.mkdir(parents=True,exist_ok=True)
y,x=np.mgrid[:680,:488]
paper=(x>70)&(x<419)&(y>420)&(y<588)
frame=(x>27)&(x<461)&(y>25)&(y<657)&~((x>50)&(x<436)&(y>66)&(y<376))&~((x>61)&(x<428)&(y>404)&(y<610))&~((y>28)&(y<64))&~((y>375)&(y<405))&~((y>608)&(y<648))
def resized(p):return np.asarray(Image.open(p).convert('RGBA').resize((488,680),Image.Resampling.BILINEAR),dtype=float)/255

def adjust(rgb,p):
 hsv=rgb_to_hsv(np.clip(rgb,0,1));hsv[...,0]=(hsv[...,0]+p[0]/360)%1;hsv[...,1]=np.clip(hsv[...,1]*np.exp(p[1]),0,1);hsv[...,2]=np.clip(hsv[...,2]**np.exp(p[3])*np.exp(p[2]),0,1);return hsv_to_rgb(hsv)
allrows=[];assets=[];rng=np.random.default_rng(1903)
for color in 'GUBRALW':
 p=root/color;rows=json.loads((p/'observations.json').read_text())['records'];c=json.loads((p/'candidates.json').read_text())['candidates'][0];blank=resized(p/'released-frame.png')[...,:3] if (p/'released-frame.png').exists() else None;samples={'frame':[],'paper':[]};oldCoverage=[]
 for r in rows:
  sourcefile=p/(c.get('perCardFile',c['file']).replace('{id}',r['id']));source=resized(sourcefile);scan=normalize(read_image(r['reference']['file']),r['normalization']['transform']['matrix'])[...,:3];old=resized(p/r['baseline']['file'])[...,:3] if (p/r['baseline']['file']).exists() else None
  src=gaussian_filter(source[...,:3],(1.4,1.4,0));target=gaussian_filter(scan,(1.4,1.4,0));gray=gaussian_filter(scan@np.array([.2126,.7152,.0722]),.7)
  # Local dark strokes, independent of the paper's absolute brightness.
  backdrop=grey_closing(gray,size=(7,7));ink=(backdrop-gray)>np.maximum(.035,backdrop*.12)
  content=np.max(abs(old-blank),axis=-1)>.035 if old is not None and blank is not None else np.zeros_like(paper);excluded=binary_dilation((content if color!='L' else np.zeros_like(content))|ink,iterations=3) # Land blank is untinted; use scan ink to avoid masking the entire tinted insert.
  for zone,area in [('frame',frame),('paper',paper)]:
   allowed=binary_erosion(area&(source[...,3]>.99)&~excluded,iterations=2)
   allowed&=(source[...,:3].max(-1)>.12)&(scan.max(-1)>.08)
   ids=np.flatnonzero(allowed);take=rng.choice(ids,min(2200,len(ids)),replace=False) if len(ids) else ids
   if len(take):samples[zone].append({'id':r['id'],'name':r['name'],'cohort':r['cohort'],'pixels':len(ids),'a':src.reshape(-1,3)[take],'b':target.reshape(-1,3)[take]})
  if (p/'prepared'/(r['id']+'.npz')).exists():
   with np.load(p/'prepared'/(r['id']+'.npz')) as d:
    xx,yy=d['card'][...,0],d['card'][...,1];pp=(xx>70)&(xx<419)&(yy>420)&(yy<588);oldCoverage.append(int((d['mask']&pp).sum()))
 result={'material':color,'cards':len(rows),'oldPaperPixels':sum(oldCoverage) if oldCoverage else None,'oldPaperCardsWithPixels':sum(n>0 for n in oldCoverage) if oldCoverage else None,'zones':{}}
 parameters={}
 for zone,ss in samples.items():
  train=[r for r in ss if r['cohort']=='calibration'];validation=[r for r in ss if r['cohort']!='calibration'];assert len(train)>=5,(color,zone,'insufficient cards')
  a=np.concatenate([r['a'] for r in train]);b=np.concatenate([r['b'] for r in train]);
  def residual(v):return np.r_[(adjust(a,v)-b).ravel()/len(a)**.5,np.asarray(v)*np.array([.0001,.004,.004,.012])]
  fit=least_squares(residual,np.zeros(4),bounds=([-20,-.6,-.65,np.log(.5)],[20,.6,.45,np.log(2)]),loss='soft_l1',f_scale=.025,max_nfev=65)
  parameters[zone]=fit.x
  metrics=[]
  for r in ss:
   metrics.append({'id':r['id'],'cohort':r['cohort'],'pixels':r['pixels'],'before':float(np.abs(r['a']-r['b']).mean()),'after':float(np.abs(adjust(r['a'],fit.x)-r['b']).mean())})
  def report(which):
   m=[r for r in metrics if which=='all' or r['cohort']==which];
   if not m:return {'cards':0,'pixels':0,'before':None,'after':None,'regressions':0}
   return {'cards':len(m),'pixels':sum(r['pixels'] for r in m),'before':float(np.mean([r['before'] for r in m])),'after':float(np.mean([r['after'] for r in m])),'regressions':sum(r['after']>r['before'] for r in m)}
  result['zones'][zone]={'adjustment':{'hueDegrees':float(fit.x[0]),'saturationScale':float(np.exp(fit.x[1])),'brightnessScale':float(np.exp(fit.x[2])),'valueGamma':float(np.exp(fit.x[3]))},'calibration':report('calibration'),'validation':report('validation'),'all':report('all'),'rows':metrics}
 # Only green is an authorized color correction here; audit other materials.
 if color=='G' and args.apply_green_paper:
  sourcefile=p/c['file'];im=np.asarray(Image.open(sourcefile).convert('RGBA'),dtype=float)/255
  yy,xx=np.mgrid[:im.shape[0],:im.shape[1]];xx=(xx+.5)*488/im.shape[1];yy=(yy+.5)*680/im.shape[0]
  distance=np.minimum.reduce([xx-63,426-xx,yy-405,608-yy]);weight=np.clip(distance/2,0,1);weight=weight*weight*(3-2*weight)
  weight[im[...,:3].max(-1)<.075]=0 # Preserve dark keylines exactly.
  corrected=adjust(im[...,:3],parameters['paper']);im[...,:3]=im[...,:3]*(1-weight[...,None])+corrected*weight[...,None]
  target=out/'green-paper-corrected.png';Image.fromarray(np.round(np.clip(im,0,1)*255).astype('uint8'),'RGBA').save(target);assets.append({'material':'G','file':target.name,'sourceSha256':hashlib.sha256(sourcefile.read_bytes()).hexdigest(),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
 allrows.append(result);(out/'audit.json').write_text(json.dumps({'schema':1,'policy':'Frozen poses and shared per-material HSB/gamma. Local-contrast ink masks, native-render ink exclusion, equal per-card weights. Candidate cohorts reused from development; not blind validation. Only an explicitly requested green-paper export changes pixels; other fits are diagnostics.','materials':allrows,'assets':assets},indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='zones'}),{z:r['all'] for z,r in result['zones'].items()},flush=True)
