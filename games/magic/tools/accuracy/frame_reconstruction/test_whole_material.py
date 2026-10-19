"""Small offline checks for reconstruction coverage and differentiable fitting."""
import importlib.util
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

import numpy as np
from PIL import Image
import torch


def run():
    sys.path.insert(0,str(Path(__file__).parents[1]))
    spec=importlib.util.spec_from_file_location('whole',Path(__file__).parents[1]/'frame-reconstruction-whole-material.py')
    whole=importlib.util.module_from_spec(spec);spec.loader.exec_module(whole)
    torch.set_num_threads(2)
    with TemporaryDirectory() as temp:
        root=Path(temp);source=np.ones((680,488,4),dtype=np.float32)
        source[...,:3]=.35;source[410:603,65:426,:3]=.23
        source[65:371,55:435,3]=0
        scan=source.copy();scan[...,:3]-=.025
        # Fine scan print dots must not turn the entire dark paper into ink.
        scan[::4,::4,:3]-=.07
        scan[450:462,110:270,:3]=.025
        for name,data in [('source',source),('scan',scan)]:
            Image.fromarray(np.round(data.clip(0,1)*255).astype('uint8')).save(root/(name+'.png'))
        row=dict(reference=dict(file=str(root/'scan.png')),normalization=dict(transform=dict(matrix=[1,0,0,1,0,0])))
        _,_,_,mask,counts=whole.prepare(root,root/'source.png',row)
        assert counts['paper']>10000,counts
        assert counts['frame']>10000,counts
        assert not mask[452:460,115:265].any(),'Printed strokes entered the texture fit'
        assert not mask[100:330,100:400].any(),'Art aperture entered the texture fit'
    # Both paper and frame share one differentiable RGB field and global tone.
    luma=torch.nn.Parameter(torch.zeros(1,1,8,8));chroma=torch.nn.Parameter(torch.zeros(1,3,3,3));global_rgb=torch.nn.Parameter(torch.zeros(1,3,1,1))
    grid=torch.tensor([[[[-.7,-.7],[.2,.5]]]])
    source=torch.tensor([[[[.5,.23]],[[.45,.20]],[[.4,.18]]]])
    target=source-.035
    optimizer=torch.optim.Adam([luma,chroma,global_rgb],lr=.006)
    initial=(source-target).abs().mean().item()
    for _ in range(24):
        optimizer.zero_grad();result=source+global_rgb+whole.correction(luma,chroma,grid)
        loss=(result-target).square().mean();loss.backward();optimizer.step()
    assert (result-target).abs().mean().item()<initial/3
    from frame_reconstruction.material_fill import fill_scalar
    from frame_reconstruction.tone import adjust
    domain=np.zeros((20,35),bool);domain[2:18,1:11]=True;domain[2:18,14:24]=True;domain[2:18,28:34]=True
    known=np.zeros_like(domain);known[3:17:4,2:10:3]=True;known[3:17:4,15:23:3]=True
    field=np.zeros(domain.shape);field[:,1:11]=.05;field[:,14:24]=-.08
    filled,_=fill_scalar(field,known,domain)
    assert np.max(abs(filled[domain&(np.indices(domain.shape)[1]<11)]-.05))<1e-6
    assert np.max(abs(filled[domain&(np.indices(domain.shape)[1]>13)&(np.indices(domain.shape)[1]<24)]+.08))<1e-6
    assert not filled[:,28:].any(),'Unsupported disconnected component changed'
    assert not filled[~domain].any(),'Art/stock exclusion leaked'
    colors=np.array([[.8,.2,.2],[.3,.5,.7],[0,0,0]])
    assert np.max(abs(adjust(colors,[0,0,0,0])-colors))<1e-7
    assert np.max(abs(adjust(colors[:1],[120,0,0,0])-np.array([[.2,.8,.2]])))<1e-7
    from scipy.optimize import least_squares
    rng=np.random.default_rng(31);colors=rng.uniform(.2,.75,(32,3)).astype('float32')
    expected=np.array([4,np.log(.8),np.log(.9),np.log(.9)]);target=adjust(colors,expected)
    recovered=least_squares(lambda p:(adjust(colors,p)-target).ravel(),np.zeros(4)).x
    assert np.max(abs(recovered-expected))<.001,'Float32 source pixels must not flatten numerical tone gradients'
    print('Whole-material checks passed: dark paper survives scan grain, text/art stay excluded, shared gradients improve frame and paper.')


if __name__=='__main__':run()
