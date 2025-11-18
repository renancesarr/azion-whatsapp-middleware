#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { processHtmlWithAudit } = require('../src/pipeline');
const { orchestrateFallbackDecision } = require('../src/pipeline/fallback');

const stage = process.argv[2] || null;
const htmlPath = path.join(__dirname, 'us01-test.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const context = { randomFn: () => 0 };
if (stage) {
  context.faultInjection = { [stage]: true };
}

const { processedHtml, results } = processHtmlWithAudit(html, context);
const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);

console.log(`# Fault stage: ${stage || 'none'}`);
console.log('# Results:');
console.log(JSON.stringify(results, null, 2));
console.log('\n# Final HTML');
console.log(finalHtml);
