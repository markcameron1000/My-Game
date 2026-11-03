/*
 * Parallel Futures — pure game logic (no DOM).
 * Shared by the browser game (window.PFLogic) and the path simulator (tools/simulate.js).
 */
(function (root) {
  function newState(story) {
    const dims = {};
    story.dims.forEach(function (d) { dims[d] = 5; });
    return { dims: dims, flags: [], step: 0, history: [] };
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /** Does condition `c` hold for state `st`? */
  function test(c, st) {
    if (!c) return true;
    const has = function (f) { return st.flags.indexOf(f) !== -1; };
    if (c.all && !c.all.every(has)) return false;
    if (c.any && !c.any.some(has)) return false;
    if (c.none && c.none.some(has)) return false;
    if (c.min) for (const k in c.min) if (st.dims[k] < c.min[k]) return false;
    if (c.max) for (const k in c.max) if (st.dims[k] > c.max[k]) return false;
    return true;
  }

  function apply(st, effects, flags) {
    if (effects) for (const k in effects) st.dims[k] = Math.max(0, Math.min(10, st.dims[k] + effects[k]));
    if (flags) flags.forEach(function (f) { if (st.flags.indexOf(f) === -1) st.flags.push(f); });
  }

  /** Resolve a step's text parts → { texts: [...], matched: [variant objects with effects/flags], title } */
  function resolveParts(parts, st) {
    const texts = [], matched = [];
    let title = null;
    (parts || []).forEach(function (p) {
      if (typeof p === "string") { texts.push(p); return; }
      if (p.variants) {
        const v = p.variants.find(function (x) { return test(x.if, st); });
        if (v) { texts.push(v.text); matched.push(v); if (v.title) title = v.title; }
        return;
      }
      if (p.collect) {
        const skip = {};
        const hits = [];
        p.collect.forEach(function (x, i) {
          if (skip[i] || !test(x.if, st)) return;
          hits.push(x);
          (p.exclusiveGroups || []).forEach(function (g) {
            if (g.indexOf(i) !== -1) g.forEach(function (j) { if (j !== i) skip[j] = true; });
          });
        });
        const chosen = hits.slice(0, p.limit || hits.length);
        if (chosen.length) chosen.forEach(function (x) { texts.push(x.text); });
        else if (p.fallback) texts.push(p.fallback);
      }
    });
    return { texts: texts, matched: matched, title: title };
  }

  function choiceLabel(choice, st) {
    if (choice.label) return choice.label;
    const v = (choice.labelVariants || []).find(function (x) { return test(x.if, st); });
    return v ? v.text : "";
  }

  /** Index of the next step to show at or after `from`, skipping steps whose condition fails. */
  function nextStepIndex(story, st, from) {
    let i = from;
    while (i < story.steps.length && !test(story.steps[i].if, st)) i++;
    return i;
  }

  /** Ending selection — see STORY_OUTLINE.md §4. */
  function computeEnding(story, st) {
    const d = st.dims;
    const has = function (f) { return st.flags.indexOf(f) !== -1; };

    if (["letter_nothing", "sam_coffee", "volunteer", "gave_it_away", "paid_forward"].every(has)) return "unexpected";
    if ((has("hit_bottom") || has("crisis_health")) && has("rebuilt") && d.wel >= 5) return "phoenix";
    if (d.sec >= 8 && d.con <= 4 && d.wel <= 4) return "cage";

    const vals = story.dims.map(function (k) { return d[k]; });
    if (Math.max.apply(null, vals) - Math.min.apply(null, vals) <= 2) return "balanced";

    const sorted = story.dims.slice().sort(function (a, b) {
      return d[b] - d[a] || story.dims.indexOf(a) - story.dims.indexOf(b);
    });
    const top = [sorted[0], sorted[1]];
    const inTop = function (k) { return top.indexOf(k) !== -1; };

    if (inTop("imp")) return "hero";
    if (inTop("sec") && inTop("gro")) return "builder";
    if (top.every(function (k) { return k === "con" || k === "wel"; })) return "anchor";
    if (inTop("gro") && d.sec <= 4) return "wanderer";
    return { sec: "builder", con: "anchor", wel: "anchor", gro: "wanderer", imp: "hero" }[sorted[0]];
  }

  /** Epilogue paragraphs: opening → 2 callbacks → trade-off → letter line. */
  function buildEpilogue(story, st, key) {
    const e = story.endings[key];
    const paras = e.open.slice();
    story.callbacks.filter(function (c) { return test(c.if, st); }).slice(0, 2)
      .forEach(function (c) { paras.push(c.text); });
    if (e.tradeoff) paras.push(e.tradeoff);
    if (e.final) paras.push(e.final);
    else {
      const l = story.letters.find(function (x) { return test(x.if, st); });
      if (l) paras.push(l.text);
    }
    return paras;
  }

  const api = { newState: newState, clone: clone, test: test, apply: apply, resolveParts: resolveParts,
    choiceLabel: choiceLabel, nextStepIndex: nextStepIndex, computeEnding: computeEnding, buildEpilogue: buildEpilogue };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PFLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
