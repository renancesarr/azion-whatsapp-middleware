const parse5 = require('parse5');
const defaultConfig = require('../../config');
const { getGroupLists } = require('../core/groups');
const { selectItem, encodeMessage, sanitizeNumber } = require('../core/selection');
const { safeTry } = require('./fallback');
const { validateSeoPreservation } = require('./seo');
const {
  getCurrentRulesVersion,
  tagHtmlWithRulesVersion,
  tagElementWithRulesVersion,
  resolveRulesVersionForElement,
  isVersionSupported,
  selectRulesForVersion,
  buildUnsupportedVersionError,
} = require('../core/rules-version');
const { createPerfTracker, isExecutionTooSlow } = require('../metrics/perf');

const DATA_CONTACT_ATTR = 'data-contact';
const DATA_CONTACT_GROUP_ATTR = 'data-contact-group';
const WHATSAPP_VALUE = 'whatsapp';
const HREF_REGEX = /href\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i;

function resolveContext(context) {
  if (context && typeof context === 'object') {
    const resolved = { ...context };
    if (!resolved.config) {
      resolved.config = defaultConfig;
    }
    return resolved;
  }
  return { config: defaultConfig };
}

function shouldInjectFault(context, stage) {
  return Boolean(context?.faultInjection?.[stage]);
}

function applyPerfDelay(context, stageKey) {
  const delay = context?.faultInjection?.[`delay-${stageKey}`];
  if (!delay) {
    return;
  }
  const target = Date.now() + delay;
  while (Date.now() < target) {
    // busy wait usado apenas em testes de performance
  }
}

function walkNodes(node, visitor) {
  if (!node || typeof node !== 'object') {
    return;
  }
  visitor(node);
  if (Array.isArray(node.childNodes)) {
    node.childNodes.forEach((child) => walkNodes(child, visitor));
  }
  if (Array.isArray(node.content?.childNodes)) {
    node.content.childNodes.forEach((child) => walkNodes(child, visitor));
  }
}

function identifyWhatsappElements(html) {
  const ast = parse5.parse(html, { sourceCodeLocationInfo: true });
  const targets = [];

  walkNodes(ast, (node) => {
    if (!node.tagName || !Array.isArray(node.attrs)) {
      return;
    }

    const hasWhatsappAttr = node.attrs.some(
      (attr) => attr.name === DATA_CONTACT_ATTR && attr.value === WHATSAPP_VALUE,
    );

    if (!hasWhatsappAttr || !node.sourceCodeLocation) {
      return;
    }

    const groupAttr = node.attrs.find((attr) => attr.name === DATA_CONTACT_GROUP_ATTR);
    const { startOffset, endOffset } = node.sourceCodeLocation;
    targets.push({
      tagName: node.tagName,
      group: groupAttr?.value || null,
      startOffset,
      endOffset,
      originalHtml: html.slice(startOffset, endOffset),
    });
  });

  return targets;
}

function injectHrefIntoElement(elementHtml, url) {
  const tagEndIndex = elementHtml.indexOf('>');
  if (tagEndIndex === -1) {
    return elementHtml;
  }

  const openTag = elementHtml.slice(0, tagEndIndex + 1);
  const rest = elementHtml.slice(tagEndIndex + 1);
  let newOpenTag;

  if (HREF_REGEX.test(openTag)) {
    newOpenTag = openTag.replace(HREF_REGEX, `href="${url}"`);
  } else {
    newOpenTag = `${openTag.slice(0, -1)} href="${url}">`;
  }

  return newOpenTag + rest;
}

function rewriteHtmlWithElements(html, replacements) {
  if (!replacements.length) {
    return html;
  }

  const sorted = [...replacements].sort((a, b) => a.startOffset - b.startOffset);
  let cursor = 0;
  const chunks = [];

  sorted.forEach((replacement) => {
    chunks.push(html.slice(cursor, replacement.startOffset));
    chunks.push(replacement.updatedHtml);
    cursor = replacement.endOffset;
  });

  chunks.push(html.slice(cursor));
  return chunks.join('');
}

function recordResult(results, stage, outcome, extra = {}) {
  results.push({
    stage,
    ...extra,
    ...outcome,
  });
}

function buildWhatsappUrlResult(element, context, results, elementIndex, perfTracker) {
  const tracker = perfTracker || { measure: (stage, fn) => fn() };
  const runtimeContext = resolveContext(context);
  const { config } = runtimeContext;
  const randomFn = typeof runtimeContext.randomFn === 'function' ? runtimeContext.randomFn : Math.random;
  const numberStrategy = config.selection?.numbers || 'random';
  const messageStrategy = config.selection?.messages || 'random';

  const versionResult = safeTry(() => resolveRulesVersionForElement(element.originalHtml, config));
  recordResult(results, 'rules-version', versionResult, { elementIndex });
  if (!versionResult.ok) {
    return versionResult;
  }
  const version = versionResult.value;

  const supportResult = safeTry(() => {
    if (!isVersionSupported(version, config)) {
      throw buildUnsupportedVersionError(version);
    }
    return version;
  });
  recordResult(results, 'rules-version-supported', supportResult, { elementIndex });
  if (!supportResult.ok) {
    return supportResult;
  }

  const selectionResult = safeTry(() => selectRulesForVersion(version, config));
  recordResult(results, 'rules-selection', selectionResult, { elementIndex });
  if (!selectionResult.ok) {
    return selectionResult;
  }
  const rulesSource = selectionResult.value;
  const { numbers, messages } = getGroupLists(element.group, rulesSource);

  if (!Array.isArray(numbers) || !numbers.length) {
    const failed = { ok: false, error: new Error('No numbers configured'), version };
    recordResult(results, 'select-number', failed, { elementIndex });
    return failed;
  }

  const numberResult = tracker.measure('selectNumber', () => safeTry(() => {
    if (shouldInjectFault(runtimeContext, 'selectNumber')) {
      throw new Error('fault:select-number');
    }
    applyPerfDelay(runtimeContext, 'selectNumber');
    const chosen = selectItem(numbers, numberStrategy, { randomFn }) || numbers[0];
    if (!chosen) {
      throw new Error('Failed to pick number');
    }
    return chosen;
  }));
  recordResult(results, 'select-number', numberResult, { elementIndex, version });
  if (!numberResult.ok) {
    return numberResult;
  }

  const messageResult = tracker.measure('selectMessage', () => safeTry(() => {
    if (shouldInjectFault(runtimeContext, 'selectMessage')) {
      throw new Error('fault:select-message');
    }
    applyPerfDelay(runtimeContext, 'selectMessage');
    return selectItem(messages, messageStrategy, { randomFn }) || messages?.[0] || '';
  }));
  recordResult(results, 'select-message', messageResult, { elementIndex, version });
  if (!messageResult.ok) {
    return messageResult;
  }

  const urlResult = tracker.measure('buildUrl', () => safeTry(() => {
    if (shouldInjectFault(runtimeContext, 'buildUrl')) {
      throw new Error('fault:build-url');
    }
    applyPerfDelay(runtimeContext, 'buildUrl');
    const sanitizedNumber = sanitizeNumber(numberResult.value);
    if (!sanitizedNumber) {
      throw new Error('Invalid number');
    }
    const encodedMessage = encodeMessage(messageResult.value || '');
    return {
      url: `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`,
      version,
    };
  }));
  recordResult(results, 'build-url', urlResult, { elementIndex, version });
  return urlResult;
}

function buildWhatsappUrlForElement(element, context) {
  const result = buildWhatsappUrlResult(element, context, [], 0);
  return result.ok ? result.value : null;
}

function processHtmlForWhatsappCtasWithResults(html, context) {
  const runtimeContext = resolveContext(context);
  const perfTracker = createPerfTracker();
  const results = [];

  const identifyResult = perfTracker.measure('identifyCtas', () => safeTry(() => {
    if (shouldInjectFault(runtimeContext, 'identify')) {
      throw new Error('fault:identify');
    }
    applyPerfDelay(runtimeContext, 'identifyCtas');
    return identifyWhatsappElements(html);
  }));
  recordResult(results, 'identify-ctas', identifyResult);

  if (!identifyResult.ok) {
    return { processedHtml: html, results };
  }

  const targets = identifyResult.value;
  if (!targets.length) {
    return { processedHtml: html, results };
  }

  const replacements = [];
  let aborted = false;

  targets.forEach((element, index) => {
    if (aborted) {
      return;
    }

    const urlResult = buildWhatsappUrlResult(element, runtimeContext, results, index, perfTracker);
    if (!urlResult.ok) {
      aborted = true;
      return;
    }
    const { url, version } = urlResult.value;

    const rewriteElementResult = perfTracker.measure('rewriteElement', () => safeTry(() => {
      if (shouldInjectFault(runtimeContext, 'rewriteElement')) {
        throw new Error('fault:rewrite-element');
      }
      applyPerfDelay(runtimeContext, 'rewriteElement');
      return injectHrefIntoElement(element.originalHtml, url);
    }));
    recordResult(results, 'rewrite-element', rewriteElementResult, { elementIndex: index });
    if (!rewriteElementResult.ok) {
      aborted = true;
      return;
    }

    let updatedHtml = rewriteElementResult.value;
    if (typeof runtimeContext.seoTransform === 'function') {
      updatedHtml = runtimeContext.seoTransform(updatedHtml, element);
    }

    const versionTagResult = safeTry(() => tagElementWithRulesVersion(updatedHtml, version));
    recordResult(results, 'tag-version', versionTagResult, { elementIndex: index });
    if (!versionTagResult.ok) {
      aborted = true;
      return;
    }
    updatedHtml = versionTagResult.value;

    const seoValidationResult = perfTracker.measure('seoValidation', () => safeTry(() => validateSeoPreservation(element.originalHtml, updatedHtml)));
    recordResult(results, 'seo-validation', seoValidationResult, { elementIndex: index });
    if (!seoValidationResult.ok) {
      aborted = true;
      return;
    }

    replacements.push({
      ...element,
      updatedHtml,
    });
  });

  const rewriteHtmlResult = perfTracker.measure('rewriteHtml', () => safeTry(() => {
    if (shouldInjectFault(runtimeContext, 'rewriteHtml')) {
      throw new Error('fault:rewrite-html');
    }
    applyPerfDelay(runtimeContext, 'rewriteHtml');
    return rewriteHtmlWithElements(html, replacements);
  }));
  recordResult(results, 'rewrite-html', rewriteHtmlResult);

  const processedHtml = rewriteHtmlResult.ok ? rewriteHtmlResult.value : html;
  const processedWithVersionComment = rewriteHtmlResult.ok
    ? tagHtmlWithRulesVersion(processedHtml, getCurrentRulesVersion(runtimeContext.config))
    : processedHtml;

  const times = perfTracker.getTimes();
  const performanceResult = safeTry(() => {
    const limits = runtimeContext.config?.performanceLimits || {};
    if (isExecutionTooSlow(times, limits)) {
      const error = new Error('Performance limits exceeded');
      error.times = times;
      throw error;
    }
    return times;
  });
  recordResult(results, 'performance', performanceResult);

  return { processedHtml: processedWithVersionComment, results };
}

function processHtmlForWhatsappCtas(html, context) {
  return processHtmlForWhatsappCtasWithResults(html, context).processedHtml;
}

module.exports = {
  identifyWhatsappElements,
  buildWhatsappUrlForElement,
  injectHrefIntoElement,
  rewriteHtmlWithElements,
  processHtmlForWhatsappCtas,
  processHtmlForWhatsappCtasWithResults,
};
