"""Known native-layer geometry and source-local gradient regression controls."""
import sys
from pathlib import Path
import numpy as np
from scipy.ndimage import gaussian_filter
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"games/magic/tools/accuracy"))
import old_frame_symbol_fit as symbols
import old_frame_land_color_fit as lands
from old_frame_color_distribution import apply,parameters,lab

y,x=np.mgrid[:680,:488]
anchor=(438,391)
alpha=(((x-420)/13)**2+((y-391)/11)**2<1).astype(float)
alpha[(x<419)&(y<390)]=0
alpha=gaussian_filter(alpha,.55)
gray=alpha*(.08+.5*np.clip((x-407)/26,0,1))
truth=np.array([1.5,-.75,8,-4])
aa=symbols.warp(alpha,truth,x.ravel(),y.ravel(),anchor).reshape(alpha.shape)
gg=symbols.warp(gray,truth,x.ravel(),y.ravel(),anchor).reshape(alpha.shape)
reference=.9*gg+.04*aa+(1-aa)*(.75+.001*(x-420)+.001*(y-391))
data=symbols.make_data(alpha,gray,reference,anchor)
result=symbols.fit(data)
assert result["accepted"],result
np.testing.assert_allclose(result["parameters"],truth,atol=.12)
assert result["after"]["loss"]<result["before"]["loss"]*.005
flat=symbols.make_data(alpha,gray,np.full(alpha.shape,.75),anchor)
assert not symbols.fit(flat)["accepted"],"Flat paper cannot approve a symbol"

rng=np.random.default_rng(751)
rgb=np.clip(np.array([.78,.68,.49])+rng.normal(0,.025,(1500,3)),.1,.95)
t=np.tile(np.linspace(.06,.94,100),15)
a=parameters(dict(hueDegrees=4,saturationScale=1.15,brightnessScale=1.02))
b=parameters(dict(hueDegrees=135,saturationScale=.7,brightnessScale=.97))
target=apply(rgb,a)[0]*(1-t[:,None])+apply(rgb,b)[0]*t[:,None]
training=np.arange(len(rgb))%2==0
p,opt=lands.fit_gradient(rgb[training],target[training],t[training])
assert opt["converged"],opt
held=~training
prediction=apply(rgb[held],p[:6])[0]*(1-t[held,None])+apply(rgb[held],p[6:])[0]*t[held,None]
error=np.linalg.norm(lab(prediction)-lab(target[held]),axis=1)*100
assert error.mean()<.15,error.mean()
assert np.max(error)<.8,np.max(error)
print("Symbol shift and independent scales recovered; blank reference rejected. Source-local gradient predicts held texture samples.")
