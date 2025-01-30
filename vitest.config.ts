import path from 'node:path';

export default {
  test: {
    include: [
      'src/**/*.spec.ts',
      'tests/**/*.spec.ts',
      'src/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
    exclude: ['src/config/**'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['html'],
      eportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
      exclude: ['src/config/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
};
