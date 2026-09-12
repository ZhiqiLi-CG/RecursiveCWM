import {THREE,mat,box} from '../scene/common.js';
// Dimensions fitted from roof/eave/ground landmarks in the locked root projection.
const forms={
 barn:{cx:2.321533,cz:-1.873564,yaw:-1.558246,w:.704741,d:.794347,eave:.439479,rise:.282106},
 shed:{cx:2.615538,cz:.078398,yaw:-.285455,w:.698637,d:.677364,eave:.419361,rise:.229477},
 ivory:{cx:4.103784,cz:.058710,yaw:.092135,w:.570311,d:.663344,eave:.369515,rise:.256291}
};
function beam(g,a,b,w,c){const start=new THREE.Vector3(...a),v=new THREE.Vector3(...b).sub(start);const m=box(g,0,0,0,w,v.length(),w,c);m.position.copy(start.addScaledVector(v,.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function gable(g,z,w,h,r,c){const s=new THREE.Shape();s.moveTo(-w/2,h);s.lineTo(w/2,h);s.lineTo(0,h+r);s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.034,bevelEnabled:false}),mat(c));m.position.z=z-.017;m.castShadow=true;m.receiveShadow=true;g.add(m);}
function roof(g,a,type){const {w,d,eave:h,rise:r}=a;const half=w/2+.045,len=d+.11,slant=Math.hypot(half,r),angle=Math.atan2(r,half);
 for(const side of [-1,1]){let c=type==='barn'?'#302c2c':type==='shed'?(side<0?'#a18b81':'#797779'):(side<0?'#fff7dd':'#77695c');const rg=new THREE.Group();rg.position.set(side*half/2,h+r/2,0);rg.rotation.z=-side*angle;g.add(rg);box(rg,0,0,0,slant,.036,len,c);
 if(type==='barn'||type==='shed'){
 const cols=type==='barn'?13:7,rows=type==='barn'?5:5;
 const palette=type==='barn'?['#544747','#584a48','#5b4d49','#514544','#594b46']:['#9b857c','#9e887e','#97837c','#a08c82','#998780'];
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
 const xx=-slant/2+(row+.5)*slant/rows,zz=-len/2+(col+.5)*len/cols;
 const upper=side*xx<-.045;
 let color=type==='barn'&&upper?['#202428','#29292d','#302b2d'][(row+col*3)%3]:type==='shed'&&side>0?['#777477','#7b7779','#7d797b','#797578','#7c7879'][(row+col)%5]:palette[(row*7+col*3)%palette.length];
 const tile=box(rg,xx,.020,zz,slant/rows-.0008,.004,len/cols-.001,color);tile.castShadow=false;tile.receiveShadow=false;
 }
 }else{
 // Raised cloth seams follow the slope; the canvas itself is a substantial enclosed slab.
 for(let k=1;k<5;k++){const seam=box(rg,0,.021,-len/2+k*len/5,slant,.002,.0025,side<0?'#e5dec9':'#827363');seam.castShadow=false;seam.receiveShadow=false;}
 }
 }
 beam(g,[0,h+r+.025,-len/2-.009],[0,h+r+.025,len/2+.009],type==='barn'?.028:.018,type==='ivory'?'#8c7861':type==='shed'?'#82756d':'#2b2526');
}
function building(parent,a,type){const g=new THREE.Group();g.name='farmyard-'+type;g.position.set(a.cx,.06,a.cz);g.rotation.y=a.yaw;parent.add(g);const {w,d,eave:h,rise:r}=a;const frame=type==='barn'?'#725130':type==='shed'?'#625035':'#62503b';
 const wall=type==='barn'?'#ac7847':type==='shed'?'#7f7561':'#927552';
 box(g,0,.018,0,w,.036,d,'#4b4638');
 // Substantial walls on the two long sides; independent board relief on all four faces.
 for(const side of [-1,1]){
 const sideWall=type==='barn'?'#2d3026':type==='shed'?'#976132':wall;const sideFrame=type==='barn'?'#343222':frame;
 box(g,side*(w/2-.018),h/2,0,.036,h,d,sideWall);
 const n=type==='barn'?10:8;
 for(let j=0;j<n;j++)box(g,side*(w/2+.001),h/2,-d/2+(j+.5)*d/n,.012,h-.025,d/n-.008,[sideWall,type==='barn'?'#33382b':type==='shed'?'#996f43':'#9a805b',type==='barn'?'#303227':type==='shed'?'#916237':'#886e4e'][j%3]);
 for(let j=0;j<4;j++)box(g,side*(w/2+.017),h/2,-d/2+j*d/3,.024,h+.008,.024,sideFrame);
 for(let y of [.05,h-.012])box(g,side*(w/2+.024),y,0,.028,.028,d+.035,sideFrame);
 if(type!=='shed')for(const z of [-d*.24,d*.24]){
 box(g,side*(w/2+.02),h*.48,z,.015,h*.27,d*.18,'#18170f');
 for(const zz of [z-d*.095,z+d*.095])box(g,side*(w/2+.029),h*.48,zz,.020,h*.30,.014,frame);
 box(g,side*(w/2+.031),h*.33,z,.03,.019,d*.22,frame);
 }
 }
 for(const end of [-1,1]){
 const z=end*d/2,doorW=type==='shed'?.235:type==='barn'?.245:.16,doorH=h*.73;
 // Actual doorway cut into the front wall, dark interior and solid floor behind it.
 if(end===1){for(const side of [-1,1])box(g,side*(w+doorW)/4,h/2,z,(w-doorW)/2,h,.036,wall);box(g,0,(h+doorH)/2,z,doorW,h-doorH,.036,wall);box(g,0,doorH/2,z-end*.023,doorW,doorH,.014,new THREE.MeshBasicMaterial({color:'#100f0c'}));}
 else box(g,0,h/2,z,w,h,.036,wall);
 const n=type==='shed'?10:9;
 for(let j=0;j<n;j++){const x=-w/2+(j+.5)*w/n;if(end===1&&Math.abs(x)<doorW/2)continue;box(g,x,h/2,z+end*.023,w/n-.006,h-.02,.014,[wall,type==='shed'?'#86816c':type==='barn'?'#af7d50':'#987d5b',type==='shed'?'#787562':type==='barn'?'#a87343':'#8d7352'][j%3]);}
 gable(g,z,w,h,r,wall);
 // Horizontal gable boards are clipped analytically to the triangular outline.
 for(let y=h+.025;y<h+r-.015;y+=.068){const gw=w*(1-(y-h)/r);box(g,0,y,z+end*.022,gw,.047,.008,type==='ivory'?'#513d2c':type==='shed'?'#7b6749':'#b38150');}
 for(const x of [-w/2,w/2])box(g,x,h/2,z+end*.038,.031,h+.012,.031,frame);
 for(const y of [.035,h])box(g,0,y,z+end*.035,w+.045,.039,.033,frame);
 beam(g,[-w/2,h,z+end*.025],[0,h+r,z+end*.025],.03,frame);beam(g,[w/2,h,z+end*.025],[0,h+r,z+end*.025],.03,frame);
 if(end===1){for(const x of [-doorW/2,doorW/2])box(g,x,doorH/2,z+.044,.028,doorH+.014,.035,frame);box(g,0,doorH,z+.043,doorW+.04,.029,.034,frame);
 if(type==='barn'){box(g,0,doorH/2,z+.005,doorW-.035,doorH-.02,.028,'#8b4c18');for(let x of [-.065,0,.065])box(g,x,doorH/2,z+.023,.008,doorH-.026,.01,'#a46124');for(let y of [.065,doorH-.045])box(g,0,y,z+.030,doorW-.016,.024,.013,'#59371b');}
 }
 else{box(g,0,h*.32,z-.025,w*.27,h*.60,.023,'#463422');for(let y of [h*.12,h*.50])box(g,0,y,z-.042,w*.28,.02,.012,frame);}
 }
 roof(g,a,type);return g;
}
function ellipsoid(g,x,y,z,sx,sy,sz,c,detail=0){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1,detail),mat(c));m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function sheep(parent,ctx,x,y,angle,scale,color){const g=new THREE.Group();g.name='sheep-'+x;g.position.copy(ctx.pixelToWorld(x,y,.06));g.rotation.y=angle;g.scale.setScalar(scale);parent.add(g);
 ellipsoid(g,0,.086,0,.091,.067,.057,color,1);
 for(let sx of [-1,1])for(let sz of [-1,1])box(g,sx*.055,.027,sz*.032,.014,.054,.014,'#47453b');
 ellipsoid(g,.084,.079,0,.033,.033,.027,'#b9b6a0');ellipsoid(g,.106,.065,0,.018,.019,.021,'#6d6b5c');
 for(let s of [-1,1])ellipsoid(g,.078,.108,s*.030,.020,.010,.012,'#aaa58f');
 ellipsoid(g,-.086,.084,0,.018,.025,.020,color);
}
export function build(ctx){const g=new THREE.Group();g.name='east-farmyard';for(const type of ['barn','shed','ivory'])building(g,forms[type],type);
 const flock=[[735.5,297.6,.1,1.04,'#909c9e'],[740.1,301.0,.65,.96,'#d5d3ba'],[741.0,292.7,-.25,1.04,'#e4dcc3'],[746.4,305.2,1.35,1.00,'#dcdcc9'],[749.3,297.1,-.45,.95,'#a0a9a8'],[752.4,303,1.2,1.03,'#e1dec8'],[754.2,294.4,1.0,.91,'#d2d4c5'],[757.4,290.4,1.3,1.03,'#dfdecb'],[758.4,307.2,1.45,.98,'#bdccbd'],[767.7,292.6,.15,1.02,'#99a7ad'],[775.4,298.4,-.35,1.03,'#d1d4c8']];
 for(const args of flock)sheep(g,ctx,...args);return g;}
