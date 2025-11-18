const test = require('node:test');
const assert = require('node:assert/strict');
const { detectEdgeProvider, normalizeEdgeRequest, normalizeEdgeResponse } = require('../../src/providers/edge');

test('detectEdgeProvider identifica cloudflare', () => {
  const env = { WebSocketPair: function WebSocketPair() {}, caches: {} };
  assert.equal(detectEdgeProvider(env), 'cloudflare');
});

test('detectEdgeProvider identifica vercel', () => {
  const env = { process: { env: { VERCEL: '1' } } };
  assert.equal(detectEdgeProvider(env), 'vercel');
});

test('detectEdgeProvider identifica fastly', () => {
  const env = { fastly: {} };
  assert.equal(detectEdgeProvider(env), 'fastly');
});

test('detectEdgeProvider identifica azion', () => {
  const env = { AZION: true };
  assert.equal(detectEdgeProvider(env), 'azion');
});

test('normalizeEdgeRequest usa text() quando disponível', async () => {
  const req = { url: 'https://x', method: 'POST', headers: { a: '1' }, async text() { return 'body'; } };
  const normalized = await normalizeEdgeRequest(req);
  assert.equal(normalized.bodyString, 'body');
  assert.equal(normalized.url, 'https://x');
  assert.equal(normalized.method, 'POST');
});

test('normalizeEdgeResponse retorna objeto simples', () => {
  const res = normalizeEdgeResponse('body', { status: 201, headers: { a: '1' } });
  assert.equal(res.status, 201);
  assert.equal(res.body, 'body');
  assert.deepEqual(res.headers, { a: '1' });
});
