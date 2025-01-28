/* eslint-disable */
import path from 'node:path';

export default {
  test: {
    // exclude: ['**/config/**'],
    include: [
      'src/**/*.spec.ts',
      'tests/**/*.spec.ts',
      'src/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
    globals: true,
    overage: {
      provider: 'v8',
      reporter: ['html'],
      eportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
};
