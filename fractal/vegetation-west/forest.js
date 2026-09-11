import {THREE,mat} from '../scene/common.js';
// Measured in the supplied 3x crop: root x, root y, projected tip-to-root height.
// Converted to ROOT-image anchors before any camera mapping.
const stands={
 ridge:[
 [370,232,20],[379,235,23],[408,218,87],[430,237,85],
 [514,183,77],[530,198,79],[541,159,68],[557,144,76],
 [589,189,79],[602,193,88],[615,143,76],[626,120,76],
 [645,156,78],[660,131,90],[673,143,88],[686,175,66],
 [703,104,78],[722,83,70],[740,134,85],[751,95,69],[790,79,79],[820,143,63],[848,118,34],
 [570,189,22],[623,179,22],[703,174,57],[713,203,51],[730,198,46],[754,201,43],[780,241,88],[836,230,22]],
 core:[
 [154,335,77],[167,324,52],[200,302,90],[218,339,76],[233,301,52],
 [250,283,53],[266,309,49],[279,275,68],[300,246,29],[314,257,60],[326,247,61],[340,264,77],
 [256,352,48],[278,336,55],[290,316,51],[310,361,82],[330,347,66],[341,374,70],[352,350,80],
 [363,302,47],[381,337,75],[398,370,62],[406,398,93],[430,327,99],[449,300,91],[465,300,107],
 [483,271,58],[498,257,65],[511,278,82],[533,253,42],[545,269,64],[569,302,84],[594,310,68],[611,260,63],[625,308,73],
 [646,350,91],[664,313,77],[681,328,87],[706,240,63],[730,276,52],[754,247,41],[786,300,62],[812,339,62],
 [712,383,80],[679,378,58],[690,350,49],[657,325,56],[594,376,58],
 [508,331,58],[526,347,81],[547,326,44],[565,354,57],
 [473,399,73],[487,423,61],[500,417,42],[519,372,42],[531,371,56],[550,370,29],
 [229,374,47],[242,405,33],[275,381,61],[292,409,74],[313,403,62],[371,380,56],[357,365,62]
 ],
 fringe:[
 [106,340,26],[120,359,20],[62,442,67],[82,424,44],[97,453,52],[115,469,54],[142,450,63],[164,432,80],[181,433,44],
 [29,517,51],[41,523,57],[56,522,56],[68,531,65],[95,520,81],[113,495,47],[145,501,61],[156,486,70],[177,487,41],
 [267,455,50],[287,460,65],[302,460,58],[325,480,50],[343,453,67],[375,441,37],
 [246,443,55],[259,509,78],[280,516,58],
 [156,559,66],[200,589,59],[213,570,43],[227,551,68],[252,607,53],[309,589,51],[339,594,31],
 [346,526,39],[361,544,52],[374,550,53],[389,553,65],[405,578,73],[396,502,59],[416,509,65],[438,444,68],[457,457,72],
 [457,528,48],[480,518,58],[495,472,52],[525,455,44]
 ],
 fingers:[
 [699,438,61],[724,447,78],[747,468,43],[768,491,58],
 [637,523,53],[655,478,55],[670,529,65],[687,504,55],[699,528,54],[716,556,70],[737,545,46],[753,575,61],[774,538,85],[806,533,43],[813,512,49],
 [627,552,31],[721,623,75],[741,627,40],[826,576,50],[886,511,66],[884,550,40],[896,579,55],[880,592,47]
 ]};
const foliage=['#5b8e20','#659925','#6b9d25','#56881d','#75a72c','#609322'].map(c=>mat(c,{flatShading:false}));
const wood=mat('#544026',{flatShading:true});
function random(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function tree(h,r,seed){const rand=random(seed),g=new THREE.Group();
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(h*.011,h*.026,h*.92,6),wood);trunk.position.y=h*.41;g.add(trunk);
 const sides=9,profile=[[.075,.27],[.12,.73],[.19,1],[.34,.76],[.36,.84],[.49,.57],[.51,.64],[.63,.41],[.65,.46],[.76,.26],[.78,.30],[.90,.13],[1,0]];
 const points=[],indices=[],phase=rand()*6.28;
 const angular=Array.from({length:sides},()=>.94+rand()*.12);
 const driftX=(rand()-.5)*h*.06,driftZ=(rand()-.5)*h*.06;
 profile.forEach(([y,rad],j)=>{for(let k=0;k<sides;k++){const a=phase+k*Math.PI*2/sides;const rr=r*rad*angular[k]*(.985+rand()*.03);points.push(Math.cos(a)*rr+driftX*y,y*h+(j>0&&j<profile.length-1?(rand()-.5)*h*.006:0),Math.sin(a)*rr+driftZ*y);}});
 for(let j=0;j<profile.length-1;j++)for(let k=0;k<sides;k++){const a=j*sides+k,b=j*sides+(k+1)%sides,c=a+sides,d=b+sides;indices.push(a,c,b,b,c,d);}
 // The skirt is closed even in a view from below.
 points.push(0,h*.075,0);const center=points.length/3-1;for(let k=0;k<sides;k++)indices.push(center,k,(k+1)%sides);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geo.setIndex(indices);geo.computeVertexNormals();
 const crown=new THREE.Mesh(geo,foliage[seed%foliage.length]);g.add(crown);
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;
}
export function build(ctx){const g=new THREE.Group();g.name='western-conifer-grove';let index=0;const counts={};
 for(const [stand,anchors] of Object.entries(stands))for(const [cx,cy,pixelHeight] of anchors){
  const rootX=196+cx/3,rootY=195+cy/3;if(rootX>=493||rootY>=430)continue;
  const p=ctx.pixelToWorld(rootX,rootY,0);
  // A few measured edge roots straddle the antialiased tile boundary: keep the whole stem supported.
  p.x=THREE.MathUtils.clamp(p.x,-12.4333032975+.04,12.4333032975-.04);p.z=THREE.MathUtils.clamp(p.z,-9.96,9.96);
  const ground=ctx.heightAt?ctx.heightAt(p.x,p.z):.035;p.y=(Number.isFinite(ground)?ground:.035)-.025;
  const basePixel=ctx.worldToPixel(p),unitPixel=ctx.worldToPixel(p.clone().add(new THREE.Vector3(0,1,0)));
  const h=(pixelHeight/3)/(basePixel[1]-unitPixel[1]);
  const rand=random(1451+index*19);const radius=h*(.16+rand()*.045);
  const t=tree(h,radius,221+index*17);t.position.copy(p);t.name=stand+'-conifer-'+index;t.userData={rootPixel:[rootX,rootY],height:h};g.add(t);index++;counts[stand]=(counts[stand]||0)+1;
 }
 g.userData.count=index;g.userData.stands=counts;return g;
}
