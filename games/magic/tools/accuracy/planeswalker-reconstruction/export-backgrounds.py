from pathlib import Path
import json,sys
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates
from hsb_values import to_hsv,adjust
if len(sys.argv)!=4:raise SystemExit('Pass study, cached alternative assets, background-study output')
root=Path(sys.argv[1]);alternatives=Path(sys.argv[2]);output=Path(sys.argv[3])
reports=json.loads((output/'report.json').read_text())['records']
template=np.asarray(Image.open(root/'source/planeswalker_bg.webp').convert('RGBA'),np.float32)/255
h,w=template.shape[:2]
for row in reports:
    name=row['asset'];out=output/name;out.mkdir(exist_ok=True)
    source=template if name=='current' else np.asarray(Image.open(alternatives/(name+'.png')).convert('RGBA'),np.float32)/255
    result=template.copy();parameters=list(row['adjustment'].values())
    for start in range(0,h,128):
        yy,xx=np.mgrid[start:min(start+128,h),:w]
        if name=='current':rgb=source[start:start+yy.shape[0],:,:3]
        else:
            x=.03937*488+(xx+.5)/w*(.92126*488)
            y=.02531*680+(yy+.5)/h*(.92126*488*3793/2778)
            rgb=np.stack([map_coordinates(source[...,c],[(y+.5)*source.shape[0]/680-.5,(x+.5)*source.shape[1]/488-.5],order=1,mode='nearest') for c in range(3)],-1)
        result[start:start+yy.shape[0],:,:3]=adjust(to_hsv(rgb),parameters)
    Image.fromarray(np.uint8(np.round(np.clip(result,0,1)*255))).save(out/'planeswalker-bg-U.png')
    print(name,flush=True)
