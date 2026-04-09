# Changelog

All notable changes to this project will be documented in this file.

## 1.3.0 (2026-04-09)

TypeScript port of v1.2.x. **No runtime behavior changes** — same side-effect import, same `console` mutation, same `LOG_LEVEL` semantics. Consumers using `import '@smplcty/logging';` need no changes to upgrade.

### What changed

- **Source is now TypeScript** (`src/index.ts`), compiled to `dist/index.js` and `dist/index.d.ts` via `tsc`. Type declarations ship in the package.
- **Tests migrated to vitest** with the same subprocess-isolation pattern as v1.2.x — each test spawns a fresh Node process so the console mutation can't leak between cases.
- **CI workflow added** (`.github/workflows/ci.yml`): lint, typecheck, gitleaks scan of full git history, build, tests, and a non-blocking `pnpm outdated` advisory — runs on every PR and push to main.
- **Publish workflow expanded** (`.github/workflows/publish.yml`): now runs gitleaks before `npm publish` for defense in depth, plus the same lint/typecheck/test/build chain as CI.
- **Action versions bumped** to the fleet baseline: `actions/checkout@v6`, `pnpm/action-setup@v5`, `actions/setup-node@v6`, node 24.

### Why no v2.0.0

The original plan was to ship v2.0.0 as a custom structured logger competing with pino. That was the wrong call — pino is excellent and we shouldn't reinvent it. v1.3.0 keeps the package's actual scope (a `LOG_LEVEL` filter for `console.*`) and the README now points consumers at pino when they need a real logger.

---

## Pre-1.3 history

### [1.1.4](https://github.com/mabulu-inc/logging/compare/v1.1.3...v1.1.4) (2024-08-29)


### Bug Fixes

* updates README ([9a40e29](https://github.com/mabulu-inc/logging/commit/9a40e29d5c0feac995fdbcf81632d7c22865e88a))

### [1.1.3](https://github.com/mabulu-inc/logging/compare/v1.1.2...v1.1.3) (2024-08-29)

### [1.1.2](https://github.com/mabulu-inc/logging/compare/v1.1.1...v1.1.2) (2024-08-29)


### Bug Fixes

* includes test in release and updates README ([2d56509](https://github.com/mabulu-inc/logging/commit/2d565094af89f5a0a2000ad3fd68c33876a19edf))

### [1.1.1](https://github.com/mabulu-inc/logging/compare/v1.1.0...v1.1.1) (2024-08-28)


### Bug Fixes

* npm pkg fix ([97a6b5b](https://github.com/mabulu-inc/logging/commit/97a6b5b7d887dcc8636d8e297f254ab0e8494a9a))

## 1.1.0 (2024-08-28)


### Features

* add release/publish ([1b7df35](https://github.com/mabulu-inc/logging/commit/1b7df352bd5225159a48dd3b48eb9dde4571b712))
