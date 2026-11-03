/*
 * Parallel Futures — Future Card image export (1080×1350 PNG, Instagram portrait size).
 * PFCard.toBlob({ name, card, secret }, dims, dimNames, dimOrder, accent) → Promise<Blob>
 */
window.PFCard = (function () {
  "use strict";
  const W = 1080, H = 1350;
  const SERIF = '"Cormorant Garamond", Georgia, serif';
  const SANS = 'Inter, "Segoe UI", system-ui, sans-serif';

  function spaced(s) { return s.split("").join(" "); }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrap(ctx, text, maxW) {
    const words = text.split(" "), lines = [];
    let line = "";
    words.forEach(function (w) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function withAlpha(hex, a) {
    const h = hex.trim().replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(function (c) { return c + c; }).join("") : h, 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  async function toBlob(ending, dims, dimNames, order, accent) {
    try {
      await Promise.all([
        document.fonts.load('600 120px "Cormorant Garamond"'),
        document.fonts.load('italic 500 60px "Cormorant Garamond"'),
        document.fonts.load("500 30px Inter"),
        document.fonts.load("600 30px Inter")
      ]);
    } catch (e) { /* fall back to system fonts */ }

    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    // background
    const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
    bg.addColorStop(0, "#1a1c40"); bg.addColorStop(1, "#07081a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W / 2, 120, 0, W / 2, 120, 900);
    glow.addColorStop(0, withAlpha(accent, 0.32)); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    // stars
    for (let i = 0; i < 260; i++) {
      ctx.globalAlpha = Math.random() * 0.6 + 0.1;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8 + 0.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // frame
    roundRect(ctx, 48, 48, W - 96, H - 96, 48);
    ctx.lineWidth = 3; ctx.strokeStyle = withAlpha(accent, 0.6); ctx.stroke();

    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";

    // label + name
    ctx.fillStyle = "#8a90b8"; ctx.font = "600 26px " + SANS;
    ctx.fillText(spaced("FUTURE CARD"), W / 2, 150);
    ctx.fillStyle = "#c9cdea"; ctx.font = "500 30px " + SANS;
    ctx.fillText(spaced("YOU BECAME"), W / 2, 228);
    ctx.fillStyle = "#ffffff"; ctx.font = "600 112px " + SERIF;
    ctx.shadowColor = withAlpha(accent, 0.6); ctx.shadowBlur = 30;
    ctx.fillText(ending.name, W / 2, 340);
    ctx.shadowBlur = 0;

    // radar
    const cx = W / 2, cy = 680, R = 230;
    function pt(k, v) {
      const a = -Math.PI / 2 + (2 * Math.PI * order.indexOf(k)) / order.length;
      return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
    }
    ctx.strokeStyle = "rgba(190,200,255,0.18)"; ctx.lineWidth = 2;
    [0.25, 0.5, 0.75, 1].forEach(function (s) {
      ctx.beginPath();
      order.forEach(function (k, i) { const p = pt(k, s); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.closePath(); ctx.stroke();
    });
    order.forEach(function (k) {
      const p = pt(k, 1);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p[0], p[1]); ctx.stroke();
    });
    ctx.beginPath();
    order.forEach(function (k, i) {
      const p = pt(k, Math.max(dims[k], 0.4) / 10);
      if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
    });
    ctx.closePath();
    ctx.fillStyle = withAlpha(accent, 0.35); ctx.fill();
    ctx.strokeStyle = accent; ctx.lineWidth = 4;
    ctx.shadowColor = accent; ctx.shadowBlur = 18; ctx.stroke(); ctx.shadowBlur = 0;

    ctx.fillStyle = "#c9cdea"; ctx.font = "500 30px " + SANS;
    order.forEach(function (k) {
      const p = pt(k, 1.24);
      ctx.fillText(dimNames[k], p[0], p[1] + 10);
    });

    // card line
    ctx.fillStyle = "#ffffff"; ctx.font = "italic 500 58px " + SERIF;
    const lines = wrap(ctx, ending.card.replace(/\*/g, ""), W - 260);
    lines.forEach(function (l, i) { ctx.fillText(l, W / 2, 1045 + i * 68); });

    // footer
    ctx.fillStyle = accent; ctx.font = "600 28px " + SANS;
    ctx.fillText(spaced("PARALLEL FUTURES"), W / 2, H - 150);
    ctx.fillStyle = "#8a90b8"; ctx.font = "500 26px " + SANS;
    ctx.fillText("Every choice splits the timeline.", W / 2, H - 104);

    return new Promise(function (resolve, reject) {
      c.toBlob(function (b) { if (b) resolve(b); else reject(new Error("toBlob failed")); }, "image/png");
    });
  }

  return { toBlob: toBlob };
})();
