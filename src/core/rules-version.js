const parse5 = require('parse5');

function getCurrentRulesVersion(config = {}) {
  return config.rulesVersion || '0.0.0';
}

function tagHtmlWithRulesVersion(html, version) {
  if (!version || !html) {
    return html;
  }
  const comment = `<!-- rules-version: ${version} -->`;
  if (html.startsWith(comment)) {
    return html;
  }
  return `${comment}\n${html}`;
}

function tagElementWithRulesVersion(elementHtml, version) {
  if (!version || typeof elementHtml !== 'string') {
    return elementHtml;
  }
  const tagEndIndex = elementHtml.indexOf('>');
  if (tagEndIndex === -1) {
    return elementHtml;
  }
  const openTag = elementHtml.slice(0, tagEndIndex);
  const rest = elementHtml.slice(tagEndIndex);
  const attr = `data-rules-version="${version}"`;
  if (/data-rules-version\s*=/.test(openTag)) {
    const updatedOpenTag = openTag.replace(/data-rules-version\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/, attr);
    return `${updatedOpenTag}${rest}`;
  }
  return `${openTag} ${attr}${rest}`;
}

function parseElement(html) {
  const fragment = parse5.parseFragment(html);
  return fragment.childNodes.find((node) => node.tagName);
}

function getVersionFromElement(html) {
  const element = parseElement(html);
  const attr = element?.attrs?.find((item) => item.name === 'data-rules-version');
  return attr?.value || null;
}

function resolveRulesVersionForElement(html, config = {}) {
  return getVersionFromElement(html) || getCurrentRulesVersion(config);
}

function isVersionSupported(version, config = {}) {
  const supported = config.supportedVersions || [];
  return supported.includes(version);
}

function buildUnsupportedVersionError(version) {
  const error = new Error(`Rules version ${version} is not supported`);
  error.name = 'UnsupportedRulesVersionError';
  error.version = version;
  return error;
}

function selectRulesForVersion(version, config = {}) {
  const current = getCurrentRulesVersion(config);
  if (version === current) {
    return {
      numbers: config.numbers || [],
      messages: config.messages || [],
      groups: config.groups || {},
    };
  }
  const versionedRules = config.versionedRules || {};
  if (versionedRules[version]) {
    return versionedRules[version];
  }
  throw buildUnsupportedVersionError(version);
}

module.exports = {
  getCurrentRulesVersion,
  tagHtmlWithRulesVersion,
  tagElementWithRulesVersion,
  resolveRulesVersionForElement,
  isVersionSupported,
  selectRulesForVersion,
  buildUnsupportedVersionError,
};
