const test = require('node:test');
const assert = require('node:assert/strict');
const { createPerfTracker, isExecutionTooSlow } = require('../../src/metrics/perf');

test('createPerfTracker registra tempos por etapa', () => {
  const tracker = createPerfTracker();
  tracker.measure('stage-a', () => {});
  tracker.measure('stage-b', () => {});
  const times = tracker.getTimes();
  assert.ok(times['stage-a'] >= 0);
  assert.ok(times['stage-b'] >= 0);
});

test('isExecutionTooSlow detecta etapas fora do limite', () => {
  const times = { a: 6, b: 2 };
  const limits = { a: 5, total: 10 };
  assert.equal(isExecutionTooSlow(times, limits), true);
  const okTimes = { a: 4, b: 2 };
  assert.equal(isExecutionTooSlow(okTimes, limits), false);
});
