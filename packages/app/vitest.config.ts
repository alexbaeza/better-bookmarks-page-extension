import { defineConfig } from 'vitest/config';

/// <reference types="vitest" />
export default defineConfig((config) => {
  // Environment-aware thread configuration
  // CI: limited threads to prevent memory issues in shared environments
  // Local: more threads for better performance
  const isCI = process.env.CI === 'true';
  const threadCount = isCI ? 2 : 4; // Conservative static values

  return {
    ...config,
    resolve: {
      alias: {
        '@/': new URL('./src/', import.meta.url).pathname,
        '~test': new URL('./test/unit', import.meta.url).pathname,
      },
    },
    test: {
      // Coverage configuration
      coverage: {
        exclude: [
          // Default-style exclusions and non-runtime files
          'src/**/*.d.ts',
          'src/**/*.test.{ts,tsx}',
          'src/**/*.spec.{ts,tsx}',
          'src/styles/**',
          'src/assets/**',
          'src/app/entrypoints/index.tsx',
          'src/features/bookmarks/lib/browser/types.ts',
          // Mock data and test utilities
          'src/**/mock-data*.{ts,tsx}',
          'src/**/mock-browser-api.ts',
          'src/features/bookmarks/store/mock-data.ts',
        ],
        include: ['src/**/*.{ts,tsx}'],
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './test/coverage',
        thresholds: {
          global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
          },
          // Per-file thresholds for core classes - enforce 100% coverage
          'src/features/bookmarks/lib/ordering-service.ts': {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
          },
          'src/features/bookmarks/lib/browser/api/firefox-api.ts': {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
          },
          'src/features/bookmarks/lib/browser/api/chrome-api.ts': {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
          },
          'src/features/bookmarks/lib/favicon-cache.ts': {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
          },
        },
      },
      css: true,
      environment: 'happy-dom',
      exclude: [
        'coverage/**',
        'dist/**',
        '**/node_modules/**',
        '**/[.]**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__x00__*',
        'cypress/**',
        '**/.{eslint,mocha,prettier}rc.{?(c)mjs,yml}',
        '*.config.js',
      ],
      globals: true,
      hookTimeout: 2000,
      include: ['test/unit/**/*.test.{ts,tsx}'],

      // Test isolation and threading
      isolate: true,
      setupFiles: ['./test/unit/setup.ts'],

      // Dynamic thread configuration for optimal performance
      // Uses threads pool (default) with environment-aware thread count
      threads: threadCount,

      // Performance monitoring
      slowTestThreshold: 200, // Flag tests taking >200ms
      teardownTimeout: 1000,

      // Timeouts
      testTimeout: 2000,
    },
  };
});
