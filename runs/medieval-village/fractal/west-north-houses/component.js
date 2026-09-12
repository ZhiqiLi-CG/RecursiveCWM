import {THREE,mat,box} from '../scene/common.js';

const timber=mat('#302a20'), plaster=mat('#aaa895'), stone=mat('#6b7470'), dark=mat('#182126');
function beam(g,a,b,r,material=timber){let p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),v=q.clone().sub(p);let m=box(g,...p.clone().add(q).multiplyScalar(.5).toArray(),r,v.length(),r,material);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function gable(g,z,w,y,r,color){let s=new THREE.Shape();s.moveTo(-w/2,y);s.lineTo(w/2,y);s.lineTo(0,y+r);s.closePath();let m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:false}),color);m.position.z=z-.0225;m.castShadow=true;m.receiveShadow=true;g.add(m);}
function house(ctx,parent,c){
 let g=new THREE.Group();g.name=c.name;let p=ctx.pixelToWorld(...c.anchor,.06);g.position.copy(p);g.rotation.y=c.yaw;parent.add(g);
 let {w,d,h,r}=c;let base=c.tall?.44:.20;box(g,0,base/2-.015,0,w+.04,base+.06,d+.04,stone);box(g,0,(h+base)/2,0,w,h-base,d,c.wall?mat(c.wall):plaster);
 let seed=37;function rand(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
 // Masonry is laid against all four sides, with small irregular courses.
 for(let face=0;face<4;face++){let side=new THREE.Group();side.rotation.y=face*Math.PI/2;g.add(side);let span=face%2?d:w,dep=face%2?w:d;for(let row=0;row<(c.tall?4:2);row++)for(let i=0;i<Math.ceil(span/.19);i++){let sw=span/Math.ceil(span/.19);box(side,-span/2+sw*(i+.5),.055+row*.095,dep/2+.012,sw-.016,.077,.026,mat(['#68736e','#7d8276','#5d6866'][Math.floor(rand()*3)]));}}
 for(let z of [-d/2,d/2]){gable(g,z,w,h,r,c.wall?mat(c.wall):plaster);for(let x of [-w/2,w/2])beam(g,[x,.20,z],[x,h,z],.053);beam(g,[-w/2,h,z],[w/2,h,z],.055);beam(g,[-w/2,h,z],[0,h+r,z],.043);beam(g,[0,h+r,z],[w/2,h,z],.043);beam(g,[0,h,z],[0,h+r,z],.041);}
 for(let x of [-w/2,w/2]){for(let z of [-d/2,0,d/2])beam(g,[x,.21,z],[x,h,z],.047);beam(g,[x,h,-d/2],[x,h,d/2],.05);}
 let floor=c.tall?.46:.27;for(let z of [-d/2-.012,d/2+.012])beam(g,[-w/2,floor,z],[w/2,floor,z],.045);for(let x of [-w/2-.012,w/2+.012])beam(g,[x,floor,-d/2],[x,floor,d/2],.045);
 // Closed, thick pitched roof, continuous ridge and subtly varied courses.
 let e=.075,run=w/2+e,rise=r+e*.8,len=Math.hypot(run,rise),theta=Math.atan2(rise,run),roofMats=c.roof.map(x=>mat(x));
 if(c.thatch){let canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;let ink=canvas.getContext('2d');ink.fillStyle='#eeeeee';ink.fillRect(0,0,256,256);for(let i=0;i<2100;i++){let x=rand()*256,y=rand()*256;ink.strokeStyle=`rgba(80,70,45,${.03+rand()*.14})`;ink.lineWidth=.6+rand()*.8;ink.beginPath();ink.moveTo(x,y);ink.lineTo(x+4+rand()*24,y+rand()*1.8);ink.stroke();}let texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;roofMats[0].map=texture;}
 for(let side of [-1,1]){let slab=box(g,side*run/2,h+r-rise/2+.034,0,len,.078,d+.17,roofMats[0]);slab.rotation.z=-side*theta;
  let rows=c.thatch?1:6,cols=c.thatch?31:7;
  for(let row=0;row<(c.thatch?0:rows);row++)for(let col=0;col<cols;col++){let t=(row+.5)/rows,zz=-(d+.17)/2+(col+.5)*(d+.17)/cols;let tile=box(g,side*run*t,h+r-rise*t+.036,zz,len/rows+.012,c.thatch?.017:.023,(d+.17)/cols-.002,roofMats[Math.floor(rand()*roofMats.length)]);tile.rotation.z=-side*theta;}
 }
 beam(g,[0,h+r+.028,-d/2-.1],[0,h+r+.028,d/2+.1],c.thatch?.073:.046,roofMats[1]);
 // Glazed openings and wooden doors have recessed dark centers, frames and sills.
 function window(side,x,y,z,ww,hh){let f=new THREE.Group();f.position.set(x,y,z);f.rotation.y=side;g.add(f);box(f,0,0,0,ww+.065,hh+.06,.031,plaster);box(f,0,0,.020,ww,hh,.019,timber);box(f,0,0,.031,ww*.68,hh*.70,.012,dark);box(f,0,0,.034,.017,hh,.016,plaster);box(f,0,-hh/2-.015,.031,ww+.06,.03,.05,stone);}
 for(let zsign of [-1,1]){let z=zsign*(d/2+.024);if(c.tall){for(let x of [-w*.26,w*.26])window(zsign<0?Math.PI:0,x,.61,z,.15,.17);window(zsign<0?Math.PI:0,0,.31,z,.20,.15);}else window(zsign<0?Math.PI:0,w*.26,h*.62,z,.11,.14);window(zsign<0?Math.PI:0,0,h+r*.30,z,.12,.17);}
 for(let sign of [-1,1]){window(sign*Math.PI/2,sign*(w/2+.02),c.tall?.62:h*.60,d*.24,.13,c.tall?.19:.13);if(c.tall)window(sign*Math.PI/2,sign*(w/2+.02),.61,-d*.26,.17,.19);}
 let door=new THREE.Group();door.position.set(-w*.17,c.tall?.22:.10,-d/2-.04);door.rotation.y=Math.PI;g.add(door);if(!c.tall)door.scale.setScalar(.72);box(door,0,.16,0,.23,.35,.044,timber);for(let i=0;i<4;i++)box(door,(i-1.5)*.045,.16,.025,.04,.32,.012,mat('#474032'));box(door,.063,.17,.035,.018,.02,.018,mat('#96957b'));box(g,-w*.17,.025,-d/2-.13,.30,.07,.23,stone);
 if(c.tall){window(-Math.PI/2,-w/2-.036,.27,-d*.23,.15,.095);box(g,-w/2-.032,.24,d*.24,.034,.38,.23,timber);for(let sign of [-1,1]){beam(g,[sign*w/2,.49,-d*.43],[sign*w/2,.74,-d*.10],.031);beam(g,[sign*w/2,.49,d*.43],[sign*w/2,.74,d*.10],.031);}}
 if(c.porch){let shed=new THREE.Group();shed.position.set(w*.38,0,d/2+.11);g.add(shed);box(shed,0,.17,0,.27,.34,.23,mat('#666c62'));let cover=box(shed,0,.37,0,.35,.045,.32,mat('#5d6870'));cover.rotation.x=.26;box(shed,0,.19,.123,.14,.25,.027,timber);}
 if(c.chimney){let x=w*.24,z=d*.24,hh=h+r+.15;box(g,x,(h+hh)/2,z,.13,hh-h,.16,stone);box(g,x,hh,z,.17,.045,.20,mat('#555f5c'));box(g,x,hh+.025,z,.09,.012,.11,dark);}
 return g;
}
export function build(ctx){let g=new THREE.Group();g.name='west-north-houses';
 house(ctx,g,{name:'moss-timber-house',anchor:[226,469],yaw:1.55,w:.74,d:.61,h:.88,r:.29,tall:true,thatch:true,roof:['#30321c','#343620','#393822','#343822','#383921']});
 house(ctx,g,{name:'straw-gable-cottage',anchor:[303,422],yaw:.15,w:.60,d:.79,h:.50,r:.36,wall:"#737970",porch:true,thatch:true,roof:['#b68e77','#bd947f','#b68d76','#c19983','#b9917d']});
 house(ctx,g,{name:'slate-cottage-under-pin',anchor:[351,416],yaw:.35,w:.35,d:.42,h:.30,r:.26,wall:"#636e70",chimney:true,roof:['#45545d','#536570','#52606b','#61717b']});
 return g;
}
