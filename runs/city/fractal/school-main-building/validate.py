"""Validate the rendered assembly and immutable inheritance before delivery."""
import hashlib
import json
import math
import sys
from pathlib import Path
from PIL import Image

P = Path(__file__).resolve().parent
def read(name):
    return json.loads((P / name).read_text())
def sha(name):
    return hashlib.sha256((P / name).read_bytes()).hexdigest()

artifact = sys.argv[1] if len(sys.argv) > 1 else 'assembly.json'
part, own, preview = read(artifact), read('own.json'), read('preview.json')
context, child = read('parent-context.json'), read('../school-sign/part.json')
view, manifest, report = read('view.json'), read('manifest.json'), read('final.render.json')
camera_hash = sha('../../camera-contract.json')
assert camera_hash == view['camera_contract_sha256'] == part['camera_contract_sha256'] == child['camera_contract_sha256'] == report['camera_contract_sha256']
assert camera_hash.startswith(manifest['camera_hash'])
assert sha('target.png') == manifest['target_sha256']
assert sha('parent-context.json').startswith(manifest['parent_snapshot'].split(':')[-1])
assert part['node'] == 'school-main-building'
assert part['children'] == ['school-sign']
assert len(part['child_refs']) == 1
ref = part['child_refs'][0]
assert ref['node'] == 'school-sign' and ref['included_in_components'] is True
assert ref['sha256'] == sha(ref['path'])
expected_child = [{**g, 'id': 'school-main-building/' + g['id']} for g in child['components']]
assert part['components'] == own['components'] + expected_child
assert preview['components'] == context['components'] + part['components']
ids = [g['id'] for g in part['components']]
assert len(ids) == len(set(ids)) and all(i.startswith('school-main-building/') for i in ids)
assert not set(ids).intersection(g['id'] for g in context['components'])
def finite(obj):
    if isinstance(obj, (int, float)):
        assert math.isfinite(obj)
    elif isinstance(obj, list):
        for v in obj: finite(v)
    elif isinstance(obj, dict):
        for v in obj.values(): finite(v)
for g in part['components']:
    finite(g)
    assert g['type'] in {'polygon', 'triangles', 'box', 'cylinder', 'cone', 'ellipsoid'}
    assert not any('texture' in key.lower() for key in g)
    if g['type'] == 'triangles':
        assert len(g['indices']) % 3 == 0
        assert all(isinstance(i, int) and 0 <= i < len(g['vertices']) for i in g['indices'])
assert report['errors'] == [] and report['view'] == view['crop_px']
assert Image.open(P/'target.png').size == Image.open(P/'final.png').size == tuple(view['output_size']) == (678, 720)
assert Image.open(P/'final-compare.png').size == (1356, 750)
result = dict(artifact=artifact, passed=True, own_components=len(own['components']),
              child_components=len(expected_child), total_components=len(ids),
              context_components=len(context['components']), camera_contract_sha256=camera_hash,
              child_sha256=ref['sha256'], render_errors=report['errors'],
              triangles=report['triangles'], equal_scale=6,
              target_sha256=sha('target.png'), parent_context_sha256=sha('parent-context.json'),
              checks=['immutable inheritance', 'unique owned IDs', 'exact child flattening',
                      'no context in delivery', 'finite geometry and valid indices',
                      'same-size target and render', 'error-free WebGL render'])
(P/'validation.json').write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result, indent=2))
