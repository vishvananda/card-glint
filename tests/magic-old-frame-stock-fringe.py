"""Aperture leaks count; transparent holes and enclosed white paper do not."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"games/magic/tools/accuracy"))
from old_frame_stock_fringe import outer_white,fringe_area
a=np.full((680,488,4),255,dtype=np.uint8)
a[20:660,22:466,:3]=[70,60,50]
a[80:380,60:428,3]=0
a[420:600,60:428,:3]=255
mask=outer_white(Image.fromarray(a))
assert not mask[100,100] and not mask[500,100],"Interior white is not source stock"
bad=fringe_area(mask,[0,0,1,1],[20/488,20/680,448/488,640/680])
good=fringe_area(mask,[0,0,1,1],[22/488,20/680,444/488,640/680])
assert bad["left"]>500 and bad["right"]>500,bad
assert good["total"]==0,good
print("Exposed white stock detected on both sides; enclosed paper and transparent art ignored.")
