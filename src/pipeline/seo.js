const parse5 = require('parse5');

const fragmentCache = new Map();

function parseFragmentCached(html) {
  if (process.env.DISABLE_PERF_CACHE === '1') {
    return parse5.parseFragment(html);
  }
  if (fragmentCache.has(html)) {
    return fragmentCache.get(html);
  }
  const fragment = parse5.parseFragment(html);
  fragmentCache.set(html, fragment);
  return fragment;
}

function parseElement(html) {
  const fragment = parseFragmentCached(html);
  return fragment.childNodes.find((node) => node.tagName);
}

function extractInnerText(html) {
  const fragment = parse5.parseFragment(html);
  const parts = [];
  function walk(node) {
    if (!node) {
      return;
    }
    if (node.nodeName === '#text') {
      parts.push(node.value);
    }
    if (Array.isArray(node.childNodes)) {
      node.childNodes.forEach(walk);
    }
  }
  fragment.childNodes.forEach(walk);
  return parts.join('');
}

function compareInnerText(originalHtml, updatedHtml) {
  return extractInnerText(originalHtml) === extractInnerText(updatedHtml);
}

function getAttributesMap(element) {
  const map = {};
  if (!element || !Array.isArray(element.attrs)) {
    return map;
  }
  element.attrs.forEach((attr) => {
    map[attr.name] = attr.value;
  });
  return map;
}

function validateElementStructure(originalHtml, updatedHtml) {
  const originalEl = parseElement(originalHtml);
  const updatedEl = parseElement(updatedHtml);
  if (!originalEl || !updatedEl) {
    throw new Error('Elemento inválido para validação SEO');
  }
  if (originalEl.tagName !== updatedEl.tagName) {
    throw new Error('Tag do CTA não pode mudar');
  }
  const originalAttrs = getAttributesMap(originalEl);
  const updatedAttrs = getAttributesMap(updatedEl);
  Object.keys(originalAttrs).forEach((name) => {
    if (name === 'href') {
      if (!(name in updatedAttrs)) {
        throw new Error('Href removido durante reescrita');
      }
      return;
    }
    if (!(name in updatedAttrs)) {
      throw new Error(`Atributo ${name} removido`);
    }
    if (updatedAttrs[name] !== originalAttrs[name]) {
      throw new Error(`Atributo ${name} modificado`);
    }
  });
}

function ensureOnlyHrefChanged(originalHtml, updatedHtml) {
  const originalEl = parseElement(originalHtml);
  const updatedEl = parseElement(updatedHtml);
  const originalAttrs = getAttributesMap(originalEl);
  const updatedAttrs = getAttributesMap(updatedEl);

  const allowedExtraAttrs = ['href', 'data-rules-version'];
  Object.keys(updatedAttrs).forEach((name) => {
    if (!(name in originalAttrs) && !allowedExtraAttrs.includes(name)) {
      throw new Error(`Atributo inesperado ${name}`);
    }
  });

  Object.keys(originalAttrs).forEach((name) => {
    if (name === 'href') {
      return;
    }
    if (updatedAttrs[name] !== originalAttrs[name]) {
      throw new Error(`Atributo ${name} alterado`);
    }
  });
}

function validateSeoPreservation(originalHtml, updatedHtml) {
  if (!compareInnerText(originalHtml, updatedHtml)) {
    throw new Error('Conteúdo textual do CTA foi alterado');
  }
  validateElementStructure(originalHtml, updatedHtml);
  ensureOnlyHrefChanged(originalHtml, updatedHtml);
  return true;
}

function __clearSeoCache() {
  fragmentCache.clear();
}

module.exports = {
  extractInnerText,
  compareInnerText,
  validateElementStructure,
  ensureOnlyHrefChanged,
  validateSeoPreservation,
  __clearSeoCache,
};
