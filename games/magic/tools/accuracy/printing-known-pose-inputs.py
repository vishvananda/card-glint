"""Generate full-resolution scan-pose controls; no renderer output is used."""
import hashlib,importlib.util,json,shutil,sys
from pathlib import Path
import cv2
root=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("native_warp",root/"modern-known-pose-inputs.py")
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
input_file,norm_file,cache,out=map(Path,sys.argv[1:5])
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
inputs=json.loads(input_file.read_text());norm=json.loads(norm_file.read_text())
by_id={e["id"]:e for e in inputs["entries"]}
selected={r["id"] for r in norm["rows"] if not r["accepted"]}
for family in sorted({r["geometry"] for r in norm["rows"]}):
 names=set()
 for r in sorted((r for r in norm["rows"] if r["geometry"]==family),key=lambda r:r["id"]):
  name=by_id[r["id"]]["card"]["oracle_id"]
  if name in names:continue
  selected.add(r["id"]);names.add(name)
  if len(names)==2:break
raw=[("identity",1,1,0,0,0,0),("translation",1,1,.8,-.6,0,0),
 ("uniform",1.0015,1.0015,0,0,0,0),("rotation",1,1,0,0,.08,0),
 ("shear",1,1,0,0,0,.08),("axis-scale",1.0015,.9985,0,0,0,0),
 ("axis-scale-reverse",.999,1.001,0,0,0,0),
 ("combined",1.001,.999,.6,-.4,.06,-.04)]
cases=[dict(zip(["label","sx","sy","tx","ty","rotation","shear"],r)) for r in raw]
definition={"schema":1,"set":inputs["set"],"inputHash":sha(input_file),"normalizationHash":sha(norm_file),
 "selection":"All initially rejected references plus UUID-first two distinct card identities per material. Selection is fixed before control evaluation; no acceptance-score filtering.",
 "selected":sorted(selected),"cases":cases,"limits":{"cornerRms":.35,"cornerMax":.6},
 "toolHash":sha(Path(__file__)),"nativeWarpHelperHash":sha(root/"modern-known-pose-inputs.py")}
out.mkdir(exist_ok=True,parents=True);selection=out/"selection.json"
if selection.exists():assert json.loads(selection.read_text())==definition
else:selection.write_text(json.dumps(definition,indent=2)+"\n")
rows=[]
for identifier in sorted(selected):
 e=by_id[identifier];source=cache/"objects"/e["reference"]["sha256"]
 assert sha(source)==e["reference"]["sha256"]
 image=cv2.imread(str(source),cv2.IMREAD_UNCHANGED)
 for c in cases:
  matrix=module.matrix(c);file=identifier+"/"+c["label"]+".png";target=out/file
  target.parent.mkdir(exist_ok=True)
  if c["label"]=="identity":shutil.copyfile(source,target)
  else:assert cv2.imwrite(str(target),module.native_warp(image,matrix))
  rows.append({"id":identifier,"name":e["card"]["name"],"label":c["label"],"matrix":matrix,"referenceHash":e["reference"]["sha256"],"file":file,"sha256":sha(target)})
(out/"controls.json").write_text(json.dumps({"definition":definition,"controls":rows},indent=2)+"\n")
print(json.dumps({"sources":len(selected),"controls":len(rows)}))
