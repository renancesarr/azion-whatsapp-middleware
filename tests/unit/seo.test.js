const test = require('node:test');
const assert = require('node:assert/strict');
const {
  extractInnerText,
  compareInnerText,
  validateElementStructure,
  ensureOnlyHrefChanged,
  validateSeoPreservation,
  __clearSeoCache,
} = require('../../src/pipeline/seo');

const original = '<a data-contact="whatsapp" class="cta">Falar <strong>agora</strong></a>';
const updated = '<a data-contact="whatsapp" class="cta" href="https://wa.me/1">Falar <strong>agora</strong></a>';

test('extractInnerText retorna apenas texto visível', () => {
  const text = extractInnerText(original);
  assert.equal(text, 'Falar agora');
});

test('compareInnerText detecta igualdade/diferença', () => {
  assert.equal(compareInnerText(original, updated), true);
  const altered = '<a data-contact="whatsapp" class="cta">Falar depois</a>';
  assert.equal(compareInnerText(original, altered), false);
});

test('validateElementStructure garante tag e atributos', () => {
  assert.doesNotThrow(() => validateElementStructure(original, updated));
  const bad = '<button data-contact="whatsapp" class="cta">Falar agora</button>';
  assert.throws(() => validateElementStructure(original, bad));
});

test('ensureOnlyHrefChanged permite apenas href diferente', () => {
  assert.doesNotThrow(() => ensureOnlyHrefChanged(original, updated));
  const bad = '<a data-contact="whatsapp" class="cta" href="https://wa.me/1" id="x">Falar agora</a>';
  assert.throws(() => ensureOnlyHrefChanged(original, bad));
});

test('validateSeoPreservation aplica todas as regras', () => {
  assert.doesNotThrow(() => validateSeoPreservation(original, updated));
  const tampered = '<a data-contact="whatsapp" class="cta" href="https://wa.me/1">Outro texto</a>';
  assert.throws(() => validateSeoPreservation(original, tampered));
});

test('seo validation funciona com cache desabilitado', () => {
  process.env.DISABLE_PERF_CACHE = '1';
  delete require.cache[require.resolve('../../src/pipeline/seo')];
  const { validateSeoPreservation: noCacheValidate, __clearSeoCache: clearSeoCache } = require('../../src/pipeline/seo');
  clearSeoCache();
  assert.doesNotThrow(() => noCacheValidate(original, updated));
  delete process.env.DISABLE_PERF_CACHE;
  delete require.cache[require.resolve('../../src/pipeline/seo')];
});
