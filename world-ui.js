// Shared controls and same-origin communication for the overview and explorer worlds.
export function setupWorld() {
  const $ = id => document.getElementById(id), iframe = $('world-viewer');
  if (!iframe) return {select(){},hover(){}};
  const depthButtons = [...document.querySelectorAll('[data-world-depth]')];
  const descriptions = [
    'The root assembles its children. Its bounds are shown; geometry starts at level 1.',
    'Terrain and settlements establish the first assemblies. Outlines mark this level.',
    'Ground, mountain, vegetation, and villages fill the scene.',
    'Forests, house clusters, markets, and windmills add local detail.',
    'All five levels, down to individual building programs.'
  ];
  let ready = false, timer, selected = null, hovered = null, depth = 4;
  const send = message => { if (ready) iframe.contentWindow.postMessage(message,location.origin); };
  function display(state) {
    depth = state.level;
    depthButtons.forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.worldDepth) === depth)));
    const id = state.highlightedNode;
    $('world-node-id').textContent = id || 'scene';
    $('world-node-caption').textContent = id ? (state.highlightedMeshes ? 'Highlighted program' : 'Program bounds · beyond this depth') : 'Whole scene';
    $('world-depth-note').textContent = descriptions[depth];
    $('clear-highlight').hidden = !id;
    $('viewer-shell').dataset.node = id || '';
    $('viewer-shell').dataset.depth = String(depth);
  }
  function highlight() { send({type:'rcwm-highlight',nodeId:hovered || selected,reveal:false}); }
  function fallback() {
    ready = false; clearTimeout(timer);
    $('viewer-loading').hidden = true; $('viewer-frame').hidden = true;
    $('viewer-fallback').hidden = false; $('viewer-status').textContent = 'Saved camera views';
    $('viewer-gestures').hidden = true; $('reset-camera').disabled = true;
    depthButtons.forEach(button => button.disabled = true);
    $('world-controls').hidden = true;
    iframe.closest('.explore-world')?.classList.add('viewer-unavailable');
  }
  window.addEventListener('message', event => {
    if (event.source !== iframe.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'rcwm-ready') {
      ready = true; clearTimeout(timer);
      $('viewer-frame').hidden = false; $('viewer-loading').hidden = true; $('viewer-fallback').hidden = true;
      $('viewer-gestures').hidden = false; $('world-controls').hidden = false;
      iframe.closest('.explore-world')?.classList.remove('viewer-unavailable');
      $('viewer-status').textContent = 'Live scene'; $('reset-camera').disabled = false;
      depthButtons.forEach(button => button.disabled = false);
      send({type:'rcwm-depth',level:depth}); highlight();
    } else if (event.data?.type === 'rcwm-state') display(event.data);
    else if (event.data?.type === 'rcwm-error') fallback();
  });
  depthButtons.forEach(button => button.addEventListener('click', () => {
    selected = null; hovered = null; depth = Number(button.dataset.worldDepth);
    send({type:'rcwm-depth',level:depth});
  }));
  $('clear-highlight').addEventListener('click', () => { selected = null; hovered = null; highlight(); });
  $('reset-camera').addEventListener('click', () => send({type:'rcwm-reset'}));
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      if (!ready) timer = setTimeout(fallback,90000);
      observer.disconnect();
    }
  },{rootMargin:'400px'});
  observer.observe(iframe);
  return {
    select(id) { selected = id; hovered = null; depth = 4; send({type:'rcwm-highlight',nodeId:id,reveal:true}); },
    hover(id) { if (hovered === id) return; hovered = id; highlight(); }
  };
}
