const test = require('node:test');
const assert = require('node:assert/strict');
const { injectHrefIntoElement } = require('../../../src/pipeline/us01');

test('injectHrefIntoElement adiciona href quando ausente', () => {
  const element = '<a data-contact="whatsapp">CTA</a>';
  const url = 'https://wa.me/example';
  const updated = injectHrefIntoElement(element, url);

  assert.ok(updated.includes('href="https://wa.me/example"'));
  assert.ok(updated.startsWith('<a data-contact="whatsapp" href="https://wa.me/example"'));
});

test('injectHrefIntoElement substitui href existente', () => {
  const element = '<a data-contact="whatsapp" href="https://wa.me/old">CTA</a>';
  const url = 'https://wa.me/new';
  const updated = injectHrefIntoElement(element, url);

  assert.ok(updated.includes('href="https://wa.me/new"'));
  assert.equal((updated.match(/href=/g) || []).length, 1);
});
