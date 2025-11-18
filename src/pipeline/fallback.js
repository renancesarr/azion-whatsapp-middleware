function safeTry(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    return { ok: false, error };
  }
}

function fallbackReturnOriginalHtml(originalHtml) {
  return originalHtml;
}

function shouldUseFallback(results = []) {
  return results.some((result) => result && result.ok === false);
}

function orchestrateFallbackDecision(originalHtml, processedHtml, results = []) {
  if (shouldUseFallback(results)) {
    return fallbackReturnOriginalHtml(originalHtml);
  }
  return processedHtml;
}

module.exports = {
  safeTry,
  fallbackReturnOriginalHtml,
  shouldUseFallback,
  orchestrateFallbackDecision,
};
