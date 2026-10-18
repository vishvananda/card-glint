"""Run a cache-only, single-material reconstruction using an explicit source.

These are experiment artifacts, never pack defaults. Each stage persists its
receipt and can resume after interruption without recomputing earlier captures.
"""
import argparse, json, os, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image
from frame_reconstruction.geometry import read_image, sample, source_coordinates

TOOLS=Path(__file__).parent

def run(tool,*args):
    command=[sys.executable,str(TOOLS/tool),*[str(a) for a in args]]
    print('RUN',tool,*args,flush=True)
    subprocess.run(command,check=True,env=os.environ)

def main(root, source, steps):
    root=root.absolute()
    source=source.absolute()
    if not (root/'preparation.json').exists():run('frame-reconstruction-fit.py','prepare',root,'--source',source)
    if not (root/'train-fit.json').exists():run('frame-reconstruction-fit.py','fit',root,'--source',source,'--steps',steps)
    # Match the public composer's premultiplied native geometry while avoiding
    # unnecessary full-card captures of intermediate texture candidates.
    out=root/'train-native';out.mkdir(exist_ok=True)
    if not (out/'render-plate-1.png').exists():
        data=read_image(root/'train-reconstructed-material.png');h,w=data.shape[:2]
        y,x=np.mgrid[:h,:w];x=(x+.5)*488/w-.5;y=(y+.5)*680/h-.5
        geometry=json.loads((root/'geometry.json').read_text())
        sx,sy=source_coordinates(x,y,data.shape,geometry['knots'])
        a=data[...,3:];value=sample(np.concatenate([data[...,:3]*a,a],-1),sx,sy)
        value[...,:3]/=value[...,3:].clip(1e-8)
        Image.fromarray(np.round(np.clip(value,0,1)*255).astype('uint8')).save(out/'render-plate-1.png')
    if not (root/'refine/consensus.npz').exists():run('frame-reconstruction-refine.py','prepare',root)
    if not (root/'refine/fit.json').exists():run('frame-reconstruction-refine.py','fit',root,'--steps',steps)
    if not (root/'art-source/receipt.json').exists():run('frame-reconstruction-art.py',root,'--inputs',root.parent/'inputs.json')
    if not (root/'border/fit.json').exists():run('frame-reconstruction-border.py',root)
    if not (root/'inner-border/fit.json').exists():run('frame-reconstruction-inner-border.py',root)
    if not (root/'joint/fit.json').exists():run('frame-reconstruction-corners.py',root,'--steps',steps)
    radius=json.loads((root/'border/fit.json').read_text())['cornerRadius']
    (root/'candidates.json').write_text(json.dumps({'candidates':[
        {'key':'best','title':'Experimental Alpha frame','file':'joint/backprop-plate.png',
         'artSource':'art-source/{id}-feather.png','cornerRadius':radius}],
         'source':str(source.relative_to(root.absolute())),
         'scope':'Shared material geometry/color/texture; frozen per-scan normalization'},indent=2)+'\n')
    print('COMPLETE',root,flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('root',type=Path);p.add_argument('source',type=Path);p.add_argument('--steps',type=int,default=80);a=p.parse_args()
    main(a.root,a.source,a.steps)
