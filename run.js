export function prepareRun(trace, tree) {
  const events = trace.map((event, order) => ({...event, order, time: Date.parse(event.ts)}))
    .sort((a, b) => a.time - b.time || a.order - b.order);
  const start = events[0].time;
  events.forEach(event => { event.elapsed = event.time - start; });
  const nodeTokens = Object.fromEntries(Object.keys(tree.depth).map(id => [id, 0]));
  for (const event of events) if (event.event === 'session_end') nodeTokens[event.node_id] += Number(event.usage_total || 0);
  return {events, tree, start, duration: events.at(-1).elapsed, nodeTokens, totalTokens: Object.values(nodeTokens).reduce((a, b) => a + b, 0)};
}

export function stateAt(run, index) {
  const nodes = {};
  let tokens = 0, wholeAgain = null;
  const get = id => nodes[id] ||= {status: 'called', render: false, returned: false};
  for (const event of run.events.slice(0, index + 1)) {
    const node = get(event.node_id);
    wholeAgain = null;
    switch (event.event) {
      case 'session_start':
        if (node.returned) wholeAgain = event.node_id;
        node.status = node.returned ? 'integrating' : 'active';
        node.returned = false;
        break;
      case 'session_end':
        tokens += Number(event.usage_total || 0);
        node.status = 'waiting';
        break;
      case 'child_call':
        node.status = 'waiting';
        Object.assign(get(event.child), {status: 'called', render: false});
        break;
      case 'child_return':
        Object.assign(get(event.child), {status: event.delivered ? 'delivered' : 'incomplete', render: event.delivered === true});
        node.returned = true;
        break;
      case 'stop':
        node.status = event.stop_reason === 'visual_stop' ? 'delivered' : 'incomplete';
        node.render = event.stop_reason === 'visual_stop';
        break;
      case 'recover_children':
        node.status = 'recovering';
        break;
    }
  }
  return {nodes, tokens, wholeAgain};
}

export function cropInParent(child, parent) {
  const width = parent[2] - parent[0], height = parent[3] - parent[1];
  return {left: (child[0] - parent[0]) / width * 100, top: (child[1] - parent[1]) / height * 100,
    width: (child[2] - child[0]) / width * 100, height: (child[3] - child[1]) / height * 100};
}

export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
}

export function describeEvent(event, state) {
  const name = event.node_id;
  switch (event.event) {
    case 'session_start': return state.wholeAgain ? `${name} · whole again` : `${name} · session starts`;
    case 'session_end': return `${name} · session ends (+${Number(event.usage_total || 0).toLocaleString()} tokens)`;
    case 'child_call': return `${name} → ${event.child} · child called`;
    case 'child_return': return `${event.child} → ${name} · ${event.delivered ? 'delivered' : 'returned without an artifact'}`;
    case 'stop': return `${name} · ${event.stop_reason === 'visual_stop' ? 'delivery complete' : event.stop_reason.replaceAll('_', ' ')}`;
    case 'recover_children': return `${name} · recovering child solves`;
    default: return `${name} · ${event.event}`;
  }
}
