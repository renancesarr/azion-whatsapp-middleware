const test = require('node:test');
const assert = require('node:assert/strict');
const {
  getTimestampString,
  describeError,
  buildTelegramMessageBody,
  getTelegramSendMessageUrl,
  sendTelegramMessage,
  buildTelegramNotificationPayload,
  notifyFailureViaTelegram,
} = require('../../src/notifications/telegram');

const baseConfig = {
  telegramBotToken: 'TOKEN',
  telegramChatId: 'CHAT',
};

test('getTimestampString retorna string', () => {
  const ts = getTimestampString(new Date('2020-01-01T00:00:00Z'));
  assert.equal(ts, '2020-01-01T00:00:00.000Z');
});

test('describeError inclui stage e mensagem', () => {
  const str = describeError(new Error('boom'), 'select-number');
  assert.ok(str.includes('select-number'));
  assert.ok(str.includes('boom'));
});

test('buildTelegramMessageBody contém campos obrigatórios', () => {
  const text = buildTelegramMessageBody({ timestamp: 'ts', page: '/home', errorDescription: 'err' });
  assert.ok(text.includes('ts'));
  assert.ok(text.includes('/home'));
  assert.ok(text.includes('err'));
});

test('getTelegramSendMessageUrl segue padrão esperado', () => {
  const url = getTelegramSendMessageUrl('XYZ');
  assert.equal(url, 'https://api.telegram.org/botXYZ/sendMessage');
});

test('sendTelegramMessage sucesso com fetch mock', async () => {
  const fetchMock = async () => ({ ok: true, json: async () => ({ ok: true }) });
  const result = await sendTelegramMessage({ token: 't', chatId: 'c', text: 'hello', fetchImpl: fetchMock });
  assert.equal(result.ok, true);
});

test('sendTelegramMessage trata erro HTTP', async () => {
  const fetchMock = async () => ({ ok: false, status: 500, json: async () => ({}) });
  const result = await sendTelegramMessage({ token: 't', chatId: 'c', text: 'hello', fetchImpl: fetchMock });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'http-error');
});

test('sendTelegramMessage trata exceção de rede', async () => {
  const fetchMock = async () => { throw new Error('net'); };
  const result = await sendTelegramMessage({ token: 't', chatId: 'c', text: 'hello', fetchImpl: fetchMock });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'network-error');
});

test('buildTelegramNotificationPayload contém dados mínimos', () => {
  const payload = buildTelegramNotificationPayload({
    originalHtml: '<div>orig</div>',
    finalHtml: '<div>final</div>',
    context: { request: { url: 'https://example.com' } },
    results: [{ stage: 'identify-ctas', ok: false, error: new Error('boom') }],
  });
  assert.equal(payload.page, 'https://example.com');
  assert.ok(payload.errorDescription.includes('boom'));
});

test('notifyFailureViaTelegram não envia sem credenciais', async () => {
  const payload = { timestamp: 'ts', page: '/home', errorDescription: 'err' };
  const result = await notifyFailureViaTelegram({ payload, context: { config: {} } });
  assert.equal(result.reason, 'missing-credentials');
});

test('notifyFailureViaTelegram chama envio com credenciais', async () => {
  let called = false;
  const payload = { timestamp: 'ts', page: '/home', errorDescription: 'err' };
  const fetchMock = async () => {
    called = true;
    return { ok: true, json: async () => ({ ok: true }) };
  };
  const result = await notifyFailureViaTelegram({ payload, context: { config: baseConfig }, fetchImpl: fetchMock });
  assert.equal(result.ok, true);
  assert.equal(called, true);
});
