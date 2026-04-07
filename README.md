# simplicity-logging

A tiny zero-dependency helper that adds `LOG_LEVEL` control to Node's built-in `console`.

No new logger, no new API — just import it once and `console.error` / `console.warn` / `console.info` / `console.debug` start respecting the `LOG_LEVEL` environment variable.

## Install

```sh
pnpm add @smplcty/logging
```

## Usage

Import the module once, as early as possible (typically at the top of your entry file):

```js
import '@smplcty/logging';

console.error('always shown');
console.warn('shown when LOG_LEVEL is warn, info, or debug');
console.info('shown when LOG_LEVEL is info or debug');
console.debug('shown when LOG_LEVEL is debug');
```

Then set `LOG_LEVEL` when running your app:

```sh
LOG_LEVEL=info node app.js
```

## Log levels

From least to most verbose:

| `LOG_LEVEL` | Enables                                      |
| ----------- | -------------------------------------------- |
| `error`     | `console.error`                              |
| `warn`      | `console.error`, `console.warn`              |
| `info`      | `+ console.info`                             |
| `debug`     | `+ console.debug`                            |

If `LOG_LEVEL` is unset or invalid, it defaults to `error`. Methods above the active level are replaced with no-ops, so disabled calls have essentially zero cost.

## License

MIT
