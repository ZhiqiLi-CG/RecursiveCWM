import json, hashlib, math
from pathlib import Path
p=Path(__file__).resolve().parent
read=lambda n:json.loads((p/n).read_text())
sha=lambda n:hashlib.sha256((p/n).read_bytes()).hexdigest()
part=read('candidate.json');v=read('view.json');m=read('manifest.json');r=read('final.render.json')
assert sha('../../camera-contract.json')==part['camera_contract_sha256']==v['camera_contract_sha256']==m['camera_contract_sha256']==r['camera_contract_sha256']
assert sha('target.png')==m['target_sha256']
assert sha('../east-district/context.json').startswith(m['parent_snapshot'].split(':')[1])
ids=[g['id'] for g in part['components']]
assert len(ids)==len(set(ids)) and all(i.startswith('east-shop/') for i in ids)
declared_children = read('children.json') if (p/'children.json').exists() else read('children.json.prev') if (p/'children.json.prev').exists() else []
assert part['children']==declared_children==[]
assert not r['errors'] and r['view']==[355,38,88,86]
for q in part['components']:
    assert q['type'] in ('box','triangles','polygon')
    for k in ('position','size','vertices','points'):
        def check(a):
            if isinstance(a,list):
                for x in a:check(x)
            else:assert isinstance(a,(int,float)) and math.isfinite(a)
        if k in q:check(q[k])
    if q['type']=='box':assert min(q['size'])>0
    if q['type']=='triangles':assert max(q['indices'])<len(q['vertices'])
validation=dict(status='passed',owned_components=len(ids),children=[],camera_sha256=sha('../../camera-contract.json'),target_sha256=sha('target.png'),context_sha256=sha('../east-district/context.json'),renderer_errors=r['errors'],render_triangles=r['triangles'],comparison='final-compare.png',visual_review='Personally inspected final-compare.png at identical 352x344 per image. Owned shop and apron accepted with documented residuals; absent sibling buildings and inherited grass are context.')
(p/'validation.json').write_text(json.dumps(validation,indent=2)+'\n')
(p/'part.json').write_text(json.dumps(part,indent=2)+'\n')
print(json.dumps(validation,indent=2))
