const defaultConfig = require('../../config');

function createContext(initial = {}) {
  const { config, ...rest } = initial;
  return {
    ...rest,
    config: config || defaultConfig,
  };
}

module.exports = { createContext };
