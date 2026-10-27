# Northline scroll template

- Keep each story chapter in its own component and stylesheet. Reuse `src/motion` for scroll geometry, preferences, media and lifecycle.
- `MotionProvider` owns the only page scroll controller. Chapters observe actual rendered scroll; never accumulate wheel deltas or add another smoothing owner.
- Scrubbed media and ordinary ambient playback have different lifecycles. Preserve serialized frame-aware scrubbing; pause ambient films offscreen or when the page is hidden.
- Keep full content and controls in native flow for mobile and reduced motion. Every new pin needs measured travel and a complete static composition.
- Scope decorative particles to the chapter, bound their count, and keep them visual only. Scroll-driven decoration needs no perpetual simulation loop.
- Preserve root Dockerfile, pinned package manager, Node 22 compatibility and injected PORT. Amazi application registration is separate from source.
- Run format checks, relevant unit checks and build. Use the existing browser suite for interaction and motion changes; inspect meaningful intermediate states rather than only the opening hero.
- Source must remain readable. Keep files under 300 lines where practical and split anything above 500 lines.

See `docs/scroll-system.md`, `docs/extending.md`, `docs/amazi.md` and `skill/agent-content.md` for ownership and development flow.
