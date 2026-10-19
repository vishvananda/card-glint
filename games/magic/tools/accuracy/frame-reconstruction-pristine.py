"""Restore uncalibrated source pigment under the frozen experimental geometry.

Outer stock/inner-band assets remain independent. No prior HSB or reconstructed
chroma is carried into the material. All external raster inputs remain local.
"""
import argparse,hashlib,importlib.util,json,os,shutil
from pathlib import Path
import numpy as np
from scipy.ndimage import distance_transform_edt
from frame_reconstruction.geometry import read_image,sample,source_coordinates


def module(name):
    spec=importlib.util.spec_from_file_location(name,Path(__file__).with_name(name+'.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m


refine=module('frame-reconstruction-refine')


def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare(root,out):
    out.mkdir(parents=True,exist_ok=False)
    geometry=json.loads((root/'geometry.json').read_text())
    current=json.loads((root/'candidates.json').read_text())
    original=read_image(root/'joint/backprop-plate.png')
    stock=read_image(root/'border/stock-mask.png')[...,:1]
    motion=np.load(root/'refine/motion.npy')
    h,w=original.shape[:2];yy,xx=np.mgrid[:h,:w];x=(xx+.5)*488/w-.5;y=(yy+.5)*680/h-.5
    receipts=[]
    def warp(source_path):
        source=read_image(source_path);sx,sy=source_coordinates(x,y,source.shape,geometry['knots']);a=source[...,3:]
        value=sample(np.concatenate([source[...,:3]*a,a],-1),sx,sy);value[...,:3]/=value[...,3:].clip(1e-8)
        value=refine.warp_full(value,motion)
        valid=value[...,3]>.99
        # Keep the established art aperture and antialiasing, filling at most
        # its tiny geometric fringe with adjacent source material, never art.
        nearest=distance_transform_edt(~valid,return_distances=False,return_indices=True)
        rgb=value[...,:3].copy();rgb[~valid]=value[...,:3][tuple(nearest[:,~valid])]
        result=original.copy();result[...,:3]=rgb*(1-stock)+original[...,:3]*stock
        receipts.append(dict(source=source_path.relative_to(root).as_posix(),sha256=sha(source_path),fringePixels=int(((value[...,3]<.99)&(original[...,3]>.99)&(stock[...,0]<.01)).sum())))
        return result
    (out/'joint').mkdir()
    if root.name!='L':
        name=dict(W='white',U='blue',B='black',R='red',G='green',A='artifact')[root.name]
        value=warp(root/'inputs/sharpened-frames'/f'alpha-{name}-frame.png')
        refine.save_png(out/'joint/backprop-plate.png',value)
        candidate=dict(current['candidates'][0]);candidate['file']='joint/backprop-plate.png'
    else:
        neutral=warp(root/'inputs/dual-neutral-sharpened.png');refine.save_png(out/'joint/backprop-plate.png',neutral)
        # Use the supplied five-color style palette, never previous fitted values.
        spec=importlib.util.spec_from_file_location('source_material',root/'inputs/frame_material.py');material=importlib.util.module_from_spec(spec);spec.loader.exec_module(material)
        config=json.loads((root/'inputs/dual-land-palettes.json').read_text());palettes=config['palettes'];names=['plains','island','swamp','mountain','forest']
        shared={c:np.median([p['rules_'+k+'_lab'] for p in palettes.values() for k in 'ab' if p['color_'+k]==c],axis=0) for c in names}
        masks={c:sample(read_image(root/'inputs/dual-masks'/f'dual-rules-{c}.png')[...,:1],*source_coordinates(x,y,neutral.shape,geometry['knots']))[...,0] for c in 'ab'}
        observations=json.loads((root/'observations.json').read_text())['records'];(out/'land-plates').mkdir()
        for row in observations+[dict(id='synthetic-volcanic-island',name='Volcanic Island')]:
            key=row['name'].lower().replace(' ','-');preset=palettes.get(key)
            colors=[key,key] if key in names else [preset['color_a'],preset['color_b']] if preset else ['mountain','island']
            lab=material.rgb_to_lab(neutral[...,:3]*255);result=lab*(1-masks['a']-masks['b'])[...,None]
            for c,color in zip('ab',colors):
                tint=lab.copy();target=shared[color];tint[...,0]+=target[0]-config['baseline_lightness']['rules'];tint[...,1:]=target[1:]
                result+=tint*masks[c][...,None]
            value=neutral.copy();value[...,:3]=material.lab_to_rgb(result)/255
            refine.save_png(out/'land-plates'/(row['id']+'.png'),value)
        candidate=dict(current['candidates'][0]);candidate['perCardFile']='land-plates/{id}.png';candidate['file']='land-plates/'+observations[0]['id']+'.png'
    for name in ['observations.json','geometry.json','released-frame.png']:
        shutil.copyfile(root/name,out/name)
    os.symlink((root/'released-cards').resolve(),out/'released-cards')
    (out/'candidates.json').write_text(json.dumps(dict(candidates=[candidate]),indent=2)+'\n')
    (out/'pristine.json').write_text(json.dumps(dict(schema=1,policy='Uncalibrated supplied pigment; frozen geometry/warp and separate stock; alpha/aperture unchanged. Supplied land style palette is not a scan-fitted correction.',geometry=sha(root/'geometry.json'),warp=sha(root/'refine/motion.npy'),stock=sha(root/'border/stock-mask.png'),sources=receipts),indent=2)+'\n')
    print('Prepared pristine material',root.name,flush=True)


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('study',type=Path);p.add_argument('output',type=Path);p.add_argument('--colors',default='WUBRGAL');a=p.parse_args()
    for c in a.colors:prepare((a.study/c).resolve(),(a.output/c).resolve())
