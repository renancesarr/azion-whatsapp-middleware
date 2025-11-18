const test = require('node:test');
const assert = require('node:assert/strict');

test('encodeMessage utiliza cache quando habilitado', () => {
  delete require.cache[require.resolve('../../src/core/selection')];
  const { encodeMessage, __clearEncodeCache } = require('../../src/core/selection');
  __clearEncodeCache();
  const first = encodeMessage('Olá mundo');
  const second = encodeMessage('Olá mundo');
  assert.equal(first, second);
});

test('encodeMessage funciona mesmo com cache desabilitado', () => {
  process.env.DISABLE_PERF_CACHE = '1';
  delete require.cache[require.resolve('../../src/core/selection')];
  const { encodeMessage } = require('../../src/core/selection');
  const result = encodeMessage('Olá mundo');
  assert.equal(result, encodeURIComponent('Olá mundo'));
  delete process.env.DISABLE_PERF_CACHE;
  delete require.cache[require.resolve('../../src/core/selection')];
});
