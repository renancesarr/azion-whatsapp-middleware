const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('../../edge/handler');

const html = '<div><a data-contact="whatsapp">CTA</a></div>';

function buildRequest(envOverrides = {}, configOverrides = {}) {
  return {
    headers: {},
    async text() { return html; },
    body: html,
    url: 'https://example.com',
    __env: envOverrides,
    overrideConfig: {
      ...configOverrides,
      numbers: ['+1000000'],
      messages: ['msg'],
      supportedVersions: ['1.0.0'],
      versionedRules: { '1.0.0': { numbers: ['+1000000'], messages: ['msg'], groups: {} } },
    },
  };
}

test('edge handler funciona com provider cloudflare mock', async () => {
  const req = buildRequest({ WebSocketPair: function WP() {}, caches: {} });
  const res = await handler(req);
  assert.ok(res.body.includes('https://wa.me/'));
});

test('edge handler funciona com provider vercel mock', async () => {
  const req = buildRequest({ process: { env: { VERCEL: '1' } } });
  const res = await handler(req);
  assert.ok(res.body.includes('https://wa.me/'));
});

test('edge handler funciona com provider azion mock', async () => {
  const req = buildRequest({ AZION: true });
  const res = await handler(req);
  assert.ok(res.body.includes('https://wa.me/'));
});

test('edge handler funciona com provider fastly mock', async () => {
  const req = buildRequest({ fastly: {} });
  const res = await handler(req);
  assert.ok(res.body.includes('https://wa.me/'));
});
