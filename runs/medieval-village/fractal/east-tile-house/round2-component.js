import {THREE,mat,box} from '../scene/common.js';
const C={wood:'#38291d',plaster:'#d5c8a6',shade:'#99aaa4',salmon:'#dc9b7b',roof:'#59321e'};
function beam(g,a,b,w,c=C.wood){let v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));let m=box(g,0,0,0,w,v.length(),w,c);m.position.copy(new THREE.Vector3(...a).addScaledVector(v,.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function tri(g,z,w,e,p,c){let s=new THREE.Shape();s.moveTo(-w/2,e);s.lineTo(w/2,e);s.lineTo(0,p);s.closePath();let m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.036,bevelEnabled:false}),mat(c));m.position.z=z-.018;g.add(m);m.castShadow=m.receiveShadow=true;}
function roof(g,w,d,e,p,palette=['#56321f','#5a3522','#5e3824','#53301f']){let run=w/2,rise=p-e,angle=Math.atan2(rise,run),len=Math.hypot(run,rise);for(let side of [-1,1]){let m=box(g,side*run/2,(e+p)/2,0,len,.035,d,palette[0]);m.rotation.z=-side*angle;
// Actual shallow overlapping terracotta courses cover both slopes.
for(let r=0;r<7;r++)for(let j=0;j<13;j++){let t=(r+.53)/7,z=-d/2+(j+.5)*d/13;const tile=box(g,side*run*t,(p-rise*t)+.022,z,len/7*.99,.006,d/13*.97,palette[(j*7+r*3)%palette.length]);tile.rotation.z=-side*angle;}
beam(g,[side*run,e,-d/2],[side*run,e,d/2],.038,'#654027');}
beam(g,[0,p+.025,-d/2-.018],[0,p+.025,d/2+.018],.043,'#75482f');}
function hipRoof(g,w,d,e,p){
const r=w/2, end=d/2, tip=end-.25;
const panels=[[[0,p,-end],[0,p,tip],[r,e,end],[r,e,-end]],[[0,p,tip],[0,p,-end],[-r,e,-end],[-r,e,end]],[[0,p,tip],[-r,e,end],[r,e,end]]];
for(let [i,pts] of panels.entries()){
 let pos=[],ids=[],n=pts.length;for(let dy of [0,-.035])for(let q of pts)pos.push(q[0],q[1]+dy,q[2]);for(let k=1;k<n-1;k++){ids.push(0,k,k+1,n,n+k+1,n+k);}for(let k=0;k<n;k++){let j=(k+1)%n;ids.push(k,n+k,j,j,n+k,n+j);}let geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(ids);geo.computeVertexNormals();let m=new THREE.Mesh(geo,mat(i===2?'#623920':'#593320',{side:THREE.DoubleSide}));g.add(m);m.castShadow=m.receiveShadow=true;
}
for(let side of [-1,1]){for(let row=0;row<8;row++){let t=(row+.5)/8,x=side*r*t,y=p+(e-p)*t+.012,zmax=tip+.25*t;for(let j=0;j<14;j++){let z=-end+(j+.5)*(zmax+end)/14;let tile=box(g,x,y,z,Math.hypot(r,p-e)/8*.98,.008,(zmax+end)/14*.94,['#593520','#603923','#55301e','#633b25'][(row*3+j)%4]);tile.rotation.z=-side*Math.atan2(p-e,r);}}}
for(let row=0;row<7;row++){let t=(row+.6)/7,y=p+(e-p)*t+.012,z=tip+.25*t;for(let j=0;j<9;j++){let x=(-1+(j+.5)*2/9)*r*t;let tile=box(g,x,y,z,2*r*t/9*.96,.008,Math.hypot(.25,p-e)/7*.96,['#674028','#603921','#6b4228'][(j+row)%3]);tile.rotation.x=Math.atan2(p-e,.25);}}
beam(g,[0,p+.02,-end],[0,p+.02,tip],.037,'#70452c');for(let side of [-1,1]){beam(g,[0,p+.015,tip],[side*r,e+.015,end],.023,'#795036');beam(g,[side*r,e,-end],[side*r,e,end],.032,'#634027');}beam(g,[-r,e,end],[r,e,end],.032,'#684329');
}
function archedWindow(g,x,y,z,w,h,rotation=0){const win=new THREE.Group();win.position.set(x,y,z);win.rotation.y=rotation;g.add(win);let s=new THREE.Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h*.18);s.quadraticCurveTo(w/2,h/2,0,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h*.18);s.closePath();let frame=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.016,bevelEnabled:false}),mat('#ab9776'));win.add(frame);let inner=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.021,bevelEnabled:false}),mat('#252b27'));inner.scale.set(.72,.83,1);inner.position.z=.006;win.add(inner);box(win,0,-h*.52,.015,w*1.18,.022,.044,'#c2ad85');}
function frame(g,w,d,e,base=0){for(let z of [-d/2,d/2]){for(let x of [-w/2,0,w/2])box(g,x,(base+e)/2,z,.033,e-base,.038,C.wood);for(let y of [base+.04,.34,e])box(g,0,y,z,w,.035,.038,C.wood);}for(let x of [-w/2,w/2]){for(let z of [-d/2,-d/6,d/6,d/2])box(g,x,(base+e)/2,z,.038,e-base,.032,C.wood);for(let y of [base+.04,.34,e])box(g,x,y,0,.038,.035,d,C.wood);}}
export function build(ctx){const g=new THREE.Group();g.name='east-tile-house';g.position.copy(ctx.pixelToWorld(844,344,.06));g.rotation.y=-1.52;const w=.65,d=1.02,e=.59,p=.90;
// A recessed lower bay has solid return walls, back wall and a ceiling.
box(g,0,.155,-.14,w,.31,.74,C.shade);box(g,-.245,.155,.37,.16,.31,.30,C.plaster);box(g,.285,.155,.37,.08,.31,.30,C.shade);box(g,0,.022,0,w,.044,d,'#777667');box(g,0,.33,0,w+.025,.055,d+.02,C.wood);
box(g,0,.46,0,w,.26,d,C.plaster);box(g,w/2+.001,.46,0,.014,.26,d,C.shade);frame(g,w,d,e);
tri(g,-d/2,w,e,p,C.plaster);
hipRoof(g,w+.11,d+.10,e+.015,p+.03);
for(let x of [-.18,.17])archedWindow(g,x,.46,d/2+.021,.12,.20);
for(let z of [-.32,.26])archedWindow(g,-w/2-.026,.46,z,.115,.185,-Math.PI/2);
archedWindow(g,.01,.46,-d/2-.022,.12,.19,Math.PI);
for(let z of [-.32,.28])archedWindow(g,w/2+.025,.46,z,.105,.18,Math.PI/2);
// Perpendicular attached rear cross-gable: the salmon end is visible upper-left.
const rear=new THREE.Group();rear.position.set(-.22,0,.20);rear.rotation.y=Math.PI/2;g.add(rear);const rw=.38,rd=.47,re=.62,rp=.89;
box(rear,0,.31,0,rw,.62,rd,C.plaster);frame(rear,rw,rd,re);for(let z of [-rd/2,rd/2])tri(rear,z,rw,re,rp,C.salmon);roof(rear,rw+.07,rd+.065,re+.012,rp+.02,['#bb8266','#bd8569','#b98165','#bf886d']);archedWindow(rear,0,.70,-rd/2-.022,.125,.18,Math.PI);
// Lower front cross-gable is a complete projecting wing, joined into the main slope.
const front=new THREE.Group();front.position.set(.30,0,.08);front.rotation.y=Math.PI/2;g.add(front);const fw=.40,fd=.37,fe=.55,fp=.76;
box(front,0,.16,.08,fw,.32,fd-.16,C.shade);box(front,0,.44,0,fw,.23,fd,C.shade);frame(front,fw,fd,fe);for(let z of [-fd/2,fd/2]){tri(front,z,fw,fe,fp,C.salmon);beam(front,[-fw/2,fe,z],[0,fp,z],.022,'#9c7053');beam(front,[fw/2,fe,z],[0,fp,z],.022,'#9c7053');}
roof(front,fw+.075,fd+.07,fe+.015,fp+.025,['#c68d76','#c38a73','#c78e77','#c58d76']);archedWindow(front,0,.43,fd/2+.022,.115,.18);box(front,0,.15,fd/2+.025,.16,.29,.025,'#242923');
// Closed hidden facade: real rear entrance, lintel and threshold.
box(g,.04,.17,-d/2-.025,.17,.29,.027,'#51432e');for(let x of [-.03,.025,.08])box(g,x,.17,-d/2-.044,.012,.27,.012,'#726048');box(g,.04,.015,-d/2-.065,.22,.03,.13,'#8d8a79');
return g;}
