// Static equivalent of the delivered primitive renderer. The delivered scene.js
// stays untouched; batching is split by owner so recursion can reveal each part.
export function buildCity(THREE, spec, tree) {
  const groups = new Map(Object.keys(tree.depth).map(id => {
    const group = new THREE.Group(); group.name = id; return [id, group];
  }));
  for (const [parent, children] of Object.entries(tree.children))
    for (const child of children) groups.get(parent).add(groups.get(child));
  const root = groups.get(tree.root), buffers = new Map();
  const primitiveOwnership = Object.fromEntries([...groups.keys()].map(id => [id, 0]));
  function ownerOf(id) {
    const segments = id.split('/');
    // Child components retain their node IDs except these documented instance
    // names assigned by their parent assemblers.
    if (segments[0] === 'foreground-park') {
      const kind = segments[1]?.match(/^(red-tree|cone-tree|spread-tree)-\d+$/)?.[1];
      if (kind) return `foreground-park-${kind}`;
      if (segments[1] === 'ponds') return 'foreground-park-ponds';
    }
    if (segments[0] === 'north-housing' && segments[1] === 'buildings') return 'north-housing-buildings';
    return segments.filter(part => groups.has(part)).sort((a,b) => tree.depth[b]-tree.depth[a])[0] || tree.root;
  }
  const mat = color => new THREE.MeshBasicMaterial({color, side:THREE.DoubleSide});
  function mesh(owner, verts, indices, color) {
    const key = `${owner}:${color}`;
    let b = buffers.get(key);
    if (!b) { b = {owner,color,v:[],i:[]}; buffers.set(key,b); }
    const offset = b.v.length/3; b.v.push(...verts.flat()); b.i.push(...indices.map(i=>i+offset));
  }
  const primitives = spec.geometry || spec.components;
  for (const g of primitives) {
    const owner = ownerOf(g.id); primitiveOwnership[owner]++;
    const [x,y,z] = g.position || [0,0,0];
    if (g.type === 'polygon') {
      const tris = THREE.ShapeUtils.triangulateShape(g.points.map(p=>new THREE.Vector2(...p)),[]).flat();
      mesh(owner,g.points.map(([px,pz])=>[px,g.y,pz]),tris,g.color);
    } else if (g.type === 'triangles') mesh(owner,g.vertices,g.indices,g.color);
    else if (g.type === 'box') {
      const [w,h,d]=g.size,x0=x-w/2,x1=x+w/2,y0=y-h/2,y1=y+h/2,z0=z-d/2,z1=z+d/2;
      const colors=g.colors||[g.color,g.color,g.color];
      mesh(owner,[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],[0,1,2,0,2,3],colors[0]);
      mesh(owner,[[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]],[0,1,2,0,2,3],colors[1]);
      mesh(owner,[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],[0,1,2,0,2,3],colors[2]);
    } else {
      let geometry;
      if (g.type === 'cylinder' || g.type === 'cone') geometry=new THREE.CylinderGeometry(g.radiusTop??g.radius,g.radius,g.height,g.segments||12);
      else if (g.type === 'ellipsoid') { geometry=new THREE.SphereGeometry(1,8,4); geometry.scale(...g.size); }
      else throw new Error(`Unknown primitive ${g.type}`);
      geometry.translate(x,y,z); groups.get(owner).add(new THREE.Mesh(geometry,mat(g.color)));
    }
  }
  for (const b of buffers.values()) {
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(b.v,3));geometry.setIndex(b.i);
    groups.get(b.owner).add(new THREE.Mesh(geometry,mat(b.color)));
  }
  root.userData.primitiveCount=primitives.length;root.userData.primitiveOwnership=primitiveOwnership;
  return root;
}
