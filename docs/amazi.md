# Running Northline in Amazi

Northline is one React/Vite application. Its `package.json`, `index.html`, `vite.config.ts`,
and `Dockerfile` are at the application root; `src/` and `public/` stay together. It needs
no backend, database, account service, or runtime media API.

## Source placement

Amazi stores application registration separately from the Git source. There is no repository
manifest to add. For a single application whose files occupy the project workspace root,
register `sourcePath` as `.`. That root ownership prevents adding another application alongside it.

When importing this source into an existing project, create an `empty_application` and copy
the repository contents into the application root returned by Amazi. Keep that configured
source path; do not assume it is `.` or move other project applications. The files inside this
repository have the same application-relative layout in either case.

Connecting GitHub synchronizes the project workspace; it does not register or discover an
application from these files. An initial Amazi repository connection expects no existing `main`
branch. Northline's example branch is `feature/codex/northline-scroll/2026-10-27`.

## Application settings

| Setting | Value |
| --- | --- |
| Development command | `pnpm install --ignore-scripts && exec pnpm run dev` |
| Development port | `10000` |
| Development and production tools | `node-22`, `pnpm-10` |
| Editor adapters | `vite-jsx-source-selection` |
| Request adapters | `vite-http` |
| Preview / public URL / publish | Enabled |
| Production build context | `application` |
| Production command override | Unset; use the Docker image command |
| Production port | `10000` |

The current Amazi tool named `pnpm-10` supplies pnpm 11.7.0; `packageManager` pins that version.
These are application settings in Amazi, not environment variables to add to the repository.
Northline does not use TanStack Router, so its navigation adapter is not applicable. Amazi
injects editor hooks, request observation, and the allowed preview hostname itself.

Vite listens on `0.0.0.0` and honors the injected `PORT`. Without it, development and Vite
preview use ports 4408 and 4409. Invalid configured ports fail startup. Local `.env` values
are supported; explicit environment variables take precedence. The optional Python desktop
launcher continues to listen only on loopback and is not used in Amazi containers.

## Production image

The Dockerfile builds with Node 22 and the frozen pnpm lockfile, then copies only `dist/`
into a non-root static-web-server image. It honors `PORT`, serves `/` and a health endpoint,
and preserves byte ranges for the scroll-controlled film. `AMAZI_RUNTIME_BASE_IMAGE` and
`AMAZI_BUILD_REVISION` follow Amazi's build contract. An optional `application_environment`
BuildKit secret supplies build-time Vite environment values; local `.env` files are excluded.
Only intentionally public `VITE_*` values belong in frontend builds.

```bash
docker build -t northline-amazi .
docker run --rm -e PORT=10000 -p 127.0.0.1:4411:10000 northline-amazi
```

Open `http://127.0.0.1:4411`. The application still uses the local poster and all-keyframe film
under `public/`; converting that film to ordinary long-keyframe delivery encoding can degrade
scrubbing. See [assets.md](assets.md) for provenance and encoding details.
