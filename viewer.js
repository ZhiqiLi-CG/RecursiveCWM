// Build the exact delivered component with its locked camera before enabling orbit.
export async function init() {
  const [{THREE, makeCamera, context}, {build}, {OrbitControls}] = await Promise.all([
    import('./fractal/scene/common.js'), import('./fractal/scene/component.js'), import('./vendor/OrbitControls.js')
  ]);
  const response = await fetch(new URL('./camera-contract.json', import.meta.url));
  if (!response.ok) throw new Error(`Camera contract: HTTP ${response.status}`);
  const contract = await response.json();
  const camera = makeCamera(contract), ctx = context(camera, contract), scene = new THREE.Scene();
  scene.background = new THREE.Color('#ffffff');
  scene.add(new THREE.HemisphereLight('#f4f9ff','#625840',1.8));
  const sun = new THREE.DirectionalLight('#fff2d9',3); sun.position.set(-15,22,-18); sun.castShadow = true;
  sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24});
  sun.shadow.bias = -.0005; sun.shadow.normalBias = .015; scene.add(sun);
  // Some geometry is calibrated with pixelToWorld, so build before resizing or orbiting.
  scene.add(build(ctx));
  const renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  document.body.append(renderer.domElement); renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('aria-label','3D village. Drag to orbit, scroll to zoom. Arrow keys orbit; plus and minus zoom; R resets.');
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.fromArray(contract.target); controls.enablePan = false; controls.enableDamping = false;
  controls.minDistance = 12; controls.maxDistance = 95; controls.maxPolarAngle = Math.PI * .48;
  controls.rotateSpeed = .6; controls.zoomSpeed = .8;
  let reference = true, queued = false;
  const original = makeCamera(contract);
  function projection() {
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
  function reset() {
    reference = true; controls.target.fromArray(contract.target);
    camera.position.copy(original.position); camera.up.copy(original.up); controls.update();
    camera.quaternion.copy(original.quaternion); projection(); render();
  }
  controls.addEventListener('start', () => { reference = false; projection(); });
  controls.addEventListener('change', render);
  addEventListener('resize', () => { renderer.setSize(innerWidth,innerHeight); projection(); render(); });
  addEventListener('message', event => { if (event.source === parent && event.origin === location.origin && event.data?.type === 'rcwm-reset') reset(); });
  renderer.domElement.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); reset(); return; }
    const delta = {ArrowLeft:-.12, ArrowRight:.12, ArrowUp:-.08, ArrowDown:.08}[event.key];
    if (delta !== undefined || ['+','=','-'].includes(event.key)) {
      event.preventDefault(); reference = false;
      const offset = camera.position.clone().sub(controls.target), sphere = new THREE.Spherical().setFromVector3(offset);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') sphere.theta += delta;
      else if (delta !== undefined) sphere.phi = Math.max(.08,Math.min(controls.maxPolarAngle,sphere.phi + delta));
      else sphere.radius = Math.max(controls.minDistance,Math.min(controls.maxDistance,sphere.radius * (event.key === '-' ? 1.1 : .9)));
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sphere)); controls.update(); projection(); render();
    }
  });
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); parent.postMessage({type:'rcwm-error',message:'WebGL context lost'}, location.origin); });
  renderer.setSize(innerWidth,innerHeight); reset();
  renderer.render(scene,camera);
  document.getElementById('message').hidden = true;
  window.sceneReady = true; window.sceneContext = {scene,camera,ctx,renderer,controls,reset};
  parent.postMessage({type:'rcwm-ready'},location.origin);
}
