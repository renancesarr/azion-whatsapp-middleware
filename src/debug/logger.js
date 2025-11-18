const defaultSafeKeys = ['message', 'stage', 'url', 'ok', 'errorMessage', 'version'];

function isDebugEnabled(config = {}) {
  return Boolean(config.debugMode);
}

function makeSafeLog(message, data = {}) {
  const safe = {};
  defaultSafeKeys.forEach((key) => {
    if (data[key] !== undefined) {
      safe[key] = data[key];
    }
  });
  return {
    message,
    ...safe,
  };
}

function debugPrint(log, context = {}) {
  const enabled = isDebugEnabled(context.config || context);
  if (!enabled) {
    return;
  }
  if (!context.debugLogs) {
    context.debugLogs = [];
  }
  context.debugLogs.push(log);
  if (typeof console !== 'undefined' && typeof console.log === 'function') {
    console.log(log);
  }
}

function debugSummary(results = []) {
  const totalCtas = results.filter((r) => r.stage === 'rewrite-element' && r.ok).length;
  const perfStage = results.find((r) => r.stage === 'performance' && r.ok);
  const times = perfStage?.value || {};
  const totalMs = Object.values(times).reduce((sum, v) => sum + v, 0);
  const avgMsPerCta = totalCtas ? totalMs / totalCtas : 0;
  return { totalCtas, totalMs, avgMsPerCta };
}

function attachDebugComment(html, summary, debugEnabled) {
  if (!debugEnabled) {
    return html;
  }
  const json = JSON.stringify(summary);
  return `${html}\n<!-- debug: ${json} -->`;
}

module.exports = {
  isDebugEnabled,
  makeSafeLog,
  debugPrint,
  debugSummary,
  attachDebugComment,
};
