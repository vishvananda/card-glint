"""Shared Alpha land material, with supplied tint masks and shared color palettes.

No land-specific pixels are learned: neutral frame texture is pooled, and five
color palettes are estimated across the basic/dual lands that contain each color.
The synthetic missing pair never contributes observations or scores.
"""
import argparse, importlib.util, json, os, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import binary_erosion, gaussian_filter
from frame_reconstruction.geometry import read_image, sample, source_coordinates

def module(file):
    spec=importlib.util.spec_from_file_location(file.stem,file); m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def run(root,steps):
    tools=Path(__file__).parent; pipeline=module(tools/'frame-reconstruction-set.py'); fit=module(tools/'frame-reconstruction-fit.py'); refine=module(tools/'frame-reconstruction-refine.py')
    root=root.absolute();source=root/'inputs/dual-neutral-sharpened.png';obs=json.loads((root/'observations.json').read_text())
    if not (root/'preparation.json').exists():fit.prepare(root,source)
    if not (root/'land-mask-receipt.json').exists():
        masks=[read_image(root/'inputs/dual-masks'/f'dual-{region}-{color}.png')[...,0] for region in ['rules','border'] for color in ['a','b']]
        union=np.clip(sum(masks),0,1); receipts=[]
        for row in obs['records']:
            p=root/'prepared'/f"{row['id']}.npz"
            with np.load(p) as data: values={k:data[k] for k in data.files}
            grid=values['grid'];sx=(grid[...,0]+1)*union.shape[1]/2-.5;sy=(grid[...,1]+1)*union.shape[0]/2-.5
            allowed=sample(union[...,None],sx,sy)[...,0]<.001
            values['mask'] &= binary_erosion(allowed,iterations=4)
            np.savez_compressed(p,**values);receipts.append({'id':row['id'],'pixels':int(values['mask'].sum())})
        refine.save_json(root/'land-mask-receipt.json',{'records':receipts,'policy':'Shared neutral texture excludes all color tint masks before fitting.'})
    pipeline.main(root,source,steps)
    base=read_image(root/'joint/backprop-plate.png');h,w=base.shape[:2]
    yy,xx=np.mgrid[:h,:w];x=(xx+.5)*488/w-.5;y=(yy+.5)*680/h-.5
    geo=json.loads((root/'geometry.json').read_text());sx,sy=source_coordinates(x,y,base.shape,geo['knots'])
    masks={f'{r}_{c}':sample(read_image(root/'inputs/dual-masks'/f'dual-{r}-{c}.png')[...,:1],sx,sy)[...,0] for r in ['rules','border'] for c in ['a','b']}
    material=module(root/'inputs/frame_material.py');config=json.loads((root/'inputs/dual-land-palettes.json').read_text());palettes=config['palettes']
    colors=['plains','island','swamp','mountain','forest'];measurements={(r,c):[] for r in ['rules','border'] for c in colors};maps={}
    for row in obs['records']:
        name=row['name'].lower().replace(' ','-');pairs={c:name for c in ['a','b']} if name in colors else {c:palettes[name]['color_'+c] for c in ['a','b']};maps[row['id']]=pairs
        reference=read_image(root/'art-source'/f"{row['id']}-reference.png");rx=(xx+.5)*reference.shape[1]/w-.5;ry=(yy+.5)*reference.shape[0]/h-.5;target=sample(reference,rx,ry)[...,:3];lab=material.rgb_to_lab(target*255)
        gray=target@np.array([.2126,.7152,.0722]);noink=gray>gaussian_filter(gray,2)-.035
        for region in ['rules','border']:
            for c in ['a','b']:
                mask=masks[region+'_'+c]>.99
                if name in colors:mask=(masks[region+'_a']+masks[region+'_b'])>.99
                # Border tint stripes are intentionally only a few source pixels wide.
                # Their opaque cores already exclude antialiasing; eroding them
                # like the broad rules paper would discard all valid samples.
                if region == 'rules':mask=binary_erosion(mask,iterations=2)
                mask &= noink
                if mask.sum()<100:raise ValueError(f'Insufficient land palette support: {row["name"]} {region} {c} {mask.sum()}')
                measurements[(region,pairs[c])].append(np.median(lab[mask],axis=0))
    shared={region:{color:np.median(measurements[(region,color)],axis=0).tolist() for color in colors} for region in ['rules','border']}
    refs={region:float(np.median(material.rgb_to_lab(base[...,:3]*255)[...,0][masks[region+'_a']+masks[region+'_b']>.99])) for region in ['rules','border']}
    output=root/'land-plates';output.mkdir(exist_ok=True)
    for identifier,pairs in [*maps.items(),('synthetic-volcanic-island',{'a':'mountain','b':'island'})]:
        lab=material.rgb_to_lab(base[...,:3]*255);result=lab.copy();union=np.zeros((h,w))
        for region in ['rules','border']:
            a,b=masks[region+'_a'],masks[region+'_b'];t=[]
            for c in ['a','b']:
                color=shared[region][pairs[c]];v=lab.copy();v[...,0]+=color[0]-refs[region];v[...,1]=color[1];v[...,2]=color[2];t.append(v)
            result=result*(1-a-b)[...,None]+t[0]*a[...,None]+t[1]*b[...,None];union=np.maximum(union,a+b)
        full=base.copy();rgb=material.lab_to_rgb(result)/255;full[...,:3][union>0]=rgb[union>0];refine.save_png(output/f'{identifier}.png',full)
    receipt={'sharedLab':shared,'measurementCounts':{r:{c:len(measurements[(r,c)]) for c in colors} for r in ['rules','border']},'cards':len(obs['records']),'policy':'All 19 historical land scans estimate five shared color swatches; basic and dual lands reuse the same per-color values. Volcanic Island is synthetic, excluded from fitting.'}
    refine.save_json(root/'land-palette-fit.json',receipt)
    manifest=json.loads((root/'candidates.json').read_text());manifest['candidates'][0]['perCardFile']='land-plates/{id}.png';manifest['candidates'][0]['file']='land-plates/'+obs['records'][0]['id']+'.png';refine.save_json(root/'candidates.json',manifest)

if __name__=='__main__':
    import torch
    torch.set_num_threads(2);torch.manual_seed(123)
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('root',type=Path);p.add_argument('--steps',type=int,default=80);a=p.parse_args();run(a.root,a.steps)
