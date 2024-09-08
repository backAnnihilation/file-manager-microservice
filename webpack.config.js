const { resolve } = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@shared': resolve(__dirname, './libs/shared/'),
      '@models': resolve(__dirname, './libs/shared/models/'),
      '@user/core': resolve(__dirname, './apps/user/src/core/'),
      '@file/core': resolve(__dirname, './apps/fileHub/src/core/'),
    },
    fallback: {
      express: require.resolve('express'),
      sharp: require.resolve('sharp'),
      // 'sharp/package.json': require.resolve('sharp/package.json'),
    },
  },
};
