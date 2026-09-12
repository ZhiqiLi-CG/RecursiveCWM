// Map the delivered, unmodified program groups to the authoritative recursion tree.
const villageAliases = {
  scene: 'medieval-village-map',
  'terrain-mountain': 'snow-massif',
  'vegetation-west': 'western-conifer-grove',
  'vegetation-foreground': 'foreground-pine-grove'
};
export function setupRecursionDisplay({THREE, root, scene, tree, renderer, render, onChange, groupAliases = villageAliases}) {
  const groups = new Map(), groupIds = new Map(), meshes = [];
  for (const id of Object.keys(tree.depth)) {
    const matches = [];
    root.traverse(object => { if (object.isGroup && object.name === (groupAliases[id] || id)) matches.push(object); });
    if (matches.length !== 1) throw new Error(`Expected one delivered group for ${id}; found ${matches.length}.`);
    groups.set(id,matches[0]); groupIds.set(matches[0],id);
  }
  // Check the composition, rather than assuming that a matching name means ownership.
  for (const [parent,children] of Object.entries(tree.children)) {
    for (const child of children) {
      let ancestor = groups.get(child).parent;
      while (ancestor && !groupIds.has(ancestor)) ancestor = ancestor.parent;
      if (ancestor !== groups.get(parent)) throw new Error(`Group parent does not match tree.json: ${child}.`);
    }
  }
  function visit(object,owner) {
    owner = groupIds.get(object) || owner;
    if (object.isMesh) meshes.push({object,owner,material:object.material,visible:object.visible});
    for (const child of object.children) visit(child,owner);
  }
  visit(root,tree.root);
  root.updateWorldMatrix(true,true);
  const bounds = new Map([...groups].map(([id,group]) => [id,new THREE.Box3().setFromObject(group)]));
  const guides = new THREE.Group(); guides.name = 'recursion-display-guides'; scene.add(guides);
  const outline = new THREE.Box3Helper(bounds.get(tree.root).clone(),0x13876c);
  outline.material.depthTest = false; outline.renderOrder = 11; outline.visible = false; guides.add(outline);
  const dimmed = new Map();
  function dim(material) {
    if (Array.isArray(material)) return material.map(dim);
    if (!dimmed.has(material)) {
      const copy = material.clone();
      copy.vertexColors = false;
      if (copy.color) copy.color.set('#d8dfdc');
      if (copy.emissive) { copy.emissive.set('#b6c8bf'); copy.emissiveIntensity = .16; }
      dimmed.set(material,copy);
    }
    return dimmed.get(material);
  }
  const descendants = new Map();
  for (const id of groups.keys()) {
    const members = new Set();
    const collect = node => { members.add(node); (tree.children[node] || []).forEach(collect); };
    collect(id); descendants.set(id,members);
  }
  const maxDepth = Math.max(...Object.values(tree.depth));
  const modes = new Set(['all','current','children']);
  let mode = 'all', selectedNode = tree.root, previewNode = null, selectionActive = false;
  const childrenOf = id => tree.children[id] || [];
  const effectiveMode = () => mode === 'children' && !childrenOf(selectedNode).length ? 'current' : mode;
  const currentHighlight = () => previewNode || (selectionActive ? selectedNode : null);
  function getState() {
    const ownMeshes = Object.fromEntries([...groups.keys()].map(id=>[id,0]));
    for (const item of meshes) ownMeshes[item.owner]++;
    const highlightedNode = currentHighlight();
    return {mode,effectiveMode:effectiveMode(),hasChildren:!!childrenOf(selectedNode).length,maxDepth,selectedNode,previewNode,highlightedNode,mappedNodes:[...groups.keys()],ownMeshes,
      visibleMeshes:meshes.filter(item=>item.object.visible).length,
      highlightedMeshes:highlightedNode ? meshes.filter(item=>item.object.visible && descendants.get(highlightedNode).has(item.owner)).length : 0};
  }
  function apply() {
    const highlightedNode = currentHighlight();
    const selected = highlightedNode && descendants.get(highlightedNode);
    const delivery = descendants.get(selectedNode), effective = effectiveMode();
    for (const item of meshes) {
      const included = effective === 'current' ? item.owner === selectedNode : delivery.has(item.owner) && (effective === 'all' || item.owner !== selectedNode);
      item.object.visible = item.visible && included;
      item.object.material = selected && !selected.has(item.owner) ? dim(item.material) : item.material;
    }
    outline.visible = !!highlightedNode;
    if (highlightedNode) outline.box.copy(bounds.get(highlightedNode));
    renderer.shadowMap.needsUpdate = true;
    render(); onChange(getState());
  }
  function setSelection(id, value = mode, active = true) {
    if (!groups.has(id) || !modes.has(value)) return;
    selectedNode = id; mode = value; selectionActive = active; previewNode = null; apply();
  }
  function getFrameBounds(id = selectedNode) {
    if (!groups.has(id)) return null;
    const children = childrenOf(id);
    if (mode !== 'children' || !children.length) return bounds.get(id);
    const box = new THREE.Box3();
    for (const child of children) box.union(bounds.get(child));
    return box.isEmpty() ? bounds.get(id) : box;
  }
  function preview(id) {
    if (id !== null && !groups.has(id)) return;
    previewNode = id; apply();
  }
  function clearHighlight() { selectionActive = false; previewNode = null; apply(); }
  return {setSelection,preview,clearHighlight,getState,getFrameBounds,groups,meshes,outline,bounds};
}
