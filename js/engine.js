/*
 * Parallel Futures — browser engine (rendering, input, saving).
 * Game rules live in logic.js; story content lives in story.js.
 */
(function () {
  "use strict";
  const S = window.STORY;
  const L = window.PFLogic;
  const SAVE_KEY = "pf_save_v1";
  const FOUND_KEY = "pf_endings_v1";
  const RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DIM_COLOURS = { sec: "#f2c14e", con: "#ff9f5a", gro: "#3fd0c9", wel: "#8be08b", imp: "#b48cff" };

  const app = document.getElementById("app");
  const hud = document.getElementById("hud");
  let st = null;
  let pendingTimer = null;

  // ───────────── storage (wrapped: may be unavailable) ─────────────
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(st)); } catch (e) { /* ignore */ } }
  function loadSave() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return null; } }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } }
  function getFound() { try { return JSON.parse(localStorage.getItem(FOUND_KEY)) || []; } catch (e) { return []; } }
  function addFound(k) {
    const f = getFound();
    if (f.indexOf(k) === -1) { f.push(k); try { localStorage.setItem(FOUND_KEY, JSON.stringify(f)); } catch (e) { /* ignore */ } }
    return f;
  }

  // ───────────── text helpers ─────────────
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function fmt(s) { return esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>"); }
  function paras(texts, cls) {
    const out = [];
    texts.forEach(function (t) { t.split(/\n\n/).forEach(function (p) { out.push(p); }); });
    return out.map(function (p, i) {
      return '<p class="' + (cls || "story") + ' reveal" style="--d:' + (i * 0.35) + 's">' + fmt(p) + "</p>";
    }).join("");
  }
  function revealDelay(n) { return RM ? 0 : n * 0.35 + 0.2; }

  // ───────────── screen + HUD ─────────────
  /**
   * Render a screen. `lockSec`: while text is still fading in, buttons are locked so they
   * can't be clicked by accident while invisible; a tap anywhere (or a key) skips the reveal.
   */
  let lockTimer = null;
  function screen(html, cls, lockSec) {
    clearTimeout(pendingTimer);
    clearTimeout(lockTimer);
    app.innerHTML = '<section class="screen ' + (cls || "") + '">' + html + "</section>";
    const h = app.querySelector("h1, h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
    updateHud();
    if (lockSec && !RM) {
      const scr = app.firstElementChild;
      scr.classList.add("locked");
      lockTimer = setTimeout(function () { scr.classList.remove("locked"); }, lockSec * 1000);
    }
  }
  function isLocked() { const s = app.firstElementChild; return !!(s && s.classList.contains("locked")); }
  function skipReveal() {
    const s = app.firstElementChild;
    if (!s || !s.classList.contains("locked")) return false;
    clearTimeout(lockTimer);
    s.classList.remove("locked"); s.classList.add("skip");
    return true;
  }
  document.addEventListener("click", function (e) {
    if (isLocked() && !e.target.closest("#sound")) skipReveal();
  }, true);

  // ───────────── sound toggle ─────────────
  const soundBtn = document.getElementById("sound");
  function paintSound() {
    const on = window.PFAudio.isOn();
    soundBtn.setAttribute("aria-pressed", String(on));
    soundBtn.setAttribute("aria-label", on ? "Sound on. Turn sound off" : "Sound off. Turn sound on");
    soundBtn.title = on ? "Sound on" : "Sound off";
    soundBtn.classList.toggle("off", !on);
  }
  soundBtn.addEventListener("click", function () { window.PFAudio.toggle(); paintSound(); });
  paintSound();

  /** Which chapter (c0…c4) a step index belongs to — used to pick the music. */
  function chapterOf(i) {
    for (let j = Math.min(i, S.steps.length - 1); j >= 0; j--) if (S.steps[j].type === "chapter") return S.steps[j].id;
    return "c0";
  }

  function dominantDim() {
    if (!st) return null;
    let best = null, bestV = -1, tie = false;
    S.dims.forEach(function (k) {
      if (st.dims[k] > bestV) { best = k; bestV = st.dims[k]; tie = false; }
      else if (st.dims[k] === bestV) tie = true;
    });
    return tie && bestV === 5 ? null : best;
  }

  function updateHud() {
    const show = st && st.history !== undefined && document.body.dataset.mode === "play";
    hud.hidden = !show;
    const dom = dominantDim();
    document.documentElement.style.setProperty("--accent", dom ? DIM_COLOURS[dom] : "#a9b8ff");
    if (!show) return;
    const n = st.history.length;
    let dots = "";
    for (let i = 0; i < S.totalDecisions; i++) {
      dots += '<span class="node' + (i < n ? " lit" : "") + (i === n ? " next" : "") + '"></span>';
    }
    hud.innerHTML = '<div class="thread" role="img" aria-label="' + n + " of " + S.totalDecisions + ' choices made">' + dots + "</div>";
  }

  function setMode(m) { document.body.dataset.mode = m; }

  // ───────────── flow ─────────────
  function start() {
    window.PFAudio.unlock();
    clearSave();
    st = L.newState(S);
    setMode("play");
    go();
  }

  function go() {
    st.step = L.nextStepIndex(S, st, st.step);
    save();
    if (st.step >= S.steps.length) return renderEnding(true);
    window.PFAudio.mood(chapterOf(st.step));
    const step = S.steps[st.step];
    if (step.type === "chapter") return renderChapter(step);
    if (step.type === "beat") return renderBeat(step);
    return renderDecision(step);
  }

  // ───────────── landing ─────────────
  function renderLanding() {
    setMode("landing");
    const saved = loadSave();
    const found = getFound();
    const inProgress = saved && saved.history && saved.history.length > 0;
    let buttons;
    if (inProgress) {
      buttons = '<button class="btn primary" data-act="continue">Continue your journey</button>' +
                '<button class="btn ghost" data-act="new">Start a new life</button>';
    } else {
      buttons = '<button class="btn primary big" data-act="new">Begin</button>';
    }
    screen(
      '<div class="landing">' +
        '<div class="sigil" aria-hidden="true">' + splitSvg(3, 1, true) + "</div>" +
        "<h1>Parallel Futures</h1>" +
        '<p class="tagline">Every choice splits the timeline.</p>' +
        '<p class="sub">12 choices. One life. Many futures.</p>' +
        '<div class="actions">' + buttons + "</div>" +
        (found.length ? '<p class="found">' + found.length + " of 8 futures discovered</p>" : "") +
      "</div>", "landing-screen");
    app.querySelectorAll("[data-act]").forEach(function (b) {
      b.addEventListener("click", function () {
        window.PFAudio.unlock();
        if (b.dataset.act === "new") start();
        else { st = saved; setMode("play"); go(); }
      });
    });
  }

  // ───────────── chapter card ─────────────
  function renderChapter(step) {
    let done = false;
    function advance() {
      if (done) return; done = true;
      st.step++; go();
    }
    screen(
      '<button class="chapter-card" aria-label="' + esc(step.kicker + ": " + step.title + ". Continue") + '">' +
        '<span class="kicker">' + esc(step.kicker) + "</span>" +
        '<span class="chapter-title">' + esc(step.title) + "</span>" +
        '<span class="tap">tap to continue</span>' +
      "</button>", "chapter-screen");
    window.PFAudio.whoosh();
    const card = app.querySelector(".chapter-card");
    card.addEventListener("click", advance);
    card.focus({ preventScroll: true }); // Enter / Space on the focused button advances
    pendingTimer = setTimeout(advance, RM ? 3500 : 2800);
  }

  // ───────────── decision ─────────────
  function renderDecision(step) {
    const r = L.resolveParts(step.parts, st);
    const nParas = r.texts.join("\n\n").split(/\n\n/).length;
    const choices = step.choices.map(function (c, i) {
      return '<li><button class="choice reveal" style="--d:' + (revealDelay(nParas) + i * 0.12) + 's" data-i="' + i + '">' +
        '<span class="key" aria-hidden="true">' + (i + 1) + "</span>" +
        "<span>" + fmt(L.choiceLabel(c, st)) + "</span></button></li>";
    }).join("");
    screen(
      '<p class="kicker">' + esc(step.chapter) + "</p>" +
      "<h2>" + esc(step.title) + "</h2>" +
      paras(r.texts) +
      '<ul class="choices" role="list">' + choices + "</ul>", "decision-screen",
      revealDelay(nParas) + step.choices.length * 0.12 + 0.35);
    app.querySelectorAll(".choice").forEach(function (b) {
      b.addEventListener("click", function () { choose(step, Number(b.dataset.i)); });
    });
  }

  function choose(step, i) {
    const btns = app.querySelectorAll(".choice");
    btns.forEach(function (b, j) {
      b.disabled = true;
      b.classList.add(j === i ? "chosen" : "unchosen");
    });
    const choice = step.choices[i];
    window.PFAudio.chime(i, step.choices.length);
    const snap = { step: st.step, dims: L.clone(st.dims), flags: L.clone(st.flags) };
    L.apply(st, choice.effects, choice.flags);
    st.history.push({ id: step.id, idx: i, snap: snap });
    st.step++;
    save();
    setTimeout(function () { renderRipple(step, choice, i); }, RM ? 0 : 650);
  }

  // ───────────── ripple (the timeline splits) ─────────────
  function splitSvg(n, chosen, idle) {
    const ys = [];
    for (let i = 0; i < n; i++) ys.push(n === 1 ? 60 : 20 + (80 * i) / (n - 1));
    let paths = "";
    ys.forEach(function (y, i) {
      const isChosen = i === chosen;
      paths += '<path class="branch ' + (isChosen ? "on" : "off") + '" d="M110 60 C 170 60, 190 ' + y + ", 300 " + y + '" />';
      if (isChosen) paths += '<circle class="tip" cx="300" cy="' + y + '" r="4" />';
    });
    return '<svg class="split' + (idle ? " idle" : "") + '" viewBox="0 0 310 120" aria-hidden="true">' +
      '<path class="trunk" d="M0 60 L110 60" />' + paths +
      '<circle class="knot" cx="110" cy="60" r="5" /></svg>';
  }

  function renderRipple(step, choice, i) {
    const extras = (choice.rippleExtra || []).filter(function (x) { return L.test(x.if, st); }).map(function (x) { return x.text; });
    screen(
      '<div class="ripple">' +
        splitSvg(step.choices.length, i) +
        '<h2 class="sr-only">What happened</h2>' +
        paras([choice.ripple].concat(extras), "ripple-text") +
        (step.hint ? '<p class="hint reveal" style="--d:1.2s">' + fmt(step.hint) + "</p>" : "") +
        '<button class="btn primary reveal" style="--d:' + (RM ? 0 : 0.9) + 's" data-act="next">Continue</button>' +
      "</div>", "ripple-screen", 1.2);
    const b = app.querySelector("[data-act=next]");
    b.addEventListener("click", go);
    setTimeout(function () { b.focus({ preventScroll: true }); }, RM ? 0 : 900);
  }

  // ───────────── beat (narrative moment, no choice) ─────────────
  function renderBeat(step) {
    const r = L.resolveParts(step.parts, st);
    const nParas = r.texts.join("\n\n").split(/\n\n/).length;
    screen(
      '<p class="kicker">' + esc(step.chapter) + "</p>" +
      "<h2>" + esc(step.title || r.title || "") + "</h2>" +
      paras(r.texts) +
      '<button class="btn primary reveal" style="--d:' + revealDelay(nParas) + 's" data-act="next">Continue</button>', "beat-screen", revealDelay(nParas) + 0.4);
    app.querySelector("[data-act=next]").addEventListener("click", function () {
      r.matched.forEach(function (v) { L.apply(st, v.effects, v.flags); });
      st.step++;
      go();
    });
  }

  // ───────────── ending ─────────────
  function radarSvg(dims) {
    const cx = 110, cy = 105, R = 72, keys = S.dims;
    function pt(k, v) {
      const a = -Math.PI / 2 + (2 * Math.PI * keys.indexOf(k)) / keys.length;
      return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
    }
    let grid = "";
    [0.25, 0.5, 0.75, 1].forEach(function (s) {
      grid += '<polygon class="grid" points="' + keys.map(function (k) { return pt(k, s).join(","); }).join(" ") + '" />';
    });
    let axes = "", labels = "";
    keys.forEach(function (k) {
      const p = pt(k, 1), lp = pt(k, 1.28);
      axes += '<line class="axis" x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '" />';
      labels += '<text x="' + lp[0] + '" y="' + (lp[1] + 4) + '" text-anchor="middle">' + S.dimNames[k] + "</text>";
    });
    const shape = keys.map(function (k) { return pt(k, Math.max(dims[k], 0.4) / 10).join(","); }).join(" ");
    const summary = keys.map(function (k) { return S.dimNames[k] + " " + dims[k] + " of 10"; }).join(", ");
    return '<svg class="radar" viewBox="-20 0 260 215" role="img" aria-label="Your life balance: ' + summary + '">' +
      grid + axes + '<polygon class="shape" points="' + shape + '" />' + labels + "</svg>";
  }

  /** @param {boolean} fresh true when arriving from the story (plays the reveal), false when returning from the map. */
  function renderEnding(fresh) {
    fresh = fresh === true;
    setMode("play");
    const key = L.computeEnding(S, st);
    const e = S.endings[key];
    const found = addFound(key);
    const epi = L.buildEpilogue(S, st, key);
    window.PFAudio.mood(e.secret ? "secret" : "end");
    if (fresh) setTimeout(function () { window.PFAudio.arpeggio(); }, 600);
    const canShare = !!navigator.share;
    screen(
      '<p class="kicker">Epilogue · Twenty Years Later</p>' +
      '<h2 class="ending-title"><span class="pre">You became</span>' + esc(e.name) + "</h2>" +
      paras(epi) +
      '<div class="future-card reveal ' + (e.secret ? "secret" : "") + '" style="--d:' + revealDelay(epi.length) + 's">' +
        '<p class="fc-label">Future Card</p>' +
        '<p class="fc-name">' + esc(e.name) + "</p>" +
        radarSvg(st.dims) +
        '<p class="fc-line">' + fmt(e.card) + "</p>" +
        '<p class="fc-foot">Parallel Futures</p>' +
      "</div>" +
      '<p class="found">' + found.length + " of 8 futures discovered" +
        (found.length === 8 ? "<br>You've seen every future. Except, perhaps, the one you'll live." : "") + "</p>" +
      '<div class="actions">' +
        '<button class="btn primary" data-act="map">See your parallel futures</button>' +
        '<button class="btn ghost" data-act="save">Save your Future Card</button>' +
        (canShare ? '<button class="btn ghost" data-act="share">Share</button>' : "") +
        '<button class="btn ghost" data-act="new">Start a new life</button>' +
      "</div>", "ending-screen " + (e.secret ? "secret" : ""), fresh ? revealDelay(epi.length) + 0.6 : 0);
    if (!fresh) app.querySelectorAll(".reveal").forEach(function (el) { el.style.setProperty("--d", "0s"); });
    app.querySelector("[data-act=map]").addEventListener("click", renderMap);
    app.querySelector("[data-act=new]").addEventListener("click", start);
    app.querySelector("[data-act=save]").addEventListener("click", function (ev) { saveCard(e, ev.currentTarget); });
    if (canShare) app.querySelector("[data-act=share]").addEventListener("click", function (ev) { share(e, ev.currentTarget); });
    pendingTimer = setTimeout(function () { makeCard(e); }, fresh ? 2500 : 300);
  }

  // ───────────── Future Card: save as image / share ─────────────
  function cardAccent() {
    const el = app.querySelector(".ending-screen") || document.documentElement;
    return getComputedStyle(el).getPropertyValue("--accent").trim() || "#a9b8ff";
  }
  function cardFileName(e) { return "parallel-futures-" + e.name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "") + ".png"; }
  function shareText(e) {
    return "I became " + e.name + " in Parallel Futures. “" + e.card.replace(/\*/g, "") + "” Which future would you choose?";
  }
  function shareUrl() { return /^https?:/.test(location.protocol) ? location.origin + location.pathname : ""; }

  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = label; btn.disabled = true; }
    else { btn.textContent = btn.dataset.label || btn.textContent; btn.disabled = false; }
  }

  // The image is pre-built shortly after the ending appears, so "Share" can open the share sheet instantly
  // (browsers only allow sharing straight after a tap).
  let cardCache = null;
  function makeCard(e) {
    const sig = e.name + JSON.stringify(st.dims);
    if (!cardCache || cardCache.sig !== sig) {
      cardCache = { sig: sig, p: window.PFCard.toBlob(e, st.dims, S.dimNames, S.dims, cardAccent()) };
      cardCache.p.catch(function () { cardCache = null; });
    }
    return cardCache.p;
  }

  function saveCard(e, btn) {
    busy(btn, true, "Creating your card…");
    makeCard(e).then(function (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = cardFileName(e);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      toast("Future Card saved");
    }).catch(function () { toast("Couldn't create the image. Try a screenshot instead!"); })
      .then(function () { busy(btn, false); });
  }

  function share(e, btn) {
    const text = shareText(e), url = shareUrl();
    busy(btn, true, "Preparing…");
    makeCard(e).then(function (blob) {
      const file = new File([blob], cardFileName(e), { type: "image/png" });
      const data = { title: "Parallel Futures", text: url ? text + " " + url : text };
      if (navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
      return navigator.share(data);
    }).catch(function (err) {
      if (err && err.name === "AbortError") return; // user closed the share sheet
      return navigator.share({ title: "Parallel Futures", text: text, url: url || undefined }).catch(function () { /* ignore */ });
    }).then(function () { busy(btn, false); });
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  // ───────────── parallel map ─────────────
  function renderMap() {
    const found = getFound();
    const items = st.history.map(function (h, hi) {
      const step = S.steps.find(function (s) { return s.id === h.id; });
      const snapState = { dims: h.snap.dims, flags: h.snap.flags };
      const opts = step.choices.map(function (c, j) {
        const label = fmt(L.choiceLabel(c, snapState));
        if (j === h.idx) return '<li class="opt taken"><span class="dot"></span>' + label + "</li>";
        const sealed = c.sealedUntil && found.indexOf(c.sealedUntil) === -1;
        const teaser = sealed ? "This timeline is still sealed." : c.ghost;
        return '<li class="opt ghost-opt"><button class="ghost-btn" aria-expanded="false">' +
          '<span class="dot"></span>' + label + '</button><p class="teaser" hidden>' + fmt(teaser) + "</p></li>";
      }).join("");
      return '<li class="map-node">' +
        '<p class="map-kicker">' + esc(step.chapter) + " · " + esc(step.title) + "</p>" +
        '<ul class="opts">' + opts + "</ul>" +
        '<div class="rewind"><button class="link-btn" data-rw="' + hi + '">↺ Rewind to here</button></div>' +
      "</li>";
    }).join("");
    screen(
      '<p class="kicker">The Parallel Map</p>' +
      "<h2>The roads you walked, and the ones you didn't.</h2>" +
      '<p class="map-help">Tap a faded branch to glimpse that future. Rewind to any moment to live it.</p>' +
      '<ol class="map">' + items + "</ol>" +
      '<div class="actions">' +
        '<button class="btn primary" data-act="back">Back to your future</button>' +
        '<button class="btn ghost" data-act="new">Start a new life</button>' +
      "</div>", "map-screen");

    app.querySelectorAll(".ghost-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        const t = b.nextElementSibling, open = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", String(!open)); t.hidden = open;
      });
    });
    app.querySelectorAll("[data-rw]").forEach(function (b) {
      b.addEventListener("click", function () { confirmRewind(b, Number(b.dataset.rw)); });
    });
    app.querySelector("[data-act=back]").addEventListener("click", function () { renderEnding(false); });
    app.querySelector("[data-act=new]").addEventListener("click", start);
  }

  function confirmRewind(btn, i) {
    const box = btn.parentElement;
    box.innerHTML = '<span class="confirm">Go back? Everything after this moment will unravel.</span>' +
      '<button class="link-btn strong" data-yes>Rewind</button><button class="link-btn" data-no>Stay</button>';
    box.querySelector("[data-yes]").focus();
    box.querySelector("[data-yes]").addEventListener("click", function () { rewind(i); });
    box.querySelector("[data-no]").addEventListener("click", function () {
      box.innerHTML = '<button class="link-btn" data-rw="' + i + '">↺ Rewind to here</button>';
      const nb = box.querySelector("[data-rw]");
      nb.addEventListener("click", function () { confirmRewind(nb, i); });
      nb.focus();
    });
  }

  function rewind(i) {
    const h = st.history[i];
    st.dims = L.clone(h.snap.dims);
    st.flags = L.clone(h.snap.flags);
    st.step = h.snap.step;
    st.history = st.history.slice(0, i);
    go();
  }

  // ───────────── keyboard: number keys pick choices ─────────────
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // While text is still revealing, the first key press just skips the animation.
    if (isLocked() && (e.key === "Enter" || e.key === " " || /^[1-9]$/.test(e.key))) {
      e.preventDefault(); skipReveal(); return;
    }
    const n = parseInt(e.key, 10);
    if (!n) return;
    const b = app.querySelectorAll(".choice:not([disabled])")[n - 1];
    if (b) { e.preventDefault(); b.click(); }
  });

  // ───────────── starfield ─────────────
  function drawStars() {
    const c = document.getElementById("stars");
    const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    const count = Math.round((innerWidth * innerHeight) / 5500);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 1.2 + 0.2;
      ctx.globalAlpha = Math.random() * 0.7 + 0.15;
      ctx.fillStyle = Math.random() < 0.15 ? "#cfd8ff" : "#ffffff";
      ctx.beginPath(); ctx.arc(Math.random() * innerWidth, Math.random() * innerHeight, r, 0, Math.PI * 2); ctx.fill();
    }
  }
  let resizeT;
  window.addEventListener("resize", function () { clearTimeout(resizeT); resizeT = setTimeout(drawStars, 200); });
  drawStars();

  renderLanding();
})();
