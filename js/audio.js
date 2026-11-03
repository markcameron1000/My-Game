/*
 * Parallel Futures — generative audio (Web Audio API, no sound files).
 *  - mood(name): slow ambient pad chord per chapter, crossfaded
 *  - chime(i, n): bell when the timeline splits (pitch depends on the branch taken)
 *  - whoosh():   soft swell on chapter cards
 *  - arpeggio(): rising bells when an ending is revealed
 * Sound starts only after a user gesture (browser rule). Default: on for desktop, off for touch devices.
 */
window.PFAudio = (function () {
  "use strict";
  const PREF_KEY = "pf_sound";
  const MOODS = {
    c0: [45, 52, 59, 60],          // Am(add9)  — mysterious night
    c1: [48, 55, 59, 64],          // Cmaj7     — hopeful today
    c2: [41, 48, 52, 57],          // Fmaj7     — open, restless
    c3: [50, 57, 60, 64, 65],      // Dm9       — bittersweet
    c4: [40, 47, 50, 55],          // Em7       — reflective, heavier
    end: [48, 55, 62, 64, 71],     // Cmaj9     — resolution
    secret: [44, 51, 55, 60, 62]   // Abmaj7#11 — the twist
  };

  let ctx = null, master = null, reverbIn = null;
  let pad = null, moodName = null;
  let enabled = readPref();

  function readPref() {
    try {
      const v = localStorage.getItem(PREF_KEY);
      if (v === "on") return true;
      if (v === "off") return false;
    } catch (e) { /* ignore */ }
    return !(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  }
  function writePref() { try { localStorage.setItem(PREF_KEY, enabled ? "on" : "off"); } catch (e) { /* ignore */ } }

  const freq = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  function impulse(seconds, decay) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
      const conv = ctx.createConvolver();
      conv.buffer = impulse(3.8, 2.6);
      const wet = ctx.createGain(); wet.gain.value = 0.55;
      reverbIn = conv; conv.connect(wet); wet.connect(master);
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  // ───── ambient pad ─────
  function startPad(notes) {
    const now = ctx.currentTime;
    const group = ctx.createGain();
    group.gain.setValueAtTime(0, now);
    group.gain.linearRampToValueAtTime(0.11, now + 4);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 850; filter.Q.value = 0.6;
    const lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
    lfo.frequency.value = 0.06; lfoGain.gain.value = 350;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
    const send = ctx.createGain(); send.gain.value = 0.6;
    filter.connect(group); group.connect(master); group.connect(send); send.connect(reverbIn);

    const oscs = [lfo];
    notes.forEach(function (m, i) {
      [["sine", -5], ["triangle", 6]].forEach(function (spec) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = spec[0]; o.frequency.value = freq(m); o.detune.value = spec[1];
        g.gain.value = (spec[0] === "sine" ? 0.55 : 0.18) / notes.length;
        // gentle independent swell per note so the chord "breathes"
        const sw = ctx.createOscillator(), swg = ctx.createGain();
        sw.frequency.value = 0.05 + i * 0.013; swg.gain.value = g.gain.value * 0.35;
        sw.connect(swg); swg.connect(g.gain);
        o.connect(g); g.connect(filter);
        oscs.push(o, sw);
      });
    });
    oscs.forEach(function (o) { o.start(now); });
    return { group: group, oscs: oscs };
  }

  function stopPad(p, fade) {
    if (!p) return;
    const now = ctx.currentTime;
    p.group.gain.cancelScheduledValues(now);
    p.group.gain.setValueAtTime(p.group.gain.value, now);
    p.group.gain.linearRampToValueAtTime(0, now + fade);
    p.oscs.forEach(function (o) { try { o.stop(now + fade + 0.1); } catch (e) { /* ignore */ } });
  }

  function mood(name) {
    if (name === moodName) return;
    moodName = name;
    if (!ctx || !enabled) return;
    stopPad(pad, 3);
    pad = name && MOODS[name] ? startPad(MOODS[name]) : null;
  }

  // ───── one-shot sounds ─────
  function bell(midi, when, vol) {
    const t = ctx.currentTime + (when || 0);
    const out = ctx.createGain(); out.gain.value = vol || 0.12;
    out.connect(master);
    const send = ctx.createGain(); send.gain.value = 0.9; out.connect(send); send.connect(reverbIn);
    [[1, 1, 2.6], [2.76, 0.35, 1.4], [5.4, 0.15, 0.8], [8.93, 0.06, 0.5]].forEach(function (p) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq(midi) * p[0];
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(p[1], t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + p[2] + 0.1);
    });
  }

  function chordTones() {
    const base = MOODS[moodName] || MOODS.c1;
    return base.map(function (m) { return m + 24; }).sort(function (a, b) { return a - b; });
  }

  function chime(i, n) {
    if (!ctx || !enabled) return;
    const tones = chordTones();
    const idx = Math.round((i / Math.max(1, n - 1)) * (tones.length - 1));
    bell(tones[idx] - 12, 0, 0.1);
    bell(tones[idx], 0.09, 0.08);
  }

  function arpeggio() {
    if (!ctx || !enabled) return;
    chordTones().forEach(function (m, i) { bell(m - 12, i * 0.22, 0.07); });
  }

  function whoosh() {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime, dur = 2.4;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(250, t); bp.frequency.exponentialRampToValueAtTime(2200, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.045, t + 1.1); g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(bp); bp.connect(g); g.connect(master); g.connect(reverbIn);
    src.start(t); src.stop(t + dur);
  }

  // ───── controls ─────
  /** Call from a click handler: creates/resumes audio if sound is enabled. */
  function unlock() {
    if (!enabled) return;
    if (ensure() && !pad && moodName && MOODS[moodName]) pad = startPad(MOODS[moodName]);
  }

  function toggle() {
    enabled = !enabled;
    writePref();
    if (enabled) {
      if (ensure()) {
        if (!pad && moodName && MOODS[moodName]) pad = startPad(MOODS[moodName]);
        bell(76, 0, 0.06);
      }
    } else if (ctx) {
      stopPad(pad, 0.6); pad = null;
    }
    return enabled;
  }

  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (enabled) ctx.resume();
  });

  return { unlock: unlock, mood: mood, chime: chime, arpeggio: arpeggio, whoosh: whoosh, toggle: toggle,
    isOn: function () { return enabled; } };
})();
