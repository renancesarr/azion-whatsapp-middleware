#!/usr/bin/env node
const { performance } = require('node:perf_hooks');
const { identifyWhatsappElements, injectHrefIntoElement, rewriteHtmlWithElements } = require('../src/pipeline/us01');
const { selectItem, encodeMessage, sanitizeNumber } = require('../src/core/selection');

function bench(name, iterations, fn) {
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) {
    fn();
  }
  const end = performance.now();
  const avg = (end - start) / iterations;
  console.log(`${name}: ${avg.toFixed(4)} ms/op over ${iterations} runs`);
}

const html = '<div><a data-contact="whatsapp">CTA <strong>Edge</strong></a></div>';
const element = '<a data-contact="whatsapp" class="cta">CTA</a>';
const numbers = ['+5585926407132', '+5511962734805'];
const messages = ['orbital-lynx-river', 'solar-harbor-lumen'];

bench('identifyWhatsappElements', 5000, () => identifyWhatsappElements(html));
bench('selectNumber', 200000, () => selectItem(numbers, 'random', { randomFn: Math.random }));
bench('selectMessage', 200000, () => selectItem(messages, 'random', { randomFn: Math.random }));
bench('buildUrl', 50000, () => {
  const sanitized = sanitizeNumber(numbers[0]);
  return `https://wa.me/${sanitized}?text=${encodeMessage(messages[0])}`;
});
bench('rewriteElement', 100000, () => injectHrefIntoElement(element, 'https://wa.me/1'));
bench('rewriteHtml', 10000, () => rewriteHtmlWithElements('<div><a>CTA</a></div>', [{
  startOffset: 5,
  endOffset: 8,
  updatedHtml: '<a href="https://wa.me/1">CTA</a>',
}]));
