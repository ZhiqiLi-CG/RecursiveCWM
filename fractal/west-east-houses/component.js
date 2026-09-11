import {THREE,mat,box} from '../scene/common.js';
import {houses} from './houses.js';
const wood=mat('#38352c'),plaster=mat('#8a9290'),stone=mat('#545c5b'),glass=mat('#202b2d'),door=mat('#4b3525');
function beam(g,a,b,w,material=wood){let d=new THREE.Vector3().subVectors(b,a);let m=box(g,0,0,0,w,d.length(),w,material);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function solid(g,points,faces,material){let positions=[];for(let f of faces)for(let i=1;i<f.length-1;i++)for(let j of [f[0],f[i],f[i+1]])positions.push(...points[j]);let geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.computeVertexNormals();let m=new THREE.Mesh(geo,material);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function pitch(g,s,x0,x1,z0,z1,h,r,w,material,thick=.018){const y=x=>h+r*(1-x/(w/2));let p=[[s*x0,y(x0),z0],[s*x1,y(x1),z0],[s*x1,y(x1),z1],[s*x0,y(x0),z1]];p.push(...p.map(v=>[v[0],v[1]-thick,v[2]]));let faces=[[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];if(s<0)faces=faces.map(f=>f.reverse());return solid(g,p,faces,material);}
function rnd(i){return Math.sin(i*127.1+34.7)*43758.5453%1;}
function house(ctx,q,index){const g=new THREE.Group();g.name=q.name;g.position.set(q.cx,0,q.cz);g.rotation.y=q.angle;const w=q.width,l=q.length,h=q.wallHeight,r=q.roofRise,ww=w-.045,ll=l-.035;
box(g,0,.045,0,ww+.025,.13,ll+.025,stone);box(g,0,(h+.065)/2,0,ww,h-.065,ll,q.roof==='straw'?mat('#515750'):plaster);
// Stone courses continue around the complete foundation and lower walls.
const courses=q.roof==='straw'?2:3;for(let face=0;face<4;face++){const end=face>1,sg=face%2?1:-1,span=end?ww:ll,n=Math.ceil(span/.10);for(let row=0;row<courses;row++)for(let j=0;j<n;j++){let u=-span/2+(j+.5)*span/n;let c=['#60696b','#747d7d','#515e63','#7d8480'][(j+row*3+face)%4];if(end)box(g,u,.025+row*.043,sg*(ll/2+.005),span/n-.005,.038,.012,c);else box(g,sg*(ww/2+.005),.025+row*.043,u,.012,.038,span/n-.005,c);}}
// Structural timber on all four elevations, with no open backs.
for(let x of [-ww/2,ww/2])for(let z of [-ll/2,ll/2])box(g,x,h/2,z,.024,h,.024,wood);
const bands=q.roof==='straw'?[.11,h-.015]:[.125,h*.57,h-.018];for(let y of bands){for(let x of [-ww/2,ww/2])box(g,x,y,0,.023,.028,ll+.01,wood);for(let z of [-ll/2,ll/2])box(g,0,y,z,ww+.015,.028,.023,wood);}
for(let x of [-ww/2,ww/2])for(let z of [-ll*.28,0,ll*.28])box(g,x,(h+.11)/2,z,.022,h-.10,.022,wood);
for(let z of [-ll/2,ll/2]){box(g,0,(h+.1)/2,z,.026,h-.10,.026,wood);const pts=[[-ww/2,h,z-.012],[ww/2,h,z-.012],[0,h+r*.94,z-.012],[-ww/2,h,z+.012],[ww/2,h,z+.012],[0,h+r*.94,z+.012]];solid(g,pts,[[0,2,1],[3,4,5],[0,1,4,3],[1,2,5,4],[2,0,3,5]],['pale','straw'].includes(q.roof)?mat('#494a3d'):plaster);beam(g,V(-ww/2,h,z),V(0,h+r*.94,z),.023);beam(g,V(ww/2,h,z),V(0,h+r*.94,z),.023);box(g,0,h+r*.42,z,.02,r*.82,.025,wood);if(q.roof!=='straw'){let opening=box(g,0,h+r*.22,z+(z>0?.016:-.016),.075,r*.28,.014,glass);}}
if(q.roof==='straw')for(let z of [-ll/2-.014,ll/2+.014]){box(g,0,h+.07,z,ww*.74,.035,.022,'#929d9b');box(g,0,h-.06,z,ww,.032,.025,'#929d9b');}
// Recess-dark openings, raised lintels/sills and small shutters.
for(let face=0;face<4;face++){let end=face>1,sg=face%2?1:-1;let levels=q.roof==='straw'?[]:(end?[h*.78]:[h*.36,h*.78]);for(let y of levels)for(let u of (end?[-ww*.27,ww*.27]:[-ll*.34,0,ll*.34])){const width=end?.068:.076,height=q.roof==='straw'?.085:.09;const f=new THREE.Group();f.position.set(end?u:sg*(ww/2+.013),y,end?sg*(ll/2+.013):u);if(!end)f.rotation.y=Math.PI/2;box(f,0,0,0,width,height,.016,glass);box(f,0,-height/2,0,width+.018,.014,.024,wood);for(let a of [-1,1])box(f,a*width*.52,0,.004,.012,height+.008,.023,wood);if(y>h*.6){box(f,width*.77,0,0,.026,height,.016,'#817d69');box(f,0,0,.01,.009,height,.008,wood);}g.add(f);}}
// A framed front entrance and attached solid stone steps.
let f=new THREE.Group();f.position.z=ll/2+.017;box(f,0,.14,0,.092,.22,.022,door);for(let x of [-.054,.054])box(f,x,.145,.006,.018,.25,.032,wood);box(f,0,.27,.006,.126,.023,.033,wood);for(let x of [-.027,0,.027])box(f,x,.14,.014,.004,.21,.004,'#2e291f');box(f,.03,.145,.025,.012,.012,.009,'#80704c');g.add(f);box(g,0,.033,ll/2+.062,.16,.064,.12,stone);box(g,0,.009,ll/2+.12,.20,.032,.08,stone);
const base=q.roof==='red'?'#61312a':q.roof==='dark-red'?'#3b242c':q.roof==='pale'?'#897966':'#b0804e';const palette=q.roof==='red'?['#773d31','#814032','#8b4736','#64322b','#87513e']:q.roof==='dark-red'?['#623845','#653b49','#6c4150','#533c49','#62505a']:q.roof==='pale'?['#92816e','#a18b76','#877868','#aa947d','#978270']:['#b58658','#bc8e60','#ae8052','#c39565','#b98a5b'];
for(let s of [-1,1]){pitch(g,s,0,w/2,-l/2,l/2,h,r,w,mat(base));const rows=q.roof.includes('red')?8:3,cols=q.roof.includes('red')?15:28;for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){let z0=-l/2+(col+(row%2)*.5)*l/cols,z1=Math.min(l/2,z0+l/cols*.99);if(z0>=l/2)continue;let rr=(row+.02)*w/2/rows,rr1=Math.min(w/2,(row+1.02)*w/2/rows);let tile=pitch(g,s,rr,rr1,z0,z1,h+.003+(row%2)*.001,r,w,mat(palette[Math.floor(Math.abs(Math.sin(col*31.3+row*73.8+index)*4375))%palette.length]),.009);tile.castShadow=false;tile.receiveShadow=false;}
beam(g,V(s*w/2,h-.005,-l/2),V(s*w/2,h-.005,l/2),.022);for(let z of [-l/2,l/2])beam(g,V(0,h+r+.004,z),V(s*w/2,h+.004,z),.022,q.roof.includes('red')?wood:mat('#796044'));}
beam(g,V(0,h+r+.005,-l/2-.007),V(0,h+r+.005,l/2+.007),.029,q.roof.includes('red')?mat('#514238'):mat('#8e6b48'));
// A masonry chimney is embedded through each roof, capped around a dark flue.
const tops=[[145,375],[359,348],[444,195],[405,9]][index],topY=h+r+[0,.24,.34,.29][index];
const wp=ctx.pixelToWorld(399+tops[0]/4,374+tops[1]/4,topY),dx=wp.x-q.cx,dz=wp.z-q.cz;
const chimneyX=Math.cos(q.angle)*dx-Math.sin(q.angle)*dz,chimneyZ=Math.sin(q.angle)*dx+Math.cos(q.angle)*dz;
const baseY=h+r*(1-Math.abs(chimneyX)/(w/2))-.045,ch=topY-baseY;
box(g,chimneyX,baseY+ch/2,chimneyZ,.070,ch,.073,stone);for(let j=0;j<Math.ceil(ch/.049);j++)box(g,chimneyX,baseY+j*.049,chimneyZ,.075,.007,.078,'#646c6b');box(g,chimneyX,topY-.01,chimneyZ,.091,.027,.09,'#727a7a');box(g,chimneyX,topY+.005,chimneyZ,.045,.005,.045,'#242b2b');
// Small relief retains readable material colors without whole-map shadow-map acne.
g.traverse(m=>{if(m.isMesh)m.receiveShadow=false;});

return g;}
export function build(ctx){let g=new THREE.Group();g.name='west-east-houses';houses.forEach((q,i)=>g.add(house(ctx,q,i)));return g;}
