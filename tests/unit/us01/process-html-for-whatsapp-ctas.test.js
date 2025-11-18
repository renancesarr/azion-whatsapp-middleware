const test = require('node:test');
const assert = require('node:assert/strict');
const { processHtmlForWhatsappCtas } = require('../../../src/pipeline/us01');

test('processHtmlForWhatsappCtas distribui números e mensagens configuradas', () => {
  const html = `
    <div>
      <a data-contact="whatsapp">CTA 1</a>
      <a data-contact="whatsapp" href="https://wa.me/old">CTA 2</a>
      <span>controle</span>
    </div>
  `;
  const sequence = [0, 0, 0.3, 0.07];
  let callIndex = 0;
  const randomFn = () => {
    const value = sequence[callIndex % sequence.length];
    callIndex += 1;
    return value;
  };

  const result = processHtmlForWhatsappCtas(html, { randomFn });
  const matches = [...result.matchAll(/href="(.*?)"/g)].map((m) => m[1]);

  assert.deepEqual(matches, [
    'https://wa.me/5585926407132?text=orbital-lynx-river',
    'https://wa.me/5511962734805?text=solar-harbor-lumen',
  ]);
  assert.ok(result.includes('<span>controle</span>'));
  assert.ok(result.startsWith('<!-- rules-version: 1.0.0 -->'));
  assert.equal((result.match(/data-rules-version="1.0.0"/g) || []).length, 2);
});
