"""Validate reviewed artifacts and publish this node's completion marker."""
import hashlib
import json
import math
from pathlib import Path
from PIL import Image

P=Path(__file__).resolve().parent
def read(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
part=read(P/'candidate.json')
camera=P.parent.parent/'camera-contract.json'
view=read(P/'view.json')
report=read(P/'round7.render.json')
manifest=read(P/'manifest.json')
assert report['errors']==[]
assert report['camera_contract_sha256']==part['camera_contract_sha256']==view['camera_contract_sha256']==sha(camera)
assert sha(camera).startswith(manifest['camera_hash'])
snapshot,prefix=manifest['parent_snapshot'].split(':')
assert sha(P.parent/snapshot).startswith(prefix)
assert Image.open(P/'target.png').size==Image.open(P/'round7.png').size==tuple(view['output_size'])
components=part['components']
ids=[g['id'] for g in components]
assert len(ids)==len(set(ids))==1052
assert all(i.startswith('north-housing/') for i in ids)
ref=part['child_refs'][0]
assert ref['included_in_components'] is True
assert sha(P/ref['path'])==ref['sha256']
child=read(P/ref['path'])
copied=[g for g in components if 'source_id' in g]
assert len(copied)==len(child['components'])==240
originals={g['id']:g for g in child['components']}
for g in copied:
    restored=dict(g)
    restored['id']=restored.pop('source_id')
    assert restored==originals[restored['id']]
def finite(value):
    if isinstance(value,float): assert math.isfinite(value)
    elif isinstance(value,list):
        for item in value: finite(item)
    elif isinstance(value,dict):
        for item in value.values(): finite(item)
finite(components)
base=read(P.parent/'scene/base.json')['components']
assert read(P/'integrated-preview.json')['components']==base+components
verification=dict(status='passed',camera_contract_sha256=sha(camera),components=len(components),
                  owned_local_components=812,flattened_child_components=240,children=part['children'],
                  child_sha256=ref['sha256'],render='round7.png',comparison='round7-compare.png',
                  render_errors=report['errors'],resolution=view['output_size'],
                  triangles_with_parent_context=report['triangles'],
                  visual_review='Personally inspected rounds 5, 6, 7 at equal 2x scale. Paths connected, rear lawn trimmed; child and district relationships accepted.',
                  remaining_context='West-civic occlusion and root road geometry are reserved for root integration.')
(P/'verification.json').write_text(json.dumps(verification,indent=2)+'\n')
(P/'part.json').write_bytes((P/'candidate.json').read_bytes())
assert read(P/'part.json')==part
print(json.dumps(verification,ensure_ascii=False))
