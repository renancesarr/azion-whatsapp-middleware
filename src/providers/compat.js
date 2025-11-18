const { detectEdgeProvider, normalizeEdgeRequest, normalizeEdgeResponse } = require('./edge');

async function normalizeRequest(rawRequest) {
  const provider = detectEdgeProvider(rawRequest?.__env || globalThis);
  const normalized = await normalizeEdgeRequest(rawRequest);
  normalized.provider = provider;
  return normalized;
}

function createResponse(body, init) {
  return normalizeEdgeResponse(body, init);
}

module.exports = { normalizeRequest, createResponse };
