# Northline media

The journal is a fictional design example, not an advertised itinerary. Its generated landscapes and real film are not claimed to document one place or trip.

## Real scroll-controlled film

**Work:** *DJI 0147 Soothing South Coast Waves*

**Creator:** The No Nonsense Group / Wikimedia contributor Ulric Algar

**Source:** [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:DJI_0147_Soothing_South_Coast_Waves.webm)

**License:** [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)

**Original recording:** Shelly Beach, KwaZulu-Natal, South Africa; 7 April 2021. The creator uploaded it as their own work and selected the license on the source page. No endorsement of Northline by the creator is implied.

The adapted film at `public/media/journey.mp4` and extracted poster at `public/images/journey-poster.jpg` are distributed under that same CC BY-SA 4.0 license. The attribution and changes also appear in the public [media credits](../public/media/credits.txt), linked from the website.

The adaptation takes 300 frames beginning approximately two seconds into the source, resizes the image to 1280×720, removes any audio track, and re-encodes as H.264. There is no color filter, frame interpolation, speed change, or invented intermediate motion. The poster shows the excerpt's first frame. The original download is kept outside the repository; the source remains available from the linked Commons page.

### Verified file properties

| Property | Delivered file |
| --- | --- |
| Duration | 10.01 seconds |
| Dimensions | 1280×720 |
| Frame rate | 30000/1001, approximately 29.97003 fps |
| Frames | 300 |
| Keyframes | 300; every frame is independently decodable |
| Codec | H.264 / AVC, YUV420P |
| Encoding | libx264, CRF 29, slow preset, GOP 1, no B frames |
| Bytes | 7,993,004, approximately 7.62 MiB |
| MP4 metadata | Front-loaded with `+faststart` |

The source is a 36,313,177-byte VP9 WebM, 1920×1080, approximately 20.75 seconds at nominal 29.97 fps. The source frame rate is preserved. The all-intra derivative trades transfer size for short random-seek dependency chains. It is a separate asset; merely having many source frames would not have established good seek behavior.

Preparation command, using FFmpeg 7.0.2:

```sh
ffmpeg -ss 2 -i source.webm -frames:v 300 -an \
  -vf scale=1280:720 -r 30000/1001 -fps_mode cfr \
  -c:v libx264 -preset slow -crf 29 -g 1 -keyint_min 1 -bf 0 \
  -pix_fmt yuv420p -movflags +faststart journey.mp4
```

An audit decoded all 300 output frames and confirmed `iskey:1` and frame type `I` for each. The MP4 timing table contains 300 samples of 1001 ticks at a 30000 Hz timescale. `public/media/journey.json` provides the exact timing values used by the player.

### Isolated browser measurement

On this development machine, headless Chrome 156 loaded the local derivative and performed 30 deterministic nonsequential seeks. Median `seeked` latency was 5.2 ms (95th percentile 5.5 ms); median presented-frame callback latency was 16.7 ms (95th percentile 16.7 ms). All 30 requests produced frame callbacks. This is diagnostic evidence for the prepared asset, not a universal frame-rate guarantee or a substitute for testing the complete scrolling page and its deployed delivery.

## Generated still images

Three original fictional landscape assets were created for this example with the built-in OpenAI image generation tool. They are illustrative generated images, not documentary photographs of the film's location. They were converted to WebP for local delivery; no external image API or hotlinked file is needed at runtime.

| File | Subject | Dimensions |
| --- | --- | --- |
| `public/images/coast.webp` | Imagined mossy Atlantic cliffs and black beach | 1672×941 |
| `public/images/forest.webp` | Imagined misty forest footpath | 1536×1024 |
| `public/images/cabin.webp` | Imagined timber cabin beside a northern lake | 1536×1024 |

The exact prompt set is recorded in [asset-prompts.md](asset-prompts.md). Generated originals remain in the image-generation output directory; the website uses the copies in `public/images`.
