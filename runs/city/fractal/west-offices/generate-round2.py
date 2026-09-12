"""Owned office geometry in the immutable root coordinate system."""
import json, hashlib
from pathlib import Path
P=Path(__file__).resolve().parent
camera_path=P/'../../camera-contract.json'
cam=json.loads(camera_path.read_text()); SHA=hashlib.sha256(camera_path.read_bytes()).hexdigest()
V=cam['vertical_pixels_per_world_unit']; C=[]
def ground(u,v,y=0):
    a=(u-470.5)/30; b=(v-260+V*y)/16.35
    return [(a+b)/2,(b-a)/2]
def box(id,x,y,z,w,h,d,colors):
    g=dict(id='west-offices/'+id,type='box',position=[x,y,z],size=[w,h,d])
    g['color' if isinstance(colors,str) else 'colors']=colors; C.append(g)
def poly(id,uv,y,color):
    C.append(dict(id='west-offices/'+id,type='polygon',points=[ground(u,v,y) for u,v in uv],y=y,color=color))
def face(id,verts,color):
    C.append(dict(id='west-offices/'+id,type='triangles',vertices=verts,indices=[0,1,2,0,2,3],color=color))
def window_x(id,x,z,y,w,h):
    box(id+'-frame',x,y,z,.012,h,w,'#dedfda')
    box(id+'-glass',x+.008,y+.017,z,.012,h-.07,w-.035,'#c7cdd0')
    box(id+'-warm',x+.015,y+.02,z-w*.22,.008,h-.085,w*.22,'#d4b6b3')
    box(id+'-sill',x+.025,y-h/2,z,.045,.026,w+.018,'#e4e8e8')
def window_z(id,x,z,y,w,h):
    box(id+'-frame',x,y,z,w,h,.012,'#d1d4cf')
    box(id+'-glass',x,y+.017,z+.008,w-.036,h-.06,.012,'#b8c5cc')
    box(id+'-warm',x+w*.22,y+.02,z+.015,w*.23,h-.075,.008,'#cca8a8')
    box(id+'-sill',x,y-h/2,z+.025,w+.018,.026,.045,'#e1e7e6')
def roof(id,x,z,w,d,h):
    box(id+'-bed',x,h-.08,z,w,.08,d,['#57596b','#919598','#989d96'])
    t=.052
    for k,dx,dz,ww,dd in [('back',0,-d/2+t/2,w,t),('front',0,d/2-t/2,w,t),('left',-w/2+t/2,0,t,d),('right',w/2-t/2,0,t,d)]:
        box(id+'-parapet-'+k,x+dx,h-.045,z+dz,ww,.09,dd,['#dadbd0','#bdc0b7','#a6ada4'])
    # Dark inner edges on the two far parapets; actual horizontal strips.
    box(id+'-inner-shadow-x',x-w/2+t+.016,h-.038,z,.032,.003,d-2*t,'#41485d')
    box(id+'-inner-shadow-z',x,h-.038,z-d/2+t+.019,w-2*t,.003,.038,'#444b60')
def tower(id,anchor):
    w,d=1.04,.78
    x1,z1=ground(*anchor,.04); x=x1-w/2;z=z1-d/2
    base=.04
    # Shared lower core plus structural arcade on the brighter right facade.
    box(id+'-base',x,.52,z,w,.96,d,['#c8c7bd','#c3c2b8','#b2b1ab'])
    # Recessed entrance represented by a dark inset surrounded by actual columns.
    doorz=z-.02; doorw=.38; doorh=.43
    box(id+'-entry-shadow',x1+.008,base+doorh/2,doorz,.012,doorh,doorw,'#7d8280')
    box(id+'-entry-door',x1+.016,base+doorh/2,doorz+.035,.012,doorh,.28,'#dad8cf')
    for k,dz in [('left',-.24),('right',.25)]:
        box(id+'-entry-pier-'+k,x1+.025,base+.25,doorz+dz,.095,.5,.075,['#d0cec4','#c7c5bc','#b0b0aa'])
    for j,dz in enumerate([-.25,0,.25]): window_x(id+f'-lower-window-{j}',x1+.012,z+dz,.785,.12,.18)
    window_z(id+'-side-window',x+.17,z1+.012,.51,.16,.31)
    face(id+'-side-lit-wedge',[[x-w/2,.04,z1+.003],[x-w/2,1.00,z1+.003],[x-w/2+.43,.22,z1+.003],[x-w/2+.43,.04,z1+.003]],'#c2c0b7')
    box(id+'-upper-core',x,1.72,z,w,1.57,d,['#c4c5bb','#c6c3b8','#a7aaa6'])
    for j in range(6):
        h=.99+j*.271
        box(id+f'-slab-{j}',x,h-.034,z,w+.15,.068,d+.15,['#d6d7cd','#b5b8b1','#959d99'])
        # Thin lower shadow reveals the overhang on both visible faces.
        box(id+f'-reveal-{j}',x,h-.085,z,w+.025,.026,d+.025,['#b3b5ad','#adb0a9','#909791'])
    box(id+'-roof-core',x,2.47,z,w,.18,d,['#aaaead','#979ea0','#8e9590'])
    roof(id+'-roof',x,z,w+.034,d+.034,2.675)

# Front boundary follows the lot, keeping main roads in the parent snapshot.
poly('lot-sidewalk',[(0,277),(37,297),(139,244),(145,247),(37,301),(0,280.5)],.024,'#e4e4dc')
poly('paving',[(0,277),(37,297),(139,246.5),(101,224),(0,276)],.028,'#74748e')
# Faint joint between front and back office plots.
poly('paving-joint',[(63,284.95),(63.3,284.8),(28.3,265.7),(28,265.85)],.032,'#7e7d96')
# Low, clipped annex sits on the front-left side of the front tower.
x1,z1=ground(21,284,.04); w=.61;d=.41;x=x1-w/2;z=z1-d/2
box('annex-body',x,.61,z,w,1.14,d,['#c5c4ba','#c4c2b8','#b2b1ab'])
roof('annex-roof',x,z,w+.055,d+.055,1.225)
window_x('annex-front-window-a',x1+.01,z-.16,1.005,.13,.16)
window_x('annex-front-window-b',x1+.01,z+.08,1.005,.13,.16)
box('annex-door',x1+.01,.16,z+.02,.014,.24,.17,'#e4e1d7')
box('annex-door-jamb',x1+.024,.16,z-.078,.025,.24,.035,'#7f8481')
# Back tower first is for readable source ordering; visibility is depth tested.
tower('rear',(101.8,260.9))
tower('front',(50.5,286.4))
owned=dict(node='west-offices',camera_contract_sha256=SHA,components=C,children=[],child_refs=[])
(P/'owned.json').write_text(json.dumps(owned,indent=2)+'\n')
base=json.loads((P/'../west-civic/base.json').read_text())
preview=dict(node='west-offices-preview',camera_contract_sha256=SHA,components=base['components']+C,children=[])
(P/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
print(f'{len(C)} owned components; camera {SHA}')
