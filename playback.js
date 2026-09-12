import {stateAt,formatTime,describeEvent} from './run.js';

export function setupPlayback(host,{run,tree,nodes=[],thumbnail=id=>`thumbs/${id}.webp`,onSelect=()=>{}}) {
  host.classList.add('recorded-playback');
  host.innerHTML = `<div class="playback-head"><div><span class="playback-kicker">RECORDED EXECUTION</span><strong data-role="status">READY TO REPLAY</strong></div><div class="playback-readout"><span data-role="elapsed">00:00:00</span><span data-role="tokens">0 tokens</span></div></div>
    <div class="playback-event" aria-live="polite"><span data-role="number">000 / ${run.events.length}</span><p data-role="description">Press play to follow the recorded run.</p><button type="button" data-role="inspect" hidden>Inspect node ↗</button></div>
    <div class="playback-tree" data-role="tree" aria-label="Recorded construction"></div>
    <div class="playback-track"><input data-role="timeline" type="range" min="0" max="${run.duration}" value="0" aria-label="Recorded run timeline"><div data-role="ticks" aria-hidden="true"></div></div>
    <div class="playback-controls"><div><button type="button" data-role="restart">↺ Restart</button><button type="button" data-role="play" class="playback-primary">▶ Play</button><button type="button" data-role="step">Step →</button></div><label>Speed <input data-role="speed" type="range" min="0.5" max="4" step="0.5" value="1"><output data-role="speed-label">1×</output></label></div>
    <p class="playback-note">Recorded wall time is compressed to about 60 seconds at 1×. Node and token states come from the trace.</p>`;
  const q=role=>host.querySelector(`[data-role="${role}"]`), nodeInfo=new Map(nodes.map(node=>[node.id,node]));
  const elements={status:q('status'),elapsed:q('elapsed'),tokens:q('tokens'),number:q('number'),description:q('description'),inspect:q('inspect'),timeline:q('timeline'),speed:q('speed'),speedLabel:q('speed-label'),play:q('play')};
  const parents={}; Object.entries(tree.children || {}).forEach(([parent,children])=>children.forEach(child=>parents[child]=parent));
  const order=[]; const visit=id=>{order.push(id); (tree.children[id]||[]).forEach(visit)}; visit(tree.root);
  const treeHost=q('tree'),canvas=document.createElement('div'),svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),buttons=new Map(),edges=[];
  canvas.className='playback-tree-canvas'; svg.classList.add('playback-connectors'); svg.setAttribute('aria-hidden','true'); canvas.append(svg); treeHost.append(canvas);
  let leaf=0; const positions={};
  const place=id=>{const children=tree.children[id]||[]; children.forEach(place); positions[id]={x:children.length?(positions[children[0]].x+positions[children.at(-1)].x)/2:leaf++*130,y:(tree.depth[id]||0)*92}}; place(tree.root);
  const canvasWidth=Math.max(720,Math.max(1,leaf)*130),canvasHeight=Math.max(360,(Math.max(...Object.values(tree.depth))+1)*92+70);
  canvas.style.width=`${canvasWidth}px`;canvas.style.height=`${canvasHeight}px`;svg.setAttribute('viewBox',`0 0 ${canvasWidth} ${canvasHeight}`);
  for(const id of order) {
    const button=document.createElement('button'); button.type='button'; button.dataset.node=id; button.className='playback-node';
    button.style.left=`${positions[id].x+12}px`;button.style.top=`${positions[id].y+12}px`; button.hidden=true;
    const media=nodeInfo.get(id)?.finalURL ? `<span class="playback-render"><img src="${thumbnail(id)}" alt="" loading="lazy"></span>`:'';
    if(!media)button.classList.add('no-render-slot');
    button.innerHTML=`${media}<span class="playback-node-body"><span class="playback-node-label"><i class="playback-dot"></i>${id}</span><small>waiting</small></span>`;
    button.addEventListener('click',()=>onSelect(id)); canvas.append(button); buttons.set(id,button);
    if(parents[id]) {const from=positions[parents[id]],to=positions[id],path=document.createElementNS('http://www.w3.org/2000/svg','path'),y1=from.y+88,y2=to.y+12,middle=(y1+y2)/2;path.setAttribute('d',`M${from.x+72},${y1} V${middle} H${to.x+72} V${y2}`);svg.append(path);edges.push({path,child:id});}
  }
  run.events.forEach(event=>{const tick=document.createElement('i'); tick.style.left=`${run.duration ? event.elapsed/run.duration*100:0}%`; if(event.event==='child_return'&&event.delivered===true) tick.className='is-delivery'; q('ticks').append(tick)});
  let index=-1,elapsed=0,playing=false,frame=0,previousTime=0,currentId=tree.root,lastRevealedIndex=-2;
  const render=()=>{
    const state=stateAt(run,index);
    for(const [id,button] of buttons) {
      const item=state.nodes[id]; button.hidden=!item;
      if(!item) continue;
      const hasAsset=Boolean(nodeInfo.get(id)?.finalURL),hasRender=item.render&&hasAsset;
      button.dataset.state=item.status; button.className=`playback-node is-${item.status}${hasRender?' has-render':''}${hasAsset?'':' no-render-slot'}`;
      button.querySelector('small').textContent=item.status;
      const image=button.querySelector('.playback-render'); if(image) image.hidden=!hasRender;
      button.setAttribute('aria-label',`${id}, ${item.status}${hasRender?', render delivered':''}`);
    }
    for(const edge of edges) edge.path.toggleAttribute('hidden',!state.nodes[edge.child]);
    elements.number.textContent=`${String(index+1).padStart(3,'0')} / ${run.events.length}`;
    elements.tokens.textContent=state.tokenMissing ? `${state.tokens.toLocaleString()}+ known tokens · totals unavailable`:`${state.tokens.toLocaleString()} tokens`;
    if(index>=0) {
      const event=run.events[index]; currentId=state.wholeAgain || event.child || event.node_id;
      elements.description.textContent=describeEvent(event,state); elements.inspect.hidden=false;
      if(index!==lastRevealedIndex) {
        const button=buttons.get(currentId); lastRevealedIndex=index;
        if(button) {
          const left=button.offsetLeft,right=left+button.offsetWidth,top=button.offsetTop,bottom=top+button.offsetHeight;
          if(left<treeHost.scrollLeft)treeHost.scrollLeft=left-12; else if(right>treeHost.scrollLeft+treeHost.clientWidth)treeHost.scrollLeft=right-treeHost.clientWidth+12;
          if(top<treeHost.scrollTop)treeHost.scrollTop=top-12; else if(bottom>treeHost.scrollTop+treeHost.clientHeight)treeHost.scrollTop=bottom-treeHost.clientHeight+12;
        }
      }
    } else {elements.description.textContent='Press play to follow the recorded run.'; elements.inspect.hidden=true;}
    elements.status.textContent=index===run.events.length-1?'RUN COMPLETE':playing?'REPLAYING THE TRACE':index<0?'READY TO REPLAY':'PAUSED';
    elements.elapsed.textContent=formatTime(elapsed); elements.timeline.value=elapsed;
    elements.timeline.setAttribute('aria-valuetext',`${formatTime(elapsed)} elapsed, event ${index+1} of ${run.events.length}`);
  };
  const pause=()=>{playing=false; cancelAnimationFrame(frame); elements.play.textContent='▶ Play'; render()};
  const seek=time=>{elapsed=Math.max(0,Math.min(run.duration,Number(time)||0)); let next=-1; while(next+1<run.events.length&&run.events[next+1].elapsed<=elapsed) next++; index=next; render()};
  const animate=now=>{if(!playing)return; const delta=now-previousTime; previousTime=now; seek(elapsed+delta*run.duration/60000*Number(elements.speed.value)); if(elapsed>=run.duration) pause(); else frame=requestAnimationFrame(animate)};
  elements.play.addEventListener('click',()=>{if(playing){pause();return} if(index===run.events.length-1){index=-1;elapsed=0} playing=true; elements.play.textContent='Ⅱ Pause'; previousTime=performance.now(); render(); frame=requestAnimationFrame(animate)});
  q('step').addEventListener('click',()=>{pause(); if(index<run.events.length-1)index++; elapsed=run.events[index]?.elapsed||0; render()});
  q('restart').addEventListener('click',()=>{pause();index=-1;elapsed=0;render()});
  elements.timeline.addEventListener('input',()=>{const requested=Number(elements.timeline.value);pause();seek(requested)});
  elements.speed.addEventListener('input',()=>{elements.speedLabel.value=elements.speedLabel.textContent=`${elements.speed.value}×`});
  elements.inspect.addEventListener('click',()=>onSelect(currentId));
  const visibility=()=>{if(document.hidden&&playing)pause()}; document.addEventListener('visibilitychange',visibility);
  render();
  return {seek,step:()=>q('step').click(),pause,destroy(){pause();document.removeEventListener('visibilitychange',visibility);host.replaceChildren()},get state(){return {index,elapsed,playing}}};
}
