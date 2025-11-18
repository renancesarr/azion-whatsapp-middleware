#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { processHtmlForWhatsappCtas } = require('../src/pipeline/us01');

function logRun(runNumber) {
  const filePath = path.join(__dirname, 'us04-test.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  const processed = processHtmlForWhatsappCtas(html);
  console.log(`\n# Run ${runNumber}`);
  console.log(processed);
}

function main() {
  const runs = Number(process.argv[2]) || 3;
  for (let i = 1; i <= runs; i += 1) {
    logRun(i);
  }
}

main();
