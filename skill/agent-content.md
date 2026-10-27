# Build scroll-driven websites

## Scope and Amazi workflow

Apply this guidance when the user requests a scroll-driven landing page, scrollytelling, a layered cinematic hero, parallax, pinned storytelling, a horizontal gallery, or scroll-controlled video, including smoothness fixes to those experiences. A normally scrollable document or a small overflow fix does not need cinematic effects. When this skill is connected but unrelated to the current request, leave the current task unchanged.

Preserve the requested product, framework, reference, content, brand and existing application structure. Build within the selected application. This skill contains instructions only: it does not install Scroll Craft, supply media, or make an engine, script, browser or provider available.

Use Amazi's registered skills when their scope applies: `design-flow` for complex visual initialization/redesign, `project-application-initialization` for a new project, `development-library-selection` for substantial new dependencies, `image-generation` for image assets, and `video-generation` for requested video. Load them through `load_skill`; follow their current tool contracts. Existing permissions and role limits remain authoritative.

## Development flow and template fit

1. Inspect the existing application, dependency versions, source path, content and media before choosing effects. Write a small scene map with opening/hold/exit states and native mobile/motion-off alternatives. Establish a transfer/decode budget and a clear primary visitor action.
2. Build and verify a readable static page first. Implement one representative interactive chapter end to end, including its controls, loading/error state and cleanup, before extending the pattern. Then compose contrasting rhythms: reading, movement, interaction and rest. A longer page needs meaningful additional content, not repeated blank pinning.
3. Keep chapter components, story data, motion mapping, media lifecycle and styling in focused files. Make content and scene-specific durations easy to change. An added chapter should reuse shared progress/preferences without editing the low-level video decoder or replacing the page scroll controller.
4. In Amazi inspect the application catalog and load `project-application-configuration` when changing topology. Keep each application in its own standalone folder inside the project repository. Inspect supplied source to locate its current application subtree, then import only that subtree's contents through `empty_application` into its returned source root; Git synchronization does not register an application. Keep package manifest, lockfile, HTML entry and Dockerfile at that application's root, with no runtime dependencies on template metadata outside it. Use the application as the Docker build context when it is self-contained. Honor injected `PORT`, keep development reachable on `0.0.0.0`, and put actual production startup in Docker ENTRYPOINT/CMD. Do not replace an existing application's configured source path merely to copy a template.
5. Format authored source, including HTML, JSX and CSS, with the repository formatter; bundled/minified output belongs in ignored build output. Preserve the pinned package manager and frozen lockfile. Verify the real build image, local media paths, health response and byte ranges when changing deployment or media delivery.
6. Verify a thin vertical slice, then scene transitions, reversal, resizing, live motion changes and final performance. Integrate only inspected media and record its provenance. Report what actually works in the demonstrated template and which advanced mechanisms are guidance for extension.

For Amazi setup see [Applications](https://docs.amazi.pro/en/applications), [Publishing](https://docs.amazi.pro/en/publishing-and-domains) and the example's current setup documentation. Do not create a backend, provider connection or physics engine for a static editorial page unless the requested workflow needs it.

## Plan the experience

Reuse the user's brief and supplied assets. Ask only for missing decisions that materially change the result, such as the product, primary action, required content or whether a continuous journey is essential. Make reasonable design decisions within the request; do not impose a questionnaire or another approval step when the user has delegated creative direction.

Choose an organizing structure that fits the content: editorial chapters for a story, a gallery for a collection, a split comparison for before/after, a working demonstration for software, or a cinematic sequence for a product reveal. A continuous world is appropriate when travel through one place is the point. Do not force every site into the same hero/features/cards/CTA sequence, require a fixed number of effects, or replace a supplied reference to make the design different.

In the implementation plan, map each meaningful beat to:

- The content and what the visitor learns or does.
- Its opening, readable hold and exit state.
- The effect, if useful, and what visibly changes during scrolling.
- Its mobile and motion-off composition.

Choose one memorable moment that supports the subject, then let quieter sections carry detail. For example, reveal a product's construction before showing its specifications, or synchronize a working comparison with an explanation. End with the requested action, connected to real behavior. Do not invent statistics, testimonials, product capabilities or a fake working interface. Identify sample data in a demonstration.

## Compose the scene and its assets

Use the existing design system's color, type and spacing tokens. Keep headings, body copy, navigation and actions as semantic application components, separate from imagery. Design for readable text throughout the animation, including the brightest or busiest media behind it. A local text scrim or a separate text region is often preferable to darkening the entire scene.

When depth supports the brief, plan independent background, subject and foreground planes before requesting assets. Describe their crop, overlap, movement and shared contact points. A background plate must not retain a duplicate of an extracted moving subject. Cutouts need real alpha transparency, compatible lighting and clean edges. Anchor a person's feet or a product's base to its supporting surface so different layer motion does not make it float. Keep important words legible when typography passes between planes.

Use suitable supplied and existing media first. Generate missing imagery through Amazi's managed image workflow; inspect and save returned attachments before integrating them. Interface reference images follow `design-flow`'s exact prompt/message-context contract. Asset prompts can describe the specific scene, layers and composition through `image-generation`. Do not draw substitute photos or illustrations with code or invent external asset URLs.

Prefer a complete static composition while media loads or fails. Switch to layered motion only when its required assets are ready. Provide responsive crops and appropriately sized files; a desktop crop seldom composes itself on a phone. Use cinematic video only when it materially serves the request. Requested video generation goes through `video-generation` and its current provider, confirmation and billing contract. For a requested FAL workflow, use the available managed FAL connection rather than inventing a credential or putting provider calls into the public frontend. Save inspected results locally for static templates, record generation/model provenance, and keep runtime playback independent of generation credentials.

## Implement the scroll mechanics

Use native scrolling as the input. Preserve wheel, touch, keyboard scrolling, anchor navigation and ordinary links. Avoid scroll-jacking, pointer locking and mandatory smooth-scroll dependencies. Reuse the application's existing motion library when suitable. For a substantial new interaction system, follow the library-selection workflow and verify current APIs before adding dependencies. Simple sticky layout and local progress mapping need not become a new animation engine.

Separate scene components, progress measurement and motion mapping when they have distinct responsibilities. In React/Next.js, keep browser APIs and animation setup in the appropriate client lifecycle. Prefer scoped refs or motion values over page-wide selectors, DOM text mutation or React state updates on every scroll frame.

For a pinned scene, use a taller track with a sticky stage. When the scroll position, track start and dimensions share the same scroll-container coordinates, normalized progress is:

    p = clamp((scrollPosition - trackStart) / (trackHeight - stageHeight), 0, 1)

This formula assumes a zero sticky top inset. For a fixed-header offset, subtract the sticky inset from trackStart to determine when pinning begins, and verify the measured pinning bounds. If travel is zero or negative, render normal flow. Measure relative to the actual scroll container; do not mix viewport, window and nested-container coordinates. Recompute when the layout changes, including resized viewports and loaded fonts/media. Check ancestor overflow and transforms when sticky positioning fails.

Map progress into deliberate entrance, fully readable hold and exit intervals. Text must reach full opacity long enough to read. Additional pinned distance must reveal content, change the scene or provide a justified reading pause; avoid long stretches where nothing happens. Keep essential content available before enhancement initializes and after animation failure.

Choose only the mechanisms the page needs:

- **Layered hero:** bounded transform differences create depth while text and contact anchors remain stable.
- **Pinned story:** one stage advances through meaningful states and then returns cleanly to document flow.
- **Horizontal gallery:** derive travel from actual rail overflow. When overflow is absent, remove extra pinning. On narrow or motion-off layouts use a usable native rail or normal stacked content; labels and controls must remain reachable.
- **Reveal or typographic sequence:** preserve reading order and accessible text. Avoid announcing split characters or duplicated animated headings to assistive technology.
- **Working demonstration:** scroll changes real component state; controls still work independently of the animation.
- **Continuous journey:** use a persistent scene with coordinated transitions only when requested, while preserving navigable semantic content and a complete fallback.

Prefer transforms and opacity for motion; avoid per-frame layout changes and `transition: all`. Batch geometry reads, coalesce updates with requestAnimationFrame or the existing library, and suspend unnecessary offscreen work. Clean up listeners, animation frames, observers, media resources and animation instances on unmount; route changes must not duplicate them. Restore styles owned by the effect when disabling it.

## Extend the vocabulary deliberately

- **SVG paths, diagrams and timelines:** author geometry as data, use normalized path lengths for drawing, and keep labels/controls semantic. The path must have a useful final static state; reduced motion cannot leave it permanently erased.
- **Masks and depth transitions:** test start/middle/end readability and focus. Clip only visual layers when controls would otherwise become invisible; changing opacity alone does not remove a hidden action from keyboard order. Keep a responsive crop and a complete fallback.
- **Ambient films:** use ordinary muted inline playback when time should advance independently of scroll. Mount/load near the active scene, pause when offscreen or the document is hidden, preserve the visitor's pause choice and provide a visible control. Do not run the scrub controller and autoplay on the same element. Motion-off and constrained layouts can retain a matching poster without requesting video.
- **Particles and atmospheric effects:** choose a bounded decorative layer for dust, rain, sparks or snow. Scroll-driven positions can be a deterministic function of scene progress, allowing clean reversal without a perpetual loop. Real time effects need one existing animation owner, pools/bounded counts, offscreen suspension, reduced-motion behavior and measured fill-rate/overdraw. Decoration must not decide gameplay, physics or application state.
- **Physical or interactive 2D/3D scenes:** use the relevant visualization/game skill when actual collisions, gravity or simulation are required. Keep units, fixed-step state and collision rules independent of rendering; use scroll to drive an explicit parameter or timeline, not to teleport dynamic bodies between arbitrary simulation times. Decide whether reverse scroll restores authored snapshots or only changes camera/progress. Do not imply that reversing scroll reverses a physical simulation reliably. Add an engine only when scene requirements justify it.

These are choices for a brief, not a checklist of effects every site must include. Preserve core document navigation and a complete static composition even when an advanced renderer or media decoder fails.

## Smooth desktop page scrolling

Distinguish three independent problems: the document moves in wheel-sized jumps, an animated element follows scroll unevenly, or the video decoder cannot present frames quickly enough. Fix the measured bottleneck. Smoothing document movement does not make expensive video seeks faster, and smoothing an animation progress value does not smooth the page itself.

CSS `scroll-behavior: smooth` affects anchors and programmatic scroll APIs, not ordinary mouse-wheel input. A spring applied to Motion scroll progress or a GSAP scrub playhead changes the effect's response, not the document's wheel motion. Do not present either as a complete desktop wheel-scrolling fix.

For requested smooth desktop wheel movement, first reuse an existing scroll controller if suitable. Otherwise consider a maintained native-scroll-based library such as Lenis through the library-selection workflow; it is optional, not a dependency for every scrolling page. Check its installed version and official integration instructions. For Lenis, enable wheel smoothing, keep native touch behavior unless the task needs otherwise, include its stylesheet, and configure anchors and nested-scroll exclusions. Use one controlling instance and one driver per scroll container: `autoRaf` OR the application's existing RAF/GSAP ticker, never both. A manual Lenis RAF receives milliseconds. Destroy the instance and detach its callbacks on unmount. Verify reduced-motion handling in the installed version; use its supported setting or disable smoothing yourself, including live preference changes. These options are a starting point, not a promise of smoothness on every device.

Keep one authoritative rendered scroll position for the page, pinned scenes, progress indicators and video targets. Read the actual scroll container or the controller's documented animated position rather than accumulating raw wheel deltas. Synchronize with the motion library using its supported integration. Avoid competing root CSS smooth scrolling, repeated `scrollTo({behavior: "smooth"})` calls on wheel events, or multiple springs/easing layers fighting over the same position. Tune a short, responsive settling time: wheel steps can be softened without making the page drift long after input stops. Trackpads already provide small continuous deltas; test that added inertia does not exaggerate them. Custom time-based interpolation must use elapsed time so 60 Hz and higher-refresh displays do not get different damping.

Preserve native keyboard scrolling, scrollbar dragging, anchor destinations, focus visibility, browser history/restoration and Ctrl+wheel zoom. Do not promise identical inertia for keyboard and wheel input. Let dialogs, menus, text areas and other nested scroll regions consume their own scroll; restore page motion correctly after a dialog closes. Preserve touch scrolling and a native/reduced-motion path. A smoothing layer must not lock visitors into pinned sections or replace accessible document navigation.

Profile layout and paint before increasing smoothing. Keep handlers small, use passive listeners when only observing input, batch reads/writes, and animate transforms/opacity. Investigate large animated blur/filter/backdrop layers, excessive fixed compositing surfaces, per-frame React rerenders and continuous offscreen work when they correlate with missed frames. Fix the identified work rather than hiding stalls behind longer easing. Verify ordinary wheel notches, trackpad motion, quick reversal and stopping in the relevant authorized browser check; a programmatic scroll animation alone does not establish wheel smoothness.

## Optional video or frame scrubbing

Treat scroll position as a target media time, not ordinary autoplay. Keep a matching poster visible until metadata and a decodable frame are ready. Use muted inline playback settings for decorative media and omit unnecessary audio. Wait for a valid finite duration before mapping progress to currentTime; clamp seeks to a decodable end rather than relying on the exact duration boundary.

### Diagnose frame delivery before tuning the loop

Enough source frames and smooth normal playback do not establish smooth random seeking. Inspect the actual file's duration, frame rate/frame count, codec, resolution, size/bitrate and keyframe spacing using available media tooling, for example ffprobe. H.264 frames between keyframes depend on earlier frames; a seek may need to decode from the previous keyframe up to the target. A generated video optimized for linear playback may therefore be unsuitable for repeated forward/backward seeks even when fully downloaded. Check HTTP range responses and buffering separately; front-loaded MP4 metadata helps startup but does not shorten keyframe dependencies.

When browser inspection is permitted, compare ordinary playback with scroll-driven seeking of the same asset. Measure seek request/completion times, presented video frames with `requestVideoFrameCallback` where supported, media-time jumps and the page's RAF/long-frame behavior. `currentTime` changing, a high source FPS, or a screenshot of a changed frame does not prove smooth presentation. Isolate the video from the scene when needed to separate decoder cost from page layout/paint. Record the browser, viewport, input method and scroll rate; headless results and one machine are diagnostic evidence, not universal performance guarantees.

A local headless Chrome measurement illustrates the distinction: a roughly 10-second, 41 MB H.264 file had 241 frames at 24 fps but only eight keyframes about 1.25 seconds apart. It played at 24 fps with zero dropped frames, yet the page presented only 6–8 updates/second during scrubbing. Fully buffered isolated seeks took about 126 ms at the median; targets farther from a keyframe took longer. The controller also ignored changes of 0.05 video seconds, equivalent to about 28 scroll pixels on that page. These are example measurements, not limits to hardcode. More generated footage, more RAF callbacks or switching polling to `seeked` cannot by themselves fix costly decoding.

### Prepare media for seeking

When encoding tools are available, create a separate scrub-friendly derivative of the existing source. Use frequent keyframes and evaluate a short GOP or all-intra encoding against actual seek latency, visual quality and transfer size. Choose resolution and compression for the displayed surface; do not send a high-bitrate master automatically. Where appropriate, compare variants with reduced frame dependency/reordering. Preserve the original asset and verify the derivative's actual metadata and visual result; do not claim a transcode happened when a tool was unavailable. Keep the source frame rate unless a measured reason supports changing it: merely relabeling or duplicating frames does not create smoother motion. More keyframes can increase file size, so measure both delivery and seek performance.

If reliable seeking remains unavailable, use a poster/lighter effect or consider a bounded decoded-frame/image-sequence approach when its memory and transfer costs fit the target devices. Do not default to fetching a whole video into a JavaScript blob or decoding/preloading every full-resolution frame. Those choices can bypass useful streaming behavior or create a much larger memory problem. New footage is warranted for content or genuine temporal-sampling needs, not as the first response to decoder latency.

### Schedule frame-aware updates

Coalesce input to the latest target, avoid flooding the decoder or queuing stale seeks, and handle metadata, readiness, seeking, errors and cleanup. Serialize pending work when necessary, but recognize that a slow seek followed by a jump to the newest target produces visible stepping; fix asset cost rather than declaring the event-driven loop sufficient. Any easing should follow the same rendered page position and should not compound an existing scroll controller's lag.

Avoid an arbitrary time deadband such as 0.05 seconds. At 24 fps one frame lasts about 0.0417 seconds; that deadband can skip visible frames. Prefer scheduling when the desired frame changes using verified frame timing (a measured constant FPS or actual timestamps for variable-rate video), and distinguish requested time from the last frame actually presented. Re-requesting an unchanged frame wastes decoding. A fixed frame epsilon is not a universal substitute for knowing the asset.

Choose the scroll range deliberately. Mapping a short clip over a very long page stretches its finite frames across more pixels; even an ideal decoder cannot invent intermediate images. The useful relationships are `pixelsPerFrame ≈ scrollRange / (frameCount - 1)` for more than one frame and, for constant frame rate, `sourceFramesTraversedPerSecond ≈ scrollSpeed * duration * fps / scrollRange`. If the intended pace is too sparse, adjust the scene range or media strategy rather than adding meaningless pinned distance. Measure slow/fast forward and reverse scrolling, stopping, catch-up and resize at the relevant viewport.

Use a mobile poster or lighter effect when reliable scrubbing is unavailable. Bound preload and decoded-frame memory around the active scene. Stop unnecessary media work for reduced motion. Report unavailable encoding or device verification accurately.

## Mobile, accessibility and fallbacks

Compose narrow screens deliberately: adjust image crop, subject position, text size, overlap, stage height and motion distance. Use stable viewport sizing for pinned geometry and account for mobile browser chrome and fixed headers. Avoid oversized empty scroll tracks, horizontal page overflow and subjects or CTAs moving outside the usable viewport.

Honor `prefers-reduced-motion`, including changes while the page is open. Render complete readable content in normal flow or a compact static scene, remove surplus pinned travel, and disable nonessential parallax, continuous motion and scrubbing. Do not just stop an animation while leaving later content invisible.

Keep focus order aligned with reading order, controls keyboard operable and focus indicators visible. Opacity zero and pointer-events none do not remove invisible controls from keyboard navigation. Use proper visibility/inert handling for inactive interactive states, keep focused content visible, and provide a stable accessible way to reach every essential action. Do not hide the only copy of important content from assistive technology. Pointer effects must be optional and work without hover.

## Verify and deliver

Run the project's relevant build/type checks and proportionate existing tests. Inspect progress mapping and scene boundaries, asset paths, cleanup, responsive behavior, reduced-motion rendering and control destinations. Where automated interaction tests are already permitted, verify start/middle/end states, reverse scrolling, resized layout and focused controls. A successful build alone does not establish visual quality, desktop wheel smoothness or smooth media seeking. For a reported smoothness defect, identify whether the unresolved behavior is document movement, effect synchronization or media presentation, and compare before/after measurements when browser inspection is permitted. Do not label a change smooth solely because it builds or uses RAF/seeked.

Follow Amazi's existing browser policy. Do not launch a browser, require screenshots or run Scroll Craft's browser harness merely because this skill is connected. Use available evidence and authorized checks; load `browser` only for a situation it permits. When browser inspection is permitted, inspect only the intermediate states, transitions, viewports and motion settings relevant to the unresolved interaction or fatal-error recovery. Check for unreadable text, dead scroll, floating cutouts, stuck posters and unreachable controls.

Finish with the implemented experience, important adaptations, verification actually performed and material limitations. Do not claim device, browser or visual checks that were not performed.

## Working example: Northline

[Northline source repository](https://github.com/Egormity/northline-scroll) is a public example of this guidance. Start with its current README and inspect the repository to locate the standalone application, setup instructions and extension guidance; file names and layout can change.

Production preview: [Northline — scroll-driven website](https://74b7ef25-0f5b-458d-a898-f1c45a83932c--c0c277f2.projects.amazi.pro/).

The fictional outdoor journal demonstrates a layered photographic hero, progressive typography, one Lenis controller over native scrolling, a pinned scroll-controlled film, an SVG route with keyboard-selectable waypoints, an expanding coast-film composition, a measured horizontal photo rail, a circular forest reveal with bounded scroll-driven particles, accessible photograph dialogs and a real field-notes download. Two generated ambient films use visibility-aware playback with pause controls; they are separate from the scrubbed film. Phones and reduced-motion layouts retain posters and normally flowing text without requesting video.

Inspect the current scroll controller, progress mapping, media seek controller, representative chapters,
and interaction tests before adapting them. Establish their actual ownership and lifecycle from source
rather than assuming a particular file path or the continued presence of an earlier example feature.

Inspect the current media provenance and frame/keyframe measurements before reusing a film; an example's
encoding is one tradeoff, not a universal prescription. Preserve each reused asset's attribution and
license. Keep generated media provenance separate from stock-footage licensing, and do not apply one
asset's license to unrelated generated assets.

Adapt the mechanisms to the current brief. The outdoor story, typography, desktop launcher, and exact scene distances are example choices, not requirements for every website.

## Reference

Inspired by Scroll Craft: https://github.com/nateherkai/scroll-craft. Its design workflow separates narrative structure, scene timing and visual depth; its optional vanilla-JavaScript engine maps scroll progress into authored HTML/CSS effects. This Amazi adaptation is self-contained and does not require that repository. If a user explicitly selects the upstream engine, inspect its current source, integration requirements and MIT license before adopting it; its local asset and verification scripts are not Amazi tools.

Implementation references; consult the current version relevant to the chosen approach:

- [CSS scroll-behavior scope](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-behavior).
- [Lenis setup, integration and accessibility options](https://github.com/darkroomengineering/lenis).
- [Video keyframes and decoding](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API/Video_processing_concepts).
- [Presented video-frame callbacks](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback).
- [FFmpeg H.264 encoding options](https://ffmpeg.org/ffmpeg-codecs.html#libx264_002c-libx264rgb).
