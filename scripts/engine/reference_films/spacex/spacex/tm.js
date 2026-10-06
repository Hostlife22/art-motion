// Oral broadcast counterpoint: TM.cue('s03', '2007') = The moment when the words "2007" begin to be pronounced (partial second of this paragraph, lt).
// TM.end('s03', '2007') = The moment when these words are finished. TM.dur('s03') segment length; TM.vo('s03') = [narration starts, narration ends] (local seconds).
// The key must be the original string in the subtitle text (the first time it appears); if it is written incorrectly, a console.error will occur and the rendering will fail.
window.TM = (() => {
  const seg = id => { const s = TIMING.seg[id]; if (!s) throw new Error('TIMING has no segment ' + id); return s; };
  function find(id, key, which) {
    const s = seg(id), i = s.text.indexOf(key);
    if (i < 0) { console.error(`TM: segment ${id} There is no "${key}”`); return 0; }
    const j = which === 'end' ? i + key.length - 1 : i;
    return which === 'end' ? s.charEnd[j] : s.charStart[j];
  }
  return {
    cue: (id, key) => find(id, key, 'start'),
    end: (id, key) => find(id, key, 'end'),
    dur: id => seg(id).dur,
    vo: id => [seg(id).voStart, seg(id).voEnd],
    text: id => seg(id).text,
  };
})();
