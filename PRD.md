# Parallel Futures — Product Requirements Document

| | |
|---|---|
| **Product** | Parallel Futures (interactive web game) |
| **Owner** | Mark Cameron |
| **Status** | Draft v1.0 |
| **Date** | 3 November 2026 |

---

## 1. Summary

Parallel Futures is a short, browser-based interactive story in which the player makes everyday decisions and watches them ripple outward into one of many possible futures. A full playthrough takes 5–10 minutes. At the end, the player sees the future they built alongside the "parallel" futures they didn't choose, so they come away curious to play again and thinking about how small choices compound.

**One-line pitch:** *Every choice splits the timeline. See where yours leads, and who you might have become.*

---

## 2. Problem & Opportunity

People rarely get to see the long-term consequences of today's decisions. Advice about this ("save early", "keep in touch with friends", "take the risk") is abstract and easy to ignore. A short, beautiful, replayable story makes those consequences felt rather than explained, without lecturing.

---

## 3. Goals

### Product goals
1. **Decisions feel like they matter.** Players notice that earlier choices change later scenes, characters and outcomes.
2. **Curiosity drives replay.** Players want to see the futures they missed.
3. **Instantly understandable.** Someone can start playing within 5 seconds with no tutorial.
4. **Thought-provoking but fun.** It leaves the player with a reflection, not a lesson.
5. **Feels premium.** Visually polished, atmospheric and smooth on phone and desktop.

### Non-goals (v1)
- User accounts, logins or a server-side database.
- Multiplayer or social feeds.
- Realistic financial, career or medical advice. Scenarios are illustrative, not prescriptive.
- Procedurally generated or AI-generated story text at runtime (all content is authored).

---

## 4. Target Audience

- **Primary:** curious adults aged 16–40 who enjoy short interactive experiences such as narrative games, quizzes and "choose your path" stories.
- **Secondary:** educators, youth and careers programmes, and workshop facilitators who want a conversation starter about choices and futures.
- **Context of play:** mostly mobile, often a one-off visit from a shared link. Sessions are short and the game has to hook people in the first 30 seconds.

---

## 5. Experience Principles

| Principle | What it means in practice |
|---|---|
| **Show, don't tell** | Consequences appear in the story itself (a missed message, a new skill, an old friend's reaction), not as a score. |
| **Small choices, big ripples** | Some choices that seem trivial come back later in surprising ways. |
| **No "right" answer** | Every path leads somewhere interesting. Endings are nuanced, never "you lose". |
| **Minimal friction** | One tap per decision. No menus mid-story. Text is short enough to read at a glance. |
| **Occasionally surprising** | Callbacks, twists and an unexpected character keep players alert. |
| **Respectful tone** | Intelligent and warm. It never moralises or shames a choice. |

---

## 6. Core Experience

### 6.1 Journey overview

```
Landing ──► Prologue ──► Chapter 1 ──► Chapter 2 ──► Chapter 3 ──► Chapter 4 ──► Your Future ──► Parallel Map
 (5s)       (20s)        Today        +1 year      +5 years     +15 years     (ending)        (replay hook)
```

- **About 10–12 decisions** per playthrough, 2–3 per chapter.
- **About 30–45 seconds per decision** (read, choose, see the consequence), which comes to a 6–8 minute journey.

### 6.2 Core loop

1. **Scene:** a short illustrated moment of 2–4 sentences.
2. **Decision:** 2 or 3 clear choices, shown as large cards or buttons.
3. **Ripple:** a brief animated consequence. The timeline visibly branches, and sometimes a hint appears ("This will matter later…").
4. **Time jump:** a stylised transition into the next chapter showing how life has shifted.

### 6.3 The story frame

The player is **"You"**, a person at an ordinary crossroads (for example, just finishing education or starting a first job). Gender, name and appearance are left unspecified so anyone can step in. A mysterious recurring character, **the Archivist** (someone who has seen every timeline), appears briefly at key moments to add intrigue and provide the final reveal.

### 6.4 Life dimensions (hidden state)

Every choice nudges a small set of hidden values. They are **never shown as numbers during play**. Instead they shape which scenes, dialogue and ending the player gets.

| Dimension | Represents |
|---|---|
| **Security** | Money, stability, safety nets |
| **Connection** | Relationships, family, community |
| **Growth** | Skills, learning, curiosity |
| **Wellbeing** | Health, energy, peace of mind |
| **Impact** | Contribution to others and the world |

In addition, **story flags** record specific choices (e.g. `kept_in_touch_with_sam`, `learned_to_code`, `took_the_job_abroad`) so later scenes can call back to them directly.

### 6.5 Chapters (draft content outline)

| Chapter | Time | Example decisions |
|---|---|---|
| **Prologue** | The night before | A message from an old friend, Sam: reply now or later? *(seemingly trivial, pays off in Ch 4)* |
| **1. Today** | Present | Take the safe job offer or the risky start-up? Spend a windfall, save it, or invest in a course? |
| **2. One year later** | +1 yr | A chance to move to a new city. Burnout signs: push through or step back? |
| **3. Five years later** | +5 yrs | A big opportunity that clashes with a commitment to someone you care about. A side project: grow it or let it go? |
| **4. Fifteen years later** | +15 yrs | A crisis (job loss, illness in the family, or an industry shift, depending on path). Who shows up for you depends on earlier choices. |
| **Your Future** | +20 yrs | Ending scene and reflection. |

Chapter content **varies by path**. Chapter 3 has at least 3 variant scenes and Chapter 4 at least 4, chosen by flags and dimension levels.

### 6.6 Endings

- **8 distinct endings** in v1, each an archetype built from the dominant dimensions, for example:
  - *The Builder* (high Security + Growth)
  - *The Anchor* (high Connection + Wellbeing)
  - *The Wanderer* (high Growth, low Security)
  - *The Quiet Hero* (high Impact + Connection)
  - *The Golden Cage* (high Security, low Wellbeing and Connection)
  - *The Phoenix* (recovered from a low point)
  - *The Balanced Life* (no extreme dimension)
  - *The Unexpected* (a secret ending reached through a specific chain of flags)
- Each ending includes:
  - A short narrative epilogue (about 100 words) referencing **at least 2 specific choices** the player made.
  - A "**Future Card**": a beautiful, shareable summary showing the archetype name, an illustration, a five-point radar of dimensions, and a one-line reflection.

### 6.7 The Parallel Map (replay hook)

After the ending, the player sees a **branching timeline visualisation** of their journey:
- Their path is lit; untaken branches appear as faint "ghost" futures.
- Hovering or tapping a ghost branch shows a teaser ("In another timeline, you moved to Lisbon…").
- **"Rewind to here"** lets the player jump back to any past decision and replay from that point.
- An endings collection (for example "3 of 8 futures discovered") is saved locally to encourage exploration.

---

## 7. Functional Requirements

### Must have (MVP)

| ID | Requirement |
|---|---|
| F1 | Landing screen with title, a one-line hook and a single **Begin** button. No instructions needed. |
| F2 | Scene renderer: background art or illustration, short text, 2–3 choice buttons. |
| F3 | Choice handling updates hidden dimensions and story flags. |
| F4 | Conditional content: scenes, text lines and choices can be shown or hidden based on flags and dimension thresholds. |
| F5 | Ripple feedback after each choice: a brief animation plus an optional one-line consequence. |
| F6 | Chapter time-jump transitions. |
| F7 | Ending selection logic that picks 1 of 8 endings from dimensions and flags. |
| F8 | Ending screen with epilogue and Future Card. |
| F9 | Parallel Map showing the path taken and untaken branches. |
| F10 | Rewind: restart from any previous decision. |
| F11 | Local progress saving: resume a journey in progress and track endings discovered. |
| F12 | Fully responsive layout (mobile first) with touch and keyboard support. |
| F13 | Story content stored in a separate data file (JSON) so it can be edited without code changes. |

### Should have

| ID | Requirement |
|---|---|
| S1 | Ambient soundtrack and subtle sound effects, with a mute toggle (off by default on mobile). |
| S2 | Download the Future Card as an image and share it via the native share sheet. |
| S3 | Typewriter or fade-in text effect, skippable on tap. |
| S4 | "Surprise" moments: at least 3 callbacks where an early choice reappears unexpectedly. |
| S5 | Reduced-motion mode that respects the OS setting. |

### Could have (later)

- Multiple starting scenarios (for example "The Student", "The Career Changer", "The Retiree").
- Facilitator mode for classrooms, with discussion prompts after each chapter.
- Anonymous aggregate stats ("62% of players took the safe job").
- Localisation into other languages.

---

## 8. Visual & Audio Design

- **Mood:** dreamlike, cinematic and hopeful, with a hint of mystery.
- **Visual metaphor:** **timelines as light**. A glowing thread runs through the UI, splitting at each decision. Colours shift subtly with the player's dominant dimension (warm amber for Connection, teal for Growth, gold for Security, soft green for Wellbeing, violet for Impact).
- **Style:** layered flat or gradient illustration with parallax depth. A dark, starry base palette makes the light threads stand out.
- **Typography:** an elegant serif for story text and a clean sans-serif for UI. Large, readable sizes, with no more than about 60 words on screen at once.
- **Motion:** smooth, purposeful transitions of 300–600 ms. The branching animation is the signature moment and must feel satisfying.
- **Audio:** an ambient pad that evolves by chapter, plus a soft chime when the timeline splits.

---

## 9. Content Requirements

- Total word count: about 4,000–6,000 words across all branches. Any single playthrough shows about 1,200–1,800 words.
- Each scene is 2–4 sentences. Each choice label is 8 words or fewer.
- Scenarios cover realistic, relatable themes (work, money, relationships, health, purpose, technology change), kept accessible and free of jargon.
- Avoid heavy or triggering content. Difficult moments such as job loss or illness are handled gently, without graphic detail.
- Content is reviewed for inclusivity: no assumed gender, culture or family structure.

---

## 10. Technical Approach (recommended)

| Area | Recommendation |
|---|---|
| **Platform** | Static website that runs in any modern browser, with no backend. |
| **Stack** | HTML, CSS and vanilla JavaScript (or a lightweight framework such as Svelte or Preact if complexity grows). |
| **Story engine** | A small custom engine that reads `story.json` (scenes, choices, effects, conditions, endings). |
| **State** | In-memory game state, persisted to `localStorage` for resume and endings collection. |
| **Visuals** | CSS gradients and animations plus SVG or Canvas for the timeline threads. Illustrations as optimised SVG or WebP. |
| **Hosting** | Any static host (GitHub Pages, Netlify, Vercel). |
| **Performance** | First load under 2 MB and interactive within 2 seconds on 4G. |
| **Browser support** | Latest 2 versions of Chrome, Safari, Edge and Firefox, plus iOS Safari and Android Chrome. |

### Story data model (sketch)

```json
{
  "id": "ch1_job_offer",
  "chapter": 1,
  "text": "Two offers sit in your inbox...",
  "conditions": { "flags": [], "min": {}, "max": {} },
  "choices": [
    {
      "label": "Take the safe job",
      "effects": { "security": 2, "growth": -1 },
      "setFlags": ["took_safe_job"],
      "ripple": "A steady salary. A quiet doubt.",
      "next": "ch2_city_move"
    }
  ]
}
```

---

## 11. Accessibility

- Meets WCAG 2.2 AA: colour contrast, focus states, and screen-reader-friendly scene text and choices.
- All choices can be reached and selected with the keyboard.
- Respects `prefers-reduced-motion`. Sound is optional and never essential to understanding.
- Text can be resized without breaking the layout.

---

## 12. Success Metrics

| Metric | Target |
|---|---|
| Start rate (landing to first decision) | ≥ 80% |
| Completion rate (start to ending) | ≥ 65% |
| Median session length | 5–10 minutes |
| Replay rate (players who rewind or restart) | ≥ 35% |
| Future Card shares or downloads | ≥ 10% of completions |
| Qualitative: "My choices mattered" (playtest survey) | ≥ 4 / 5 |

*In v1, measure through playtesting sessions. Privacy-friendly analytics, if any, are optional and can come later.*

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Branching content explodes in scope | Use a "branch and merge" structure: paths diverge, then reconverge on shared scenes whose details vary by flag. |
| Choices feel cosmetic | Every chapter includes at least one explicit callback to a previous choice. Endings cite specific decisions. |
| Feels preachy | No "good" or "bad" endings. Every archetype has upsides and trade-offs. |
| Too long for a casual visitor | Strict word limits, skippable text effects, and a target of 10–12 decisions. |
| Art production time | Start with a stylised abstract look (gradients, light threads, silhouettes) that is cheap to produce and still beautiful. |

---

## 14. Milestones

| Phase | Deliverable |
|---|---|
| **1. Design** | PRD (this document), story outline and branch map, visual mood board |
| **2. Prototype** | Playable greybox: engine, JSON story, all chapters with placeholder text |
| **3. Content** | Full story writing, 8 endings, callbacks and surprises |
| **4. Polish** | Visual design, animations, Parallel Map, Future Card, audio |
| **5. Test & launch** | Playtesting (5–10 people), fixes, accessibility check, deploy to a static host |

---

## 15. Open Questions

1. Who is the primary audience: general public, or a specific education or careers programme (e.g. for 5% Club partners)? This affects tone and scenarios.
2. Should the player choose a starting scenario, or is there one fixed story for v1?
3. Is a custom illustration style wanted, or is the abstract "light threads" aesthetic enough?
4. Is sharing (Future Card images) important for launch, or a later addition?
5. Any branding requirements (logo, colours, organisation name)?
