# Generated Northline films

Two original fictional landscape clips were generated on 27 October 2026 through
Amazi's connected fal.ai Gateway using
[FLUX 3 Max text-to-video](https://fal.ai/models/blackforestlabs/flux-3-max/text-to-video/api).
These scenes illustrate the Northline journal; they do not document an actual place or trip.
They are separate from the Commons film in the scroll-scrubbed Journey chapter and do not
inherit that source film's attribution or CC BY-SA license.

| Asset                     | Shot                                                        | Delivered size  |
| ------------------------- | ----------------------------------------------------------- | --------------- |
| `/media/coast-flight.mp4` | Continuous aerial movement along a misty northern coastline | 636,198 bytes   |
| `/media/forest-light.mp4` | Continuous forward movement through a sunlit conifer forest | 1,323,077 bytes |

Both requests used five seconds, 720p, 16:9 framing, high reasoning and no generated
audio. The provider delivered 121 frames at 24 fps, 1280 × 704 pixels, and a duration of
5.0417 seconds. Keep those actual dimensions when reasoning about cropping; the requested
resolution label does not guarantee exactly 1280 × 720 output.

The delivered MP4s preserve the source frame rate and dimensions. FFmpeg re-encoded them
as H.264, YUV420P, CRF 25, with at most 48 frames between keyframes and front-loaded MP4
metadata. They are optimized for ordinary visible playback, not frame-accurate scroll
seeking. The existing Journey derivative retains its separate all-intra encoding.

```sh
ffmpeg -i generated-original.mp4 -an \
  -c:v libx264 -preset slow -crf 25 -g 48 -keyint_min 24 \
  -pix_fmt yuv420p -movflags +faststart public/media/clip.mp4
ffmpeg -ss 0.2 -i generated-original.mp4 -frames:v 1 -q:v 3 \
  public/images/clip-poster.jpg
```

Both output files were decoded completely without errors. Posters were extracted from
the actual generated clips and visually inspected. The source downloads remain outside
the repository; all media needed to run the website is checked in locally. Playback does
not depend on a provider URL, API key or network call to fal.ai.

The exact prompts, generation settings, seeds, output metadata and delivered-file SHA-256
digests are recorded in [the provenance manifest](../public/media/fal-provenance.json).
Provider credentials and temporary signed download URLs are deliberately absent.
For future generation, use the current
[Amazi AI Gateway documentation](https://docs.amazi.pro/en/ai-gateway).
