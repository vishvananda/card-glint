"""Paper diagnostics retain geometry when pigment changes luminance ordering."""
import sys
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"games/magic/tools/accuracy"))
from old_frame_paper_texture import signals,corr
y,x=np.mgrid[:150,:330];pattern=np.sin(x/23)+.5*np.cos(y/13)+.3*np.sin((x+y)/31)
source=180+pattern[:,:,None]*np.array([10.,0.,-10.])
target=205+pattern[:,:,None]*np.array([5.,-10.,-5.])
a,b=signals(source),signals(target)
assert corr(a["luma"][10],b["luma"][10])<-.8
assert corr(a["yellowBlue"][10],b["yellowBlue"][10])>.8
assert corr(np.zeros((10,10)),np.zeros((10,10))) is None
print("Paper chroma retains the shared pattern across reversed luminance; flat fields stay unmeasured.")
