// Child review harness only; this is not the final terrain component.
import {buildTerrain} from '../scene/blockout.js';
const query = new URLSearchParams(location.search);
const component = query.get('component');
const child = component ? await import(component) : null;
export function build(ctx) {
  const group = buildTerrain(ctx);
  const kind = query.get('kind');
  const mountain = group.children[group.children.length - 1];
  if (kind === 'mountain') group.remove(mountain);
  if (kind === 'ground') {
    for (const mesh of [...group.children]) if (mesh !== mountain) group.remove(mesh);
  }
  if (child) group.add(child.build(ctx));
  group.name = 'terrain-child-preview';
  return group;
}
