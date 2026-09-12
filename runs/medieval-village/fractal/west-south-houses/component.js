import {THREE,mat,box} from '../scene/common.js';
const timber=mat('#32261e'), plaster=mat('#c4b79b'), stone=mat('#626863');
function beam(g,a,b,r,m=timber){let v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));let mesh=new THREE.Mesh(new THREE.BoxGeometry(r,v.length(),r),m);mesh.position.copy(new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());mesh.castShadow=true;g.add(mesh);return mesh;}
function prism(g,pts,depth,m){let shape=new THREE.Shape();pts.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();let geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false});geo.translate(0,0,-depth/2);let mesh=new THREE.Mesh(geo,m);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
function roofPanel(g,w,rise,len,eave,sign,m,thick){const slope=Math.hypot(w/2,rise);let mesh=box(g,sign*w/4,eave+rise/2,0,slope,thick,len,m);mesh.rotation.z=-sign*Math.atan2(rise,w/2);return mesh;}
function cottage(ctx,parent,o){const g=new THREE.Group();g.name=o.id;const root=p=>[262+p[0]/4,449+p[1]/4];let a=ctx.pixelToWorld(...root(o.ridge[0]),o.top),b=ctx.pixelToWorld(...root(o.ridge[1]),o.top);let length=a.distanceTo(b),mid=a.clone().add(b).multiplyScalar(.5);g.position.set(mid.x,0,mid.z);g.rotation.y=Math.atan2(a.x-b.x,a.z-b.z);parent.add(g);let w=o.width,d=length-.09,e=o.eave,r=o.top-e;
box(g,0,.085,0,w-.08,.24,d-.025,stone);
box(g,0,(e+.16)/2,0,w-.09,e-.16,d-.025,plaster);
prism(g,[[-w/2+.045,e],[0,o.top-.035],[w/2-.045,e]],d-.03,plaster);
// Stone courses wrap all four walls and extend under the terrain surface.
for(let face=0;face<4;face++){let side=new THREE.Group();side.rotation.y=face*Math.PI/2;g.add(side);let span=face%2?d-.025:w-.08,deep=face%2?w-.08:d-.025;
 for(let row=0;row<2;row++)for(let i=0;i<5;i++){let xx=-span/2+(i+.5)*span/5;box(side,xx,.035+row*.115,deep/2+.006,span/5-.016,.095,.026,mat(['#737c79','#5c6869','#8b8d7c'][(i+row+face)%3]));}
 for(let x of [-span/2,0,span/2])box(side,x,(e+.20)/2,deep/2+.018,.041,e-.20,.044,timber);
 for(let yy of [.235,e-.02])box(side,0,yy,deep/2+.024,span+.028,.045,.05,timber);
 let door=face===0||face===2; if(door){box(side,0,.30,deep/2+.028,.17,.22,.026,mat('#42372b'));for(let x of [-.085,.085])box(side,x,.31,deep/2+.049,.023,.25,.022,timber);box(side,0,.445,deep/2+.05,.20,.025,.035,timber);box(side,0,.052,deep/2+.065,.21,.065,.105,'#8a8170');}
 for(let xx of (door?[-span*.31,span*.31]:[-span*.27,span*.27])){let yy=e-.14;box(side,xx,yy,deep/2+.028,.105,.125,.025,timber);box(side,xx,yy,deep/2+.043,.065,.085,.014,'#555c59');box(side,xx,yy,deep/2+.054,.012,.085,.014,plaster);box(side,xx,yy-.068,deep/2+.07,.16,.025,.065,timber);}
 if(!door)for(let sign of [-1,1])beam(side,[sign*span*.44,.255,deep/2+.045],[sign*span*.08,e-.05,deep/2+.045],.027);
}
for(let sign of [-1,1]){let zz=sign*(d/2+.002);beam(g,[-w/2+.04,e,zz],[0,o.top-.02,zz],.04);beam(g,[0,o.top-.02,zz],[w/2-.04,e,zz],.04);beam(g,[0,e,zz],[0,o.top-.02,zz],.037);for(let x of [-w*.23,w*.23]){let yy=o.top-Math.abs(x)/(w/2)*r;beam(g,[x,e,zz],[x,yy-.015,zz],.027);}if(o.id==='red-gable'){beam(g,[-w*.38,e,zz],[0,e+r*.70,zz],.03);beam(g,[w*.38,e,zz],[0,e+r*.70,zz],.03);}}
const thick=o.thatch?.075:.035;for(let sign of [-1,1]){const slopeColor=o.thatch?(sign<0?'#ad8e70':'#79766f'):o.color,roofm=mat(slopeColor);roofPanel(g,w+.14,r+.025,length+.075,e-.015,sign,roofm,thick);
// Individual low relief tile/shingle courses follow the actual pitched surface.
let rows=o.thatch?5:8,cols=o.thatch?24:9;for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){let t=(row+.5)/rows,x=sign*t*(w+.14)/2,y=e-.015+(r+.025)*(1-t)+thick/(2*Math.cos(Math.atan2(r+.025,(w+.14)/2)))+.003,z=-length/2+(col+.5)*length/cols;let shade=(row*13+col*7+sign*3+60)%11;let c=new THREE.Color(slopeColor).multiplyScalar(.90+shade*.017);let tile=box(g,x,y,z,Math.hypot((w+.14)/2,r+.025)/rows*.98,.003,length/cols*.94,mat(c));tile.rotation.z=-sign*Math.atan2(r+.025,(w+.14)/2);}
}
beam(g,[0,o.top+.019,-length/2-.035],[0,o.top+.019,length/2+.035],o.thatch?.066:.04,mat(o.thatch?'#8c8170':'#5c3828'));
if(o.chimney){let [x,z,h]=o.chimney;let yy=e+r*(1-Math.abs(x)/(w/2));box(g,x,yy+h/2-.06,z,.12,h+.12,.14,'#83847d');for(let t=0;t<3;t++)box(g,x,yy+h*t/3,z,.125,.016,.146,'#6d6e69');box(g,x,yy+h,z,.15,.044,.17,'#96938a');box(g,x,yy+h+.025,z,.084,.012,.10,'#3a3934');}
return g;}
export function build(ctx){const group=new THREE.Group();group.name='west-south-houses';for(const o of [
{id:'rust-tile',ridge:[[53,65],[148,21]],top:.80,eave:.50,width:.60,color:'#542c22',chimney:[-.17,.05,.16]},
{id:'brown-tile',ridge:[[145,159],[246,103]],top:.78,eave:.49,width:.61,color:'#302218',chimney:[.15,-.10,.25]},
{id:'red-gable',ridge:[[288,250],[348,166]],top:.91,eave:.60,width:.63,color:'#552b2b',chimney:[-.24,-.09,.22]},
{id:'pale-thatch',ridge:[[494,316],[464,228]],top:.77,eave:.52,width:.60,color:'#8a8071',thatch:true,chimney:[-.19,-.20,.19]}
])cottage(ctx,group,o);return group;}
