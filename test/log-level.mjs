import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const entryUrl = pathToFileURL(resolve(here, '../index.mjs')).href;

const MARKERS = {
  error: 'ERROR_LINE',
  warn: 'WARN_LINE',
  info: 'INFO_LINE',
  debug: 'DEBUG_LINE',
};

// Spawns a fresh Node process with the given LOG_LEVEL, imports the library,
// and calls every console method once. Returns which markers appeared in the
// combined stdout+stderr output.
const observeEmissions = (level) => {
  const script = `
    await import(${JSON.stringify(entryUrl)});
    console.error(${JSON.stringify(MARKERS.error)});
    console.warn(${JSON.stringify(MARKERS.warn)});
    console.info(${JSON.stringify(MARKERS.info)});
    console.debug(${JSON.stringify(MARKERS.debug)});
  `;

  const env = { ...process.env };
  if (level === null) delete env.LOG_LEVEL;
  else env.LOG_LEVEL = level;

  const { stdout, stderr, status } = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', script],
    { env, encoding: 'utf8' },
  );

  assert.equal(status, 0, `child exited with status ${status}\n${stderr}`);

  const output = stdout + stderr;
  return {
    error: output.includes(MARKERS.error),
    warn: output.includes(MARKERS.warn),
    info: output.includes(MARKERS.info),
    debug: output.includes(MARKERS.debug),
  };
};

describe('simplicity-logging', () => {
  it('LOG_LEVEL=error emits error only', () => {
    assert.deepEqual(observeEmissions('error'), {
      error: true,
      warn: false,
      info: false,
      debug: false,
    });
  });

  it('LOG_LEVEL=warn emits error and warn', () => {
    assert.deepEqual(observeEmissions('warn'), {
      error: true,
      warn: true,
      info: false,
      debug: false,
    });
  });

  it('LOG_LEVEL=info emits error, warn, and info', () => {
    assert.deepEqual(observeEmissions('info'), {
      error: true,
      warn: true,
      info: true,
      debug: false,
    });
  });

  it('LOG_LEVEL=debug emits every level', () => {
    assert.deepEqual(observeEmissions('debug'), {
      error: true,
      warn: true,
      info: true,
      debug: true,
    });
  });

  it('defaults to error when LOG_LEVEL is unset', () => {
    assert.deepEqual(observeEmissions(null), {
      error: true,
      warn: false,
      info: false,
      debug: false,
    });
  });

  it('falls back to error when LOG_LEVEL is invalid', () => {
    assert.deepEqual(observeEmissions('chatty'), {
      error: true,
      warn: false,
      info: false,
      debug: false,
    });
  });
});
