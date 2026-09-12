// One selection model for both trees, the details, depth buttons, and the live frame.
export function setupWorld(maxDepth = 4) {
  const $ = id => document.getElementById(id), iframe = $('world-viewer');
  if (!iframe) return {bind(){},select(){},hover(){}};
  const depthButtons = [...document.querySelectorAll('[data-world-depth]')];
  const descriptions = Array.from({length:maxDepth+1},(_,level)=>level===0 ? 'The root establishes the whole. Reveal another level to see its parts.' : level===maxDepth ? `All ${maxDepth+1} levels of the construction.` : `The whole and its parts through level ${level}.`);
  let ready = false, timer, tree, parents = {}, selected = 'scene', hovered = null, depth = maxDepth;
  let active = false, pendingFrame = false, onSelection = () => {};
  const send = message => { if (ready) iframe.contentWindow.postMessage(message,location.origin); };
  function sync() {
    send({type:'rcwm-selection',nodeId:selected,level:depth,active,frame:pendingFrame});
    if (ready) pendingFrame = false;
    if (hovered) send({type:'rcwm-preview',nodeId:hovered});
  }
  function display(state) {
    depthButtons.forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.worldDepth) === state.level)));
    const id = state.highlightedNode;
    $('world-node-id').textContent = id || state.selectedNode;
    $('world-node-caption').textContent = id ? (state.highlightedMeshes ? 'Highlighted program' : 'Program bounds · reveal deeper levels for geometry') : 'Selected program';
    $('world-depth-note').textContent = descriptions[state.level];
    $('clear-highlight').hidden = !id;
    $('viewer-shell').dataset.node = id || '';
    $('viewer-shell').dataset.selected = state.selectedNode;
    $('viewer-shell').dataset.depth = String(state.level);
  }
  function fallback() {
    ready = false; clearTimeout(timer);
    $('viewer-loading').hidden = true; $('viewer-frame').hidden = true;
    $('viewer-fallback').hidden = false; $('viewer-status').textContent = 'Saved camera views';
    $('viewer-gestures').hidden = true; $('reset-camera').disabled = true;
    depthButtons.forEach(button => button.disabled = true); $('world-controls').hidden = true;
    iframe.closest('.explore-world')?.classList.add('viewer-unavailable');
  }
  window.addEventListener('message',event => {
    if (event.source !== iframe.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'rcwm-ready') {
      ready = true; clearTimeout(timer);
      $('viewer-frame').hidden = false; $('viewer-loading').hidden = true; $('viewer-fallback').hidden = true;
      $('viewer-gestures').hidden = false; $('world-controls').hidden = false;
      iframe.closest('.explore-world')?.classList.remove('viewer-unavailable');
      $('viewer-status').textContent = 'Live scene'; $('reset-camera').disabled = false;
      depthButtons.forEach(button => button.disabled = false); sync();
    } else if (event.data?.type === 'rcwm-state') display(event.data);
    else if (event.data?.type === 'rcwm-error') fallback();
  });
  depthButtons.forEach(button => button.addEventListener('click',() => {
    if (!tree) return;
    depth = Number(button.dataset.worldDepth); hovered = null;
    const previous = selected;
    while (tree.depth[selected] > depth) selected = parents[selected];
    pendingFrame = previous !== selected;
    if (pendingFrame) { active = true; onSelection(selected); }
    sync();
  }));
  $('clear-highlight').addEventListener('click',() => { active = false; hovered = null; send({type:'rcwm-clear-highlight'}); });
  $('reset-camera').addEventListener('click',() => { pendingFrame = false; send({type:'rcwm-reset'}); });
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      if (!ready) timer = setTimeout(fallback,90000);
      observer.disconnect();
    }
  },{rootMargin:'400px'});
  observer.observe(iframe);
  return {
    bind(data,callback,initial) {
      tree = data; onSelection = callback;
      for (const [id,children] of Object.entries(tree.children)) children.forEach(child => parents[child] = id);
      selected = Object.hasOwn(tree.depth,initial) ? initial : tree.root;
      active = selected !== tree.root; depth = active ? tree.depth[selected] : maxDepth; pendingFrame = active;
      onSelection(selected,false); sync();
    },
    select(id) {
      if (!tree || !Object.hasOwn(tree.depth,id)) return;
      selected = id; depth = tree.depth[id]; hovered = null; active = true; pendingFrame = true;
      onSelection(id); sync();
    },
    hover(id) {
      if (!tree || (id !== null && !Object.hasOwn(tree.depth,id)) || hovered === id) return;
      hovered = id; send({type:'rcwm-preview',nodeId:id});
    }
  };
}
