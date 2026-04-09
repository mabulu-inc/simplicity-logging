/**
 * Side-effect import that filters Node's built-in `console` methods
 * by `LOG_LEVEL`.
 *
 * Levels in order of severity (most → least): error, warn, info, debug.
 * The configured `LOG_LEVEL` (or `'error'` if unset/invalid) and every
 * level below it are passed through unchanged. Levels above it are
 * replaced with no-op functions on `globalThis.console`.
 *
 * Defaults:
 *   - Unset `LOG_LEVEL` → `'error'`
 *   - Invalid `LOG_LEVEL` → `'error'`
 *
 * Usage:
 *
 * ```ts
 * import '@smplcty/logging'; // side effect: patches console at module load
 * console.debug('only printed when LOG_LEVEL=debug');
 * console.error('always printed');
 * ```
 *
 * This package does NOT export a logger object. It mutates the global
 * `console` and that is its entire purpose. If you need a real
 * structured logger, use `pino` directly — its `Logger` shape
 * (`(data, msg)` argument order) is compatible with the `logger`
 * parameter accepted by `@smplcty/auth`, `@smplcty/twilio`, and other
 * `@smplcty/*` packages.
 */
const LOG_LEVELS = ['error', 'warn', 'info', 'debug'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const envLevel = process.env['LOG_LEVEL'];
const logLevel: LogLevel =
  envLevel !== undefined && (LOG_LEVELS as readonly string[]).includes(envLevel)
    ? (envLevel as LogLevel)
    : 'error';

for (let i = LOG_LEVELS.indexOf(logLevel) + 1; i < LOG_LEVELS.length; i += 1) {
  const method = LOG_LEVELS[i];
  if (method !== undefined) {
    // Cast through unknown — we are deliberately mutating a global
    // built-in to silence calls below the configured level.
    (console as unknown as Record<LogLevel, () => void>)[method] = () => {};
  }
}
