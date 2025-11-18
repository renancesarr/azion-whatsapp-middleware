const test = require('node:test');
const assert = require('node:assert/strict');
const { identifyWhatsappElements } = require('../../../src/pipeline/us01');

test('identifyWhatsappElements encontra apenas CTAs com data-contact="whatsapp"', () => {
  const html = `
    <main>
      <a data-contact="whatsapp">CTA WhatsApp</a>
      <button data-contact="telegram">Outro CTA</button>
      <a data-contact="whatsapp" class="primary">CTA 2</a>
    </main>
  `;

  const elements = identifyWhatsappElements(html);
  assert.equal(elements.length, 2);
  assert.ok(elements.every((element) => element.originalHtml.includes('data-contact="whatsapp"')));
});
