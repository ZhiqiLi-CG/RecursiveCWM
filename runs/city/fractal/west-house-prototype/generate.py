"""Generate one actual 3D house; root coordinates, reusable translation interface."""
import json, hashlib
from pathlib import Path
P=Path(__file__).resolve().parent
CAM=json.loads((P/'../../camera-contract.json').read_text())
SHA=hashlib.sha256((P/'../../camera-contract.json').read_bytes()).hexdigest()
V=CAM['vertical_pixels_per_world_unit']
def unproject(u,v,y):
    a=(u-470.5)/30; b=(v-260+V*y)/16.35
    return [(a+b)/2,y,(b-a)/2]
ANCHOR=unproject(231.1,279.4,.09)
def house(anchor=ANCHOR, prefix='west-house-prototype/'):
    c=[]
    def pt(x,y,z): return [anchor[0]+x,y,anchor[2]+z]
    def box(name,x,y,z,w,h,d,color):
        g=dict(id=prefix+name,type='box',position=pt(x,y,z),size=[w,h,d])
        g['colors' if isinstance(color,list) else 'color']=color;c.append(g)
    def face(name,verts,col):
        c.append(dict(id=prefix+name,type='triangles',vertices=[pt(*p) for p in verts],indices=[i for j in range(1,len(verts)-1) for i in (0,j,j+1)],color=col))
    wall=['#e8dfa0','#e7e0b5','#ddd18c']; roof='#d458ec'; edge='#9221b5'
    box('foundation',-.2925,.08,-.4,.625,.035,.835,['#b646db','#a844bb','#ab46c6'])
    box('wall',-.2925,.38,-.4,.585,.62,.8,wall)
    face('gable-front',[(-.585,.69,0),(0,.69,0),(-.31,1.045,0)],'#ddd18c')
    face('gable-back',[(-.585,.69,-.8),(-.31,1.045,-.8),(0,.69,-.8)],'#e7dfa3')
    zf=.025; zb=-.825; xl=-.65; xr=.175; ridge=-.31; yr=1.06; ye=.75
    face('roof-left',[(xl,ye,zf),(ridge,yr,zf),(ridge,yr,zb),(xl,ye,zb)],'#c442e5')
    face('roof-right',[(ridge,yr,zf),(xr,ye,zf),(xr,ye,-.9),(ridge,yr,zb)],roof)
    for name,a,b in [('left',(xl,ye),(ridge,yr)),('right',(ridge,yr),(xr,ye))]:
        face('roof-front-fascia-'+name,[(a[0],a[1],zf),(b[0],b[1],zf),(b[0],b[1]-.048,zf),(a[0],a[1]-.048,zf)],edge)
    face('roof-eave',[(xr,ye,zf),(xr,ye,zb),(xr,ye-.045,zb),(xr,ye-.045,zf)],'#b632d1')
    # Porch is an attached extension of the main roof, leaving the front wall window exposed.
    pz0=-.34;pz1=-.9;px=.36;py=.665
    face('porch-roof',[(xr,ye,pz0),(px,py,pz0),(px,py,pz1),(xr,ye,pz1)],roof)
    face('porch-front-fascia',[(xr,ye,pz0),(px,py,pz0),(px,py-.046,pz0),(xr,ye-.046,pz0)],'#9121b5')
    face('porch-outer-fascia',[(px,py,pz0),(px,py,pz1),(px,py-.045,pz1),(px,py-.045,pz0)],'#af29c4')
    box('porch-platform',.16,.14,-.639,.38,.025,.392,['#cb4be8','#b341ce','#b54ad0'])
    for i,z in enumerate([-.46,-.835]):
        box('porch-post-'+str(i),.32,.384,z,.02,.485,.02,['#e4bf9f','#d89a85','#e8a6a4'])
    # Narrow gable windows, framed in a muted rose; blue glazing is inset.
    for i,x in enumerate([-.435,-.225]):
        box('side-window-frame-'+str(i),x,.392,.009,.071,.30,.016,'#d5a4ac')
        box('side-window-glass-'+str(i),x+.006,.392,.019,.046,.27,.008,'#959dda')
        box('side-window-highlight-'+str(i),x+.019,.392,.025,.012,.27,.004,'#b3b5e5')
    box('front-window-frame',.009,.32,-.26,.022,.174,.315,'#dab1b0')
    box('front-window-reveal',.022,.322,-.26,.008,.133,.265,'#c4c3e2')
    for i,z in enumerate([-.33,-.19]):
        box('front-window-pane-'+str(i),.03,.326,z,.008,.091,.108,'#9294d5')
    box('front-window-mullion',.036,.322,-.26,.01,.13,.016,'#dcd4df')
    box('door-frame',.013,.241,-.61,.025,.285,.185,'#d9b7aa')
    box('door-opening',.03,.237,-.61,.012,.25,.137,'#685660')
    box('door-shadow',.037,.237,-.58,.009,.245,.03,'#554953')
    # Two small shed dormers sit physically through the positive-x roof slope.
    for i,zc in enumerate([-.205,-.58]):
        x0=-.13;x1=.075;z0=zc+.092;z1=zc-.092
        bottom=.87; top=1.02
        box('dormer-'+str(i)+'-body',(x0+x1)/2,(bottom+top)/2,zc,x1-x0,top-bottom,.184,wall)
        face('dormer-'+str(i)+'-roof',[(x0-.025,top+.052,z0+.024),(x1+.035,top+.002,z0+.024),(x1+.035,top+.002,z1-.024),(x0-.025,top+.052,z1-.024)],'#910db5')
        face('dormer-'+str(i)+'-roof-front',[(x0-.025,top+.052,z0+.024),(x1+.035,top+.002,z0+.024),(x1+.035,top-.018,z0+.024),(x0-.025,top+.022,z0+.024)],'#a124c6')
        box('dormer-'+str(i)+'-frame',x1+.009,.945,zc,.018,.104,.111,'#d8b8c1')
        box('dormer-'+str(i)+'-glass',x1+.02,.945,zc,.008,.069,.076,'#a6a6d4')
        box('dormer-'+str(i)+'-mullion',x1+.026,.945,zc,.006,.069,.012,'#e2d7d2')
    box('chimney',-.52,.94,-.29,.085,.16,.09,['#c68ccc','#934da9','#814296'])
    box('chimney-cap',-.52,1.03,-.29,.115,.027,.115,['#bd8dbb','#a36aa8','#a378b0'])
    box('chimney-dark-opening',-.52,1.045,-.29,.061,.004,.061,'#77545e')
    return c
if __name__=='__main__':
    components=house()
    part=dict(node='west-house-prototype',camera_contract_sha256=SHA,components=components,children=[],child_refs=[],anchor=dict(name='front-gable-wall-bottom-corner',world=ANCHOR,root_pixel=[231.1,279.4],height=.09),generator='generate.py')
    (P/'candidate.json').write_text(json.dumps(part,indent=2)+'\n')
    parent=json.loads((P/'../west-houses/base.json').read_text())
    (P/'preview.json').write_text(json.dumps(dict(camera_contract_sha256=SHA,components=parent['components']+components),indent=2)+'\n')
    print(f'Generated {len(components)} components; anchor={ANCHOR}')
