function getGroupLists(groupName, config) {
  const fallback = {
    numbers: Array.isArray(config?.numbers) ? config.numbers : [],
    messages: Array.isArray(config?.messages) ? config.messages : [],
  };

  if (!groupName) {
    return fallback;
  }

  const groupConfig = config?.groups?.[groupName];
  if (!groupConfig) {
    return fallback;
  }

  return {
    numbers: Array.isArray(groupConfig.numbers) && groupConfig.numbers.length
      ? groupConfig.numbers
      : fallback.numbers,
    messages: Array.isArray(groupConfig.messages) && groupConfig.messages.length
      ? groupConfig.messages
      : fallback.messages,
  };
}

module.exports = { getGroupLists };
