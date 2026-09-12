// A run directory plus one registry entry is enough to add another example.
const siteBase = new URL('./',import.meta.url);
export const assetURL = path => new URL(path,siteBase).href;
export async function read(path,type='json') {
  const response=await fetch(assetURL(path));
  if(!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response[type]();
}
export async function loadScene() {
  const scenes=await read('data/scenes.json');
  const requested=new URLSearchParams(location.search).get('scene');
  const scene=scenes.find(s=>s.id===requested)||scenes[0];
  const url=new URL(location.href);url.searchParams.set('scene',scene.id);history.replaceState(null,'',url);
  document.documentElement.dataset.scene=scene.id;
  const link=(page,node=null)=>{
    const url=new URL(page,siteBase);url.searchParams.set('scene',scene.id);
    if(node)url.searchParams.set('node',node);
    return `${url.pathname.split('/').at(-1)}${url.search}${url.hash}`;
  };
  for(const a of document.querySelectorAll('a[href]')){
    const url=new URL(a.getAttribute('href'),location.href);
    if(url.origin===location.origin&&/\/(index|explore|results|method)\.html$/.test(url.pathname)){
      url.searchParams.set('scene',scene.id);a.href=url.href;
    }
  }
  for(const host of document.querySelectorAll('[data-scene-switcher]')){
    const label=document.createElement('span');label.textContent='Example:';host.replaceChildren(label);
    const choices=document.createElement('div');choices.className='scene-options';choices.setAttribute('role','group');choices.setAttribute('aria-label','Choose an example');
    for(const entry of scenes){
      const a=document.createElement('a'),url=new URL(location.href);url.searchParams.set('scene',entry.id);url.searchParams.delete('node');
      if(location.pathname.endsWith('index.html')||location.pathname.endsWith('/'))url.hash='world';
      a.href=url.href;a.textContent=entry.name;a.dataset.scene=entry.id;
      if(entry.id===scene.id)a.setAttribute('aria-current','true');choices.append(a);
    }
    host.append(choices);
  }
  return {scene,scenes,link};
}
export function cropInParent(frame,parentFrame) {
  const [x,y,right,bottom]=frame,[px,py,pr,pb]=parentFrame;
  return {left:(x-px)/(pr-px)*100,top:(y-py)/(pb-py)*100,width:(right-x)/(pr-px)*100,height:(bottom-y)/(pb-py)*100};
}
export async function loadRun(scene) {
  const base=scene.runDirectory.replace(/\/$/,''),path=file=>`${base}/${file}`;
  const [tree,camera,trace,{parseTrace,prepareRun}]=await Promise.all([read(path('tree.json')),read(path('camera-contract.json')),read(path('events.jsonl'),'text'),import('./run.js')]);
  const run=prepareRun(parseTrace(trace),tree),parents={};
  Object.entries(tree.children).forEach(([id,children])=>children.forEach(child=>parents[child]=id));
  const rootSize=camera.resolution||[camera.width,camera.height],nodes={},pending=new Map();
  for(const [id,depth] of Object.entries(tree.depth)){
    const final=tree.final_render_source[id];
    nodes[id]={id,depth,parent:parents[id]||null,children:tree.children[id]||[],targetURL:path(`fractal/${id}/target.png`),finalURL:final?path(`fractal/${id}/${scene.renderFile||final}`):null};
  }
  const thumbnail=id=>scene.derivedDirectory?`${scene.derivedDirectory}/thumbs/${id}.webp`:nodes[id].finalURL||nodes[id].targetURL;
  async function getNode(id){
    if(!nodes[id])throw new Error(`Unknown node ${id}`);
    if(pending.has(id))return pending.get(id);
    const request=(async()=>{
      const folder=path(`fractal/${id}`),node=nodes[id];
      const [part,view,brief,account]=await Promise.all([read(`${folder}/part.json`),read(`${folder}/view.json`),read(`${folder}/brief.md`,'text'),read(`${folder}/account.md`,'text')]);
      const module=(part.module||'scene.js').replace(/^\.\//,'');
      const code=(await read(`${folder}/${module}`,'text')).split('\n').slice(0,25).join('\n');
      let frame=view.crop_root_px;
      if(!frame&&view.crop_px){const [x,y,w,h]=view.crop_px;frame=[x,y,x+w,y+h];}
      frame=frame||[0,0,...rootSize];
      const targetSize=view.target_size||view.output_size||rootSize;
      const paragraphs=account.split(/\n\s*\n/).map(p=>p.trim()).filter(p=>p&&!p.startsWith('#'));
      let excerpt=paragraphs.find(p=>/^(Round [01]|Final round)/.test(p))||paragraphs[0]||'';
      if(excerpt.length>850)excerpt=excerpt.slice(0,850).replace(/\s+\S*$/,'')+'…';
      let matchedURL=node.finalURL;
      if(node.finalURL&&scene.derivedDirectory)matchedURL=`${scene.derivedDirectory}/matched/${id}.webp`;
      // New raw runs also work without preparing display derivatives.
      else if(node.finalURL){
        const image=new Image();image.src=assetURL(node.finalURL);await image.decode();
        if(id!==tree.root&&image.naturalWidth===rootSize[0]&&image.naturalHeight===rootSize[1]&&(frame[2]-frame[0]!==rootSize[0]||frame[3]-frame[1]!==rootSize[1])){
          const canvas=document.createElement('canvas');[canvas.width,canvas.height]=targetSize;
          canvas.getContext('2d').drawImage(image,...frame.slice(0,2),frame[2]-frame[0],frame[3]-frame[1],0,0,...targetSize);
          matchedURL=canvas.toDataURL('image/png');
        }
      }
      const briefExcerpt=brief.split(/\n\s*\n/).map(p=>p.trim()).find(p=>p&&!p.startsWith('#'))||brief;
      Object.assign(node,{view,frame,targetSize,brief,briefExcerpt,account:excerpt,module,code,matchedURL,briefURL:`${folder}/brief.md`,accountURL:`${folder}/account.md`,moduleURL:`${folder}/${module}`,finalSource:tree.final_render_source[id]});
      return node;
    })();pending.set(id,request);return request;
  }
  return {tree,run,nodes,getNode,thumbnail,rootSize};
}
