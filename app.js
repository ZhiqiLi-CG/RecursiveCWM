import { prepareRun, cropInParent } from './run.js';
import { RecursionTree } from './tree.js';
import { setupPlayback } from './playback.js';
const $ = id => document.getElementById(id);
$('compare-slider').addEventListener('input', event => {
  const value = event.target.value;
  $('comparison').style.setProperty('--split', `${value}%`);
  event.target.setAttribute('aria-valuetext', `${value}% reference, ${100 - value}% reconstruction`);
});

async function get(url, type = 'json') {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response[type]();
}

async function start() {
  const [treeData, nodes, traceText, instruction] = await Promise.all([
    get('data/tree.json'), get('data/nodes.json'), get('data/events.jsonl', 'text'), get('data/solver-instruction.md','text')
  ]);
  const run = prepareRun(traceText.trim().split('\n').map(JSON.parse), treeData);
  let tree;
  function selectNode(id, scroll = false) {
    if (!nodes[id]) return;
    const node = nodes[id];
    tree.select(id); tree.reveal(id);
    $('node-detail').dataset.node = id;
    $('node-detail').setAttribute('aria-busy', 'false');
    $('node-name').textContent = id;
    const lineage = []; let ancestor = node;
    while (ancestor) { lineage.unshift(ancestor.id); ancestor = nodes[ancestor.parent]; }
    $('breadcrumb').textContent = lineage.join(' / ');
    $('node-depth').textContent = `Depth ${node.depth}`;
    $('node-tokens').textContent = run.nodeTokens[id].toLocaleString();
    $('node-target').src = `fractal/${id}/target.png`; $('node-target').alt = `Reference target received by ${id}`;
    $('node-final').src = `matched/${id}.png`; $('node-final').alt = `Delivered render of ${id}, in the target crop`;
    for (const img of [$('node-target'), $('node-final')]) {
      img.width = node.targetSize[0]; img.height = node.targetSize[1];
      img.style.setProperty('--node-ratio', `${node.targetSize[0]} / ${node.targetSize[1]}`);
    }
    $('target-link').href = `fractal/${id}/target.png`; $('target-link').setAttribute('aria-label', `Open full-size ${id} target`);
    $('final-link').href = `fractal/${id}/FINAL.png`; $('final-link').setAttribute('aria-label', `Open original ${id} delivered render`);
    $('image-note').textContent = node.croppedFromRoot ? 'Matched to the recorded crop. Click either image to open its original file.' : 'Shown at matched size. Click either image to open its original file.';
    $('node-brief').textContent = node.brief.split('\n\n')[0];
    $('brief-link').href = `fractal/${id}/brief.md`;
    $('node-account').textContent = node.account || 'No account was provided for this node.';
    $('account-link').href = `fractal/${id}/account.md`; $('account-link').hidden = !node.account;
    $('node-code').textContent = node.code;
    $('module-link').textContent = `${node.module} ↗`; $('module-link').href = `fractal/${id}/${node.module}`;
    $('parent-context').hidden = !node.parent; $('root-context').hidden = !!node.parent;
    if (node.parent) {
      const parent = nodes[node.parent], crop = cropInParent(node.frame, parent.frame);
      $('parent-render').src = `matched/${parent.id}.png`; $('parent-render').alt = `${parent.id}'s delivered render with the ${id} crop outlined`;
      $('parent-render').width = parent.targetSize[0]; $('parent-render').height = parent.targetSize[1];
      for (const [key, value] of Object.entries(crop)) $('crop-outline').style[key] = `${value}%`;
      $('parent-caption').textContent = `The outlined region is this node’s target window in ${parent.id}.`;
      $('crop-coordinates').textContent = `Root pixels: [${node.frame.join(', ')}]${node.view.magnification ? ` · ${node.view.magnification}× crop` : ''}`;
    }
    $('node-jumps').replaceChildren();
    const jump = (target, label) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
      button.addEventListener('click', () => selectNode(target)); $('node-jumps').append(button);
    };
    if (node.parent) jump(node.parent, `↑ ${node.parent}`);
    const label = document.createElement('span'); label.textContent = node.children.length ? 'Children' : 'Leaf node · no further descent'; $('node-jumps').append(label);
    node.children.forEach(child => jump(child, `↓ ${child}`));
    if (scroll) {
      $('node-detail').scrollIntoView({behavior:'instant', block:'start'});
      $('node-name').tabIndex = -1; $('node-name').focus({preventScroll:true});
    }
  }
  tree = new RecursionTree($('explore-tree'), treeData, id => selectNode(id));
  selectNode(treeData.root);
  setupPlayback(run, selectNode);
  $('solver-instruction').textContent = instruction;
  document.documentElement.dataset.ready = 'true';
}
start().catch(error => {
  $('load-error').hidden = false;
  $('load-error').textContent = `The run data could not load. Serve this directory with a local HTTP server, then reload. ${error.message}`;
  console.error(error);
});

const iframe = $('world-viewer');
let viewerReady = false, viewerTimer;
function fallback(message) {
  if (viewerReady) return;
  clearTimeout(viewerTimer);
  $('viewer-loading').hidden = true; $('viewer-frame').hidden = true;
  $('viewer-fallback').hidden = false; $('viewer-status').textContent = 'Saved camera views';
  $('viewer-gestures').hidden = true;
  $('reset-camera').disabled = true;
  $('fallback-caption').textContent = 'The live viewer could not load in this browser. These five saved renders show the delivered scene from other cameras.';
}
window.addEventListener('message', event => {
  if (event.source !== iframe.contentWindow || event.origin !== location.origin) return;
  if (event.data?.type === 'rcwm-ready') {
    viewerReady = true; clearTimeout(viewerTimer);
    $('viewer-frame').hidden = false; $('viewer-loading').hidden = true; $('viewer-fallback').hidden = true;
    $('viewer-gestures').hidden = false;
    $('viewer-status').textContent = 'Live scene · Three.js'; $('reset-camera').disabled = false;
  }
  if (event.data?.type === 'rcwm-error') { viewerReady = false; fallback(event.data.message); }
});
$('reset-camera').addEventListener('click', () => iframe.contentWindow.postMessage({type:'rcwm-reset'}, location.origin));
const observer = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    if (!viewerReady) viewerTimer = setTimeout(() => fallback('initialization timed out'), 90000);
    observer.disconnect();
  }
}, {rootMargin:'400px'});
observer.observe(iframe);
