"""Owned lot and vegetation geometry, in locked root world coordinates."""
import hashlib
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
CAM = HERE.parent.parent / 'camera-contract.json'
C = json.loads(CAM.read_text())
SHA = hashlib.sha256(CAM.read_bytes()).hexdigest()
G = []

def world(u, v, y=0):
    a = (u - 470.5) / 30
    b = (v - 260 + C['vertical_pixels_per_world_unit'] * y) / 16.35
    return [(a+b)/2, y, (b-a)/2]

def add(name, kind, **kw):
    G.append(dict(id='north-housing/'+name, type=kind, **kw))

def poly(name, pts, color, y=.02):
    add(name, 'polygon', points=[[world(u,v,y)[0],world(u,v,y)[2]] for u,v in pts], y=y, color=color)

poly('residential-lawn', [(35,142),(242,29),(293,66),(86,179)], '#257e24')
for i in range(4):
    du,dv = i*51.1, -i*27.9
    poly(f'walk-{i+1}', [(103+du,141+dv),(106+du,139.4+dv),(121+du,147.7+dv),(118+du,149.3+dv)], '#c9cfb7', .032)
    for j,(dx,dy,r) in enumerate([(-3,0,.085),(0,1,.11),(3,0,.08),(-1,-2,.085),(2,-3,.063)]):
        u,v=125+du+dx,143+dv+dy
        add(f'shrub-{i+1}-{j}', 'ellipsoid', position=world(u,v,.05), size=[r,.028,r*.8], color=['#7e9d19','#789516','#8b9e1d'][j%3])

def tier(name, x, z, bottom, radius, height, color, top):
    # Real low-poly revolved geometry, with separately shaded side segments.
    count=16
    rings=[]
    for yy,rr in [(bottom,radius*.92),(bottom+.035,radius),(bottom+height-.025,radius),(bottom+height,radius*.89)]:
        rings.append([[x+rr*math.cos(2*math.pi*k/count),yy,z+rr*math.sin(2*math.pi*k/count)] for k in range(count)])
    for j in range(3):
        for k in range(count):
            n=(k+1)%count
            col=color if k<8 else top
            add(f'{name}-band{j}-{k}', 'triangles', vertices=[rings[j][k],rings[j][n],rings[j+1][n],rings[j+1][k]], indices=[0,1,2,0,2,3], color=col)
    add(name+'-top', 'triangles', vertices=[[x,bottom+height,z]]+rings[-1], indices=[q for k in range(count) for q in (0,k+1,(k+1)%count+1)], color=top)

def tree(name, u, v, levels, trunk):
    x,_,z=world(u,v)
    add(name+'-trunk','cylinder',position=[x,trunk/2,z],radius=.056,height=trunk,segments=8,color='#9a8052')
    for i,(y,r,h) in enumerate(levels):
        tier(f'{name}-tier{i}',x,z,y,r,h,'#738d15','#aac535')

tree('tree-tall',349.5,58,[(.28,.36,.22),(.52,.28,.20),(.74,.205,.15),(.91,.14,.10)],.35)

def spreading_tree(name, u, v, crowns):
    x,_,z=world(u,v)
    add(name+'-trunk','cylinder',position=[x,.25,z],radius=.056,height=.5,segments=8,color='#9a8052')
    for i,(sx,sy,r,top_y) in enumerate(crowns):
        # Crown centers are traced in this node's 2x target, then lifted
        # into the inherited world; foliage remains actual 3D geometry.
        cx,_,cz=world(48+sx/2,10+sy/2,top_y)
        tier(f'{name}-crown{i}',cx,cz,top_y-.065,r,.065,'#738d15','#aac535')

spreading_tree('tree-left',326.5,70,[(555,96,.25,.36),(542,88,.235,.48),(573,80,.21,.61),(552,77,.25,.68),(560,67,.21,.80),(550,63,.17,.89)])
spreading_tree('tree-right',344,80,[(594,120,.25,.36),(582,112,.25,.48),(609,106,.24,.61),(594,100,.25,.68),(600,90,.22,.80),(589,86,.17,.89)])

spec=dict(node='north-housing',camera_contract_sha256=SHA,components=G,children=[])
(HERE/'local.json').write_text(json.dumps(spec,indent=2)+'\n')
base=json.loads((HERE.parent/'scene/base.json').read_text())['components']
(HERE/'preview.json').write_text(json.dumps(dict(node='north-housing-preview',camera_contract_sha256=SHA,components=base+G),indent=2)+'\n')
print(f'Generated {len(G)} owned components')
