function detectEdgeProvider(env = globalThis) {
  if (env?.fastly) return 'fastly';
  if (env?.__cfWorker || env?.WebSocketPair || env?.caches) return 'cloudflare';
  if (env?.AZION || env?.azion || env?.edgeRuntime === 'azion') return 'azion';
  if (env?.process?.env?.VERCEL || env?.edgeRuntime === 'vercel') return 'vercel';
  return 'unknown';
}

async function normalizeEdgeRequest(rawRequest) {
  if (!rawRequest) {
    return { url: '', method: 'GET', headers: {}, bodyString: '' };
  }
  const url = rawRequest.url || rawRequest.href || '';
  const method = rawRequest.method || 'GET';
  const headers = rawRequest.headers || {};
  const bodyString = typeof rawRequest.text === 'function' ? await rawRequest.text() : rawRequest.body || '';
  return { url, method, headers, bodyString };
}

function normalizeEdgeResponse(body, init = {}) {
  const status = init.status || 200;
  const headers = init.headers || {};
  return { body, status, headers };
}

async function edgeHandler(rawRequest, handlerFn) {
  const provider = detectEdgeProvider(rawRequest?.__env || globalThis);
  const normalizedRequest = await normalizeEdgeRequest(rawRequest);
  const response = await handlerFn(normalizedRequest, provider);
  return normalizeEdgeResponse(response.body, response.init || { status: response.status, headers: response.headers });
}

module.exports = {
  detectEdgeProvider,
  normalizeEdgeRequest,
  normalizeEdgeResponse,
  edgeHandler,
};
