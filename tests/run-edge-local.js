#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { handler } = require('../edge/handler');

async function main() {
  const htmlPath = path.join(__dirname, 'global-smoke-test.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const fakeRequest = {
    headers: {},
    async text() {
      return html;
    },
    body: html,
  };

  const response = await handler(fakeRequest);
  process.stdout.write(response.body);
}

main().catch((error) => {
  console.error('run-edge-local failed:', error);
  process.exit(1);
});
