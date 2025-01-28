/* eslint-disable */
import path from 'node:path';

export default {
  test: {
    globals: true,
    overage: {
      provider: 'v8',
      reporter: ['html'],
      eportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
};
