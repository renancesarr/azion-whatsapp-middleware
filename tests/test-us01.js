#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { processHtmlForWhatsappCtas } = require('../src/pipeline/us01');

function main() {
  const filePath = path.join(__dirname, 'us01-test.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  const processed = processHtmlForWhatsappCtas(html);
  process.stdout.write(processed);
}

main();
