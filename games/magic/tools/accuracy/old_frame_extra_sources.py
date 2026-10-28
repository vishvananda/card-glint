"""Freeze additional pinned MSE source candidates without modifying originals."""
import argparse,json,os
from io import BytesIO
from pathlib import Path
from PIL import Image
from old_frame_geometry import digest

def run(source, metadata, cache, output):
    source,metadata,cache,output=map(Path,[source,metadata,cache,output])
    output.mkdir()
    raw=(source/"inputs.json").read_bytes();data=json.loads(raw);extra=json.loads(metadata.read_text())
    assets=[]
    for a in extra:
        if "/magic-old.mse-style/" not in a["url"] or not a["url"].endswith("card.jpg"):continue
        key=a["url"].split("/")[-1][:-8].upper()
        if key=="CL":key="L"
        if key not in {r["key"] for r in data["rows"]}:continue
        b=(cache/"objects"/a["sha256"]).read_bytes();assert digest(b)==a["sha256"]
        im=Image.open(BytesIO(b)).convert("RGBA");assert im.size==(375,523)
        # The pinned MSE style declares this exact image field at z index 1.
        box=(45,51,331,284);im.paste((0,0,0,0),box);buffer=BytesIO();im.save(buffer,format="PNG")
        image=buffer.getvalue();sha=digest(image);(cache/"objects"/sha).write_bytes(image)
        assets.append({"key":key,"family":"mse-old","url":a["url"],"sha256":sha,"sourceSha256":a["sha256"],
            "preprocess":{"operation":"clear pinned MSE style illustration field","box":box},"rect":[0,0,1,1]})
    assert assets
    data.update({"assets":assets,"extraSources":{"parentInputHash":digest(raw),"metadataHash":digest(metadata.read_bytes()),
        "toolHash":digest(Path(__file__).read_bytes()),"scope":"Source-only candidate derivations; not shipped or adopted."}})
    for row in data["rows"]:
        if not row["accepted"]:continue
        f=source/(row["id"]+".png");assert digest(f.read_bytes())==row["normalizedHash"]
        os.link(f,output/f.name)
    (output/"inputs.json").write_text(json.dumps(data,indent=2)+"\n")
    print(data["set"],len(assets),"source candidates",flush=True)
if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("source");p.add_argument("metadata");p.add_argument("cache");p.add_argument("output")
    a=p.parse_args();run(a.source,a.metadata,a.cache,a.output)
