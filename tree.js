const NS = 'http://www.w3.org/2000/svg';
export class RecursionTree {
  constructor(host, tree, onSelect, {compact = false} = {}) {
    this.host = host; this.tree = tree; this.onSelect = onSelect; this.compact = compact;
    this.buttons = new Map(); this.parents = {}; this.order = []; this.edges = [];
    this.canvas = document.createElement('div'); this.canvas.className = 'tree-canvas';
    this.canvas.setAttribute('role', compact ? 'group' : 'tree');
    this.canvas.setAttribute('aria-label', compact ? 'Recorded construction' : 'Delivered programs');
    const gap = 72, row = compact ? 65 : 118, top = compact ? 14 : 24;
    let leaf = 0; const positions = {};
    const place = id => {
      this.order.push(id);
      const kids = tree.children[id] || [];
      kids.forEach(child => { this.parents[child] = id; place(child); });
      const x = kids.length ? (positions[kids[0]].x + positions[kids.at(-1)].x) / 2 : 20 + leaf++ * gap;
      positions[id] = {x, y: top + tree.depth[id] * row};
    };
    place(tree.root);
    const width = 40 + leaf * gap, height = top * 2 + Math.max(...Object.values(tree.depth)) * row + (compact ? 48 : 94);
    this.canvas.style.width = `${width}px`; this.canvas.style.height = `${height}px`;
    const svg = document.createElementNS(NS, 'svg'); svg.classList.add('tree-connectors');
    svg.setAttribute('width', width); svg.setAttribute('height', height); svg.setAttribute('aria-hidden', 'true');
    this.canvas.append(svg);
    for (const id of this.order) {
      const p = positions[id];
      const parent = this.parents[id];
      if (parent) {
        const a = positions[parent], y1 = a.y + (compact ? 48 : 92), y2 = p.y, middle = (y1 + y2) / 2;
        const path = document.createElementNS(NS, 'path'); path.classList.add('tree-edge');
        path.setAttribute('d', `M${a.x + 34},${y1} V${middle} H${p.x + 34} V${y2}`);
        svg.append(path); this.edges.push({element: path, parent, child: id});
      }
      const button = document.createElement('button'); button.type = 'button';
      button.className = `tree-node depth-${tree.depth[id]}`; button.dataset.node = id;
      button.style.left = `${p.x}px`; button.style.top = `${p.y}px`;
      button.setAttribute('aria-label', `${id}, depth ${tree.depth[id]}`);
      if (!compact) {
        button.setAttribute('role', 'treeitem'); button.setAttribute('aria-level', tree.depth[id] + 1);
        button.setAttribute('aria-selected', 'false');
        const siblings = parent ? tree.children[parent] : [id];
        button.setAttribute('aria-posinset', siblings.indexOf(id) + 1); button.setAttribute('aria-setsize', siblings.length);
        if (tree.children[id]?.length) button.setAttribute('aria-expanded', 'true');
      }
      button.tabIndex = id === tree.root ? 0 : -1;
      const img = document.createElement('img'); img.src = `thumbs/${id}.webp`; img.alt = ''; img.width = 58; img.height = 43; img.loading = 'lazy';
      const label = document.createElement('span'); label.className = 'tree-label'; label.textContent = id;
      button.append(img, label); this.canvas.append(button); this.buttons.set(id, button);
      button.addEventListener('click', () => onSelect(id));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowUp') next = this.parents[id];
        if (event.key === 'ArrowDown') next = tree.children[id]?.[0];
        const available = compact ? this.order.filter(n => !this.buttons.get(n).hidden) : this.order;
        if (event.key === 'ArrowLeft') next = available[available.indexOf(id) - 1];
        if (event.key === 'ArrowRight') next = available[available.indexOf(id) + 1];
        if (event.key === 'Home') next = available[0];
        if (event.key === 'End') next = available.at(-1);
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
          event.preventDefault();
          if (next && !this.buttons.get(next).hidden) { if (!compact) onSelect(next); this.focus(next); }
        }
      });
    }
    host.append(this.canvas);
  }
  select(id) {
    this.buttons.forEach((button, node) => {
      if (!this.compact) button.setAttribute('aria-selected', String(node === id));
      button.tabIndex = node === id ? 0 : -1;
    });
    const ancestors = new Set(); let current = id;
    while (current) { ancestors.add(current); current = this.parents[current]; }
    this.edges.forEach(edge => edge.element.classList.toggle('selected-edge', ancestors.has(edge.child) && ancestors.has(edge.parent)));
  }
  focus(id) { this.buttons.get(id).focus({preventScroll:true}); this.reveal(id); }
  reveal(id) {
    const button = this.buttons.get(id);
    const left = button.offsetLeft, right = left + button.offsetWidth;
    if (left < this.host.scrollLeft || right > this.host.scrollLeft + this.host.clientWidth) this.host.scrollLeft = left - this.host.clientWidth / 2 + button.offsetWidth / 2;
  }
  playback(state) {
    this.buttons.forEach((button, id) => {
      const node = state.nodes[id]; button.hidden = !node;
      button.tabIndex = node ? 0 : -1;
      button.className = `tree-node depth-${this.tree.depth[id]} ${node ? `status-${node.status}` : ''} ${node?.render ? '' : 'no-render'}`;
      button.dataset.state = node?.status || 'unseen'; button.dataset.render = String(node?.render || false);
      button.setAttribute('aria-label', `${id}, ${node?.status || 'not yet called'}`);
    });
    this.edges.forEach(edge => { edge.element.style.display = state.nodes[edge.child] ? '' : 'none'; });
  }
}
