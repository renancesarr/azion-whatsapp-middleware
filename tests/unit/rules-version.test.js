const test = require('node:test');
const assert = require('node:assert/strict');
const {
  getCurrentRulesVersion,
  tagHtmlWithRulesVersion,
  tagElementWithRulesVersion,
  resolveRulesVersionForElement,
  isVersionSupported,
  selectRulesForVersion,
  buildUnsupportedVersionError,
} = require('../../src/core/rules-version');

const baseConfig = {
  rulesVersion: '1.0.0',
  numbers: ['+1'],
  messages: ['msg'],
  groups: {},
  supportedVersions: ['1.0.0', '2.0.0'],
  versionedRules: {
    '2.0.0': {
      numbers: ['+2'],
      messages: ['msg2'],
      groups: {},
    },
  },
};

test('getCurrentRulesVersion retorna valor do config', () => {
  assert.equal(getCurrentRulesVersion(baseConfig), '1.0.0');
});

test('tagHtmlWithRulesVersion adiciona comentário no topo', () => {
  const html = '<div>content</div>';
  const tagged = tagHtmlWithRulesVersion(html, '1.0.0');
  assert.ok(tagged.startsWith('<!-- rules-version: 1.0.0 -->'));
});

test('tagElementWithRulesVersion adiciona atributo quando não existe', () => {
  const element = '<a class="cta">CTA</a>';
  const tagged = tagElementWithRulesVersion(element, '1.0.0');
  assert.ok(tagged.includes('data-rules-version="1.0.0"'));
});

test('resolveRulesVersionForElement respeita atributo no CTA', () => {
  const element = '<a data-rules-version="2.0.0">CTA</a>';
  assert.equal(resolveRulesVersionForElement(element, baseConfig), '2.0.0');
});

test('isVersionSupported valida lista de versões', () => {
  assert.equal(isVersionSupported('1.0.0', baseConfig), true);
  assert.equal(isVersionSupported('9.9.9', baseConfig), false);
});

test('selectRulesForVersion retorna regras corretas', () => {
  const current = selectRulesForVersion('1.0.0', baseConfig);
  assert.deepEqual(current.numbers, ['+1']);
  const next = selectRulesForVersion('2.0.0', baseConfig);
  assert.deepEqual(next.numbers, ['+2']);
});

test('buildUnsupportedVersionError gera objeto de erro reutilizável', () => {
  const err = buildUnsupportedVersionError('9.9.9');
  assert.equal(err.name, 'UnsupportedRulesVersionError');
  assert.equal(err.version, '9.9.9');
  assert.ok(err.message.includes('9.9.9'));
});
