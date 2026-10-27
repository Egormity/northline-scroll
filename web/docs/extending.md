# Extend the journal

Northline is one complete, fictional editorial experience. Reuse the mechanisms for a different brief; the outdoor theme, number of chapters and camera movement are not template requirements.

## Work in small complete scenes

1. Read the content brief and existing scene map below. Name the new chapter's purpose, entry, readable hold, exit, mobile composition and motion-off state.
2. Build static semantic content and its responsive layout first. A missing film or disabled animation must still leave a useful page.
3. Add a focused component under `src/components`, story data separately when it is substantial, and a scoped stylesheet under `src/styles`. Register the component in `App.tsx`; do not extend one giant page file.
4. Derive `enhanced` from the relevant viewport capability and `useMotion().reducedMotion`. Reuse `useSceneProgress` for actual scroll progress. Set local CSS properties or transforms through a ref; React state should change only for discrete states such as active waypoint.
5. For a sticky scene, mark its stage with `data-stage` and give its track meaningful additional travel. Use normal flow when no travel is needed. Never accumulate wheel deltas or add a second Lenis instance.
6. Exercise forward, backward, resized and live motion-off states. A disabled effect receives progress zero from the hook: explicitly restore any static end state needed for readability, such as the complete route line.

## Current scene map

| Chapter                 | Responsibility                                    | Extension point                                         |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| `Hero` / `Introduction` | Layered arrival and editorial introduction        | Copy, crop and bounded transform mapping                |
| `QuietManifesto`        | Progressive typographic emphasis                  | Authored words and reveal interval; one accessible copy |
| `Journey`               | Frame-aware scrubbed film and three beats         | Beat data, seek manifest and measured track distance    |
| `RouteChapter`          | SVG route drawing and keyboard waypoints          | `routeData.ts` geometry, stops and copy                 |
| `CoastInterlude`        | Wide ambient film, moving type and frame aperture | `AmbientFilm` source/poster plus content                |
| `Gallery`               | Measured horizontal photo rail and dialog         | `galleryData.ts`; rail travel measures actual overflow  |
| `ForestChapter`         | Circular reveal and decorative motes              | Clip radius, bounded mote data and film slot            |
| `FieldNotes`            | Interactive deck and actual download              | `fieldNotesData.ts`; all notes remain in the download   |

## Keep motion ownership clear

`MotionProvider` owns the single page smoothing controller, anchor focus and modal lock. `useSceneProgress` owns geometry measurement and coalesces scene changes per frame. New chapters may observe the same actual scroll position but must not apply a second easing layer to it.

The forest's 24 motes are decorative functions of progress, not a physics simulation. They reverse with scrolling and stop changing when it stops. For an actual simulation, put its state and fixed-step update in a separate module, keep rendering read-only, and deliberately choose how scrolling influences it. Reversing a camera or authored timeline does not reverse gravity, collisions or accumulated state.

Large particle systems may need pooled Canvas/WebGL rendering and measured GPU budgets. Do not introduce that cost for a small decorative layer. Keep reduced-motion alternatives, cap counts and suspend effects when not needed.

## Media ownership

`Journey` uses a verified frame manifest and serialized seeks; it must not autoplay. Its poster must match the selected source. See [assets](assets.md) for the original license and encoding recipe.

`AmbientFilm` uses ordinary playback, never the scrub controller. `useFilmVisibility` mounts media near its scene, pauses it offscreen or on document visibility loss, and preserves a visitor's pause selection. Phones and motion-off layouts use posters without fetching clips. Controls sit outside clipped visual layers. Autoplay denial exposes the play control; loading errors keep the poster. A future retry feature should reset failure/readiness explicitly and remain bounded.

To replace generated footage, generate through the available authorized provider connection, download the completed result, inspect the source and encode an appropriate delivery derivative. Use separate seek-oriented encoding if adding scrubbing. Save prompt/model/provenance and frame metadata; do not embed a provider key or a transient provider URL in the client. See [generated films](generated-films.md).

## Template and delivery checks

Keep authored HTML, TSX, CSS and docs readable with `pnpm format` and `pnpm format:check`; generated bundles stay in ignored `dist`. Preserve the pinned package manager, lockfile, root Dockerfile and injected `PORT`. Follow [Amazi setup](amazi.md) when importing into a new or existing project.

Run unit checks and build. For relevant interaction changes, use the browser suite for keyboard controls, direction reversal, normal and reduced motion, viewport changes, missing media and lifecycle cleanup. The ambient-media lifecycle test uses the existing local scrub clip as a fixture so it does not depend on a live provider. `e2e/generated-films.spec.ts` separately verifies both checked-in generated clips, byte ranges, dimensions, duration, muted playback and keyboard pause controls.

Do not call a brief build or screenshot a performance guarantee. Keep evidence of measured file size, decoded/presented frames and actual viewport/input when diagnosing smoothness.
