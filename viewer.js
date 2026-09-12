// Build the exact delivered component with its locked camera before enabling orbit.
export async function init() {
  const registryResponse = await fetch(new URL('./data/scenes.json', import.meta.url));
  if (!registryResponse.ok) throw new Error('The scene registry could not load.');
  const registry = await registryResponse.json();
  const sceneId = new URL(location.href).searchParams.get('scene');
  const entry = registry.find(item => item.id === sceneId) || registry[0];
  const run = new URL(`${entry.runDirectory.replace(/\/$/,'')}/`, import.meta.url);
  const [response, treeResponse] = await Promise.all([fetch(new URL('camera-contract.json',run)),fetch(new URL('tree.json',run))]);
  if (!response.ok || !treeResponse.ok) throw new Error('The camera or recursion tree could not load.');
  const contract = await response.json(), tree = await treeResponse.json();
  const [THREE, {OrbitControls}, {setupRecursionDisplay}] = await Promise.all([
    import('three'),import('./vendor/OrbitControls.js'),import('./recursion-display.js')
  ]);
  const isCity = contract.projection === 'orthographic';
  let makeCamera, ctx, root;
  if (isCity) {
    makeCamera = c => {
      const camera = new THREE.OrthographicCamera(c.left,c.right,c.top,c.bottom,c.near,c.far);
      camera.position.fromArray(c.position);camera.up.fromArray(c.up);camera.lookAt(...c.target);camera.updateMatrixWorld();return camera;
    };
  } else {
    ({makeCamera} = await import(new URL('fractal/scene/common.js',run).href));
  }
  const camera = makeCamera(contract), scene = new THREE.Scene();
  scene.background = new THREE.Color(contract.render?.background || '#ffffff');
  if (isCity) {
    const [{buildCity}, specResponse] = await Promise.all([import('./city-adapter.js'),fetch(new URL('fractal/scene/candidate.json',run))]);
    if (!specResponse.ok) throw new Error('The City primitive specification could not load.');
    ctx = {THREE,camera,contract};root = buildCity(THREE,await specResponse.json(),tree);
  } else {
    const [{context},{build}] = await Promise.all([import(new URL('fractal/scene/common.js',run).href),import(new URL('fractal/scene/component.js',run).href)]);
    ctx = context(camera,contract);
    scene.add(new THREE.HemisphereLight('#f4f9ff','#625840',1.8));
    const sun = new THREE.DirectionalLight('#fff2d9',3); sun.position.set(-15,22,-18); sun.castShadow = true;
    sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24});
    sun.shadow.bias = -.0005; sun.shadow.normalBias = .015; scene.add(sun);
    // Pixel-calibrated geometry must be built before resizing or orbiting.
    root = build(ctx);
  }
  scene.add(root);
  const renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.shadowMap.enabled = !isCity;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = isCity ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  document.body.append(renderer.domElement); renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label',`3D ${entry.name}. Drag to orbit, scroll to zoom. Arrow keys orbit; plus and minus zoom; R resets.`);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.fromArray(contract.target); controls.enablePan = false; controls.enableDamping = false;
  controls.minDistance = 12; controls.maxDistance = 95; controls.maxPolarAngle = Math.PI * .48;
  controls.rotateSpeed = .6; controls.zoomSpeed = .8;
  let reference = true, queued = false, animationFrame = 0, framedNode = null;
  const original = makeCamera(contract);
  function projection() {
    if (camera.isOrthographicCamera) {
      const aspect = innerWidth/innerHeight, width=contract.right-contract.left, height=contract.top-contract.bottom;
      const halfHeight=Math.max(height,width/aspect)/2, halfWidth=halfHeight*aspect;
      const x=(contract.left+contract.right)/2,y=(contract.top+contract.bottom)/2;
      Object.assign(camera,{left:x-halfWidth,right:x+halfWidth,top:y+halfHeight,bottom:y-halfHeight});
      camera.updateProjectionMatrix();camera.updateMatrixWorld();return;
    }
    const aspect = innerWidth / innerHeight, originalAspect = contract.width / contract.height;
    camera.aspect = aspect;
    // Fit the complete reference into the frame; preserve the recorded lens shift.
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(contract.fov / 2)) * Math.max(1, originalAspect / aspect)));
    camera.updateProjectionMatrix();
    if (reference) {
      const scaleY = aspect < originalAspect ? aspect / originalAspect : 1;
      const scaleX = aspect > originalAspect ? originalAspect / aspect : 1;
      camera.projectionMatrix.elements[8] = original.projectionMatrix.elements[8] * scaleX;
      camera.projectionMatrix.elements[9] = original.projectionMatrix.elements[9] * scaleY;
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    }
    camera.updateMatrixWorld();
  }
  function render() { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; renderer.render(scene,camera); }); }
  function stopFraming() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
  function frameNode(id, animate = true) {
    const box = recursion.bounds.get(id);
    if (!box || box.isEmpty()) return;
    stopFraming(); framedNode = id; reference = false; projection();
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(box.getSize(new THREE.Vector3()).length()/2,.05);
    const halfY = THREE.MathUtils.degToRad((camera.fov || 50)/2);
    const halfX = Math.atan(Math.tan(halfY)*(camera.aspect || innerWidth/innerHeight));
    const distance = radius/Math.sin(Math.min(halfX,halfY))*1.12;
    const direction = camera.position.clone().sub(controls.target).normalize();
    const destination = center.clone().addScaledVector(direction,distance);
    const startPosition = camera.position.clone(), startTarget = controls.target.clone();
    const startZoom=camera.zoom, destinationZoom=camera.isOrthographicCamera ? Math.min(camera.right-camera.left,camera.top-camera.bottom)/(2*radius*1.12) : 1;
    controls.minDistance = Math.max(.1,radius*.15); controls.maxDistance = Math.max(95,distance*2);
    const duration = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 520 : 0;
    const started = performance.now();
    function move(now) {
      const t = duration ? Math.min(1,(now-started)/duration) : 1;
      const eased = t*t*(3-2*t);
      camera.zoom = THREE.MathUtils.lerp(startZoom,destinationZoom,eased);
      camera.position.lerpVectors(startPosition,destination,eased);
      controls.target.lerpVectors(startTarget,center,eased); controls.update(); projection(); render();
      animationFrame = t < 1 ? requestAnimationFrame(move) : 0;
    }
    if (duration) animationFrame = requestAnimationFrame(move); else move(started);
  }
  function reset() {
    stopFraming(); framedNode = null; controls.minDistance = 12; controls.maxDistance = 95;
    camera.zoom = original.zoom; reference = true; controls.target.fromArray(contract.target);
    camera.position.copy(original.position); camera.up.copy(original.up); controls.update();
    camera.quaternion.copy(original.quaternion); projection(); render();
  }
  controls.addEventListener('start', () => { stopFraming(); framedNode = null; reference = false; projection(); });
  controls.addEventListener('change', render);
  addEventListener('resize', () => { renderer.setSize(innerWidth,innerHeight); projection(); if (framedNode) frameNode(framedNode,false); else render(); });
  addEventListener('message', event => { if (event.source === parent && event.origin === location.origin && event.data?.type === 'rcwm-reset') reset(); });
  renderer.domElement.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); reset(); return; }
    const delta = {ArrowLeft:-.12, ArrowRight:.12, ArrowUp:-.08, ArrowDown:.08}[event.key];
    if (delta !== undefined || ['+','=','-'].includes(event.key)) {
      event.preventDefault(); stopFraming(); framedNode = null; reference = false;
      const offset = camera.position.clone().sub(controls.target), sphere = new THREE.Spherical().setFromVector3(offset);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') sphere.theta += delta;
      else if (delta !== undefined) sphere.phi = Math.max(.08,Math.min(controls.maxPolarAngle,sphere.phi + delta));
      else if (camera.isOrthographicCamera) camera.zoom = Math.max(.05,Math.min(100,camera.zoom * (event.key === '-' ? .9 : 1.1)));
      else sphere.radius = Math.max(controls.minDistance,Math.min(controls.maxDistance,sphere.radius * (event.key === '-' ? 1.1 : .9)));
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sphere)); controls.update(); projection(); render();
    }
  });
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); parent.postMessage({type:'rcwm-error',message:'WebGL context lost'}, location.origin); });
  const publishState = state => parent.postMessage({type:'rcwm-state',...state},location.origin);
  const recursion = setupRecursionDisplay({THREE,root,scene,tree,renderer,render,onChange:publishState,groupAliases:entry.groupAliases || {}});
  addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin) return;
    if (event.data?.type === 'rcwm-selection') {
      if (!recursion.groups.has(event.data.nodeId) || !Number.isInteger(event.data.level) || event.data.level < 0 || event.data.level > recursion.getState().maxDepth) return;
      recursion.setSelection(event.data.nodeId,event.data.level,event.data.active !== false);
      if (event.data.frame) frameNode(recursion.getState().selectedNode);
    }
    if (event.data?.type === 'rcwm-preview') recursion.preview(event.data.nodeId);
    if (event.data?.type === 'rcwm-clear-highlight') recursion.clearHighlight();
  });
  renderer.setSize(innerWidth,innerHeight); reset();
  renderer.render(scene,camera);
  document.getElementById('message').hidden = true;
  window.sceneReady = true; window.sceneContext = {scene,root,camera,ctx,renderer,controls,reset,recursion,frameNode,isFraming:()=>animationFrame !== 0,getFramedNode:()=>framedNode};
  parent.postMessage({type:'rcwm-ready',...recursion.getState()},location.origin);
}
