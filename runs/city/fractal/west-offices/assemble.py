"""Compose reviewed local geometry and runner-delivered children, excluding context."""
import hashlib,json
from pathlib import Path
P=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
load=lambda p:json.loads(p.read_text())
camsha=sha(P/'../../camera-contract.json')
owned=load(P/'owned.json'); child_path=P/'../west-offices-annex/part.json';child=load(child_path)
assert owned['camera_contract_sha256']==child['camera_contract_sha256']==camsha
assert child['node']=='west-offices-annex'
assert not child['children'], 'Review newly introduced grandchildren before assembly'
components=owned['components']+child['components']
ids=[g['id'] for g in components]
assert len(ids)==len(set(ids))
assert all(g['id'].startswith('west-offices/') for g in owned['components'])
assert all(g['id'].startswith('west-offices-annex/') for g in child['components'])
candidate=dict(node='west-offices',camera_contract_sha256=camsha,components=components,children=['west-offices-annex'],child_refs=[dict(node='west-offices-annex',path='../west-offices-annex/part.json',sha256=sha(child_path),included_in_components=True)])
(P/'candidate.json').write_text(json.dumps(candidate,indent=2)+'\n')
base=load(P/'../west-civic/base.json')
preview=dict(node='west-offices-preview',camera_contract_sha256=camsha,components=base['components']+components,children=[])
(P/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
print(f'Assembled {len(owned["components"])} local + {len(child["components"])} child = {len(components)} components')
