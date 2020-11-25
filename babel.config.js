module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          'test-utils': './tests/utils',
          'mock-events': './tests/mocks/events.ts',
        },
      },
    ],
  ],
};
