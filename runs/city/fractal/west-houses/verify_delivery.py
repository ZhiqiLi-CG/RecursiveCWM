"""Check the reviewed candidate and write the final completion signal last."""
import hashlib,json,math
from pathlib import Path
D=Path(__file__).resolve().parent
read=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
p=read(D/'candidate.json');child_path=D.parent/'west-house-prototype/part.json';child=read(child_path)
v=read(D/'view.json');m=read(D/'manifest.json');cm=read(child_path.parent/'manifest.json')
cam_path=D.parent.parent/'camera-contract.json';h=sha(cam_path)
assert h==p['camera_contract_sha256']==v['camera_contract_sha256']==child['camera_contract_sha256']
assert h.startswith(m['camera_hash'])
assert sha(D/'target.png').startswith(m['reference_sha256'])
assert m['parent_snapshot']=='west-civic/base.json:'+sha(D.parent/'west-civic/base.json')[:12]
assert cm['parent_snapshot']=='west-houses/base.json:'+sha(D/'base.json')[:12]
cs=p['components'];ids=[g['id'] for g in cs]
assert len(cs)==160 and len(set(ids))==160
assert len([i for i in ids if i.startswith('west-houses/house-2/')])==44
assert len([i for i in ids if i.startswith('west-houses/house-3/')])==44
assert [g for g in cs if g['id'].startswith('west-house-prototype/')]==child['components']
assert all(i.startswith(('west-houses/','west-house-prototype/')) for i in ids)
assert p['children']==['west-house-prototype']
assert p['child_refs'][0]['included_in_components'] is True
assert p['child_refs'][0]['sha256']==sha(child_path)
for source in read(D/'context-sources.json'):
 assert sha((D/source['path']).resolve())==source['sha256']
preview=read(D/'integrated-preview.json')
assert preview['components'][-len(cs):]==cs
assert not set(ids)&{g['id'] for g in preview['components'][:-len(cs)]}
r=read(D/'round4.render.json')
assert r['errors']==[] and r['camera_contract_sha256']==h and r['view']==v['crop_px']
# All numeric geometry values must remain finite for deterministic assembly.
def finite(o):
 if isinstance(o,dict):return all(finite(x) for x in o.values())
 if isinstance(o,list):return all(finite(x) for x in o)
 return math.isfinite(o) if isinstance(o,(int,float)) else True
assert finite(cs)
report={'status':'complete','node':'west-houses','components':160,'house_instances':3,'components_per_house':44,'owned_environment_components':28,'child_included_exactly_once':True,'context_excluded':True,'rendered_components_equal_delivery':True,'camera_contract_sha256':h,'immutable_inputs_verified':True,'render_errors':[],'visual_review':'round4-compare.png, 724x532 per side, 4x root scale','child_sha256':sha(child_path),'candidate_sha256':sha(D/'candidate.json')}
(D/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
plan=D/'plan.md';plan.write_text(plan.read_text().replace('- [ ] 被运行器','- [x] 被运行器').replace('- [ ] 终审整体','- [x] 终审整体'))
# part.json is the runner completion signal; publish only after the checks above.
(D/'part.json').write_bytes((D/'candidate.json').read_bytes())
assert sha(D/'part.json')==report['candidate_sha256']
print(json.dumps(report,ensure_ascii=False))
