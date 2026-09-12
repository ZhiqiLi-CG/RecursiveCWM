import {THREE,mat} from '../scene/common.js';
// Measured base and tip-height pixels in the 3x inspection window. Converted to ROOT
// anchors before unprojection; every tree is a closed, fully round solid.
const measured=[
[80,63,48],[123,75,51],[145,71,31],[166,90,41],[195,83,52],[227,103,63],
[118,122,57],[135,128,55],[152,100,42],[190,136,43],[99,153,49],[77,179,57],[55,198,62],[121,169,32],
[251,143,61],[305,103,32],[326,158,66],[369,128,39],[389,150,29],[438,125,63],[472,104,61],[507,125,77],[523,145,72],[549,146,81],[602,121,46],
[188,176,61],[204,198,65],[195,224,46],[235,218,68],[231,263,84],[266,206,63],[279,224,55],[309,206,63],[315,167,54],[336,189,58],[348,249,87],[320,280,100],
[370,213,63],[386,258,69],[411,210,74],[438,231,61],[452,256,45],[485,177,70],[455,144,31],[501,231,28],[533,195,58],[551,162,25],[565,239,75],
[595,177,61],[624,196,69],[610,268,82],[654,257,67],[674,181,50],[695,148,22],[707,213,58],[727,234,82],[747,144,49],[767,129,33],[792,178,39],[756,206,60],
[179,197,49],[218,180,57],[288,189,41],[334,246,79],[358,247,85],[423,244,45],
[107,248,31],[132,234,16],[281,326,69],[274,350,95],[304,337,61],[346,339,24],[356,312,56],[380,286,53],[382,351,39],[414,338,85],[407,363,28],[448,314,64],[466,357,63],[491,309,41],[500,353,20],
[548,270,35],[566,272,20],[580,305,56],[577,344,53],[609,328,50],[638,342,47],[656,344,77],[625,387,56],[646,390,88],[673,421,78],[699,350,79],[701,297,93],[718,304,42],[748,323,70],[773,257,43],
[812,233,44],[831,267,78],[846,278,45],[896,234,57],[911,254,59],[954,278,51],[976,264,52],
[793,304,31],[831,336,60],[869,319,35],[891,353,70],[918,323,64],[980,332,73],[967,369,43],[984,381,74],[961,431,70],
[742,378,43],[725,362,24],[811,384,66],[846,391,43],[878,403,60],[900,384,72],
[415,398,25],[443,430,64],[477,466,79],[488,385,45],[512,456,35],[508,514,68],[536,484,64],[553,434,80],[527,395,25],
[618,418,48],[628,466,66],[620,492,39],[698,435,51],[715,463,52],[737,495,75],[768,451,49],[784,506,79],[810,508,82],[824,466,78],[854,432,34],[886,474,74],
[402,492,23],[444,508,48],[545,572,65],[514,579,29],[578,595,54],[634,616,86],[659,616,60],[687,578,27],[640,531,55],[670,530,63],[690,546,49],[717,548,58]
];
const palette=['#518f21','#589725','#629e2b','#49851c','#579322','#69a331'];
const foliage=palette.map(c=>mat(c,{flatShading:false}));
const bark=mat('#5d391b',{flatShading:true});
function random(seed){let t=seed+0x6d2b79f5;return()=>{t+=0x6d2b79f5;let x=Math.imul(t^t>>>15,1|t);x^=x+Math.imul(x^x>>>7,61|x);return((x^x>>>14)>>>0)/4294967296;};}
function crown(h,r,seed){const rand=random(seed),n=9,phase=rand()*6.283;
 const profile=[[.085,.26],[.15,1],[.33,.76],[.36,.79],[.50,.55],[.53,.59],[.68,.35],[.70,.38],[.85,.15],[.87,.17],[1,0]];
 const pos=[],idx=[];let radial=Array.from({length:n},()=>.94+rand()*.12);
 for(let k=0;k<profile.length;k++){const [y,radius]=profile[k];for(let j=0;j<n;j++){const a=phase+j/n*Math.PI*2;let rr=r*radius*radial[j]*(.98+rand()*.04);pos.push(Math.cos(a)*rr+(y*y*.028*h*Math.sin(seed)),y*h+(k>0&&k<10?(rand()-.5)*.010*h:0),Math.sin(a)*rr);}}
 for(let k=0;k<profile.length-1;k++)for(let j=0;j<n;j++){const a=k*n+j,b=k*n+(j+1)%n,c=a+n,d=b+n;idx.push(a,c,b,b,c,d);}
 const b=pos.length/3;pos.push(0,.085*h,0);for(let j=0;j<n;j++)idx.push(b,j,(j+1)%n);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();return geo;
}
export function build(ctx){const group=new THREE.Group();group.name='foreground-pine-grove';let count=0;
 measured.forEach(([ix,iy,ph],i)=>{const rootX=607+ix/3,rootY=480+iy/3,p=ctx.pixelToWorld(rootX,rootY,0);if(Math.abs(p.x)>12.4333032975||Math.abs(p.z)>10)return;
 p.y=(ctx.heightAt?ctx.heightAt(p.x,p.z):.035)-.025;
 // Solve actual height under the immutable perspective camera, rather than assume
 // a constant screen scale over this deep sloping projection.
 let low=.02,high=3;const base=ctx.worldToPixel(p)[1];for(let j=0;j<24;j++){const mid=(low+high)/2,tip=ctx.worldToPixel(p.clone().add(new THREE.Vector3(0,mid,0)))[1];if(base-tip<ph/3)low=mid;else high=mid;}const h=(low+high)/2;
 const rand=random(i*53+61),r=h*(.195+rand()*.038),tree=new THREE.Group();tree.name=`pine-${i+1}`;tree.position.copy(p);tree.rotation.y=rand()*Math.PI*2;
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.018*h,.031*h,h*.68,7),bark);trunk.position.y=.31*h;trunk.castShadow=true;trunk.receiveShadow=true;tree.add(trunk);
 const needles=new THREE.Mesh(crown(h,r,i*51+7),foliage[i%foliage.length]);needles.castShadow=true;needles.receiveShadow=true;tree.add(needles);
 tree.userData={rootPixel:[rootX,rootY],height:h};group.add(tree);count++;
 });group.userData={count,seed:61,rootSample:'ctx.heightAt(x,z)-0.025',completeVolume:true};return group;}
