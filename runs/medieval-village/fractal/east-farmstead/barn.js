import {THREE,mat,box} from '../scene/common.js';
function beam(g,a,b,w,color){const v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const m=box(g,0,0,0,w,v.length(),w,color);m.position.copy(new THREE.Vector3(...a).addScaledVector(v,.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function gable(g,z,w,eave,peak,color){const s=new THREE.Shape();s.moveTo(-w/2,eave);s.lineTo(w/2,eave);s.lineTo(0,peak);s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:false}),mat(color));m.position.z=z-.0225;m.castShadow=true;m.receiveShadow=true;g.add(m);}
export function build(ctx){
 const g=new THREE.Group();g.name='east-farmstead-lower-thatch-barn';const p=ctx.pixelToWorld(833.5,409,.06);g.position.copy(p);g.rotation.y=-1.52;
 const w=.66,d=.95,eave=.57,peak=1.10,timber='#302a21';
 box(g,0,.175,0,w,.35,d,'#848075');
 for(let z of [-d/2-.003,d/2+.003])for(let row=0;row<4;row++)for(let j=0;j<4;j++){let x=-.25+j*.167+(row%2)*.06;if(x>.3)continue;box(g,x,.055+row*.085,z,.148,.067,.014,['#8a877c','#7c7d71','#918b7d'][(j+row)%3]);}
 for(let side of [-1,1])for(let row=0;row<4;row++)for(let j=0;j<6;j++)box(g,side*(w/2+.005),.055+row*.085,-.42+j*.163,.015,.067,.145,['#7c8075','#88897d','#747c74'][(row+j)%3]);
 box(g,0,.422,0,w,.265,d,'#b4ae93');
 for(let z of [-d/2,d/2]){gable(g,z,w,eave,peak,'#b4ae99');for(let x of [-w/2,0,w/2])beam(g,[x,.29,z+Math.sign(z)*.028],[x,x===0?peak:eave,z+Math.sign(z)*.028],.034,timber);beam(g,[-w/2,eave,z+Math.sign(z)*.028],[0,peak,z+Math.sign(z)*.028],.04,timber);beam(g,[w/2,eave,z+Math.sign(z)*.028],[0,peak,z+Math.sign(z)*.028],.04,timber);beam(g,[-w/2,.30,z+Math.sign(z)*.028],[w/2,.30,z+Math.sign(z)*.028],.05,timber);beam(g,[-w/2,eave,z+Math.sign(z)*.028],[w/2,eave,z+Math.sign(z)*.028],.045,timber);beam(g,[-w/2,.35,z+Math.sign(z)*.031],[0,eave,z+Math.sign(z)*.031],.029,timber);beam(g,[w/2,.35,z+Math.sign(z)*.031],[0,eave,z+Math.sign(z)*.031],.029,timber);
 box(g,.07,.58,z+Math.sign(z)*.034,.13,.29,.018,'#29251d');for(let x of [0,.14])box(g,x,.58,z+Math.sign(z)*.048,.019,.31,.021,'#584431');}
 for(let x of [-w/2,w/2]){for(let z of [-d/2,-.18,.18,d/2])box(g,x,.435,z,.045,.29,.045,timber);box(g,x,.30,0,.045,.05,d,timber);box(g,x,eave,0,.045,.045,d,timber);}
 // Two substantial roof slabs and narrow bundled thatch relief on every slope.
 const rw=w/2+.085,rd=d+.15,rise=peak-eave,slant=Math.hypot(rw,rise);
 for(let side of [-1,1]){const roof=box(g,side*rw/2,(eave+peak)/2,0,slant,.072,rd,side===1?'#666956':'#79775b');roof.rotation.z=-side*Math.atan2(rise,rw);
 for(let j=0;j<27;j++){const z=-rd/2+(j+.5)*rd/27;const c=['#626654','#6b6e5a','#59624f','#72715b'][j%4];beam(g,[side*.017,peak+.066,z],[side*(rw+.012),eave+.060,z+.01*Math.sin(j*2)],.014,c);}}
 beam(g,[0,peak+.06,-rd/2-.05],[0,peak+.06,rd/2+.08],.047,'#644b35');
 // Rear access door completes the unseen working building.
 box(g,0,.235,-d/2-.035,.25,.45,.035,'#483a2b');
 for(let x of [-.08,0,.08])box(g,x,.235,-d/2-.056,.012,.44,.015,'#68533b');
 for(let y of [.11,.34])box(g,0,y,-d/2-.068,.26,.026,.018,timber);
 // Grounded feed sack beside the front gable, with a solid faceted body.
 const sack=new THREE.Mesh(new THREE.DodecahedronGeometry(.135,0),mat('#9c806f'));sack.scale.set(.8,1.22,.8);sack.position.set(-.38,.115,.57);sack.castShadow=true;g.add(sack);
 return g;
}
