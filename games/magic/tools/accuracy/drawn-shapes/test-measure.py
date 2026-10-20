"""Controls for displacement, tone changes and a misleading second outline."""
import tempfile
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from measure import measure,compare

with tempfile.TemporaryDirectory() as directory:
    directory=Path(directory)
    def fixture(name,shift=0,tone=1.,double=False):
        image=Image.new('RGB',(732,1020),(65,65,65));d=ImageDraw.Draw(image)
        d.rounded_rectangle((44,571+shift,692,631+shift),radius=18,fill=(15,15,15))
        d.rounded_rectangle((47,574+shift,689,628+shift),radius=15,fill=(220,220,220))
        if double:d.rectangle((80,580+shift,650,583+shift),fill=(15,15,15))
        a=np.asarray(image,dtype=float);a=np.clip(255*(a/255)**1.15*tone,0,255)
        p=directory/(name+'.png');Image.fromarray(np.uint8(a)).save(p);return measure(p)
    base=fixture('base')
    for shift in [-3,3,6]:
        moved=fixture('moved',shift=shift,tone=.75)
        result=compare(moved,base)
        assert result['top']['status']=='measured',result
        assert abs(result['top']['straightOffset']-shift/1.5)<.21,result
    double=fixture('double',double=True)
    assert sum(p['status']=='ambiguous' for p in double['top'])>100
    result=compare(double,base)
    assert result['top']['straightProbes']<100,result
    assert result['top']['status']=='uncertain',result
print('Signed displacement survives tone changes; competing parallel boundaries are rejected.')
