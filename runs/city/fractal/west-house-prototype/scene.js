import * as THREE from '/three.js';
const {spec,camera:c,view}=await fetch('/payload').then(r=>r.json());
const scene=new THREE.Scene();scene.background=new THREE.Color(c.render.background);const cam=new THREE.OrthographicCamera(c.left,c.right,c.top,c.bottom,c.near,c.far);cam.position.fromArray(c.position);cam.up.fromArray(c.up);cam.lookAt(...c.target);
if(view){const [x,y,w,h]=view.crop_px;cam.setViewOffset(c.resolution[0],c.resolution[1],x,y,w,h);}
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;renderer.setPixelRatio(1);renderer.setSize(...(view?.output_size||c.resolution));document.body.appendChild(renderer.domElement);
const mat=color=>new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide});const buffers=new Map();
function mesh(verts,indices,color){let b=buffers.get(color);if(!b){b={v:[],i:[]};buffers.set(color,b);}const off=b.v.length/3;b.v.push(...verts.flat());b.i.push(...indices.map(i=>i+off));}
function polygon(points,y,color){const pts=points.map(p=>new THREE.Vector2(...p)),tris=THREE.ShapeUtils.triangulateShape(pts,[]).flat();mesh(points.map(([x,z])=>[x,y,z]),tris,color);}
function shape(g){const [x,y,z]=g.position||[0,0,0];
 if(g.type==='polygon'){polygon(g.points,g.y,g.color);return;}
 if(g.type==='triangles'){mesh(g.vertices,g.indices,g.color);return;}
 if(g.type==='box'){const [w,h,d]=g.size;const x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;const colors=g.colors||[g.color,g.color,g.color];
 mesh([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],[0,1,2,0,2,3],colors[0]);mesh([[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]],[0,1,2,0,2,3],colors[1]);mesh([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],[0,1,2,0,2,3],colors[2]);return;}
 if(g.type==='cylinder'||g.type==='cone'){const geom=new THREE.CylinderGeometry(g.radiusTop??g.radius,g.radius,g.height,g.segments||12);geom.translate(x,y,z);scene.add(new THREE.Mesh(geom,mat(g.color)));return;}
 if(g.type==='ellipsoid'){const geom=new THREE.SphereGeometry(1,8,4);geom.scale(...g.size);geom.translate(x,y,z);scene.add(new THREE.Mesh(geom,mat(g.color)));return;}
 throw Error('Unknown primitive '+g.type);
}
for(const g of spec.geometry)shape(g);for(const [color,b]of buffers){const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(b.v,3));geom.setIndex(b.i);scene.add(new THREE.Mesh(geom,mat(color)));}renderer.render(scene,cam);
window.RENDER_REPORT={meshes:scene.children.length,triangles:renderer.info.render.triangles,projection:[],camera_position:cam.position.toArray(),camera_target:c.target,view:view?.crop_px||null};
for(const p of spec.landmarks||[]){const v=new THREE.Vector3(...p.world).project(cam);window.RENDER_REPORT.projection.push({id:p.id,screen:[(v.x+1)*(view?.output_size[0]||c.resolution[0])/2,(1-v.y)*(view?.output_size[1]||c.resolution[1])/2],expected:p.pixel});}window.RENDER_DONE=true;
