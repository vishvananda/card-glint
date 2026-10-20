"""Exact native renderer replay on frozen reference coordinates and masks."""
import json,sys,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from model import read,sample

def main():
 root=Path(sys.argv[1]);run=sys.argv[2] if len(sys.argv)>2 else 'final';report=json.loads((root/'calibration/report.json').read_text());receipt=json.loads((root/run/'receipt.json').read_text());samples=np.load(root/'calibration/samples.npz');inputs=json.loads((root/'inputs.json').read_text());rows={r['id']:r for r in inputs['records']}
 for file,sha in receipt['rasters'].items():assert hashlib.sha256((root/run/file).read_bytes()).hexdigest()==sha,file
 result=[]
 for r in report['normalization']:
  if not r['accepted']:continue
  rid=r['id'];row=rows[rid];final=read(root/run/f'{rid}-full.png');base=read(root/'baseline'/f'{rid}-full.png');src=read(root/'source'/f'{rid}-full.png');reference=Image.open(root/'scans'/f'{rid}.png');m=np.asarray(r['matrix']);metrics={}
  for component in ['background','type']:
   iy,ix=samples[rid+'-'+component+'-coords'].T;sx=(ix+.5)*488/reference.width-.5;sy=(iy+.5)*680/reference.height-.5;x=m[0,0]*sx+m[0,1]*sy+m[0,2];y=m[1,0]*sx+m[1,1]*sy+m[1,2];bx,by=(x+.5)*1.5-.5,(y+.5)*1.5-.5;target=samples[rid+'-'+component+'-rawTarget']
   metrics[component]={k:float(abs(sample(image,bx,by)[...,:3]-target).mean()*255) for k,image in [('released',base),('uncorrected',src),('candidate',final)]}
  # Exact changed-pixel support, before any normalization/resampling.
  black=read(root/'baseline'/f'{rid}-bgBlack.png');white=read(root/'baseline'/f'{rid}-bgWhite.png');allowed=(np.max(abs(white-black),-1)>0)
  yy,xx=np.mgrid[:final.shape[0],:final.shape[1]];x=(xx+.5)/1.5-.5;y=(yy+.5)/1.5-.5;top=329 if row['family']=='tall' else 374;allowed|=(x>20)&(x<474)&(y>top)&(y<top+59)
  changed=np.max(abs(final-base),-1)>1/255+1e-7;outside=int((changed&~allowed).sum());assert outside==0,(rid,'Changed pixels outside background/type scope',outside)
  result.append(dict(id=rid,name=row['name'],set=row['set'],palette=row['palette'],family=row['family'],cohort=row['cohort'],metrics=metrics,changedPixels=int(changed.sum()),outsideScope=outside,referenceSha256=row['reference']['sha256'],releasedSha256=hashlib.sha256((root/'baseline'/f'{rid}-full.png').read_bytes()).hexdigest(),candidateSha256=receipt['rasters'][rid+'-full.png']))
 summaries=[]
 for palette in 'WUBRGMA':
  for component in ['background','type']:
   selected=[r for r in result if r['palette']==palette];reserved=[r for r in selected if r['cohort']=='validation'];means=lambda rows:{k:float(np.mean([r['metrics'][component][k] for r in rows])) for k in ['released','uncorrected','candidate']}
   summaries.append(dict(palette=palette,component=component,cards=len(selected),means=means(selected),reservedCards=len(reserved),reservedMeans=means(reserved)))
 output=dict(schema=1,rendererVersion=receipt['rendererVersion'],sourceCommit=receipt['sourceCommit'],scope='Paired native full-card renders with original MTGJSON wording; frozen baseline exterior affine poses, equal weight/card and fixed unprinted masks. Regional RGB MAE /255, lower better. Not a whole-card compliance score. No changed pixels outside background support and the full type-box region.',normalization=dict(accepted=len(result),attempted=len(report['normalization']),rejected=[r for r in report['normalization'] if not r['accepted']]),excluded=report['excluded'],summary=summaries,records=result)
 (root/'calibration/native-report.json').write_text(json.dumps(output,indent=2)+'\n')
 for r in summaries:print(r['palette'],r['component'],{k:round(v,3) for k,v in r['means'].items()},'reserved',{k:round(v,3) for k,v in r['reservedMeans'].items()},flush=True)
if __name__=='__main__':main()
