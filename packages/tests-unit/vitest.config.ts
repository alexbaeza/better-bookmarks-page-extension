import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test-utils.tsx',
        'src/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mocks/**',
        '**/reportWebVitals.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../app/src'),
      '@shared': path.resolve(__dirname, '../app/src/shared'),
      '@features': path.resolve(__dirname, '../app/src/features'),
      '@app': path.resolve(__dirname, '../app/src/app'),
      '~test': path.resolve(__dirname, 'src')
    }
  }
});
