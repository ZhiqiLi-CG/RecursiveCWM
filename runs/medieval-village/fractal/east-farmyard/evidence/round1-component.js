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
 for(const side of [-1,1]){let c=type==='barn'?'#302c2c':type==='shed'?(side<0?'#887871':'#79777a'):(side<0?'#e6dcbd':'#77695c');const rg=new THREE.Group();rg.position.set(side*half/2,h+r/2,0);rg.rotation.z=-side*angle;g.add(rg);box(rg,0,0,0,slant,.036,len,c);
 if(type==='barn'||type==='shed'){
 const cols=type==='barn'?13:10,rows=type==='barn'?5:7;
 const palette=type==='barn'?['#3d3030','#453634','#514039','#342d2e','#59473f']:['#8f7d74','#95857c','#817675','#9b8980','#8c7f7b'];
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
 const xx=-slant/2+(row+.5)*slant/rows,zz=-len/2+(col+.5)*len/cols;
 const upper=side*xx<-.045;
 let color=type==='barn'&&upper?['#202428','#29292d','#302b2d'][(row+col*3)%3]:palette[(row*7+col*3)%palette.length];
 box(rg,xx,.020+(col%3)*.0007,zz,slant/rows-.002,.006,len/cols-.002,color);
 }
 }else{
 // Raised cloth seams follow the slope; the canvas itself is a substantial enclosed slab.
 for(let k=1;k<5;k++)box(rg,0,.021,-len/2+k*len/5,slant,.002,.0025,side<0?'#d9cfb2':'#827363');
 }
 }
 beam(g,[0,h+r+.025,-len/2-.009],[0,h+r+.025,len/2+.009],type==='barn'?.028:.018,type==='ivory'?'#8c7861':type==='shed'?'#82756d':'#2b2526');
}
function building(parent,a,type){const g=new THREE.Group();g.name='farmyard-'+type;g.position.set(a.cx,.06,a.cz);g.rotation.y=a.yaw;parent.add(g);const {w,d,eave:h,rise:r}=a;const frame=type==='barn'?'#36271b':type==='shed'?'#483221':'#4b3422';
 const wall=type==='barn'?'#71441e':type==='shed'?'#71604a':'#806347';
 box(g,0,.018,0,w,.036,d,'#4b4638');
 // Substantial walls on the two long sides; independent board relief on all four faces.
 for(const side of [-1,1]){
 box(g,side*(w/2-.018),h/2,0,.036,h,d,wall);
 const n=type==='barn'?10:8;
 for(let j=0;j<n;j++)box(g,side*(w/2+.001),h/2,-d/2+(j+.5)*d/n,.012,h-.025,d/n-.008,[wall,type==='barn'?'#79512b':'#7a644b',type==='barn'?'#694322':'#695640'][j%3]);
 for(let j=0;j<4;j++)box(g,side*(w/2+.017),h/2,-d/2+j*d/3,.026,h+.008,.026,frame);
 for(let y of [.05,h-.012])box(g,side*(w/2+.024),y,0,.031,.035,d+.035,frame);
 if(type!=='shed')for(const z of [-d*.24,d*.24]){
 box(g,side*(w/2+.02),h*.48,z,.015,h*.27,d*.18,'#18170f');
 for(const zz of [z-d*.095,z+d*.095])box(g,side*(w/2+.029),h*.48,zz,.020,h*.30,.014,frame);
 box(g,side*(w/2+.031),h*.33,z,.03,.019,d*.22,frame);
 }
 }
 for(const end of [-1,1]){
 const z=end*d/2,doorW=type==='shed'?.235:type==='barn'?.245:.16,doorH=h*.73;
 // Actual doorway cut into the front wall, dark interior and solid floor behind it.
 if(end===1){for(const side of [-1,1])box(g,side*(w+doorW)/4,h/2,z,(w-doorW)/2,h,.036,wall);box(g,0,(h+doorH)/2,z,doorW,h-doorH,.036,wall);box(g,0,doorH/2,z-end*.09,doorW,doorH,.014,'#16150f');}
 else box(g,0,h/2,z,w,h,.036,wall);
 const n=type==='shed'?10:9;
 for(let j=0;j<n;j++){const x=-w/2+(j+.5)*w/n;if(end===1&&Math.abs(x)<doorW/2)continue;box(g,x,h/2,z+end*.023,w/n-.006,h-.02,.014,[wall,type==='shed'?'#7b705b':'#906032',type==='shed'?'#625643':'#855324'][j%3]);}
 gable(g,z,w,h,r,wall);
 // Horizontal gable boards are clipped analytically to the triangular outline.
 for(let y=h+.025;y<h+r-.015;y+=.052){const gw=w*(1-(y-h)/r);box(g,0,y,z+end*.024,gw,.037,.014,type==='ivory'?'#513d2c':type==='shed'?'#6d5538':'#98632d');}
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
 ellipsoid(g,0,.111,0,.080,.066,.047,color,1);
 for(let sx of [-1,1])for(let sz of [-1,1])box(g,sx*.049,.041,sz*.028,.016,.082,.016,'#47453b');
 ellipsoid(g,.076,.101,0,.033,.037,.027,'#b9b6a0');ellipsoid(g,.099,.088,0,.018,.023,.021,'#6d6b5c');
 for(let s of [-1,1])ellipsoid(g,.073,.132,s*.030,.020,.010,.012,'#aaa58f');
 ellipsoid(g,-.078,.104,0,.018,.025,.020,color);
}
export function build(ctx){const g=new THREE.Group();g.name='east-farmyard';for(const type of ['barn','shed','ivory'])building(g,forms[type],type);
 const flock=[[735.5,297.6,.1,1.04,'#737e81'],[740.1,301.0,.65,.96,'#d5d3ba'],[741.0,292.7,-.25,1.04,'#e4dcc3'],[746.4,305.2,1.35,1.00,'#dcdcc9'],[749.3,297.1,-.45,.95,'#899495'],[752.4,303,1.2,1.03,'#e1dec8'],[754.2,294.4,1.0,.91,'#d2d4c5'],[757.4,290.4,1.3,1.03,'#dfdecb'],[758.4,307.2,1.45,.98,'#bdccbd'],[767.7,292.6,.15,1.02,'#839097'],[775.4,298.4,-.35,1.03,'#d1d4c8']];
 for(const args of flock)sheep(g,ctx,...args);return g;}
