import {THREE} from '../scene/common.js';
import {patches} from './forest-floor-data.js';
// Optional terrain-parent material adapter; never called by vegetation build().
// It colors the existing closed terrain mesh, without adding any ground geometry.
const roads=[[[76,379],[128,379],[157,401],[208,408],[279,438],[366,444],[446,430],[526,430],[552,453],[608,479],[700,491],[791,454],[869,464],[947,465],[1012,429],[1098,403],[1174,420],[1250,392],[1290,390]],[[520,429],[555,378],[617,350],[669,303],[731,274],[768,276],[824,304],[864,312],[899,355],[948,372],[1012,429]],[[862,305],[919,271],[970,282],[1010,257]]];
function segment(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z;const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
function interior(x,z,poly){let inside=false,d=Infinity;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)inside=!inside;d=Math.min(d,segment(x,z,a,b));}return inside?d:-d;}
export function applyForestFloor(ground,ctx){const land=ground.getObjectByName('continuous-carved-ground');if(!land)return;
 const pos=land.geometry.getAttribute('position'),col=land.geometry.getAttribute('color');if(!col)return;
 const polygons=patches.map(p=>p.root_pixels.map(([x,y])=>ctx.pixelToWorld(x,y,0)));
 const paths=roads.map(path=>path.map(([x,y])=>ctx.pixelToWorld(x,y,0))),earth=new THREE.Color('#80623f'),c=new THREE.Color();
 // Idempotent: repeated integration always starts from original ground colors.
 const original=land.userData.beforeForestColor||(land.userData.beforeForestColor=col.array.slice());
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);if(ctx.surfaceAt&&ctx.surfaceAt(x,z)==='water')continue;
  const warp=.04*Math.sin(x*19+Math.sin(z*9))+.03*Math.sin(z*23-x*4);let d=-Infinity;for(const poly of polygons)d=Math.max(d,interior(x,z,poly));
  if(d+warp<-.04)continue;let pathDistance=Infinity;for(const path of paths)for(let j=1;j<path.length;j++)pathDistance=Math.min(pathDistance,segment(x,z,path[j-1],path[j]));
  const feather=Math.max(0,Math.min(1,(d+warp+.04)/.19)),road=Math.max(0,Math.min(1,(pathDistance-.19)/.16));
  const mottling=.84+.09*Math.sin(x*17+z*11)*Math.sin(z*21-x*8);const blend=feather*road*mottling;
  c.setRGB(original[i*3],original[i*3+1],original[i*3+2]).lerp(earth,blend);col.setXYZ(i,c.r,c.g,c.b);
 }col.needsUpdate=true;land.userData.forestFloorPatches=patches.length;
}
