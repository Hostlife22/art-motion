// Load scenes/<id>.js by id; load transitions/<type>.js automatically by transition.type (synchronize XHR to ensure all registrations before engine startup).
// Any scene is missing files, has syntax errors, is not registered, or the transition name cannot be found in TRANSITIONS and transitions/ → record it in window.__bootErrors,
// The engine refused to start, and render.py/qa.py reported an error and exited directly.
// (Tried in Migration Test B: In the past, if there was a missing scene, the "To Be Realized" placeholder would be drawn and rendered as usual. The whole segment was gray for 1.2 seconds, only discovered with a frame difference of 0.0%; if the transition name was written incorrectly, it would silently revert to cross-fade.)
(() => {
  window.SCENES = window.SCENES || {}; window.__bootErrors = [];
  const load = (url) => { const x = new XMLHttpRequest(); x.open('GET', url, false); try { x.send(); } catch (err) { return { err: `Request failed ${err}` }; }
    if (x.status !== 200) return { err: `${url} does not exist (HTTP ${x.status})` };
    try { (0, eval)(x.responseText + `\n//# sourceURL=${url}`); } catch (err) { return { err: `${url} Execution error ${err && err.stack || err}` }; } return {}; };
  // The movie can first load its own shared script (window.SCENE_LIBS, in order) and the scene file directory window.SCENE_DIR (default scenes).
  // The paragraphs with SCENES[id] have been registered in the shared script, and there is no need to find separate scene files (the demo videos of demos/ are organized in this way).
  for (const f of window.SCENE_LIBS || []) { const r = load(f); if (r.err) __bootErrors.push(`shared script ${r.err}`); }
  const dir = window.SCENE_DIR || 'scenes';
  for (const e of ERAS) {
    if (!e.draw) {                                          // Paragraphs with inline draw in eras do not require files
      const r = SCENES[e.id] ? {} : load(`${dir}/${e.id}.js`);
      if (r.err) { __bootErrors.push(`${e.id}: ${r.err}`); continue; }
      const sc = SCENES[e.id];
      if (!sc || typeof sc.draw !== 'function') { __bootErrors.push(`${e.id}: There is no SCENES[' in the file${e.id}'] = { draw(c, lt, t) }`); continue; }
      e.draw = sc.draw; if (sc.init) e.init = sc.init;
    }
    const ty = e.transition && e.transition.type;
    if (ty && !TRANSITIONS[ty]) {                            // The project's own transition: put transitions/<type>.js and hang the function of the same name on TRANSITIONS
      const r = load(`transitions/${ty}.js`);
      if (r.err || !TRANSITIONS[ty]) __bootErrors.push(`${e.id}: Transition "${ty}” is not in transitions.js and there is no transitions/${ty}.js(${r.err || 'TRANSITIONS is not registered in the file.' + ty})`);
    }
  }
})();
