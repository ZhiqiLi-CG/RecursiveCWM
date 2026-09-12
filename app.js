import {setupWorld} from './world-ui.js';
const world = setupWorld();
const $ = id => document.getElementById(id);
const paperURL = typeof ARXIV_URL === 'string' ? ARXIV_URL : '#';
document.querySelectorAll('[data-paper-link]').forEach(link => {
  if (paperURL !== '#') link.href = paperURL;
});
if ($('arxiv-link')) $('arxiv-link').href = paperURL;
$('code-link')?.addEventListener('click', event => event.preventDefault());
$('copy-bibtex')?.addEventListener('click', async () => {
  const citation = $('bibtex-code');
  try {
    await navigator.clipboard.writeText(citation.textContent);
    $('copy-status').textContent = 'Copied to clipboard.';
  } catch {
    citation.parentElement.focus({preventScroll:true});
    const range = document.createRange(); range.selectNodeContents(citation);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    $('copy-status').textContent = 'Citation selected. Use your device’s Copy command.';
  }
});
$('compare-slider')?.addEventListener('input', event => {
  const value = Number(event.target.value);
  $('comparison').style.setProperty('--split', `${value}%`);
  event.target.setAttribute('aria-valuetext', `${value}% reference, ${100-value}% reconstruction`);
});
async function get(url, type = 'json') {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response[type]();
}
// Load the long instruction only when its disclosure is opened.
const instruction = document.querySelector('.instruction');
instruction?.addEventListener('toggle', async () => {
  if (!instruction.open || instruction.dataset.loaded) return;
  try {
    $('solver-instruction').textContent = await get('data/solver-instruction.md','text');
    instruction.dataset.loaded = 'true';
  } catch {
    $('solver-instruction').textContent = 'The instruction could not load. Use the download link below.';
  }
});
function fail(error) {
  if ($('load-error')) {
    $('load-error').hidden = false;
    $('load-error').textContent = 'The run data could not load. Please reload the page.';
  }
  console.error(error);
}
async function preview() {
  const nodes = await get('data/nodes.json');
  const buttons = [...document.querySelectorAll('[data-preview-node]')];
  const select = (button, notify = true) => {
    const id = button.dataset.previewNode, node = nodes[id];
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    $('preview-node-name').textContent = button.textContent;
    $('preview-depth').textContent = `Depth ${node.depth}`;
    $('preview-target').src = `fractal/${id}/target.png`;
    $('preview-target').alt = `Reference target received by ${id}`;
    $('preview-render').src = `matched/${id}.png`;
    $('preview-render').alt = `Delivered render of ${id}, matched to its target crop`;
    $('preview-target-link').href = `fractal/${id}/target.png`;
    $('preview-render-link').href = `fractal/${id}/FINAL.png`;
    $('full-run-link').href = `explore.html?node=${encodeURIComponent(id)}`;
    $('recursion-preview').dataset.node = id;
    if (notify) world.select(id);
    $('preview-note').textContent = node.parent
      ? `${id} reconstructs a part of ${node.parent} and returns its scene program.`
      : 'The root establishes the whole scene and integrates the programs returned by its parts.';
  };
  buttons.forEach(button => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('pointerenter', () => world.hover(button.dataset.previewNode));
    button.addEventListener('pointerleave', () => world.hover(null));
    button.addEventListener('focus', () => world.hover(button.dataset.previewNode));
    button.addEventListener('blur', () => world.hover(null));
  });
  select(buttons[0],false);
  document.documentElement.dataset.ready = 'true';
}
async function explore() {
  const [treeData, nodes, {RecursionTree}] = await Promise.all([get('data/tree.json'), get('data/nodes.json'), import('./tree.js')]);
  let tree;
  function select(id, updateURL = true) {
    if (!nodes[id]) id = treeData.root;
    const node = nodes[id];
    if (updateURL || id !== treeData.root) world.select(id);
    tree.select(id); tree.reveal(id);
    $('node-detail').dataset.node = id; $('node-detail').setAttribute('aria-busy','false');
    $('node-name').textContent = id;
    const lineage = []; let ancestor = node;
    while (ancestor) { lineage.unshift(ancestor.id); ancestor = nodes[ancestor.parent]; }
    $('breadcrumb').textContent = lineage.join(' / ');
    $('node-depth').textContent = `Depth ${node.depth}`;
    $('node-target').src = `fractal/${id}/target.png`; $('node-target').alt = `Reference target received by ${id}`;
    $('node-final').src = `matched/${id}.png`; $('node-final').alt = `Delivered render of ${id}, in the target crop`;
    for (const image of [$('node-target'),$('node-final')]) {
      [image.width, image.height] = node.targetSize;
    }
    $('target-link').href = `fractal/${id}/target.png`;
    $('final-link').href = `fractal/${id}/FINAL.png`;
    $('image-note').textContent = node.croppedFromRoot
      ? 'Delivered render matched to the recorded crop. Open either image to see its original file.'
      : 'Target and render shown at matched size. Open either image to see its original file.';
    $('node-brief').textContent = node.brief.split('\n\n')[0];
    $('brief-link').href = `fractal/${id}/brief.md`;
    $('node-code').textContent = node.code;
    $('module-link').textContent = `${node.module} ↗`; $('module-link').href = `fractal/${id}/${node.module}`;
    $('node-jumps').replaceChildren();
    const jump = (target, label) => {
      const link = document.createElement('a'); link.href = `explore.html?node=${encodeURIComponent(target)}`; link.textContent = label;
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); select(target); $('node-name').tabIndex = -1; $('node-name').focus({preventScroll:true});
      });
      $('node-jumps').append(link);
    };
    if (node.parent) jump(node.parent, `↑ Parent: ${node.parent}`);
    const label = document.createElement('span'); label.textContent = node.children.length ? 'Children' : 'Leaf program'; $('node-jumps').append(label);
    node.children.forEach(child => jump(child, `↓ ${child}`));
    if (updateURL) {
      const url = new URL(location.href); url.searchParams.set('node',id); history.replaceState(null,'',url);
    }
  }
  tree = new RecursionTree($('explore-tree'),treeData,select);
  for (const [id,button] of tree.buttons) {
    button.addEventListener('pointerenter', () => world.hover(id));
    button.addEventListener('pointerleave', () => world.hover(null));
    button.addEventListener('focus', () => world.hover(id));
    button.addEventListener('blur', () => world.hover(null));
  }
  select(new URLSearchParams(location.search).get('node') || treeData.root,false);
  document.documentElement.dataset.ready = 'true';
}
if ($('recursion-preview')) preview().catch(fail);
else if ($('explore-tree')) explore().catch(fail);
else document.documentElement.dataset.ready = 'true';

