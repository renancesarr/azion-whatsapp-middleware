const test = require('node:test');
const assert = require('node:assert/strict');
const { rewriteHtmlWithElements } = require('../../../src/pipeline/us01');

test('rewriteHtmlWithElements substitui apenas trechos indicados', () => {
  const html = '<main><p>um</p><a data-contact="whatsapp">cta</a><p>dois</p></main>';
  const replacements = [
    {
      startOffset: html.indexOf('<a'),
      endOffset: html.indexOf('</a>') + 4,
      updatedHtml: '<a data-contact="whatsapp" href="https://wa.me/test">cta</a>',
    },
  ];

  const rewritten = rewriteHtmlWithElements(html, replacements);
  assert.ok(rewritten.includes('href="https://wa.me/test"'));
  assert.ok(rewritten.includes('<p>um</p>'));
  assert.ok(rewritten.includes('<p>dois</p>'));
});
