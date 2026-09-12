// One selection model for both trees, the details, ownership modes, and the live frame.
export function setupWorld() {
  const $ = id => document.getElementById(id), iframe = $('world-viewer');
  if (!iframe) return {bind(){},select(){},hover(){}};
  const modeButtons = [...document.querySelectorAll('[data-world-mode]')];
  let ready = false, timer, tree, selected = 'scene', hovered = null, mode = 'all';
  let active = false, pendingFrame = false, onSelection = () => {};
  const send = message => { if (ready) iframe.contentWindow.postMessage(message,location.origin); };
  function sync() {
    send({type:'rcwm-selection',nodeId:selected,mode,active,frame:pendingFrame});
    if (ready) pendingFrame = false;
    if (hovered) send({type:'rcwm-preview',nodeId:hovered});
  }
  function display(state) {
    modeButtons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.worldMode === state.mode)));
    const id = state.highlightedNode;
    $('world-node-id').textContent = id || state.selectedNode;
    $('world-node-caption').textContent = id ? (state.highlightedMeshes ? 'Highlighted program' : 'Program bounds · no geometry visible in this mode') : 'Selected program';
    const current = state.selectedNode;
    $('world-mode-note').textContent = state.mode === 'all'
      ? `Everything delivered by ${current}, including its descendants.`
      : state.mode === 'children' && !state.hasChildren
        ? `${current} has no children; showing only its own geometry.`
        : state.mode === 'children'
          ? `Geometry returned by ${current}’s direct children, including their descendants.`
          : state.ownMeshes[current]
            ? `Only geometry built by ${current} itself, with every child subprogram hidden.`
            : `${current} has no geometry of its own; its children are hidden.`;
    $('clear-highlight').hidden = !id;
    $('viewer-shell').dataset.node = id || '';
    $('viewer-shell').dataset.selected = state.selectedNode;
    $('viewer-shell').dataset.mode = state.mode;
  }
  function fallback() {
    ready = false; clearTimeout(timer);
    $('viewer-loading').hidden = true; $('viewer-frame').hidden = true;
    $('viewer-fallback').hidden = false; $('viewer-status').textContent = 'Saved camera views';
    $('viewer-gestures').hidden = true; $('reset-camera').disabled = true;
    modeButtons.forEach(button => button.disabled = true); $('world-controls').hidden = true;
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
      modeButtons.forEach(button => button.disabled = false); sync();
    } else if (event.data?.type === 'rcwm-state') display(event.data);
    else if (event.data?.type === 'rcwm-error') fallback();
  });
  modeButtons.forEach(button => button.addEventListener('click',() => {
    if (!tree) return;
    mode = button.dataset.worldMode; hovered = null; pendingFrame = true;
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
      selected = Object.hasOwn(tree.depth,initial) ? initial : tree.root;
      active = selected !== tree.root; pendingFrame = active;
      onSelection(selected,false); sync();
    },
    select(id) {
      if (!tree || !Object.hasOwn(tree.depth,id)) return;
      selected = id; hovered = null; active = true; pendingFrame = true;
      onSelection(id); sync();
    },
    hover(id) {
      if (!tree || (id !== null && !Object.hasOwn(tree.depth,id)) || hovered === id) return;
      hovered = id; send({type:'rcwm-preview',nodeId:id});
    }
  };
}
