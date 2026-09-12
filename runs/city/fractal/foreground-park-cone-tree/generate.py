"""Owned tree geometry in root world space; no image textures or camera fitting."""
import json, math, hashlib
from pathlib import Path
D=Path(__file__).resolve().parent
C=json.loads((D/'../../camera-contract.json').read_text())
V=C['vertical_pixels_per_world_unit']
SHA=hashlib.sha256((D/'../../camera-contract.json').read_bytes()).hexdigest()
NODE=D.name
anchor=[185,395]
a=(anchor[0]-470.5)/30;b=(anchor[1]-260)/16.35
X,Z=(a+b)/2,(b-a)/2
G=[]
def add(name,**g): G.append(dict(id=f'{NODE}/{name}',**g))
def tint(color,f):
    rgb=[int(color[i:i+2],16) for i in (1,3,5)]
    return '#'+''.join(f'{max(0,min(255,round(c*f))):02x}' for c in rgb)
def ring(r,y,n=32,depth=1):
    result=[]
    for i in range(n):
        u=r*math.cos(i*math.tau/n); d=r*math.sin(i*math.tau/n)*depth
        result.append([X+(u+d)/math.sqrt(2),y,Z+(d-u)/math.sqrt(2)])
    return result
def frustum(name,y0,y1,r0,r1,side,top,n=32,depth=1):
    lo,hi=ring(r0,y0,n,depth),ring(r1,y1,n,depth)
    for i in range(n):
        j=(i+1)%n
        theta=(i+.5)*math.tau/n
        # Broad light from image left, with subtle faceting on the visible side.
        f=1+(.20 if n==12 else .075)*math.cos(theta-2.5)
        add(f'{name}/side-{i:02}',type='triangles',vertices=[lo[i],lo[j],hi[j],hi[i]],indices=[0,1,2,0,2,3],color=tint(side,f))
    add(f'{name}/top',type='triangles',vertices=[[X,y1,Z]]+hi,indices=[v for i in range(n) for v in (0,i+1,(i+1)%n+1)],color=top)
    add(f'{name}/bottom',type='triangles',vertices=[[X,y0,Z]]+lo,indices=[v for i in range(n) for v in (0,(i+1)%n+1,i+1)],color=side)
# Compact contact shadow; contained beneath the trunk and crown.
for name,rx,rz,col,y in [('outer',.077,.061,'#87bd54',-.018),('inner',.060,.052,'#809e48',-.015)]:
    pts=[[X+rx*math.cos(i*math.tau/32)+.018,Z+rz*math.sin(i*math.tau/32)+.018] for i in range(32)]
    add('shadow/'+name,type='polygon',points=pts,y=y,color=col)
frustum('trunk',0,.56,.056,.052,'#966b3d','#a47d43',12,depth=.45)
# Each tuple specifies bottom/top axis projected pixel and the two radii.
levels=[('crown-0',384.0,376.2,373.7,.345,.335,.259,'#687b21','#abc735'),
        ('crown-1',373.7,369.4,366.0,.267,.259,.194,'#687e20','#a5c530'),
        ('crown-2',366.0,362.0,360.2,.202,.195,.143,'#698224','#a6c935'),
        ('crown-3',360.2,356.8,356.4,.150,.146,.135,'#6b8927','#a9ca38')]
for name,v0,v1,v2,r0,r1,r2,side,top in levels:
    y0=(395-v0)/V;y1=(395-v1)/V;y2=(395-v2)/V
    frustum(name,y0,y1,r0,r1,side,top,depth=.50)
    frustum(name+'-shoulder',y1,y2,r1,r2,top,top,depth=.50)
    frustum(name+'-rim',y0,y0+.013,r0,r0, tint(side,.96),side,depth=.50)
owned=dict(node=NODE,camera_contract_sha256=SHA,prototype_anchor_pixel=anchor,prototype_anchor_world=[X,0,Z],components=G,children=[],child_refs=[],metadata={'prototype_count':1,'crown_tiers':4,'coordinates':'root_world','construction':'closed faceted frusta with top caps and lower rims','context_included':False})
(D/'owned.json').write_text(json.dumps(owned,indent=2)+'\n')
base=json.loads((D/'../scene/base.json').read_text())
preview=dict(owned,components=base['components']+G,landmarks=[{'id':'prototype-anchor','world':[X,0,Z],'pixel':[108,276]}])
(D/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
print(json.dumps({'owned_components':len(G),'anchor_world':[X,0,Z],'camera_sha256':SHA}))
