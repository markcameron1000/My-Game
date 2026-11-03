/*
 * Plays every possible path through Parallel Futures and reports:
 *  - how many paths reach each ending
 *  - decisions per path (should always be 12)
 *  - any scene with missing text, and which Chapter 3/4 variants and callbacks occur
 * Usage: open tools/simulate.html in a browser, or run `node tools/simulate.js`.
 */
let S, L;
const lines = [];
if (typeof document === "undefined") {
  const path = require("path");
  global.window = {};
  require(path.join(__dirname, "..", "js", "story.js"));
  S = global.window.STORY;
  L = require(path.join(__dirname, "..", "js", "logic.js"));
} else {
  S = window.STORY;
  L = window.PFLogic;
}
const console = { log: function (s) { lines.push(s); } };

const endings = {}, decisionCounts = {}, variantHits = {}, problems = [];
let total = 0;
const examples = {};

function bump(o, k) { o[k] = (o[k] || 0) + 1; }

function walk(st, choicesMade) {
  st.step = L.nextStepIndex(S, st, st.step);
  if (st.step >= S.steps.length) {
    total++;
    const key = L.computeEnding(S, st);
    bump(endings, key);
    bump(decisionCounts, choicesMade.length);
    const epi = L.buildEpilogue(S, st, key);
    if (epi.length < 4) problems.push("Short epilogue for " + key + ": " + choicesMade.join(" "));
    if (!examples[key]) examples[key] = choicesMade.join(" → ");
    return;
  }
  const step = S.steps[st.step];
  if (step.type === "chapter") { st.step++; return walk(st, choicesMade); }

  const r = L.resolveParts(step.parts, st);
  if (!r.texts.length) problems.push("No text at " + step.id + " after " + choicesMade.join(" "));
  if (step.type === "beat") {
    bump(variantHits, step.id + ": " + (r.title || step.title));
    if (step.id === "4.0b") bump(variantHits, "4.0b callbacks shown: " + (r.texts.length - 1));
    r.matched.forEach(function (v) { L.apply(st, v.effects, v.flags); });
    st.step++;
    return walk(st, choicesMade);
  }
  step.choices.forEach(function (c, i) {
    const s2 = L.clone(st);
    if (!L.choiceLabel(c, s2)) problems.push("No label at " + step.id + " choice " + i);
    L.apply(s2, c.effects, c.flags);
    s2.step++;
    walk(s2, choicesMade.concat(step.id + ":" + (i + 1)));
  });
}

walk(L.newState(S), []);

console.log("Total distinct paths: " + total);
console.log("\nEndings (paths reaching each):");
S.endingOrder.forEach(function (k) {
  const n = endings[k] || 0;
  console.log("  " + S.endings[k].name.padEnd(18) + String(n).padStart(6) + "  " + (100 * n / total).toFixed(1).padStart(5) + "%");
});
console.log("\nDecisions per path: " + JSON.stringify(decisionCounts));
console.log("\nBeat variants:");
Object.keys(variantHits).sort().forEach(function (k) { console.log("  " + k.padEnd(40) + variantHits[k]); });
console.log("\nExample path per ending:");
Object.keys(examples).forEach(function (k) { console.log("  " + k.padEnd(11) + examples[k]); });
console.log("\nProblems: " + (problems.length ? "\n  " + problems.slice(0, 20).join("\n  ") : "none"));

if (typeof document === "undefined") globalThis.console.log(lines.join("\n"));
else document.getElementById("out").textContent = lines.join("\n");
