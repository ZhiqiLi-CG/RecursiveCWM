import json,hashlib,math
from pathlib import Path
D=Path(__file__).resolve().parent
read=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
write=lambda p,v:p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
names=read(D/'pending-children.json'); camsha=sha(D.parent.parent/'camera-contract.json')
assert read(D/'view.json')['camera_contract_sha256']==camsha
components=[]; refs=[]
for name in names:
 p=D.parent/name/'part.json'; part=read(p)
 assert part['node']==name and part['camera_contract_sha256']==camsha
 assert part['components'] and not part.get('children')
 assert all(c['id'].startswith(name+'/') for c in part['components'])
 components.extend(part['components'])
 refs.append({'node':name,'path':f'../{name}/part.json','sha256':sha(p),'component_count':len(part['components']),'included_in_components':True})
local=read(D/'local-components.json') if (D/'local-components.json').exists() else []
assert all(g['id'].startswith('east-district/') for g in local)
components.extend(local)
ids=[g['id'] for g in components]; assert len(ids)==len(set(ids))
base=read(D/'context.json'); basecomps=base.get('components',base.get('geometry'))
assert not set(ids)&{c['id'] for c in basecomps}
part={'node':'east-district','camera_contract_sha256':camsha,'components':components,'children':names,'child_refs':refs}
write(D/'candidate.json',part)
write(D/'preview.json',{'camera_contract_sha256':camsha,'components':basecomps+components})
neighbor=read(D.parent/'school-tiered-towers/part.json')
assert neighbor['camera_contract_sha256']==camsha
write(D/'continuity-preview.json',{'camera_contract_sha256':camsha,'components':basecomps+neighbor['components']+components})
write(D/'continuity-sources.json',{'preview_only':True,'path':'../school-tiered-towers/part.json','sha256':sha(D.parent/'school-tiered-towers/part.json'),'components':len(neighbor['components'])})
write(D/'integration-sources.json',{'camera_sha256':camsha,'manifest_sha256':sha(D/'manifest.json'),'target_sha256':sha(D/'target.png'),'context_sha256':sha(D/'context.json'),'children':refs,'components':len(components),'context_components':len(basecomps)})
print('Integrated',len(components),'components from',len(names),'children, preview context',len(basecomps))
