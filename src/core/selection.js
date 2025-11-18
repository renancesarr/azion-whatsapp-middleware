const DEFAULT_STRATEGY = 'random';

function ensureList(list) {
  return Array.isArray(list) ? list.filter((item) => item !== undefined && item !== null) : [];
}

function randomItem(list, randomFn = Math.random) {
  if (!list.length) {
    return null;
  }
  const index = Math.floor(randomFn() * list.length);
  return list[index];
}

function selectItem(listInput, strategy = DEFAULT_STRATEGY, options = {}) {
  const list = ensureList(listInput);
  if (!list.length) {
    return null;
  }
  const randomFn = typeof options.randomFn === 'function' ? options.randomFn : Math.random;
  if (strategy === 'random' || !strategy) {
    return randomItem(list, randomFn);
  }
  // Estratégias futuras podem ser plugadas aqui; por enquanto caímos no primeiro item.
  return list[0];
}

const encodeCache = new Map();

function encodeMessage(message = '') {
  if (process.env.DISABLE_PERF_CACHE === '1') {
    return encodeURIComponent(message);
  }
  if (encodeCache.has(message)) {
    return encodeCache.get(message);
  }
  const encoded = encodeURIComponent(message);
  encodeCache.set(message, encoded);
  return encoded;
}

function __clearEncodeCache() {
  encodeCache.clear();
}

function sanitizeNumber(number = '') {
  return String(number).replace(/[^0-9]/g, '');
}

module.exports = {
  selectItem,
  encodeMessage,
  sanitizeNumber,
  __clearEncodeCache,
};
