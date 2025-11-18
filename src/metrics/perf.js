const { performance } = require('node:perf_hooks');

function createPerfTracker() {
  const times = {};
  function measure(stage, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    times[stage] = (times[stage] || 0) + (end - start);
    return result;
  }
  function getTimes() {
    return { ...times };
  }
  return { measure, getTimes };
}

function isExecutionTooSlow(times = {}, limits = {}) {
  const totalLimit = limits.total || limits.totalMs;
  const entries = Object.entries(times);
  for (const [stage, duration] of entries) {
    const limit = limits[stage];
    if (typeof limit === 'number' && duration > limit) {
      return true;
    }
  }
  if (typeof totalLimit === 'number') {
    const total = entries.reduce((sum, [, duration]) => sum + duration, 0);
    if (total > totalLimit) {
      return true;
    }
  }
  return false;
}

module.exports = { createPerfTracker, isExecutionTooSlow };
