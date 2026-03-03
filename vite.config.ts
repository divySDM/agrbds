import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/agrbds/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'ES2020',
  },
  test: {
    exclude: ['tests/browser/**', 'node_modules/**'],
  },
});
