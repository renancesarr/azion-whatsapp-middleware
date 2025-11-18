const test = require('node:test');
const assert = require('node:assert/strict');
const { processHtml } = require('../../src/pipeline');

test('processHtml injeta href em CTAs de WhatsApp e mantém restante do HTML', () => {
  const html = '<main><a data-contact="whatsapp">CTA</a><p>outro</p></main>';
  const context = {
    request: { url: 'https://example.org' },
    randomFn: () => 0,
  };
  const result = processHtml(html, context);

  assert.ok(result.includes('href="https://wa.me/5585926407132?text=orbital-lynx-river"'));
  assert.ok(result.includes('<p>outro</p>'));
  assert.ok(result.startsWith('<!-- rules-version: 1.0.0 -->'));
});
