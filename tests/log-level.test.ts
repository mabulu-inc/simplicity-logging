import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Test against the built dist/index.js so each test can spawn a fresh
// Node process with the side effect applied. Vitest can't reset
// globalThis.console between tests in a single process, so subprocess
// isolation is the only reliable way to verify the side effect.
const ENTRY = path.resolve(HERE, '../dist/index.js');

const MARKERS = {
  error: 'ERROR_LINE',
  warn: 'WARN_LINE',
  info: 'INFO_LINE',
  debug: 'DEBUG_LINE',
} as const;

interface Emissions {
  error: boolean;
  warn: boolean;
  info: boolean;
  debug: boolean;
}

function observeEmissions(level: string | null): Emissions {
  const entryUrl = pathToFileURL(ENTRY).href;
  const script = `
    await import(${JSON.stringify(entryUrl)});
    console.error(${JSON.stringify(MARKERS.error)});
    console.warn(${JSON.stringify(MARKERS.warn)});
    console.info(${JSON.stringify(MARKERS.info)});
    console.debug(${JSON.stringify(MARKERS.debug)});
  `;

  const env: NodeJS.ProcessEnv = { ...process.env };
  if (level === null) delete env['LOG_LEVEL'];
  else env['LOG_LEVEL'] = level;

  const { stdout, stderr, status } = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', script],
    { env, encoding: 'utf8' },
  );

  if (status !== 0) {
    throw new Error(`child exited with status ${status}\n${stderr}`);
  }

  const output = stdout + stderr;
  return {
    error: output.includes(MARKERS.error),
    warn: output.includes(MARKERS.warn),
    info: output.includes(MARKERS.info),
    debug: output.includes(MARKERS.debug),
  };
}

describe('@smplcty/logging — LOG_LEVEL filter', () => {
  beforeAll(() => {
    if (!existsSync(ENTRY)) {
      throw new Error(
        `dist/index.js does not exist. Run \`pnpm run build\` before \`pnpm test\`.\n` +
          `(In CI, the workflow runs build before test.)`,
      );
    }
  });

  it('LOG_LEVEL=error emits error only', () => {
    expect(observeEmissions('error')).toEqual({
      error: true,
      warn: false,
      info: false,
      debug: false,
    });
  });

  it('LOG_LEVEL=warn emits error and warn', () => {
    expect(observeEmissions('warn')).toEqual({
      error: true,
      warn: true,
      info: false,
      debug: false,
    });
  });

  it('LOG_LEVEL=info emits error, warn, and info', () => {
    expect(observeEmissions('info')).toEqual({
      error: true,
      warn: true,
      info: true,
      debug: false,
    });
  });

  it('LOG_LEVEL=debug emits every level', () => {
    expect(observeEmissions('debug')).toEqual({
      error: true,
      warn: true,
      info: true,
      debug: true,
    });
  });

  it('defaults to error when LOG_LEVEL is unset', () => {
    expect(observeEmissions(null)).toEqual({
      error: true,
      warn: false,
      info: false,
      debug: false,
    });
  });

  it('falls back to error when LOG_LEVEL is invalid', () => {
    expect(observeEmissions('chatty')).toEqual({
      error: true,
      warn: false,
      info: false,
      debug: false,
    });
  });
});
