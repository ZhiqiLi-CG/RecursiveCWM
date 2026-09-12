"""Owned 3D architecture; pixel anchors invert the immutable camera, never fit it."""
import json, math
from pathlib import Path
P=Path(__file__).resolve().parent
view=json.loads((P/'view.json').read_text())
V=35.5718287412947
components=[]
def anchor(u,v,y):
    a=(u-470.5)/30;b=(v-260+V*y)/16.35
    return ((a+b)/2,(b-a)/2)
def box(name,x,y,z,w,h,d,colors):
    q=dict(id='school-tiered-towers/'+name,type='box',position=[x,y,z],size=[w,h,d])
    q['colors' if isinstance(colors,list) else 'color']=colors
    components.append(q)
def b(name,center,w,d,y,h,colors):
    x,z=center;box(name,x,y+h/2,z,w,h,d,colors)
wall=['#c9d6bd','#a2b494','#b9cab5']
shelf=['#d1dfce','#8da58d','#bbcfbc']
shaft=['#c3d2bc','#96ae97','#b8cab6']
roof=['#ceddca','#94ad91','#bed0b8']
def opening(name,c,w,d,face,along,y,width,height,door=False):
    x,z=c
    if face=='z':
        x+=along;z+=d/2+.006
        box(name+'-frame',x,y+height/2,z,width+.055,height+.035,.018,'#d9e1d0')
        box(name+'-glass',x,y+height/2+.014,z+.012,width,height,.009,'#e0e5d9' if door else '#d5c58c')
        if door:box(name+'-recess',x-width*.36,y+height/2,z+.020,width*.22,height,.008,'#769775')
        if not door:box(name+'-shade',x-width*.37,y+height/2+.014,z+.018,width*.25,height,.009,'#bec8c5')
    else:
        x+=w/2+.006;z+=along
        box(name+'-frame',x,y+height/2,z,.018,height+.035,width+.055,'#d9e1d0')
        box(name+'-glass',x+.012,y+height/2+.014,z,.009,height,width,'#52715a' if door else '#d2c38b')
        if not door:box(name+'-shade',x+.018,y+height/2+.014,z+width*.37,.009,height,width*.25,'#bfc8c4')
def parapet(n,c,w,d,y):
    b(n+'-roof',c,w,d,y-.11,.025,'#4e7351')
    x,z=c;t=.083
    box(n+'-rim-zback',x,y-.070,z-d/2+t/2,w,.14,t,[roof[0],'#829b7e','#8aa483'])
    box(n+'-rim-xback',x-w/2+t/2,y-.070,z,t,.14,d,[roof[0],'#829b7e','#8aa483'])
    box(n+'-rim-zfront',x,y-.070,z+d/2-t/2,w,.14,t,roof)
    box(n+'-rim-xfront',x+w/2-t/2,y-.070,z,t,.14,d,roof)
def tower(n,frontu,frontv,top):
    w=.80;d=1.08;base=.12
    # Frontmost base corner defines footprint. Roof center is aligned to it.
    c=anchor(frontu-30*(w-d)/2,frontv-16.35*(w+d)/2,base)
    bc=(c[0]+.045,c[1]+.04)
    b(n+'-base',bc,.71,1.00,base,.92,wall)
    b(n+'-upper',c,.71,.99,base+.88,top-base-1.035,shaft)
    for i in range(5):
        sy=top-.32-i*.307
        b(n+f'-shelf-{i}',c,.91,1.19,sy-.098,.098,shelf)
        b(n+f'-shadow-{i}',c,.78,1.06,sy-.16,.062,['#b2c4a5','#839d83','#a3bba3'])
        b(n+f'-ledge-reveal-{i}',c,.75,1.03,sy+.006,.032,['#d0dec9','#b7c9b4','#c4d5c3'])
    parapet(n,c,.81,1.10,top+.030)
    for i,a in enumerate([-.26,0,.26]):opening(n+f'-clerestory-{i}',bc,.71,1.00,'z',a,base+.70,.125,.15)
    opening(n+'-door',bc,.71,1.00,'z',.035,base,.31,.43,True)
    for i,a in enumerate([-.29,.13]):opening(n+f'-side-window-{i}',bc,.71,1.00,'x',a,base+.34,.14,.31)
    return c

tower('rear-tower',534.2,333.7,2.67)
tower('front-tower',586.0,358.2,2.625)
# Low annex, adjoining the right tower, with a recessed green flat roof.
w=.70;d=.78;base=.12
c=anchor(616.4-30*(w-d)/2,358.0-16.35*(w+d)/2,base)
b('annex-base',c,w,d,base,.92,wall)
parapet('annex',c,.81,.89,1.195)
for i,a in enumerate([-.18,.18]):opening('annex-x-window-'+str(i),c,w,d,'x',a,base+.30,.14,.31)
opening('annex-z-window',c,w,d,'z',.05,base+.30,.20,.31)
candidate=dict(node='school-tiered-towers',camera_contract_sha256=view['camera_contract_sha256'],components=components,children=[],child_refs=[])
(P/'candidate.json').write_text(json.dumps(candidate,indent=2)+'\n')
context=json.loads((P/'parent-context.json').read_text())
preview=dict(candidate,components=context['components']+components)
(P/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
print(f'Generated {len(components)} owned components')
