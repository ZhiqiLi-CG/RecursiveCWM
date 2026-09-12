"""Verify rendered candidate and immutable provenance before final delivery."""
import ast
import hashlib
import json
import math
from pathlib import Path
from PIL import Image

D=Path(__file__).resolve().parent
read=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
c=read(D/'candidate.json'); v=read(D/'view.json'); m=read(D/'manifest.json')
r=read(D/'resume-round3.render.json'); base=read(D/'base.json')
camera_sha=sha(D.parent.parent/'camera-contract.json')
assert camera_sha==c['camera_contract_sha256']==v['camera_contract_sha256']==r['camera_contract_sha256']
assert camera_sha=='07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c'
assert sha(D/'target.png')[:12]==m['reference_sha256']=='39586cac3756'
assert m=={'interface_version':1,'reference_sha256':'39586cac3756','camera_hash':'07ef728c04f7','parent_snapshot':'scene/base.json:5a9576da3b70','solver_hash':'37375ae59bf5','parent_node':'scene'}
assert sha(D/'base.json')==sha(D.parent/'scene/base.json')
assert sha(D/'base.json')[:12]=='5a9576da3b70'
assert r['errors']==[] and r['view']==v['crop_px']==[0,130,388,229]
assert Image.open(D/'target.png').size==Image.open(D/'resume-round3.png').size==(776,458)
ids=[g['id'] for g in c['components']]
assert len(ids)==len(set(ids))==423
assert not set(ids)&{g['id'] for g in base['components']}
expected=[]; counts={}
for ref in c['child_refs']:
    p=(D/ref['path']).resolve(); child=read(p)
    assert sha(p)==ref['sha256'] and ref['included_in_components'] is True
    assert child['camera_contract_sha256']==camera_sha
    counts[ref['node']]=len(child['components']); expected.extend(child['components'])
    for sub in child.get('child_refs',[]):
        assert sub['included_in_components'] is True
        assert sha((p.parent/sub['path']).resolve())==sub['sha256']
expected.extend(read(D/'local.json')['components'])
assert c['components']==expected
assert read(D/'preview.json')['components']==base['components']+c['components']
def finite(v):
    if isinstance(v,(int,float)): assert math.isfinite(v)
    elif isinstance(v,list):
        for x in v: finite(x)
    elif isinstance(v,dict):
        for x in v.values(): finite(x)
for g in c['components']:
    finite(g)
    if 'size' in g: assert all(x>0 for x in g['size'])
    if g['type']=='polygon': assert len(g['points'])>=3
    if g['type']=='triangles':
        assert len(g['indices'])%3==0
        assert all(isinstance(i,int) and 0<=i<len(g['vertices']) for i in g['indices'])
for name in ['assemble.py','build_local.py','compare.py','verify.py']:
    ast.parse((D/name).read_text())
report={'camera_contract_sha256':camera_sha,'candidate_sha256':sha(D/'candidate.json'),
        'components':423,'child_component_counts':counts,'local_components':5,
        'inherited_context_excluded':len(base['components']),'child_sources_unchanged':True,
        'nested_children_flattened_once':True,'geometry_valid':True,'immutable_inputs_valid':True,
        'render':'resume-round3.png','comparison':'resume-round3-compare.png',
        'render_size':[776,458],'browser_errors':r['errors'],
        'meshes':r['meshes'],'triangles':r['triangles'],
        'visual_acceptance':'Reviewed equal-scale comparison; counts are records, not image acceptance scores.'}
(D/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
