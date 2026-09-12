import {THREE,mat,box} from '../scene/common.js';
const C={wood:'#38291d',plaster:'#d5c8a6',shade:'#99aaa4',salmon:'#dc9b7b',roof:'#59321e'};
function beam(g,a,b,w,c=C.wood){let v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));let m=box(g,0,0,0,w,v.length(),w,c);m.position.copy(new THREE.Vector3(...a).addScaledVector(v,.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function tri(g,z,w,e,p,c){let s=new THREE.Shape();s.moveTo(-w/2,e);s.lineTo(w/2,e);s.lineTo(0,p);s.closePath();let m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.036,bevelEnabled:false}),mat(c));m.position.z=z-.018;g.add(m);m.castShadow=m.receiveShadow=true;}
function roof(g,w,d,e,p,palette=['#623820','#6b3d24','#74462b','#59301d']){let run=w/2,rise=p-e,angle=Math.atan2(rise,run),len=Math.hypot(run,rise);for(let side of [-1,1]){let m=box(g,side*run/2,(e+p)/2,0,len,.035,d,palette[0]);m.rotation.z=-side*angle;
// Actual shallow overlapping terracotta courses cover both slopes.
for(let r=0;r<7;r++)for(let j=0;j<13;j++){let t=(r+.53)/7,z=-d/2+(j+.5)*d/13;const tile=box(g,side*run*t,(p-rise*t)+.022,z,len/7*.98,.013,d/13*.92,palette[(j*7+r*3)%palette.length]);tile.rotation.z=-side*angle;}
beam(g,[side*run,e,-d/2],[side*run,e,d/2],.038,'#654027');}
beam(g,[0,p+.025,-d/2-.018],[0,p+.025,d/2+.018],.043,'#75482f');}
function archedWindow(g,x,y,z,w,h,rotation=0){const win=new THREE.Group();win.position.set(x,y,z);win.rotation.y=rotation;g.add(win);let s=new THREE.Shape();s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h*.18);s.quadraticCurveTo(w/2,h/2,0,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h*.18);s.closePath();let frame=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.016,bevelEnabled:false}),mat('#ab9776'));win.add(frame);let inner=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.021,bevelEnabled:false}),mat('#252b27'));inner.scale.set(.72,.83,1);inner.position.z=.006;win.add(inner);box(win,0,-h*.52,.015,w*1.18,.022,.044,'#c2ad85');}
function frame(g,w,d,e,base=0){for(let z of [-d/2,d/2]){for(let x of [-w/2,0,w/2])box(g,x,(base+e)/2,z,.033,e-base,.038,C.wood);for(let y of [base+.04,.34,e])box(g,0,y,z,w,.035,.038,C.wood);}for(let x of [-w/2,w/2]){for(let z of [-d/2,-d/6,d/6,d/2])box(g,x,(base+e)/2,z,.038,e-base,.032,C.wood);for(let y of [base+.04,.34,e])box(g,x,y,0,.038,.035,d,C.wood);}}
export function build(ctx){const g=new THREE.Group();g.name='east-tile-house';g.position.copy(ctx.pixelToWorld(844,344,.06));g.rotation.y=-1.52;const w=.65,d=1.02,e=.68,p=.98;
// A recessed lower bay has solid return walls, back wall and a ceiling.
box(g,0,.155,-.14,w,.31,.74,C.shade);box(g,-.245,.155,.37,.16,.31,.30,C.plaster);box(g,.285,.155,.37,.08,.31,.30,C.shade);box(g,0,.022,0,w,.044,d,'#777667');box(g,0,.33,0,w+.025,.055,d+.02,C.wood);
box(g,0,.505,0,w,.35,d,C.plaster);box(g,w/2+.001,.505,0,.014,.35,d,C.shade);frame(g,w,d,e);
for(let z of [-d/2,d/2]){tri(g,z,w,e,p,C.plaster);beam(g,[-w/2,e,z],[0,p,z],.03);beam(g,[w/2,e,z],[0,p,z],.03);}
roof(g,w+.11,d+.10,e+.015,p+.03);
for(let x of [-.18,.17])archedWindow(g,x,.505,d/2+.021,.12,.20);
for(let z of [-.32,.26])archedWindow(g,-w/2-.026,.505,z,.115,.185,-Math.PI/2);
archedWindow(g,.01,.51,-d/2-.022,.12,.19,Math.PI);
for(let z of [-.32,.28])archedWindow(g,w/2+.025,.50,z,.105,.18,Math.PI/2);
// Perpendicular attached rear cross-gable: the salmon end is visible upper-left.
const rear=new THREE.Group();rear.position.set(-.32,0,-.25);rear.rotation.y=Math.PI/2;g.add(rear);const rw=.38,rd=.56,re=.72,rp=1.12;
box(rear,0,.36,0,rw,.72,rd,C.plaster);frame(rear,rw,rd,re);for(let z of [-rd/2,rd/2])tri(rear,z,rw,re,rp,C.salmon);roof(rear,rw+.07,rd+.065,re+.012,rp+.02,['#af7859','#be8b69','#a86e50','#b9805e']);archedWindow(rear,0,.84,-rd/2-.022,.125,.18,Math.PI);
// Lower front cross-gable is a complete projecting wing, joined into the main slope.
const front=new THREE.Group();front.position.set(.32,0,-.02);front.rotation.y=Math.PI/2;g.add(front);const fw=.43,fd=.49,fe=.66,fp=.97;
box(front,0,.16,.08,fw,.32,fd-.16,C.shade);box(front,0,.49,0,fw,.34,fd,C.shade);frame(front,fw,fd,fe);for(let z of [-fd/2,fd/2]){tri(front,z,fw,fe,fp,C.salmon);beam(front,[-fw/2,fe,z],[0,fp,z],.022,'#9c7053');beam(front,[fw/2,fe,z],[0,fp,z],.022,'#9c7053');}
roof(front,fw+.075,fd+.07,fe+.015,fp+.025,['#bc8062','#c58c6e','#b77758','#ce9574']);archedWindow(front,0,.50,fd/2+.022,.115,.18);box(front,0,.15,fd/2+.025,.16,.29,.025,'#242923');
// Closed hidden facade: real rear entrance, lintel and threshold.
box(g,.04,.17,-d/2-.025,.17,.29,.027,'#51432e');for(let x of [-.03,.025,.08])box(g,x,.17,-d/2-.044,.012,.27,.012,'#726048');box(g,.04,.015,-d/2-.065,.22,.03,.13,'#8d8a79');
return g;}
