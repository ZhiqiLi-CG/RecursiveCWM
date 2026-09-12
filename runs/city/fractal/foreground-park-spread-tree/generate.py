import json, math, hashlib
from pathlib import Path
P=Path(__file__).resolve().parent
NODE=P.name
camera_file=P/'../../camera-contract.json'
sha=hashlib.sha256(camera_file.read_bytes()).hexdigest()
V=json.loads(camera_file.read_text())['vertical_pixels_per_world_unit']
def world(u,v,y):
    a=(u-470.5)/30;b=(v-260+V*y)/16.35
    return [(a+b)/2,y,(b-a)/2]
def color(rgb):return '#'+''.join(f'{max(0,min(255,round(c))):02x}' for c in rgb)
components=[]
def mesh(name,vertices,indices,c):
    components.append(dict(id=NODE+'/'+name,type='triangles',vertices=vertices,indices=indices,color=c))
def disc(name,u,v,y,r,depth,thick,top,side,phase=0):
    cx,_,cz=world(u,v,y);n=40
    rings=[]
    for scale,dy in [(0,y+.012),(.70,y),(.94,y-.018),(1,y-.052),(.99,y-thick+.03),(.87,y-thick),(0,y-thick)]:
        ring=[]
        for i in range(n):
            t=2*math.pi*i/n
            irregular=1+.025*math.sin(3*t+phase)+.018*math.cos(5*t+.7+phase)
            a=math.cos(t)*r/42.4264*scale*irregular
            b=math.sin(t)*r/42.4264*depth*scale*irregular
            ring.append([cx+(a+b)/math.sqrt(2),dy,cz+(-a+b)/math.sqrt(2)])
        rings.append(ring)
    for j in range(len(rings)-1):
        for i in range(n):
            k=(i+1)%n;t=2*math.pi*(i+.5)/n
            if j<2:
                delta=(-2 if j==1 else 0)+2*math.cos(t+2)
                rgb=[c+delta for c in top]
            elif j==2:rgb=[.58*a+.42*b for a,b in zip(top,side)]
            else:
                delta=8*math.cos(t+2.1)-(3 if j==4 else 0)
                rgb=[c+delta for c in side]
            mesh(f'{name}/{j}-{i}',[rings[j][i],rings[j][k],rings[j+1][k],rings[j+1][i]],[0,1,2,0,2,3],color(rgb))
# Small horizontal contact shadow, all vertices on the ground.
cx,_,cz=world(282.8,455.5,.004)
pts=[]
for i in range(40):
    t=i*2*math.pi/40;a=.077*math.cos(t);b=.052*math.sin(t)
    pts.append([cx+(a+b)/math.sqrt(2),cz+(-a+b)/math.sqrt(2)])
components.append(dict(id=NODE+'/contact-shadow',type='polygon',points=pts,y=.004,color='#85bd4e'))
# Closed faceted trunk with a naturally brighter left-facing surface.
cx,_,cz=world(282.5,456,0)
n=10
for i in range(n):
    t=i*2*math.pi/n;s=(i+1)*2*math.pi/n
    vs=[[cx+.056*math.cos(t),.035,cz+.056*math.sin(t)],[cx+.056*math.cos(s),.035,cz+.056*math.sin(s)],[cx+.056*math.cos(s),.37,cz+.056*math.sin(s)],[cx+.056*math.cos(t),.37,cz+.056*math.sin(t)]]
    delta=18*math.cos(t-1.8)
    mesh(f'trunk/{i}',vs,[0,1,2,0,2,3],color([150+delta,103+delta,62+delta]))
# Parameters locate the upper crown surface in the locked root image.
disc('lower-main',283,444.0,.36,10.7,.50,.085,(165,192,53),(107,127,33),.4)
disc('lower-left',275.8,439.7,.47,8.9,.47,.095,(172,198,56),(120,142,36),1.2)
disc('middle-right',287.8,435.2,.63,8.2,.56,.105,(173,198,55),(123,145,38),2.2)
disc('middle-left',280,433.3,.72,8.0,.48,.105,(170,193,54),(118,138,35),.8)
disc('upper-main',282.3,429.4,.865,7.3,.52,.10,(174,196,56),(125,146,36),1.6)
disc('top-left',279.1,427.3,.95,4.4,.51,.072,(174,198,56),(133,153,39),.5)
part=dict(node=NODE,camera_contract_sha256=sha,prototype_anchor_pixel=[282.5,456],prototype_anchor_world=world(282.5,456,0),components=components,children=[],child_refs=[])
(P/'owned.json').write_text(json.dumps(part,indent=2)+'\n')
base=json.loads((P/'../scene/base.json').read_text())
preview=dict(part);preview['components']=base['components']+components
preview['landmarks']=[dict(id='prototype-ground-anchor',world=part['prototype_anchor_world'],pixel=[123,222])]
(P/'preview.json').write_text(json.dumps(preview)+'\n')
print(json.dumps(dict(components=len(components),anchor=part['prototype_anchor_world'])))
