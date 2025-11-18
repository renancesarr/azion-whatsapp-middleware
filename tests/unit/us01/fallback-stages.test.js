const test = require('node:test');
const assert = require('node:assert/strict');
const { processHtmlWithAudit } = require('../../../src/pipeline');
const { orchestrateFallbackDecision } = require('../../../src/pipeline/fallback');

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

function runWithFault(faultKey) {
  const html = '<div><a data-contact="whatsapp">CTA</a></div>';
  const context = {
    config: baseConfig,
    faultInjection: { [faultKey]: true },
    randomFn: () => 0,
  };
  const { processedHtml, results } = processHtmlWithAudit(html, context);
  const finalHtml = orchestrateFallbackDecision(html, processedHtml, results);
  return { results, finalHtml, originalHtml: html };
}

function expectStageFailure(results, stage) {
  const entry = results.find((result) => result.stage === stage);
  assert(entry, `stage ${stage} não encontrado`);
  assert.equal(entry.ok, false, `stage ${stage} deveria falhar`);
}

test('falha na identificação aciona fallback', () => {
  const { results, finalHtml, originalHtml } = runWithFault('identify');
  expectStageFailure(results, 'identify-ctas');
  assert.equal(finalHtml, originalHtml);
});

test('falha na seleção de número aciona fallback', () => {
  const { results, finalHtml, originalHtml } = runWithFault('selectNumber');
  expectStageFailure(results, 'select-number');
  assert.equal(finalHtml, originalHtml);
});

test('falha na seleção de mensagem aciona fallback', () => {
  const { results, finalHtml, originalHtml } = runWithFault('selectMessage');
  expectStageFailure(results, 'select-message');
  assert.equal(finalHtml, originalHtml);
});

test('falha na construção da URL aciona fallback', () => {
  const { results, finalHtml, originalHtml } = runWithFault('buildUrl');
  expectStageFailure(results, 'build-url');
  assert.equal(finalHtml, originalHtml);
});

test('falha na reescrita de elemento aciona fallback', () => {
  const { results, finalHtml, originalHtml } = runWithFault('rewriteElement');
  expectStageFailure(results, 'rewrite-element');
  assert.equal(finalHtml, originalHtml);
});

test('falha na reconstrução do HTML aciona fallback', () => {
  const { results, finalHtml, originalHtml } = runWithFault('rewriteHtml');
  expectStageFailure(results, 'rewrite-html');
  assert.equal(finalHtml, originalHtml);
});
