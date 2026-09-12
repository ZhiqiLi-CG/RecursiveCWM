"""Flatten child prototypes in root world coordinates, without modifying children."""
import copy
import hashlib
import json
from pathlib import Path

D = Path(__file__).resolve().parent
CAM = D.parent.parent / 'camera-contract.json'
SHA = hashlib.sha256(CAM.read_bytes()).hexdigest()


def ground(u, v):
    a, b = (u - 470.5) / 30, (v - 260) / 16.35
    return [(a + b) / 2, 0, (b - a) / 2]


def place(component, anchor, destination, scale, instance):
    c = copy.deepcopy(component)
    c['id'] = 'foreground-park/' + instance + '/' + c['id'].split('/', 1)[1]
    def point(p):
        return [destination[j] + scale[j] * (p[j] - anchor[j]) for j in range(3)]
    if c['type'] == 'polygon':
        pts = [point([x, c['y'], z]) for x, z in c['points']]
        c['points'] = [[x, z] for x, y, z in pts]
        c['y'] = pts[0][1]
    elif c['type'] == 'triangles':
        c['vertices'] = [point(p) for p in c['vertices']]
    else:
        c['position'] = point(c['position'])
        if 'size' in c:
            c['size'] = [v * s for v, s in zip(c['size'], scale)]
        if 'radius' in c:
            assert scale[0] == scale[2]
            c['radius'] *= scale[0]
            if 'radiusTop' in c:
                c['radiusTop'] *= scale[0]
            c['height'] *= scale[1]
    return c


def main():
    layout = json.loads((D / 'layout.json').read_text())
    components, refs = [], []
    for group in layout['instances']:
        name = group['prototype']
        source = D.parent / name / 'part.json'
        part = json.loads(source.read_text())
        assert part['camera_contract_sha256'] == SHA
        assert len({c['id'] for c in part['components']}) == len(part['components'])
        assert all(c['id'].startswith(name + '/') for c in part['components'])
        transforms = []
        for i, pixel in enumerate(group['anchors_px']):
            scale = group.get('scales', [[1, 1, 1]] * len(group['anchors_px']))[i]
            destination = ground(*pixel)
            instance = name.removeprefix('foreground-park-') + '-' + str(i + 1)
            components.extend(place(c, part['prototype_anchor_world'], destination, scale, instance)
                              for c in part['components'])
            transforms.append({'instance': instance, 'source_anchor_world': part['prototype_anchor_world'],
                               'destination_anchor_world': destination, 'destination_anchor_pixel': pixel,
                               'scale': scale})
        refs.append({'node': name, 'path': '../' + name + '/part.json',
                     'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                     'included_in_components': True, 'instances': transforms})
    name = 'foreground-park-ponds'
    source = D.parent / name / 'part.json'
    ponds = json.loads(source.read_text())
    assert ponds['camera_contract_sha256'] == SHA
    components.extend(place(c, [0, 0, 0], [0, 0, 0], [1, 1, 1], 'ponds') for c in ponds['components'])
    refs.append({'node': name, 'path': '../' + name + '/part.json',
                 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                 'included_in_components': True, 'transform': 'identity'})
    result = {'node': 'foreground-park', 'camera_contract_sha256': SHA,
              'components': components, 'children': [r['node'] for r in refs], 'child_refs': refs,
              'metadata': {'coordinate_space': 'root_world', 'source_generator': 'integrate.py',
                           'tree_count': 11, 'pond_count': 2, 'parent_context_included': False}}
    assert len({c['id'] for c in components}) == len(components)
    (D / 'candidate.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
    base = json.loads((D.parent / 'scene/base.json').read_text())
    preview = {'camera_contract_sha256': SHA, 'components': base['components'] + components}
    (D / 'preview.json').write_text(json.dumps(preview, separators=(',', ':')) + '\n')
    print(json.dumps({'components': len(components), 'children': result['children']}))


if __name__ == '__main__':
    main()
