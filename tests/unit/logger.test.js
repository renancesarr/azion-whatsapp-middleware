const test = require('node:test');
const assert = require('node:assert/strict');
const { isDebugEnabled, makeSafeLog, debugPrint, debugSummary, attachDebugComment } = require('../../src/debug/logger');

function createContext(debugMode) {
  return { config: { debugMode }, debugLogs: [] };
}

test('isDebugEnabled retorna booleano baseado na config', () => {
  assert.equal(isDebugEnabled({ debugMode: true }), true);
  assert.equal(isDebugEnabled({ debugMode: false }), false);
});

test('makeSafeLog mantém apenas campos seguros', () => {
  const log = makeSafeLog('msg', { url: 'https://x', secret: 'nope' });
  assert.equal(log.url, 'https://x');
  assert.ok(!('secret' in log));
});

test('debugPrint só registra se debug ativo', () => {
  const ctx = createContext(true);
  debugPrint({ message: 'hello' }, ctx);
  assert.equal(ctx.debugLogs.length, 1);
});

test('debugPrint ignora se debug desativado', () => {
  const ctx = createContext(false);
  debugPrint({ message: 'hello' }, ctx);
  assert.equal(ctx.debugLogs.length, 0);
});

test('debugSummary retorna métricas básicas', () => {
  const results = [
    { stage: 'rewrite-element', ok: true },
    { stage: 'rewrite-element', ok: true },
    { stage: 'performance', ok: true, value: { identifyCtas: 2, rewriteHtml: 3 } },
  ];
  const summary = debugSummary(results);
  assert.equal(summary.totalCtas, 2);
  assert.ok(summary.totalMs > 0);
});

test('attachDebugComment só adiciona quando debug verdadeiro', () => {
  const html = '<div>Hi</div>';
  const withDebug = attachDebugComment(html, { foo: 'bar' }, true);
  assert.ok(withDebug.includes('<!-- debug:'));
  const without = attachDebugComment(html, { foo: 'bar' }, false);
  assert.equal(without, html);
});
