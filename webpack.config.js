const { resolve } = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@app/shared': resolve(__dirname, './libs/shared/src/.'),
      '@app/utils': resolve(__dirname, './libs/shared/utils/.'),
      '@file/core': resolve(__dirname, './fileHub/src/core/'),
    },
    fallback: {
      express: require.resolve('express'),
      sharp: require.resolve('sharp'),
      // 'sharp/package.json': require.resolve('sharp/package.json'),
    },
  },
};
