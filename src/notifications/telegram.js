const { shouldUseFallback } = require('../pipeline/fallback');

function getTimestampString(dateInput = new Date()) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toISOString();
}

function describeError(error, stage) {
  if (!error) {
    return stage ? `Stage ${stage}: unknown error` : 'Unknown error';
  }
  const parts = [];
  if (stage) {
    parts.push(`[${stage}]`);
  }
  if (error.message) {
    parts.push(error.message);
  } else {
    parts.push(String(error));
  }
  return parts.join(' ');
}

function buildTelegramMessageBody({ timestamp, page, errorDescription }) {
  return `⚠️ Falha na Edge\nTempo: ${timestamp}\nPágina: ${page || 'desconhecida'}\nErro: ${errorDescription}`;
}

function getTelegramSendMessageUrl(token) {
  return `https://api.telegram.org/bot${token}/sendMessage`;
}

async function sendTelegramMessage({ token, chatId, text, fetchImpl = globalThis.fetch }) {
  if (!token || !chatId || !text) {
    return { ok: false, reason: 'missing-params' };
  }
  try {
    const response = await fetchImpl(getTelegramSendMessageUrl(token), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!response.ok) {
      return { ok: false, reason: 'http-error', status: response.status };
    }
    const body = await response.json().catch(() => ({}));
    if (body?.ok === false) {
      return { ok: false, reason: 'telegram-error', body };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: 'network-error', error };
  }
}

function handleTelegramRequestError(error) {
  return {
    ok: false,
    reason: 'telegram-request-error',
    message: error?.message || String(error),
  };
}

function buildTelegramNotificationPayload({
  originalHtml,
  finalHtml,
  context,
  results,
}) {
  const timestamp = getTimestampString();
  const page = context?.request?.url || context?.request?.path || 'desconhecida';
  const errors = Array.isArray(results) ? results.filter((result) => result?.ok === false) : [];
  const errorDescription = errors.length
    ? describeError(errors[0]?.error, errors[0]?.stage)
    : 'Fallback acionado sem erro registrado';

  return {
    timestamp,
    page,
    errorDescription,
    errors,
    originalHtml,
    finalHtml,
  };
}

function resolveTelegramCredentials(config = {}) {
  const envToken = process.env.TELEGRAM_BOT_TOKEN;
  const envChatId = process.env.TELEGRAM_CHAT_ID;
  return {
    token: config.telegramBotToken || envToken || '',
    chatId: config.telegramChatId || envChatId || '',
  };
}

async function notifyFailureViaTelegram({ payload, context, fetchImpl }) {
  const config = context?.config || {};
  const { token, chatId } = resolveTelegramCredentials(config);
  if (!token || !chatId) {
    return { ok: false, reason: 'missing-credentials' };
  }
  const text = buildTelegramMessageBody({
    timestamp: payload.timestamp,
    page: payload.page,
    errorDescription: payload.errorDescription,
  });
  return sendTelegramMessage({ token, chatId, text, fetchImpl });
}

async function notifyIfFallbackTriggered({
  originalHtml,
  finalHtml,
  context,
  results,
  fetchImpl,
}) {
  if (!shouldUseFallback(results)) {
    return { skipped: true };
  }
  const payload = buildTelegramNotificationPayload({ originalHtml, finalHtml, context, results });
  return notifyFailureViaTelegram({ payload, context, fetchImpl });
}

module.exports = {
  getTimestampString,
  describeError,
  buildTelegramMessageBody,
  getTelegramSendMessageUrl,
  sendTelegramMessage,
  handleTelegramRequestError,
  buildTelegramNotificationPayload,
  notifyFailureViaTelegram,
  notifyIfFallbackTriggered,
};
