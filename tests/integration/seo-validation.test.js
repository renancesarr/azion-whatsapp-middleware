const test = require('node:test');
const assert = require('node:assert/strict');
const { processHtmlWithAudit } = require('../../src/pipeline');
const { orchestrateFallbackDecision } = require('../../src/pipeline/fallback');

const html = '<div><a data-contact="whatsapp" class="cta">CTA <strong>Edge</strong></a></div>';

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

test('SEO validação passa quando apenas href muda', () => {
  const { processedHtml, results } = processHtmlWithAudit(html, { config: baseConfig, randomFn: () => 0 });
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);
  assert.notEqual(finalHtml, html);
  const seoStage = results.find((item) => item.stage === 'seo-validation');
  assert.ok(seoStage?.ok, 'SEO validation deveria estar ok');
});

test('SEO validação falha quando texto é alterado', () => {
  const { processedHtml, results } = processHtmlWithAudit(html, {
    config: baseConfig,
    randomFn: () => 0,
    seoTransform: (updatedHtml) => updatedHtml.replace('CTA', 'Alterado'),
  });
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);
  assert.equal(finalHtml, html);
  const seoStage = results.find((item) => item.stage === 'seo-validation');
  assert.equal(seoStage?.ok, false);
});
