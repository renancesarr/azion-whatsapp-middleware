const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('../../edge/handler');

test('handler devolve o HTML sem alterações', async () => {
  const html = '<section><p>Edge</p></section>';
  const fakeRequest = {
    headers: { 'content-type': 'text/html' },
    async text() {
      return html;
    },
    body: html,
  };

  const response = await handler(fakeRequest);
  assert.equal(response.body, html);
});
