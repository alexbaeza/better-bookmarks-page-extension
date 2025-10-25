/// <reference types="vitest" />
/// <reference types="vite/client" />

import { copyFileSync } from 'fs';
import { URL, fileURLToPath } from 'node:url';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { codecovVitePlugin } from '@codecov/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      writeBundle() {
        // Copy Firefox manifest
        copyFileSync(resolve(__dirname, 'public/manifest-firefox.json'), resolve(__dirname, 'build/manifest-firefox.json'));
      },
    },
    // Put the Codecov vite plugin after all other plugins
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'better-bookmarks-page-extension',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~test': fileURLToPath(new URL('./test/unit', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/unit/setup.ts'],
    css: true,

    include: ['test/unit/**/*.test.{ts,tsx}'],
    exclude: [
      'coverage/**',
      'dist/**',
      '**/node_modules/**',
      '**/[.]**',
      '**/*.d.ts',
      '**/virtual:*',
      '**/__x00__*',
      'cypress/**',
      '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
      '*.config.js',
    ],

    // Test isolation and threading
    isolate: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        maxThreads: 1,
      },
    },

    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,

    // Performance monitoring
    slowTestThreshold: 100, // Flag tests taking >100ms
    reporters: ['verbose'], // Show timing info

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './test/coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/app/entrypoints/react-app-env.d.ts',
        'src/app/entrypoints/types.d.tsx',
        'src/app/entrypoints/reportWebVitals.ts',
        'src/styles/**',
        'src/assets/**',
      ],
      thresholds: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    port: 3000,
  },
});
