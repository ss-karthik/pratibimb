const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add this resolver configuration
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("react-server-dom-webpack/client")) {
    return {
      filePath: require.resolve("./empty-module.js"),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
