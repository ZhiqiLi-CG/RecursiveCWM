import {THREE,mat,polygon} from '../scene/common.js';
import {heightAt,surfaceAt} from '../terrain-ground/ground.js';
// All anchors are inherited root pixels; the camera is never changed to fit roads.
export const routes=[
 {id:'main',width:.43,points:[[70,375],[128,379],[157,401],[208,408],[279,438],[366,444],[446,430],[516,430],[552,453],[608,479],[694,491],[748,470],[791,454],[862,462],[929,465],[982,443],[1012,429],[1098,403],[1174,420],[1250,392],[1302,394]]},
 {id:'west-entry',width:.38,points:[[278,438],[264,459],[247,489],[232,520],[219,559],[217,560]]},
 {id:'market-loop',width:.31,points:[[263,461],[292,467],[329,481],[370,495],[406,518],[426,552],[438,581]]},
 {id:'south',width:.40,points:[[438,581],[471,619],[507,637],[548,649],[580,670],[599,699],[622,744],[627,762],[617,792],[619,817]]},
 {id:'west-river',width:.39,points:[[520,429],[537,405],[555,378],[596,363],[635,345],[659,320],[674,301],[708,282],[731,274],[768,276],[824,304],[864,312],[887,335],[899,355],[948,372],[975,400],[1012,429]]},
 {id:'north-entry',width:.35,points:[[862,305],[887,286],[919,271],[949,276],[970,282],[988,275],[1010,257],[1023,242],[1045,225]]},
 {id:'east-exit',width:.39,points:[[1012,429],[1042,443],[1080,451],[1119,463],[1149,488]]},
 {id:'adobe-west-access',width:.18,taper:true,points:[[476,624],[447,650],[427,680],[416,707]]}
];
function road(ctx,g,r,order){
 const curve=new THREE.CatmullRomCurve3(r.points.map(p=>ctx.pixelToWorld(...p,.02)));
 const count=Math.ceil(curve.getLength()*24), verts=[],colors=[],indices=[];
 const soil=new THREE.Color('#b5a38a'),edge=new THREE.Color('#ac9a80'),side=new THREE.Color('#91826c');
 const [xmin,xmax,zmin,zmax]=ctx.contract.world.tile_bounds;
 // Four points across each strip: full solid lane with subtle worn shoulders.
 for(let i=0;i<=count;i++){
  const t=i/count,p=curve.getPoint(t),v=curve.getTangent(t),normal=new THREE.Vector3(-v.z,0,v.x).normalize();
  const w=r.width*(1+.06*Math.sin(t*19))*(r.taper?(1-.48*t):1)*(r.id==='main'?1+.22*Math.exp(-Math.pow((t-.77)*22,2)):1);
  for(let j=0;j<4;j++){
   const offset=[-.5,-.40,.40,.5][j]*w;
   const x=THREE.MathUtils.clamp(p.x+normal.x*offset,xmin,xmax),z=THREE.MathUtils.clamp(p.z+normal.z*offset,zmin,zmax);
   // Wet spans retain deck thickness; land follows the completed terrain sampler.
   const y=Math.max(.04,heightAt(x,z)+.019)+order*.0007;
   verts.push(x,y,z);colors.push(...(j===0||j===3?edge:soil).toArray());
  }
 }
 const tops=verts.length/3;
 for(let k=0;k<tops;k++){const x=verts[k*3],z=verts[k*3+2];const bottom=surfaceAt(x,z)==='water'?-.023:Math.min(heightAt(x,z)-.045,verts[k*3+1]-.10);verts.push(x,bottom,z);colors.push(...side.toArray());}
 for(let i=0;i<count;i++)for(let j=0;j<3;j++){let k=i*4+j;indices.push(k,k+4,k+1,k+1,k+4,k+5);let b=k+tops;indices.push(b,b+1,b+4,b+1,b+5,b+4);}
 for(let i=0;i<count;i++){let l=i*4,rr=l+3;indices.push(l,l+tops,l+4,l+4,l+tops,l+tops+4,rr,rr+4,rr+tops,rr+4,rr+tops+4,rr+tops);}
 for(const end of [0,count*4])for(let j=0;j<3;j++){let a=end+j,b=a+1;indices.push(a,b,a+tops,b,b+tops,a+tops);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();
 const mesh=new THREE.Mesh(geo,mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}));mesh.name=`road-${r.id}`;mesh.receiveShadow=true;mesh.castShadow=true;g.add(mesh);
}
export function build(ctx){const g=new THREE.Group();g.name='settlement-road-network';routes.forEach((r,i)=>road(ctx,g,r,i));const plaza=polygon(ctx,g,[[985,422],[1005,414],[1024,420],[1040,432],[1025,440],[1014,449],[993,441]],'#b5a38a',.049);plaza.name='market-road-junction';const a=plaza.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),z=-a.getY(i);a.setZ(i,Math.max(.049,heightAt(x,z)+.024)-.049);}plaza.geometry.computeVertexNormals();return g;}
