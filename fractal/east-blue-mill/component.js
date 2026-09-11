import {THREE,mat,box} from '../scene/common.js';
function beam(g,a,b,w,c,d=w){const v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const m=box(g,0,0,0,w,v.length(),d,c);m.position.copy(new THREE.Vector3(...a).addScaledVector(v,.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function prism(g,points,z,depth,color){const s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false}),mat(color));m.position.z=z;m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
export function build(ctx){
 const g=new THREE.Group();g.name='east-blue-mill';const l=ctx.pixelToWorld(791,383,.06),r=ctx.pixelToWorld(825.5,385,.06),u=r.clone().sub(l).normalize();g.position.copy(l.clone().add(r).multiplyScalar(.5));g.rotation.y=-Math.atan2(u.z,u.x);
 const w=.89,d=1.04,e=.455,peak=.975,timber='#514536',plaster='#f0ead3';
 // Local front is z=0; the complete building extends behind it to z=-d.
 box(g,0,.025,-d/2,w+.03,.05,d+.025,'#777568');box(g,0,e/2,-d/2,w,e,d,plaster);
 const curve=t=>e+(peak-e)*Math.pow(1-t,1.45),rw=w/2+.045;
 for(const z of [-d,0]){let pts=[[-w/2,0],[w/2,0]];for(let i=10;i>=0;i--)pts.push([w/2*i/10,curve(i/10)]);for(let i=1;i<=10;i++)pts.push([-w/2*i/10,curve(i/10)]);prism(g,pts,z-.025,.05,plaster);}
 // Two closed flaring roof slopes, with restrained rows of blue shingle relief.
 for(const side of [-1,1]){
  const points=[];for(let i=0;i<=12;i++)points.push([side*rw*i/12,curve(i/12)+.025]);for(let i=12;i>=0;i--)points.push([side*rw*i/12,curve(i/12)-.018]);prism(g,points,-d-.045,d+.085,side<0?'#285979':'#164364');
  for(let row=0;row<10;row++)for(let col=0;col<14;col++){const t0=(row+.02)/10,t1=(row+.98)/10,z=-d-.025+col*(d+.04)/14;const pts=[[side*rw*t0,curve(t0)+.026],[side*rw*t1,curve(t1)+.026],[side*rw*t1,curve(t1)+.027],[side*rw*t0,curve(t0)+.027]];prism(g,pts,z,.073,['#275777','#2b5c7d','#2c5c7a','#275578','#2b597a'][(Math.floor(row/2)*7+Math.floor(col/2)*3)%5]).castShadow=false;}
 }
 beam(g,[0,peak+.037,-d-.055],[0,peak+.037,.048],.038,'#1c4664');
 for(const z of [.032,-d-.032]){
  for(const x of [-w/2,-.16,.15,w/2])beam(g,[x,.035,z],[x,curve(Math.abs(x)/(w/2))-.015,z],.027,timber);
  for(const y of [.035,.255,.65]){const half=y>.425?.19:w/2;beam(g,[-half,y,z],[half,y,z],.032,timber);}
  beam(g,[0,.65,z],[0,peak-.025,z],.026,timber);
  for(const side of [-1,1]){beam(g,[side*w/2,.43,z],[side*.16,.26,z],.025,timber);beam(g,[side*w/2,.05,z],[side*.23,.25,z],.021,timber);beam(g,[side*.11,.04,z],[side*.16,.25,z],.025,timber);for(let i=0;i<6;i++){const t=i/6,tt=(i+1)/6;beam(g,[side*w/2*t,curve(t),z],[side*w/2*tt,curve(tt),z],.027,timber);}}
  // Square loft opening recessed behind a thick plaster reveal and dark lintel.
  box(g,-.014,.481,z+Math.sign(z+.5)*.008,.14,.165,.027,'#24281e');
  for(const x of [-.103,.075])box(g,x,.481,z+Math.sign(z+.5)*.025,.027,.213,.035,'#a4a58d');for(const y of [.381,.581])box(g,-.014,y,z+Math.sign(z+.5)*.025,.208,.027,.039,'#b1b09a');
 }
 // All side bays have sills, upright posts, and diagonal braces.
 for(const side of [-1,1]){const x=side*(w/2+.007);for(const y of [.06,e-.03])box(g,x,y,-d/2,.027,.031,d,timber);for(let i=0;i<=4;i++)box(g,x,e/2,-d*i/4,.029,e,.03,timber);for(let i=0;i<4;i++)beam(g,[x,.06,-d*i/4],[x,e-.03,-d*(i+1)/4],.02,timber);}
 // Rear working door and solid threshold complete the hidden end.
 box(g,.21,.145,-d-.05,.19,.28,.025,'#594532');for(const x of [.13,.20,.27])box(g,x,.145,-d-.067,.013,.26,.013,'#3f3427');box(g,.21,.017,-d-.085,.235,.035,.15,'#868274');
 // Front-right attached lean-to: closed plaster body and thick grey slate roof.
 const leanBody=prism(g,[[-.235,0],[.015,0],[.015,.302],[-.235,.233]],0,.41,'#acac9b');leanBody.rotation.y=Math.PI/2;leanBody.position.set(-.025,0,0);const roof=box(g,.18,.275,.145,.47,.036,.35,'#5c6a6c');roof.rotation.x=.27;for(const x of [-.035,.385])box(g,x,.13,.23,.025,.26,.025,timber);beam(g,[-.047,.236,.32],[.407,.236,.32],.032,'#414a46');
 // Bearing mast and braces are attached to the front gable and roof ridge.
 beam(g,[0,peak-.035,-.075],[0,1.465,-.075],.059,'#50412d');beam(g,[0,1.38,-.065],[0,.93,-.47],.043,timber);
 const cy=1.47,cz=.11;beam(g,[0,cy,-.11],[0,cy,cz+.025],.061,'#5e4a2e');
 const rotor=new THREE.Group();rotor.position.set(.03,cy,cz+.045);rotor.rotation.z=-.006;g.add(rotor);
 beam(rotor,[-.53,0,0],[.57,0,0],.052,'#b0794e',.043);beam(rotor,[0,-.395,.004],[0,.35,.004],.061,'#b78355',.044);
 // Solid darker end grain and iron-clad wooden hub, with no opaque sail sheets.
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(.057,.057,.071,8),mat('#977043'));hub.rotation.x=Math.PI/2;hub.position.z=.013;hub.castShadow=true;rotor.add(hub);const pin=new THREE.Mesh(new THREE.CylinderGeometry(.019,.019,.079,8),mat('#574934'));pin.rotation.x=Math.PI/2;pin.position.z=.019;rotor.add(pin);
 return g;
}
