"""Build local continuity preview; neighboring components are never delivered in own part."""
from pathlib import Path
import json, hashlib
P=Path(__file__).resolve().parent
own=json.loads((P/'part.json').read_text())
context=json.loads((P/'../east-district/context.json').read_text())
components=list(context['components'])+list(own['components'])
sources=[]
for name in ['east-pink-housing','east-teal-towers']:
 f=P/'..'/name/'part.json';raw=f.read_bytes();part=json.loads(raw)
 assert part['camera_contract_sha256']==own['camera_contract_sha256']
 components.extend(part['components'])
 sources.append({'node':name,'path':'../'+name+'/part.json','sha256':hashlib.sha256(raw).hexdigest(),'preview_only':True})
ids=[g['id'] for g in components]
assert len(ids)==len(set(ids))
(P/'continuity-preview.json').write_text(json.dumps({**own,'components':components},indent=2)+'\n')
(P/'continuity-sources.json').write_text(json.dumps(sources,indent=2)+'\n')
print('Continuity preview:',len(components),'components; own:',len(own['components']))
