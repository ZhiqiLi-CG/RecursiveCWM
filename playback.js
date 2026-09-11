import { stateAt, formatTime, describeEvent } from './run.js';
import { RecursionTree } from './tree.js';

export function setupPlayback(run, selectNode) {
  const $ = id => document.getElementById(id);
  const play = $('play'), timeline = $('timeline'), speed = $('speed');
  const tree = new RecursionTree($('playback-tree'), run.tree, id => { selectNode(id, true); }, {compact:true});
  let index = -1, elapsed = 0, playing = false, previousTime = 0, frame = 0, currentId = run.tree.root;
  const ticks = $('event-ticks');
  run.events.forEach(event => {
    const tick = document.createElement('span'); tick.style.left = `${event.elapsed / run.duration * 100}%`;
    if (event.event === 'child_return' && event.delivered) tick.className = 'return'; ticks.append(tick);
  });
  timeline.max = run.duration;
  function paint() {
    const state = stateAt(run, index); tree.playback(state);
    $('event-number').textContent = `${String(index + 1).padStart(3,'0')} / ${run.events.length}`;
    $('playback-tokens').textContent = `${state.tokens.toLocaleString()} tokens`;
    if (index >= 0) {
      const event = run.events[index]; currentId = event.child || event.node_id;
      $('event-description').textContent = describeEvent(event, state);
      $('inspect-event').hidden = false;
      if (state.wholeAgain) currentId = state.wholeAgain;
      tree.reveal(currentId);
    } else {
      $('event-description').textContent = 'Press play to follow the recorded run.'; $('inspect-event').hidden = true;
    }
    $('playback-status').textContent = index === run.events.length - 1 ? 'RUN COMPLETE' : playing ? 'REPLAYING THE TRACE' : index < 0 ? 'READY TO REPLAY' : 'PAUSED';
    updateClock();
  }
  function updateClock() {
    timeline.value = elapsed; $('elapsed').textContent = formatTime(elapsed);
    timeline.setAttribute('aria-valuetext', `${formatTime(elapsed)} elapsed, event ${index + 1} of ${run.events.length}`);
  }
  function pause() { playing = false; cancelAnimationFrame(frame); play.textContent = '▶ Play'; paint(); }
  function seek(time) {
    elapsed = Math.max(0, Math.min(run.duration, time));
    let next = -1;
    while (next + 1 < run.events.length && run.events[next + 1].elapsed <= elapsed) next++;
    const changed = next !== index; index = next;
    if (changed) paint(); else updateClock();
  }
  function animate(now) {
    if (!playing) return;
    const delta = now - previousTime; previousTime = now;
    seek(elapsed + delta * run.duration / 60000 * Number(speed.value));
    if (elapsed >= run.duration) { pause(); return; }
    frame = requestAnimationFrame(animate);
  }
  play.addEventListener('click', () => {
    if (playing) return pause();
    if (index === run.events.length - 1) { index = -1; elapsed = 0; }
    playing = true; play.textContent = 'Ⅱ Pause'; previousTime = performance.now();
    seek(elapsed); paint(); frame = requestAnimationFrame(animate);
  });
  $('step').addEventListener('click', () => {
    pause(); if (index < run.events.length - 1) index++;
    elapsed = run.events[index].elapsed; paint();
  });
  $('restart').addEventListener('click', () => { pause(); index = -1; elapsed = 0; paint(); });
  timeline.addEventListener('input', () => { const requested = Number(timeline.value); pause(); seek(requested); });
  speed.addEventListener('input', () => { $('speed-label').textContent = `${speed.value}×`; });
  $('inspect-event').addEventListener('click', event => { event.preventDefault(); selectNode(currentId, true); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) pause(); });
  paint();
}
