"""Numerical checks for the offline shared-frame fitter."""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import map_coordinates

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "games/magic/tools/accuracy"))
from old_frame_geometry import Plate, extract_reference, compare, optimize, footprints, IDENTITY, ALONG

im=Image.new("RGBA",(488,680),(15,15,15,255))
draw=ImageDraw.Draw(im)
draw.rectangle((25,26,463,653),fill=(150,130,100,255))
draw.rectangle((51,60,437,378),fill=(245,232,190,255))
draw.rectangle((53,62,435,376),fill=(50,42,32,255))
draw.rectangle((56,65,432,373),fill=(0,0,0,0))
draw.rectangle((49,404,439,608),fill=(65,55,42,255))
draw.rectangle((52,407,436,605),fill=(240,225,195,255))
plate=Plate(im,[0,0,1,1],[127,127,127])
expected=np.array([1.5,-1.,1.005,.997])
yy,xx=np.mgrid[:680,:488]
u=(xx+.5-244-expected[0])/expected[2]+244-.5
v=(yy+.5-340-expected[1])/expected[3]+340-.5
reference=np.stack([map_coordinates(plate.rgb[:,:,c],[v,u],order=1,mode="nearest",prefilter=False) for c in range(3)],axis=2)
observed=extract_reference(reference,"fit")
found,value=optimize(plate,observed)
assert np.max(np.abs(found[:2]-expected[:2]))<.2,(found,expected)
assert np.max(np.abs(found[2:]-expected[2:]))<.001,(found,expected)
color=extract_reference(reference*.7+20,"fit")
found_color,_=optimize(plate,color)
assert np.max(np.abs(found_color-found))<1e-6,(found,found_color)
for cohort in ALONG:
    mask=np.zeros((680,488),bool)
    for _,x,y in footprints(cohort):
        mask[y.astype(int),x.astype(int)]=True
    altered=np.random.default_rng(123).uniform(0,255,reference.shape)
    altered[mask]=reference[mask]
    original=extract_reference(reference,cohort)
    changed=extract_reference(altered,cohort)
    for a,b in zip(original,changed):
        np.testing.assert_array_equal(a[0],b[0])
        np.testing.assert_array_equal(a[1],b[1])
before=compare(observed,plate.profiles(IDENTITY,"fit"))[0]
assert value>before+.05,(value,before)
print("Shared geometry recovers known translation/scales, tolerates global brightness, and ignores pixels outside fixed measurement footprints.")

# Actual reference footprints, including smoothing, cannot share pixels across groups.
seen=set()
for cohort in ALONG:
    now=set()
    for _,x,y in footprints(cohort):
        now.update(zip(x.astype(int).ravel().tolist(),y.astype(int).ravel().tolist()))
    assert not seen.intersection(now),cohort
    seen.update(now)
print("Fitting, validation and certificate sample footprints are spatially disjoint.")
