module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          allowUndefined: true,
          safe: false,
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
      "expo-router/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
