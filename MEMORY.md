# Parallel Futures — Project Memory

> Read CLAUDE.md and this file at the start of every session.

## Project in one line
An interactive website game, **Parallel Futures**, where players make everyday decisions and see how those choices shape different possible futures. A full journey takes 5–10 minutes.

## Progress log

### Session 1 — 3 Nov 2026
- Read CLAUDE.md. MEMORY.md was empty, so this is the first working session.
- **Created `PRD.md`** (Draft v1.0): the full product requirements document.
- **Created `STORY_OUTLINE.md`** (Draft v1.0): the full story outline, a branch map (Mermaid diagram), ending logic and callback threads.
  - Assumed a **general audience**, since open question 1 isn't answered yet.
  - 12 decisions per run, Chapter 3 has 4 opening variants, Chapter 4 has 4 crisis variants, plus 8 endings.
  - **The twist:** the Archivist ("— A.", the stranger in the grey coat) is the player's future self, revealed in the secret ending "The Unexpected".
  - The main "decisions matter" payoff is the Chapter 4 **"Who shows up?"** scene, which calls back to Sam, Rosa, the food bank, Biscuit the dog and the friends' trip.
  - The Chapter 4 "Letter" choice doesn't change scores. It changes the epilogue's final line and unlocks the secret ending.
- **Created `SCRIPT.md`** (Draft v1.0): all the player-facing text. That covers every scene and variant, choice labels, ripple lines, 8 epilogues, a bank of 14 callback lines, 4 letter lines, Future Card lines, Parallel Map teasers and UI microcopy.
  - It's about 3,000 words in total including tables. A single playthrough is about 1,200–1,300 words, at the low end of the PRD's 1,200–1,800 range. That was deliberate, to keep it snappy.
  - New characters added while writing: great-aunt **Vera** (the windfall), **Mo** (a food-bank pensioner who returns in Ch 4), **Inês** (a Lisbon hostel owner) and **Jordan** (met through Biscuit).
  - Rosa's "1970s Lisbon" stories plant an echo: if you later move to Lisbon, the ripple line reads "Rosa was right about the light here."
  - Epilogue formula: archetype opening, then 2 callback lines (by flag priority), then a trade-off line, then a letter line.
- **Built the playable prototype.** Open `index.html` to play it. It needs no install or server, and works when opened straight from disk.
  - It covers every MVP feature in the PRD (F1–F13): landing screen, scenes, choices, hidden scores and flags, conditional scenes, the animated branch split after each choice, chapter cards, 8 endings, the epilogue and Future Card (with a radar chart), the Parallel Map with ghost-branch teasers, Rewind, saving and resuming in the browser, mobile layout, keyboard play (number keys 1–4) and reduced motion.
  - The visual identity is in place: a starry background, and an accent colour that follows the player's strongest dimension (gold Security, amber Connection, teal Growth, green Wellbeing, violet Impact).
  - **Tested:** the simulator played all **41,472 paths**. Every one has 12 decisions with no missing text, and all 8 endings are reachable: Builder 25%, Anchor 24%, Quiet Hero 21%, Wanderer 16%, Phoenix 7%, Golden Cage 3.5%, Balanced 2.3%, Unexpected (secret) 0.7%. Played in the browser on desktop and mobile: the Unexpected and Phoenix endings, resume after reload, the map, ghost teasers and rewind all worked, with no console errors.
  - Fixes made during testing: a radar label was clipped, the progress bar overlapped text, and the Phoenix epilogue mentioned both "the cardboard box" and "the hospital corridor" even though a player only experiences one. That line is now generic in both the game and SCRIPT.md.
- **Mark played the prototype: "it's really good."** No changes requested, so the prototype is approved as the baseline.
- **Added sound and polish** (PRD S1, S2, S3):
  - **Generative audio** (`js/audio.js`): every sound is synthesised in the browser with the Web Audio API, so there are no sound files or licensing to worry about. Each chapter has its own slow ambient chord (Prologue: mysterious A minor; Today: hopeful C major 7; One Year Later: open F major 7; Five Years Later: bittersweet D minor 9; Fifteen Years Later: reflective E minor 7; ending: C major 9; secret ending: an unexpected A-flat chord). Chords crossfade between chapters. A bell chime plays when the timeline splits, with the pitch depending on the branch taken. There's a soft swell on chapter cards and rising bells when the ending is revealed.
  - **Sound toggle** (top right): on by default on desktop and off by default on phones, as the PRD asks. The setting is remembered. Audio only starts after the first tap (a browser rule), and pauses when the tab is hidden.
  - **Save your Future Card** (`js/card.js`): builds a 1080×1350 PNG (Instagram portrait size) with the archetype, radar chart and card line in the accent colour. **Share** appears only on devices with a native share sheet (mostly phones) and shares the image itself. The image is pre-built after the ending appears, so the share sheet opens instantly.
  - **Tap to skip:** while text is fading in, buttons are locked, so an invisible choice can't be clicked by accident. A tap or key press finishes the reveal instead.
  - Also added a favicon (a split timeline) and share-link metadata.
  - Tested in the browser: audio starts on Begin, and tap-to-skip doesn't trigger a choice. A full run along the Rosa route showed the Lisbon echo ("Rosa was right about the light here."), the Rocket opening and Rosa's grandson in Ch 4. The card PNG renders correctly, Save downloads `parallel-futures-the-builder.png`, the toggle remembers its setting, sound defaults to off on a phone, and there are no console errors. Mark listened with sound on: **"Sounds great."** Audio volume and mood are approved as they are.
- **Set up version control for GitHub hosting:**
  - This PC has no standalone `git` or `gh`, but **GitHub Desktop is installed**. Its bundled git is at `%LOCALAPPDATA%\GitHubDesktop\app-3.6.10\resources\app\git\cmd\git.exe`, and the git identity is `markcameron1000`. Use that path for git commands (the version folder may change when GitHub Desktop updates).
  - Added `README.md` (how to play, features, structure, how to turn on GitHub Pages) and `.gitignore`.
  - Created a local repo on branch `main` with the first commit.
  - **Publishing is done by Mark in GitHub Desktop** (Publish repository), so Claude never handles GitHub credentials. Note: GitHub Pages on a free account needs a **public** repository.
- Next step: After that: audio (S1), downloading the Future Card as an image (S2), illustrations, and playtesting with 5–10 people.

## Key decisions (from the PRD)
| Decision | Choice | Why |
|---|---|---|
| Structure | Prologue, 4 chapters (Today, +1 yr, +5 yrs, +15 yrs), then ending | Fits 5–10 min, and the time jumps make consequences visible |
| Decisions per run | 10–12, with 2–3 options each | About 30–45 s per decision gives 6–8 min |
| Hidden state | 5 dimensions (Security, Connection, Growth, Wellbeing, Impact) plus story flags | Consequences show in the story, not as scores, so the game never feels "gamey" or preachy |
| Endings | 8 archetypes (incl. 1 secret), each citing 2+ of the player's real choices | Makes decisions feel personal and encourages replay |
| Replay hook | "Parallel Map" showing untaken ghost branches, plus "Rewind to here" | Curiosity about the futures they missed |
| Recurring character | "The Archivist", who has seen every timeline | Adds mystery and frames the final reveal |
| Visual identity | "Timelines as light": glowing threads that split at each choice, dark starry base | Signature moment, beautiful, and cheap to produce |
| Tech | Static site, vanilla HTML/CSS/JS, story in `story.json`, localStorage, no backend | Simple, fast, free to host, and content is editable without code |
| Scope control | "Branch and merge" story structure | Stops branching content from exploding in size |

## Learnings & takeaways
- A good PRD for a narrative game needs content requirements (word counts, tone, inclusivity) as well as features. The content is the product.
- "Decisions matter" is a design problem: it's solved with callbacks (flags) and endings that reference specific choices, not just with more branches.
- The best callbacks come from choices that seem **trivial** when made (replying to a text, adopting a dog, helping a neighbour). The payoff surprises the player more than the "big" choices do.
- Branch and merge in practice: shared chapter beats with variant *flavour text* keeps the story to about 4,350 words, instead of growing exponentially.
- **Story data is a `.js` file, not `.json`** (`js/story.js` sets `window.STORY`). Browsers block loading JSON from local files, and this way the game works with a double-click. The format is still plain data and easy to edit.
- Keeping the game rules (`js/logic.js`) separate from the display code (`js/engine.js`) means the same rules power both the game and the simulator that checks every path.
- This PC has no Node or Python, so local testing uses `tools/serve.ps1`, a small PowerShell web server (configured in `.claude/launch.json`).
- An every-path simulator is worth its weight in gold for branching stories. It proves each ending is reachable and shows how often each one comes up.

## Open questions (awaiting Mark)
1. Primary audience: general public, or an education or careers programme (e.g. 5% Club partners)?
2. One fixed story for v1, or a choice of starting scenarios?
3. Custom illustrations, or the abstract light-threads style?
4. Is Future Card sharing needed at launch?
5. Any branding requirements?

## Files
- `CLAUDE.md`: project brief and instructions
- `MEMORY.md`: this file (project memory)
- `PRD.md`: product requirements document
- `STORY_OUTLINE.md`: story outline, branch map, endings and callback threads
- `SCRIPT.md`: full player-facing script (the source for `js/story.js`)
- `index.html` + `css/style.css`: the game page and visual styling
- `js/story.js`: all story content as data (edit text here)
- `js/logic.js`: game rules (conditions, effects, ending selection, epilogue)
- `js/engine.js`: screens, animation, input, saving, Parallel Map and rewind
- `js/audio.js`: generative music and sound effects, plus the sound toggle logic
- `js/card.js`: draws the Future Card as a PNG for saving and sharing
- `tools/simulate.html` / `simulate.js`: plays every path and reports how often each ending occurs (needs the local server)
- `tools/serve.ps1`: local test server at http://localhost:8080
