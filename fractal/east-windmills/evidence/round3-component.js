import {THREE,mat,box} from '../scene/common.js';
const timber=mat('#704019'),edge=mat('#6e390e'),plaster=mat('#dcc7a1'),stone=[mat('#737e78'),mat('#969e90'),mat('#647578'),mat('#b0ac91')],sail=mat('#68716e'),rail=mat('#43483e'),roof=mat('#885437');
function beam(g,a,b,w,d,m){a=new THREE.Vector3(...a);b=new THREE.Vector3(...b);let o=box(g,...a.clone().add(b).multiplyScalar(.5).toArray(),w,a.distanceTo(b),d,m);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());return o;}
function cone(g,r0,r1,y,h,m,n=8){let o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r0,h,n),m);o.position.y=y+h/2;o.rotation.y=Math.PI/8;o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
function mill(ctx,foot,scale,angle){let root=new THREE.Group();root.name=scale<1?'western-windmill':'eastern-windmill';root.position.copy(ctx.pixelToWorld(...foot,.06));root.scale.setScalar(scale);root.scale.y*=scale<1?.95:.93;root.rotation.y=-angle;
 // Continuous enclosed core with individual solid masonry blocks.
 cone(root,.40,.355,0,.33,stone[0]);
 for(let row=0;row<3;row++)for(let j=0;j<8;j++){let a=(j+(row%2)*.5)*Math.PI/4;let q=new THREE.Group();q.rotation.y=a;q.position.set(Math.sin(a)*(.365-row*.008),.053+row*.104,Math.cos(a)*(.365-row*.008));root.add(q);box(q,0,0,0,.267,.095,.063,stone[(j+row*3)%4]);}
 cone(root,.34,.17,.30,1.14,plaster);
 // Eight corner posts, complete bands, and visible diagonal framing on every face.
 for(let i=0;i<8;i++){let a=Math.PI/8+i*Math.PI/4, b=a+Math.PI/4;let v=(r,y,t)=>[r*Math.sin(t),y,r*Math.cos(t)];beam(root,v(.353,.31,a),v(.181,1.45,a),.041,.039,timber);for(let [y0,y1] of [[.34,.61],[.69,1.41]]){let r0=.35-(y0-.3)*.149,r1=.35-(y1-.3)*.149;beam(root,v(r0,y0,a),v(r1,y1,b),.032,.030,timber);}}
 for(let [y,r,h] of [[.32,.365,.085],[.64,.33,.085],[1.43,.207,.061]])cone(root,r,r,y,h,edge);
 // Thick projecting wooden belt with timber underside brackets.
 cone(root,.412,.412,.61,.076,edge);
 for(let i=0;i<8;i++){let a=i*Math.PI/4;beam(root,[Math.sin(a)*.29,.46,Math.cos(a)*.29],[Math.sin(a)*.40,.62,Math.cos(a)*.40],.04,.045,timber);}
 // Working access at the foot and a rear upper hatch, each attached to solid walls.
 box(root,0,.17,.388,.13,.245,.035,timber);box(root,0,.20,.414,.018,.19,.018,edge);box(root,0,.037,.466,.26,.074,.18,stone[1]);
 box(root,0,.93,-.265,.12,.17,.024,timber);box(root,0,.93,-.284,.019,.16,.021,edge);
 // Closed gable cap, front and rear triangles, with two solid roof slopes.
 let w=.23,z=.20,y=1.455,rise=.17;
 let vertices=[-w,y,-z,w,y,-z,0,y+rise,-z,-w,y,z,w,y,z,0,y+rise,z];
 let geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex([0,2,1,3,4,5,0,1,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,4]);geo.computeVertexNormals();let cap=new THREE.Mesh(geo,roof);cap.castShadow=true;cap.receiveShadow=true;root.add(cap);
 for(let side of [-1,1]){let o=box(root,side*w/2,y+rise/2,0,Math.hypot(w,rise)+.055,.035,z*2+.06,roof);o.rotation.z=-side*Math.atan2(rise,w);}
 beam(root,[0,y+rise,-z-.025],[0,y+rise,z+.025],.038,.035,edge);
 // Forward axle keeps the rotating sail frame clear of the roof and tower.
 let hubY=1.30,forward=.275;beam(root,[0,hubY,-.10],[0,hubY,forward+.06],.082,.082,timber);
 let rotor=new THREE.Group();rotor.position.set(0,hubY,forward);rotor.rotation.z=-(scale<1?60:52)*Math.PI/180;rotor.scale.setScalar(scale<1?1:.9);root.add(rotor);
 for(let k=0;k<4;k++){let wing=new THREE.Group();wing.rotation.z=k*Math.PI/2;rotor.add(wing);beam(wing,[0,0,0],[0,.80,0],.044,.035,timber);
  // Two rails, nine transverse slats: all solid timber and open gaps.
  for(let x of [-.048,.105])beam(wing,[x,.27,.012],[x,.80,.012],.021,.027,rail);
  for(let j=0;j<9;j++)box(wing,.028,.29+j*.061,.02,.174,.052,.022,sail);
 }
 let hub=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.12,8),timber);hub.rotation.x=Math.PI/2;hub.position.set(0,hubY,forward+.015);hub.castShadow=true;root.add(hub);
 return root;}
export function build(ctx){let g=new THREE.Group();g.name='east-windmills';g.add(mill(ctx,[1169,387],.73,.50),mill(ctx,[1233.5,372],1,.28));return g;}
