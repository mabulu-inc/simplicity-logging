'use strict';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../mocks/console.mjs';

process.env.LOG_LEVEL = 'warn';

await import('../index.mjs');

describe(`when LOG_LEVEL === 'warn'`, () => {
  it('does not log debug', () => {
    console.debug('debug');
    assert.ok(!global.called.debug);
  });

  it('should not log info', () => {
    console.info('info');
    assert.ok(!global.called.info);
  });

  it('logs warn', () => {
    console.warn('warn');
    assert.ok(global.called.warn);
  });

  it('logs error', () => {
    console.error('error');
    assert.ok(global.called.error);
  });
});
