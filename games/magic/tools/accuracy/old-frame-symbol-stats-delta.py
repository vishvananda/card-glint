# Exact native footprint proof. Requires Pillow and NumPy; no browser or fitting.
import json,hashlib,sys
from pathlib import Path
import numpy as np
from PIL import Image
assert len(sys.argv)==5, 'Use BEFORE_NATIVE_DIR AFTER_NATIVE_DIR GENERIC_PAPER_REPORT OUTPUT_JSON'
A,B,G,O=map(Path,sys.argv[1:])
a=json.loads((A/'capture.json').read_text());b=json.loads((B/'capture.json').read_text())
g=json.loads((G).read_text())
assert a['status']==b['status']=='complete'
assert a['inputHash']==b['inputHash'] and not a['faults'] and not b['faults']
paper={}
for r in g['rows']: paper.setdefault(r['id'],[]).append(r['geometry'])
Y,X=np.mgrid[0:1020,0:732]
cx=(X+.5)/1.5;cy=(Y+.5)/1.5
stats=(cx>=372)&(cx<456)&(cy>=602)&(cy<648)
rows=[]
for n,(old,new) in enumerate(zip(a['rows'],b['rows'])):
 assert old['id']==new['id'] and old['referenceHash']==new['referenceHash'] and old['artHash']==new['artHash']
 cost=np.zeros(X.shape,dtype=bool)
 for d in paper.get(old['id'],[]):
  cost|=((cx-d['cx'])/(d['rx']+4/3))**2+((cy-d['cy'])/(d['ry']+4/3))**2<=1
 for mode,om in old['modes'].items():
  nm=new['modes'][mode]
  assert om['inputHash']==nm['inputHash'] and om['layout']==nm['layout'],(old['name'],mode,'layout/input')
  ab=(A/om['file']).read_bytes()
  assert hashlib.sha256(ab).hexdigest()==om['sha256']
  aa=np.asarray(Image.open(A/om['file']).convert('RGBA'))
  bbt=(B/nm['file']).read_bytes()
  assert hashlib.sha256(bbt).hexdigest()==nm['sha256']
  bb=np.asarray(Image.open(B/nm['file']).convert('RGBA'))
  changed=np.any(aa!=bb,axis=2)
  allow=np.zeros(X.shape,dtype=bool) if mode=='etching' else stats if mode=='oracle-modern' else stats|cost
  alpha=int(np.count_nonzero(aa[:,:,3]!=bb[:,:,3]))
  outside=int(np.count_nonzero(changed&~allow))
  row={'id':old['id'],'name':old['name'],'mode':mode,'before':om['sha256'],'after':nm['sha256'],'inputHash':om['inputHash'],'pixels':int(changed.sum()),'alpha':alpha,'outside':outside,'statsPixels':int((changed&stats).sum()),'genericPaperPixels':int((changed&cost).sum())}
  rows.append(row)
  if alpha or outside: print('FAULT',row,flush=True)
 if (n+1)%50==0: print('Native delta',n+1,flush=True)
summary={'cards':len(a['rows']),'renders':len(rows),'changed':sum(r['pixels']>0 for r in rows),'alpha':sum(r['alpha'] for r in rows),'outside':sum(r['outside'] for r in rows)}
out={'schema':1,'scope':'Exact native before/after: source-bound frozen inputs and poses, no per-card rendering adjustments. Allowed regions are P/T and numeric/X casting-cost ellipses with a fixed 4/3 canonical px antialias fringe only; the fringe includes partial coverage of a native pixel. Modern symbols permit only P/T; etching permits no changes.','source':{'beforeRenderer':a['rendererHash'],'afterRenderer':b['rendererHash'],'inputHash':a['inputHash'],'toolHash':a['toolHash'],'deltaToolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'beforeCapture':hashlib.sha256((A/'capture.json').read_bytes()).hexdigest(),'afterCapture':hashlib.sha256((B/'capture.json').read_bytes()).hexdigest(),'genericGeometry':hashlib.sha256(G.read_bytes()).hexdigest()},'summary':summary,'rows':rows}
O.write_text(json.dumps(out,indent=2)+'\n')
print(summary,flush=True)
assert summary['alpha']==summary['outside']==0
assert all(r['pixels']==0 for r in rows if r['mode']=='etching')
