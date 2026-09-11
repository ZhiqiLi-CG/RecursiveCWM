import {THREE,mat} from '../scene/common.js';

// All anchors are measured ROOT BASE pixels, never crop coordinates or tree tips.
// Heights are world units. Gaps deliberately follow the rivers, road, and lake.
const regions = {
 sourceIslands: [
 [503,197,.82],[507,207,.64],[514,195,.71],[518,206,.95],[523,192,.79],
 [529,183,.83],[536,191,.96],[541,206,.97],[535,213,.60],[544,217,.67],
 [547,188,1.04],[554,194,.96],[557,204,.92],[560,184,1.04],[567,194,.90],
 [572,194,.84],[569,215,.70],[564,223,.88],[571,229,.80],[559,222,.78],
 [555,234,.80],[567,239,.75],[579,244,.65],[549,214,.58],
 [588,265,.64],[586,254,.73],[579,265,.48],[574,271,.27],
 [551,284,.74],[554,293,.66],[563,295,.81],[568,287,.27],[577,287,.33],
 [574,298,.69],[582,286,.31],[588,289,.32],[594,295,.41],
 [609,208,.71],[613,217,.96],[620,204,.87],[630,205,.86],[634,218,1.02],
 [637,225,1.02],[630,222,.70],[618,235,.27],
 ],
 cliffFront: [
 [647,247,1.02],[652,239,.79],[645,260,.76],[637,269,.69],[630,265,.66],
 [625,268,.87],[661,235,.69],[670,239,.81],[677,244,.54],[673,258,.90],
 [661,261,.79],[653,263,.60],[661,274,.95],[681,265,.83],[684,250,1.07],
 [694,242,1.20],[698,263,1.14],[710,264,.33],[711,274,.72],[716,266,.59],
 [722,238,.72],[730,240,.79],[737,239,.85],[744,242,.94],[750,245,.81],
 [760,250,.87],[764,239,.87],[769,247,.93],[773,253,.77],[780,248,.95],
 [777,263,1.09],[788,253,.88],[789,270,.86],[795,267,.77],[802,272,.59],
 [807,277,.72],[813,268,.86],[825,277,.62],[838,275,.76],[846,275,.81],
 [850,263,.88],[854,259,.86],[860,250,.99],[865,251,.74],[870,257,.70],
 [877,246,.52],[885,251,.94],[891,257,1.04],[898,255,.84],[905,254,.71],
 [918,260,.83],[936,260,.65],[942,266,.84],[945,258,.94],[954,270,1.00],
 [952,240,.83],[963,246,.80],[953,235,.83],
 [730,257,.44],[673,272,.32],[681,276,.30],[811,282,.35],[841,282,.29],[873,263,.35],[907,259,.31],
 ],
 cliffShoulder: [
 [936,234,.80],[940,220,1.12],[949,230,1.03],[963,232,.89],[969,235,.76],
 [977,209,.89],[986,207,1.00],[990,221,.96],[994,230,.91],
 [1001,216,1.03],[1000,198,1.03],[1004,207,1.01],[1008,214,.94],
 [1013,222,.97],[1019,224,.97],[1024,226,.83],[1030,224,.70],[1038,229,.40],
 [982,238,.87],[988,235,.87],[993,232,.64],[999,243,.99],[1007,234,1.14],
 [1012,243,.90],[1019,244,.88],[1002,252,.51],
 ],
 roadGrove: [
 [887,295,.82],[895,290,.67],[903,291,.74],[910,294,.72],[918,295,.84],
 [927,291,.75],[936,287,.77],[945,292,.73],
 [923,309,.94],[917,316,.72],[923,325,.88],[931,321,.95],[938,320,.91],
 [943,326,.94],[949,324,.76],[951,315,.90],[958,307,.76],[965,307,.68],
 [975,309,.80],[986,302,.76],[991,294,.66],[899,310,.30],[910,318,.24],
 [891,304,.27],[937,304,.38],[946,302,.28],
 ],
 easternRidge: [
 [1009,278,.49],[1015,273,.77],[1018,282,.61],[1027,276,.96],
 [1035,289,.44],[1040,276,.85],[1044,279,.81],[1051,291,.65],
 [1063,261,1.00],[1067,261,1.03],[1069,253,1.13],[1076,274,.89],
 [1080,268,.92],[1084,273,.84],[1088,278,.97],[1090,263,.95],[1095,269,1.08],
 [1100,278,.83],[1104,285,.83],[1108,289,.83],[1113,277,1.02],
 [1118,269,.91],[1121,276,1.14],[1126,282,.97],
 [1090,302,.85],[1096,307,.88],[1105,312,1.01],[1110,304,.86],[1116,304,.92],
 [1122,302,.74],[1129,299,.64],[1137,301,.87],[1143,291,.88],
 [1149,299,1.03],[1153,311,.92],[1146,310,.75],[1141,318,.61],[1129,314,.46],
 ],
 southeastFingers: [
 [1160,330,.87],[1167,335,.88],[1162,341,.84],[1155,342,.71],[1158,352,.98],
 [1146,345,.92],[1140,350,.89],[1128,352,.74],[1136,341,.61],[1120,345,.70],
 [1168,327,1.07],[1175,321,.98],[1181,332,1.03],[1185,336,.73],
 [1195,339,.71],[1188,345,.73],[1178,343,.67],[1174,352,.86],
 [1182,349,.64],[1195,350,.76],[1200,347,.81],[1204,337,.73],
 [1166,358,.81],[1163,366,.89],[1148,365,.71],[1142,370,.97],
 [1125,374,.63],[1130,361,.72],[1190,356,.55],[1206,349,.61],
 ],
};
export const planting = Object.entries(regions).flatMap(([region,rows])=>rows.map(([x,y,height])=>({region,x,y,height})));
const palette=['#498324','#568f27','#658e2b','#377322','#709b32'];
const foliage=palette.map(color=>mat(color,{flatShading:true,vertexColors:true}));
const bark=mat('#57452b',{flatShading:true});
function random(seed){let s=seed>>>0;return ()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};}

// One connected closed mesh: subtle whorl lips and taper, never separate cone stacks.
function crown(height,radius,rng) {
 const sides=9, rings=[ [.115,.76],[.17,1],[.35,.76],[.38,.78],[.57,.47],[.60,.49],[.78,.21],[.81,.22],[1,.006] ];
 const pos=[],colors=[],indices=[];
 const phase=rng()*Math.PI*2,leanX=(rng()-.5)*height*.055,leanZ=(rng()-.5)*height*.055;
 const radial=Array.from({length:sides},()=>.86+rng()*.28);
 for(let j=0;j<rings.length;j++)for(let k=0;k<sides;k++){
  const [y,r]=rings[j],a=phase+k/sides*Math.PI*2;
  const variation=.96+rng()*.08;
  pos.push(Math.cos(a)*radius*r*radial[k]*variation+leanX*y,y*height+(j===rings.length-1?0:(rng()-.5)*height*.009),Math.sin(a)*radius*r*radial[k]*variation+leanZ*y);
  const shade=(j%2===0?.98:1)*(.95+rng()*.08);colors.push(shade,shade,shade);
 }
 for(let j=0;j<rings.length-1;j++)for(let k=0;k<sides;k++){
  const a=j*sides+k,b=j*sides+(k+1)%sides,c=a+sides,d=b+sides;
  indices.push(a,c,b,b,c,d);
 }
 // Caps close both crown ends for reverse and underneath views.
 for(let k=1;k<sides-1;k++){indices.push(0,k,k+1);const n=(rings.length-1)*sides;indices.push(n,n+k+1,n+k);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
export function build(ctx) {
 const group=new THREE.Group();group.name='vegetation-belt';let count=0;
 for(const [index,tree] of planting.entries()){
  const rng=random(7831+index*104729),p=ctx.pixelToWorld(tree.x,tree.y,0);
  if(Math.abs(p.x)>12.4333032975-.035||Math.abs(p.z)>10-.035)continue;
  const ground=ctx.heightAt?ctx.heightAt(p.x,p.z):.035;p.y=(Number.isFinite(ground)?ground:.035)-.025;
  const h=tree.height*.94,root=new THREE.Group();root.name=tree.region+'-conifer-'+index;root.position.copy(p);
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(h*.018,h*.031,h*.72,7),bark);trunk.position.y=h*.35;root.add(trunk);
  const mesh=new THREE.Mesh(crown(h,h*(.135+rng()*.033),rng),foliage[index%foliage.length]);root.add(mesh);
  for(const m of [trunk,mesh]){m.castShadow=true;m.receiveShadow=true;}
  root.userData={rootPixel:[tree.x,tree.y],height:h,region:tree.region};group.add(root);count++;
 }
 group.userData={count,requested:planting.length,regions:Object.fromEntries(Object.entries(regions).map(([k,v])=>[k,v.length])),grounding:'heightAt(x,z) minus .025',children:[]};
 return group;
}
