module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@core': './src/core',
            '@shared': './src/shared',
            '@features': './src/features',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
