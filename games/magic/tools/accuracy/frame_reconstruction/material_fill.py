"""Interpolate a scalar texture field beneath excluded lettering.

Only adjacent observed texture is used. Art holes, ink keylines and separate
stock components are boundaries; unsupported components retain the source.
"""
import numpy as np
from scipy.ndimage import label,find_objects,distance_transform_edt,convolve


def fill_scalar(field, known, domain, steps=240):
    labels,count=label(domain)
    result=np.zeros_like(field)
    kernel=np.array([[0,1,0],[1,0,1],[0,1,0]],dtype=float)
    report=[]
    for number,sl in enumerate(find_objects(labels),1):
        if sl is None:continue
        area=labels[sl]==number;fixed=known[sl]&area
        if fixed.sum()<10:continue
        values=field[sl].copy();nearest=distance_transform_edt(~fixed,return_distances=False,return_indices=True)
        missing=area&~fixed;values[missing]=values[tuple(nearest[:,missing])]
        degree=convolve(area.astype(float),kernel,mode='constant')
        for _ in range(steps):
            mean=convolve(values*area,kernel,mode='constant')/np.maximum(degree,1)
            values[missing]=mean[missing]
        result[sl][area]=values[area]
        report.append(dict(observed=int(fixed.sum()),interpolated=int(missing.sum())))
    return result,report
