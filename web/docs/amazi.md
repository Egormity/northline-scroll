# Running Northline in Amazi

Northline is one React/Vite application inside the repository's `web/` directory. Its `package.json`,
lockfile, `index.html`, `vite.config.ts`, and `Dockerfile` are inside that application root;
`src/` and `public/` stay together. All relative paths in this guide refer to the application
directory unless explicitly described as repository-relative. It needs
no backend, database, account service, or runtime media API.

## Source placement

Amazi stores application registration separately from the Git source. There is no repository
manifest to add. Keep each application in its own folder so other applications can be added
alongside it. This example uses `web/` and keeps template guidance outside the application.

Create an `empty_application`, read its returned `sourcePath`, and copy only the contents of this
repository's `web/` into that application directory. Do not copy the repository root, nest another
`web/` inside the destination, or move another application's files. Keep the returned source path
unless a change is explicitly needed. To use `web` in a new workspace, rename the newly allocated
empty application through Amazi before copying, and only while the target directory does not exist.
Changing `sourcePath` physically renames the application directory; it cannot adopt an already
populated folder. Commands run inside the saved application directory.

The public Northline template lives on `main`. Import its application subtree into the configured application
root. Connecting GitHub synchronizes the project workspace; it does not register or discover an
application from these files. Amazi's initial GitHub connection expects a repository without
`main`, so use a separate eligible output repository for a new synchronization connection.

## Application settings

| Setting                          | Value                                                |
| -------------------------------- | ---------------------------------------------------- |
| Development command              | `pnpm install --ignore-scripts && exec pnpm run dev` |
| Development port                 | `10000`                                              |
| Development and production tools | `node-22`, `pnpm-10`                                 |
| Editor adapters                  | `vite-jsx-source-selection`                          |
| Request adapters                 | `vite-http`                                          |
| Preview / public URL / publish   | Enabled                                              |
| Production build context         | `application`                                        |
| Production command override      | Unset; use the Docker image command                  |
| Production port                  | `10000`                                              |

The current Amazi tool named `pnpm-10` supplies pnpm 11.7.0; `packageManager` pins that version.
These are application settings in Amazi, not environment variables to add to the repository.
Northline does not use TanStack Router, so its navigation adapter is not applicable. Amazi
injects editor hooks, request observation, and the allowed preview hostname itself.

Vite listens on `0.0.0.0` and honors the injected `PORT`. Without it, development and Vite
preview use ports 4408 and 4409. Invalid configured ports fail startup. Local `.env` values
are supported; explicit environment variables take precedence. The optional Python desktop
launcher continues to listen only on loopback and is not used in Amazi containers.

## Production image

Use `productionBuildContext=application`. The Dockerfile stays at the saved application source path,
which is `web/Dockerfile` in this repository. It uses no parent repository files.
The Dockerfile builds with Node 22 and the frozen pnpm lockfile, then copies only `dist/`
into a non-root static-web-server image. It honors `PORT`, serves `/` and a health endpoint,
and preserves byte ranges for the scroll-controlled film. `AMAZI_RUNTIME_BASE_IMAGE` and
`AMAZI_BUILD_REVISION` follow Amazi's build contract. An optional `application_environment`
BuildKit secret supplies build-time Vite environment values; local `.env` files are excluded.
Only intentionally public `VITE_*` values belong in frontend builds.

```bash
# From this application directory. From the repository root, use: docker build -t northline-amazi web
docker build -t northline-amazi .
docker run --rm -e PORT=10000 -p 127.0.0.1:4411:10000 northline-amazi
```

Open `http://127.0.0.1:4411`. The application still uses the local poster and all-keyframe film
under `public/`; converting that film to ordinary long-keyframe delivery encoding can degrade
scrubbing. See [assets.md](assets.md) for provenance and encoding details.
