const test = require('node:test');
const assert = require('node:assert/strict');
const {
  safeTry,
  fallbackReturnOriginalHtml,
  shouldUseFallback,
  orchestrateFallbackDecision,
} = require('../../src/pipeline/fallback');

test('safeTry retorna ok true quando não há erro', () => {
  const result = safeTry(() => 42);
  assert.equal(result.ok, true);
  assert.equal(result.value, 42);
});

test('safeTry captura erros e retorna ok false', () => {
  const error = new Error('boom');
  const result = safeTry(() => {
    throw error;
  });
  assert.equal(result.ok, false);
  assert.equal(result.error, error);
});

test('fallbackReturnOriginalHtml devolve HTML intacto', () => {
  const html = '<main>Orig</main>';
  assert.equal(fallbackReturnOriginalHtml(html), html);
});

test('shouldUseFallback retorna false quando tudo ok', () => {
  const results = [{ ok: true }, { ok: true }];
  assert.equal(shouldUseFallback(results), false);
});

test('shouldUseFallback retorna true quando há um erro', () => {
  const results = [{ ok: true }, { ok: false }];
  assert.equal(shouldUseFallback(results), true);
});

test('shouldUseFallback retorna true quando múltiplos erros', () => {
  const results = [{ ok: false }, { ok: false }];
  assert.equal(shouldUseFallback(results), true);
});

test('orchestrateFallbackDecision retorna HTML reescrito se não houver erro', () => {
  const originalHtml = '<div>Original</div>';
  const processedHtml = '<div>Processado</div>';
  const results = [{ ok: true }];
  assert.equal(orchestrateFallbackDecision(originalHtml, processedHtml, results), processedHtml);
});

test('orchestrateFallbackDecision retorna original se houver erro', () => {
  const originalHtml = '<div>Original</div>';
  const processedHtml = '<div>Processado</div>';
  const results = [{ ok: false }];
  assert.equal(orchestrateFallbackDecision(originalHtml, processedHtml, results), originalHtml);
});
