'use strict';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../mocks/console.mjs';

process.env.LOG_LEVEL = 'info';

await import('../index.mjs');

describe(`logger when LOG_LEVEL === 'info'`, () => {
  it('does not log debug', () => {
    console.debug('debug');
    assert.ok(!global.called.debug);
  });

  it('logs info', () => {
    console.info('info');
    assert.ok(global.called.info);
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
