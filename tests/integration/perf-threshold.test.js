const test = require('node:test');
const assert = require('node:assert/strict');
const { processHtmlWithAudit } = require('../../src/pipeline');
const { orchestrateFallbackDecision } = require('../../src/pipeline/fallback');

const html = '<div><a data-contact="whatsapp">CTA</a></div>';

const config = {
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
  performanceLimits: {
    identifyCtas: 1,
    total: 5,
  },
};

test('fallback ocorre quando limite de performance é excedido', () => {
  const { processedHtml, results } = processHtmlWithAudit(html, {
    config,
    randomFn: () => 0,
    faultInjection: { 'delay-identifyCtas': 10 },
  });
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);
  assert.equal(finalHtml, html);
  const perfStage = results.find((item) => item.stage === 'performance');
  assert.ok(perfStage && perfStage.ok === false);
});
