# @smplcty/logging

A tiny zero-dependency helper that adds `LOG_LEVEL` control to Node's built-in `console`.

[![npm](https://img.shields.io/npm/v/@smplcty/logging.svg)](https://www.npmjs.com/package/@smplcty/logging)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

No new logger, no new API — just import it once and `console.error` / `console.warn` / `console.info` / `console.debug` start respecting the `LOG_LEVEL` environment variable.

```ts
import '@smplcty/logging';

console.error('always shown');
console.warn('shown when LOG_LEVEL is warn or higher');
console.info('shown when LOG_LEVEL is info or higher');
console.debug('shown only when LOG_LEVEL=debug');
```

## Install

```sh
pnpm add @smplcty/logging
```

Zero runtime dependencies. Requires Node 20+.

## How it works

The package mutates `globalThis.console` once, at module load, replacing the methods below the configured level with no-op functions. After the import statement runs, your existing `console.*` calls behave like a poor man's level-filtered logger — without rewriting any call sites.

| `LOG_LEVEL` | error | warn | info | debug |
|---|---|---|---|---|
| `error` *(default)* | ✓ | × | × | × |
| `warn` | ✓ | ✓ | × | × |
| `info` | ✓ | ✓ | ✓ | × |
| `debug` | ✓ | ✓ | ✓ | ✓ |

The level is read from `process.env.LOG_LEVEL` once, at module load. Unset or invalid values fall back to `error`.

## When to use this — and when not to

**Use this** when you have an existing codebase with hundreds of `console.debug(...)` / `console.info(...)` calls and you want to add `LOG_LEVEL` filtering without rewriting them.

**Use [pino](https://getpino.io) instead** when you want any of:
- Structured JSON output (CloudWatch Insights queries, Datadog/Sentry ingestion)
- Per-call bindings or child loggers
- PII / secret redaction
- Multiple destinations
- Async writes for backpressure
- Performance at high throughput

This package does ~10 lines of work and ships ~1 KB. It's not a logger, it's a level filter on the global console. For anything beyond "shut up unless LOG_LEVEL=debug," reach for pino — its `Logger` shape is structurally compatible with the optional `logger` parameters on every `@smplcty/*` library.

## Migrating to a real logger

When you outgrow this:

```ts
// before
import '@smplcty/logging';
console.debug('event', event);

// after
import pino from 'pino';
const log = pino({
  level: process.env.LOG_LEVEL ?? 'error',
  redact: ['headers.authorization', 'body.code'], // PII you used to leak via console.debug
});
log.debug({ event }, 'event received');
```

## v1.3.0 vs. v1.2.x

v1.3.0 is a **TypeScript port** of v1.2.x. **No runtime behavior changes.** Same side-effect import, same console mutation, same `LOG_LEVEL` semantics, same default. Differences:

- Source is now TypeScript (`src/index.ts`) compiled to `dist/index.js` + `dist/index.d.ts`
- Type declarations ship in the package
- Build pipeline uses `tsc`
- Tests use vitest instead of `node --test`
- CI workflow now runs lint, typecheck, gitleaks, tests, and a non-blocking `pnpm outdated` check on every PR and push to main
- Publish workflow runs gitleaks before `npm publish` for defense in depth

If you're consuming `@smplcty/logging` in v1.2.x with `import '@smplcty/logging';`, no changes are needed to upgrade to v1.3.0.

## License

MIT — see [LICENSE](LICENSE).
