#!/usr/bin/env python3
"""Generate owned, untextured world-space geometry under the locked camera."""
import json, math
from pathlib import Path
P=Path(__file__).resolve().parent
C=json.loads((P/'../../camera-contract.json').read_text())
SHA=json.loads((P/'view.json').read_text())['camera_contract_sha256']
V=C['vertical_pixels_per_world_unit']
G=[]

def world(p,y,offset=(0,0)):
    u=410+(p[0]+offset[0])/4; v=72+(p[1]+offset[1])/4
    a=(u-470.5)/30; b=(v-260+V*y)/16.35
    return [(a+b)/2,y,(b-a)/2]

def face(name,points,heights,color,offset=(0,0)):
    if isinstance(heights,(float,int)): heights=[heights]*len(points)
    vs=[world(p,h,offset) for p,h in zip(points,heights)]
    G.append(dict(id='east-pink-housing/'+name,type='triangles',vertices=vs,
                  indices=[n for i in range(1,len(vs)-1) for n in (0,i,i+1)],color=color))

def ground(name,points,color,y=.025):
    G.append(dict(id='east-pink-housing/'+name,type='polygon',points=[[v[0],v[2]] for v in [world(p,y) for p in points]],y=y,color=color))

def house(name,off):
    floor=.065; eave=.54; ridge=.81
    surfaces={}
    def f(n,p,h,c):
        # Architectural detail follows its supporting plane, a hair toward camera.
        support=('left-gable' if n.startswith('left-door') else
                 'entry-wall' if n.startswith('entry-door') else
                 'right-gable' if n.startswith('side-window') else None)
        if support:
            a,b,d=surfaces[support][:3]
            u=[b[i]-a[i] for i in range(3)];v=[d[i]-a[i] for i in range(3)]
            normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
            ray=[V/32.7,1,V/32.7]
            den=sum(normal[i]*ray[i] for i in range(3))
            h=[]
            for pt in p:
                base=world(pt,0,off)
                h.append(sum(normal[i]*(a[i]-base[i]) for i in range(3))/den+.004*(1+len(surfaces)))
        elif n.startswith('roof-fascia'):
            h=[y+.04 for y in h]
        face(name+'/'+n,p,h,c,off)
        surfaces[n]=G[-1]['vertices']
    # Four exposed walls preserve the recessed front entrance.
    f('left-gable',[(32,174),(85,201),(85,135),(51,83),(32,103)], [floor,floor,eave,ridge,eave],'#e4d8ae')
    f('recess-side',[(85,201),(124,179),(124,112),(85,135)], [floor,floor,eave,eave],'#dfcf8b')
    f('entry-wall',[(124,179),(185,212),(185,147),(124,112)], [floor,floor,eave,eave],'#eadeb2')
    f('right-gable',[(185,212),(247,177),(247,107),(218,79),(185,147)], [floor,floor,eave,ridge,eave],'#dfcf8a')
    # True elevated roof surfaces, with front fascia below their eaves.
    f('pink-west-slope',[(51,81),(143,28),(124,111),(85,134)], [ridge,ridge,eave,eave],'#f82c81')
    f('pink-east-slope',[(143,28),(218,76),(183,145),(124,111)], [ridge,ridge,eave,eave],'#f85a96')
    f('back-roof',[(143,28),(218,76),(251,105),(194,72)], [ridge,ridge,eave,eave],'#ef397f')
    for i,(a,b) in enumerate(zip([(25,102),(51,81),(85,134),(124,111),(183,145),(218,76)],[(51,81),(85,134),(124,111),(183,145),(218,76),(251,105)])):
        ha=ridge if i in (1,5) else eave
        hb=ridge if i in (0,4) else eave
        f('roof-fascia-'+str(i),[a,b,(b[0],b[1]+5),(a[0],a[1]+5)],[ha,hb,hb-.035,ha-.035],'#ba205f')
    # Raised roof dormer, both cheeks and pink cap.
    f('dormer-front',[(144,90),(163,101),(163,119),(145,109)],[.84,.84,.715,.715],'#eddfa0')
    f('dormer-side',[(163,101),(192,80),(183,108),(163,119)],[.84,.84,.715,.715],'#e3cf83')
    f('dormer-cap',[(144,90),(174,69),(192,80),(163,101)],.85,'#ef327b')
    f('dormer-window',[(148,99),(155,103),(155,111),(148,107)], [.80,.80,.743,.743],'#c4add3')
    # Near-left door with a pink jamb and dark reveal.
    f('left-door-frame',[(39,140),(70,157),(70,194),(39,177)],[.31,.31,.07,.07],'#d1a4b2')
    f('left-door-reveal',[(45,146),(65,157),(65,192),(45,181)],[.29,.29,.066,.066],'#544a51')
    f('left-door-shadow',[(45,146),(50,149),(50,184),(45,181)],[.291,.291,.067,.067],'#79616a')
    f('entry-door-frame',[(142,153),(165,166),(165,201),(142,188)],[.35,.35,.067,.067],'#eec5d6')
    f('entry-door',[(148,160),(159,166),(159,197),(148,191)],[.32,.32,.067,.067],'#60505a')
    f('entry-door-jamb',[(159,166),(163,168),(163,198),(159,197)],[.32,.32,.067,.067],'#b987a0')
    # Three violet panes on the right gable face.
    f('side-window-trim',[(202,142),(241,120),(241,143),(202,165)], [.36,.36,.22,.22],'#ecd8e7')
    for i in range(3):
        x=206+i*11; y=144-i*6.1
        f('side-window-'+str(i),[(x,y),(x+8,y-4.45),(x+8,y+7.55),(x,y+12)], [.343,.343,.259,.259],'#9a9de1')
        f('side-window-shade-'+str(i),[(x,y),(x+8,y-4.45),(x+8,y-1.45),(x,y+3)], [.344,.344,.323,.323],'#8789cc')

def tree(name,anchor,scale=(1,1)):
    start=len(G)
    def canopy(suffix,pos,size,color):
        vs=[];ids=[];n=16;m=10
        for j in range(m+1):
            t=math.pi*j/m
            for i in range(n):
                a=2*math.pi*i/n
                vs.append([pos[0]+size[0]*math.sin(t)*math.cos(a),pos[1]+size[1]*math.cos(t),pos[2]+size[2]*math.sin(t)*math.sin(a)])
        for j in range(m):
            for i in range(n):
                a=j*n+i;b=j*n+(i+1)%n;c=b+n;d=a+n
                ids.extend([a,b,c,a,c,d])
        G.append(dict(id=f'east-pink-housing/{name}/{suffix}',type='triangles',vertices=vs,indices=ids,color=color))
    x,_,z=world(anchor,.06)
    G.append(dict(id='east-pink-housing/'+name+'/trunk',type='cylinder',position=[x,.23,z],radius=.025,height=.34,segments=7,color='#96632c'))
    # A broad rounded core and three projecting leaf tiers create the wavy red silhouette.
    cx,_,cz=world((anchor[0]+6,anchor[1]),.06)
    canopy('canopy-core',[cx,.43,cz],[.15,.265,.135],'#a4291e')
    for i,(px,py,h,rx,ry,rz) in enumerate([
        (-8,-33,.32,.12,.095,.115),
        (-9,-55,.475,.125,.10,.115),
        (-8,-75,.61,.11,.092,.10),
        (8,-74,.625,.10,.105,.10),
    ]):
        pos=world((anchor[0]+px,anchor[1]+py),h)
        canopy(f'leaf-tier-{i}',pos,[rx,ry,rz],['#bd4037','#c0433a','#be4137','#a4291e'][i])
    sx,sy=scale
    for g in G[start:]:
        def transform(p):return [x+(p[0]-x)*sx,.06+(p[1]-.06)*sy,z+(p[2]-z)*sx]
        if g['type']=='triangles':g['vertices']=[transform(p) for p in g['vertices']]
        else:
            g['position']=transform(g['position']);g['radius']*=sx;g['height']*=sy

def bush(name,p):
    x,y,z=world(p,.065)
    for i,(dx,dz,r) in enumerate([(0,0,.125),(-.09,.005,.095),(.085,0,.09),(0,-.075,.1),(.025,.07,.09)]):
        G.append(dict(id=f'east-pink-housing/{name}/{i}',type='ellipsoid',position=[x+dx,.10,z+dz],size=[r,.035,r*.85],color=['#829b0b','#8ea80e','#8aa509','#98b51b','#87a313'][i]))

# The boundary follows the actual oblique lot, not the rectangular crop.
ground('lawn',[(0,167),(238,132),(555,283),(350,391),(0,207)],'#31571f')
ground('left-path',[(39,173),(69,191),(24,218),(0,204),(0,196)],'#c6c8b8',.034)
ground('entry-path',[(143,186),(165,198),(76,250),(54,237)],'#c7caba',.035)
ground('right-left-path',[(244,275),(274,293),(226,319),(196,303)],'#c6c8b8',.034)
ground('right-entry-path',[(348,287),(370,300),(278,354),(256,341)],'#c7caba',.035)
house('north-house',(0,0)); house('south-house',(205,102))
tree('north-red-tree',(288,164)); tree('south-red-tree',(493,295),(1.04,1.33))
bush('south-shrub',(483,311))
draft=dict(node='east-pink-housing',camera_contract_sha256=SHA,components=G,children=[])
(P/'draft.json').write_text(json.dumps(draft,indent=2)+'\n')
context=json.loads((P/'../east-district/context.json').read_text())['components']
(P/'preview.json').write_text(json.dumps(dict(camera_contract_sha256=SHA,components=context+G),indent=2)+'\n')
print(f'Generated {len(G)} owned components; {len(context)} context components.')
if '--final' in __import__('sys').argv:
    (P/'part.json').write_text(json.dumps(draft,indent=2)+'\n')
