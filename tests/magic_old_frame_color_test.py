"""Check the offline color fitter against the production HSV implementation."""
import json,subprocess,sys
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"games/magic/tools/accuracy"))
from old_frame_color_distribution import apply,parameters,adjustment,fit,lab
rng=np.random.default_rng(123);rgb=rng.uniform(0,1,(1000,3))
a={"hueDegrees":-17,"saturationScale":.6,"brightnessScale":1.12,"valueGamma":.72,"rgbScale":[1.04,.97,1/(1.04*.97)]}
p=parameters(a);prediction,_=apply(rgb,p)
script="""
import {createServer} from 'vite';
let text='';for await(const c of process.stdin)text+=c;
const {rgb,adjustment}=JSON.parse(text);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false}});
try{const {adjustHsb}=await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
process.stdout.write(JSON.stringify(rgb.map(c=>Math.max(...c)<.075?c:adjustHsb(c,adjustment))));}
finally{await server.close();}
"""
result=subprocess.run(["node","--input-type=module","-e",script],input=json.dumps({"rgb":rgb.tolist(),"adjustment":a}),text=True,capture_output=True,check=True,cwd=Path(__file__).resolve().parents[1])
np.testing.assert_allclose(prediction,np.array(json.loads(result.stdout)),atol=1e-12,rtol=1e-12)
source=rng.uniform(.45,.9,(1200,3))
known={"hueDegrees":4,"saturationScale":.25,"brightnessScale":1.0,"valueGamma":1.1,"rgbScale":[1.04,.97,1/(1.04*.97)]}
target,_=apply(source,parameters(known))
initial={"hueDegrees":0,"saturationScale":1,"brightnessScale":1}
chosen,_=fit(source,target,initial);after,_=apply(source,chosen)
error=np.linalg.norm(lab(after)-lab(target),axis=1).mean()*100
assert error<.01,error
np.testing.assert_allclose(lab(after)[:,1:].std(0),lab(target)[:,1:].std(0),atol=.0001)
print("Offline HSV/white-balance predictions match production within 1e-12; known shared tint/contrast is recovered without flattening chroma variation.")
