# Northline repository

- The standalone application is `web/`. Read `web/AGENTS.md` before changing it.
- Keep its package manifest, lockfile, Dockerfile, source, assets, tests, and runtime scripts inside
  that application directory. Do not add runtime dependencies on the repository root.
- Run application commands with `pnpm --dir web` or from `web/`; use `web/` as its Docker context.
- Root README and `skill/` describe the template. Skills link to the example repository, then
  direct agents to inspect its current structure instead of relying on fixed example file links.
