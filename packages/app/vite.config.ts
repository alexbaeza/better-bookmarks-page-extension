/// <reference types="vite/client" />
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
// biome-ignore lint/correctness/noUndeclaredDependencies: Optional dev dependency
import { codecovVitePlugin } from '@codecov/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      input: './index.html',
    },
    sourcemap: true,
  },
  plugins: [
    react({
      jsxImportSource: 'react',
      jsxRuntime: 'automatic',
    }),
    {
      name: 'copy-files',
      writeBundle() {
        // Copy Firefox manifest
        copyFileSync(resolve(__dirname, 'public/manifest-firefox.json'), resolve(__dirname, 'build/manifest-firefox.json'));
      },
    },
    // Put the Codecov vite plugin after all other plugins
    codecovVitePlugin({
      bundleName: 'better-bookmarks-page-extension',
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '~test': new URL('./test/unit', import.meta.url).pathname,
    },
  },
  server: {
    port: 3000,
  },
});
