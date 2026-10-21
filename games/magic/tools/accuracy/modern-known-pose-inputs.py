"""Freeze frame-control selection, then warp original full-resolution scans.

No renderer or text pixels determine registration. Control matrices are in the
centered488x680 comparison space; the raster warp is applied before downsampling.
"""
import sys,json,math,hashlib,shutil
from pathlib import Path
import cv2
import numpy as np
obs_file,input_file,template_file,cache_dir,out_dir=map(Path,sys.argv[1:])
read=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
obs=read(obs_file);inputs=read(input_file);templates=read(template_file)
assert obs["inputHash"]==sha(input_file)
assert templates["observationsHash"]==sha(obs_file)
by_id={e["id"]:e for e in inputs["entries"]}; observations={e["id"]:e for e in obs["rows"]}
cases=[("identity",1,1,0,0,0,0),("translation",1,1,1.3,-1.1,0,0),("uniform",1.004,1.004,0,0,0,0),("rotation",1,1,0,0,.2,0),("shear",1,1,0,0,0,.15),("axis-scale",.997,1.005,0,0,0,0),("combined",1.003,.998,1.1,-.8,.15,-.1)]
controls=[]
for family,t in sorted(templates["templates"].items()):
 selected=[];names=set()
 for id in sorted(t["members"]):
  if observations[id]["oracleId"] not in names:
   selected.append(id);names.add(observations[id]["oracleId"])
  if len(selected)==2:break
 if len(selected)<min(2,len(t["members"])):
  selected+= [id for id in sorted(t["members"]) if id not in selected][:2-len(selected)]
 for id in selected:
  for label,sx,sy,tx,ty,rot,shear in cases:
   c=math.cos(math.radians(rot));s=math.sin(math.radians(rot));k=math.tan(math.radians(shear))
   controls.append({"id":id,"name":by_id[id]["card"]["name"],"geometry":family,"label":label,"parameters":{"sx":sx,"sy":sy,"tx":tx,"ty":ty,"rotation":rot,"shear":shear},"matrix":[sx*c,sx*s,sy*(c*k-s),sy*(s*k+c),tx,ty],"referenceHash":by_id[id]["reference"]["sha256"],"file":id+"/"+label+".png"})
definition={"schema":1,"scope":"UUID-selected first two distinct names per frozen geometry/material template, or all available names and a second printing when fewer exist. Selection precedes control fitting; no acceptance-score filtering. Full-resolution source warps precede the usual488x680 downsample.","observationsHash":sha(obs_file),"inputsHash":sha(input_file),"templatesHash":sha(template_file),"generatorHash":sha(Path(__file__)),"opencv":cv2.__version__,"numpy":np.__version__,"controls":controls}
out_dir.mkdir(parents=True,exist_ok=True)
selection=out_dir/"selection.json"
if selection.exists():assert read(selection)==definition,"Use a new directory after changing selection or method"
else:selection.write_text(json.dumps(definition,indent=2)+"\n")
for i,row in enumerate(controls):
 source=cache_dir/"objects"/row["referenceHash"];assert sha(source)==row["referenceHash"]
 target=out_dir/row["file"];target.parent.mkdir(exist_ok=True)
 if row["label"]=="identity":shutil.copyfile(source,target)
 else:
  im=cv2.imread(str(source),cv2.IMREAD_UNCHANGED);h,w=im.shape[:2]
  f=min(488/w,680/h);px=(488-w*f)/2;py=(680-h*f)/2
  center=np.array([(244-px+.5)/f-.5,(340-py+.5)/f-.5])
  a,b,c,d,tx,ty=row["matrix"];A=np.array([[a,c],[b,d]])
  shift=np.array([tx,ty])/f+(np.eye(2)-A)@center
  M=np.column_stack((A,shift))
  warped=cv2.warpAffine(im,M,(w,h),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
  assert cv2.imwrite(str(target),warped)
 row["sha256"]=sha(target);row["bytes"]=target.stat().st_size
 if (i+1)%35==0:print("known raster",i+1,"/",len(controls),flush=True)
manifest={**definition,"selectionHash":sha(selection),"controls":controls}
(out_dir/"controls.json").write_text(json.dumps(manifest,indent=2)+"\n")
print(json.dumps({"sources":len({r["id"] for r in controls}),"controls":len(controls)}))
