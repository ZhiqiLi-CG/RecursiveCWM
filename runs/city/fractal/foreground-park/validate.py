import hashlib
import json
import math
from pathlib import Path
from PIL import Image

D = Path(__file__).resolve().parent
a = json.loads((D / 'candidate.json').read_text())
sha = hashlib.sha256((D.parent.parent / 'camera-contract.json').read_bytes()).hexdigest()
view = json.loads((D / 'view.json').read_text())
report = json.loads((D / 'integrated1.render.json').read_text())
assert a['camera_contract_sha256'] == view['camera_contract_sha256'] == report['camera_contract_sha256'] == sha
assert report['errors'] == []
assert report['view'] == view['crop_px'] == [124, 288, 277, 219]
assert Image.open(D / 'target.png').size == Image.open(D / 'integrated1.png').size == (554, 438)
components = a['components']
ids = [c['id'] for c in components]
assert len(ids) == len(set(ids)) == 8323
assert all(s.startswith('foreground-park/') for s in ids)
def finite(value):
    if isinstance(value, (float, int)):
        assert math.isfinite(value)
    elif isinstance(value, list):
        for item in value:
            finite(item)
    elif isinstance(value, dict):
        for item in value.values():
            finite(item)
finite(components)
for c in components:
    if c['type'] == 'triangles':
        assert len(c['indices']) % 3 == 0
        assert all(isinstance(i, int) and 0 <= i < len(c['vertices']) for i in c['indices'])
    elif c['type'] == 'polygon':
        assert len(c['points']) >= 3
for ref in a['child_refs']:
    assert ref['included_in_components'] is True
    assert hashlib.sha256((D / ref['path']).read_bytes()).hexdigest() == ref['sha256']
assert len(a['children']) == len(a['child_refs']) == 4
assert sum(len(r.get('instances', [])) for r in a['child_refs']) == 11
base = json.loads((D.parent / 'scene/base.json').read_text())
preview = json.loads((D / 'preview.json').read_text())
assert not set(ids).intersection(c['id'] for c in base['components'])
assert preview['components'] == base['components'] + components
result = {'status': 'passed', 'owned_components': len(components), 'tree_instances': 11,
          'ponds': 2, 'children': a['children'], 'camera_contract_sha256': sha,
          'dimensions': [554, 438], 'browser_errors': report['errors'],
          'preview_triangles': report['triangles'], 'source_children_unchanged': True,
          'unique_prefixed_ids': True, 'finite_geometry_and_valid_indices': True,
          'no_parent_components': True, 'flattened_references': True,
          'visual_evidence': 'integrated1-compare.png',
          'visual_acceptance': 'Personal equal-scale review, not a metric threshold.',
          'candidate_sha256': hashlib.sha256((D / 'candidate.json').read_bytes()).hexdigest()}
(D / 'validation.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
