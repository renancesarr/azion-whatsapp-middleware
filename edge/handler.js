const { processHtmlWithAudit } = require('../src/pipeline');
const { createContext } = require('../src/core/context');
const { normalizeRequest, createResponse } = require('../src/providers/compat');
const { orchestrateFallbackDecision } = require('../src/pipeline/fallback');
const { notifyIfFallbackTriggered } = require('../src/notifications/telegram');
const { debugSummary, attachDebugComment, isDebugEnabled, makeSafeLog, debugPrint } = require('../src/debug/logger');

async function handler(rawRequest) {
  const request = await normalizeRequest(rawRequest);
  const html = request?.bodyString
    || (typeof rawRequest?.text === 'function' ? await rawRequest.text() : rawRequest?.body || '');
  const context = createContext({ request });
  if (typeof rawRequest?.telegramFetch === 'function') {
    context.notificationFetch = rawRequest.telegramFetch;
  }
  if (rawRequest?.overrideConfig) {
    context.config = { ...context.config, ...rawRequest.overrideConfig };
  }
  if (rawRequest?.faultInjection) {
    context.faultInjection = rawRequest.faultInjection;
  }
  context.debugLogs = [];
  const debug = isDebugEnabled(context.config);
  debugPrint(makeSafeLog('handler:start', { url: request.url }), context);

  const { processedHtml, results } = processHtmlWithAudit(html, context);
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);

  // Notificação deve ocorrer apenas após a decisão do fallback.
  notifyIfFallbackTriggered({
    originalHtml: html,
    finalHtml,
    context,
    results,
    fetchImpl: context.notificationFetch,
  }).catch(() => null);

  const summary = debugSummary(results);
  const htmlWithDebug = attachDebugComment(finalHtml, summary, debug);
  debugPrint(makeSafeLog('handler:end', { url: request.url, ok: true }), context);

  return createResponse(htmlWithDebug, { headers: request?.headers || {} });
}

module.exports = { handler };
