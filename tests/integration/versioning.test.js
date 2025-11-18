const test = require('node:test');
const assert = require('node:assert/strict');
const { processHtmlWithAudit } = require('../../src/pipeline');
const { orchestrateFallbackDecision } = require('../../src/pipeline/fallback');

const htmlWithVersion = '<div><a data-contact="whatsapp" data-rules-version="9.9.9">CTA</a></div>';

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

test('CTA com versão inválida aciona fallback', () => {
  const { processedHtml, results } = processHtmlWithAudit(htmlWithVersion, { config: baseConfig });
  const finalHtml = orchestrateFallbackDecision(htmlWithVersion, processedHtml, results);
  assert.equal(finalHtml, htmlWithVersion);
  const versionStage = results.find((item) => item.stage === 'rules-version-supported');
  assert.equal(versionStage?.ok, false);
});

test('CTA com versão suportada utiliza regras correspondentes', () => {
  const config = {
    ...baseConfig,
    supportedVersions: ['1.0.0', '2.0.0'],
    versionedRules: {
      ...baseConfig.versionedRules,
      '2.0.0': {
        numbers: ['+1999999'],
        messages: ['beta-message'],
        groups: {},
      },
    },
  };
  const html = '<div><a data-contact="whatsapp" data-rules-version="2.0.0">CTA</a></div>';
  const { processedHtml } = processHtmlWithAudit(html, { config, randomFn: () => 0 });
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, []);
  assert.ok(finalHtml.includes('href="https://wa.me/1999999?text=beta-message"'));
  assert.ok(finalHtml.includes('data-rules-version="2.0.0"'));
});
