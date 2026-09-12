import json, math, random
from pathlib import Path
P=Path(__file__).resolve().parent
cam=json.loads((P/'../../camera-contract.json').read_text())
manifest=json.loads((P/'manifest.json').read_text())
V=cam['vertical_pixels_per_world_unit']
G=[]
# Study coordinates are pixels of this node's 4x crop, converted to actual ROOT world coordinates.
def world(u,v,y):
    a=(562+u/4-470.5)/30
    b=(91+v/4-260+V*y)/16.35
    return [(a+b)/2,y,(b-a)/2]
def add(id,t,**kw): G.append(dict(id='east-purple-housing/'+id,type=t,**kw))
def box(id,pos,size,colors):
    add(id,'box',position=pos,size=size,**({'colors':colors} if isinstance(colors,list) else {'color':colors}))
def face(id,verts,col):
    add(id,'triangles',vertices=verts,indices=[j for i in range(1,len(verts)-1) for j in (0,i,i+1)],color=col)
def ground(id,points,y,col):
    add(id,'polygon',points=[[p[0],p[2]] for p in [world(u,v,y) for u,v in points]],y=y,color=col)
def roof(id,pts,col,thick=.053):
    verts=[world(*p) for p in pts]
    face(id+'/surface',verts,col)
    for i,(a,b) in enumerate(zip(verts,verts[1:]+verts[:1])):
        face(id+'/fascia'+str(i),[a,b,[b[0],b[1]-thick,b[2]],[a[0],a[1]-thick,a[2]]],'#9225b8')
# Terrace is local property only; road and white curb remain inherited context.
ground('lot',[(0,181),(157,96),(736,401),(574,509),(0,201)],.008,'#2d8428')
# Each separate anchor is measured in the node target; no parent offset is reapplied.
houses=[dict(name='house-1',dx=0,dy=0),dict(name='house-2',dx=204,dy=103),dict(name='house-3',dx=407,dy=205)]
for h in houses:
    n=h['name'];dx=h['dx'];dy=h['dy']
    def W(u,v,y): return world(u+dx,v+dy,y)
    def F(id,pts,col): face(n+'/'+id,[W(*p) for p in pts],col)
    def R(id,pts,col,thick=.053): roof(n+'/'+id,[(u+dx,v+dy,y) for u,v,y in pts],col,thick)
    def B(id,pos,size,colors): box(n+'/'+id,pos,size,colors)
    base=.045;hei=.64
    corner=W(193,244,base)
    x1,_,z1=corner;wid=.81;dep=.6
    B('foundation',[x1-wid/2,base-.018,z1-dep/2],[wid+.035,.045,dep+.035],['#d555ee','#b731cd','#c13ae0'])
    B('walls',[x1-wid/2,base+hei/2,z1-dep/2],[wid,hei,dep],['#f0e4a9','#e1d48f','#efe3a5'])
    # Wall gable closes the volume beneath the pitched main roof.
    face(n+'/gable',[[x1,.685,z1],[x1,.685,z1-dep],[x1,.747,z1-dep],[x1,1.018,z1-.34]],'#e1d48f')
    # Continuous roof surface has a notch at the edge of the left porch.
    R('front-roof',[(133,26,1.04),(236,83,1.04),(177,157,.665),(137,135,.665),(113,160,.59),(43,122,.59)],'#d252ee')
    R('back-roof',[(133,26,1.04),(236,83,1.04),(275,105,.715),(172,48,.715)],'#b943d9')
    # Porch platform and two actual supporting posts.
    porch=[(54,207),(97,231),(128,214),(85,190)]
    ground(n+'/porch-top',[(u+dx,v+dy) for u,v in porch],.065,'#d650ef')
    R('porch-edge',[(u,v,.065) for u,v in porch],'#d650ef',.035)
    for j,(u,v) in enumerate([(55,205),(97,227)]):
        q=W(u,v,.075)
        B('post-'+str(j),[q[0],.34,q[2]],[.024 if j==0 else .042,.53,.024 if j==0 else .042],['#edb595','#d780b7','#ed9bb8'] if j else ['#edb595','#d98093','#f0ae93'])
    # Front facade plane z+, all frames have real shallow depth.
    def frontwin(label,xc,y,w,hh):
        B(label+'-frame',[xc,y,z1+.01],[w,hh,.022],['#e8a7c3','#cc8db6','#e8a7c3'])
        B(label+'-glass',[xc,y,z1+.023],[w-.035,hh-.035,.008],'#98a2d7')
    frontwin('double-window',x1-.255,.27,.31,.14)
    B('window-mullion',[x1-.255,.27,z1+.031],[.025,.125,.006],'#eed1c9')
    B('window-crossbar',[x1-.255,.27,z1+.032],[.286,.013,.007],'#d9d0d8')
    B('window-sill',[x1-.255,.20,z1+.025],[.335,.022,.04],'#efd6b8')
    B('door-frame',[x1-.615,.235,z1+.014],[.17,.36,.025],'#ead0b2')
    B('door-recess',[x1-.604,.215,z1+.03],[.118,.29,.01],'#746565')
    for j,zz in enumerate([z1-.22,z1-.435]):
        B('side-window-frame-'+str(j),[x1+.008,.362,zz],[.018,.26,.086],'#d793b5')
        B('side-window-glass-'+str(j),[x1+.019,.362,zz+.005],[.007,.218,.057],'#b2bae1')
    # Two solid shed dormers, reconstructed with front/side walls and dark top.
    for j,(du,dv) in enumerate([(0,0),(50,27)]):
        def D(u,v,y):return (u+du,v+dv,y)
        F('dormer-'+str(j)+'-front',[D(97,70,.92),D(118,82,.92),D(118,101,.79),D(97,89,.79)],'#f0dfa0')
        F('dormer-'+str(j)+'-side',[D(118,82,.92),D(151,57,.965),D(143,87,.79),D(118,101,.79)],'#e2d28a')
        R('dormer-'+str(j)+'-roof',[D(96,68,.942),D(132,42,.992),D(154,55,.992),D(118,81,.942)],'#9015af',.018)
        # Inset opening follows the actual front plane, with shallow outward normal offset.
        a=W(*D(97,70,.92));b=W(*D(118,82,.92));c=W(*D(118,101,.79));d=W(*D(97,89,.79))
        def inset(s,t):
            return [a[k]*(1-s)*(1-t)+b[k]*s*(1-t)+c[k]*s*t+d[k]*(1-s)*t + (.009 if k==2 else 0) for k in range(3)]
        face(n+'/dormer-'+str(j)+'-glass',[inset(.2,.2),inset(.77,.2),inset(.77,.75),inset(.2,.75)],'#b8b4d7')
    q=W(225,76,.87)
    B('chimney',[q[0],.94,q[2]],[.085,.18,.08],['#c18bcd','#814b97','#b784c3'])
    B('chimney-cap',[q[0],1.036,q[2]],[.126,.033,.12],['#cba3d5','#9e6aaf','#b783c5'])
    B('chimney-hole',[q[0],1.054,q[2]],[.057,.005,.052],'#735579')
    ground(n+'/entry-path',[(58+dx,212+dy),(80+dx,224+dy),(35+dx,250+dy),(13+dx,238+dy)],.012,'#bdc3a7')
    # Sparse low irregular planting masses, separately positioned for each lot.
    rng=random.Random(430+j+int(dx))
    for k,(u,v) in enumerate([(58,178),(6,205),(205,307)] if n=='house-1' else [(58,178),(205,307)]):
        if n=='house-3' and k==1:continue
        for m in range(7):
            uu=u+dx+rng.uniform(-12,12); vv=v+dy+rng.uniform(-4,5)
            q=world(uu,vv,.025+rng.uniform(0,.028))
            add(n+'/shrub-'+str(k)+'-'+str(m),'ellipsoid',position=q,size=[rng.uniform(.035,.066),rng.uniform(.022,.05),rng.uniform(.032,.06)],color=rng.choice(['#6f9d10','#80a30c','#72920b']))
candidate=dict(node='east-purple-housing',camera_contract_sha256=manifest['camera_contract_sha256'],components=G,children=[])
(P/'candidate.json').write_text(json.dumps(candidate,indent=2)+'\n')
context=json.loads((P/'../east-district/context.json').read_text())
preview={**candidate,'components':context['components']+G}
(P/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
print('components',len(G))
