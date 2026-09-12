import {setupWorld} from './world-ui.js';
import {loadScene,loadRun,read,cropInParent} from './scenes.js';
const $=id=>document.getElementById(id);
const paperURL=typeof ARXIV_URL==='string'?ARXIV_URL:'#';
document.querySelectorAll('[data-paper-link]').forEach(link=>{if(paperURL!=='#')link.href=paperURL;});
if($('arxiv-link'))$('arxiv-link').href=paperURL;
$('code-link')?.addEventListener('click',event=>event.preventDefault());
$('copy-bibtex')?.addEventListener('click',async()=>{
  const citation=$('bibtex-code');
  try{await navigator.clipboard.writeText(citation.textContent);$('copy-status').textContent='Copied to clipboard.';}
  catch{citation.parentElement.focus({preventScroll:true});const range=document.createRange();range.selectNodeContents(citation);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);$('copy-status').textContent='Citation selected. Use your device’s Copy command.';}
});
$('compare-slider')?.addEventListener('input',event=>{
  const value=Number(event.target.value);$('comparison').style.setProperty('--split',`${value}%`);
  event.target.setAttribute('aria-valuetext',`${value}% reference, ${100-value}% reconstruction`);
});
function fail(error){
  const host=$('load-error');if(host){host.hidden=false;host.textContent='The page data could not load. Please reload the page.';}
  console.error(error);
}
function novelViews(host,scene){
  if(!host)return;host.replaceChildren();
  for(const view of scene.novelViews){
    const figure=document.createElement('figure'),a=document.createElement('a'),img=document.createElement('img'),caption=document.createElement('figcaption');
    const src=typeof view==='string'?view:view.src,label=typeof view==='string'?'Another camera':view.caption;
    img.src=src;img.alt=`${scene.name}: ${label}`;img.loading='lazy';a.href=src;a.target='_blank';a.rel='noopener';a.append(img);caption.textContent=label;figure.append(a,caption);host.append(figure);
  }
}
function updateMedia(scene,link){
  if($('comparison')){
    const imgs=$('comparison').querySelectorAll('img');imgs[0].src=scene.finalRender;imgs[0].alt=`${scene.name}: our reconstruction`;imgs[1].src=scene.referenceImage;imgs[1].alt=`${scene.name}: reference image`;
  }
  document.querySelectorAll('[data-scene-comparison]').forEach(figure=>{
    const source=scene.comparisonFigure,src=typeof source==='string'?source:source.src,original=typeof source==='string'?source:source.original||source.src;
    const caption=`${scene.name}: the whole scene and its details across reconstruction methods.`;
    figure.querySelector('a').href=original;figure.querySelector('a').setAttribute('aria-label',`Open full-size comparison: ${scene.name}`);
    figure.querySelector('img').src=src;figure.querySelector('img').alt=caption;figure.querySelector('img').removeAttribute('width');figure.querySelector('img').removeAttribute('height');figure.querySelector('figcaption').textContent=caption;
  });
  novelViews($('viewer-fallback')?.querySelector('.novel-grid'),scene);
  if($('fallback-caption'))$('fallback-caption').textContent=`The live viewer could not load in this browser. These ${scene.novelViews.length} saved renders show the delivered scene from other cameras.`;
  if($('example-title')){
    $('example-title').textContent=scene.name;$('example-reference').src=scene.referenceImage;$('example-reference').alt=`${scene.name}: reference`;
    $('example-reference-link').href=scene.referenceImage;$('example-final').src=scene.finalRender;$('example-final').alt=`${scene.name}: our reconstruction`;
    $('example-final-link').href=scene.hiResRender;$('example-explore').href=link('explore.html');novelViews($('example-novel-views'),scene);
  }
}
function depthControls(tree){
  const max=Math.max(...Object.values(tree.depth));
  for(const legend of document.querySelectorAll('[data-depth-legend]')){
    legend.innerHTML='<span>Depth</span>';
    for(let level=0;level<=max;level++){const i=document.createElement('i');i.className=`depth-${level}`;i.textContent=level;legend.append(i);}
  }
  const host=document.querySelector('.depth-steps');host.replaceChildren();
  for(let level=0;level<=max;level++){
    const b=document.createElement('button');b.type='button';b.dataset.worldDepth=level;b.disabled=true;b.setAttribute('aria-pressed',String(level===max));b.textContent=level===0?'Root only':level===max?`All ${max+1} levels`:`+ Level ${level}`;host.append(b);
  }
  return max;
}
async function startTree(scene,link){
  const [{tree:treeData,run,nodes,getNode,thumbnail},{RecursionTree}]=await Promise.all([loadRun(scene),import('./tree.js')]);
  const world=setupWorld(depthControls(treeData)),overview=!!$('overview-tree');
  const tree=new RecursionTree($(overview?'overview-tree':'explore-tree'),treeData,id=>world.select(id),{onPreview:id=>world.hover(id),fitDesktop:overview,thumbnail});
  let selectionVersion=0;
  async function update(id,updateURL=true){
    const version=++selectionVersion;tree.select(id);
    const panel=$(overview?'overview-node-panel':'node-detail');panel.setAttribute('aria-busy','true');
    if(updateURL){const url=new URL(location.href);url.searchParams.set('node',id);history.replaceState(null,'',url);}
    const node=await getNode(id);const parent=!overview&&node.parent?await getNode(node.parent):null;
    if(version!==selectionVersion)return;
    panel.dataset.node=id;
    $(overview?'preview-node-name':'node-name').textContent=id;$(overview?'preview-depth':'node-depth').textContent=`Depth ${node.depth}`;
    const target=$(overview?'preview-target':'node-target'),rendered=$(overview?'preview-render':'node-final');
    target.src=node.targetURL;target.alt=`Reference target received by ${id}`;
    rendered.closest('figure').hidden=!node.finalURL;panel.querySelector('.matched-pair').classList.toggle('single-render',!node.finalURL);
    if(node.finalURL){rendered.src=node.matchedURL;rendered.alt=`Supplied render of ${id}, matched to its target crop`;}
    else rendered.removeAttribute('src');
    for(const image of [target,rendered]){[image.width,image.height]=node.targetSize;image.style.aspectRatio=`${node.targetSize[0]} / ${node.targetSize[1]}`;}
    $(overview?'preview-target-link':'target-link').href=node.targetURL;
    $(overview?'preview-render-link':'final-link').href=node.finalURL||node.targetURL;
    $(overview?'preview-brief':'node-brief').textContent=node.briefExcerpt;
    $(overview?'preview-brief-link':'brief-link').href=node.briefURL;
    if(overview){
      $('full-run-link').href=link('explore.html',id);$('recursion-preview').dataset.node=id;
      $('preview-note').textContent=node.parent?`A subprogram of ${node.parent}.`:'The root assembles the whole scene from its child programs.';
    }else{
      const lineage=[];let ancestor=node;while(ancestor){lineage.unshift(ancestor.id);ancestor=nodes[ancestor.parent];}$('breadcrumb').textContent=lineage.join(' / ');
      $('node-tokens').textContent=run.nodeTokens[id]===null?'Tokens: not recorded':`${run.nodeTokens[id].toLocaleString()} tokens`;
      $('image-note').textContent=node.finalURL?'Target and render shown at matched size. Open either image to see its original file.':'Target crop received by this program.';
      $('node-account').textContent=node.account||'No account text was supplied.';$('account-link').href=node.accountURL;
      $('node-code').textContent=node.code;$('module-link').textContent=`${node.module} ↗`;$('module-link').href=node.moduleURL;
      $('parent-context').hidden=!parent||!parent.finalURL;
      if(parent?.finalURL){
        $('parent-render').src=parent.matchedURL;$('parent-render').alt=`${parent.id}'s render with the ${id} crop outlined`;
        [$('parent-render').width,$('parent-render').height]=parent.targetSize;
        const crop=cropInParent(node.frame,parent.frame);for(const [key,value]of Object.entries(crop))$('crop-outline').style[key]=`${value}%`;
        $('parent-caption').textContent=`The outline locates this node’s target window in ${parent.id}.`;
        $('crop-coordinates').textContent=`Root-image window: [${node.frame.join(', ')}]`;
      }
      $('node-jumps').replaceChildren();
      const jump=(target,label)=>{const a=document.createElement('a');a.href=link('explore.html',target);a.textContent=label;a.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();world.select(target);});$('node-jumps').append(a);};
      if(node.parent)jump(node.parent,`↑ Parent: ${node.parent}`);
      const label=document.createElement('span');label.textContent=node.children.length?'Children':'Leaf program';$('node-jumps').append(label);node.children.forEach(child=>jump(child,`↓ ${child}`));
    }
    panel.setAttribute('aria-busy','false');
  }
  const initial=new URLSearchParams(location.search).get('node')||treeData.root;
  world.bind(treeData,(id,updateURL)=>update(id,updateURL).catch(fail),initial);
  const viewer=$('world-viewer'),url=new URL(scene.viewerEntry,location.href);url.searchParams.set('scene',scene.id);viewer.title=`Interactive 3D reconstruction: ${scene.name}`;viewer.src=url.href;
  getNode(treeData.root).then(root=>document.querySelectorAll('[data-root-program]').forEach(a=>a.href=root.moduleURL)).catch(fail);
  if(!overview){
    const {setupPlayback}=await import('./playback.js');
    setupPlayback($('playback'),{run,tree:treeData,nodes:Object.values(nodes),thumbnail,onSelect:id=>{world.select(id);$('node-detail').scrollIntoView({block:'start',behavior:'instant'});}});
  }
  await getNode(Object.hasOwn(nodes,initial)?initial:treeData.root);
}
async function start(){
  const {scene,link}=await loadScene();updateMedia(scene,link);
  if($('solver-instruction')){
    const [text,{instructionHTML}]=await Promise.all([read('data/solver-instruction.md','text'),import('./method.js')]);
    $('solver-instruction').innerHTML=instructionHTML(text);$('solver-instruction').setAttribute('aria-busy','false');
  }
  if($('overview-tree')||$('explore-tree'))await startTree(scene,link);
  document.documentElement.dataset.ready='true';
}
start().catch(fail);
