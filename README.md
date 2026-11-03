# Parallel Futures

**Every choice splits the timeline.**

Parallel Futures is a short interactive story for the browser. You make 12 everyday decisions over twenty years of a life, and you see how small choices ripple outward into one of eight possible futures. A full journey takes 5–10 minutes.

## Play

- **Locally:** download or clone this repository and open `index.html` in any modern browser. There's nothing to install or build.
- **Online:** turn on GitHub Pages for this repository (Settings → Pages → Deploy from branch → `main` / root). The game will then be live at `https://<username>.github.io/<repository>/`.

## Features

- 12 decisions per playthrough, with branching scenes and callbacks to earlier choices
- 8 endings, including one secret ending, each personalised with lines drawn from your own choices
- **Future Card:** a shareable summary of your life balance, which you can save as an image
- **Parallel Map:** see the futures you didn't choose, and rewind to any decision
- Generative ambient music and sound effects (Web Audio API, no audio files)
- Progress saved in the browser, mobile-first layout, keyboard play (keys 1–4), and support for reduced-motion settings

## Project structure

| Path | Purpose |
|---|---|
| `index.html`, `css/style.css` | Page and visual design |
| `js/story.js` | All story content as data. **Edit the text here.** |
| `js/logic.js` | Game rules: conditions, effects, ending selection |
| `js/engine.js` | Screens, input, saving, Parallel Map, rewind |
| `js/audio.js` | Generative music and sound effects |
| `js/card.js` | Future Card image export |
| `tools/simulate.html` | Plays every possible path (41,472 of them) and reports how often each ending occurs |
| `tools/serve.ps1` | Small local web server for Windows (needed for the simulator) |

## Design documents

- [PRD.md](PRD.md): product requirements
- [STORY_OUTLINE.md](STORY_OUTLINE.md): story structure, branch map and ending logic
- [SCRIPT.md](SCRIPT.md): the full player-facing script
- [MEMORY.md](MEMORY.md): project log, decisions and learnings

## Running the path simulator

```powershell
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

Then open http://localhost:8080/tools/simulate.html.
