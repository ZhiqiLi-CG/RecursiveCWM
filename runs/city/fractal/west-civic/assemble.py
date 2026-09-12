"""Flatten delivered children once; keep inherited street context out of candidate."""
import hashlib
import json
from pathlib import Path

D = Path(__file__).resolve().parent
NAMES = ['west-offices', 'west-police', 'west-houses', 'west-shop']
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
dump = lambda p, v: p.write_text(json.dumps(v, ensure_ascii=False, indent=2)+'\n')
camera_sha = sha(D.parent.parent/'camera-contract.json')
assert camera_sha == json.loads((D/'view.json').read_text())['camera_contract_sha256']
components, refs = [], []
for name in NAMES:
    p = D.parent/name/'part.json'
    part = json.loads(p.read_text())
    assert part['node'] == name and part['camera_contract_sha256'] == camera_sha
    for ref in part.get('child_refs', []):
        assert ref['included_in_components'] is True
        assert sha((p.parent/ref['path']).resolve()) == ref['sha256']
    components.extend(part['components'])
    refs.append({'node': name, 'path': f'../{name}/part.json',
                 'sha256': sha(p), 'included_in_components': True})
local_path = D/'local.json'
local = json.loads(local_path.read_text())['components'] if local_path.exists() else []
assert all(c['id'].startswith('west-civic/') for c in local)
components.extend(local)
assert len({c['id'] for c in components}) == len(components)
assert not any(c['id'].startswith('scene/') for c in components)
candidate = {'node': 'west-civic', 'camera_contract_sha256': camera_sha,
             'components': components, 'children': NAMES, 'child_refs': refs,
             'generator': 'assemble.py', 'local_components': len(local)}
dump(D/'candidate.json', candidate)
base = json.loads((D/'base.json').read_text())
dump(D/'preview.json', {**candidate, 'components': base['components']+components})
print('candidate', len(components), 'local', len(local), 'context', len(base['components']))
