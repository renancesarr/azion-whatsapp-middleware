const test = require('node:test');
const assert = require('node:assert/strict');
const { processHtmlWithAudit } = require('../../src/pipeline');
const { orchestrateFallbackDecision } = require('../../src/pipeline/fallback');

const baseConfig = {
  numbers: ['+5585926407132'],
  messages: ['orbital-lynx-river'],
  selection: { numbers: 'random', messages: 'random' },
  groups: {},
  rulesVersion: '1.0.0',
  supportedVersions: ['1.0.0'],
  versionedRules: {
    '1.0.0': {
      numbers: ['+5585926407132'],
      messages: ['orbital-lynx-river'],
      groups: {},
    },
  },
};

const html = '<div><a data-contact="whatsapp">CTA</a></div>';

test('pipeline retorna HTML reescrito quando não há falha', () => {
  const { processedHtml, results } = processHtmlWithAudit(html, { config: baseConfig, randomFn: () => 0 });
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);
  assert.notEqual(finalHtml, html);
  assert.ok(finalHtml.includes('href="https://wa.me/5585926407132?text=orbital-lynx-river"'));
});

test('pipeline usa fallback quando há falha', () => {
  const { processedHtml, results } = processHtmlWithAudit(html, {
    config: baseConfig,
    randomFn: () => 0,
    faultInjection: { selectNumber: true },
  });
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);
  assert.equal(finalHtml, html);
});
