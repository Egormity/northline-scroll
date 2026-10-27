# How Northline scrolls

Northline is an example of the Scroll-driven websites skill, not a required template. Its fictional outdoor journal combines a paced sequence of editorial, typographic, filmed, mapped and photographic chapters. Use the mechanics where they support a different site's content; do not copy the theme or add video to every page.

## Native page movement

`src/motion/MotionProvider.tsx` owns one Lenis instance. It uses `autoRaf`, wheel smoothing, a short `lerp` of 0.12, and native touch behavior. No second loop calls Lenis and root CSS does not also request smooth scrolling. Native keyboard scrolling and scrollbar dragging remain available.

Same-page anchors use the same controller, account for the fixed header, update the URL hash, and move keyboard focus after arrival. The provider owns modal scroll locking and restores the previous document overflow when a photograph closes. An explicit user preference is saved locally; a live system reduced-motion preference takes precedence and destroys the smoothing controller.

## One position for the scenes

`useSceneProgress` observes the real window scroll position and batches changes into requestAnimationFrame. Geometry is measured after layout changes rather than on every scroll event. For a sticky stage, progress is clamped from:

```text
(scrollY - (trackStart - stickyInset)) / (trackHeight - stageHeight)
```

The hook handles zero travel, resize, media loading, and font readiness. Cleanup cancels scheduled work and prevents delayed promises from reactivating a removed scene. Chapter components update scoped transforms, opacity, and progress styles rather than re-rendering the whole page on every frame.

## The film chapter

`Journey.tsx` gives a desktop stage 300svh of total track height, with a 100svh sticky scene. Three copy beats each have an entrance, a fully readable hold, and an exit. A separate semantic text sequence preserves the complete reading order for assistive technology.

The media opens from an inset rounded frame into full bleed during the first quarter of its travel. Text and outlined chapter numerals translate with the same progress that drives their opacity. Chapter buttons use the existing scroll controller to reach each beat's reading hold; they retain keyboard focus and report the current chapter. Compact desktop layouts reserve room for the controls below the copy. None of these effects adds another video seek or time-smoothing layer.

The film starts loading only when the scene approaches the viewport. `useVideoScrub` reads `public/media/journey.json`; `videoScrubber.ts` maps progress to one of 300 verified source frames. It requests a time inside that frame, serializes pending seeks, and coalesces new input to the newest target. It does not queue every wheel delta or discard changes with a fixed 0.05-second deadband.

The poster matches the first frame. Metadata errors, failed loading, and late media errors keep the still composition usable and expose a retry button. The final target remains inside the decodable duration. The controller cleans up events, RAF work, and presented-frame callbacks.

The delivered 10.01-second H.264 excerpt has 300 keyframes at the source's 29.97fps. This is an 8 MB seek-oriented derivative, not the larger delivery master. The preparation recipe, author, license, and measured isolated seek behavior are in [assets.md](assets.md). The local Python server supports single byte-range requests with 206 responses, including suffix/open-ended ranges and HEAD requests.

Phones and reduced-motion layouts use the poster plus all three text blocks in normal flow. They do not request the film or reserve a long pinned range. This is an intentional lighter composition, not a claim that every mobile browser cannot play video.

## The journal rail

`Gallery.tsx` measures the rail's actual overflow. Its desktop track height is the stage height plus that travel; the rail translation follows scene progress. No overflow means no extra pinning. React state changes only when the active card changes.

The images counter-pan inside their cropped cards. Card centers are cached when geometry changes, so frame updates only write transforms. A chapter progress line follows the measured rail travel.

Arrow controls and keyboard focus can bring a photo into view without requiring precise wheel movement. Narrow layouts use a native horizontal rail; reduced motion presents a grid or stacked photographs. `GalleryDialog` uses a native modal dialog, supports Escape and arrow keys, restores focus, and releases its scroll lock on cleanup.

## Arrival and field notes

`Hero.tsx` uses viewport progress for the coast's scale and pan, opposing headline movement, and a rotating compass. `Introduction.tsx` staggers the heading lines and opens the forest photo into view. Both apply effects only above 760px with motion enabled. Content has visible default styles and remains readable throughout the reveal.

`FieldNoteDeck.tsx` presents three real notes with previous/next buttons and an accessible status announcement. The active card is the only card in the accessibility tree. Desktop scroll raises and rotates the stack; a fine pointer adds a modest tilt. Narrow screens keep a smaller decorative spread, and reduced motion removes transitions. The download still includes all three notes regardless of the selected card.

`ReadingProgress.tsx` measures document travel on layout changes and writes a single header-line transform on scroll. Scene effects stop changing when input stops; there are no perpetual decorative animation loops. Additional motion uses the existing scene hook and scoped CSS variables, with no new animation dependency.

## Added chapters and ambient films

`QuietManifesto` emphasizes authored words as the reader passes through a full-width editorial passage. Its accessible heading has one complete phrase; decorative split words are hidden from assistive technology. All words return to full readability on phones and with motion off.

`RouteChapter` draws a normalized SVG path and updates three waypoints from sticky progress. Its buttons use the existing page controller, preserve focus and can jump to the corresponding hold. `routeData.ts` contains the path, coordinates and content. The route is deliberately fictional and visibly marked as unsuitable for navigation. Motion-off mode draws the whole route in normal flow.

`CoastInterlude` introduces an ambient coast film with a moving title and a changing visual aperture. `ForestChapter` opens a circular mask around a second film and presents 24 bounded decorative motes. Mote positions are deterministic functions of scroll progress, so they reverse and settle without a continuous particle simulation. Masks apply only to media layers; film controls remain reachable.

`AmbientFilm` and `useFilmVisibility` own ordinary playback separately from scrubbing. Each film mounts near its chapter and plays only while visible, motion is enabled, the layout is desktop and the document is visible. Pause choices persist across leaving and returning to the scene. Autoplay rejection exposes play, errors preserve posters, and unmount/visibility changes pause the element. Phones and reduced-motion layouts never mount the video elements. The clips are generated assets with their own [provenance](generated-films.md).

See [extending.md](extending.md) for a scene map and the workflow for adding independent chapters without changing the decoder or creating another scroll controller.

## Evidence and limits

The browser suite also checks route reversal and keyboard selection, removal of extra pinned travel, bounded particle updates, ambient playback/pause ownership, and the new chapters at 320px without video requests or page overflow. A local valid clip is substituted in the ambient lifecycle test; a separate test verifies the two real checked-in generated clips, their byte ranges, decoded dimensions/duration, playback and keyboard pause controls. No live provider request is needed to run the suite.

The browser suite checks real wheel input and reversal, keyboard page movement, focused anchor destinations, the actual notes download, photo dialogs, and live reduced-motion changes. It checks that narrow and motion-off layouts do not fetch the video.

It also exercises reversed hero movement, keyboard chapter selection, card cycling and wraparound, retained focus, and the deck on a 320px reduced-motion viewport.

Film checks read `requestVideoFrameCallback` presentation times across forward and reverse targets. They also verify that HTTP range requests return the requested bytes and that a failed film leaves its poster and readable content available. Measurements and screenshots are written under `.playwright` rather than shipped as runtime assets.

These checks establish behavior on the tested Chrome and viewport. Frame pacing still depends on device, display, delivery, and scroll speed. A successful build, a changing `currentTime`, or a high source frame count alone is not evidence of smooth presented motion.
