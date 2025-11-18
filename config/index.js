const defaultNumbers = [
  "+5585926407132",
  "+5511962734805",
  "+5548985173026",
  "+5571996458320",
];

const defaultMessages = [
  "orbital-lynx-river",
  "solar-harbor-lumen",
  "jade-thunder-falcon",
  "polar-metric-kite",
  "ultra-cascade-fjord",
  "nova-saffron-echo",
  "zenith-pulse-quartz",
  "ember-spiral-harvest",
  "flux-auburn-stellar",
  "myriad-cyber-willow",
  "pixel-wander-trident",
  "spectra-mantle-bloom",
  "crimson-hollow-surge",
  "lunar-vortex-plume",
  "velvet-glimmer-axis",
  "sonic-bonsai-vector",
];

const defaultGroups = {
  comercial: {
    numbers: ["+551134567891", "+5511988889123"],
    messages: ["alpha-ignite-pulse", "ember-spire-nova"],
  },
  suporte: {
    numbers: ["+554730019287", "+5547999990123"],
    messages: ["calm-orbit-sage", "azure-balance-halo"],
  },
};

module.exports = {
  architectureVersion: "0.1.0",
  numbers: defaultNumbers,
  messages: defaultMessages,
  selection: {
    numbers: "random",
    messages: "random",
  },
  groups: defaultGroups,
  telegramBotToken: "",
  telegramChatId: "",
  rulesVersion: "1.0.0",
  supportedVersions: ["1.0.0"],
  versionedRules: {
    "1.0.0": {
      numbers: defaultNumbers,
      messages: defaultMessages,
      groups: defaultGroups,
    },
  },
  performanceLimits: {
    identifyCtas: 5,
    selectNumber: 5,
    selectMessage: 5,
    buildUrl: 5,
    rewriteElement: 5,
    rewriteHtml: 10,
    total: 40,
  },
  debugMode: false,
};
