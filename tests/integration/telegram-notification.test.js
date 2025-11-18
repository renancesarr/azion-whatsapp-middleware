const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('../../edge/handler');

const html = '<div><a data-contact="whatsapp">CTA</a></div>';

function createRequest(overrides = {}) {
  return {
    headers: {},
    async text() {
      return html;
    },
    body: html,
    url: 'https://example.com/page',
    ...overrides,
  };
}

test('fallback + notificação bem-sucedida não interrompe resposta', async () => {
  let notified = false;
  const request = createRequest({
    telegramFetch: async () => {
      notified = true;
      return { ok: true, json: async () => ({ ok: true }) };
    },
    overrideConfig: {
      telegramBotToken: 'TOKEN',
      telegramChatId: 'CHAT',
      numbers: [],
      messages: [],
      rulesVersion: '1.0.0',
      supportedVersions: ['1.0.0'],
      versionedRules: {
        '1.0.0': { numbers: [], messages: [], groups: {} },
      },
    },
  });

  const response = await handler(request);
  assert.equal(response.body, html);
  assert.equal(notified, true);
});

test('fallback + falha no telegram mantém resposta', async () => {
  const request = createRequest({
    telegramFetch: async () => {
      throw new Error('network');
    },
    overrideConfig: {
      telegramBotToken: 'TOKEN',
      telegramChatId: 'CHAT',
      numbers: [],
      messages: [],
      rulesVersion: '1.0.0',
      supportedVersions: ['1.0.0'],
      versionedRules: {
        '1.0.0': { numbers: [], messages: [], groups: {} },
      },
    },
  });

  const response = await handler(request);
  assert.equal(response.body, html);
});
