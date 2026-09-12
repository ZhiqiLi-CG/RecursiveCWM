/** Parse the recorded JSONL. The City trace contains one narrowly known defect:
 * an empty usage_total value. Repair only that value and retain every record. */
export function parseTrace(text) {
  return String(text).split(/\r?\n/).flatMap((line, lineIndex) => {
    if (!line.trim()) return [];
    const repaired = line.replace(/"usage_total"\s*:\s*}/g, '"usage_total":null}');
    try { return [{...JSON.parse(repaired), sourceOrder: lineIndex}]; }
    catch (error) { throw new SyntaxError(`Invalid trace record at line ${lineIndex + 1}: ${error.message}`); }
  });
}

export function prepareRun(trace, tree) {
  const events = trace.map((event, index) => ({...event, order: index, time: Date.parse(event.ts)}));
  if (events.some(event => !Number.isFinite(event.time))) throw new TypeError('Trace contains an invalid timestamp');
  events.sort((a,b) => a.time-b.time || a.order-b.order);
  const start = events[0]?.time ?? 0;
  events.forEach(event => { event.elapsed = event.time-start; });
  const ids = new Set([...Object.keys(tree.depth || {}), ...events.map(event => event.node_id)]);
  const sums = Object.fromEntries([...ids].map(id => [id, 0]));
  const nodeTokenMissing = Object.fromEntries([...ids].map(id => [id, false]));
  for (const event of events) if (event.event === 'session_end') {
    if (event.usage_total === null || event.usage_total === undefined || !Number.isFinite(Number(event.usage_total))) nodeTokenMissing[event.node_id] = true;
    else sums[event.node_id] += Number(event.usage_total);
  }
  const nodeTokens = Object.fromEntries([...ids].map(id => [id, nodeTokenMissing[id] ? null : sums[id]]));
  const anyMissing = Object.values(nodeTokenMissing).some(Boolean);
  return {events,tree,start,duration:events.at(-1)?.elapsed || 0,nodeTokens,nodeTokenMissing,
    totalTokens:anyMissing ? null : Object.values(sums).reduce((sum,value) => sum+value,0)};
}

export function stateAt(run,index) {
  const nodes = {}; let tokens = 0, tokenMissing = false, wholeAgain = null;
  const get = id => nodes[id] ||= {status:'called',render:false,returned:false};
  for (const event of run.events.slice(0,index+1)) {
    const node = get(event.node_id); wholeAgain = null;
    switch (event.event) {
      case 'session_start':
        if (node.returned) wholeAgain = event.node_id;
        node.status = node.returned ? 'integrating' : 'active'; node.returned = false; break;
      case 'session_end':
        if (event.usage_total === null || event.usage_total === undefined) tokenMissing = true;
        else tokens += Number(event.usage_total);
        node.status = 'waiting'; break;
      case 'child_call':
        node.status = 'waiting'; Object.assign(get(event.child),{status:'called',render:false}); break;
      case 'child_return':
        Object.assign(get(event.child),{status:event.delivered === true ? 'delivered':'incomplete',render:event.delivered === true});
        node.returned = true; break;
      case 'stop':
        node.status = event.stop_reason === 'visual_stop' ? 'delivered':'incomplete';
        node.render = event.stop_reason === 'visual_stop'; break;
      case 'recover_children': node.status = 'recovering'; break;
    }
  }
  return {nodes,tokens,tokenMissing,wholeAgain};
}

export function formatTime(ms) {
  const seconds=Math.floor(Math.max(0,ms)/1000);
  return [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
}

export function describeEvent(event,state) {
  const name=event.node_id;
  switch(event.event) {
    case 'session_start': return state.wholeAgain ? `${name} · whole again`:`${name} · session starts`;
    case 'session_end': return event.usage_total == null ? `${name} · session ends (token count unavailable)`:`${name} · session ends (+${Number(event.usage_total).toLocaleString()} tokens)`;
    case 'child_call': return `${name} → ${event.child} · child called`;
    case 'child_return': return `${event.child} → ${name} · ${event.delivered === true ? 'delivered':'returned without an artifact'}`;
    case 'stop': return `${name} · ${event.stop_reason === 'visual_stop' ? 'delivery complete':String(event.stop_reason).replaceAll('_',' ')}`;
    case 'recover_children': return `${name} · recovering child solves`;
    default: return `${name} · ${event.event}`;
  }
}
