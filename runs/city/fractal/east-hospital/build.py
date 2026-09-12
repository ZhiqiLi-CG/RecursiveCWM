"""Reproducible root-world hospital geometry. Run with repository .venv/bin/python."""
from pathlib import Path
import json, hashlib
from PIL import Image, ImageDraw
P=Path(__file__).resolve().parent
C=json.loads((P/'../../camera-contract.json').read_text())
SHA=hashlib.sha256((P/'../../camera-contract.json').read_bytes()).hexdigest()
V=C['vertical_pixels_per_world_unit']
components=[]
def world(u,v,y=0):
    u=620+u/4; v=207+v/4
    a=(u-470.5)/30; b=(v-260+V*y)/16.35
    return [(a+b)/2,y,(b-a)/2]
def box(name,x0,x1,y0,y1,z0,z1,colors):
    components.append(dict(id='east-hospital/'+name,type='box',position=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],size=[x1-x0,y1-y0,z1-z0],colors=colors if isinstance(colors,list) else [colors]*3))
def ground(name,points,y,color):
    components.append(dict(id='east-hospital/'+name,type='polygon',points=[[world(u,v,y)[0],world(u,v,y)[2]] for u,v in points],y=y,color=color))
cream=['#fff4cb','#fbedb0','#faf1d4']
white=['#f1f2f0','#c8cccb','#edf0ef']
ground('lot-white-edge',[(108,359),(330,481),(570,352),(348,231)],.014,'#e5e7de')
ground('lot-paving',[(123,359),(330,464),(549,350),(346,244)],.018,'#777590')
ground('entry-walk',[(215,409),(263,435),(359,383),(311,357)],.021,'#c9cccb')
base=.04
# Visible tall-body front corner; dimensions project to 90 pixels per axis.
x1,_,z1=world(375,400,base); x0=x1-.75; z0=z1-.75
top=base+1.56
box('tower',x0,x1,base,top,z0,z1,cream)
def roof(name,a,b,c,d,h):
    box(name+'-rim-base',a-.035,b+.035,h-.035,h+.018,c-.035,d+.035,white)
    box(name+'-well',a+.06,b-.06,h+.019,h+.025,c+.06,d-.06,'#e2ddb0')
    for suffix,aa,bb,cc,dd in [('back',a-.035,b+.035,c-.035,c+.055),('right',b-.055,b+.035,c+.055,d-.055),('left',a-.035,a+.055,c+.055,d-.055),('front',a-.035,b+.035,d-.055,d+.035)]:
        if name=='tower-roof' and suffix=='front': continue
        box(name+'-'+suffix,aa,bb,h+.018,h+.098,cc,dd,white)
    box(name+'-inside-left',a+.055,a+.061,h+.025,h+.065,c+.055,d-.055,'#d6c478')
roof('tower-roof',x0,x1,z0,z1,top)
# White fascia extends toward the lower wing, with a visible grey return.
boardleft=x1-1.09
box('cross-fascia',boardleft,x1+.016,top-.77,top+.098,z1-.155,z1+.004,white)
# Red plus made from two shallow, intersecting boxes on z-positive face.
cx=x1-.51; cy=top-.31; front=z1+.014
box('cross-vertical',cx-.080,cx+.080,cy-.245,cy+.245,front,front+.025,['#ff3434','#cf060c','#ff0710'])
box('cross-horizontal',cx-.238,cx+.238,cy-.080,cy+.080,front+.001,front+.027,['#ff3434','#cf060c','#ff0710'])
# Low wing.
lx1,_,lz1=world(242,400,base); lx0=lx1-.65; lz0=lz1-.57
ltop=base+.80
box('low-wing',lx0,lx1,base,ltop,lz0,lz1,cream)
box('low-wing-yellow-cornice',lx0-.02,lx1+.02,ltop-.055,ltop+.025,lz0-.02,lz1+.02,['#ffeb8a','#ffdf5a','#ffe48a'])
roof('low-roof',lx0,lx1,lz0,lz1,ltop+.045)
# Projecting red side window box, with pale-blue centre and thick surround.
wx0=lx0-.025; wx1=lx0+.35; wy0=base+.225; wy1=base+.77; wz=lz1+.075
box('red-side-box-top',wx0,wx1,wy1-.14,wy1,lz1,wz,['#ff4845','#b90810','#ee0817'])
box('red-side-box-bottom',wx0,wx1,wy0,wy0+.11,lz1,wz,['#ff4845','#b90810','#ee0817'])
box('red-side-box-right',wx1-.07,wx1,wy0+.11,wy1-.14,lz1,wz,['#ff4845','#b90810','#ee0817'])
box('side-window-recess',wx0+.075,wx1-.09,wy0+.16,wy0+.35,lz1+.002,wz-.017,'#b8e5eb')
box('side-window-glint',wx0+.078,wx0+.114,wy0+.18,wy0+.34,wz-.016,wz-.014,'#d8f2f1')
# Entrance on front wall of taller body.
box('entrance-frame',x1-.47,x1-.07,base,base+.47,z1+.008,z1+.021,'#fff1c9')
box('entrance-left-gold',x1-.47,x1-.42,base+.008,base+.45,z1+.022,z1+.027,'#ffdf69')
box('entrance-glass',x1-.385,x1-.09,base+.027,base+.431,z1+.022,z1+.028,'#c3deec')
part=dict(node='east-hospital',camera_contract_sha256=SHA,components=components,children=[],child_refs=[])
(P/'draft.json').write_text(json.dumps(part,indent=2)+'\n')
context=json.loads((P/'../east-district/context.json').read_text())
preview=dict(node='east-hospital-preview',camera_contract_sha256=SHA,components=context['components']+components)
(P/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
(P/'children.json').write_text('[]\n')
print(f'Generated {len(components)} owned components')
