"""Hand-authored world geometry. Pixel anchors are converted through locked camera."""
import json, math
from pathlib import Path
D=Path(__file__).resolve().parent
camera=json.loads((D/'../../camera-contract.json').read_text())
view=json.loads((D/'view.json').read_text())
NODE=D.name
components=[]
def world(s,t,y):
    u=150+s/4; v=366+t/4
    a=(u-470.5)/30; b=(v-260+camera['vertical_pixels_per_world_unit']*y)/16.35
    return [(a+b)/2,y,(b-a)/2]
def rounded(pts,passes=2):
    for _ in range(passes):
        pts=[q for a,b in zip(pts,pts[1:]+pts[:1]) for q in [(a[0]*.8+b[0]*.2,a[1]*.8+b[1]*.2),(a[0]*.2+b[0]*.8,a[1]*.2+b[1]*.8)]]
    return pts
def poly(name,pts,y,color,smooth=0):
    pts=rounded(pts,smooth)
    components.append(dict(id=f'{NODE}/{name}',type='polygon',points=[[p[0],p[2]] for p in [world(s,t,y) for s,t in pts]],y=y,color=color))
# Water edges are hand traced from the visible shoreline; east banks continue under parent trees.
upper=[(428,127),(440,118),(454,114),(458,102),(480,86),(507,72),(523,62),(543,59),(560,63),(579,60),(605,64),(627,62),(644,70),(661,84),(682,94),(704,101),(716,113),(721,134),(716,151),(704,159),(674,161),(671,179),(650,190),(626,198),(604,201),(579,205),(568,211),(566,221),(552,218),(529,205),(515,195),(522,187),(528,181),(522,175),(510,182),(493,188),(477,181),(460,168),(460,155),(449,145),(431,135)]
lower=[(20,334),(32,325),(45,320),(49,308),(66,295),(89,282),(110,269),(129,266),(145,270),(164,266),(188,270),(209,266),(229,275),(248,287),(264,291),(279,306),(290,330),(282,354),(272,377),(249,391),(224,400),(200,405),(174,409),(165,414),(162,423),(150,424),(132,414),(112,401),(109,397),(118,390),(118,383),(112,382),(98,389),(82,392),(67,385),(51,372),(51,359),(37,347),(23,341)]
poly('upper/water',upper,.035,'#82fde4',2)
poly('lower/water',lower,.035,'#82fde4',2)

def blade(name,outline,center,color,shade,offset,layer):
    # Closed curved leaf boundary with an elevated longitudinal ridge.
    ox,oy=offset
    pts=rounded(outline,1)
    def elev(t):return .065+max(0,70-t)/95+layer*.015
    verts=[world(s+ox,t+oy,elev(t)) for s,t in pts]
    verts.append(world(center[0]+ox,center[1]+oy,elev(center[1])+.004))
    n=len(pts)
    for side,col in [('lit',color),('shade',shade)]:
        indices=[]
        for i in range(n):
            if (i<n//2)==(side=='lit'):indices.extend([n,i,(i+1)%n])
        components.append(dict(id=f'{NODE}/{name}/{side}',type='triangles',vertices=verts,indices=indices,color=col))

def shrub(name,ox=0,oy=0):
    layer=0
    def leaf(label,pts,ctr,c,s):
        nonlocal layer
        blade(name+'/'+label,pts,ctr,c,s,(ox,oy),layer)
        layer+=1
    poly(name+'/ground-shadow',[(ox+x,oy+y) for x,y in [(530,62),(554,57),(585,59),(613,60),(638,67),(615,71),(588,70),(560,66),(540,68)]],.041,'#336f35',2)
    leaf('rear-left',[(570,58),(547,47),(545,34),(554,28),(573,33),(582,48)],(559,43),'#a4b51b','#849e16')
    leaf('main-dark',[(614,67),(584,68),(564,59),(561,48),(574,42),(569,29),(577,20),(590,20),(601,25),(609,35),(614,46),(615,55),(625,65)],(592,46),'#206a38','#145b3f')
    leaf('middle-lime',[(605,48),(594,55),(579,56),(564,50),(566,44),(577,48),(590,49),(599,43)],(587,51),'#a0b51d','#869f17')
    leaf('top-lime',[(596,36),(589,39),(578,40),(569,36),(567,31),(571,26),(577,24),(583,28),(587,32)],(581,33),'#9fb622','#839e1c')
    leaf('right-shoot',[(614,65),(611,51),(619,43),(626,44),(626,55),(639,64),(650,69),(633,67)],(621,57),'#95ad1b','#809e1c')
    leaf('little-dark',[(559,64),(541,67),(530,60),(529,52),(536,47),(538,40),(547,44),(550,53)],(541,57),'#367a27','#185c37')
    leaf('left-yellow',[(507,64),(507,58),(519,55),(519,50),(529,48),(531,53),(536,50),(541,55),(534,59),(541,62),(528,61),(519,65)],(526,57),'#bdce13','#a2b714')
    leaf('little-lime',[(549,57),(538,57),(534,50),(540,47),(542,52)],(541,54),'#afc721','#718c19')
    leaf('tiny-right',[(550,65),(553,59),(561,61),(566,65),(556,66)],(557,63),'#d0da23','#aebd1b')
shrub('upper/shore-leaves')
shrub('lower/shore-leaves',-410,204)
part=dict(node=NODE,camera_contract_sha256=view['camera_contract_sha256'],components=components,children=[],child_refs=[])
(D/'draft.json').write_text(json.dumps(part,indent=2)+'\n')
base=json.loads((D/'../scene/base.json').read_text())
(D/'preview.json').write_text(json.dumps({**part,'components':base['components']+components},indent=2)+'\n')
print(f'{len(components)} owned components')
