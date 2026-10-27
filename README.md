# Northline

A cinematic scroll-driven outdoor journal and reusable Amazi example, with layered scenes,
scroll-controlled video, interactive chapters, and generated ambient films.

The standalone browser application lives in **`web/`**. It contains its own package manifest,
lockfile, Dockerfile, source, assets, tests, scripts, and development documentation. The repository
root contains template guidance and the custom skill; it is not an application root.

## Run the application

Use Node.js 22.12 or newer and the pinned pnpm 11.7.0:

```bash
pnpm --dir web install --frozen-lockfile
pnpm --dir web dev
```

Development opens on `http://127.0.0.1:4408`. To build, check, or open the desktop version:

```bash
pnpm --dir web format:check
pnpm --dir web test
pnpm --dir web build
pnpm --dir web test:browser
python3 web/scripts/launch.py
```

The desktop version uses `http://127.0.0.1:4409`. See the [application README](web/README.md)
for controls, media, and launcher options.

## Use in Amazi

Keep every application in its own directory. This repository uses `web/`; Amazi's saved
application `sourcePath` determines the directory used in the destination project.

Create an `empty_application`, then copy **the contents of `web/`** into the returned application
directory. Do not copy this repository root into it or add a second nested `web/` layer. The app
builds using an application-scoped Docker context and does not require parent repository files.
Git synchronization alone does not register an application.

```bash
docker build -t northline-amazi web
docker run --rm -e PORT=10000 -p 127.0.0.1:4411:10000 northline-amazi
```

Read [Amazi setup](web/docs/amazi.md), [motion architecture](web/docs/scroll-system.md),
[extension guidance](web/docs/extending.md), and [media provenance](web/docs/assets.md).
The reusable [agent skill](skill/agent-content.md) remains repository metadata.
