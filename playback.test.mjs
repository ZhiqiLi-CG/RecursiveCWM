import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('./run.js', import.meta.url), 'utf8');
const {parseTrace,prepareRun,stateAt} = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

async function fixture(name) {
  const base = new URL(`../assets/${name}/`, import.meta.url);
  return {
    text: await readFile(new URL('events.jsonl', base), 'utf8'),
    tree: JSON.parse(await readFile(new URL('tree.json', base), 'utf8'))
  };
}

test('both complete traces parse without dropping or reordering equal-time records', async () => {
  const medieval = await fixture('run');
  const city = await fixture('run-city');
  const a = parseTrace(medieval.text);
  const b = parseTrace(city.text);
  assert.equal(a.length, 199);
  assert.equal(b.length, 243);
  assert.equal(b.filter(e => e.usage_total === null).length, 68);
  assert.deepEqual(b.slice(2, 7).map(e => e.child), ['north-housing','west-civic','central-school','east-district','foreground-park']);
  assert.equal(b[0].ts, '2026-09-08T19:32:49-04:00');
});

test('known totals stay exact and missing token totals remain explicit', async () => {
  const medieval = await fixture('run');
  const city = await fixture('run-city');
  const a = prepareRun(parseTrace(medieval.text), medieval.tree);
  const b = prepareRun(parseTrace(city.text), city.tree);
  assert.equal(a.totalTokens, 3548594);
  assert.equal(a.nodeTokenMissing.scene, false);
  assert.equal(b.totalTokens, null);
  assert.equal(b.nodeTokens.scene, null);
  assert.equal(b.nodeTokenMissing.scene, true);
  assert.equal(b.events.length, 243);
});

test('calls reveal nodes, delivered returns reveal renders, and parents become whole again', async () => {
  const medieval = await fixture('run');
  const run = prepareRun(parseTrace(medieval.text), medieval.tree);
  assert.deepEqual(Object.keys(stateAt(run, -1).nodes), []);
  assert.equal(stateAt(run, 2).nodes.terrain.status, 'called');
  assert.equal(stateAt(run, 53).nodes['terrain-ground'].render, false);
  assert.equal(stateAt(run, 95).nodes['terrain-ground'].render, true);
  assert.equal(stateAt(run, 97).wholeAgain, 'terrain');
  const final = stateAt(run, run.events.length - 1);
  assert.equal(Object.values(final.nodes).filter(node => node.render).length, 24);
  assert.equal(final.tokens, 3548594);
});
