// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, { isCSSEnabled: true });
config.resolver.sourceExts.push("cjs")

module.exports = withNativeWind(config, { input: "./global.css" });
// module.exports = config;

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web') {
        // The alias will only be used when bundling for the web.
        return context.resolveRequest(context, ALIASES[moduleName] ?? moduleName, platform);
    }
    // Ensure you call the default resolver.
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
// module.exports = config;
