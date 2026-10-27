# Northline

A cinematic, scroll-driven outdoor journal: a photographic opening, typographic reveals, a scroll-controlled film, an illustrated route, ambient coast and forest films, a horizontal photo chapter, and downloadable field notes. It is a working example for Amazi's Scroll-driven websites skill.

The journal describes an imagined journey. It is a design demonstration, not a travel service or a guide to a real route. Media provenance and licenses are documented in [docs/assets.md](docs/assets.md).

## Run locally

The local checkout is `/home/egormity/Desktop/egormity-repos/Egormity/northline-scroll`.
Use Node.js 22.12 or newer and the pinned pnpm 11.7.0:

```bash
pnpm install
pnpm dev
```

Development runs at `http://127.0.0.1:4408`. To build the website:

```bash
pnpm build
```

The `dist` folder can be served by a static host. Serve videos with their correct media type and HTTP byte-range support. Avoid caching the HTML permanently; hashed build assets can use long cache lifetimes.

Development and Vite preview bind to `0.0.0.0` and use `PORT` when supplied. The Dockerfile
provides Amazi-compatible Node 22 build and non-root static production stages. See
[Amazi setup](docs/amazi.md) for application registration, source placement, and runtime settings.

## Desktop shortcut

The supplied Ubuntu desktop shortcut starts the built app in a separate Chrome window. The local server requires Python 3; Node is only needed for developing or rebuilding.

```bash
python3 scripts/launch.py
```

Open `http://127.0.0.1:4409`. Use `--no-open` to start without opening a window, or `--stop` to stop the local server. The launcher reuses only a matching app server. It stores its PID and startup log under `~/.cache/northline-scroll` and binds to loopback only. Closing the window leaves the server running for the next visit.

## Experience

- Scroll with a mouse wheel, trackpad, touch, keyboard, or the scrollbar.
- Follow the section links to jump between chapters.
- The opening photograph, split headline, compass, and forest introduction move in layers as you scroll on desktop.
- The desktop film follows page position in both directions.
- Its frame opens into the landscape; chapter controls jump to three moments in the story.
- Trace an imagined route, choose its waypoints with the keyboard, and reveal a forest through a widening circular window.
- Watch two generated landscape films with visible pause controls. Playback stops offscreen; decorative forest particles follow scroll and need no permanent animation loop.
- The photo chapter moves horizontally on desktop; its controls and keyboard navigation remain usable.
- Open photographs for a closer look, turn through the three field-note cards, and download the full notes.
- Turn motion off, or use your system's reduced-motion preference, for a simpler layout. Phones retain native scrolling and a lighter composition.

All media is stored with the project. The site does not require an account, a media provider key, or a runtime connection to a stock library.

Version 0.2.0 adds layered scrolling scenes, chapter navigation, reading progress, and an interactive field-note deck. These effects settle when scrolling stops; the deck also responds to a desktop pointer. Motion-off and phone views retain the content and controls without the large movements.

Version 0.3.0 adds Amazi runtime and container deployment support and relocates the desktop checkout.

Version 0.4.0 expands the journal with four distinct chapters, generated ambient films, explicit media lifecycle handling, readable formatted source and a reusable chapter-development guide.

Version 0.4.1 documents the public template on `main` and importing it into Amazi.

## Verification

```bash
pnpm format:check
pnpm test
pnpm build
pnpm test:browser
python3 -m unittest discover -s scripts -p 'test_*.py'
```

Browser checks use installed Google Chrome and a temporary local server on port 4410. Set `CHROME_PATH` for another Chromium executable. Evidence and screenshots are written under the ignored `.playwright` folder.

The implementation is organized around reusable motion hooks, independently readable chapters, and a single native-scroll-based smoothing controller. See [the implementation notes](docs/scroll-system.md) for scene mechanics, video preparation, and fallback decisions. Read [the extension guide](docs/extending.md) to add a chapter, replace a film or adapt the project as a template. [Third-party notices](THIRD_PARTY_NOTICES.md) identify dependencies and references.
