const NS = 'http://www.w3.org/2000/svg';
export class RecursionTree {
  constructor(host, tree, onSelect, {onPreview = () => {}, fitDesktop = false, thumbnail = id => `thumbs/${id}.webp`} = {}) {
    this.host = host; this.tree = tree;
    this.buttons = new Map(); this.parents = {}; this.order = []; this.edges = [];
    this.canvas = document.createElement('div'); this.canvas.className = 'tree-canvas';
    this.canvas.setAttribute('role','tree'); this.canvas.setAttribute('aria-label','Delivered scene programs');
    const positions = {}; let leaves = 0;
    const cardHeight = 108, rowHeight = 132;
    const place = id => {
      this.order.push(id);
      const children = tree.children[id] || [];
      children.forEach(child => { this.parents[child] = id; place(child); });
      positions[id] = children.length ? (positions[children[0]] + positions[children.at(-1)]) / 2 : leaves++;
    };
    place(tree.root);
    const svg = document.createElementNS(NS,'svg'); svg.classList.add('tree-connectors'); svg.setAttribute('aria-hidden','true'); this.canvas.append(svg);
    for (const id of this.order) {
      const parent = this.parents[id], siblings = parent ? tree.children[parent] : [id];
      if (parent) {
        const path = document.createElementNS(NS,'path'); path.classList.add('tree-edge'); svg.append(path);
        this.edges.push({element:path,parent,child:id});
      }
      const button = document.createElement('button'); button.type = 'button';
      button.className = `tree-node depth-${tree.depth[id]}`; button.dataset.node = id;
      button.setAttribute('aria-label',`${id}, depth ${tree.depth[id]}`); button.title = id;
      button.setAttribute('role','treeitem'); button.setAttribute('aria-level',tree.depth[id]+1);
      button.setAttribute('aria-selected','false'); button.setAttribute('aria-posinset',siblings.indexOf(id)+1); button.setAttribute('aria-setsize',siblings.length);
      if (tree.children[id]?.length) button.setAttribute('aria-expanded','true');
      button.tabIndex = id === tree.root ? 0 : -1;
      const img = document.createElement('img'); img.src = thumbnail(id); img.alt = ''; img.width = 68; img.height = 47; img.loading = 'lazy';
      const label = document.createElement('span'); label.className = 'tree-label'; label.textContent = id;
      button.append(img,label); this.canvas.append(button); this.buttons.set(id,button);
      button.addEventListener('click',() => onSelect(id));
      button.addEventListener('pointerenter',() => onPreview(id));
      button.addEventListener('pointerleave',() => onPreview(null));
      button.addEventListener('focus',() => onPreview(id));
      button.addEventListener('blur',() => onPreview(null));
      button.addEventListener('keydown',event => {
        const next = {
          ArrowUp: this.parents[id], ArrowDown: tree.children[id]?.[0],
          ArrowLeft: siblings[siblings.indexOf(id)-1], ArrowRight: siblings[siblings.indexOf(id)+1],
          Home: this.order[0], End: this.order.at(-1)
        }[event.key];
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
          event.preventDefault();
          if (next) { this.focus(next); onSelect(next); }
        }
      });
    }
    host.append(this.canvas);
    const layout = () => {
      const gap = fitDesktop && innerWidth >= 900 ? Math.min(74,(host.clientWidth-14)/leaves) : 74;
      const card = Math.min(72,gap-2), width = 14+leaves*gap, height = 48+Math.max(...Object.values(tree.depth))*rowHeight+cardHeight;
      this.canvas.style.width = `${width}px`; this.canvas.style.height = `${height}px`;
      this.canvas.style.setProperty('--tree-card-width',`${card}px`);
      this.canvas.style.setProperty('--tree-card-height',`${cardHeight}px`);
      svg.setAttribute('width',width); svg.setAttribute('height',height);
      for (const [id,button] of this.buttons) {
        button.style.left = `${7+positions[id]*gap}px`; button.style.top = `${24+tree.depth[id]*rowHeight}px`;
      }
      for (const edge of this.edges) {
        const x1 = 7+positions[edge.parent]*gap+card/2, x2 = 7+positions[edge.child]*gap+card/2;
        const y1 = 24+tree.depth[edge.parent]*rowHeight+cardHeight, y2 = 24+tree.depth[edge.child]*rowHeight, middle = (y1+y2)/2;
        edge.element.setAttribute('d',`M${x1},${y1} V${middle} H${x2} V${y2}`);
      }
      if (this.selected) this.reveal(this.selected);
    };
    this.resizeObserver = new ResizeObserver(layout); this.resizeObserver.observe(host); layout();
  }
  select(id) {
    this.selected = id;
    const ancestors = new Set(); let current = id;
    while (current) { ancestors.add(current); current = this.parents[current]; }
    this.buttons.forEach((button,node) => {
      button.setAttribute('aria-selected',String(node === id)); button.tabIndex = node === id ? 0 : -1;
      button.classList.toggle('is-ancestor',node !== id && ancestors.has(node));
    });
    this.edges.forEach(edge => edge.element.classList.toggle('selected-edge',ancestors.has(edge.child) && ancestors.has(edge.parent)));
    this.reveal(id);
  }
  focus(id) {
    const button = this.buttons.get(id); button.focus({preventScroll:true}); this.reveal(id);
    const viewer = this.host.closest('.explore-stage')?.querySelector('.explore-world');
    const box = button.getBoundingClientRect(), view = viewer?.getBoundingClientRect();
    const overlaps = viewer && getComputedStyle(viewer).position === 'sticky' && view.left < box.right && view.right > box.left;
    button.style.scrollMarginTop = `${overlaps ? viewer.offsetHeight+16 : 16}px`;
    button.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
  }
  reveal(id) {
    const button = this.buttons.get(id), left = button.offsetLeft, right = left+button.offsetWidth;
    if (left < this.host.scrollLeft || right > this.host.scrollLeft+this.host.clientWidth) this.host.scrollLeft = left-this.host.clientWidth/2+button.offsetWidth/2;
  }
}
