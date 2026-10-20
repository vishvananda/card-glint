"""Measure actual native painter output using the exact frozen fitting masks."""
from pathlib import Path
import json,hashlib
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,sobel,distance_transform_edt,binary_erosion,binary_dilation
import sys
from model import prepare, sample, read, gray
ROOT=Path(sys.argv[1]);FIT=ROOT/(sys.argv[2] if len(sys.argv)>2 else 'fit')
before=(FIT/'normalization.json').read_bytes()
records=prepare(ROOT,FIT)['records']
assert before==(FIT/'normalization.json').read_bytes(),'Pose changed during replay'
OUT=ROOT/'review';OUT.mkdir(exist_ok=True)
def png(p,a):Image.fromarray(np.round(np.clip(a,0,1)*255).astype('uint8')).save(p)
def edges(a,mask):
 g=gaussian_filter(gray(a),.75);strength=np.hypot(sobel(g,axis=1)/8,sobel(g,axis=0)/8)
 threshold=max(.022,float(np.quantile(strength[mask],.85)))
 return (strength>threshold)&mask
def edge_score(a,b,mask):
 mask=binary_erosion(mask,iterations=1)
 if mask.sum()<30:return None
 ae,be=edges(a,mask),edges(b,mask)
 if min(ae.sum(),be.sum())<5:return None
 da=distance_transform_edt(~ae);db=distance_transform_edt(~be)
 p=float((db[ae]<=1.53).mean());r=float((da[be]<=1.53).mean())
 return dict(overlap100=100*2*p*r/(p+r+1e-9),symmetricDistanceNativePx=float((db[ae].mean()+da[be].mean())/2),edgeCounts=[int(ae.sum()),int(be.sum())])
def measure(a,b,mask):return float(abs(a-b)[mask].mean()*255)
results=[]
for r in records:
 row=r['row'];id=row['id'];base=read(ROOT/'native'/f'{id}-baseline.png')[...,:3];candidate=read(ROOT/'native'/f'{id}-candidate.png')[...,:3]
 bx,by=(r['x']+.5)*1.5-.5,(r['y']+.5)*1.5-.5
 actual=sample(candidate,bx,by);old=sample(base,bx,by)
 tm,bm=r['typeMask'],r['bgMask'];target=r['target']
 curve=tm&(r['x']>437)&(r['x']<467)&(r['y']>378)&(r['y']<393)
 score=dict(id=id,name=row['name'],set=row['set'],number=row['number'],scryfallUrl=row['card']['scryfall_uri'],cohort=row['cohort'],pose=row['normalization'],background=dict(before=measure(old,target,bm),after=measure(actual,target,bm)),type=dict(before=measure(old,target,tm),after=measure(actual,target,tm)),typeEdges=dict(before=edge_score(old,target,tm),after=edge_score(actual,target,tm)),topRightCurve=dict(before=edge_score(old,target,curve),after=edge_score(actual,target,curve)),maskSha256=hashlib.sha256(np.stack([tm,bm]).tobytes()).hexdigest())
 # Resample the scan once for viewing; measurement above retains native scan pixels.
 ref=r['reference'];yy,xx=np.mgrid[:1020,:732];x=(xx+.5)/1.5-.5;y=(yy+.5)/1.5-.5;m=np.linalg.inv(np.array(row['normalization']['matrix']));sx=m[0,0]*x+m[0,1]*y+m[0,2];sy=m[1,0]*x+m[1,1]*y+m[1,2]
 aligned=sample(ref,(sx+.5)*ref.shape[1]/488-.5,(sy+.5)*ref.shape[0]/680-.5)
 png(OUT/f'{id}-scan.png',aligned);png(OUT/f'{id}-released.png',base);png(OUT/f'{id}-candidate.png',candidate)
 # Scope proof excludes only the actual two modified component supports.
 black=read(ROOT/'native'/f'{id}-bgBlack.png');white=read(ROOT/'native'/f'{id}-bgWhite.png');allowed=np.max(abs(white-black),-1)>.001
 type_before=read(ROOT/'native/typeAsset.png')[...,3]>.001;newplate=read(FIT/'planeswalker-type-U.png');type_after=np.zeros_like(type_before);type_after[558:558+newplate.shape[0],30:30+newplate.shape[1]]=newplate[...,3]>.001
 allowed=binary_dilation(allowed|type_before|type_after,iterations=2)
 score['outsideAssetsChangedPixels']=int(((abs(candidate-base).max(-1)>1.1/255)&~allowed).sum())
 assert score['outsideAssetsChangedPixels']==0,(id,score['outsideAssetsChangedPixels'])
 # A fixed asset-only overlay mask suppresses unrelated art and text differences.
 overlay=np.zeros((1020,732,4),dtype=np.uint8);overlay[...,3]=np.where(allowed,255,0);Image.fromarray(overlay).save(OUT/f'{id}-mask.png')
 results.append(score);print(json.dumps(score),flush=True)
summary={}
for cohort in ['all','calibration','validation']:
 rows=[r for r in results if cohort=='all' or r['cohort']==cohort]
 summary[cohort]=dict(cards=len(rows),background={k:float(np.mean([r['background'][k] for r in rows])) for k in ['before','after']},type={k:float(np.mean([r['type'][k] for r in rows])) for k in ['before','after']},typeEdges={k:float(np.mean([r['typeEdges'][k]['overlap100'] for r in rows if r['typeEdges'][k]])) for k in ['before','after']},topRightCurve={k:float(np.mean([r['topRightCurve'][k]['overlap100'] for r in rows if r['topRightCurve'][k]])) for k in ['before','after']})
report=dict(schema=1,rendererVersion=json.loads((ROOT/'native/receipt.json').read_text()).get('rendererVersion','0.6.2'),sourceCommit=json.loads((ROOT/'native/receipt.json').read_text())['sourceCommit'],summary=summary,records=results,scope='Two assets only. RGB error is mean absolute channel error out of255, lower is better. Edge overlap uses independent luminance thresholds, native distance tolerance1canonicalpx, /100. Fixed native scan poses; no whole-card compliance claim. Reserved scans were excluded from optimization but inspected during development.',excluded=[dict(id=r['id'],name=r['name'],set=r['set'],reason='Two-ability uncommon printing without the matching rare/mythic stamp treatment; excluded from this frame-family experiment',normalization=r['normalization']) for r in json.loads((FIT/'normalization.json').read_text())['records'] if not r['normalization']['accepted']])
(OUT/'data.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(dict(summary=summary)),flush=True)
